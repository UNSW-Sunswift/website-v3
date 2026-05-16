"use client"

import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { cn } from "@/lib/utils"
import type { TeamMember as CmsTeamMember } from "@/lib/cms/types"

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
  discipline: string
  /** Badge label (CMS hierarchy level: Academic, SLT, ELT, Officer, Team). */
  hierarchy: string
  /** Grouping for stacked sections (four bands on the page). */
  section: TeamRosterSection
  imageSrc: string
  slug?: string
}

const placeholderImage = "/placeholders/team-member.svg"

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
    discipline: "Academic",
    hierarchy: "Academic",
    section: "Academic",
    imageSrc: placeholderImage,
  },
  {
    name: "Priya Shah",
    role: "Materials liaison",
    department: "Materials Science",
    discipline: "Science",
    hierarchy: "Academic",
    section: "Academic",
    imageSrc: placeholderImage,
  },
  {
    name: "Maya Chen",
    role: "Chief Engineer",
    department: "Systems Engineering",
    discipline: "Engineering",
    hierarchy: "SLT",
    section: "SLT",
    imageSrc: placeholderImage,
  },
  {
    name: "Ethan Brooks",
    role: "Chassis lead",
    department: "Chassis and Bodywork",
    discipline: "Mechanical",
    hierarchy: "SLT",
    section: "SLT",
    imageSrc: placeholderImage,
  },
  {
    name: "Harper Lee",
    role: "Vehicle dynamics lead",
    department: "Vehicle Dynamics",
    discipline: "Mechanical",
    hierarchy: "ELT",
    section: "ELT",
    imageSrc: placeholderImage,
  },
  {
    name: "Noah Patel",
    role: "Embedded lead",
    department: "Embedded Systems",
    discipline: "Electrical",
    hierarchy: "ELT",
    section: "ELT",
    imageSrc: placeholderImage,
  },
  {
    name: "Amelia Ford",
    role: "Partnerships lead",
    department: "Business",
    discipline: "Operations",
    hierarchy: "ELT",
    section: "ELT",
    imageSrc: placeholderImage,
  },
  {
    name: "Sofia Nguyen",
    role: "Energy systems engineer",
    department: "Energy Systems",
    discipline: "Electrical",
    hierarchy: "Team",
    section: "Team",
    imageSrc: placeholderImage,
  },
  {
    name: "Leo Kim",
    role: "Media officer",
    department: "Media",
    discipline: "Creative",
    hierarchy: "Team",
    section: "Team",
    imageSrc: placeholderImage,
  },
  {
    name: "Zara Martins",
    role: "Recruitment coordinator",
    department: "Business",
    discipline: "People",
    hierarchy: "Team",
    section: "Team",
    imageSrc: placeholderImage,
  },
  {
    name: "Marcus Tan",
    role: "Strategy engineer",
    department: "Technical Support Systems",
    discipline: "Software",
    hierarchy: "Team",
    section: "Team",
    imageSrc: placeholderImage,
  },
  {
    name: "Jamie Wilson",
    role: "Powertrain engineer",
    department: "Powertrain",
    discipline: "Mechanical",
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
    department: member.department || member.discipline || "Systems Engineering",
    discipline: member.discipline ?? "",
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
    () => sourceMembers.map((member) => ("section" in member ? member : toRosterMember(member))),
    [sourceMembers]
  )
  const departments = useMemo(
    () => [
      "All departments",
      ...Array.from(new Set(rosterMembers.map((member) => member.department))).sort((a, b) =>
        a.localeCompare(b)
      ),
    ],
    [rosterMembers]
  )
  const [selectedDepartment, setSelectedDepartment] =
    useState("All departments")

  /** Initial page reveal (below hero): fade + slight rise. */
  const [rosterReveal, setRosterReveal] = useState(false)
  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRosterReveal(true)
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
      <section className="relative isolate pt-32 pb-14 sm:pt-40 lg:pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_16%,rgba(245,208,0,0.2),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_42%)]" />
        <div className="mx-auto grid max-w-[92rem] gap-10 px-6 sm:px-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end lg:px-14">
          <div>
            <p className="font-mono text-xs tracking-[0.38em] text-accent-yellow uppercase">
              Team
            </p>
            <h1 className="mt-5 max-w-5xl text-[clamp(4rem,13vw,13rem)] leading-[0.78] font-thin tracking-normal">
              Our Team.
            </h1>
          </div>
          <div className="max-w-md lg:justify-self-end">
            <p className="text-lg leading-7 text-white/70">
              A student-led racing team spanning engineering, business, media
              and operations. Profiles are sourced from the CMS replacement
              database with static fallbacks for local development.
            </p>
            <div className="mt-8 grid grid-cols-2 border-y border-white/15 py-5">
              <div>
                <p
                  data-team-count
                  className="text-3xl font-light tracking-normal text-white"
                >
                  {rosterMembers.length}
                </p>
                <p className="mt-1 font-mono text-[0.66rem] tracking-[0.22em] text-white/42 uppercase">
                  Profiles
                </p>
              </div>
              <div className="border-l border-white/15 pl-5">
                <p
                  data-filtered-count
                  className="text-3xl font-light tracking-normal text-white"
                >
                  {filteredMembers.length}
                </p>
                <p className="mt-1 font-mono text-[0.66rem] tracking-[0.22em] text-white/42 uppercase">
                  In view
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[92rem] px-6 pb-28 sm:px-10 lg:px-14">
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
                className="h-12 w-full appearance-none border border-white/16 bg-white/[0.055] px-4 pr-11 font-mono text-xs tracking-[0.18em] text-white uppercase outline-none transition-[border-color,background-color] duration-300 hover:border-accent-yellow/70 focus:border-accent-yellow focus:bg-white/[0.08]"
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
                  animationDelay: rosterReveal ? `${140 + sectionIndex * 70}ms` : undefined,
                }}
              >
                <div className="flex flex-col gap-2 border-b border-white/12 pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <h2 className="text-2xl font-light tracking-tight text-white sm:text-3xl lg:text-[2.15rem]">
                    {SECTION_HEADINGS[section]}
                  </h2>
                  <p className="font-mono text-[0.62rem] tracking-[0.22em] text-white/38 uppercase">
                    {sectionMembers.length}{" "}
                    {sectionMembers.length === 1 ? "profile" : "profiles"}
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
                          {member.discipline ? (
                            <p className="line-clamp-2 max-w-[5.5rem] text-right font-mono text-[0.54rem] leading-snug tracking-[0.16em] text-white/38 uppercase sm:max-w-[6.5rem] sm:text-[0.58rem] sm:tracking-[0.18em]">
                              {member.discipline}
                            </p>
                          ) : null}
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
