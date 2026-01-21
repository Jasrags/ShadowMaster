/**
 * Responsive Design Checker
 *
 * Checks for responsive design patterns:
 * - Modal max-width constraints
 * - Grid responsive breakpoints
 * - Touch target sizes
 * - Breakpoint usage patterns
 */

import {
  BREAKPOINTS,
  MODAL_MAX_WIDTHS,
  MIN_TOUCH_TARGETS,
  COMPONENT_CATEGORIES,
} from "../patterns/expected-patterns";

// =============================================================================
// TYPES
// =============================================================================

export interface ResponsiveViolation {
  type:
    | "modal-missing-max-width"
    | "grid-missing-responsive"
    | "touch-target-too-small"
    | "missing-mobile-consideration";
  severity: "high" | "medium" | "low";
  line: number;
  column: number;
  code: string;
  message: string;
  suggestion: string;
}

export interface ResponsiveResult {
  filePath: string;
  isModal: boolean;
  violations: ResponsiveViolation[];
  stats: {
    breakpointsFound: Set<string>;
    gridsChecked: number;
    touchTargetsChecked: number;
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
 * Check if file is a modal component
 */
function isModalComponent(filePath: string): boolean {
  return COMPONENT_CATEGORIES.modals.test(filePath);
}

/**
 * Find all breakpoints used in the file
 */
function findBreakpoints(content: string): Set<string> {
  const found = new Set<string>();

  for (const bp of BREAKPOINTS) {
    if (content.includes(bp)) {
      found.add(bp.replace(":", ""));
    }
  }

  return found;
}

// =============================================================================
// CHECKERS
// =============================================================================

/**
 * Check modal components for max-width constraints
 */
function checkModalMaxWidth(content: string, violations: ResponsiveViolation[]): void {
  // Find modal dialog content containers
  // Look for common modal patterns: DialogContent, modal overlays, etc.
  const modalContentPatterns = [
    /<div[^>]*className=["'][^"']*(?:fixed|absolute)[^"']*inset[^"']*["'][^>]*>/g,
    /<DialogContent[^>]*>/g,
    /role=["']dialog["']/g,
  ];

  for (const pattern of modalContentPatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      // Find the className in this element or nearby
      const surroundingContent = content.substring(
        match.index,
        Math.min(content.length, match.index + 500)
      );

      // Check for max-width constraint
      const hasMaxWidth = MODAL_MAX_WIDTHS.some((mw) => surroundingContent.includes(mw));

      if (!hasMaxWidth) {
        // Check if it's the actual modal content (not just overlay)
        const isOverlay =
          /bg-black\/|bg-zinc-900\/|backdrop-blur/.test(surroundingContent) &&
          !surroundingContent.includes("rounded");

        if (!isOverlay) {
          violations.push({
            type: "modal-missing-max-width",
            severity: "high",
            line: getLineNumber(content, match.index),
            column: getColumnNumber(content, match.index),
            code: getCodeSnippet(content, match.index, 100),
            message: "Modal content missing max-width constraint",
            suggestion: `Add max-width class (e.g., ${MODAL_MAX_WIDTHS.slice(2, 5).join(", ")})`,
          });
        }
      }
    }
  }
}

/**
 * Check grid layouts for responsive breakpoints
 */
function checkGridResponsiveness(
  content: string,
  violations: ResponsiveViolation[],
  stats: ResponsiveResult["stats"]
): void {
  // Find grid layouts
  const gridRegex = /<div[^>]*className=["']([^"']*\bgrid\b[^"']*)["'][^>]*>/g;
  let match;

  while ((match = gridRegex.exec(content)) !== null) {
    stats.gridsChecked++;
    const className = match[1];

    // Check if it has grid-cols
    const hasGridCols = /grid-cols-\d+/.test(className);
    if (!hasGridCols) continue; // Simple grid, no columns defined

    // Check for responsive variants
    const hasResponsiveGrid = BREAKPOINTS.some(
      (bp) => className.includes(`${bp}grid-cols-`) || className.includes(`${bp}flex`)
    );

    // Check if it's a single column grid (doesn't need responsive)
    const isSingleCol = /grid-cols-1(?!\d)/.test(className);

    // Check if flex-wrap is used (often doesn't need explicit responsive)
    const hasFlexWrap = /flex-wrap/.test(className);

    if (hasGridCols && !hasResponsiveGrid && !isSingleCol && !hasFlexWrap) {
      // Multi-column grid without responsive breakpoints
      violations.push({
        type: "grid-missing-responsive",
        severity: "medium",
        line: getLineNumber(content, match.index),
        column: getColumnNumber(content, match.index),
        code: getCodeSnippet(content, match.index, match[0].length),
        message: "Multi-column grid without responsive breakpoints",
        suggestion: "Consider adding sm:grid-cols-*, md:grid-cols-* for mobile responsiveness",
      });
    }
  }
}

/**
 * Check touch targets for minimum size
 */
function checkTouchTargets(
  content: string,
  violations: ResponsiveViolation[],
  stats: ResponsiveResult["stats"]
): void {
  // Find button and interactive elements
  const buttonRegex = /<button[^>]*className=["']([^"']+)["'][^>]*>/g;
  let match;

  while ((match = buttonRegex.exec(content)) !== null) {
    stats.touchTargetsChecked++;
    const className = match[1];

    // Check for adequate padding or explicit sizing
    const hasSufficientSize = MIN_TOUCH_TARGETS.some(
      (target) =>
        className.includes(target) ||
        // Also accept combinations like px-3 py-2 or larger
        /p-[2-9]/.test(className) ||
        /px-[3-9]/.test(className) ||
        /py-[2-9]/.test(className) ||
        /h-[89]|h-1[0-2]/.test(className) ||
        /min-h-\[44px\]/.test(className)
    );

    // Check for icon-only buttons (need minimum sizing)
    const isIconOnly =
      /shrink-0/.test(className) &&
      (/p-0\.5|p-1(?!\d)/.test(className) || !className.includes("p-"));

    if (isIconOnly && !hasSufficientSize) {
      // Small padding on what might be an icon button
      violations.push({
        type: "touch-target-too-small",
        severity: "medium",
        line: getLineNumber(content, match.index),
        column: getColumnNumber(content, match.index),
        code: getCodeSnippet(content, match.index, match[0].length),
        message: "Button may have touch target smaller than 44px",
        suggestion: "Ensure minimum 44x44px touch target for mobile (p-2 or larger)",
      });
    }
  }
}

/**
 * Check for mobile considerations in the file
 */
function checkMobileConsiderations(content: string, violations: ResponsiveViolation[]): void {
  // Check for potential mobile issues:
  // - Fixed widths without responsive alternatives
  const fixedWidthRegex = /className=["'][^"']*\bw-\d{3,}[^"']*["']/g;
  let match;

  while ((match = fixedWidthRegex.exec(content)) !== null) {
    // Large fixed width without responsive variant
    const className = match[0];
    const hasResponsiveWidth = BREAKPOINTS.some((bp) => className.includes(`${bp}w-`));

    if (!hasResponsiveWidth) {
      violations.push({
        type: "missing-mobile-consideration",
        severity: "low",
        line: getLineNumber(content, match.index),
        column: getColumnNumber(content, match.index),
        code: getCodeSnippet(content, match.index, match[0].length),
        message: "Large fixed width without responsive alternative",
        suggestion: "Consider using w-full with max-width, or responsive width classes",
      });
    }
  }
}

// =============================================================================
// MAIN CHECKER
// =============================================================================

/**
 * Run responsive design checks on a file
 */
export function checkResponsive(filePath: string, content: string): ResponsiveResult {
  const isModal = isModalComponent(filePath);
  const violations: ResponsiveViolation[] = [];
  const stats = {
    breakpointsFound: findBreakpoints(content),
    gridsChecked: 0,
    touchTargetsChecked: 0,
  };

  // Run checks based on component type
  if (isModal) {
    checkModalMaxWidth(content, violations);
  }

  checkGridResponsiveness(content, violations, stats);
  checkTouchTargets(content, violations, stats);
  checkMobileConsiderations(content, violations);

  return {
    filePath,
    isModal,
    violations,
    stats,
  };
}
