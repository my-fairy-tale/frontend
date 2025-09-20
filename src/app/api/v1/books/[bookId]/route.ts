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
  const api_url = `http://218.51.41.52:9600/api/v1/books/${bookId}`;

  const headers = request.headers;

  const book = await fetch(api_url, {
    method: 'GET',
    headers: headers,
  });

  if (!book) {
    return NextResponse.json(
      { message: '해당 책을 찾을 수 없습니다.' },
      { status: 404 }
    );
  }

  return NextResponse.json(book);
}

/**
 * 특정 책을 삭제하는 API (DELETE)
 */
export async function DELETE(request: Request, props: Params) {
  const params = await props.params;
  const { bookId } = params;

  // 여기서 DB에서 bookId에 해당하는 책 정보를 삭제합니다.
  // await db.book.delete({ where: { id: bookId } });

  console.log(`[${bookId}] 책 정보 삭제`);

  return NextResponse.json({
    message: `[${bookId}] 책이 성공적으로 삭제되었습니다.`,
  });
}
