-- Project types, as in the portfolio: website, mobile app, PWA, and the two
-- combinations, plus (for the combinations) what the website is for. Rules for
-- what each type shows live in lib/project-types.ts.
--
-- Additive only. The live site (main) still reads `kind` (and `badge` for
-- client work): both stay as they are, and the new admin keeps writing them.

alter table public.projects
  add column if not exists project_type text
    check (project_type in ('website', 'mobile', 'pwa', 'web_mobile', 'web_pwa')),
  -- Website + mobile app / Website + PWA only: 'product' = the website is the
  -- same product (same flows), 'marketing' = it only presents the app.
  add column if not exists web_role text
    check (web_role in ('product', 'marketing'));

-- Fill the new column from what the live site uses today: own projects by
-- kind, client work by its badge (client apps were kind 'website' + badge
-- 'mobile-app'). Rows the live site adds later (without project_type) are
-- read the same way by the new site's code.
update public.projects
set project_type = case
  when kind = 'app' or badge = 'mobile-app' then 'mobile'
  else 'website'
end
where project_type is null;
