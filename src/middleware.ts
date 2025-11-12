// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: any) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Si está logeado y entra a login → redirige a dashboard
  if (pathname === "/auth/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Proteger dashboard: solo usuarios autenticados
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/login", "/dashboard/:path*"],
};