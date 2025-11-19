import { authProcedure } from "@workspace/trpc"
import { z } from "zod"
import { scheduleVideoPublish } from "./utils/queue";
import { publishVideoNow } from "./utils/publishNow";

const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?((Z)|([+-]\d{2}:\d{2}))$/;

export const publishPost = authProcedure
  .input(
    z.object({
      videoKey: z.string(),
      caption: z.string().optional(),
      accountId: z.string(),
      scheduledAt: z
        .string()
        .regex(isoDateRegex, "Formato de data inválido. Use ISO 8601 (ex: 2025-11-18T14:30:00.000Z)")
        .transform((str) => new Date(str))
        .refine((date) => !isNaN(date.getTime()), {
          message: "Data inválida (fora do intervalo suportado)",
        })
        .optional(),
    })
  )
  .mutation(async ({ input }) => {
    const { videoKey, caption, accountId, scheduledAt } = input;

    if (scheduledAt) {
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
        caption: caption!,
        accountId,
      });
      return { published: true, publishId: result.postId, linkVideo: result.linkVideo };
    }
  });
