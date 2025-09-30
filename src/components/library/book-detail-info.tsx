// components/community/book-detail-info.tsx
'use client';

import Image from 'next/image';
import { FaStar, FaHeart, FaRegHeart, FaShare } from 'react-icons/fa';
import { useState } from 'react';
import Link from 'next/link';

interface BookDetailInfoProps {
  bookId: string;
}

export default function BookDetailInfo({ bookId }: BookDetailInfoProps) {
  const [isLiked, setIsLiked] = useState(false);

  // TODO: 실제 데이터 가져오기
  const book = {
    id: bookId,
    title: '멋진 동화책 제목',
    thumbnailUrl: `https://picsum.photos/seed/${bookId}/400/600`,
    authorName: '작가 이름',
    authorId: 'author-123',
    description:
      '이것은 정말 재미있는 동화책입니다. 아이들이 좋아할만한 내용으로 가득 차 있어요. 상상력을 자극하는 이야기와 아름다운 그림들이 조화를 이루고 있습니다.',
    averageRating: 4.5,
    reviewCount: 42,
    likeCount: 128,
    createdAt: '2025-01-15',
    pageCount: 12,
  };

  const handleLike = async () => {
    // TODO: 좋아요 API 호출
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    // TODO: 공유 기능 구현
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `${book.title} - ${book.authorName}`,
        url: window.location.href,
      });
    } else {
      // 폴백: URL 복사
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 복사되었습니다!');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* 왼쪽: 책 표지 */}
        <div className="w-full md:w-1/3 flex-shrink-0">
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-xl">
            <Image
              src={book.thumbnailUrl}
              alt={book.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* 읽기 버튼 */}
          <Link
            href={`/books/${bookId}`}
            className="mt-4 w-full block text-center bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            동화책 읽기 📖
          </Link>
        </div>

        {/* 오른쪽: 책 정보 */}
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {book.title}
          </h1>

          <Link
            href={`/profile/${book.authorId}`}
            className="text-lg text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            by {book.authorName}
          </Link>

          {/* 별점 및 통계 */}
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <FaStar className="text-yellow-400 w-6 h-6" />
              <span className="text-2xl font-bold text-gray-900">
                {book.averageRating.toFixed(1)}
              </span>
              <span className="text-gray-600">({book.reviewCount} 리뷰)</span>
            </div>

            <div className="flex items-center gap-2">
              <FaHeart className="text-red-400 w-5 h-5" />
              <span className="text-gray-700">{book.likeCount}</span>
            </div>
          </div>

          {/* 책 설명 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">줄거리</h2>
            <p className="text-gray-700 leading-relaxed">{book.description}</p>
          </div>

          {/* 추가 정보 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">페이지:</span>
                <span className="ml-2 font-semibold text-gray-900">
                  {book.pageCount}쪽
                </span>
              </div>
              <div>
                <span className="text-gray-600">게시일:</span>
                <span className="ml-2 font-semibold text-gray-900">
                  {new Date(book.createdAt).toLocaleDateString('ko-KR')}
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
          </div>
        </div>
      </div>
    </div>
  );
}
