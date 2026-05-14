import Link from "next/link"
import { redirect } from "next/navigation"
import { LayoutDashboard, LogOut, UserRound, UsersRound } from "lucide-react"

import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { signOutAdmin } from "@/app/admin/actions"

const adminNav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/team", label: "Team", icon: UsersRound },
  { href: "/admin/recruitment", label: "Roles", icon: UserRound },
]

export async function AdminShell({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-background p-4 lg:block">
        <div className="px-2">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Sunswift CMS</p>
          <p className="mt-2 truncate text-sm text-muted-foreground">{session.user.email}</p>
        </div>
        <nav className="mt-8 grid gap-1">
          {adminNav.map((item) => (
            <Button key={item.href} asChild variant="ghost" className="justify-start">
              <Link href={item.href}>
                <item.icon className="size-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
        <form action={signOutAdmin} className="absolute inset-x-4 bottom-4">
          <Button variant="outline" className="w-full justify-start" type="submit">
            <LogOut className="size-4" />
            Sign out
          </Button>
        </form>
      </aside>
      <main className="lg:pl-64">{children}</main>
    </div>
  )
}
