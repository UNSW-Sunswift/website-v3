import Image from "next/image"

import { Button } from "@/components/ui/button"
import { AdminShell } from "@/components/site/admin-shell"
import {
  deleteTeamMember,
  importTeamDrafts,
  publishTeamMember,
  saveTeamMemberDraft,
} from "@/app/admin/actions"
import { listCmsRecords } from "@/lib/cms/api"
import { assetUrl } from "@/lib/cms/dynamodb"

export const dynamic = "force-dynamic"
export const metadata = {
  title: "Admin Team",
}

export default async function AdminTeamPage() {
  const members = await listCmsRecords("team", "draft")

  return (
    <AdminShell>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="border-b border-border pb-8">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Team CMS</p>
          <h1 className="mt-3 text-4xl font-medium">Team members</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Update names, roles, descriptions and staged headshots. Publish copies the draft record
            to the public collection.
          </p>
        </div>

        <form
          action={importTeamDrafts}
          className="mt-8 rounded-lg border border-border bg-card p-5"
          data-admin-team-import
        >
          <h2 className="text-xl font-medium">Import team CSV</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Accepts the old Webflow team roster CSV or the sr-headshots output CSV. Private roster
            fields such as zID and UNSW email are ignored.
          </p>
          <input
            name="csv"
            type="file"
            accept=".csv,text/csv"
            className="mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
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
              Slug
              <input
                name="slug"
                placeholder="Optional override"
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Role
              <input
                name="role"
                placeholder="Solar Engineer"
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Discipline
              <input
                name="discipline"
                placeholder="Engineering"
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Department
              <input
                name="department"
                placeholder="Embedded"
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Hierarchy level
              <input
                name="hierarchyLevel"
                placeholder="Lead"
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Additional roles
              <input
                name="additionalRoles"
                placeholder="Media Liaison"
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
            <label className="grid gap-2 text-sm sm:col-span-2">
              Bio
              <textarea
                name="bio"
                placeholder="Short summary shown on the public roster."
                rows={4}
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="grid gap-2 text-sm sm:col-span-2">
              Staged headshot
              <input name="headshot" type="file" accept="image/*" className="rounded-md border border-input bg-background px-3 py-2" />
            </label>
            <div className="sm:col-span-2">
              <Button type="submit">Save draft</Button>
            </div>
          </form>
        </details>

        <div className="mt-8 grid gap-6">
          {members.map((member) => (
            <article key={member.slug} className="grid gap-6 rounded-lg border border-border bg-card p-5 lg:grid-cols-[220px_1fr]">
              <div>
                <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-muted">
                  <Image src={assetUrl(member.imageKey)} alt="" fill className="object-cover" sizes="220px" />
                </div>
                <form action={publishTeamMember} className="mt-4">
                  <input type="hidden" name="slug" value={member.slug} />
                  <Button type="submit" variant="outline" className="w-full">
                    Publish
                  </Button>
                </form>
                <form action={deleteTeamMember} className="mt-2">
                  <input type="hidden" name="slug" value={member.slug} />
                  <input type="hidden" name="deletePublished" value="true" />
                  <Button type="submit" variant="destructive" className="w-full">
                    Delete
                  </Button>
                </form>
              </div>
              <form
                action={saveTeamMemberDraft}
                className="grid gap-4 sm:grid-cols-2"
                data-admin-team-editor
              >
              <input type="hidden" name="existingImageKey" value={member.imageKey ?? ""} />
              <label className="grid gap-2 text-sm">
                Name
                <input name="name" defaultValue={member.name} className="rounded-md border border-input bg-background px-3 py-2" />
              </label>
              <label className="grid gap-2 text-sm">
                Slug
                <input name="slug" defaultValue={member.slug} className="rounded-md border border-input bg-background px-3 py-2" />
              </label>
              <label className="grid gap-2 text-sm">
                Role
                <input name="role" defaultValue={member.role} className="rounded-md border border-input bg-background px-3 py-2" />
              </label>
              <label className="grid gap-2 text-sm">
                Discipline
                <input
                  name="discipline"
                  defaultValue={member.discipline}
                  className="rounded-md border border-input bg-background px-3 py-2"
                />
              </label>
              <label className="grid gap-2 text-sm">
                Department
                <input
                  name="department"
                  defaultValue={member.department ?? ""}
                  className="rounded-md border border-input bg-background px-3 py-2"
                />
              </label>
              <label className="grid gap-2 text-sm">
                Hierarchy level
                <input
                  name="hierarchyLevel"
                  defaultValue={member.hierarchyLevel ?? ""}
                  className="rounded-md border border-input bg-background px-3 py-2"
                />
              </label>
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
              <label className="grid gap-2 text-sm sm:col-span-2">
                Bio
                <textarea
                  name="bio"
                  defaultValue={member.bio}
                  rows={4}
                  className="rounded-md border border-input bg-background px-3 py-2"
                />
              </label>
              <label className="grid gap-2 text-sm sm:col-span-2">
                Staged headshot
                <input name="headshot" type="file" accept="image/*" className="rounded-md border border-input bg-background px-3 py-2" />
              </label>
                <div className="sm:col-span-2">
                  <Button type="submit">Save draft</Button>
                </div>
              </form>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  )
}
