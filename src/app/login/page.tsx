'use client'; // onClick 이벤트를 사용하므로 클라이언트 컴포넌트로 선언합니다.

import { signIn } from 'next-auth/react';

// 카카오 로고 SVG 컴포넌트
const KakaoIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4Z"
      fill="#FEE500"
    />
    <path
      d="M8.22222 9.77778C8.22222 8.78343 8.87413 8 9.68421 8H10.1579C10.968 8 11.62 8.78343 11.62 9.77778V12.0111L10.3833 11.2333C10.2974 11.176 10.1983 11.1444 10.0956 11.1444H9.68421C8.87413 11.1444 8.22222 10.561 8.22222 9.77778Z"
      fill="#181600"
    />
    <path
      d="M12.38 9.77778C12.38 8.78343 13.0319 8 13.842 8H14.3157C15.1258 8 15.7777 8.78343 15.7777 9.77778V14.0778C15.7777 15.0721 15.1258 15.8556 14.3157 15.8556H13.842C13.0319 15.8556 12.38 15.0721 12.38 14.0778V9.77778Z"
      fill="#181600"
    />
  </svg>
);

const LoginPage = () => {
  const handleLogin = () => {
    // next-auth의 signIn 함수를 호출합니다.
    // 첫 번째 인자는 NextAuth 설정에 추가한 provider의 id ('kakao')입니다.
    // 두 번째 인자는 옵션 객체로, 로그인 성공 후 리디렉션될 경로를 지정할 수 있습니다.
    signIn('kakao', { callbackUrl: '/' });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">로그인</h1>
          <p className="mt-2 text-gray-500">
            이야기 씨앗에 오신 것을 환영합니다!
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center px-4 py-3 bg-[#FEE500] rounded-lg font-semibold text-gray-800 transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FEE500]"
          >
            <KakaoIcon />
            <span className="ml-3">카카오로 3초만에 시작하기</span>
          </button>
        </div>

        <div className="text-center text-sm text-gray-400">
          <p>
            로그인은 개인정보처리방침 및 이용약관에 동의하는 것을 의미합니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
