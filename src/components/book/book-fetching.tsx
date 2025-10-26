'use client';

import BookDisplay from './book-display';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { bookDetailOption } from './book-detail-option';
import MobileBookDisplay from './mobile-book-display';
import { useIsMobile } from '@/hooks/useMediaQuery';

export default function BookFetching({ slug }: { slug: string }) {
  const { data: session } = useSession();
  const isMobile = useIsMobile();

  const {
    data: bookData,
    isLoading,
    error,
  } = useQuery(bookDetailOption(slug, session?.accessToken));

  if (isLoading) return <div>책을 불러오는 중...</div>;
  if (!bookData) return <div>해당 책을 찾을 수 없습니다.</div>;
  if (error) return <div>오류: {error.message}</div>;

  // 초기 렌더링 시 깜빡임 방지 (SSR 대응)
  if (isMobile === null) {
    return null;
  }

  return isMobile ? (
    <MobileBookDisplay bookData={bookData} />
  ) : (
    <BookDisplay bookData={bookData} />
  );
}
