// app/api/auth/oauth/route.ts
import { NextRequest, NextResponse } from 'next/server';

const TIKTOK_AUTHORIZE_URL = 'https://www.tiktok.com/v2/auth/authorize/';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("userId");
  const accountId = searchParams.get("accountId");

  if (!userId || !accountId) {
    return NextResponse.json("query `id` e necessario", { status: 400 })
  }

  const params = new URLSearchParams({
    client_key: process.env.AUTH_TIKTOK_ID!,
    scope: 'user.info.basic,video.upload,video.publish',
    response_type: 'code',
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/callback/tiktok`,
    state: userId + "," + accountId
  });

  const authUrl = `${TIKTOK_AUTHORIZE_URL}?${params.toString()}`;

  return NextResponse.redirect(authUrl);
}
