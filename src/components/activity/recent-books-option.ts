import { queryOptions } from '@tanstack/react-query';
import { ApiResponse, RecentBooksData } from '@/types/api';
import ApiFetch from '@/lib/api';

export const recentBookOption = (accessToken?: string) =>
  queryOptions({
    queryKey: ['recent-book'],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('인증 정보가 없습니다.');
      }

      const data: ApiResponse<RecentBooksData[]> = await ApiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/books/recent`,
        {
          method: 'GET',
          ...(typeof window === 'undefined' ? { cache: 'no-store' } : {}),
        },
        accessToken
      );

      if (data?.code === 'BOOK_2008' && data.data) {
        return data.data;
      }

      throw new Error(data?.message || '최근에 본 책을 찾을 수 없습니다.');
    },
    staleTime: 5 * 60 * 1000, // 5분
  });
