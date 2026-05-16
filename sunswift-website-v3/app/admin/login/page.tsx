import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { signInAsDeveloper, signInWithGoogle } from "@/app/admin/actions"

export const metadata = {
  title: "Admin Login",
}

export default async function AdminLoginPage() {
  const session = await auth()
  const devLoginEnabled =
    process.env.NODE_ENV !== "production" && process.env.ENABLE_DEV_ADMIN_LOGIN !== "false"

  if (session?.user?.email) {
    redirect("/admin")
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4">
      <section className="w-full max-w-sm rounded-lg border border-border bg-card p-6">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Sunswift CMS</p>
        <h1 className="mt-4 text-3xl font-medium">Admin login</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Sign in with the authorized Google account to update team members, headshots,
          recruitment roles, partners and CMS assets.
        </p>
        <form action={signInWithGoogle} className="mt-6">
          <Button className="w-full" type="submit">
            Continue with Google
          </Button>
        </form>
        {devLoginEnabled ? (
          <form action={signInAsDeveloper} className="mt-3">
            <Button
              className="w-full"
              type="submit"
              variant="outline"
              data-dev-admin-login
            >
              Continue as developer
            </Button>
          </form>
        ) : null}
        {devLoginEnabled ? (
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            Local test account: developer@sunswift.unsw.edu.au
          </p>
        ) : null}
      </section>
    </main>
  )
}
