import { withSentryConfig } from "@sentry/nextjs";
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

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "na-k6l",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
