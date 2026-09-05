-- Shared public content controlled from the desktop CMS.

alter table public.profiles add column if not exists avatar_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profile-avatars', 'profile-avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "CMS users can manage profile avatars"
on storage.objects for all to authenticated
using (bucket_id = 'profile-avatars' and public.is_cms_editor())
with check (bucket_id = 'profile-avatars' and public.is_cms_editor());

drop policy if exists "Public site settings are readable" on public.site_settings;
create policy "Public website settings are readable"
on public.site_settings for select to anon, authenticated
using (setting_key in ('music_url', 'process_steps', 'technologies', 'privacy_policy', 'company_details'));
