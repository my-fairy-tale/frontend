import { infiniteQueryOptions } from '@tanstack/react-query';
import { ApiResponse, MyReviewsListData } from '@/types/api';
import ApiFetch from '@/lib/api';

export const myReviewsOption = (accessToken?: string) =>
  infiniteQueryOptions({
    queryKey: ['my-reviews'],
    queryFn: async ({ pageParam = 0 }) => {
      if (!accessToken) {
        throw new Error('인증 정보가 없습니다.');
      }

      const data: ApiResponse<MyReviewsListData> = await ApiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/reviews/my?page=${pageParam}`,
        {
          method: 'GET',
          ...(typeof window === 'undefined' ? { cache: 'no-store' } : {}),
        },
        accessToken
      );

      if (!data.data) {
        throw new Error('리뷰가 없습니다.');
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
