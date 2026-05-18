import {
  deletePartner,
  deleteRecruitmentRole,
  deleteTeamMember,
  getMediaAssets,
  getPartners,
  getRecruitmentRoles,
  getSiteImageSettings,
  getTeamMembers,
  getTimelineVideoSettings,
  putMediaAsset,
  putPartner,
  putRecruitmentRole,
  putSiteImageSetting,
  putTeamMember,
  putTimelineVideoSetting,
  uploadDraftAsset,
} from "@/lib/cms/dynamodb"
import type {
  MediaAsset,
  Partner,
  RecruitmentRole,
  SiteImageSetting,
  TeamMember,
  TimelineVideoSetting,
} from "@/lib/cms/types"

type CmsStatus = "draft" | "published"
type CmsCollection = "team" | "roles" | "partners" | "assets" | "timeline" | "site-images"

type CmsRecordMap = {
  team: TeamMember
  roles: RecruitmentRole
  partners: Partner
  assets: MediaAsset
  timeline: TimelineVideoSetting
  "site-images": SiteImageSetting
}

function cmsApiUrl() {
  return process.env.CMS_API_URL
}

async function cmsFetch<T>(path: string, init?: RequestInit) {
  const baseUrl = cmsApiUrl()

  if (!baseUrl) {
    return null
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-cms-internal-secret": process.env.CMS_API_INTERNAL_SECRET ?? "local-development",
      ...init?.headers,
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`CMS API request failed: ${response.status} ${response.statusText}`)
  }

  return (await response.json()) as T
}

export async function listCmsRecords<TCollection extends CmsCollection>(
  collection: TCollection,
  status: CmsStatus = "published"
): Promise<CmsRecordMap[TCollection][]> {
  const apiResponse = await cmsFetch<{ items: CmsRecordMap[TCollection][] }>(
    `/cms/${status === "published" ? "public" : "admin"}/${collection}?status=${status}`
  )

  if (apiResponse) {
    return apiResponse.items
  }

  if (collection === "team") {
    return (await getTeamMembers(status)) as CmsRecordMap[TCollection][]
  }
  if (collection === "roles") {
    return (await getRecruitmentRoles(status)) as CmsRecordMap[TCollection][]
  }
  if (collection === "partners") {
    return (await getPartners(status)) as CmsRecordMap[TCollection][]
  }
  if (collection === "timeline") {
    return (await getTimelineVideoSettings(status)) as CmsRecordMap[TCollection][]
  }
  if (collection === "site-images") {
    return (await getSiteImageSettings(status)) as CmsRecordMap[TCollection][]
  }

  return (await getMediaAssets(status)) as CmsRecordMap[TCollection][]
}

export async function saveCmsDraft<TCollection extends Exclude<CmsCollection, "assets" | "timeline">>(
  collection: TCollection,
  slug: string,
  record: CmsRecordMap[TCollection],
  updatedBy: string
) {
  const payload = {
    ...record,
    updatedAt: new Date().toISOString(),
    updatedBy,
  }

  const apiResponse = await cmsFetch<{ item: CmsRecordMap[TCollection] }>(
    `/cms/admin/${collection}/${slug}/draft`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  )

  if (apiResponse) {
    return apiResponse.item
  }

  if (collection === "team") {
    await putTeamMember(payload as TeamMember, "draft")
  } else if (collection === "roles") {
    await putRecruitmentRole(payload as RecruitmentRole, "draft")
  } else {
    await putPartner(payload as Partner, "draft")
  }

  return payload
}

export async function saveCmsPublished<TCollection extends "timeline" | "site-images">(
  collection: TCollection,
  slug: string,
  record: CmsRecordMap[TCollection],
  updatedBy: string
) {
  const payload = {
    ...record,
    updatedAt: new Date().toISOString(),
    updatedBy,
    status: "published" as const,
  }

  const apiResponse = await cmsFetch<{ item: CmsRecordMap[TCollection] }>(
    `/cms/admin/${collection}/${slug}/published`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  )

  if (apiResponse) {
    return apiResponse.item
  }

  if (collection === "timeline") {
    await putTimelineVideoSetting(payload as TimelineVideoSetting, "published")
  } else {
    await putSiteImageSetting(payload as SiteImageSetting, "published")
  }
  return payload
}

export async function publishCmsDraft<TCollection extends Exclude<CmsCollection, "assets" | "timeline">>(
  collection: TCollection,
  slug: string,
  updatedBy: string
) {
  const apiResponse = await cmsFetch<{ item: CmsRecordMap[TCollection] }>(
    `/cms/admin/${collection}/${slug}/publish`,
    {
      method: "POST",
      body: JSON.stringify({ updatedBy }),
    }
  )

  if (apiResponse) {
    return apiResponse.item
  }

  const drafts = await listCmsRecords(collection, "draft")
  const draft = drafts.find((record) => "slug" in record && record.slug === slug)

  if (!draft) {
    return null
  }

  const published = {
    ...draft,
    status: "published" as const,
    updatedAt: new Date().toISOString(),
    updatedBy,
  }

  if (collection === "team") {
    await putTeamMember(published as TeamMember, "published")
    await deleteTeamMember(slug, "draft")
  } else if (collection === "roles") {
    await putRecruitmentRole(published as RecruitmentRole, "published")
    await deleteRecruitmentRole(slug, "draft")
  } else {
    await putPartner(published as Partner, "published")
    await deletePartner(slug, "draft")
  }

  return published
}

export async function deleteCmsRecord<TCollection extends Exclude<CmsCollection, "assets" | "timeline">>(
  collection: TCollection,
  slug: string,
  status: CmsStatus
) {
  const apiResponse = await cmsFetch<{ ok: boolean }>(
    `/cms/admin/${collection}/${slug}/${status}`,
    {
      method: "DELETE",
    }
  )

  if (apiResponse) {
    return apiResponse.ok
  }

  if (collection === "team") {
    await deleteTeamMember(slug, status)
  } else if (collection === "roles") {
    await deleteRecruitmentRole(slug, status)
  } else {
    await deletePartner(slug, status)
  }

  return true
}

export async function stageCmsUpload(
  file: File,
  slug: string,
  scope: "team" | "roles" | "partners"
) {
  const apiResponse = await cmsFetch<{ key: string }>(
    "/cms/admin/uploads/presign",
    {
      method: "POST",
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type || "application/octet-stream",
        scope,
        slug,
      }),
    }
  )

  if (apiResponse) {
    return apiResponse.key
  }

  return uploadDraftAsset(file, slug, scope)
}

export async function recordMediaAsset(asset: MediaAsset, updatedBy: string) {
  const item = {
    ...asset,
    updatedAt: new Date().toISOString(),
    updatedBy,
  }

  const apiResponse = await cmsFetch<{ item: MediaAsset }>("/cms/admin/assets/media/draft", {
    method: "PUT",
    body: JSON.stringify(item),
  })

  if (apiResponse) {
    return apiResponse.item
  }

  await putMediaAsset(item, item.status)
  return item
}
