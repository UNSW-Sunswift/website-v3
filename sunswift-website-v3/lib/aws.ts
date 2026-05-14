import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { S3Client } from "@aws-sdk/client-s3"
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"

let dynamoClient: DynamoDBDocumentClient | null = null
let s3Client: S3Client | null = null

function getAwsBaseConfig() {
  const endpoint = process.env.AWS_ENDPOINT_URL

  return {
    region: process.env.AWS_REGION ?? "ap-southeast-2",
    endpoint,
    credentials: endpoint
      ? {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "test",
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "test",
        }
      : undefined,
  }
}

export function getDynamoClient() {
  if (!dynamoClient) {
    dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient(getAwsBaseConfig()))
  }

  return dynamoClient
}

export function getS3Client() {
  if (!s3Client) {
    s3Client = new S3Client({
      ...getAwsBaseConfig(),
      forcePathStyle: Boolean(process.env.AWS_ENDPOINT_URL),
    })
  }

  return s3Client
}

export function getCmsTableName() {
  return process.env.CMS_TABLE_NAME ?? "WebsiteV3CMS"
}

export function getCmsAssetsBucket() {
  return process.env.CMS_ASSETS_BUCKET ?? "website-v3-cms-assets"
}
