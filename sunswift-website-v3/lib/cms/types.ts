export type TeamMember = {
  slug: string
  name: string
  role: string
  discipline: string
  bio: string
  imageKey?: string
  status?: "draft" | "published"
}

export type RecruitmentRole = {
  slug: string
  title: string
  team: string
  description: string
  status?: "draft" | "published"
}

export type Vehicle = {
  slug: string
  name: string
  years: string
  summary: string
  image: string
  specs: Record<string, string>
  achievements: string[]
  relatedPosts: string[]
}
