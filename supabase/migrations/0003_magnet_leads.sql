-- Funnel 1 lead magnet tracking: activates a table that previously had zero code references.
-- Used by /api/free-chapter to append one row per claim.

create table if not exists magnet_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  magnet_slug text not null,
  delivered_at timestamptz,
  created_at timestamptz default now()
);

alter table magnet_leads enable row level security;

-- Only service role can insert rows. Clients cannot read this table.
-- There are no public read or write policies on purpose.
