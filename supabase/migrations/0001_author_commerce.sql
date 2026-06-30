-- Author commerce scaffold for Curls & Contemplation.
-- Prompt 5 hardening: private downloads, sandbox commerce, RLS, admin gates, analytics, and subscription-ready schema placeholders.
create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  type text not null default 'one_time' check (type in ('one_time','subscription')),
  status text default 'draft' check (status in ('draft','active','archived')),
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists prices (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  stripe_price_id text unique,
  nickname text,
  amount_cents integer not null,
  currency text default 'usd',
  interval text check (interval is null or interval in ('month','year')),
  active boolean default false,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  email text,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  status text default 'pending' check (status in ('pending','paid','failed','refunded','expired')),
  amount_cents integer,
  currency text default 'usd',
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  email text,
  order_id uuid unique references orders(id),
  book_slug text not null,
  status text default 'active' check (status in ('active','refunded','canceled','past_due','revoked')),
  entitlement_status text default 'active',
  download_count integer default 0,
  refunded_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists download_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  purchase_id uuid references purchases(id),
  deliverable_slug text not null,
  token_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists download_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  purchase_id uuid references purchases(id),
  deliverable_slug text,
  event_type text not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists bonus_claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  email text not null,
  status text default 'started' check (status in ('started','submitted','approved','rejected','fulfilled')),
  note text,
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  status text default 'active',
  source text,
  consent_state jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists subscriber_events (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid references subscribers(id),
  email text,
  event_type text not null,
  provider text,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists consent_log (
  id uuid primary key default gen_random_uuid(),
  email text,
  user_id uuid references auth.users(id),
  consent_state jsonb default '{}',
  ip_hash text,
  created_at timestamptz default now()
);

create table if not exists webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_event_id text unique not null,
  event_type text not null,
  payload jsonb default '{}',
  processed_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  anonymous_id text,
  event_name text not null,
  route text,
  source text,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists gate_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  gate_name text not null,
  decision text not null,
  reason text,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id),
  email text unique not null,
  role text default 'admin' check (role in ('admin','owner','support')),
  created_at timestamptz default now()
);

-- Subscription-ready placeholders only. No v1 live subscription offer is created or advertised.
create table if not exists memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  status text default 'placeholder' check (status in ('placeholder','active','past_due','canceled')),
  stripe_subscription_id text,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists membership_events (
  id uuid primary key default gen_random_uuid(),
  membership_id uuid references memberships(id),
  event_type text not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table products enable row level security;
alter table prices enable row level security;
alter table orders enable row level security;
alter table purchases enable row level security;
alter table download_tokens enable row level security;
alter table download_events enable row level security;
alter table bonus_claims enable row level security;
alter table subscribers enable row level security;
alter table subscriber_events enable row level security;
alter table consent_log enable row level security;
alter table webhook_events enable row level security;
alter table analytics_events enable row level security;
alter table gate_ledger enable row level security;
alter table admin_users enable row level security;
alter table memberships enable row level security;
alter table membership_events enable row level security;

-- Users can read and maintain only their own profile.
drop policy if exists profiles_select_own on profiles;
create policy profiles_select_own on profiles for select using (auth.uid() = id);
drop policy if exists profiles_update_own on profiles;
create policy profiles_update_own on profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- Products/prices are public catalog scaffolds, but only active rows are readable anonymously.
drop policy if exists products_select_active on products;
create policy products_select_active on products for select using (status = 'active');
drop policy if exists prices_select_active on prices;
create policy prices_select_active on prices for select using (active = true);

-- No public read of orders; customers can read only their own order rows.
drop policy if exists orders_select_own on orders;
create policy orders_select_own on orders for select using (auth.uid() = user_id);

-- Customers can read their own purchases only; service-role webhook code writes and revokes.
drop policy if exists purchases_select_own on purchases;
create policy purchases_select_own on purchases for select using (auth.uid() = user_id);

-- Customers can read token metadata for their own signed download records, never token hashes for other users.
drop policy if exists download_tokens_select_own_metadata on download_tokens;
create policy download_tokens_select_own_metadata on download_tokens for select using (auth.uid() = user_id);
drop policy if exists download_events_select_own on download_events;
create policy download_events_select_own on download_events for select using (auth.uid() = user_id);

-- Bonus claims may be created by authenticated users for themselves and read/updated only by the owner.
drop policy if exists bonus_claims_select_own on bonus_claims;
create policy bonus_claims_select_own on bonus_claims for select using (auth.uid() = user_id);
drop policy if exists bonus_claims_insert_own on bonus_claims;
create policy bonus_claims_insert_own on bonus_claims for insert with check (auth.uid() = user_id or user_id is null);
drop policy if exists bonus_claims_update_own on bonus_claims;
create policy bonus_claims_update_own on bonus_claims for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Subscriber form inserts are intentionally narrow; public clients can only insert minimal subscription rows.
drop policy if exists subscribers_insert_public_safe on subscribers;
create policy subscribers_insert_public_safe on subscribers for insert with check (email is not null and status = 'active');

-- Users can read their own consent log rows; service role records anonymous/server operational events.
drop policy if exists consent_log_select_own on consent_log;
create policy consent_log_select_own on consent_log for select using (auth.uid() = user_id);

-- Internal analytics, webhook, subscriber events, gate ledger, admin rows, and memberships are not publicly readable.
-- Service-role writes bypass RLS for Stripe webhooks, order creation, entitlement revocation, download signing, MailerLite/Resend intents, and analytics inserts.

-- Admin policies use the admin_users table. App code also supports an ADMIN_EMAILS allowlist before exposing admin surfaces.
drop policy if exists admin_users_select_self on admin_users;
create policy admin_users_select_self on admin_users for select using (auth.uid() = user_id);
drop policy if exists admin_read_orders on orders;
create policy admin_read_orders on orders for select using (exists (select 1 from admin_users where admin_users.user_id = auth.uid()));
drop policy if exists admin_read_purchases on purchases;
create policy admin_read_purchases on purchases for select using (exists (select 1 from admin_users where admin_users.user_id = auth.uid()));
drop policy if exists admin_read_subscribers on subscribers;
create policy admin_read_subscribers on subscribers for select using (exists (select 1 from admin_users where admin_users.user_id = auth.uid()));
drop policy if exists admin_read_claims on bonus_claims;
create policy admin_read_claims on bonus_claims for select using (exists (select 1 from admin_users where admin_users.user_id = auth.uid()));

-- Membership placeholders remain customer-private and inactive for v1.
drop policy if exists memberships_select_own_placeholder on memberships;
create policy memberships_select_own_placeholder on memberships for select using (auth.uid() = user_id);

-- Storage note: create a private Supabase Storage bucket named "curls-deliverables". Do not add public read policies.
-- Server routes should create short-lived signed URLs only after purchases.status = 'active' and download limits pass.
