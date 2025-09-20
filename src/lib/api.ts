import useAuthStore from '@/store/useAuthStore';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';

// 공통으로 사용할 fetch 함수
async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T | null> {
  const { accessToken, setAccessToken } = useAuthStore.getState();

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

    if (!response.ok) {
      // 403 forbidden error or 401 unauthorized error -> token issue
      if (response.status === 403 || response.status === 401) {
        console.log('Access token expired. Attempting to refresh...');

        // 2. 서버에 새로운 Access Token을 요청합니다.
        const refreshResponse = await fetch('/api/v1/auth/reissue', {
          method: 'POST',
        });
        const refreshData = await refreshResponse.json();

        // 3. 재발급에 성공했을 경우
        if (refreshResponse.ok && refreshData.data.accessToken) {
          const newAccessToken = refreshData.data.accessToken;
          console.log('Successfully refreshed token.');

          // 3-1. Zustand 스토어의 토큰을 업데이트합니다.
          setAccessToken(newAccessToken);

          // 3-2. 원래 요청의 헤더에 새로운 토큰을 설정하여 다시 보냅니다.
          const newHeaders: HeadersInit = {
            ...mergedOptions.headers, // 기존 헤더를 모두 포함하고,
            Authorization: `Bearer ${newAccessToken}`, // Authorization 헤더만 새로 덮어씁니다.
          };
          const retryOptions = { ...mergedOptions, headers: newHeaders };

          const retryResponse = await fetch(url, retryOptions);

          if (!retryResponse.ok) {
            // 재시도에도 실패하면 에러를 던집니다.
            const errorData = await retryResponse
              .json()
              .catch(() => ({ message: retryResponse.statusText }));
            throw new Error(
              `API Error after retry: ${retryResponse.status} ${
                errorData.message || retryResponse.statusText
              }`
            );
          }

          // 재시도 성공 시, 응답 데이터를 파싱하여 반환합니다.
          const contentType = retryResponse.headers.get('content-type');
          if (contentType?.includes('application/json')) {
            return retryResponse.json() as Promise<T>;
          } else {
            return null;
          }
        } else {
          // 4. 재발급에 실패했을 경우 (Refresh Token 만료 등)
          console.error('Failed to refresh token. Logging out.');
          setAccessToken(null); // 스토어의 토큰을 비웁니다.
          // 로그인 페이지로 리다이렉트합니다.
          if (typeof window !== 'undefined') {
            window.location.href = '/auth';
          }
          throw new Error('Session has expired. Please log in again.');
        }
      } else {
        // 5. 401이 아닌 다른 에러일 경우
        const errorData = await response
          .json()
          .catch(() => ({ message: response.statusText }));
        throw new Error(
          `API Error: ${response.status} ${
            errorData.message || response.statusText
          }`
        );
      }
    }

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
