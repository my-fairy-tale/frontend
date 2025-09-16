import NextAuth, { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import kakaoProvider from 'next-auth/providers/kakao';

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const url = 'https://kauth.kakao.com/oauth/token';
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: process.env.KAKAO_CLIENT_REST_API_ID!,
        client_secret: process.env.KAKAO_CLIENT_SECRET!,
        refresh_token: token.refreshToken!,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    // 새로운 토큰 정보로 기존 token 객체를 업데이트
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      // access_token의 만료 시간을 현재 시간 기준으로 계산하여 저장
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      // 카카오는 refresh_token을 갱신하면 기존 것은 만료되므로 새로 받은 것을 저장
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error('Error refreshing access token', error);
    // 갱신 실패 시 error 플래그를 설정
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

const handler = NextAuth({
  providers: [
    kakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID || '',
      clientSecret: process.env.KAKAO_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user }) {
      // 1. 초기 로그인시
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          //토큰 만료 시점
          accessTokenExpires:
            Date.now() + (account.refresh_token_expires_in as number) * 1000,
          //token.sub는 user.id 값
          sub: user.id,
        };
      }

      // 2. 이후 요청 시 (access token이 만료되지 않았을 때)
      // accessTokenExpires가 있고, 현재 시간이 만료 시간보다 이전이라면 기존 토큰을 그대로 반환
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // 3. access token이 만료되었을 때 -> refresh token으로 갱신 시도
      // refreshToken이 없다면 갱신 불가
      if (!token.refreshToken) {
        // 에러를 던지거나, error 플래그와 함께 token을 반환할 수 있습니다.
        throw new Error('Missing refresh token');
      }
      return refreshAccessToken(token);
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      // jwt 콜백에서 처리된 token 정보를 session에 담아 클라이언트로 전달
      if (token) {
        session.user.id = token.sub as string;
        session.accessToken = token.accessToken;
        session.error = token.error;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
