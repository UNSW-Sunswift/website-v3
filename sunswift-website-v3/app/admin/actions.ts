"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { auth, signIn, signOut } from "@/auth"
import {
  listCmsRecords,
  publishCmsDraft,
  recordMediaAsset,
  saveCmsDraft,
  stageCmsUpload,
} from "@/lib/cms/api"
import { importPartnersCsv, importRecruitmentCsv, importTeamCsv } from "@/lib/cms/csv"
import type { MediaAsset } from "@/lib/cms/types"

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
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

  const name = String(formData.get("name") ?? "")
  const slug = slugify(String(formData.get("slug") || name))
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
      role: String(formData.get("role") ?? ""),
      discipline: String(formData.get("discipline") ?? ""),
      department: String(formData.get("department") ?? ""),
      hierarchyLevel: String(formData.get("hierarchyLevel") ?? ""),
      additionalRoles: String(formData.get("additionalRoles") ?? ""),
      bio: String(formData.get("bio") ?? ""),
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

export async function importTeamDrafts(formData: FormData) {
  const updatedBy = await assertAdmin()
  const file = formData.get("csv")
  const text = file instanceof File ? await file.text() : String(formData.get("csvText") ?? "")
  const members = importTeamCsv(text)

  for (const member of members) {
    await saveCmsDraft("team", member.slug, member, updatedBy)
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
