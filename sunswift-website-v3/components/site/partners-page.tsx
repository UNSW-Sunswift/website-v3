import Image from "next/image"
import Link from "next/link"
import type { CSSProperties } from "react"
import { ArrowRight, ArrowUpRight } from "lucide-react"

import { TransparentNavbar } from "@/components/site/transparent-navbar"
import { assetUrl } from "@/lib/cms/dynamodb"
import { resolveSiteImage, type SiteImageMap } from "@/lib/cms/site-images"
import type { Partner } from "@/lib/cms/types"

const partnerIntro =
  "Building world-class cars takes more than just engineering - it takes a community. From partners and sponsors to long-time friends of the team, Sunswift is powered by collaboration, mentorship, and shared ambition."

const partnersHeroMediaPath = "/media/partners-picture.avif"

export function PartnersPageContent({
  partners,
  imageOverrides,
}: {
  partners: Partner[]
  imageOverrides?: SiteImageMap
}) {
  return (
    <main
      data-partners-page
      className="overflow-hidden bg-[#0a0c0e] text-white"
    >
      <div className="relative">
        <TransparentNavbar />
        <section
          data-partners-hero
          className="relative min-h-[86svh] overflow-hidden bg-[#050607]"
        >
          <div className="pointer-events-none absolute inset-0 z-[1]">
            <Image
              src={resolveSiteImage(partnersHeroMediaPath, imageOverrides)}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[52%_32%]"
            />
          </div>
          {/*
           * Readability scrim: weight bottom + left so copy can stack in one column
           * without sitting over the main group in the photo; center/top stays lighter.
           */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(180deg,transparent_0%,rgba(5,6,7,0.06)_40%,rgba(5,6,7,0.55)_68%,rgba(5,6,7,0.94)_90%,#050607_100%),linear-gradient(90deg,rgba(5,6,7,0.88)_0%,rgba(5,6,7,0.5)_22rem,rgba(5,6,7,0.14)_40rem,transparent_100%)]"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-40 bg-[linear-gradient(180deg,#000_0%,rgba(10,12,14,0)_100%)]" />
          <div className="relative z-10 mx-auto flex min-h-[86svh] max-w-[92rem] flex-col justify-end px-4 pt-28 pb-12 sm:px-6 sm:pb-16 lg:pt-36 lg:pb-20">
            <div className="max-w-3xl">

              <h1 className="partners-hero-enter partners-hero-enter-delay-1 mt-4 max-w-[min(100%,20ch)] text-[clamp(3.25rem,9.5vw,8.5rem)] leading-[0.88] font-thin tracking-normal text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.45)]">
                Partners.
              </h1>
              <p className="partners-hero-enter partners-hero-enter-delay-2 mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
                {partnerIntro}
              </p>
              <div className="partners-hero-enter partners-hero-enter-delay-3 mt-7 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 border border-accent-yellow bg-accent-yellow px-5 py-3 font-mono text-[0.68rem] tracking-[0.24em] text-black uppercase transition-colors duration-300 hover:bg-white motion-safe:active:scale-[0.985] motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out motion-reduce:active:scale-100"
                >
                  Contact us
                  <ArrowRight className="size-4" />
                </Link>
              </div>
              <p className="partners-hero-enter partners-hero-enter-delay-4 mt-5 font-mono text-[0.62rem] tracking-[0.22em] text-white/45 uppercase">
                {partners.length} active partners and sponsors
              </p>
            </div>
          </div>
        </section>
      </div>

      <section
        data-partners-grid
        className="relative border-t border-white/10 bg-[#050607] px-6 py-16 sm:px-10 lg:px-20 lg:py-20 xl:px-28"
      >
        <div className="mx-auto max-w-[74rem]">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {partners.map((partner, index) => {
              const href = partner.website || "#"
              const isExternal = href !== "#" && /^https?:\/\//.test(href)

              return (
                <a
                  key={partner.slug}
                  data-partner-card
                  href={href}
                  aria-label={
                    isExternal
                      ? `Open ${partner.name} partner website`
                      : `${partner.name} partner`
                  }
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer" : undefined}
                  style={
                    {
                      "--partner-card-enter-delay": `${Math.min(index, 14) * 42}ms`,
                    } as CSSProperties
                  }
                  className="partner-grid-card-enter group relative aspect-square overflow-hidden border border-white/10 bg-white/[0.045] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_20px_60px_-44px_rgba(0,0,0,0.85)] backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-300 motion-safe:[transition-property:background-color,border-color,box-shadow,transform] motion-safe:hover:z-10 motion-safe:hover:scale-[1.035] hover:border-accent-yellow/70 hover:bg-white/[0.08] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_30px_80px_-42px_rgba(245,208,0,0.38)] motion-safe:active:scale-[0.99] motion-safe:active:border-accent-yellow/85 motion-reduce:active:scale-100 focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-accent-yellow/35 focus-visible:outline-none"
                >
                  <span className="absolute inset-0 flex items-center justify-center p-[18%]">
                    {partner.logoKey ? (
                      <Image
                        src={assetUrl(partner.logoKey)}
                        alt=""
                        fill
                        className="object-contain p-[18%] opacity-80 grayscale transition-[filter,opacity,transform] duration-500 group-hover:scale-[1.04] group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:scale-[1.04] group-focus-visible:opacity-100 group-focus-visible:grayscale-0"
                        sizes="(min-width: 1280px) 18vw, (min-width: 1024px) 22vw, (min-width: 768px) 30vw, 50vw"
                      />
                    ) : (
                      <span className="font-mono text-[clamp(2rem,5vw,4rem)] tracking-[0.12em] text-white/58 grayscale transition-[opacity,transform,color] duration-500 group-hover:scale-[1.04] group-hover:text-white group-hover:opacity-100">
                        {partner.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 flex translate-y-3 items-end justify-between gap-4 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.78)_48%,rgba(0,0,0,0.94)_100%)] px-4 pb-4 pt-16 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 sm:px-5 sm:pb-5"
                  >
                    <span className="min-w-0 break-words text-sm font-medium text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.9)]">
                      {partner.name}
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 text-accent-yellow drop-shadow-[0_1px_10px_rgba(0,0,0,0.8)]" />
                  </span>
                </a>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
