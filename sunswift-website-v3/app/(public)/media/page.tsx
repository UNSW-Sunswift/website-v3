import { MediaHighlightsPage } from "@/components/site/media-highlights-page"
import { PageLoadReveal } from "@/components/site/page-load-reveal"

export const metadata = {
  title: "Media",
}

export default function MediaPage() {
  return (
    <>
      <PageLoadReveal image="/media/highlights-banner.jpg" label="Media" variant="cinematic" />
      <MediaHighlightsPage />
    </>
  )
}
