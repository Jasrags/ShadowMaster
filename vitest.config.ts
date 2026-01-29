import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./__tests__/setup.ts"],
    globals: true,
    include: ["**/*.test.ts", "**/*.test.tsx"],
    exclude: ["node_modules", ".next", "e2e", "**/node_modules/**", "**/.next/**", "**/dist/**"],
    // Run tests related to changed files
    testTimeout: 5000,
    coverage: {
      provider: "v8",
      enabled: false, // Only run when explicitly requested
      reportsDirectory: "./coverage",
      reporter: ["text", "text-summary", "html", "json", "lcov"],
      include: ["lib/**/*.{ts,tsx}", "app/api/**/*.ts", "components/**/*.{ts,tsx}"],
      exclude: [
        "**/*.test.{ts,tsx}",
        "**/__tests__/**",
        "**/node_modules/**",
        "**/.next/**",
        "**/*.d.ts",
        "lib/types/**",
        "e2e/**",
      ],
      // Initial permissive thresholds
      thresholds: {
        lines: 30,
        functions: 30,
        branches: 25,
        statements: 30,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
