'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import useUserStore from '@/store/use-user-store';
import { Session } from 'next-auth';
import { ApiResponse } from '@/types/api';
import { useEffect, useRef } from 'react';

interface AuthButtonProps {
  initialSession: Session | null;
}

export default function AuthButton({ initialSession }: AuthButtonProps) {
  const { data: clientSession, status } = useSession();
  const { clearUser } = useUserStore();
  const wasAuthenticated = useRef(false);

  // Use client session if available, fallback to initial session
  const session = clientSession ?? initialSession;
  const isLoggedIn =
    status === 'authenticated' || (status === 'loading' && initialSession);

  // Monitor session and auto-logout on expiration
  useEffect(() => {
    console.log('🔍 Auth Debug:', {
      status,
      hasClientSession: !!clientSession,
      hasInitialSession: !!initialSession,
      wasAuthenticated: wasAuthenticated.current,
      clientSessionExpires: clientSession?.expires,
      timestamp: new Date().toISOString(),
    });

    if (status === 'authenticated') {
      console.log('✅ Authenticated - setting wasAuthenticated to true');
      wasAuthenticated.current = true;
    }

    // If session becomes null after being authenticated, auto logout
    if (
      wasAuthenticated.current &&
      status === 'unauthenticated' &&
      !clientSession
    ) {
      console.warn('⚠️ Auto logout triggered:', {
        wasAuthenticated: wasAuthenticated.current,
        status,
        hasClientSession: !!clientSession,
        hasInitialSession: !!initialSession,
        timestamp: new Date().toISOString(),
      });
      clearUser();
      signOut({ callbackUrl: '/auth/login' });
    }
  }, [status, clientSession, initialSession, clearUser]);

  const handleLogout = async () => {
    clearUser();

    // Call backend logout API to invalidate refresh token
    if (session?.accessToken) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data: ApiResponse<null> = await response.json();
          console.log('Backend logout successful:', data.message);
        }
      } catch (error) {
        console.error('Backend logout failed:', error);
        // Continue with frontend logout even if backend fails
      }
    }

    // NextAuth signOut - clears frontend session
    await signOut({ callbackUrl: '/auth/login' });
  };

  if (status === 'loading' && !initialSession) {
    return (
      <div className="w-[82px] h-[40px] bg-gray-200 rounded-md animate-pulse"></div>
    );
  }

  if (isLoggedIn) {
    return (
      <button
        onClick={handleLogout}
        className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700"
      >
        로그아웃
      </button>
    );
  }

  return (
    <Link
      href="/auth/login"
      className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
    >
      로그인
    </Link>
  );
}
