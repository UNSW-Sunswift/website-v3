import Image from "next/image"
import Link from "next/link"
import type { CSSProperties } from "react"
import { ArrowRight, ArrowUpRight } from "lucide-react"

import { TransparentNavbar } from "@/components/site/transparent-navbar"
import { assetUrl } from "@/lib/cms/dynamodb"
import type { Partner } from "@/lib/cms/types"

const partnerIntro =
  "Building world-class cars takes more than just engineering - it takes a community. From partners and sponsors to long-time friends of the team, Sunswift is powered by collaboration, mentorship, and shared ambition."

const partnersHeroMediaPath = "/media/partners-picture.avif"

export function PartnersPageContent({ partners }: { partners: Partner[] }) {
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
              src={partnersHeroMediaPath}
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
        className="relative border-t border-white/10 bg-[#050607] px-4 py-16 sm:px-6 lg:py-20"
      >
        <div className="mx-auto max-w-[92rem]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="partners-grid-enter">
              <p className="font-mono text-[0.62rem] tracking-[0.22em] text-accent-yellow uppercase">
                Collaboration network
              </p>
              <h2 className="mt-3 max-w-xl text-3xl font-light tracking-tight text-white sm:text-4xl">
                Partners and sponsors
              </h2>
            </div>
            <p className="partners-grid-enter partners-grid-enter-delay-header-sub max-w-md text-sm leading-6 text-white/50">
              Logo tiles link out to partner websites whenever we publish a URL.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {partners.map((partner, index) => {
              const href = partner.website || "#"
              const isExternal = href !== "#" && /^https?:\/\//.test(href)

              return (
                <a
                  key={partner.slug}
                  data-partner-card
                  href={href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer" : undefined}
                  style={
                    {
                      "--partner-card-enter-delay": `${Math.min(index, 14) * 42}ms`,
                    } as CSSProperties
                  }
                  className="partner-grid-card-enter group flex min-h-36 flex-col justify-between border border-white/10 bg-white/[0.035] p-4 text-white transition-[background-color,border-color] duration-300 motion-safe:[transition-property:background-color,border-color,transform] motion-safe:hover:-translate-y-0.5 hover:border-accent-yellow/70 hover:bg-white/[0.07] motion-safe:active:scale-[0.97] motion-safe:active:border-accent-yellow/85 motion-safe:active:shadow-[0_0_0_1px_rgba(245,208,0,0.35)] motion-safe:active:duration-100 motion-reduce:active:scale-100 focus-visible:ring-3 focus-visible:ring-accent-yellow/35 focus-visible:outline-none"
                >
                  <span className="relative flex h-16 items-center justify-center overflow-hidden bg-black/16">
                    {partner.logoKey ? (
                      <Image
                        src={assetUrl(partner.logoKey)}
                        alt=""
                        fill
                        className="object-contain p-3 brightness-0 invert"
                        sizes="(min-width: 1280px) 18vw, (min-width: 1024px) 24vw, 50vw"
                      />
                    ) : (
                      <span className="font-mono text-2xl tracking-[0.12em] text-white/72">
                        {partner.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </span>
                  <span className="mt-5 flex items-end justify-between gap-3">
                    <span className="min-w-0 break-words text-sm font-medium text-white/82">
                      {partner.name}
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 text-white/28 transition-colors duration-300 group-hover:text-accent-yellow" />
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
