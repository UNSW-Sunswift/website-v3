import { TransparentNavbar } from "@/components/site/transparent-navbar"
import { VehiclesGallery } from "@/components/site/vehicles-gallery"
import { vehicles } from "@/lib/cms/static-data"

export const metadata = {
  title: "Vehicles",
}

export default function VehiclesPage() {
  return (
    <main data-vehicles-page className="relative">
      <TransparentNavbar />
      <VehiclesGallery vehicles={vehicles} />
    </main>
  )
}
