-- Featured projects for the homepage intro slider (up to 3 shown, in list order).
-- Adds a column only; the existing projects policies already cover it.
alter table public.projects
  add column if not exists is_featured boolean not null default false;
