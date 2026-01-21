/**
 * Visual Consistency Checker
 *
 * Checks for deviations from established visual patterns:
 * - Card structure (rounded-lg border bg-white dark:bg-zinc-900)
 * - Typography patterns (font-medium, text sizes)
 * - Icon sizes (h-4 w-4, h-3.5 w-3.5)
 * - Section header styling
 */

import {
  CARD_PATTERNS,
  TYPOGRAPHY_PATTERNS,
  ICON_SIZES,
  COMPONENT_CATEGORIES,
} from "../patterns/expected-patterns";

// =============================================================================
// TYPES
// =============================================================================

export interface VisualViolation {
  type:
    | "inconsistent-card-structure"
    | "inconsistent-typography"
    | "inconsistent-icon-size"
    | "inconsistent-section-header"
    | "inconsistent-spacing";
  severity: "high" | "medium" | "low";
  line: number;
  column: number;
  code: string;
  message: string;
  expected: string;
  found: string;
}

export interface VisualConsistencyResult {
  filePath: string;
  componentType: string;
  violations: VisualViolation[];
  stats: {
    patternsChecked: number;
    consistentPatterns: number;
    inconsistentPatterns: number;
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

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

/**
 * Determine component type from file path
 */
function getComponentType(filePath: string): string {
  for (const [type, pattern] of Object.entries(COMPONENT_CATEGORIES)) {
    if (pattern.test(filePath)) return type;
  }
  return "other";
}

/**
 * Extract all className values with their positions
 */
function extractClassNames(
  content: string
): Array<{ value: string; index: number; elementTag?: string }> {
  const results: Array<{ value: string; index: number; elementTag?: string }> = [];

  // Match className with element context
  const regex = /<(\w+)[^>]*className=["']([^"']+)["'][^>]*>/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    results.push({
      elementTag: match[1],
      value: match[2],
      index: match.index,
    });
  }

  return results;
}

// =============================================================================
// CHECKERS
// =============================================================================

/**
 * Check card component structure
 */
function checkCardStructure(
  content: string,
  violations: VisualViolation[],
  stats: VisualConsistencyResult["stats"]
): void {
  // Find root card divs (looking for rounded-lg pattern)
  const cardDivRegex = /<div[^>]*className=["'][^"']*rounded-lg[^"']*border[^"']*["'][^>]*>/g;
  let match;

  while ((match = cardDivRegex.exec(content)) !== null) {
    stats.patternsChecked++;
    const className = match[0];

    // Check for expected card pattern
    const hasRoundedLg = /rounded-lg/.test(className);
    const hasBorder = /\bborder\b/.test(className);
    const hasBgWhite = /bg-white/.test(className);
    const hasDarkBg = /dark:bg-zinc-900/.test(className);

    if (hasRoundedLg && hasBorder) {
      if (!hasBgWhite || !hasDarkBg) {
        violations.push({
          type: "inconsistent-card-structure",
          severity: "medium",
          line: getLineNumber(content, match.index),
          column: getColumnNumber(content, match.index),
          code: getCodeSnippet(content, match.index, match[0].length),
          message: "Card container missing expected background classes",
          expected: CARD_PATTERNS.container,
          found: className,
        });
        stats.inconsistentPatterns++;
      } else {
        stats.consistentPatterns++;
      }
    }
  }
}

/**
 * Check heading/title typography
 */
function checkTypography(
  content: string,
  violations: VisualViolation[],
  stats: VisualConsistencyResult["stats"]
): void {
  // Check h3 elements (card titles)
  const h3Regex = /<h3[^>]*className=["']([^"']+)["'][^>]*>/g;
  let match;

  while ((match = h3Regex.exec(content)) !== null) {
    stats.patternsChecked++;
    const className = match[1];

    // Expected: font-medium text-zinc-900 dark:text-zinc-100
    const hasFontMedium = /font-medium/.test(className);
    const hasTextColor = /text-zinc-900/.test(className);
    const hasDarkText = /dark:text-zinc-100/.test(className);

    if (!hasFontMedium || !hasTextColor || !hasDarkText) {
      const missing = [];
      if (!hasFontMedium) missing.push("font-medium");
      if (!hasTextColor) missing.push("text-zinc-900");
      if (!hasDarkText) missing.push("dark:text-zinc-100");

      violations.push({
        type: "inconsistent-typography",
        severity: "medium",
        line: getLineNumber(content, match.index),
        column: getColumnNumber(content, match.index),
        code: getCodeSnippet(content, match.index, match[0].length),
        message: `Heading typography missing: ${missing.join(", ")}`,
        expected: TYPOGRAPHY_PATTERNS.title,
        found: className,
      });
      stats.inconsistentPatterns++;
    } else {
      stats.consistentPatterns++;
    }
  }

  // Check section headers (text-[10px] font-semibold uppercase tracking-wider)
  const sectionHeaderRegex =
    /<span[^>]*className=["']([^"']*text-\[10px\][^"']*)["'][^>]*>|<span[^>]*className=["']([^"']*uppercase[^"']*tracking-wider[^"']*)["'][^>]*>/g;

  while ((match = sectionHeaderRegex.exec(content)) !== null) {
    stats.patternsChecked++;
    const className = match[1] || match[2];

    // Check for complete section header pattern
    const hasSmallText = /text-\[10px\]/.test(className);
    const hasSemibold = /font-semibold/.test(className);
    const hasUppercase = /uppercase/.test(className);
    const hasTracking = /tracking-wider/.test(className);

    if (hasSmallText || (hasUppercase && hasTracking)) {
      // This appears to be a section header, check completeness
      const missing = [];
      if (!hasSmallText) missing.push("text-[10px]");
      if (!hasSemibold) missing.push("font-semibold");
      if (!hasUppercase) missing.push("uppercase");
      if (!hasTracking) missing.push("tracking-wider");

      if (missing.length > 0) {
        violations.push({
          type: "inconsistent-section-header",
          severity: "low",
          line: getLineNumber(content, match.index),
          column: getColumnNumber(content, match.index),
          code: getCodeSnippet(content, match.index, match[0].length),
          message: `Section header missing: ${missing.join(", ")}`,
          expected: TYPOGRAPHY_PATTERNS.sectionHeader,
          found: className,
        });
        stats.inconsistentPatterns++;
      } else {
        stats.consistentPatterns++;
      }
    }
  }
}

/**
 * Check icon sizing consistency
 */
function checkIconSizes(
  content: string,
  violations: VisualViolation[],
  stats: VisualConsistencyResult["stats"]
): void {
  // Find icon components from lucide-react
  const iconRegex =
    /<(?:Wifi|WifiOff|ChevronDown|ChevronRight|ChevronUp|ChevronLeft|Check|X|Plus|Minus|AlertTriangle|AlertCircle|Info|HelpCircle|ExternalLink|Edit|Trash|Trash2|Settings|MoreHorizontal|MoreVertical|Search|Filter|ArrowRight|ArrowLeft|ArrowUp|ArrowDown)[^>]*className=["']([^"']+)["'][^>]*\/>/g;
  let match;

  while ((match = iconRegex.exec(content)) !== null) {
    stats.patternsChecked++;
    const className = match[1];

    // Check for standard icon sizes
    const allSizes = [...ICON_SIZES.standard, ...ICON_SIZES.small, ...ICON_SIZES.xsmall];
    const hasValidSize = allSizes.some((size) => className.includes(size));

    // Check for non-standard sizes
    const sizeMatches = className.match(/\bh-\d+(?:\.\d+)?\b|\bw-\d+(?:\.\d+)?\b/g) || [];

    if (sizeMatches.length > 0 && !hasValidSize) {
      violations.push({
        type: "inconsistent-icon-size",
        severity: "low",
        line: getLineNumber(content, match.index),
        column: getColumnNumber(content, match.index),
        code: getCodeSnippet(content, match.index, match[0].length),
        message: "Icon using non-standard size",
        expected: `Standard: ${ICON_SIZES.standard.join(" ")}, Small: ${ICON_SIZES.small.join(" ")}`,
        found: sizeMatches.join(" "),
      });
      stats.inconsistentPatterns++;
    } else if (hasValidSize) {
      stats.consistentPatterns++;
    }
  }
}

/**
 * Check spacing consistency
 */
function checkSpacing(
  content: string,
  violations: VisualViolation[],
  stats: VisualConsistencyResult["stats"]
): void {
  // Check for inconsistent padding/margin on similar elements
  const classNames = extractClassNames(content);

  // Group by element tag
  const byElement = new Map<string, string[]>();
  for (const { elementTag, value } of classNames) {
    if (!elementTag) continue;
    if (!byElement.has(elementTag)) {
      byElement.set(elementTag, []);
    }
    byElement.get(elementTag)!.push(value);
  }

  // Check for inconsistent spacing patterns within same element types
  for (const [element, classes] of byElement) {
    if (element === "div" || element === "span" || element === "button") {
      // Extract padding values
      const paddingValues = new Set<string>();
      for (const cls of classes) {
        const padding = cls.match(/\bp-\d+(?:\.\d+)?|\bpx-\d+(?:\.\d+)?|\bpy-\d+(?:\.\d+)?/g);
        if (padding) {
          padding.forEach((p) => paddingValues.add(p));
        }
      }

      // Flag if there are many different padding values (might indicate inconsistency)
      // This is a soft check, not creating violations here
      stats.patternsChecked++;
      if (paddingValues.size <= 3) {
        stats.consistentPatterns++;
      }
    }
  }
}

// =============================================================================
// MAIN CHECKER
// =============================================================================

/**
 * Run visual consistency checks on a file
 */
export function checkVisualConsistency(filePath: string, content: string): VisualConsistencyResult {
  const componentType = getComponentType(filePath);
  const violations: VisualViolation[] = [];
  const stats = {
    patternsChecked: 0,
    consistentPatterns: 0,
    inconsistentPatterns: 0,
  };

  // Run all checks
  checkCardStructure(content, violations, stats);
  checkTypography(content, violations, stats);
  checkIconSizes(content, violations, stats);
  checkSpacing(content, violations, stats);

  return {
    filePath,
    componentType,
    violations,
    stats,
  };
}
