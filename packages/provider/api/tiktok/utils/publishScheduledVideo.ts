// src/workers/videoPublishWorker.ts  (ou .worker.ts)
import { Worker } from "bullmq";
import IORedis from "ioredis";
import { prisma as db } from "@workspace/database";
import { PostStatus } from "@prisma/client";
import { publishVideoNow } from "./publishNow"; // ajuste o caminho

const connection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null, // importante pro BullMQ
});

const worker = new Worker(
  "video-publish",
  async (job) => {
    console.log(`[Worker] Processando job ${job.id} - postId: ${job.data.postId}`);

    const { postId } = job.data;

    const post = await db.post.findUnique({
      where: { id: postId },
      include: { socialAccount: true },
    });

    if (!post) {
      console.error("Post não encontrado:", postId);
      throw new Error("Post não encontrado");
    }

    // Atualiza status
    await db.post.update({
      where: { id: post.id },
      data: { status: PostStatus.PROCESSING, scheduledAt: new Date() },
    });

    const videoKeu = post.videoUrl.split("/").pop()!

    try {
      const result = await publishVideoNow({
        videoKey: post.videoUrl.split("/").slice(-2).join("/"),
        caption: post.caption || "",
        accountId: post.socialAccountId,
      });

      await db.post.update({
        where: { id: post.id },
        data: {
          status: PostStatus.PROCESSING,
          scheduledAt: new Date(),
          postId: result.publish_id || result.postId,
        },
      });

      console.log(`Publicado com sucesso! Post ${post.id} → ${result.publish_id}`);
    } catch (error: any) {
      console.error(`Falha ao publicar post ${post.id}:`, error);

      await db.post.update({
        where: { id: post.id },
        data: {
          status: PostStatus.FAILED,
        },
      });

      throw error; // BullMQ vai marcar como failed e permitir retry
    }
  },
  {
    connection,
    concurrency: 3, // quantos vídeos publicar ao mesmo tempo
    limiter: { max: 10, duration: 60000 }, // máximo 10 jobs por minuto (opcional)
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} concluído com sucesso`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} falhou: ${err.message}`);
});

process.on("SIGTERM", async () => {
  console.log("Encerrando worker graciosamente...");
  await worker.close();
  process.exit(0);
});

console.log("Worker de publicação de vídeos rodando... (fila: video-publish)");
