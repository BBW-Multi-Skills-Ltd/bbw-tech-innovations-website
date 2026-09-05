-- A social-link editor represents one ordered list. Replacing it in one
-- transaction avoids PostgREST upsert conflicts between saved UUIDs and new rows.

create or replace function public.replace_social_links(next_links jsonb)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  duplicate_platform text;
begin
  if not public.is_cms_editor() then
    raise exception 'CMS editor access is required';
  end if;

  if jsonb_typeof(next_links) <> 'array' then
    raise exception 'Social links must be an array';
  end if;

  select platform into duplicate_platform
  from (
    select lower(trim(item ->> 'platform')) as platform
    from jsonb_array_elements(next_links) as item
  ) as platforms
  where platform <> ''
  group by platform
  having count(*) > 1
  limit 1;

  if duplicate_platform is not null then
    raise exception 'Each platform can only be added once: %', duplicate_platform;
  end if;

  delete from public.social_links;

  insert into public.social_links (platform, url, is_enabled, sort_order)
  select
    lower(trim(item ->> 'platform')),
    trim(item ->> 'url'),
    coalesce((item ->> 'isEnabled')::boolean, true),
    ordinal - 1
  from jsonb_array_elements(next_links) with ordinality as source(item, ordinal)
  where nullif(trim(item ->> 'platform'), '') is not null
    and nullif(trim(item ->> 'url'), '') is not null;
end;
$$;

grant execute on function public.replace_social_links(jsonb) to authenticated;
