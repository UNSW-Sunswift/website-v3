CMS replacement system that is a replacement for native webflows CMS. 

This is a system that enables for the live editing of data on a front-end website. Key data such as members, available roles and partners are stored in a dynamodb table that the front-end will then pull from. There will be a hidden route in the website /admin/ which, as mentioned before, when logged in (only with google OAuth), will login to a dashboard which enables the uploading of files such as a schema for the member roster, and a place to upload images to the s3 bucket. Originally, to update the webflows website, a local script was needed where it compressed the image and then uploaded to s3: this is to be integrated into the webapp, with the website having permissions to update the dynamoDB table. The interface should be user friendly as possible, such that a non software savvy member is able to take over and maintain the website. The original functionality to update the headshots on the website can be found in sr-headshots, and the old-cms-schemas detail how the old cms stuff was stored. Ideally, this is all to be implemented in AWS as lambda functions that are called when we want to update something in roles, partners or headshots. Make sure that this functionality is also tested locally with localstack as well. 

Furthermore, Most images + videos that make it so that each visitor exceeds 10mb of data is to also be offloaded to an AWS S3 Bucket. This is to be made in the aws/ folder, and to be tested in the localstack as well. There already exists a bucket that houses headshots. 

## Implemented AWS-backed direction

- Admin UI stays under `/admin`, guarded by Auth.js Google OAuth and the
  `AUTHORIZED_ADMIN_EMAILS` allowlist.
- Next.js admin actions now call a CMS API facade. In production this can call
  the IAM-protected `CMS_API_URL`; locally it falls back to the same DynamoDB/S3
  helpers used by the LocalStack harness.
- CDK defines `WebsiteV3CMSApi` API Gateway with IAM authorization, Lambda
  handlers for CMS records and upload staging, the `WebsiteV3CMS` DynamoDB
  table, a private staging bucket, a public assets bucket, and CloudFront public
  delivery.
- CMS records now cover team members, recruitment roles, partners, and tracked
  media assets. CSV import helpers accept the old Webflow exports and the
  `sr-headshots` output without persisting private roster fields such as zID or
  UNSW email.
- Heavy public assets over 10 MB are tracked in `content/cms-assets.json` and
  can resolve through `CMS_PUBLIC_ASSET_BASE_URL` /
  `NEXT_PUBLIC_CMS_PUBLIC_ASSET_BASE_URL` when deployed.


