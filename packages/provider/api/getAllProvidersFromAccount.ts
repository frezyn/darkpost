import { prisma, AccountsOnSocialAccounts } from "@workspace/database"
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
      linkedAccounts: z.array(AccountOnSocialAccointSchema)

    })
  )
})).query(async ({ ctx: { session } }) => {
  const providersConnected = await prisma.socialAccount.findMany({
    where: {
      userId: session.user.id!
    },
    select: {
      linkedAccounts: true,
      name: true,
      id: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      userId: true
    }
  })

  return {
    accounts: providersConnected
  }
})
