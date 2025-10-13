'use client';

import BookDisplay from './book-display';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { bookDetailOption } from './book-detail-option';

export default function BookFetching({ slug }: { slug: string }) {
  const { data: session } = useSession();

  const {
    data: bookData,
    isLoading,
    error,
  } = useQuery(bookDetailOption(slug, session?.accessToken));

  if (isLoading) return <div>책을 불러오는 중...</div>;
  if (!bookData) return <div>해당 책을 찾을 수 없습니다.</div>;
  if (error) return <div>오류: {error.message}</div>;

  return <BookDisplay bookData={bookData} />;
}
