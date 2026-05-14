import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BatteryCharging, Car, Cpu, Trophy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CtaBand, MetricStrip, SplitStatement } from "@/components/site/content-sections"
import { PageFrame, SectionLabel } from "@/components/site/site-shell"
import { getPublicPage } from "@/lib/content"
import { vehicles } from "@/lib/cms/static-data"

export default function Page() {
  const home = getPublicPage("home")
  const heroCopy = home.paragraphs[0] ?? home.description

  return (
    <PageFrame>
      <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden bg-background">
        <Image
          src="/placeholders/hero-track.svg"
          alt="Placeholder solar car on a bright test track"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/8 via-background/16 to-background/86" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-[92rem] items-end justify-end px-4 pb-12 pt-12 sm:px-6 lg:items-center lg:pb-16">
          <div className="w-full max-w-xl lg:mr-8">
            <div className="mb-5 inline-flex items-center rounded-full border border-foreground/10 bg-card/75 px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground shadow-sm backdrop-blur">
              Sunswift Racing
            </div>
            <h1 className="max-w-xl text-6xl font-medium leading-none tracking-normal text-foreground sm:text-8xl lg:text-9xl">
              Tomorrow, Today
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
              {heroCopy}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/vehicles">
                  Explore vehicles
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-card/70 backdrop-blur">
                <Link href="/who-we-are">Who we are</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <MetricStrip />

      <SplitStatement
        label="Mission"
        title={home.headings[0] ?? "What is Sunswift Racing?"}
        body={home.description}
      />

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-20 sm:px-6 lg:grid-cols-3">
        {[
          [Car, "Prototype vehicles", "Designing and validating solar electric cars for real race conditions."],
          [Cpu, "Student engineering", "Cross-disciplinary teams turning research, manufacturing and testing into working systems."],
          [BatteryCharging, "Sustainable transport", "Using competition as a proving ground for efficient electric mobility."],
        ].map(([Icon, title, body]) => (
          <article key={String(title)} className="rounded-lg border border-border bg-card p-6">
            <Icon className="size-5 text-primary" />
            <h2 className="mt-8 text-2xl font-medium">{String(title)}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{String(body)}</p>
          </article>
        ))}
      </section>

      <section className="bg-muted/20 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionLabel>Garage</SectionLabel>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <h2 className="text-4xl font-medium leading-tight">Every car is a chapter.</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                The vehicles page keeps the garage-style concept: a connected record of Sunswift
                cars, achievements and stories across generations.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {vehicles.map((vehicle) => (
                <Link
                  key={vehicle.slug}
                  href="/vehicles"
                  className="group rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary/60"
                >
                  <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-md bg-muted">
                    <Image src={vehicle.image} alt="" fill className="object-cover" sizes="25vw" />
                  </div>
                  <div className="font-mono text-xs text-primary">{vehicle.years}</div>
                  <div className="mt-1 flex items-center justify-between text-sm font-medium">
                    {vehicle.name}
                    <Trophy className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </PageFrame>
  )
}
