"use client"

import Link from "next/link"
import { ArrowRight, ChevronDown } from "lucide-react"
import { useEffect, useRef, useState, type CSSProperties } from "react"

import {
  recruitmentStreamHref,
  recruitmentStreams,
} from "@/components/site/recruitment-content"
import type { RecruitmentRole } from "@/lib/cms/types"

type HomepageRecruitmentProps = {
  roles: RecruitmentRole[]
}

type RecruitmentStyle = CSSProperties & {
  "--recruitment-intro-y"?: string
  "--recruitment-intro-opacity"?: number
  "--recruitment-panel-y"?: string
  "--recruitment-panel-opacity"?: number
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

export function HomepageRecruitment({ roles }: HomepageRecruitmentProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeStream, setActiveStream] = useState("Engineering")

  useEffect(() => {
    const section = sectionRef.current
    if (!section) {
      return
    }

    const update = () => {
      const rect = section.getBoundingClientRect()
      const progress = clamp(
        (window.innerHeight - rect.top) /
          (window.innerHeight + rect.height * 0.55)
      )
      const eased = 1 - Math.pow(1 - progress, 3)

      section.style.setProperty(
        "--recruitment-intro-y",
        `${(1 - eased) * 34}px`
      )
      // Bring the recruitment headline in shortly after the records content clears
      // so the handoff does not sit on a blank black viewport.
      section.style.setProperty(
        "--recruitment-intro-opacity",
        String(clamp((progress - 0.18) / 0.18))
      )
      section.style.setProperty(
        "--recruitment-panel-y",
        `${(1 - eased) * 46}px`
      )
      section.style.setProperty(
        "--recruitment-panel-opacity",
        String(clamp((progress - 0.3) / 0.28))
      )
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)

    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      data-homepage-recruitment
      data-recruitment-source="cms"
      data-recruitment-role-count={roles.length}
      className="relative z-10 -mt-[64svh] overflow-x-clip overflow-y-visible bg-[#0a0c0e] text-white"
      style={
        {
          "--recruitment-intro-y": "34px",
          "--recruitment-intro-opacity": 0,
          "--recruitment-panel-y": "46px",
          "--recruitment-panel-opacity": 0,
        } as RecruitmentStyle
      }
    >
      <div className="pointer-events-none absolute inset-x-0 -top-[14svh] h-[34svh] bg-[#0a0c0e]" />
      <div className="pointer-events-none absolute inset-0 bg-[#0a0c0e]" />
      <div aria-hidden data-homepage-recruitment-block className="hidden" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[18svh] bg-[#0a0c0e]" />

      <div className="relative mx-auto max-w-[92rem] px-4 pt-[calc(8svh+3rem)] pb-24 sm:px-6 sm:pt-[calc(8svh+4rem)] sm:pb-32 lg:pt-[calc(8svh+6rem)] lg:pb-40">
        <div
          data-homepage-recruitment-intro
          className="mx-auto flex max-w-5xl flex-col items-center text-center"
          style={{
            opacity: "var(--recruitment-intro-opacity)",
            transform: "translate3d(0, var(--recruitment-intro-y), 0)",
          }}
        >
          <h2 className="max-w-[10ch] text-[clamp(4rem,10vw,10.5rem)] leading-[0.88] font-thin tracking-normal text-white">
            Embrace Tomorrow
          </h2>
          <p className="mt-8 max-w-2xl text-base leading-7 text-white/58 sm:text-lg">
            Find your place across engineering, design, media, finance,
            marketing and operations.
          </p>
          <Link
            href="/recruitment"
            className="mt-10 inline-flex items-center justify-center gap-3 border border-white/20 px-6 py-3.5 font-mono text-[0.68rem] tracking-[0.24em] text-white uppercase transition-colors duration-300 hover:border-accent-yellow hover:bg-accent-yellow hover:text-black"
          >
            Join the team
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div
          className="mx-auto mt-16 max-w-5xl space-y-3 sm:mt-24"
          data-homepage-recruitment-disciplines
          style={{
            opacity: "var(--recruitment-panel-opacity)",
            transform: "translate3d(0, var(--recruitment-panel-y), 0)",
          }}
        >
          {recruitmentStreams.map((stream) => {
            const isOpen = activeStream === stream.name
            const buttonId = `homepage-recruitment-${stream.slug}-button`
            const panelId = `homepage-recruitment-${stream.slug}-panel`

            return (
              <div
                key={stream.name}
                data-homepage-recruitment-discipline={stream.name}
                data-state={isOpen ? "open" : "closed"}
                className="group border-t border-white/12 py-5 transition-[border-color] duration-500 last:border-b data-[state=open]:border-accent-yellow/45"
              >
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setActiveStream(stream.name)}
                  className="flex w-full items-start justify-between gap-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent-yellow focus-visible:ring-offset-4 focus-visible:ring-offset-[#0a0c0e]"
                >
                  <span>
                    <span className="font-mono text-[0.65rem] tracking-[0.28em] text-white/38 uppercase">
                      {stream.label}
                    </span>
                    <span className="mt-2 block text-3xl leading-none font-light text-white transition-[color,transform] duration-500 group-data-[state=open]:translate-x-2 group-data-[state=open]:text-accent-yellow sm:text-5xl">
                      {stream.name}
                    </span>
                  </span>
                  <span className="mt-2 grid size-10 place-items-center border border-white/15 text-lg font-light text-accent-yellow transition-colors duration-300 group-data-[state=open]:border-accent-yellow group-data-[state=open]:bg-accent-yellow group-data-[state=open]:text-black">
                    <ChevronDown className="size-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                  </span>
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[state=open]:grid-rows-[1fr]"
                >
                  <div className="overflow-hidden">
                    <div className="relative grid translate-y-4 gap-5 pt-8 opacity-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] before:absolute before:top-0 before:left-0 before:h-px before:w-0 before:bg-accent-yellow before:transition-[width] before:duration-700 before:ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[state=open]:translate-y-0 group-data-[state=open]:opacity-100 group-data-[state=open]:before:w-full lg:grid-cols-[0.54fr_1fr]">
                      <p className="max-w-sm text-sm leading-6 text-white/52">
                        {stream.summary}
                      </p>
                      <Link
                        href={recruitmentStreamHref(stream)}
                        data-homepage-recruitment-role
                        data-homepage-recruitment-stream-card={stream.name}
                        className="group/card flex min-h-[8.5rem] flex-col justify-between border border-white/10 bg-white/[0.035] p-4 text-left transition-[border-color,background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-accent-yellow/70 hover:bg-white/[0.07]"
                      >
                        <span className="font-mono text-[0.6rem] tracking-[0.22em] text-accent-yellow uppercase">
                          {stream.name}
                        </span>
                        <span className="mt-4 text-lg leading-snug font-light text-white">
                          Explore {stream.roleTitle}
                        </span>
                        <span className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[0.58rem] tracking-[0.22em] text-white/42 uppercase transition-colors duration-300 group-hover/card:text-accent-yellow">
                          Open roles
                          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/card:translate-x-1" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
