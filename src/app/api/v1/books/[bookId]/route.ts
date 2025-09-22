import { NextResponse } from 'next/server';

// params 객체의 타입을 미리 정의해두면 편리합니다.
interface Params {
  params: Promise<{ bookId: string }>;
}

/**
 * 특정 책의 정보를 조회하는 API (GET)
 * @param request - Next.js의 Request 객체
 * @param params - URL의 동적 세그먼트 값을 담고 있는 객체
 */
export async function GET(request: Request, props: Params) {
  const params = await props.params;
  const { bookId } = params;
  const api_url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/books/${bookId}`;
  const headers = request.headers;

  try {
    const response = await fetch(api_url, {
      method: 'GET',
      headers: headers,
    });

    if (!response) {
      return NextResponse.json(
        { message: '해당 책을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

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

/**
 * 특정 책을 삭제하는 API (DELETE)
 */
export async function DELETE(request: Request, props: Params) {
  const params = await props.params;
  const { bookId } = params;
  const api_url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/books/${bookId}`;
  const headers = request.headers;

  const response = await fetch(api_url, {
    method: 'DELETE',
    headers: headers,
  });
  console.log(`[${bookId}] 책 정보 삭제`);

  if (!response) {
    return NextResponse.json(
      { message: '해당 책을 찾을 수 없습니다.' },
      { status: 404 }
    );
  }

  const body = await response.json();

  return NextResponse.json(body);
}
