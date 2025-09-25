import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';

async function refreshAccessToken(token: JWT) {
  console.log('accessToken is expiration');
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

    // 새로 발급받은 토큰으로 기존 token 객체를 업데이트
    return {
      ...token,
      accessToken: data.data.accessToken as string,
      // 새로 받은 토큰의 만료 시간을 다시 계산
      accessTokenExpires: Date.now() + data.data.accessTokenExpiresIn * 1000,
      // 백엔드가 새 refresh token을 주면 업데이트, 아니면 기존 것 유지
      refreshToken: (data.data.refreshToken as string) ?? token.refreshToken,
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

export const { handlers, signIn, signOut, auth } = NextAuth({
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
        let user = {
          id: '',
          email: '',
          name: '',
          accessToken: '',
          refreshToken: '',
          accessTokenExpiresIn: 0,
        };

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

          if (!response.ok || !data.data) {
            throw new Error(data.message || 'sign-in to server error');
          }

          const {
            id,
            email,
            name,
            accessToken,
            refreshToken,
            accessTokenExpiresIn,
          } = data.data;
          user.id = id;
          user.email = email;
          user.name = name;
          user.accessToken = accessToken;
          user.refreshToken = refreshToken;
          user.accessTokenExpiresIn = accessTokenExpiresIn;

          return user;
        } catch (err) {
          console.error('Authorize error:', err);
          throw err;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24, // 세션 만료 시간(sec) -> 1day
  },
  callbacks: {
    async jwt({ token, user }) {
      // 초기 로그인
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires =
          Date.now() + user.accessTokenExpiresIn * 1000;
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
        };
        return token;
      }

      // token을 다시 갱신
      if (Date.now() > token.accessTokenExpires!) {
        return refreshAccessToken(token);
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = token.user;

      if (token.error) {
        session.error = token.error;
      }

      return session;
    },
  },
});
