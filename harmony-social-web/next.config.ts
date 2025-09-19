import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.bing.net' },
      { protocol: 'https', hostname: '**.tumblr.com' },
    ],
  },
};

export default nextConfig;
