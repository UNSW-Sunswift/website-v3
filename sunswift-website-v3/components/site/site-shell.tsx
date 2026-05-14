import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

const navItems = [
  { href: "/who-we-are", label: "About Us" },
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
