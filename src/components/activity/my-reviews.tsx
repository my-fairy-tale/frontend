'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { FaStar, FaBook, FaChevronDown } from 'react-icons/fa';
import { myReviewsOption } from './my-reviews-option';
import Link from 'next/link';
import { getQueryClient } from '@/lib/get-query-client';
import { libraryDetailBookOption } from '@/components/library/library-detail-book-option';
import { formatRelativeTime } from '@/lib/date-utils';
import { libraryDetailReviewOption } from '../library/library-detail-review-option';
import { libraryDetailLikeOption } from '../library/library-detail-like-option';

// Section Wrapper 컴포넌트
const SectionWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <FaStar className="text-yellow-400" />
          내가 쓴 리뷰
        </h2>
        <span className="text-sm text-gray-500">전체 보기</span>
      </div>
      {children}
    </section>
  );
};

export default function MyReviews() {
  const queryClient = getQueryClient();
  const { data: session } = useSession();
  const {
    data: myReviewsList,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    isFetchingNextPage,
  } = useInfiniteQuery(myReviewsOption(session?.accessToken));

  const handleMouseEnter = (postId: number) => {
    queryClient.prefetchQuery(libraryDetailBookOption(postId.toString()));
    queryClient.prefetchInfiniteQuery(
      libraryDetailReviewOption(postId.toString())
    );
    queryClient.prefetchQuery(
      libraryDetailLikeOption(postId.toString(), session?.accessToken)
    );
  };

  // Loading 상태
  if (isLoading) {
    return (
      <SectionWrapper>
        <div className="w-full bg-gray-50 rounded-lg p-12 text-center opacity-60 animate-pulse">
          <FaStar className="mx-auto text-gray-300 text-5xl mb-4" />
          <p className="text-gray-500 text-lg">불러오는 중...</p>
        </div>
      </SectionWrapper>
    );
  }

  // Error 상태
  if (isError) {
    return (
      <SectionWrapper>
        <div className="bg-red-50 rounded-lg p-12 text-center">
          <p className="text-red-500 text-lg">
            {error instanceof Error
              ? error.message
              : '데이터를 불러올 수 없습니다'}
          </p>
        </div>
      </SectionWrapper>
    );
  }

  const reviews = myReviewsList?.pages.flatMap((page) => page.content) || [];

  // Empty 상태
  if (reviews.length === 0) {
    return (
      <SectionWrapper>
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <FaStar className="mx-auto text-gray-300 text-5xl mb-4" />
          <p className="text-gray-500 text-lg">아직 작성한 리뷰가 없습니다</p>
          <p className="text-gray-400 text-sm mt-2">
            읽은 책에 대한 리뷰를 남겨보세요
          </p>
        </div>
      </SectionWrapper>
    );
  }

  // Data 렌더링
  return (
    <SectionWrapper>
      <div className="space-y-4 w-full">
        {reviews.map((review) => (
          <Link
            key={review.reviewId}
            href={`/library/${review.postId}`}
            onMouseEnter={() => handleMouseEnter(review.postId)}
            className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow border border-gray-100 block"
          >
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 w-16 h-20 rounded flex-shrink-0 flex items-center justify-center">
                <FaBook className="text-blue-400 text-2xl" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-800">
                    {review.bookTitle}
                  </h3>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, starIdx) => (
                      <FaStar
                        key={starIdx}
                        className={`text-sm ${
                          starIdx < review.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                  {review.comment}
                </p>
                <span className="text-xs text-gray-500">
                  {formatRelativeTime(review.createdAt)} 작성
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {hasNextPage && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFetchingNextPage ? '로딩 중...' : '더 보기'}
            {!isFetchingNextPage && <FaChevronDown className="text-sm" />}
          </button>
        </div>
      )}
    </SectionWrapper>
  );
}
