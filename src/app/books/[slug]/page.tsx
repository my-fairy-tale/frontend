import BookDisplay from '@/components/book/book-display';
import apiFetch from '@/lib/api';
import { ApiResponse, BookData } from '@/types/api';

async function getBookData(slug: string): Promise<BookData | null> {
  const response = await apiFetch<ApiResponse<BookData>>(
    `/api/v1/books/${slug}`,
    {
      method: 'GET',
    }
  );

  if (response) {
    if (response.code === 'BOOK_2002') {
      return response.data;
    } else {
      Error(response.message);
      return null;
    }
  } else {
    Error('오류가 발생했습니다. 다시 시도해주세요.');
    return null;
  }
}
// -----------------------------------------------------------------

// 서버 컴포넌트: 데이터 페칭 담당
export default async function BookViewerPage({
  params,
}: {
  params: { slug: string };
}) {
  const bookData = await getBookData(params.slug);

  if (!bookData) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl text-gray-500 text-center">
          해당 동화책을 찾을 수 없어요. 😢
        </div>
      </main>
    );
  }

  return <BookDisplay bookData={bookData} />;
}
