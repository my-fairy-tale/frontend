import BookThumbnail from '@/components/book/book-thumbnail';
import Link from 'next/link';

// 예시 데이터: 실제로는 DB에서 동화책 목록을 가져와야 합니다.
const sampleBooks = [
  {
    id: '83d1db29-49d5-4400-86e3-89e0e313a2eb',
    title: '귀여운 고양이',
    thumbnailUrl:
      'https://childrens-book-files.s3.ap-northeast-2.amazonaws.com/books/83d1db29-49d5-4400-86e3-89e0e313a2eb/images/cover.png', // 실제 이미지 경로로 변경
    visibility: 'PUBLIC' as const,
  },
  {
    id: '95470e94-fa28-463f-8195-39cef43583d5',
    title: '용감한 토끼의 당근찾기 모험',
    thumbnailUrl:
      'https://childrens-book-files.s3.ap-northeast-2.amazonaws.com/books/95470e94-fa28-463f-8195-39cef43583d5/images/cover.png',
    visibility: 'PUBLIC' as const,
  },
  {
    id: 'c5b013df-2d92-47ab-9996-af4a719cd17a',
    title: '귀여운 강아지',
    thumbnailUrl:
      'https://childrens-book-files.s3.ap-northeast-2.amazonaws.com/books/95470e94-fa28-463f-8195-39cef43583d5/images/cover.png',
    visibility: 'PUBLIC' as const,
  },
];

const BooksPage = () => {
  return (
    <main className="p-8 md:p-12">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        동화책 세상 📚
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        나만의 동화책을 만들거나 다른 친구들의 멋진 이야기를 구경해보세요!
      </p>

      <div className="my-10">
        <Link
          href="/books/create"
          className="inline-block text-lg py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          + 새 동화책 만들러 가기
        </Link>
      </div>

      <hr className="my-12" />

      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          ✨ 완성된 동화책 구경하기
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {sampleBooks.map((book) => (
            <BookThumbnail
              key={book.id}
              id={book.id}
              thumbnailUrl={book.thumbnailUrl}
              title={book.title}
              isPublic={book.visibility}
              showStatusButtons={false} // 공개 페이지에서는 상태 버튼 숨김
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default BooksPage;
