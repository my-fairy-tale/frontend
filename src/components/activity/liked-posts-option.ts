import { infiniteQueryOptions } from '@tanstack/react-query';
import { ApiResponse, MyLikesListData } from '@/types/api';
import ApiFetch from '@/lib/api';

export const likedPostsOption = (accessToken?: string) =>
  infiniteQueryOptions({
    queryKey: ['liked-posts'],
    queryFn: async ({ pageParam = 0 }) => {
      if (!accessToken) {
        throw new Error('인증 정보가 없습니다.');
      }

      const data: ApiResponse<MyLikesListData> = await ApiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/likes/my?page=${pageParam}`,
        {
          method: 'GET',
          ...(typeof window === 'undefined' ? { cache: 'no-store' } : {}),
        },
        accessToken
      );

      if (!data.data) {
        throw new Error('좋아요가 없습니다.');
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
