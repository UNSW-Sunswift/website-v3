"use client"

import Image from "next/image"
import type { CSSProperties } from "react"
import { useEffect, useRef, useState } from "react"

const SLOGAN = "Today, Tomorrow"
const LINE_BREAK_INDEX = 6
const TYPE_INTERVAL_MS = 95
const TYPE_START_DELAY_MS = 350

export function HomepageHero() {
  const rootRef = useRef<HTMLElement>(null)
  const typingStartedRef = useRef(false)
  const [typed, setTyped] = useState("")
  const [revealComplete, setRevealComplete] = useState(false)

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
      const revealProgress = Math.min(progress / 0.64, 1)
      const titleProgress = Math.min(Math.max((progress - 0.58) / 0.2, 0), 1)

      root.style.setProperty("--hero-progress", progress.toFixed(4))
      root.style.setProperty(
        "--hero-scale",
        (1.09 - revealProgress * 0.09).toFixed(4)
      )
      root.style.setProperty(
        "--hero-image-y",
        `${(18 - revealProgress * 18).toFixed(4)}svh`
      )
      root.style.setProperty("--hero-wipe-y", `${(-revealProgress * 105).toFixed(4)}%`)
      root.style.setProperty(
        "--hero-title-y",
        `${((1 - titleProgress) * 1.2 - progress * 1.2).toFixed(4)}rem`
      )
      root.style.setProperty("--hero-title-opacity", titleProgress.toFixed(4))
      root.style.setProperty("--hero-opacity", (0.35 + revealProgress * 0.65).toFixed(4))

      if (revealProgress >= 1) {
        setRevealComplete(true)
      }
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
      ref={rootRef}
      data-homepage-hero
      data-hero-reveal-complete={revealComplete ? "true" : "false"}
      className="relative h-[185svh] overflow-clip bg-black text-black"
      style={
        {
          "--hero-progress": 0,
          "--hero-scale": 1.09,
          "--hero-image-y": "18svh",
          "--hero-wipe-y": "0%",
          "--hero-title-y": "0rem",
          "--hero-title-opacity": 0,
          "--hero-opacity": 1,
        } as CSSProperties
      }
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <Image
          src="/media/sr8-hero-render.png"
          alt="Sunswift 8 concept render"
          fill
          priority
          className="homepage-hero-image object-cover object-[50%_52%]"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-white/8" />
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
