import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const cookies = request.cookies;

  response.headers.set("Access-Control-Allow-Credentials", "true");

  if (cookies.size > 0) {
    const cookieHeader = cookies.toString();
    response.headers.set("x-forwarded-cookies", cookieHeader);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
