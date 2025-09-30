import Link from 'next/link';

export default function FaqPage() {
  return (
    <main className="max-w-4xl mx-auto p-6 md:p-8 my-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          자주 묻는 질문
        </h1>
        <p className="text-xl text-gray-600">
          궁금하신 내용을 빠르게 찾아보세요
        </p>
      </section>

      <section className="bg-white rounded-lg shadow-md p-8 mb-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-3">
          💡 서비스 이용
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Q. 나의 동화책은 어떤 서비스인가요?
            </h3>
            <p className="text-gray-700 leading-relaxed pl-4 border-l-4 border-blue-500">
              나의 동화책은 AI 기술을 활용하여 누구나 쉽게 그림 동화책을 만들 수
              있는 서비스입니다. 간단한 이야기만 작성하면, AI가 자동으로
              아름다운 삽화를 생성하여 완성된 동화책을 만들어줍니다.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Q. 회원가입 없이도 이용할 수 있나요?
            </h3>
            <p className="text-gray-700 leading-relaxed pl-4 border-l-4 border-blue-500">
              미리보기 기능은 회원가입 없이 체험할 수 있습니다. 하지만 동화책을
              저장하고 관리하려면 회원가입이 필요합니다.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Q. 무료로 이용할 수 있나요?
            </h3>
            <p className="text-gray-700 leading-relaxed pl-4 border-l-4 border-blue-500">
              기본적인 동화책 생성 기능은 무료로 제공됩니다. 월 3권까지 무료로
              생성할 수 있으며, 추가 생성이 필요한 경우 유료 플랜을 이용하실 수
              있습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-8 mb-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-3">
          📚 동화책 만들기
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Q. 동화책을 만드는 데 얼마나 걸리나요?
            </h3>
            <p className="text-gray-700 leading-relaxed pl-4 border-l-4 border-purple-500">
              이야기를 작성하는 데 5-10분, AI가 그림을 생성하는 데 3-5분 정도
              소요됩니다. 총 10-15분 정도면 완성된 동화책을 만들 수 있습니다.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Q. 생성된 그림이 마음에 들지 않으면 어떻게 하나요?
            </h3>
            <p className="text-gray-700 leading-relaxed pl-4 border-l-4 border-purple-500">
              각 페이지별로 그림을 재생성할 수 있습니다. 다른 스타일을
              선택하거나, 프롬프트를 수정하여 원하는 결과물을 얻을 수 있습니다.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Q. 동화책은 몇 페이지까지 만들 수 있나요?
            </h3>
            <p className="text-gray-700 leading-relaxed pl-4 border-l-4 border-purple-500">
              무료 플랜에서는 최대 10페이지까지 만들 수 있습니다. 유료 플랜을
              이용하시면 최대 30페이지까지 제작 가능합니다.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Q. 그림 스타일을 선택할 수 있나요?
            </h3>
            <p className="text-gray-700 leading-relaxed pl-4 border-l-4 border-purple-500">
              네, 수채화, 만화, 사실적 표현 등 다양한 스타일 중에서 선택할 수
              있습니다. 전체 동화책에 일관된 스타일을 적용할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-8 mb-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-3">
          ⚖️ 저작권 및 소유권
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Q. 만든 동화책의 저작권은 누구에게 있나요?
            </h3>
            <p className="text-gray-700 leading-relaxed pl-4 border-l-4 border-green-500">
              이용자가 작성한 이야기와 생성된 동화책의 저작권은 이용자에게
              귀속됩니다. 단, AI가 생성한 이미지의 경우 상업적 이용에 일부
              제한이 있을 수 있습니다.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Q. 만든 동화책을 판매할 수 있나요?
            </h3>
            <p className="text-gray-700 leading-relaxed pl-4 border-l-4 border-green-500">
              개인적인 용도로는 자유롭게 사용 가능합니다. 상업적 판매를 원하시는
              경우 별도의 상업용 라이선스를 구매하셔야 합니다.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Q. 다른 사람과 공유할 수 있나요?
            </h3>
            <p className="text-gray-700 leading-relaxed pl-4 border-l-4 border-green-500">
              네, 가족이나 친구들과 자유롭게 공유할 수 있습니다. 공개 설정을
              통해 다른 이용자들에게도 공개할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-8 mb-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-3">
          💳 계정 및 결제
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Q. 유료 플랜은 어떻게 구독하나요?
            </h3>
            <p className="text-gray-700 leading-relaxed pl-4 border-l-4 border-orange-500">
              마이페이지의 구독 관리 메뉴에서 플랜을 선택하고 결제하실 수
              있습니다. 신용카드, 계좌이체 등 다양한 결제 수단을 지원합니다.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Q. 구독을 취소하려면 어떻게 해야 하나요?
            </h3>
            <p className="text-gray-700 leading-relaxed pl-4 border-l-4 border-orange-500">
              마이페이지에서 언제든지 구독을 취소할 수 있습니다. 취소 후에도
              결제한 기간까지는 서비스를 이용하실 수 있습니다.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Q. 환불 정책은 어떻게 되나요?
            </h3>
            <p className="text-gray-700 leading-relaxed pl-4 border-l-4 border-orange-500">
              서비스 이용 후 7일 이내에는 전액 환불이 가능합니다. 그 이후에는
              이용 기간에 비례하여 부분 환불이 진행됩니다.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-8 mb-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-3">
          🔧 기술 지원
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Q. 어떤 브라우저를 지원하나요?
            </h3>
            <p className="text-gray-700 leading-relaxed pl-4 border-l-4 border-red-500">
              Chrome, Safari, Firefox, Edge 최신 버전을 지원합니다. 원활한
              이용을 위해 최신 버전의 브라우저 사용을 권장합니다.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Q. 모바일에서도 이용할 수 있나요?
            </h3>
            <p className="text-gray-700 leading-relaxed pl-4 border-l-4 border-red-500">
              네, 모바일 웹 브라우저에서도 이용 가능합니다. 현재 iOS 및 Android
              앱도 개발 중입니다.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Q. 동화책을 다운로드할 수 있나요?
            </h3>
            <p className="text-gray-700 leading-relaxed pl-4 border-l-4 border-red-500">
              완성된 동화책은 PDF 형식으로 다운로드할 수 있습니다. 고해상도
              인쇄용 파일도 제공됩니다.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">찾으시는 답변이 없으신가요?</h2>
        <p className="text-lg mb-6 opacity-90">
          언제든지 고객센터로 문의해 주세요. 빠르게 답변드리겠습니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="mailto:kjyook01@gmail.com"
            className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition-colors"
          >
            이메일 문의
          </Link>
          <Link
            href="/contact"
            className="inline-block bg-white bg-opacity-20 text-blue-600 font-semibold px-6 py-3 rounded-lg border-2 border-white hover:bg-opacity-30 transition-colors"
          >
            문의 게시판
          </Link>
        </div>
      </section>
    </main>
  );
}
