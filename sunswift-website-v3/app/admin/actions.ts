"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { auth, signIn, signOut } from "@/auth"
import {
  getRecruitmentRoles,
  getTeamMembers,
  putRecruitmentRole,
  putTeamMember,
  uploadDraftAsset,
} from "@/lib/cms/dynamodb"

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
}

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/admin" })
}

export async function signOutAdmin() {
  await signOut({ redirectTo: "/" })
}

export async function saveTeamMemberDraft(formData: FormData) {
  await assertAdmin()

  const name = String(formData.get("name") ?? "")
  const slug = slugify(String(formData.get("slug") || name))
  const existingImageKey = String(formData.get("existingImageKey") ?? "")
  const file = formData.get("headshot")
  const imageKey =
    file instanceof File && file.size > 0 ? await uploadDraftAsset(file, slug) : existingImageKey

  await putTeamMember(
    {
      slug,
      name,
      role: String(formData.get("role") ?? ""),
      discipline: String(formData.get("discipline") ?? ""),
      bio: String(formData.get("bio") ?? ""),
      imageKey,
    },
    "draft"
  )

  revalidatePath("/admin/team")
}

export async function publishTeamMember(formData: FormData) {
  await assertAdmin()

  const slug = String(formData.get("slug") ?? "")
  const drafts = await getTeamMembers("draft")
  const draft = drafts.find((member) => member.slug === slug)

  if (draft) {
    await putTeamMember(draft, "published")
    revalidatePath("/team")
    revalidatePath("/admin/team")
  }
}

export async function saveRecruitmentRoleDraft(formData: FormData) {
  await assertAdmin()

  const title = String(formData.get("title") ?? "")
  const slug = slugify(String(formData.get("slug") || title))

  await putRecruitmentRole(
    {
      slug,
      title,
      team: String(formData.get("team") ?? ""),
      description: String(formData.get("description") ?? ""),
    },
    "draft"
  )

  revalidatePath("/admin/recruitment")
}

export async function publishRecruitmentRole(formData: FormData) {
  await assertAdmin()

  const slug = String(formData.get("slug") ?? "")
  const drafts = await getRecruitmentRoles("draft")
  const draft = drafts.find((role) => role.slug === slug)

  if (draft) {
    await putRecruitmentRole(draft, "published")
    revalidatePath("/recruitment")
    revalidatePath("/admin/recruitment")
  }
}
