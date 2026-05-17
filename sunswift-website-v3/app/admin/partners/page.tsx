import Image from "next/image"

import { Button } from "@/components/ui/button"
import { AdminBulkPublishPanel } from "@/components/site/admin-bulk-publish-panel"
import { AdminPublishStatus } from "@/components/site/admin-publish-status"
import { AdminShell } from "@/components/site/admin-shell"
import {
  deletePartner,
  importPartnerDrafts,
  publishPartner,
  publishSelectedPartners,
  savePartnerDraft,
} from "@/app/admin/actions"
import { listCmsRecords } from "@/lib/cms/api"
import { assetUrl } from "@/lib/cms/dynamodb"

export const dynamic = "force-dynamic"
export const metadata = {
  title: "Admin Partners",
}

type AdminPartnersPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminPartnersPage({ searchParams }: AdminPartnersPageProps) {
  const partners = await listCmsRecords("partners", "draft")
  const publishStatus = await searchParams

  return (
    <AdminShell>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="border-b border-border pb-8">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Partners CMS</p>
          <h1 className="mt-3 text-4xl font-medium">Partners</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Import Webflow partner exports, stage logo uploads, edit websites and publish the
            partner grid.
          </p>
        </div>

        <AdminPublishStatus
          status={publishStatus?.publishStatus}
          published={publishStatus?.published}
          failed={publishStatus?.failed}
          requested={publishStatus?.requested}
          singular="partner"
          plural="partners"
        />

        <AdminBulkPublishPanel
          title="Publish partner drafts"
          description="Select the partners that should be pushed live. Grid view turns each partner into a compact selectable button for faster batch publishing."
          items={partners.map((partner) => ({
            slug: partner.slug,
            title: partner.name,
            eyebrow: "Partner",
            description: partner.website,
          }))}
          action={publishSelectedPartners}
          submitLabel="Publish selected partners"
          emptyLabel="No draft partners are available to publish."
        />

        <form
          action={importPartnerDrafts}
          className="mt-8 rounded-lg border border-border bg-card p-5"
          data-admin-partners-import
        >
          <h2 className="text-xl font-medium">Import partners CSV</h2>
          <input
            name="csv"
            type="file"
            accept=".csv,text/csv"
            className="mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <Button type="submit" className="mt-4">
            Import drafts
          </Button>
        </form>

        <details className="mt-6 rounded-lg border border-border bg-card p-5" data-admin-partners-create>
          <summary className="cursor-pointer text-lg font-medium">Add partner</summary>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Create a new partner draft manually. Upload a logo now or later, then publish to push
            the update live.
          </p>
          <form action={savePartnerDraft} className="mt-4 grid gap-4 sm:grid-cols-2">
            <input type="hidden" name="existingLogoKey" value="" />
            <label className="grid gap-2 text-sm">
              Name
              <input
                name="name"
                required
                placeholder="Partner name"
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Slug
              <input
                name="slug"
                placeholder="Optional override"
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="grid gap-2 text-sm sm:col-span-2">
              Website
              <input
                name="website"
                placeholder="https://example.com"
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Sort order
              <input
                name="sortOrder"
                type="number"
                defaultValue={0}
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Staged logo
              <input name="logo" type="file" accept="image/*" className="rounded-md border border-input bg-background px-3 py-2" />
            </label>
            <div className="sm:col-span-2">
              <Button type="submit">Save draft</Button>
            </div>
          </form>
        </details>

        <div className="mt-8 grid gap-6">
          {partners.map((partner) => (
            <article
              key={partner.slug}
              className="grid gap-6 rounded-lg border border-border bg-card p-5 lg:grid-cols-[180px_1fr]"
            >
              <div>
                <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                  {partner.logoKey ? (
                    <Image src={assetUrl(partner.logoKey)} alt="" fill className="object-contain p-6" sizes="180px" />
                  ) : (
                    <div className="grid h-full place-items-center font-mono text-3xl text-muted-foreground">
                      {partner.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <form action={publishPartner} className="mt-4">
                  <input type="hidden" name="slug" value={partner.slug} />
                  <Button type="submit" variant="outline" className="w-full">
                    Publish
                  </Button>
                </form>
                <form action={deletePartner} className="mt-2">
                  <input type="hidden" name="slug" value={partner.slug} />
                  <input type="hidden" name="deletePublished" value="true" />
                  <Button type="submit" variant="destructive" className="w-full">
                    Delete
                  </Button>
                </form>
              </div>
              <form action={savePartnerDraft} className="grid gap-4 sm:grid-cols-2">
                <input type="hidden" name="existingLogoKey" value={partner.logoKey ?? ""} />
                <label className="grid gap-2 text-sm">
                  Name
                  <input name="name" defaultValue={partner.name} className="rounded-md border border-input bg-background px-3 py-2" />
                </label>
                <label className="grid gap-2 text-sm">
                  Slug
                  <input name="slug" defaultValue={partner.slug} className="rounded-md border border-input bg-background px-3 py-2" />
                </label>
                <label className="grid gap-2 text-sm sm:col-span-2">
                  Website
                  <input name="website" defaultValue={partner.website} className="rounded-md border border-input bg-background px-3 py-2" />
                </label>
                <label className="grid gap-2 text-sm">
                  Sort order
                  <input
                    name="sortOrder"
                    type="number"
                    defaultValue={partner.sortOrder ?? 0}
                    className="rounded-md border border-input bg-background px-3 py-2"
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  Staged logo
                  <input name="logo" type="file" accept="image/*" className="rounded-md border border-input bg-background px-3 py-2" />
                </label>
                <div className="sm:col-span-2">
                  <Button type="submit">Save draft</Button>
                </div>
              </form>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  )
}
