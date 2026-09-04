-- Edge Functions use the service_role database role. It bypasses RLS but still
-- needs explicit table/storage privileges in this locked-down schema.
grant usage on schema public, storage to service_role;
grant select, insert, update, delete on public.enquiries to service_role;
grant select, insert, update, delete on storage.objects to service_role;
