// components/book/book-detail-option.ts
import { auth } from '@/auth';
import { queryOptions } from '@tanstack/react-query';
import { ApiResponse, BookData } from '@/types/api';

export const bookDetailOption = (slug: string) =>
  queryOptions({
    queryKey: ['book-detail', slug],
    queryFn: async () => {
      const session = await auth();
      const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/books/${slug}`;

      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 인증이 필요한 경우에만 헤더 추가
          ...(session?.accessToken && {
            Authorization: `Bearer ${session.accessToken}`,
          }),
        },
        // 서버에서는 캐시 사용 안 함
        ...(typeof window === 'undefined' ? { cache: 'no-store' } : {}),
      });

      if (!response.ok) {
        throw new Error('책을 불러올 수 없습니다.');
      }

      const data: ApiResponse<BookData> = await response.json();

      if (data?.code === 'BOOK_2002' && data.data) {
        return data.data;
      }

      throw new Error(data?.message || '책을 찾을 수 없습니다.');
    },
    staleTime: 5 * 60 * 1000, // 5분
  });
