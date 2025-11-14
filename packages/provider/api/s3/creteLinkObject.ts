import { authProcedure } from "@workspace/trpc"
import { z } from "zod"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: process.env.AWS_REGION! });

export const createObjectLinkS3 = authProcedure.input(z.object({
  fileName: z.string(),
  fileType: z.string(),
})).mutation(async ({ input }) => {
  const key = `videos/${crypto.randomUUID()}-${input.fileName}`;

  console.log(key, input.fileName, input.fileType)

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    ACL: "private"
  });

  const uploadUrl = await getSignedUrl(s3, command, {
    expiresIn: 600
  }); // 10 min
  const publicUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`;

  return { uploadUrl, key, publicUrl, contentType: input.fileType };
})
