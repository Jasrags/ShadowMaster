import type { KnipConfig } from "knip";

const config: KnipConfig = {
  // Plugins are auto-detected based on package.json dependencies:
  // - next (Next.js plugin)
  // - react (React plugin)
  // - typescript (TypeScript plugin)
  // - vitest (Vitest plugin)
  // - @playwright/test (Playwright plugin)
  // - eslint (ESLint plugin)
  // - postcss (PostCSS plugin)
  // - vite (via vitest, Vite plugin)

  // Entry points for Next.js App Router
  entry: [
    "app/**/{page,layout,loading,error,not-found,template,default,route,opengraph-image,icon,apple-icon,manifest}.{ts,tsx}",
    "scripts/**/*.ts",
    "tools/**/*.mjs",
  ],

  // Project files to analyze
  project: [
    "app/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "scripts/**/*.ts",
    "tools/**/*.mjs",
  ],

  // Ignore patterns
  ignore: [
    "**/*.test.{ts,tsx}",
    "**/*.spec.{ts,tsx}",
    "**/__tests__/**",
    "**/e2e/**",
    "**/node_modules/**",
    "**/.next/**",
    "**/dist/**",
    "**/build/**",
    "**/data/**",
    "**/docs/**",
    "**/test-results/**",
    "**/playwright-report/**",
    "**/.eslintcache/**",
    "next-env.d.ts",
    "tsconfig.tsbuildinfo",
  ],

  // Path aliases (matching tsconfig.json)
  paths: {
    "@/*": ["./*"],
  },

  // Ignore dependencies that are used but not imported directly
  ignoreDependencies: [
    // Next.js internal dependencies
    "eslint-config-next",
    // server-only is used via Next.js convention (prevents client-side imports)
    "server-only",
    // MCP servers are used by the MCP system, not directly imported
    "@knip/mcp",
    "@modelcontextprotocol/server-filesystem",
    "@modelcontextprotocol/server-memory",
    "@modelcontextprotocol/server-sequential-thinking",
    "next-devtools-mcp",
    // Build tools (used by config files, not imported in code)
    "@vitejs/plugin-react", // Used in vitest.config.ts
    "@vitest/ui", // Used via Vitest CLI
    // Type definitions that might be used indirectly
    "@types/node",
    "@types/react",
    "@types/react-dom",
    // Testing libraries are used in test files (which we ignore)
    "@testing-library/react",
    "@testing-library/user-event",
    // Type stubs (bcryptjs and uuid provide their own types)
    "@types/bcryptjs",
    "@types/uuid",
    // Tailwind is used via PostCSS (Tailwind v4)
    "tailwindcss",
    "@tailwindcss/postcss", // Tailwind v4 PostCSS plugin
    // Development tools (used in scripts/config, not imported)
    "nodemon", // Used in lint:watch script
    "concurrently", // Used in dev:all script
    "husky", // Used for git hooks
    "lint-staged", // Used in package.json lint-staged config
  ],

  // Ignore specific exports that are used but not detected
  ignoreExportsUsedInFile: true,
};

export default config;
