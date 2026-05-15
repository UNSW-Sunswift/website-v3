import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const navItems = [
  { href: "/team", label: "Our Team" },
  { href: "/vehicles", label: "Vehicles" },
  { href: "/partners", label: "Partners" },
  { href: "/media", label: "Media" },
  { href: "/recruitment", label: "Recruitment" },
  { href: "/contact", label: "Contact" },
]

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
              className="inline-flex items-center gap-1.5 text-sm font-medium text-black/75 transition-colors duration-300 hover:text-accent-yellow group-focus-within:text-accent-yellow group-hover:text-accent-yellow"
              aria-haspopup="true"
            >
              About Us
              <ChevronDown
                aria-hidden="true"
                className="size-3.5 transition-transform duration-300 ease-out group-focus-within:rotate-180 group-hover:rotate-180"
              />
            </button>
            <div className="pointer-events-none absolute left-1/2 top-full w-[18rem] -translate-x-1/2 translate-y-2 pt-5 opacity-0 transition-[opacity,transform] duration-300 ease-out group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
              <div className="relative overflow-hidden border border-black/10 bg-white/72 p-1 shadow-[0_28px_80px_rgba(0,0,0,0.16)] backdrop-blur-2xl">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-yellow to-transparent" />
                <Link
                  href="/who-we-are"
                  className="group/item flex items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors duration-300 hover:bg-black/[0.04]"
                >
                  <span>
                    <span className="block text-sm font-medium text-black">Who We Are</span>
                    <span className="mt-1 block text-[0.68rem] uppercase tracking-[0.22em] text-black/45">
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
                    <span className="block text-sm font-medium text-black">Achievements</span>
                    <span className="mt-1 block text-[0.68rem] uppercase tracking-[0.22em] text-black/45">
                      Records
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
        </nav>
        <Link
          href="/recruitment"
          className="hidden items-center gap-2 border border-black/80 bg-transparent px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-black transition-[background-color,color,border-color] duration-300 ease-out hover:border-accent-yellow hover:bg-accent-yellow hover:text-black sm:inline-flex"
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
    <footer className="border-t border-black/10 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/55">
      <div className="mx-auto grid max-w-[92rem] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_2fr]">
        <div>
          <Link
            href="/"
            className="text-sm font-semibold tracking-wide text-black"
          >
            Sunswift Racing
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-black/60">
            Student-led engineering for solar electric vehicles, built at UNSW
            in Sydney.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/who-we-are"
            className="text-sm text-black/70 transition-colors duration-300 hover:text-accent-yellow"
          >
            Who We Are
          </Link>
          <Link
            href="/achievements"
            className="text-sm text-black/70 transition-colors duration-300 hover:text-accent-yellow"
          >
            Achievements
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-black/70 transition-colors duration-300 hover:text-accent-yellow"
            >
              {item.label}
            </Link>
          ))}
        </div>
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
      <SiteFooter />
    </div>
  )
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2 border border-black/15 bg-white/60 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.24em] text-black/70 backdrop-blur-md">
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
    <section className={cn("mx-auto max-w-[92rem] px-4 pb-12 pt-24 sm:px-6 lg:pt-32", className)}>
      <SectionLabel>{label}</SectionLabel>
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <h1 className="max-w-4xl text-5xl font-light leading-[0.98] tracking-tight text-black sm:text-7xl lg:text-[5.5rem]">
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
        className,
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
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-black/80">
          {label}
        </span>
      </div>
    </div>
  )
}
