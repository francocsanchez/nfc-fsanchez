import { NextResponse, type NextRequest } from "next/server";

import { getCentralLoginUrl, getCentralSession } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const sessionResult = await getCentralSession(request.headers);
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  if (sessionResult.status === "unauthenticated") {
    const loginUrl =
      nextPath === "/admin"
        ? getCentralLoginUrl("/credenciales/perfiles/admin", request.headers)
        : getCentralLoginUrl(nextPath, request.headers);

    return NextResponse.redirect(loginUrl);
  }

  if (sessionResult.status === "forbidden") {
    return NextResponse.redirect(new URL("/forbidden", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
