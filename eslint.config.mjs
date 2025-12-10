import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Custom rule overrides - downgrade some errors to warnings for CI
  {
    rules: {
      // React Compiler memoization issues - downgrade to warning
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/error-boundaries": "warn",
      // Next.js module variable assignment - downgrade to warning
      "@next/next/no-assign-module-variable": "warn",
      // Unescaped entities - downgrade to warning
      "react/no-unescaped-entities": "warn",
    },
  },
]);

export default eslintConfig;

