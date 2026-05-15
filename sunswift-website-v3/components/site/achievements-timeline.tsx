"use client"

import Image from "next/image"
import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react"

import type { Achievement } from "@/lib/cms/static-data"

type Props = {
  achievements: Achievement[]
  overview: string
}

export function AchievementsTimeline({ achievements, overview }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const [timelineState, setTimelineState] = useState({
    activeIndex: 0,
    progress: 0,
    translateX: 0,
  })

  const { activeIndex, progress, translateX } = timelineState
  const activeAchievement = achievements[activeIndex] ?? achievements[0]
  const introOpacity = Math.max(0, 1 - progress / 0.12)
  const detailOpacity = Math.max(0, 1 - progress / 0.08)
  const minimalOpacity = Math.min(1, Math.max(0, (progress - 0.035) / 0.12))
  const progressPercent = `${Math.round(progress * 1000) / 10}%`

  const timelineStyle = {
    "--achievements-track-x": `${translateX}px`,
    transform: `translate3d(-${translateX}px, 0, 0)`,
  } as CSSProperties & Record<"--achievements-track-x", string>

  const sectionStyle = {
    height: `${Math.max(achievements.length * 26, 540)}svh`,
  }

  const syncTimeline = useCallback(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const rail = railRef.current
    if (!section || !stage || !rail) {
      return
    }

    const maxScroll = Math.max(section.offsetHeight - window.innerHeight, 1)
    const rawProgress = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / maxScroll))
    const maxTranslate = Math.max(rail.scrollWidth - stage.clientWidth, 0)
    const nextTranslate = rawProgress * maxTranslate
    const nextIndex = Math.min(
      achievements.length - 1,
      Math.max(0, Math.round(rawProgress * (achievements.length - 1))),
    )

    setTimelineState((current) => {
      const translateChanged = Math.abs(current.translateX - nextTranslate) > 0.5
      const progressChanged = Math.abs(current.progress - rawProgress) > 0.002

      if (!translateChanged && !progressChanged && current.activeIndex === nextIndex) {
        return current
      }

      return {
        activeIndex: nextIndex,
        progress: rawProgress,
        translateX: nextTranslate,
      }
    })
  }, [achievements.length])

  useEffect(() => {
    syncTimeline()
    window.addEventListener("scroll", syncTimeline, { passive: true })
    window.addEventListener("resize", syncTimeline)

    return () => {
      window.removeEventListener("scroll", syncTimeline)
      window.removeEventListener("resize", syncTimeline)
    }
  }, [syncTimeline])

  function focusAchievement(index: number) {
    const section = sectionRef.current
    if (!section) {
      return
    }

    const maxScroll = Math.max(section.offsetHeight - window.innerHeight, 1)
    const targetProgress = achievements.length > 1 ? index / (achievements.length - 1) : 0
    window.scrollTo({
      top: window.scrollY + section.getBoundingClientRect().top + targetProgress * maxScroll,
      behavior: "smooth",
    })
  }

  return (
    <section
      ref={sectionRef}
      data-achievements-page
      data-active-year={activeAchievement?.year}
      data-scroll-progress={Math.round(progress * 1000) / 1000}
      className="relative bg-[#0a0c0e] text-white"
      style={sectionStyle}
    >
      <div
        ref={stageRef}
        data-achievements-stage
        className="sticky top-0 min-h-svh overflow-hidden"
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
                "object-cover transition-[opacity,transform,filter] duration-[850ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                index === activeIndex
                  ? "scale-[1.04] opacity-70 [filter:grayscale(0.08)_brightness(0.86)]"
                  : "scale-[1.1] opacity-0 [filter:grayscale(1)_brightness(0.62)]",
              ].join(" ")}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_65%_35%,rgba(255,255,255,0.08)_0%,transparent_58%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#050607_0%,rgba(5,6,7,0.72)_24%,rgba(5,6,7,0.22)_58%,rgba(5,6,7,0.82)_100%)]" />
        <div
          data-achievements-top-vignette
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-[24svh] bg-[linear-gradient(180deg,#000_0%,rgba(10,12,14,0.92)_28%,rgba(10,12,14,0)_100%)]"
        />

        <div className="relative z-10 flex min-h-svh flex-col px-5 pb-28 pt-28 sm:px-8 lg:px-14">
          <div
            data-achievements-intro
            className="max-w-5xl pt-14 transition-[opacity,transform] duration-300 sm:pt-20"
            style={{
              opacity: introOpacity,
              transform: `translate3d(0, ${progress * -42}px, 0)`,
            }}
          >
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

          <div
            data-achievements-minimal-copy
            className="pointer-events-none absolute left-5 top-[30svh] max-w-[36rem] transition-[opacity,transform] duration-500 sm:left-8 lg:left-14"
            style={{
              opacity: minimalOpacity,
              transform: `translate3d(0, ${(1 - minimalOpacity) * 18}px, 0)`,
            }}
          >
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-accent-yellow">
              {activeAchievement?.vehicle} / {activeAchievement?.kind}
            </p>
            <div className="mt-3 flex items-end gap-4">
              <p className="text-7xl font-thin leading-none text-white sm:text-8xl">
                {activeAchievement?.year}
              </p>
              <h2 className="max-w-[18rem] pb-1 text-xl font-light leading-tight text-white sm:text-3xl">
                {activeAchievement?.title}
              </h2>
            </div>
          </div>

          <div className="mt-auto">
            <div
              data-achievements-current-copy
              className="mb-7 max-w-xl transition-opacity duration-300"
              style={{ opacity: detailOpacity }}
            >
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-white/45">
                Now viewing
              </p>
              <p className="mt-3 text-sm leading-6 text-white/62">
                {activeAchievement?.description}
              </p>
            </div>

            <div
              ref={railRef}
              data-achievements-timeline
              className="flex w-max gap-0 will-change-transform"
              style={timelineStyle}
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
                    onFocus={() => focusAchievement(index)}
                    className={[
                      "group relative h-44 w-[78vw] shrink-0 border-y border-r border-white/10 bg-white/[0.025] p-5 text-left backdrop-blur-[2px] first:border-l sm:w-[43vw] lg:w-[26vw]",
                      "transition-[background-color,border-color,opacity,filter] duration-500",
                      isActive
                        ? "border-accent-yellow/55 bg-white/[0.08] opacity-100"
                        : "opacity-45 hover:bg-white/[0.05] hover:opacity-95",
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
                    <h3 className="mt-12 max-w-[15ch] text-2xl font-thin leading-[0.98] tracking-tight text-white sm:text-3xl">
                      {achievement.title}
                    </h3>
                    <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-white/45">
                      {achievement.vehicle}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          <div
            data-achievements-year-rail
            className="absolute inset-x-5 bottom-6 z-20 sm:inset-x-8 lg:inset-x-14"
          >
            <div className="relative h-px bg-white/18">
              <div
                data-achievements-year-progress
                className="absolute inset-y-0 left-0 bg-accent-yellow"
                style={{ width: progressPercent }}
              />
            </div>
            <div className="mt-3 flex justify-between">
              {achievements.map((achievement, index) => {
                const isActive = index === activeIndex
                const showLabel =
                  isActive || index === 0 || index === achievements.length - 1 || index % 3 === 0

                return (
                  <button
                    key={`${achievement.year}-${achievement.title}-rail`}
                    type="button"
                    data-achievement-year-marker
                    data-active={isActive ? "true" : "false"}
                    onClick={() => focusAchievement(index)}
                    className={[
                      "relative -mt-[1.06rem] flex min-w-2 flex-col items-center gap-2 text-center transition-opacity duration-300",
                      isActive ? "opacity-100" : "opacity-42 hover:opacity-90",
                    ].join(" ")}
                    aria-label={`Jump to ${achievement.year}: ${achievement.title}`}
                  >
                    <span
                      className={[
                        "block size-2 rounded-full transition-[background-color,transform] duration-300",
                        isActive ? "scale-150 bg-accent-yellow" : "bg-white/55",
                      ].join(" ")}
                    />
                    <span
                      className={[
                        "hidden font-mono text-[0.56rem] uppercase tracking-[0.2em] sm:block",
                        showLabel ? "text-white/70" : "text-transparent",
                      ].join(" ")}
                    >
                      {achievement.year}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
