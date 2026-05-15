"use client"

import Image from "next/image"
import { useRef, useState } from "react"

import type { Achievement } from "@/lib/cms/static-data"

type Props = {
  achievements: Achievement[]
  overview: string
}

export function AchievementsTimeline({ achievements, overview }: Props) {
  const railRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const activeAchievement = achievements[activeIndex] ?? achievements[0]

  function updateActiveFromScroll() {
    const rail = railRef.current
    if (!rail) {
      return
    }

    const railRect = rail.getBoundingClientRect()
    const railCenter = railRect.left + railRect.width / 2
    const cards = Array.from(rail.querySelectorAll<HTMLElement>("[data-achievement-card]"))

    let closestIndex = 0
    let closestDistance = Number.POSITIVE_INFINITY

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect()
      const cardCenter = rect.left + rect.width / 2
      const distance = Math.abs(cardCenter - railCenter)

      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    setActiveIndex(closestIndex)
  }

  function focusAchievement(index: number) {
    setActiveIndex(index)
    railRef.current
      ?.querySelectorAll<HTMLElement>("[data-achievement-card]")
      [index]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
  }

  return (
    <section
      data-achievements-page
      data-active-year={activeAchievement?.year}
      className="relative min-h-svh overflow-hidden bg-[#0a0c0e] text-white"
    >
      <div className="pointer-events-none absolute inset-0">
        {achievements.map((achievement, index) => (
          <Image
            key={`${achievement.year}-${achievement.title}`}
            src={achievement.image}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className={[
              "object-cover transition-[opacity,transform,filter] duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
              index === activeIndex
                ? "scale-[1.03] opacity-55 [filter:grayscale(0.15)_brightness(0.82)]"
                : "scale-[1.08] opacity-0 [filter:grayscale(1)_brightness(0.65)]",
            ].join(" ")}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_65%_35%,rgba(255,255,255,0.06)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#050607_0%,rgba(5,6,7,0.82)_28%,rgba(5,6,7,0.45)_58%,rgba(5,6,7,0.88)_100%)]" />
      <div
        data-achievements-top-vignette
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-[24svh] bg-[linear-gradient(180deg,#000_0%,rgba(10,12,14,0.92)_28%,rgba(10,12,14,0)_100%)]"
      />

      <div className="relative z-10 flex min-h-svh flex-col justify-end px-5 pb-8 pt-28 sm:px-8 lg:px-14">
        <div className="mb-auto max-w-5xl pt-16 sm:pt-24">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.34em] text-accent-yellow">
            Achievements
          </p>
          <h1 className="mt-4 max-w-4xl text-5xl font-thin leading-[0.94] tracking-tight text-white sm:text-7xl lg:text-[6.5rem]">
            A timeline of solar racing milestones.
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
            {overview}
          </p>
        </div>

        <div className="mb-6 grid gap-4 border-y border-white/10 py-4 sm:grid-cols-[0.7fr_1.3fr] sm:items-end">
          <div>
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.32em] text-white/45">
              Now viewing
            </p>
            <p className="mt-2 text-3xl font-thin leading-none text-white sm:text-5xl">
              {activeAchievement?.year}
            </p>
          </div>
          <div className="max-w-3xl sm:justify-self-end sm:text-right">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-accent-yellow">
              {activeAchievement?.vehicle}
            </p>
            <h2 className="mt-2 text-2xl font-light leading-tight text-white sm:text-4xl">
              {activeAchievement?.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/60">
              {activeAchievement?.description}
            </p>
          </div>
        </div>

        <div
          ref={railRef}
          data-achievements-timeline
          onScroll={updateActiveFromScroll}
          className="scrollbar-thin -mx-5 flex snap-x snap-mandatory gap-0 overflow-x-auto overscroll-x-contain px-5 pb-3 sm:-mx-8 sm:px-8 lg:-mx-14 lg:px-14"
        >
          {achievements.map((achievement, index) => {
            const isActive = index === activeIndex

            return (
              <button
                key={`${achievement.year}-${achievement.title}`}
                type="button"
                data-achievement-card
                data-achievement-year={achievement.year}
                data-active={isActive ? "true" : "false"}
                onClick={() => focusAchievement(index)}
                onFocus={() => setActiveIndex(index)}
                className={[
                  "group relative min-h-64 w-[78vw] shrink-0 snap-center border-y border-r border-white/10 bg-white/[0.025] p-5 text-left backdrop-blur-sm first:border-l sm:w-[46vw] lg:w-[27vw]",
                  "transition-[background-color,border-color,opacity,filter] duration-500",
                  isActive
                    ? "border-accent-yellow/50 bg-white/[0.07] opacity-100"
                    : "opacity-62 hover:bg-white/[0.05] hover:opacity-100",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-6">
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-white/42">
                    {achievement.kind}
                  </span>
                  <span
                    className={[
                      "font-mono text-sm transition-colors duration-500",
                      isActive ? "text-accent-yellow" : "text-white/50 group-hover:text-accent-yellow",
                    ].join(" ")}
                  >
                    {achievement.year}
                  </span>
                </div>
                <h3 className="mt-14 max-w-[15ch] text-3xl font-thin leading-[0.98] tracking-tight text-white sm:text-4xl">
                  {achievement.title}
                </h3>
                <p className="mt-5 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-white/45">
                  {achievement.vehicle}
                </p>
                <p className="mt-4 max-w-sm text-sm leading-6 text-white/58">
                  {achievement.description}
                </p>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
