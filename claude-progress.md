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
