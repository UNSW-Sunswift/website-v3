import webflowContent from "@/content/webflow-pages.json"

export type PublicPageKey =
  | "home"
  | "whoWeAre"
  | "whatWeDo"
  | "team"
  | "vehicles"
  | "partners"
  | "media"
  | "recruitment"
  | "contact"

export type ImportedPage = {
  key: string
  appPath: string
  sourcePath: string
  sourceUrl: string
  status: number
  title: string
  description: string
  headings: string[]
  paragraphs: string[]
  ctas: string[]
}

const pages = webflowContent.pages as Record<PublicPageKey, ImportedPage>

export function getPublicPage(key: PublicPageKey) {
  return pages[key]
}

export function getLeadParagraph(key: PublicPageKey) {
  const page = getPublicPage(key)
  return page.paragraphs[0] ?? page.description
}
