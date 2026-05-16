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
  stageCmsUpload,
} from "@/lib/cms/api"
import { importPartnersCsv, importRecruitmentCsv, importTeamCsv } from "@/lib/cms/csv"
import {
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

function selectedSlugs(formData: FormData) {
  return Array.from(new Set(formData.getAll("slugs").map((slug) => String(slug).trim()).filter(Boolean)))
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
  const department = normalizeTeamDepartment(String(formData.get("department") ?? ""))
  const hierarchyLevel = normalizeTeamHierarchy(String(formData.get("hierarchyLevel") ?? ""))
  const existingImageKey = String(formData.get("existingImageKey") ?? "")
  const file = formData.get("headshot")
  const imageKey =
    file instanceof File && file.size > 0 ? await stageCmsUpload(file, slug, "team") : existingImageKey

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

  const slug = String(formData.get("slug") ?? "")
  const published = await publishCmsDraft("team", slug, updatedBy)

  if (published) {
    revalidatePath("/team")
    revalidatePath("/admin/team")
  }
}

export async function publishAllTeamMembers() {
  const updatedBy = await assertAdmin()
  const drafts = await listCmsRecords("team", "draft")

  for (const member of drafts) {
    if (!member.slug) {
      continue
    }
    await publishCmsDraft("team", member.slug, updatedBy)
  }

  revalidatePath("/team")
  revalidatePath("/admin/team")
}

export async function publishSelectedTeamMembers(formData: FormData) {
  const updatedBy = await assertAdmin()
  const slugs = selectedSlugs(formData)

  for (const slug of slugs) {
    await publishCmsDraft("team", slug, updatedBy)
  }

  if (slugs.length > 0) {
    revalidatePath("/team")
    revalidatePath("/admin/team")
  }
}

export async function deleteTeamMember(formData: FormData) {
  await assertAdmin()

  const slug = String(formData.get("slug") ?? "")
  const deletePublished = String(formData.get("deletePublished") ?? "true") !== "false"

  await deleteCmsRecord("team", slug, "draft")
  if (deletePublished) {
    await deleteCmsRecord("team", slug, "published")
  }

  revalidatePath("/team")
  revalidatePath("/admin/team")
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

  const slug = String(formData.get("slug") ?? "")
  const published = await publishCmsDraft("roles", slug, updatedBy)

  if (published) {
    revalidatePath("/recruitment")
    revalidatePath("/recruitment/available-roles")
    revalidatePath("/admin/recruitment")
  }
}

export async function publishSelectedRecruitmentRoles(formData: FormData) {
  const updatedBy = await assertAdmin()
  const slugs = selectedSlugs(formData)

  for (const slug of slugs) {
    await publishCmsDraft("roles", slug, updatedBy)
  }

  if (slugs.length > 0) {
    revalidatePath("/recruitment")
    revalidatePath("/recruitment/available-roles")
    revalidatePath("/admin/recruitment")
  }
}

export async function deleteRecruitmentRole(formData: FormData) {
  await assertAdmin()

  const slug = String(formData.get("slug") ?? "")
  const deletePublished = String(formData.get("deletePublished") ?? "true") !== "false"

  await deleteCmsRecord("roles", slug, "draft")
  if (deletePublished) {
    await deleteCmsRecord("roles", slug, "published")
  }

  revalidatePath("/recruitment")
  revalidatePath("/recruitment/available-roles")
  revalidatePath("/admin/recruitment")
}

export async function savePartnerDraft(formData: FormData) {
  const updatedBy = await assertAdmin()

  const name = String(formData.get("name") ?? "")
  const slug = slugify(String(formData.get("slug") || name))
  const existingLogoKey = String(formData.get("existingLogoKey") ?? "")
  const file = formData.get("logo")
  const logoKey =
    file instanceof File && file.size > 0 ? await stageCmsUpload(file, slug, "partners") : existingLogoKey

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
  const slug = String(formData.get("slug") ?? "")
  const published = await publishCmsDraft("partners", slug, updatedBy)

  if (published) {
    revalidatePath("/partners")
    revalidatePath("/admin/partners")
  }
}

export async function publishSelectedPartners(formData: FormData) {
  const updatedBy = await assertAdmin()
  const slugs = selectedSlugs(formData)

  for (const slug of slugs) {
    await publishCmsDraft("partners", slug, updatedBy)
  }

  if (slugs.length > 0) {
    revalidatePath("/partners")
    revalidatePath("/admin/partners")
  }
}

export async function deletePartner(formData: FormData) {
  await assertAdmin()

  const slug = String(formData.get("slug") ?? "")
  const deletePublished = String(formData.get("deletePublished") ?? "true") !== "false"

  await deleteCmsRecord("partners", slug, "draft")
  if (deletePublished) {
    await deleteCmsRecord("partners", slug, "published")
  }

  revalidatePath("/partners")
  revalidatePath("/admin/partners")
}

export async function importTeamDrafts(formData: FormData) {
  const updatedBy = await assertAdmin()
  const file = formData.get("csv")
  const text = file instanceof File ? await file.text() : String(formData.get("csvText") ?? "")
  const members = importTeamCsv(text)
  const existingDrafts = await listCmsRecords("team", "draft")
  const existingBySlug = new Map(existingDrafts.map((member) => [member.slug, member]))
  const existingByName = new Map(
    existingDrafts.map((member) => [normalizeNameKey(member.name), member])
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
        imageKey: member.imageKey || existing?.imageKey || "",
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
  const file = formData.get("csv")
  const text = file instanceof File ? await file.text() : String(formData.get("csvText") ?? "")
  const partners = importPartnersCsv(text)

  for (const partner of partners) {
    await saveCmsDraft("partners", partner.slug, partner, updatedBy)
  }

  revalidatePath("/admin/partners")
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
