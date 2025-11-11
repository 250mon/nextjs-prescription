import type { NextConfig } from "next";

// Read basePath from environment variable
// Note: .env.local is automatically loaded by Next.js
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  output: 'standalone',
  // Ensure static files are served in production
  trailingSlash: false,

  // Mount the app at the base path
  basePath: BASE_PATH || undefined,
  
  // Add custom server configuration for static files
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/static/:path*',
      },
    ];
  },

  images: {
    // basePath automatically handles image paths
    // add domains: ['...'] if you load remote images
  },
};

export default nextConfig;
