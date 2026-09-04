-- BBW Tech Innovations: initial production CMS and enquiry schema.
-- Content is public only when published; all CMS writes require an assigned role.

create extension if not exists pgcrypto with schema extensions;

create type public.cms_role as enum ('owner', 'editor');
create type public.project_kind as enum ('app', 'website');
create type public.project_status as enum ('in-dev', 'coming-soon', 'testing', 'beta', 'live', 'completed');
create type public.platform_availability as enum ('available', 'coming-soon', 'not-supported');
create type public.work_badge as enum ('website', 'mobile-app');
create type public.business_arm_status as enum ('active', 'in-development', 'coming-soon');
create type public.review_source as enum ('email', 'whatsapp', 'other');
create type public.enquiry_kind as enum ('message', 'video');
create type public.enquiry_status as enum ('new', 'reviewing', 'contacted', 'archived');

create table public.cms_user_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role public.cms_role not null default 'editor',
  created_at timestamptz not null default timezone('utc', now())
);

create table public.projects (
  id text primary key,
  kind public.project_kind not null,
  name text not null,
  tagline text not null default '',
  short_description text not null default '',
  about text not null default '',
  category text not null default '',
  status public.project_status not null default 'in-dev',
  platform text,
  android_availability public.platform_availability,
  ios_availability public.platform_availability,
  site_url text,
  accent_color text not null default '#2d7cff',
  mock_bg text not null default '#0b1220',
  screens jsonb not null default '[]'::jsonb check (jsonb_typeof(screens) = 'array'),
  roles jsonb not null default '[]'::jsonb check (jsonb_typeof(roles) = 'array'),
  features jsonb not null default '[]'::jsonb check (jsonb_typeof(features) = 'array'),
  tech text[] not null default '{}',
  is_own boolean not null default false,
  year text not null default '',
  badge public.work_badge,
  demo_video_url text,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.project_reviews (
  id uuid primary key default extensions.gen_random_uuid(),
  project_id text not null references public.projects (id) on delete cascade,
  quote text not null,
  client_name text not null,
  client_role text not null default '',
  source public.review_source not null default 'other',
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.business_arms (
  id text primary key,
  name text not null,
  role text not null,
  status public.business_arm_status not null,
  website_url text,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.marquee_items (
  id uuid primary key default extensions.gen_random_uuid(),
  label text not null,
  is_enabled boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.site_settings (
  setting_key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.enquiries (
  id uuid primary key default extensions.gen_random_uuid(),
  kind public.enquiry_kind not null,
  name text not null,
  phone text not null default '',
  email text not null default '',
  message text,
  video_path text,
  status public.enquiry_status not null default 'new',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint enquiries_have_submission check (
    (kind = 'message' and nullif(trim(coalesce(message, '')), '') is not null)
    or (kind = 'video' and nullif(trim(coalesce(video_path, '')), '') is not null)
  )
);

create index projects_public_order_idx on public.projects (is_published, sort_order, created_at);
create index project_reviews_public_order_idx on public.project_reviews (project_id, is_published, sort_order);
create index business_arms_public_order_idx on public.business_arms (is_published, sort_order);
create index marquee_items_public_order_idx on public.marquee_items (is_enabled, sort_order);
create index enquiries_status_created_idx on public.enquiries (status, created_at desc);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create function public.is_cms_editor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.cms_user_roles
    where user_id = auth.uid()
      and role in ('owner', 'editor')
  );
$$;

create trigger projects_set_updated_at before update on public.projects
for each row execute function public.set_updated_at();
create trigger project_reviews_set_updated_at before update on public.project_reviews
for each row execute function public.set_updated_at();
create trigger business_arms_set_updated_at before update on public.business_arms
for each row execute function public.set_updated_at();
create trigger marquee_items_set_updated_at before update on public.marquee_items
for each row execute function public.set_updated_at();
create trigger site_settings_set_updated_at before update on public.site_settings
for each row execute function public.set_updated_at();
create trigger enquiries_set_updated_at before update on public.enquiries
for each row execute function public.set_updated_at();

alter table public.cms_user_roles enable row level security;
alter table public.projects enable row level security;
alter table public.project_reviews enable row level security;
alter table public.business_arms enable row level security;
alter table public.marquee_items enable row level security;
alter table public.site_settings enable row level security;
alter table public.enquiries enable row level security;

create policy "Users can read their own CMS role"
on public.cms_user_roles for select to authenticated
using (user_id = auth.uid());

create policy "Published projects are publicly readable"
on public.projects for select to anon, authenticated
using (is_published = true);
create policy "CMS editors manage projects"
on public.projects for all to authenticated
using (public.is_cms_editor())
with check (public.is_cms_editor());

create policy "Published reviews are publicly readable"
on public.project_reviews for select to anon, authenticated
using (
  is_published = true
  and exists (
    select 1 from public.projects
    where projects.id = project_reviews.project_id
      and projects.is_published = true
  )
);
create policy "CMS editors manage reviews"
on public.project_reviews for all to authenticated
using (public.is_cms_editor())
with check (public.is_cms_editor());

create policy "Published business arms are publicly readable"
on public.business_arms for select to anon, authenticated
using (is_published = true);
create policy "CMS editors manage business arms"
on public.business_arms for all to authenticated
using (public.is_cms_editor())
with check (public.is_cms_editor());

create policy "Enabled marquee items are publicly readable"
on public.marquee_items for select to anon, authenticated
using (is_enabled = true);
create policy "CMS editors manage marquee items"
on public.marquee_items for all to authenticated
using (public.is_cms_editor())
with check (public.is_cms_editor());

create policy "Public site settings are readable"
on public.site_settings for select to anon, authenticated
using (setting_key in ('music_url'));
create policy "CMS editors manage site settings"
on public.site_settings for all to authenticated
using (public.is_cms_editor())
with check (public.is_cms_editor());

create policy "CMS editors manage enquiries"
on public.enquiries for all to authenticated
using (public.is_cms_editor())
with check (public.is_cms_editor());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'enquiry-videos',
  'enquiry-videos',
  false,
  52428800,
  array['video/webm', 'video/mp4', 'video/quicktime']
)
on conflict (id) do nothing;

create policy "CMS editors can read enquiry videos"
on storage.objects for select to authenticated
using (bucket_id = 'enquiry-videos' and public.is_cms_editor());
create policy "CMS editors can delete enquiry videos"
on storage.objects for delete to authenticated
using (bucket_id = 'enquiry-videos' and public.is_cms_editor());

grant usage on schema public to anon, authenticated;
grant select on public.projects, public.project_reviews, public.business_arms, public.marquee_items, public.site_settings to anon, authenticated;
grant select on public.cms_user_roles to authenticated;
grant insert, update, delete on public.projects, public.project_reviews, public.business_arms, public.marquee_items, public.site_settings to authenticated;
grant select, insert, update, delete on public.enquiries to authenticated;
