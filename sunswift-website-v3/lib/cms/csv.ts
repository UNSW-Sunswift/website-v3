import type { Partner, RecruitmentRole, TeamMember } from "@/lib/cms/types"
import {
  normalizeTeamDepartment,
  normalizeTeamHierarchy,
} from "@/lib/cms/team-options"

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function parseCsv(text: string) {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ""
  let quoted = false

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    const next = text[index + 1]

    if (char === '"' && quoted && next === '"') {
      cell += '"'
      index += 1
    } else if (char === '"') {
      quoted = !quoted
    } else if (char === "," && !quoted) {
      row.push(cell)
      cell = ""
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") {
        index += 1
      }
      row.push(cell)
      if (row.some((value) => value.trim().length > 0)) {
        rows.push(row)
      }
      row = []
      cell = ""
    } else {
      cell += char
    }
  }

  row.push(cell)
  if (row.some((value) => value.trim().length > 0)) {
    rows.push(row)
  }

  return rows
}

function recordsFromCsv(text: string, headerRowIndex = 0) {
  const rows = parseCsv(text)
  const headers = rows[headerRowIndex]?.map((header) => header.trim().replace(/^\uFEFF/, "")) ?? []

  return rows.slice(headerRowIndex + 1).map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, row[index]?.trim() ?? ""]))
  )
}

export function importTeamCsv(text: string): TeamMember[] {
  const headerRowIndex = text.includes("Student Info") ? 1 : 0

  return recordsFromCsv(text, headerRowIndex)
    .filter((record) => {
      const currentMember = String(record["Current Member"] ?? "").toLowerCase()
      return currentMember === "" || currentMember === "yes"
    })
    .map((record, index) => {
      const firstName = String(record["First Name"] ?? "").trim()
      const lastName = String(record["Last Name"] ?? "").trim()
      const fullName = String(record.Name ?? `${firstName} ${lastName}`).trim()
      const name = fullName.replace(/\s+/g, " ")
      const role = String(record["Role Title"] || record["Team Role"] || "").trim()
      const department = normalizeTeamDepartment(record.Department as string)
      const hierarchyLevel = normalizeTeamHierarchy(record["Hierarchy Level"] as string)
      const additionalRoles = String(record["Additional Roles"] ?? "").trim()
      const imageKey = String(record.Headshot ?? "").trim()
      const fallbackRole =
        department === "Business" ? "Business Officer" : `${department} Engineer`.trim()

      return {
        slug: slugify(name),
        name,
        role: role || fallbackRole,
        department,
        hierarchyLevel,
        additionalRoles,
        imageKey,
        sortOrder: index + 1,
        status: "draft" as const,
      }
    })
    .filter((member) => member.slug && member.name)
}

export function importRecruitmentCsv(text: string): RecruitmentRole[] {
  return recordsFromCsv(text).map((record, index) => {
    const title = String(record["Role Name"] ?? record.Title ?? "").trim()

    return {
      slug: slugify(String(record.Slug || title)),
      title,
      team: String(record.Discipline || record.Team || "").trim(),
      description: String(record.Responsibilities || record.Description || "").trim(),
      active: String(record["Active?"] ?? "true").toLowerCase() !== "false",
      discipline: String(record.Discipline ?? "").trim(),
      school: String(record.School ?? "").trim(),
      responsibilitiesHtml: String(record.Responsibilities ?? "").trim(),
      requirementsHtml: String(record.Requirements ?? "").trim(),
      roleImageKey: String(record["Role Image"] ?? "").trim(),
      sortOrder: index + 1,
      status: "draft" as const,
    }
  }).filter((role) => role.slug && role.title)
}

export function importPartnersCsv(text: string): Partner[] {
  return recordsFromCsv(text).map((record, index) => {
    const name = String(record.Partners ?? record.Name ?? "").trim()

    return {
      slug: slugify(String(record.Slug || name)),
      name,
      website: String(record["Partner Website"] || record.Website || "#").trim(),
      logoKey: String(record.Logo ?? "").trim(),
      sortOrder: index + 1,
      status: "draft" as const,
    }
  }).filter((partner) => partner.slug && partner.name)
}
