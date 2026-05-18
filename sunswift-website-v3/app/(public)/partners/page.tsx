import { PartnersPageContent } from "@/components/site/partners-page"
import { listCmsRecords } from "@/lib/cms/api"
import { siteImageMap } from "@/lib/cms/site-images"

export const metadata = {
  title: "Partners",
}

export const dynamic = "force-dynamic"

export default async function PartnersPage() {
  const [partners, siteImages] = await Promise.all([
    listCmsRecords("partners", "published"),
    listCmsRecords("site-images", "published"),
  ])

  return <PartnersPageContent partners={partners} imageOverrides={siteImageMap(siteImages)} />
}
