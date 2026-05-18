"use client"

import Image from "next/image"
import type { CSSProperties } from "react"
import { useEffect, useRef, useState } from "react"

import { SunswiftBrandLogo } from "@/components/site/brand-logo"
import { resolveSiteImage, type SiteImageMap } from "@/lib/cms/site-images"

const SLOGAN = "Tomorrow, Today."
const LINE_BREAK_INDEX = 9
const BOOT_DURATION_MS = 1850
const BOOT_TO_INTRO_GAP_MS = 160
const INTRO_DELAY_MS = BOOT_DURATION_MS + BOOT_TO_INTRO_GAP_MS
const INTRO_DURATION_MS = 1350
const TYPE_INTERVAL_MS = 95
const TYPE_START_DELAY_MS = 350

const bootLines = [
  { x: "8.333%", height: "52svh", delay: "40ms", depth: 0.58 },
  { x: "16.666%", height: "66svh", delay: "105ms", depth: 0.72 },
  { x: "25%", height: "78svh", delay: "170ms", depth: 0.86 },
  { x: "33.333%", height: "88svh", delay: "235ms", depth: 0.96 },
  { x: "41.666%", height: "94svh", delay: "300ms", depth: 1 },
  { x: "50%", height: "96svh", delay: "365ms", depth: 1 },
  { x: "58.333%", height: "94svh", delay: "430ms", depth: 1 },
  { x: "66.666%", height: "88svh", delay: "495ms", depth: 0.96 },
  { x: "75%", height: "78svh", delay: "560ms", depth: 0.86 },
  { x: "83.333%", height: "66svh", delay: "625ms", depth: 0.72 },
  { x: "91.666%", height: "52svh", delay: "690ms", depth: 0.58 },
]

export function HomepageHero({ imageOverrides }: { imageOverrides?: SiteImageMap }) {
  const typingStartedRef = useRef(false)
  const [bootComplete, setBootComplete] = useState(false)
  const [introStarted, setIntroStarted] = useState(false)
  const [typed, setTyped] = useState("")
  const [revealComplete, setRevealComplete] = useState(false)

  useEffect(() => {
    const bootDone = window.setTimeout(() => {
      setBootComplete(true)
    }, BOOT_DURATION_MS)
    const revealStart = window.setTimeout(() => {
      setIntroStarted(true)
    }, INTRO_DELAY_MS)
    const revealDone = window.setTimeout(() => {
      setRevealComplete(true)
    }, INTRO_DELAY_MS + INTRO_DURATION_MS)

    return () => {
      window.clearTimeout(bootDone)
      window.clearTimeout(revealStart)
      window.clearTimeout(revealDone)
    }
  }, [])

  useEffect(() => {
    if (!revealComplete || typingStartedRef.current) {
      return
    }

    typingStartedRef.current = true
    let index = 0
    let intervalId: ReturnType<typeof setInterval> | undefined

    const start = window.setTimeout(() => {
      intervalId = setInterval(() => {
        index += 1
        setTyped(SLOGAN.slice(0, index))
        if (index >= SLOGAN.length && intervalId) {
          clearInterval(intervalId)
        }
      }, TYPE_INTERVAL_MS)
    }, TYPE_START_DELAY_MS)

    return () => {
      window.clearTimeout(start)
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [revealComplete])

  const firstLine = typed.slice(0, LINE_BREAK_INDEX)
  const secondLine =
    typed.length > LINE_BREAK_INDEX ? typed.slice(LINE_BREAK_INDEX + 1) : ""
  const isComplete = typed.length >= SLOGAN.length

  return (
    <section
      data-homepage-hero
      data-hero-boot-complete={bootComplete ? "true" : "false"}
      data-hero-intro-started={introStarted ? "true" : "false"}
      data-hero-reveal-complete={revealComplete ? "true" : "false"}
      className="relative h-svh overflow-clip bg-black text-black"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <div
          data-homepage-hero-boot
          aria-hidden="true"
          className="homepage-hero-boot pointer-events-none absolute inset-0 z-30 overflow-hidden bg-black"
        >
          <div className="homepage-hero-boot-noise absolute inset-0" />
          <div className="homepage-hero-boot-sphere absolute inset-0" />
          <div className="homepage-hero-boot-lines absolute inset-0">
            {bootLines.map((line, index) => (
              <span
                key={`${line.x}-${index}`}
                className="homepage-hero-boot-line"
                style={
                  {
                    "--boot-line-x": line.x,
                    "--boot-line-height": line.height,
                    "--boot-line-delay": line.delay,
                    "--boot-line-depth": line.depth,
                  } as CSSProperties
                }
              />
            ))}
          </div>
          <div className="homepage-hero-boot-logo absolute left-1/2 top-1/2">
            <SunswiftBrandLogo
              priority
              className="w-44 drop-shadow-[0_0_26px_rgba(245,208,0,0.26)] sm:w-56"
            />
          </div>
        </div>
        <Image
          src={resolveSiteImage("/media/sr8-hero-render.png", imageOverrides)}
          alt="Sunswift 8 concept render"
          fill
          priority
          className="homepage-hero-image object-cover object-[50%_52%]"
          sizes="100vw"
        />
        <div
          data-homepage-hero-wipe
          aria-hidden="true"
          className="homepage-hero-wipe pointer-events-none absolute inset-0 bg-black"
        />
        <h1
          data-full-text={SLOGAN}
          data-typing-complete={isComplete ? "true" : "false"}
          className="homepage-hero-title absolute top-[41svh] left-[9vw] max-w-[12ch] text-[clamp(3.05rem,5.45vw,5.95rem)] leading-[0.98] font-light tracking-normal text-black"
        >
          <span className="sr-only">{SLOGAN}</span>
          <span aria-hidden="true">
            {firstLine}
            {typed.length > LINE_BREAK_INDEX && <br />}
            {secondLine}
            <span
              className="homepage-hero-caret ml-[0.08em] inline-block w-[0.06em] translate-y-[0.05em] self-end bg-black align-baseline"
              data-complete={isComplete ? "true" : "false"}
            >
              &nbsp;
            </span>
          </span>
        </h1>
      </div>
    </section>
  )
}
