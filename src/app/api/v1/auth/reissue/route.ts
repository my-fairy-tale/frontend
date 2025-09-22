import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // 1. 요청에 담겨온 쿠키를 읽기 위해 cookieStore를 가져옵니다.
  const cookieStore = request.cookies;
  const refreshToken = cookieStore.get('refreshToken')?.value;
  console.log('reissue called, refresh is', refreshToken);

  // 2. 쿠키에 refreshToken이 없는 경우 에러를 반환합니다.
  if (!refreshToken) {
    return NextResponse.json(
      { message: '인증에 필요한 리프레시 토큰이 없습니다.' },
      { status: 401 }
    );
  }

  try {
    // 3. 백엔드 서버의 토큰 재발급 API로 요청을 보냅니다.
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/reissue`, // 실제 백엔드 재발급 주소
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      }
    );

    const data = await response.json();

    // 4. 백엔드 서버가 에러를 반환한 경우 (예: refreshToken 만료)
    if (!response.ok) {
      throw new Error(data.message || '토큰 갱신에 실패했습니다.');
    }

    // 5. 성공 시, 새로 발급받은 accessToken을 클라이언트에 전달합니다.
    const { accessToken } = data.data;
    return NextResponse.json({ accessToken });
  } catch (error: any) {
    console.error('Refresh token API error:', error.message);

    // 6. 재발급 과정에서 에러 발생 시 클라이언트에게 실패를 알립니다.
    return NextResponse.json(
      {
        message: error.message || '세션이 만료되었습니다. 다시 로그인해주세요.',
      },
      { status: 401 }
    );
  }
}
