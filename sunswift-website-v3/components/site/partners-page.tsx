import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { TransparentNavbar } from "@/components/site/transparent-navbar"
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
    </main>
  )
}
