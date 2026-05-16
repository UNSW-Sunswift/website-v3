import mediaHighlights from "@/content/media-highlights.json"

export function JuicerSidebar() {
  const iframeSrc =
    (mediaHighlights as { juicerFeedIframeSrc?: string }).juicerFeedIframeSrc ??
    "https://www.juicer.io/api/feeds/unsw-sunswift/iframe"

  return (
    <aside
      data-juicer-sidebar
      className="relative w-full border-t border-white/10 bg-[#08090b]/90 backdrop-blur-xl lg:sticky lg:top-16 lg:z-10 lg:h-[calc(100dvh-4rem)] lg:w-[min(100%,380px)] lg:shrink-0 lg:border-r lg:border-t-0 lg:border-b-0"
    >
      <div className="flex h-full flex-col gap-4 px-4 pt-24 pb-8 sm:px-6 lg:overflow-hidden lg:px-5 lg:pt-28 lg:pb-10">
        <div>
          <p className="font-mono text-[0.62rem] tracking-[0.3em] text-accent-yellow uppercase">
            Social feed
          </p>
        </div>
        <div className="relative flex-1 overflow-hidden rounded-sm border border-white/12 bg-black/30">
          <iframe
            title="Sunswift Racing — Juicer.io feed"
            src={iframeSrc}
            width="100%"
            height="100%"
            className="absolute inset-0 h-full min-h-[520px] w-full lg:min-h-0"
            style={{ border: "none" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allow="encrypted-media"
          />
        </div>
      </div>
    </aside>
  )
}
