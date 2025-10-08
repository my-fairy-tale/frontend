import Link from 'next/link';
import { FaBook } from 'react-icons/fa';
import { auth } from '@/auth';
import Navigation from './navigation';
import AuthButton from './auth-button';
import ScrollHeader from './scroll-header';

export default async function Header() {
  const session = await auth();

  return (
    <ScrollHeader>
      <header className="sticky top-0 bg-white bg-opacity-80 backdrop-blur-sm border-b border-gray-200 z-50">
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
            <Navigation />

            {/* 로그인/로그아웃 버튼 */}
            <div className="flex items-center ml-8">
              <AuthButton initialSession={session} />
            </div>
          </div>
        </div>
      </header>
    </ScrollHeader>
  );
}
