import Link from "next/link"
import { ArrowRight, ImageIcon, UsersRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AdminShell } from "@/components/site/admin-shell"
import { getRecruitmentRoles, getTeamMembers } from "@/lib/cms/dynamodb"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const [members, roles] = await Promise.all([getTeamMembers("draft"), getRecruitmentRoles("draft")])

  return (
    <AdminShell>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Dashboard</p>
            <h1 className="mt-3 text-4xl font-medium">CMS staging</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Draft changes are staged here before publishing to the public website.
            </p>
          </div>
          <Button asChild>
            <Link href="/team">View public team</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            [UsersRound, `${members.length}`, "Draft team members", "/admin/team"],
            [ArrowRight, `${roles.length}`, "Draft recruitment roles", "/admin/recruitment"],
            [ImageIcon, "S3", "Draft image staging", "/admin/team"],
          ].map(([Icon, value, label, href]) => (
            <Link key={String(label)} href={String(href)} className="rounded-lg border border-border bg-card p-5">
              <Icon className="size-5 text-primary" />
              <div className="mt-8 font-mono text-3xl">{String(value)}</div>
              <div className="mt-2 text-sm text-muted-foreground">{String(label)}</div>
            </Link>
          ))}
        </div>
      </section>
    </AdminShell>
  )
}
