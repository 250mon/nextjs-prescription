import type { NextConfig } from "next";

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

  images: {
    // add domains: ['...'] if you load remote images
  },
};

export default nextConfig;
