"use client"

import { useCallback, useEffect, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronDown, X } from "lucide-react"

import type { RecruitmentRole } from "@/lib/cms/types"

const ROLE_QUERY_KEY = "role"

function roleAdditionalFields(role: RecruitmentRole) {
  const bits: { label: string; value: string }[] = []
  if (role.discipline?.trim()) {
    bits.push({ label: "Discipline", value: role.discipline.trim() })
  }
  if (role.school?.trim()) {
    bits.push({ label: "School", value: role.school.trim() })
  }
  return bits
}

function CmsHtmlSection({
  eyebrow,
  html,
}: {
  eyebrow: string
  html: string
}) {
  const trimmed = html.trim()
  if (!trimmed) {
    return null
  }
  return (
    <div>
      <h3 className="font-mono text-[0.58rem] uppercase tracking-[0.28em] text-accent-yellow">
        {eyebrow}
      </h3>
      <div
        className="cms-inline mt-3 text-sm leading-relaxed text-white/75 [&_a]:text-accent-yellow [&_a]:underline [&_li+li]:mt-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-3 [&_strong]:text-white [&_ul]:list-disc [&_ul]:pl-5"
        dangerouslySetInnerHTML={{ __html: trimmed }}
      />
    </div>
  )
}

export function RecruitmentRoleStreamCards({
  roles,
  streamCardsAttr,
}: {
  roles: RecruitmentRole[]
  streamCardsAttr: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const expandedSlug = searchParams.get(ROLE_QUERY_KEY)
  const expandedRole = expandedSlug
    ? roles.find((r) => r.slug === expandedSlug) ?? null
    : null

  const panelRef = useRef<HTMLDivElement>(null)

  const setExpandedSlug = useCallback(
    (slug: string | null) => {
      const next = new URLSearchParams(searchParams.toString())
      if (slug) {
        next.set(ROLE_QUERY_KEY, slug)
      } else {
        next.delete(ROLE_QUERY_KEY)
      }
      const q = next.toString()
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  useEffect(() => {
    if (!expandedSlug) {
      return
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        setExpandedSlug(null)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [expandedSlug, setExpandedSlug])

  useEffect(() => {
    if (!expandedRole || !panelRef.current) {
      return
    }
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    panelRef.current.focus({ preventScroll: prefersReducedMotion })
    if (!prefersReducedMotion) {
      panelRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }, [expandedRole])

  const toggleSlug = useCallback(
    (slug: string) => {
      setExpandedSlug(expandedSlug === slug ? null : slug)
    },
    [expandedSlug, setExpandedSlug],
  )

  if (roles.length === 0) {
    return null
  }

  return (
    <div data-role-stream-cards={streamCardsAttr} className="flex flex-col gap-8 lg:gap-12">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {roles.map((role) => {
          const isOpen = expandedSlug === role.slug
          const schoolTag = role.school?.trim() || role.discipline?.trim() || ""

          return (
            <button
              key={role.slug}
              id={role.slug}
              type="button"
              data-role-stream-card
              aria-expanded={isOpen}
              aria-controls={isOpen ? "role-detail-panel" : undefined}
              className={`group touch-manipulation flex w-full min-h-[8.75rem] scroll-mt-28 flex-col border px-4 py-4 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0c0e] sm:min-h-[9.25rem] ${
                isOpen
                  ? "border-accent-yellow/80 bg-accent-yellow/[0.08]"
                  : "border-white/12 bg-white/[0.035] hover:border-accent-yellow/60 hover:bg-white/[0.06]"
              }`}
              onClick={() => toggleSlug(role.slug)}
            >
              <div className="flex flex-wrap items-start justify-between gap-2 gap-y-2">
                <span className="font-mono text-[0.55rem] uppercase tracking-[0.24em] text-accent-yellow">
                  {role.team}
                </span>
                {schoolTag ? (
                  <span className="ml-auto max-w-[min(100%-5rem,16rem)] break-words rounded-sm border border-accent-yellow/35 bg-accent-yellow/[0.09] px-2 py-1 text-right font-mono text-[0.5rem] leading-snug tracking-[0.14em] text-accent-yellow/[0.95] uppercase">
                    {schoolTag}
                  </span>
                ) : null}
              </div>

              <span className="mt-3 line-clamp-2 text-left text-base font-light leading-snug tracking-tight text-white sm:text-lg">
                {role.title}
              </span>
              <p className="mt-2 line-clamp-3 text-left text-[0.8125rem] leading-snug text-white/52 sm:text-sm">
                {role.description}
              </p>

              <span className="mt-auto flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[0.55rem] tracking-[0.2em] text-white/42 uppercase transition-colors duration-300 group-hover:text-white/55">
                {isOpen ? "Close" : "Role details"}
                <ChevronDown
                  className={`size-4 shrink-0 transition-transform duration-300 ease-out ${
                    isOpen ? "rotate-180 text-accent-yellow" : ""
                  }`}
                  aria-hidden
                />
              </span>
            </button>
          )
        })}
      </div>

      {expandedRole ? (
        <section
          ref={panelRef}
          id="role-detail-panel"
          role="region"
          aria-labelledby="role-detail-title"
          tabIndex={-1}
          className="border border-accent-yellow/35 bg-black/40 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/[0.06] sm:p-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.28em] text-accent-yellow">
                {expandedRole.team}
              </p>
              <h2
                id="role-detail-title"
                className="mt-2 text-3xl font-light tracking-tight text-white sm:text-4xl"
              >
                {expandedRole.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setExpandedSlug(null)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center border border-white/20 text-white/70 transition-colors duration-300 hover:border-accent-yellow hover:text-accent-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-yellow"
              aria-label="Close role details"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>

          {roleAdditionalFields(expandedRole).length > 0 ? (
            <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3 border-t border-white/10 pt-6">
              {roleAdditionalFields(expandedRole).map((row) => (
                <div key={row.label}>
                  <dt className="font-mono text-[0.52rem] uppercase tracking-[0.22em] text-white/38">
                    {row.label}
                  </dt>
                  <dd className="mt-1 text-sm text-white/78">{row.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          <p className="mt-6 max-w-3xl text-base leading-7 text-white/70">
            {expandedRole.description}
          </p>

          <div className="mt-8 grid gap-8 border-t border-white/10 pt-8 lg:grid-cols-2 lg:gap-12">
            <CmsHtmlSection
              eyebrow="Responsibilities"
              html={expandedRole.responsibilitiesHtml ?? ""}
            />
            <CmsHtmlSection
              eyebrow="Requirements"
              html={expandedRole.requirementsHtml ?? ""}
            />
          </div>
        </section>
      ) : null}
    </div>
  )
}
