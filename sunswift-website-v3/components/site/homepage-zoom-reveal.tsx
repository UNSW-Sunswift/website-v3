"use client"

import Image from "next/image"
import type { CSSProperties } from "react"
import { useEffect, useRef } from "react"

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function HomepageZoomReveal() {
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

      // The black handoff clears first; the headline then resolves sharply.
      const revealRamp = Math.min(Math.max((progress - 0.38) / 0.24, 0), 1)
      const opacity = revealRamp
      const textY = lerp(1.25, -0.65, revealRamp)
      const wipeY = lerp(0, -105, Math.min(progress / 0.24, 1))

      // Tone: starts as a faint light gray and darkens to near-black on scroll.
      const toneRamp = Math.pow(revealRamp, 0.85)
      const channel = Math.round(lerp(84, 12, toneRamp))

      const renderOpacity = lerp(0.4, 0.7, Math.min(progress / 0.55, 1))

      root.style.setProperty("--zoom-progress", progress.toFixed(4))
      root.style.setProperty("--zoom-opacity", opacity.toFixed(4))
      root.style.setProperty("--zoom-blur", "0px")
      root.style.setProperty("--zoom-text-y", `${textY.toFixed(4)}vh`)
      root.style.setProperty("--zoom-wipe-y", `${wipeY.toFixed(4)}%`)
      root.style.setProperty(
        "--zoom-text-color",
        `rgb(${channel}, ${channel}, ${channel})`
      )
      root.style.setProperty("--zoom-render-opacity", renderOpacity.toFixed(4))
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
      data-homepage-zoom-reveal
      className="relative h-[145svh] overflow-clip bg-[#f6f5f1] text-black"
      style={
        {
          "--zoom-progress": 0,
          "--zoom-opacity": 0,
          "--zoom-blur": "0px",
          "--zoom-text-y": "1.25vh",
          "--zoom-wipe-y": "0%",
          "--zoom-text-color": "rgb(84, 84, 84)",
          "--zoom-render-opacity": 0.4,
        } as CSSProperties
      }
    >
      <div className="sticky top-0 flex h-svh w-full items-center justify-center overflow-hidden">
        <div
          data-homepage-vehicle-render
          aria-hidden="true"
          className="homepage-zoom-render absolute inset-0"
        >
          <Image
            src="/media/sr8-hero-2.png"
            alt=""
            fill
            className="object-cover object-[50%_54%] [filter:grayscale(0.18)_brightness(1.02)_contrast(0.98)]"
            sizes="100vw"
          />
        </div>

        <div className="absolute inset-0 bg-[#f6f5f1]/32" />
        <div
          data-homepage-zoom-wipe
          aria-hidden="true"
          className="homepage-zoom-wipe pointer-events-none absolute inset-0 bg-black"
        />

        <h2
          data-homepage-zoom-text
          className="homepage-zoom-text relative z-10 flex max-w-[min(94vw,76rem)] flex-col items-center text-center leading-[0.95] font-light tracking-normal"
        >
          <span className="whitespace-nowrap">Built by Students.</span>
          <span className="whitespace-nowrap">Driving Sustainability.</span>
        </h2>
      </div>
    </section>
  )
}
