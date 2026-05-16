export const TEAM_DEPARTMENTS = [
  "Alternative Energies",
  "Business",
  "Chassis and Bodywork",
  "Embedded Systems",
  "Energy Systems",
  "Interior",
  "Materials Science",
  "Media",
  "Powertrain",
  "Systems Engineering",
  "Technical Support Systems",
  "Vehicle Dynamics",
] as const

export const TEAM_HIERARCHIES = [
  "Academic",
  "SLT",
  "ELT",
  "Officer",
  "Team",
] as const

export const DEFAULT_TEAM_DEPARTMENT: (typeof TEAM_DEPARTMENTS)[number] =
  "Systems Engineering"
export const DEFAULT_TEAM_HIERARCHY: (typeof TEAM_HIERARCHIES)[number] = "Team"

export function normalizeTeamDepartment(value?: string | null) {
  const trimmed = String(value ?? "").trim()
  return TEAM_DEPARTMENTS.includes(trimmed as (typeof TEAM_DEPARTMENTS)[number])
    ? trimmed
    : DEFAULT_TEAM_DEPARTMENT
}

export function normalizeTeamHierarchy(value?: string | null) {
  const trimmed = String(value ?? "").trim()
  return TEAM_HIERARCHIES.includes(trimmed as (typeof TEAM_HIERARCHIES)[number])
    ? trimmed
    : DEFAULT_TEAM_HIERARCHY
}
