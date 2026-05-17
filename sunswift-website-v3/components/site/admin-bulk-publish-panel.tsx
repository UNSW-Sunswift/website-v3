"use client"

import { useMemo, useState, type ComponentProps } from "react"
import { Check, Minus, Plus } from "lucide-react"
import { useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type BulkPublishItem = {
  slug: string
  title: string
  eyebrow?: string
  description?: string
}

type AdminBulkPublishPanelProps = {
  title: string
  description: string
  items: BulkPublishItem[]
  action: ComponentProps<"form">["action"]
  submitLabel: string
  emptyLabel: string
}

function PublishSubmitButton({
  disabled,
  label,
  selectedCount,
}: {
  disabled: boolean
  label: string
  selectedCount: number
}) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={disabled || pending}
      aria-disabled={disabled || pending}
      data-admin-publish-selected
    >
      {pending ? "Publishing…" : `${label} (${selectedCount})`}
    </Button>
  )
}

export function AdminBulkPublishPanel({
  title,
  description,
  items,
  action,
  submitLabel,
  emptyLabel,
}: AdminBulkPublishPanelProps) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const [compact, setCompact] = useState(false)
  const allSelected = items.length > 0 && selected.size === items.length
  const selectedSlugs = useMemo(() => Array.from(selected), [selected])

  const toggleSlug = (slug: string) => {
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(slug)) {
        next.delete(slug)
      } else {
        next.add(slug)
      }
      return next
    })
  }

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(items.map((item) => item.slug)))
  }

  return (
    <section
      data-admin-bulk-publish
      data-admin-bulk-view="grid"
      data-admin-bulk-density={compact ? "compact" : "comfortable"}
      className="mt-8 rounded-lg border border-border bg-card p-5"
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            Batch publishing
          </p>
          <h2 className="mt-2 text-2xl font-medium">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={toggleAll}
            disabled={items.length === 0}
            data-admin-select-all
            aria-pressed={allSelected}
          >
            <Check className="size-4" />
            {allSelected ? "Clear all" : "Select all"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setCompact((value) => !value)}
            aria-pressed={compact}
          >
            {compact ? <Plus className="size-4" /> : <Minus className="size-4" />}
            {compact ? "Comfortable" : "Zoom out"}
          </Button>
        </div>
      </div>

      <form action={action} className="mt-5">
        {selectedSlugs.map((slug) => (
          <input key={slug} type="hidden" name="slugs" value={slug} />
        ))}

        {items.length > 0 ? (
          <div
            data-admin-bulk-grid
            className={cn(
              "grid gap-2",
              compact ? "sm:grid-cols-3 lg:grid-cols-5" : "sm:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {items.map((item) => {
              const isSelected = selected.has(item.slug)

              return (
                <button
                  key={item.slug}
                  type="button"
                  data-admin-bulk-record={item.slug}
                  aria-pressed={isSelected}
                  onClick={() => toggleSlug(item.slug)}
                  className={cn(
                    "group min-h-24 rounded-md border bg-background p-4 text-left transition-[background-color,border-color,box-shadow,color] duration-200 focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
                    isSelected
                      ? "border-primary bg-primary/10 shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
                      : "border-border hover:border-primary/50",
                    compact && "min-h-20 p-3"
                  )}
                >
                  <span className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-0.5 grid size-5 shrink-0 place-items-center rounded-sm border transition-[background-color,border-color,color] duration-200",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-transparent group-hover:border-primary/60"
                      )}
                    >
                      <Check className="size-3.5" />
                    </span>
                    <span className="min-w-0">
                      {item.eyebrow ? (
                        <span className="block truncate font-mono text-[0.62rem] tracking-[0.18em] text-primary uppercase">
                          {item.eyebrow}
                        </span>
                      ) : null}
                      <span className="mt-1 block break-words text-sm font-medium text-foreground">
                        {item.title}
                      </span>
                      {item.description && !compact ? (
                        <span className="mt-1 line-clamp-2 block text-xs leading-5 text-muted-foreground">
                          {item.description}
                        </span>
                      ) : null}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        ) : (
          <p className="rounded-md border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
            {emptyLabel}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {selected.size} of {items.length} selected
          </p>
          <PublishSubmitButton
            disabled={selected.size === 0}
            label={submitLabel}
            selectedCount={selected.size}
          />
        </div>
      </form>
    </section>
  )
}
