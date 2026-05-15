import Link from "next/link"
import { ArrowUpRight, ChevronDown, Menu } from "lucide-react"

import { SunswiftBrandLogo } from "@/components/site/brand-logo"
import {
  recruitmentStreamHref,
  recruitmentStreams,
} from "@/components/site/recruitment-content"

const navItems = [
  { href: "/team", label: "Our Team" },
  { href: "/vehicles", label: "Vehicles" },
  { href: "/partners", label: "Partners" },
  { href: "/media", label: "Media" },
  { href: "/contact", label: "Contact" },
]

export function TransparentNavbar() {
  return (
    <header
      data-homepage-navbar
      className="absolute inset-x-0 top-0 z-50 bg-transparent text-white"
    >
      <div className="mx-auto flex h-16 max-w-[92rem] items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="block transition-opacity duration-300 hover:opacity-80"
          aria-label="Sunswift Racing home"
        >
          <SunswiftBrandLogo priority className="w-32 sm:w-40" />
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          <div data-about-dropdown className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/85 transition-colors duration-300 group-focus-within:text-accent-yellow group-hover:text-accent-yellow hover:text-accent-yellow"
              aria-haspopup="true"
            >
              About Us
              <ChevronDown
                aria-hidden="true"
                className="size-3.5 transition-transform duration-300 ease-out group-focus-within:rotate-180 group-hover:rotate-180"
              />
            </button>
            <div className="pointer-events-none absolute top-full left-1/2 w-[18rem] -translate-x-1/2 translate-y-2 pt-5 opacity-0 transition-[opacity,transform] duration-300 ease-out group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
              <div className="relative overflow-hidden border border-white/15 bg-black/50 p-1 shadow-[0_28px_80px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-yellow/80 to-transparent" />
                <Link
                  href="/who-we-are"
                  className="group/item flex items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors duration-300 hover:bg-white/10"
                >
                  <span>
                    <span className="block text-sm font-medium text-white">
                      Who We Are
                    </span>
                    <span className="mt-1 block text-[0.68rem] tracking-[0.22em] text-white/45 uppercase">
                      Mission
                    </span>
                  </span>
                  <ArrowUpRight className="size-3.5 text-white/35 transition-colors duration-300 group-hover/item:text-accent-yellow" />
                </Link>
                <Link
                  href="/achievements"
                  className="group/item flex items-center justify-between gap-4 border-t border-white/10 px-4 py-3.5 text-left transition-colors duration-300 hover:bg-white/10"
                >
                  <span>
                    <span className="block text-sm font-medium text-white">
                      Achievements
                    </span>
                    <span className="mt-1 block text-[0.68rem] tracking-[0.22em] text-white/45 uppercase">
                      Records
                    </span>
                  </span>
                  <ArrowUpRight className="size-3.5 text-white/35 transition-colors duration-300 group-hover/item:text-accent-yellow" />
                </Link>
                <Link
                  href="/our-story"
                  className="group/item flex items-center justify-between gap-4 border-t border-white/10 px-4 py-3.5 text-left transition-colors duration-300 hover:bg-white/10"
                >
                  <span>
                    <span className="block text-sm font-medium text-white">
                      Our Story
                    </span>
                    <span className="mt-1 block text-[0.68rem] tracking-[0.22em] text-white/45 uppercase">
                      History
                    </span>
                  </span>
                  <ArrowUpRight className="size-3.5 text-white/35 transition-colors duration-300 group-hover/item:text-accent-yellow" />
                </Link>
              </div>
            </div>
          </div>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white/85 transition-colors duration-300 hover:text-accent-yellow"
            >
              {item.label}
            </Link>
          ))}
          <div data-recruitment-dropdown className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/85 transition-colors duration-300 group-focus-within:text-accent-yellow group-hover:text-accent-yellow hover:text-accent-yellow"
              aria-haspopup="true"
            >
              Recruitment
              <ChevronDown
                aria-hidden="true"
                className="size-3.5 transition-transform duration-300 ease-out group-focus-within:rotate-180 group-hover:rotate-180"
              />
            </button>
            <div className="pointer-events-none absolute top-full left-1/2 w-[18rem] -translate-x-1/2 translate-y-2 pt-5 opacity-0 transition-[opacity,transform] duration-300 ease-out group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
              <div className="relative overflow-hidden border border-white/15 bg-black/50 p-1 shadow-[0_28px_80px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-yellow/80 to-transparent" />
                <Link
                  href="/recruitment"
                  className="group/item flex items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors duration-300 hover:bg-white/10"
                >
                  <span>
                    <span className="block text-sm font-medium text-white">
                      Recruitment Hub
                    </span>
                    <span className="mt-1 block text-[0.68rem] tracking-[0.22em] text-white/45 uppercase">
                      Streams
                    </span>
                  </span>
                  <ArrowUpRight className="size-3.5 text-white/35 transition-colors duration-300 group-hover/item:text-accent-yellow" />
                </Link>
                {recruitmentStreams.map((stream) => (
                  <Link
                    key={stream.name}
                    href={recruitmentStreamHref(stream)}
                    className="group/item flex items-center justify-between gap-4 border-t border-white/10 px-4 py-3.5 text-left transition-colors duration-300 hover:bg-white/10"
                  >
                    <span>
                      <span className="block text-sm font-medium text-white">
                        {stream.roleTitle}
                      </span>
                      <span className="mt-1 block text-[0.68rem] tracking-[0.22em] text-white/45 uppercase">
                        {stream.label}
                      </span>
                    </span>
                    <ArrowUpRight className="size-3.5 text-white/35 transition-colors duration-300 group-hover/item:text-accent-yellow" />
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
            className="grid size-10 cursor-pointer list-none place-items-center border border-white/25 bg-black/20 text-white backdrop-blur-xl transition-colors duration-300 hover:border-accent-yellow hover:text-accent-yellow [&::-webkit-details-marker]:hidden"
            aria-label="Open navigation"
          >
            <Menu className="size-4" />
          </summary>
          <div className="absolute top-full right-0 mt-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden border border-white/15 bg-black/72 p-1 text-white shadow-[0_28px_80px_rgba(0,0,0,0.48)] backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-yellow/80 to-transparent" />

            <details className="group/about border-b border-white/10">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 text-sm font-medium text-white [&::-webkit-details-marker]:hidden">
                About Us
                <ChevronDown className="size-4 text-accent-yellow transition-transform duration-300 group-open/about:rotate-180" />
              </summary>
              <div className="border-t border-white/10 bg-white/[0.035]">
                <Link
                  href="/who-we-are"
                  className="flex items-center justify-between px-4 py-3 text-sm text-white/75"
                >
                  Who We Are
                  <ArrowUpRight className="size-3.5 text-white/35" />
                </Link>
                <Link
                  href="/achievements"
                  className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-sm text-white/75"
                >
                  Achievements
                  <ArrowUpRight className="size-3.5 text-white/35" />
                </Link>
                <Link
                  href="/our-story"
                  className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-sm text-white/75"
                >
                  Our Story
                  <ArrowUpRight className="size-3.5 text-white/35" />
                </Link>
              </div>
            </details>

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between border-b border-white/10 px-4 py-3.5 text-sm font-medium text-white/82"
              >
                {item.label}
                <ArrowUpRight className="size-3.5 text-white/35" />
              </Link>
            ))}

            <details className="group/recruitment border-b border-white/10">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 text-sm font-medium text-white [&::-webkit-details-marker]:hidden">
                Recruitment
                <ChevronDown className="size-4 text-accent-yellow transition-transform duration-300 group-open/recruitment:rotate-180" />
              </summary>
              <div className="border-t border-white/10 bg-white/[0.035]">
                <Link
                  href="/recruitment"
                  className="flex items-center justify-between px-4 py-3 text-sm text-white/75"
                >
                  Recruitment Hub
                  <ArrowUpRight className="size-3.5 text-white/35" />
                </Link>
                {recruitmentStreams.map((stream) => (
                  <Link
                    key={stream.name}
                    href={recruitmentStreamHref(stream)}
                    className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-sm text-white/75"
                  >
                    {stream.roleTitle}
                    <ArrowUpRight className="size-3.5 text-white/35" />
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
          data-cta-join
          className="hidden rounded-full border border-white/40 px-4 py-1.5 text-xs font-medium tracking-[0.18em] text-white/90 uppercase transition-[background-color,color,border-color] duration-300 ease-out hover:border-accent-yellow hover:bg-accent-yellow hover:text-black sm:inline-flex"
        >
          Join the team
        </Link>
      </div>
    </header>
  )
}
