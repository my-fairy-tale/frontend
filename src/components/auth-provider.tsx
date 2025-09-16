'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

// SessionProvider를 클라이언트 컴포넌트로 한번 감싸줍니다.
export default function AuthProvider({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}
