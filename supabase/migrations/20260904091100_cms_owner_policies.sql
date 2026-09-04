-- Owner-controlled team management. A role is assigned by the system, never by login input.

create or replace function public.is_cms_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.cms_user_roles
    where user_id = auth.uid() and role = 'owner'
  );
$$;

create or replace function public.is_cms_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.cms_user_roles
    where user_id = auth.uid() and role in ('owner', 'admin')
  );
$$;

create or replace function public.is_cms_editor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.cms_user_roles
    where user_id = auth.uid() and role in ('owner', 'admin', 'editor')
  );
$$;

drop policy "Users can read their own CMS role" on public.cms_user_roles;
create policy "Users can read their own CMS role"
on public.cms_user_roles for select to authenticated
using (user_id = auth.uid() or public.is_cms_owner());
create policy "Owners manage CMS roles"
on public.cms_user_roles for all to authenticated
using (public.is_cms_owner())
with check (public.is_cms_owner());

create policy "Owners can read team profiles"
on public.profiles for select to authenticated
using (public.is_cms_owner());
create policy "Owners manage team profiles"
on public.profiles for all to authenticated
using (public.is_cms_owner())
with check (public.is_cms_owner());

create policy "Owners manage permission overrides"
on public.cms_permissions for all to authenticated
using (public.is_cms_owner())
with check (public.is_cms_owner());

create policy "Owners manage access requests"
on public.cms_access_requests for all to authenticated
using (public.is_cms_owner())
with check (public.is_cms_owner());

grant insert, update, delete on public.cms_user_roles, public.cms_permissions to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant delete on public.cms_access_requests to authenticated;
