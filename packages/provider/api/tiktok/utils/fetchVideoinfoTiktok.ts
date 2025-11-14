import { prisma, PostStatus } from "@workspace/database";


export async function fetchTikTokPostStatus({
  publishId,
  postId,
  accessToken,
}: {
  publishId: string;
  postId: string;
  accessToken: string;
}) {
  try {
    const response = await fetch(
      "https://open.tiktokapis.com/v2/post/publish/status/fetch/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          publish_id: publishId,
        }),
      }
    );

    const data = await response.json();
    console.log(data)

    // Verifica erro na API
    if (data.error?.code !== "ok") {
      console.error("Erro na API do TikTok:", data.error);
      return { success: false, error: data.error.message };
    }

    const statusData = data.data;

    // Mapeamento de status do TikTok → PostStatus
    const statusMap: Record<string, PostStatus> = {
      PROCESSING_UPLOAD: PostStatus.PROCESSING,
      PROCESSING: PostStatus.PROCESSING,
      SUCCESS: PostStatus.SUCCESS,
      FAILED: PostStatus.FAILED,
    };

    const newStatus = statusMap[statusData.status] || PostStatus.PROCESSING;

    // Atualiza no banco
    await prisma.post.update({
      where: { id: postId },
      data: {
        status: newStatus,
        LinkVideo: data.aweme_url
      },
    });

    console.log(`Post ${postId} → Status: ${newStatus}`);

    return {
      success: true,
      status: newStatus,
      data: statusData,
      linkVideo: data.aweme_url
    };
  } catch (error: any) {
    console.error("Erro ao buscar status do TikTok:", error.message);
    return { success: false, error: error.message };
  }
}
