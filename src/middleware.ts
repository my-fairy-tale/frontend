// middleware.ts
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // 인증이 필요한 경로들
  const protectedRoutes = ['/books/create', '/mypage', '/admin', '/activity'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // 공개 경로들
  // const publicRoutes = ['/auth', '/'];
  // const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  // 로그인하지 않았는데 보호된 경로에 접근
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', nextUrl));
  }

  // 로그인했는데 로그인 페이지에 접근
  if (isLoggedIn && nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/mypage', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
