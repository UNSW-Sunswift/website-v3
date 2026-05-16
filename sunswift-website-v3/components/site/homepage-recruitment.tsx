"use client"

import Link from "next/link"
import { ArrowRight, ChevronDown } from "lucide-react"
import { useEffect, useRef, type CSSProperties } from "react"

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
  "--recruitment-panel-blur"?: string
  "--recruitment-block-opacity"?: number
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

export function HomepageRecruitment({ roles }: HomepageRecruitmentProps) {
  const sectionRef = useRef<HTMLElement>(null)

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
      // Delay the intro fade-in so the recruitment headline only appears after the
      // records section is fully out of view. Without this, the intro pops in
      // through the records dark veil and feels like a layering glitch.
      section.style.setProperty(
        "--recruitment-intro-opacity",
        String(clamp((progress - 0.26) / 0.18))
      )
      section.style.setProperty(
        "--recruitment-panel-y",
        `${(1 - eased) * 46}px`
      )
      section.style.setProperty(
        "--recruitment-panel-opacity",
        String(clamp((progress - 0.32) / 0.34))
      )
      section.style.setProperty(
        "--recruitment-panel-blur",
        `${(1 - eased) * 16}px`
      )
      section.style.setProperty(
        "--recruitment-block-opacity",
        String(0.08 + eased * 0.12)
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
      className="relative z-10 -mt-[104svh] overflow-x-clip overflow-y-visible bg-[#0a0c0e] text-white"
      style={
        {
          "--recruitment-intro-y": "34px",
          "--recruitment-intro-opacity": 0,
          "--recruitment-panel-y": "46px",
          "--recruitment-panel-opacity": 0,
          "--recruitment-panel-blur": "16px",
          "--recruitment-block-opacity": 0.08,
        } as RecruitmentStyle
      }
    >
      <div className="pointer-events-none absolute inset-x-0 -top-[34svh] h-[64svh] bg-[#0a0c0e]" />
      <div className="pointer-events-none absolute inset-0 bg-[#0a0c0e]" />
      <div
        aria-hidden
        data-homepage-recruitment-block
        className="pointer-events-none absolute top-[25svh] left-1/2 h-[min(58vw,24rem)] w-[min(82vw,54rem)] -translate-x-1/2 border border-accent-yellow/18 bg-accent-yellow"
        style={{
          opacity: "var(--recruitment-block-opacity)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[42svh] bg-[#0a0c0e]" />

      <div className="relative mx-auto max-w-[92rem] px-4 pt-[calc(52svh+3rem)] pb-24 sm:px-6 sm:pt-[calc(52svh+4rem)] sm:pb-32 lg:pt-[calc(52svh+6rem)] lg:pb-40">
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
            filter: "blur(var(--recruitment-panel-blur))",
            transform: "translate3d(0, var(--recruitment-panel-y), 0)",
          }}
        >
          {recruitmentStreams.map((stream, index) => {
            return (
              <details
                key={stream.name}
                data-homepage-recruitment-discipline={stream.name}
                className="group border-t border-white/12 py-5 transition-[border-color] duration-500 last:border-b open:border-accent-yellow/45"
                open={index === 1}
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-5 [&::-webkit-details-marker]:hidden">
                  <span>
                    <span className="font-mono text-[0.65rem] tracking-[0.28em] text-white/38 uppercase">
                      {stream.label}
                    </span>
                    <span className="mt-2 block text-3xl leading-none font-light text-white transition-[color,transform] duration-500 group-open:translate-x-2 group-open:text-accent-yellow sm:text-5xl">
                      {stream.name}
                    </span>
                  </span>
                  <span className="mt-2 grid size-10 place-items-center border border-white/15 text-lg font-light text-accent-yellow transition-colors duration-300 group-open:border-accent-yellow group-open:bg-accent-yellow group-open:text-black">
                    <ChevronDown className="size-4 transition-transform duration-300 group-open:rotate-180" />
                  </span>
                </summary>

                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-open:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <div className="group-open:blur-0 grid gap-5 pt-8 opacity-0 blur-sm transition-[opacity,transform,filter] duration-500 ease-out group-open:translate-y-0 group-open:opacity-100 lg:grid-cols-[0.54fr_1fr]">
                      <p className="max-w-sm translate-y-3 text-sm leading-6 text-white/52 transition-transform duration-500 group-open:translate-y-0">
                        {stream.summary}
                      </p>
                      <Link
                        href={recruitmentStreamHref(stream)}
                        data-homepage-recruitment-role
                        data-homepage-recruitment-stream-card={stream.name}
                        className="group/card flex min-h-[8.5rem] translate-y-3 flex-col justify-between border border-white/10 bg-white/[0.035] p-4 text-left transition-[border-color,background-color,transform] duration-500 group-open:translate-y-0 hover:-translate-y-1 hover:border-accent-yellow/70 hover:bg-white/[0.07]"
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
              </details>
            )
          })}
        </div>
      </div>
    </section>
  )
}
