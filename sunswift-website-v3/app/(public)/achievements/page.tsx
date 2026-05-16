import { AchievementsTimeline } from "@/components/site/achievements-timeline"
import { TransparentNavbar } from "@/components/site/transparent-navbar"
import { achievements, achievementsOverview } from "@/lib/cms/static-data"

export const metadata = {
  title: "Achievements",
}

export default function AchievementsPage() {
  return (
    <main className="min-h-svh bg-[#0a0c0e]">
      <TransparentNavbar />
      <AchievementsTimeline achievements={achievements} overview={achievementsOverview} />
    </main>
  )
}
