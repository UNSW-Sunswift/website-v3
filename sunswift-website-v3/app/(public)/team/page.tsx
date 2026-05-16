import { TeamRoster } from "@/components/site/team-roster"
import { TransparentNavbar } from "@/components/site/transparent-navbar"
import { listCmsRecords } from "@/lib/cms/api"

export const metadata = {
  title: "Our Team",
}

export const dynamic = "force-dynamic"

export default async function TeamPage() {
  const members = await listCmsRecords("team", "published")

  return (
    <>
      <TransparentNavbar />
      <TeamRoster members={members} />
    </>
  )
}
