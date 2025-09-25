import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

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
            throw new Error('sign-in to server error');
          }

          const { id, email, name, accessToken, refreshToken } = data.data;
          user.id = id;
          user.email = email;
          user.name = name;
          user.accessToken = accessToken;
          user.refreshToken = refreshToken;

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
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      }
      // TODO: 여기에 Access Token 만료 시 Refresh Token으로 갱신하는 로직 추가
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = token.user;

      return session;
    },
  },
});
