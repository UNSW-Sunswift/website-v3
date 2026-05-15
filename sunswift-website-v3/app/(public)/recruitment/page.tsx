import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

import {
  recruitmentStreamHref,
  recruitmentStreams,
} from "@/components/site/recruitment-content"
import { TransparentNavbar } from "@/components/site/transparent-navbar"

export const dynamic = "force-static"

const intakeNotes = [
  "Business and media students support operations, marketing, partnerships, recruitment, events and Sunswift's public presence.",
  "Engineering students work across electrical, mechanical, software, renewable and chemical systems for the solar electric vehicle.",
  "Engineering applications are managed through UNSW ChallENG/VIP pathways; business and media applicants can use the alternative form for faster routing.",
]

const alternativeApplicationsUrl =
  "https://forms.gle/sunswift-business-media-placeholder"

export default async function RecruitmentPage() {
  return (
    <main data-recruitment-hub className="bg-[#0a0c0e] text-white">
      <div className="relative">
        <TransparentNavbar />
        <section className="relative overflow-hidden bg-[#0a0c0e] text-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_16%,rgba(245,208,0,0.14)_0%,transparent_34%),linear-gradient(180deg,#08090a_0%,#0a0c0e_62%,#050607_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,#000_0%,rgba(10,12,14,0)_100%)]" />

          <div className="relative mx-auto max-w-[92rem] px-4 pt-24 pb-20 sm:px-6 lg:pt-32 lg:pb-28">
            <div className="grid min-h-[52svh] gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <h1 className="max-w-5xl text-[clamp(4rem,10vw,10rem)] leading-[0.88] font-thin tracking-normal text-white">
                  Join Sunswift Racing.
                </h1>
              </div>
              <div className="max-w-xl lg:pb-4">
                <p className="text-lg leading-8 text-white/62">
                  Work on a major student-led solar racing project with
                  passionate peers, academics and industry partners. Explore the
                  streams below, then apply through the relevant university or
                  Sunswift pathway.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="https://www.unsw.edu.au/engineering/student-life/student-opportunities/challeng"
                    className="inline-flex items-center gap-3 border border-accent-yellow bg-accent-yellow px-5 py-3 font-mono text-[0.68rem] tracking-[0.24em] text-black uppercase transition-colors duration-300 hover:bg-white"
                  >
                    Apply here
                    <ArrowUpRight className="size-4" />
                  </Link>
                  <Link
                    href={alternativeApplicationsUrl}
                    target="_blank"
                    rel="noreferrer"
                    data-alternative-applications-link
                    className="inline-flex items-center gap-3 border border-white/20 px-5 py-3 font-mono text-[0.68rem] tracking-[0.24em] text-white uppercase transition-colors duration-300 hover:border-white hover:bg-white hover:text-black"
                  >
                    Business/media form
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-16 grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-3">
              {intakeNotes.map((note, index) => (
                <div key={note} className="bg-[#0a0c0e]/95 p-6">
                  <div className="font-mono text-[0.62rem] tracking-[0.24em] text-accent-yellow uppercase">
                    0{index + 1}
                  </div>
                  <p className="mt-5 text-sm leading-6 text-white/56">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="bg-[#0a0c0e] text-white">
        <div className="mx-auto max-w-[92rem] px-4 py-20 sm:px-6 lg:py-28">
          <div className="mb-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="font-mono text-[0.68rem] tracking-[0.28em] text-white/38 uppercase">
                Explore streams
              </p>
              <h2 className="mt-4 max-w-3xl text-5xl leading-[0.98] font-light tracking-normal text-white sm:text-7xl">
                Choose your lane.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-white/56 sm:text-lg">
              Each stream has a different relationship to the car and the team.
              Pick a stream to jump into the available roles page, where the
              matching CMS role cards are grouped for fast scanning.
            </p>
          </div>

          <div className="space-y-4" data-recruitment-streams>
            {recruitmentStreams.map((stream) => (
              <Link
                key={stream.name}
                href={recruitmentStreamHref(stream)}
                data-recruitment-stream={stream.name}
                className="group block border-t border-white/12 py-6 text-left last:border-b"
              >
                <div className="flex items-start justify-between gap-6">
                  <span>
                    <span className="font-mono text-[0.68rem] tracking-[0.26em] text-white/38 uppercase">
                      {stream.label}
                    </span>
                    <span className="mt-2 block text-4xl leading-none font-light text-white sm:text-6xl">
                      {stream.name}
                    </span>
                  </span>
                  <span className="mt-2 grid size-11 place-items-center border border-white/15 text-accent-yellow transition-colors duration-300 group-hover:border-accent-yellow group-hover:bg-accent-yellow group-hover:text-black">
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>

                <div className="grid gap-8 pt-9 lg:grid-cols-[0.42fr_0.58fr]">
                  <div>
                    <p className="text-base leading-7 text-white/62">
                      {stream.summary}
                    </p>
                    <p className="mt-5 text-sm leading-6 text-white/44">
                      {stream.webflowNote}
                    </p>
                    <div
                      className="mt-8 flex flex-wrap gap-2"
                      data-recruitment-families={stream.name}
                    >
                      {stream.families.map((family) => (
                        <span
                          key={family}
                          className="border border-white/12 px-3 py-2 font-mono text-[0.62rem] tracking-[0.2em] text-white/54 uppercase transition-colors duration-300 group-hover:border-accent-yellow/40 group-hover:text-white"
                        >
                          {family}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-end justify-start lg:justify-end">
                    <span className="inline-flex items-center gap-3 border border-white/15 px-4 py-3 font-mono text-[0.62rem] tracking-[0.22em] text-white/72 uppercase transition-colors duration-300 group-hover:border-accent-yellow group-hover:text-accent-yellow">
                      View available roles
                      <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
