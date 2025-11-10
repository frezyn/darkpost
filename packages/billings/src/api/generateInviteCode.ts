import { auth } from "@workspace/auth";
import { prisma } from "@workspace/database";
import { authProcedure } from "@workspace/trpc";
import { z } from "zod"
import { GenerateInviteCodeHandle } from "../helpers/genInviteCode";
import { TRPCError } from "@trpc/server";

export const GenerateInviteCode = authProcedure.output(
  z.object({
    sucess: z.boolean(),
    data: z.object({
      invite: z.string()
    })
  })
).mutation(async () => {
  try {
    const session = await auth()

    if (!session || !session.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      })
    }


    const inviteCode = GenerateInviteCodeHandle()

    const res = await prisma.invite.create({
      data: {
        id: inviteCode,
        userId: session?.user.id
      }
    }).catch(() => {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",

      })
    })

    if (!res.id) {
      return {
        data: {
          invite: ""
        },
        sucess: false
      }
    }

    return {
      data: {
        invite: res.id
      },
      sucess: true,
    }

  } catch (e) {
    console.error(e)
    return {
      data: {
        invite: ""
      },
      sucess: false
    }
  }

})




export const GetInviteCode = authProcedure.output(
  z.object({
    sucess: z.boolean(),
    data: z.object({
      invite: z.string()
    })
  })
).query(async () => {
  try {
    const session = await auth()

    if (!session || !session.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      })
    }



    const res = await prisma.invite.findFirst({
      where: {
        user: {
          id: session.user.id
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    }).catch(() => {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",

      })
    })

    if (!res || !res.id) {
      return {
        data: {
          invite: ""
        },
        sucess: false
      }
    }

    return {
      data: {
        invite: res.id
      },
      sucess: true,
    }

  } catch (e) {
    console.error(e)
    return {
      data: {
        invite: ""
      },
      sucess: false
    }
  }

})


