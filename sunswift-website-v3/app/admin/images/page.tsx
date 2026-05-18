import Image from "next/image"
import { CheckCircle2, ImageIcon, Link2, UploadCloud } from "lucide-react"

import { saveSiteImageSetting } from "@/app/admin/actions"
import { AdminPublicAssetUploader } from "@/components/site/admin-public-asset-uploader"
import { AdminShell } from "@/components/site/admin-shell"
import { Button } from "@/components/ui/button"
import { listCmsRecords } from "@/lib/cms/api"
import { achievements, vehicles } from "@/lib/cms/static-data"
import {
  createSiteImageRegistry,
  mergeSiteImageSettings,
  resolveSiteImage,
} from "@/lib/cms/site-images"

export const dynamic = "force-dynamic"
export const metadata = {
  title: "Admin Site Images",
}

function isImagePreviewable(src: string) {
  return src.startsWith("/") || src.startsWith("http")
}

export default async function AdminImagesPage() {
  const settings = await listCmsRecords("site-images", "published")
  const registry = createSiteImageRegistry(vehicles, achievements)
  const images = mergeSiteImageSettings(registry, settings)
  const sections = Array.from(new Set(images.map((image) => image.section))).sort()

  return (
    <AdminShell>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6" data-admin-site-images-page>
        <div className="border-b border-border pb-8">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
            Site images
          </p>
          <h1 className="mt-3 text-4xl font-medium">Editable public images</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            Update page images without touching code. Upload the new image, copy the URL, then
            paste it into the matching card below.
          </p>
        </div>

        <div
          className="mt-8 grid gap-3 md:grid-cols-3"
          data-admin-site-images-help
        >
          {[
            {
              icon: UploadCloud,
              title: "1. Upload",
              copy: "Choose one or more image files and upload them to the public media bucket.",
            },
            {
              icon: Link2,
              title: "2. Copy URL",
              copy: "Use the Copy URLs button. Each uploaded file returns a ready-to-paste public URL.",
            },
            {
              icon: CheckCircle2,
              title: "3. Replace",
              copy: "Find the page image card, paste the URL, then save that card.",
            },
          ].map((step) => {
            const Icon = step.icon

            return (
              <div
                key={step.title}
                className="rounded-lg border border-border bg-card p-4"
              >
                <Icon className="size-5 text-primary" />
                <h2 className="mt-3 text-base font-medium">{step.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {step.copy}
                </p>
              </div>
            )
          })}
        </div>

        <AdminPublicAssetUploader
          defaultPrefix="public-media/site-images"
          eyebrow="Step 1"
          title="Upload replacement images"
          description="Add the images you want to use on the public website. After upload, copy the returned URL and paste it into one image card below."
          filesLabel="Image files"
        />

        <div
          className="mt-8 rounded-lg border border-border bg-muted/30 p-4"
          data-admin-site-images-section-summary
        >
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground">
            Editing areas
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {sections.map((section) => (
              <span
                key={section}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground"
              >
                {section}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3" data-admin-site-images-grid>
          {images.map((image) => {
            const effectiveSrc = resolveSiteImage(image.defaultSrc, {
              [image.defaultSrc]: image.imageUrl,
            })

            return (
              <form
                key={image.slug}
                action={saveSiteImageSetting}
                className="overflow-hidden rounded-lg border border-border bg-card"
                data-admin-site-image-card
              >
                <input type="hidden" name="slug" value={image.slug} />
                <input type="hidden" name="label" value={image.label} />
                <input type="hidden" name="section" value={image.section} />
                <input type="hidden" name="defaultSrc" value={image.defaultSrc} />

                <div className="relative aspect-[16/10] bg-muted">
                  {isImagePreviewable(effectiveSrc) ? (
                    <Image
                      src={effectiveSrc}
                      alt=""
                      fill
                      unoptimized={effectiveSrc.startsWith("http")}
                      className="object-cover"
                      sizes="(min-width: 1280px) 30vw, (min-width: 768px) 50vw, 100vw"
                    />
                  ) : null}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-white/68">
                      {image.section}
                    </p>
                    <h2 className="mt-1 line-clamp-2 text-sm font-medium text-white">
                      {image.label}
                    </h2>
                  </div>
                </div>

                <div className="grid gap-3 p-4">
                  <div className="rounded-md border border-border bg-muted/35 p-3">
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
                      Used on
                    </p>
                    <p className="mt-1 text-sm font-medium">{image.section}</p>
                  </div>
                  <label className="grid gap-1.5 text-sm">
                    Replacement image URL
                    <span className="text-xs leading-5 text-muted-foreground">
                      Leave this blank to keep the default image. Paste a URL here to replace it.
                    </span>
                    <input
                      name="imageUrl"
                      defaultValue={image.imageUrl}
                      placeholder="Paste uploaded image URL…"
                      className="rounded-md border border-input bg-background px-3 py-2 font-mono text-xs"
                    />
                  </label>
                  <div className="rounded-md border border-border bg-muted/40 p-2">
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
                      Current default image
                    </p>
                    <p className="mt-1 flex items-start gap-2 break-all font-mono text-xs text-muted-foreground">
                      <ImageIcon className="mt-0.5 size-3.5 shrink-0" />
                      {image.defaultSrc}
                    </p>
                  </div>
                  <Button type="submit">Save this image</Button>
                </div>
              </form>
            )
          })}
        </div>
      </section>
    </AdminShell>
  )
}
