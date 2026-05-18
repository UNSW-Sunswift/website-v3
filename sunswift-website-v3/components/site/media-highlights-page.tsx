import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import mediaHighlightsData from "@/content/media-highlights.json"
import { JuicerSidebar } from "@/components/site/juicer-sidebar"
import { TransparentNavbar } from "@/components/site/transparent-navbar"

import { resolveSiteImage, type SiteImageMap } from "@/lib/cms/site-images"
import { cn } from "@/lib/utils"

const highlightsBanner = "/media/highlights-banner.jpg"

type MediaHighlightItem = {
  title: string
  href: string
  imageSrc: string
  imageAlt: string
  subtitle?: string
}

type MediaHighlightSection = {
  id: string
  heading: string
  items: MediaHighlightItem[]
  featuredYoutubeId?: string
}

const data = mediaHighlightsData as {
  sections: MediaHighlightSection[]
}

function MediaHighlightCard({
  item,
  sectionId,
  cardDataAttr,
}: {
  item: MediaHighlightItem
  sectionId: string
  cardDataAttr?: string
}) {
  const extra =
    cardDataAttr === "media-partnership"
      ? { "data-media-partnership": "" as const }
      : cardDataAttr === "media-team-highlight"
        ? { "data-media-team-highlight": "" as const }
        : cardDataAttr === "media-partner-video"
          ? { "data-media-partner-video": "" as const }
          : cardDataAttr === "media-journey-part"
            ? { "data-media-journey-part": "" as const }
            : {}
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      data-media-highlight-card
      data-media-highlight-background-card
      data-section-id={sectionId}
      {...extra}
      className={cn(
        "group relative flex h-[22rem] w-[20rem] shrink-0 snap-start overflow-hidden rounded-sm border border-white/10 bg-[#050607] transition-[border-color,box-shadow] duration-300",
        "hover:border-accent-yellow/50 hover:shadow-[0_28px_90px_rgba(0,0,0,0.42)]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-yellow",
      )}
    >
      <Image
        src={item.imageSrc}
        alt={item.imageAlt}
        fill
        sizes="(max-width: 1024px) 78vw, 320px"
        className="object-cover opacity-78 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-90"
        unoptimized={item.imageSrc.includes("website-files.com")}
      />
      <div
        data-media-highlight-card-fade
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,7,0.08)_0%,rgba(5,6,7,0.3)_42%,rgba(5,6,7,0.82)_78%,#0a0c0e_100%)]"
      />
      <div className="relative z-10 mt-auto flex flex-col gap-2 p-4">
        <h3 className="text-base leading-snug font-light text-white">
          {item.title}
        </h3>
        {item.subtitle ? (
          <p className="line-clamp-3 text-sm leading-relaxed text-white/66">
            {item.subtitle}
          </p>
        ) : null}
      </div>
    </a>
  )
}

function parseYoutubeIdFromWatchUrl(href: string): string | null {
  try {
    const u = new URL(href)
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace(/^\//, "") || null
    }
    const v = u.searchParams.get("v")
    return v && v.length > 0 ? v : null
  } catch {
    return null
  }
}

function MediaSpotlightSection({ section }: { section: MediaHighlightSection }) {
  const first = section.items[0]
  const featuredId =
    section.featuredYoutubeId ??
    (first ? parseYoutubeIdFromWatchUrl(first.href) : null)

  const legacySectionAttr = { "data-media-spotlight": "" as const }

  return (
    <section
      data-media-highlight-section
      data-section-heading={section.heading}
      {...legacySectionAttr}
      id="media-spotlight"
      className="border-b border-white/10 py-14 lg:py-24"
    >
      <div className="mb-10 px-6 sm:px-10">
        <p className="font-mono text-[0.62rem] tracking-[0.34em] text-accent-yellow uppercase">
          Featured
        </p>
        <h2 className="mt-4 text-2xl font-light tracking-tight text-white sm:text-4xl lg:text-5xl">
          {section.heading}
        </h2>
      </div>

      {featuredId ? (
        <div className="relative px-6 sm:px-10">
          <div className="pointer-events-none absolute inset-x-10 top-0 z-0 h-40 bg-[radial-gradient(ellipse_at_50%_0%,rgba(245,208,0,0.14)_0%,transparent_70%)] sm:inset-x-16 lg:inset-x-24" />

          <div className="relative mx-auto max-w-[min(100%,56rem)]">
            <div className="pointer-events-none absolute -left-3 top-6 bottom-6 z-10 hidden w-px bg-gradient-to-b from-transparent via-accent-yellow/50 to-transparent sm:block md:-left-5" />
            <div className="pointer-events-none absolute -right-3 top-6 bottom-6 z-10 hidden w-px bg-gradient-to-b from-transparent via-accent-yellow/50 to-transparent sm:block md:-right-5" />

            <div
              data-media-spotlight-embed
              className="relative overflow-hidden rounded-sm border border-white/12 bg-[#050607] shadow-[0_40px_120px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.07)] ring-1 ring-white/[0.07]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(245,208,0,0.05)_0%,transparent_22%,transparent_78%,rgba(0,0,0,0.25)_100%)]" />
              <div className="relative aspect-video w-full">
                <iframe
                  title={
                    first?.title ??
                    "Amazon Web Services and Sunswift Racing — solar journey across the Australian Outback"
                  }
                  src={`https://www.youtube-nocookie.com/embed/${featuredId}?rel=0&modestbranding=1`}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>

            {first ? (
              <p className="mx-auto mt-8 max-w-3xl text-center text-base leading-relaxed text-white/70 sm:text-lg">
                {first.title}
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`https://www.youtube.com/watch?v=${featuredId}`}
                target="_blank"
                rel="noopener noreferrer"
                data-media-spotlight-youtube-link
                className="inline-flex items-center gap-2 border border-white/25 px-5 py-2.5 font-mono text-[0.65rem] tracking-[0.22em] text-white uppercase transition-colors duration-300 hover:border-accent-yellow hover:bg-accent-yellow hover:text-black"
              >
                Open on YouTube
              </a>
              {section.items[1] ? (
                <a
                  href={section.items[1].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-media-spotlight-case-study-link
                  className="inline-flex items-center gap-2 border border-accent-yellow/35 bg-accent-yellow/10 px-5 py-2.5 font-mono text-[0.65rem] tracking-[0.22em] text-accent-yellow uppercase transition-colors duration-300 hover:bg-accent-yellow hover:text-black"
                >
                  AWS case study
                </a>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-14">
        <div className="mb-6 px-6 sm:px-10">
          <p className="font-mono text-[0.62rem] tracking-[0.28em] text-white/35 uppercase">
            More in this story
          </p>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#0a0c0e] to-transparent lg:w-12" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#0a0c0e] to-transparent lg:w-12" />
          <div
            data-media-highlight-row
            data-section-id={section.id}
            className={cn(
              "flex gap-4 overflow-x-auto overscroll-x-contain px-6 pb-4 pt-1 sm:px-10",
              "snap-x snap-mandatory scroll-pb-2 scroll-px-6 sm:scroll-px-10",
              "[-ms-overflow-style:auto] [scrollbar-color:rgba(255,255,255,0.22)_transparent] [scrollbar-width:thin]",
              "[&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/25",
            )}
            tabIndex={0}
            aria-label={`${section.heading} — scroll horizontally`}
          >
            {section.items.map((item) => (
              <MediaHighlightCard
                key={`${section.id}-${item.href}-${item.title}`}
                item={item}
                sectionId={section.id}
                cardDataAttr={undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function HorizontalSection({
  section,
}: {
  section: MediaHighlightSection
}) {
  const legacySectionAttr =
    section.id === "sunswift-7-journey"
      ? { "data-media-journey": "" as const }
      : section.id === "partnership-spotlights"
        ? { "data-media-partnerships": "" as const }
        : section.id === "team-highlights"
          ? { "data-media-team-highlights": "" as const }
          : section.id === "partner-spotlights"
            ? { "data-media-partner-spotlights": "" as const }
            : {}
  return (
    <section
      data-media-highlight-section
      data-section-heading={section.heading}
      {...legacySectionAttr}
      className="border-b border-white/10 py-14 lg:py-20"
    >
      <div className="mb-8 px-6 sm:px-10">
        <h2 className="text-2xl font-light tracking-tight text-white sm:text-3xl lg:text-4xl">
          {section.heading}
        </h2>
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#0a0c0e] to-transparent lg:w-12" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#0a0c0e] to-transparent lg:w-12" />
        <div
          data-media-highlight-row
          data-section-id={section.id}
          className={cn(
            "flex gap-4 overflow-x-auto overscroll-x-contain px-6 pb-4 pt-1 sm:px-10",
            "snap-x snap-mandatory scroll-pb-2 scroll-px-6 sm:scroll-px-10",
            "[-ms-overflow-style:auto] [scrollbar-color:rgba(255,255,255,0.22)_transparent] [scrollbar-width:thin]",
            "[&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/25",
          )}
          tabIndex={0}
          aria-label={`${section.heading} — scroll horizontally`}
        >
          {section.items.map((item) => (
            <MediaHighlightCard
              key={`${section.id}-${item.href}-${item.title}`}
              item={item}
              sectionId={section.id}
              cardDataAttr={
                section.id === "partnership-spotlights"
                  ? "media-partnership"
                  : section.id === "team-highlights"
                    ? "media-team-highlight"
                    : section.id === "partner-spotlights"
                      ? "media-partner-video"
                      : section.id === "sunswift-7-journey"
                        ? "media-journey-part"
                        : undefined
              }
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export function MediaHighlightsPage({ imageOverrides }: { imageOverrides?: SiteImageMap }) {
  const sections = data.sections.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      imageSrc: resolveSiteImage(item.imageSrc, imageOverrides),
    })),
  }))

  return (
    <main
      data-media-highlights-page
      className="relative overflow-x-hidden bg-[#0a0c0e] text-white"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-40 bg-[linear-gradient(180deg,#000_0%,rgba(10,12,14,0)_100%)]" />
      <TransparentNavbar />

      <div className="relative flex w-full flex-col lg:grid lg:min-h-0 lg:grid-cols-[minmax(280px,380px)_1fr]">
        <JuicerSidebar />

        <div className="relative min-w-0">
          <section
            data-media-hero
            className="relative min-h-[82svh] overflow-hidden border-b border-white/10 bg-[#0a0c0e]"
          >
            <Image
              data-media-hero-background
              src={resolveSiteImage(highlightsBanner, imageOverrides)}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 72vw, 100vw"
              className="object-cover object-[56%_45%] opacity-82"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#0a0c0e_0%,rgba(10,12,14,0.86)_30%,rgba(10,12,14,0.34)_62%,rgba(10,12,14,0.06)_100%)]" />
            <div
              data-media-hero-vertical-fade
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[42svh] bg-[linear-gradient(180deg,rgba(10,12,14,0)_0%,rgba(10,12,14,0.72)_66%,#0a0c0e_100%)]"
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[22svh] bg-[linear-gradient(180deg,#050607_0%,rgba(5,6,7,0.56)_45%,rgba(5,6,7,0)_100%)]" />

            <div className="relative mx-auto flex min-h-[82svh] max-w-[92rem] px-6 pt-32 pb-16 sm:px-10 lg:pt-36 lg:pb-24">
              <div className="relative z-10 flex max-w-3xl flex-col justify-end">
                <p className="font-mono text-[0.66rem] tracking-[0.28em] text-accent-yellow uppercase">
                  Media
                </p>
                <h1 className="mt-5 max-w-5xl text-[clamp(4.6rem,12vw,12rem)] leading-[0.84] font-thin tracking-normal text-white">
                  Highlights.
                </h1>
                <p className="mt-8 max-w-xl text-lg leading-8 text-white/62">
                  Explore stories, videos, and partner coverage here!
                </p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <a
                    href="#media-spotlight"
                    className="inline-flex items-center gap-3 border border-accent-yellow bg-accent-yellow px-5 py-3 font-mono text-[0.66rem] tracking-[0.24em] text-black uppercase transition-colors duration-300 hover:bg-white"
                  >
                    View highlights
                    <ArrowRight className="size-4" />
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-3 border border-white/20 px-5 py-3 font-mono text-[0.66rem] tracking-[0.24em] text-white uppercase transition-colors duration-300 hover:border-accent-yellow hover:bg-accent-yellow hover:text-black"
                  >
                    Press enquiries
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {sections.map((section) =>
            section.id === "media-spotlight" ? (
              <MediaSpotlightSection key={section.id} section={section} />
            ) : (
              <HorizontalSection key={section.id} section={section} />
            ),
          )}
        </div>
      </div>
    </main>
  )
}
