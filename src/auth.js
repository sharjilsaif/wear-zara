import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import { isAdminEmail } from "@/lib/admin";
import { avatarUrl } from "@/lib/avatar";
import { prisma } from "@/lib/prisma";
import { hitCount, recordHit } from "@/lib/rateLimit";

const LOGIN_WINDOW = 15 * 60_000;

/** Fresh name + picture for the session token. Returns null if the account no longer exists. */
async function loadProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, avatar: { select: { updatedAt: true } } },
  });
  if (!user) return null;
  return { name: user.name, email: user.email, picture: avatarUrl(userId, user.avatar) };
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  trustHost: true,

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;
        // Slow down password guessing: after 8 failed attempts an email is locked for 15 minutes.
        const key = `login:${email}`;
        if (hitCount(key, LOGIN_WINDOW) >= 8) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          select: { id: true, name: true, email: true, password: true },
        });

        // Same response for unknown email and wrong password, so accounts can't be enumerated.
        if (!user || !(await bcrypt.compare(password, user.password))) {
          recordHit(key, LOGIN_WINDOW);
          return null;
        }

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger }) {
      // Refresh profile details on sign-in and whenever the client calls `update()`
      // (after editing the name or profile picture).
      if (user || trigger === "update") {
        const profile = await loadProfile(token.sub);
        if (!profile) return null;
        Object.assign(token, profile);
      }
      return token;
    },

    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.image = token.picture ?? null;
        session.user.isAdmin = isAdminEmail(session.user.email);
      }
      return session;
    },
  },

  pages: { signIn: "/login" },
});
