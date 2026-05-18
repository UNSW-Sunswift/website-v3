# Vercel + AWS Deployment

The canonical deployment guide lives at
[`../docs/VERCEL_AWS_DEPLOYMENT.md`](../docs/VERCEL_AWS_DEPLOYMENT.md).

Production Vercel environments should set `CMS_PUBLIC_ASSET_BASE_URL`, the
matching `NEXT_PUBLIC_CMS_PUBLIC_ASSET_BASE_URL`, Google OAuth variables, and
AWS runtime credentials for the CMS buckets/table. Google OAuth uses
`prompt=select_account`.
