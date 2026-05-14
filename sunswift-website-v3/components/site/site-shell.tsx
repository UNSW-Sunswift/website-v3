import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Gauge, Mail, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/who-we-are", label: "Who we are" },
  { href: "/what-we-do", label: "What we do" },
  { href: "/team", label: "Team" },
  { href: "/vehicles", label: "Vehicles" },
  { href: "/partners", label: "Partners" },
  { href: "/media", label: "Media" },
  { href: "/recruitment", label: "Recruitment" },
  { href: "/contact", label: "Contact" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full border border-primary/40 bg-primary/15 text-primary">
            <Zap className="size-4" />
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.28em]">Sunswift</span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Button key={item.href} asChild variant="ghost" size="sm">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>
        <Button asChild className="hidden sm:inline-flex" size="sm">
          <Link href="/recruitment">
            Join the team
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_2fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full border border-primary/40 bg-primary/15 text-primary">
              <Zap className="size-4" />
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.28em]">Sunswift Racing</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
            Student-led engineering for solar electric vehicles, built at UNSW in Sydney.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {navItems.slice(0, 8).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
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
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-primary">
      <Gauge className="size-3.5" />
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
    <section className={cn("mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28", className)}>
      <SectionLabel>{label}</SectionLabel>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <h1 className="max-w-4xl text-5xl font-medium leading-none tracking-normal sm:text-7xl">
          {title}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
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
    <div className={cn("relative overflow-hidden rounded-lg border border-border/70 bg-muted", className)}>
      <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-background/90 to-transparent p-4">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
        <Mail className="size-4 text-primary" />
      </div>
    </div>
  )
}
