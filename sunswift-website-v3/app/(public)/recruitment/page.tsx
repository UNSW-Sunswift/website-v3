import { ArrowRight } from "lucide-react"

import { PageFrame, PageIntro } from "@/components/site/site-shell"
import { getRecruitmentRoles } from "@/lib/cms/dynamodb"
import { getPublicPage } from "@/lib/content"

export const dynamic = "force-dynamic"

export default async function RecruitmentPage() {
  const page = getPublicPage("recruitment")
  const roles = await getRecruitmentRoles("published")

  return (
    <PageFrame>
      <PageIntro label="Recruitment" title="Join Sunswift Racing." description={page.description} />
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-3">
          {roles.map((role) => (
            <article key={role.slug} className="rounded-lg border border-border bg-card p-6">
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{role.team}</div>
              <h2 className="mt-4 text-2xl font-medium">{role.title}</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{role.description}</p>
              <div className="mt-8 flex items-center gap-2 text-sm text-primary">
                Apply through Sunswift
                <ArrowRight className="size-4" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageFrame>
  )
}
