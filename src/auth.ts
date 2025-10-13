import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Kakao from 'next-auth/providers/kakao';
import { ApiResponse, OAuthData } from './types/api';

// Cache for ongoing refresh requests to prevent race conditions
let refreshPromise: Promise<JWT> | null = null;

async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/reissue`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: token.refreshToken }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.data) {
      throw new Error(data.message || 'Failed to refresh access token');
    }
    console.log('refreshed token is success');

    // 새로 발급받은 토큰으로 기존 token 객체를 업데이트
    return {
      ...token,
      accessToken: data.data.accessToken as string,
      accessTokenExpiresIn: Date.now() + data.data.accessTokenExpiresIn * 1000,
      // 백엔드가 새 refresh token을 주면 업데이트, 아니면 기존 것 유지
      refreshToken: (data.data.refreshToken as string) ?? token.refreshToken,
      error: undefined,
    };
  } catch (error) {
    console.error('RefreshAccessTokenError', error);
    // 갱신 실패 시, 에러 정보를 포함하여 반환
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const { handlers, signIn, signOut, unstable_update, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: {
          type: 'email',
          label: 'Email',
          placeholder: 'johndoe@gmail.com',
        },
        password: {
          type: 'password',
          label: 'Password',
          placeholder: '*****',
        },
      },
      authorize: async (credentials) => {
        const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/sign-in`;

        try {
          const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await response.json();
          console.log('login response data is', data);

          if (response.ok || data.data) {
            return {
              id: data.data.id,
              email: data.data.email,
              name: data.data.name,
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
              accessTokenExpiresIn: data.data.accessTokenExpiresIn,
            };
          }

          return null;
        } catch (err) {
          console.error('Authorize error:', err);
          return null;
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24, // 세션 만료 시간(sec) -> 1day
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account }) {
      // OAuth 로그인인 경우
      if (account?.provider === 'google' || account?.provider === 'kakao') {
        console.log(account.provider, 'login complete', user, account);
        try {
          const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/oauth/simple`;
          const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              provider: account.provider,
              providerId: account.providerAccountId,
            }),
          });

          const data: ApiResponse<OAuthData> = await response.json();
          console.log('OAuth backend response:', data);

          if (response.ok && data.data) {
            // 백엔드에서 받은 토큰을 user 객체에 추가
            user.accessToken = data.data.accessToken;
            user.refreshToken = data.data.refreshToken;
            user.accessTokenExpiresIn = data.data.accessTokenExpiresIn;
            user.id = data.data.id.toString();
            return true;
          }

          return false;
        } catch (err) {
          console.error('OAuth backend error:', err);
          return false;
        }
      }

      // Credentials 로그인인 경우
      return true;
    },
    async jwt({ token, user }) {
      // 초기 로그인
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpiresIn =
          Date.now() + user.accessTokenExpiresIn * 1000;
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
        };
        return token;
      }

      if (Date.now() < token.accessTokenExpiresIn!) {
        return token;
      }

      // If a refresh is already in progress, wait for it
      if (refreshPromise) {
        return await refreshPromise;
      }

      // Start a new refresh and cache the promise
      refreshPromise = refreshAccessToken(token).finally(() => {
        refreshPromise = null;
      });

      const refreshedToken = await refreshPromise;
      if (refreshedToken.error) {
        console.log('refreshToken error - invalidating session');
        // Return null to invalidate session
        return null;
      }

      return refreshedToken;
    },
    async session({ session, token }) {
      // JWT callback이 null을 반환하면 이 callback은 호출되지 않음

      session.user = token.user;
      session.accessToken = token.accessToken;

      return session;
    },
  },
});
