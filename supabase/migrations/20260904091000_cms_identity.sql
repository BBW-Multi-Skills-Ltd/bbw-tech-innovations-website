-- Internal-team identity records and a scalable access-control foundation.

alter type public.cms_role add value if not exists 'admin';
alter type public.cms_role add value if not exists 'viewer';

create type public.access_request_status as enum ('pending', 'approved', 'declined', 'cancelled');

create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  job_title text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.cms_permissions (
  user_id uuid not null references auth.users (id) on delete cascade,
  resource text not null,
  can_read boolean not null default false,
  can_create boolean not null default false,
  can_update boolean not null default false,
  can_delete boolean not null default false,
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, resource)
);

create table public.cms_access_requests (
  id uuid primary key default extensions.gen_random_uuid(),
  requested_by uuid not null references auth.users (id) on delete cascade,
  resource text not null,
  requested_actions text[] not null default '{}',
  reason text not null default '',
  status public.access_request_status not null default 'pending',
  reviewed_by uuid references auth.users (id) on delete set null,
  review_note text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index cms_access_requests_review_idx on public.cms_access_requests (status, created_at desc);

create function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, full_name, job_title)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'job_title', '')
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger cms_permissions_set_updated_at before update on public.cms_permissions
for each row execute function public.set_updated_at();
create trigger cms_access_requests_set_updated_at before update on public.cms_access_requests
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.cms_permissions enable row level security;
alter table public.cms_access_requests enable row level security;

create policy "Users can read their own profile"
on public.profiles for select to authenticated
using (user_id = auth.uid());
create policy "Users can update their own profile"
on public.profiles for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can read their own permission overrides"
on public.cms_permissions for select to authenticated
using (user_id = auth.uid());

create policy "Users can read their own access requests"
on public.cms_access_requests for select to authenticated
using (requested_by = auth.uid());
create policy "Users can create their own access requests"
on public.cms_access_requests for insert to authenticated
with check (requested_by = auth.uid());
create policy "Users can cancel their own pending access requests"
on public.cms_access_requests for update to authenticated
using (requested_by = auth.uid() and status = 'pending')
with check (requested_by = auth.uid() and status in ('pending', 'cancelled'));

grant select, update on public.profiles to authenticated;
grant select on public.cms_permissions to authenticated;
grant select, insert, update on public.cms_access_requests to authenticated;
