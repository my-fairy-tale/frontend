import NextAuth, { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import kakaoProvider from 'next-auth/providers/kakao';

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
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        //일단 email  속성 사용안하니까 name에 id값 저장
        session.user.email = token.sub as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
