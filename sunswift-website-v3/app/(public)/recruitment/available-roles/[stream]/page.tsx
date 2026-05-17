import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { ArrowLeft } from "lucide-react"

import {
  getRecruitmentStreamByRolePath,
  recruitmentStreams,
  rolesForRecruitmentStream,
} from "@/components/site/recruitment-content"
import { RecruitmentRoleStreamCards } from "@/components/site/recruitment-role-stream-cards"
import { TransparentNavbar } from "@/components/site/transparent-navbar"
import { listCmsRecords } from "@/lib/cms/api"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ stream: string }>
}) {
  const { stream: streamPath } = await params
  const stream = getRecruitmentStreamByRolePath(streamPath)

  return {
    title: stream?.roleTitle ?? "Available Roles",
  }
}

export function generateStaticParams() {
  return recruitmentStreams.map((stream) => ({ stream: stream.rolePath }))
}

export default async function RecruitmentStreamRolePage({
  params,
}: {
  params: Promise<{ stream: string }>
}) {
  const { stream: streamPath } = await params
  const stream = getRecruitmentStreamByRolePath(streamPath)

  if (!stream) {
    notFound()
  }

  const roles = await listCmsRecords("roles", "published")
  const streamRoles = rolesForRecruitmentStream(roles, stream)

  return (
    <main
      data-role-stream-page={stream.slug}
      className="bg-[#0a0c0e] text-white"
    >
      <div className="relative">
        <TransparentNavbar />
        <section className="relative overflow-hidden bg-[#0a0c0e]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_18%,rgba(245,208,0,0.12)_0%,transparent_34%),linear-gradient(180deg,#050607_0%,#0a0c0e_68%,#050607_100%)]" />
          <div className="relative mx-auto max-w-[92rem] px-4 pt-28 pb-14 sm:px-6 lg:pt-36 lg:pb-20">
            <Link
              href="/recruitment/available-roles"
              className="inline-flex items-center gap-3 font-mono text-[0.64rem] tracking-[0.22em] text-white/48 uppercase transition-colors duration-300 hover:text-accent-yellow"
            >
              <ArrowLeft className="size-3.5" />
              Available roles
            </Link>
            <div className="mt-10 grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
              <h1 className="max-w-5xl text-[clamp(4rem,10vw,9.5rem)] leading-[0.88] font-thin tracking-normal text-white">
                {stream.roleTitle}.
              </h1>
              <div>
                <p className="max-w-xl text-base leading-7 text-white/58 sm:text-lg">
                  {stream.summary}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="bg-[#0a0c0e] pb-24 text-white lg:pb-32">
        <div className="mx-auto max-w-[92rem] px-4 pt-16 sm:px-6 sm:pt-20 lg:pt-28">
          {streamRoles.length > 0 ? (
            <Suspense
              fallback={
                <div
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  data-role-stream-cards={stream.name}
                >
                  {streamRoles.map((role) => (
                    <div
                      key={role.slug}
                      aria-hidden
                      className="h-36 w-full animate-pulse border border-white/10 bg-white/[0.04] sm:h-[10.5rem]"
                    />
                  ))}
                </div>
              }
            >
              <RecruitmentRoleStreamCards
                roles={streamRoles}
                streamCardsAttr={stream.name}
              />
            </Suspense>
          ) : (
            <div
              data-role-stream-empty
              className="flex min-h-[14rem] flex-col justify-between border border-dashed border-white/15 bg-white/[0.02] p-5 sm:col-span-2 lg:col-span-3"
            >
              <div className="font-mono text-[0.62rem] tracking-[0.22em] text-white/38 uppercase">
                Database ready
              </div>
              <p className="max-w-xl text-2xl leading-snug font-light text-white">
                Published {stream.name.toLowerCase()} roles will appear here
                when they are added to the CMS.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
