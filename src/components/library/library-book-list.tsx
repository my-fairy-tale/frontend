'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { Fragment, useEffect } from 'react';
import LibraryBookCard from './library-book-card';
import { libraryBookOption } from './library-book-option';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

const LibraryBookList = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '100px',
  });
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'latest';

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(libraryBookOption(currentSort, session?.accessToken));

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const noBooks =
    !data || data.pages.length === 0 || data.pages[0].posts.length === 0;

  return (
    <section className="w-full flex flex-col">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {/* Loading Skeleton */}
        {isLoading &&
          [...Array(10)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse"
            >
              <div className="bg-gray-300 aspect-[3/4] rounded-lg mb-3"></div>
              <div className="bg-gray-300 h-4 rounded mb-2"></div>
              <div className="bg-gray-300 h-3 rounded w-2/3"></div>
            </div>
          ))}

        {/* Empty State */}
        {noBooks && (
          <div className="col-span-full text-center py-20">
            <p className="text-xl text-gray-600">
              아직 공유된 동화책이 없습니다.
            </p>
          </div>
        )}

        {/* Book List */}
        {!isLoading &&
          !noBooks &&
          data.pages.map((page, pageIndex) => (
            <Fragment key={pageIndex}>
              {page.posts.map((post) => (
                <LibraryBookCard
                  key={post.postId}
                  post={post}
                />
              ))}
            </Fragment>
          ))}
      </div>

      {/* 무한 스크롤 트리거 */}
      {!isLoading && !noBooks && (
        <div
          ref={ref}
          className="h-10 mt-8"
        />
      )}

      {/* Loading More */}
      {isFetchingNextPage && (
        <p className="text-center text-gray-600 mt-4">
          더 많은 동화책을 불러오는 중...
        </p>
      )}

      {/* All Loaded */}
      {!hasNextPage && !noBooks && data && data.pages[0].posts.length > 0 && (
        <p className="text-center text-gray-500 mt-4">
          모든 동화책을 불러왔습니다.
        </p>
      )}
    </section>
  );
};

export default LibraryBookList;
