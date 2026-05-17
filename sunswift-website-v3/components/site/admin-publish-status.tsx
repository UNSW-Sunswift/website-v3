import { CheckCircle2, CircleAlert, Info } from "lucide-react"

import { cn } from "@/lib/utils"

type PublishStatus = "success" | "partial" | "error" | "empty"

type AdminPublishStatusProps = {
  status?: string | string[]
  published?: string | string[]
  failed?: string | string[]
  requested?: string | string[]
  singular: string
  plural: string
}

function first(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

function count(value?: string | string[]) {
  const parsed = Number(first(value) ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

function label(amount: number, singular: string, plural: string) {
  return amount === 1 ? singular : plural
}

export function AdminPublishStatus({
  status,
  published,
  failed,
  requested,
  singular,
  plural,
}: AdminPublishStatusProps) {
  const currentStatus = first(status) as PublishStatus | undefined

  if (!currentStatus) {
    return null
  }

  const publishedCount = count(published)
  const failedCount = count(failed)
  const requestedCount = count(requested)
  const isSuccess = currentStatus === "success"
  const isPartial = currentStatus === "partial"
  const Icon = isSuccess ? CheckCircle2 : isPartial ? Info : CircleAlert
  const message =
    currentStatus === "empty"
      ? `No ${plural} were selected to publish.`
      : isSuccess
        ? `Published ${publishedCount} ${label(publishedCount, singular, plural)}. ${publishedCount === 1 ? "Its draft was" : "Their drafts were"} moved off this page.`
        : isPartial
          ? `Published ${publishedCount} of ${requestedCount} ${plural}. ${failedCount} ${label(failedCount, singular, plural)} could not be published.`
          : `Publishing failed for ${failedCount || requestedCount} ${label(failedCount || requestedCount, singular, plural)}. No matching draft was moved.`

  return (
    <div
      data-admin-publish-status
      role={isSuccess ? "status" : "alert"}
      aria-live="polite"
      className={cn(
        "mt-6 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm leading-6",
        isSuccess && "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        isPartial && "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        !isSuccess && !isPartial && "border-destructive/30 bg-destructive/10 text-destructive"
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}
