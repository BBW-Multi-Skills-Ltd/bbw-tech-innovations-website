@AGENTS.md

# bbwtechinnovation.com

Website and admin for **BBW Tech Innovations**, the technology arm of BBW Multi-Skills Ltd. We are refactoring it to use the same approach as the owner's personal portfolio at `C:\dev\prospermatarh` (read its `CLAUDE.md`, `AGENTS.md` and `docs/DESIGN.md` for reference; **never modify that repo**).

## Goal (all phases)

Keep BBW's brand exactly: colours (`--bbw-*` tokens, accent `#2979FF`), fonts (Fraunces, Outfit, JetBrains Mono), wording, and the dark/light themes. What changes is the structure and how we present work:

1. Move from Vite + React Router to Next.js 16 (App Router, Turbopack, TypeScript, Tailwind v4), the same setup as the portfolio (same Next.js version).
2. A new hero like the portfolio's: giant "BBW TECH" word behind, a 3D BBW logo standing on a floor line (React Three Fiber), sentence and buttons below. The current hero becomes the next section. The owner provides a clean SVG of the logo.
3. Three horizontal intro panels like the portfolio: **Who we are** (a company card: BBW Tech as the technology arm of BBW Multi-Skills Ltd, the business arms as a small connected diagram with status, location; no photo), **What we've built** (up to 3 featured projects), **Let's work together** (start a project, WhatsApp, video enquiry).
4. Each project gets its own case study page at `/work/[slug]` using the portfolio's case study system (blocks, PhoneFrame/LaptopFrame, journeys, Mermaid diagrams drawn on save, AI agent prompts), restyled in BBW blue. This replaces the project popup. Keep "Our Products" (own) and "Client Work" as two groups. Existing project content (about, roles, features, tech, review) is converted into blocks automatically so nothing is lost.
5. Admin: keep the current multi-user admin (roles, invites, permissions), Cloudinary uploads, enquiries including video, and add the portfolio's case study editor with live preview.
6. Polish and launch: per-page metadata and Open Graph images, sitemap, Lighthouse, switch the domain.

## Phases

1. **Move to Next.js, same look.** *Done (Nov 2026)* on branch `nextjs`; see "How it is built" below.
2. **New hero with the 3D BBW logo.** *Done (Nov 2026)*, see "The hero and 3D logo" below.
3. **Three intro panels.** *Built (Nov 2026)*; waiting on the `is_featured` migration, see "The intro slides" below.
4. **Case study pages.** *Done (Nov 2026)*, see "Case studies" below.
5. Admin: case study editor with live preview (item 5).
6. Polish and launch (item 6).

## Rules

- **One phase at a time.** At the end of each: `npm run build` and `npm run lint` with zero errors, check it in the browser at desktop and ~390px phone width, then stop and summarise what changed and what the owner should check.
- Work on the git branch **`nextjs`**. The live site stays on `main`, untouched, until the new version is ready. **The owner commits and pushes**; tell them the commands.
- **The Supabase project is LIVE production and has no automatic backups.** Before ANY migration: run `npm run backup:db`, show the owner the migration SQL and wait for their OK. Migrations only **add** tables/columns; never drop or rename anything the current live site (on `main`) uses.
- **Ask before adding any dependency.** Expected ones: next, gsap, lenis, three, @react-three/fiber, @react-three/drei, mermaid, @sentry/nextjs (in place of @sentry/react).
- Never commit secrets. Public env vars are `NEXT_PUBLIC_*`; keys live in `.env.local` (git-ignored); keep `.env.example` updated with names only.
- **Never invent content:** no made-up clients, numbers, reviews or dates. Missing content stays as a visible `[placeholder]`.
- Server components by default; `"use client"` only where needed. Small components named for what they show.

## How it is built (after Phase 1)

- Next.js 16.4.6, Turbopack, `cacheComponents` + `partialPrefetching` (as the portfolio). `app/` at the project root, no `src/`. Imports use `@/…`.
- **Tailwind v4 via `@tailwindcss/turbopack`, pinned to 4.3.3** (4.3.5 breaks `next/font`: "Can't resolve '@vercel/turbopack-next/internal/font/google/font'").
- `app/globals.css` imports the original stylesheets from `styles/` into cascade layers (`foundation.css` → `base`, the rest → `components`) so Tailwind utilities win over them, like the old inline styles did. The `--bbw-*` tokens are Tailwind colours (`bg-bbw-surface`, `text-bbw-muted`, `border-bbw-border`…); fonts are `font-display` (Fraunces), `font-sans` (Outfit), `font-mono` (JetBrains Mono), loaded with `next/font` as `--font-fraunces` / `--font-outfit` / `--font-jetbrains-mono`.
- **Public pages read Supabase on the server**: `lib/site-content.ts` → `getSiteContent()` (`'use cache'`, tag `content`, `cacheLife('minutes')`, 8 s timeout, bundled defaults from `lib/data/*` when Supabase is empty or unreachable). Reads live in `lib/cms/contentRepository.ts` and take an optional client (`lib/supabase/public.ts` on the server, `lib/supabase/browser.ts` in the admin).
- **Admin saves refresh the public pages**: `useAdminData` calls the server action `app/actions/refresh-content.ts` after every save; it checks the user's token and CMS role, then `updateTag('content')`.
- Homepage: `app/page.tsx` (server) renders server sections inside `components/home/HomeShell.tsx` (client: theme, contact form, cookie banner). Buttons that open things are small client components (`StartProjectButton`, `ProjectDetailsButton`) using `useSiteActions()`.
- Admin (`/admin`, `/admin/account`, `/admin/reset-password`, `/admin/accept-invite`, `/admin/confirm-email`) is still client-side, as before; `app/admin/layout.tsx` sets noindex. `/cms` redirects to `/admin` (`next.config.ts`).
- Supabase Edge Functions in `supabase/functions/` (enquiries, invites, Cloudinary signatures) are unchanged.
- Sentry: `instrumentation-client.ts` (browser only, production only, no personal data); crashes show `app/error.tsx` / `app/global-error.tsx`.
### The hero and 3D logo (Phase 2)

- `components/hero/BrandHero.tsx`, ported from the portfolio's GuideHero: giant "BBW TECH" behind, floor line, the logo standing on it at the right, "BBW Tech *Innovations*" (the page's only h1) + the meta-description sentence, "Start a Project" (contact form) and "Our Work" (#work). The old hero (`HeroSection`, heading now an h2) follows it unchanged. Styles in `styles/hero.css` (`gh-*`, intro only with the `js` class set in `app/layout.tsx`).
- Walk: `useLogoWalk.ts` (drag, walk, hello bubble, idle ±40° swing that never shows the back; reduced motion: follows the drag only), start-up: `useHeroStart.ts`, sizing: `logo-size.ts` (sizes the logo's **box = the SVG viewBox 1557 × 777**; `placeLogoScript` repeats the same sums before first paint; keep them in sync). Bubble greetings are owner-approved: "Hello!", "Hi there!", "Welcome to BBW Tech!", "Let's build something."
- Logo: `public/logos/bbw-logo.svg` (official vector; paths `#swoosh` = swoosh + first B, `#b`, `#w`; never redraw). `components/logo3d/shared.tsx` loads that file and extrudes each path separately (swoosh 14 units forward; bevel cut inward with `bevelOffset` so the silhouette stays the SVG's). Look (tuned against bbwlogo.png with the owner, Nov 2026): deep, saturated royal blue. Vertex colours by height over the letters' band: the letters (and the first B, picked out of the swoosh path by area, `FIRST_B`) go to dark navy at their bottoms; the swoosh stays vivid royal blue all round (brightest on its top arc). Sides darkened to deep navy by how far each face turns from the front. Full metal (no diffuse, so nothing washes the blue out to pastel) with a light satin clear coat; a blue front fill, direct white/cyan edge lights for cyan-blue bevel highlights, no tone mapping. `lib/bbw-logo.ts` holds the logo's constants.
- Phones/tablets (`STILL_LOGO_QUERY` in `components/logo3d/webgl.ts`) get `public/logos/bbw-logo-3d.webp`; three.js loads only on desktop with WebGL; no WebGL → `FlatLogo` (the SVG as a CSS mask over the brand gradient). **After changing the 3D look, re-render the still** at `/dev/logo-still` (development only; instructions in that page).
- Favicon: `public/logos/bbw-icon.svg` (the SVG with the gradient, square viewBox), PNG fallback. Header logo and Open Graph image still use the PNGs (sharp at their sizes; OG is a designed card, revisited in Phase 6).

### The intro slides (Phase 3)

- `components/intro/IntroSlider.tsx` (+ `IntroPanel`), ported from the portfolio's Hero: desktop ≥960px pins with GSAP and scroll moves the panels sideways (progress bar, "01 / 03"); phones/tablets use the CSS sticky version (`lib/phone-slides.ts`, snaps to the nearest slide; compact `stick:` styles, tablets ≥768px keep images); reduced motion stacks. Styles: `styles/intro.css`.
- **Cascade-layer trap:** our stylesheets sit in a layer *below* Tailwind utilities (unlike the portfolio's unlayered CSS). Never put utility classes for the same properties (position, height, display) on elements that `intro.css`/`hero.css` style, or the utility silently wins (this broke the sticky hold until fixed).
- Panels: `WhoWeArePanel` (former hero headline + paragraph, company card with the business-arms tree and location), `BuiltPanel` (`lib/featured-projects.ts`: up to 3 `is_featured` projects in list order, own first; falls back to the first 3 until any are featured; cards open the project popup), `WorkTogetherPanel` (see Phase 5 follow-ups: WhatsApp or "Type a Message" highlighted). Panel 2 heading and fallback approved by the owner.
- Background: `components/hero/AnimatedHeroGrid.tsx` sits in the held part of the slider; pauses off screen (IntersectionObserver), one still pattern with reduced motion, redraws on theme change (`data-running` shows its state).
- Smooth scroll: `components/SmoothScroll.tsx` + `ScrollSync.tsx` (portfolio's; Lenis on mouse/trackpad only, handles in-page links; sections have `scroll-margin-top: 80px`). No CSS `scroll-behavior: smooth` (it fights the pin and snap).
- Company details gained an optional `whatsapp` (same `site_settings` JSON, no migration).
- **Pending migration** `supabase/migrations/20261123090000_add_project_is_featured.sql` (adds `projects.is_featured`). Until it's applied, **saving a project from this branch's admin fails** (the save writes `is_featured`). `npm run backup:db` currently fails with a 403 from the Supabase CLI (account lacks privileges): fix the CLI login first.

### Case studies (Phase 4)

- `/work/[slug]` (`app/work/[slug]/page.tsx`): the slug is the project's `id` (set from the name when created; the admin can't change it later). Coming-soon own products and unpublished projects 404 (`hasCaseStudy` in `lib/case-studies/data.ts`). Per-page title, description and canonical; no footer (ends with "Next project"), as in the portfolio.
- Ported from the portfolio and restyled: `components/case-study/` (CaseStudyArticle, Blocks, FlowJourney, SectionPills, DiagramFigure + LazyDiagram, JourneyDeviceToggle, DeviceFrame, DemoVideo, RichText), `components/PhoneFrame.tsx`, `LaptopFrame.tsx`, `Reveal.tsx`, `lib/case-studies/types.ts`, `lib/screens.ts`, `/diagrams/[id]`. BBW additions: a `review` block, numbered lists, chip groups, a QR code on the cover, and the drawn preview (`components/projects/DrawnScreen.tsx`) inside the frame until real screenshots exist.
- Content: `case_study_blocks` table (migration 20261124090000; RLS: public reads published blocks of published projects, CMS editors write; `public_data` computed column). **No blocks are stored yet:** every page is built from the project's fields by `lib/case-studies/from-project.ts` (cover ← name/tagline/status/year/platform/category/live site/QR/demo/card image; Overview ← about; Features ← features; Team ← roles; Tech stack ← tech; Client review ← review). Stored blocks, when a project has any, replace that.
- Homepage: `components/work/` (SelectedWork + WorkTabs + WorkCard) replaces the Products and Work sections ("Our products" / "Client work"; heading "Projects we've built." approved by the owner); `#products` is an anchor at its top. The project popup and its components are gone.
- In development the dev server can serve a stale server render after edits (hydration warnings on the nav links); a fresh build/restart clears it. Unknown slugs return a real 404 only in production builds.

### Project types and the demo section (after Phase 4)

- `lib/project-types.ts` (ported): website, mobile, pwa, web_mobile, web_pwa, plus web_role for the combined types; `devicesFor`, `hasWebsite`, `hasApp`, `isPwa`. Columns `projects.project_type` / `web_role` (migration 20261124120000; filled from `kind`/`badge`). **`kind` and `badge` stay: the live site (main) reads them.** `projectTypeOf()` falls back to them for rows without a type; every save writes both, kept in step by `legacyFields()` (kind 'app' for anything with an app or PWA; client work's badge 'website' unless it's app-only).
- Admin project form: "Project type" dropdown (decides the app fields and the website URL field), "Website role" for the combined types; the old "Project Badge" select is gone (derived).
- Work tabs: All · Mobile apps (mobile, pwa, combined) · Websites (website, combined); each card says "Our product" or "Client work"; frames follow `devicesFor` (combined = laptop with the phone in front).
- Case studies: the demo is its own "See it in action" section (a `video` block with `frame: 'auto'`): played inside the phone (apps, PWAs) or laptop (websites, combined), card image as poster, never autoplays. The cover no longer shows it.
- `liveSiteUrl()` collapses a doubled scheme ("https://https://…"); Pearl The Braider's stored URL has one and should be fixed in the admin.

### The agency case study layout (Nov 2026)

- Case studies are for winning clients. Order: cover → **The brief** (the client's/market's problem, in business words) → **What we built** (features as zigzag journeys: an outcome headline about what the end customer can do, the steps screen by screen, and "What this meant for the business": a real result or a visible [placeholder]) → **See it in action** → **The result** (real outcomes only, visible [placeholders] for missing numbers) → **The team**, then **Built with** (short, plain) → **Client review** → "Let's build something worth building." call to action → "Next project". **No system design or database diagrams on BBW case studies.**
- Visible placeholders only in two places: a flow's `business` line and a list with `showPlaceholders` (The result). Everywhere else empty/[placeholder] content is hidden.
- Where blocks come from (`lib/case-studies/data.ts`): the database → bundled in code (`lib/case-studies/bundled/`, Prezpa) → built from the project's fields (`from-project.ts`, same order; no "The result", as there's no field for it).
- **Prezpa** (`bundled/prezpa.ts`): rewritten from the portfolio's case study in "we" voice, wording approved by the owner; every fact kept, nothing added; the work presented as a team's roles (the owner's choice for the agency). Status "Live" (update the admin's status to match). No real screenshots exist yet (the portfolio's storage only had two images from another app, "Enzito"), so the journey steps show numbered empty phones until screenshots (1080 × 2280) are added; the cover uses the card image. Type stays "Mobile app" until desktop screenshots exist (then "Website + mobile app", web role "product").

### Homepage sections polish (Phase 5)

- What We Build: the grid is unchanged; each box's content appears in a quick wave (`Reveal`, 0.06s stagger). The boxes themselves don't fade: the grid's 1px lines are its background showing between them.
- Technologies: words, no logos, grouped by what they do for a client (`lib/content/tech-groups.ts`, groups approved by the owner). The admin keeps one flat list; unknown words go to a last "More tools" group, "And more" stays at the end. Groups reveal one after another.
- How We Work: a scroll-driven timeline (`components/sections/ProcessSection.tsx`, `styles/process.css`): a line fills as you scroll; each step lights up and opens when it passes 62% of the screen and stays open (so nothing above collapses); clicks still toggle; "Expand to view all" kept. Reduced motion: not scroll-driven, one step open at a time by click. Step 02's note is now "So your budget goes into something people actually want." (default in `lib/content/process.ts`; the admin can override it).
- About: the business arms list is gone (it's in the intro's company card); the text stays in view (sticky) beside the four pillars. `BusinessArms.tsx` removed.
- Testing note: on desktop with a mouse, Lenis smooths scrolling and overrides big programmatic `scrollTo` jumps in headless tests; test with touch emulation (no Lenis) or small steps.

### Phase 5 follow-ups (Nov 2026)

- **Project logo covers:** `projects.logo_url` (migration 20261125090000, applied). Admin → project → "Project logo" (transparent PNG, SVG or WebP via Cloudinary). When set, the card image area of the featured cards (intro panel 2) and the work cards shows `components/projects/LogoCover.tsx`: the logo contained in an inset box (18% / 16%) on a soft radial gradient of the accent colour (`lib/logo-cover.ts`; very light accents are darkened and very dark ones lifted, the logo is never changed). No logo → the card image or drawn preview as before.
- "View case study →" on every card that has a page (featured cards: a line at the bottom; work cards: the main button).
- **Video enquiries removed from the public site** (the panel 3 tile, the form's mode choice, the recorder). Panel 3: WhatsApp (when set in Company details) is the highlighted tile beside "Type a Message"; without it, "Type a Message" is the highlight. Past video enquiries stay viewable in Admin → Enquiries; the storage bucket and edge functions are untouched.
- **Music player removed** from the site and admin (the "Music" tab). The `music_url` row in `site_settings` stays (the live site on main reads it); nothing here reads it.
- **Theme:** `lib/theme-preference.ts` + `lib/hooks/useTheme.ts`. A head script sets `data-theme` before first paint: saved choice (`localStorage` `bbw-theme`), else the system setting, else dark. The toggle saves the choice only when preference cookies are allowed (turning them off forgets it); without a saved choice the site follows system changes live. `themeColor` per scheme.

### Other

- Still static from the Vite site: `public/robots.txt`, `public/sitemap.xml` (Phase 6 replaces them).
