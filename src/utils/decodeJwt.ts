// utils/decodeJwt.ts
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: number;
  name: string;
  email: string;
  role: "admin" | "instructor" | "user";
  iat: number;
  exp: number;
}

export const decodeJwt = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};