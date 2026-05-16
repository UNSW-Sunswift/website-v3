import { PartnersPageContent } from "@/components/site/partners-page"
import { listCmsRecords } from "@/lib/cms/api"

export const metadata = {
  title: "Partners",
}

export const dynamic = "force-dynamic"

export default async function PartnersPage() {
  const partners = await listCmsRecords("partners", "published")

  return <PartnersPageContent partners={partners} />
}
