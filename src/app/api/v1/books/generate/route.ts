// import { auth } from '@/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const query = req.nextUrl.searchParams.toString();
  const api_url = `http://218.51.41.52:9600/api/v1/books/generate`;

  const headers = req.headers;
  const body = req.body;

  try {
    const response = await fetch(api_url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
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
