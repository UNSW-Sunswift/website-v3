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

      // Headline grows from far away into a confident display headline.
      const growthRamp = Math.min(progress / 0.55, 1)
      const scale = 0.42 + growthRamp * 0.76
      const tracking = -0.05 + growthRamp * 0.025
      const opacity = Math.min(progress / 0.12, 1)

      // Tone: starts as a faint light gray and darkens to near-black on scroll.
      const toneRamp = Math.pow(Math.min(progress / 0.65, 1), 0.85)
      const channel = Math.round(lerp(186, 12, toneRamp))

      // Background vehicle render breathes in with a hint of parallax.
      const renderScale = 1.02 + progress * 0.08
      const renderY = (progress - 0.5) * -10
      const renderOpacity = lerp(0.18, 0.65, Math.min(progress / 0.8, 1))

      root.style.setProperty("--zoom-progress", progress.toFixed(4))
      root.style.setProperty("--zoom-scale", scale.toFixed(4))
      root.style.setProperty("--zoom-opacity", opacity.toFixed(4))
      root.style.setProperty("--zoom-tracking", `${tracking.toFixed(4)}em`)
      root.style.setProperty("--zoom-text-color", `rgb(${channel}, ${channel}, ${channel})`)
      root.style.setProperty("--zoom-render-scale", renderScale.toFixed(4))
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
      className="relative h-[180svh] overflow-clip bg-[#f6f5f1] text-black"
      style={
        {
          "--zoom-progress": 0,
          "--zoom-scale": 0.42,
          "--zoom-opacity": 0,
          "--zoom-tracking": "-0.05em",
          "--zoom-text-color": "rgb(186, 186, 186)",
          "--zoom-render-scale": 1.02,
          "--zoom-render-y": "0vh",
          "--zoom-render-opacity": 0.18,
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
            src="/placeholders/vehicle-sunswift-8.svg"
            alt=""
            fill
            priority={false}
            sizes="100vw"
            className="object-cover [filter:grayscale(0.85)_brightness(1.1)_contrast(0.95)]"
          />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(246,245,241,0.35)_0%,rgba(246,245,241,0.92)_70%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[28svh] bg-[linear-gradient(180deg,#f6f5f1_0%,rgba(246,245,241,0.6)_55%,transparent_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[28svh] bg-[linear-gradient(0deg,#f6f5f1_0%,rgba(246,245,241,0.6)_55%,transparent_100%)]" />

        <h2
          data-homepage-zoom-text
          className="homepage-zoom-text relative z-10 max-w-[18ch] text-center font-thin leading-[0.95] tracking-tight"
        >
          Built by Students.
          <br />
          Driving Sustainability.
        </h2>
      </div>
    </section>
  )
}
