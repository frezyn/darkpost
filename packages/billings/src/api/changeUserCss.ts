import { prisma } from "@workspace/database";
import { authProcedure } from "@workspace/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const changeUserCss = authProcedure
  .input(z.object({ newName: z.string() }))
  .output(
    z.object({
      sucess: z.boolean(),
    }),
  )
  .mutation(async ({ input, ctx: { session } }) => {
    try {
      await prisma.user.update({
        where: {
          id: session?.user?.id,
        },
        data: {
          cssName: input.newName,
        },
      });
      return {
        sucess: true,
      };
    } catch (e) {
      console.error(e);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error to change userCss, can try again?",
      });
    }
  });
