"use client"

import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { useMemo, useState } from "react"

type TeamMember = {
  name: string
  role: string
  department: string
  discipline: string
  hierarchy: string
  imageSrc: string
}

const placeholderImage = "/placeholders/team-member.svg"

const placeholderMembers: TeamMember[] = [
  {
    name: "Alex Rivera",
    role: "Team Principal",
    department: "Leadership",
    discipline: "Strategy",
    hierarchy: "Executive",
    imageSrc: placeholderImage,
  },
  {
    name: "Maya Chen",
    role: "Chief Engineer",
    department: "Systems Engineering",
    discipline: "Engineering",
    hierarchy: "Lead",
    imageSrc: placeholderImage,
  },
  {
    name: "Noah Patel",
    role: "Embedded Systems Lead",
    department: "Embedded Systems",
    discipline: "Electrical",
    hierarchy: "Lead",
    imageSrc: placeholderImage,
  },
  {
    name: "Sofia Nguyen",
    role: "Energy Systems Engineer",
    department: "Energy Systems",
    discipline: "Electrical",
    hierarchy: "Member",
    imageSrc: placeholderImage,
  },
  {
    name: "Ethan Brooks",
    role: "Chassis Design Lead",
    department: "Chassis and Bodywork",
    discipline: "Mechanical",
    hierarchy: "Lead",
    imageSrc: placeholderImage,
  },
  {
    name: "Priya Shah",
    role: "Aerodynamics Engineer",
    department: "Chassis and Bodywork",
    discipline: "Mechanical",
    hierarchy: "Member",
    imageSrc: placeholderImage,
  },
  {
    name: "Jamie Wilson",
    role: "Powertrain Engineer",
    department: "Powertrain",
    discipline: "Mechanical",
    hierarchy: "Member",
    imageSrc: placeholderImage,
  },
  {
    name: "Harper Lee",
    role: "Vehicle Dynamics Lead",
    department: "Vehicle Dynamics",
    discipline: "Mechanical",
    hierarchy: "Lead",
    imageSrc: placeholderImage,
  },
  {
    name: "Marcus Tan",
    role: "Strategy Engineer",
    department: "Technical Support Systems",
    discipline: "Software",
    hierarchy: "Member",
    imageSrc: placeholderImage,
  },
  {
    name: "Amelia Ford",
    role: "Partnerships Lead",
    department: "Business",
    discipline: "Operations",
    hierarchy: "Lead",
    imageSrc: placeholderImage,
  },
  {
    name: "Leo Kim",
    role: "Media Producer",
    department: "Media",
    discipline: "Creative",
    hierarchy: "Member",
    imageSrc: placeholderImage,
  },
  {
    name: "Zara Martins",
    role: "Recruitment Coordinator",
    department: "Business",
    discipline: "People",
    hierarchy: "Coordinator",
    imageSrc: placeholderImage,
  },
]

const departments = [
  "All departments",
  ...Array.from(
    new Set(placeholderMembers.map((member) => member.department))
  ).sort((a, b) => a.localeCompare(b)),
]

export function TeamRoster() {
  const [selectedDepartment, setSelectedDepartment] =
    useState("All departments")

  const filteredMembers = useMemo(() => {
    if (selectedDepartment === "All departments") {
      return placeholderMembers
    }

    return placeholderMembers.filter(
      (member) => member.department === selectedDepartment
    )
  }, [selectedDepartment])

  return (
    <main
      data-team-page
      className="min-h-screen overflow-x-clip bg-[#080808] text-white"
    >
      <section className="relative isolate pt-32 pb-14 sm:pt-40 lg:pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_16%,rgba(245,208,0,0.2),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_42%)]" />
        <div className="mx-auto grid max-w-[92rem] gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
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
              and operations. These placeholder profiles model the CMS-driven
              roster that will replace them later.
            </p>
            <div className="mt-8 grid grid-cols-2 border-y border-white/15 py-5">
              <div>
                <p
                  data-team-count
                  className="text-3xl font-light tracking-normal text-white"
                >
                  {placeholderMembers.length}
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

      <section className="mx-auto max-w-[92rem] px-4 pb-24 sm:px-6">
        <div className="sticky top-0 z-30 -mx-4 border-y border-white/12 bg-[#080808]/84 px-4 py-4 backdrop-blur-2xl sm:-mx-6 sm:px-6">
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
          className="mt-8 grid gap-px overflow-hidden bg-white/12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredMembers.map((member, index) => (
            <article
              key={`${selectedDepartment}-${member.name}`}
              data-team-card
              data-team-department={member.department}
              className="team-card-filter-in group relative min-h-[31rem] bg-[#101010] p-4 transition-colors duration-500 hover:bg-[#151515]"
              style={{
                animationDelay: `${Math.min(index * 42, 260)}ms`,
              }}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#181818]">
                <Image
                  src={member.imageSrc}
                  alt=""
                  fill
                  className="object-cover opacity-[0.78] grayscale transition-[opacity,transform,filter] duration-700 group-hover:scale-[1.025] group-hover:opacity-100 group-hover:grayscale-0"
                  sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_36%,rgba(0,0,0,0.86))]" />
                <div className="absolute top-3 left-3 border border-white/18 bg-black/35 px-2.5 py-1 font-mono text-[0.62rem] tracking-[0.2em] text-white/70 uppercase backdrop-blur-xl">
                  {member.hierarchy}
                </div>
              </div>
              <div className="pt-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[0.66rem] tracking-[0.24em] text-accent-yellow uppercase">
                      {member.department}
                    </p>
                    <h2 className="mt-3 text-2xl leading-none font-light tracking-normal text-white">
                      {member.name}
                    </h2>
                  </div>
                  <p className="font-mono text-[0.64rem] tracking-[0.2em] text-white/36 uppercase">
                    {member.discipline}
                  </p>
                </div>
                <p className="mt-4 text-sm leading-6 text-white/62">
                  {member.role}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
