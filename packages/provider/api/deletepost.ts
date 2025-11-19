import { prisma } from "@workspace/database"
import { authProcedure } from "@workspace/trpc"
import { z } from "zod"



export const deletePost = authProcedure
  .input(
    z.object({
      idPost: z.string(),

    })
  )
  .output(
    z.object({
      id: z.string(),
      sucess: z.boolean()
    })
  )
  .mutation(async ({ ctx: { session }, input }) => {
    const { idPost } = input;


    await prisma.post.delete({
      where: {
        id: idPost
      }
    });

    return {
      id: idPost,
      sucess: true
    };
  });
