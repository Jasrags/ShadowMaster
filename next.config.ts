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
};

export default nextConfig;
