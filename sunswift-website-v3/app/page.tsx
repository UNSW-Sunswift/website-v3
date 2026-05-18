import { HomepageAbout } from "@/components/site/homepage-about"
import { HomepageHero } from "@/components/site/homepage-hero"
import { HomepageRecords } from "@/components/site/homepage-records"
import { HomepageRecruitment } from "@/components/site/homepage-recruitment"
import { HomepageZoomReveal } from "@/components/site/homepage-zoom-reveal"
import { TransparentNavbar } from "@/components/site/transparent-navbar"
import { listCmsRecords } from "@/lib/cms/api"
import { siteImageMap } from "@/lib/cms/site-images"

export const dynamic = "force-dynamic"
export const metadata = {
  title: "Home",
}

export default async function Page() {
  const [roles, siteImages] = await Promise.all([
    listCmsRecords("roles", "published"),
    listCmsRecords("site-images", "published"),
  ])
  const imageOverrides = siteImageMap(siteImages)

  return (
    <main data-homepage>
      <div className="relative">
        <TransparentNavbar heroEdgeVignette delayedHeroIntro />
        <HomepageHero imageOverrides={imageOverrides} />
      </div>
      <HomepageZoomReveal imageOverrides={imageOverrides} />
      <HomepageAbout imageOverrides={imageOverrides} />
      <HomepageRecords imageOverrides={imageOverrides} />
      <HomepageRecruitment roles={roles} />
    </main>
  )
}
