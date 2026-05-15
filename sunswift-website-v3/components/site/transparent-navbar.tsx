import Link from "next/link"

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
              className="text-sm font-medium text-white/85 transition-colors duration-300 hover:text-accent-yellow group-focus-within:text-accent-yellow group-hover:text-accent-yellow"
            >
              About Us
            </button>
            <div className="pointer-events-none absolute left-1/2 top-full w-52 -translate-x-1/2 pt-4 opacity-0 transition-[opacity,transform] duration-300 ease-out group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
              <div className="border border-white/15 bg-black/60 p-2 shadow-2xl shadow-black/35 backdrop-blur-xl">
                <Link
                  href="/who-we-are"
                  className="block px-3 py-2 text-sm text-white/80 transition-colors duration-300 hover:text-accent-yellow"
                >
                  Who We Are
                </Link>
                <Link
                  href="/achievements"
                  className="block px-3 py-2 text-sm text-white/80 transition-colors duration-300 hover:text-accent-yellow"
                >
                  Achievements
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
