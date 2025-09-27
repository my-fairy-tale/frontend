import { auth } from '@/auth';
import { useSession } from 'next-auth/react';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';

// client에서 공통으로 사용할 apiFetch함수
async function ApiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T | null> {
  const { data: session } = useSession();

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (session?.accessToken) {
    defaultHeaders['Authorization'] = `Bearer ${session.accessToken}`;
  }

  const mergedOptions: RequestInit = {
    ...options, // 사용자가 전달한 옵션을 먼저 적용
    headers: {
      ...defaultHeaders, // 기본 헤더 적용
      ...options.headers, // 사용자가 전달한 헤더로 덮어쓰기
    },
  };

  try {
    const response = await fetch(path, mergedOptions);

    if (!response.ok) {
      // 403 forbidden error or 401 unauthorized error -> token issue
      if (response.status === 403 || response.status === 401) {
        console.log('Access token expired. Attempting to refresh...');

        // 서버에 새로운 Access Token을 요청합니다.
        const refreshResponse = await fetch('/api/v1/auth/reissue', {
          method: 'POST',
        });

        // 재발급에 성공했을 경우
        if (refreshResponse.ok && session?.accessToken) {
          const newAccessToken = session.accessToken;
          console.log('Successfully refreshed token.');

          // 새로운 토큰을 헤더에 담는다.
          const newHeaders: HeadersInit = {
            ...mergedOptions.headers, // 기존 헤더를 모두 포함하고,
            Authorization: `Bearer ${newAccessToken}`, // Authorization 헤더만 새로 덮어씁니다.
          };
          const retryOptions = { ...mergedOptions, headers: newHeaders };

          const retryResponse = await fetch(path, retryOptions);

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
          // 재발급에 실패했을 경우 (Refresh Token 만료 등)
          console.error('Failed to refresh token. Logging out.');
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

export default ApiFetch;
