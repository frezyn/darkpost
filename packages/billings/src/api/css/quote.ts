import { publicProcedure } from "@workspace/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@workspace/database";

export const quoteToday = publicProcedure
  .output(
    z.object({
      quote: z.number(),
    }),
  )
  .query(async () => {
    try {
      const data = await getQuoteYuan();

      return {
        ...data,
      };
    } catch (err) {
      console.log(err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "we had an error returning the current quote",
      });
    }
  });


async function getQuoteYuan() {

  const quote = await prisma.quote.findFirst()


  return {
    quote: Math.abs(quote?.value!),
  };
}
