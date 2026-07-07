import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Email from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // @ts-expect-error augmented at runtime, see src/types/next-auth.d.ts
        session.user.role = user.role;
      }
      return session;
    },
  },
  events: {
    // Auto-create a UserProfile + starter username on first sign-in so the
    // community module always has a profile to attach to.
    async createUser({ user }) {
      if (!user.id) return;
      const base = (user.email ?? user.name ?? "user").split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
      const username = `${base}${Math.floor(Math.random() * 1000)}`;
      await prisma.userProfile.create({
        data: { userId: user.id, username, skills: [], interests: [] },
      });
    },
  },
});
