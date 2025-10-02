import { auth } from '@/auth';
import { ApiResponse, LikeData } from '@/types/api';
import { queryOptions } from '@tanstack/react-query';

const fetchLibraryLikeDetail = async (postId: string) => {
  const session = await auth();
  if (!session?.accessToken) {
    throw new Error('인증 정보가 없습니다.');
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/${postId}/likes/status`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('좋아요를 불러올 수 없습니다.');
  }

  const data: ApiResponse<LikeData> = await response.json();

  if (data.data) {
    return data.data;
  }

  throw new Error(data?.message || '좋아요를 불러올 수 없음.');
};

export const libraryDetailLikeOption = (postId: string) => {
  return queryOptions({
    queryKey: ['library-detail-like', postId],
    queryFn: async () => fetchLibraryLikeDetail(postId),
    staleTime: 5 * 60 * 1000, // 5분
  });
};
