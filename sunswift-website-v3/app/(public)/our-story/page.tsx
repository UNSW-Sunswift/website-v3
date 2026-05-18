import { OurStoryEditorialPage } from "@/components/site/about-editorial-pages"
import { listCmsRecords } from "@/lib/cms/api"
import { siteImageMap } from "@/lib/cms/site-images"

export const metadata = {
  title: "Our Story",
}

export const dynamic = "force-dynamic"

export default async function OurStoryPage() {
  const imageOverrides = siteImageMap(await listCmsRecords("site-images", "published"))

  return <OurStoryEditorialPage imageOverrides={imageOverrides} />
}
