import Image from "next/image"

import { PageFrame, PageIntro } from "@/components/site/site-shell"
import { getTeamMembers, assetUrl } from "@/lib/cms/dynamodb"
import { getPublicPage } from "@/lib/content"

export const dynamic = "force-dynamic"

export default async function TeamPage() {
  const page = getPublicPage("team")
  const members = await getTeamMembers("published")

  return (
    <PageFrame>
      <PageIntro label="Team" title={page.headings[0] ?? "Our Team"} description={page.description} />
      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-20 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {members.map((member) => (
          <article key={member.slug} className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="relative aspect-[4/5] bg-muted">
              <Image
                src={assetUrl(member.imageKey)}
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 33vw, 50vw"
              />
            </div>
            <div className="p-5">
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                {member.discipline}
              </div>
              <h2 className="mt-2 text-xl font-medium">{member.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{member.bio}</p>
            </div>
          </article>
        ))}
      </section>
    </PageFrame>
  )
}
