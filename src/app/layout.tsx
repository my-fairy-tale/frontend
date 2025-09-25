import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import GlobalModal from '@/components/ui/modal/global-modal';
import ReactQueryProvider from '@/components/provider/react-query-provider';

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
      <body className="flex flex-col h-screen antialiased">
        <ReactQueryProvider>
          <Header />
          {children}
          <GlobalModal />
          <Footer />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
