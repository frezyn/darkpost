import { prisma } from "@workspace/database"
import { authProcedure } from "@workspace/trpc"
import { z } from "zod"
import { TRPCError } from "@trpc/server"




export const GetAllPostsFromAccount = authProcedure.query(async ({ ctx: { session }, input }) => {
  const providersConnected = await prisma.post.findMany({
    where: {
      userId: session.user.id,

    },
    orderBy: {
      updatedAt: "desc"
    },
    select: {
      userId: true,
      createdAt: true,
      id: true,
      postId: true,
      scheduledAt: true,
      socialAccount: {
        select: {
          user: true,
          description: true,
          name: true,
          connectedAccounts: {
            select: {
              avatarUrl: true,
              followers: true,
              displayName: true,
              platform: true
            }
          }
        }
      },
      caption: true,
      linkVideo: true,
      status: true,
    }
  })

  return {
    accounts: providersConnected
  }
})
