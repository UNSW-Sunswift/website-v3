import { WhoWeAreEditorialPage } from "@/components/site/about-editorial-pages"
import { PageLoadReveal } from "@/components/site/page-load-reveal"

export const metadata = {
  title: "About Us",
}

export default function WhoWeArePage() {
  return (
    <>
      <PageLoadReveal image="/media/sr8-hero-3.png" label="Who We Are" variant="cinematic" />
      <WhoWeAreEditorialPage />
    </>
  )
}
