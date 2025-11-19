import { prisma } from "@workspace/database"
import { authProcedure } from "@workspace/trpc"
import { z } from "zod"


// Rota para criar uma nova SocialAccount para o usuário logado
export const createSocialAccount = authProcedure
  .input(
    z.object({
      name: z.string().min(1, { message: "O nome não pode estar em branco." }),
      description: z.string().min(1),
    })
  )
  .output(
    z.object({
      id: z.string(),
      name: z.string(),
      userId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  )
  .mutation(async ({ ctx: { session }, input }) => {
    const userId = session.user.id;
    const { name, description } = input;

    const newSocialAccount = await prisma.socialAccount.create({
      data: {
        name: name,
        userId: userId,
        description: description,
      },
    });

    return newSocialAccount;
  });
