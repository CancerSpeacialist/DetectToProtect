import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

export const config = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      if (!account || !profile) {
        return false
      }

      if (account.provider === "google") {
        return !!(profile.email_verified && profile.email?.endsWith("@gmail.com"))
      }
      return true
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        // You can set role here based on your logic
        // For now, we'll handle it in the redirect callback
      }
      return token
    },

    async redirect({ url, baseUrl }) {
      // Handle role-based redirects
      if (url.includes('/doctor')) {
        return `${baseUrl}/doctor`
      }
      if (url.includes('/patient')) {
        return `${baseUrl}/patient`
      }
      
      // Default redirect
      return baseUrl
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)