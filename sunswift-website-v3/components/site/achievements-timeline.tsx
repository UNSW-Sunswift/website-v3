"use client"

import Image from "next/image"
import { RotateCw } from "lucide-react"
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"

import type { Achievement } from "@/lib/cms/static-data"

type Props = {
  achievements: Achievement[]
  overview: string
}

const MOBILE_TIMELINE_QUERY = "(max-width: 767px)"

function subscribeMobileTimeline(callback: () => void) {
  const query = window.matchMedia(MOBILE_TIMELINE_QUERY)
  query.addEventListener("change", callback)

  return () => query.removeEventListener("change", callback)
}

function getMobileTimelineSnapshot() {
  return window.matchMedia(MOBILE_TIMELINE_QUERY).matches
}

function getServerMobileTimelineSnapshot() {
  return false
}

export function AchievementsTimeline({ achievements, overview }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const mobileCardRefs = useRef<Array<HTMLElement | null>>([])
  const isMobileTimeline = useSyncExternalStore(
    subscribeMobileTimeline,
    getMobileTimelineSnapshot,
    getServerMobileTimelineSnapshot
  )
  const [timelineState, setTimelineState] = useState({
    activeIndex: 0,
    progress: 0,
    translateX: 0,
  })
  const [introExit, setIntroExit] = useState(0)
  const [timelineRevealed, setTimelineRevealed] = useState(false)
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([])

  const { activeIndex, progress, translateX } = timelineState
  const activeAchievement = achievements[activeIndex] ?? achievements[0]
  const activeHasVideo = Boolean(activeAchievement?.videoMp4?.trim())
  // Both the top-left minimal copy (kicker + year + title) and the bottom description block stay
  // visible across the entire timeline so the first milestone (2023) reads the same way as every
  // subsequent one. We still expose the values to the browser verifier in case a future change
  // wants to reintroduce a transition.
  const detailOpacity = 1
  const minimalOpacity = 1
  const progressPercent = `${Math.round(progress * 1000) / 10}%`

  // Intro→timeline transition driven by introExit (0 = top, 1 = fully scrolled away).
  // Keep this short and image-led so scrolling does not pause on an empty black pane.
  const easeOutCubic = (t: number) =>
    1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3)
  const easeInCubic = (t: number) => Math.pow(Math.max(0, Math.min(1, t)), 3)

  const phaseScatter = Math.max(0, Math.min(1, (introExit - 0.18) / 0.42))
  const phaseImageExit = Math.max(0, Math.min(1, (introExit - 0.74) / 0.26))

  const bgZoom = 1 + easeOutCubic(introExit) * 0.45
  const bgRotate = introExit * -2.2
  const bgBrightness = 1 - easeOutCubic(phaseImageExit) * 0.34
  const bgOpacity = Math.max(
    0.16,
    0.35 +
      easeOutCubic(phaseScatter) * 0.16 -
      easeInCubic(phaseImageExit) * 0.35
  )

  const kickerOpacity = Math.max(0, 1 - phaseScatter * 1.6)
  const headlineWordOpacity = (i: number, total: number) => {
    const start = 0.05 + (i / total) * 0.6
    const local = (phaseScatter - start) / 0.35
    return Math.max(0, 1 - local)
  }
  const headlineWordY = (i: number, total: number) => {
    const start = 0.05 + (i / total) * 0.6
    const local = Math.max(0, (phaseScatter - start) / 0.35)
    return -easeInCubic(local) * 220
  }
  const headlineWordBlur = (i: number, total: number) => {
    const start = 0.05 + (i / total) * 0.6
    const local = Math.max(0, (phaseScatter - start) / 0.35)
    return easeInCubic(local) * 22
  }

  const overviewOpacity = Math.max(0, 1 - phaseScatter * 2.4)
  const overviewY = -easeInCubic(phaseScatter) * 80

  const scrollHintOpacity = Math.max(0, 1 - introExit * 5)
  const scrollHintY = introExit * -18

  const headlineWords = "A timeline of solar racing milestones.".split(" ")

  const timelineStyle = {
    "--achievements-track-x": `${translateX}px`,
    transform: `translate3d(-${translateX}px, 0, 0)`,
  } as CSSProperties & Record<"--achievements-track-x", string>

  const sectionStyle = isMobileTimeline
    ? undefined
    : {
        height: `${Math.max(achievements.length * 20, 430)}svh`,
      }

  const syncTimeline = useCallback(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const rail = railRef.current
    const intro = introRef.current
    if (!section) {
      return
    }

    // Track intro section exit progress across the pinned scroll range.
    // 0 = pinned at top, 1 = fully scrolled away (timeline section about to take over).
    if (intro) {
      const rect = intro.getBoundingClientRect()
      const scrollableHeight = Math.max(
        intro.offsetHeight - window.innerHeight,
        1
      )
      const rawIntroExit = Math.min(
        1,
        Math.max(0, -rect.top / scrollableHeight)
      )
      setIntroExit(rawIntroExit)
    }

    if (isMobileTimeline) {
      const mobileCards = mobileCardRefs.current.filter(
        (card): card is HTMLElement => Boolean(card)
      )
      const targetY = window.innerHeight * 0.38
      let nextIndex = 0
      let bestDistance = Number.POSITIVE_INFINITY

      mobileCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect()
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          return
        }

        const cardFocusY = rect.top + rect.height * 0.34
        const distance = Math.abs(cardFocusY - targetY)
        if (distance < bestDistance) {
          bestDistance = distance
          nextIndex = index
        }
      })

      if (mobileCards.length > 0 && bestDistance === Number.POSITIVE_INFINITY) {
        const sectionRect = section.getBoundingClientRect()
        nextIndex = sectionRect.top > 0 ? 0 : achievements.length - 1
      }

      const nextProgress =
        achievements.length > 1 ? nextIndex / (achievements.length - 1) : 0

      if (section.getBoundingClientRect().top < window.innerHeight * 0.9) {
        setTimelineRevealed(true)
      }

      setTimelineState((current) => {
        if (
          current.activeIndex === nextIndex &&
          Math.abs(current.progress - nextProgress) <= 0.002 &&
          current.translateX === 0
        ) {
          return current
        }

        return {
          activeIndex: nextIndex,
          progress: nextProgress,
          translateX: 0,
        }
      })
      return
    }

    if (!stage || !rail) {
      return
    }

    const maxScroll = Math.max(section.offsetHeight - window.innerHeight, 1)
    const rawProgress = Math.min(
      1,
      Math.max(0, -section.getBoundingClientRect().top / maxScroll)
    )
    const timelineStart = 0.1
    const timelineProgress = Math.min(
      1,
      Math.max(0, (rawProgress - timelineStart) / (1 - timelineStart))
    )
    const maxTranslate = Math.max(rail.scrollWidth - stage.clientWidth, 0)
    const nextTranslate = timelineProgress * maxTranslate
    const nextIndex = Math.min(
      achievements.length - 1,
      Math.max(0, Math.round(timelineProgress * (achievements.length - 1)))
    )

    // Mark timeline as revealed once scrolled into it
    if (rawProgress > 0) {
      setTimelineRevealed(true)
    }

    setTimelineState((current) => {
      const translateChanged =
        Math.abs(current.translateX - nextTranslate) > 0.5
      const progressChanged = Math.abs(current.progress - rawProgress) > 0.002

      if (
        !translateChanged &&
        !progressChanged &&
        current.activeIndex === nextIndex
      ) {
        return current
      }

      return {
        activeIndex: nextIndex,
        progress: timelineProgress,
        translateX: nextTranslate,
      }
    })
  }, [achievements.length, isMobileTimeline])

  useEffect(() => {
    syncTimeline()
    window.addEventListener("scroll", syncTimeline, { passive: true })
    window.addEventListener("resize", syncTimeline)

    return () => {
      window.removeEventListener("scroll", syncTimeline)
      window.removeEventListener("resize", syncTimeline)
    }
  }, [syncTimeline])

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    achievements.forEach((achievement, index) => {
      const el = videoRefs.current[index]
      if (!el || !achievement.videoMp4?.trim()) {
        return
      }
      if (reduced) {
        el.pause()
        return
      }
      if (index === activeIndex) {
        void el.play().catch(() => {
          /* autoplay blocked — user can reload */
        })
      } else {
        el.pause()
      }
    })
  }, [activeIndex, achievements])

  const reloadActiveVideo = useCallback(() => {
    const el = videoRefs.current[activeIndex]
    const a = achievements[activeIndex]
    if (!el || !a?.videoMp4?.trim()) {
      return
    }
    el.pause()
    el.currentTime = 0
    void el.play().catch(() => {})
  }, [activeIndex, achievements])

  function focusAchievement(index: number) {
    const section = sectionRef.current
    if (!section) {
      return
    }

    const maxScroll = Math.max(section.offsetHeight - window.innerHeight, 1)
    const targetProgress =
      achievements.length > 1 ? index / (achievements.length - 1) : 0
    const targetScrollProgress = 0.1 + targetProgress * 0.9
    window.scrollTo({
      top:
        window.scrollY +
        section.getBoundingClientRect().top +
        targetScrollProgress * maxScroll,
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
      <div
        ref={introRef}
        data-achievements-intro-section
        data-intro-exit={Math.round(introExit * 1000) / 1000}
        className="relative"
        style={{ height: isMobileTimeline ? "125svh" : "165svh" }}
      >
        <div className="sticky top-0 h-svh w-full overflow-hidden">
          {/* Background image: zooms in dramatically and darkens through the transition */}
          <div
            className="pointer-events-none absolute inset-0 will-change-transform"
            style={{
              transform: `scale(${bgZoom}) rotate(${bgRotate}deg)`,
              transformOrigin: "55% 45%",
              filter: `brightness(${bgBrightness})`,
              opacity: bgOpacity,
            }}
          >
            <Image
              src={
                achievements[0]?.image ??
                "/vehicle-fleet/vehicle-sunswift-7.jpeg"
              }
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover [filter:grayscale(0.3)]"
            />
          </div>

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_68%_36%,rgba(255,255,255,0.08)_0%,transparent_58%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#050607_0%,rgba(5,6,7,0.84)_34%,rgba(5,6,7,0.54)_66%,rgba(5,6,7,0.88)_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[24svh] bg-[linear-gradient(180deg,#000_0%,rgba(10,12,14,0.92)_28%,rgba(10,12,14,0)_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[26svh] bg-[linear-gradient(0deg,#0a0c0e_0%,rgba(10,12,14,0)_100%)]" />

          {/* Hero copy: kicker, headline (word-by-word scatter), overview */}
          <div className="relative z-10 flex h-full items-end px-5 pt-28 pb-[12svh] sm:px-8 lg:px-14">
            <div data-achievements-intro className="max-w-5xl">
              <p
                className="font-mono text-[0.62rem] tracking-[0.34em] text-accent-yellow uppercase will-change-[opacity]"
                style={{ opacity: kickerOpacity }}
              >
                Achievements
              </p>
              <h1
                aria-label="A timeline of solar racing milestones."
                className="mt-4 max-w-4xl text-5xl leading-[0.94] font-thin tracking-tight text-white sm:text-7xl lg:text-[6.5rem]"
              >
                {headlineWords.map((word, i) => (
                  <span
                    key={`${word}-${i}`}
                    aria-hidden="true"
                    className="inline-block whitespace-pre will-change-[opacity,transform,filter]"
                    style={{
                      opacity: headlineWordOpacity(i, headlineWords.length),
                      transform: `translate3d(0, ${headlineWordY(i, headlineWords.length)}px, 0)`,
                      filter: `blur(${headlineWordBlur(i, headlineWords.length)}px)`,
                    }}
                  >
                    {i < headlineWords.length - 1 ? `${word} ` : word}
                  </span>
                ))}
              </h1>
              <p
                className="mt-6 max-w-2xl text-sm leading-7 text-white/62 will-change-[opacity,transform] sm:text-base"
                style={{
                  opacity: overviewOpacity,
                  transform: `translate3d(0, ${overviewY}px, 0)`,
                }}
              >
                {overview}
              </p>
            </div>
          </div>

          {/* Scroll invitation: kicker + animated chevron, fades out almost immediately */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-10 z-20 flex justify-center will-change-[opacity,transform]"
            style={{
              opacity: scrollHintOpacity,
              transform: `translate3d(0, ${scrollHintY}px, 0)`,
            }}
          >
            <span className="flex flex-col items-center gap-2">
              <span className="font-mono text-[0.52rem] tracking-[0.32em] text-white/38 uppercase">
                Scroll to enter the timeline
              </span>
              <svg
                width="14"
                height="22"
                viewBox="0 0 14 22"
                fill="none"
                aria-hidden="true"
                className="achievements-scroll-chevron text-accent-yellow/60"
              >
                <path
                  d="M7 1v16M1 12l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div
        ref={sectionRef}
        data-achievements-scroll-section
        style={sectionStyle}
      >
        <div
          data-achievements-mobile-timeline
          className="relative z-10 px-4 pt-6 pb-20 md:hidden"
        >
          <div className="mx-auto max-w-xl">
            <div className="mb-8 border-l border-accent-yellow/45 pl-4">
              <p className="font-mono text-[0.58rem] tracking-[0.28em] text-accent-yellow uppercase">
                Timeline
              </p>
              <h2 className="mt-3 text-3xl leading-tight font-light text-white">
                Scroll the milestones.
              </h2>
            </div>

            <div className="space-y-5">
              {achievements.map((achievement, index) => {
                const isActive = index === activeIndex
                const hasVideo = Boolean(achievement.videoMp4?.trim())

                return (
                  <article
                    key={`${achievement.year}-${achievement.title}-mobile`}
                    ref={(node) => {
                      mobileCardRefs.current[index] = node
                    }}
                    data-mobile-achievement-card
                    data-achievement-year={achievement.year}
                    data-active={isActive ? "true" : "false"}
                    className={[
                      "relative overflow-hidden rounded-sm border bg-white/[0.035] transition-[border-color,background-color,opacity] duration-500",
                      isActive
                        ? "border-accent-yellow/55 bg-white/[0.075]"
                        : "border-white/10 opacity-82",
                    ].join(" ")}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                      {hasVideo ? (
                        <video
                          src={achievement.videoMp4}
                          poster={achievement.image}
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          aria-hidden="true"
                          className="h-full w-full object-cover opacity-82"
                        />
                      ) : (
                        <Image
                          src={achievement.image}
                          alt=""
                          fill
                          sizes="100vw"
                          className="object-cover opacity-82"
                        />
                      )}
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(5,6,7,0.78)_100%)]" />
                      <div className="absolute bottom-3 left-3 flex items-center gap-2 font-mono text-[0.58rem] tracking-[0.22em] text-accent-yellow uppercase">
                        <span>{achievement.vehicle}</span>
                        <span className="text-white/35">/</span>
                        <span>{achievement.kind}</span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <span className="font-mono text-4xl leading-none font-thin text-white">
                          {achievement.year}
                        </span>
                        <span
                          aria-hidden="true"
                          className={[
                            "mt-2 size-2 rounded-full transition-colors duration-300",
                            isActive ? "bg-accent-yellow" : "bg-white/30",
                          ].join(" ")}
                        />
                      </div>
                      <h3 className="mt-4 text-2xl leading-tight font-light text-white">
                        {achievement.title}
                      </h3>
                      <p className="mt-4 text-sm leading-6 text-white/62">
                        {achievement.description}
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>

        <div
          ref={stageRef}
          data-achievements-stage
          className={[
            "sticky top-0 hidden min-h-svh overflow-hidden md:block",
            timelineRevealed
              ? "achievements-stage-revealed"
              : "achievements-stage-entering",
          ].join(" ")}
        >
          <div className="pointer-events-none absolute inset-0">
            {achievements.map((achievement, index) => {
              const isVideo = Boolean(achievement.videoMp4?.trim())
              const mediaClass = [
                "absolute inset-0 h-full w-full object-cover transition-[opacity,filter] duration-[650ms] ease-out",
                index === activeIndex
                  ? "opacity-70 [filter:grayscale(0.08)_brightness(0.86)]"
                  : "opacity-0 [filter:grayscale(1)_brightness(0.62)]",
              ].join(" ")

              if (isVideo) {
                return (
                  <video
                    key={`${achievement.year}-${achievement.title}-video`}
                    ref={(node) => {
                      videoRefs.current[index] = node
                    }}
                    src={achievement.videoMp4}
                    poster={achievement.image}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                    className={mediaClass}
                  />
                )
              }

              return (
                <Image
                  key={`${achievement.year}-${achievement.title}`}
                  src={achievement.image}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className={mediaClass}
                />
              )
            })}
          </div>

          {activeHasVideo ? (
            <div className="pointer-events-auto absolute top-[clamp(12rem,30svh,18rem)] right-5 z-[18] sm:right-8 lg:right-14">
              <button
                type="button"
                data-achievements-video-reload
                onClick={() => reloadActiveVideo()}
                className="grid size-11 place-items-center rounded-full border border-white/25 bg-black/35 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md transition-[background-color,color,border-color] duration-300 hover:border-accent-yellow hover:bg-accent-yellow hover:text-black"
                aria-label="Restart background video"
                title="Restart video"
              >
                <RotateCw className="size-[1.125rem]" strokeWidth={1.75} />
              </button>
            </div>
          ) : null}

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_65%_35%,rgba(255,255,255,0.08)_0%,transparent_58%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#050607_0%,rgba(5,6,7,0.72)_24%,rgba(5,6,7,0.22)_58%,rgba(5,6,7,0.82)_100%)]" />
          <div
            data-achievements-top-vignette
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-[24svh] bg-[linear-gradient(180deg,#000_0%,rgba(10,12,14,0.92)_28%,rgba(10,12,14,0)_100%)]"
          />

          <div
            data-achievements-minimal-copy
            className="pointer-events-none absolute top-[22svh] left-5 z-10 max-w-[36rem] transition-[opacity,transform] duration-500 sm:top-[26svh] sm:left-8 lg:left-14"
            style={{
              opacity: minimalOpacity,
              transform: `translate3d(0, ${(1 - minimalOpacity) * 18}px, 0)`,
            }}
          >
            <p className="font-mono text-[0.62rem] tracking-[0.3em] text-accent-yellow uppercase">
              {activeAchievement?.vehicle} / {activeAchievement?.kind}
            </p>
            <div className="mt-3 flex items-end gap-4">
              <p className="text-7xl leading-none font-thin text-white sm:text-8xl">
                {activeAchievement?.year}
              </p>
              <h2 className="max-w-[18rem] pb-1 text-xl leading-tight font-light text-white sm:text-3xl">
                {activeAchievement?.title}
              </h2>
            </div>
          </div>

          <div className="relative z-10 flex min-h-svh flex-col justify-end px-5 pt-28 pb-[clamp(4.25rem,8svh,6.25rem)] sm:px-8 lg:px-14">
            <div
              data-achievements-current-copy
              className="mb-[clamp(0.75rem,2svh,1.5rem)] max-w-xl transition-opacity duration-300"
              style={{ opacity: detailOpacity }}
            >
              <p className="font-mono text-[0.62rem] tracking-[0.3em] text-white/45 uppercase">
                Now viewing
              </p>
              <p className="mt-3 text-sm leading-6 text-white/62">
                {activeAchievement?.description}
              </p>
            </div>

            <div
              data-achievements-timeline-viewport
              className="-mx-5 overflow-hidden sm:-mx-8 lg:-mx-14"
            >
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
                        "group relative flex h-[clamp(7.5rem,18svh,10.5rem)] w-[58vw] shrink-0 flex-col border-y border-r border-white/10 bg-white/[0.025] p-[clamp(0.75rem,1.7svh,1rem)] text-left backdrop-blur-[2px] first:border-l sm:w-[31vw] lg:w-[17vw] xl:w-[14vw]",
                        "transition-[background-color,border-color,opacity,filter] duration-500",
                        isActive
                          ? "border-accent-yellow/55 bg-white/[0.08] opacity-100"
                          : "opacity-45 hover:bg-white/[0.05] hover:opacity-95",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[0.52rem] tracking-[0.24em] text-white/42 uppercase">
                          {achievement.kind}
                        </span>
                        <span
                          className={[
                            "font-mono text-[0.62rem] transition-colors duration-500",
                            isActive
                              ? "text-accent-yellow"
                              : "text-white/50 group-hover:text-accent-yellow",
                          ].join(" ")}
                        >
                          {achievement.year}
                        </span>
                      </div>
                      <h3
                        className="mt-1.5 line-clamp-2 max-w-[18ch] text-[0.95rem] leading-[1.08] font-thin tracking-tight text-white sm:text-base lg:text-[1.05rem]"
                        title={achievement.title}
                      >
                        {achievement.title}
                      </h3>
                      <p
                        data-achievement-vehicle
                        className={[
                          "mt-auto pt-2 font-mono text-[0.62rem] tracking-[0.22em] uppercase transition-colors duration-500",
                          isActive
                            ? "text-accent-yellow"
                            : "text-accent-yellow/65 group-hover:text-accent-yellow",
                        ].join(" ")}
                      >
                        {achievement.vehicle}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            <div
              data-achievements-year-rail
              className="mt-[clamp(0.75rem,2svh,1rem)]"
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
                    isActive ||
                    index === 0 ||
                    index === achievements.length - 1 ||
                    index % 4 === 0

                  return (
                    <button
                      key={`${achievement.year}-${achievement.title}-rail`}
                      type="button"
                      data-achievement-year-marker
                      data-active={isActive ? "true" : "false"}
                      onClick={() => focusAchievement(index)}
                      className={[
                        "group relative -mt-[1.06rem] flex min-w-1.5 flex-col items-center gap-2 text-center transition-opacity duration-300",
                        isActive
                          ? "opacity-100"
                          : "opacity-70 hover:opacity-100 focus-visible:opacity-100",
                      ].join(" ")}
                      aria-label={`Jump to ${achievement.year}: ${achievement.title}`}
                    >
                      <span
                        className={[
                          "block size-1.5 rounded-full transition-[background-color,transform] duration-300 sm:size-2",
                          isActive
                            ? "scale-150 bg-accent-yellow"
                            : "bg-white/65 group-hover:scale-150 group-hover:bg-accent-yellow group-focus-visible:scale-150 group-focus-visible:bg-accent-yellow",
                        ].join(" ")}
                      />
                      {/* Inline label always rendered for the indexed positions; transparent placeholder otherwise so layout doesn't shift. */}
                      <span
                        className={[
                          "hidden font-mono text-[0.55rem] tracking-[0.18em] uppercase transition-colors duration-200 md:block",
                          showLabel
                            ? isActive
                              ? "text-accent-yellow"
                              : "text-white/80"
                            : "text-transparent",
                        ].join(" ")}
                      >
                        {achievement.year}
                      </span>
                      {/* Hover/focus tooltip — pops above the rail so any year is readable even when no inline label is shown. */}
                      <span
                        aria-hidden="true"
                        className={[
                          "pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 -translate-y-1 rounded-sm border border-accent-yellow/40 bg-[#0a0c0e]/95 px-2 py-1 font-mono text-[0.6rem] tracking-[0.18em] whitespace-nowrap text-accent-yellow uppercase opacity-0 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-sm transition-[opacity,transform] duration-200",
                          "group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100",
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
