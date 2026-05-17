import { HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import { auth } from "@/auth"
import { recordMediaAsset } from "@/lib/cms/api"
import { publicAssetUrl } from "@/lib/cms/assets"
import { getCmsPublicAssetsBucket, getS3Client } from "@/lib/aws"
import type { MediaAsset } from "@/lib/cms/types"

function safePathPart(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9._/-]+/g, "-")
    .replace(/\/+/g, "/")
    .replace(/^\/|\/$/g, "")
    .toLowerCase()
}

function json(body: unknown, status = 200) {
  return Response.json(body, { status })
}

async function assertAdmin() {
  const session = await auth()

  if (!session?.user?.email) {
    return null
  }

  return session.user.email
}

export async function POST(request: Request) {
  const updatedBy = await assertAdmin()

  if (!updatedBy) {
    return json({ error: "Unauthorized" }, 401)
  }

  const body = (await request.json()) as {
    filename?: string
    contentType?: string
    size?: number
    prefix?: string
  }
  const filename = safePathPart(body.filename ?? "asset.bin").split("/").pop() || "asset.bin"
  const prefix = safePathPart(body.prefix ?? "public-media/uploads")
  const contentType = body.contentType || "application/octet-stream"
  const size = Number(body.size ?? 0)

  if (!filename || size <= 0) {
    return json({ error: "A file name and non-zero size are required." }, 400)
  }

  const key = `${prefix}/${Date.now()}-${filename}`
  const bucket = getCmsPublicAssetsBucket()
  const uploadUrl = await getSignedUrl(
    getS3Client(),
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 900 }
  )

  return json({
    bucket,
    key,
    uploadUrl,
    publicUrl: publicAssetUrl(key, bucket),
    contentType,
  })
}

export async function PUT(request: Request) {
  const updatedBy = await assertAdmin()

  if (!updatedBy) {
    return json({ error: "Unauthorized" }, 401)
  }

  const body = (await request.json()) as {
    bucket?: string
    key?: string
    contentType?: string
    size?: number
    publicUrl?: string
  }
  const bucket = body.bucket || getCmsPublicAssetsBucket()
  const key = safePathPart(body.key ?? "")

  if (!key) {
    return json({ error: "An uploaded S3 key is required." }, 400)
  }

  const head = await getS3Client().send(
    new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  )
  const asset: MediaAsset = {
    key,
    bucket,
    contentType: head.ContentType ?? body.contentType ?? "application/octet-stream",
    size: head.ContentLength ?? Number(body.size ?? 0),
    scope: "public-media",
    status: "published",
    source: "admin-upload",
    publicUrl: body.publicUrl || publicAssetUrl(key, bucket),
  }

  await recordMediaAsset(asset, updatedBy)

  return json({ asset })
}
