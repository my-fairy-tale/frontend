'use client';

import apiFetch from '@/lib/api';
import { ApiResponse, MyBooksData } from '@/types/api';
import { Fragment, useEffect } from 'react';
import BookThumbnail from './book-thumbnail';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';

// API 호출 함수: pageParam을 인자로 받도록 수정
const fetchMyBooks = async ({ pageParam = 0 }: { pageParam?: number }) => {
  const response = await apiFetch<ApiResponse<MyBooksData>>(
    `/api/v1/books/my?status=COMPLETED&page=${pageParam}&size=4`
  );
  if (!response?.data) {
    throw new Error('책 데이터를 불러올 수 없습니다.');
  }
  return response.data;
};

const MyBookList = () => {
  // const [books, setBooks] = useState<BookSummary[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const fetchMyBooks = async () => {
  //     try {
  //       // 내가 만든 책 목록을 요청하는 API
  //       const myBooksData = await apiFetch<ApiResponse<MyBooksData>>(
  //         '/api/v1/books/my?status=COMPLETED&page=0&size=20',
  //         {
  //           method: 'GET',
  //         }
  //       );
  //       if (myBooksData) {
  //         setBooks(myBooksData.data?.books || []);
  //       }
  //     } catch (error) {
  //       console.error('내가 만든 책 목록을 가져오는데 실패했습니다.', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchMyBooks();
  // }, []);

  // return (
  //   <section>
  //     <h2 className="text-xl font-semibold mb-4 text-gray-800">내가 만든 책</h2>
  //     {isLoading ? (
  //       <p>책 목록을 불러오는 중...</p>
  //     ) : books.length > 0 ? (
  //       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
  //         {books.map((book) => (
  //           <BookThumbnail
  //             key={book.id}
  //             id={book.id}
  //             thumbnailUrl={book.thumbnailUrl}
  //             title={book.title}
  //             isPublic={book.visibility}
  //           />
  //         ))}
  //       </div>
  //     ) : (
  //       <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
  //         <p className="text-gray-600">아직 만든 책이 없습니다.</p>
  //       </div>
  //     )}
  //   </section>
  // );

  // 1. useQuery를 useInfiniteQuery로 변경

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['myBooksInfinite'],
    queryFn: fetchMyBooks,
    initialPageParam: 0, // 첫 페이지는 0번
    getNextPageParam: (lastPage) => {
      // 마지막 페이지가 아니라면, 다음 페이지 번호는 현재 페이지 번호 + 1
      if (!lastPage.isLast) {
        return lastPage.currentPage + 1;
      }
      // 마지막 페이지라면 undefined를 반환하여 더 이상 페이지가 없음을 알림
      return undefined;
    },
  });

  const { ref, inView } = useInView({
    threshold: 0.5, // 요소가 50% 보이면 콜백 실행
  });

  useEffect(() => {
    // ref가 지정된 요소가 보이고, 다음 페이지가 있으며, 로딩 중이 아닐 때
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) return <p>책 목록을 불러오는 중...</p>;
  if (isError) return <p>오류가 발생했습니다: {error.message}</p>;

  const noBookExist =
    !data || data.pages.length === 0 || data.pages[0].books.length === 0;

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">내가 만든 책</h2>

      {!noBookExist ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {/* 3. 중첩 map을 사용하여 모든 페이지의 책들을 렌더링 */}
            {data.pages.map((page, i) => (
              <Fragment key={i}>
                {page.books.map((book) => (
                  <BookThumbnail
                    key={book.id}
                    id={book.id}
                    thumbnailUrl={book.thumbnailUrl}
                    title={book.title}
                    isPublic={book.visibility}
                    // onStatusChange={...}
                  />
                ))}
              </Fragment>
            ))}
          </div>

          {/* 4. '책 더보기' 버튼 */}
          <div
            ref={ref}
            className="h-10"
          />
          {isFetchingNextPage && (
            <p className="text-center">책을 더 불러오는 중...</p>
          )}
          {!hasNextPage && data.pages[0].books.length > 0 && (
            <p className="text-center text-gray-500">모든 책을 불러왔습니다.</p>
          )}
        </>
      ) : (
        <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
          <p className="text-gray-600">아직 만든 책이 없습니다.</p>
        </div>
      )}
    </section>
  );
};

export default MyBookList;
