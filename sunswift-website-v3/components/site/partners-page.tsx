import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

import { TransparentNavbar } from "@/components/site/transparent-navbar"

const partnerIntro =
  "Building world-class cars takes more than just engineering - it takes a community. From partners and sponsors to long-time friends of the team, Sunswift is powered by collaboration, mentorship, and shared ambition."

const partners = [
  { name: "3M", href: "https://www.3m.com.au" },
  { name: "Altium", href: "https://www.altium.com/" },
  { name: "Ampcontrol", href: "https://ampcontrolgroup.com/" },
  { name: "Audi", href: "https://www.audi.com.au/en/" },
  { name: "Australian Made", href: "https://australianmade.com.au/" },
  { name: "Auto-UX", href: "https://www.auto-ux.io/" },
  { name: "AWS", href: "https://aws.amazon.com/" },
  { name: "BAC Systems", href: "https://www.bacsystems.com.au/" },
  { name: "Bilstein", href: "https://bilstein.com/en/" },
  { name: "Bridgestone", href: "https://www.bridgestone.com/" },
  { name: "Calm Aluminium", href: "http://www.calm-aluminium.com.au/" },
  { name: "Competition Friction", href: "#" },
  { name: "CUPRA", href: "https://www.cupraofficial.com.au/" },
  { name: "D2N", href: "https://d2n.com.au/" },
  { name: "Dassault Systemes", href: "https://www.3ds.com/" },
  { name: "EPLAN", href: "https://www.eplan-software.com/" },
  { name: "Ericsson", href: "https://www.ericsson.com/en" },
  { name: "Espresso Displays", href: "https://au.espres.so/" },
  { name: "Finsbury Green", href: "https://finsbury.com.au/" },
  { name: "Jaycar", href: "https://www.jaycar.com.au/" },
  { name: "LEAP Australia", href: "https://www.leapaust.com.au/" },
  {
    name: "Master Instruments",
    href: "https://www.master-instruments.com.au/",
  },
  { name: "McConaghy", href: "http://www.mcconaghyboats.com/" },
  { name: "Optus", href: "https://www.optus.com.au/" },
  { name: "P-ONE Technology", href: "https://www.p-onetechnology.com/" },
  { name: "Scott Bader", href: "https://www.scottbader.com/" },
  { name: "Siltrax", href: "https://www.siltrax.net/" },
  {
    name: "Sorensen Engineering",
    href: "https://www.sorensenengineering.com.au/",
  },
  { name: "SunDrive", href: "https://www.sundrivesolar.com/" },
  { name: "SXSW Sydney", href: "https://www.sxswsydney.com/" },
  {
    name: "Sydney Motorsport Park",
    href: "https://www.sydneymotorsportpark.com.au/",
  },
  { name: "Total Tools", href: "https://www.totaltools.com.au/" },
  { name: "TRaCE", href: "https://trace.org.au/" },
  { name: "UNSW", href: "https://www.unsw.edu.au/" },
  { name: "WrapStyle Sydney", href: "https://wrapstylesydney.com.au/" },
]

function initials(name: string) {
  return name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export function PartnersPageContent() {
  const marqueePartners = [...partners, ...partners]

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
                <a
                  href="#partner-grid"
                  className="inline-flex items-center gap-3 border border-white/20 px-5 py-3 font-mono text-[0.68rem] tracking-[0.24em] text-white uppercase transition-colors duration-300 hover:border-white hover:bg-white hover:text-black"
                >
                  View grid
                  <ArrowRight className="size-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section
        data-partners-marquee
        className="border-y border-white/10 bg-white/[0.035] py-3 backdrop-blur-xl"
        aria-label="Partner banner"
      >
        <div className="partner-marquee flex w-max gap-2">
          {marqueePartners.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              data-partner-marquee-card
              className="flex h-10 min-w-28 items-center justify-center gap-2 border border-white/12 bg-white/[0.055] px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_14px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl"
            >
              <span className="grid size-6 place-items-center border border-white/10 bg-white/[0.06] font-mono text-[0.56rem] text-accent-yellow">
                {initials(partner.name)}
              </span>
              <span className="max-w-20 truncate font-mono text-[0.58rem] tracking-[0.16em] text-white/58 uppercase">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section
        id="partner-grid"
        className="bg-[#0a0c0e] py-20 text-white lg:py-28"
      >
        <div className="mx-auto max-w-[92rem] px-4 sm:px-6">
          <div className="mb-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="font-mono text-[0.68rem] tracking-[0.28em] text-white/38 uppercase">
                Partner grid
              </p>
              <h2 className="mt-4 max-w-3xl text-5xl leading-[0.98] font-light tracking-normal text-white sm:text-7xl">
                Powered by shared ambition.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-white/56 sm:text-lg">
              Interested in supporting our mission? These cards are placeholder
              logo frames for now, ready to be swapped for production partner
              marks when final assets are available.
            </p>
          </div>

          <div
            className="mx-auto grid max-w-[76rem] grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
            data-partners-grid
          >
            {partners.map((partner, index) => {
              const external = partner.href !== "#"
              const content = (
                <>
                  <span className="grid size-20 place-items-center border border-white/12 bg-white/[0.035] text-3xl font-light tracking-normal text-accent-yellow transition-colors duration-300 group-hover:border-accent-yellow/35 group-hover:bg-accent-yellow/10 sm:size-24 sm:text-4xl">
                    {initials(partner.name)}
                  </span>
                  <span className="mt-7 block max-w-[13ch] text-center text-xl leading-tight font-light text-white sm:text-2xl">
                    {partner.name}
                  </span>
                  <span className="absolute right-4 bottom-4 flex items-center gap-2 font-mono text-[0.54rem] tracking-[0.18em] text-white/34 uppercase">
                    {String(index + 1).padStart(2, "0")}
                    {external ? <ArrowUpRight className="size-3.5" /> : null}
                  </span>
                </>
              )

              return external ? (
                <a
                  key={partner.name}
                  href={partner.href}
                  target="_blank"
                  rel="noreferrer"
                  data-partner-card
                  className="group relative flex aspect-square items-center justify-center overflow-hidden border border-white/12 bg-white/[0.045] p-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-colors duration-300 hover:border-accent-yellow/50 hover:bg-white/[0.075]"
                >
                  <span className="flex flex-col items-center justify-center">
                    {content}
                  </span>
                </a>
              ) : (
                <div
                  key={partner.name}
                  data-partner-card
                  className="relative flex aspect-square items-center justify-center overflow-hidden border border-white/12 bg-white/[0.045] p-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl"
                >
                  <span className="flex flex-col items-center justify-center">
                    {content}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
