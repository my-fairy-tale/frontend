'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { logoutAction } from '@/lib/server-action';
import useUserStore from '@/store/use-user-store';
import { Session } from 'next-auth';

interface AuthButtonProps {
  initialSession: Session | null;
}

export default function AuthButton({ initialSession }: AuthButtonProps) {
  const { data: clientSession, status } = useSession();
  const { clearUser } = useUserStore();

  // Use client session if available, fallback to initial session
  const session = clientSession ?? initialSession;
  const isLoggedIn = status === 'authenticated' || (status === 'loading' && initialSession);

  const handleLogout = async () => {
    clearUser();
    await logoutAction();
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
