import Link from 'next/link';
import { FiBookOpen, FiFeather, FiVolume2 } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

const SnapSection = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <section
    className={`h-screen w-full flex items-center justify-center snap-start snap-always ${className}`}
  >
    {children}
  </section>
);

export default function HomePage() {
  return (
    <main className="bg-gray-50  w-full text-gray-800">
      <SnapSection className="text-center py-20 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            당신의 상상이 동화가 되는 곳
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            단 몇 줄의 이야기로 세상에 단 하나뿐인 그림 동화책을 만들어보세요.
            AI가 당신의 이야기에 생명을 불어넣어 줍니다.
          </p>
          <Link
            href="/books/create"
            className="inline-block bg-blue-600 text-white font-bold text-lg px-8 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            나만의 동화책 만들러 가기 ✨
          </Link>
        </div>
      </SnapSection>

      <SnapSection className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">
            4단계로 완성하는 나만의 동화책
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 bg-white rounded-xl shadow-md">
              <FiFeather className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">이야기 작성</h3>
              <p className="text-gray-600">
                머릿속에 떠오르는 이야기를 자유롭게 적어주세요.
              </p>
            </div>
            <div className="p-8 bg-white rounded-xl shadow-md">
              <HiSparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI 그림 생성</h3>
              <p className="text-gray-600">
                AI가 당신의 이야기에 어울리는 그림들을 마법처럼 그려냅니다.
              </p>
            </div>
            <div className="p-8 bg-white rounded-xl shadow-md">
              <FiBookOpen className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">동화책 완성</h3>
              <p className="text-gray-600">
                글과 그림이 담긴 멋진 동화책을 눈으로 즐겨보세요.
              </p>
            </div>
            <div className="p-8 bg-white rounded-xl shadow-md">
              <FiVolume2 className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">이야기 듣기 🎧</h3>
              <p className="text-gray-600">
                생생한 AI 음성으로 동화책을 읽어주어 더욱 실감 나게 즐길 수
                있어요.
              </p>
            </div>
          </div>
        </div>
      </SnapSection>

      <SnapSection className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold mb-4">모두가 동화 작가</h2>
            <p className="text-gray-600 mb-6 text-lg">
              &apos;나의 동화책&apos;은 아이와 부모님, 그리고 이야기를 사랑하는
              모든 사람을 위한 서비스입니다. 복잡한 그림 기술 없이도, 당신의
              소중한 이야기를 아름다운 그림책으로 만들 수 있습니다.
            </p>
            <ul className="space-y-5">
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-600 font-bold rounded-full w-6 h-6 text-center mr-3 flex-shrink-0">
                  ✓
                </span>
                <span className="text-center">
                  <span className="font-black">무한한 상상력:</span> 어떤
                  이야기든 그림으로 구현됩니다.
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-600 font-bold rounded-full w-6 h-6 text-center mr-3 flex-shrink-0">
                  ✓
                </span>
                <span>
                  <span className="font-black">간편한 제작:</span> 글만 쓰면
                  나머지는 AI가 알아서 처리해줘요.
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-600 font-bold rounded-full w-6 h-6 text-center mr-3 flex-shrink-0">
                  ✓
                </span>
                <span>
                  <span className="font-black">소중한 기록:</span> 아이의
                  이야기를 평생 간직할 수 있는 선물로 만들어보세요.
                </span>
              </li>
            </ul>
          </div>
          <div className="order-1 md:order-2">
            {/* 이미지를 여기에 넣어주세요 */}
            <div className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center text-gray-500"></div>
          </div>
        </div>
      </SnapSection>

      <SnapSection className="text-center py-20 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">
            지금 바로 당신의 이야기를 시작해보세요
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            세상에 없던 새로운 동화가 당신을 기다리고 있습니다.
          </p>
          <Link
            href="/books/create"
            className="inline-block bg-blue-600 text-white font-bold text-lg px-8 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            무료로 동화책 만들기 ✨
          </Link>
        </div>
      </SnapSection>
    </main>
  );
}
