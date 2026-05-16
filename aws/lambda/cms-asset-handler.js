const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3")
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")

const s3 = new S3Client({})

function response(statusCode, body) {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  }
}

function safeName(value) {
  return String(value || "asset").replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase()
}

exports.handler = async (event) => {
  const method = event.httpMethod || event.requestContext?.http?.method || "GET"
  const path = event.path || event.rawPath || ""

  if (method !== "POST" || !path.endsWith("/cms/admin/uploads/presign")) {
    return response(404, { error: "Not found" })
  }

  const body = event.body ? JSON.parse(event.body) : {}
  const scope = safeName(body.scope || "assets")
  const slug = safeName(body.slug || "upload")
  const filename = safeName(body.filename || "asset.bin")
  const contentType = body.contentType || "application/octet-stream"
  const key = `draft/${scope}/${slug}/${Date.now()}-${filename}`

  const url = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: process.env.CMS_ASSETS_BUCKET,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 600 }
  )

  return response(200, { key, uploadUrl: url, contentType })
}
