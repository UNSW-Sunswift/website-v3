import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

const baseUrl = "https://sunswift.webflow.io"

const routes = [
  { key: "home", appPath: "/", sourcePath: "/" },
  { key: "whoWeAre", appPath: "/who-we-are", sourcePath: "/about" },
  { key: "whatWeDo", appPath: "/what-we-do", sourcePath: "/about" },
  { key: "team", appPath: "/team", sourcePath: "/our-team" },
  { key: "vehicles", appPath: "/vehicles", sourcePath: "/vehicles" },
  { key: "partners", appPath: "/partners", sourcePath: "/partners" },
  { key: "media", appPath: "/media", sourcePath: "/news" },
  { key: "recruitment", appPath: "/recruitment", sourcePath: "/recruitment" },
  { key: "contact", appPath: "/contact", sourcePath: "/contact" },
]

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
}

function stripTags(value) {
  return decodeEntities(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  )
}

function uniqueUseful(values, limit) {
  const seen = new Set()
  const blocked = new Set([
    "home",
    "who we are",
    "achievements",
    "our story",
    "our team",
    "vehicles",
    "partners",
    "highlights",
    "blog",
    "overview",
    "engineering roles",
    "media roles",
    "business roles",
    "copyright © 2025 - credits",
    "room g14, blockhouse (g6), university mall, unsw, kensington nsw 2052",
  ])

  return values
    .map((value) => value.replace(/\s+/g, " ").trim())
    .filter((value) => value.length > 2)
    .filter((value) => !/^(menu|open menu|close menu)$/i.test(value))
    .filter((value) => !blocked.has(value.toLowerCase()))
    .filter((value) => {
      const key = value.toLowerCase()
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
    .slice(0, limit)
}

function extractAll(html, regex, limit) {
  const matches = []
  let match

  while ((match = regex.exec(html)) !== null) {
    matches.push(stripTags(match[1] ?? ""))
  }

  return uniqueUseful(matches, limit)
}

function extractMeta(html, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const pattern = new RegExp(`<meta\\s+content="([^"]+)"\\s+name="${escaped}"`, "i")
  return decodeEntities(html.match(pattern)?.[1] ?? "")
}

function extractPage(html) {
  const title = stripTags(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "")
  const description = extractMeta(html, "description")
  const headings = extractAll(html, /<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi, 10)
  const paragraphs = extractAll(html, /<p[^>]*>([\s\S]*?)<\/p>/gi, 12)
  const ctas = extractAll(html, /<a[^>]*>([\s\S]*?)<\/a>/gi, 12)

  return { title, description, headings, paragraphs, ctas }
}

const pages = {}

for (const route of routes) {
  const url = `${baseUrl}${route.sourcePath}`
  const response = await fetch(url)

  if (!response.ok) {
    pages[route.key] = {
      ...route,
      sourceUrl: url,
      status: response.status,
      title: "",
      description: "",
      headings: [],
      paragraphs: [],
      ctas: [],
    }
    continue
  }

  pages[route.key] = {
    ...route,
    sourceUrl: url,
    status: response.status,
    ...extractPage(await response.text()),
  }
}

const outPath = path.join(process.cwd(), "content", "webflow-pages.json")
await mkdir(path.dirname(outPath), { recursive: true })
await writeFile(outPath, `${JSON.stringify({ importedAt: new Date().toISOString(), pages }, null, 2)}\n`)

console.log(`Imported ${Object.keys(pages).length} Webflow pages into ${outPath}`)
