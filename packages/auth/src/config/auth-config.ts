import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@workspace/database";
import { NextAuthConfig } from "next-auth"
import { Email } from "../providers/email";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";
import Tiktok from "next-auth/providers/tiktok"
export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [Email, Google, Discord({
    clientId: process.env.DISCORD_CLIENT_ID as string,
    clientSecret: process.env.DISCORD_CLIENT_SECRET as string
  }), Tiktok],
  trustHost: true,
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/login/magiclink",
    newUser: "/newuser",
  },
  callbacks: {
  },
} satisfies NextAuthConfig;

