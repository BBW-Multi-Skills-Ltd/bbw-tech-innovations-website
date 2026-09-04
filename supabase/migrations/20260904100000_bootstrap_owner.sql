-- Bootstrap the one BBW CMS owner after the Auth account has been created manually.
do $$
declare
  owner_id uuid;
begin
  select id into owner_id
  from auth.users
  where lower(email) = 'coolmatarh@gmail.com';

  if owner_id is null then
    raise exception 'Cannot assign BBW owner: Auth user coolmatarh@gmail.com does not exist.';
  end if;

  insert into public.profiles (user_id, full_name, job_title)
  values (owner_id, 'Prosper Matarh', 'CEO')
  on conflict (user_id) do update
  set full_name = excluded.full_name,
      job_title = excluded.job_title;

  insert into public.cms_user_roles (user_id, role)
  values (owner_id, 'owner')
  on conflict (user_id) do update
  set role = excluded.role;
end;
$$;
