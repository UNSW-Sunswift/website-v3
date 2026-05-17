import { AchievementsTimeline } from "@/components/site/achievements-timeline"
import { PageLoadReveal } from "@/components/site/page-load-reveal"
import { TransparentNavbar } from "@/components/site/transparent-navbar"
import { listCmsRecords } from "@/lib/cms/api"
import {
  achievements,
  achievementsOverview,
  applyTimelineVideoSettings,
} from "@/lib/cms/static-data"

export const metadata = {
  title: "Achievements",
}

export const dynamic = "force-dynamic"

export default async function AchievementsPage() {
  const timelineVideoSettings = await listCmsRecords("timeline", "published")
  const timelineAchievements = applyTimelineVideoSettings(achievements, timelineVideoSettings)

  return (
    <main className="min-h-svh bg-[#0a0c0e]">
      <PageLoadReveal image="/achievements/bwsc-23.avif" label="Achievements" />
      <TransparentNavbar />
      <AchievementsTimeline achievements={timelineAchievements} overview={achievementsOverview} />
    </main>
  )
}
