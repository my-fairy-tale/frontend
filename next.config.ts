import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'childrens-book-files.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/**', // 해당 호스트의 모든 경로 이미지를 허용
      },
      // 여기에 다른 이미지 도메인을 필요에 따라 추가할 수 있습니다.
      // {
      //   protocol: 'https',
      //   hostname: 'another-domain.com',
      // },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/api/v1/files/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/files/:path*`, // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
