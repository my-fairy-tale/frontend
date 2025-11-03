import { ApiResponse, MyBooksData } from '@/types/api';
import { infiniteQueryOptions } from '@tanstack/react-query';
import ApiFetch from '@/lib/api';

export const myBookOption = (accessToken?: string, sort: string = 'latest') =>
  infiniteQueryOptions({
    queryKey: ['myBooksInfinite', sort],
    queryFn: async ({ pageParam = 0 }) => {
      const data: ApiResponse<MyBooksData> = await ApiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/books/my?page=${pageParam}&size=4&sort=${sort}`,
        {
          method: 'GET',
          ...(typeof window === 'undefined' ? { cache: 'no-store' } : {}),
        },
        accessToken
      );

      if (!data.data) {
        throw new Error('책 데이터가 없습니다.');
      }
      return data.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.isLast) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    staleTime: 60 * 1000,
  });
