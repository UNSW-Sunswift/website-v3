import { PublicContentPage } from "@/components/site/content-sections"

export const metadata = {
  title: "What We Do",
}

export default function WhatWeDoPage() {
  return (
    <PublicContentPage
      pageKey="whatWeDo"
      label="What we do"
      title="Prototype, test, race, repeat."
    />
  )
}
