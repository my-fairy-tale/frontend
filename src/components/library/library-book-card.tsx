'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';
import { LibraryBooksData } from '@/types/api';
import { useSession } from 'next-auth/react';
import { getQueryClient } from '@/lib/get-query-client';
import { libraryDetailLikeOption } from './library-detail-like-option';
import { libraryDetailBookOption } from './library-detail-book-option';
import { libraryDetailReviewOption } from './library-detail-review-option';

interface LibraryBookCardProps {
  post: LibraryBooksData;
}

const LibraryBookCard = ({ post }: LibraryBookCardProps) => {
  const { data: session } = useSession();
  const queryClient = getQueryClient();

  const handleMouseEnter = () => {
    if (session?.accessToken) {
      queryClient.prefetchQuery(
        libraryDetailLikeOption(post.postId.toString(), session.accessToken)
      );
      queryClient.prefetchInfiniteQuery(
        libraryDetailReviewOption(post.postId.toString(), session.accessToken)
      );
    } else {
      queryClient.prefetchInfiniteQuery(
        libraryDetailReviewOption(post.postId.toString())
      );
    }
    queryClient.prefetchQuery(libraryDetailBookOption(post.postId.toString()));
  };

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
        </div>

        {/* 정보 */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>

          <p className="text-xs text-gray-600 mb-2">by {post.authorName}</p>

          {/* 별점 */}
          <div className="flex items-center gap-1 mt-auto">
            <FaStar className="text-yellow-400 w-4 h-4" />
            <span className="text-sm font-semibold text-gray-900">
              {post.averageRating ? post.averageRating.toFixed(1) : '0'}
            </span>
            <span className="text-xs text-gray-500">({post.reviewCount})</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LibraryBookCard;
