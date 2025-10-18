import { ApiResponse, LibraryBookListData } from '@/types/api';
import { infiniteQueryOptions } from '@tanstack/react-query';

export const libraryBookOption = (
  sort: string = 'latest',
  accessToken?: string
) =>
  infiniteQueryOptions({
    queryKey: ['library-books', sort],
    queryFn: async ({ pageParam = 0 }) => {
      const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/library/posts?page=${pageParam}&size=5&sort=${sort}`;
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        ...(typeof window === 'undefined' ? { cache: 'no-store' } : {}),
      });

      if (!response.ok) {
        throw new Error('책 데이터를 불러올 수 없습니다');
      }

      const data: ApiResponse<LibraryBookListData> = await response.json();
      if (!data.data) {
        throw new Error('책 데이터가 없습니다.');
      }
      return data.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return !lastPage.isLast ? lastPage.currentPage + 1 : undefined;
    },
    staleTime: 60 * 1000,
  });
