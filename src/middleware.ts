import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = await auth();

  if (!session && request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_HOST}/auth/login`
    );
  }

  if (request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_HOST}/mypage`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/mypage', '/books/create', '/books/:path*', '/dashboard/:path*'],
};
