import AdBannersWrapper from '@/components/ad/ad-banners-wrapper';
import CreateBookButton from '@/components/book/create-book-button';

const BooksPage = () => {
  return (
    <main className="flex flex-col gap-8 p-8 md:p-12">
      <section className="flex flex-col items-start gap-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          동화책 세상 📚
        </h1>
        <p className="text-lg text-gray-600">
          나만의 동화책을 만들거나 다른 친구들의 멋진 이야기를 구경해보세요!
        </p>
        <CreateBookButton />
      </section>

      <div>
        <hr className="my-10" />
        <AdBannersWrapper />
      </div>

      <section className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-gray-800">
          📖 동화책 만드는 방법
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-4 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-4xl">1️⃣</div>
            <h3 className="text-xl font-bold text-gray-800">이야기 시작하기</h3>
            <p className="text-gray-600">
              위의 &apos;동화책 만들기&apos; 버튼을 눌러서 새로운 동화책을
              시작해보세요!
            </p>
          </div>

          <div className="flex flex-col gap-4 p-6 bg-green-50 rounded-lg border border-green-200">
            <div className="text-4xl">2️⃣</div>
            <h3 className="text-xl font-bold text-gray-800">내용 작성하기</h3>
            <p className="text-gray-600">
              주인공과 이야기를 입력하면 AI가 멋진 동화를 만들어줍니다.
            </p>
          </div>

          <div className="flex flex-col gap-4 p-6 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-4xl">3️⃣</div>
            <h3 className="text-xl font-bold text-gray-800">완성하고 공유하기</h3>
            <p className="text-gray-600">
              완성된 동화책을 저장하고 다른 친구들과 함께 나눠보세요!
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BooksPage;
