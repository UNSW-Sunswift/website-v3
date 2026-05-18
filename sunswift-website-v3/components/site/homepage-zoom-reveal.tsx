"use client"

import Image from "next/image"
import type { CSSProperties } from "react"
import { useEffect, useRef } from "react"

import { resolveSiteImage, type SiteImageMap } from "@/lib/cms/site-images"

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function HomepageZoomReveal({ imageOverrides }: { imageOverrides?: SiteImageMap }) {
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

      const revealRamp = Math.min(Math.max((progress - 0.22) / 0.22, 0), 1)
      const handoffRamp = Math.min(Math.max((progress - 0.76) / 0.2, 0), 1)
      const opacity = revealRamp * lerp(1, 0.45, handoffRamp)
      const textY = lerp(0.35, -0.42, revealRamp) - handoffRamp * 0.2

      // Tone: starts readable on the light render and locks to near-black.
      const toneRamp = Math.pow(revealRamp, 0.85)
      const channel = Math.round(lerp(32, 8, toneRamp))

      const renderOpacity = lerp(
        lerp(0.5, 0.72, Math.min(progress / 0.55, 1)),
        0.26,
        handoffRamp
      )
      const washOpacity = lerp(0.56, 0.7, Math.min(revealRamp + handoffRamp, 1))
      const handoffOpacity = Math.min(Math.max((progress - 0.7) / 0.2, 0), 1)
      const handoffY = lerp(12, 0, handoffOpacity)
      const lineScale = lerp(0.08, 1, handoffOpacity)

      root.style.setProperty("--zoom-progress", progress.toFixed(4))
      root.style.setProperty("--zoom-opacity", opacity.toFixed(4))
      root.style.setProperty("--zoom-blur", "0px")
      root.style.setProperty("--zoom-text-y", `${textY.toFixed(4)}vh`)
      root.style.setProperty(
        "--zoom-text-color",
        `rgb(${channel}, ${channel}, ${channel})`
      )
      root.style.setProperty("--zoom-render-opacity", renderOpacity.toFixed(4))
      root.style.setProperty("--zoom-wash-opacity", washOpacity.toFixed(4))
      root.style.setProperty("--zoom-handoff-opacity", handoffOpacity.toFixed(4))
      root.style.setProperty("--zoom-handoff-y", `${handoffY.toFixed(4)}svh`)
      root.style.setProperty("--zoom-handoff-line-scale", lineScale.toFixed(4))
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
          "--zoom-text-y": "0.35vh",
          "--zoom-text-color": "rgb(32, 32, 32)",
          "--zoom-render-opacity": 0.5,
          "--zoom-wash-opacity": 0.56,
          "--zoom-handoff-opacity": 0,
          "--zoom-handoff-y": "12svh",
          "--zoom-handoff-line-scale": 0.08,
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
            src={resolveSiteImage("/media/sr8-hero-2.png", imageOverrides)}
            alt=""
            fill
            className="object-cover object-[50%_54%] [filter:grayscale(0.18)_brightness(1.02)_contrast(0.98)]"
            sizes="100vw"
          />
        </div>

        <div
          data-homepage-zoom-readability-wash
          className="homepage-zoom-readability-wash absolute inset-0 bg-[#f6f5f1]"
        />

        <h2
          data-homepage-zoom-text
          className="homepage-zoom-text relative z-10 flex max-w-[min(94vw,76rem)] flex-col items-center text-center leading-[0.95] font-light tracking-normal"
        >
          <span className="whitespace-nowrap">Built by Students.</span>
          <span className="whitespace-nowrap">Driving Sustainability.</span>
        </h2>

        <div
          data-homepage-zoom-handoff
          aria-hidden="true"
          className="homepage-zoom-handoff pointer-events-none absolute inset-x-0 bottom-0 z-20 flex h-[28svh] items-end justify-center bg-[#f6f5f1] pb-8"
        >
          <span className="homepage-zoom-handoff-line h-px w-[min(72rem,82vw)] bg-black/20" />
        </div>
      </div>
    </section>
  )
}
