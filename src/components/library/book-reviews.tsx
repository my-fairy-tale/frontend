// components/community/book-reviews.tsx
'use client';

import { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { ReviewData, ReviewListData } from '@/types/api';
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { libraryDetailReviewOption } from './library-detail-review-option';

interface BookReviewsProps {
  slug: string;
}

export default function BookReviews({ slug }: BookReviewsProps) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const [isWriting, setIsWriting] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const {
    data: reviews,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    isFetchingNextPage,
  } = useInfiniteQuery(libraryDetailReviewOption(slug));

  const { mutate: submitReview } = useMutation({
    mutationFn: async ({
      rating,
      comment,
      isAnonymous,
    }: {
      rating: number;
      comment: string;
      isAnonymous: boolean;
    }) => {
      const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/reviews`;
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          rating,
          comment,
          isAnonymous,
        }),
      });

      if (!response.ok) {
        throw new Error('리뷰 등록에 실패했습니다.');
      }

      const data = await response.json();
      if (data.code !== 'REVIEW_2001') {
        throw new Error(data?.message || '리뷰 등록에 실패했습니다.');
      }

      return data;
    },
    onMutate: (variables) => {
      queryClient.cancelQueries({ queryKey: ['library-detail-review', slug] });
      const previousData = queryClient.getQueryData<
        InfiniteData<ReviewListData>
      >(['library-detail-review', slug]);

      queryClient.setQueryData<InfiniteData<ReviewListData>>(
        ['library-detail-review', slug],
        (oldData) => {
          if (!oldData) return oldData;

          const newReview: ReviewData = {
            reviewId: 100000,
            rating: variables.rating,
            comment: variables.comment,
            authorName: '나',
            isAnonymous: variables.isAnonymous,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isMine: true,
          };

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              reviews: [newReview, ...page.reviews],
            })),
          };
        }
      );

      return { previousData };
    },
    onSuccess: (data, variables) => {
      alert('리뷰가 성공적으로 등록되었습니다!');
      setNewComment('');
      setNewRating(5);
      setIsWriting(false);
    },
    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ['library-detail-review', slug],
          context.previousData
        );
      }

      console.error('리뷰 등록 실패:', error);
      alert('리뷰 등록에 실패했습니다. 다시 시도해주세요.');
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['library-detail-review', slug],
      });
    },
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      alert('로그인이 필요합니다.');
      return;
    }

    submitReview({
      rating: newRating,
      comment: newComment,
      isAnonymous: false,
    });
  };

  if (isLoading) return <p>리뷰 목록을 불러오는 중...</p>;
  if (isError) return <p>오류가 발생했습니다: {error.message}</p>;

  const allReviews = reviews?.pages.flatMap((page) => page.reviews) || [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          리뷰 ({allReviews.length})
        </h2>

        {!isWriting && session && (
          <button
            onClick={() => setIsWriting(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            리뷰 작성
          </button>
        )}
      </div>

      {/* 리뷰 작성 폼 */}
      {isWriting && (
        <form
          onSubmit={handleSubmitReview}
          className="mb-8 p-6 bg-gray-50 rounded-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            리뷰 작성하기
          </h3>

          {/* 별점 선택 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              별점
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="text-3xl transition-colors"
                >
                  {star <= (hoveredRating || newRating) ? (
                    <FaStar className="text-yellow-400" />
                  ) : (
                    <FaRegStar className="text-gray-300" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 코멘트 입력 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              코멘트
            </label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="이 동화책에 대한 생각을 자유롭게 작성해주세요..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
              required
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              등록하기
            </button>
            <button
              type="button"
              onClick={() => {
                setIsWriting(false);
                setNewComment('');
                setNewRating(5);
              }}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              취소
            </button>
          </div>
        </form>
      )}

      {/* 로그인 안내 */}
      {!session && !isWriting && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-blue-800">
            리뷰를 작성하려면{' '}
            <a
              href="/auth/login"
              className="font-semibold underline"
            >
              로그인
            </a>
            이 필요합니다.
          </p>
        </div>
      )}

      {/* 리뷰 목록 */}
      <div className="space-y-4">
        {allReviews.length === 0 ? (
          <p className="text-center text-gray-600 py-8">
            아직 작성된 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!
          </p>
        ) : (
          allReviews.map((review) => (
            <div
              key={review.reviewId}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">
                    {review.authorName}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
