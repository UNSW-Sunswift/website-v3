#!/usr/bin/env bash
set -euo pipefail

TABLE_NAME="${CMS_TABLE_NAME:-WebsiteV3CMS}"

if awslocal dynamodb describe-table --table-name "$TABLE_NAME" >/dev/null 2>&1; then
  echo "DynamoDB table $TABLE_NAME already exists"
else
  awslocal dynamodb create-table \
    --table-name "$TABLE_NAME" \
    --attribute-definitions AttributeName=id,AttributeType=S AttributeName=type,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH AttributeName=type,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST >/dev/null

  awslocal dynamodb wait table-exists --table-name "$TABLE_NAME"
  echo "DynamoDB table $TABLE_NAME created"
fi

awslocal dynamodb put-item \
  --table-name "$TABLE_NAME" \
  --item '{
    "id": { "S": "collections/pages" },
    "type": { "S": "collection" },
    "name": { "S": "Pages" },
    "slug": { "S": "pages" },
    "fields": {
      "L": [
        { "M": { "name": { "S": "title" }, "kind": { "S": "plainText" }, "required": { "BOOL": true } } },
        { "M": { "name": { "S": "slug" }, "kind": { "S": "slug" }, "required": { "BOOL": true } } },
        { "M": { "name": { "S": "summary" }, "kind": { "S": "plainText" }, "required": { "BOOL": false } } },
        { "M": { "name": { "S": "body" }, "kind": { "S": "richText" }, "required": { "BOOL": false } } }
      ]
    }
  }' >/dev/null

awslocal dynamodb put-item \
  --table-name "$TABLE_NAME" \
  --item '{
    "id": { "S": "pages/home" },
    "type": { "S": "page" },
    "collection": { "S": "pages" },
    "slug": { "S": "home" },
    "title": { "S": "Home" },
    "summary": { "S": "Local CMS seed content for development." },
    "status": { "S": "draft" }
  }' >/dev/null

echo "DynamoDB table $TABLE_NAME seeded"
