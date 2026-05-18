"use client"

import * as React from "react"

type AdminTheme = "light" | "dark"

type AdminThemeContextValue = {
  theme: AdminTheme
  setTheme: (theme: AdminTheme) => void
}

const storageKey = "sunswift-admin-theme"
const AdminThemeContext = React.createContext<AdminThemeContextValue | null>(null)

function applyAdminTheme(theme: AdminTheme) {
  document.documentElement.classList.toggle("dark", theme === "dark")
  document.documentElement.style.colorScheme = theme
}

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<AdminTheme>("light")

  React.useEffect(() => {
    applyAdminTheme(theme)

    return () => {
      document.documentElement.classList.remove("dark")
      document.documentElement.style.colorScheme = "light"
    }
  }, [theme])

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const storedTheme =
        window.localStorage.getItem(storageKey) === "dark" ? "dark" : "light"
      setThemeState(storedTheme)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  const setTheme = React.useCallback((nextTheme: AdminTheme) => {
    window.localStorage.setItem(storageKey, nextTheme)
    setThemeState(nextTheme)
    applyAdminTheme(nextTheme)
  }, [])

  return (
    <AdminThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </AdminThemeContext.Provider>
  )
}

export function useAdminTheme() {
  const context = React.useContext(AdminThemeContext)
  if (!context) {
    throw new Error("useAdminTheme must be used within AdminThemeProvider")
  }

  return context
}
