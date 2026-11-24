-- Case study pages (/work/[slug]): ordered content blocks per project, as in
-- the portfolio. Additive only: a new table, its trigger, policies and one
-- read-only function. Nothing existing is changed.

create table if not exists public.case_study_blocks (
  id uuid primary key default extensions.gen_random_uuid(),
  project_id text not null references public.projects (id) on delete cascade,
  block_type text not null check (block_type in (
    'cover', 'tldr', 'text', 'list', 'groups', 'flow', 'video',
    'stack_table', 'diagram', 'problem', 'gallery', 'review'
  )),
  -- When set, the block starts a section (and gets a pill on the page).
  section_label text,
  data jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object'),
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists case_study_blocks_project_order_idx
  on public.case_study_blocks (project_id, is_published, display_order);

create trigger case_study_blocks_set_updated_at before update on public.case_study_blocks
for each row execute function public.set_updated_at();

alter table public.case_study_blocks enable row level security;

grant select on public.case_study_blocks to anon, authenticated;
grant insert, update, delete on public.case_study_blocks to authenticated;

-- The public reads a published block only when its project is published.
create policy "Published case study blocks are publicly readable"
on public.case_study_blocks for select to anon, authenticated
using (
  is_published = true
  and exists (
    select 1 from public.projects
    where projects.id = case_study_blocks.project_id
      and projects.is_published = true
  )
);

create policy "CMS editors manage case study blocks"
on public.case_study_blocks for all to authenticated
using (public.is_cms_editor())
with check (public.is_cms_editor());

-- A block's data without its diagram drawings, for the public page (it
-- fetches drawings separately, near the screen). Selected through the API as
-- a computed column: `select=…,public_data`. Row Level Security still applies.
create or replace function public.public_data(public.case_study_blocks)
returns jsonb
language sql
stable
set search_path = ''
as $$
  select $1.data - 'svg' - 'svgLight' - 'svgDark';
$$;

grant execute on function public.public_data(public.case_study_blocks) to anon, authenticated;
