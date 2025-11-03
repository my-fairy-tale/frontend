import { ApiResponse, LikeData } from '@/types/api';
import { queryOptions } from '@tanstack/react-query';
import ApiFetch from '@/lib/api';

const fetchLibraryLikeDetail = async (postId: string, accessToken?: string) => {
  if (accessToken === undefined) {
    throw new Error('인증이 없습니다.');
  }

  const data: ApiResponse<LikeData> = await ApiFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/${postId}/likes/status`,
    {
      method: 'GET',
    },
    accessToken
  );

  if (data.data) {
    return data.data;
  }

  throw new Error(data?.message || '좋아요를 불러올 수 없음.');
};

export const libraryDetailLikeOption = (
  postId: string,
  accessToken?: string
) => {
  return queryOptions({
    queryKey: ['library-detail-like', postId],
    queryFn: async () => fetchLibraryLikeDetail(postId, accessToken),
    staleTime: 5 * 60 * 1000, // 5분
  });
};
