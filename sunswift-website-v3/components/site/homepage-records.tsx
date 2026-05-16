"use client"

import Image from "next/image"
import { useEffect, useRef, type CSSProperties } from "react"

type Record = {
  id: string
  metric: string
  unit: string
  title: string
  body: string
  year: string
  image: string
}

const records: Record[] = [
  {
    id: "thousand-km",
    metric: "1,000",
    unit: "km",
    title: "Furthest distance by an EV on a single charge.",
    body: "Sunswift 7 carried four occupants over 1,000 km on a single charge at the Australian Automotive Research Centre, certified by Guinness World Records.",
    year: "2022",
    image: "/vehicle-fleet/vehicle-sunswift-7.jpeg",
  },
  {
    id: "speed-record",
    metric: "107",
    unit: "km/h",
    title: "Fastest solar-powered electric vehicle.",
    body: "Sunswift eVe set the FIA-ratified record for the fastest electric vehicle averaging over 500 km without recharging, an industry first for solar racing.",
    year: "2014",
    image: "/vehicle-fleet/vehicle-eve.jpg",
  },
  {
    id: "world-firsts",
    metric: "7",
    unit: "cars built",
    title: "Three decades of solar engineering.",
    body: "Seven generations of student-built solar vehicles since 1996, with the eighth in production - a continuous record of innovation out of UNSW Sydney.",
    year: "1996 - Today",
    image: "/vehicle-fleet/vehicle-violet.avif",
  },
]

type RecordsStyle = CSSProperties & {
  "--records-progress"?: number
  "--records-carousel-y"?: string
  "--records-dark-opacity"?: number
  "--records-light-opacity"?: number
  "--records-copy-y"?: string
  "--records-copy-opacity"?: number
  "--records-image-scale"?: number
  "--records-handoff-opacity"?: number
  "--records-handoff-y"?: string
  "--records-content-opacity"?: number
  "--records-content-y"?: string
  "--records-text-color"?: string
  "--records-muted-color"?: string
  "--records-rule-color"?: string
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

export function HomepageRecords() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) {
      return
    }

    let frame = 0

    const update = () => {
      frame = 0
      const rect = section.getBoundingClientRect()
      const distance = Math.max(section.offsetHeight - window.innerHeight, 1)
      const progress = clamp(-rect.top / distance)
      // Tightened timeline so the records → recruitment handoff is fully resolved
      // (content cleared, dark veil at 100%) BEFORE the recruitment section enters
      // the viewport. This removes the visible overlap where the recruitment glow
      // used to bleed through while the records headline was still on screen.
      const carouselProgress = clamp((progress - 0.08) / 0.5)
      const handoffProgress = clamp((progress - 0.58) / 0.3)
      const contentClear = clamp((progress - 0.66) / 0.12)
      const copyClear = clamp((progress - 0.6) / 0.12)
      const easedCarousel = 1 - Math.pow(1 - carouselProgress, 3)
      const easedHandoff = 1 - Math.pow(1 - handoffProgress, 3)

      section.style.setProperty("--records-progress", progress.toFixed(4))
      section.style.setProperty(
        "--records-carousel-y",
        `${(-easedCarousel * (records.length - 1) * 100).toFixed(3)}svh`
      )
      section.style.setProperty(
        "--records-dark-opacity",
        String(clamp((progress - 0.04) / 0.3))
      )
      section.style.setProperty(
        "--records-light-opacity",
        String(1 - clamp((progress - 0.02) / 0.28))
      )
      section.style.setProperty(
        "--records-copy-y",
        `${((1 - Math.min(progress / 0.16, 1)) * 42 - easedHandoff * 24).toFixed(3)}px`
      )
      section.style.setProperty("--records-copy-opacity", String(1 - copyClear))
      section.style.setProperty(
        "--records-image-scale",
        String(1 + easedCarousel * 0.08)
      )
      section.style.setProperty(
        "--records-handoff-opacity",
        String(easedHandoff)
      )
      section.style.setProperty(
        "--records-handoff-y",
        `${((1 - easedHandoff) * 18).toFixed(3)}px`
      )
      section.style.setProperty(
        "--records-content-opacity",
        String(1 - contentClear)
      )
      section.style.setProperty(
        "--records-content-y",
        `${(-handoffProgress * 20).toFixed(3)}px`
      )
      const textRamp = clamp((progress - 0.1) / 0.28)
      const textChannel = Math.round(12 + textRamp * 243)
      const mutedChannel = Math.round(74 + textRamp * 112)
      const ruleAlpha = 0.18 + textRamp * 0.08
      section.style.setProperty(
        "--records-text-color",
        `rgb(${textChannel}, ${textChannel}, ${textChannel})`
      )
      section.style.setProperty(
        "--records-muted-color",
        `rgb(${mutedChannel}, ${mutedChannel}, ${mutedChannel})`
      )
      section.style.setProperty(
        "--records-rule-color",
        `rgba(${textChannel}, ${textChannel}, ${textChannel}, ${ruleAlpha.toFixed(3)})`
      )
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
      ref={sectionRef}
      data-homepage-records
      data-homepage-records-transition
      className="relative h-[390svh] bg-[#0a0c0e] text-white"
      style={
        {
          "--records-progress": 0,
          "--records-carousel-y": "0svh",
          "--records-dark-opacity": 0,
          "--records-light-opacity": 1,
          "--records-copy-y": "42px",
          "--records-copy-opacity": 1,
          "--records-image-scale": 1,
          "--records-handoff-opacity": 0,
          "--records-handoff-y": "36px",
          "--records-content-opacity": 1,
          "--records-content-y": "0px",
          "--records-text-color": "rgb(12, 12, 12)",
          "--records-muted-color": "rgb(74, 74, 74)",
          "--records-rule-color": "rgba(12, 12, 12, 0.18)",
        } as RecordsStyle
      }
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#f6f5f1]"
          style={{ opacity: "var(--records-light-opacity)" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#0a0c0e]"
          style={{ opacity: "var(--records-dark-opacity)" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[30svh] bg-[#f6f5f1]"
          style={{ opacity: "var(--records-light-opacity)" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[24svh] bg-[#0a0c0e]"
          style={{ opacity: "var(--records-dark-opacity)" }}
        />

        <div className="relative mx-auto grid h-full max-w-[92rem] items-center gap-8 px-4 sm:px-6 lg:grid-cols-[0.86fr_1.14fr]">
          <div
            className="relative z-20 max-w-2xl"
            style={{
              opacity:
                "calc(var(--records-copy-opacity) * var(--records-content-opacity))",
              transform:
                "translate3d(0, calc(var(--records-copy-y) + var(--records-content-y)), 0)",
              color: "var(--records-text-color)",
            }}
          >
            <p
              className="font-mono text-[0.68rem] tracking-[0.28em] uppercase"
              style={{ color: "var(--records-muted-color)" }}
            >
              Continue
            </p>
            <h2 className="mt-5 text-[clamp(3.8rem,10vw,10rem)] leading-[0.86] font-thin tracking-normal">
              Moving records forward.
            </h2>
            <p
              className="mt-8 max-w-xl text-base leading-7 sm:text-lg"
              style={{ color: "var(--records-muted-color)" }}
            >
              Scroll through the milestones that pushed Sunswift from student
              prototype to globally recognised solar racing team.
            </p>
          </div>

          <div
            className="relative z-10 h-svh overflow-hidden"
            style={{
              opacity: "var(--records-content-opacity)",
              transform: "translate3d(0, var(--records-content-y), 0)",
            }}
          >
            <div
              data-homepage-records-carousel
              className="homepage-records-carousel"
              style={{
                transform: "translate3d(0, var(--records-carousel-y), 0)",
                color: "var(--records-text-color)",
              }}
            >
              {records.map((record) => (
                <article
                  key={record.id}
                  data-homepage-record
                  className="grid h-svh items-center gap-8 py-24 lg:grid-cols-[0.95fr_1.05fr]"
                >
                  <div>
                    <span className="font-mono text-[0.65rem] tracking-[0.28em] text-accent-yellow/75 uppercase">
                      {record.year}
                    </span>
                    <div className="mt-7 flex items-baseline gap-3">
                      <span className="text-[clamp(5rem,13vw,12rem)] leading-none font-thin tracking-normal">
                        {record.metric}
                      </span>
                      <span
                        className="text-lg font-light sm:text-2xl"
                        style={{ color: "var(--records-muted-color)" }}
                      >
                        {record.unit}
                      </span>
                    </div>
                    <h3 className="mt-7 max-w-xl text-2xl leading-tight font-light sm:text-4xl">
                      {record.title}
                    </h3>
                    <p
                      className="mt-6 max-w-xl text-sm leading-6 sm:text-base sm:leading-7"
                      style={{ color: "var(--records-muted-color)" }}
                    >
                      {record.body}
                    </p>
                  </div>

                  <div
                    className="relative aspect-[16/11] w-full overflow-hidden border bg-white/[0.035] shadow-[0_34px_120px_rgba(0,0,0,0.26)] lg:aspect-square"
                    style={{ borderColor: "var(--records-rule-color)" }}
                  >
                    <Image
                      src={record.image}
                      alt=""
                      fill
                      className="object-cover opacity-82 [filter:grayscale(0.42)_contrast(1.05)]"
                      sizes="(min-width: 1024px) 34vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-[#0a0c0e]/45" />
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div
            data-homepage-records-handoff
            className="pointer-events-none absolute inset-x-0 -bottom-[40svh] z-30 h-[180svh] bg-[#0a0c0e]"
            style={{
              opacity: "var(--records-handoff-opacity)",
            }}
          />
        </div>
      </div>
    </section>
  )
}
