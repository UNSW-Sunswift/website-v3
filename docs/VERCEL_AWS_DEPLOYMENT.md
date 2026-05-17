# Vercel + AWS Deployment

This app can run publicly on Vercel while using AWS for the CMS database and
large media storage.

## AWS Infrastructure

Deploy the CDK stack in `../aws`:

```bash
cd aws
npm run build
npm test -- --runInBand
npx cdk deploy
```

The stack provisions:

- DynamoDB table: `WebsiteV3CMS`
- Private CMS upload bucket: team headshots and partner logos
- Public media bucket: large files such as videos and large images
- CloudFront distribution in front of the public media bucket
- API Gateway/Lambda CMS endpoints for future signed API use

Use the CDK outputs:

- `CMSAssetsBucketName`
- `CMSPublicAssetsBucketName`
- `CMSPublicAssetBaseUrl`
- `CMSApiUrl`

## Vercel Project Setup

From `sunswift-website-v3`:

```bash
vercel login
vercel link --yes --project <project-name-or-id> --scope <team-or-user>
vercel pull
```

Set these Vercel environment variables for Production, Preview, and Development
as needed:

```text
AUTH_SECRET=<generated strong secret>
AUTH_GOOGLE_ID=<google oauth client id>
AUTH_GOOGLE_SECRET=<google oauth client secret>
AUTHORIZED_ADMIN_EMAILS=person1@gmail.com,person2@gmail.com

AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=<runtime iam access key>
AWS_SECRET_ACCESS_KEY=<runtime iam secret>
CMS_TABLE_NAME=WebsiteV3CMS
CMS_ASSETS_BUCKET=<CMSAssetsBucketName>
CMS_PUBLIC_ASSETS_BUCKET=<CMSPublicAssetsBucketName>
CMS_PUBLIC_ASSET_BASE_URL=<CMSPublicAssetBaseUrl>
NEXT_PUBLIC_CMS_PUBLIC_ASSET_BASE_URL=<CMSPublicAssetBaseUrl>
```

Do not set `AWS_ENDPOINT_URL` on Vercel; it is only for LocalStack.

For the current app runtime, the simplest public setup is direct AWS SDK access
from Vercel using an IAM user or role with least-privilege access to:

- DynamoDB `GetItem`, `Query`, `PutItem`, and `DeleteItem` on `WebsiteV3CMS`
- S3 `GetObject` and `PutObject` on both CMS asset buckets
- S3 `HeadObject` on the public media bucket for upload registration

Leave `CMS_API_URL` unset unless you add request signing for the IAM-protected
API Gateway. The local app already falls back to direct DynamoDB/S3 access when
`CMS_API_URL` is not set.

## Google OAuth

In the Google Cloud OAuth client:

- Add the production callback URL:
  `https://<your-domain>/api/auth/callback/google`
- Add preview callback URLs if you want admin login on preview deployments.
- Keep all allowed admin emails in `AUTHORIZED_ADMIN_EMAILS`.

The app requests Google with `prompt=select_account`, so admins can choose from
multiple Gmail/Google accounts during login.

## Large Media Uploads

Use `/admin/assets` after signing in. The uploader:

1. Requests an authenticated presigned URL from the app.
2. Uploads the file directly from the browser to the public S3 bucket.
3. Registers the uploaded object in the CMS asset list.
4. Shows the public CloudFront URL to paste into content.

The public media S3 bucket requires CORS for browser uploads; the CDK stack sets
GET, HEAD, and PUT with `ETag` exposed.
