import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

const developerEmail = "developer@sunswift.unsw.edu.au"

function devAdminLoginEnabled() {
  return process.env.NODE_ENV !== "production" && process.env.ENABLE_DEV_ADMIN_LOGIN !== "false"
}

function getAuthorizedEmails() {
  return new Set(
    (process.env.AUTHORIZED_ADMIN_EMAILS ?? developerEmail)
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
  providers: [
    Google,
    ...(devAdminLoginEnabled()
      ? [
          Credentials({
            id: "developer",
            name: "Developer test account",
            credentials: {},
            async authorize() {
              return {
                id: "local-developer",
                email: developerEmail,
                name: "Sunswift Developer",
              }
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase()
      return Boolean(email && getAuthorizedEmails().has(email))
    },
  },
})
