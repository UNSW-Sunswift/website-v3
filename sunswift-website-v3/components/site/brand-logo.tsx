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
      src="/brand/sunswift-racing-wordmark.svg"
      alt="Sunswift Racing"
      width={1200}
      height={310}
      priority={priority}
      className={cn("h-auto w-36 object-contain", className)}
      sizes="10rem"
    />
  )
}
