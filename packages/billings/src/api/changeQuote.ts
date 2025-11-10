import { adminProcedure } from "@workspace/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@workspace/database";


export const changeQuote = adminProcedure
  .input(z.object(({
    quote: z.number()
  })))
  .output(
    z.object({
      ok: z.boolean()
    }),
  )
  .mutation(async ({ input: { quote } }) => {
    try {
      await prisma.quote.update({
        where: {
          id: 1 as any
        },
        data: {
          value: quote
        }
      })
      return {
        ok: true
      }
    } catch (err) {
      console.log(err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "we had an error returning the current quote",
      });
    }
  })
