import { queryOptions } from '@tanstack/react-query';
import { ApiResponse, BookData } from '@/types/api';

export const bookDetailOption = (slug: string, accessToken?: string) =>
  queryOptions({
    queryKey: ['book-detail', slug],
    queryFn: async () => {
      const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/books/${slug}`;

      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 인증이 필요한 경우에만 헤더 추가
          ...(accessToken && {
            Authorization: `Bearer ${accessToken}`,
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

      if (data.code === 'BOOK_4005') {
        throw new Error(data.message || '열람할 수 없는 책입니다.');
      }

      throw new Error(data?.message || '책을 찾을 수 없습니다.');
    },
    staleTime: 5 * 60 * 1000, // 5분
  });
