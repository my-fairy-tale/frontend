'use server';

import { signIn, signOut } from '@/auth'; // auth.ts에서 export한 signIn
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
import ApiFetch from '@/lib/api';
import { ApiResponse, AuthData } from '@/types/api';

// 로그인 서버 액션
export async function loginAction(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      redirect: false,
    });

    return 'SUCCESS';
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return '이메일 또는 비밀번호가 올바르지 않습니다.';
        case 'CallbackRouteError':
          return '서버가 잠시 자는중이에요... ㅠ_ㅜ';
        default:
          console.log('sign in at server action error is', error);
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
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const phoneNumber = formData.get('tel') as string;

  if (!name || !email || !password || !phoneNumber) {
    return '필수 항목을 모두 입력해주세요!';
  }

  try {
    const data = await ApiFetch<ApiResponse<AuthData>>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/sign-up`,
      {
        method: 'POST',
        body: JSON.stringify({ name, email, password, phoneNumber }),
      }
    );

    if (data.code === 'AUTH_4001') {
      return '이미 존재하는 이메일입니다.';
    }
  } catch (err) {
    // ApiFetchError 또는 다른 에러 처리
    if (err instanceof Error) {
      return err.message;
    }
    return '서버와 통신 중 오류가 발생했습니다.';
  }

  // 성공 시 로그인 페이지로 리다이렉트
  redirect('/auth/login');
}

export async function logoutAction() {
  await signOut({ redirectTo: '/auth/login' });
}
