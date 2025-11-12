// context/SessionAuthProvider.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { SessionWrapper } from "./SessionWrapper";

interface Props {
  children: React.ReactNode;
}

export default function SessionAuthProvider({ children }: Props) {
  return (
    <SessionProvider
      refetchInterval={0}
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
    >
      <SessionWrapper>{children}</SessionWrapper>
    </SessionProvider>
  );
}