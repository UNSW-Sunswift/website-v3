"use client"

import type { CSSProperties } from "react"
import { useEffect, useRef } from "react"

import { HomepageImageSequence } from "@/components/site/homepage-image-sequence"

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

      // Headline resolves into focus without changing size.
      const revealRamp = Math.min(progress / 0.62, 1)
      const opacity = lerp(0.42, 1, Math.min(progress / 0.32, 1))
      const blur = lerp(10, 0, revealRamp)
      const textY = lerp(4, -1.5, revealRamp)
      const sweepX = lerp(-42, 142, Math.min(progress / 0.82, 1))

      // Tone: starts as a faint light gray and darkens to near-black on scroll.
      const toneRamp = Math.pow(Math.min(progress / 0.65, 1), 0.85)
      const channel = Math.round(lerp(186, 12, toneRamp))

      // Background vehicle render glides in with a quiet parallax pass.
      const renderX = lerp(3.5, -2.5, Math.min(progress / 0.86, 1))
      const renderY = lerp(4, -4, Math.min(progress / 0.86, 1))
      const renderOpacity = lerp(0.34, 0.68, Math.min(progress / 0.8, 1))

      root.style.setProperty("--zoom-progress", progress.toFixed(4))
      root.style.setProperty("--zoom-opacity", opacity.toFixed(4))
      root.style.setProperty("--zoom-blur", `${blur.toFixed(4)}px`)
      root.style.setProperty("--zoom-text-y", `${textY.toFixed(4)}vh`)
      root.style.setProperty("--zoom-sweep-x", `${sweepX.toFixed(4)}%`)
      root.style.setProperty(
        "--zoom-text-color",
        `rgb(${channel}, ${channel}, ${channel})`
      )
      root.style.setProperty("--zoom-render-x", `${renderX.toFixed(4)}vw`)
      root.style.setProperty("--zoom-render-y", `${renderY.toFixed(4)}vh`)
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
          "--zoom-opacity": 0.42,
          "--zoom-blur": "10px",
          "--zoom-text-y": "4vh",
          "--zoom-sweep-x": "-42%",
          "--zoom-text-color": "rgb(186, 186, 186)",
          "--zoom-render-x": "3.5vw",
          "--zoom-render-y": "4vh",
          "--zoom-render-opacity": 0.34,
        } as CSSProperties
      }
    >
      <div className="sticky top-0 flex h-svh w-full items-center justify-center overflow-hidden">
        <div
          data-homepage-vehicle-render
          aria-hidden="true"
          className="homepage-zoom-render absolute inset-0"
        >
          <HomepageImageSequence
            alt=""
            posterSrc="/vehicle-fleet/vehicle-sunswift-8.jpg"
            sequenceBasePath="/homepage-sequences/zoom-reveal"
            scrollContainerSelector="[data-homepage-zoom-reveal]"
            sizes="100vw"
            imageClassName="object-cover [filter:grayscale(0.85)_brightness(1.1)_contrast(0.95)]"
          />
        </div>

        <div className="absolute inset-0 bg-[#f6f5f1]/64" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[14svh] bg-[#f6f5f1]/90" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[14svh] bg-[#f6f5f1]/90" />
        <div
          aria-hidden="true"
          className="homepage-zoom-sweep pointer-events-none absolute inset-y-[18svh] w-[34vw] -translate-x-1/2 bg-white/35 opacity-70 mix-blend-screen blur-2xl"
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
