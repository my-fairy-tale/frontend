'use client';

import { getQueryClient } from '@/lib/get-query-client';
import { ApiResponse, BookData } from '@/types/api';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

interface BookThumbnailProps {
  id: string;
  thumbnailUrl: string;
  title: string;
  isPublic: 'PUBLIC' | 'PRIVATE';
  onStatusChange?: (bookId: string, newStatus: 'PUBLIC' | 'PRIVATE') => void;
  onDelete?: (bookId: string) => void;
  showStatusButtons?: boolean;
}

const BookThumbnail = ({
  id,
  thumbnailUrl,
  title,
  isPublic: initialIsPublic,
  onStatusChange = (bookID, stauts) => {},
  onDelete,
  showStatusButtons = true,
}: BookThumbnailProps) => {
  const queryClient = getQueryClient();
  const { data: session } = useSession();

  const [isPublic, setIsPublic] = useState(initialIsPublic === 'PUBLIC');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleMouseEnter = () => {
    if (session?.accessToken) {
      queryClient.prefetchQuery({
        queryKey: ['book-detail', id],
        queryFn: async () => {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/books/${id}`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.accessToken}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error('Failed to fetch book');
          }

          const data: ApiResponse<BookData> = await response.json();
          if (data?.code === 'BOOK_2002' && data.data) {
            return data.data;
          }
          throw new Error(data?.message || '책을 찾을 수 없습니다.');
        },
        staleTime: 5 * 60 * 1000,
      });
    }
  };

  const handleToggleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);
    const newStatusBoolean = !isPublic;
    const newStatusString = newStatusBoolean ? 'PUBLIC' : 'PRIVATE';

    setIsPublic(newStatusBoolean);

    try {
      onStatusChange(id, newStatusString);
    } catch (error) {
      console.error('상태 변경 실패:', error);
      setIsPublic(!newStatusBoolean);
      alert('상태 변경에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!onDelete) return;

    setIsLoading(true);
    try {
      await onDelete(id);
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('책 삭제에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };
  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
      <Link
        className="block"
        onMouseEnter={handleMouseEnter}
        href={`/books/${id}`}
      >
        <div className="relative">
          <img
            src={thumbnailUrl || '/book_placeholder.jpg'}
            alt={title}
            className="w-full h-48 object-cover"
          />
          {/* 공개/비공개 상태 뱃지 */}
          <span
            className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold text-white rounded-full ${
              isPublic ? 'bg-blue-500' : 'bg-gray-500'
            }`}
          >
            {isPublic ? '공개' : '비공개'}
          </span>

          {/* 삭제 버튼 */}
          {showStatusButtons && (
            <button
              type="button"
              onClick={handleDeleteClick}
              disabled={isLoading}
              className="absolute top-2 left-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50 shadow-md"
              aria-label="책 삭제"
            >
              <FaTrash className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* 정보 및 토글 영역 */}
        <div className="p-4 flex-grow flex flex-col justify-between">
          <h3 className="font-bold text-gray-800 truncate mb-2">{title}</h3>

          {/* 토글 스위치 UI */}
          {showStatusButtons && (
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-600 select-none">
                공개 설정
              </span>
              <button
                type="button"
                onClick={handleToggleClick}
                disabled={isLoading}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 ${
                  isPublic ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
                    isPublic ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          )}
        </div>
      </Link>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-lg"
          //onClick={handleCancelDelete}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-4"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              책 삭제 확인
            </h3>
            <p className="text-gray-700 mb-6">
              &quot;{title}&quot;을(를) 삭제하시겠습니까?
              <br />이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isLoading}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 font-semibold"
              >
                {isLoading ? '삭제 중...' : '삭제'}
              </button>
              <button
                type="button"
                onClick={handleCancelDelete}
                disabled={isLoading}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 font-semibold"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookThumbnail;
