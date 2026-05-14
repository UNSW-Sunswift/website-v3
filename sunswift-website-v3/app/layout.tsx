import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata = {
  title: "Sunswift Racing",
  description:
    "Student-led solar racing at UNSW, building prototype electric vehicles for the future of sustainable transport.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
