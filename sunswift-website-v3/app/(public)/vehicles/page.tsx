import Image from "next/image"
import { Link2, Trophy } from "lucide-react"

import { PageFrame, PageIntro, SectionLabel } from "@/components/site/site-shell"
import { vehicles } from "@/lib/cms/static-data"
import { getPublicPage } from "@/lib/content"

export default function VehiclesPage() {
  const page = getPublicPage("vehicles")

  return (
    <PageFrame>
      <PageIntro label="Vehicles" title="Garage archive." description={page.description} />
      <section className="mx-auto max-w-7xl space-y-10 px-4 pb-20 sm:px-6">
        {vehicles.map((vehicle, index) => (
          <article
            key={vehicle.slug}
            className="grid gap-6 rounded-lg border border-border bg-card p-4 lg:grid-cols-[1.1fr_0.9fr] lg:p-6"
          >
            <div className="relative min-h-[320px] overflow-hidden rounded-md bg-muted">
              <Image src={vehicle.image} alt="" fill className="object-cover" sizes="(min-width: 1024px) 55vw, 100vw" />
              <div className="absolute left-4 top-4 rounded-full bg-background/70 px-3 py-1 font-mono text-xs text-primary backdrop-blur">
                CHAPTER {String(index + 1).padStart(2, "0")}
              </div>
            </div>
            <div className="flex flex-col justify-between gap-8 p-2">
              <div>
                <SectionLabel>{vehicle.years}</SectionLabel>
                <h2 className="text-4xl font-medium">{vehicle.name}</h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{vehicle.summary}</p>
              </div>
              <div className="grid gap-6">
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <Trophy className="size-4 text-primary" />
                    Achievements
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {vehicle.achievements.map((achievement) => (
                      <li key={achievement}>{achievement}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <Link2 className="size-4 text-primary" />
                    Related posts
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.relatedPosts.map((post) => (
                      <span key={post} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                        {post}
                      </span>
                    ))}
                  </div>
                </div>
                <dl className="grid grid-cols-2 gap-3">
                  {Object.entries(vehicle.specs).map(([label, value]) => (
                    <div key={label} className="rounded-md border border-border bg-background p-3">
                      <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {label}
                      </dt>
                      <dd className="mt-2 text-sm">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </article>
        ))}
      </section>
    </PageFrame>
  )
}
