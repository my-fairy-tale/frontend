'use client';

import { useQuery } from '@tanstack/react-query';
import { FaBook } from 'react-icons/fa';
import { recentBookOption } from './recent-books-option';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { getQueryClient } from '@/lib/get-query-client';
import { bookDetailOption } from '../book/book-detail-option';
import { formatRelativeTime } from '@/lib/date-utils';
import { useCallback } from 'react';

const SectionWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <FaBook className="text-blue-600" />
          최근 본 책
        </h2>
        <span className="text-sm text-gray-500">최근 10개</span>
      </div>
      {children}
    </section>
  );
};

const RecentBooks = () => {
  const queryClient = getQueryClient();
  const { data: session } = useSession();
  const {
    data: recentBooks,
    isLoading,
    isError,
    error,
  } = useQuery(recentBookOption(session?.accessToken));

  const handleMouseEnter = useCallback(
    (bookId: string) => {
      queryClient.prefetchQuery(bookDetailOption(bookId));
    },
    [queryClient]
  );

  const handleClick = useCallback(() => {
    queryClient.fetchQuery({ queryKey: ['recent-book'] });
  }, [queryClient]);

  if (isLoading) {
    return (
      <SectionWrapper>
        <div className="w-full bg-gray-50 rounded-lg p-12 text-center opacity-60 animate-pulse">
          <FaBook className="mx-auto text-gray-300 text-5xl mb-4" />
          <p className="text-gray-500 text-lg">불러오는 중...</p>
        </div>
      </SectionWrapper>
    );
  }

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

  if (!recentBooks || recentBooks.length === 0) {
    return (
      <SectionWrapper>
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <FaBook className="mx-auto text-gray-300 text-5xl mb-4" />
          <p className="text-gray-500 text-lg">아직 본 책이 없습니다</p>
          <p className="text-gray-400 text-sm mt-2">
            동화책을 읽으면 여기에 기록됩니다
          </p>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full">
        {recentBooks.map((book) => (
          <Link
            key={book.bookId}
            href={`/books/${book.bookId}`}
            onMouseEnter={() => handleMouseEnter(book.bookId)}
            onClick={handleClick}
            className="bg-white rounded-lg p-4 transition-shadow"
          >
            <div className="relative aspect-[3/4] rounded-lg mb-3 overflow-hidden hover:shadow-lg bg-gray-100">
              <Image
                src={book.thumbnailUrl}
                alt={book.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              />
            </div>
            <h3
              className="font-medium text-gray-800 truncate"
              title={book.title}
            >
              {book.title}
            </h3>
            <p className="text-sm text-gray-500">
              {formatRelativeTime(book.viewedAt)}
            </p>
          </Link>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default RecentBooks;
