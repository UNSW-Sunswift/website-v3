import { Button } from "@/components/ui/button"
import { UploadCloud } from "lucide-react"
import { AdminBulkPublishPanel } from "@/components/site/admin-bulk-publish-panel"
import { AdminPublishStatus } from "@/components/site/admin-publish-status"
import { AdminShell } from "@/components/site/admin-shell"
import {
  deleteRecruitmentRole,
  importRecruitmentDrafts,
  publishRecruitmentRole,
  publishSelectedRecruitmentRoles,
  saveRecruitmentRoleDraft,
} from "@/app/admin/actions"
import { listCmsRecords } from "@/lib/cms/api"

export const dynamic = "force-dynamic"
export const metadata = {
  title: "Admin Recruitment",
}

type AdminRecruitmentPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminRecruitmentPage({ searchParams }: AdminRecruitmentPageProps) {
  const [draftRoles, publishedRoles] = await Promise.all([
    listCmsRecords("roles", "draft"),
    listCmsRecords("roles", "published"),
  ])
  const roles = [
    ...draftRoles,
    ...publishedRoles.filter((role) => !draftRoles.some((draftRole) => draftRole.slug === role.slug)),
  ].sort(
    (left, right) =>
      (left.sortOrder ?? 0) - (right.sortOrder ?? 0) || left.title.localeCompare(right.title)
  )
  const publishStatus = await searchParams

  return (
    <AdminShell>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="border-b border-border pb-8">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Recruitment CMS</p>
          <h1 className="mt-3 text-4xl font-medium">Open roles</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Edit draft role descriptions and publish them to the recruitment page.
          </p>
        </div>

        <AdminPublishStatus
          status={publishStatus?.publishStatus}
          published={publishStatus?.published}
          failed={publishStatus?.failed}
          requested={publishStatus?.requested}
          singular="role"
          plural="roles"
        />

        <AdminBulkPublishPanel
          title="Publish role drafts"
          description="Choose the recruitment roles to publish together. Use grid view and zoom out when there are many roles to scan."
          items={draftRoles.map((role) => ({
            slug: role.slug,
            title: role.title,
            eyebrow: role.team,
            description: role.description,
          }))}
          action={publishSelectedRecruitmentRoles}
          submitLabel="Publish selected roles"
          emptyLabel="No draft recruitment roles are available to publish."
        />

        <form
          action={importRecruitmentDrafts}
          className="mt-8 rounded-lg border border-border bg-card p-5"
          data-admin-recruitment-import
        >
          <h2 className="text-xl font-medium">Import recruitment CSV</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Imports Webflow recruitment role exports into draft records. Publishing remains
            explicit per role.
          </p>
          <label
            className="mt-4 grid gap-2 rounded-lg border border-border bg-background p-4 text-sm"
            data-admin-recruitment-file-picker
          >
            <span className="font-medium">CSV file</span>
            <span className="text-xs leading-5 text-muted-foreground">
              Choose the exported recruitment CSV. The import only creates draft roles.
            </span>
            <input
              name="csv"
              type="file"
              accept=".csv,text/csv"
              className="w-full rounded-md border border-input bg-card p-2 text-sm file:mr-4 file:inline-flex file:min-h-10 file:cursor-pointer file:items-center file:rounded-md file:border file:border-primary file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
              data-admin-recruitment-file-input
            />
            <span className="inline-flex w-fit items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-medium text-primary">
              <UploadCloud className="size-4" />
              Choose file, then import drafts
            </span>
          </label>
          <Button type="submit" className="mt-4">
            Import drafts
          </Button>
        </form>

        <details className="mt-6 rounded-lg border border-border bg-card p-5" data-admin-recruitment-create>
          <summary className="cursor-pointer text-lg font-medium">Add recruitment role</summary>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Create a new draft role manually. Save adds it to staging; publish to push live.
          </p>
          <form action={saveRecruitmentRoleDraft} className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm">
              Title
              <input
                name="title"
                required
                placeholder="Solar Systems Engineer"
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
            <label className="grid gap-2 text-sm sm:col-span-2">
              Team
              <input
                name="team"
                placeholder="Engineering"
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input name="active" type="checkbox" defaultChecked />
              Active role
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
            <label className="grid gap-2 text-sm">
              Discipline
              <input
                name="discipline"
                placeholder="Engineering"
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="grid gap-2 text-sm">
              School
              <input
                name="school"
                placeholder="Mechanical"
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="grid gap-2 text-sm sm:col-span-2">
              Description
              <textarea
                name="description"
                rows={4}
                placeholder="Short role overview shown on the public page."
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="grid gap-2 text-sm sm:col-span-2">
              Responsibilities HTML
              <textarea
                name="responsibilitiesHtml"
                rows={4}
                placeholder="Optional HTML list for responsibilities."
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="grid gap-2 text-sm sm:col-span-2">
              Requirements HTML
              <textarea
                name="requirementsHtml"
                rows={4}
                placeholder="Optional HTML list for requirements."
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <div className="sm:col-span-2">
              <Button type="submit">Save draft</Button>
            </div>
          </form>
        </details>

        <div className="mt-8 grid gap-6">
          {roles.map((role) => (
            <article key={role.slug} className="rounded-lg border border-border bg-card p-5">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="inline-flex rounded-full border border-border bg-background px-3 py-1 font-mono text-[0.6rem] tracking-[0.18em] text-muted-foreground uppercase">
                    {role.status === "published" ? "Live" : "Draft"}
                  </div>
                  <div className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{role.team}</div>
                  <h2 className="mt-2 text-2xl font-medium">{role.title}</h2>
                  {role.status === "published" ? (
                    <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                      Edit and save to create a staging copy before republishing.
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  {role.status !== "published" ? (
                    <form action={publishRecruitmentRole}>
                      <input type="hidden" name="slug" value={role.slug} />
                      <Button type="submit" variant="outline">
                        Publish
                      </Button>
                    </form>
                  ) : null}
                  <form action={deleteRecruitmentRole}>
                    <input type="hidden" name="slug" value={role.slug} />
                    <input type="hidden" name="deletePublished" value="true" />
                    <Button type="submit" variant="destructive">
                      Delete
                    </Button>
                  </form>
                </div>
              </div>
              <form action={saveRecruitmentRoleDraft} className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm">
                Title
                <input name="title" defaultValue={role.title} className="rounded-md border border-input bg-background px-3 py-2" />
              </label>
              <label className="grid gap-2 text-sm">
                Slug
                <input name="slug" defaultValue={role.slug} className="rounded-md border border-input bg-background px-3 py-2" />
              </label>
              <label className="grid gap-2 text-sm sm:col-span-2">
                Team
                <input name="team" defaultValue={role.team} className="rounded-md border border-input bg-background px-3 py-2" />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input name="active" type="checkbox" defaultChecked={role.active ?? true} />
                Active role
              </label>
              <label className="grid gap-2 text-sm">
                Sort order
                <input
                  name="sortOrder"
                  type="number"
                  defaultValue={role.sortOrder ?? 0}
                  className="rounded-md border border-input bg-background px-3 py-2"
                />
              </label>
              <label className="grid gap-2 text-sm">
                Discipline
                <input
                  name="discipline"
                  defaultValue={role.discipline ?? ""}
                  className="rounded-md border border-input bg-background px-3 py-2"
                />
              </label>
              <label className="grid gap-2 text-sm">
                School
                <input
                  name="school"
                  defaultValue={role.school ?? ""}
                  className="rounded-md border border-input bg-background px-3 py-2"
                />
              </label>
              <label className="grid gap-2 text-sm sm:col-span-2">
                Description
                <textarea
                  name="description"
                  defaultValue={role.description}
                  rows={4}
                  className="rounded-md border border-input bg-background px-3 py-2"
                />
              </label>
              <label className="grid gap-2 text-sm sm:col-span-2">
                Responsibilities HTML
                <textarea
                  name="responsibilitiesHtml"
                  defaultValue={role.responsibilitiesHtml ?? ""}
                  rows={4}
                  className="rounded-md border border-input bg-background px-3 py-2"
                />
              </label>
              <label className="grid gap-2 text-sm sm:col-span-2">
                Requirements HTML
                <textarea
                  name="requirementsHtml"
                  defaultValue={role.requirementsHtml ?? ""}
                  rows={4}
                  className="rounded-md border border-input bg-background px-3 py-2"
                />
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
