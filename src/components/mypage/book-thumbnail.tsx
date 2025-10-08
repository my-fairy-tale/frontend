'use client';

import { getQueryClient } from '@/lib/get-query-client';
import { ApiResponse, BookData } from '@/types/api';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import useModalStore from '@/store/use-modal-store';
import MyBookDeleteModal from '@/components/ui/modal/mybook-delete-modal';
import Image from 'next/image';

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
  onStatusChange = () => {},
  onDelete,
  showStatusButtons = true,
}: BookThumbnailProps) => {
  const queryClient = getQueryClient();
  const { data: session } = useSession();
  const { openModal, closeModal } = useModalStore();

  const [isPublic, setIsPublic] = useState(initialIsPublic === 'PUBLIC');
  const [isLoading, setIsLoading] = useState(false);

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

    openModal(
      <MyBookDeleteModal
        title={title}
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
      />,
      { size: 'sm' }
    );
  };

  const handleConfirmDelete = async () => {
    if (!onDelete) return;

    setIsLoading(true);
    try {
      await onDelete(id);
      closeModal();
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('책 삭제에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
      <Link
        className="block"
        onMouseEnter={handleMouseEnter}
        href={`/books/${id}`}
      >
        <div className="relative h-48">
          <Image
            src={thumbnailUrl || '/book_placeholder.jpg'}
            alt={title}
            fill
            className="object-cover"
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
    </div>
  );
};

export default BookThumbnail;
