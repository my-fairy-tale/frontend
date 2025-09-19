import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const api_url = `http://218.51.41.52:9600/api/v1/members/me`;

  const headers = request.headers;

  try {
    const response = await fetch(api_url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      console.error('Error from external API:', response.statusText);
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('api router error:', err);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 특정 사용자를 수정하는 API (PUT)
 */
export async function PUT(request: Request) {
  const api_url = `http://218.51.41.52:9600/api/v1/members/me`;

  const headers = request.headers;
  const body = request.body;

  try {
    const response = await fetch(api_url, {
      method: 'PUT',
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      console.error('Error from external API:', response.statusText);
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('api router error:', err);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
