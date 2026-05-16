#!/usr/bin/env bash
set -euo pipefail

TABLE_NAME="${CMS_TABLE_NAME:-WebsiteV3CMS}"
ASSETS_BUCKET="${CMS_ASSETS_BUCKET:-website-v3-cms-assets}"
PUBLIC_ASSETS_BUCKET="${CMS_PUBLIC_ASSETS_BUCKET:-website-v3-public-assets}"
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

ensure_bucket() {
  local bucket_name="$1"

  if awslocal s3api head-bucket --bucket "$bucket_name" >/dev/null 2>&1; then
    echo "S3 bucket $bucket_name already exists"
    return
  fi

  if [ "$AWS_REGION_NAME" = "us-east-1" ]; then
    create_bucket_command=(awslocal s3api create-bucket --bucket "$bucket_name")
  else
    create_bucket_command=(awslocal s3api create-bucket \
      --bucket "$bucket_name" \
      --create-bucket-configuration LocationConstraint="$AWS_REGION_NAME")
  fi

  if ! bucket_output=$("${create_bucket_command[@]}" 2>&1); then
    if ! grep -Eq "BucketAlreadyOwnedByYou|BucketAlreadyExists" <<<"$bucket_output"; then
      echo "$bucket_output" >&2
      exit 1
    fi
  fi

  echo "S3 bucket $bucket_name created"
}

ensure_bucket "$ASSETS_BUCKET"
ensure_bucket "$PUBLIC_ASSETS_BUCKET"

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
    "id": { "S": "recruitment-roles" },
    "type": { "S": "role#partnerships-associate#published" },
    "slug": { "S": "partnerships-associate" },
    "title": { "S": "Partnerships Associate" },
    "team": { "S": "Business" },
    "description": { "S": "Support partner relationships, sponsorship proposals and the storytelling that powers student-led engineering." },
    "active": { "BOOL": true },
    "discipline": { "S": "Business" },
    "school": { "S": "Business" },
    "sortOrder": { "N": "30" },
    "status": { "S": "published" }
  }' >/dev/null

awslocal dynamodb put-item \
  --table-name "$TABLE_NAME" \
  --item '{
    "id": { "S": "recruitment-roles" },
    "type": { "S": "role#partnerships-associate#draft" },
    "slug": { "S": "partnerships-associate" },
    "title": { "S": "Partnerships Associate" },
    "team": { "S": "Business" },
    "description": { "S": "Support partner relationships, sponsorship proposals and the storytelling that powers student-led engineering." },
    "active": { "BOOL": true },
    "discipline": { "S": "Business" },
    "school": { "S": "Business" },
    "sortOrder": { "N": "30" },
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

awslocal dynamodb put-item \
  --table-name "$TABLE_NAME" \
  --item '{
    "id": { "S": "partners" },
    "type": { "S": "partner#aws#published" },
    "slug": { "S": "aws" },
    "name": { "S": "AWS" },
    "website": { "S": "https://aws.amazon.com/" },
    "logoKey": { "S": "" },
    "sortOrder": { "N": "10" },
    "status": { "S": "published" }
  }' >/dev/null

awslocal dynamodb put-item \
  --table-name "$TABLE_NAME" \
  --item '{
    "id": { "S": "partners" },
    "type": { "S": "partner#aws#draft" },
    "slug": { "S": "aws" },
    "name": { "S": "AWS" },
    "website": { "S": "https://aws.amazon.com/" },
    "logoKey": { "S": "" },
    "sortOrder": { "N": "10" },
    "status": { "S": "draft" }
  }' >/dev/null

seed_partner() {
  local slug="$1"
  local name="$2"
  local website="$3"
  local sort_order="$4"

  awslocal dynamodb put-item \
    --table-name "$TABLE_NAME" \
    --item '{
      "id": { "S": "partners" },
      "type": { "S": "partner#'"$slug"'#published" },
      "slug": { "S": "'"$slug"'" },
      "name": { "S": "'"$name"'" },
      "website": { "S": "'"$website"'" },
      "logoKey": { "S": "" },
      "sortOrder": { "N": "'"$sort_order"'" },
      "status": { "S": "published" }
    }' >/dev/null

  awslocal dynamodb put-item \
    --table-name "$TABLE_NAME" \
    --item '{
      "id": { "S": "partners" },
      "type": { "S": "partner#'"$slug"'#draft" },
      "slug": { "S": "'"$slug"'" },
      "name": { "S": "'"$name"'" },
      "website": { "S": "'"$website"'" },
      "logoKey": { "S": "" },
      "sortOrder": { "N": "'"$sort_order"'" },
      "status": { "S": "draft" }
    }' >/dev/null
}

seed_partner "3m-australia" "3M" "https://www.3m.com.au" "10"
seed_partner "altium" "Altium" "https://www.altium.com/" "20"
seed_partner "ampcontrol" "Ampcontrol" "https://ampcontrolgroup.com/" "30"
seed_partner "audi" "Audi" "https://www.audi.com.au/en/" "40"
seed_partner "australian-made" "Australian Made" "https://australianmade.com.au/" "50"
seed_partner "auto-ux" "Auto-UX" "https://www.auto-ux.io/" "60"
seed_partner "aws" "AWS" "https://aws.amazon.com/" "70"
seed_partner "bac-systems" "BAC Systems" "https://www.bacsystems.com.au/" "80"
seed_partner "bilstein" "Bilstein" "https://bilstein.com/en/" "90"
seed_partner "bridgestone" "Bridgestone" "https://www.bridgestone.com/" "100"
seed_partner "calm-aluminium" "Calm Aluminium" "http://www.calm-aluminium.com.au/" "110"
seed_partner "competition-friction" "Competition Friction" "#" "120"
seed_partner "cupra" "CUPRA" "https://www.cupraofficial.com.au/" "130"
seed_partner "d2n" "D2N" "https://d2n.com.au/" "140"
seed_partner "dassault-systemes" "Dassault Systemes" "https://www.3ds.com/" "150"
seed_partner "eplan" "EPLAN" "https://www.eplan-software.com/" "160"
seed_partner "ericsson" "Ericsson" "https://www.ericsson.com/en" "170"
seed_partner "espresso-displays" "Espresso Displays" "https://au.espres.so/" "180"
seed_partner "finsbury-green" "Finsbury Green" "https://finsbury.com.au/" "190"
seed_partner "jaycar" "Jaycar" "https://www.jaycar.com.au/" "200"
seed_partner "leap-australia" "LEAP Australia" "https://www.leapaust.com.au/" "210"
seed_partner "master-instruments" "Master Instruments" "https://www.master-instruments.com.au/" "220"
seed_partner "mcconaghy" "McConaghy" "http://www.mcconaghyboats.com/" "230"
seed_partner "optus" "Optus" "https://www.optus.com.au/" "240"
seed_partner "p-one-technology" "P-ONE Technology" "https://www.p-onetechnology.com/" "250"
seed_partner "scott-bader" "Scott Bader" "https://www.scottbader.com/" "260"
seed_partner "siltrax" "Siltrax" "https://www.siltrax.net/" "270"
seed_partner "sorensen-engineering" "Sorensen Engineering" "https://www.sorensenengineering.com.au/" "280"
seed_partner "sundrive" "SunDrive" "https://www.sundrivesolar.com/" "290"
seed_partner "sxsw-sydney" "SXSW Sydney" "https://www.sxswsydney.com/" "300"
seed_partner "sydney-motorsport-park" "Sydney Motorsport Park" "https://www.sydneymotorsportpark.com.au/" "310"
seed_partner "total-tools" "Total Tools" "https://www.totaltools.com.au/" "320"
seed_partner "trace" "TRaCE" "https://trace.org.au/" "330"
seed_partner "unsw" "UNSW" "https://www.unsw.edu.au/" "340"
seed_partner "wrapstyle-sydney" "WrapStyle Sydney" "https://wrapstylesydney.com/" "350"

awslocal dynamodb put-item \
  --table-name "$TABLE_NAME" \
  --item '{
    "id": { "S": "media-assets" },
    "type": { "S": "asset#public-media-placeholders-sr7-world-record.mp4#published" },
    "key": { "S": "public-media/placeholders/sr7-world-record.mp4" },
    "bucket": { "S": "'"$PUBLIC_ASSETS_BUCKET"'" },
    "contentType": { "S": "video/mp4" },
    "size": { "N": "75641586" },
    "scope": { "S": "public-media" },
    "status": { "S": "published" },
    "source": { "S": "/placeholders/sr7-world-record.mp4" }
  }' >/dev/null

awslocal dynamodb put-item \
  --table-name "$TABLE_NAME" \
  --item '{
    "id": { "S": "media-assets" },
    "type": { "S": "asset#public-media-placeholders-bwsc-23-vid.mp4#published" },
    "key": { "S": "public-media/placeholders/bwsc-23-vid.mp4" },
    "bucket": { "S": "'"$PUBLIC_ASSETS_BUCKET"'" },
    "contentType": { "S": "video/mp4" },
    "size": { "N": "66585122" },
    "scope": { "S": "public-media" },
    "status": { "S": "published" },
    "source": { "S": "/placeholders/bwsc-23-vid.mp4" }
  }' >/dev/null

awslocal dynamodb put-item \
  --table-name "$TABLE_NAME" \
  --item '{
    "id": { "S": "media-assets" },
    "type": { "S": "asset#public-media-vehicle-fleet-vehicle-ivy.jpg#published" },
    "key": { "S": "public-media/vehicle-fleet/vehicle-ivy.jpg" },
    "bucket": { "S": "'"$PUBLIC_ASSETS_BUCKET"'" },
    "contentType": { "S": "image/jpeg" },
    "size": { "N": "10759552" },
    "scope": { "S": "public-media" },
    "status": { "S": "published" },
    "source": { "S": "/vehicle-fleet/vehicle-ivy.jpg" }
  }' >/dev/null

echo "DynamoDB table $TABLE_NAME seeded"
