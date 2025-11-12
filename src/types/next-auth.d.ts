// src/types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: "admin" | "instructor" | "user";
    };
    accessToken?: string;
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    role: "admin" | "instructor" | "user";
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    role?: "admin" | "instructor" | "user";
    accessToken?: string;
  }
}