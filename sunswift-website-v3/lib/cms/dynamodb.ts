import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb"

import { getCmsAssetsBucket, getCmsTableName, getDynamoClient, getS3Client } from "@/lib/aws"
import {
  fallbackMediaAssets,
  fallbackPartners,
  fallbackRecruitmentRoles,
  fallbackTeamMembers,
} from "@/lib/cms/static-data"
import type { MediaAsset, Partner, RecruitmentRole, TeamMember } from "@/lib/cms/types"

type CmsStatus = "draft" | "published"
type CmsKind = "member" | "role" | "partner" | "asset"

function statusPrefix(kind: CmsKind) {
  return `${kind}#`
}

function statusSuffix(status: CmsStatus) {
  return `#${status}`
}

function itemType(kind: CmsKind, slug: string, status: CmsStatus) {
  return `${kind}#${slug}${statusSuffix(status)}`
}

async function queryCollection<T>(
  id: "team-members" | "recruitment-roles" | "partners" | "media-assets",
  kind: CmsKind,
  status: CmsStatus
) {
  const response = await getDynamoClient().send(
    new QueryCommand({
      TableName: getCmsTableName(),
      KeyConditionExpression: "#id = :id and begins_with(#type, :prefix)",
      ExpressionAttributeNames: {
        "#id": "id",
        "#type": "type",
      },
      ExpressionAttributeValues: {
        ":id": id,
        ":prefix": statusPrefix(kind),
      },
    })
  )

  return ((response.Items ?? []).filter((item) =>
    String(item.type ?? "").endsWith(statusSuffix(status))
  ) as T[]).sort((a, b) => {
    const left = typeof (a as { sortOrder?: unknown }).sortOrder === "number" ? (a as { sortOrder: number }).sortOrder : 0
    const right = typeof (b as { sortOrder?: unknown }).sortOrder === "number" ? (b as { sortOrder: number }).sortOrder : 0
    return left - right
  })
}

export async function getTeamMembers(status: CmsStatus = "published") {
  try {
    const members = await queryCollection<TeamMember>("team-members", "member", status)
    return members.length > 0 ? members : fallbackTeamMembers
  } catch {
    return fallbackTeamMembers
  }
}

export async function getRecruitmentRoles(status: CmsStatus = "published") {
  try {
    const roles = await queryCollection<RecruitmentRole>("recruitment-roles", "role", status)
    return roles.length > 0 ? roles : fallbackRecruitmentRoles
  } catch {
    return fallbackRecruitmentRoles
  }
}

export async function getPartners(status: CmsStatus = "published") {
  try {
    const partners = await queryCollection<Partner>("partners", "partner", status)
    return partners.length > 0 ? partners : fallbackPartners
  } catch {
    return fallbackPartners
  }
}

export async function getMediaAssets(status: CmsStatus = "published") {
  try {
    const assets = await queryCollection<MediaAsset>("media-assets", "asset", status)
    return assets.length > 0 ? assets : fallbackMediaAssets
  } catch {
    return fallbackMediaAssets
  }
}

export async function putTeamMember(member: TeamMember, status: CmsStatus) {
  await getDynamoClient().send(
    new PutCommand({
      TableName: getCmsTableName(),
      Item: {
        ...member,
        id: "team-members",
        type: itemType("member", member.slug, status),
        status,
      },
    })
  )
}

export async function putRecruitmentRole(role: RecruitmentRole, status: CmsStatus) {
  await getDynamoClient().send(
    new PutCommand({
      TableName: getCmsTableName(),
      Item: {
        ...role,
        id: "recruitment-roles",
        type: itemType("role", role.slug, status),
        status,
      },
    })
  )
}

export async function putPartner(partner: Partner, status: CmsStatus) {
  await getDynamoClient().send(
    new PutCommand({
      TableName: getCmsTableName(),
      Item: {
        ...partner,
        id: "partners",
        type: itemType("partner", partner.slug, status),
        status,
      },
    })
  )
}

export async function putMediaAsset(asset: MediaAsset, status: CmsStatus) {
  await getDynamoClient().send(
    new PutCommand({
      TableName: getCmsTableName(),
      Item: {
        ...asset,
        id: "media-assets",
        type: itemType("asset", asset.key.replace(/[^a-zA-Z0-9._-]+/g, "-"), status),
        status,
      },
    })
  )
}

export async function uploadDraftAsset(file: File, slug: string, scope: "team" | "roles" | "partners" = "team") {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase()
  const key = `draft/${scope}/${slug}/${Date.now()}-${safeName}`
  const body = Buffer.from(await file.arrayBuffer())

  await getS3Client().send(
    new PutObjectCommand({
      Bucket: getCmsAssetsBucket(),
      Key: key,
      Body: body,
      ContentType: file.type || "application/octet-stream",
    })
  )

  return key
}

export async function getAssetObject(key: string) {
  return getS3Client().send(
    new GetObjectCommand({
      Bucket: getCmsAssetsBucket(),
      Key: key,
    })
  )
}

export function assetUrl(key?: string) {
  if (key?.startsWith("http") || key?.startsWith("/")) {
    return key
  }

  return key ? `/api/cms-assets/${key}` : "/placeholders/team-member.svg"
}
