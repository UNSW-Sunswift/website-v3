import Link from "next/link"
import { ArrowRight, Files, Film, Handshake, ImageIcon, UsersRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AdminShell } from "@/components/site/admin-shell"
import { listCmsRecords } from "@/lib/cms/api"

export const dynamic = "force-dynamic"
export const metadata = {
  title: "Admin",
}

export default async function AdminPage() {
  const [
    draftMembers,
    publishedMembers,
    draftRoles,
    publishedRoles,
    draftPartners,
    publishedPartners,
    timelineVideoSettings,
    assets,
  ] = await Promise.all([
    listCmsRecords("team", "draft"),
    listCmsRecords("team", "published"),
    listCmsRecords("roles", "draft"),
    listCmsRecords("roles", "published"),
    listCmsRecords("partners", "draft"),
    listCmsRecords("partners", "published"),
    listCmsRecords("timeline", "published"),
    listCmsRecords("assets", "published"),
  ])

  const contentCollections = [
    {
      icon: UsersRound,
      label: "Team members",
      draftCount: draftMembers.length,
      publishedCount: publishedMembers.length,
      href: "/admin/team",
    },
    {
      icon: ArrowRight,
      label: "Recruitment roles",
      draftCount: draftRoles.length,
      publishedCount: publishedRoles.length,
      href: "/admin/recruitment",
    },
    {
      icon: Handshake,
      label: "Partners",
      draftCount: draftPartners.length,
      publishedCount: publishedPartners.length,
      href: "/admin/partners",
    },
    {
      icon: Film,
      label: "Timeline videos",
      draftCount: 0,
      publishedCount: timelineVideoSettings.length,
      href: "/admin/timeline",
    },
  ]

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

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {contentCollections.map(({ icon: Icon, label, draftCount, publishedCount, href }) => (
            <Link
              key={label}
              href={href}
              className="rounded-lg border border-border bg-card p-5 transition-[border-color,box-shadow] duration-200 hover:border-primary/40 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Icon className="size-5 text-primary" />
                  <h2 className="mt-5 text-lg font-medium">{label}</h2>
                </div>
                <Files className="size-4 text-muted-foreground" />
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-md border border-border bg-background p-3">
                  <div className="font-mono text-3xl tabular-nums">{draftCount}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Draft</div>
                </div>
                <div className="rounded-md border border-border bg-background p-3">
                  <div className="font-mono text-3xl tabular-nums">{publishedCount}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Published</div>
                </div>
              </div>
            </Link>
          ))}
          <Link
            href="/admin/assets"
            className="rounded-lg border border-border bg-card p-5 transition-[border-color,box-shadow] duration-200 hover:border-primary/40 hover:shadow-sm"
          >
            <ImageIcon className="size-5 text-primary" />
            <div className="mt-8 font-mono text-3xl tabular-nums">{assets.length}</div>
            <div className="mt-2 text-sm text-muted-foreground">Published S3 assets</div>
          </Link>
        </div>
      </section>
    </AdminShell>
  )
}
