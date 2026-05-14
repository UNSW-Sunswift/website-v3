#!/usr/bin/env bash
set -euo pipefail

TABLE_NAME="${CMS_TABLE_NAME:-WebsiteV3CMS}"
ASSETS_BUCKET="${CMS_ASSETS_BUCKET:-website-v3-cms-assets}"
AWS_REGION_NAME="${AWS_DEFAULT_REGION:-ap-southeast-2}"

if awslocal dynamodb describe-table --table-name "$TABLE_NAME" >/dev/null 2>&1; then
  echo "DynamoDB table $TABLE_NAME already exists"
else
  if ! create_output=$(awslocal dynamodb create-table \
      --table-name "$TABLE_NAME" \
      --attribute-definitions AttributeName=id,AttributeType=S AttributeName=type,AttributeType=S \
      --key-schema AttributeName=id,KeyType=HASH AttributeName=type,KeyType=RANGE \
      --billing-mode PAY_PER_REQUEST 2>&1); then
    if ! grep -q "ResourceInUseException" <<<"$create_output"; then
      echo "$create_output" >&2
      exit 1
    fi
  fi

  awslocal dynamodb wait table-exists --table-name "$TABLE_NAME"
  echo "DynamoDB table $TABLE_NAME created"
fi

if awslocal s3api head-bucket --bucket "$ASSETS_BUCKET" >/dev/null 2>&1; then
  echo "S3 bucket $ASSETS_BUCKET already exists"
else
  if [ "$AWS_REGION_NAME" = "us-east-1" ]; then
    create_bucket_command=(awslocal s3api create-bucket --bucket "$ASSETS_BUCKET")
  else
    create_bucket_command=(awslocal s3api create-bucket \
      --bucket "$ASSETS_BUCKET" \
      --create-bucket-configuration LocationConstraint="$AWS_REGION_NAME")
  fi

  if ! bucket_output=$("${create_bucket_command[@]}" 2>&1); then
    if ! grep -Eq "BucketAlreadyOwnedByYou|BucketAlreadyExists" <<<"$bucket_output"; then
      echo "$bucket_output" >&2
      exit 1
    fi
  fi

  echo "S3 bucket $ASSETS_BUCKET created"
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

awslocal dynamodb put-item \
  --table-name "$TABLE_NAME" \
  --item '{
    "id": { "S": "team-members" },
    "type": { "S": "member#alex-rivera#published" },
    "slug": { "S": "alex-rivera" },
    "name": { "S": "Alex Rivera" },
    "role": { "S": "Mechanical Lead" },
    "discipline": { "S": "Engineering" },
    "bio": { "S": "Placeholder team member seeded for local CMS development." },
    "imageKey": { "S": "" },
    "status": { "S": "published" }
  }' >/dev/null

awslocal dynamodb put-item \
  --table-name "$TABLE_NAME" \
  --item '{
    "id": { "S": "team-members" },
    "type": { "S": "member#alex-rivera#draft" },
    "slug": { "S": "alex-rivera" },
    "name": { "S": "Alex Rivera" },
    "role": { "S": "Mechanical Lead" },
    "discipline": { "S": "Engineering" },
    "bio": { "S": "Placeholder team member seeded for local CMS development." },
    "imageKey": { "S": "" },
    "status": { "S": "draft" }
  }' >/dev/null

awslocal dynamodb put-item \
  --table-name "$TABLE_NAME" \
  --item '{
    "id": { "S": "recruitment-roles" },
    "type": { "S": "role#vehicle-dynamics-engineer#published" },
    "slug": { "S": "vehicle-dynamics-engineer" },
    "title": { "S": "Vehicle Dynamics Engineer" },
    "team": { "S": "Engineering" },
    "description": { "S": "Help model, validate and refine the systems that keep Sunswift cars efficient, stable and race-ready." },
    "status": { "S": "published" }
  }' >/dev/null

awslocal dynamodb put-item \
  --table-name "$TABLE_NAME" \
  --item '{
    "id": { "S": "recruitment-roles" },
    "type": { "S": "role#vehicle-dynamics-engineer#draft" },
    "slug": { "S": "vehicle-dynamics-engineer" },
    "title": { "S": "Vehicle Dynamics Engineer" },
    "team": { "S": "Engineering" },
    "description": { "S": "Help model, validate and refine the systems that keep Sunswift cars efficient, stable and race-ready." },
    "status": { "S": "draft" }
  }' >/dev/null

awslocal dynamodb put-item \
  --table-name "$TABLE_NAME" \
  --item '{
    "id": { "S": "media-assets" },
    "type": { "S": "asset#team-headshots#draft" },
    "slug": { "S": "team-headshots" },
    "name": { "S": "Team headshots" },
    "bucket": { "S": "'"$ASSETS_BUCKET"'" },
    "prefix": { "S": "draft/team/" },
    "status": { "S": "draft" }
  }' >/dev/null

echo "DynamoDB table $TABLE_NAME seeded"
