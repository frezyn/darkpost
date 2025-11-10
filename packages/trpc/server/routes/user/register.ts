import { TRPCError } from "@trpc/server";
import { prisma } from "@workspace/database";
import { authProcedure } from "../../trpc";
import { date, z } from "zod"


//TODO: criar um validador de telefone melhor.
const phoneRegex = new RegExp(
  /(\d{2})(\d{1})(\d{4})(\d{4})/
);

function isValidCPF(cpf: string | string[]) {
  if (typeof cpf !== 'string') return false
  cpf = cpf.replace(/[^\d]+/g, '')
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false
  cpf = cpf.split('')
  const validator = cpf
    .filter((digit, index, array) => index >= array.length - 2 && digit)
    .map(el => +el)
  const toValidate = (pop: any) => cpf
    .filter((digit, index, array) => index < array.length - pop && digit)
    .map(el => +el)
  const rest = (count: any, pop: any) => (toValidate(pop)
    .reduce((soma, el, i) => soma + el * (count - i), 0) * 10) % 11 % 10
  return !(rest(10, 2) !== validator[0] || rest(11, 1) !== validator[1])
}

const schemaFormRegister = z.object({
  name: z.string(),
  phone: z.string().regex(phoneRegex, "telefone invalido!"),
  cpf: z.string().refine(isValidCPF, "Cpf invalido"),
  cssUser: z.string(),
  invite: z.string().optional(),
})



export const registerUser = authProcedure
  .input(schemaFormRegister)
  .mutation(async ({ ctx: { session }, input }) => {
    if (!session || !session.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }



    if (input.invite && input.invite.length > 1 && !await prisma.invite.findUnique({
      where: {
        id: input.invite
      }
    })) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Codigo de invite nao encontrado"
      })
    }


    const response = await prisma.user.update({
      data: {
        CPF: input.cpf,
        name: input.name,
        phone: input.phone,
        cssName: input.cssUser,
        inviteCode: input.invite,
        userVerified: true
      },
      where: {
        id: session.user.id,
      },
    });

    if (!response || response instanceof Error) {
      console.log(response)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });
    }

    return {
      sucess: true,
    };
  });
