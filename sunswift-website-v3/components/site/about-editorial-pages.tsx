import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

import aboutPages from "@/content/about-pages.json"
import { TransparentNavbar } from "@/components/site/transparent-navbar"

type StoryBlock =
  | { type: "heading"; level: string; text: string }
  | { type: "paragraph"; level?: string; text: string }
  | { type: "image"; src?: string }

type StoryArticle = {
  id: string
  title: string
  summary: string
  author: string
  date: string
  image: string
  blocks: StoryBlock[]
}

const whoWeAre = aboutPages.pages.whoWeAre
const ourStory = aboutPages.pages.ourStory

function PlaceholderImage({
  src,
  label = "",
  className = "",
  priority = false,
  showCaption = true,
}: {
  src: string
  label?: string
  className?: string
  priority?: boolean
  /** When false, hides the footer caption bar (Who We Are gallery retains captions). */
  showCaption?: boolean
}) {
  return (
    <div className={`relative overflow-hidden bg-white/[0.035] ${className}`}>
      <Image
        src={src}
        alt=""
        fill
        priority={priority}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover opacity-80 [filter:grayscale(0.22)_brightness(0.82)]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.46)_100%)]" />
      {showCaption ? (
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/15 bg-black/35 px-4 py-3 backdrop-blur-md">
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-white/62">
            {label}
          </span>
          <span className="size-1.5 rounded-full bg-accent-yellow" aria-hidden="true" />
        </div>
      ) : null}
    </div>
  )
}

function DarkHero({
  eyebrow,
  title,
  body,
  image,
}: {
  eyebrow: string
  title: string
  body: string
  image: string
}) {
  return (
    <section className="relative min-h-svh overflow-hidden bg-black text-white">
      <TransparentNavbar />
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-48 [filter:grayscale(0.22)_brightness(0.72)]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_68%_34%,rgba(255,255,255,0.08)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#050607_0%,rgba(5,6,7,0.78)_36%,rgba(5,6,7,0.4)_68%,rgba(5,6,7,0.86)_100%)]" />
      <div className="relative z-10 flex min-h-svh items-end px-5 pb-[12svh] pt-28 sm:px-8 lg:px-14">
        <div className="max-w-6xl">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.34em] text-accent-yellow">
            {eyebrow}
          </p>
          <h1 className="mt-5 max-w-5xl text-6xl font-thin leading-[0.9] tracking-tight text-white sm:text-8xl lg:text-[9.5rem]">
            {title}
          </h1>
          <p className="mt-7 max-w-3xl text-base leading-8 text-white/68 sm:text-lg">
            {body}
          </p>
        </div>
      </div>
    </section>
  )
}

export function WhoWeAreEditorialPage() {
  return (
    <main data-about-page="who-we-are" className="bg-[#0a0c0e] text-white">
      <DarkHero
        eyebrow="About Us"
        title={whoWeAre.title}
        body={whoWeAre.overview}
        image="/vehicle-fleet/vehicle-sunswift-7.jpeg"
      />

      <section className="border-y border-white/10 bg-black text-white">
        <div className="mx-auto grid max-w-[92rem] divide-y divide-white/10 px-5 sm:px-8 lg:grid-cols-3 lg:divide-x lg:divide-y-0 lg:px-14">
          {whoWeAre.sections.map((section, index) => (
            <article key={section.title} className="py-12 lg:px-8">
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.28em] text-accent-yellow">
                0{index + 1} / {section.icon}
              </p>
              <h2 className="mt-5 text-4xl font-thin leading-none tracking-tight text-white sm:text-5xl">
                {section.title}
              </h2>
              <p className="mt-6 text-sm leading-7 text-white/64 sm:text-base">
                {section.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#0a0c0e] px-5 py-20 sm:px-8 lg:px-14">
        <div className="mx-auto max-w-[92rem]">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.32em] text-accent-yellow">
                Gallery
              </p>
              <h2 className="mt-3 text-4xl font-thin leading-tight tracking-tight text-white sm:text-6xl">
                Built in labs, tested on road.
              </h2>
            </div>
          </div>
          <div
            data-who-we-are-gallery
            className="grid auto-rows-[180px] grid-cols-2 gap-px bg-white/10 sm:auto-rows-[240px] lg:grid-cols-4"
          >
            {whoWeAre.gallery.map((image, index) => (
              <PlaceholderImage
                key={`${image}-${index}`}
                src={image}
                showCaption={false}
                className={index === 0 || index === 4 ? "col-span-2 row-span-2" : ""}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-black px-5 py-20 sm:px-8 lg:px-14">
        <div className="mx-auto max-w-[92rem]">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.32em] text-white/45">
            Discover Sunswift
          </p>
          <div className="mt-8 grid gap-px bg-white/10 lg:grid-cols-2">
            {whoWeAre.discover.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group grid min-h-[28rem] bg-[#0a0c0e] transition-colors duration-300 hover:bg-[#111315] sm:grid-cols-[0.8fr_1.2fr]"
              >
                <PlaceholderImage src={item.image} label={item.title} className="min-h-72" />
                <div className="flex flex-col justify-end p-6 sm:p-8">
                  <h2 className="text-4xl font-thin leading-none tracking-tight text-white sm:text-5xl">
                    {item.title}
                  </h2>
                  <p className="mt-5 text-sm leading-7 text-white/62 sm:text-base">
                    {item.body}
                  </p>
                  <span className="mt-8 inline-flex w-fit items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-accent-yellow">
                    {item.cta}
                    <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function StoryBlockView({ block }: { block: StoryBlock }) {
  if (block.type === "image") {
    const src =
      typeof block.src === "string" && block.src.length > 0
        ? block.src
        : "/placeholders/garage.svg"
    return (
      <PlaceholderImage
        src={src}
        showCaption={false}
        className="my-10 aspect-[16/9]"
      />
    )
  }

  if (block.type === "heading") {
    const isMinor = block.level === "h3"

    return (
      <h2
        className={[
          "scroll-mt-28 tracking-tight text-white",
          isMinor
            ? "mt-14 text-3xl font-light leading-tight sm:text-4xl"
            : "mt-20 text-4xl font-thin leading-none sm:text-6xl",
        ].join(" ")}
      >
        {block.text}
      </h2>
    )
  }

  return (
    <p className="mt-6 text-base leading-8 text-white/68 sm:text-lg sm:leading-9">
      {block.text}
    </p>
  )
}

function StoryArticleView({ article, index }: { article: StoryArticle; index: number }) {
  return (
    <article id={article.id} className="border-t border-white/10 py-20 lg:grid lg:grid-cols-[0.42fr_0.58fr] lg:gap-12">
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-accent-yellow">
          Story 0{index + 1}
        </p>
        <h2 className="mt-4 text-5xl font-thin leading-none tracking-tight text-white sm:text-7xl lg:text-8xl">
          {article.title}
        </h2>
        <p className="mt-6 text-sm leading-7 text-white/62 sm:text-base">
          {article.summary}
        </p>
        <div className="mt-6 grid gap-2 border-l border-accent-yellow/50 pl-4 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-white/45">
          <span>{article.author}</span>
          <span>{article.date}</span>
        </div>
        <PlaceholderImage
          src={article.image}
          showCaption={false}
          className="mt-8 aspect-[4/3]"
        />
      </aside>

      <div className="mt-12 lg:mt-0">
        {article.blocks.map((block, blockIndex) => (
          <StoryBlockView key={`${article.id}-${blockIndex}`} block={block} />
        ))}
      </div>
    </article>
  )
}

export function OurStoryEditorialPage() {
  const articles = ourStory.articles as StoryArticle[]

  return (
    <main data-about-page="our-story" className="bg-[#0a0c0e] text-white">
      <DarkHero
        eyebrow="About Us"
        title={ourStory.title}
        body={articles[0]?.summary ?? "The Sunswift story, from first build to future-facing solar racing."}
        image={articles[0]?.image ?? "/placeholders/garage.svg"}
      />

      <section className="sticky top-0 z-30 border-y border-white/10 bg-black/70 px-5 py-3 backdrop-blur-2xl sm:px-8 lg:px-14">
        <nav className="mx-auto flex max-w-[92rem] gap-3 overflow-x-auto" aria-label="Our Story sections">
          {articles.map((article, index) => (
            <a
              key={article.id}
              href={`#${article.id}`}
              className="shrink-0 border border-white/12 px-3 py-2 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-white/58 transition-colors duration-300 hover:border-accent-yellow hover:text-accent-yellow"
            >
              0{index + 1} {article.title}
            </a>
          ))}
        </nav>
      </section>

      <section className="px-5 sm:px-8 lg:px-14">
        <div className="mx-auto max-w-[92rem]">
          {articles.map((article, index) => (
            <StoryArticleView key={article.id} article={article} index={index} />
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-black px-5 py-16 sm:px-8 lg:px-14">
        <div className="mx-auto flex max-w-[92rem] flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="mt-3 text-4xl font-thin leading-tight tracking-tight text-white sm:text-6xl">
              See the milestones.
            </h2>
          </div>
          <Link
            href="/achievements"
            className="inline-flex w-fit items-center gap-2 border border-white/35 px-5 py-3 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-white transition-colors duration-300 hover:border-accent-yellow hover:bg-accent-yellow hover:text-black"
          >
            Achievements
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>
    </main>
  )
}
