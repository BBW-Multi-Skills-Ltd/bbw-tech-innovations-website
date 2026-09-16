-- A project can display one marketplace testimonial. Keeping this at the
-- database level makes review updates atomic and prevents duplicate reviews.
with ranked_reviews as (
  select
    id,
    row_number() over (
      partition by project_id
      order by updated_at desc, created_at desc, id desc
    ) as row_number
  from public.project_reviews
)
delete from public.project_reviews as review
using ranked_reviews
where review.id = ranked_reviews.id
  and ranked_reviews.row_number > 1;

alter table public.project_reviews
  add constraint project_reviews_project_id_key unique (project_id);
