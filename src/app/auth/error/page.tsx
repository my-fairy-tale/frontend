'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return '서버 설정에 문제가 있습니다';
      case 'AccessDenied':
        return '접근이 거부되었습니다';
      case 'Verification':
        return '인증 토큰이 만료되었습니다';
      case 'OAuthSignin':
        return '소셜 로그인 시작 실패';
      case 'OAuthCallback':
        return '소셜 로그인 처리 오류';
      case 'OAuthCreateAccount':
        return '소셜 계정 생성 실패';
      case 'EmailCreateAccount':
        return '이메일 계정 생성 실패';
      case 'Callback':
        return '인증 콜백 처리 오류';
      case 'OAuthAccountNotLinked':
        return '이미 다른 방법으로 가입된 이메일입니다';
      case 'EmailSignin':
        return '이메일 로그인 실패';
      case 'CredentialsSignin':
        return '이메일 또는 비밀번호가 올바르지 않습니다';
      case 'SessionRequired':
        return '로그인이 필요합니다';
      default:
        return '알 수 없는 오류가 발생했습니다';
    }
  };

  return (
    <div className="flex w-full items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <FaExclamationTriangle className="text-red-500 text-6xl mb-4" />
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            로그인 실패
          </h1>
          <p className="text-center text-gray-600 mb-6">
            {getErrorMessage(error)}
          </p>
        </div>

        {error && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">
              <span className="font-semibold">오류 코드:</span> {error}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/auth/login"
            className="block w-full px-4 py-3 bg-blue-600 text-white text-center font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            다시 로그인하기
          </Link>
          <Link
            href="/"
            className="block w-full px-4 py-3 bg-gray-200 text-gray-700 text-center font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>

        <p className="text-sm text-center text-gray-600">
          문제가 계속되면 고객센터로 문의해주세요
        </p>
      </div>
    </div>
  );
}
