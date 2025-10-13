import { infiniteQueryOptions } from '@tanstack/react-query';
import { ApiResponse, MyReviewsListData } from '@/types/api';

export const myReviewsOption = (accessToken?: string) =>
  infiniteQueryOptions({
    queryKey: ['my-reviews'],
    queryFn: async ({ pageParam = 0 }) => {
      if (!accessToken) {
        throw new Error('인증 정보가 없습니다.');
      }

      const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/reviews/my?page=${pageParam}`;
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
        throw new Error('리뷰를 불러올 수 없습니다.');
      }

      const data: ApiResponse<MyReviewsListData> = await response.json();

      if (!data.data) {
        throw new Error('리뷰가 없습니다.');
      }
      return data.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.number !== lastPage.totalPages) {
        return lastPage.number + 1;
      }
    },
    staleTime: 5 * 60 * 1000, // 5분
  });
