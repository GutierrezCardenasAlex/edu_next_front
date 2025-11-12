// lib/decodeJwt.ts
import { jwtDecode } from "jwt-decode";

export interface DecodedJwt {
  id: number;
  name: string;
  email: string;
  role: "admin" | "instructor" | "user";
  iat: number;
  exp: number;
}

export const decodeJwt = (token: string): DecodedJwt | null => {
  try {
    return jwtDecode<DecodedJwt>(token);
  } catch {
    return null;
  }
};