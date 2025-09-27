import { auth } from '@/auth';
import { queryOptions } from '@tanstack/react-query';

export const userProfileOption = queryOptions({
  queryKey: ['members-me'],
  queryFn: async () => {
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/members/me`;
    const session = await auth();

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('프로필 정보를 불러올 수 없습니다.');
    }
    const data = await response.json();
    if (!data.data) {
      throw new Error('user 정보가 없습니다!');
    }
    return data.data;
  },
});
