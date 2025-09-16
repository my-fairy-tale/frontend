// types/next-auth.d.ts

import 'next-auth';
import 'next-auth/jwt';

// Session 객체에 추가할 타입 선언
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    error?: 'RefreshAccessTokenError';
    user: {
      id: string; // token.sub를 저장할 속성
    } & DefaultSession['user'];
  }
}

// JWT 토큰에 추가할 타입 선언
declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number; // access_token 만료 시간 (초 단위)
    error?: 'RefreshAccessTokenError';
  }
}
