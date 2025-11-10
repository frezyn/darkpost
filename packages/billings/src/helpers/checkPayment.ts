import { prisma } from "@workspace/database";
import { NextResponse } from "next/server";
import { payment as Payment } from "./mp";
import { sendYuan } from "../api/css/sendYuan";
import { sendPoints } from "../api/css/sendPoint";

export const checkPayment = async (idPursche: string) => {
  try {
    const { status } = await Payment.get({ id: idPursche });
    if (status === "approved") {
      const payment = await prisma.billing.findUnique({
        where: {
          id: String(idPursche),
        },
        select: {
          userId: true,
          yuanValue: true,
          valueReal: true,
          status: true,
          inviteCode: true,
          usePoints: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      });


      //if payment be aprovved or recused, this was process, when is been fraulde
      //em resumo, se o pagamento for aprovado ou recusado no DB, ele ja foi processado, então nao tem o pq mandar novamente a recarga para o user.
      if (!payment || payment.status !== "pending") {
        console.error("nao achei o pagamento pelo ID")
        return
      }


      if (payment.usePoints) {
        //FIX: Mesmo se o usuario nn tiver pontos, os pontos vao ser debitados.
        //Mas esse nao e o ponto, o ponto e que ele poderia gerar 10 pagamentos usando 
        await prisma.user.update({
          where: {
            id: payment.userId
          },
          data: {
            points: 0
          }
        })
      }

      await prisma.billing
        .update({
          where: {
            id:
              typeof idPursche === "string"
                ? idPursche
                : String(idPursche),
          },
          data: {
            status: "approved",
          },
        })
        .catch((err) => {
          console.error(err);
          throw new Error("Erro internal");
        });

      const user = await prisma.user.findUnique({
        where: {
          id: payment.userId,
        },
      });


      if (!user) {
        console.log("user doesnt found")
        return NextResponse.json({
          message: "Internal server error",
          code: 500,
        });
      }

      if (payment.inviteCode) {
        const invite = await prisma.invite.findUnique({
          where: {
            id: payment.inviteCode
          },
          select: {
            user: {
              select: {
                id: true
              }
            }
          }
        })

        if (!invite?.user.id) {
          //se nao tiver o ID, envie apenas os yuans.
          console.log("nn achei o id")
          return
        }

        return Promise.all([
          sendYuan(user?.cssName, payment.yuanValue, idPursche),
          sendPoints(invite?.user.id, payment.yuanValue)// A opcão de pontos vai ser alterada pelo link de indicacao
        ]);
      } else {
        return Promise.all([
          sendYuan(user?.cssName, payment.yuanValue, idPursche),
        ]);
      }
    }
    //crate payment -> create payment in db -> receive payment update in webhook -> update payment in db -> send event to stackEvent -> function send yuans to user. // I think this is a better exemple to send yuans to the user.
    //create payument -> receive webHook event to payment creat6e -> send valor to recarge in MetaData in payment -> red metadata, and send yuans to user.
  } catch (err) {
    console.error(err);
  }
}
