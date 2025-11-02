import type { NextConfig } from "next";

// Read basePath from environment variable
// Note: .env.local is automatically loaded by Next.js
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  output: 'standalone',
  // Ensure static files are served in production
  trailingSlash: false,
  // Add custom server configuration for static files
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/static/:path*',
      },
    ];
  },
  // basePath automatically prefixes all assets, routes, and static files
  basePath: BASE_PATH || undefined,
  images: {
    // basePath automatically handles image paths
    // add domains: ['...'] if you load remote images
  },
};

export default nextConfig;
