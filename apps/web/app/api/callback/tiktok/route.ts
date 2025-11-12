// app/api/auth/callback/tiktok/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { stat } from 'fs';

const TIKTOK_TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/';
const TIKTOK_USERINFO_URL = 'https://open.tiktokapis.com/v2/user/info/?';
const REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/callback/tiktok`;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // 1. Erro ou falta de code
  if (error || !code) {
    return NextResponse.redirect(
      new URL(`/error?message=${error || 'OAuth failed'}`, request.url)
    );
  }

  // 3. Troca code por token
  const tokenResponse = await fetch(TIKTOK_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache',
    },
    body: new URLSearchParams({
      client_key: process.env.AUTH_TIKTOK_ID!,
      client_secret: process.env.AUTH_TIKTOK_SECRET!,
      code,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
    }),
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    console.error('TikTok Token Error:', errorText);
    return NextResponse.redirect(
      new URL('/error?message=Token exchange failed', request.url)
    );
  }

  const tokens = await tokenResponse.json();
  const { access_token, refresh_token, expires_in, open_id } = tokens;

  const params = new URLSearchParams({
    fields: 'avatar_url,display_name',
  })

  // 4. Busca dados do usuário
  const userResponse = await fetch(TIKTOK_USERINFO_URL + params.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
  });

  let userInfo = null;

  if (userResponse.ok) {
    const data = await userResponse.json();
    userInfo = data.data.user;
  } else {
    console.error('User Info Error:', await userResponse.text());
  }

  const redirectUrl = new URL('/dashboard', request.url);
  redirectUrl.searchParams.set('access_token', access_token);
  redirectUrl.searchParams.set('open_id', open_id);
  redirectUrl.searchParams.set('accountId', state!)
  if (userInfo) {
    redirectUrl.searchParams.set('username', userInfo.username);
    redirectUrl.searchParams.set('display_name', userInfo.display_name);
  }

  return NextResponse.redirect(redirectUrl);
}
