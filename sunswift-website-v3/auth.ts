import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

function getAuthorizedEmails() {
  return new Set(
    (process.env.AUTHORIZED_ADMIN_EMAILS ?? "developer@sunswift.unsw.edu.au")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  )
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret:
    process.env.AUTH_SECRET ??
    (process.env.NODE_ENV === "production" ? undefined : "local-development-only-secret"),
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase()
      return Boolean(email && getAuthorizedEmails().has(email))
    },
  },
})
