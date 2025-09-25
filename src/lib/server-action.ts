'use server';

import { signIn, signOut } from '@/auth'; // auth.ts에서 export한 signIn
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

// 로그인 서버 액션
export async function loginAction(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    // NextAuth.js의 signIn 함수를 호출합니다.
    // 'credentials' provider를 사용하고, 폼 데이터를 전달합니다.
    // 성공 시, NextAuth가 자동으로 리다이렉트하거나 세션을 설정합니다.
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return '이메일 또는 비밀번호가 올바르지 않습니다.';
        default:
          return '알 수 없는 오류가 발생했습니다.';
      }
    }
    // 에러를 다시 throw해야 리다이렉트가 중단됩니다.
    throw error;
  }
}

// 회원가입 서버 액션
export async function signUpAction(
  prevState: string | undefined,
  formData: FormData
) {
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  const phoneNumber = formData.get('tel');

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/sign-up`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phoneNumber }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // 백엔드에서 받은 에러 메시지를 반환
      return data.message || '회원가입에 실패했습니다.';
    }

    // 회원가입 성공 시
  } catch (error) {
    return '서버와 통신 중 오류가 발생했습니다.';
  }

  // 성공 시 로그인 페이지로 리다이렉트
  redirect('/login');
}

export async function logoutAction() {
  await signOut({ redirectTo: '/' });
}
