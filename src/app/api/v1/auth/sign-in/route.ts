import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const api_url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/sign-in`;

  try {
    const body = await req.json();

    const response = await fetch(api_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error('Error from external API:', response.statusText);
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const backendData = await response.json();
    if (backendData.data) {
      const { refreshToken, ...dataToSend } = backendData.data;

      const res = NextResponse.json({
        code: backendData.code,
        message: backendData.message,
        data: dataToSend,
      });
      res.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: backendData.data.refreshTokenExpiresIn,
      });

      return res;
    }
    return NextResponse.json(
      { message: 'Login successful, but no token data received.' },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.', err },
      { status: 500 }
    );
  }
}
