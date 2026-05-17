"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

const SLOGAN = "Today, Tomorrow"
const LINE_BREAK_INDEX = 6
const INTRO_DELAY_MS = 1400
const INTRO_DURATION_MS = 1350
const TYPE_INTERVAL_MS = 95
const TYPE_START_DELAY_MS = 350

export function HomepageHero() {
  const typingStartedRef = useRef(false)
  const [introStarted, setIntroStarted] = useState(false)
  const [typed, setTyped] = useState("")
  const [revealComplete, setRevealComplete] = useState(false)

  useEffect(() => {
    const revealStart = window.setTimeout(() => {
      setIntroStarted(true)
    }, INTRO_DELAY_MS)
    const revealDone = window.setTimeout(() => {
      setRevealComplete(true)
    }, INTRO_DELAY_MS + INTRO_DURATION_MS)

    return () => {
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
      data-hero-intro-started={introStarted ? "true" : "false"}
      data-hero-reveal-complete={revealComplete ? "true" : "false"}
      className="relative h-svh overflow-clip bg-black text-black"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <Image
          src="/media/sr8-hero-render.png"
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
