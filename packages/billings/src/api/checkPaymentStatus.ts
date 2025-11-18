import { TRPCError } from "@trpc/server";
import { authProcedure } from "../../../trpc/server/trpc";
import { payment as Payment } from "../helpers/mp";
import { prisma, } from "@workspace/database";

import z from "zod";

export enum EnumStatus {
  PENDING = "pending", APPROVED = "approved", REJECTED = "rejected", PROCESSED = "processed"
}

export const checkPaymentStatus = authProcedure.input(z.object({
  paymentId: z.number()
})).output(z.object({
  status: z.nativeEnum(EnumStatus)
})).query(async function(opts) {
  const { paymentId } = opts.input


  if (!paymentId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "como pesquisa um codigo de um pedido, sem um codigo? me diz!"
    })
  }

  return {
    status: EnumStatus.PENDING
  }
})
