'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { Fragment, useEffect } from 'react';
import LibraryBookCard from './library-book-card';
import { ApiResponse, LibraryBookListData } from '@/types/api';

interface LibraryBookListProps {
  currentSort: string;
}

// API 호출 함수 (백엔드에서 실제 데이터 가져올 때 사용)
const fetchLibraryBooks = async ({
  pageParam = 0,
  sort = 'latest',
}: {
  pageParam?: number;
  sort?: string;
}) => {
  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/library/posts?page=${pageParam}&size=5&sort=${sort}`;
  const response = await fetch(backendUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('책 데이터를 불러올 수 없습니다');
  }

  const data: ApiResponse<LibraryBookListData> = await response.json();
  if (!data.data) {
    throw new Error('책 데이터가 없습니다.');
  }
  return data.data;
};

const LibraryBookList = ({ currentSort }: LibraryBookListProps) => {
  const { ref, inView } = useInView({ threshold: 0.5 });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['library-books'],
      queryFn: async ({ pageParam = 0 }) => {
        return await fetchLibraryBooks({
          pageParam: pageParam,
          sort: currentSort,
        });
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        return !lastPage.isLast ? lastPage.currentPage + 1 : undefined;
      },
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse"
          >
            <div className="bg-gray-300 aspect-[3/4] rounded-lg mb-3"></div>
            <div className="bg-gray-300 h-4 rounded mb-2"></div>
            <div className="bg-gray-300 h-3 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const noBooks =
    !data || data.pages.length === 0 || data.pages[0].posts.length === 0;

  if (noBooks) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-600">아직 공유된 동화책이 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {data.pages.map((page, pageIndex) => (
          <Fragment key={pageIndex}>
            {page.posts.map((post, i) => (
              <LibraryBookCard
                key={i}
                post={post}
              />
            ))}
          </Fragment>
        ))}
      </div>

      {/* 무한 스크롤 트리거 */}
      <div
        ref={ref}
        className="h-10 mt-8"
      />

      {isFetchingNextPage && (
        <p className="text-center text-gray-600 mt-4">
          더 많은 동화책을 불러오는 중...
        </p>
      )}

      {!hasNextPage && data.pages[0].posts.length > 0 && (
        <p className="text-center text-gray-500 mt-4">
          모든 동화책을 불러왔습니다.
        </p>
      )}
    </>
  );
};

export default LibraryBookList;
