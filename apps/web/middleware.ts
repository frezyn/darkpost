import { auth } from "@workspace/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


const middleware = auth(async (req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const codeInvite = nextUrl.searchParams.get("code");
  if (codeInvite) {
    const cookieStore = cookies();
    (await cookieStore).set("code", codeInvite, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }


  if (!req.auth) {

    if (pathname !== "/login" && !pathname.startsWith("/api") && !pathname.startsWith("/_next")) {
      const loginUrl = new URL("/login", nextUrl.origin);

      loginUrl.searchParams.set("callbackUrl", pathname + nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }


  const userId = req.auth.user?.id;
  if (userId) {

    if (pathname.startsWith("/dashboard") || pathname.startsWith("/accounts")) {
      return NextResponse.next();
    }


    if (pathname === "/" || pathname === "/login" || pathname.startsWith("/public")) {
      const dashboardUrl = new URL("/dashboard", nextUrl.origin);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images/*|auth).*)"],
  unstable_allowDynamic: ["**/node_modules/@react-email*/**/*.mjs*"],
  runtime: "nodejs"
};

export default middleware
