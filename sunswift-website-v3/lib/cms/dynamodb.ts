import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb"

import { getCmsAssetsBucket, getCmsTableName, getDynamoClient, getS3Client } from "@/lib/aws"
import { fallbackRecruitmentRoles, fallbackTeamMembers } from "@/lib/cms/static-data"
import type { RecruitmentRole, TeamMember } from "@/lib/cms/types"

type CmsStatus = "draft" | "published"

function statusPrefix(kind: "member" | "role") {
  return `${kind}#`
}

function statusSuffix(status: CmsStatus) {
  return `#${status}`
}

function itemType(kind: "member" | "role", slug: string, status: CmsStatus) {
  return `${kind}#${slug}${statusSuffix(status)}`
}

async function queryCollection<T>(
  id: "team-members" | "recruitment-roles",
  kind: "member" | "role",
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

  return (response.Items ?? []).filter((item) =>
    String(item.type ?? "").endsWith(statusSuffix(status))
  ) as T[]
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

export async function putTeamMember(member: TeamMember, status: CmsStatus) {
  await getDynamoClient().send(
    new PutCommand({
      TableName: getCmsTableName(),
      Item: {
        id: "team-members",
        type: itemType("member", member.slug, status),
        ...member,
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
        id: "recruitment-roles",
        type: itemType("role", role.slug, status),
        ...role,
        status,
      },
    })
  )
}

export async function uploadDraftAsset(file: File, slug: string) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase()
  const key = `draft/team/${slug}/${Date.now()}-${safeName}`
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
  return key ? `/api/cms-assets/${key}` : "/placeholders/team-member.svg"
}
