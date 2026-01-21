import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import GlobalModal from '@/components/ui/modal/global-modal';
import ReactQueryProvider from '@/components/provider/react-query-provider';
import AuthProvider from '@/components/provider/auth-provider';
import { auth } from '@/auth';
import MobileFooter from '@/components/layout/mobile-footer';

export const metadata: Metadata = {
  title: 'my fairy tale',
  description: 'A platform to share and explore fairy tales',
};

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
  preload: true,
  fallback: [
    'system-ui',
    '-apple-system',
    'Segoe UI',
    'Apple SD Gothic Neo',
    'sans-serif',
  ],
  adjustFontFallback: 'Arial',
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="ko">
      <body
        className={`${pretendard.className} flex flex-col items-center min-h-screen antialiased pt-16 pb-16`}
      >
        <AuthProvider session={session}>
          <ReactQueryProvider>
            <Header />
            {children}
            <GlobalModal />
            <MobileFooter />
            <Footer />
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
