"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

import type { Vehicle } from "@/lib/cms/types"

type Props = {
  vehicles: Vehicle[]
}

const CLICK_TRANSITION_MS = 520

/** Strip + detail hero images: max encoder quality and generous `sizes` for hover expansion + DPR. */
const GARAGE_IMAGE_QUALITY = 100
const GALLERY_CARD_IMAGE_SIZES =
  "(min-width: 1536px) 65vw, (min-width: 1024px) 70vw, (min-width: 640px) 90vw, 100vw"
const DETAIL_HERO_IMAGE_SIZES =
  "(min-width: 1536px) 1200px, (min-width: 1024px) 85vw, 100vw"

export function VehiclesGallery({ vehicles }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [clicking, setClicking] = useState<string | null>(null)
  const [selected, setSelected] = useState<Vehicle | null>(null)

  useEffect(() => {
    if (!clicking) {
      return
    }
    const vehicle = vehicles.find((v) => v.slug === clicking)
    if (!vehicle) {
      return
    }
    const id = window.setTimeout(() => {
      setSelected(vehicle)
      setClicking(null)
    }, CLICK_TRANSITION_MS)
    return () => window.clearTimeout(id)
  }, [clicking, vehicles])

  const isAnimating = clicking !== null

  return (
    <>
      <section
        data-vehicles-gallery
        data-detail-open={selected ? "true" : "false"}
        data-clicking={clicking ?? ""}
        className={[
          "relative h-svh w-full overflow-hidden bg-[#0a0c0e] text-white",
          "transition-[opacity,transform,filter] duration-[700ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
          selected
            ? "pointer-events-none -translate-y-3 opacity-0 [filter:blur(6px)]"
            : "opacity-100 [filter:blur(0)]",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.07)_0%,transparent_60%)]" />

        <div
          data-homepage-top-vignette
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-[15] h-[22svh] bg-[linear-gradient(180deg,#000_0%,rgba(10,12,14,0.92)_30%,rgba(10,12,14,0.55)_70%,rgba(10,12,14,0)_100%)]"
        />

        <div
          className="absolute inset-0 z-10 flex w-full items-stretch gap-0"
          onMouseLeave={() => setHovered(null)}
        >
          {vehicles.map((vehicle, index) => {
            const isHovered = hovered === vehicle.slug && !isAnimating
            const isDimmed = hovered !== null && hovered !== vehicle.slug && !isAnimating
            const isClicking = clicking === vehicle.slug
            const isClickedSibling = isAnimating && !isClicking

            return (
              <button
                key={vehicle.slug}
                type="button"
                data-vehicle-card
                data-vehicle-slug={vehicle.slug}
                data-hovered={isHovered ? "true" : "false"}
                data-dimmed={isDimmed ? "true" : "false"}
                data-clicking={isClicking ? "true" : "false"}
                onMouseEnter={() => !isAnimating && setHovered(vehicle.slug)}
                onFocus={() => !isAnimating && setHovered(vehicle.slug)}
                onClick={() => !isAnimating && setClicking(vehicle.slug)}
                disabled={isAnimating}
                style={{
                  animation: isAnimating
                    ? undefined
                    : `vehicle-card-rise 720ms cubic-bezier(0.22, 0.61, 0.36, 1) ${index * 70}ms both`,
                }}
                className={[
                  "group relative flex h-full flex-col justify-end overflow-hidden bg-[#0e1114] text-left",
                  "transition-[flex,opacity,transform,filter,box-shadow] duration-[700ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                  "outline-none focus-visible:z-20 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-yellow",
                  isClicking
                    ? "z-20 flex-[14] scale-[1.005]"
                    : isClickedSibling
                      ? "flex-[0.35] -translate-y-2 opacity-0 [filter:blur(8px)]"
                      : isHovered
                        ? "z-10 flex-[3.6] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)]"
                        : isDimmed
                          ? "flex-[0.55]"
                          : "flex-1",
                ].join(" ")}
                aria-label={`Open ${vehicle.name}`}
              >
                <Image
                  src={vehicle.image}
                  alt=""
                  fill
                  priority={index < 3}
                  quality={GARAGE_IMAGE_QUALITY}
                  sizes={GALLERY_CARD_IMAGE_SIZES}
                  className={[
                    "object-cover transition-[transform,opacity,filter] duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                    isClicking
                      ? "scale-[1.12] opacity-100 [filter:grayscale(0)_brightness(1.05)]"
                      : isHovered
                        ? "scale-[1.06] opacity-100 [filter:grayscale(0)_brightness(1)]"
                        : isDimmed
                          ? "scale-[1] opacity-55 [filter:grayscale(1)_brightness(0.65)]"
                          : "scale-[1.01] opacity-85 [filter:grayscale(0.85)_brightness(0.85)]",
                  ].join(" ")}
                />

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,12,14,0.05)_45%,rgba(10,12,14,0.92)_100%)]" />

                {isClicking ? (
                  <span
                    aria-hidden="true"
                    className="vehicle-click-pulse pointer-events-none absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-yellow/70"
                  />
                ) : null}

                <span
                  data-vehicle-name
                  className={[
                    "vehicle-name-vertical pointer-events-none absolute right-4 top-24 z-10 whitespace-nowrap font-thin leading-none tracking-[-0.01em] text-white transition-[font-size,letter-spacing,color,opacity] duration-700 sm:right-6 sm:top-28",
                    isHovered || isClicking
                      ? "text-[2rem] opacity-100 sm:text-[2.75rem]"
                      : isDimmed
                        ? "text-[1.05rem] opacity-90 sm:text-[1.35rem]"
                        : "text-[1.25rem] opacity-95 sm:text-[1.6rem]",
                  ].join(" ")}
                  style={{ writingMode: "vertical-rl" }}
                >
                  {vehicle.name}
                </span>

                <div className="relative z-10 flex h-[220px] flex-col justify-end gap-1.5 px-4 pb-44 sm:h-[260px] sm:px-6 sm:pb-56">
                  <span
                    className={[
                      "block font-mono text-[0.6rem] uppercase tracking-[0.28em] transition-colors duration-500",
                      isHovered || isClicking ? "text-accent-yellow" : "text-white/55",
                    ].join(" ")}
                  >
                    {vehicle.years}
                  </span>
                  <span
                    className={[
                      "block max-w-[28ch] text-xs font-extralight leading-5 text-white [text-shadow:0_1px_14px_rgba(0,0,0,0.82)] transition-[opacity,transform,max-height] duration-500 sm:text-sm sm:leading-6",
                      isHovered
                        ? "max-h-24 translate-y-0 opacity-100"
                        : "pointer-events-none max-h-0 translate-y-1 overflow-hidden opacity-0",
                    ].join(" ")}
                  >
                    {vehicle.summary}
                  </span>
                  <span
                    className={[
                      "inline-flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.28em] transition-[opacity,transform,color,max-height] duration-500",
                      isHovered
                        ? "mt-1 max-h-6 translate-y-0 text-accent-yellow opacity-100"
                        : "pointer-events-none max-h-0 translate-y-1 overflow-hidden text-white/70 opacity-0",
                    ].join(" ")}
                  >
                    Open
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        <div
          data-homepage-vignette
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-[42svh] bg-[linear-gradient(180deg,rgba(10,12,14,0)_0%,rgba(10,12,14,0.55)_45%,rgba(10,12,14,0.92)_80%,#000_100%)]"
        />

        <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-6 bg-transparent px-6 pb-10 pt-2 sm:px-10 lg:px-14">
          <div className="max-w-3xl">
            <p
              className="font-mono text-[0.62rem] uppercase tracking-[0.32em] text-white/50"
              style={{ animation: "vehicle-fade-up 800ms cubic-bezier(0.22,0.61,0.36,1) both" }}
            >
              The Sunswift Garage
            </p>
            <h1
              className="mt-3 text-3xl font-light leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl [text-shadow:0_2px_24px_rgba(0,0,0,0.55)]"
              style={{ animation: "vehicle-fade-up 900ms cubic-bezier(0.22,0.61,0.36,1) 120ms both" }}
            >
              Eight cars.
              <span className="text-white/50"> One vision.</span>
            </h1>
          </div>
          <p
            className="hidden max-w-xs text-right text-xs leading-5 text-white/55 sm:block [text-shadow:0_1px_18px_rgba(0,0,0,0.6)]"
            style={{ animation: "vehicle-fade-up 900ms cubic-bezier(0.22,0.61,0.36,1) 240ms both" }}
          >
            Hover to focus. Click to step inside.
            <br />
            Every car is a chapter of student-led solar engineering since 1996.
          </p>
        </footer>
      </section>

      {selected ? (
        <VehicleDetail vehicle={selected} onClose={() => setSelected(null)} />
      ) : null}
    </>
  )
}

function VehicleDetail({ vehicle, onClose }: { vehicle: Vehicle; onClose: () => void }) {
  const [activePanel, setActivePanel] = useState<"achievements" | "overview">(
    "achievements"
  )
  const hasOverview = Boolean(vehicle.overview?.trim())

  return (
    <section
      data-vehicle-detail
      data-vehicle-slug={vehicle.slug}
      className="fixed inset-0 z-40 min-h-svh w-full overflow-y-auto bg-[#0a0c0e] text-white"
      style={{ animation: "vehicle-detail-in 720ms cubic-bezier(0.22,0.61,0.36,1) both" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_10%,rgba(255,255,255,0.08)_0%,transparent_60%)]" />

      <div className="relative z-10 flex items-center justify-between px-6 pt-24 sm:px-10 lg:px-14">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-white/85 transition-colors duration-300 hover:border-accent-yellow hover:text-accent-yellow"
        >
          <span aria-hidden="true">←</span>
          Garage
        </button>
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-white/45">
          {vehicle.years}
        </span>
      </div>

      <div className="relative z-10 mx-auto grid max-w-[92rem] gap-12 px-6 pb-24 pt-12 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-14 lg:pt-16">
        <div
          style={{ animation: "vehicle-fade-up 700ms cubic-bezier(0.22,0.61,0.36,1) 120ms both" }}
        >
          <h2 className="text-5xl font-light leading-[0.98] tracking-tight text-white sm:text-7xl lg:text-[6.5rem]">
            {vehicle.name}
          </h2>
          <p className="mt-6 max-w-md text-base leading-7 text-white [text-shadow:0_1px_16px_rgba(0,0,0,0.7)] sm:text-lg">
            {vehicle.summary}
          </p>

          <div className="relative mt-12 aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 bg-[#0e1114]">
            <Image
              src={vehicle.image}
              alt={`${vehicle.name} render`}
              fill
              priority
              quality={GARAGE_IMAGE_QUALITY}
              sizes={DETAIL_HERO_IMAGE_SIZES}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(10,12,14,0.6)_100%)]" />
          </div>
        </div>

        <div
          className="flex flex-col gap-12"
          style={{ animation: "vehicle-fade-up 700ms cubic-bezier(0.22,0.61,0.36,1) 220ms both" }}
        >
          <div
            data-vehicle-carousel
            data-vehicle-carousel-mode={activePanel}
            className="relative min-h-[25rem] overflow-hidden rounded-xl border border-white/10 bg-white/[0.035] transition-colors duration-300"
            aria-label={
              hasOverview
                ? `${vehicle.name} achievements and overview. Click to switch panels.`
                : `${vehicle.name} achievements.`
            }
          >
            <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-white/40">
                {activePanel === "achievements" ? "Achievements" : "Overview"}
              </p>
              {hasOverview ? (
                <div
                  data-vehicle-carousel-controls
                  className="inline-flex w-fit overflow-hidden rounded-full border border-white/12 bg-black/20 p-1"
                >
                  {(["achievements", "overview"] as const).map((panel) => (
                    <button
                      key={panel}
                      type="button"
                      data-vehicle-carousel-trigger={panel}
                      data-active={activePanel === panel ? "true" : "false"}
                      onClick={() => setActivePanel(panel)}
                      className={[
                        "rounded-full px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.2em] transition-colors duration-300",
                        activePanel === panel
                          ? "bg-accent-yellow text-black"
                          : "text-white/46 hover:text-white",
                      ].join(" ")}
                    >
                      {panel}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="relative min-h-[20rem]">
              <div
                data-vehicle-carousel-panel="achievements"
                aria-hidden={activePanel !== "achievements"}
                className={[
                  "absolute inset-0 px-5 py-6 transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                  activePanel === "achievements"
                    ? "translate-y-0 opacity-100 [filter:blur(0)]"
                    : "-translate-y-5 opacity-0 [filter:blur(8px)]",
                ].join(" ")}
              >
                <ul className="space-y-4">
                  {vehicle.achievements.map((achievement) => (
                    <li
                      key={achievement}
                      className="flex gap-4 border-t border-white/10 pt-4 text-sm leading-6 text-white/75 first:border-t-0 first:pt-0 sm:text-base sm:leading-7"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-accent-yellow"
                      />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>

              {hasOverview ? (
                <div
                  data-vehicle-carousel-panel="overview"
                  aria-hidden={activePanel !== "overview"}
                  className={[
                    "absolute inset-0 px-5 py-6 transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                    activePanel === "overview"
                      ? "translate-y-0 opacity-100 [filter:blur(0)]"
                      : "translate-y-5 opacity-0 [filter:blur(8px)]",
                  ].join(" ")}
                >
                  <p className="max-w-2xl text-sm leading-7 text-white/72 sm:text-base sm:leading-8">
                    {vehicle.overview}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div data-vehicle-specs>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-white/40">
              Technical Specifications
            </p>
            <dl className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] sm:grid-cols-2">
              {Object.entries(vehicle.specs).map(([label, value]) => (
                <div key={label} className="bg-[#0a0c0e] p-5">
                  <dt className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-white/45">
                    {label}
                  </dt>
                  <dd className="mt-2 text-base font-light leading-snug text-white sm:text-lg">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
