import { prisma, SocialAccount } from "@workspace/database"
import { authProcedure } from "@workspace/trpc"
import { z } from "zod"


export const GetAllProvidersFromAccount = authProcedure.output(z.object({
  accounts: z.array(
    z.object({
      name: z.string(),
      id: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      userId: z.string()
    })
  )
})).query(async ({ ctx: { session } }) => {
  const providersConnected = await prisma.socialAccount.findMany({
    where: {
      userId: session.user.id!
    }
  })

  return {
    accounts: providersConnected
  }
})
