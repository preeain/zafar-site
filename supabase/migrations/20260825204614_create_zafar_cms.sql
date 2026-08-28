-- Zafar Sandhu CMS. This project is intentionally isolated from every other
-- artist application. Public visitors may read only the published snapshot;
-- every mutation is performed by authenticated server actions after the
-- ADMIN_EMAILS allowlist check.

create extension if not exists pgcrypto;

create table if not exists public.site_content (
  id text primary key default 'zafar' check (id = 'zafar'),
  draft jsonb not null default '{}'::jsonb,
  published jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  city text not null default '',
  consented_at timestamptz not null default now(),
  consent_version text not null default '2026-08-28',
  source text not null default 'zafarsandhu.com',
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint subscribers_email_normalized check (email = lower(trim(email)))
);
create table if not exists public.admin_audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  actor_email text not null,
  action text not null check (action in ('save_draft', 'publish', 'upload', 'unsubscribe')),
  entity text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
alter table public.subscribers enable row level security;
alter table public.admin_audit_log enable row level security;

revoke all on public.site_content from anon, authenticated;
revoke all on public.subscribers from anon, authenticated;
revoke all on public.admin_audit_log from anon, authenticated;
-- No Data API policy is intentional: the row contains both draft and published
-- JSON, so row-level access cannot safely expose only the published column.
-- The Next.js server reads the published field using the server-only key.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'zafar-public',
  'zafar-public',
  true,
  52428800,
  array['image/jpeg','image/png','image/webp','image/avif','audio/mpeg','audio/mp4','application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Uploads go through the server-only service client. Browser roles receive no
-- write policy, so knowing the bucket name never grants upload authority.
insert into public.site_content (id) values ('zafar') on conflict (id) do nothing;
