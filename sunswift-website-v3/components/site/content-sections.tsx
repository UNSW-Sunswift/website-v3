import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CircleDot, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PageFrame, PageIntro, SectionLabel } from "@/components/site/site-shell"
import { getLeadParagraph, getPublicPage, type PublicPageKey } from "@/lib/content"

export function PublicContentPage({
  pageKey,
  label,
  title,
  image = "/placeholders/lab.svg",
}: {
  pageKey: PublicPageKey
  label: string
  title?: string
  image?: string
}) {
  const page = getPublicPage(pageKey)
  const paragraphs = page.paragraphs.length > 0 ? page.paragraphs : [page.description]
  const headings = page.headings.length > 0 ? page.headings : [title ?? page.title]

  return (
    <PageFrame>
      <PageIntro label={label} title={title ?? headings[0]} description={page.description} />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-border bg-muted">
          <Image src={image} alt="" fill className="object-cover" sizes="(min-width: 1024px) 40vw, 100vw" />
        </div>
        <div className="space-y-8">
          {headings.slice(0, 4).map((heading, index) => (
            <article key={`${heading}-${index}`} className="border-t border-border pt-6">
              <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <CircleDot className="size-3 text-primary" />
                0{index + 1}
              </div>
              <h2 className="text-2xl font-medium">{heading}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {paragraphs[index] ?? getLeadParagraph(pageKey)}
              </p>
            </article>
          ))}
        </div>
      </section>
      <SourceNote pageKey={pageKey} />
    </PageFrame>
  )
}

export function CtaBand() {
  return (
    <section className="border-y border-border bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] opacity-70">Recruitment</p>
          <h2 className="mt-2 text-3xl font-medium">Build the next generation of solar racing.</h2>
        </div>
        <Button asChild variant="secondary">
          <Link href="/recruitment">
            Open roles
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}

export function SourceNote({ pageKey }: { pageKey: PublicPageKey }) {
  const page = getPublicPage(pageKey)

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <ExternalLink className="size-3.5" />
        Temporary copy imported from {page.sourceUrl}
      </div>
    </div>
  )
}

export function MetricStrip() {
  const metrics = [
    ["1996", "Founded at UNSW"],
    ["7+", "Solar vehicles built"],
    ["1000 km", "Single-charge record"],
    ["2023", "Cruiser Class win"],
  ]

  return (
    <section className="border-y border-border bg-muted/20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 sm:px-6 lg:grid-cols-4">
        {metrics.map(([value, label]) => (
          <div key={value} className="py-8">
            <div className="font-mono text-3xl text-primary">{value}</div>
            <div className="mt-2 text-sm text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function SplitStatement({
  label,
  title,
  body,
}: {
  label: string
  title: string
  body: string
}) {
  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
      <SectionLabel>{label}</SectionLabel>
      <div>
        <h2 className="max-w-3xl text-4xl font-medium leading-tight">{title}</h2>
        <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground">{body}</p>
      </div>
    </section>
  )
}
