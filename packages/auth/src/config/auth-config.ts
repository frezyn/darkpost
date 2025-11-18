import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@workspace/database";
import { NextAuthConfig } from "next-auth"
import { Email } from "../providers/email";
import Google from "next-auth/providers/google";




export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  trustHost: true,
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/login/magiclink",
  },

  callbacks: {
  }
} satisfies NextAuthConfig;

