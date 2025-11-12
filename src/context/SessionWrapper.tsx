// context/SessionWrapper.tsx
"use client";

import { useSession } from "next-auth/react";
import { createContext, useContext, useMemo } from "react";
import { decodeJwt, DecodedJwt } from "@/lib/decodeJwt";

type Role = "admin" | "instructor" | "user";

interface SessionUser {
  id: string;
  email: string;
  name?: string;
  role: Role;
}

interface AuthContextType {
  user: SessionUser | null;
  token: string | null;
  decoded: DecodedJwt | null;
  status: "authenticated" | "loading" | "unauthenticated";
  isAdmin: boolean;
  isInstructor: boolean;
  isUser: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  decoded: null,
  status: "loading",
  isAdmin: false,
  isInstructor: false,
  isUser: false,
});

export function SessionWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const auth = useMemo(() => {
    if (status !== "authenticated" || !session?.user) {
      return {
        user: null,
        token: null,
        decoded: null,
        status,
        isAdmin: false,
        isInstructor: false,
        isUser: false,
      };
    }

    const token = session.accessToken as string | undefined;
    const decoded = token ? decodeJwt(token) : null;

    const user: SessionUser = {
      id: session.user.id || decoded?.id?.toString() || "",
      email: session.user.email || decoded?.email || "",
      name: session.user.name || decoded?.name || "",
      role: (session.user.role || decoded?.role || "user") as Role,
    };

    return {
      user,
      token: token || null,
      decoded,
      status,
      isAdmin: user.role === "admin",
      isInstructor: user.role === "instructor",
      isUser: user.role === "user",
    };
  }, [session, status]);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);