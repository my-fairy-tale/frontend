'use client'; // usePathname 훅을 사용하기 위해 클라이언트 컴포넌트로 선언

import useAuthStore from '@/store/useAuthStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// 로고 SVG 컴포넌트 (책 모양 아이콘)
const Logo = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5V4.5A2.5 2.5 0 0 1 6.5 2z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Header = () => {
  const pathname = usePathname();
  const { accessToken, setAccessToken } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/books', label: '동화책 만들기' },
    { href: '/community', label: '커뮤니티' },
    { href: '/mypage', label: '마이페이지' },
  ];

  // Hydration 오류 방지를 위한 마운트 상태
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    // 로그아웃 시 스토어의 토큰을 null로 설정합니다.
    setAccessToken(null);
    // 필요하다면 쿠키에 저장된 refreshToken을 제거하는 API를 호출할 수도 있습니다.
  };

  if (!isMounted) {
    return null;
  }

  return (
    <header className="sticky top-0 bg-white bg-opacity-80 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 및 사이트 이름 */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition-colors"
            >
              <Logo />
              <span className="font-semibold text-lg">나의 동화책</span>
            </Link>
          </div>

          {/* 주요 네비게이션 */}
          <nav className="hidden md:flex md:space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base font-medium transition-colors ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* 로그인 버튼 */}
          {accessToken ? (
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-8 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <Link
                href="/auth"
                className="ml-8 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                로그인
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
