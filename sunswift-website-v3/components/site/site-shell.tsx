import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  Asterisk,
  ChevronDown,
  Menu,
} from "lucide-react"

import {
  recruitmentStreamHref,
  recruitmentStreams,
} from "@/components/site/recruitment-content"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/team", label: "Our Team" },
  { href: "/vehicles", label: "Vehicles" },
  { href: "/partners", label: "Partners" },
  { href: "/media", label: "Media" },
  { href: "/contact", label: "Contact" },
]

const footerUnswLogoSrc = "/brand/unsw-sydney-dark.png?v=20260515-footer"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/55">
      <div className="mx-auto flex h-16 max-w-[92rem] items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-wide text-black transition-colors duration-300 hover:text-accent-yellow"
        >
          Sunswift Racing
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          <div data-about-dropdown className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-black/75 transition-colors duration-300 group-focus-within:text-accent-yellow group-hover:text-accent-yellow hover:text-accent-yellow"
              aria-haspopup="true"
            >
              About Us
              <ChevronDown
                aria-hidden="true"
                className="size-3.5 transition-transform duration-300 ease-out group-focus-within:rotate-180 group-hover:rotate-180"
              />
            </button>
            <div className="pointer-events-none absolute top-full left-1/2 w-[18rem] -translate-x-1/2 translate-y-2 pt-5 opacity-0 transition-[opacity,transform] duration-300 ease-out group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
              <div className="relative overflow-hidden border border-black/10 bg-white/72 p-1 shadow-[0_28px_80px_rgba(0,0,0,0.16)] backdrop-blur-2xl">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-yellow to-transparent" />
                <Link
                  href="/who-we-are"
                  className="group/item flex items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors duration-300 hover:bg-black/[0.04]"
                >
                  <span>
                    <span className="block text-sm font-medium text-black">
                      Who We Are
                    </span>
                    <span className="mt-1 block text-[0.68rem] tracking-[0.22em] text-black/45 uppercase">
                      Mission
                    </span>
                  </span>
                  <ArrowUpRight className="size-3.5 text-black/35 transition-colors duration-300 group-hover/item:text-accent-yellow" />
                </Link>
                <Link
                  href="/achievements"
                  className="group/item flex items-center justify-between gap-4 border-t border-black/10 px-4 py-3.5 text-left transition-colors duration-300 hover:bg-black/[0.04]"
                >
                  <span>
                    <span className="block text-sm font-medium text-black">
                      Achievements
                    </span>
                    <span className="mt-1 block text-[0.68rem] tracking-[0.22em] text-black/45 uppercase">
                      Records
                    </span>
                  </span>
                  <ArrowUpRight className="size-3.5 text-black/35 transition-colors duration-300 group-hover/item:text-accent-yellow" />
                </Link>
                <Link
                  href="/our-story"
                  className="group/item flex items-center justify-between gap-4 border-t border-black/10 px-4 py-3.5 text-left transition-colors duration-300 hover:bg-black/[0.04]"
                >
                  <span>
                    <span className="block text-sm font-medium text-black">
                      Our Story
                    </span>
                    <span className="mt-1 block text-[0.68rem] tracking-[0.22em] text-black/45 uppercase">
                      History
                    </span>
                  </span>
                  <ArrowUpRight className="size-3.5 text-black/35 transition-colors duration-300 group-hover/item:text-accent-yellow" />
                </Link>
              </div>
            </div>
          </div>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-black/75 transition-colors duration-300 hover:text-accent-yellow"
            >
              {item.label}
            </Link>
          ))}
          <div data-recruitment-dropdown className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-black/75 transition-colors duration-300 group-focus-within:text-accent-yellow group-hover:text-accent-yellow hover:text-accent-yellow"
              aria-haspopup="true"
            >
              Recruitment
              <ChevronDown
                aria-hidden="true"
                className="size-3.5 transition-transform duration-300 ease-out group-focus-within:rotate-180 group-hover:rotate-180"
              />
            </button>
            <div className="pointer-events-none absolute top-full left-1/2 w-[18rem] -translate-x-1/2 translate-y-2 pt-5 opacity-0 transition-[opacity,transform] duration-300 ease-out group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
              <div className="relative overflow-hidden border border-black/10 bg-white/72 p-1 shadow-[0_28px_80px_rgba(0,0,0,0.16)] backdrop-blur-2xl">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-yellow to-transparent" />
                <Link
                  href="/recruitment"
                  className="group/item flex items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors duration-300 hover:bg-black/[0.04]"
                >
                  <span>
                    <span className="block text-sm font-medium text-black">
                      Recruitment Hub
                    </span>
                    <span className="mt-1 block text-[0.68rem] tracking-[0.22em] text-black/45 uppercase">
                      Streams
                    </span>
                  </span>
                  <ArrowUpRight className="size-3.5 text-black/35 transition-colors duration-300 group-hover/item:text-accent-yellow" />
                </Link>
                {recruitmentStreams.map((stream) => (
                  <Link
                    key={stream.name}
                    href={recruitmentStreamHref(stream)}
                    className="group/item flex items-center justify-between gap-4 border-t border-black/10 px-4 py-3.5 text-left transition-colors duration-300 hover:bg-black/[0.04]"
                  >
                    <span>
                      <span className="block text-sm font-medium text-black">
                        {stream.roleTitle}
                      </span>
                      <span className="mt-1 block text-[0.68rem] tracking-[0.22em] text-black/45 uppercase">
                        {stream.label}
                      </span>
                    </span>
                    <ArrowUpRight className="size-3.5 text-black/35 transition-colors duration-300 group-hover/item:text-accent-yellow" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>
        <details
          data-mobile-nav
          className="group/mobile relative ml-auto lg:hidden"
        >
          <summary
            className="grid size-10 cursor-pointer list-none place-items-center border border-black/15 bg-white/55 text-black backdrop-blur-xl transition-colors duration-300 hover:border-accent-yellow hover:text-accent-yellow [&::-webkit-details-marker]:hidden"
            aria-label="Open navigation"
          >
            <Menu className="size-4" />
          </summary>
          <div className="absolute top-full right-0 mt-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden border border-black/10 bg-white/82 p-1 text-black shadow-[0_28px_80px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-yellow to-transparent" />

            <details className="group/about border-b border-black/10">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 text-sm font-medium text-black [&::-webkit-details-marker]:hidden">
                About Us
                <ChevronDown className="size-4 text-accent-yellow transition-transform duration-300 group-open/about:rotate-180" />
              </summary>
              <div className="border-t border-black/10 bg-black/[0.025]">
                <Link
                  href="/who-we-are"
                  className="flex items-center justify-between px-4 py-3 text-sm text-black/70"
                >
                  Who We Are
                  <ArrowUpRight className="size-3.5 text-black/35" />
                </Link>
                <Link
                  href="/achievements"
                  className="flex items-center justify-between border-t border-black/10 px-4 py-3 text-sm text-black/70"
                >
                  Achievements
                  <ArrowUpRight className="size-3.5 text-black/35" />
                </Link>
                <Link
                  href="/our-story"
                  className="flex items-center justify-between border-t border-black/10 px-4 py-3 text-sm text-black/70"
                >
                  Our Story
                  <ArrowUpRight className="size-3.5 text-black/35" />
                </Link>
              </div>
            </details>

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between border-b border-black/10 px-4 py-3.5 text-sm font-medium text-black/72"
              >
                {item.label}
                <ArrowUpRight className="size-3.5 text-black/35" />
              </Link>
            ))}

            <details className="group/recruitment border-b border-black/10">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 text-sm font-medium text-black [&::-webkit-details-marker]:hidden">
                Recruitment
                <ChevronDown className="size-4 text-accent-yellow transition-transform duration-300 group-open/recruitment:rotate-180" />
              </summary>
              <div className="border-t border-black/10 bg-black/[0.025]">
                <Link
                  href="/recruitment"
                  className="flex items-center justify-between px-4 py-3 text-sm text-black/70"
                >
                  Recruitment Hub
                  <ArrowUpRight className="size-3.5 text-black/35" />
                </Link>
                {recruitmentStreams.map((stream) => (
                  <Link
                    key={stream.name}
                    href={recruitmentStreamHref(stream)}
                    className="flex items-center justify-between border-t border-black/10 px-4 py-3 text-sm text-black/70"
                  >
                    {stream.roleTitle}
                    <ArrowUpRight className="size-3.5 text-black/35" />
                  </Link>
                ))}
              </div>
            </details>

            <Link
              href="/recruitment"
              className="mt-1 flex items-center justify-between bg-accent-yellow px-4 py-3.5 font-mono text-[0.66rem] tracking-[0.22em] text-black uppercase"
            >
              Join the team
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </details>
        <Link
          href="/recruitment"
          className="hidden items-center gap-2 border border-black/80 bg-transparent px-4 py-1.5 text-xs font-medium tracking-[0.18em] text-black uppercase transition-[background-color,color,border-color] duration-300 ease-out hover:border-accent-yellow hover:bg-accent-yellow hover:text-black sm:inline-flex"
        >
          Join the team
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer
      data-site-footer
      className="relative isolate z-20 bg-[#0a0c0e] text-white shadow-[0_-64px_140px_rgba(0,0,0,0.52)] before:pointer-events-none before:absolute before:inset-x-0 before:-top-32 before:h-32 before:bg-[linear-gradient(180deg,rgba(5,6,7,0)_0%,rgba(10,12,14,0.42)_34%,rgba(10,12,14,0.88)_76%,#0a0c0e_100%)]"
    >
      <div className="relative z-10 mx-auto grid max-w-[92rem] gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[13rem_1fr_auto] lg:items-center lg:gap-6">
        <div className="flex items-center">
          <Link href="/" aria-label="Sunswift Racing home" className="block">
            <Image
              src={footerUnswLogoSrc}
              alt="UNSW Sydney"
              width={260}
              height={78}
              unoptimized
              className="h-auto w-40 object-contain sm:w-48 lg:w-52"
              sizes="12rem"
            />
          </Link>
        </div>

        <div className="min-w-0">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
            <h2 className="shrink-0 text-base leading-none font-light tracking-normal text-white sm:text-lg">
              Sunswift Racing
            </h2>
            <p className="truncate text-xs leading-5 text-white/48 sm:text-sm">
              Room G14, Blockhouse (G6), University Mall, UNSW, Kensington NSW
              2052
            </p>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.58rem] tracking-[0.2em] text-white/34 uppercase">
            <span>Copyright © 2025</span>
            <Link
              href="/"
              className="underline decoration-white/20 underline-offset-4 transition-colors duration-300 hover:text-white"
            >
              Credits
            </Link>
          </div>
        </div>

        <Link
          href="https://linktr.ee/sunswiftracing"
          target="_blank"
          rel="noreferrer"
          className="group inline-flex h-10 items-center justify-center gap-3 border border-white/18 bg-white/[0.03] px-4 font-mono text-[0.62rem] tracking-[0.22em] text-white uppercase transition-colors duration-300 hover:border-accent-yellow hover:bg-accent-yellow hover:text-black sm:h-11 sm:px-5"
        >
          <Asterisk className="size-3.5 transition-transform duration-500 group-hover:rotate-90" />
          Stay connected
          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </footer>
  )
}

export function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-white text-black selection:bg-accent-yellow/40">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.04)_0%,transparent_60%)]"
      />
      <SiteHeader />
      <main>{children}</main>
    </div>
  )
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2 border border-black/15 bg-white/60 px-2.5 py-1 font-mono text-[0.65rem] tracking-[0.24em] text-black/70 uppercase backdrop-blur-md">
      {children}
    </div>
  )
}

export function PageIntro({
  label,
  title,
  description,
  className,
}: {
  label: string
  title: string
  description: string
  className?: string
}) {
  return (
    <section
      className={cn(
        "mx-auto max-w-[92rem] px-4 pt-24 pb-12 sm:px-6 lg:pt-32",
        className
      )}
    >
      <SectionLabel>{label}</SectionLabel>
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <h1 className="max-w-4xl text-5xl leading-[0.98] font-light tracking-tight text-black sm:text-7xl lg:text-[5.5rem]">
          {title}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-black/65 sm:text-lg">
          {description}
        </p>
      </div>
    </section>
  )
}

export function ImagePanel({
  src,
  alt,
  label,
  className,
}: {
  src: string
  alt: string
  label: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border border-black/10 bg-black/[0.03]",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(min-width: 1024px) 50vw, 100vw"
      />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/30 bg-white/30 px-4 py-3 backdrop-blur-md">
        <span className="font-mono text-[0.65rem] tracking-[0.24em] text-black/80 uppercase">
          {label}
        </span>
      </div>
    </div>
  )
}
