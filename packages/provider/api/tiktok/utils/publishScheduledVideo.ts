// src/server/jobs/publishScheduledVideo.ts
import { Worker } from "bullmq";
import IORedis from "ioredis";
import { prisma as db } from "@workspace/database";
import { PostStatus } from "@prisma/client";
import { publishVideoNow } from "./publishNow";

const connection = new IORedis(process.env.REDIS_URL!);

new Worker(
  "video-publish",
  async (job) => {
    const { postId } = job.data;

    const post = await db.post.findUnique({
      where: { id: postId },
      include: { socialAccount: true },
    });

    if (!post) throw new Error("Post não encontrado");

    // Atualizar para PROCESSING
    await db.post.update({
      where: { id: post.id },
      data: { status: PostStatus.PROCESSING },
    });

    try {
      const result = await publishVideoNow({
        videoKey: post.videoUrl.split("/").pop()!, // extrai key do S3
        caption: post.caption || "",
        accountId: post.socialAccounId
      });

      console.log(`[Worker] Publicado com sucesso: ${result.publish_id}`);
    } catch (error: any) {
      await db.post.update({
        where: { id: post.id },
        data: { status: PostStatus.FAILED },
      });
      throw error;
    }
  },
  { connection }
);
