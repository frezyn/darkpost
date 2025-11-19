import { prisma } from "@workspace/database"
import { authProcedure } from "@workspace/trpc"
import { z } from "zod"



export const disconnectAccount = authProcedure
  .input(
    z.object({
      id: z.string(),
      provider: z.string()
    })
  )
  .output(
    z.object({
      id: z.string(),
      sucess: z.boolean()
    })
  )
  .mutation(async ({ ctx: { session }, input }) => {
    const { id, provider } = input;


    await prisma.connectedAccount.delete({
      where: {
        id: id
      }
    });

    return {
      id: id,
      sucess: true
    };
  });
