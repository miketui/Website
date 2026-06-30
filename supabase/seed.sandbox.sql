-- Prompt 6 sandbox-only seed data for Curls & Contemplation author-site.
-- Safe placeholders only: no real customer PII, no production data, no live Stripe IDs.
-- Replace test Stripe price placeholders in the Supabase sandbox only after creating Stripe test-mode prices.
-- Optional admin seed idea: insert a sandbox-only admin email such as admin@example.test after Michael approves the test account.

insert into products (slug, name, type, status, metadata)
values
  (
    'curls-direct-preorder-sandbox',
    'Curls & Contemplation — Direct Preorder (Sandbox)',
    'one_time',
    'active',
    '{"book_slug":"curls-and-contemplation","environment":"sandbox","launch_mode":"preorder"}'::jsonb
  ),
  (
    'curls-direct-regular-sandbox',
    'Curls & Contemplation — Direct Regular Edition (Sandbox)',
    'one_time',
    'active',
    '{"book_slug":"curls-and-contemplation","environment":"sandbox","launch_mode":"launched"}'::jsonb
  )
on conflict (slug) do update
set name = excluded.name,
    type = excluded.type,
    status = excluded.status,
    metadata = excluded.metadata;

insert into prices (product_id, stripe_price_id, nickname, amount_cents, currency, interval, active)
select id, 'price_test_replace_preorder_1799', 'Sandbox preorder direct ebook', 1799, 'usd', null, true
from products
where slug = 'curls-direct-preorder-sandbox'
on conflict (stripe_price_id) do update
set amount_cents = excluded.amount_cents,
    currency = excluded.currency,
    nickname = excluded.nickname,
    active = excluded.active;

insert into prices (product_id, stripe_price_id, nickname, amount_cents, currency, interval, active)
select id, 'price_test_replace_regular_1999', 'Sandbox regular direct ebook', 1999, 'usd', null, true
from products
where slug = 'curls-direct-regular-sandbox'
on conflict (stripe_price_id) do update
set amount_cents = excluded.amount_cents,
    currency = excluded.currency,
    nickname = excluded.nickname,
    active = excluded.active;
