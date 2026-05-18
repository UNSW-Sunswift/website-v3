import { AchievementsTimeline } from "@/components/site/achievements-timeline"
import { PageLoadReveal } from "@/components/site/page-load-reveal"
import { TransparentNavbar } from "@/components/site/transparent-navbar"
import { listCmsRecords } from "@/lib/cms/api"
import {
  achievements,
  achievementsOverview,
  applyTimelineVideoSettings,
} from "@/lib/cms/static-data"
import { resolveSiteImage, resolveSiteImages, siteImageMap } from "@/lib/cms/site-images"

export const metadata = {
  title: "Achievements",
}

export const dynamic = "force-dynamic"

export default async function AchievementsPage() {
  const [timelineVideoSettings, siteImages] = await Promise.all([
    listCmsRecords("timeline", "published"),
    listCmsRecords("site-images", "published"),
  ])
  const imageOverrides = siteImageMap(siteImages)
  const timelineAchievements = applyTimelineVideoSettings(
    resolveSiteImages(achievements, imageOverrides),
    timelineVideoSettings
  )

  return (
    <main className="min-h-svh bg-[#0a0c0e]">
      <PageLoadReveal image={resolveSiteImage("/achievements/bwsc-23-win.avif", imageOverrides)} label="Achievements" />
      <TransparentNavbar />
      <AchievementsTimeline achievements={timelineAchievements} overview={achievementsOverview} />
    </main>
  )
}
