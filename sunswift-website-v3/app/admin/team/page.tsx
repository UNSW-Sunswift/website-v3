import Image from "next/image"

import { Button } from "@/components/ui/button"
import { AdminBulkPublishPanel } from "@/components/site/admin-bulk-publish-panel"
import { AdminPublishStatus } from "@/components/site/admin-publish-status"
import { AdminShell } from "@/components/site/admin-shell"
import {
  deleteTeamMember,
  importTeamDrafts,
  publishSelectedTeamMembers,
  publishTeamMember,
  saveTeamMemberDraft,
} from "@/app/admin/actions"
import { listCmsRecords } from "@/lib/cms/api"
import { assetUrl } from "@/lib/cms/dynamodb"
import {
  DEFAULT_TEAM_DEPARTMENT,
  DEFAULT_TEAM_HIERARCHY,
  TEAM_DEPARTMENTS,
  TEAM_HIERARCHIES,
} from "@/lib/cms/team-options"

export const dynamic = "force-dynamic"
export const metadata = {
  title: "Admin Team",
}

type AdminTeamPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminTeamPage({ searchParams }: AdminTeamPageProps) {
  const [draftMembers, publishedMembers] = await Promise.all([
    listCmsRecords("team", "draft"),
    listCmsRecords("team", "published"),
  ])
  const members = [
    ...draftMembers,
    ...publishedMembers.filter(
      (member) => !draftMembers.some((draftMember) => draftMember.slug === member.slug)
    ),
  ].sort(
    (left, right) =>
      (left.sortOrder ?? 0) - (right.sortOrder ?? 0) || left.name.localeCompare(right.name)
  )
  const publishStatus = await searchParams

  return (
    <AdminShell>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="border-b border-border pb-8">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Team CMS</p>
          <h1 className="mt-3 text-4xl font-medium">Team members</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Update names, roles, departments and staged headshots. Publish copies the draft record
            to the public collection.
          </p>
        </div>

        <AdminPublishStatus
          status={publishStatus?.publishStatus}
          published={publishStatus?.published}
          failed={publishStatus?.failed}
          requested={publishStatus?.requested}
          singular="team member"
          plural="team members"
        />

        <AdminBulkPublishPanel
          title="Publish team drafts"
          description="Select the team members that are ready to go live. Grid view is useful for quickly scanning and choosing many draft records at once."
          items={draftMembers.map((member) => ({
            slug: member.slug,
            title: member.name,
            eyebrow: member.department ?? member.hierarchyLevel,
            description: member.role,
          }))}
          action={publishSelectedTeamMembers}
          submitLabel="Publish selected team members"
          emptyLabel="No draft team members are available to publish."
        />

        <form
          action={importTeamDrafts}
          className="mt-8 rounded-lg border border-border bg-card p-5"
          data-admin-team-import
        >
          <h2 className="text-xl font-medium">Import team CSV</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Accepts the old Webflow team roster CSV or the sr-headshots output CSV. Private roster
            fields such as zID and UNSW email are ignored. Upload a file or paste a CSV URL.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="grid gap-2 text-sm">
              Upload CSV file
              <input
                name="csv"
                type="file"
                accept=".csv,text/csv"
                className="w-full rounded-md border border-input bg-background p-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Or paste CSV URL
              <input
                name="csvUrl"
                type="url"
                placeholder="https://example.com/team.csv…"
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </label>
          </div>
          <Button type="submit" className="mt-4">
            Import drafts
          </Button>
        </form>

        <details className="mt-6 rounded-lg border border-border bg-card p-5" data-admin-team-create>
          <summary className="cursor-pointer text-lg font-medium">Add team member</summary>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Create a new draft member manually. Save adds it to the staging list; publish when
            you want it live on the public team page.
          </p>
          <form action={saveTeamMemberDraft} className="mt-4 grid gap-4 sm:grid-cols-2">
            <input type="hidden" name="existingImageKey" value="" />
            <label className="grid gap-2 text-sm">
              Name
              <input
                name="name"
                required
                placeholder="Member name"
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Role
              <input
                name="role"
                placeholder="Solar Engineer…"
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Department
              <select
                name="department"
                defaultValue={DEFAULT_TEAM_DEPARTMENT}
                className="rounded-md border border-input bg-background px-3 py-2"
              >
                {TEAM_DEPARTMENTS.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              Hierarchy level
              <select
                name="hierarchyLevel"
                defaultValue={DEFAULT_TEAM_HIERARCHY}
                className="rounded-md border border-input bg-background px-3 py-2"
              >
                {TEAM_HIERARCHIES.map((hierarchy) => (
                  <option key={hierarchy} value={hierarchy}>
                    {hierarchy}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              Additional roles
              <input
                name="additionalRoles"
                placeholder="Media Liaison…"
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Sort order
              <input
                name="sortOrder"
                type="number"
                defaultValue={0}
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <div className="grid gap-3 sm:col-span-2 md:grid-cols-2">
              <label className="grid gap-2 text-sm">
                Upload headshot file
                <input
                  name="headshot"
                  type="file"
                  accept="image/*"
                  className="rounded-md border border-input bg-background p-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
                />
              </label>
              <label className="grid gap-2 text-sm">
                Or paste image URL
                <input
                  name="headshotUrl"
                  type="url"
                  placeholder="https://example.com/headshot.jpg…"
                  className="rounded-md border border-input bg-background px-3 py-2"
                />
              </label>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">Save draft</Button>
            </div>
          </form>
        </details>

        <label
          className="mt-8 inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm"
          data-admin-team-density-toggle
        >
          <input type="checkbox" className="peer sr-only" />
          <span className="size-4 rounded-sm border border-border bg-background peer-checked:border-primary peer-checked:bg-primary" />
          Extra compact cards
        </label>

        <div
          className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
          data-admin-team-profile-grid
        >
          {members.map((member) => (
            <article
              key={member.slug}
              className="overflow-hidden rounded-lg border border-border bg-card"
            >
              <div className="p-3">
                <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                  <Image
                    src={assetUrl(member.imageKey)}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(min-width: 1536px) 20vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 text-[0.68rem]">
                  <span className="font-mono tracking-[0.18em] text-muted-foreground uppercase">
                    {member.status === "published" ? "Live" : "Draft"}
                  </span>
                  <span className="text-muted-foreground">
                    {member.status === "published" ? "Edit to create a staging copy" : "Ready to publish"}
                  </span>
                </div>
                <h2 className="mt-3 text-base font-medium">{member.name}</h2>
                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{member.role}</p>
                <p className="mt-3 font-mono text-[0.62rem] tracking-[0.18em] text-primary uppercase">
                  {member.department ?? "Department"}
                </p>

                <div className="mt-3 grid gap-2">
                  {member.status !== "published" ? (
                    <form action={publishTeamMember}>
                      <input type="hidden" name="slug" value={member.slug} />
                      <Button type="submit" variant="outline" className="w-full">
                        Publish
                      </Button>
                    </form>
                  ) : null}
                  <form action={deleteTeamMember}>
                    <input type="hidden" name="slug" value={member.slug} />
                    <input type="hidden" name="deletePublished" value="true" />
                    <Button type="submit" variant="destructive" className="w-full">
                      Delete
                    </Button>
                  </form>
                </div>
              </div>

              <details className="border-t border-border bg-background/60" data-admin-team-edit-panel>
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium">
                  Edit profile
                </summary>
                <form
                  action={saveTeamMemberDraft}
                  className="grid gap-4 border-t border-border p-4"
                  data-admin-team-editor
                >
                  <input type="hidden" name="existingImageKey" value={member.imageKey ?? ""} />
                  <input type="hidden" name="slug" value={member.slug} />
                  <label className="grid gap-2 text-sm">
                    Name
                    <input
                      name="name"
                      defaultValue={member.name}
                      className="rounded-md border border-input bg-background px-3 py-2"
                    />
                  </label>
                  <label className="grid gap-2 text-sm">
                    Role
                    <input
                      name="role"
                      defaultValue={member.role}
                      className="rounded-md border border-input bg-background px-3 py-2"
                    />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm">
                      Department
                      <select
                        name="department"
                        defaultValue={member.department ?? DEFAULT_TEAM_DEPARTMENT}
                        className="rounded-md border border-input bg-background px-3 py-2"
                      >
                        {TEAM_DEPARTMENTS.map((department) => (
                          <option key={department} value={department}>
                            {department}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="grid gap-2 text-sm">
                      Hierarchy level
                      <select
                        name="hierarchyLevel"
                        defaultValue={member.hierarchyLevel ?? DEFAULT_TEAM_HIERARCHY}
                        className="rounded-md border border-input bg-background px-3 py-2"
                      >
                        {TEAM_HIERARCHIES.map((hierarchy) => (
                          <option key={hierarchy} value={hierarchy}>
                            {hierarchy}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label className="grid gap-2 text-sm">
                    Additional roles
                    <input
                      name="additionalRoles"
                      defaultValue={member.additionalRoles ?? ""}
                      className="rounded-md border border-input bg-background px-3 py-2"
                    />
                  </label>
                  <label className="grid gap-2 text-sm">
                    Sort order
                    <input
                      name="sortOrder"
                      type="number"
                      defaultValue={member.sortOrder ?? 0}
                      className="rounded-md border border-input bg-background px-3 py-2"
                    />
                  </label>
                  <label className="grid gap-2 text-sm">
                    Upload headshot file
                    <input
                      name="headshot"
                      type="file"
                      accept="image/*"
                      className="rounded-md border border-input bg-background p-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
                    />
                  </label>
                  <label className="grid gap-2 text-sm">
                    Or paste image URL
                    <input
                      name="headshotUrl"
                      type="url"
                      placeholder="https://example.com/headshot.jpg…"
                      className="rounded-md border border-input bg-background px-3 py-2"
                    />
                  </label>
                  <Button type="submit">Save draft</Button>
                </form>
              </details>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  )
}
