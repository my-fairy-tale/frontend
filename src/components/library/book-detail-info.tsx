'use client';

import Image from 'next/image';
import { FaStar, FaHeart, FaRegHeart, FaShare, FaTrash } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getQueryClient } from '@/lib/get-query-client';
import { libraryDetailBookOption } from './library-detail-book-option';
import { libraryDetailLikeOption } from '@/components/library/library-detail-like-option';
import { bookDetailOption } from '../book/book-detail-option';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { ApiResponse, LikeData } from '@/types/api';
import useUserStore from '@/store/use-user-store';
import useModalStore from '@/store/use-modal-store';
import { useRouter } from 'next/navigation';
import DeletePostModal from '@/components/ui/modal/delete-post-modal';

interface BookDetailInfoProps {
  slug: string;
}

export default function BookDetailInfo({ slug }: BookDetailInfoProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = getQueryClient();
  const { data: session } = useSession();
  const { user } = useUserStore();
  const { openModal, closeModal } = useModalStore();
  const router = useRouter();

  const {
    data: postData,
    isLoading,
    isError,
    error,
  } = useQuery(libraryDetailBookOption(slug));

  const { data: likeData } = useQuery(
    libraryDetailLikeOption(slug, session?.accessToken)
  );

  const { mutate: updateLikeStatus } = useMutation({
    mutationFn: async ({ postId }: { postId: string }) => {
      try {
        if (!session?.accessToken) {
          throw new Error('인증 정보가 없습니다.');
        }
        const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/${postId}/likes`;
        const response = await fetch(backendUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('좋아요 상태를 업데이트할 수 없습니다.');
        }

        const data: ApiResponse<LikeData> = await response.json();
        if (data.code !== 'LIKE_2001') {
          throw new Error(data?.message || '좋아요 상태 업데이트 실패');
        }

        return data.data;
      } catch (err) {
        console.log('api call failed in parent', err);
        throw err;
      }
    },
    onMutate: async (variables) => {
      const { postId } = variables;
      await queryClient.cancelQueries({
        queryKey: ['library-detail-like', postId],
      });
      const previousData = queryClient.getQueryData<LikeData>([
        'library-detail-like',
        postId,
      ]);
      queryClient.setQueryData<LikeData>(
        ['library-detail-like', postId],
        (oldData) => {
          if (!oldData) return oldData;
          if (oldData.isLiked) {
            return {
              ...oldData,
              isLiked: false,
              likeCount: oldData.likeCount - 1,
            };
          }
          return {
            ...oldData,
            isLiked: true,
            likeCount: oldData.likeCount + 1,
          };
        }
      );
      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ['library-detail-like', variables.postId],
          context.previousData
        );
      }
      console.error('좋아요 상태 업데이트 실패:', err);
      alert('좋아요 상태 업데이트에 실패했습니다. 다시 시도해주세요.');
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['library-detail-like', variables.postId],
      });
      queryClient.invalidateQueries({
        queryKey: ['library-detail-book', variables.postId],
      });
    },
  });

  useEffect(() => {
    if (likeData) {
      setIsLiked(likeData.isLiked);
    }
  }, [likeData]);

  if (isLoading) return <p>책을 불러오는 중 입니다...</p>;
  if (isError) return <p>책을 불러오는데 실패했습니다: {String(error)}</p>;
  if (!postData) return <p>책을 찾을 수 없습니다.</p>;

  const handleMouseEnter = () => {
    queryClient.prefetchQuery(bookDetailOption(slug));
  };

  const handleLike = async () => {
    if (!session?.accessToken) {
      alert('좋아요를 하려면 로그인이 필요합니다.');
      return;
    }
    updateLikeStatus({ postId: slug });
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    // TODO: 공유 기능 구현
    if (navigator.share) {
      navigator.share({
        title: postData.title,
        text: `${postData.title} - ${postData.authorName}`,
        url: window.location.href,
      });
    } else {
      // 폴백: URL 복사
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 복사되었습니다!');
    }
  };

  const handleDeleteClick = () => {
    openModal(
      <DeletePostModal
        title={postData.book.originalTitle}
        onConfirm={handleDeleteConfirm}
        onCancel={closeModal}
      />,
      { size: 'sm' }
    );
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);

      if (!session?.accessToken) {
        throw new Error('인증 정보가 없습니다.');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/${slug}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('게시글 삭제에 실패했습니다.');
      }

      closeModal();
      alert('게시글이 삭제되었습니다.');
      router.push('/library');
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      alert('게시글 삭제에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsDeleting(false);
    }
  };

  const isAuthor = user && postData && user.id === postData.authorId;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* 왼쪽: 책 표지 */}
        <div className="w-full md:w-1/4 flex-shrink-0">
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-xl">
            <Image
              src={postData.book.thumbnailUrl}
              alt={postData.book.originalTitle}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* 읽기 버튼 */}
          <Link
            href={`/books/${postData.book.bookId}`}
            onMouseEnter={handleMouseEnter}
            className="mt-4 w-full block text-center bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            동화책 읽기 📖
          </Link>
        </div>

        {/* 오른쪽: 책 정보 */}
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {postData.book.originalTitle}
          </h1>

          <div className="text-lg text-blue-600 hover:text-blue-800 mb-4 inline-block">
            by {postData.authorName}
          </div>

          {/* 별점 및 통계 */}
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <FaStar className="text-yellow-400 w-6 h-6" />
              <span className="text-2xl font-bold text-gray-900">
                {postData.averageRating
                  ? postData.averageRating.toFixed(1)
                  : '0'}
              </span>
              <span className="text-gray-600">
                ({postData.reviewCount} 리뷰)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <FaHeart className="text-red-400 w-5 h-5" />
              <span className="text-gray-700">{postData.likeCount}</span>
            </div>
          </div>

          {/* 책 설명 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">줄거리</h2>
            <p className="text-gray-700 leading-relaxed">{postData.content}</p>
          </div>

          {/* 추가 정보 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">페이지:</span>
                <span className="ml-2 font-semibold text-gray-900">
                  {postData.book.totalPages}쪽
                </span>
              </div>
              <div>
                <span className="text-gray-600">게시일:</span>
                <span className="ml-2 font-semibold text-gray-900">
                  {new Date(postData.createdAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={handleLike}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-colors ${
                isLiked
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isLiked ? <FaHeart /> : <FaRegHeart />}
              좋아요
            </button>

            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              <FaShare />
              공유하기
            </button>

            {isAuthor && (
              <button
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaTrash />
                삭제
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
