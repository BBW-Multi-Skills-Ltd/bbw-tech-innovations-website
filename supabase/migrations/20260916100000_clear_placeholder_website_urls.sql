-- `#` was an old CMS placeholder, not a visitable website address.
-- Clear it so the admin field is ready for a real HTTPS URL.
update public.projects
set site_url = null
where trim(coalesce(site_url, '')) = '#';
