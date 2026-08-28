-- Immutable CMS snapshots make every draft save, publish, and restore
-- recoverable. The mutation function keeps the content update, version row,
-- and audit entry in one database transaction.

create table if not exists public.content_versions (
  id bigint generated always as identity primary key,
  snapshot jsonb not null,
  version_type text not null check (version_type in ('draft', 'published')),
  actor_id uuid references auth.users(id) on delete set null,
  actor_email text not null,
  source_version_id bigint references public.content_versions(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists content_versions_created_at_idx
  on public.content_versions (created_at desc);

alter table public.content_versions enable row level security;
revoke all on public.content_versions from anon, authenticated;
revoke all on sequence public.content_versions_id_seq from anon, authenticated;
grant select, insert on public.content_versions to service_role;
grant usage, select on sequence public.content_versions_id_seq to service_role;

alter table public.admin_audit_log
  drop constraint if exists admin_audit_log_action_check;
alter table public.admin_audit_log
  add constraint admin_audit_log_action_check
  check (action in ('save_draft', 'publish', 'restore', 'upload', 'unsubscribe'));

create or replace function public.apply_site_content_version(
  p_content jsonb,
  p_actor_id uuid,
  p_actor_email text,
  p_version_type text,
  p_action text,
  p_source_version_id bigint default null
)
returns bigint
language plpgsql
security invoker
set search_path = ''
as $$
declare
  new_version_id bigint;
  changed_rows integer;
begin
  if p_version_type not in ('draft', 'published') then
    raise exception 'Invalid content version type';
  end if;
  if p_action not in ('save_draft', 'publish', 'restore') then
    raise exception 'Invalid content action';
  end if;
  if p_content is null or jsonb_typeof(p_content) <> 'object' then
    raise exception 'Content must be a JSON object';
  end if;
  if p_actor_id is null or nullif(trim(p_actor_email), '') is null then
    raise exception 'An authenticated actor is required';
  end if;

  update public.site_content
  set
    draft = p_content,
    published = case when p_version_type = 'published' then p_content else published end,
    updated_by = p_actor_id,
    updated_at = now(),
    published_at = case when p_version_type = 'published' then now() else published_at end
  where id = 'zafar';

  get diagnostics changed_rows = row_count;
  if changed_rows <> 1 then
    raise exception 'Zafar content record is missing';
  end if;

  insert into public.content_versions (
    snapshot,
    version_type,
    actor_id,
    actor_email,
    source_version_id
  ) values (
    p_content,
    p_version_type,
    p_actor_id,
    lower(trim(p_actor_email)),
    p_source_version_id
  )
  returning id into new_version_id;

  insert into public.admin_audit_log (
    actor_id,
    actor_email,
    action,
    entity,
    metadata
  ) values (
    p_actor_id,
    lower(trim(p_actor_email)),
    p_action,
    'site_content',
    jsonb_build_object(
      'versionId', new_version_id,
      'versionType', p_version_type,
      'sourceVersionId', p_source_version_id
    )
  );

  return new_version_id;
end;
$$;

revoke all on function public.apply_site_content_version(jsonb, uuid, text, text, text, bigint) from public, anon, authenticated;
grant execute on function public.apply_site_content_version(jsonb, uuid, text, text, text, bigint) to service_role;

-- Keep the storage bucket aligned with the application-level upload limit.
update storage.buckets
set file_size_limit = 4194304
where id = 'zafar-public';
