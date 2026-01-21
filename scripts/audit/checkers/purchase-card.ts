/**
 * Purchase Card Pattern Checker
 *
 * Checks that purchase/selection card components follow the established pattern:
 * - Amber add buttons (not full-width dashed, not category-colored)
 * - Proper empty state (dashed border box with descriptive text)
 * - Category section headers with count badges
 * - Consistent item row structure
 *
 * Reference: docs/patterns/purchase-card-pattern.md
 */

import {
  PURCHASE_CARD_FILE_PATTERNS,
  ADD_BUTTON_PATTERN,
  EMPTY_STATE_PATTERN,
  CATEGORY_HEADER_PATTERN,
} from "../patterns/expected-patterns";

// =============================================================================
// TYPES
// =============================================================================

export interface PurchaseCardViolation {
  type:
    | "wrong-add-button-style"
    | "full-width-add-button"
    | "wrong-empty-state"
    | "missing-category-header"
    | "missing-empty-state";
  severity: "high" | "medium" | "low";
  line: number;
  column: number;
  code: string;
  message: string;
  expected: string;
  found: string;
  suggestion?: string;
}

export interface PurchaseCardResult {
  filePath: string;
  isPurchaseCard: boolean;
  violations: PurchaseCardViolation[];
  stats: {
    checksPerformed: number;
    passed: number;
    failed: number;
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Check if file is a purchase card component
 */
function isPurchaseCardComponent(filePath: string): boolean {
  return PURCHASE_CARD_FILE_PATTERNS.some((pattern) => pattern.test(filePath));
}

/**
 * Get line number for a character index in content
 */
function getLineNumber(content: string, index: number): number {
  return content.substring(0, index).split("\n").length;
}

/**
 * Get column number for a character index in content
 */
function getColumnNumber(content: string, index: number): number {
  const lastNewline = content.lastIndexOf("\n", index);
  return index - lastNewline;
}

/**
 * Extract code snippet around a match
 */
function getCodeSnippet(content: string, index: number, length: number = 80): string {
  const start = Math.max(0, index - 20);
  const end = Math.min(content.length, index + length + 20);
  let snippet = content.substring(start, end);

  snippet = snippet.replace(/\s+/g, " ").trim();
  if (start > 0) snippet = "..." + snippet;
  if (end < content.length) snippet = snippet + "...";

  return snippet;
}

// =============================================================================
// CHECKERS
// =============================================================================

/**
 * Check for incorrect add button patterns
 */
function checkAddButtons(
  content: string,
  violations: PurchaseCardViolation[],
  stats: PurchaseCardResult["stats"]
): void {
  // Two-step approach to avoid cross-boundary matching:
  // 1. Find all button elements with className
  // 2. Check if they contain "Add" text or Plus icon
  const buttonRegex = /<button[\s\S]*?className=["']([^"']+)["'][\s\S]*?<\/button>/gi;

  let match;
  while ((match = buttonRegex.exec(content)) !== null) {
    const fullMatch = match[0];

    // Check if this button contains "Add" text or Plus icon
    const hasPlus = fullMatch.includes("<Plus");
    const hasAdd = /\bAdd\b/.test(fullMatch);

    // Skip buttons that don't have Add/Plus (e.g., remove buttons, toggle buttons)
    if (!hasPlus && !hasAdd) {
      continue;
    }

    stats.checksPerformed++;
    const className = match[1];
    const line = getLineNumber(content, match.index);

    // Check for full-width dashed button (anti-pattern)
    if (/w-full/.test(className) && /border-dashed/.test(className)) {
      violations.push({
        type: "full-width-add-button",
        severity: "high",
        line,
        column: getColumnNumber(content, match.index),
        code: getCodeSnippet(content, match.index, fullMatch.length),
        message: "Add button uses full-width dashed style (anti-pattern)",
        expected: "Compact amber button in category header: bg-amber-500 px-2 py-1 text-xs",
        found: "Full-width dashed button",
        suggestion:
          "Move add button to category section header and use: bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 text-xs",
      });
      stats.failed++;
      continue;
    }

    // Check for wrong colors (category-specific instead of amber)
    const wrongColors = ADD_BUTTON_PATTERN.forbidden.filter((pattern) =>
      new RegExp(pattern).test(className)
    );

    if (wrongColors.length > 0) {
      violations.push({
        type: "wrong-add-button-style",
        severity: "high",
        line,
        column: getColumnNumber(content, match.index),
        code: getCodeSnippet(content, match.index, fullMatch.length),
        message: "Add button uses non-standard colors",
        expected: "bg-amber-500 hover:bg-amber-600 text-white",
        found: wrongColors.join(", "),
        suggestion: "Replace category-specific colors with amber: bg-amber-500 hover:bg-amber-600",
      });
      stats.failed++;
      continue;
    }

    // Check for correct amber styling
    const hasAmberBg = /bg-amber-500/.test(className);
    const hasAmberHover = /hover:bg-amber-600/.test(className);
    const hasWhiteText = /text-white/.test(className);

    if (!hasAmberBg || !hasAmberHover || !hasWhiteText) {
      const missing = [];
      if (!hasAmberBg) missing.push("bg-amber-500");
      if (!hasAmberHover) missing.push("hover:bg-amber-600");
      if (!hasWhiteText) missing.push("text-white");

      violations.push({
        type: "wrong-add-button-style",
        severity: "medium",
        line,
        column: getColumnNumber(content, match.index),
        code: getCodeSnippet(content, match.index, fullMatch.length),
        message: `Add button missing required classes: ${missing.join(", ")}`,
        expected: "bg-amber-500 hover:bg-amber-600 text-white",
        found: className,
      });
      stats.failed++;
      continue;
    }

    stats.passed++;
  }
}

/**
 * Check for proper empty state pattern
 */
function checkEmptyState(
  content: string,
  violations: PurchaseCardViolation[],
  stats: PurchaseCardResult["stats"]
): void {
  // Find empty state containers (dashed border divs with text)
  const emptyStateRegex =
    /<div[^>]*className=["']([^"']*border-dashed[^"']*)["'][^>]*>[\s\S]*?<\/div>/gi;

  let match;
  let foundValidEmptyState = false;

  while ((match = emptyStateRegex.exec(content)) !== null) {
    stats.checksPerformed++;
    const className = match[1];
    const fullMatch = match[0];
    const line = getLineNumber(content, match.index);

    // Check if this is an empty state (not an add button)
    const isButton = /<button/.test(fullMatch) || /onClick/.test(fullMatch);

    if (isButton) {
      // This is a clickable element styled as empty state - might be an anti-pattern
      // Only flag if it looks like it's meant to be an "add" action
      if (/Add|Plus/.test(fullMatch)) {
        violations.push({
          type: "wrong-empty-state",
          severity: "high",
          line,
          column: getColumnNumber(content, match.index),
          code: getCodeSnippet(content, match.index, Math.min(fullMatch.length, 100)),
          message: "Empty state styled as clickable add button",
          expected: "Empty state should be informational only; add button in category header",
          found: "Clickable dashed container",
          suggestion:
            "Separate empty state (non-clickable) from add functionality (amber button in header)",
        });
        stats.failed++;
        continue;
      }
    }

    // Check for required classes
    const hasBorder2 = /border-2/.test(className);
    const hasDashed = /border-dashed/.test(className);
    const hasZincBorder = /border-zinc-200/.test(className);
    const hasDarkBorder = /dark:border-zinc-700/.test(className);
    const hasTextCenter = /text-center/.test(className);

    if (hasBorder2 && hasDashed) {
      const missing = [];
      if (!hasZincBorder) missing.push("border-zinc-200");
      if (!hasDarkBorder) missing.push("dark:border-zinc-700");
      if (!hasTextCenter) missing.push("text-center");

      if (missing.length > 0) {
        violations.push({
          type: "wrong-empty-state",
          severity: "low",
          line,
          column: getColumnNumber(content, match.index),
          code: getCodeSnippet(content, match.index, Math.min(fullMatch.length, 80)),
          message: `Empty state missing classes: ${missing.join(", ")}`,
          expected: EMPTY_STATE_PATTERN.container.required.join(" "),
          found: className,
        });
        stats.failed++;
      } else {
        foundValidEmptyState = true;
        stats.passed++;
      }
    }
  }

  // Check for proper empty state text
  if (foundValidEmptyState) {
    const hasProperText = EMPTY_STATE_PATTERN.textPatterns.some((pattern) => pattern.test(content));
    if (!hasProperText) {
      stats.checksPerformed++;
      // This is a soft warning - empty state exists but text might not match pattern
      violations.push({
        type: "wrong-empty-state",
        severity: "low",
        line: 0,
        column: 0,
        code: "",
        message:
          "Empty state text should follow pattern: 'No {items} purchased' or 'No {items} selected'",
        expected: "Text like: 'No weapons purchased', 'No spells selected'",
        found: "Text not matching expected pattern",
      });
      stats.failed++;
    }
  }
}

/**
 * Check for category section header pattern
 */
function checkCategoryHeader(
  content: string,
  violations: PurchaseCardViolation[],
  stats: PurchaseCardResult["stats"]
): void {
  // Look for section headers with uppercase tracking-wider text
  const headerRegex =
    /<(?:div|button)[^>]*className=["']([^"']*(?:uppercase|tracking-wider)[^"']*)["'][^>]*>/gi;

  let match;
  while ((match = headerRegex.exec(content)) !== null) {
    const className = match[1];

    // Check if this looks like a category header
    const hasUppercase = /uppercase/.test(className);
    const hasTracking = /tracking-wider/.test(className);
    const hasFontSemibold = /font-semibold/.test(className);
    const hasSmallText = /text-xs/.test(className);

    if (hasUppercase && hasTracking) {
      stats.checksPerformed++;

      const missing = [];
      if (!hasFontSemibold) missing.push("font-semibold");
      if (!hasSmallText) missing.push("text-xs");

      if (missing.length > 0) {
        violations.push({
          type: "missing-category-header",
          severity: "low",
          line: getLineNumber(content, match.index),
          column: getColumnNumber(content, match.index),
          code: getCodeSnippet(content, match.index, match[0].length),
          message: `Category header missing: ${missing.join(", ")}`,
          expected: CATEGORY_HEADER_PATTERN.title.required.join(" "),
          found: className,
        });
        stats.failed++;
      } else {
        stats.passed++;
      }
    }
  }
}

// =============================================================================
// MAIN CHECKER
// =============================================================================

/**
 * Run purchase card pattern checks on a file
 */
export function checkPurchaseCard(filePath: string, content: string): PurchaseCardResult {
  const isPurchaseCard = isPurchaseCardComponent(filePath);
  const violations: PurchaseCardViolation[] = [];
  const stats = {
    checksPerformed: 0,
    passed: 0,
    failed: 0,
  };

  // Only run detailed checks on purchase card components
  if (isPurchaseCard) {
    checkAddButtons(content, violations, stats);
    checkEmptyState(content, violations, stats);
    checkCategoryHeader(content, violations, stats);
  }

  return {
    filePath,
    isPurchaseCard,
    violations,
    stats,
  };
}
