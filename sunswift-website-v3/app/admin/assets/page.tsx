import { Button } from "@/components/ui/button"
import { AdminShell } from "@/components/site/admin-shell"
import { seedHeavyMediaAssets } from "@/app/admin/actions"
import { listCmsRecords } from "@/lib/cms/api"

export const dynamic = "force-dynamic"
export const metadata = {
  title: "Admin Assets",
}

function formatSize(size: number) {
  return `${(size / 1024 / 1024).toFixed(1)} MB`
}

export default async function AdminAssetsPage() {
  const assets = await listCmsRecords("assets", "published")

  return (
    <AdminShell>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Assets CMS</p>
            <h1 className="mt-3 text-4xl font-medium">Public media assets</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Tracks heavy media that should be delivered from the public S3/CloudFront asset bucket.
            </p>
          </div>
          <form action={seedHeavyMediaAssets}>
            <Button type="submit" variant="outline">
              Register heavy media
            </Button>
          </form>
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Key</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Source</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.key} className="border-b border-border last:border-b-0">
                  <td className="max-w-md px-4 py-3 font-mono text-xs">{asset.key}</td>
                  <td className="px-4 py-3">{asset.contentType}</td>
                  <td className="px-4 py-3">{formatSize(asset.size)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{asset.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  )
}

