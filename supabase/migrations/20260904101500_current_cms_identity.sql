-- Resolve the signed-in CMS identity in one server-side call.
-- This avoids client-side role checks depending on multiple policy-protected table reads.
create function public.get_current_cms_identity()
returns table (
  role public.cms_role,
  full_name text,
  job_title text
)
language sql
stable
security definer
set search_path = ''
as $$
  select roles.role, profiles.full_name, profiles.job_title
  from public.cms_user_roles as roles
  join public.profiles as profiles on profiles.user_id = roles.user_id
  where roles.user_id = auth.uid();
$$;

grant execute on function public.get_current_cms_identity() to authenticated;
