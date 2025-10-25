import Link from 'next/link';
import { FaGithub, FaInstagram } from 'react-icons/fa';

const MobileFooterInfo = () => {
  const currentYear = new Date().getFullYear();

  const linkStyles =
    'text-gray-600 transition-colors duration-200 hover:text-blue-500';

  return (
    <footer className="md:hidden w-full bg-gray-50 border-t border-gray-200 mt-12 pb-20">
      <div className="px-6 py-8">
        {/* 프로젝트 섹션 */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            프로젝트
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className={linkStyles}>
                서비스 소개
              </Link>
            </li>
            <li>
              <Link href="/team" className={linkStyles}>
                만든 사람들
              </Link>
            </li>
            <li>
              <Link href="/faq" className={linkStyles}>
                자주 묻는 질문
              </Link>
            </li>
          </ul>
        </div>

        {/* 지원 섹션 */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">지원</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/contact" className={linkStyles}>
                문의하기
              </Link>
            </li>
            <li>
              <Link href="/help" className={linkStyles}>
                도움말 센터
              </Link>
            </li>
          </ul>
        </div>

        {/* 법적 고지 섹션 */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            법적 고지
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/terms" className={linkStyles}>
                이용약관
              </Link>
            </li>
            <li>
              <Link href="/privacy" className={linkStyles}>
                개인정보처리방침
              </Link>
            </li>
          </ul>
        </div>

        {/* Copyright & SNS */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-4">
            © {currentYear} 나의 동화책. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="https://github.com/my-fairy-tale"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Github"
              className="text-gray-500 hover:text-blue-500"
            >
              <FaGithub size={20} />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-gray-500 hover:text-blue-500"
            >
              <FaInstagram size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MobileFooterInfo;
