import { prisma } from "@workspace/database"
import { authProcedure } from "@workspace/trpc"
import { z } from "zod"





export const GetAllProvidersFromAccount = authProcedure.query(async ({ ctx: { session } }) => {
  const providersConnected = await prisma.socialAccount.findMany({
    where: {
      userId: session.user.id
    },
    select: {
      connectedAccounts: true,
      userId: true,
      createdAt: true,
      avatarUrl: true,
      id: true,
      name: true,
    }
  })

  return {
    accounts: providersConnected
  }
})
