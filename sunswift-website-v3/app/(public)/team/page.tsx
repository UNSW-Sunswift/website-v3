import { TeamRoster } from "@/components/site/team-roster"
import { listCmsRecords } from "@/lib/cms/api"
import { siteImageMap } from "@/lib/cms/site-images"

export const metadata = {
  title: "Our Team",
}

export const dynamic = "force-dynamic"

export default async function TeamPage() {
  const [members, siteImages] = await Promise.all([
    listCmsRecords("team", "published"),
    listCmsRecords("site-images", "published"),
  ])

  return <TeamRoster members={members} imageOverrides={siteImageMap(siteImages)} />
}
