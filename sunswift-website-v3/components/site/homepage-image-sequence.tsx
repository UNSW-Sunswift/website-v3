"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

type HomepageImageSequenceProps = {
  alt: string
  posterSrc: string
  sequenceBasePath: string
  scrollContainerSelector: string
  className?: string
  imageClassName?: string
  sizes: string
  priority?: boolean
  frameCount?: number
}

function frameSrc(basePath: string, frame: number) {
  return `${basePath.replace(/\/$/, "")}/frame_${String(frame).padStart(3, "0")}.webp`
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value))
}

export function HomepageImageSequence({
  alt,
  posterSrc,
  sequenceBasePath,
  scrollContainerSelector,
  className,
  imageClassName,
  sizes,
  priority = false,
  frameCount = 81,
}: HomepageImageSequenceProps) {
  const [frame, setFrame] = useState(0)
  const [sequenceReady, setSequenceReady] = useState(false)
  const [sequenceUnavailable, setSequenceUnavailable] = useState(false)

  useEffect(() => {
    if (sequenceUnavailable) {
      return
    }

    const container = document.querySelector<HTMLElement>(scrollContainerSelector)
    if (!container) {
      return
    }

    let animationFrame = 0

    const update = () => {
      animationFrame = 0
      const rect = container.getBoundingClientRect()
      const distance = Math.max(container.offsetHeight - window.innerHeight, 1)
      const progress = clamp(-rect.top / distance)
      setFrame(Math.round(progress * (frameCount - 1)))
    }

    const requestUpdate = () => {
      if (animationFrame === 0) {
        animationFrame = window.requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", requestUpdate)

    return () => {
      if (animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame)
      }
      window.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", requestUpdate)
    }
  }, [frameCount, scrollContainerSelector, sequenceUnavailable])

  return (
    <div
      data-homepage-image-sequence
      data-sequence-base={sequenceBasePath}
      className={cn("absolute inset-0", className)}
    >
      <Image
        src={posterSrc}
        alt={alt}
        fill
        priority={priority}
        className={imageClassName}
        sizes={sizes}
      />
      {!sequenceUnavailable ? (
        <Image
          key={frame}
          src={frameSrc(sequenceBasePath, frame)}
          alt=""
          fill
          unoptimized
          aria-hidden="true"
          className={cn(
            imageClassName,
            "transition-opacity duration-150",
            sequenceReady ? "opacity-100" : "opacity-0"
          )}
          sizes={sizes}
          onLoad={() => setSequenceReady(true)}
          onError={() => {
            setSequenceReady(false)
            setSequenceUnavailable(true)
          }}
        />
      ) : null}
    </div>
  )
}
