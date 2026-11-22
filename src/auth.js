import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

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

        const user = await prisma.user.findUnique({ where: { email } });

        // Same response for unknown email and wrong password, so accounts can't be enumerated.
        if (!user || !(await bcrypt.compare(password, user.password))) return null;

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],

  callbacks: {
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.isAdmin = isAdminEmail(session.user.email);
      }
      return session;
    },
  },

  pages: { signIn: "/login" },
});
