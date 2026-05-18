# Claude Progress

## 2026-05-19 - Homepage boot transition, zoom readability, partners grid polish, and vehicle image quality

Implementation:

- Added a black sci-fi calibration loading layer to the homepage hero with
  staggered yellow scan lines, subtle noise, chromatic glow, and the Sunswift
  logo animating from centre toward the navbar before the existing hero reveal.
- Tuned the `Built by Students. Driving Sustainability.` scroll section so the
  headline becomes readable earlier, keeps stronger contrast during slow scroll,
  and hands off into the Who We Are section through a simple light block and rule.
- Reduced the vehicles garage/detail image quality constant from `100` to `75`
  to lower delivered image weight while keeping the existing responsive sizes.
- Reworked the partners grid into a padded four-column layout with square
  logo-only cards, default grayscale treatment, hover/focus scale, restored
  colour, and a bottom-left name/arrow overlay.
- Removed the redundant partners grid copy block:
  `Collaboration network`, `Partners and sponsors`, and the explanatory logo
  tile sentence.
- Updated static and browser verification contracts for the new hero boot hooks,
  zoom handoff hooks, partners card treatment, and vehicle image quality.

Verification:

- `node scripts/test-homepage-design.mjs`: passed.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint --quiet`: passed.
- `./node_modules/.bin/next build`: passed.
- Manual agent-browser smoke on `http://127.0.0.1:3017/`: boot layer appeared,
  hero completed, and the slow-scroll zoom headline measured `rgb(8, 8, 8)` at
  opacity `1` with the readability wash active.
- Manual agent-browser smoke on `/partners`: redundant grid copy was absent, the
  grid reported 35 cards, 4 columns, and square cards.
- `PATH=$PWD/node_modules/.bin:$PATH VERIFY_URL=http://127.0.0.1:3017 node scripts/verify-browser.mjs`:
  passed across the public browser contracts and admin login smoke.

Known limits:

- Direct `pnpm ...` commands are currently blocked by Corepack failing to resolve
  the pnpm signing key on this Node install, so the same checks were run through
  the repo's installed local binaries.
- LocalStack-dependent checks were not run for this frontend-only pass.
- Existing unrelated dirty files were left untouched: `.DS_Store` and
  `aws/lib/website-v3-stack.ts`.

## 2026-05-19 - Admin login warning, sitemap, hidden credits, and wider team editors

Implementation:

- Replaced the admin `next-themes` provider with a local admin theme provider
  that toggles the `dark` class without rendering an inline script tag.
- Kept `/credits` in the app but hid it from footer navigation, omitted it from
  the sitemap, disallowed it in `robots.txt`, and marked the page `noindex`.
- Added App Router metadata routes for `/sitemap.xml` and `/robots.txt`, covering
  the public content pages plus recruitment role stream routes.
- Widened the admin team-member edit cards from a cramped 4-column maximum to a
  wider 3-column maximum, made the edit summary clearer, and made department /
  hierarchy selects full-width single-column controls.
- Updated static and browser harness expectations for the hidden Credits route,
  sitemap/robots, custom admin theme provider, and wider team editors.

Verification:

- `pnpm typecheck`: passed.
- `pnpm lint --quiet`: passed.
- `pnpm test:homepage-design`: passed.
- `pnpm build`: passed; route list includes `/sitemap.xml` and `/robots.txt`.
- `agent-browser` opened `http://127.0.0.1:3016/admin/login`; snapshot showed the
  Google login page and both `agent-browser console` and `agent-browser errors`
  returned empty output.
- `curl /sitemap.xml` returned public routes including recruitment role streams;
  `curl /robots.txt` disallowed `/admin`, `/api`, and `/credits`.

Known limits:

- GitHub issue listing was not available through the surfaced connector tools
  and `gh` is not installed, so the issue work was implemented from the issue
  titles/descriptions supplied in chat.
- Existing unrelated dirty files were left untouched: `.DS_Store` and
  `aws/lib/website-v3-stack.ts`.

## 2026-05-18 - Global site image CMS, batch public S3 upload, and footer utility links

Implementation:

- Added a `site-images` CMS collection and `/admin/images` so hardcoded public
  page imagery can be replaced with S3/CloudFront URLs without redeploying.
- Wired site-image overrides through the homepage, achievements, vehicles,
  partners, media, contact, team, recruitment, who-we-are, our-story, and footer
  UNSW logo image paths.
- Updated the public S3 asset uploader to accept multiple files in one batch and
  return/copy all uploaded CloudFront URLs.
- Added `/credits` and linked both Credits and `/admin/login` from the footer
  quick navigation.
- Restored app-local pointer docs for `PARTNER_IMPORT_SCHEMA.md` and
  `VERCEL_AWS_DEPLOYMENT.md` so the existing static harness can find the docs
  it asserts.

Verification:

- `pnpm typecheck`: passed.
- `pnpm lint --quiet`: passed.
- `pnpm test:homepage-design`: passed after adding site-image CMS/batch upload
  assertions.
- `pnpm build`: passed; build output includes `/admin/images` and `/credits`.

Known limits:

- LocalStack-dependent admin regression was not run in this pass.
- Existing unrelated dirty files were left untouched: `.DS_Store` and
  `aws/lib/website-v3-stack.ts`.
- AWS and Google secrets pasted into chat should be rotated before production.

## 2026-05-18 - Timeline video admin controls and route transition tuning

Implementation:

- Added `/admin/timeline` as a Timeline CMS section with one compact form per
  achievement, including a video toggle and editable live video URL.
- Added a `timeline-videos` CMS collection across the local DynamoDB facade,
  AWS Lambda CMS handler, and LocalStack seed data.
- Updated `/achievements` to read published timeline video settings and merge
  them over the static timeline data, so admins can disable a video or replace
  its URL without changing code.
- Tuned route-entry animation behavior: Team now uses the same in-page hero
  entrance style as Partners, Media uses the longer cinematic reveal, Contact no
  longer renders a page-entry reveal, and Achievements keeps the subtle reveal.
- Updated team CSV import behavior so matching rows overwrite imported draft
  fields instead of preserving stale image keys; imported `Team` hierarchy rows
  now drop role titles while Officer and above keep imported roles.
- Made admin team profile cards denser and added an `Extra compact cards`
  density toggle.

Verification:

- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm test:homepage-design`: passed with assertions for timeline video CMS,
  route reveal variants, team CSV overwrite behavior, and compact admin cards.
- `pnpm build`: passed; build output includes dynamic `/achievements` and
  `/admin/timeline`.
- `npm run build` in `aws`: passed.
- `npm test -- --runInBand` in `aws`: passed.
- `VERIFY_URL=http://127.0.0.1:3000 pnpm verify:browser`: passed, including
  public achievements, team, media, contact, recruitment, and partners checks.
- `VERIFY_URL=http://127.0.0.1:3000 pnpm verify:cms-admin`: passed, including
  `TEAM_DRAFT_EDIT_OK`, `TEAM_PUBLISH_MOVED_OK`, `TIMELINE_ADMIN_OK`,
  `PARTNERS_ADMIN_OK`, and `ASSETS_ADMIN_OK`.
- `./init.sh`: passed after implementation with LocalStack DynamoDB/S3, AWS
  build/test, frontend typecheck/lint, and homepage design contract.

Known limits:

- Existing unrelated dirty files were left untouched.

## 2026-05-18 - Admin public S3 uploads, partner import schema, team grid editing, and route reveal animations

Implementation:

- Added an authenticated `/api/admin/public-assets` route that presigns direct
  browser uploads into `CMS_PUBLIC_ASSETS_BUCKET`, verifies the uploaded object,
  registers it as a published public-media asset, and returns the public URL.
- Added `/admin/assets` large-file upload UI with progress, success/failure
  status, copyable URL output, and a disabled loading state while uploading.
- Added public S3 upload CORS to the CDK public assets bucket and LocalStack
  bucket harness.
- Updated Google OAuth to request `prompt=select_account` so admins can pick
  between multiple Google/Gmail accounts at login.
- Added partner import schema documentation in `PARTNER_IMPORT_SCHEMA.md`; partner
  imports now accept CSV URLs, logo URLs, and `Sort Order` columns.
- Reworked `/admin/team` into compact profile grid cards with expandable
  `Edit profile` panels for live and draft records.
- Added `PageLoadReveal` and applied image-backed page-entry reveal animations to
  `/team`, `/media`, `/contact`, `/who-we-are`, and `/recruitment`.
- Added `VERCEL_AWS_DEPLOYMENT.md` with AWS CDK outputs, Vercel environment
  variables, OAuth callback setup, direct AWS runtime notes, and the public S3
  upload flow.

Verification:

- `pnpm typecheck`: passed after implementation and after the uploader
  loading-state adjustment.
- `pnpm lint`: passed after implementation and after the uploader loading-state
  adjustment.
- `pnpm test:homepage-design`: passed with assertions for S3 upload hooks,
  OAuth account selection, partner schema, team grid editors, deployment docs,
  S3 CORS, and page-entry reveal hooks.
- `pnpm build`: passed; production route list includes
  `/api/admin/public-assets`.
- `npm run build` in `aws`: passed.
- `npm test -- --runInBand` in `aws`: passed with the public S3 CORS assertion.
- `VERIFY_URL=http://127.0.0.1:3000 pnpm verify:browser`: passed.
- `VERIFY_URL=http://127.0.0.1:3000 pnpm verify:cms-admin`: passed, including
  `TEAM_DRAFT_EDIT_OK`, `TEAM_PUBLISH_MOVED_OK`, `PARTNERS_ADMIN_OK`, and
  `ASSETS_ADMIN_OK`.
- `./init.sh`: passed after implementation with LocalStack DynamoDB/S3, AWS
  build/test, frontend typecheck/lint, and homepage design contract.

Known limits:

- The new large-file upload flow depends on production Vercel env vars pointing
  at the deployed AWS buckets and CloudFront URL; local checks verified the route
  and UI contracts but did not upload a real large file.
- Existing unrelated dirty files were left untouched.

## 2026-05-18 - Media and contact background banner treatments

Implementation:

- Updated the media highlights page so the hero image and each highlight card
  sit behind their text, with vertical fades into the dark page background.
- Updated the contact page to match that treatment: `/media/contact-banner.jpg`
  is now the full hero background behind the contact copy instead of a separate
  right-side image panel.
- Added static and browser harness selectors for the new contact treatment:
  `data-contact-hero-background` and `data-contact-hero-vertical-fade`.
- Extended the existing media harness selectors for the background-backed media
  hero and highlight cards.

Verification:

- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm test:homepage-design`: passed.
- Manual `pnpm exec agent-browser open http://127.0.0.1:3000/contact`,
  `wait --load networkidle`, `screenshot --annotate`, and `snapshot -i`:
  passed; screenshot showed the contact banner behind the hero text with the
  dark vertical handoff.
- `VERIFY_URL=http://127.0.0.1:3000 pnpm verify:browser`: passed, including
  `MEDIA_HIGHLIGHTS_OK` and `CONTACT_OK`.

Known limits:

- This pass did not re-run `./init.sh`; the change is frontend-only and the
  focused verification above passed against the already-running local app.
- Existing unrelated dirty files were left untouched.

## 2026-05-17 - LocalStack CMS write-path fix and browser regression recovery

- Fixed the admin CMS save path by defaulting the AWS client config to LocalStack in development when `AWS_ENDPOINT_URL` is unset.
- Confirmed the first team draft row now saves and persists in `/admin/team` after editing `Alex Rivera` to `Mechanical Lead X`.
- Re-ran `VERIFY_URL=http://localhost:3000 pnpm verify:cms-admin`; it passed with `DEV_LOGIN_CLICKED`, `ADMIN_DASHBOARD_OK`, `TEAM_DRAFT_EDIT_OK`, `TEAM_PUBLISH_MOVED_OK`, `RECRUITMENT_ADMIN_OK`, `PARTNERS_ADMIN_OK`, and `ASSETS_ADMIN_OK`.

Verification:

- `VERIFY_URL=http://localhost:3000 pnpm verify:cms-admin`: passed.
- Manual browser save on `/admin/team`: passed after the LocalStack default fix.

## 2026-05-17 - Homepage hero slogan: Tomorrow, Today.

- `HomepageHero` `SLOGAN` is **`Tomorrow, Today.`** (typed effect); first line **`Tomorrow,`** then **`Today.`** (`LINE_BREAK_INDEX` 9).
- Harness: `test-homepage-design.mjs` asserts the string literal; `verify-browser.mjs` homepage contract checks `h1[data-full-text]` / `dataset.fullText === \"Tomorrow, Today.\"` (`MISSING_SLOGAN_DATA` if wrong).

Verification: `pnpm test:homepage-design`: passed (`sunswift-website-v3`).

## 2026-05-17 - Harness logs: hero navbar vignette, footer contracts, process

**Agent workflow:** Whenever you change behaviour covered by `scripts/test-homepage-design.mjs` or `scripts/verify-browser.mjs` (or their assertions/selectors), update **`feature_list.json`** (evidence / `last_run` on affected features) and **`claude-progress.md`** in the **same batch of work**—not only at end of session. See **`AGENTS.md`** under *Required Artifacts*.

### Landing hero — `TransparentNavbar` (`app/page.tsx` → `heroEdgeVignette`)

- Top wash matches the **vehicles gallery** gradient *shape* but **hero-only** tuning: band **`h-[8.75svh]`**, softer stops **`rgba(0,0,0,0.6)_0%`**, **`rgba(10,12,14,0.55)_30%`**, **`rgba(10,12,14,0.33)_70%`**, transparent foot.
- DOM hooks for static + browser harness: **`data-homepage-navbar-vignette`**, **`data-homepage-navbar-vignette-top`**, **`data-homepage-top-vignette`**.
- Browser: **`MISSING_HOMEPAGE_NAVBAR_VIGNETTE`**, **`MISSING_HOMEPAGE_NAVBAR_VIGNETTE_TOP`** if nodes missing.

### Persistent footer — `SiteFooter` / `site-shell.tsx`

- **`::before`** top vignette: **`before:-top-40 before:h-40`**, **`sm:before:-top-48 sm:before:h-48`**, multi-stop dark blend into **`#050607`** (no hard top border).
- Static contract: **`before:-top-40`**, gradient + shadow strings; editorial **h2** *Built by Students, Driving Sustainability.* with **`lg:text-5xl`** (replacing older “Tomorrow, Today.” headline assertions).
- **`siteFooterContract`** in **`verify-browser.mjs`**: phrases + h2 finder aligned with that copy.

### `feature_list.json` touched this pass

- **`opal-minimal-hero-scroll-contract`**: `last_run` **2026-05-17**; evidence for navbar vignette hooks + `verify-browser` errors; cross-ref zoom-reveal wipe removal.
- **`persistent-compact-unsw-footer`**: `last_run` **2026-05-17**; evidence for extended `::before` vignette + headline/type assertions.

Verification: **`pnpm test:homepage-design`**: passed (`sunswift-website-v3`).

## 2026-05-17 - Remove zoom-reveal black frame (hero → focus section)

- Dropped the scroll-driven black handoff layer in `HomepageZoomReveal` (`[data-homepage-zoom-wipe]`, `bg-black` wipe, `--zoom-wipe-y`, and `.homepage-zoom-wipe` in `globals.css`) so the first scroll section sits cleanly after the hero without an intermediate black frame.
- Focus-reveal scroll behaviour for the SR8 render and “Built by Students. / Driving Sustainability.” headline is unchanged (opacity, glide, tone, render opacity).

Harness:

- `scripts/test-homepage-design.mjs` now requires absence of wipe hooks and the removed `.homepage-zoom-wipe` CSS block.
- `scripts/verify-browser.mjs` `focusRevealEffectWorks` fails if `[data-homepage-zoom-wipe]` is present; scroll reaction is asserted via headline opacity/transform/colour (no `--zoom-wipe-y`).

Verification: `pnpm test:homepage-design`, `pnpm typecheck` passed (`sunswift-website-v3`).

## 2026-05-17 - Landing hero/admin amendment pass

Baseline:

- `./init.sh`: passed before implementation with LocalStack DynamoDB/S3, AWS build/test, frontend typecheck/lint, and homepage design contract.
- Baseline agent-browser check on `http://127.0.0.1:3000/` showed the hero still holding on the black scroll-driven state.

Implementation:

- Changed `HomepageHero` from a scroll-driven reveal to a timed one-screen intro: after 1.4 seconds the black curtain rises upward from the bottom, then the black `Today, Tomorrow` typewriter starts after reveal completion.
- Removed the hero’s white image wash and removed the zoom-reveal section’s old white sweep/top-bottom wash overlays.
- Updated the “What is Sunswift Racing?” image frame to a wider non-square treatment, removed the `SR8 in development` label, and removed the white gradient overlay.
- Removed the redundant `Three decades of solar engineering` records card, leaving the two actual records, and added a contrast-aware year colour so `2022` is readable on the white state.
- Removed the redundant `Live content summary` panel from CMS staging while keeping direct draft/published cards.
- Updated homepage static and browser verification contracts for the timed hero, simplified image overlays, two-record carousel, and dashboard copy.

Verification:

- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm test:homepage-design`: passed.
- `pnpm build`: passed.
- Manual `pnpm exec agent-browser open`, `wait --load networkidle`, `wait`, and `screenshot --annotate`: passed for the timed hero, about image, and records start on `http://127.0.0.1:3000`.
- `VERIFY_URL=http://127.0.0.1:3014 pnpm verify:browser`: passed against `next start`, including `HOMEPAGE_CONTRACT_OK`, `HERO_TIMED_INTRO_OK`, `FOCUS_REVEAL_OK`, and `RECORDS_TRANSITION_OK`.
- `VERIFY_URL=http://127.0.0.1:3000 pnpm verify:cms-admin`: passed against the existing `next dev` server, including `ADMIN_DASHBOARD_OK`, `TEAM_PUBLISH_MOVED_OK`, `RECRUITMENT_ADMIN_OK`, `PARTNERS_ADMIN_OK`, and `ASSETS_ADMIN_OK`.
- Final `./init.sh`: passed after implementation with LocalStack DynamoDB/S3, AWS build/test, frontend typecheck/lint, and homepage design contract.

Known limits:

- `verify:cms-admin` still needs the non-production dev login, so it was run against the existing `next dev` server on port 3000; public browser verification used `next start` on port 3014.
- The untracked `new_animation_task.md` file was not changed.

## 2026-05-17 - SR8 landing motion and admin CMS dashboard

Baseline:

- `./init.sh`: passed before implementation with LocalStack DynamoDB/S3, AWS build/test, frontend typecheck/lint, and homepage design contract.

Implementation:

- Replaced the landing hero with `/media/sr8-hero-render.png`, added the black-to-image upward wipe, and delayed the black `Today, Tomorrow` typewriter until the reveal completes.
- Replaced the built-by-students surface with static `/media/sr8-hero-2.png`, removed scroll-timed frame playback there, and tightened the wipe/title reveal so it no longer holds on a muddy black or blurred intermediate pane.
- Reworked the “What is Sunswift Racing?” homepage section into a more editorial layout using `/media/sr8-hero-3.png`, plus added a subtle records-section entrance ramp.
- Made team CSV import and headshot controls accept URLs, with remote headshots staged into CMS assets, and made the file upload controls visibly button-like.
- Removed the batch-publish list view so Team/Roles/Partners publishing stays grid-only with select-all and selected publish controls.
- Expanded CMS Staging into a content dashboard showing draft and published counts for team members, recruitment roles, and partners.
- Updated browser/static/admin contracts for the new landing motion, admin dashboard counts, grid-only publishing, and URL inputs.

Verification:

- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm test:homepage-design`: passed.
- `pnpm build`: passed.
- Manual `pnpm exec agent-browser open`, `wait --load networkidle`, and `screenshot --annotate`: passed against `http://127.0.0.1:3014/` for the hero, built-by-students, and Who we are sections.
- `VERIFY_URL=http://127.0.0.1:3014 pnpm verify:browser`: passed against `next start`, including `HOMEPAGE_CONTRACT_OK`, `FOCUS_REVEAL_OK`, `RECORDS_TRANSITION_OK`, and partner/team route checks.
- `VERIFY_URL=http://127.0.0.1:3000 pnpm verify:cms-admin`: passed against the existing `next dev` server, including `ADMIN_DASHBOARD_OK`, `TEAM_DRAFT_EDIT_OK`, `TEAM_PUBLISH_MOVED_OK`, `RECRUITMENT_ADMIN_OK`, `PARTNERS_ADMIN_OK`, and `ASSETS_ADMIN_OK`.
- Final `./init.sh`: passed after implementation with LocalStack DynamoDB/S3, AWS build/test, frontend typecheck/lint, and homepage design contract.

Known limits:

- `verify:cms-admin` needs the non-production dev login, so it was run against the existing `next dev` server on port 3000; `next start` was used for public browser verification on port 3014.
- The untracked `new_animation_task.md` file was not changed.

## 2026-05-17 - Achievements and records transition dead-space reduction

Baseline:

- `./init.sh`: passed before implementation with LocalStack DynamoDB/S3, AWS build/test, frontend typecheck/lint, and homepage design contract.

Implementation:

- Removed the full-screen black block handoff and void overlay from `AchievementsTimeline`.
- Shortened the achievements intro pinned range and kept the vehicle image visible through the intro exit so the timeline handoff no longer pauses on a plain black pane.
- Kept homepage record content visible until the natural records section exit, moved the compact records handoff layer behind content, and shortened the records scroll range.
- Pulled `HomepageRecruitment` closer to the records exit while delaying its opacity ramp, so `Embrace Tomorrow` enters during the handoff without a long black lead-in.
- Updated homepage static and browser contracts to enforce the new no-empty-hold transition behavior.

Verification:

- `./init.sh`: passed before implementation with LocalStack DynamoDB/S3, AWS build/test, frontend typecheck/lint, and homepage design contract.
- `pnpm test:homepage-design`: passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed.
- Manual `pnpm exec agent-browser open`, `wait --load networkidle`, `screenshot --annotate`, and `snapshot -i`: passed against `/achievements` and the homepage records-to-recruitment handoff on `http://127.0.0.1:3000`.
- `VERIFY_URL=http://127.0.0.1:3000 pnpm verify:browser`: passed, including `RECORDS_TRANSITION_OK`, `RECRUITMENT_TRANSITION_OK`, and `ACHIEVEMENTS_MOBILE_OK`.
- Final `./init.sh`: passed after artifact updates with LocalStack DynamoDB/S3, AWS build/test, frontend typecheck/lint, and homepage design contract.

## 2026-05-17 - Partners grid and publish status with draft archive

Baseline:

- `./init.sh`: passed before implementation with LocalStack DynamoDB/S3, AWS build/test, frontend typecheck/lint, and homepage design contract.

Implementation:

- Restored the public partners grid on `/partners` with `data-partners-grid` and `data-partner-card` hooks while keeping the horizontal marquee, View grid CTA, and powered-by header removed.
- Added `AdminPublishStatus` and wired it into Team, Roles, and Partners admin pages so publish actions show success, partial success, failure, or empty-selection feedback.
- Changed Team, Roles, and Partners publish actions to publish selected records and then remove the matching draft record so published drafts leave the draft list.
- Updated local CMS fallback behavior so empty draft collections stay empty instead of repopulating from public fallback data.
- Updated the AWS CMS admin publish handler to delete the draft item after writing the published item.
- Updated browser/static contracts and the CMS admin user guide for the new publish behavior.

Verification:

- `pnpm test:homepage-design`: passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed.
- `npm run build` in `aws`: passed.
- `npm test -- --runInBand` in `aws`: passed.
- Manual `agent-browser open`, `wait --load networkidle`, `screenshot --annotate`, and `snapshot -i` against `/partners`: passed and showed 35 partner cards.
- `VERIFY_URL=http://127.0.0.1:3000 pnpm verify:browser`: passed, including `PARTNERS_OK:35`.
- `VERIFY_URL=http://127.0.0.1:3000 pnpm verify:cms-admin`: passed, including `TEAM_PUBLISH_MOVED_OK:alex-rivera`.
- Final `./init.sh`: passed after artifact updates with LocalStack DynamoDB/S3, AWS build/test, frontend typecheck/lint, and homepage design contract.

## 2026-05-17 - Selective batch publishing and landing repair

Baseline:

- `./init.sh`: passed before implementation with LocalStack DynamoDB/S3, AWS build/test, frontend typecheck/lint, and homepage design contract.

Implementation:

- Added selected batch publishing server actions for team members, recruitment roles, and partners.
- Added a shared `AdminBulkPublishPanel` with selectable record buttons, Select all/Clear all, list/grid view toggle, Zoom out/Comfortable density toggle, live selected count, and selected-only form submission.
- Replaced the team-only `Publish all team members` control with selected publishing; kept existing per-record Publish buttons on team, roles, and partners.
- Updated the CMS admin browser regression to validate team, recruitment, and partner selected batch publishing controls.
- Changed `HomepageImageSequence` to default to poster-only until explicitly enabled, preserving the frame-sequence prep while avoiding absent-frame black/fallback states.
- Tightened the zoom reveal and about image overlays so the vehicle poster surfaces remain visible and the two-line slogan stays stable.
- Repaired `HomepageRecords` so carousel content stays visible through the black wipe and clears only near the final handoff, avoiding the empty black frame shown in the screenshot.
- Reduced the shared footer from oversized large type to a more compact dark editorial footer.
- Updated `CMS_ADMIN_USER_GUIDE.md`, `feature_list.json`, `scripts/test-homepage-design.mjs`, `scripts/verify-browser.mjs`, and `scripts/verify-cms-admin.mjs`.

Verification:

- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm test:homepage-design`: passed.
- `pnpm build`: passed.
- Manual `agent-browser open`, `wait --load networkidle`, `screenshot --annotate`, and `snapshot -i`: passed against `http://127.0.0.1:3000` for the homepage and admin team page.
- Admin manual browser check confirmed grid view, Zoom out, Select all -> Clear all, and `Publish selected team members (11)`.
- `VERIFY_URL=http://127.0.0.1:3000 pnpm verify:browser`: passed.
- `VERIFY_URL=http://127.0.0.1:3000 pnpm verify:cms-admin`: passed.
- Final `./init.sh`: passed after artifact updates with LocalStack DynamoDB/S3, AWS build/test, frontend typecheck/lint, and homepage design contract.

## 2026-05-17 - Team CMS gating, partners simplification, footer redesign, and landing animation prep

Baseline:

- `./init.sh`: passed before implementation with LocalStack DynamoDB/S3, AWS build/test, frontend typecheck/lint, and homepage design contract.

Implementation:

- Team admin now gates manual department and hierarchy inputs through the approved dropdown values, keeps role/name/additional roles free text, hides slug/discipline/bio fields, and exposes a top-level `Publish all team members` action.
- Team CSV import now ignores vestigial Webflow slug/discipline/bio columns, generates member keys from names, overwrites matching draft records by generated slug or normalized name, and preserves an existing draft headshot unless the import supplies a replacement.
- Public team roster now shows total present departments instead of an in-view count, uses `member/members` copy, and no longer renders discipline badges.
- Partners page now keeps the hero, overview copy, partner count summary, and contact CTA while removing the marquee, partner grid, View grid CTA, and powered-by header.
- Shared footer was redesigned into a dark large-type editorial footer with nav links, brand/legal row, UNSW logo, and Linktree CTA.
- Homepage records wipe now clears intro/carousel content around the hard black takeover to avoid the split unreadable frame.
- Homepage recruitment streams are now a state-driven accessible accordion with buttons, `aria-expanded`, regions, stable grid-row reveal, and no blur.
- `Built by Students. Driving Sustainability.` is locked to two explicit lines with stable letter spacing.
- Added `HomepageImageSequence` prep for `/homepage-sequences/hero`, `/homepage-sequences/zoom-reveal`, and `/homepage-sequences/about`, expecting `frame_000.webp` through `frame_080.webp` while falling back to the current poster imagery if frames are absent.
- Updated `CMS_ADMIN_USER_GUIDE.md`, `scripts/test-homepage-design.mjs`, `scripts/verify-browser.mjs`, and `scripts/verify-cms-admin.mjs` for the new contracts.

Verification:

- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm test:homepage-design`: passed.
- `pnpm build`: passed.
- `npm run build` in `aws`: passed.
- `npm test -- --runInBand` in `aws`: passed.
- Manual `agent-browser open`, `wait --load networkidle`, `screenshot --annotate`, and `snapshot -i`: passed against `http://localhost:3012`.
- `VERIFY_URL=http://localhost:3012 PATH="$PWD/node_modules/.bin:$PATH" pnpm verify:browser`: passed against `next start`.
- `VERIFY_URL=http://localhost:3000 PATH="$PWD/node_modules/.bin:$PATH" pnpm verify:cms-admin`: passed against the existing non-production `next dev` server.
- Final `./init.sh`: passed after artifact updates with LocalStack DynamoDB/S3, AWS build/test, frontend typecheck/lint, and homepage design contract.

## 2026-05-16 - Meet the Team Webflow-aligned layout harness

Implementation (layout only; hero copy unchanged):

- `TeamRoster` stacks four hierarchy bands (`[data-team-section]`: Academic → SLT → ELT → Team) with headings matching the Webflow-style ladder while keeping the dark theme + sticky `[data-team-filter]`.
- Department filter still applies per-section; empty bands are omitted.
- Smaller portrait cards / denser grid and increased horizontal padding on the roster block.
- Page-load entrance for filter + grids: `.team-roster-reveal`, `.team-roster-section-reveal` in `app/globals.css`, skipped when `prefers-reduced-motion: reduce`.

Verification:

- `pnpm typecheck`: passed (`sunswift-website-v3`).
- `pnpm test:homepage-design`: passed.
- `pnpm build`: passed (`next build`).
- `VERIFY_URL=http://127.0.0.1:3011 PATH="$PWD/node_modules/.bin:$PATH" node scripts/verify-browser.mjs` with `pnpm exec next start -p 3011`: passed (includes `TEAM_CONTRACT_OK:2` after filtering to Business on `/team`).

## 2026-05-16 - Admin manual add/delete flows + user guide

Baseline verification:

- `./init.sh`: passed with LocalStack DynamoDB/S3, AWS build/test, frontend typecheck/lint, and homepage design contract.

Implementation:

- Added manual create forms and delete actions for team members, recruitment roles, and partners in the admin dashboard.
- Added CMS delete support across the Next.js CMS API facade, local DynamoDB helpers, and the CMS admin lambda.
- Wrote a new admin user guide covering drafts/publish flows and registered media assets, and linked it from `CMS_ADMIN_SETUP.md`.

Verification:

- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm test:homepage-design`: passed.
- `npm run build` in `aws`: passed.
- `npm test -- --runInBand` in `aws`: passed.

## 2026-05-16 - Admin theme switch placement

Implementation:

- Replaced the admin theme icon button with a labeled switch, placed under the account info and above the navigation list in the sidebar.

Verification:

- `pnpm typecheck`: passed.
- `pnpm lint`: passed.

## 2026-05-16 - Admin regression + vehicles detail alignment

Implementation:

- Aligned the vehicles detail heading block with the overview panel by padding the name/summary block on large screens.
- Ran the admin browser regression against the running dev server to confirm the new theme switch placement.

Verification:

- `VERIFY_URL=http://localhost:3000 pnpm verify:cms-admin`: passed.

## 2026-05-16 - Admin dashboard theme toggle and footer removal

Baseline verification:

- `./init.sh`: passed with LocalStack DynamoDB/S3, AWS build/test, frontend typecheck/lint, and homepage design contract.

Implementation:

- Routed the root layout through a theme boundary so admin pages can use an unfrozen theme provider while public pages stay forced-light.
- Added an admin theme toggle button in the CMS sidebar with a dedicated localStorage key.
- Kept the shared SiteFooter in the root layout for the harness, but hid it on `/admin` routes via a client visibility gate.

Verification:

- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm test:homepage-design`: passed.

## 2026-05-15 - LocalStack DynamoDB CMS Harness

- Startup check found `claude-progress.md` missing, `feature_list.json` empty,
  no commits on `main`, and `./init.sh` failing with permission denied.
- Selected `localstack-dynamodb-cms-harness` as the active feature because the
  feature list had no unfinished entries and the user requested local CMS
  bootstrap work.
- Baseline checks before changes:
  - `npm run build` in `aws`: passed.
  - `npm test -- --runInBand` in `aws`: failed because the generated test still
    expected an SNS topic that the current stack does not create.
  - `pnpm typecheck` in `sunswift-website-v3`: passed.
  - `pnpm lint` in `sunswift-website-v3`: passed with one existing unused
    `Geist` warning in `app/layout.tsx`.

Current implementation work:

- Added LocalStack Docker/Compose harness for DynamoDB.
- Added a LocalStack init hook to create and seed `WebsiteV3CMS`.
- Rebuilt `init.sh` as the standard startup and smoke verification path. The
  script starts LocalStack, waits for DynamoDB, applies the CMS bootstrap hook
  idempotently, then verifies the table.
- Updated the CDK test to verify the CMS DynamoDB table instead of the stale SNS
  sample expectation.

Verification after changes:

- `bash -n init.sh`: passed.
- `bash -n localstack/init/ready.d/10-create-cms-table.sh`: passed.
- `docker compose -f docker-compose.localstack.yml config`: passed.
- `git diff --check`: passed.
- `npm run build` in `aws`: passed.
- `npm test -- --runInBand` in `aws`: passed.
- `pnpm typecheck` in `sunswift-website-v3`: passed.
- `pnpm lint` in `sunswift-website-v3`: passed with one existing unused `Geist`
  warning in `app/layout.tsx`.
- `./init.sh`: blocked because the Docker daemon is not reachable in the
  current environment. The script now fails fast with a direct Docker daemon
  message before attempting LocalStack startup.

Verification rerun:

- `./init.sh` rerun on 2026-05-15: still blocked at Docker daemon health check
  with `Docker daemon is not reachable. Start Docker, then rerun ./init.sh.`

## 2026-05-15 - Sunswift Redesign Foundation + Webflow Import

- Selected `sunswift-redesign-foundation-webflow-import` as the active feature
  after the user approved the plan and requested implementation.
- Baseline `./init.sh` initially failed because `localstack/localstack:latest`
  resolved to a dev/pro image requiring `LOCALSTACK_AUTH_TOKEN`.
- Fixed the harness by pinning LocalStack to `4.10.0`, adding S3 to the local
  services, and making DynamoDB/S3 bootstrap idempotent against startup races.
- Added a Webflow text import script with a hardcoded route allowlist and stored
  imported copy in `sunswift-website-v3/content/webflow-pages.json`.
- Implemented the redesigned homepage, public route shells, garage-style
  vehicles page, dynamic team/recruitment pages, CMS data helpers, S3 asset
  route, and Auth.js Google admin foundations.
- Added admin routes for login, overview, team editing/headshot staging, and
  recruitment role editing/publishing.
- Updated CDK to include an S3 bucket for CMS assets.

Verification:

- `./init.sh`: passed with LocalStack DynamoDB and S3.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed.
- `npm run build` in `aws`: passed.
- `npm test -- --runInBand` in `aws`: passed.
- Dev server HTTP smoke: `/`, `/who-we-are`, `/what-we-do`, `/team`,
  `/vehicles`, `/partners`, `/media`, `/recruitment`, `/contact`, and
  `/admin/login` returned 200.
- Content smoke confirmed vehicles page includes `Garage archive`, `Sunswift 7`,
  and `Related posts`; admin login includes `Sunswift CMS`, `Admin login`, and
  `Continue with Google`.

Known limits:

- `agent-browser` is not installed, so visual browser automation screenshots
  were not available. HTTP smoke checks were used instead.
- Dev server logs show an AWS SDK warning that future SDK versions after
  January 2027 will require Node 22; current checks still pass on Node 20.18.2.

## 2026-05-15 - Opal-Inspired Light Homepage + Browser Verification

- Selected `opal-light-homepage-browser-verification-readme` after the user
  requested the Vercel agent-browser skill, a lighter Opal Tadpole-inspired
  visual pass, Roobert-like type, a one-image hero, and human README docs.
- Read the `vercel:agent-browser` workflow and added repo instructions to use
  browser verification whenever a dev server is started.
- Updated the public theme to default light, with a warmer off-white palette,
  Roobert-first font stacks, lighter header/footer surfaces, and a brighter
  local placeholder hero image.
- Reworked the homepage hero around one large image and the side slogan
  `Tomorrow, Today`.
- Added root and app README guidance for local setup, LocalStack CMS env vars,
  Webflow import, checks, browser verification, and deploy testing.
- Added `agent-browser` as a local dev dependency and `pnpm verify:browser` as
  the repeatable browser verification path.

Verification:

- Baseline `./init.sh`: passed before changes.
- `pnpm exec agent-browser install`: installed Chrome 148.0.7778.167 for the
  local verifier.
- `pnpm verify:browser`: passed against the dev server, including desktop
  1440x1000 and mobile 390x844 screenshots, content checks, dev-overlay checks,
  and horizontal-overflow checks.
- HTTP smoke while the dev server was running: `/`, `/vehicles`, and
  `/admin/login` returned 200.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed.
- Final `./init.sh`: passed with LocalStack DynamoDB/S3, AWS build/test, and
  frontend typecheck/lint.

Known limits:

- Browser verification currently covers the homepage visual pass only. OAuth
  login completion still requires real Google OAuth credentials.

## 2026-05-15 - Opal-Style Minimal Hero + Scroll Contract

- Selected `opal-minimal-hero-scroll-contract` after the user asked to fully
  embrace the Opal Tadpole landing-page language, remove public shadcn-like
  homepage elements, keep the hero to only a slogan and image, add scroll
  effects, and add testing to the harness.
- Checked the live Opal Tadpole reference with `agent-browser`; the relevant
  hero traits were full-bleed dark photographic image, large thin left-side
  headline, and restrained motion/scroll behavior.
- Replaced `/` with a dedicated homepage component instead of the shared public
  `PageFrame`, leaving the hero with only `Tomorrow, Today` and a full-bleed
  image.
- Reworked the local hero placeholder into a dark product-style solar car image
  and added scroll-reactive image/title motion.
- Added `pnpm test:homepage-design` for a static homepage design contract and
  wired it into `./init.sh`.
- Strengthened `pnpm verify:browser` to check the homepage contract in-browser:
  one slogan, image present, no public links/buttons/nav/header/footer/paragraph
  chrome, no dev overlay, no horizontal overflow, and active scroll motion.
- Updated README and AGENTS guidance so future sessions keep the homepage
  contract and browser verification in the harness workflow.

Verification:

- Baseline `./init.sh`: passed before changes.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm test:homepage-design`: passed.
- `pnpm build`: passed.
- `pnpm verify:browser`: passed on desktop 1440x1000 and mobile 390x844,
  including homepage contract and scroll-effect checks.
- Final `./init.sh`: passed with LocalStack DynamoDB/S3, AWS build/test,
  frontend typecheck/lint, and homepage design contract.

Known limits:

- The hero image is still a local placeholder SVG; it is structured for easy
  replacement with real Sunswift photography later.

## 2026-05-15 - Remove Opal Naming, Transparent Navbar, About Section

- Renamed `components/site/opal-homepage-hero.tsx` to
  `components/site/homepage-hero.tsx` and exported `HomepageHero`. Removed all
  internal Opal references from the homepage hero, CSS hooks, and harness.
- Renamed CSS hooks `.opal-hero-image` and `.opal-hero-title` to
  `.homepage-hero-image` and `.homepage-hero-title`.
- Added `components/site/transparent-navbar.tsx` with a transparent overlay
  navbar (`About Us`, `Our Team`, `Vehicles`, `Partners`, `Media`,
  `Recruitment`, `Contact`) plus a `Join the team` CTA, sitting on top of the
  dark hero.
- Added `components/site/homepage-about.tsx` extending the hero with the
  Sunswift `What is Sunswift Racing?` copy and a placeholder garage image.
- Updated `app/page.tsx` to compose `TransparentNavbar`, `HomepageHero`, and
  `HomepageAbout` while preserving `main[data-homepage]`.
- Tightened `pnpm test:homepage-design` to assert the new homepage contract:
  no Opal references in source, hero/navbar/about components present and
  wired, navbar transparent and containing all seven Sunswift links, and the
  about copy fragments present.
- Updated `pnpm verify:browser` homepage contract to require the navbar with
  every Sunswift link and the about section copy, while keeping slogan, hero
  image, and scroll-effect checks.

Verification:

- `pnpm test:homepage-design`: passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed.

Known limits:

- Placeholder SVG images remain for both the hero and the about section.
- `pnpm verify:browser` requires a running dev server and was not rerun in
  this session because the local dev server was not started; the harness
  contract is updated and ready for the next browser run.

## 2026-05-15 - Typing Hero Slogan + Guinness Records Section

- Updated the homepage hero slogan to `Tomorrow, Today.` with a JS-driven
  typewriter effect that reveals one character at a time after a brief
  start delay and ends with a blinking caret. SSR keeps a screen-reader-only
  full slogan so the hero is accessible even before hydration.
- Exposed `data-full-text` and `data-typing-complete` on the hero `h1` so the
  browser harness can wait for the typing animation to finish without
  relying on `textContent` snapshots.
- Added `components/site/homepage-records.tsx`: an Apple-style dark
  "Records that move the world forward." section with a three-card grid for
  the 1,000 km single-charge Guinness record, the FIA solar-speed record,
  and the seven-cars-since-1996 record. Each card uses a placeholder image,
  thin display type, monospaced micro-labels, and a hairline grid frame.
- Wired the new section into `app/page.tsx` below the about block.
- Added a caret blink keyframe and reduced-motion guard to
  `app/globals.css`.
- Tightened `pnpm test:homepage-design`: requires the new slogan with the
  period, typing timer + `sr-only` + `data-full-text` + caret hooks in the
  hero, and the records section component + the three record IDs.

- Tightened `pnpm verify:browser`: now waits for `data-typing-complete=true`
  before treating the slogan as ready, and verifies the records section,
  three record cards, and key copy (Guinness World Records, 1,000) on both
  desktop and mobile viewports.

Verification:

- `pnpm test:homepage-design`: passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed.

Known limits:

- Records section still uses placeholder vehicle SVGs; swap for hero
  photography of Sunswift 7, eVe, and Violet when assets land.
- `pnpm verify:browser` not rerun this session (no dev server started); the
  updated contract is ready for the next browser pass.

## 2026-05-15 - Statement Section, Records Kicker Removed, Vehicles Gallery

- Removed the `Guinness World Records` kicker label above the records
  headline; the section now opens directly with the display headline. The
  body copy still references the records the team holds.
- Added `components/site/homepage-statement.tsx`: an Opal-style full-bleed
  dark statement section with a huge thin `Solar mobility, reimagined.`
  headline. Mounted in `app/page.tsx` between the hero and the about block.
- Expanded `lib/cms/static-data.ts` `vehicles` from three to all seven
  Sunswift cars (Sunswift 7, VIolet, eVe, IVy, III, II, I) with the
  Webflow-sourced specifications, achievements, and summaries.
- Added four placeholder SVGs (`vehicle-ivy.svg`, `vehicle-iii.svg`,
  `vehicle-ii.svg`, `vehicle-i.svg`) so each car has its own visual until
  3D renders arrive.
- Replaced `/vehicles` with a full-page client gallery
  (`components/site/vehicles-gallery.tsx`): a flex strip of all seven cars,
  hover-to-expand with siblings dimmed and desaturated, click-to-open
  full-page detail view with specs, achievements, and related posts. The
  page now uses the `TransparentNavbar` instead of the shared `PageFrame`.
- Hooks added for verification: `data-vehicles-gallery`, `data-vehicle-card`,
  `data-vehicle-slug`, `data-hovered`, `data-dimmed`, `data-vehicle-detail`.
- Updated `pnpm test:homepage-design`: requires the statement section
  component, mount order hero → statement → about, statement headline
  exposure, and asserts the records section no longer renders the Guinness
  kicker. The records section headline assertion replaces the previous
  Guinness-text check.
- Updated `pnpm verify:browser`: now also checks for `data-homepage-statement`
  with a non-empty `h2`, and uses the records headline rather than the
  removed kicker for in-browser verification.

Verification:

- `pnpm test:homepage-design`: passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed (vehicles still prerenders as static).

Known limits:

- 3D vehicle renders are intentionally deferred — placeholder SVGs continue
  to stand in for the gallery and detail views.
- Vehicle detail is rendered in client state without a routed `/vehicles/[slug]`
  page; revisit when share/deep-link support is needed.

## 2026-05-15 - Mono Theme + Vehicles Layout Flip + Fancy Transitions

- Reworked the global palette in `app/globals.css` to a true monochrome:
  pure white background, near-black foreground, neutral muted/border/ring,
  and a punchier yellow primary. Added `--accent-yellow` / `--color-accent-yellow`
  CSS variables so components can opt into yellow utilities via
  Tailwind v4's `@theme inline` block (e.g. `text-accent-yellow`,
  `border-accent-yellow`, `bg-accent-yellow`).
- Updated the `TransparentNavbar` so logo, nav links, and the `Join the team`
  pill animate to Sunswift yellow on hover; the pill swaps to a yellow fill
  with black text. The CTA carries `data-cta-join` for future verification.
- Flipped the `/vehicles` layout: the seven-car flex strip now occupies the
  top ~72% of the viewport, with the `Seven cars. One vision.` headline and
  helper copy anchored at the bottom. The headline includes a muted
  contrast tail (`One vision.` rendered at 40% white) for that monochrome,
  Apple-product feel.
- Added staggered motion to the gallery: each card rises and unblurs in
  sequence (`vehicle-card-rise` keyframes), the headline and helper copy
  fade up with delays, and yellow accents (`+` indicator, `Open →` arrow,
  hover ring) light up on hover. The gallery now also gracefully fades out,
  lifts, and blurs when a card is selected, while the detail view scales in
  with `vehicle-detail-in`. A `prefers-reduced-motion` guard disables the
  animations.
- Yellow continues to highlight important UI: detail-view `Garage` back
  button hover, achievement bullets, and the records section bullet stay
  monochrome; only deliberate moments cue the brand colour.

Verification:

- `pnpm test:homepage-design`: passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed.

Known limits:

- The shared `PageFrame` chrome still references `text-primary` for
  iconography; those accents will pick up the new yellow but were not
  audited per-page. Audit is queued for the next visual pass.
- Vehicle gallery transitions tuned for desktop; mobile layout keeps the
  same flow but receives less motion via Tailwind responsive states.

## 2026-05-15 - Vehicles Card Click Choreography + Uniform Card Text

- Reworked each gallery card's content block so the year + name baseline
  is identical across every card regardless of hover/dim state.
  - Fixed-height content footer (`h-[140px] sm:h-[160px]`) anchors text
    to the bottom of every card.
  - The car name now renders at a constant `text-lg sm:text-2xl` with
    `truncate` so narrow dimmed cards collapse with an ellipsis instead
    of changing layout. The vertical-writing-mode hack on dimmed cards
    is gone.
  - Year kicker stays a constant `font-mono text-[0.6rem]`, picking up
    the accent-yellow tint only on hover/click.
  - Summary + `Open →` reveal/hide via `max-height` + `opacity` so
    they expand the visible content area without nudging the static
    year/name baseline.
- Added a cinematic click effect:
  - New `clicking` client state captures the slug being opened.
  - The clicked card expands to `flex-[14]`, lifts its image to
    `scale-[1.12]`, gains a yellow-tinted border and a soft yellow glow
    shadow, and emits a `vehicle-click-pulse` ring from its centre.
  - All other cards collapse to `flex-[0.35]`, lift slightly, fade to
    zero opacity, and blur out simultaneously.
  - After `CLICK_TRANSITION_MS` (520 ms) the detail view mounts and the
    gallery fades up/blurs out as before. During the click animation,
    pointer events on cards are disabled to prevent double-trigger.
- Added `vehicle-click-pulse` keyframes + `.vehicle-click-pulse` class
  to `app/globals.css` for the expanding yellow ring; reduced-motion
  guard already covers all vehicle gallery animations.

Verification:

- `pnpm test:homepage-design`: passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed (fixed an initial `react-hooks/set-state-in-effect`
  warning by tightening the click effect cleanup logic).
- `pnpm build`: passed.

Known limits:

- Truncation only matters when many cards squish to dimmed widths; for
  very long names this means the trailing characters get clipped, which
  is intentional for visual balance.

## 2026-05-15 - Statement Removed, Zoom Tone Darkens on Scroll

- Removed the `HomepageStatement` section from the landing page and
  deleted `components/site/homepage-statement.tsx`. The zoom-reveal
  scroll moment is now the only big-text beat between the hero and the
  about block.
- Rebuilt `components/site/homepage-zoom-reveal.tsx` around a light
  canvas (`#f6f5f1`) so the headline can travel from faint gray to
  near-black on scroll:
  - The scroll-progress now also drives a `--zoom-text-color` custom
    property: `rgb(186,186,186)` at progress 0 eases via
    `Math.pow(t, 0.85)` to `rgb(12,12,12)` by ~65% scroll, matching the
    progressively-darkening Opal-style headline reference.
  - Background vehicle render is no longer dimmed-with-dark filter;
    it now uses a soft `grayscale(0.85) brightness(1.1)` look and fades
    in from `opacity: 0.18` to `0.65` as scroll progresses via a new
    `--zoom-render-opacity` custom property.
  - Top + bottom fades changed from black to the light canvas tone, so
    the section blends into the surrounding light surfaces.
- `app/page.tsx` order is now: Hero → ZoomReveal → About → Records.
- `app/globals.css`:
  - `.homepage-zoom-text` adds `color: var(--zoom-text-color)` and a
    short `transition: color 120ms linear` for smooth tone updates.
  - `.homepage-zoom-render` adds `opacity: var(--zoom-render-opacity)`.
  - `prefers-reduced-motion` block now sets a fixed dark text color and
    a sane render opacity so the static fallback still reads.
- Harness extended/updated in `scripts/test-homepage-design.mjs`:
  - Page must no longer reference `<HomepageStatement>` and the
    `components/site/homepage-statement.tsx` file must not exist.
  - Page order is now Hero → ZoomReveal → About → Records.
  - Zoom-reveal must drive `--zoom-text-color` and interpolate it from
    a gray channel via `rgb(${channel}, ${channel}, ${channel})`.
  - Section must use a light canvas (`bg-[#f6f5f1]` or `bg-white`) and
    must not use `bg-black` or a heavy dark text-shadow.
  - `globals.css` must declare `color: var(--zoom-text-color)` and
    `opacity: var(--zoom-render-opacity)`.

Verification:

- `pnpm test:homepage-design`: passed (newly extended).
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed.

## 2026-05-15 - Zoom-Reveal Section with Vehicle Render Placeholder

- Added `components/site/homepage-zoom-reveal.tsx`, a new full-bleed
  scroll-driven section that sits between the existing statement
  section and the about block on the landing page.
- Behaviour mirrors the Opal Tadpole reveal beat: the headline starts
  far away (`scale(0.42)`) and gently expands toward the viewer to
  `scale(~1.18)` as the user scrolls, with letter-spacing tightening
  and opacity ramping in. A vehicle render placeholder behind the
  headline breathes in (`scale 1.02 → 1.10`) with a small parallax
  shift (`translateY(-10vh → +10vh)`).
- Headline copy is `Built by Students. Driving Sustainability.`,
  rendered in Inter Thin (`font-thin` + `var(--font-inter)`) at
  `clamp(2.5rem, 11vw, 9.5rem)`. Top + bottom black-fade overlays
  blend the section into its dark neighbours.
- The vehicle render slot uses the SR8 placeholder SVG today; the slot
  carries `data-homepage-vehicle-render` so the live 3D render can be
  swapped in without restructuring the section.
- `app/page.tsx` order is now: Hero → Statement → ZoomReveal → About →
  Records.
- `app/globals.css` adds:
  - `.homepage-zoom-text` (Inter Thin, `clamp` sizing, transform/opacity
    driven by `--zoom-scale`/`--zoom-opacity`/`--zoom-tracking`).
  - `.homepage-zoom-render` (transform driven by
    `--zoom-render-scale`/`--zoom-render-y`).
  - A `prefers-reduced-motion` guard that flatlines both helpers.
- Harness extended in `scripts/test-homepage-design.mjs`:
  - Asserts `app/page.tsx` mounts `<HomepageZoomReveal />` and that the
    page order is Hero → Statement → ZoomReveal → About.
  - Asserts the new component exposes `data-homepage-zoom-reveal`,
    `data-homepage-zoom-text`, and `data-homepage-vehicle-render`.
  - Asserts the headline contains both `Built by Students.` and
    `Driving Sustainability.`.
  - Asserts scroll-reactivity: `useEffect`, scroll listener, and
    `--zoom-scale` / `--zoom-opacity` custom properties.
  - Asserts the headline uses `font-thin`, the section reserves
    `h-[180svh]` for scroll distance, and the inner stage is sticky
    (`sticky top-0`).
  - Asserts `globals.css` defines `.homepage-zoom-text` and
    `.homepage-zoom-render`, and that the text transform binds to
    `--zoom-scale`.
  - Includes the new component in the Opal-reference no-mention guard.

Verification:

- `pnpm test:homepage-design`: passed (newly extended).
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed.

Known limits:

- Vehicle render is a placeholder image; the live 3D render hook
  (`data-homepage-vehicle-render`) is ready to receive a `<Canvas>` or
  video element when the asset is available.

## 2026-05-15 - Removed Yellow Click Glow + Name Format Tolerance

- Removed the yellow glow shadow that wrapped the clicked vehicle card.
  The click choreography now relies on the card's expansion, image
  scale/brightness bump, the centred `vehicle-click-pulse` ring, and
  the sibling fade-out alone — no soft yellow halo around the image.
- Updated `scripts/test-homepage-design.mjs`:
  - Added a regression guard that fails if any
    `shadow-[…rgba(245,208,0…)]` (yellow) shadow utility reappears on
    the gallery cards.
  - Relaxed the abbreviated-name assertions to match the rule rather
    than the exact format: each numbered slug must match `/^SR-?N$/`
    (`SR7` or `SR-7` both pass, `SRII` or `SR-II` both pass, etc.) so
    optional hyphens are allowed. Named cars (`IVy`, `eVe`, `VIolet`)
    keep their exact required forms. The "no `Sunswift ` display
    prefix" rule still applies.

Verification:

- `pnpm test:homepage-design`: passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed.

## 2026-05-15 - Top Vignette, SR8 Card, Abbreviated Names

- Added a top vignette overlay (`data-homepage-top-vignette`) at the head
  of the vehicles gallery. It mirrors the bottom fade but inverted:
  `linear-gradient(180deg, #000 0% → rgba(10,12,14,0.92) 30% →
rgba(10,12,14,0.55) 70% → transparent 100%)` so the transparent
  navbar sits on a smooth black-to-image transition. Sits at `z-[15]`,
  below the navbar (`z-50`) and the dim/yellow accents on hover.
- Added an eighth vehicle card to `lib/cms/static-data.ts` representing
  Sunswift 8 (`slug: "sunswift-8"`, name `SR8`, years
  `2024-In Production`, summary "The next chapter, in build."), placed
  at the start of the vehicles array. Specs and achievements describe
  the in-build status and the 2025 Bridgestone World Solar Challenge
  target.
- Added a placeholder hero SVG for SR8 at
  `public/placeholders/vehicle-sunswift-8.svg` (dark canvas with a
  yellow accent burst, ready to swap for the 3D render later).
- Abbreviated every vehicle's display name in
  `lib/cms/static-data.ts`:
  - Sunswift 7 → SR7
  - Sunswift III → SRIII
  - Sunswift II → SRII
  - Sunswift I → SRI
  - Sunswift IVy → IVy
  - Sunswift eVe → eVe
  - Sunswift VIolet → VIolet
- Slugs and the underlying data fields (specs, achievements,
  relatedPosts) are unchanged, so deep-links and search continue to
  resolve. The vertical card name and the detail-view headline now
  render the abbreviated forms.
- Harness extended in `scripts/test-homepage-design.mjs`:
  - Asserts the gallery includes a `data-homepage-top-vignette`
    overlay that is `pointer-events-none`, anchored to `top-0`, and
    starts from `#000` via a vertical `linear-gradient(180deg, #000…)`.
  - Asserts `lib/cms/static-data.ts` includes a `sunswift-8` slug with
    the `SR8` name.
  - Asserts every vehicle entry uses the new abbreviated name
    (`SR7`, `SRIII`, `SRII`, `SRI`, `IVy`, `eVe`, `VIolet`) and that
    no entry retains the `Sunswift ` display prefix.

Verification:

- `pnpm test:homepage-design`: passed (newly extended).
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed.

## 2026-05-15 - Vertical Names on the Right, Inter Thin, Bottom Vignette

- Vehicle gallery card names now anchor to the right edge of each card
  (`right-4 sm:right-6`) instead of the left, with `writing-mode:
vertical-rl` still driving the top-to-bottom reading direction.
- Switched the gallery name typography to true **Inter Thin**:
  - `app/layout.tsx` now loads `Inter` via `next/font/google` with weights
    `["100", "200", "300", "400", "500", "600", "700"]`, exposes it as
    `--font-inter`, and applies `inter.variable` to the root `<html>`.
  - `.vehicle-name-vertical` in `app/globals.css` declares
    `font-family: var(--font-inter), Inter, ...` and `font-weight: 100`.
  - The gallery span swaps Tailwind `font-extralight` → `font-thin`.
- Added a bottom vignette overlay to the vehicles gallery footer area
  via `data-homepage-vignette`: a pointer-events-none absolute layer
  with `linear-gradient(180deg, transparent → rgba(10,12,14,0.55) →
rgba(10,12,14,0.92) → #000)` so the `Seven cars. One vision.`
  headline rests on a smooth fade-to-black.
- Harness extended in `scripts/test-homepage-design.mjs`:
  - Scoped a card-name span match (`data-vehicle-name … </span>`) and
    asserts `right-4`, `sm:right-6`, no remaining `left-4`, and
    `font-thin`.
  - Asserts `app/layout.tsx` loads `Inter` from `next/font/google` with
    weight `"100"`, exposes `--font-inter`, and applies the variable
    class to `<html>`.
  - Asserts `.vehicle-name-vertical` declares Inter and `font-weight:
100` in `globals.css`.
  - Asserts the gallery footer area renders a `data-homepage-vignette`
    overlay that is `pointer-events-none` with a vertical
    `linear-gradient(180deg, …, #000)` fade.

Verification:

- `pnpm test:homepage-design`: passed (newly extended).
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed.

## 2026-05-15 - Vertical Car Names + Thinner Weight + Harness Hooks

- Vehicle card names are now rendered as a vertical, top-to-bottom string
  positioned at the top-left of every card via `writing-mode: vertical-rl`,
  echoing the Sunswift Webflow vehicle gallery layout. The horizontal
  truncated name in the card content footer is gone.
- Names use `font-extralight` for a noticeably thinner weight, with a
  small text shadow and tiny negative tracking via the new
  `.vehicle-name-vertical` helper in `app/globals.css`. Size scales with
  card state: dimmed siblings shrink to a compact ~1.05rem, idle cards
  sit at ~1.25rem, hovered/clicked cards grow to ~2rem (and ~2.75rem on
  `sm:`).
- The accompanying summary copy in the hover area also stepped down to
  `font-extralight` to match the new visual weight.
- Harness now enforces this:
  - Cards must render an element with `data-vehicle-name`.
  - That element must declare `writingMode: "vertical-rl"`.
  - The element must carry the `vehicle-name-vertical` class hook.
  - `font-extralight` must appear in the gallery section.
  - `app/globals.css` must define the `.vehicle-name-vertical` helper.

Verification:

- `pnpm test:homepage-design`: passed (newly extended).
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed.

## 2026-05-15 - Title Clearance, + Indicator Removed, Harness Extended

- Raised the vehicle card content footer's bottom padding so the year +
  name baseline clears the absolutely-positioned `Seven cars. One vision.`
  footer overlay. Card content footer now reserves `h-[220px] pb-44
sm:h-[260px] sm:pb-56` (was `h-[160px] pb-32 sm:h-[200px] sm:pb-40`).
- Removed the yellow `+` indicator from the top-right of each vehicle card
  — hover/click intent is already communicated through image brightness,
  the yellow year-kicker tint, the summary reveal, and the `Open →` cue.
- Extended `scripts/test-homepage-design.mjs` so every visual contract
  established this session is now enforced by the harness:
  - Vehicles route mounts `<VehiclesGallery />` under `<TransparentNavbar />`.
  - Gallery exposes `data-vehicles-gallery`, `data-vehicle-card`,
    `data-vehicle-slug`, `data-vehicle-detail`, and `data-clicking` hooks.
  - Cards sit edge-to-edge (`gap-0`).
  - Card button surfaces are square (no `rounded-*`) and carry no white
    hairline border. The check scopes to the gallery half of the file so
    the detail view's pill chrome is allowed to keep rounded utilities.
  - Footer overlay is `pointer-events-none absolute bottom-0 bg-transparent`.
  - Card content reserves enough bottom padding (`pb-40+`) to clear the
    overlay.
  - No `+` indicator span is rendered on the card surface.
  - `globals.css` declares the `vehicle-card-rise`, `vehicle-click-pulse`,
    and `vehicle-detail-in` keyframes.
  - `ThemeProvider` forces light mode and no longer exposes a dark-mode
    hotkey.
  - `--primary` is near-black, `--primary-foreground` is white, the
    `--accent-yellow` token is exported as a Tailwind color, and `--radius`
    is small (square liquid-glass).
  - Shared `site-shell.tsx` uses translucent `bg-white/*` with
    `backdrop-blur-xl` and yellow-on-hover for nav/CTA states.
  - Transparent navbar links and `Join the team` CTA both transition to
    accent-yellow on hover.

Verification:

- `pnpm test:homepage-design`: passed (newly extended).
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed.

Known limits:

- The extended harness checks operate on source text. A future browser-
  level pass should re-run `pnpm verify:browser` to assert the same
  contract in DOM/computed-style terms.

## 2026-05-15 - Vehicles Edge-to-Edge Cards + Transparent Footer

- Removed all spacing and rounding between gallery cards: cards now sit
  edge-to-edge (`gap-0`), no `rounded-xl`, no card border, no border-color
  hover state. The dark bottom gradient on each card still grounds the
  text without requiring borders.
- Cards now fill the full gallery height via `absolute inset-0` on the
  flex strip rather than the previous `flex-[1_1_72%]` row. Card content
  has bottom padding (`pb-32 sm:pb-40`) so the year/name lift above the
  footer overlay.
- Footer is now `pointer-events-none absolute inset-x-0 bottom-0 z-20
bg-transparent` — fully transparent, layered above the cards rather
  than below them. Soft `text-shadow` keeps the headline + helper copy
  readable over any card image underneath.
- Hovered/clicked cards now bump `z-10`/`z-20` so their bottom gradient
  visually reads above neighbours instead of being clipped by them.

Verification:

- `pnpm test:homepage-design`: passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed.

## 2026-05-15 - Sustainability Focus Reveal Replaces Zoom

- Selected `homepage-sustainability-focus-reveal` after the user requested
  that the `Built by Students. Driving Sustainability.` landing-page section
  stop zooming in and use a sleeker effect instead.
- Baseline `./init.sh` failed in the sandbox because Docker was unreachable;
  reran with escalation and the harness passed before edits.
- Replaced the headline scale animation with a stable-size focus reveal:
  blur resolves from `18px` to `0px`, opacity rises, tracking tightens,
  text tone darkens, and the headline glides subtly on the y-axis.
- Added a moving light-sweep layer over the section and changed the vehicle
  render motion from scale/parallax to lateral + vertical glide.
- Updated `pnpm test:homepage-design` to assert that `--zoom-scale` is no
  longer used, while requiring `--zoom-blur`, `--zoom-text-y`, and
  `--zoom-sweep-x`.
- Updated `pnpm verify:browser` to verify the focus reveal in computed styles,
  reject scale-based transforms, ignore intentional off-canvas motion layers,
  and read hidden mobile nav labels via `textContent`.

Verification:

- `pnpm test:homepage-design`: passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed after escalation because sandboxed network blocked the
  `next/font` Google Fonts fetch.
- `pnpm verify:browser`: passed on desktop 1440x1000 and mobile 390x844; the
  focus reveal changed from `blur(18px)` to `blur(0px)` and no scale transform
  was detected.
- Final `./init.sh`: passed with LocalStack DynamoDB/S3, AWS build/test,
  frontend typecheck/lint, and homepage design contract.

Known limits:

- The component filename/data hook still says `zoom` for compatibility with
  the existing harness, but the behavior no longer zooms the headline.

## 2026-05-15 - About Dropdown + Achievements Timeline

- Selected `about-dropdown-achievements-timeline` after the user requested an
  About Us dropdown and a new achievements page based on the old Webflow
  achievements content.
- Baseline `./init.sh`: passed before changes.
- Scraped the current Webflow achievements page at
  `https://sunswift.webflow.io/about-us/achievements` and converted its
  overview + 1996-2023 milestone copy into repo-managed static data.
- Updated both transparent and shared nav bars so `About Us` is a dropdown
  containing `Who We Are` (`/who-we-are`) and `Achievements` (`/achievements`).
- Added `/achievements` with `AchievementsTimeline`: a dark vehicles-style
  page with full-bleed active media, horizontal snap-scrolling milestone cards,
  and active year/title/description changing as the rail scrolls.
- Extended `pnpm test:homepage-design` to enforce the dropdown, achievements
  route, timeline hooks, horizontal scrolling, active state, and key Webflow
  achievement copy.
- Extended `pnpm verify:browser` to verify the homepage dropdown and the
  achievements page in a real browser, including horizontal timeline scroll
  changing the active year.

Verification:

- `pnpm test:homepage-design`: passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed; `/achievements` generated as a static route.
- `pnpm verify:browser`: passed; homepage dropdown exposed `Who We Are` and
  `Achievements`, `/achievements` rendered the timeline, and horizontal scroll
  changed active year from 2023 to 1996.
- Final `./init.sh`: passed with LocalStack DynamoDB/S3, AWS build/test,
  frontend typecheck/lint, and homepage design contract.

Known limits:

- Achievement media currently reuses placeholder vehicle SVGs. Swap each
  milestone's `image` field for final image/video preview assets when ready.

## 2026-05-15 - Premium About Dropdown + Scroll-Driven Achievements

- Selected a new frontend-only slice after the user requested dropdown polish
  and a vertical-scroll-driven achievements timeline.
- Skipped `./init.sh` because the user explicitly said LocalStack is not
  installed and requested no LocalStack-dependent testing.
- Baseline frontend checks:
  - `pnpm test:homepage-design`, `pnpm typecheck`, and `pnpm lint` were blocked
    by Corepack signature lookup on Node 25.8.0.
  - Equivalent local binary checks passed:
    `node scripts/test-homepage-design.mjs`,
    `./node_modules/.bin/tsc --noEmit`, and `./node_modules/.bin/eslint`.
- Updated both public nav variants so `About Us` has a chevron dropdown
  affordance and opens a more editorial glass menu with directional row arrows,
  labels for Mission/Records, deeper blur, and a yellow top rule.
- Reworked `/achievements` into a sticky vertical-scroll section: page scroll
  now translates the horizontal milestone rail, updates the active year, fades
  the intro/current copy away after scrolling starts, leaves a media-first
  minimal year/title overlay, and adds a bottom year/progress rail.
- Updated `pnpm test:homepage-design` and `pnpm verify:browser` contracts to
  assert the chevron dropdown, vertical-scroll horizontal rail, fading copy,
  minimal copy state, and bottom year rail.

Verification:

- `node scripts/test-homepage-design.mjs`: passed.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint`: passed.
- `./node_modules/.bin/next build`: passed and generated `/achievements`.
- `pnpm` command wrappers remain blocked by the Corepack keyid/signature error
  in this environment; local project binaries were used instead.
- Existing dev server on `http://localhost:3000` was reused because it already
  held the Next dev lock; a second server on 3001 could not start.
- `PATH="$PWD/node_modules/.bin:$PATH" VERIFY_URL=http://localhost:3000 node
scripts/verify-browser.mjs`: passed on desktop/mobile homepage checks and
  `/achievements`, including `ACHIEVEMENTS_CONTRACT_OK:2023->2011`.
- Additional `agent-browser` scrolled-state pass on `/achievements` captured an
  annotated screenshot after vertical scrolling and confirmed the horizontal
  timeline/year rail state was visible.

Known limits:

- `./init.sh` and AWS/CDK checks were intentionally not run because they require
  the LocalStack/Docker harness the user asked to avoid for this session.

## 2026-05-15 - Achievements Intro Separation + Compact Timeline Fit

- Selected a frontend-only follow-up after the user asked for the achievements
  timeline to stay visible while vertical scrolling, with smaller responsive
  cards, and for the `A timeline of solar racing milestones.` copy to be its
  own section instead of sharing the first milestone stage.
- Skipped `./init.sh` again because this remains frontend-only and the user
  previously asked not to run LocalStack-dependent testing.
- Split `AchievementsTimeline` into a standalone intro section followed by a
  separate scroll-driven sticky timeline section.
- Reduced milestone cards from large feature cards to compact responsive
  timeline cards using viewport-aware `clamp()` heights and mobile/tablet/
  desktop widths.
- Moved the year rail into the sticky stage flow below the card strip instead
  of absolutely pinning it, so the cards and timeline rail fit together inside
  the viewport.
- Updated static and browser harness checks to require the separate intro
  section, separate scroll section, compact responsive card sizing, clipped
  timeline viewport, and timeline/year rail viewport fit.

Verification:

- `node scripts/test-homepage-design.mjs`: passed.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint`: passed.
- `./node_modules/.bin/next build`: passed and generated `/achievements`.
- `PATH="$PWD/node_modules/.bin:$PATH" VERIFY_URL=http://localhost:3000 node
scripts/verify-browser.mjs`: passed; `/achievements` returned
  `ACHIEVEMENTS_CONTRACT_OK:2023->2005` with viewport-fit checks.
- Additional desktop scrolled-state `agent-browser` check on `/achievements`
  passed with `cardHeight: 132`, `railBottom: 879`, `yearRailBottom: 920`,
  and `viewport: 1000`.

Known limits:

- `pnpm` wrappers remain blocked by the local Corepack keyid/signature error on
  Node 25.8.0, so local project binaries were used again.
- LocalStack-dependent AWS/CDK checks remain intentionally deferred.

## 2026-05-15 - Achievements Scroll Transition + Webflow Text Porting

- Added a cinematic scroll-driven transition from the achievements intro section into
  the timeline:
  - Intro background image parallaxes upward at 38% of scroll speed with a subtle
    scale as the user scrolls away from the opener.
  - Intro headline and overview text fade out and drift upward (opacity 1→0 over the
    first 52% of the intro's scroll range; translateY 0→-48px).
  - Bottom vignette deepens as the intro exits, creating a seamless visual hand-off
    into the dark timeline stage.
  - A "Scroll to explore" label + animated bouncing chevron (accent yellow) sits at
    the bottom of the intro section and fades away in the first 20% of scrolling.
  - The sticky timeline stage plays a blur-and-rise entrance animation the first time
    it becomes active (`.achievements-stage-revealed` keyframe).
  - All effects are guarded by `@media (prefers-reduced-motion: reduce)`.
- Ported fuller milestone copy from https://sunswift.webflow.io/about-us/achievements:
  - FIA Land Speed Record 2014 (eVe): added context that the previous record of 73
    km/h had stood since 1988.
  - World Solar Challenge 2009 (IVy): added the precise crossing time (3:08 pm on
    29 October).
  - World Solar Challenge 2005 (SR-III): clarified "first with silicon solar cells"
    and "arriving in 5 days".
  - Added missing 1999 Federal Government Trade Exhibition (SR-II, Taipei) as a new
    `showcase` achievement entry.
  - CitiPower SunRace 1999 (SR-II): expanded to match full Webflow description
    including "highly competitive field" and "five continuous weeks on the road".
  - Transcontinental Record Attempt 1999 (SR-II): expanded to include the failed
    record context and publicity figure.
  - World Solar Challenge 1999 (SR-II): added "a respectable" qualifier from Webflow.
  - World Solar Challenge 1996 (SR-I): expanded to name the Honda, Mitsubishi, and
    Biel competitors per Webflow.

Verification:

- `node scripts/test-homepage-design.mjs`: passed.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint --quiet`: passed.
- `./node_modules/.bin/next build`: passed and generated `/achievements`.

Known limits:

- `pnpm` wrappers remain blocked by the Corepack keyid/signature error on Node 25.8.0.
- LocalStack-dependent AWS/CDK checks remain intentionally deferred.

## 2026-05-15 - Cinematic Achievements Intro Transition (v2)

User feedback was that the previous achievements intro transition was not
noticeable enough. Rewrote the intro section as a 240svh pinned scroll stage so
the choreography has room to play, and added five layered effects driven by a
shared `introExit` (0→1) progress value plus three named phases
(`phaseScatter`, `phaseWipe`, `phaseHandoff`):

1. Background image dramatic zoom — scale 1 → 1.45 with a -2.2° rotate, fading
   to 0 opacity and brightness 0.15 by the time the wipe fires.
2. Headline word-by-word scatter — the seven words of "A timeline of solar
   racing milestones." each translate upward (0 → -220px), blur (0 → 22px), and
   fade (1 → 0) on staggered start/duration tied to `phaseScatter`.
3. Kicker + overview text — fade and translate upward in sync with the headline
   scatter so the entire copy block dissolves.
4. Yellow accent wipe — a 2px horizontal yellow line with a yellow box-shadow
   glow sweeps from left to right (translateX -100% → 0) at mid-transition.
5. Year stamp reveal — "1996 → 2026" emerges centered, scales 0.85 → 1.1, and
   then fades out as the void overlay takes over.
6. Void overlay — a `bg-[#0a0c0e]` layer fades in over `phaseHandoff`, creating
   a clean hand-off to the timeline section below.

The intro section uses `sticky top-0 h-svh` inside a 240svh tall outer wrapper,
which gives ~140svh of scroll distance for the transition (≈1.4 viewports of
deliberate scrolling). All choreography is guarded by
`prefers-reduced-motion: reduce` via the existing media query block.

Updates also added homepage-design contract assertions for the new transition:

- `height: "240svh"` on the intro section
- `sticky top-0 h-svh` inner stage
- `phaseScatter`, `phaseWipe`, `phaseHandoff` derived progress values
- `data-achievements-wipe` accent line element
- `headlineWords.map` per-word spans driven by `headlineWordOpacity`,
  `headlineWordY`, `headlineWordBlur`
- `1996 → 2026` year stamp content

Verification (frontend-only this session; LocalStack/Docker checks remain
deferred):

- `node scripts/test-homepage-design.mjs`: passed with new transition
  assertions.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint --quiet`: passed.
- `./node_modules/.bin/next build`: passed and generated `/achievements`.
- `PATH="$PWD/node_modules/.bin:$PATH" VERIFY_URL=http://localhost:3000 node
scripts/verify-browser.mjs`: passed with
  `ACHIEVEMENTS_CONTRACT_OK:2023->2007`.
- Manual `agent-browser` screenshot capture confirmed:
  - Top of page renders kicker + giant headline + overview + scroll hint.
  - Scrolling 30% of the viewport begins the dim/zoom.
  - Scrolling 100% reveals the giant "1996 → 2026" year stamp with the yellow
    accent wipe across the middle of the screen.

Known limits:

- `pnpm` wrappers remain blocked by the Corepack keyid/signature error on
  Node 25.8.0; local project binaries were used again.
- LocalStack-dependent AWS/CDK checks remain intentionally deferred.

## 2026-05-15 - Achievement Card Vehicle Visibility + Verbatim Webflow Text Port

User reported two issues with `/achievements`:

1. The vehicle name was being clipped off the bottom of every milestone card —
   long titles wrapped to 2-3 lines and pushed the vehicle label outside the
   card's fixed height. Confirmed visually in an `agent-browser` screenshot.
2. The milestone descriptions still did not match the Webflow source verbatim
   (e.g. "Sunswift placed 2nd overall in the Cruiser class, and finished first
   across the line in Adelaide." was rephrased as "Cruiser Class" without the
   comma; the Optus copy was paraphrased; FIA 2014 had units shortened).

### Card layout fix

Restructured the card as a flex column so the vehicle name is always pinned to
the bottom of the card via `mt-auto`:

- Card now uses `flex flex-col h-[clamp(7.5rem,18svh,10.5rem)]` instead of the
  former free-flow layout with `h-[clamp(5.75rem,14svh,8.25rem)]`.
- Title uses `line-clamp-2` with `max-w-[18ch]` so it can never grow beyond two
  lines and push other content out of view.
- Vehicle label uses `mt-auto pt-2 text-accent-yellow/65` (active card uses
  full `text-accent-yellow`), exposed via the new `data-achievement-vehicle`
  hook for browser verification.

### Verbatim Webflow text port

Replaced all 23 milestone descriptions with the verbatim Webflow source text,
preserving original capitalisation, punctuation, and metric/imperial unit
annotations. Examples:

- BWSC '23: "Sunswift 7 placed first overall in the cruiser class." (lowercase
  'c' restored).
- BWSC '19: "Sunswift placed 2nd overall in the Cruiser class, and finished
  first across the line in Adelaide." (capital C + comma restored).
- Guinness '22: "Sunswift 7 achieved the fastest 1000 km achieved by an
  electric car on a single charge." (verbatim, including the source's
  duplicated 'achieved').
- Guinness '18: "Lowest Energy Consumption Driving Trans-Australia (Perth to
  Sydney) - Electric Car." (title-case form restored).
- FIA 2014: full kilometre + imperial unit annotation restored, including
  "73 kilometres per hour (45mph) was set in 1988".
- WSC '07: bullet form restored as three sentences with "(Most efficient)"
  annotation.
- SunRace '03/'02: "2nd Place." (capital P restored).
- 1999 trade exhibition: renamed from "Federal Government Trade Exhibition" to
  just "Federal Government" to match the Webflow section heading.
- WSC '96, Transcontinental '99, CitiPower '99, FIA 2014, BWSC '13, Guinness
  '11, WSC '09, Engineers Australia '07, WSC '05 all updated to verbatim.

A leading comment in `lib/cms/static-data.ts` documents the verbatim contract
so future agents do not paraphrase the source again.

### Harness updates

- `scripts/test-homepage-design.mjs`: updated the locked card-height clamp
  pattern, and added new assertions for `data-achievement-vehicle`,
  `mt-auto pt-2 ... tracking-[0.22em]`, and `line-clamp-2` on the cards.
- `scripts/verify-browser.mjs`: added a per-card visibility check after the
  scrolled-state assertions — every visible card must contain a
  `[data-achievement-vehicle]` element with non-empty text whose
  `getBoundingClientRect()` sits entirely within the card's rect (rejects
  `ACHIEVEMENTS_VEHICLE_LABEL_CLIPPED:YYYY:...`).

### Verification

- `node scripts/test-homepage-design.mjs`: passed.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint --quiet`: passed.
- `./node_modules/.bin/next build`: passed and generated `/achievements`.
- `PATH="$PWD/node_modules/.bin:$PATH" VERIFY_URL=http://localhost:3000 node
scripts/verify-browser.mjs`: passed including the new vehicle-clipping check
  (`ACHIEVEMENTS_CONTRACT_OK:2023->2007`).
- Manual `agent-browser` screenshot at scrolled-state confirmed all visible
  cards display title + vehicle name in accent yellow ("VIOLET", "EVE", "IVY"
  visible at the bottom of each card; active card's vehicle in full
  accent-yellow).

### Known limits

- `pnpm` wrappers remain blocked by the Corepack keyid/signature error on
  Node 25.8.0; local project binaries were used again.
- LocalStack-dependent AWS/CDK checks remain intentionally deferred.

## 2026-05-15 - Achievements Year Rail Hover Polish + Year Stamp Centering

User reported two polish issues on `/achievements`:

1. Hovering over year markers in the 2023–2024 region of the bottom rail did
   not reveal the year, and the visible inline year labels were hard to read.
2. The arrow in the mid-transition `1996 → 2026` year stamp sat too low — it
   was not vertically centered with the digits.

### Year rail polish (hover + readability)

- Bumped inactive marker opacity from 42% to 70% (with hover/focus snapping
  to 100%), and increased the inline year label color from `text-white/70`
  to `text-white/80` so the indexed years are easier to read against the
  dark background.
- Inactive dot now scales 1.5× and switches to `bg-accent-yellow` on
  `group-hover` and `group-focus-visible`, matching the active state's
  affordance.
- Added a popover-style hover tooltip on every marker (`-top-7` above the dot)
  with `border-accent-yellow/40`, dark backdrop, and `text-accent-yellow`
  year copy. The tooltip uses `group-hover` / `group-focus-visible` so any
  year is readable on hover even when the inline indexed label is hidden.
- The previously locked inline-label visibility logic (every 4th marker +
  active + endpoints) is preserved; only the hidden labels are augmented by
  the new hover tooltip.
- Active inline label now renders in `text-accent-yellow` instead of plain
  white for tighter focus state continuity.

### Year stamp centering

- Replaced `items-baseline` with `items-center` on the
  `1996 → 2026` row so the arrow centers vertically with the digits rather
  than aligning to their baselines.
- Increased arrow font size from `clamp(1.2rem,3vw,2.4rem)` to
  `clamp(1.6rem,4vw,3.4rem)` for better visual weight against the massive
  digits.
- Wrapped the arrow in `flex items-center justify-center leading-none
tracking-[0]` so its rendered glyph sits at the row's mid-line.

### Verification

- `node scripts/test-homepage-design.mjs`: passed.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint --quiet`: passed.
- `./node_modules/.bin/next build`: passed and generated `/achievements`.
- `PATH="$PWD/node_modules/.bin:$PATH" VERIFY_URL=http://localhost:3000 node
scripts/verify-browser.mjs`: passed with `ACHIEVEMENTS_CONTRACT_OK:2023->2007`
  including the per-card vehicle-clipping guard.
- Manual `agent-browser` checks:
  - Mid-transition screenshot at `introExit ≈ 0.5` confirmed the arrow now
    sits at the visual midline of `1996` and `2026`.
  - `agent-browser hover 'button[aria-label="Jump to 2022: Optus Remote
Driving Initiative"]'` followed by a screenshot confirmed the dot turns
    accent-yellow and a `2022` tooltip pops above the rail.

### Known limits

- `pnpm` wrappers remain blocked by the Corepack keyid/signature error on
  Node 25.8.0; local project binaries were used again.
- LocalStack-dependent AWS/CDK checks remain intentionally deferred.

## 2026-05-15 - Consistent Milestone Display (Persistent Top-Left Copy)

User reported that the very first milestone in the timeline (2023 Bridgestone
World Solar Challenge) did not display the kicker / giant year / title block
in the top-left, whereas scrolled milestones (e.g. 2018 VIolet Guinness World
Record) did. They asked for the layout to be consistent across the whole
timeline.

### Root cause

Two crossfading opacities drove the inconsistency:

- `detailOpacity = max(0, 1 - progress / 0.08)` — the bottom "Now viewing"
  description faded out almost immediately when scrolling.
- `minimalOpacity = min(1, max(0, (progress - 0.035) / 0.12))` — the top-left
  kicker + giant year + title only faded _in_ after some scroll progress, so
  it was literally hidden when the first milestone was active.

### Fix

Made both copy blocks always visible:

```ts
const detailOpacity = 1;
const minimalOpacity = 1;
```

Now every milestone — including the first one (2023) — renders the same way:

- Top-left at `top-[22svh]`: `{vehicle} / {kind}` kicker + giant year + title.
- Above the cards row: `Now viewing` label + active description.
- Cards row + year rail unchanged.

### Harness updates

- `scripts/test-homepage-design.mjs`: replaced the loose "fading current-copy"
  wording with two new assertions that lock the constant opacities:
  - `const detailOpacity = 1`
  - `const minimalOpacity = 1`
- `scripts/verify-browser.mjs`: removed the old `afterCurrentOpacity <
beforeCurrentOpacity && afterMinimalOpacity > beforeMinimalOpacity` check
  (which required the crossfade) and replaced it with three stronger checks:
  - `afterCurrentOpacity >= 0.95 && afterMinimalOpacity >= 0.95 &&
beforeCurrentOpacity >= 0.95 && beforeMinimalOpacity >= 0.95` (both
    blocks must stay persistently visible)
  - `minimalCopy.textContent` must include the active year both before and
    after scrolling (so the top-left block always reflects the active
    milestone)
  - `currentCopy.textContent` must update between before and after scrolling
    (so the description tracks the active milestone, never staying stale)

### Verification

- `node scripts/test-homepage-design.mjs`: passed with new opacity-constant
  assertions.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint --quiet`: passed.
- `./node_modules/.bin/next build`: passed and generated `/achievements`.
- `PATH="$PWD/node_modules/.bin:$PATH" VERIFY_URL=http://localhost:3000 node
scripts/verify-browser.mjs`: passed with `ACHIEVEMENTS_CONTRACT_OK:
2023->2007`, the new copy-persistence checks, and the per-card vehicle
  visibility check.
- Manual `agent-browser` screenshots confirmed the start of the timeline
  (active 2023) now shows `SR-7 / RACE` kicker + giant `2023` + title +
  description — identical layout to the 2011 IVY Guinness Record state.

### Known limits

- `pnpm` wrappers remain blocked by the Corepack keyid/signature error on
  Node 25.8.0; local project binaries were used again.
- LocalStack-dependent AWS/CDK checks remain intentionally deferred.

## 2026-05-15 - Editorial About Pages from Webflow Source

Rebuilt the public `Who We Are` and `Our Story` pages as dark editorial
front-end pages that match the current welcome, achievements, and vehicle
gallery direction.

### Implementation

- Added repo-managed `content/about-pages.json` with text copied from the
  Webflow source pages:
  - `https://sunswift.webflow.io/about-us/who-we-are`
  - `https://sunswift.webflow.io/about-us/our-story`
- Added `components/site/about-editorial-pages.tsx` with:
  - a shared dark hero treatment
  - image placeholder frames for future Sunswift photography
  - the redesigned `Who We Are` page
  - the long-form `Our Story` page with a sticky section navigator
- Replaced `/who-we-are` with the new editorial implementation.
- Added the new `/our-story` route.
- Added `Our Story` to the About dropdown and shared footer navigation.

### Harness updates

- `scripts/test-homepage-design.mjs` now asserts that:
  - both about routes render the editorial components
  - the shared about content file exists with locked Webflow phrases
  - the about dropdown includes `Our Story`
  - the new pages use placeholder imagery and sticky navigation hooks
- `scripts/verify-browser.mjs` now opens `/who-we-are` and `/our-story`,
  verifies key Webflow text is present, checks image placeholder counts, and
  confirms the shared nav appears on both pages.

### Verification

- `node scripts/test-homepage-design.mjs`: passed.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint --quiet`: passed.
- `./node_modules/.bin/next build`: passed and generated `/our-story`.
- `PATH="$PWD/node_modules/.bin:$PATH" VERIFY_URL=http://localhost:3000 node
scripts/verify-browser.mjs`: passed with `ABOUT_PAGE_OK:who-we-are` and
  `ABOUT_PAGE_OK:our-story`.
- Manual `agent-browser` screenshot/eval on `/our-story` confirmed all four
  story chapters plus `WSC 2011 Team` text render, with 28 images/placeholders.

### Known limits

- Placeholder images are intentionally used until real Sunswift photography is
  provided.
- `pnpm` wrappers remain blocked by the Corepack keyid/signature error on
  Node 25.8.0; local project binaries were used again.
- LocalStack-dependent AWS/CDK checks remain intentionally deferred per the
  frontend-only instruction.

## 2026-05-15 - Homepage Recruitment CTA Section

Added a new bottom-of-landing-page recruitment section that links through to
`/recruitment` and uses the headline `Embrace Tomorrow`.

### Implementation

- Added `components/site/homepage-recruitment.tsx`.
- Updated `app/page.tsx` to load `getRecruitmentRoles("published")` and pass
  those CMS/database-backed roles into the homepage recruitment section.
- Marked the homepage `force-dynamic` while it pulls published recruitment
  roles.
- The section renders three discipline dropdowns:
  - Design
  - Engineering
  - Business
- Discipline dropdowns use a rotating `ChevronDown` icon to match the site's
  dropdown language.
- Role cards are populated from the published recruitment role data by matching
  `role.team` to the discipline. Disciplines with no published roles show a
  database-ready empty state so future DB records can populate them without a
  layout change.
- Added `data-homepage-recruitment` and role/discpline hooks for browser
  verification.

### Harness updates

- `scripts/test-homepage-design.mjs` now asserts:
  - the homepage order is Hero → ZoomReveal → About → Records → Recruitment
  - the homepage pulls roles via `getRecruitmentRoles("published")`
  - the recruitment CTA exposes CMS/data hooks
  - `Design`, `Engineering`, and `Business` dropdowns exist
  - role cards and empty-state cards have verification hooks
- `scripts/verify-browser.mjs` now checks the homepage for:
  - `Embrace Tomorrow`
  - all three discipline labels
  - at least three role cards
  - `data-recruitment-source="cms"`

### Verification

- `node scripts/test-homepage-design.mjs`: passed.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint --quiet`: passed.
- `./node_modules/.bin/next build`: passed; homepage is dynamic (`ƒ /`).
- `PATH="$PWD/node_modules/.bin:$PATH" VERIFY_URL=http://127.0.0.1:3001 node
scripts/verify-browser.mjs`: passed against `next start` on port 3001 with
  `HOMEPAGE_CONTRACT_OK`, `ACHIEVEMENTS_CONTRACT_OK:2023->2007`,
  `ABOUT_PAGE_OK:who-we-are`, and `ABOUT_PAGE_OK:our-story`.

### Known limits

- LocalStack-dependent AWS/CDK checks remain intentionally deferred per the
  frontend-only instruction.
- The current fallback CMS data contains Engineering and Business role cards;
  Design displays the DB-ready empty state until a published Design role exists.

### Follow-up polish

- Removed the yellow `Recruitment` kicker above `Embrace Tomorrow`.
- Rebalanced the section into a centered intro/CTA followed by the discipline
  dropdowns below, instead of the previous sticky left rail.
- Added a scroll-driven transition using CSS custom properties:
  - headline/CTA translate up and fade in
  - discipline panel rises, sharpens from blur, and fades in
  - background yellow glow scales subtly as the section enters
- Added `data-homepage-recruitment-intro` for visual verification.
- Updated `scripts/test-homepage-design.mjs` to lock the removed kicker,
  centered CTA, and scroll-transition implementation.
- Updated `scripts/verify-browser.mjs` with `RECRUITMENT_TRANSITION_OK`, which
  verifies the transition changes on scroll and the CTA is centered.

### Follow-up verification

- `node scripts/test-homepage-design.mjs`: passed.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint --quiet`: passed.
- `./node_modules/.bin/next build`: passed.
- `PATH="$PWD/node_modules/.bin:$PATH" VERIFY_URL=http://127.0.0.1:3001 node
scripts/verify-browser.mjs`: passed against `next start` on port 3001 with
  `RECRUITMENT_TRANSITION_OK:0->1` on desktop and mobile.

## 2026-05-15 - Recruitment Hub Dropdowns + Role Family Summary

Implemented the missing recruitment-page stream dropdowns and updated the
homepage `Embrace Tomorrow` section to summarize role families rather than only
listing current CMS role cards.

### Implementation

- Added `components/site/recruitment-content.ts` as shared recruitment stream
  data for:
  - Design / Media
  - Engineering
  - Business
- Rebuilt `/recruitment` as a general recruitment hub:
  - dark editorial hero with `Join Sunswift Racing.`
  - apply / view roles CTAs
  - general information inspired by the Webflow business, media, and
    engineering role pages
  - dropdowns for Design, Engineering, and Business
  - role-family tags inside each dropdown
  - CMS/database-backed role cards grouped into the matching dropdown
- Updated the homepage `Embrace Tomorrow` section so the visible cards summarize
  possible team roles:
  - Engineering: software, electrical, mechanical, renewables, chemical
  - Design: design, media, content, photography, videography, copywriting
  - Business: finance, marketing, operations, partnerships, logistics, strategy

### Harness updates

- `scripts/test-homepage-design.mjs` now asserts the shared recruitment stream
  data, homepage role-family cards, and `/recruitment` hub dropdown/card hooks.
- `scripts/verify-browser.mjs` now opens `/recruitment` and checks
  `RECRUITMENT_HUB_OK`, including stream dropdowns, family labels, and CMS role
  cards.

### Verification

- `node scripts/test-homepage-design.mjs`: passed.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint --quiet`: passed.
- `./node_modules/.bin/next build`: passed.
- `PATH="$PWD/node_modules/.bin:$PATH" VERIFY_URL=http://127.0.0.1:3001 node
scripts/verify-browser.mjs`: passed against `next start` on port 3001 with
  `RECRUITMENT_HUB_OK:3`.

### Known limits

- LocalStack-dependent AWS/CDK checks remain intentionally deferred per the
  frontend-only instruction.
- The in-app Browser plugin runtime was not exposed after tool discovery, so
  verification used the existing Vercel `agent-browser` flow.

## 2026-05-15 - Persistent Compact UNSW Footer

Added a persistent footer through the root layout so every page gets the same
UNSW/Sunswift contact block.

### Implementation

- Added local footer logo assets:
  - `public/brand/unsw-sydney.webp`
  - `public/brand/unsw-sydney-dark.png`
- Updated `SiteFooter` to a compact dark-theme footer bar:
  - small UNSW crest/wordmark mark
  - `Sunswift Racing`
  - `Room G14, Blockhouse (G6), University Mall, UNSW, Kensington NSW 2052`
  - compact `Stay connected` CTA linking to
    `https://linktr.ee/sunswiftracing`
  - `Copyright © 2025` and `Credits`
- Moved `<SiteFooter />` into `app/layout.tsx` so the footer is persistent even
  on transparent-navbar pages such as the homepage, achievements, vehicles,
  and editorial about pages.
- Removed the footer from `PageFrame` to avoid duplicate footers.
- After feedback, reduced the footer from a large contact section into a thin
  compact bar and switched the dark footer to the white UNSW wordmark asset.

### Harness updates

- `scripts/test-homepage-design.mjs` now asserts the root layout renders the
  persistent footer, the footer uses the dark UNSW logo asset, includes the
  address/copyright/credits copy, and links `Stay connected` to Linktree.
- `scripts/verify-browser.mjs` now includes a `SITE_FOOTER_OK` contract for
  the shared footer on checked routes.

### Verification

- `node scripts/test-homepage-design.mjs`: passed.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint --quiet`: passed.
- `./node_modules/.bin/next build`: passed.

### Known limits

- LocalStack-dependent AWS/CDK checks remain intentionally deferred per the
  frontend-only instruction.

## 2026-05-15 - Recruitment Dark Hub + Available Roles

Updated the recruitment flow so `/recruitment` is now a dark, transparent-nav
hub and the CMS role cards live on a separate quick-scan page.

### Implementation

- Reworked `/recruitment` to use the dark page theme and `TransparentNavbar`.
- Removed the visible yellow `Recruitment hub` heading text.
- Changed the Design, Engineering, and Business stream rows into links to
  `/recruitment/available-roles#design`, `#engineering`, and `#business`.
- Added `/recruitment/available-roles` as a separate page that groups published
  CMS/database role cards by stream.
- Added recruitment dropdowns to both the transparent navbar and shared site
  shell, with links for:
  - Recruitment Hub
  - Available Roles
- Added stable stream slugs to the shared recruitment stream data.

### Harness updates

- `scripts/test-homepage-design.mjs` now asserts that the recruitment hub no
  longer fetches or renders inline role cards, and that the available roles page
  owns the CMS role-card hooks.
- `scripts/verify-browser.mjs` now opens `/recruitment/available-roles` and
  checks `AVAILABLE_ROLES_OK` in addition to the revised `RECRUITMENT_HUB_OK`.

### Verification

- `node scripts/test-homepage-design.mjs`: passed.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint --quiet`: passed.
- `./node_modules/.bin/next build`: passed.
- `PATH="$PWD/node_modules/.bin:$PATH" VERIFY_URL=http://127.0.0.1:3001 node
scripts/verify-browser.mjs`: passed against `next start` on port 3001 with
  `RECRUITMENT_HUB_OK:3` and `AVAILABLE_ROLES_OK:3`.

### Known limits

- LocalStack-dependent AWS/CDK checks remain intentionally deferred per the
  frontend-only instruction.
- The repo still has a mixed dirty worktree from earlier frontend work; no
  unrelated files were reverted.

## 2026-05-15 - Split Role Pages + Partners Grid

Split the available roles flow into three dedicated stream pages and rebuilt
`/partners` as a dark editorial partners page based on the Webflow source page.

### Implementation

- Changed `/recruitment/available-roles` into a quick stream chooser instead of
  the card grid.
- Added dedicated role pages:
  - `/recruitment/available-roles/design-roles`
  - `/recruitment/available-roles/engineering-roles`
  - `/recruitment/available-roles/business-roles`
- Updated `/recruitment` stream rows to link directly into those dedicated role
  pages.
- Expanded the recruitment dropdown in both nav implementations so it includes
  Recruitment Hub, Available Roles, Design Roles, Engineering Roles, and
  Business Roles.
- Replaced the generic `/partners` content shell with a new dark page:
  - transparent navbar and full-screen editorial hero
  - Webflow overview copy preserved
  - contact CTA
  - cycling partner banner
  - dense placeholder partner grid sourced from the Webflow partner collection
    names/links

### Harness updates

- `scripts/test-homepage-design.mjs` now asserts the role-page split, nav role
  links, partners marquee, and placeholder partner grid.
- `scripts/verify-browser.mjs` now opens the three dedicated role pages and
  `/partners`, checking `ROLE_STREAM_OK` and `PARTNERS_OK`.

### Verification

- `node scripts/test-homepage-design.mjs`: passed.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint --quiet`: passed.
- `./node_modules/.bin/next build`: passed.
- `PATH="$PWD/node_modules/.bin:$PATH" VERIFY_URL=http://127.0.0.1:3001 node
scripts/verify-browser.mjs`: passed against `next start` on port 3001 with
  `AVAILABLE_ROLES_OK:3`, `ROLE_STREAM_OK:engineering:2`,
  `ROLE_STREAM_OK:design:0`, `ROLE_STREAM_OK:business:1`, and
  `PARTNERS_OK:35`.

### Known limits

- Partner logo cards are intentional placeholders until final logo assets are
  integrated.
- LocalStack-dependent AWS/CDK checks remain intentionally deferred per the
  frontend-only instruction.
- The repo still has a mixed dirty worktree from earlier frontend work; no
  unrelated files were reverted.

## 2026-05-15 - Partners Liquid Glass + Footer Rebalance

Polished the recruitment dropdown, partners page, and persistent footer.

### Implementation

- Removed the superseded `Available Roles` row from both recruitment nav
  dropdowns.
- Kept the `/recruitment/available-roles` index route available, but the nav now
  only exposes:
  - Recruitment Hub
  - Design Roles
  - Engineering Roles
  - Business Roles
- Reworked the `/partners` placeholder grid to a desktop 4-column layout.
- Updated partner cards to use the current liquid-glass language:
  translucent white surface, hairline border, inset highlight, deeper shadow,
  and `backdrop-blur-xl`.
- Changed the partner cycling banner into smaller placeholder cards for every
  partner instead of large text bars.
- Increased the UNSW footer logo and widened its layout column so it reads
  noticeably larger.
- Reduced the `Sunswift Racing` footer heading size so the footer hierarchy
  leads with the UNSW mark.

### Harness updates

- `scripts/test-homepage-design.mjs` now asserts that the generic Available
  Roles dropdown item is absent, the partners grid is `lg:grid-cols-4`, partner
  marquee cards exist, partners use liquid-glass blur, and the footer logo/title
  sizing contract is preserved.
- `scripts/verify-browser.mjs` now checks the rendered UNSW logo width, footer
  title size, compact marquee card count, and desktop 4-column partners grid.

### Verification

- `node scripts/test-homepage-design.mjs`: passed.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint --quiet`: passed.
- `./node_modules/.bin/next build`: passed.
- `PATH="$PWD/node_modules/.bin:$PATH" VERIFY_URL=http://127.0.0.1:3001 node
scripts/verify-browser.mjs`: passed against `next start` on port 3001 with
  `SITE_FOOTER_OK`, `RECRUITMENT_HUB_OK:3`, `ROLE_STREAM_OK:*`, and
  `PARTNERS_OK:35`.

### Known limits

- Partner logos remain placeholders until final logo assets are integrated.
- LocalStack-dependent AWS/CDK checks remain intentionally deferred per the
  frontend-only instruction.
- No GitHub connector action was needed; the request was local frontend
  implementation only.

## 2026-05-15 - Recruitment Business/Media Alternative Form CTA

Changed the recruitment hub secondary hero CTA from the superseded available
roles shortcut into a placeholder Google Forms link for alternative
business/media applications.

### Implementation

- Added a placeholder external Google Forms URL constant to `/recruitment`.
- Changed the secondary hero CTA label to `Business/media form`, opening the
  placeholder form in a new tab.
- Updated the intake guidance copy so engineering continues through
  UNSW ChallENG/VIP pathways while business/media applicants can use the
  alternative form for faster routing.

### Harness updates

- `scripts/test-homepage-design.mjs` now asserts the recruitment page exposes
  the alternative business/media CTA, includes the placeholder form URL, and
  renders the `Business/media form` label.
- `scripts/verify-browser.mjs` now checks the rendered recruitment hub for the
  same placeholder CTA via `data-alternative-applications-link`.

### Verification

- `node scripts/test-homepage-design.mjs`: passed.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint --quiet`: passed.
- `./node_modules/.bin/next build`: passed.
- `PATH="$PWD/node_modules/.bin:$PATH" VERIFY_URL=http://127.0.0.1:3001 node
scripts/verify-browser.mjs`: passed against `next start` on port 3001 with
  `RECRUITMENT_HUB_OK:3`, `AVAILABLE_ROLES_OK:3`, all role-stream checks, and
  `PARTNERS_OK:35`.

### Known limits

- The Google Forms URL is intentionally a placeholder:
  `https://forms.gle/sunswift-business-media-placeholder`.
- LocalStack-dependent AWS/CDK checks remain intentionally deferred per the
  frontend-only instruction.

## 2026-05-15 - Partners Square Logo Grid

Adjusted the partners grid so it reads more like the Webflow square logo wall
reference while staying in the current dark liquid-glass theme.

### Implementation

- Constrained the partner grid to `max-w-[76rem]` so the 4-column desktop
  layout no longer stretches into wide rectangles.
- Changed partner cards to `aspect-square` tiles with centered placeholder
  mark/name content.
- Simplified the placeholder metadata into a small bottom-right index so each
  card behaves more like a logo tile than an info card.

### Harness updates

- `scripts/test-homepage-design.mjs` now asserts the grid width constraint and
  square-card class.
- `scripts/verify-browser.mjs` now checks the rendered partners grid width and
  verifies the first visible partner cards have a near-1:1 aspect ratio.

### Verification

- `node scripts/test-homepage-design.mjs`: passed.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint --quiet`: passed.
- `./node_modules/.bin/next build`: passed.
- `PATH="$PWD/node_modules/.bin:$PATH" VERIFY_URL=http://127.0.0.1:3001 node
scripts/verify-browser.mjs`: passed against `next start` on port 3001 with
  `PARTNERS_OK:35`.

### Known limits

- Partner logos remain placeholder initials until final logo assets are
  integrated.
- LocalStack-dependent AWS/CDK checks remain intentionally deferred per the
  frontend-only instruction.

## 2026-05-15 - Footer Logo Cache Bust + Vignette Transition

Updated the persistent footer so UNSW branding changes render reliably and the
footer blends into the page with a vignette instead of a hard dividing line.

### Implementation

- Added `footerUnswLogoSrc` with a versioned
  `/brand/unsw-sydney-dark.png?v=20260515-footer` public asset path.
- Set the footer UNSW `Image` to `unoptimized` so it bypasses the Next image
  optimizer cache and reads the current public asset.
- Removed the footer's hard `border-t` line.
- Added a dark top vignette via a `::before` gradient and a soft upward shadow
  so the footer fades into the page.

### Harness updates

- `scripts/test-homepage-design.mjs` now asserts the footer logo uses the
  versioned public asset path, bypasses the image optimizer, has no hard top
  border, and includes the vignette classes.
- `scripts/verify-browser.mjs` now checks the rendered footer image URL has
  the version token, the footer border width is zero, and the pseudo-element
  vignette gradient is present.

### Verification

- `node scripts/test-homepage-design.mjs`: passed.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint --quiet`: passed.
- `./node_modules/.bin/next build`: passed.
- `PATH="$PWD/node_modules/.bin:$PATH" VERIFY_URL=http://127.0.0.1:3001 node
scripts/verify-browser.mjs`: passed against `next start` on port 3001 with
  `SITE_FOOTER_OK` across the checked public routes.

### Known limits

- If the logo file changes again and a browser still shows a stale cached
  image, bump the version token in `footerUnswLogoSrc`.
- LocalStack-dependent AWS/CDK checks remain intentionally deferred per the
  frontend-only instruction.

## 2026-05-15 - Homepage Records Carousel Handoff + Animated Recruitment Gradient

Added a more cinematic landing-page transition between the light about section
and the dark records section, then tightened the records and recruitment visual
language.

### Implementation

- Converted `HomepageRecords` to a client component with a scroll-driven sticky
  handoff stage.
- Added a vertical carousel transition headed `Moving records forward.` that
  scrolls through the three record metrics while the background fades from the
  light page canvas into the dark records surface.
- Reworked the records content from three bulky cards into a cleaner dark
  editorial row layout with metric, explanation, year, and image aligned per
  record.
- Added an animated white/yellow gradient sweep to the `Embrace Tomorrow`
  headline in the homepage recruitment section.
- Fixed a decorative transition image that initially caused horizontal overflow
  in browser verification.

### Harness updates

- `scripts/test-homepage-design.mjs` now asserts the records handoff hooks,
  scroll variables, `Moving records forward.` headline, and animated recruitment
  gradient hook/keyframes.
- `scripts/verify-browser.mjs` now checks the records carousel actually moves,
  the dark fade progresses, and the Embrace Tomorrow gradient animation is
  active.

### Verification

- `node scripts/test-homepage-design.mjs`: passed.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint --quiet`: passed.
- `./node_modules/.bin/next build`: passed.
- `PATH="$PWD/node_modules/.bin:$PATH" VERIFY_URL=http://127.0.0.1:3001 node
scripts/verify-browser.mjs`: passed against `next start` on port 3001 with
  `RECORDS_TRANSITION_OK:0.000%->-66.000%` on desktop and mobile.

### Known limits

- The records transition still uses placeholder vehicle imagery until real
  Sunswift photography/renders are integrated.
- LocalStack-dependent AWS/CDK checks remain intentionally deferred per the
  frontend-only instruction.

## 2026-05-15 - Single-Stage Records Cycle + Recruitment Background Animation

Refined the previous landing-page records transition after feedback that the
yellow text sweep was distracting and the transition still had an unaccounted
white section.

### Implementation

- Removed the yellow animated text sweep from the `Embrace Tomorrow` headline.
- Kept motion in the recruitment area by moving the animation to the background
  glow (`homepage-recruitment-background`) instead of clipping through text.
- Rebuilt `HomepageRecords` into one sticky scroll stage rather than a
  transition plus a separate records block.
- The single records stage now cycles through all three record achievements as
  the user scrolls:
  - 1,000 km single-charge Guinness record
  - 107 km/h FIA solar speed record
  - seven cars built since 1996
- Added a final in-stage handoff message into `Embrace tomorrow.` before the
  next recruitment section enters.
- Removed the separate post-transition records row section that was causing the
  visual rhythm to feel split.

### Harness updates

- `scripts/test-homepage-design.mjs` now asserts that records are a single
  client-side sticky section with carousel and handoff variables, and that
  Embrace Tomorrow does not use `bg-clip-text` or `text-transparent`.
- `scripts/verify-browser.mjs` now checks the carousel reaches
  `-200.000svh`, the dark fade progresses, and the records handoff opacity
  changes before recruitment.

### Verification

- `node scripts/test-homepage-design.mjs`: passed.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint --quiet`: passed.
- `./node_modules/.bin/next build`: passed.
- `PATH="$PWD/node_modules/.bin:$PATH" VERIFY_URL=http://127.0.0.1:3001 node
scripts/verify-browser.mjs`: passed against `next start` on port 3001 with
  `RECORDS_TRANSITION_OK:0.000svh->-200.000svh` on desktop and mobile.

### Known limits

- The records stage still uses placeholder vehicle imagery until final assets
  are available.
- LocalStack-dependent AWS/CDK checks remain intentionally deferred per the
  frontend-only instruction.

## 2026-05-15 - Records Contrast + Duplicate Handoff Fix

Fixed two follow-up issues in the homepage records transition.

### Implementation

- Removed the `Embrace tomorrow.` text from the records handoff overlay so the
  recruitment headline only appears once.
- Kept the records handoff as a visual-only dark/yellow fade into the
  recruitment section.
- Added scroll-driven typography colour variables:
  - `--records-text-color`
  - `--records-muted-color`
  - `--records-rule-color`
- The records stage now starts with dark text on the light canvas and resolves
  to white text as the dark background fades in.
- Reduced the bottom dark vignette on the records stage so it does not muddy the
  initial light state.

### Harness updates

- `scripts/test-homepage-design.mjs` now asserts the records text/muted colour
  variables and rejects duplicate `Embrace tomorrow.` text inside records.
- `scripts/verify-browser.mjs` now checks the records text colour changes from
  dark to white during the transition and rejects duplicate recruitment
  headline text in the records stage.

### Verification

- `node scripts/test-homepage-design.mjs`: passed.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint --quiet`: passed.
- `./node_modules/.bin/next build`: passed.
- `PATH="$PWD/node_modules/.bin:$PATH" VERIFY_URL=http://127.0.0.1:3001 node
scripts/verify-browser.mjs`: passed against `next start` on port 3001 with
  `RECORDS_TRANSITION_OK:0.000svh->-200.000svh` on desktop and mobile.

### Known limits

- The records stage still uses placeholder vehicle imagery until final assets
  are available.
- LocalStack-dependent AWS/CDK checks remain intentionally deferred per the
  frontend-only instruction.

## 2026-05-15 - Records To Recruitment Handoff Polish

Smoothed the final scroll moment between the records stage and the Embrace
Tomorrow recruitment section.

### Implementation

- Added `--records-content-opacity` and `--records-content-y` so the last
  record content fades and drifts out before the sticky records stage releases.
- Strengthened the records handoff overlay into a visual-only dark/yellow veil
  that clears the stage before recruitment text enters.
- Reworked the recruitment background glow so its animated child layer drifts
  slightly (`translate3d(-7%, 3%, 0)` to `translate3d(8%, -5%, 0)`) while the
  parent still follows scroll-driven scale/opacity.
- Wrapped the glow in an overflow-hidden absolute parent and made the animated
  child absolute to avoid mobile horizontal overflow.

### Harness updates

- `scripts/test-homepage-design.mjs` now asserts the records content-clearing
  variable and that the recruitment glow actually drifts rather than only
  blurring in place.
- `scripts/verify-browser.mjs` now checks records content opacity decreases
  during the handoff, while preserving the existing carousel, dark fade, text
  colour, and no-duplicate-headline checks.

### Verification

- `node scripts/test-homepage-design.mjs`: passed.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint --quiet`: passed.
- `./node_modules/.bin/next build`: passed.
- `PATH="$PWD/node_modules/.bin:$PATH" VERIFY_URL=http://127.0.0.1:3001 node
scripts/verify-browser.mjs`: passed against `next start` on port 3001 with
  `RECORDS_TRANSITION_OK:0.000svh->-200.000svh` on desktop and mobile.

### Known limits

- The records stage still uses placeholder vehicle imagery until final assets
  are available.
- LocalStack-dependent AWS/CDK checks remain intentionally deferred per the
  frontend-only instruction.

## 2026-05-15 - Mobile Navigation Recovery

Added phone-width navigation so the site chrome no longer disappears when the
viewport is resized below the desktop breakpoint.

### Implementation

- Added a native `details`/`summary` mobile menu to `TransparentNavbar`.
- Added the same mobile menu pattern to the shared `SiteHeader` in
  `site-shell.tsx`.
- The mobile menus expose About Us, standard public links, Recruitment stream
  pages, and Join the team.
- Mobile menu panels are constrained with `w-[min(22rem,calc(100vw-2rem))]`
  so they stay inside phone viewports.

### Harness updates

- `scripts/test-homepage-design.mjs` now asserts both header variants expose
  `data-mobile-nav`, use the `Menu` icon, and constrain the menu panel width.
- `scripts/verify-browser.mjs` now checks the homepage mobile nav exists and
  is not `display: none` at phone width.

### Verification

- `node scripts/test-homepage-design.mjs`: passed.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint --quiet`: passed.
- `./node_modules/.bin/next build`: passed.
- `PATH="$PWD/node_modules/.bin:$PATH" VERIFY_URL=http://127.0.0.1:3001 node
scripts/verify-browser.mjs`: passed against `next start` on port 3001.
- Manual `agent-browser` check at `390x844`: opened `[data-mobile-nav]`, menu
  was open, included Recruitment/Partners/Join the team, and the panel stayed
  fully inside the viewport (`22px` to `374px` on a `390px` viewport).

### Known limits

- This pass fixes the shared navigation only; individual page layout polish at
  phone width can be handled section by section.
- LocalStack-dependent AWS/CDK checks remain intentionally deferred per the
  frontend-only instruction.

## 2026-05-15 - Records To Embrace Tomorrow Seam Fix

Removed the visible horizontal boundary between the homepage records section
and the Embrace Tomorrow recruitment section.

### Implementation

- Removed the yellow radial overlay from the records handoff so the records
  transition resolves into a dark-only field.
- Removed yellow radial gradients anchored to the top edge of the recruitment
  section.
- Moved the recruitment glow down behind the headline and added a top dark mask.
- Shifted the recruitment section start upward with matching internal top
  spacing, so the physical section boundary sits in the dark/off-focus area
  rather than across the headline viewport.
- Switched the recruitment wrapper to `overflow-x-clip overflow-y-visible` so
  the upward dark veil can extend across the boundary without reintroducing
  horizontal overflow.

### Harness updates

- `scripts/test-homepage-design.mjs` now rejects the old top-anchored yellow
  recruitment gradients and the yellow records handoff radial.
- The same contract checks that the recruitment glow remains lower behind the
  headline with an upward dark veil.

### Verification

- `node scripts/test-homepage-design.mjs`: passed.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint --quiet`: passed.
- `./node_modules/.bin/next build`: passed.
- `PATH="$PWD/node_modules/.bin:$PATH" VERIFY_URL=http://127.0.0.1:3001 node
scripts/verify-browser.mjs`: passed against `next start` on port 3001.
- Targeted `agent-browser` screenshot at `2048x1224` and records progress
  `0.965`: recruitment top moved to the dark upper region (`75px`) while the
  headline stayed in view, removing the visible line through the Embrace
  Tomorrow area.

### Known limits

- The records stage still uses placeholder vehicle imagery until final assets
  are available.
- LocalStack-dependent AWS/CDK checks remain intentionally deferred per the
  frontend-only instruction.

## 2026-05-15 - Homepage Glow Clip + Footer Vignette Polish

Fixed the clipped left edge in the homepage Embrace Tomorrow glow and restored
the footer vignette fade on the home page.

### Implementation

- Reworked the Embrace Tomorrow glow wrapper so it no longer clips its own
  radial gradient at the left edge.
- Kept the recruitment section horizontally clipped at the section boundary to
  avoid mobile overflow while allowing the glow itself to feather naturally.
- Enlarged the inner glow layer with negative inset and a softer radial falloff.
- Strengthened the shared footer's top vignette, increased its fade height, and
  raised the footer stacking context so the fade renders over the preceding
  homepage section.

### Harness updates

- `scripts/test-homepage-design.mjs` now asserts the unclipped recruitment glow
  sizing/negative inset and the stronger footer vignette contract.

### Verification

- `node scripts/test-homepage-design.mjs`: passed.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint --quiet`: passed.
- `./node_modules/.bin/next build`: passed.
- `PATH="$PWD/node_modules/.bin:$PATH" VERIFY_URL=http://127.0.0.1:3001 node
scripts/verify-browser.mjs`: passed against `next start` on port 3001.
- Targeted `agent-browser` screenshot at `2048x1224` and records progress
  `0.965`: the Embrace Tomorrow glow no longer has an abrupt left cutoff.
- Targeted footer `agent-browser` check confirmed the footer vignette is
  present with `before:-top-32`, `before:h-32`, and `z-index: 20`; screenshot
  saved to `screenshot-1778849638862.png`.

### Known limits

- This was a frontend-only pass; LocalStack-dependent AWS/CDK checks remain
  intentionally deferred per the user's instruction.

## 2026-05-15 - Team Roster Front-End Filter

Implemented the revised public team section as a frontend-only slice, leaving
CMS integration for a later pass.

### Implementation

- Replaced the `/team` route's direct DynamoDB usage with a `TeamRoster` client
  component and the shared transparent navbar.
- Added placeholder roster cards using the existing local
  `/placeholders/team-member.svg` asset.
- Added a department dropdown filter with live profile counts and animated card
  re-entry via the `team-card-filter-in` keyframe.
- Included representative departments from the old roster shape, including
  Embedded Systems, Energy Systems, Chassis and Bodywork, Powertrain, Vehicle
  Dynamics, Business, and Media.

### Harness updates

- Extended `scripts/test-homepage-design.mjs` to lock the team route as
  frontend-only for this slice and assert dropdown/filter hooks.
- Extended `scripts/verify-browser.mjs` to visit `/team`, filter to Business,
  verify the visible cards are all Business cards, and assert the filtered count
  updates.

### Verification

- Startup `./init.sh`: passed before feature work with LocalStack DynamoDB/S3,
  AWS build/test, frontend typecheck/lint, and homepage design contract.
- `pnpm test:homepage-design`: passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed with one existing unrelated
  `homepage-recruitment.tsx` unused variable warning.
- `pnpm build`: passed.
- `VERIFY_URL=http://localhost:3000 pnpm verify:browser`: passed, including
  `TEAM_CONTRACT_OK:2` on `/team`.
- Final `./init.sh`: passed after implementation with LocalStack DynamoDB/S3,
  AWS build/test, frontend typecheck/lint, and homepage design contract.

### Known limits

- The team cards are placeholder front-end records only; the revised CMS-backed
  roster, real headshots, and member data remain deferred.

## 2026-05-15 - Media Highlights + Contact Redesign

Updated the media and contact pages to match the current dark public website
language.

### Implementation

- Replaced `/media`'s generic content shell with a dedicated
  `MediaHighlightsPage`.
- Mirrored the Webflow Highlights content structure: AWS media spotlight,
  Sunswift 7 four-part world-record journey, partnership spotlight links, team
  highlights, and two partner video preview placeholders.
- Replaced `/contact`'s old light PageFrame layout with a dark
  `ContactPageContent`.
- Removed any contact form path and made the primary contact action a direct
  `mailto:richard.hopkins1@unsw.edu.au` link.

### Harness updates

- Extended `scripts/test-homepage-design.mjs` to assert `/media` uses the new
  highlights page, preserves the Webflow highlights wording, and avoids public
  shadcn UI.
- Extended `scripts/test-homepage-design.mjs` to assert `/contact` is email-only
  and contains no form, input, or textarea elements.
- Extended `scripts/verify-browser.mjs` to browser-check `/media` and `/contact`
  with `MEDIA_HIGHLIGHTS_OK` and `CONTACT_OK` contracts.

### Verification

- Startup `./init.sh`: passed before feature work with LocalStack DynamoDB/S3,
  AWS build/test, frontend typecheck/lint, and homepage design contract.
- `pnpm test:homepage-design`: passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed with one existing unrelated
  `homepage-recruitment.tsx` unused variable warning.
- `pnpm build`: passed.
- `VERIFY_URL=http://localhost:3002 pnpm verify:browser`: passed against
  `next start`, including `MEDIA_HIGHLIGHTS_OK:6:3` and `CONTACT_OK`.
- Final `./init.sh`: passed after media/contact implementation with LocalStack
  DynamoDB/S3, AWS build/test, frontend typecheck/lint, and homepage design
  contract.

### Known limits

- Media visual assets remain designed placeholders; final video thumbnails and
  production media imagery are still deferred.

## 2026-05-15 - Sunswift Racing Wordmark Logo

Added the requested Sunswift Racing wordmark as a transparent SVG and replaced
the plain text wordmark in public chrome.

### Implementation

- Added `/public/brand/sunswift-racing-wordmark.svg`.
- Used `#ffd401` for the yellow Sunswift letters.
- Set the top line as Open Sans bold with expanded spacing, and the bottom line
  as Alta with a serif fallback and wider spacing.
- Added `SunswiftBrandLogo` for consistent sizing.
- Updated `TransparentNavbar`, `SiteHeader`, and `SiteFooter` to render the
  wordmark while retaining accessible labels.
- Added a dark backing only in the light sticky header so the white portions of
  the transparent logo remain visible.

### Harness updates

- Extended `scripts/test-homepage-design.mjs` to assert the wordmark SVG path,
  transparent background, requested yellow, font names, expanded spacing, alt
  text, and usage in navigation/footer code.

### Verification

- `pnpm test:homepage-design`: passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed with one existing unrelated
  `homepage-recruitment.tsx` unused variable warning.
- `pnpm build`: passed.
- `VERIFY_URL=http://localhost:3002 pnpm verify:browser`: passed against
  `next start` after replacing the nav/footer wordmarks.
- Final `./init.sh`: passed after wordmark implementation with LocalStack
  DynamoDB/S3, AWS build/test, frontend typecheck/lint, and homepage design
  contract.

## 2026-05-16 - Sunswift Logo PNG (brand asset)

Replaced the transparent SVG wordmark in `SunswiftBrandLogo` with the
user-supplied raster logo for consistent branding in nav/footer surfaces.

### Implementation

- Asset: `public/brand/sunswift-logo.svg` (user-provided PNG).
- `components/site/brand-logo.tsx`: `src` points at the PNG; hover uses
  `group-hover:brightness-[0.55]` and slight opacity change on the wrapping
  `Link`’s `group` class.

### Harness (at time of change)

- Design contract asserted `/brand/sunswift-logo.svg`, alt text, and darkening
  hover filter.

### Verification

- `pnpm test:homepage-design`, `pnpm typecheck`, `pnpm lint`: passed alongside
  other session checks.

## 2026-05-16 - Media highlights horizontal rails + Juicer (Webflow parity)

Mirrored https://sunswift.webflow.io/media/highlights layout: every section is a
horizontally scrollable strip of linked cards with Webflow CDN or YouTube
thumbnails. Left column is the same Juicer.io iframe feed as Webflow
(`unsw-sunswift`), replacing the prior manual social list.

### Implementation

- Added `content/media-highlights.json` with titles, outbound URLs, and
  `imageSrc` values scraped from the live Webflow HTML (partnership thumbnails,
  team article art, YouTube `hqdefault` for video rows). Webflow had `href="#"`
  for Optus and the AWS student piece; Optus now points at the Optus media
  centre, AWS at the published case study.
- Rebuilt `MediaHighlightsPage`: `overflow-x-auto` + `snap-x` rows, full-bleed
  gradient masks, `next/image` cards (`data-media-highlight-card`).
- Added `components/site/juicer-sidebar.tsx` embedding
  `https://www.juicer.io/api/feeds/unsw-sunswift/iframe`.
- `next.config.mjs`: `images.remotePatterns` for `cdn.prod.website-files.com` and
  `i.ytimg.com`.
- Removed `components/site/lite-youtube.tsx` and
  `components/site/socials-rail.tsx` (superseded).

### Harness

- Design contract reads `content/media-highlights.json` for Webflow phrases and
  canonical URLs; asserts Juicer sidebar + horizontal scroll markers.
- Browser contract checks Juicer iframe, six scroll rows, ≥18 linked cards, and
  later (see below) the Media Spotlight YouTube embed.

### Verification

- `pnpm test:homepage-design`, `pnpm typecheck`, `pnpm lint`, `pnpm build`:
  passed (existing recruitment unused-var warning only).

## 2026-05-16 - Media Spotlight: large featured YouTube embed

User asked for a more prominent Media Spotlight: a big in-page preview of the
AWS × Sunswift YouTube feature (same video as Webflow:
`JGSzpsJmfHA`), not only carousel cards.

### Implementation

- `content/media-highlights.json`: `featuredYoutubeId: "JGSzpsJmfHA"` on the
  `media-spotlight` section (overridable; else ID parsed from the first item’s
  `watch` URL).
- `components/site/media-highlights-page.tsx`:
  - New `MediaSpotlightSection` for `section.id === "media-spotlight"` (replaces
    generic horizontal-only layout for that section).
  - Featured block: radial glow, vertical accent lines (sm+), framed
    `aspect-video` iframe:
    `https://www.youtube-nocookie.com/embed/{id}?rel=0&modestbranding=1`.
  - `data-media-spotlight-embed` wrapper; headline copy under the player;
    **Open on YouTube** and **AWS case study** CTAs.
  - **More in this story**: existing horizontal scroll of the two thumbnail
    cards (YouTube + Webflow hero still) unchanged for parity and tests.
  - `HorizontalSection` no longer handles `media-spotlight` (avoids duplicate
    `data-media-spotlight` / `#media-spotlight`).

### Harness

- `scripts/test-homepage-design.mjs`: requires `data-media-spotlight-embed`,
  `youtube-nocookie.com/embed`, and JSON line
  `"featuredYoutubeId": "JGSzpsJmfHA"`.
- `scripts/verify-browser.mjs`: `MISSING_MEDIA_SPOTLIGHT_YOUTUBE_EMBED` if the
  nocookie iframe inside `[data-media-spotlight-embed]` is absent or wrong.

### Verification

- `pnpm test:homepage-design`, `pnpm typecheck`, `pnpm lint`: passed.

### Route note

- Highlights page remains **`/media`** in the app router (not `/media/highlights`).

## 2026-05-16 - Contact page: social media column

Added a third panel on `/contact` between **Direct email** and **Workshop**: social
handles linking to Instagram, Facebook, and LinkedIn (`data-contact-socials`,
`data-contact-social-link`, `data-social-platform`). Main grid is now
`lg:grid-cols-3`.

Harness: `test-homepage-design.mjs` asserts the hook and three URLs; browser
`CONTACT` contract expects three social link nodes plus “Message us online.” /
“Social media” / “Instagram” in body text.

## 2026-05-16 - Achievements timeline video + garage vehicle-fleet assets (Composer session)

End-to-end notes for the work consolidated in the Cursor Composer thread: optional
MP4 backgrounds on `/achievements`, a small circular reload control when the
active milestone plays video, reorganised public vehicle imagery into
`vehicle-fleet/`, milestone-specific videos for SR-7 highlights, and later
preferring `.jpg` clones where both formats existed.

### Achievements timeline (`/achievements`)

- `lib/cms/static-data.ts`: `Achievement` includes optional `videoMp4` (local path
  under `public/` or full URL). Timeline rows use `image` as the still / video
  poster.
- `components/site/achievements-timeline.tsx`: when `videoMp4` is set, renders
  `<video>` (muted, loop, `playsInline`) with scroll-driven activation; respects
  `prefers-reduced-motion` (no autoplay). Circular reload button
  (`data-achievements-video-reload`, Lucide `RotateCw`) visible only when the
  active card has video; restarts the active clip.
- Intro/meta image fallback uses the first achievement’s `image`
  (`achievements[0]?.image`).
- **`vehicle-violet.svg`** was removed from the repo; Violet stills use raster
  assets under **`/vehicle-fleet/`** (see below).

### Videos under `public/placeholders/` (kept there by design)

- **BWSC ’23** (year `2023`): `videoMp4: "/placeholders/bwsc-23-vid.mp4"`,
  poster `"/vehicle-fleet/vehicle-sunswift-7.jpeg"` (later `.jpeg` only if no
  matching `.jpg` duplicate exists).
- **Guinness World Record ’22**: `videoMp4: "/placeholders/sr7-world-record.mp4"`,
  same SR-7 poster as other SR-7 milestones for that era.
- **BWSC ’19 (VIolet)** (optional demo): `videoMp4: "/placeholders/timeline-violet-demo.mp4"`
  with Violet poster — can be swapped to a CDN URL later.

### Garage / vehicles (`/vehicles`)

- **`public/vehicle-fleet/`**: canonical raster fleet photos — `vehicle-i.jpg`,
  `vehicle-ii.jpg`, `vehicle-iii.jpg`, `vehicle-ivy.jpg`, `vehicle-eve.jpg`,
  `vehicle-sunswift-7.jpeg`, `vehicle-sunswift-8.jpg`, `vehicle-violet.avif`
  (Violet stays **AVIF** until a same-name `.jpg` exists).
- **`public/placeholders/`**: retains **MP4** timeline clips, **non-vehicle**
  art (`garage.svg`, `lab.svg`, `hero-track.svg`, `team-member.svg`, etc.);
  obsolete **`vehicle-*.svg`** stubs were deleted after all code paths pointed at
  `vehicle-fleet`.
- `lib/cms/static-data.ts` `vehicles[]` and `achievements[]` image fields use
  **`/vehicle-fleet/...`** for every car still.
- Also updated for consistency: **`content/about-pages.json`**,
  `components/site/about-editorial-pages.tsx`,
  **`components/site/homepage-records.tsx`**,
  **`components/site/homepage-zoom-reveal.tsx`**
  (`vehicle-sunswift-8`), and achievements fallback in **`achievements-timeline.tsx`**.
- **`components/site/vehicles-gallery.tsx`**: garage strip and detail modal use
  **`next/image` with `quality={100}`** (max encoder setting) and **larger `sizes`**
  hints than before so responsive **srcset** pulls enough pixels when a strip
  expands on hover/focus or on high-DPR screens (still optimised by the framework,
  not `unoptimized`).

### Prefer `.jpg` when duplicate filenames existed

- Code and JSON now use **`/vehicle-fleet/vehicle-ii.jpg`** and
  **`vehicle-iii.jpg`** instead of the former `.avif` twins; **`vehicle-sunswift-8`**
  references use **`.jpg`** (not `.png`).
- **`vehicle-ii.avif`** / **`vehicle-iii.avif`** were removed from `vehicle-fleet/`
  after the switch.

### Harness / contracts

- **`scripts/test-homepage-design.mjs`**: achievements must expose
  `data-achievements-video-reload` and `<video>`; static data must include
  `videoMp4`; Violet path assertions use **`/vehicle-fleet/vehicle-violet.avif`**.
  (Session also repaired a broken `assert()` around the **team route** /
  **TransparentNavbar** + **TeamRoster**, and aligned **contact social URL**
  expectations with **`UNSWSunswift`** / **`unsw-sunswift`** LinkedIn slugs.)
- **`scripts/verify-browser.mjs`**: achievements contract asserts at least one
  mounted **`<video>`** under **`[data-achievements-stage]`** (sticky background stack).

### Verification (as run in-session)

- `pnpm test:homepage-design`: passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed (existing **`homepage-recruitment.tsx`** unused variable
  warning only).
- `pnpm build`: passed.

## 2026-05-16 - Our Story (`/our-story`): `public/stories` imagery

Aligned the redesign with Webflow **`/about-us/our-story`** photos under **`public/stories/`**
(parquet layout per chapter):

- **`story-1` (Sunswift I):** thumbnail **`/stories/sr-i/sr-1-thumbnail.avif`**; five inline blocks use
  **`sr-i-story-1.jpg` … `sr-i-story-5.jpg`** via **`{ "type": "image", "src": "…" }`** in
  **`content/about-pages.json`**.
- **`story-2`:** **`/stories/sr-ii/sr-2-thumbnail.avif`** plus **`srii-story-1` … `srii-story-7`**
  (including **`srii-story-3.png`**).
- **`story-3`:** **`/stories/sr-iii/sr-3-thumbnail.avif`** plus **`sr-3-story-1.jpg` … `sr-3-story-4.jpg`**.
- **`story-4` (IVy):** **`/stories/sr-ivy/ivy-thumbnail.avif`** plus **`ivy-story-1.jpg` … `ivy-story-7.jpg`**.

Implementation notes:

- **`StoryBlock`** type includes optional **`src`** on **`image`** blocks; **`StoryBlockView`** reads **`block.src`**
  (fallback **`garage.svg`** if absent).
- **`OurStoryEditorialPage`** **`DarkHero`** background uses **`articles[0]?.image`** (SR‑I thumbnail) instead of a
  generic garage SVG.
- **Who We Are → Discover → Our Story** card image in JSON points at **`/stories/sr-i/sr-1-thumbnail.avif`**
  for visual consistency.

### Follow-up: no caption bar on Our Story photos

- **`PlaceholderImage`** gained **`showCaption`** (default **`true`** for Who We Are gallery / discover cards).
- On **`/our-story`**, sticky-column thumbnails and all inline chapter photos use **`showCaption={false}`** so the
  mono footer label bar (“Story photograph” / article title) no longer overlays those images.

### Verification

- `pnpm test:homepage-design`, `pnpm typecheck`: passed after JSON + component updates.

## 2026-05-16 - Vehicle Overview Carousel, Tag Removal, Page Titles

- Added Webflow-inspired overview copy to all existing vehicle records except
  SR-8, which remains future-facing placeholder content for now.
- Reworked the vehicle detail view so achievements and overview sit in a
  hover/focus-gated wheel carousel, while technical specifications now render
  as the bottom detail section.
- Increased vehicle quick-summary contrast by using white text with a subtle
  shadow over the image surfaces.
- Removed legacy Webflow-style tag/chip surfaces from recruitment pages,
  homepage recruitment stream cards, generic content pages, and vehicle
  related-post chips.
- Added App Router metadata titles so browser tabs now use route-specific
  labels such as `About Us | Sunswift Racing`, `Vehicles | Sunswift Racing`,
  and stream-specific recruitment role titles.
- Updated static and browser verification contracts for the vehicle carousel,
  tag removal, media/vehicle horizontal-scroll allowlists, and page titles.

Verification:

- Baseline `./init.sh`: passed before implementation with LocalStack
  DynamoDB/S3, AWS build/test, frontend typecheck/lint, and homepage design
  contract.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm test:homepage-design`: passed.
- `pnpm build`: passed.
- `pnpm verify:browser`: passed against the running dev server, including the
  new `VEHICLES_OK:8`, route title checks, recruitment tag-removal checks,
  media/contact/recruitment/partners route checks, and screenshots.
- Final `./init.sh`: blocked at Docker daemon health check with
  `Docker daemon is not reachable. Start Docker, then rerun ./init.sh.`

Known limits:

- The working tree already contains unrelated and overlapping user changes, so
  this session was not committed to avoid bundling unrelated edits.

## 2026-05-16 - Vehicle Carousel Click Amendment

- Amended the vehicle detail carousel so achievements/overview switching uses
  explicit click controls instead of the previous hover/focus + wheel gesture.
- Removed the wheel handler, hover-gated carousel state, and `Hover + scroll`
  instruction from `components/site/vehicles-gallery.tsx`.
- Updated static and browser verification contracts to assert click controls
  (`data-vehicle-carousel-trigger`) and the absence of the old wheel gesture.

Verification:

- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm test:homepage-design`: passed.
- `pnpm build`: passed.
- `pnpm verify:browser`: passed against the running dev server, including
  `VEHICLES_OK:8` with the click-based overview transition.
- `./init.sh`: intentionally skipped because Docker/LocalStack is stopped for
  RAM constraints in this session.

## 2026-05-16 - Mobile Timeline + Homepage SR8 Handoff

- Added a mobile-specific achievements timeline layout that swaps the desktop
  horizontal scroll stage for stacked vertical milestone cards below `md`.
- Updated the achievements scroll logic to use the mobile card nearest the
  viewport focus point as the active milestone while preserving the desktop
  horizontal timeline behaviour.
- Reverted the media and contact page polish changes from this session at user
  request; those pages keep their prior layout/functionality.
- Changed the homepage hero from the old SVG placeholder to the SR-8 image at
  `/vehicle-fleet/vehicle-sunswift-8.jpg`.
- Updated the `What is Sunswift Racing?` homepage section to share the same
  SR-8 image and light `#f6f5f1` canvas as the scroll reveal, preparing the
  page for a future scroll-synced vehicle render/WebP sequence.
- Updated static and browser verification contracts for the mobile timeline and
  SR-8 homepage image handoff, while removing the reverted media/contact polish
  assertions.

Verification:

- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm test:homepage-design`: passed.
- `pnpm build`: passed.
- `pnpm verify:browser`: passed against the running dev server, including
  homepage desktop/mobile, `ACHIEVEMENTS_MOBILE_OK`, media/contact route checks,
  vehicles, recruitment, and partners.
- `git diff --check`: passed.
- `./init.sh`: intentionally skipped because Docker/LocalStack is stopped for
  RAM constraints in this frontend-only session.

## 2026-05-16 - CMS Admin + Lambda Backend Foundation

- Implemented the CMS admin foundation from `CMS.md` around team members,
  recruitment roles, partners, and tracked media assets.
- Added extended CMS types for team hierarchy/department metadata,
  recruitment role active/import fields, partners, and media assets.
- Added a server-only CMS API facade:
  - uses `CMS_API_URL` when configured
  - falls back to LocalStack/DynamoDB/S3 helpers locally
  - keeps public pages on static fallbacks if CMS reads fail
- Updated admin actions so draft saves, publishes, uploads, CSV imports, and
  heavy-media registration go through the facade instead of direct UI writes.
- Added `/admin/partners` and `/admin/assets`, plus partner/asset nav entries.
- Updated public `/team`, `/partners`, homepage recruitment, and available-role
  pages to read published records through the CMS facade.
- Added CSV import helpers for Webflow team/recruitment/partner exports and
  `sr-headshots` output while excluding private roster fields.
- Added `content/cms-assets.json` and a public asset helper for the heavy local
  assets:
  - `/placeholders/sr7-world-record.mp4`
  - `/placeholders/bwsc-23-vid.mp4`
  - `/vehicle-fleet/vehicle-ivy.jpg`
- Updated AWS CDK with `WebsiteV3CMSApi`, IAM-authenticated API Gateway
  methods, `CmsAdminHandler`, `CmsAssetHandler`, private CMS staging bucket,
  public assets bucket, CloudFront delivery, and a Next runtime invoke policy.
- Expanded LocalStack services and bootstrap to include IAM/API/Lambda/logs,
  the public assets bucket, partner seed records, and media asset records.
- Updated `AGENTS.md`, `CMS.md`, static verification, and browser verification
  for the new admin/CMS surface.

Verification:

- Baseline `./init.sh`: passed before implementation.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm test:homepage-design`: passed.
- `pnpm build`: passed.
- `npm run build` in `aws`: passed.
- `npm test -- --runInBand` in `aws`: passed.
- Final `./init.sh`: passed with expanded LocalStack services, both S3
  buckets, AWS build/test, frontend typecheck/lint, and homepage design
  contract.
- `pnpm verify:browser`: passed against the running dev server, including
  public routes and the unauthenticated `/admin` → `/admin/login` check.
- `git diff --check`: passed.

Known limits:

- The Lambda handler files are foundation handlers for CRUD/publish/presign
  shape. Full production image normalization and direct browser presigned
  upload flow still needs provider-level deployment validation.
- Not committed because the working tree already contains unrelated and
  overlapping changes.

## 2026-05-16 - CMS Admin Developer Login + Regression Docs

- Added a non-production Auth.js credentials provider for the local developer
  test account `developer@sunswift.unsw.edu.au`.
- Kept Google OAuth on `/admin/login`; the developer login is shown only when
  `NODE_ENV !== "production"` and `ENABLE_DEV_ADMIN_LOGIN !== "false"`.
- Added `signInAsDeveloper` as a guarded server action and a stable
  `data-dev-admin-login` hook for browser verification.
- Added `pnpm verify:cms-admin`, implemented in
  `sunswift-website-v3/scripts/verify-cms-admin.mjs`, to test:
  - unauthenticated `/admin` redirect/login
  - developer sign-in
  - admin dashboard CMS counts/navigation
  - team draft edit persistence through LocalStack
  - partners admin surface
  - assets admin heavy-media records
- Expanded LocalStack seeds so CMS-backed public regressions work with local
  data instead of falling through to static fallbacks:
  - added the published/draft `Partnerships Associate` business role
  - seeded the full 35-partner public/draft partner list
- Added `sunswift-website-v3/CMS_ADMIN_SETUP.md` with local LocalStack setup,
  developer login usage, regression commands, AWS/CDK checks, production env
  vars, IAM expectations, and admin usage notes.
- Updated static harness assertions so the dev login and CMS admin regression
  script remain wired into the project.

Verification:

- `./init.sh`: passed after LocalStack seed expansion.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm test:homepage-design`: passed.
- `pnpm build`: passed.
- `VERIFY_URL=http://localhost:3100 pnpm verify:cms-admin`: passed with
  developer sign-in, dashboard checks, a persisted team draft edit, partners
  admin, and assets admin.
- `VERIFY_URL=http://localhost:3100 pnpm verify:browser`: passed after seed
  alignment, including recruitment streams, partners grid, and admin login.
- `npm run build` in `aws`: passed.
- `npm test -- --runInBand` in `aws`: passed.
- `git diff --check`: passed.

Known limits:

- The developer login is intended for local regression only; production should
  set `ENABLE_DEV_ADMIN_LOGIN=false` and use Google OAuth.
- Do not run `pnpm verify:cms-admin` and `pnpm verify:browser` in parallel
  because `agent-browser` shares browser session state.
- Not committed because the working tree already contains unrelated and
  overlapping changes.

## 2026-05-16 - CMS Admin End-User LocalStack Test

- Started LocalStack through `./init.sh` and ran the app against
  `AWS_ENDPOINT_URL=http://localhost:4566` on `http://localhost:3100`.
- Logged into `/admin/login` with the non-production developer account
  `developer@sunswift.unsw.edu.au`.
- Exercised the admin UI with browser automation:
  - imported a 10-member team CSV through `/admin/team`
  - edited `End User Test Captain` to role `Published CMS Team Captain`
  - published the 10 imported team records
  - imported `End User Design Lead` through `/admin/recruitment`
  - edited and published design, engineering, and business role descriptions
- During the first publish attempt, discovered a DynamoDB write bug:
  published records kept the draft `type` key because stored item metadata was
  spread after the generated published key.
- Fixed the CMS DynamoDB put helpers so `id`, `type`, and `status` are applied
  after the record spread in:
  - `putTeamMember`
  - `putRecruitmentRole`
  - `putPartner`
  - `putMediaAsset`
- Added a static harness assertion to prevent regressions in the write order.

End-user verification:

- LocalStack DynamoDB query confirmed published team records including
  `member#end-user-test-captain#published`.
- LocalStack DynamoDB query confirmed published role records including:
  - `role#end-user-design-lead#published`
  - `role#vehicle-dynamics-engineer#published`
  - `role#partnerships-associate#published`
- Browser check on `/team`: passed with
  `PUBLIC_TEAM_REFLECTS_ADMIN:11:11`, including `End User Test Captain` and
  `Published CMS Team Captain`.
- Browser check on `/recruitment/available-roles`: passed with the new design
  role count visible.
- Browser checks on design, engineering, and business role stream pages passed
  with the edited published descriptions visible.

Verification:

- `./init.sh`: passed before the end-user test and after the publish fix.
- `pnpm build`: passed.
- `VERIFY_URL=http://localhost:3100 pnpm verify:cms-admin`: passed.
- `git diff --check`: passed.

Known limits:

- The test data lives only in LocalStack and is reset by `./init.sh`.
- Not committed because the working tree already contains unrelated and
  overlapping changes.

## 2026-05-16 - Navbar logo sizing, vehicle-detail slogan polish, and harness notes

### Navbar brand lockup

- **`components/site/brand-logo.tsx`:** default width **`w-28`** (was **`w-36`**) and **`sizes="7rem"`** so the
  updated SVG scales down in chrome.
- **`components/site/transparent-navbar.tsx`:** **`w-28 sm:w-32`** (was **`w-32 sm:w-40`**).
- **`components/site/site-shell.tsx`:** **`w-24 sm:w-28`** in header + mobile drawer (was **`w-28 sm:w-32`**).

### Vehicle detail slogan (garage modal)

- **`components/site/vehicles-gallery.tsx`:** removed **`border-l`** and extra **`pl-*`** on the summary (the stroke
  aligned with the heading box while large display caps sat optically inward, so the bar looked left of **“SR‑7”**).
- **`vehicle.name`** and **`vehicle.summary`** share a **`flex flex-col gap-2 sm:gap-3`** block with **`lg:pl-5`** so the
  italic slogan sits **directly under** the title with even vertical rhythm.
- Summary keeps **`italic`**, **`text-white`**, and **`text-shadow:0_1px_16px`** for **`pnpm test:homepage-design`**
  legibility assertions; slightly larger **`sm:text-xl`** for scale against the headline.

### Narrow typecheck fixes (adjacent unblock)

- **`app/admin/actions.ts`:** **`String(...)`**-wrap **`department`** / **`hierarchyLevel`** **`FormData`** reads before normalizers.
- **`components/site/team-roster.tsx`:** **`discipline: member.discipline ?? ""`** in **`toRosterMember`**.

### Artefacts / harness

- **`feature_list.json`:** **`nav-logo-shrink-vehicle-slogan-polish`** (**priority** 56) with **`verification`**
  evidence from **`pnpm typecheck`**, **`pnpm lint`**, **`pnpm test:homepage-design`**.

Verification (this slice):

- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm test:homepage-design`: passed.

## 2026-05-16 - Blockier footer and achievements timeline tightening

Implementation:

- Reworked the shared `SiteFooter` into a compact blocked layout with explicit
  cell borders, a solid dark top block, and no soft shadow-heavy footer
  treatment.
- Removed the achievements intro's 1996 -> 2026 year-stamp/wipe transition.
- Kept the pinned scroll intro, but simplified its handoff into a solid block
  panel so the transition clicks into the timeline without extra decorative
  layers.
- Tightened the desktop achievements rail by adding a 10% initial scroll hold
  before horizontal translation begins, so the first milestone no longer skips
  immediately.
- Reduced timeline background motion by removing active/inactive media scale
  shifts and replacing broad radial overlays with blockier dark panels.
- Narrow lint unblock: changed the team roster reveal effect so it schedules
  state through `requestAnimationFrame`, satisfying the React hooks lint rule.

Harness updates:

- `scripts/test-homepage-design.mjs` now rejects the old 1996 -> 2026
  transition layer and asserts the new block handoff + first-item hold.
- `scripts/verify-browser.mjs` now validates the footer's blocked edge/fade
  instead of the previous gradient vignette contract.

Verification:

- `node scripts/test-homepage-design.mjs`: passed.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint --quiet`: passed.
- `./node_modules/.bin/next build`: passed.
- `PATH="$PWD/node_modules/.bin:$PATH" VERIFY_URL=http://127.0.0.1:3012 node
scripts/verify-browser.mjs`: passed against `next start` on port 3012.
- Targeted desktop achievements check at `1440x1000`: at 5.5% timeline scroll
  the first milestone remained active with rail transform `matrix(..., 0, 0)`;
  at 24% scroll the rail moved to `-514.733px` and the active year advanced to 2019. The same check confirmed the 1996 -> 2026 stamp text is gone.

Known limits:

- LocalStack-dependent AWS/CDK checks were skipped for this frontend-only pass.
- The working tree already contained modified placeholder video assets; they
  were not changed by this pass.

## 2026-05-17 - Landing hard-transition rollback and dropdown motion

Implementation:

- Rolled back the broad sitewide no-gradient sweep. Non-landing feature pages and
  shared chrome can keep their existing gradient/vignette/dropdown treatments.
- Kept the landing page hard-transition scope: `HomepageRecords` and
  `HomepageRecruitment` have no gradient tokens and transition directly through
  solid colour blocks.
- Kept the Embrace Tomorrow hard yellow accent block instead of the old animated
  yellow glow, so the records handoff goes straight to black without grey haze.
- Added animated open/close treatment to the Design, Engineering, and Business
  recruitment dropdowns using stable grid-row reveal, opacity, blur, and
  transform transitions.
- Restored gradient accents in shared dropdown chrome, achievements overlays,
  team roster imagery, page background vignette, and footer vignette.
- Updated `AGENTS.md` interface design rules to clarify that no-gradient rules
  must be scoped, while purposeful gradients in dropdowns, vignettes, imagery,
  and feature sections should be preserved unless that component is explicitly
  targeted.

Harness updates:

- Removed the recursive public app/component no-gradient guard from
  `scripts/test-homepage-design.mjs`.
- Kept the landing records hard-block assertion and added an assertion that the
  recruitment discipline dropdowns animate their reveal state.
- Restored footer/vehicles vignette assertions to expect gradient treatment.
- `scripts/verify-browser.mjs` again validates the shared footer vignette while
  still checking the landing recruitment hard block.

Verification:

- `rg -n "gradient|linear-gradient|radial-gradient|conic-gradient|bg-gradient"
components/site/homepage-*.tsx app/globals.css`: no matches.
- `node scripts/test-homepage-design.mjs`: passed.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint --quiet`: passed.
- `./node_modules/.bin/next build`: passed.
- `PATH="$PWD/node_modules/.bin:$PATH" VERIFY_URL=http://127.0.0.1:3013 node
scripts/verify-browser.mjs`: passed against `next start` on port 3013.

Known limits:

- LocalStack-dependent AWS/CDK checks were skipped for this frontend-only pass.
- The working tree already contained modified placeholder video assets and a
  `.DS_Store`; they were not changed by this pass.

## 2026-05-17 - Landing Opal-style hard background transition

Implementation:

- Left the achievements timeline unchanged after reverting the in-progress scroll-lock edits.
- Reworked `HomepageRecords` so the white-to-black transition is a solid black wipe over a white base, avoiding the old grey opacity blend.
- Removed translate motion from the left "Moving records forward" copy; only the right-side record carousel moves vertically.
- Removed the visible yellow Embrace Tomorrow background block by keeping the hook hidden on a fully black section.
- Removed blur from the Design / Engineering / Business dropdown reveal and replaced it with grid-row reveal, transform/opacity motion, and an animated accent rule.
- Updated `scripts/test-homepage-design.mjs` and `scripts/verify-browser.mjs` to assert the new hard-wipe and non-blur dropdown behavior.

Verification:

- `node scripts/test-homepage-design.mjs`: passed.
- `./node_modules/.bin/tsc --noEmit`: passed.
- `./node_modules/.bin/eslint --quiet`: passed.
- `./node_modules/.bin/next build`: passed.
- `PATH="$PWD/node_modules/.bin:$PATH" VERIFY_URL=http://127.0.0.1:3013 node scripts/verify-browser.mjs`: passed against `next start` on port 3013.

Known limits:

- LocalStack-dependent checks were skipped for this frontend-only pass.
- Existing dirty placeholder video assets and `.DS_Store` were not touched.

## 2026-05-17 - Records transition timing restore

Implementation:

- Restored the homepage world-records transition timing to the prior stable
  choreography: the solid black wipe starts early, while the "Moving records
  forward" copy and record carousel stay readable until the final handoff.
- Delayed the text-colour flip until the black wipe is mostly complete so dark
  text is not shown over the dark panel during the transition.
- Tightened `scripts/test-homepage-design.mjs` so the expected timing contract
  covers the restored wipe/copy/content thresholds.
- Extended `scripts/verify-browser.mjs` with a mid-scroll assertion that catches
  the broken state where the copy clears before the black wipe has taken over.

Verification:

- `./init.sh`: passed before implementation with LocalStack DynamoDB/S3, AWS
  build/test, frontend typecheck/lint, and homepage design contract.
- `pnpm test:homepage-design`: passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed.
- `pnpm exec agent-browser open http://127.0.0.1:3013 && pnpm exec
  agent-browser wait --load networkidle && pnpm exec agent-browser screenshot
  --annotate && pnpm exec agent-browser snapshot -i`: passed.
- `PATH="$PWD/node_modules/.bin:$PATH" VERIFY_URL=http://127.0.0.1:3013 pnpm
  verify:browser`: passed against `next start` on port 3013, including
  `RECORDS_TRANSITION_OK`.
- `./init.sh`: passed after implementation with LocalStack DynamoDB/S3, AWS
  build/test, frontend typecheck/lint, and homepage design contract.

Known limits:

- The global `agent-browser` binary was not on PATH, so browser verification used
  the repo-local CLI via `pnpm exec` / `node_modules/.bin`.
- `next start` logged the existing Auth.js missing-secret warning when the
  browser verifier visited `/admin/login`; the verifier still passed.
- The untracked `new_animation_task.md` file was not changed.

## 2026-05-17 - Footer Sunswift logo transparent treatment

Implementation:

- Updated the shared site footer so the Sunswift Racing home logo link uses the
  same transparent wrapper treatment as the transparent navbar, removing the
  white footer backing around the mark.
- Increased the footer Sunswift logo sizing to `w-28 sm:w-32` so it matches the
  navbar proportions more closely.
- Added a homepage design contract assertion that the footer Sunswift logo stays
  on a transparent wrapper instead of returning to a white box.

Verification:

- `./init.sh`: passed before implementation with LocalStack DynamoDB/S3, AWS
  build/test, frontend typecheck/lint, and homepage design contract.
- `pnpm test:homepage-design`: passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed.
- `pnpm exec agent-browser open http://127.0.0.1:3013 && pnpm exec
  agent-browser wait --load networkidle && pnpm exec agent-browser eval
  'window.scrollTo(0, document.body.scrollHeight); "scrolled"' && pnpm exec
  agent-browser screenshot --annotate`: passed; computed footer logo link
  background was `rgba(0, 0, 0, 0)`.
- `PATH="$PWD/node_modules/.bin:$PATH" VERIFY_URL=http://127.0.0.1:3013 pnpm
  verify:browser`: passed against `next start` on port 3013.
- `./init.sh`: passed after implementation with LocalStack DynamoDB/S3, AWS
  build/test, frontend typecheck/lint, and homepage design contract.

Known limits:

- `next start` logged the existing Auth.js missing-secret warning when the
  browser verifier visited `/admin/login`; the verifier still passed.
- The untracked `new_animation_task.md` file was not changed.
