import { TransparentNavbar } from "@/components/site/transparent-navbar"
import { VehiclesGallery } from "@/components/site/vehicles-gallery"
import { listCmsRecords } from "@/lib/cms/api"
import { vehicles } from "@/lib/cms/static-data"
import { resolveSiteImages, siteImageMap } from "@/lib/cms/site-images"

export const metadata = {
  title: "Vehicles",
}

export const dynamic = "force-dynamic"

export default async function VehiclesPage() {
  const imageOverrides = siteImageMap(await listCmsRecords("site-images", "published"))

  return (
    <main data-vehicles-page className="relative">
      <TransparentNavbar />
      <VehiclesGallery vehicles={resolveSiteImages(vehicles, imageOverrides)} />
    </main>
  )
}
