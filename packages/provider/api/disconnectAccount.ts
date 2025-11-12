import { prisma } from "@workspace/database"
import { authProcedure } from "@workspace/trpc"
import { z } from "zod"



export const deleteaccount = authProcedure
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

    console.log(id, provider)
    await prisma.account.delete({
      where: {
        provider_providerAccountId: {
          provider: provider,           // ← obrigatório
          providerAccountId: id // ← obrigatório
        },
      },
    });

    return {
      id: id,
      sucess: true
    };
  });
