import { infiniteQueryOptions } from '@tanstack/react-query';
import { ApiResponse, MyBookMarkedPostsListData } from '@/types/api';
import ApiFetch from '@/lib/api';

export const bookmarkedPostsOption = (accessToken?: string) =>
  infiniteQueryOptions({
    queryKey: ['bookmarked-posts'],
    queryFn: async ({ pageParam = 0 }) => {
      if (!accessToken) {
        throw new Error('인증 정보가 없습니다.');
      }

      const data: ApiResponse<MyBookMarkedPostsListData> = await ApiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/bookmarks/my?page=${pageParam}`,
        {
          method: 'GET',
          ...(typeof window === 'undefined' ? { cache: 'no-store' } : {}),
        },
        accessToken
      );

      if (!data.data) {
        throw new Error('북마크가 없습니다.');
      }
      return data.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.isLast) {
        return lastPage.currentPage + 1;
      }
    },
    staleTime: 5 * 60 * 1000, // 5분
  });
