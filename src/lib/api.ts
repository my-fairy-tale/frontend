import { RequestInit } from 'next/dist/server/web/spec-extension/request';

// API 에러 인터페이스
interface ApiErrorData {
  code?: string;
  message?: string;
}

// 커스텀 API 에러 클래스
export class ApiFetchError extends Error {
  code?: string;
  status: number;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = 'ApiFetchError';
    this.status = status;
    this.code = code;
  }
}

// client/server 공통으로 사용할 apiFetch 함수
async function ApiFetch<T>(
  path: string,
  options: RequestInit = {},
  accessToken?: string
): Promise<T> {
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    defaultHeaders['Authorization'] = `Bearer ${accessToken}`;
  }

  const mergedOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(path, mergedOptions);

    if (!response.ok) {
      const errorData: ApiErrorData = await response
        .json()
        .catch(() => ({ message: response.statusText }));

      throw new ApiFetchError(
        response.status,
        errorData.message || response.statusText,
        errorData.code
      );
    }

    // 응답 본문이 없는 경우 (e.g., 204 No Content)를 대비
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      return response.json();
    } else {
      // JSON이 아닌 경우 빈 객체 반환 (타입 안정성 유지)
      throw new ApiFetchError(response.status, '응답이 JSON 형식이 아닙니다.');
    }
  } catch (error) {
    // ApiFetchError는 그대로 던지고, 다른 에러는 로깅 후 재던지기
    if (error instanceof ApiFetchError) {
      throw error;
    }
    console.error('Fetch Error:', error);
    throw error;
  }
}

export default ApiFetch;
