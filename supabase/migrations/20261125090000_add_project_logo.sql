-- Project logo for card covers: when set, a project's card shows the logo
-- centred on its accent colour instead of the card image. Additive only: a new
-- nullable column; existing rows and the live site (main) are unaffected.

alter table public.projects
  add column if not exists logo_url text;
