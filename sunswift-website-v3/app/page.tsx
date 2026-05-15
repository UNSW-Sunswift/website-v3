import { HomepageAbout } from "@/components/site/homepage-about"
import { HomepageHero } from "@/components/site/homepage-hero"
import { HomepageRecords } from "@/components/site/homepage-records"
import { HomepageRecruitment } from "@/components/site/homepage-recruitment"
import { HomepageZoomReveal } from "@/components/site/homepage-zoom-reveal"
import { TransparentNavbar } from "@/components/site/transparent-navbar"
import { getRecruitmentRoles } from "@/lib/cms/dynamodb"

export const dynamic = "force-dynamic"

export default async function Page() {
  const roles = await getRecruitmentRoles("published")

  return (
    <main data-homepage>
      <div className="relative">
        <TransparentNavbar />
        <HomepageHero />
      </div>
      <HomepageZoomReveal />
      <HomepageAbout />
      <HomepageRecords />
      <HomepageRecruitment roles={roles} />
    </main>
  )
}
