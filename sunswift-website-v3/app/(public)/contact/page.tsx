import Link from "next/link"
import { Mail, MapPin } from "lucide-react"

import { PageFrame, PageIntro } from "@/components/site/site-shell"
import { getPublicPage } from "@/lib/content"

export default function ContactPage() {
  const page = getPublicPage("contact")

  return (
    <PageFrame>
      <PageIntro label="Contact" title={page.headings[0] ?? "Contact Us"} description={page.description} />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-20 sm:px-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <Mail className="size-5 text-primary" />
          <h2 className="mt-8 text-2xl font-medium">Enquiries</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{page.paragraphs[0]}</p>
          <Link className="mt-5 inline-block text-sm text-primary" href="mailto:richard.hopkins1@unsw.edu.au">
            richard.hopkins1@unsw.edu.au
          </Link>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <MapPin className="size-5 text-primary" />
          <h2 className="mt-8 text-2xl font-medium">Workshop</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Room G14, Blockhouse (G6), University Mall, UNSW, Kensington NSW 2052
          </p>
        </div>
      </section>
    </PageFrame>
  )
}
