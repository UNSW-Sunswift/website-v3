import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

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
      <section className="mx-auto grid max-w-[92rem] gap-10 px-4 pb-24 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[420px] overflow-hidden border border-black/10 bg-black/[0.03]">
          <Image
            src={image}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/30 bg-white/25 px-5 py-3 backdrop-blur-md">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-black/80">
              {label}
            </span>
            <span className="size-1.5 rounded-full bg-accent-yellow" aria-hidden="true" />
          </div>
        </div>
        <div className="space-y-10">
          {headings.slice(0, 4).map((heading, index) => (
            <article
              key={`${heading}-${index}`}
              className="border-t border-black/10 pt-8"
            >
              <div className="mb-3 flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.24em] text-black/55">
                <span className="border border-black/20 bg-white/60 px-2 py-0.5 backdrop-blur-md">
                  0{index + 1}
                </span>
                {label}
              </div>
              <h2 className="text-2xl font-light leading-tight tracking-tight text-black sm:text-3xl">
                {heading}
              </h2>
              <p className="mt-4 text-sm leading-7 text-black/65 sm:text-base sm:leading-8">
                {paragraphs[index] ?? getLeadParagraph(pageKey)}
              </p>
            </article>
          ))}
        </div>
      </section>
    </PageFrame>
  )
}

export function CtaBand() {
  return (
    <section className="border-y border-black/10 bg-black text-white">
      <div className="mx-auto flex max-w-[92rem] flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-white/55">
            Recruitment
          </p>
          <h2 className="mt-3 text-3xl font-light tracking-tight sm:text-4xl">
            Build the next generation of solar racing.
          </h2>
        </div>
        <Link
          href="/recruitment"
          className="inline-flex w-fit items-center gap-2 border border-white/80 bg-transparent px-5 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white transition-[background-color,color,border-color] duration-300 hover:border-accent-yellow hover:bg-accent-yellow hover:text-black"
        >
          Open roles
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </section>
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
    <section className="border-y border-black/10 bg-white/60 backdrop-blur-xl">
      <div className="mx-auto grid max-w-[92rem] grid-cols-2 px-4 sm:px-6 lg:grid-cols-4">
        {metrics.map(([value, label]) => (
          <div
            key={value}
            className="border-l border-black/10 px-6 py-10 first:border-l-0"
          >
            <div className="text-3xl font-light tracking-tight text-black sm:text-4xl">
              {value}
            </div>
            <div className="mt-2 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-black/55">
              {label}
            </div>
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
    <section className="mx-auto grid max-w-[92rem] gap-10 px-4 py-24 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
      <SectionLabel>{label}</SectionLabel>
      <div>
        <h2 className="max-w-3xl text-4xl font-light leading-tight tracking-tight text-black sm:text-5xl">
          {title}
        </h2>
        <p className="mt-6 max-w-3xl text-base leading-7 text-black/65 sm:text-lg">
          {body}
        </p>
      </div>
    </section>
  )
}
