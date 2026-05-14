import { getAssetObject } from "@/lib/cms/dynamodb"

export async function GET(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params
  const object = await getAssetObject(key.join("/"))

  if (!object.Body) {
    return new Response("Not found", { status: 404 })
  }

  return new Response(object.Body.transformToWebStream(), {
    headers: {
      "Content-Type": object.ContentType ?? "application/octet-stream",
      "Cache-Control": "public, max-age=60",
    },
  })
}
