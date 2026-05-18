import aboutPages from "@/content/about-pages.json"
import mediaHighlightsData from "@/content/media-highlights.json"
import type { SiteImageSetting, Vehicle } from "@/lib/cms/types"

type AchievementLike = {
  year: string
  title: string
  image: string
}

type SiteImageInput = {
  src: string
  label: string
  section: string
}

export type SiteImageMap = Record<string, string>

function imageSlug(src: string) {
  return src
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function addImage(registry: Map<string, SiteImageInput>, image: SiteImageInput) {
  if (!image.src || image.src.startsWith("data:")) {
    return
  }

  const slug = imageSlug(image.src)
  if (!registry.has(slug)) {
    registry.set(slug, image)
  }
}

function aboutPageImages() {
  const pages = aboutPages.pages
  const images: SiteImageInput[] = []

  for (const image of pages.whoWeAre.gallery) {
    images.push({ src: image, label: "Who We Are gallery", section: "About" })
  }

  for (const item of pages.whoWeAre.discover) {
    images.push({ src: item.image, label: item.title, section: "About" })
  }

  for (const article of pages.ourStory.articles) {
    images.push({ src: article.image, label: article.title, section: "Our Story" })
    for (const block of article.blocks) {
      if (block.type === "image" && block.src) {
        images.push({ src: block.src, label: article.title, section: "Our Story" })
      }
    }
  }

  return images
}

function mediaPageImages() {
  const images: SiteImageInput[] = []

  for (const section of mediaHighlightsData.sections) {
    for (const item of section.items) {
      images.push({ src: item.imageSrc, label: item.title, section: "Media" })
    }
  }

  return images
}

export function siteImageSlug(src: string) {
  return imageSlug(src)
}

export function createSiteImageRegistry(vehicles: Vehicle[], achievements: AchievementLike[]) {
  const registry = new Map<string, SiteImageInput>()

  const fixedImages: SiteImageInput[] = [
    { src: "/media/sr8-hero-render.png", label: "Homepage hero render", section: "Homepage" },
    { src: "/media/sr8-hero-2.png", label: "Homepage sustainability section", section: "Homepage" },
    { src: "/media/sr8-hero-3.png", label: "Homepage about vehicle", section: "Homepage" },
    { src: "/media/our-team.jpg", label: "Team and recruitment hero", section: "Team" },
    { src: "/media/partners-picture.avif", label: "Partners hero", section: "Partners" },
    { src: "/media/highlights-banner.jpg", label: "Media hero", section: "Media" },
    { src: "/media/contact-banner.jpg", label: "Contact hero", section: "Contact" },
    { src: "/brand/unsw-sydney-dark.png?v=20260515-footer", label: "Footer UNSW logo", section: "Footer" },
    { src: "/placeholders/garage.svg", label: "Garage placeholder", section: "Fallbacks" },
    { src: "/placeholders/lab.svg", label: "Lab placeholder", section: "Fallbacks" },
    { src: "/placeholders/team-member.svg", label: "Team placeholder", section: "Fallbacks" },
  ]

  for (const image of fixedImages) {
    addImage(registry, image)
  }
  for (const vehicle of vehicles) {
    addImage(registry, { src: vehicle.image, label: vehicle.name, section: "Vehicles" })
  }
  for (const achievement of achievements) {
    addImage(registry, {
      src: achievement.image,
      label: `${achievement.year} ${achievement.title}`,
      section: "Achievements",
    })
  }
  for (const image of aboutPageImages()) {
    addImage(registry, image)
  }
  for (const image of mediaPageImages()) {
    addImage(registry, image)
  }

  return Array.from(registry.entries())
    .map(([slug, image]) => ({
      slug,
      label: image.label,
      section: image.section,
      defaultSrc: image.src,
      imageUrl: "",
      status: "published" as const,
    }))
    .sort((a, b) => a.section.localeCompare(b.section) || a.label.localeCompare(b.label))
}

export function mergeSiteImageSettings(
  registry: SiteImageSetting[],
  settings: SiteImageSetting[]
) {
  const settingsBySlug = new Map(settings.map((setting) => [setting.slug, setting]))

  return registry.map((image) => ({
    ...image,
    imageUrl: settingsBySlug.get(image.slug)?.imageUrl ?? image.imageUrl,
    updatedAt: settingsBySlug.get(image.slug)?.updatedAt,
    updatedBy: settingsBySlug.get(image.slug)?.updatedBy,
  }))
}

export function siteImageMap(settings: SiteImageSetting[]): SiteImageMap {
  return Object.fromEntries(
    settings
      .filter((setting) => setting.imageUrl.trim().length > 0)
      .map((setting) => [setting.defaultSrc, setting.imageUrl.trim()])
  )
}

export function resolveSiteImage(src: string, overrides?: SiteImageMap) {
  return overrides?.[src] ?? src
}

export function resolveSiteImages<T extends { image: string }>(items: T[], overrides?: SiteImageMap) {
  return items.map((item) => ({
    ...item,
    image: resolveSiteImage(item.image, overrides),
  }))
}
