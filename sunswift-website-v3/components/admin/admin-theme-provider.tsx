"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function AdminThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="sunswift-admin-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
