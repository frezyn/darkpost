
import { Queue } from "bullmq";
import IORedis from "ioredis";
import { prisma as db } from "@workspace/database";
import { PostStatus } from "@prisma/client";

const connection = new IORedis(process.env.REDIS_URL!);
const videoQueue = new Queue("video-publish", { connection });

export async function scheduleVideoPublish({
  videoKey,
  caption,
  socialAccountId,
  publishAt,
}: {
  videoKey: string;
  caption?: string;
  socialAccountId: string;
  publishAt: Date;
}) {
  const post = await db.post.create({
    data: {
      userId: (await db.socialAccount.findUnique({ where: { id: socialAccountId } }))!.userId,
      videoUrl: `s3://${process.env.S3_BUCKET}/${videoKey}`,
      caption: caption || null,
      socialAccountId: socialAccountId,
      scheduledAt: publishAt,
      status: PostStatus.PENDING,
    },
  });

  const job = await videoQueue.add(
    "publish-video",
    { postId: post.id },
    {
      delay: publishAt.getTime() - Date.now(),
      removeOnComplete: true,
      removeOnFail: false,
    }
  );

  return { jobId: job.id, postId: post.id };
}
