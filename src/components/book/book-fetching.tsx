'use client';

import { ApiResponse, BookData } from '@/types/api';
import BookDisplay from './book-display'; // 실제 UI 컴포넌트
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';

const fetchBookDetail = async (slug: string, accessToken?: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/books/${slug}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 인증이 필요한 경우에만 헤더 추가
        ...(accessToken && {
          Authorization: `Bearer ${accessToken}`,
        }),
      },
    }
  );

  if (!response.ok) {
    throw new Error('책을 불러올 수 없습니다.');
  }

  const data: ApiResponse<BookData> = await response.json();

  if (data.code === 'BOOK_4005') {
    throw new Error(data.message || '열람할 수 없는 책입니다.');
  }

  if (data?.code === 'BOOK_2002' && data.data) {
    return data.data;
  }

  throw new Error(data?.message || '책을 찾을 수 없습니다.');
};

export default function BookFetching({ slug }: { slug: string }) {
  const { data: session } = useSession();

  const {
    data: bookData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['book-detail', slug],
    queryFn: () => fetchBookDetail(slug, session?.accessToken),
  });

  if (isLoading) return <div>책을 불러오는 중...</div>;
  if (error) return <div>오류: {error.message}</div>;
  if (!bookData) return <div>해당 책을 찾을 수 없습니다.</div>;

  return <BookDisplay bookData={bookData} />;
}
