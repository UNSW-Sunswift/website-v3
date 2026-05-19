"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { auth, signIn, signOut } from "@/auth"
import {
  deleteCmsRecord,
  listCmsRecords,
  publishCmsDraft,
  recordMediaAsset,
  saveCmsDraft,
  saveCmsPublished,
  stageCmsUpload,
} from "@/lib/cms/api"
import { importPartnersCsv, importRecruitmentCsv, importTeamCsv } from "@/lib/cms/csv"
import { achievementVideoSlug } from "@/lib/cms/static-data"
import { siteImageSlug } from "@/lib/cms/site-images"
import {
  DEFAULT_TEAM_DEPARTMENT,
  normalizeTeamDepartment,
  normalizeTeamHierarchy,
} from "@/lib/cms/team-options"
import type { MediaAsset } from "@/lib/cms/types"

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function normalizeNameKey(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase()
}

function safeHttpUrl(value: string) {
  try {
    const url = new URL(value.trim())
    return url.protocol === "http:" || url.protocol === "https:" ? url : null
  } catch {
    return null
  }
}

async function fetchTextUrl(value: string) {
  const url = safeHttpUrl(value)
  if (!url) {
    return ""
  }

  const response = await fetch(url, { cache: "no-store" })
  if (!response.ok) {
    return ""
  }

  return response.text()
}

async function fetchUrlAsFile(value: string, fallbackName: string) {
  const url = safeHttpUrl(value)
  if (!url) {
    return null
  }

  const response = await fetch(url, { cache: "no-store" })
  if (!response.ok) {
    return null
  }

  const contentType = response.headers.get("content-type") ?? "application/octet-stream"
  const pathnameName = url.pathname.split("/").filter(Boolean).pop()
  const filename = (pathnameName || fallbackName).replace(/[^a-zA-Z0-9._-]/g, "-")
  const buffer = await response.arrayBuffer()

  return new File([buffer], filename, { type: contentType })
}

async function formCsvText(formData: FormData) {
  const file = formData.get("csv")
  if (file instanceof File && file.size > 0) {
    return file.text()
  }

  const urlText = await fetchTextUrl(String(formData.get("csvUrl") ?? ""))
  return urlText || String(formData.get("csvText") ?? "")
}

type PublishCollection = "team" | "roles" | "partners"

type PublishResult = {
  requested: number
  published: number
  failed: number
}

function selectedSlugs(formData: FormData) {
  return Array.from(new Set(formData.getAll("slugs").map((slug) => String(slug).trim()).filter(Boolean)))
}

function publishStatusPath(path: string, result: PublishResult) {
  const status =
    result.requested === 0
      ? "empty"
      : result.failed === 0
        ? "success"
        : result.published > 0
          ? "partial"
          : "error"
  const params = new URLSearchParams({
    publishStatus: status,
    published: String(result.published),
    failed: String(result.failed),
    requested: String(result.requested),
  })

  return `${path}?${params.toString()}`
}

function actionStatusPath(path: string, action: string, status: "success" | "error") {
  const params = new URLSearchParams({
    action,
    actionStatus: status,
  })

  return `${path}?${params.toString()}`
}

async function publishAndArchiveDraft(
  collection: PublishCollection,
  slug: string,
  updatedBy: string
) {
  try {
    const published = await publishCmsDraft(collection, slug, updatedBy)

    if (!published) {
      return false
    }

    await deleteCmsRecord(collection, slug, "draft")
    return true
  } catch {
    return false
  }
}

async function publishDrafts(
  collection: PublishCollection,
  slugs: string[],
  updatedBy: string
): Promise<PublishResult> {
  let published = 0
  let failed = 0

  for (const slug of slugs) {
    if (await publishAndArchiveDraft(collection, slug, updatedBy)) {
      published += 1
    } else {
      failed += 1
    }
  }

  return {
    requested: slugs.length,
    published,
    failed,
  }
}

async function assertAdmin() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/admin/login")
  }

  return session.user.email
}

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/admin" })
}

export async function signInAsDeveloper() {
  if (process.env.NODE_ENV === "production" || process.env.ENABLE_DEV_ADMIN_LOGIN === "false") {
    redirect("/admin/login")
  }

  await signIn("developer", { redirectTo: "/admin" })
}

export async function signOutAdmin() {
  await signOut({ redirectTo: "/" })
}

export async function saveTeamMemberDraft(formData: FormData) {
  const updatedBy = await assertAdmin()

  const name = String(formData.get("name") ?? "").trim()
  const slug = slugify(String(formData.get("slug") || name))
  const hierarchyLevel = normalizeTeamHierarchy(String(formData.get("hierarchyLevel") ?? ""))
  const selectedDepartment = normalizeTeamDepartment(String(formData.get("department") ?? ""))
  const department =
    hierarchyLevel === "Academic"
      ? ""
      : selectedDepartment || DEFAULT_TEAM_DEPARTMENT
  const existingImageKey = String(formData.get("existingImageKey") ?? "")
  const file = formData.get("headshot")
  const remoteFile = await fetchUrlAsFile(
    String(formData.get("headshotUrl") ?? ""),
    `${slug || "team-member"}-headshot`
  )
  const imageKey =
    file instanceof File && file.size > 0
      ? await stageCmsUpload(file, slug, "team")
      : remoteFile
        ? await stageCmsUpload(remoteFile, slug, "team")
        : existingImageKey

  await saveCmsDraft(
    "team",
    slug,
    {
      slug,
      name,
      role: String(formData.get("role") ?? "").trim(),
      department,
      hierarchyLevel,
      additionalRoles: String(formData.get("additionalRoles") ?? "").trim(),
      imageKey,
      sortOrder: Number(formData.get("sortOrder") ?? 0),
    },
    updatedBy
  )

  revalidatePath("/admin/team")
}

export async function publishTeamMember(formData: FormData) {
  const updatedBy = await assertAdmin()

  const slug = String(formData.get("slug") ?? "").trim()
  const result = await publishDrafts("team", slug ? [slug] : [], updatedBy)

  revalidatePath("/team")
  revalidatePath("/admin/team")
  redirect(publishStatusPath("/admin/team", result))
}

export async function publishAllTeamMembers() {
  const updatedBy = await assertAdmin()
  const drafts = await listCmsRecords("team", "draft")
  const result = await publishDrafts(
    "team",
    drafts.map((member) => member.slug).filter(Boolean),
    updatedBy
  )

  revalidatePath("/team")
  revalidatePath("/admin/team")
  redirect(publishStatusPath("/admin/team", result))
}

export async function publishSelectedTeamMembers(formData: FormData) {
  const updatedBy = await assertAdmin()
  const slugs = selectedSlugs(formData)
  const result = await publishDrafts("team", slugs, updatedBy)

  revalidatePath("/team")
  revalidatePath("/admin/team")
  redirect(publishStatusPath("/admin/team", result))
}

export async function deleteTeamMember(formData: FormData) {
  await assertAdmin()

  const slug = String(formData.get("slug") ?? "")
  const deletePublished = String(formData.get("deletePublished") ?? "true") !== "false"

  try {
    await deleteCmsRecord("team", slug, "draft")
    if (deletePublished) {
      await deleteCmsRecord("team", slug, "published")
    }
  } catch {
    redirect(actionStatusPath("/admin/team", "delete", "error"))
  }

  revalidatePath("/team")
  revalidatePath("/admin/team")
  redirect(actionStatusPath("/admin/team", "delete", "success"))
}

export async function saveRecruitmentRoleDraft(formData: FormData) {
  const updatedBy = await assertAdmin()

  const title = String(formData.get("title") ?? "")
  const slug = slugify(String(formData.get("slug") || title))

  await saveCmsDraft(
    "roles",
    slug,
    {
      slug,
      title,
      team: String(formData.get("team") ?? ""),
      description: String(formData.get("description") ?? ""),
      active: formData.get("active") === "on",
      discipline: String(formData.get("discipline") ?? ""),
      school: String(formData.get("school") ?? ""),
      responsibilitiesHtml: String(formData.get("responsibilitiesHtml") ?? ""),
      requirementsHtml: String(formData.get("requirementsHtml") ?? ""),
      sortOrder: Number(formData.get("sortOrder") ?? 0),
    },
    updatedBy
  )

  revalidatePath("/admin/recruitment")
}

export async function publishRecruitmentRole(formData: FormData) {
  const updatedBy = await assertAdmin()

  const slug = String(formData.get("slug") ?? "").trim()
  const result = await publishDrafts("roles", slug ? [slug] : [], updatedBy)

  revalidatePath("/recruitment")
  revalidatePath("/recruitment/available-roles")
  revalidatePath("/admin/recruitment")
  redirect(publishStatusPath("/admin/recruitment", result))
}

export async function publishSelectedRecruitmentRoles(formData: FormData) {
  const updatedBy = await assertAdmin()
  const slugs = selectedSlugs(formData)
  const result = await publishDrafts("roles", slugs, updatedBy)

  revalidatePath("/recruitment")
  revalidatePath("/recruitment/available-roles")
  revalidatePath("/admin/recruitment")
  redirect(publishStatusPath("/admin/recruitment", result))
}

export async function deleteRecruitmentRole(formData: FormData) {
  await assertAdmin()

  const slug = String(formData.get("slug") ?? "")
  const deletePublished = String(formData.get("deletePublished") ?? "true") !== "false"

  try {
    await deleteCmsRecord("roles", slug, "draft")
    if (deletePublished) {
      await deleteCmsRecord("roles", slug, "published")
    }
  } catch {
    redirect(actionStatusPath("/admin/recruitment", "delete", "error"))
  }

  revalidatePath("/recruitment")
  revalidatePath("/recruitment/available-roles")
  revalidatePath("/admin/recruitment")
  redirect(actionStatusPath("/admin/recruitment", "delete", "success"))
}

export async function savePartnerDraft(formData: FormData) {
  const updatedBy = await assertAdmin()

  const name = String(formData.get("name") ?? "")
  const slug = slugify(String(formData.get("slug") || name))
  const existingLogoKey = String(formData.get("existingLogoKey") ?? "")
  const file = formData.get("logo")
  const remoteFile = await fetchUrlAsFile(
    String(formData.get("logoUrl") ?? ""),
    `${slug || "partner"}-logo`
  )
  const logoKey =
    file instanceof File && file.size > 0
      ? await stageCmsUpload(file, slug, "partners")
      : remoteFile
        ? await stageCmsUpload(remoteFile, slug, "partners")
        : existingLogoKey

  await saveCmsDraft(
    "partners",
    slug,
    {
      slug,
      name,
      website: String(formData.get("website") ?? "#"),
      logoKey,
      sortOrder: Number(formData.get("sortOrder") ?? 0),
    },
    updatedBy
  )

  revalidatePath("/admin/partners")
}

export async function publishPartner(formData: FormData) {
  const updatedBy = await assertAdmin()
  const slug = String(formData.get("slug") ?? "").trim()
  const result = await publishDrafts("partners", slug ? [slug] : [], updatedBy)

  revalidatePath("/partners")
  revalidatePath("/admin/partners")
  redirect(publishStatusPath("/admin/partners", result))
}

export async function publishSelectedPartners(formData: FormData) {
  const updatedBy = await assertAdmin()
  const slugs = selectedSlugs(formData)
  const result = await publishDrafts("partners", slugs, updatedBy)

  revalidatePath("/partners")
  revalidatePath("/admin/partners")
  redirect(publishStatusPath("/admin/partners", result))
}

export async function deletePartner(formData: FormData) {
  await assertAdmin()

  const slug = String(formData.get("slug") ?? "")
  const deletePublished = String(formData.get("deletePublished") ?? "true") !== "false"

  try {
    await deleteCmsRecord("partners", slug, "draft")
    if (deletePublished) {
      await deleteCmsRecord("partners", slug, "published")
    }
  } catch {
    redirect(actionStatusPath("/admin/partners", "delete", "error"))
  }

  revalidatePath("/partners")
  revalidatePath("/admin/partners")
  redirect(actionStatusPath("/admin/partners", "delete", "success"))
}

export async function importTeamDrafts(formData: FormData) {
  const updatedBy = await assertAdmin()
  const text = await formCsvText(formData)
  const members = importTeamCsv(text)
  const [existingDrafts, existingPublished] = await Promise.all([
    listCmsRecords("team", "draft"),
    listCmsRecords("team", "published"),
  ])
  const existingRecords = [...existingDrafts, ...existingPublished]
  const existingBySlug = new Map(existingRecords.map((member) => [member.slug, member]))
  const existingByName = new Map(
    existingRecords.map((member) => [normalizeNameKey(member.name), member])
  )

  for (const member of members) {
    const existing =
      existingBySlug.get(member.slug) ?? existingByName.get(normalizeNameKey(member.name))
    const slug = existing?.slug ?? member.slug
    await saveCmsDraft(
      "team",
      slug,
      {
        ...member,
        slug,
        department:
          member.hierarchyLevel === "Academic"
            ? ""
            : member.department || DEFAULT_TEAM_DEPARTMENT,
      },
      updatedBy
    )
  }

  revalidatePath("/admin/team")
}

export async function importRecruitmentDrafts(formData: FormData) {
  const updatedBy = await assertAdmin()
  const file = formData.get("csv")
  const text = file instanceof File ? await file.text() : String(formData.get("csvText") ?? "")
  const roles = importRecruitmentCsv(text)

  for (const role of roles) {
    await saveCmsDraft("roles", role.slug, role, updatedBy)
  }

  revalidatePath("/admin/recruitment")
}

export async function importPartnerDrafts(formData: FormData) {
  const updatedBy = await assertAdmin()
  const text = await formCsvText(formData)
  const partners = importPartnersCsv(text)

  for (const partner of partners) {
    await saveCmsDraft("partners", partner.slug, partner, updatedBy)
  }

  revalidatePath("/admin/partners")
}

export async function saveTimelineVideoSetting(formData: FormData) {
  const updatedBy = await assertAdmin()
  const year = String(formData.get("year") ?? "").trim()
  const title = String(formData.get("title") ?? "").trim()
  const slug = slugify(String(formData.get("slug") || achievementVideoSlug({ year, title })))
  const videoUrl = String(formData.get("videoUrl") ?? "").trim()
  const videoEnabled = formData.get("videoEnabled") === "on"

  await saveCmsPublished(
    "timeline",
    slug,
    {
      slug,
      achievementKey: `${year} ${title}`.trim(),
      videoEnabled,
      videoUrl,
    },
    updatedBy
  )

  revalidatePath("/achievements")
  revalidatePath("/admin/timeline")
}

export async function saveSiteImageSetting(formData: FormData) {
  const updatedBy = await assertAdmin()
  const defaultSrc = String(formData.get("defaultSrc") ?? "").trim()
  const label = String(formData.get("label") ?? "").trim()
  const section = String(formData.get("section") ?? "").trim()
  const imageUrl = String(formData.get("imageUrl") ?? "").trim()
  const slug = String(formData.get("slug") || siteImageSlug(defaultSrc)).trim()

  await saveCmsPublished(
    "site-images",
    slug,
    {
      slug,
      label,
      section,
      defaultSrc,
      imageUrl,
    },
    updatedBy
  )

  revalidatePath("/")
  revalidatePath("/achievements")
  revalidatePath("/contact")
  revalidatePath("/media")
  revalidatePath("/our-story")
  revalidatePath("/partners")
  revalidatePath("/team")
  revalidatePath("/vehicles")
  revalidatePath("/who-we-are")
  revalidatePath("/admin/images")
}

export async function seedHeavyMediaAssets() {
  const updatedBy = await assertAdmin()
  const existing = await listCmsRecords("assets", "published")
  const knownKeys = new Set(existing.map((asset) => asset.key))
  const assets: MediaAsset[] = [
    {
      key: "public-media/placeholders/sr7-world-record.mp4",
      bucket: process.env.CMS_PUBLIC_ASSETS_BUCKET ?? "website-v3-public-assets",
      contentType: "video/mp4",
      size: 75641586,
      scope: "public-media",
      status: "published",
      source: "/placeholders/sr7-world-record.mp4",
    },
    {
      key: "public-media/placeholders/bwsc-23-vid.mp4",
      bucket: process.env.CMS_PUBLIC_ASSETS_BUCKET ?? "website-v3-public-assets",
      contentType: "video/mp4",
      size: 66585122,
      scope: "public-media",
      status: "published",
      source: "/placeholders/bwsc-23-vid.mp4",
    },
    {
      key: "public-media/vehicle-fleet/vehicle-ivy.jpg",
      bucket: process.env.CMS_PUBLIC_ASSETS_BUCKET ?? "website-v3-public-assets",
      contentType: "image/jpeg",
      size: 10759552,
      scope: "public-media",
      status: "published",
      source: "/vehicle-fleet/vehicle-ivy.jpg",
    },
  ]

  for (const asset of assets) {
    if (!knownKeys.has(asset.key)) {
      await recordMediaAsset(asset, updatedBy)
    }
  }

  revalidatePath("/admin/assets")
}
