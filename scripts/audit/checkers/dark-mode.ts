/**
 * Dark Mode Checker
 *
 * Checks for missing dark mode class pairs:
 * - text-zinc-900 should have dark:text-zinc-100
 * - bg-white should have dark:bg-zinc-900
 * - border-zinc-200 should have dark:border-zinc-700
 */

import { DARK_MODE_PAIRS, EXEMPT_FROM_DARK_PAIRS } from "../patterns/expected-patterns";

// =============================================================================
// TYPES
// =============================================================================

export interface DarkModeViolation {
  type: "missing-dark-pair";
  severity: "high" | "medium";
  line: number;
  column: number;
  code: string;
  lightClass: string;
  expectedDarkClass: string;
  message: string;
}

export interface DarkModeResult {
  filePath: string;
  violations: DarkModeViolation[];
  stats: {
    classesChecked: number;
    pairedClasses: number;
    missingPairs: number;
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
 * Extract all className values from content
 * Returns array of { value: string, index: number }
 */
function extractClassNames(
  content: string
): Array<{ value: string; index: number; fullMatch: string }> {
  const results: Array<{ value: string; index: number; fullMatch: string }> = [];

  // Match className="..." or className='...' or className={`...`}
  const patterns = [
    /className=["']([^"']+)["']/g,
    /className=\{`([^`]+)`\}/g,
    /className=\{[^}]*["']([^"']+)["'][^}]*\}/g,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      results.push({
        value: match[1],
        index: match.index,
        fullMatch: match[0],
      });
    }
  }

  return results;
}

/**
 * Parse classes from a className string
 * Handles template literals and conditional classes
 */
function parseClasses(classString: string): string[] {
  // Split by whitespace and filter out template syntax
  return classString
    .split(/\s+/)
    .filter((c) => c.length > 0)
    .filter((c) => !c.includes("${")) // Skip template expressions
    .filter((c) => !c.includes("?")) // Skip ternary expressions
    .filter((c) => !c.includes(":")); // We'll handle dark: separately
}

/**
 * Check if a class is exempt from dark mode pairing
 */
function isExemptClass(className: string): boolean {
  // Check direct exemptions
  if (EXEMPT_FROM_DARK_PAIRS.includes(className)) return true;

  // Check pattern exemptions
  const exemptPatterns = [
    /^dark:/, // Already a dark mode class
    /^hover:dark:/, // Hover dark variants
    /^focus:/, // Focus states
    /^active:/, // Active states
    /^disabled:/, // Disabled states
    /^group-/, // Group modifiers
    /^peer-/, // Peer modifiers
    /^data-/, // Data attribute modifiers
    /^aria-/, // ARIA attribute modifiers
    /^motion-/, // Motion modifiers
    /^print:/, // Print modifiers
    /^contrast-/, // Contrast utilities
    /opacity-/, // Opacity utilities don't need dark pairs
    /^z-/, // Z-index
    /^order-/, // Flexbox order
    /^col-/, // Grid columns
    /^row-/, // Grid rows
    /^gap-/, // Gaps
    /^p[xylrtb]?-/, // Padding (unless colored)
    /^m[xylrtb]?-/, // Margin
    /^space-/, // Space utilities
    /^w-/, // Width
    /^h-/, // Height
    /^min-/, // Min width/height
    /^max-/, // Max width/height
    /^flex/, // Flex utilities
    /^grid/, // Grid utilities
    /^items-/, // Align items
    /^justify-/, // Justify
    /^self-/, // Align self
    /^place-/, // Place utilities
    /^font-/, // Font utilities (mostly size/weight)
    /^text-\[/, // Arbitrary text values
    /^text-(xs|sm|base|lg|xl|2xl|3xl)/, // Text size
    /^leading-/, // Line height
    /^tracking-/, // Letter spacing
    /^rounded/, // Border radius
    /^overflow/, // Overflow
    /^truncate/, // Truncate
    /^whitespace/, // Whitespace
    /^break-/, // Word break
    /^transition/, // Transitions
    /^duration-/, // Duration
    /^ease-/, // Easing
    /^delay-/, // Delay
    /^animate-/, // Animations
    /^transform/, // Transform
    /^scale-/, // Scale
    /^rotate-/, // Rotate
    /^translate-/, // Translate
    /^skew-/, // Skew
    /^origin-/, // Transform origin
    /^cursor-/, // Cursor
    /^select-/, // User select
    /^resize/, // Resize
    /^appearance-/, // Appearance
    /^pointer-events-/, // Pointer events
    /^outline-/, // Outline (when not color)
    /^ring-offset-\d/, // Ring offset size
    /^ring-\d/, // Ring size
    /^shadow-(?!zinc|gray|slate|neutral|stone)/, // Shadow size only
    /^inset/, // Positioning
    /^top-/, // Top
    /^right-/, // Right
    /^bottom-/, // Bottom
    /^left-/, // Left
    /^static|^fixed|^absolute|^relative|^sticky/, // Position
    /^visible|^invisible/, // Visibility
    /^sr-only/, // Screen reader only
    /^not-sr-only/, // Not screen reader only
  ];

  return exemptPatterns.some((pattern) => pattern.test(className));
}

/**
 * Get severity based on class type
 */
function getSeverity(lightClass: string): "high" | "medium" {
  // High severity for critical visual elements
  if (lightClass.startsWith("text-zinc-9") || lightClass.startsWith("text-zinc-8")) {
    return "high"; // Main text colors
  }
  if (lightClass === "bg-white" || lightClass.startsWith("bg-zinc-")) {
    return "high"; // Background colors
  }
  if (lightClass.startsWith("border-zinc-")) {
    return "medium"; // Border colors
  }
  return "medium";
}

// =============================================================================
// MAIN CHECKER
// =============================================================================

/**
 * Run dark mode checks on a file
 */
export function checkDarkMode(filePath: string, content: string): DarkModeResult {
  const violations: DarkModeViolation[] = [];
  const stats = {
    classesChecked: 0,
    pairedClasses: 0,
    missingPairs: 0,
  };

  // Extract all className declarations
  const classNameMatches = extractClassNames(content);

  for (const { value: classString, index, fullMatch } of classNameMatches) {
    // Get all classes in this className
    const allClasses = classString.split(/\s+/).filter((c) => c.length > 0);

    // Get dark mode classes present
    const darkClasses = allClasses.filter((c) => c.startsWith("dark:"));
    const darkClassSet = new Set(darkClasses);

    // Get light mode classes (non-dark prefixed)
    const lightClasses = parseClasses(classString);

    for (const lightClass of lightClasses) {
      stats.classesChecked++;

      // Skip exempt classes
      if (isExemptClass(lightClass)) continue;

      // Check if this class needs a dark mode pair
      const expectedDark = DARK_MODE_PAIRS[lightClass];
      if (!expectedDark) continue; // No defined pair for this class

      // Check if the dark pair is present
      if (darkClassSet.has(expectedDark)) {
        stats.pairedClasses++;
        continue;
      }

      // Also check for close variants (e.g., dark:text-zinc-200 when expecting dark:text-zinc-100)
      const hasVariant = darkClasses.some((dc) => {
        const dcValue = dc.replace("dark:", "");
        // Check if it's the same property type
        const lightProp = lightClass.split("-").slice(0, -1).join("-");
        const darkProp = dcValue.split("-").slice(0, -1).join("-");
        return lightProp === darkProp;
      });

      if (hasVariant) {
        stats.pairedClasses++;
        continue;
      }

      // Missing dark mode pair
      stats.missingPairs++;

      violations.push({
        type: "missing-dark-pair",
        severity: getSeverity(lightClass),
        line: getLineNumber(content, index),
        column: getColumnNumber(content, index),
        code: getCodeSnippet(content, index, fullMatch.length),
        lightClass,
        expectedDarkClass: expectedDark,
        message: `Missing dark mode pair for "${lightClass}"`,
      });
    }
  }

  return {
    filePath,
    violations,
    stats,
  };
}
