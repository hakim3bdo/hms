import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React Strict Mode
  reactStrictMode: true,
  
  // Configure remote image domains if needed
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'housingms.runasp.net',
      },
    ],
  },
};

export default nextConfig;
