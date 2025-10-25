'use client';

import BookDisplay from './book-display';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { bookDetailOption } from './book-detail-option';
import MobileBookDisplay from './mobile-book-display';
import { useEffect, useState } from 'react';

export default function BookFetching({ slug }: { slug: string }) {
  const { data: session } = useSession();
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  const {
    data: bookData,
    isLoading,
    error,
  } = useQuery(bookDetailOption(slug, session?.accessToken));

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };

    // 초기값 설정
    handleChange(mediaQuery);

    // 이벤트 리스너 등록
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

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
