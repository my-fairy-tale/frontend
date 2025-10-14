import { queryOptions } from '@tanstack/react-query';
import { ApiResponse, RecentBooksData } from '@/types/api';

export const recentBookOption = (accessToken?: string) =>
  queryOptions({
    queryKey: ['recent-book'],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('인증 정보가 없습니다.');
      }

      const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/books/recent`;
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        // 서버에서는 캐시 사용 안 함
        ...(typeof window === 'undefined' ? { cache: 'no-store' } : {}),
      });

      if (!response.ok) {
        throw new Error('기록을 불러올 수 없습니다.');
      }

      const data: ApiResponse<RecentBooksData[]> = await response.json();

      if (data?.code === 'BOOK_2008' && data.data) {
        return data.data;
      }

      throw new Error(data?.message || '최근에 본 책을 찾을 수 없습니다.');
    },
    staleTime: 5 * 60 * 1000, // 5분
  });
