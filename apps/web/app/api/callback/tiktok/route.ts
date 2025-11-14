import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@workspace/database"; // ajuste o caminho conforme seu projeto

const TIKTOK_TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/";
const TIKTOK_USERINFO_URL = "https://open.tiktokapis.com/v2/user/info/?fields=";
const REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/callback/tiktok`;

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


    let userInfo = null;
    try {
      const params = new URLSearchParams({ fields: "avatar_url,display_name" });
      const userResponse = await fetch(`${TIKTOK_USERINFO_URL}${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (userResponse.ok) {
        const data = await userResponse.json();
        userInfo = data.data?.user;
      }
    } catch (err) {
      console.warn("Erro ao buscar user info (continua sem problema):", err);

    }


    await prisma.account.create({
      data: {
        provider: "tiktok",
        providerAccountId: open_id,
        type: "oauth",
        userId: userId,
        socialAccountId: accountId,
        refresh_token: refresh_token || null,
        access_token,
        expires_at: expires_in ? Math.floor(Date.now() / 1000) + expires_in : null,
      },
    });

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
