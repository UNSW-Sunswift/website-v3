import type { MetadataRoute } from "next"

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

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/credits"],
      },
    ],
    sitemap: `${siteOrigin()}/sitemap.xml`,
  }
}
