import { ApiResponse, LibraryBookListData } from '@/types/api';
import { infiniteQueryOptions } from '@tanstack/react-query';
import ApiFetch from '@/lib/api';

export const libraryBookOption = (
  sort: string = 'latest',
  accessToken?: string
) =>
  infiniteQueryOptions({
    queryKey: ['library-books', sort, !!accessToken],
    queryFn: async ({ pageParam = 0 }) => {
      const data: ApiResponse<LibraryBookListData> = await ApiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/library/posts?page=${pageParam}&size=5&sort=${sort}`,
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
      return !lastPage.isLast ? lastPage.currentPage + 1 : undefined;
    },
    staleTime: 60 * 1000,
  });
