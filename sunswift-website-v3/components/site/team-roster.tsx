"use client"

import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { TransparentNavbar } from "@/components/site/transparent-navbar"
import { cn } from "@/lib/utils"
import type { TeamMember as CmsTeamMember } from "@/lib/cms/types"

/**
 * Hydrates from CMS `TeamMember`: `publishedAssetKey`, `hierarchyLevel`, etc.
 * align with the CMS replacement database schema; placeholderMembers cover local dev.
 */

/** Publication order (top → bottom), aligned with Webflow / CMS hierarchy levels. */
export const TEAM_ROSTER_SECTION_ORDER = [
  "Academic",
  "SLT",
  "ELT",
  "Team",
] as const

export type TeamRosterSection = (typeof TEAM_ROSTER_SECTION_ORDER)[number]

const SECTION_HEADINGS: Record<TeamRosterSection, string> = {
  Academic: "Academics",
  SLT: "Senior Leadership Team",
  ELT: "Executive Leadership Team",
  Team: "Team",
}

type RosterMember = {
  name: string
  role: string
  department: string
  /** Badge label (CMS hierarchy level: Academic, SLT, ELT, Officer, Team). */
  hierarchy: string
  /** Grouping for stacked sections (four bands on the page). */
  section: TeamRosterSection
  imageSrc: string
  slug?: string
}

const placeholderImage = "/placeholders/team-member.svg"

const teamHeroMediaPath = "/media/our-team.jpg"

function hierarchyToSection(level: string | undefined): TeamRosterSection {
  const h = String(level ?? "").trim()
  if (h === "Academic") return "Academic"
  if (h === "SLT") return "SLT"
  if (h === "ELT" || h === "Officer") return "ELT"
  return "Team"
}

const placeholderMembers: RosterMember[] = [
  {
    name: "Dr. Sam Chen",
    role: "Faculty advisor",
    department: "Systems Engineering",
    hierarchy: "Academic",
    section: "Academic",
    imageSrc: placeholderImage,
  },
  {
    name: "Priya Shah",
    role: "Materials liaison",
    department: "Materials Science",
    hierarchy: "Academic",
    section: "Academic",
    imageSrc: placeholderImage,
  },
  {
    name: "Maya Chen",
    role: "Chief Engineer",
    department: "Systems Engineering",
    hierarchy: "SLT",
    section: "SLT",
    imageSrc: placeholderImage,
  },
  {
    name: "Ethan Brooks",
    role: "Chassis lead",
    department: "Chassis and Bodywork",
    hierarchy: "SLT",
    section: "SLT",
    imageSrc: placeholderImage,
  },
  {
    name: "Harper Lee",
    role: "Vehicle dynamics lead",
    department: "Vehicle Dynamics",
    hierarchy: "ELT",
    section: "ELT",
    imageSrc: placeholderImage,
  },
  {
    name: "Noah Patel",
    role: "Embedded lead",
    department: "Embedded Systems",
    hierarchy: "ELT",
    section: "ELT",
    imageSrc: placeholderImage,
  },
  {
    name: "Amelia Ford",
    role: "Partnerships lead",
    department: "Business",
    hierarchy: "ELT",
    section: "ELT",
    imageSrc: placeholderImage,
  },
  {
    name: "Sofia Nguyen",
    role: "Energy systems engineer",
    department: "Energy Systems",
    hierarchy: "Team",
    section: "Team",
    imageSrc: placeholderImage,
  },
  {
    name: "Leo Kim",
    role: "Media officer",
    department: "Media",
    hierarchy: "Team",
    section: "Team",
    imageSrc: placeholderImage,
  },
  {
    name: "Zara Martins",
    role: "Recruitment coordinator",
    department: "Business",
    hierarchy: "Team",
    section: "Team",
    imageSrc: placeholderImage,
  },
  {
    name: "Marcus Tan",
    role: "Strategy engineer",
    department: "Technical Support Systems",
    hierarchy: "Team",
    section: "Team",
    imageSrc: placeholderImage,
  },
  {
    name: "Jamie Wilson",
    role: "Powertrain engineer",
    department: "Powertrain",
    hierarchy: "Team",
    section: "Team",
    imageSrc: placeholderImage,
  },
]

function toRosterMember(member: CmsTeamMember): RosterMember {
  const level = member.hierarchyLevel?.trim() || "Team"
  return {
    slug: member.slug,
    name: member.name,
    role: member.role,
    department: member.department || "Systems Engineering",
    hierarchy: level,
    section: hierarchyToSection(member.hierarchyLevel),
    imageSrc: member.publishedAssetKey || member.imageKey || placeholderImage,
  }
}

export function TeamRoster({
  members = placeholderMembers,
}: {
  members?: CmsTeamMember[] | RosterMember[]
}) {
  const sourceMembers = members.length >= 10 ? members : placeholderMembers
  const rosterMembers = useMemo(
    () =>
      sourceMembers.map((member) =>
        "section" in member ? member : toRosterMember(member)
      ),
    [sourceMembers]
  )
  const departments = useMemo(
    () => [
      "All departments",
      ...Array.from(
        new Set(rosterMembers.map((member) => member.department))
      ).sort((a, b) => a.localeCompare(b)),
    ],
    [rosterMembers]
  )
  const departmentCount = departments.length - 1
  const [selectedDepartment, setSelectedDepartment] =
    useState("All departments")

  /** Initial page reveal (below hero): fade + slight rise. */
  const [rosterReveal, setRosterReveal] = useState(false)
  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    const id = window.requestAnimationFrame(() => setRosterReveal(true))
    return () => window.cancelAnimationFrame(id)
  }, [])

  const filteredMembers = useMemo(() => {
    if (selectedDepartment === "All departments") {
      return rosterMembers
    }

    return rosterMembers.filter(
      (member) => member.department === selectedDepartment
    )
  }, [rosterMembers, selectedDepartment])

  const membersBySection = useMemo(() => {
    const map: Record<TeamRosterSection, RosterMember[]> = {
      Academic: [],
      SLT: [],
      ELT: [],
      Team: [],
    }
    for (const m of filteredMembers) {
      map[m.section].push(m)
    }
    return map
  }, [filteredMembers])

  return (
    <main
      data-team-page
      className="min-h-screen overflow-x-clip bg-[#080808] text-white"
    >
      <div className="relative">
        <TransparentNavbar />
        <section
          data-team-hero
          className="relative min-h-[86svh] overflow-hidden bg-[#080808]"
        >
          <div className="pointer-events-none absolute inset-0 z-[1]">
            <Image
              src={teamHeroMediaPath}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[50%_38%]"
            />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(180deg,transparent_0%,rgba(8,8,8,0.08)_38%,rgba(8,8,8,0.58)_68%,rgba(8,8,8,0.94)_88%,#080808_100%),linear-gradient(90deg,rgba(8,8,8,0.88)_0%,rgba(8,8,8,0.52)_min(28rem,72%),rgba(8,8,8,0.12)_min(42rem,85%),transparent_100%)]"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-40 bg-[linear-gradient(180deg,#000_0%,rgba(10,12,14,0)_100%)]" />
          <div className="relative z-10 mx-auto flex min-h-[86svh] max-w-[92rem] flex-col justify-end px-4 pb-12 pt-28 sm:px-6 sm:pb-16 lg:pb-20 lg:pt-36">
            <div className="max-w-3xl">
              <h1 className="team-hero-enter team-hero-enter-delay-1 mt-4 max-w-[min(100%,18ch)] text-[clamp(3.25rem,9.5vw,8.25rem)] leading-[0.88] font-thin tracking-normal text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.48)]">
                Our Team.
              </h1>

              <div
                className="team-hero-enter team-hero-enter-delay-2 mt-10 flex flex-wrap gap-4 sm:gap-5"
                data-team-hero-metrics
                aria-label="Team roster stats"
              >
                <div className="flex min-h-[7.75rem] min-w-[10.5rem] flex-1 flex-col justify-between border border-white/16 bg-black/38 px-5 py-4 backdrop-blur-md sm:max-w-[13rem] sm:flex-none lg:py-5">
                  <p className="font-mono text-[0.62rem] tracking-[0.22em] text-white/52 uppercase">
                    Members
                  </p>
                  <p
                    data-team-count
                    className="mt-5 text-[2.35rem] font-light tracking-tight text-white tabular-nums leading-none sm:text-[2.65rem]"
                  >
                    {rosterMembers.length}
                  </p>
                </div>
                <div className="flex min-h-[7.75rem] min-w-[10.5rem] flex-1 flex-col justify-between border border-white/16 bg-black/38 px-5 py-4 backdrop-blur-md sm:max-w-[13rem] sm:flex-none lg:py-5">
                  <p className="font-mono text-[0.62rem] tracking-[0.22em] text-white/52 uppercase">
                    Departments
                  </p>
                  <p
                    data-team-department-count
                    className="mt-5 text-[2.35rem] font-light tracking-tight text-white tabular-nums leading-none sm:text-[2.65rem]"
                  >
                    {departmentCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="mx-auto max-w-[92rem] border-t border-white/10 px-6 pb-28 pt-12 sm:px-10 lg:px-14 lg:pt-14">
        <div
          className={cn(
            "sticky top-0 z-30 -mx-6 border-y border-white/12 bg-[#080808]/84 px-6 py-4 backdrop-blur-2xl sm:-mx-10 sm:px-10 lg:-mx-14 lg:px-14",
            rosterReveal ? "team-roster-reveal" : "opacity-0"
          )}
          style={{
            animationDelay: rosterReveal ? "0ms" : undefined,
          }}
        >
          <div className="mx-auto flex max-w-[92rem] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[0.68rem] tracking-[0.26em] text-white/45 uppercase">
              Filter roster
            </p>
            <label className="relative block w-full sm:w-[22rem]">
              <span className="sr-only">Filter team by department</span>
              <select
                data-team-filter
                value={selectedDepartment}
                onChange={(event) => setSelectedDepartment(event.target.value)}
                className="h-12 w-full appearance-none border border-white/16 bg-white/[0.055] px-4 pr-11 font-mono text-xs tracking-[0.18em] text-white uppercase transition-[border-color,background-color] duration-300 outline-none hover:border-accent-yellow/70 focus:border-accent-yellow focus:bg-white/[0.08]"
              >
                {departments.map((department) => (
                  <option
                    key={department}
                    value={department}
                    className="bg-black text-white"
                  >
                    {department}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-accent-yellow"
              />
            </label>
          </div>
        </div>

        <div
          data-team-grid
          className={cn(
            "mt-10 flex flex-col gap-16 lg:gap-24",
            rosterReveal ? "team-roster-reveal" : "opacity-0"
          )}
          style={{
            animationDelay: rosterReveal ? "80ms" : undefined,
          }}
        >
          {TEAM_ROSTER_SECTION_ORDER.map((section, sectionIndex) => {
            const sectionMembers = membersBySection[section]
            if (sectionMembers.length === 0) {
              return null
            }

            return (
              <section
                key={section}
                data-team-section={section}
                className={cn(
                  "scroll-mt-28",
                  rosterReveal ? "team-roster-section-reveal" : "opacity-0"
                )}
                style={{
                  animationDelay: rosterReveal
                    ? `${140 + sectionIndex * 70}ms`
                    : undefined,
                }}
              >
                <div className="flex flex-col gap-2 border-b border-white/12 pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <h2 className="text-2xl font-light tracking-tight text-white sm:text-3xl lg:text-[2.15rem]">
                    {SECTION_HEADINGS[section]}
                  </h2>
                  <p className="font-mono text-[0.62rem] tracking-[0.22em] text-white/38 uppercase">
                    {sectionMembers.length}{" "}
                    {sectionMembers.length === 1 ? "member" : "members"}
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden bg-white/10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                  {sectionMembers.map((member, index) => (
                    <article
                      key={`${selectedDepartment}-${section}-${member.slug ?? member.name}`}
                      data-team-card
                      data-team-department={member.department}
                      data-team-hierarchy-section={section}
                      className="team-card-filter-in group relative bg-[#101010] p-3 transition-colors duration-500 hover:bg-[#141414] sm:p-3.5"
                      style={{
                        animationDelay: `${Math.min(index * 36, 200)}ms`,
                      }}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-[#181818]">
                        <Image
                          src={member.imageSrc}
                          alt=""
                          fill
                          className="object-cover opacity-[0.78] grayscale transition-[opacity,transform,filter] duration-700 group-hover:scale-[1.03] group-hover:opacity-100 group-hover:grayscale-0"
                          sizes="(min-width: 1536px) 16vw, (min-width: 1280px) 18vw, (min-width: 640px) 28vw, 45vw"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(0,0,0,0.88))]" />
                        <div className="absolute top-2 left-2 border border-white/18 bg-black/38 px-2 py-0.5 font-mono text-[0.52rem] tracking-[0.18em] text-white/76 uppercase backdrop-blur-md sm:text-[0.58rem] sm:tracking-[0.2em]">
                          {member.hierarchy}
                        </div>
                      </div>
                      <div className="pt-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate font-mono text-[0.58rem] tracking-[0.2em] text-accent-yellow uppercase sm:text-[0.62rem] sm:tracking-[0.22em]">
                              {member.department}
                            </p>
                            <h3 className="mt-1.5 truncate text-[1.05rem] leading-tight font-light tracking-normal text-white sm:text-lg lg:text-xl">
                              {member.name}
                            </h3>
                          </div>
                        </div>
                        <p className="mt-2 line-clamp-3 text-xs leading-snug text-white/55 sm:text-[0.82rem] sm:leading-5">
                          {member.role}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </section>
    </main>
  )
}
