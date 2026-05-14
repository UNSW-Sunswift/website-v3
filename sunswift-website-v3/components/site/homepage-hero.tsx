"use client"

import Image from "next/image"
import type { CSSProperties } from "react"
import { useEffect, useRef, useState } from "react"

const SLOGAN = "Tomorrow, Today."
const LINE_BREAK_INDEX = 9
const TYPE_INTERVAL_MS = 95
const TYPE_START_DELAY_MS = 350

export function HomepageHero() {
  const rootRef = useRef<HTMLElement>(null)
  const [typed, setTyped] = useState("")

  useEffect(() => {
    const root = rootRef.current

    if (!root) {
      return
    }

    let frame = 0

    const update = () => {
      frame = 0
      const rect = root.getBoundingClientRect()
      const distance = Math.max(root.offsetHeight - window.innerHeight, 1)
      const progress = Math.min(Math.max(-rect.top / distance, 0), 1)

      root.style.setProperty("--hero-progress", progress.toFixed(4))
      root.style.setProperty("--hero-scale", (1 + progress * 0.075).toFixed(4))
      root.style.setProperty("--hero-x", `${(15.5 - progress * 2).toFixed(4)}vw`)
      root.style.setProperty("--hero-title-y", `${(progress * -5.5).toFixed(4)}rem`)
      root.style.setProperty("--hero-opacity", (1 - progress * 0.16).toFixed(4))
    }

    const requestUpdate = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", requestUpdate)

    return () => {
      if (frame !== 0) {
        window.cancelAnimationFrame(frame)
      }

      window.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", requestUpdate)
    }
  }, [])

  useEffect(() => {
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
  }, [])

  const firstLine = typed.slice(0, LINE_BREAK_INDEX)
  const secondLine = typed.length > LINE_BREAK_INDEX ? typed.slice(LINE_BREAK_INDEX + 1) : ""
  const isComplete = typed.length >= SLOGAN.length

  return (
    <section
      ref={rootRef}
      data-homepage-hero
      className="relative h-[180svh] overflow-clip bg-[#272c30] text-white"
      style={
        {
          "--hero-progress": 0,
          "--hero-scale": 1,
          "--hero-x": "15.5vw",
          "--hero-title-y": "0rem",
          "--hero-opacity": 1,
        } as CSSProperties
      }
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <Image
          src="/placeholders/hero-track.svg"
          alt="Sunswift solar race car"
          fill
          priority
          className="homepage-hero-image object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_54%_42%,transparent_0%,rgba(20,24,27,0.08)_31%,rgba(20,24,27,0.58)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,24,27,0.58)_0%,rgba(20,24,27,0.16)_42%,rgba(20,24,27,0.34)_100%)]" />
        <h1
          data-full-text={SLOGAN}
          data-typing-complete={isComplete ? "true" : "false"}
          className="homepage-hero-title absolute left-[9vw] top-[41svh] max-w-[12ch] text-[clamp(3.05rem,5.45vw,5.95rem)] font-light leading-[0.98] tracking-normal text-white"
        >
          <span className="sr-only">{SLOGAN}</span>
          <span aria-hidden="true">
            {firstLine}
            {typed.length > LINE_BREAK_INDEX && <br />}
            {secondLine}
            <span
              className="homepage-hero-caret ml-[0.08em] inline-block w-[0.06em] translate-y-[0.05em] self-end bg-white align-baseline"
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
