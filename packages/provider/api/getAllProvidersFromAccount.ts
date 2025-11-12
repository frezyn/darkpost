import { prisma } from "@workspace/database"
import { authProcedure } from "@workspace/trpc"
import { z } from "zod"


const AccountOnSocialAccointSchema = z.object({
  provider: z.string(),
  providerAccountId: z.string(),
  socialAccountId: z.string(),
  assignedAt: z.date()
})


export const GetAllProvidersFromAccount = authProcedure.output(z.object({
  accounts: z.array(
    z.object({
      name: z.string(),
      id: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      userId: z.string(),
      description: z.string().nullish(),
      accounts: z.array(z.object({
        provider: z.string(),
        providerAccountId: z.string(),
        socialAccountId: z.string().nullable(),
        createdAt: z.date(),
        updatedAt: z.date(),
        userId: z.string(),
        type: z.string(),
        refresh_token: z.string().nullable(),
        access_token: z.string().nullable(),
        expires_at: z.number().nullable(),
        token_type: z.string().nullable(),
        scope: z.string().nullable(),
        id_token: z.string().nullable(),
        session_state: z.string().nullable()
      }))
    })
  )
})).query(async ({ ctx: { session } }) => {
  const providersConnected = await prisma.socialAccount.findMany({
    where: {
      userId: session.user.id!
    },
    select: {
      name: true,
      id: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
      accounts: true
    }
  })

  return {
    accounts: providersConnected
  }
})
