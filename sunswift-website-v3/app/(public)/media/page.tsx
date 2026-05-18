import { MediaHighlightsPage } from "@/components/site/media-highlights-page"
import { PageLoadReveal } from "@/components/site/page-load-reveal"
import { listCmsRecords } from "@/lib/cms/api"
import { resolveSiteImage, siteImageMap } from "@/lib/cms/site-images"

export const metadata = {
  title: "Media",
}

export const dynamic = "force-dynamic"

export default async function MediaPage() {
  const imageOverrides = siteImageMap(await listCmsRecords("site-images", "published"))

  return (
    <>
      <PageLoadReveal
        image={resolveSiteImage("/media/highlights-banner.jpg", imageOverrides)}
        label="Media"
        variant="cinematic"
      />
      <MediaHighlightsPage imageOverrides={imageOverrides} />
    </>
  )
}
