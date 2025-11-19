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
    async session({ session, user }) {
      if (!session.user) return session;


      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!dbUser) {
        console.error("Usuário não encontrado no banco:", user.id);
        return session;
      }

      return session;
    },


  }
} satisfies NextAuthConfig;

