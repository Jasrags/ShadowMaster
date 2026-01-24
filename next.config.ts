import type { NextConfig } from "next";
import { execSync } from "child_process";

// Get git SHA at build time
// Prefers NEXT_PUBLIC_GIT_SHA env var (for Docker builds), falls back to git command
function getGitSha(): string {
  // Check for pre-set value (Docker builds pass this as build arg)
  if (process.env.NEXT_PUBLIC_GIT_SHA && process.env.NEXT_PUBLIC_GIT_SHA !== "unknown") {
    return process.env.NEXT_PUBLIC_GIT_SHA;
  }
  // Fall back to git command (local development)
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch {
    return "unknown";
  }
}

// Get version from package.json
function getVersion(): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pkg = require("./package.json");
    return pkg.version || "0.0.0";
  } catch {
    return "0.0.0";
  }
}

const nextConfig: NextConfig = {
  // Inject build-time environment variables
  env: {
    NEXT_PUBLIC_APP_VERSION: getVersion(),
    NEXT_PUBLIC_GIT_SHA: getGitSha(),
    NEXT_PUBLIC_BUILD_DATE: new Date().toISOString(),
  },
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
