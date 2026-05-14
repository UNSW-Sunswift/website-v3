import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { signInWithGoogle } from "@/app/admin/actions"

export default async function AdminLoginPage() {
  const session = await auth()

  if (session?.user?.email) {
    redirect("/admin")
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4">
      <section className="w-full max-w-sm rounded-lg border border-border bg-card p-6">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Sunswift CMS</p>
        <h1 className="mt-4 text-3xl font-medium">Admin login</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Sign in with the authorized Google account to update team members, headshots and
          recruitment roles.
        </p>
        <form action={signInWithGoogle} className="mt-6">
          <Button className="w-full" type="submit">
            Continue with Google
          </Button>
        </form>
      </section>
    </main>
  )
}
