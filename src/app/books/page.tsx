import Link from 'next/link';

// 예시 데이터: 실제로는 DB에서 동화책 목록을 가져와야 합니다.
const sampleBooks = [
  { id: '1', title: '아기 돼지 삼형제' },
  { id: '2', title: '헨젤과 그레텔' },
  { id: 'the-little-prince', title: '어린 왕자' },
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

      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        ✨ 완성된 동화책 구경하기
      </h2>
      <ul className="space-y-4">
        {sampleBooks.map((book) => (
          <li key={book.id}>
            <Link
              href={`/books/${book.id}`}
              className="text-xl text-blue-500 hover:text-blue-700 hover:underline"
            >
              {book.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default BooksPage;
