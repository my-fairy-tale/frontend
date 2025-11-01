import { ApiResponse, ReviewListData } from '@/types/api';
import { infiniteQueryOptions } from '@tanstack/react-query';
import ApiFetch from '@/lib/api';

const fetchLibraryReviewDetail = async (postId: string, pageParam: number) => {
  const data: ApiResponse<ReviewListData> = await ApiFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/${postId}/reviews?page=${pageParam}&size=4`,
    {
      method: 'GET',
    }
  );

  if (data?.code === 'REVIEW_2002' && data.data) {
    return data.data;
  }

  throw new Error(data?.message || '책을 찾을 수 없습니다.');
};

export const libraryDetailReviewOption = (postId: string) => {
  return infiniteQueryOptions({
    queryKey: ['library-detail-review', postId],
    queryFn: async ({ pageParam = 0 }) =>
      fetchLibraryReviewDetail(postId, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.pageInfo.isLast) {
        return lastPage.pageInfo.currentPage + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000, // 5분
  });
};
