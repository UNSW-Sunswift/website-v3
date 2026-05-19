import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SiteFooter } from "@/components/site/site-shell"
import { FooterVisibility } from "@/components/site/footer-visibility"
import { ThemeBoundary } from "@/components/theme-boundary"

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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeBoundary>
          {children}
          <FooterVisibility>
            <SiteFooter />
          </FooterVisibility>
        </ThemeBoundary>
      </body>
    </html>
  )
}
