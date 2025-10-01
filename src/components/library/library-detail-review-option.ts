import { ApiResponse, ReviewListData } from '@/types/api';
import { infiniteQueryOptions } from '@tanstack/react-query';

const fetchLibraryReviewDetail = async (bookId: string, pageParam: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/books/${bookId}/reviews?page=${pageParam}&size=4`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('책을 불러올 수 없습니다.');
  }

  const data: ApiResponse<ReviewListData> = await response.json();

  if (data?.code === 'REVIEW_2002' && data.data) {
    return data.data;
  }

  throw new Error(data?.message || '책을 찾을 수 없습니다.');
};

export const libraryDetailReviewOption = (bookId: string) => {
  return infiniteQueryOptions({
    queryKey: ['library-detail-review', bookId],
    queryFn: async ({ pageParam = 0 }) =>
      fetchLibraryReviewDetail(bookId, pageParam),
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
