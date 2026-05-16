import Image from "next/image"

import { cn } from "@/lib/utils"

export function SunswiftBrandLogo({
  className,
  priority = false,
}: {
  className?: string
  priority?: boolean
}) {
  return (
    <Image
      src="/brand/sunswift-logo.svg"
      alt="Sunswift Racing"
      width={960}
      height={250}
      priority={priority}
      className={cn(
        "h-auto w-28 object-contain transition-[filter,opacity] duration-300 group-hover:brightness-[0.55] group-hover:opacity-90",
        className,
      )}
      sizes="7rem"
    />
  )
}
