'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';
import apiFetch from '@/lib/api';
import { ApiResponse, AuthData } from '@/types/api';

export default function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { setAccessToken } = useAuthStore();

  // 로그인 처리 함수
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await apiFetch<ApiResponse<AuthData>>(
      '/api/v1/auth/sign-in',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );

    if (result) {
      // 로그인 성공
      if (result.code === 'AUTH_2002') {
        setAccessToken(result.data!.accessToken);
        router.push('/');
        // 아이디 비번 불일치
      } else if (result.code === 'AUTH_4002') {
        setError('아이디 또는 비밀번호가 일치하지 않습니다.');
      } else {
        setError(result.message || '오류가 발생했습니다. 다시 시도해주세요.');
      }
    } else {
      setError('오류가 발생했습니다. 다시 시도해주세요.');
    }
    setLoading(false);
  };

  // 회원가입 처리 함수
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await apiFetch<ApiResponse<AuthData>>(
      '/api/v1/auth/sign-up',
      {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      }
    );

    if (result) {
      // 회원가입 성공
      if (result.code === 'AUTH_2001') {
        setAccessToken(result.data!.accessToken);
        router.push('/');
        // 아이디 비번 불일치
      } else if (result.code === 'AUTH_4001') {
        setError('이미 존재하는 이메일입니다');
      } else {
        setError(result.message || '오류가 발생했습니다. 다시 시도해주세요.');
      }
    } else {
      setError('오류가 발생했습니다. 다시 시도해주세요.');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          {isLoginMode ? '로그인' : '회원가입'}
        </h1>

        <form
          className="space-y-6"
          onSubmit={isLoginMode ? handleLogin : handleSignUp}
        >
          {/* 이메일 입력 필드 */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* 비밀번호 입력 필드 */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* 이름 입력 필드 */}
          {isLoginMode ? null : (
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                이름
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={1}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          {/* 에러 메시지 표시 */}
          {error && <p className="text-sm text-center text-red-500">{error}</p>}

          {/* 제출 버튼 */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? '처리 중...' : isLoginMode ? '로그인' : '회원가입'}
            </button>
          </div>
        </form>

        {/* 모드 전환 */}
        <p className="text-sm text-center text-gray-600">
          {isLoginMode ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="ml-1 font-medium text-blue-600 hover:underline"
          >
            {isLoginMode ? '회원가입' : '로그인'}
          </button>
        </p>
      </div>
    </div>
  );
}
