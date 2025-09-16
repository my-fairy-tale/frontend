import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import AuthProvider from '@/components/auth-provider';

export const metadata: Metadata = {
  title: 'my fairy tale',
  description: 'A platform to share and explore fairy tales',
};

const pretendard = localFont({
  src: './fonts/PretendardVariable.ttf',
  display: 'swap',
  weight: '45 920',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
