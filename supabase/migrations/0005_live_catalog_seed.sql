-- Mirror the approved live Stripe catalog for operational reporting.

insert into products (slug, name, type, status, metadata) values
  ('curls-and-contemplation', 'Curls & Contemplation', 'one_time', 'active', '{"stripe_product_id":"prod_Uo28fdoQ30EISx"}'),
  ('companion-workbook', 'Idea-to-Action Workbook', 'one_time', 'active', '{"stripe_product_id":"prod_Uo28Sb5ySNs0B3"}'),
  ('daily-directives-bundle', 'Daily Directives — Complete 12-Set Digital Bundle', 'one_time', 'active', '{"stripe_product_id":"prod_Uo28Ua6BCWbVQF"}'),
  ('daily-directives-set-01', 'Daily Directives — Set 01: Permission to Begin', 'one_time', 'active', '{"stripe_product_id":"prod_Us6SGzTbd4NrVb"}'),
  ('daily-directives-set-02', 'Daily Directives — Set 02: The Discipline of Showing Up', 'one_time', 'active', '{"stripe_product_id":"prod_Us6SpFsMxZw8Ju"}'),
  ('daily-directives-set-03', 'Daily Directives — Set 03: Visible on Purpose', 'one_time', 'active', '{"stripe_product_id":"prod_Us6S2vDkLtMNXa"}'),
  ('daily-directives-set-04', 'Daily Directives — Set 04: The Price of Your Gifts', 'one_time', 'active', '{"stripe_product_id":"prod_Us6SJsrJsddzcI"}'),
  ('daily-directives-set-05', 'Daily Directives — Set 05: Boundaries Build the Brand', 'one_time', 'active', '{"stripe_product_id":"prod_Us6SPbGA8HyVdl"}'),
  ('daily-directives-set-06', 'Daily Directives — Set 06: Creative Recovery', 'one_time', 'active', '{"stripe_product_id":"prod_Us6ThL2I2y73oI"}'),
  ('daily-directives-set-07', 'Daily Directives — Set 07: Trust Your Taste', 'one_time', 'active', '{"stripe_product_id":"prod_Us6Ti3rjhA3RZk"}'),
  ('daily-directives-set-08', 'Daily Directives — Set 08: Rooms I Belong In', 'one_time', 'active', '{"stripe_product_id":"prod_Us6SoSnc6PKMyE"}'),
  ('daily-directives-set-09', 'Daily Directives — Set 09: The Courage to Pivot', 'one_time', 'active', '{"stripe_product_id":"prod_Us6Tt91B0vCHD8"}'),
  ('daily-directives-set-10', 'Daily Directives — Set 10: Built from Evidence', 'one_time', 'active', '{"stripe_product_id":"prod_Us6TNzETLjwUM9"}'),
  ('daily-directives-set-11', 'Daily Directives — Set 11: Legacy in Motion', 'one_time', 'active', '{"stripe_product_id":"prod_Us6TQxYVKbzeP7"}'),
  ('daily-directives-set-12', 'Daily Directives — Set 12: The Version I’m Becoming', 'one_time', 'active', '{"stripe_product_id":"prod_Us6TcsW1Swp83x"}')
on conflict (slug) do update set
  name = excluded.name,
  type = excluded.type,
  status = excluded.status,
  metadata = excluded.metadata;

insert into prices (product_id, stripe_price_id, nickname, amount_cents, currency, active)
select p.id, v.stripe_price_id, v.nickname, v.amount_cents, 'usd', true
from (values
  ('curls-and-contemplation', 'price_1ToQ4BBOxLp64xG9mG2dFSsf', 'Book — Preorder ($17.99)', 1799),
  ('curls-and-contemplation', 'price_1TrNBhBOxLp64xG9IjkIvgxk', 'Book — Regular ($19.99)', 1999),
  ('companion-workbook', 'price_1ToQ4OBOxLp64xG9vEvykPlw', 'Workbook ($19.99)', 1999),
  ('daily-directives-bundle', 'price_1TsMHLBOxLp64xG9ld3KhLXm', 'Complete bundle ($59)', 5900),
  ('daily-directives-set-01', 'price_1TsMHSBOxLp64xG9G7autXy9', 'Set 01 ($7.99)', 799),
  ('daily-directives-set-02', 'price_1TsMHZBOxLp64xG9nNtYQmoH', 'Set 02 ($7.99)', 799),
  ('daily-directives-set-03', 'price_1TsMHgBOxLp64xG9iFZBVATE', 'Set 03 ($7.99)', 799),
  ('daily-directives-set-04', 'price_1TsMHnBOxLp64xG9DO7jMya7', 'Set 04 ($7.99)', 799),
  ('daily-directives-set-05', 'price_1TsMHuBOxLp64xG9qAIQ7ADG', 'Set 05 ($7.99)', 799),
  ('daily-directives-set-06', 'price_1TsMI0BOxLp64xG9mlNeFhyn', 'Set 06 ($7.99)', 799),
  ('daily-directives-set-07', 'price_1TsMI8BOxLp64xG9v2jDAqAL', 'Set 07 ($7.99)', 799),
  ('daily-directives-set-08', 'price_1TsMIEBOxLp64xG9TdGdQeDA', 'Set 08 ($7.99)', 799),
  ('daily-directives-set-09', 'price_1TsMIKBOxLp64xG9jgkUJnxn', 'Set 09 ($7.99)', 799),
  ('daily-directives-set-10', 'price_1TsMIeBOxLp64xG9mhE0RApF', 'Set 10 ($7.99)', 799),
  ('daily-directives-set-11', 'price_1TsMIRBOxLp64xG93zQOLoJf', 'Set 11 ($7.99)', 799),
  ('daily-directives-set-12', 'price_1TsMIYBOxLp64xG9lMLQcZMq', 'Set 12 ($7.99)', 799)
) as v(product_slug, stripe_price_id, nickname, amount_cents)
join products p on p.slug = v.product_slug
on conflict (stripe_price_id) do update set
  product_id = excluded.product_id,
  nickname = excluded.nickname,
  amount_cents = excluded.amount_cents,
  currency = excluded.currency,
  active = excluded.active;
