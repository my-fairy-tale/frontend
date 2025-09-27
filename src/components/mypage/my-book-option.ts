import { auth } from '@/auth';
import { ApiResponse, MyBooksData } from '@/types/api';
import { infiniteQueryOptions } from '@tanstack/react-query';

export const myBookOption = infiniteQueryOptions({
  queryKey: ['myBooksInfinite'],
  queryFn: async ({ pageParam = 0 }) => {
    const session = await auth();
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/books/my?status=COMPLETED&page=${pageParam}&size=4`;

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.accessToken}`,
      },
      ...(typeof window === 'undefined' ? { cache: 'no-store' } : {}),
    });

    if (!response.ok) {
      throw new Error('책 데이터를 불러올 수 없습니다.');
    }

    const data: ApiResponse<MyBooksData> = await response.json();
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
