// types/next-auth.d.ts

import 'next-auth';
import 'next-auth/jwt';

// Session 객체에 추가할 타입 선언
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    error?: string;
    user: {
      id: string;
      name: string;
      email: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    name: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: number;
  }
}

// JWT 토큰에 추가할 타입 선언
declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpiresIn?: number; // access_token 만료 시간 (초 단위)
    error?: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }
}
