import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

import { PageFrame, PageIntro } from "@/components/site/site-shell"

export const metadata = {
  title: "Credits",
  robots: {
    index: false,
    follow: false,
  },
}

const credits = [
  {
    title: "Sunswift Racing",
    body: "Website content, vehicle history, team information, photography direction, and editorial review.",
  },
  {
    title: "UNSW Sydney",
    body: "University identity, facilities context, and ongoing support for student-led engineering.",
  },
  {
    title: "Partners and media",
    body: "Selected public images, videos, articles, and partner references are used as temporary placeholders until final CMS assets are published.",
  },
]

export default function CreditsPage() {
  return (
    <PageFrame>
      <PageIntro
        label="Credits"
        title="Built by the Sunswift team."
        description="Acknowledgements for the people, partners and source material behind this website."
      />

      <section className="mx-auto max-w-[92rem] px-4 pb-24 sm:px-6">
        <div className="grid gap-px overflow-hidden border border-black/10 bg-black/10 lg:grid-cols-3">
          {credits.map((credit) => (
            <article key={credit.title} className="bg-white p-6 sm:p-8">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-black/38">
                Credit
              </p>
              <h2 className="mt-4 text-3xl font-light tracking-tight text-black">
                {credit.title}
              </h2>
              <p className="mt-5 text-sm leading-7 text-black/62">{credit.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3 border-t border-black/10 pt-8">
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 border border-black/20 px-5 py-3 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-black transition-colors duration-300 hover:border-accent-yellow hover:bg-accent-yellow"
          >
            Contact the team
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-3 border border-black/20 px-5 py-3 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-black transition-colors duration-300 hover:border-black hover:bg-black hover:text-white"
          >
            Admin login
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>
    </PageFrame>
  )
}
