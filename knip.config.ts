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
    // Test files
    "**/*.test.{ts,tsx}",
    "**/*.spec.{ts,tsx}",
    "**/__tests__/**",
    "**/e2e/**",

    // Build artifacts
    "**/node_modules/**",
    "**/.next/**",
    "**/dist/**",
    "**/build/**",
    "**/test-results/**",
    "**/playwright-report/**",
    "**/.eslintcache/**",
    "next-env.d.ts",
    "tsconfig.tsbuildinfo",

    // Non-code directories
    "**/data/**",
    "**/docs/**",

    // Work-in-progress gameplay features (not yet integrated into UI)
    // These are complete modules awaiting character sheet integration
    "app/campaigns/[id]/components/CampaignSessionsTab.tsx", // Campaign sessions UI
    "app/characters/[id]/components/ActionResultToast.tsx", // Combat action feedback
    "app/characters/[id]/components/AugmentationsPanel.tsx", // Augmentations display
    "app/characters/[id]/components/CombatModeIndicator.tsx", // Combat state indicator
    "app/characters/[id]/components/CombatTrackerModal.tsx", // Initiative tracker
    "components/AugmentationCard.tsx", // Augmentation display card
    "components/EssenceDisplay.tsx", // Essence meter component
    "components/character/**", // Character sheet sub-components (Matrix, Rigging, Magic)
    "components/combat/**", // Combat UI components
    "components/cyberlimbs/**", // Cyberlimb management UI

    // Work-in-progress rules engines (complete, awaiting UI integration)
    "lib/migrations/**", // Data migration utilities
    "lib/rules/augmentations/**", // Augmentation rules (used by API, not UI)
    "lib/rules/contact-network.ts", // Contact networking rules
    "lib/rules/gear/index.ts", // Gear barrel (submodules used directly)
    "lib/rules/matrix/**", // Matrix action rules
    "lib/rules/rigging/**", // Rigging/drone rules
    "lib/rules/sync/**", // Character sync/migration rules
  ],

  // Path aliases (matching tsconfig.json)
  paths: {
    "@/*": ["./*"],
  },

  // Ignore dependencies that are used but not imported directly
  // Note: Many dependencies are now auto-detected by Knip plugins
  ignoreDependencies: [
    // server-only is used via Next.js convention (prevents client-side imports)
    "server-only",
    // MCP servers and SDK are used by the MCP system, not directly imported
    "@knip/mcp",
    "@modelcontextprotocol/sdk",
    "@modelcontextprotocol/server-filesystem",
    "@modelcontextprotocol/server-memory",
    "@modelcontextprotocol/server-sequential-thinking",
    "next-devtools-mcp",
    // Type stubs (bcryptjs and uuid provide their own types)
    "@types/bcryptjs",
    "@types/uuid",
    // Tailwind v4 is used via @tailwindcss/postcss plugin, not imported directly
    "tailwindcss",
  ],

  // Ignore specific exports that are used but not detected
  ignoreExportsUsedInFile: true,
};

export default config;
