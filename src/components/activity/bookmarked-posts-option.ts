import { infiniteQueryOptions } from '@tanstack/react-query';
import { ApiResponse, MyBookMarkedPostsListData } from '@/types/api';

export const bookmarkedPostsOption = (accessToken?: string) =>
  infiniteQueryOptions({
    queryKey: ['bookmarked-posts'],
    queryFn: async ({ pageParam = 0 }) => {
      if (!accessToken) {
        throw new Error('인증 정보가 없습니다.');
      }

      const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/bookmarks/my?page=${pageParam}`;
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
        throw new Error('북마크를 불러올 수 없습니다.');
      }

      const data: ApiResponse<MyBookMarkedPostsListData> =
        await response.json();

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
