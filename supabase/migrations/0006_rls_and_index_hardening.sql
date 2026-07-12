-- Advisor follow-up: scope policies to their intended roles, avoid per-row
-- auth function re-evaluation, consolidate overlapping SELECT policies, and
-- index foreign keys used by customer/admin lookups.

drop policy if exists profiles_select_own on profiles;
create policy profiles_select_own on profiles for select to authenticated
using ((select auth.uid()) = id);
drop policy if exists profiles_update_own on profiles;
create policy profiles_update_own on profiles for update to authenticated
using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists products_select_active on products;
create policy products_select_active on products for select to anon, authenticated
using (status = 'active');
drop policy if exists prices_select_active on prices;
create policy prices_select_active on prices for select to anon, authenticated
using (active = true);

drop policy if exists orders_select_own on orders;
drop policy if exists admin_read_orders on orders;
create policy orders_select_own_or_admin on orders for select to authenticated
using (
  (select auth.uid()) = user_id
  or exists (select 1 from admin_users where admin_users.user_id = (select auth.uid()))
);

drop policy if exists purchases_select_own on purchases;
drop policy if exists admin_read_purchases on purchases;
create policy purchases_select_own_or_admin on purchases for select to authenticated
using (
  (select auth.uid()) = user_id
  or exists (select 1 from admin_users where admin_users.user_id = (select auth.uid()))
);

drop policy if exists download_tokens_select_own_metadata on download_tokens;
create policy download_tokens_select_own_metadata on download_tokens for select to authenticated
using ((select auth.uid()) = user_id);
drop policy if exists download_events_select_own on download_events;
create policy download_events_select_own on download_events for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists bonus_claims_select_own on bonus_claims;
drop policy if exists admin_read_claims on bonus_claims;
create policy bonus_claims_select_own_or_admin on bonus_claims for select to authenticated
using (
  (select auth.uid()) = user_id
  or exists (select 1 from admin_users where admin_users.user_id = (select auth.uid()))
);
drop policy if exists bonus_claims_insert_own on bonus_claims;
create policy bonus_claims_insert_own on bonus_claims for insert to authenticated
with check ((select auth.uid()) = user_id);
drop policy if exists bonus_claims_update_own on bonus_claims;
create policy bonus_claims_update_own on bonus_claims for update to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists consent_log_select_own on consent_log;
create policy consent_log_select_own on consent_log for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists admin_users_select_self on admin_users;
create policy admin_users_select_self on admin_users for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists admin_read_subscribers on subscribers;
create policy admin_read_subscribers on subscribers for select to authenticated
using (exists (select 1 from admin_users where admin_users.user_id = (select auth.uid())));

drop policy if exists memberships_select_own_placeholder on memberships;
create policy memberships_select_own_placeholder on memberships for select to authenticated
using ((select auth.uid()) = user_id);

create index if not exists prices_product_id_idx on prices(product_id);
create index if not exists orders_user_id_idx on orders(user_id);
create index if not exists purchases_user_id_idx on purchases(user_id);
create index if not exists download_tokens_user_id_idx on download_tokens(user_id);
create index if not exists download_tokens_purchase_id_idx on download_tokens(purchase_id);
create index if not exists download_events_user_id_idx on download_events(user_id);
create index if not exists download_events_purchase_id_idx on download_events(purchase_id);
create index if not exists bonus_claims_user_id_idx on bonus_claims(user_id);
create index if not exists subscriber_events_subscriber_id_idx on subscriber_events(subscriber_id);
create index if not exists consent_log_user_id_idx on consent_log(user_id);
create index if not exists analytics_events_user_id_idx on analytics_events(user_id);
create index if not exists gate_ledger_user_id_idx on gate_ledger(user_id);
create index if not exists memberships_user_id_idx on memberships(user_id);
create index if not exists membership_events_membership_id_idx on membership_events(membership_id);
create index if not exists feedback_submissions_user_id_idx on feedback_submissions(user_id);
