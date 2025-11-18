
import crypto from "node:crypto";
import { NextResponse } from "next/server";


/*
 Eu queria muito ela, sera que um dia irei ficar com a bianca? 
 Idk, qual o sentido de basear tualmente minha felicidade na decisao de outra pessoa?
 Mas retorno a pergunta, qual o sentido de basear totalmente a vida em uma vida solitaria?
 Eu apenas queria ter a sensacao novamente de como seria, sair, rir, chorar. Sera isso o sentido da vida? 
 Pessoas sao dificies, por que se preucupar com algo que nao esta sobre seu controle? 
 Nao sei... Apenas queria tentar! mas parece que quanto mais tento, mais errado aparenta dar.
 Nao sou a melhor pessoa quando se trata com pessoas, nao consigo entender por que ela ficou chata comigo do nada chorar
 Sera que nao gostou de mim? Ou algo do tipo? Eu queria respostas, por que pessoas sao tao dificies????

 Pessoas sao tao estranhas, confusas, hormonios, e varias coisas estranhas. impossivel de entender, e mais dificil ainda de prever.
 O que sera o que o joao do futuro vai pensar lendo isso?
*/


export const webhookHandle = async (req: Request) => {
  if (req.method === "POST") {
    const data = await req.json().catch((err) => {
      return NextResponse.json("body invalid", {
        status: 400
      })
    })
    const signature = req.headers.get("x-signature");
    const XrequestId = req.headers.get("x-request-id");

    if (!signature || !XrequestId) {
      return NextResponse.json("signature was not provided", {
        status: 422,
      });
    }


    if (!validateXSignature(signature, XrequestId, data.data.id)) {
      return NextResponse.json(
        "it was not possible to verify the authenticitt of the signature",
        {
          status: 403,
        },
      );
    }

    try {
      switch (data.action) {
        case "payment.updated":

          break;
      }
    } catch (err: any) {
      new Error(
        `Error processing webhook, more info of the error: ${err.message}`,
      );
      return NextResponse.json({
        //TODO: Implementar retorno de nao autorizado.
      });
    }

    return NextResponse.json({ status: "ok" });
  }
};

function validateXSignature(
  xSignature: string,
  xRequestId: string,
  dataID: string,
) {
  const split = xSignature.split(",");
  // biome-ignore lint: reason
  let ts;
  // biome-ignore lint: reason
  let hash;
  // biome-ignore lint: reason
  split.forEach((part) => {
    const [key, value] = part.split("=");
    if (key && value) {
      const trimmedKey = key.trim();
      const trimmedValue = value.trim();
      if (trimmedKey === "ts") {
        ts = trimmedValue;
      } else if (trimmedKey === "v1") {
        hash = trimmedValue;
      }
    }
  });

  const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;
  const sha = crypto
    .createHmac("sha256", process.env.SGNATURE_PRIVATE as string)
    .update(manifest)
    .digest("hex");

  if (sha === hash) {
    return true;
  }
  return false;
}
