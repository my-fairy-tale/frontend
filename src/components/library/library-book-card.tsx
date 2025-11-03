'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaStar, FaHeart } from 'react-icons/fa';
import {
  ApiResponse,
  LibraryBookListData,
  LibraryBooksData,
  LikeData,
} from '@/types/api';
import { useSession } from 'next-auth/react';
import { getQueryClient } from '@/lib/get-query-client';
import { libraryDetailLikeOption } from './library-detail-like-option';
import { libraryDetailBookOption } from './library-detail-book-option';
import { libraryDetailReviewOption } from './library-detail-review-option';
import { InfiniteData, useMutation } from '@tanstack/react-query';
import { libraryBookOption } from './library-book-option';
import { useSearchParams } from 'next/navigation';
import ApiFetch from '@/lib/api';
import { memo, useCallback } from 'react';

interface LibraryBookCardProps {
  post: LibraryBooksData;
}

const LibraryBookCard = ({ post }: LibraryBookCardProps) => {
  const { data: session } = useSession();
  const queryClient = getQueryClient();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'latest';

  const { mutate: toggleLike } = useMutation({
    mutationFn: async () => {
      if (!session?.accessToken) {
        throw new Error('로그인이 필요합니다.');
      }

      const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/${post.postId}/likes`;
      const data = await ApiFetch<ApiResponse<LikeData>>(
        backendUrl,
        { method: 'POST' },
        session.accessToken
      );

      if (!data.data) {
        throw new Error('좋아요 데이터가 없습니다.');
      }

      return data.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: libraryBookOption(currentSort, session?.accessToken).queryKey,
      });
      const previousData = queryClient.getQueryData(
        libraryBookOption(currentSort, session?.accessToken).queryKey
      );
      queryClient.setQueryData<InfiniteData<LibraryBookListData>>(
        libraryBookOption(currentSort, session?.accessToken).queryKey,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              posts: page.posts.map((_post) =>
                _post.postId === post.postId
                  ? {
                      ..._post,
                      isLiked: !_post.isLiked,
                      likeCount: _post.isLiked
                        ? _post.likeCount - 1
                        : _post.likeCount + 1,
                    }
                  : _post
              ),
            })),
          };
        }
      );
      return { previousData };
    },
    onError: (err, _, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          libraryBookOption(currentSort, session?.accessToken).queryKey,
          context.previousData
        );
      }
      console.error('like mutation error', err);
      alert('좋아요 요청에 실패했습니다. 다시 시도해주세요.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: libraryBookOption(currentSort, session?.accessToken).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ['library-detail-book', post.postId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ['library-detail-like', post.postId.toString()],
      });
    },
  });

  const handleLikeClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!session?.accessToken) {
        alert('로그인이 필요합니다.');
        return;
      }

      toggleLike();
    },
    [session?.accessToken, toggleLike]
  );

  const handleMouseEnter = useCallback(() => {
    if (session?.accessToken) {
      queryClient.prefetchQuery(
        libraryDetailLikeOption(post.postId.toString(), session.accessToken)
      );
    }
    queryClient.prefetchInfiniteQuery(
      libraryDetailReviewOption(post.postId.toString())
    );
    queryClient.prefetchQuery(libraryDetailBookOption(post.postId.toString()));
  }, [session?.accessToken, post.postId, queryClient]);

  return (
    <Link
      href={`/library/${post.postId}`}
      className="group block"
      onMouseEnter={handleMouseEnter}
    >
      <div className="flex flex-col h-full">
        {/* 썸네일 */}
        <div className="relative aspect-[3/4] mb-3 overflow-hidden rounded-lg bg-gray-100 shadow-md group-hover:shadow-xl transition-shadow">
          <Image
            src={post.book.thumbnailUrl}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
          {/* 좋아요 아이콘 */}
          {post.isLiked !== null && (
            <button
              onClick={handleLikeClick}
              className="absolute top-2 right-2 z-10 cursor-pointer hover:scale-110 transition-transform"
              aria-label={post.isLiked ? '좋아요 취소' : '좋아요'}
            >
              {post.isLiked ? (
                <FaHeart className="w-5 h-5 text-red-500 drop-shadow-lg" />
              ) : (
                <FaHeart className="w-5 h-5 text-gray-500 opacity-70 drop-shadow-lg" />
              )}
            </button>
          )}
        </div>

        {/* 정보 */}
        <div className="flex-1 flex flex-col md:max-w-[188.36px]">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>

          <p className="text-xs text-gray-600 mb-2">by {post.authorName}</p>

          {/* 별점 */}
          <div className="flex items-center gap-1 mt-auto">
            <FaStar className="text-yellow-400 w-4 h-4" />
            <span className="text-sm font-semibold text-gray-900">
              {post.averageRating ? post.averageRating.toFixed(1) : '0.0'}
            </span>
            <span className="text-xs text-gray-500">({post.reviewCount})</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default memo(LibraryBookCard);
