"use client"

import { Moon, Sun } from "lucide-react"

import { useAdminTheme } from "@/components/admin/admin-theme-provider"
import { Switch } from "@/components/ui/switch"

export function AdminThemeToggle() {
  const { theme, setTheme } = useAdminTheme()
  const isDark = theme === "dark"
  const label = isDark ? "Switch to light mode" : "Switch to dark mode"

  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/40 px-3 py-2">
      <span className="text-sm text-foreground">Night mode</span>
      <div className="flex items-center gap-2">
        <Sun className="size-4 text-muted-foreground" />
        <Switch
          checked={isDark}
          aria-label={label}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        />
        <Moon className="size-4 text-muted-foreground" />
      </div>
    </div>
  )
}
