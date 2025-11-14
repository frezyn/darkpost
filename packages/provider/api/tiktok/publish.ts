import { authProcedure } from "@workspace/trpc"
import { z } from "zod"
import { scheduleVideoPublish } from "./utils/queue";
import { publishVideoNow } from "./utils/publishNow";

export const publishPost = authProcedure.input(z.object({
  videoKey: z.string(),
  caption: z.string().optional(),
  accountId: z.string(),
  scheduledAt: z.date().optional(), // se presente → agendar
})).mutation(async ({ input }) => {
  const { videoKey, caption, accountId, scheduledAt } = input;

  if (scheduledAt) {
    // Agendar
    const job = await scheduleVideoPublish({
      videoKey,
      caption,
      socialAccountId: accountId,
      publishAt: scheduledAt,
    });
    return { scheduled: true, jobId: job.jobId };
  } else {
    // Publicar agora
    const result = await publishVideoNow({
      videoKey,
      caption: caption || "Sem legenda",
      accountId,
    });
    return { published: true, publishId: result.publish_id };
  }
})



