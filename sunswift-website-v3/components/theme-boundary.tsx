"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { AdminThemeProvider } from "@/components/admin/admin-theme-provider"
import { ThemeProvider } from "@/components/theme-provider"

export function ThemeBoundary({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith("/admin")
  const Provider = isAdminRoute ? AdminThemeProvider : ThemeProvider

  return <Provider>{children}</Provider>
}
