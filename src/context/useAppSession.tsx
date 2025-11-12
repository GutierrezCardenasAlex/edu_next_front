// context/useAppSession.ts
"use client";

import { useSession } from "next-auth/react";
import { createContext, useContext, useMemo } from "react";
import { decodeJwt } from "@/utils/decodeJwt";

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
  decodedToken: ReturnType<typeof decodeJwt>;
  status: "authenticated" | "loading" | "unauthenticated";
  isAdmin: boolean;
  isInstructor: boolean;
  isUser: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  decodedToken: null,
  status: "loading",
  isAdmin: false,
  isInstructor: false,
  isUser: false,
});

export function SessionWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const authValue = useMemo(() => {
    if (status !== "authenticated" || !session) {
      return {
        user: null,
        token: null,
        decodedToken: null,
        status,
        isAdmin: false,
        isInstructor: false,
        isUser: false,
      };
    }

    // El token está en session.accessToken si usas JWT strategy
    const token = (session as any).accessToken as string | undefined;
    const decoded = token ? decodeJwt(token) : null;

    const user: SessionUser = {
      id: session.user?.id || String(decoded?.id || ""),
      email: session.user?.email || decoded?.email || "",
      name: session.user?.name || decoded?.name,
      role: (decoded?.role || session.user?.role || "user") as Role,
    };

    return {
      user,
      token: token || null,
      decodedToken: decoded,
      status,
      isAdmin: user.role === "admin",
      isInstructor: user.role === "instructor",
      isUser: user.role === "user",
    };
  }, [session, status]);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);