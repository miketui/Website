-- Production replacement project hardening for curlscontemplation.beauty.
-- Public forms write through server-side service credentials only. RLS remains
-- enabled with no anonymous table-write policies.

create schema if not exists private;

alter table subscribers
  add column if not exists first_name text,
  add column if not exists professional_role text,
  add column if not exists career_stage text,
  add column if not exists interests text[] not null default '{}',
  add column if not exists marketing_consent boolean not null default false,
  add column if not exists marketing_consent_at timestamptz,
  add column if not exists consent_source text,
  add column if not exists last_seen_at timestamptz;

drop policy if exists subscribers_insert_public_safe on subscribers;

create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  intent text not null check (intent in ('press','partnership','support','other')),
  message text not null,
  status text not null default 'new' check (status in ('new','in_progress','resolved','spam')),
  provider_message_id text,
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists quiz_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  archetype text not null,
  marketing_consent boolean not null default false,
  source text not null default 'quiz',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (email)
);

create table if not exists feedback_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  relationship text not null check (relationship in ('reader','customer','stylist','partner','other')),
  rating integer check (rating between 1 and 5),
  reflection text not null,
  permission_to_feature boolean not null default false,
  status text not null default 'new' check (status in ('new','reviewed','approved','declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table contact_submissions enable row level security;
alter table quiz_leads enable row level security;
alter table feedback_submissions enable row level security;

create index if not exists contact_submissions_status_created_idx on contact_submissions (status, created_at desc);
create index if not exists quiz_leads_archetype_created_idx on quiz_leads (archetype, created_at desc);
create index if not exists feedback_submissions_status_created_idx on feedback_submissions (status, created_at desc);

-- A profile row is created after Auth signup without trusting user metadata for
-- authorization. The function lives outside the exposed public schema and is
-- not directly executable by client roles.
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, nullif(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    updated_at = now();
  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update of email on auth.users
  for each row execute function private.handle_new_user();

-- Correct storage destinations. Paid files stay private and are served only by
-- signed URLs after an active entitlement check. Public lead magnets are PDFs.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('curls-free', 'curls-free', true, 10485760, array['application/pdf']),
  ('curls-deliverables', 'curls-deliverables', false, 104857600, array['application/pdf','application/zip','application/epub+zip'])
on conflict (id) do update set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public buckets do not need a storage.objects SELECT policy. No INSERT,
-- UPDATE, or DELETE policies are created; uploads require server credentials.
