import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@workspace/database"; // ajuste o caminho conforme seu projeto

const TIKTOK_TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/";
const TIKTOK_USERINFO_URL = "https://open.tiktokapis.com/v2/user/info/?fields=";
const REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/callback/tiktok`;


interface TikTokUserData {
  user: {
    /** ID único do usuário na união de plataformas */
    union_id: string;

    display_name: string;
    /** URL do avatar do usuário */
    avatar_url: string;

    /** Quantidade de seguidores */
    follower_count: number;

    /** Open ID (geralmente anonimizado no TikTok) */
    open_id: string;
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");


  if (error || !code || !state) {
    const message = error || "Parâmetros inválidos no callback OAuth";
    return NextResponse.redirect(
      new URL(`/error?message=${encodeURIComponent(message)}`, request.url)
    );
  }


  const [userId, accountId] = state.split(",");
  if (!userId || !accountId) {
    return NextResponse.redirect(
      new URL(`/error?message=${encodeURIComponent("State inválido")}`, request.url)
    );
  }

  try {

    const tokenResponse = await fetch(TIKTOK_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache",
      },
      body: new URLSearchParams({
        client_key: process.env.AUTH_TIKTOK_ID!,
        client_secret: process.env.AUTH_TIKTOK_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("TikTok Token Error:", errorText);
      return NextResponse.redirect(
        new URL(`/error?message=${encodeURIComponent("Falha ao obter token")}`, request.url)
      );
    }

    const tokens = await tokenResponse.json();
    const { access_token, refresh_token, expires_in, open_id } = tokens;

    if (!access_token || !open_id) {
      return NextResponse.redirect(
        new URL(`/error?message=${encodeURIComponent("Token ou open_id ausente")}`, request.url)
      );
    }


    let userInfo: TikTokUserData | null = null;
    try {
      const params = new URLSearchParams({ fields: "open_id,union_id,avatar_url,follower_count,display_name" });
      const userResponse = await fetch(`${TIKTOK_USERINFO_URL}${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (userResponse.ok) {
        const data = await userResponse.json();
        userInfo = data.data as TikTokUserData;
      }
    } catch (err) {
      console.warn("Erro ao buscar user info (continua sem problema):", err);

    }



    await prisma.connectedAccount.create({
      data: {
        accessToken: access_token,
        username: userInfo?.user.display_name,
        platform: "tiktok",
        socialAccountId: accountId,
        platformAccountId: userInfo?.user.union_id!,
        displayName: userInfo?.user.display_name,
        avatarUrl: userInfo?.user.avatar_url,
        followers: userInfo?.user.follower_count,
        userId: userId,
        tokenExpiresAt: new Date(expires_in) || null,
        refreshToken: refresh_token,
      }
    })
    const redirectUrl = new URL(`${process.env.NEXTAUTH_URL}/dashboard/accounts`, request.url);
    redirectUrl.searchParams.set("accountId", accountId);

    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error("Erro inesperado no callback TikTok:", err);
    return NextResponse.redirect(
      new URL(`/error?message=${encodeURIComponent("Erro interno no servidor")}`, request.url)
    );
  }
}
