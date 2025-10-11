import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'childrens-book-files.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
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
