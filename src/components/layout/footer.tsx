import Link from 'next/link';

// 간단한 SVG 아이콘 컴포넌트들
const GithubIcon = () => (
  <svg
    height="24"
    width="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const TwitterIcon = () => (
  <svg
    height="24"
    width="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
  </svg>
);

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
          <p>© {currentYear} 이야기 씨앗. All rights reserved.</p>
          <div className="flex gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Github"
              className="text-gray-500 hover:text-blue-500"
            >
              <GithubIcon />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-gray-500 hover:text-blue-500"
            >
              <TwitterIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
