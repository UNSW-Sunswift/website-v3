import type { RecruitmentRole } from "@/lib/cms/types"

export type RecruitmentStream = {
  name: "Design" | "Engineering" | "Business"
  slug: "design" | "engineering" | "business"
  rolePath: "design-roles" | "engineering-roles" | "business-roles"
  roleTitle: "Design Roles" | "Engineering Roles" | "Business Roles"
  label: string
  summary: string
  webflowNote: string
  teams: string[]
}

export const recruitmentStreams: RecruitmentStream[] = [
  {
    name: "Design",
    slug: "design",
    rolePath: "design-roles",
    roleTitle: "Design Roles",
    label: "Design / Media",
    summary:
      "Shape how Sunswift is seen, heard and remembered through visual design, storytelling, media strategy and content production.",
    webflowNote:
      "Media students craft Sunswift's public presence across social channels, promotional content, photography and video.",
    teams: ["design", "media"],
  },
  {
    name: "Engineering",
    slug: "engineering",
    rolePath: "engineering-roles",
    roleTitle: "Engineering Roles",
    label: "Vehicle Systems",
    summary:
      "Design, build, test and integrate the systems that make a solar electric race car efficient, reliable and safe.",
    webflowNote:
      "Engineering roles span the vehicle's electrical, mechanical, energy, software and alternative energy systems.",
    teams: [
      "engineering",
      "software engineering",
      "electrical engineering",
      "mechanical engineering",
      "renewables",
      "chemical engineering",
    ],
  },
  {
    name: "Business",
    slug: "business",
    rolePath: "business-roles",
    roleTitle: "Business Roles",
    label: "Operations",
    summary:
      "Run the project around the car: finance, marketing, operations, partnerships, logistics, people and delivery.",
    webflowNote:
      "Business students manage project planning, partnerships, HR, logistics, finance, marketing and operations.",
    teams: [
      "business",
      "finance",
      "marketing",
      "operations",
      "partnerships",
      "logistics",
      "strategy",
    ],
  },
]

export function rolesForRecruitmentStream(
  roles: RecruitmentRole[],
  stream: RecruitmentStream
) {
  return roles.filter((role) => {
    if (role.active === false) {
      return false
    }

    const team = role.team.toLowerCase()
    return stream.teams.some((streamTeam) => team.includes(streamTeam))
  })
}

export function recruitmentStreamHref(stream: RecruitmentStream) {
  return `/recruitment/available-roles/${stream.rolePath}`
}

export function getRecruitmentStreamByRolePath(path: string) {
  return recruitmentStreams.find((stream) => stream.rolePath === path)
}
