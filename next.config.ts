import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker optimization
  // This creates a minimal production server with only the files needed to run
  output: "standalone",

  // Compress static assets
  compress: true,

  // Optimize images
  images: {
    unoptimized: false,
  },

  // TypeScript configuration
  typescript: {
    // Don't block builds on type errors (we have watch mode for that)
    ignoreBuildErrors: false, // Keep false for CI
  },

  // Optimize development experience
  experimental: {
    // Faster refresh with optimized package imports
    optimizePackageImports: ["lucide-react", "react-aria-components"],
  },

  // Turbopack configuration
  turbopack: {},
};

export default nextConfig;
