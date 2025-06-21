import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ account, profile }) {
      if (!account || !profile) {
        return false;
      }

      if (account.provider === "google") {
        // If you want to restrict to specific domains:
        // return profile.email_verified && (
        //   profile.email?.endsWith("@gmail.com") ||
        //   profile.email?.endsWith("@example.com")
        // );
        return profile.email_verified && profile.email.endsWith("@gmail.com");
      }
      return true;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;
        // You can add custom fields to your session here
        // session.user.role = token.role;

        session.user.username = session.user.name
          .split(" ")
          .join("")
          .toLocaleLowerCase();
        session.user.uid = token.sub;
      }
      return session;
    },
    // async jwt({ token, user, account }) {
    //   if (user) {
    //     token.id = user.id;
    //     // You can add custom fields to your token here
    //     // token.role = user.role;
    //   }
    //   return token;
    // },
  },
  pages: {
    signIn: "/api/auth/signin",
    // signOut: "/auth/signout",
    error: "/api/auth/error",
  },
  // session: {
  //   strategy: "jwt",
  //   maxAge: 30 * 24 * 60 * 60, // 30 days
  // },
});