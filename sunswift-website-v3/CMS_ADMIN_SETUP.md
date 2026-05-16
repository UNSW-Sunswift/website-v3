# CMS Admin Setup

This app has a hidden admin dashboard at `/admin`. Production sign-in stays Google OAuth-only, restricted by `AUTHORIZED_ADMIN_EMAILS`. Local development also exposes a developer test account so the CMS flow can be regression-tested without real Google credentials.

## Local Requirements

- Docker Desktop or Docker Engine running
- Node.js 20+
- `pnpm` for `sunswift-website-v3`
- `npm` for the `aws` CDK package

## Start The Local AWS Harness

From the repo root:

```bash
./init.sh
```

This starts LocalStack, creates the `WebsiteV3CMS` DynamoDB table, creates the CMS S3 buckets, seeds draft/published CMS records, then runs the standard frontend and AWS smoke checks.

## Run The Website Against LocalStack

From `sunswift-website-v3/`:

```bash
AWS_ENDPOINT_URL=http://localhost:4566 \
AWS_REGION=ap-southeast-2 \
AWS_ACCESS_KEY_ID=test \
AWS_SECRET_ACCESS_KEY=test \
CMS_TABLE_NAME=WebsiteV3CMS \
CMS_ASSETS_BUCKET=website-v3-cms-assets \
CMS_PUBLIC_ASSETS_BUCKET=website-v3-public-assets \
AUTH_SECRET=local-development-only-secret \
AUTHORIZED_ADMIN_EMAILS=developer@sunswift.unsw.edu.au \
pnpm dev
```

Open `http://localhost:3000/admin/login`, then choose `Continue as developer`. The local test account is `developer@sunswift.unsw.edu.au`.

To disable the local account while testing OAuth behavior:

```bash
ENABLE_DEV_ADMIN_LOGIN=false pnpm dev
```

The developer credentials provider is disabled automatically when `NODE_ENV=production`.

## Regression Checks

With the dev server running:

```bash
pnpm verify:cms-admin
pnpm verify:browser
```

Use a custom port with:

```bash
VERIFY_URL=http://localhost:3100 pnpm verify:cms-admin
```

`pnpm verify:cms-admin` checks:

- unauthenticated `/admin` redirects to `/admin/login`
- local developer sign-in reaches the dashboard
- dashboard counts and admin navigation render
- team draft editing writes through the CMS action path
- partners import/edit surface renders
- assets page contains the heavy-media S3 migration records

## AWS Functionality

The production AWS shape is defined in `aws/lib/website-v3-stack.ts`.

Run CDK checks:

```bash
cd aws
npm run build
npm test -- --runInBand
npx cdk synth
```

The stack creates:

- DynamoDB table: `WebsiteV3CMS`
- API Gateway: `WebsiteV3CMSApi`, with IAM auth
- Lambdas: `CmsAdminHandler` and `CmsAssetHandler`
- Private staging bucket: `WebsiteV3CMSAssets`
- Private public-delivery bucket: `WebsiteV3PublicAssets`
- CloudFront distribution with Origin Access Control
- managed policy output for the Next/Vercel runtime to invoke only the CMS API

Important CDK outputs:

- `CMSApiUrl`
- `CMSAssetsBucketName`
- `CMSPublicAssetsBucketName`
- `CMSPublicAssetBaseUrl`
- `NextRuntimeCmsInvokePolicyArn`

## Production Environment

Set these in the deployed Next.js runtime:

```bash
AWS_REGION=ap-southeast-2
CMS_API_URL=<CMSApiUrl>
CMS_PUBLIC_ASSET_BASE_URL=<CMSPublicAssetBaseUrl>
NEXT_PUBLIC_CMS_PUBLIC_ASSET_BASE_URL=<CMSPublicAssetBaseUrl>
AUTH_SECRET=<generated-secret>
AUTH_GOOGLE_ID=<google-oauth-client-id>
AUTH_GOOGLE_SECRET=<google-oauth-client-secret>
AUTHORIZED_ADMIN_EMAILS=developer@sunswift.unsw.edu.au
ENABLE_DEV_ADMIN_LOGIN=false
```

The browser must never receive AWS credentials. Admin server actions verify the Auth.js session, then call the CMS API facade. In production the Next runtime should receive only `execute-api:Invoke` for the CMS API through the managed policy output.

## Admin Usage

For step-by-step admin workflows (manual adds, deletes, and asset registration), see
`CMS_ADMIN_USER_GUIDE.md`.

- `/admin/team`: import team CSVs, edit draft members, stage headshots, publish public records.
- `/admin/recruitment`: import recruitment CSVs, edit role descriptions, set active/inactive state, publish public roles.
- `/admin/partners`: import partner CSVs, stage logos, edit websites/order, publish public partners.
- `/admin/assets`: register heavy public media and verify S3/CloudFront migration records.

CSV imports create drafts only. Publishing is always a separate action.
