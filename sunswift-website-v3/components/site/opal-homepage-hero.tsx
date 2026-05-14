"use client"

import Image from "next/image"
import type { CSSProperties } from "react"
import { useEffect, useRef } from "react"

export function OpalHomepageHero() {
  const rootRef = useRef<HTMLElement>(null)

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
          className="opal-hero-image object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_54%_42%,transparent_0%,rgba(20,24,27,0.08)_31%,rgba(20,24,27,0.58)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,24,27,0.58)_0%,rgba(20,24,27,0.16)_42%,rgba(20,24,27,0.34)_100%)]" />
        <h1 className="opal-hero-title absolute left-[9vw] top-[41svh] max-w-[9ch] text-[clamp(3.05rem,5.45vw,5.95rem)] font-light leading-[0.98] tracking-normal text-white">
          Tomorrow,
          <br />
          Today
        </h1>
      </div>
    </section>
  )
}
