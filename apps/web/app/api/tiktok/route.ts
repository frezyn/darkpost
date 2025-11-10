// app/api/auth/oauth/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const TIKTOK_AUTHORIZE_URL = 'https://www.tiktok.com/v2/auth/authorize/';

export async function GET() {
  const params = new URLSearchParams({
    client_key: process.env.AUTH_TIKTOK_ID!,
    scope: 'user.info.basic',
    response_type: 'code',
    redirect_uri: `https://real-keeps-andrews-memo.trycloudflare.com/api/callback/tiktok`,
  });

  const authUrl = `${TIKTOK_AUTHORIZE_URL}?${params.toString()}`;

  return NextResponse.redirect(authUrl);
}
