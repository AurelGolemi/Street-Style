import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Image optimization (use remotePatterns instead of domains)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/**" },
      { protocol: "https", hostname: "your-cdn-domain.com", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"], // Modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Responsive breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Icon sizes
  },

  // Tell Turbopack what the workspace root is to silence the multiple lockfile warning
  turbopack: {
    // Use the project directory (explicit) to avoid resolving to parent user folders
    root: path.resolve(__dirname),
  },

  // Enable compression
  compress: true,

  // React strict mode for better development
  reactStrictMode: true,

  // Optimize production builds

  // Generate static pages for products
  experimental: {
    optimizeCss: true, // Enable CSS optimization
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      // Cache static assets
      {
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
