import { queryOptions } from '@tanstack/react-query';
import { ApiResponse, BookData } from '@/types/api';
import ApiFetch from '@/lib/api';

export const bookDetailOption = (slug: string, accessToken?: string) =>
  queryOptions({
    queryKey: ['book-detail', slug],
    queryFn: async () => {
      const data: ApiResponse<BookData> = await ApiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/books/${slug}`,
        {
          method: 'GET',
          ...(typeof window === 'undefined' ? { cache: 'no-store' } : {}),
        },
        accessToken
      );

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
