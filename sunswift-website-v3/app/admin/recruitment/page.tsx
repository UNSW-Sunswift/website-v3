import { Button } from "@/components/ui/button"
import { AdminShell } from "@/components/site/admin-shell"
import { publishRecruitmentRole, saveRecruitmentRoleDraft } from "@/app/admin/actions"
import { getRecruitmentRoles } from "@/lib/cms/dynamodb"

export const dynamic = "force-dynamic"

export default async function AdminRecruitmentPage() {
  const roles = await getRecruitmentRoles("draft")

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

        <div className="mt-8 grid gap-6">
          {roles.map((role) => (
            <article key={role.slug} className="rounded-lg border border-border bg-card p-5">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{role.team}</div>
                <h2 className="mt-2 text-2xl font-medium">{role.title}</h2>
              </div>
              <form action={publishRecruitmentRole}>
                <input type="hidden" name="slug" value={role.slug} />
                <Button type="submit" variant="outline">
                  Publish
                </Button>
              </form>
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
              <label className="grid gap-2 text-sm sm:col-span-2">
                Description
                <textarea
                  name="description"
                  defaultValue={role.description}
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
