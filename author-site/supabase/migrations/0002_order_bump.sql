-- Funnel 1 order bump: one order can now carry multiple entitlements
-- (book + affirmation card deck), keyed by (order_id, book_slug).

alter table purchases drop constraint if exists purchases_order_id_key;
alter table purchases add constraint purchases_order_book_unique unique (order_id, book_slug);
