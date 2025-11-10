import { prisma } from "@workspace/database";
import { authProcedure } from "@workspace/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { payment } from "../helpers/mp";

/*
entenda que 95% que se importamos, nunca irao acontecer. 
*/

export const generatePayment = authProcedure
  .input(
    z.object({
      value: z.number().min(1).max(10000),
      switchState: z.boolean(),
    }),
  )
  .output(
    z.object({
      sucess: z.boolean(),
      data: z.object({
        qrcode: z.string(),
        key_pix: z.string(),
        paymentId: z.number()
      }),
    }),
  )
  .mutation(async ({ input: { value, switchState = false }, ctx: { session } }) => {
    try {
      if (!session?.user || !session.user.userVerified) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      if (switchState && session.user.points < 2500) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "voce precisa de no minimo 2500 pontos, para conseguir trocar por yuans.",
        })
      }

      const quote = await prisma.quote.findFirst()
      const transaction_amount = generateValueOfRecharge(
        value,
        quote?.value!
      );

      if (!transaction_amount)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });

      const linkCheckout = await payment
        .create({
          body: {
            description: `recarga para: ${session?.user?.cssName}`,
            transaction_amount: transaction_amount,
            payment_method_id: "pix",
            payer: {
              email: session?.user?.email,
            },
          },
        })
        .catch((err) => {
          throw new Error(
            `Error generating payment link in MercadoPago, more info of the error: ${err.message}`,
          );
        });

      if (
        !linkCheckout.id ||
        !linkCheckout.point_of_interaction?.transaction_data?.ticket_url
      ) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: "Error in generate link of pagament, how about trying again?",
        });
      }


      //PLEASE, FIX THIS IN FUTURE, TO LOVE OF GODDDDDDDDDD

      await prisma.billing.create({
        data: {
          status: "pending",
          id: String(linkCheckout.id),
          userId: session?.user?.id,
          quote: quote?.value,
          yuanValue: calculeValueOfYuan(value, switchState, session.user.points), //confere se isso ta certo, pois acho q value vem o valor em real.
          valueReal: transaction_amount,
          date_created: linkCheckout.date_created,
          inviteCode: session.user.inviteCode || "FKYNXTLMPU",
          usePoints: switchState
        },
      });
      return {
        sucess: true,
        data: {
          qrcode:
            linkCheckout.point_of_interaction?.transaction_data?.qr_code_base64!,
          key_pix: linkCheckout.point_of_interaction.transaction_data.qr_code!,
          paymentId: linkCheckout.id!

        },
      };
    } catch (err) {
      console.error(err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  });

function calculeValueOfYuan(valueYuan: number, usePoints: boolean, points: number) {
  switch (usePoints) {
    case true:
      return Math.abs(Number(valueYuan + (points * 0.01).toFixed(2)));
    case false:
      return Math.abs(Number(valueYuan.toFixed(2)));

  }
}

function generateValueOfRecharge(
  value: number,
  quote: number
) {
  return parseFloat((value / quote).toFixed(2))
}

