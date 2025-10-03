import { ApiResponse, LibraryDetailBookData } from '@/types/api';
import { queryOptions } from '@tanstack/react-query';

const fetchLibraryBookDetail = async (postId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/library/posts/${postId}`,
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

  const data: ApiResponse<LibraryDetailBookData> = await response.json();

  if (data?.code === 'LIBRARY_2002' && data.data) {
    return data.data;
  }

  throw new Error(data?.message || '책을 찾을 수 없습니다.');
};

export const libraryDetailBookOption = (postId: string) => {
  return queryOptions({
    queryKey: ['library-detail-book', postId],
    queryFn: async () => fetchLibraryBookDetail(postId),
    staleTime: 5 * 60 * 1000, // 5분
  });
};
