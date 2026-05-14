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
