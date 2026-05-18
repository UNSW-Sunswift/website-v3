import type { MetadataRoute } from "next"

import {
  recruitmentStreamHref,
  recruitmentStreams,
} from "@/components/site/recruitment-content"

function siteOrigin() {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL ??
    "https://www.sunswiftracing.com"
  const withProtocol = /^https?:\/\//.test(configured)
    ? configured
    : `https://${configured}`

  return withProtocol.replace(/\/$/, "")
}

function entry(path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]) {
  return {
    url: `${siteOrigin()}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const publicRoutes = [
    entry("/", 1, "weekly"),
    entry("/who-we-are", 0.9, "monthly"),
    entry("/our-story", 0.85, "monthly"),
    entry("/achievements", 0.9, "monthly"),
    entry("/team", 0.85, "weekly"),
    entry("/vehicles", 0.9, "monthly"),
    entry("/partners", 0.8, "weekly"),
    entry("/media", 0.8, "weekly"),
    entry("/recruitment", 0.9, "weekly"),
    entry("/recruitment/available-roles", 0.85, "weekly"),
    ...recruitmentStreams.map((stream) =>
      entry(recruitmentStreamHref(stream), 0.8, "weekly")
    ),
    entry("/contact", 0.75, "monthly"),
    entry("/what-we-do", 0.65, "monthly"),
  ]

  return publicRoutes
}
