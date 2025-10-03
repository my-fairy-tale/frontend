export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto p-6 md:p-8 my-8 bg-white rounded-lg shadow-md">
      <section className="bg-white rounded-lg shadow-md p-8 md:p-12 mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          나의 동화책
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          AI가 만들어주는 세상에 단 하나뿐인 나만의 이야기
        </p>
        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
          단 몇 줄의 이야기만으로 아름다운 그림 동화책을 만들 수 있습니다.
          최첨단 AI 기술이 당신의 상상력에 생명을 불어넣어 드립니다.
        </p>
      </section>

      <section className="bg-white rounded-lg shadow-md p-8 md:p-12 mb-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
          왜 나의 동화책인가요?
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="border-l-4 border-blue-500 pl-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              🎨 AI 기반 그림 생성
            </h3>
            <p className="text-gray-700 leading-relaxed">
              최신 AI 기술을 활용하여 당신의 이야기에 꼭 맞는 아름다운 삽화를
              자동으로 생성합니다. 전문 일러스트레이터가 그린 것 같은 퀄리티의
              그림을 단 몇 초 만에 만날 수 있습니다.
            </p>
          </div>

          <div className="border-l-4 border-purple-500 pl-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              ✍️ 간편한 스토리 작성
            </h3>
            <p className="text-gray-700 leading-relaxed">
              복잡한 글쓰기 기술이 필요 없습니다. 머릿속에 떠오르는 이야기를
              자유롭게 적기만 하면, AI가 그에 맞는 동화책을 완성해줍니다.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              🎧 AI 음성 낭독
            </h3>
            <p className="text-gray-700 leading-relaxed">
              완성된 동화책을 생생한 AI 음성으로 들을 수 있습니다. 아이들에게
              읽어주거나, 편안하게 누워서 이야기를 즐길 수 있습니다.
            </p>
          </div>

          <div className="border-l-4 border-orange-500 pl-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              💾 평생 보관 및 공유
            </h3>
            <p className="text-gray-700 leading-relaxed">
              만든 동화책은 클라우드에 안전하게 보관됩니다. 가족, 친구들과 쉽게
              공유하고, 언제 어디서나 다시 볼 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-8 md:p-12 mb-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
          이렇게 사용하세요
        </h2>

        <div className="space-y-6">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                회원가입 및 로그인
              </h3>
              <p className="text-gray-700 leading-relaxed">
                간단한 이메일 인증만으로 가입할 수 있습니다. 소셜 로그인도
                지원합니다.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                이야기 작성하기
              </h3>
              <p className="text-gray-700 leading-relaxed">
                동화책에 담고 싶은 이야기를 자유롭게 작성합니다. 짧게는 한
                문장부터, 길게는 여러 페이지까지 가능합니다.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                AI가 그림 생성
              </h3>
              <p className="text-gray-700 leading-relaxed">
                작성한 이야기를 바탕으로 AI가 각 장면에 어울리는 그림을 자동으로
                생성합니다. 원하는 스타일을 선택할 수도 있습니다.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
              4
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                완성 및 공유
              </h3>
              <p className="text-gray-700 leading-relaxed">
                완성된 동화책을 감상하고, 원하는 사람들과 공유하세요. 음성 낭독
                기능으로 들을 수도 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-8 md:p-12 mb-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
          이런 분들께 추천합니다
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              부모님과 아이들
            </h3>
            <p className="text-gray-700">
              아이와 함께 상상한 이야기를 동화책으로 만들어 특별한 추억을
              남기세요.
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              창작을 꿈꾸는 분들
            </h3>
            <p className="text-gray-700">
              그림 실력이 없어도 괜찮습니다. AI가 당신의 이야기를 멋진
              그림책으로 만들어줍니다.
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🎁</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              특별한 선물을 원하는 분들
            </h3>
            <p className="text-gray-700">
              사랑하는 사람에게 세상에 단 하나뿐인 맞춤 동화책을 선물하세요.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 md:p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          지금 바로 당신만의 동화책을 만들어보세요
        </h2>
        <p className="text-lg mb-6 opacity-90">
          무료로 시작할 수 있습니다. 신용카드 정보가 필요 없습니다.
        </p>
        <a
          href="/auth/signup"
          className="inline-block bg-white text-blue-600 font-bold text-lg px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        >
          무료로 시작하기
        </a>
      </section>
    </main>
  );
}
