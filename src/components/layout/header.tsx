'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaBook } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { logoutAction } from '@/lib/server-action';

const Header = () => {
  const pathname = usePathname();
  const { status } = useSession();
  const isLoggedIn = status === 'authenticated';

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // 스크롤을 아래로 내릴 때
      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      }
      // 스크롤을 위로 올릴 때
      else {
        setIsVisible(true);
      }
      // 현재 스크롤 위치를 마지막 위치로 업데이트
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거 (메모리 누수 방지)
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/books', label: '동화책 만들기' },
    { href: '/library', label: '모두의 서재' },
    { href: '/mypage', label: '마이페이지' },
  ];

  return (
    <header
      className={`sticky top-0 bg-white bg-opacity-80 backdrop-blur-sm border-b border-gray-200 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 및 사이트 이름 */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition-colors"
            >
              <FaBook size={32} />
              <span className="font-semibold text-lg">나의 동화책</span>
            </Link>
          </div>

          {/* 주요 네비게이션 */}
          <nav className="hidden md:flex md:space-x-8">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === link.href
                  : pathname.startsWith(link.href);
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
          <div className="flex items-center ml-8">
            {status === 'loading' ? (
              <div className="w-[82px] h-[40px] bg-gray-200 rounded-md animate-pulse"></div>
            ) : isLoggedIn ? (
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  로그아웃
                </button>
              </form>
            ) : (
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
