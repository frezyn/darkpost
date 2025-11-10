import { Role } from "@prisma/client";
import { auth } from "@workspace/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


const middleware = auth(async (req) => {

  const codeInvite = req.nextUrl.searchParams.get("code");
  const cookieStore = await cookies()

  if (codeInvite) {
    cookieStore.set("code", codeInvite)
  }

  /*
  const url = new URL(req.nextUrl.origin);
  if (!req.auth && !req.url.includes("login")) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  */

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images/*|auth).*)"],
  unstable_allowDynamic: ["**/node_modules/@react-email*/**/*.mjs*"],
  runtime: "nodejs"
};

export default middleware
