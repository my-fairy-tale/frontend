import Link from 'next/link';
import { FaGithub, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // 링크 스타일을 공통으로 사용하기 위한 클래스
  const linkStyles =
    'text-gray-500 transition-colors duration-200 hover:text-blue-500 hover:underline';

  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
      <div className="max-w-6xl mx-auto py-16 px-8">
        <div className="flex flex-wrap justify-between gap-8 mb-12">
          {/* --- 프로젝트 섹션 --- */}
          <div className="flex-1 min-w-[180px]">
            <h3 className="text-base font-semibold text-gray-800 mb-4">
              프로젝트
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className={linkStyles}
                >
                  서비스 소개
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className={linkStyles}
                >
                  만든 사람들
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className={linkStyles}
                >
                  자주 묻는 질문
                </Link>
              </li>
            </ul>
          </div>

          {/* --- 지원 섹션 --- */}
          <div className="flex-1 min-w-[180px]">
            <h3 className="text-base font-semibold text-gray-800 mb-4">지원</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/contact"
                  className={linkStyles}
                >
                  문의하기
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className={linkStyles}
                >
                  도움말 센터
                </Link>
              </li>
            </ul>
          </div>

          {/* --- 법적 고지 섹션 --- */}
          <div className="flex-1 min-w-[180px]">
            <h3 className="text-base font-semibold text-gray-800 mb-4">
              법적 고지
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/terms"
                  className={linkStyles}
                >
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className={linkStyles}
                >
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-wrap justify-between items-center">
          <p>© {currentYear} 나의 동화책. All rights reserved.</p>
          <div className="flex gap-6">
            <Link
              href="https://github.com/my-fairy-tale"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Github"
              className="text-gray-500 hover:text-blue-500"
            >
              <FaGithub size={24} />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-gray-500 hover:text-blue-500"
            >
              <FaInstagram size={24} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
