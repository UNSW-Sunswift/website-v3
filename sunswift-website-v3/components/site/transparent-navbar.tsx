import Link from "next/link"
import { ArrowUpRight, ChevronDown } from "lucide-react"

const navItems = [
  { href: "/team", label: "Our Team" },
  { href: "/vehicles", label: "Vehicles" },
  { href: "/partners", label: "Partners" },
  { href: "/media", label: "Media" },
  { href: "/recruitment", label: "Recruitment" },
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
          className="text-sm font-semibold tracking-wide text-white/95 transition-colors duration-300 hover:text-accent-yellow"
        >
          Sunswift Racing
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          <div data-about-dropdown className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/85 transition-colors duration-300 hover:text-accent-yellow group-focus-within:text-accent-yellow group-hover:text-accent-yellow"
              aria-haspopup="true"
            >
              About Us
              <ChevronDown
                aria-hidden="true"
                className="size-3.5 transition-transform duration-300 ease-out group-focus-within:rotate-180 group-hover:rotate-180"
              />
            </button>
            <div className="pointer-events-none absolute left-1/2 top-full w-[18rem] -translate-x-1/2 translate-y-2 pt-5 opacity-0 transition-[opacity,transform] duration-300 ease-out group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
              <div className="relative overflow-hidden border border-white/15 bg-black/50 p-1 shadow-[0_28px_80px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-yellow/80 to-transparent" />
                <Link
                  href="/who-we-are"
                  className="group/item flex items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors duration-300 hover:bg-white/10"
                >
                  <span>
                    <span className="block text-sm font-medium text-white">Who We Are</span>
                    <span className="mt-1 block text-[0.68rem] uppercase tracking-[0.22em] text-white/45">
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
                    <span className="block text-sm font-medium text-white">Achievements</span>
                    <span className="mt-1 block text-[0.68rem] uppercase tracking-[0.22em] text-white/45">
                      Records
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
        </nav>
        <Link
          href="/recruitment"
          data-cta-join
          className="hidden rounded-full border border-white/40 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-white/90 transition-[background-color,color,border-color] duration-300 ease-out hover:border-accent-yellow hover:bg-accent-yellow hover:text-black sm:inline-flex"
        >
          Join the team
        </Link>
      </div>
    </header>
  )
}
