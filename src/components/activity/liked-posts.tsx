'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { FaHeart, FaStar, FaChevronDown } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { getQueryClient } from '@/lib/get-query-client';
import { libraryDetailBookOption } from '@/components/library/library-detail-book-option';
import { formatRelativeTime } from '@/lib/date-utils';
import { libraryDetailLikeOption } from '../library/library-detail-like-option';
import { libraryDetailReviewOption } from '../library/library-detail-review-option';
import { likedPostsOption } from './liked-posts-option';

// Section Wrapper 컴포넌트
const SectionWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <FaHeart className="text-red-500" />
          좋아요한 게시물
        </h2>
        <span className="text-sm text-gray-500">전체 보기</span>
      </div>
      {children}
    </section>
  );
};

const LikedPosts = () => {
  const queryClient = getQueryClient();
  const { data: session } = useSession();
  const {
    data: likesList,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    isFetchingNextPage,
  } = useInfiniteQuery(likedPostsOption(session?.accessToken));

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
          <FaHeart className="mx-auto text-gray-300 text-5xl mb-4" />
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

  const likes = likesList?.pages.flatMap((page) => page.likes) || [];

  // Empty 상태
  if (likes.length === 0) {
    return (
      <SectionWrapper>
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <FaHeart className="mx-auto text-gray-300 text-5xl mb-4" />
          <p className="text-gray-500 text-lg">
            아직 좋아요한 게시물이 없습니다
          </p>
          <p className="text-gray-400 text-sm mt-2">
            마음에 드는 게시물을 좋아요 해보세요
          </p>
        </div>
      </SectionWrapper>
    );
  }

  // Data 렌더링
  return (
    <SectionWrapper>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {likes.map((like) => (
          <Link
            key={like.likeId}
            href={`/library/${like.postId}`}
            onMouseEnter={() => handleMouseEnter(like.postId)}
            className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow border border-gray-100"
          >
            <div className="flex gap-4">
              <div className="relative w-24 h-32 rounded-lg flex-shrink-0 overflow-hidden bg-gray-100">
                <Image
                  src={like.thumbnailUrl}
                  alt={like.postTitle}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                  {like.postTitle}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <FaStar className="text-yellow-400 text-sm" />
                  <span className="text-sm text-gray-700">
                    {like.post.averageRating
                      ? like.post.averageRating.toFixed(1)
                      : '0.0'}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({like.post.reviewCount})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{like.post.authorName}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(like.likedAt)}</span>
                </div>
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
};

export default LikedPosts;
