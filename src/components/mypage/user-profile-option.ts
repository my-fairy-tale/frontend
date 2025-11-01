import { ApiResponse, UserProfileData } from '@/types/api';
import { queryOptions } from '@tanstack/react-query';
import ApiFetch from '@/lib/api';

export const userProfileOption = (accessToken?: string) =>
  queryOptions({
    queryKey: ['members-me'],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('인증 정보가 없습니다.');
      }

      const data: ApiResponse<UserProfileData> = await ApiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/members/me`,
        {
          method: 'GET',
        },
        accessToken
      );

      if (!data.data) {
        throw new Error('user 정보가 없습니다!');
      }
      return data.data;
    },
  });
