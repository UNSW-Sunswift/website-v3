export type TeamMember = {
  slug: string
  name: string
  role: string
  discipline?: string
  department?: string
  hierarchyLevel?: string
  additionalRoles?: string
  bio?: string
  imageKey?: string
  publishedAssetKey?: string
  sortOrder?: number
  updatedAt?: string
  updatedBy?: string
  status?: "draft" | "published"
}

export type RecruitmentRole = {
  slug: string
  title: string
  team: string
  description: string
  active?: boolean
  discipline?: string
  school?: string
  responsibilitiesHtml?: string
  requirementsHtml?: string
  roleImageKey?: string
  sortOrder?: number
  updatedAt?: string
  updatedBy?: string
  status?: "draft" | "published"
}

export type Partner = {
  slug: string
  name: string
  website: string
  logoKey?: string
  sortOrder?: number
  updatedAt?: string
  updatedBy?: string
  status?: "draft" | "published"
}

export type MediaAsset = {
  key: string
  bucket: string
  contentType: string
  size: number
  scope: "team" | "roles" | "partners" | "public-media"
  status: "draft" | "published"
  source: string
  publicUrl?: string
  updatedAt?: string
  updatedBy?: string
}

export type Vehicle = {
  slug: string
  name: string
  years: string
  summary: string
  overview?: string
  image: string
  specs: Record<string, string>
  achievements: string[]
}
