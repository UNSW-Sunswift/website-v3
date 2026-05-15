import Link from "next/link"
import { ArrowRight, ArrowUpRight, Play } from "lucide-react"

import { TransparentNavbar } from "@/components/site/transparent-navbar"

const mediaSpotlight = {
  label: "Media Spotlight",
  title:
    "Amazon Web Services & Sunswift Racing: Solar powered journey across the Australian Outback",
  href: "https://aws.amazon.com/",
}

const journeyTitle = "Sunswift 7's Journey to a World Record"

const journeyParts = [
  "Part 1: New Beginnings",
  "Part 2: Silver Linings",
  "Part 3: Test. Break. Fix. Repeat.",
  "Part 4: World Record Attempt",
]

const partnershipSpotlights = [
  {
    title: "Auto-UX Partners with UNSW Sunswift Racing",
    href: "https://www.auto-ux.io/",
  },
  {
    title: "Driving Greater Energy Efficiency with UNSW's Sunswift Racing and Altium",
    href: "https://www.altium.com/",
  },
  {
    title: "Optiver partners with UNSW Sunswift Racing to drive innovation for a better future",
    href: "https://optiver.com/",
  },
  {
    title: "Optus takes to the track with Sunswift Racing",
    href: "https://www.optus.com.au/",
  },
  {
    title: "Sunswift 7 & MI: Helping the drive towards a sustainable future",
    href: "https://www.master-instruments.com.au/",
  },
  {
    title: "UNSW students build a world record-holding solar electric race car with AWS",
    href: "https://aws.amazon.com/",
  },
]

const teamHighlights = [
  {
    title:
      "EV record breakers! Sunswift 7 goes 1000km on a single charge in world's best time",
    href: "https://www.unsw.edu.au/",
    source: "UNSW",
  },
  {
    title:
      "International pros contested this solar car race. Sydney students beat them all",
    href: "https://www.smh.com.au/",
    source: "SMH",
  },
  {
    title: "Sunswift 7: Driving technology forward",
    href: "https://news.unsw.edu.au/",
    source: "UNSW Newsroom",
  },
]

const videoSpotlights = [
  "Sunswift at AWS Summit 2024",
  "Sunswift & Optus Remote Driving Initiative",
]

export function MediaHighlightsPage() {
  return (
    <main
      data-media-highlights-page
      className="overflow-hidden bg-[#0a0c0e] text-white"
    >
      <div className="relative">
        <TransparentNavbar />
        <section className="relative min-h-[88svh] overflow-hidden bg-[#0a0c0e]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(245,208,0,0.14)_0%,transparent_32%),linear-gradient(180deg,#050607_0%,#0a0c0e_62%,#050607_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,#000_0%,rgba(10,12,14,0)_100%)]" />
          <div className="relative mx-auto grid min-h-[88svh] max-w-[92rem] gap-12 px-4 pt-28 pb-14 sm:px-6 lg:grid-cols-[1fr_0.86fr] lg:items-end lg:pt-36 lg:pb-20">
            <div>
              <p className="font-mono text-[0.68rem] tracking-[0.28em] text-accent-yellow uppercase">
                Media
              </p>
              <h1 className="mt-5 max-w-5xl text-[clamp(4.4rem,12vw,12rem)] leading-[0.84] font-thin tracking-normal text-white">
                Highlights.
              </h1>
            </div>
            <div className="max-w-xl lg:pb-4">
              <p className="text-lg leading-8 text-white/62">
                Press, partner stories and video moments from Sunswift 7&apos;s
                record-setting chapter, rebuilt as a lean highlights archive for
                the new website.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#media-spotlight"
                  className="inline-flex items-center gap-3 border border-accent-yellow bg-accent-yellow px-5 py-3 font-mono text-[0.68rem] tracking-[0.24em] text-black uppercase transition-colors duration-300 hover:bg-white"
                >
                  View highlights
                  <ArrowRight className="size-4" />
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 border border-white/20 px-5 py-3 font-mono text-[0.68rem] tracking-[0.24em] text-white uppercase transition-colors duration-300 hover:border-white hover:bg-white hover:text-black"
                >
                  Press enquiries
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section
        id="media-spotlight"
        className="border-y border-white/10 bg-white/[0.035]"
      >
        <a
          href={mediaSpotlight.href}
          target="_blank"
          rel="noreferrer"
          data-media-spotlight
          className="group mx-auto grid max-w-[92rem] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:py-24"
        >
          <div>
            <p className="font-mono text-[0.68rem] tracking-[0.28em] text-accent-yellow uppercase">
              {mediaSpotlight.label}
            </p>
            <h2 className="mt-4 max-w-4xl text-4xl leading-[0.98] font-light tracking-normal text-white sm:text-6xl">
              {mediaSpotlight.title}
            </h2>
          </div>
          <div className="relative min-h-72 overflow-hidden border border-white/12 bg-white/[0.045] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(245,208,0,0.28),transparent_36%),radial-gradient(circle_at_72%_34%,rgba(255,255,255,0.13),transparent_24%),linear-gradient(180deg,#181a1d,#050607)]" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/10 bg-black/35 px-5 py-4 backdrop-blur-xl">
              <span className="font-mono text-[0.62rem] tracking-[0.24em] text-white/62 uppercase">
                Feature
              </span>
              <span className="grid size-11 place-items-center border border-white/15 text-accent-yellow transition-colors duration-300 group-hover:border-accent-yellow group-hover:bg-accent-yellow group-hover:text-black">
                <ArrowUpRight className="size-4" />
              </span>
            </div>
          </div>
        </a>
      </section>

      <section className="bg-[#0a0c0e] py-20 text-white lg:py-28">
        <div className="mx-auto max-w-[92rem] px-4 sm:px-6">
          <div className="mb-12 grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="font-mono text-[0.68rem] tracking-[0.28em] text-white/38 uppercase">
                Sunswift 7
              </p>
              <h2 className="mt-4 max-w-4xl text-5xl leading-[0.98] font-light tracking-normal text-white sm:text-7xl">
                {journeyTitle}.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-white/56 sm:text-lg">
              The Webflow highlights page framed Sunswift 7&apos;s story as a
              four-part arc. This layout keeps that backbone but turns it into a
              scan-friendly editorial rail.
            </p>
          </div>

          <div
            data-media-journey
            className="grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-4"
          >
            {journeyParts.map((part, index) => (
              <article key={part} className="group bg-[#0f1113] p-6">
                <div className="font-mono text-[0.62rem] tracking-[0.24em] text-accent-yellow uppercase">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-16 text-2xl leading-tight font-light text-white">
                  {part}
                </h3>
                <div className="mt-8 h-px w-full origin-left bg-white/12 transition-transform duration-500 group-hover:scale-x-75" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0a0c0e] pb-20 text-white lg:pb-28">
        <div className="mx-auto grid max-w-[92rem] gap-12 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <p className="font-mono text-[0.68rem] tracking-[0.28em] text-white/38 uppercase">
              Partnership Spotlights
            </p>
            <div className="mt-7 space-y-3" data-media-partnerships>
              {partnershipSpotlights.map((item, index) => (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  data-media-partnership
                  className="group flex items-start justify-between gap-6 border-t border-white/12 py-5 last:border-b"
                >
                  <span>
                    <span className="font-mono text-[0.58rem] tracking-[0.2em] text-white/34 uppercase">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-2 block text-xl leading-snug font-light text-white/82 transition-colors duration-300 group-hover:text-white sm:text-2xl">
                      {item.title}
                    </span>
                  </span>
                  <ArrowUpRight className="mt-2 size-4 shrink-0 text-accent-yellow" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[0.68rem] tracking-[0.28em] text-white/38 uppercase">
              Team Highlights
            </p>
            <div className="mt-7 grid gap-4" data-media-team-highlights>
              {teamHighlights.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  data-media-team-highlight
                  className="group border border-white/12 bg-white/[0.045] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_80px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-colors duration-300 hover:border-accent-yellow/50 hover:bg-white/[0.075]"
                >
                  <span className="font-mono text-[0.6rem] tracking-[0.22em] text-accent-yellow uppercase">
                    {item.source}
                  </span>
                  <span className="mt-5 flex items-end justify-between gap-6">
                    <span className="text-2xl leading-tight font-light text-white">
                      {item.title}
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 text-white/46 transition-colors duration-300 group-hover:text-accent-yellow" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#050607] py-20 text-white lg:py-28">
        <div className="mx-auto max-w-[92rem] px-4 sm:px-6">
          <p className="font-mono text-[0.68rem] tracking-[0.28em] text-white/38 uppercase">
            Partner Spotlights
          </p>
          <div
            data-media-video-spotlights
            className="mt-9 grid gap-4 md:grid-cols-2"
          >
            {videoSpotlights.map((title) => (
              <article
                key={title}
                data-media-video-card
                className="group relative min-h-80 overflow-hidden border border-white/12 bg-white/[0.045] p-6"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(245,208,0,0.16),transparent_32%),linear-gradient(180deg,#17191c,#060708)] transition-transform duration-700 group-hover:scale-[1.02]" />
                <div className="relative flex h-full flex-col justify-between">
                  <span className="grid size-14 place-items-center border border-white/15 bg-black/22 text-accent-yellow backdrop-blur-xl">
                    <Play className="size-5 fill-current" />
                  </span>
                  <div>
                    <h3 className="text-3xl leading-tight font-light text-white">
                      {title}
                    </h3>
                    <p className="mt-4 font-mono text-[0.62rem] tracking-[0.24em] text-white/42 uppercase">
                      Video preview placeholder
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
