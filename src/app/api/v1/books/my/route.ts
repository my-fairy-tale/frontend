// import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.toString();
  const api_url = `http://218.51.41.52:9600/api/v1/books/my?${query}`;

  const headers = req.headers;

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
