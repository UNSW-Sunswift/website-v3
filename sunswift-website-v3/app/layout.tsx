import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SiteFooter } from "@/components/site/site-shell"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Sunswift Racing",
    template: "%s | Sunswift Racing",
  },
  description:
    "Student-led solar racing at UNSW, building prototype electric vehicles for the future of sustainable transport.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          {children}
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}
