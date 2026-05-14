# Sunswift Website V3

This repo contains the Sunswift Racing website rebuild and its local CMS harness.
The app is a Next.js 16 project in `sunswift-website-v3/`, backed locally by
LocalStack DynamoDB and S3.

## Requirements

- Docker with the daemon running
- Node.js 20+ for the current toolchain
- `pnpm`
- Optional for visual verification: Chrome support for `agent-browser`

## First Run

From the repo root:

```bash
./init.sh
```

`./init.sh` starts LocalStack, creates the local DynamoDB table and S3 bucket,
seeds CMS data, then runs AWS and frontend checks.

## Web App Development

```bash
cd sunswift-website-v3
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

Useful routes:

- `/` redesigned landing page
- `/vehicles` garage-style vehicle showcase
- `/team` CMS-backed team page
- `/recruitment` CMS-backed roles page
- `/admin/login` hidden admin login route

## Local Environment

For local CMS access, use:

```bash
AWS_ENDPOINT_URL=http://localhost:4566
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
CMS_TABLE_NAME=WebsiteV3CMS
CMS_ASSETS_BUCKET=website-v3-cms-assets
AUTHORIZED_ADMIN_EMAILS=developer@sunswift.unsw.edu.au
AUTH_SECRET=local-development-secret
AUTH_GOOGLE_ID=<google-oauth-client-id>
AUTH_GOOGLE_SECRET=<google-oauth-client-secret>
```

Google OAuth is required for real admin login testing. Without Google OAuth
credentials, `/admin/login` still renders but sign-in cannot complete.

## Placeholder Content

Public placeholder copy is imported from the current Webflow site into a local
JSON file. It is not fetched at runtime.

```bash
cd sunswift-website-v3
pnpm import:webflow
```

The generated file is `content/webflow-pages.json`.

## Verification

Run these before handing work off:

```bash
./init.sh
cd sunswift-website-v3
pnpm typecheck
pnpm lint
pnpm test:homepage-design
pnpm build
```

For visual verification, start the dev server and run the local browser check:

```bash
cd sunswift-website-v3
pnpm dev
pnpm exec agent-browser install
pnpm verify:browser
```

`agent-browser install` is only needed the first time on a machine. If browser
verification cannot run, record that limitation and run HTTP smoke checks for
the public routes.

## Deploy Testing

For a production-like local build:

```bash
cd sunswift-website-v3
pnpm build
pnpm start
```

For Vercel preview testing, configure the environment variables above in the
target Vercel project, then deploy from `sunswift-website-v3/`.
