'use client';

import { ApiResponse, BookStatus, MyBooksData } from '@/types/api';
import { Fragment, useEffect, useState } from 'react';
import BookThumbnail from './book-thumbnail';
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useSession } from 'next-auth/react';
import { myBookOption } from './my-book-option';

const MyBookList = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [currentSort, setCurrentSort] = useState('latest');

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    isFetchingNextPage,
  } = useInfiniteQuery({
    ...myBookOption(session?.accessToken, currentSort),
    refetchInterval: (query) => {
      // 현재 데이터에서 PROCESSING 상태의 책이 있는지 확인
      const hasProcessing = query.state.data?.pages.some((page) =>
        page.books.some((book) => book.status === BookStatus.PROCESSING)
      );
      return hasProcessing ? 10000 : false;
    },
  });

  const { ref, inView } = useInView({
    threshold: 0.5, // 요소가 50% 보이면 콜백 실행
  });

  useEffect(() => {
    // ref가 지정된 요소가 보이고, 다음 페이지가 있으며, 로딩 중이 아닐 때
    if (inView && hasNextPage && !isFetchingNextPage) {
      if (session?.accessToken) {
        fetchNextPage();
      } else {
        console.log('session is Loading');
      }
    }
  }, [
    inView,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    session?.accessToken,
  ]);

  const handleStatusChange = async (
    bookId: string,
    newStatus: 'PUBLIC' | 'PRIVATE'
  ) => {
    updateBookVisibility({ bookId, newStatus });
  };

  const { mutate: deleteBook } = useMutation({
    mutationFn: async ({ bookId }: { bookId: string }) => {
      try {
        if (!session?.accessToken) {
          throw new Error('인증 정보가 없습니다.');
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/books/${bookId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to delete book');
        }

        const data: ApiResponse<null> = await response.json();
        if (data.code !== 'BOOK_2005') {
          throw new Error(data.message || '책 삭제에 실패했습니다.');
        }
        return bookId;
      } catch (err) {
        console.log('api call failed in parent', err);
        throw err;
      }
    },
    onSuccess: (bookId) => {
      // Remove the deleted book from the cache
      queryClient.setQueryData<InfiniteData<MyBooksData>>(
        ['myBooksInfinite'],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              books: page.books.filter((book) => book.id !== bookId),
            })),
          };
        }
      );
    },
    onError: (error) => {
      console.error('책 삭제 실패:', error);
      alert('책 삭제에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const { mutate: updateBookVisibility } = useMutation({
    mutationFn: async ({
      bookId,
      newStatus,
    }: {
      bookId: string;
      newStatus: 'PUBLIC' | 'PRIVATE';
    }) => {
      try {
        if (!session?.accessToken) {
          throw new Error('인증 정보가 없습니다.');
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/books/${bookId}/visibility`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify({ visibility: newStatus }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch my books');
        }

        const data: ApiResponse<null> = await response.json();
        if (data.code !== 'BOOK_2006') {
          throw new Error('not my books');
        }
        return data.data;
      } catch (err) {
        console.log('api call failed in parent', err);
        throw err;
      }
    },

    onSuccess: (data, variables) => {
      const { bookId, newStatus } = variables;
      // 쿼리 캐시를 직접 업데이트하여 UI에 즉시 반영
      queryClient.setQueryData<InfiniteData<MyBooksData>>(
        ['myBooksInfinite'],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              books: page.books.map((book) =>
                book.id === bookId ? { ...book, visibility: newStatus } : book
              ),
            })),
          };
        }
      );
    },
    onError: (error) => {
      console.error('상태 변경 실패:', error);
      alert('상태 변경에 실패했습니다. 다시 시도해주세요.');
    },
  });

  if (isLoading) return <p>책 목록을 불러오는 중...</p>;
  if (isError) return <p>오류가 발생했습니다: {error.message}</p>;

  const noBookExist =
    !data || data.pages.length === 0 || data.pages[0].books.length === 0;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">내가 만든 책</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentSort('latest')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              currentSort === 'latest'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => setCurrentSort('oldest')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              currentSort === 'oldest'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            오래된순
          </button>
        </div>
      </div>

      {!noBookExist ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {data.pages.map((page, i) => (
              <Fragment key={i}>
                {page.books.map((book) => (
                  <BookThumbnail
                    key={book.id}
                    id={book.id}
                    thumbnailUrl={book.thumbnailUrl}
                    title={book.title}
                    isPublic={book.visibility}
                    status={book.status}
                    onDelete={() => deleteBook({ bookId: book.id })}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </Fragment>
            ))}
          </div>

          <div
            ref={ref}
            className="h-10"
          />
          {!session?.accessToken && (
            <p className="text-center">잠시만 기다려주세요...!</p>
          )}
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
