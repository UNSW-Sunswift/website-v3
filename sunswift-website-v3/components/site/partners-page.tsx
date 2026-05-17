import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

import { TransparentNavbar } from "@/components/site/transparent-navbar"
import { assetUrl } from "@/lib/cms/dynamodb"
import type { Partner } from "@/lib/cms/types"

const partnerIntro =
  "Building world-class cars takes more than just engineering - it takes a community. From partners and sponsors to long-time friends of the team, Sunswift is powered by collaboration, mentorship, and shared ambition."

export function PartnersPageContent({ partners }: { partners: Partner[] }) {
  return (
    <main
      data-partners-page
      className="overflow-hidden bg-[#0a0c0e] text-white"
    >
      <div className="relative">
        <TransparentNavbar />
        <section className="relative min-h-[86svh] overflow-hidden bg-[#0a0c0e]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_16%,rgba(245,208,0,0.12)_0%,transparent_32%),linear-gradient(180deg,#050607_0%,#0a0c0e_64%,#050607_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,#000_0%,rgba(10,12,14,0)_100%)]" />
          <div className="relative mx-auto grid min-h-[86svh] max-w-[92rem] gap-12 px-4 pt-28 pb-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:pt-36 lg:pb-20">
            <div>
              <p className="font-mono text-[0.68rem] tracking-[0.28em] text-accent-yellow uppercase">
                Collaboration network
              </p>
              <h1 className="mt-5 max-w-5xl text-[clamp(4.2rem,11vw,11rem)] leading-[0.86] font-thin tracking-normal text-white">
                Partners.
              </h1>
            </div>
            <div className="max-w-xl lg:pb-4">
              <p className="text-lg leading-8 text-white/62">{partnerIntro}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 border border-accent-yellow bg-accent-yellow px-5 py-3 font-mono text-[0.68rem] tracking-[0.24em] text-black uppercase transition-colors duration-300 hover:bg-white"
                >
                  Contact us
                  <ArrowRight className="size-4" />
                </Link>
              </div>
              <p className="mt-6 font-mono text-[0.62rem] tracking-[0.22em] text-white/36 uppercase">
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
            <div>
              <p className="font-mono text-[0.68rem] tracking-[0.28em] text-accent-yellow uppercase">
                Current supporters
              </p>
              <h2 className="mt-3 text-3xl leading-tight font-light text-white sm:text-5xl">
                Partners and sponsors
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-white/50">
              The organisations backing Sunswift through tooling, mentorship,
              infrastructure, materials and race support.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {partners.map((partner) => {
              const href = partner.website || "#"
              const isExternal = href !== "#" && /^https?:\/\//.test(href)

              return (
                <a
                  key={partner.slug}
                  data-partner-card
                  href={href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer" : undefined}
                  className="group flex min-h-36 flex-col justify-between border border-white/10 bg-white/[0.035] p-4 text-white transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-accent-yellow/70 hover:bg-white/[0.07] focus-visible:ring-3 focus-visible:ring-accent-yellow/35 focus-visible:outline-none"
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
