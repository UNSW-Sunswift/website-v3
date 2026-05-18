import { WhoWeAreEditorialPage } from "@/components/site/about-editorial-pages"
import { PageLoadReveal } from "@/components/site/page-load-reveal"
import { listCmsRecords } from "@/lib/cms/api"
import { resolveSiteImage, siteImageMap } from "@/lib/cms/site-images"

export const metadata = {
  title: "About Us",
}

export const dynamic = "force-dynamic"

export default async function WhoWeArePage() {
  const imageOverrides = siteImageMap(await listCmsRecords("site-images", "published"))

  return (
    <>
      <PageLoadReveal
        image={resolveSiteImage("/media/sr8-hero-3.png", imageOverrides)}
        label="Who We Are"
        variant="cinematic"
      />
      <WhoWeAreEditorialPage imageOverrides={imageOverrides} />
    </>
  )
}
