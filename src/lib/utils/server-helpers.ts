import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export function getServerCookies(): string {
  try {
    const cookieStore = cookies();
    return cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");
  } catch (error) {
    console.warn("Failed to get server cookies:", error);
    return "";
  }
}

export function getCookiesFromRequest(request: NextRequest): string {
  return request.cookies.toString();
}

export function setCookieInResponse(
  response: NextResponse,
  name: string,
  value: string,
  options: {
    expires?: Date;
    maxAge?: number;
    path?: string;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: "strict" | "lax" | "none";
  } = {},
) {
  let cookieString = `${name}=${value}`;

  if (options.expires) {
    cookieString += `; Expires=${options.expires.toUTCString()}`;
  }
  if (options.maxAge !== undefined) {
    cookieString += `; Max-Age=${options.maxAge}`;
  }
  if (options.path) {
    cookieString += `; Path=${options.path}`;
  }
  if (options.domain) {
    cookieString += `; Domain=${options.domain}`;
  }
  if (options.secure) {
    cookieString += `; Secure`;
  }
  if (options.httpOnly) {
    cookieString += `; HttpOnly`;
  }
  if (options.sameSite) {
    cookieString += `; SameSite=${options.sameSite}`;
  }

  response.headers.append("Set-Cookie", cookieString);
}
