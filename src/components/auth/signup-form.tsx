'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { signUpAction } from '@/lib/server-action';
import Link from 'next/link';

function SignUpButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full px-3 py-2 mt-1 rounded-md shadow-sm text-center text-white bg-blue-500"
    >
      {pending ? '회원가입 중...' : '회원가입'}
    </button>
  );
}

export default function SignUpForm() {
  const [errorMessage, dispatch] = useFormState(signUpAction, undefined);

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center">회원가입</h1>
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
        <div>
          <label htmlFor="name">이름</label>
          <input
            id="name"
            type="name"
            name="name"
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="tel">전화번호</label>
          <input
            id="tel"
            type="tel"
            name="tel"
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {errorMessage && (
          <p className="text-sm text-center text-red-500">{errorMessage}</p>
        )}
        <SignUpButton />
      </form>
      <p className="text-sm text-center text-gray-600">
        이미 계정이 있으신가요?
        <Link
          href="/login"
          className="ml-1 font-medium text-blue-600 hover:underline"
        >
          로그인
        </Link>
      </p>
    </div>
  );
}
