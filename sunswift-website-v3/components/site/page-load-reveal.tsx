type PageLoadRevealProps = {
  image: string
  label: string
  variant?: "cinematic" | "subtle"
}

export function PageLoadReveal({ image, label, variant = "subtle" }: PageLoadRevealProps) {
  return (
    <div
      aria-hidden="true"
      data-page-load-reveal
      data-page-load-variant={variant}
      data-page-load-label={label}
      className="page-load-reveal pointer-events-none fixed inset-0 z-[100] overflow-hidden bg-[#050607]"
    >
      <div
        className="page-load-reveal-image absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#050607_0%,rgba(5,6,7,0.76)_34%,rgba(5,6,7,0.24)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[42svh] bg-[linear-gradient(180deg,rgba(5,6,7,0)_0%,#050607_100%)]" />
      <div className="page-load-reveal-mark absolute bottom-8 left-6 font-mono text-[0.62rem] tracking-[0.28em] text-accent-yellow uppercase sm:left-8">
        {label}
      </div>
    </div>
  )
}
