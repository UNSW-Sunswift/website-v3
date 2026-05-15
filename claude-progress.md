# Claude Progress

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
