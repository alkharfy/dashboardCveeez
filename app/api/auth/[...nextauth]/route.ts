import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import { airtable } from "@/lib/airtable"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Check if user exists in Airtable
        const users = await airtable.getUsers()
        const existingUser = users.find((u) => u.fields.Email === user.email)

        if (!existingUser) {
          // Create new user with default role
          await airtable.createUser({
            Name: user.name || "",
            Email: user.email || "",
            Role: "designer", // Default role
            Status: "Available",
            Workplace: "",
          })
        }

        return true
      } catch (error) {
        console.error("Error during sign in:", error)
        return false
      }
    },
    async jwt({ token, user }) {
      if (user) {
        try {
          const users = await airtable.getUsers()
          const userData = users.find((u) => u.fields.Email === user.email)
          if (userData) {
            token.role = userData.fields.Role
            token.userId = userData.id
            token.name = userData.fields.Name
            token.workplace = userData.fields.Workplace
            token.status = userData.fields.Status
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      }
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role as string
      session.user.userId = token.userId as string
      session.user.workplace = token.workplace as string
      session.user.status = token.status as string
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})

export { handler as GET, handler as POST }
