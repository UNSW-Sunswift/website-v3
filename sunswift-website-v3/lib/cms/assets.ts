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

