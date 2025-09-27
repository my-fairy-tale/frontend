import { NextResponse } from 'next/server';

// params 객체의 타입을 미리 정의해두면 편리합니다.
interface Params {
  params: Promise<{ bookId: string }>;
}

/**
 * @param request - Next.js의 Request 객체
 * @param params - URL의 동적 세그먼트 값을 담고 있는 객체
 */
export async function PATCH(request: Request, props: Params) {
  const params = await props.params;
  const { bookId } = params;
  const api_url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/books/${bookId}/visibility`;

  try {
    const requestBody = await request.json();
    const authHeader = request.headers.get('authorization');

    const response = await fetch(api_url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error('Error from external API:', response.statusText);
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const book = await response.json();
    return NextResponse.json(book);
  } catch (err) {
    return NextResponse.json(
      {
        error: '서버 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
