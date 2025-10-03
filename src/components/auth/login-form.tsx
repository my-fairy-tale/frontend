'use client';

import { useFormStatus } from 'react-dom';
import { loginAction } from '@/lib/server-action';
import Link from 'next/link';
import { useActionState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// 제출 버튼을 위한 별도 컴포넌트 (useFormStatus 훅 사용)
function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full px-3 py-2 mt-1 rounded-md shadow-sm text-center text-white ${
        pending ? 'bg-gray-500' : 'bg-blue-500'
      }`}
    >
      {pending ? '로그인 중...' : '로그인'}
    </button>
  );
}

export default function LoginForm() {
  const [message, dispatch] = useActionState(loginAction, undefined);
  const { update } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (message === 'SUCCESS') {
      update().then(() => {
        router.push('/');
      });
    }
  }, [message, router, update]);

  const errorMessage = message && message !== 'SUCCESS' ? message : undefined;

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center">로그인</h1>
      <form
        action={dispatch}
        className="space-y-6"
      >
        <div>
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            name="email"
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            name="password"
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {errorMessage && (
          <p className="text-sm text-center text-red-500">{errorMessage}</p>
        )}
        <LoginButton />
      </form>
      <p className="text-sm text-center text-gray-600">
        계정이 없으신가요?
        <Link
          href="/auth/signup"
          className="ml-1 font-medium text-blue-600 hover:underline"
        >
          회원가입
        </Link>
      </p>
    </div>
  );
}
