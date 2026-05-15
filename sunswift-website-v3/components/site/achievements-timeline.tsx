"use client"

import Image from "next/image"
import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react"

import type { Achievement } from "@/lib/cms/static-data"

type Props = {
  achievements: Achievement[]
  overview: string
}

export function AchievementsTimeline({ achievements, overview }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const [timelineState, setTimelineState] = useState({
    activeIndex: 0,
    progress: 0,
    translateX: 0,
  })

  const { activeIndex, progress, translateX } = timelineState
  const activeAchievement = achievements[activeIndex] ?? achievements[0]
  const detailOpacity = Math.max(0, 1 - progress / 0.08)
  const minimalOpacity = Math.min(1, Math.max(0, (progress - 0.035) / 0.12))
  const progressPercent = `${Math.round(progress * 1000) / 10}%`

  const timelineStyle = {
    "--achievements-track-x": `${translateX}px`,
    transform: `translate3d(-${translateX}px, 0, 0)`,
  } as CSSProperties & Record<"--achievements-track-x", string>

  const sectionStyle = {
    height: `${Math.max(achievements.length * 20, 430)}svh`,
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
      data-achievements-page
      data-active-year={activeAchievement?.year}
      data-scroll-progress={Math.round(progress * 1000) / 1000}
      className="bg-[#0a0c0e] text-white"
    >
      <div data-achievements-intro-section className="relative min-h-svh overflow-hidden">
        <Image
          src={achievements[0]?.image ?? "/placeholders/vehicle-sunswift-7.svg"}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35 [filter:grayscale(0.3)_brightness(0.7)]"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_68%_36%,rgba(255,255,255,0.08)_0%,transparent_58%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#050607_0%,rgba(5,6,7,0.84)_34%,rgba(5,6,7,0.54)_66%,rgba(5,6,7,0.88)_100%)]" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-[24svh] bg-[linear-gradient(180deg,#000_0%,rgba(10,12,14,0.92)_28%,rgba(10,12,14,0)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-[26svh] bg-[linear-gradient(0deg,#0a0c0e_0%,rgba(10,12,14,0)_100%)]" />
        </div>

        <div className="relative z-10 flex min-h-svh items-end px-5 pb-[12svh] pt-28 sm:px-8 lg:px-14">
          <div
            data-achievements-intro
            className="max-w-5xl"
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
        </div>
      </div>

      <div ref={sectionRef} data-achievements-scroll-section style={sectionStyle}>
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

          <div
            data-achievements-minimal-copy
            className="pointer-events-none absolute left-5 top-[22svh] z-10 max-w-[36rem] transition-[opacity,transform] duration-500 sm:left-8 sm:top-[26svh] lg:left-14"
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

          <div className="relative z-10 flex min-h-svh flex-col justify-end px-5 pb-[clamp(4.25rem,8svh,6.25rem)] pt-28 sm:px-8 lg:px-14">
            <div
              data-achievements-current-copy
              className="mb-[clamp(0.75rem,2svh,1.5rem)] max-w-xl transition-opacity duration-300"
              style={{ opacity: detailOpacity }}
            >
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-white/45">
                Now viewing
              </p>
              <p className="mt-3 text-sm leading-6 text-white/62">
                {activeAchievement?.description}
              </p>
            </div>

            <div data-achievements-timeline-viewport className="-mx-5 overflow-hidden sm:-mx-8 lg:-mx-14">
              <div
                ref={railRef}
                data-achievements-timeline
                className="flex w-max gap-0 px-5 will-change-transform sm:px-8 lg:px-14"
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
                        "group relative h-[clamp(5.75rem,14svh,8.25rem)] w-[58vw] shrink-0 border-y border-r border-white/10 bg-white/[0.025] p-[clamp(0.75rem,1.7svh,1rem)] text-left backdrop-blur-[2px] first:border-l sm:w-[31vw] lg:w-[17vw] xl:w-[14vw]",
                        "transition-[background-color,border-color,opacity,filter] duration-500",
                        isActive
                          ? "border-accent-yellow/55 bg-white/[0.08] opacity-100"
                          : "opacity-45 hover:bg-white/[0.05] hover:opacity-95",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-mono text-[0.54rem] uppercase tracking-[0.24em] text-white/42">
                          {achievement.kind}
                        </span>
                        <span
                          className={[
                            "font-mono text-[0.66rem] transition-colors duration-500",
                            isActive ? "text-accent-yellow" : "text-white/50 group-hover:text-accent-yellow",
                          ].join(" ")}
                        >
                          {achievement.year}
                        </span>
                      </div>
                      <h3 className="mt-[clamp(1rem,3.2svh,2rem)] max-w-[16ch] text-base font-thin leading-[1.02] tracking-tight text-white sm:text-lg lg:text-xl">
                        {achievement.title}
                      </h3>
                      <p className="mt-2 font-mono text-[0.54rem] uppercase tracking-[0.22em] text-white/45">
                        {achievement.vehicle}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            <div data-achievements-year-rail className="mt-[clamp(0.75rem,2svh,1rem)]">
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
                    isActive || index === 0 || index === achievements.length - 1 || index % 4 === 0

                  return (
                    <button
                      key={`${achievement.year}-${achievement.title}-rail`}
                      type="button"
                      data-achievement-year-marker
                      data-active={isActive ? "true" : "false"}
                      onClick={() => focusAchievement(index)}
                      className={[
                        "relative -mt-[1.06rem] flex min-w-1.5 flex-col items-center gap-2 text-center transition-opacity duration-300",
                        isActive ? "opacity-100" : "opacity-42 hover:opacity-90",
                      ].join(" ")}
                      aria-label={`Jump to ${achievement.year}: ${achievement.title}`}
                    >
                      <span
                        className={[
                          "block size-1.5 rounded-full transition-[background-color,transform] duration-300 sm:size-2",
                          isActive ? "scale-150 bg-accent-yellow" : "bg-white/55",
                        ].join(" ")}
                      />
                      <span
                        className={[
                          "hidden font-mono text-[0.52rem] uppercase tracking-[0.18em] md:block",
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
      </div>
    </section>
  )
}
