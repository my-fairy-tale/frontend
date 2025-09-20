import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

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
