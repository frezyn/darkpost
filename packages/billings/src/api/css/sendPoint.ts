import { prisma } from "@workspace/database";

export const sendPoints = async (userId: string, valueRecarge: number) => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      points: {
        increment: valueRecarge,
      },
    },
  }).catch(console.error);
};
