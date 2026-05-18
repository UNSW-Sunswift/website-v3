"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { AdminThemeProvider } from "@/components/admin/admin-theme-provider"

export function ThemeBoundary({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith("/admin")

  if (isAdminRoute) {
    return <AdminThemeProvider>{children}</AdminThemeProvider>
  }

  return children
}
