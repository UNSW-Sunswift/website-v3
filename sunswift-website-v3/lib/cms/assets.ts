const heavyAssetMap: Record<string, string> = {
  "/placeholders/sr7-world-record.mp4": "public-media/placeholders/sr7-world-record.mp4",
  "/placeholders/bwsc-23-vid.mp4": "public-media/placeholders/bwsc-23-vid.mp4",
  "/vehicle-fleet/vehicle-ivy.jpg": "public-media/vehicle-fleet/vehicle-ivy.jpg",
}

export function publicAssetPath(localPath: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_CMS_PUBLIC_ASSET_BASE_URL ??
    process.env.CMS_PUBLIC_ASSET_BASE_URL

  const key = heavyAssetMap[localPath]

  if (!baseUrl || !key) {
    return localPath
  }

  return `${baseUrl.replace(/\/$/, "")}/${key}`
}

export function publicAssetUrl(key: string, bucket = process.env.CMS_PUBLIC_ASSETS_BUCKET) {
  const safeKey = key
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/")
  const baseUrl =
    process.env.NEXT_PUBLIC_CMS_PUBLIC_ASSET_BASE_URL ??
    process.env.CMS_PUBLIC_ASSET_BASE_URL

  if (baseUrl) {
    return `${baseUrl.replace(/\/$/, "")}/${safeKey}`
  }

  if (process.env.AWS_ENDPOINT_URL) {
    return `${process.env.AWS_ENDPOINT_URL.replace(/\/$/, "")}/${bucket}/${safeKey}`
  }

  return `https://${bucket}.s3.${process.env.AWS_REGION ?? "ap-southeast-2"}.amazonaws.com/${safeKey}`
}
