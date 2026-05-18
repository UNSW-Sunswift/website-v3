import { ContactPageContent } from "@/components/site/contact-page"
import { listCmsRecords } from "@/lib/cms/api"
import { siteImageMap } from "@/lib/cms/site-images"

export const metadata = {
  title: "Contact",
}

export const dynamic = "force-dynamic"

export default async function ContactPage() {
  const imageOverrides = siteImageMap(await listCmsRecords("site-images", "published"))

  return <ContactPageContent imageOverrides={imageOverrides} />
}
