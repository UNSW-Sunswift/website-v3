import { HomepageAbout } from "@/components/site/homepage-about"
import { HomepageHero } from "@/components/site/homepage-hero"
import { HomepageRecords } from "@/components/site/homepage-records"
import { HomepageZoomReveal } from "@/components/site/homepage-zoom-reveal"
import { TransparentNavbar } from "@/components/site/transparent-navbar"

export default function Page() {
  return (
    <main data-homepage>
      <div className="relative">
        <TransparentNavbar />
        <HomepageHero />
      </div>
      <HomepageZoomReveal />
      <HomepageAbout />
      <HomepageRecords />
    </main>
  )
}
