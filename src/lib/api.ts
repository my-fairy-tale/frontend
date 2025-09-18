import useAuthStore from '@/store/useAuthStore';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';

// 공통으로 사용할 fetch 함수
async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T | null> {
  const { accessToken } = useAuthStore.getState();

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    defaultHeaders['Authorization'] = `Bearer ${accessToken}`;
  }

  const mergedOptions: RequestInit = {
    ...options, // 사용자가 전달한 옵션을 먼저 적용
    headers: {
      ...defaultHeaders, // 기본 헤더 적용
      ...options.headers, // 사용자가 전달한 헤더로 덮어쓰기
    },
  };

  // 백엔드 API의 기본 URL을 환경 변수에서 가져옵니다.
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://218.51.41.52:9600';
  const url = `${baseUrl}${path}`;

  try {
    const response = await fetch(url, mergedOptions);

    // 응답 본문이 없는 경우 (e.g., 204 No Content)를 대비
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      return response.json() as Promise<T>;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Fetch Error:', error);
    // 에러를 다시 던져서 호출한 쪽에서 처리할 수 있게 함
    throw error;
  }
}

export default apiFetch;
