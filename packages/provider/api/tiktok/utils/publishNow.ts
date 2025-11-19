//publiNow.ts
import { S3Client } from "@aws-sdk/client-s3";
import { PostStatus, prisma } from "@workspace/database";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { fetchTikTokPostStatus } from "./fetchVideoinfoTiktok";


const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function publishVideoNow({
  videoKey,
  caption,
  accountId,
}: {
  videoKey: string;
  caption: string;
  accountId: string;
}) {

  const socialAccount = await prisma.socialAccount.findUnique({
    where: { id: accountId },
    include: {
      connectedAccounts: {
        where: {
          platform: "tiktok"
        }
      }
    }
  });

  if (!socialAccount || !socialAccount.connectedAccounts[0]?.accessToken) {
    throw new Error("Conta TikTok não conectada ou sem token");
  }

  const accessToken = socialAccount.connectedAccounts[0].accessToken;

  console.log(`s3://${process.env.S3_BUCKET}/${videoKey}`)
  // 2. Criar registro do Post
  const post = await prisma.post.create({
    data: {
      userId: socialAccount.userId,
      videoUrl: `s3://${process.env.S3_BUCKET}/${videoKey}`,
      caption,
      socialAccountId: socialAccount.id,
      status: PostStatus.PROCESSING,
    },
  });

  try {
    const { Body, ContentLength } = await s3.send(
      new GetObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: videoKey,
      })
    );

    if (!Body || !ContentLength) throw new Error("Vídeo não encontrado no S3");

    const videoBuffer = await getVideoBufferFromS3(s3, process.env.S3_BUCKET!, videoKey);
    const videoSize = videoBuffer.length;

    console.log(`Vídeo lido do S3: ${videoSize} bytes`);


    const PREFERRED_CHUNK = 5 * 1024 * 1024;
    let chunkSize = PREFERRED_CHUNK;

    if (videoSize <= chunkSize) {
      chunkSize = videoSize;
    } else {
      while (chunkSize > 1024 * 1024 && (videoSize % chunkSize !== 0)) {
        chunkSize -= 1024;
      }
      if (chunkSize < 1024 * 1024) {
        chunkSize = 1024 * 1024;
      }
    }

    const totalChunks = Math.ceil(videoSize / chunkSize);


    // === CÁLCULO DE CHUNKS (EXATAMENTE COMO NO SEU SCRIPT QUE FUNCIONA) ===
    console.log(`Chunk size: ${chunkSize} bytes`);
    console.log(`Total chunks: ${totalChunks}`);


    const initBody = {
      post_info: {
        title: caption,
        privacy_level: "SELF_ONLY",
        disable_duet: false,
        disable_comment: false,
        disable_stitch: false,
        post_mode: { mode: "DIRECT_POST" },
        video_cover_timestamp_ms: 1000,
      },
      source_info: {
        source: "FILE_UPLOAD",
        video_size: videoSize,
        chunk_size: chunkSize,
        total_chunk_count: totalChunks,
      },
    };

    const initRes = await fetch("https://open.tiktokapis.com/v2/post/publish/video/init/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(initBody),
    });

    const initData: any = await initRes.json();
    console.log(initData)
    if (initData.error?.code !== "ok") throw new Error(initData.error.message);

    const { upload_url, publish_id } = initData.data;

    // 6. Upload em chunks
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, videoSize);
      const chunk = videoBuffer.slice(start, end);
      const actualSize = chunk.length;

      if (i < totalChunks - 1 && actualSize !== chunkSize) {
        throw new Error(`Chunk ${i + 1} tem ${actualSize} bytes, esperado ${chunkSize}`);
      }

      const range = `bytes ${start}-${end - 1}/${videoSize}`;
      console.log(`Enviando chunk ${i + 1}/${totalChunks}: ${actualSize} bytes → ${range}`);

      const putRes = await fetch(upload_url, {
        method: "PUT",
        headers: {
          "Content-Type": "video/mp4",
          "Content-Length": actualSize.toString(),
          "Content-Range": range,
        },
        body: chunk,
      });

      if (!putRes.ok) {
        const err = await putRes.text();
        throw new Error(`Chunk ${i + 1} falhou: ${putRes.status} - ${err}`);
      }
    }

    await prisma.post.update({
      where: { id: post.id },
      data: {
        status: PostStatus.SUCCESS,
        postId: publish_id
      },
    });

    const { linkVideo } = await fetchTikTokPostStatus({
      postId: post.id,
      publishId: publish_id,
      accessToken: accessToken
    })

    return { publish_id, postId: post.id, linkVideo };

  } catch (error: any) {
    // 8. Marcar como falha
    await prisma.post.update({
      where: { id: post.id },
      data: {
        status: PostStatus.FAILED,
      },
    });

    throw error;
  }
}

export function calculateChunkSize(videoSize: number) {
  const MIN_CHUNK = 1 * 1024 * 1024; // 1 MiB
  const PREFERRED_CHUNK = 5 * 1024 * 1024; // 5 MiB

  if (videoSize <= PREFERRED_CHUNK) {
    return videoSize; // único chunk
  }

  // Quantos chunks de 5 MiB cabem?
  const chunks5MiB = Math.floor(videoSize / PREFERRED_CHUNK);
  const remainder = videoSize % PREFERRED_CHUNK;

  // Se o resto for < 1 MiB → usa 1 MiB como base
  if (remainder > 0 && remainder < MIN_CHUNK) {
    // Recalcula com 1 MiB
    const totalChunks = Math.ceil(videoSize / MIN_CHUNK);
    const chunkSize = Math.floor(videoSize / totalChunks);
    // Garante que seja múltiplo de 1 KiB (TikTok aceita)
    const aligned = Math.floor(chunkSize / 1024) * 1024;
    return aligned >= MIN_CHUNK ? aligned : MIN_CHUNK;
  }

  // Caso padrão: usa 5 MiB
  return PREFERRED_CHUNK;
}



export async function getVideoBufferFromS3(
  s3: S3Client,
  bucket: string,
  key: string
): Promise<Buffer> {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const response = await s3.send(command);

  if (!response.Body) {
    throw new Error("S3 Body is empty");
  }

  const chunks: Buffer[] = [];
  for await (const chunk of response.Body as any) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}
