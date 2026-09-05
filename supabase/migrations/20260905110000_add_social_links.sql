create table public.social_links (
  id uuid primary key default extensions.gen_random_uuid(),
  platform text not null unique,
  url text not null,
  is_enabled boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index social_links_public_order_idx on public.social_links (is_enabled, sort_order);

create trigger social_links_set_updated_at before update on public.social_links
for each row execute function public.set_updated_at();

alter table public.social_links enable row level security;

create policy "Enabled social links are publicly readable"
on public.social_links for select to anon, authenticated
using (is_enabled = true);

create policy "CMS editors manage social links"
on public.social_links for all to authenticated
using (public.is_cms_editor())
with check (public.is_cms_editor());

grant select on public.social_links to anon, authenticated;
grant insert, update, delete on public.social_links to authenticated;

insert into public.social_links (platform, url, sort_order)
values
  ('instagram', 'https://www.instagram.com/bbwtech/', 0),
  ('tiktok', 'https://www.tiktok.com/@bbwtech', 1),
  ('facebook', 'https://www.facebook.com/bbwtech', 2)
on conflict (platform) do update set
  url = excluded.url,
  sort_order = excluded.sort_order,
  is_enabled = true;
