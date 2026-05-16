import Link from "next/link"
import { ArrowRight, Mail, MapPin, Share2 } from "lucide-react"

import { TransparentNavbar } from "@/components/site/transparent-navbar"

const contactEmail = "richard.hopkins1@unsw.edu.au"

const socialLinks = [
  {
    label: "Instagram",
    handle: "@sunswiftracing",
    href: "https://www.instagram.com/sunswiftracing/",
    platform: "instagram",
  },
  {
    label: "Facebook",
    handle: "Sunswift Racing",
    href: "https://www.facebook.com/UNSWSunswift/",
    platform: "facebook",
  },
  {
    label: "LinkedIn",
    handle: "Sunswift Racing",
    href: "https://www.linkedin.com/company/unsw-sunswift/",
    platform: "linkedin",
  },
] as const

export function ContactPageContent() {
  return (
    <main
      data-contact-page
      className="min-h-screen overflow-hidden bg-[#0a0c0e] text-white"
    >
      <div className="relative">
        <TransparentNavbar />
        <section className="relative min-h-[86svh] overflow-hidden bg-[#0a0c0e]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_16%,rgba(245,208,0,0.14)_0%,transparent_32%),linear-gradient(180deg,#050607_0%,#0a0c0e_64%,#050607_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,#000_0%,rgba(10,12,14,0)_100%)]" />
          <div className="relative mx-auto grid min-h-[86svh] max-w-[92rem] gap-12 px-4 pt-28 pb-14 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-end lg:pt-36 lg:pb-20">
            <div>
              <p className="font-mono text-[0.68rem] tracking-[0.28em] text-accent-yellow uppercase">
                Contact
              </p>
              <h1 className="mt-5 max-w-5xl text-[clamp(4.6rem,11vw,11rem)] leading-[0.86] font-thin tracking-normal text-white">
                Contact us.
              </h1>
            </div>
            <div className="max-w-xl lg:pb-4">
              <p className="text-lg leading-8 text-white/62">
                For partnerships, media, recruitment and general enquiries,
                email Sunswift Racing directly. The form has been removed so
                messages route to the team without another inbox layer.
              </p>
              <a
                href={`mailto:${contactEmail}`}
                data-contact-email-link
                className="mt-8 inline-flex items-center gap-3 border border-accent-yellow bg-accent-yellow px-5 py-3 font-mono text-[0.68rem] tracking-[0.24em] text-black uppercase transition-colors duration-300 hover:bg-white"
              >
                Email Richard Hopkins
                <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
        </section>
      </div>

      <section className="border-y border-white/10 bg-white/[0.035] text-white">
        <div className="mx-auto grid max-w-[92rem] gap-px bg-white/10 px-4 py-px sm:px-6 lg:grid-cols-3">
          <article className="bg-[#0f1113] p-6 sm:p-8">
            <Mail className="size-5 text-accent-yellow" />
            <p className="mt-12 font-mono text-[0.62rem] tracking-[0.24em] text-white/38 uppercase">
              Direct email
            </p>
            <h2 className="mt-3 text-3xl leading-tight font-light text-white sm:text-4xl">
              Send your enquiry straight to the team.
            </h2>
            <a
              href={`mailto:${contactEmail}`}
              className="mt-8 inline-block break-all text-lg leading-7 text-white/72 transition-colors duration-300 hover:text-accent-yellow"
            >
              {contactEmail}
            </a>
          </article>
          <article
            data-contact-socials
            className="bg-[#0f1113] p-6 sm:p-8"
          >
            <Share2 className="size-5 text-accent-yellow" />
            <p className="mt-12 font-mono text-[0.62rem] tracking-[0.24em] text-white/38 uppercase">
              Social media
            </p>
            <h2 className="mt-3 text-3xl leading-tight font-light text-white sm:text-4xl">
              Message us online.
            </h2>
            <p className="mt-8 max-w-md text-lg leading-8 text-white/62">
              For quick questions and community updates, reach out on Instagram,
              Facebook, or LinkedIn!
            </p>
            <ul className="mt-8 flex flex-col gap-3">
              {socialLinks.map((item) => (
                <li key={item.platform}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-contact-social-link
                    data-social-platform={item.platform}
                    className="group flex flex-col rounded-sm border border-white/12 bg-black/25 px-4 py-3.5 transition-[background-color,border-color] duration-300 hover:border-accent-yellow/45 hover:bg-white/[0.06]"
                  >
                    <span className="text-base font-medium text-white transition-colors duration-300 group-hover:text-accent-yellow">
                      {item.label}
                    </span>
                    <span className="mt-0.5 font-mono text-[0.62rem] tracking-[0.2em] text-white/45 uppercase">
                      {item.handle}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </article>
          <article className="bg-[#0f1113] p-6 sm:p-8">
            <MapPin className="size-5 text-accent-yellow" />
            <p className="mt-12 font-mono text-[0.62rem] tracking-[0.24em] text-white/38 uppercase">
              Workshop
            </p>
            <h2 className="mt-3 text-3xl leading-tight font-light text-white sm:text-4xl">
              UNSW Kensington.
            </h2>
            <p className="mt-8 max-w-md text-lg leading-8 text-white/62">
              Room G14, Blockhouse (G6), University Mall, UNSW, Kensington NSW
              2052
            </p>
          </article>
        </div>
      </section>

      <section className="bg-[#0a0c0e] px-4 py-20 text-white sm:px-6">
        <div className="mx-auto flex max-w-[92rem] flex-col gap-6 border-t border-white/12 pt-10 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-2xl text-base leading-7 text-white/54">
            Looking to join the team instead? Recruitment pathways are managed
            from the recruitment hub.
          </p>
          <Link
            href="/recruitment"
            className="inline-flex w-fit items-center gap-3 border border-white/20 px-5 py-3 font-mono text-[0.68rem] tracking-[0.24em] text-white uppercase transition-colors duration-300 hover:border-accent-yellow hover:bg-accent-yellow hover:text-black"
          >
            Recruitment
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
