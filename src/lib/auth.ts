import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Email from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const providers = [];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  );
}

if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    })
  );
}

if (process.env.EMAIL_SERVER && process.env.EMAIL_FROM) {
  providers.push(
    Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers,
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        const userWithRole = user as typeof user & { role?: "USER" | "ADMIN" };
        session.user.id = user.id;
        session.user.role = userWithRole.role ?? "USER";
      }
      return session;
    },
  },
  events: {
    // Auto-create a UserProfile + starter username on first sign-in so the
    // community module always has a profile to attach to.
    async createUser({ user }) {
      if (!user.id) return;
      const identity = user.email ?? user.name ?? "user";
      const base = (identity.split("@")[0] ?? "user").toLowerCase().replace(/[^a-z0-9]/g, "");
      const username = `${base}${Math.floor(Math.random() * 1000)}`;
      await prisma.userProfile.create({
        data: { userId: user.id, username, skills: [], interests: [] },
      });
    },
  },
});
