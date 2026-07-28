-- Atomic enforcement of the "3 downloads per 7 days" entitlement rule.
--
-- The application previously enforced neither half of that sentence:
--
--   1. It compared purchases.download_count — a LIFETIME counter that is never
--      reset — against the cap, so the seven-day window did not exist. A buyer
--      who used three downloads in year one was refused forever, and
--      DOWNLOAD_WINDOW_DAYS was only ever written into event metadata.
--   2. It read the count, then wrote count + 1 in a separate statement. Two
--      concurrent requests both read 2, both wrote 3, and both handed out a
--      signed URL — so the cap could be exceeded and increments lost.
--
-- Both are fixed by doing the whole decision inside one function: a plpgsql
-- function body is a single transaction, and `for update` serializes callers
-- competing for the same purchase row.

create or replace function public.claim_download_slot(
  p_purchase_id uuid,
  p_user_id uuid,
  p_deliverable_slug text,
  p_cap integer,
  p_window_days integer
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_purchase purchases%rowtype;
  v_status text;
  v_used integer;
  v_event_id uuid;
begin
  -- Row lock: concurrent claims on the same purchase queue here rather than
  -- racing between the count and the insert below.
  select * into v_purchase from purchases where id = p_purchase_id for update;
  if not found then
    return jsonb_build_object('allowed', false, 'reason', 'no_purchase');
  end if;

  v_status := coalesce(v_purchase.status, v_purchase.entitlement_status);
  if v_purchase.refunded_at is not null or v_status = 'refunded' then
    return jsonb_build_object('allowed', false, 'reason', 'refunded');
  end if;
  if v_purchase.revoked_at is not null or v_status in ('revoked', 'canceled', 'past_due') then
    return jsonb_build_object('allowed', false, 'reason', 'revoked');
  end if;

  -- The actual window. Counts issued signed URLs, not attempts.
  select count(*) into v_used
  from download_events
  where purchase_id = p_purchase_id
    and event_type = 'download_signed_url_created'
    and created_at >= now() - make_interval(days => p_window_days);

  if v_used >= p_cap then
    return jsonb_build_object(
      'allowed', false,
      'reason', 'download_limit_reached',
      'used', v_used,
      'cap', p_cap
    );
  end if;

  insert into download_events (user_id, purchase_id, deliverable_slug, event_type, metadata)
  values (
    p_user_id,
    p_purchase_id,
    p_deliverable_slug,
    'download_signed_url_created',
    jsonb_build_object('cap', p_cap, 'window_days', p_window_days)
  )
  returning id into v_event_id;

  -- Kept for display and for the legacy lifetime figure; no longer the thing
  -- the cap is enforced against.
  update purchases
     set download_count = coalesce(download_count, 0) + 1,
         updated_at = now()
   where id = p_purchase_id;

  return jsonb_build_object(
    'allowed', true,
    'used', v_used + 1,
    'cap', p_cap,
    'remaining', greatest(p_cap - (v_used + 1), 0),
    'event_id', v_event_id
  );
end;
$$;

-- Compensating action. The slot is claimed before the signed URL is minted so
-- the cap is race-free; if minting then fails, the buyer must not be charged a
-- download they never received.
create or replace function public.release_download_slot(p_event_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_purchase_id uuid;
begin
  delete from download_events where id = p_event_id returning purchase_id into v_purchase_id;
  if v_purchase_id is not null then
    update purchases
       set download_count = greatest(coalesce(download_count, 0) - 1, 0),
           updated_at = now()
     where id = v_purchase_id;
  end if;
end;
$$;

-- Makes the windowed count an index lookup rather than a scan of every
-- download this purchase has ever produced.
create index if not exists download_events_purchase_created_idx
  on download_events (purchase_id, event_type, created_at desc);

-- These run with the service role from server routes only. Entitlement checks
-- happen before the call; revoke the default public grant so the functions are
-- not callable directly by anon/authenticated clients.
revoke all on function public.claim_download_slot(uuid, uuid, text, integer, integer) from public, anon, authenticated;
revoke all on function public.release_download_slot(uuid) from public, anon, authenticated;
grant execute on function public.claim_download_slot(uuid, uuid, text, integer, integer) to service_role;
grant execute on function public.release_download_slot(uuid) to service_role;
