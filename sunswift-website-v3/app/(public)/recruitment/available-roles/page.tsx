import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
  recruitmentStreamHref,
  recruitmentStreams,
  rolesForRecruitmentStream,
} from "@/components/site/recruitment-content"
import { TransparentNavbar } from "@/components/site/transparent-navbar"
import { getRecruitmentRoles } from "@/lib/cms/dynamodb"

export const dynamic = "force-dynamic"

export default async function AvailableRolesPage() {
  const roles = await getRecruitmentRoles("published")

  return (
    <main data-available-roles-page className="bg-[#0a0c0e] text-white">
      <div className="relative">
        <TransparentNavbar />
        <section className="relative overflow-hidden bg-[#0a0c0e]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_18%,rgba(245,208,0,0.12)_0%,transparent_34%),linear-gradient(180deg,#050607_0%,#0a0c0e_68%,#050607_100%)]" />
          <div className="relative mx-auto max-w-[92rem] px-4 pt-28 pb-16 sm:px-6 lg:pt-36 lg:pb-24">
            <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
              <h1 className="max-w-5xl text-[clamp(4rem,10vw,9.5rem)] leading-[0.88] font-thin tracking-normal text-white">
                Available roles.
              </h1>
              <p className="max-w-xl text-base leading-7 text-white/58 sm:text-lg">
                Choose the stream you want to scan. Each section now has its own
                page so experienced applicants can jump straight to the role
                family they care about.
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="bg-[#0a0c0e] pb-24 text-white lg:pb-32">
        <div className="mx-auto max-w-[92rem] px-4 sm:px-6">
          <div
            className="grid gap-4 md:grid-cols-3"
            data-available-role-streams
          >
            {recruitmentStreams.map((stream) => {
              const streamRoles = rolesForRecruitmentStream(roles, stream)
              return (
                <Link
                  key={stream.name}
                  href={recruitmentStreamHref(stream)}
                  data-available-role-stream={stream.name}
                  className="group flex min-h-[28rem] flex-col justify-between border border-white/10 bg-white/[0.035] p-6 transition-colors duration-300 hover:border-accent-yellow/70 hover:bg-white/[0.07]"
                >
                  <span>
                    <span className="font-mono text-[0.66rem] tracking-[0.26em] text-white/38 uppercase">
                      {stream.label}
                    </span>
                    <span className="mt-4 block text-5xl leading-none font-light text-white sm:text-6xl">
                      {stream.roleTitle}
                    </span>
                    <span className="mt-6 block text-sm leading-6 text-white/56">
                      {stream.summary}
                    </span>
                  </span>

                  <span>
                    <span
                      className="flex flex-wrap gap-2"
                      data-available-role-families={stream.name}
                    >
                      {stream.families.map((family) => (
                        <span
                          key={family}
                          className="border border-white/12 px-3 py-2 font-mono text-[0.6rem] tracking-[0.2em] text-white/48 uppercase"
                        >
                          {family}
                        </span>
                      ))}
                    </span>
                    <span className="mt-8 flex items-center justify-between border-t border-white/10 pt-5 font-mono text-[0.62rem] tracking-[0.22em] text-white/48 uppercase transition-colors duration-300 group-hover:text-accent-yellow">
                      {streamRoles.length} current{" "}
                      {streamRoles.length === 1 ? "role" : "roles"}
                      <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
