/**
 * Accessibility Checker
 *
 * Checks for common accessibility issues:
 * - Icon-only buttons without aria-label
 * - Decorative icons missing aria-hidden="true"
 * - Interactive elements missing focus indicators
 * - Missing ARIA attributes on interactive elements
 */

import { DECORATIVE_ICONS } from "../patterns/expected-patterns";

// =============================================================================
// TYPES
// =============================================================================

export interface AccessibilityViolation {
  type:
    | "icon-button-no-label"
    | "decorative-icon-no-aria-hidden"
    | "missing-focus-indicator"
    | "button-missing-type"
    | "interactive-no-role";
  severity: "critical" | "high" | "medium";
  line: number;
  column: number;
  code: string;
  message: string;
  suggestion: string;
}

export interface AccessibilityResult {
  filePath: string;
  violations: AccessibilityViolation[];
  stats: {
    iconButtonsChecked: number;
    decorativeIconsChecked: number;
    focusIndicatorsChecked: number;
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

  // Clean up the snippet
  snippet = snippet.replace(/\s+/g, " ").trim();
  if (start > 0) snippet = "..." + snippet;
  if (end < content.length) snippet = snippet + "...";

  return snippet;
}

// =============================================================================
// CHECKERS
// =============================================================================

/**
 * Check for icon-only buttons without aria-label
 *
 * Pattern: <button ...> <IconComponent /> </button>
 * Without aria-label or aria-labelledby
 */
function checkIconButtonsWithoutLabel(
  content: string,
  violations: AccessibilityViolation[],
  stats: AccessibilityResult["stats"]
): void {
  // Find all button elements
  const buttonRegex = /<button\s+[^>]*>[\s\S]*?<\/button>/g;
  let match;

  while ((match = buttonRegex.exec(content)) !== null) {
    const buttonContent = match[0];
    stats.iconButtonsChecked++;

    // Check if button has aria-label or aria-labelledby
    const hasAriaLabel =
      /aria-label=/.test(buttonContent) || /aria-labelledby=/.test(buttonContent);

    // Check if button contains text content (not just an icon)
    // Remove JSX tags and check if there's meaningful text
    const textContent = buttonContent
      .replace(/<[^>]+>/g, " ") // Remove all tags
      .replace(/\{[^}]+\}/g, " ") // Remove JSX expressions
      .replace(/\s+/g, " ")
      .trim();

    // Check if it appears to be icon-only (contains icon component, no text)
    const hasIconComponent = DECORATIVE_ICONS.some((icon) =>
      new RegExp(`<${icon}[\\s/>]`).test(buttonContent)
    );

    const hasNoTextContent = textContent.length === 0 || textContent === "...";

    if (hasIconComponent && hasNoTextContent && !hasAriaLabel) {
      // This is likely an icon-only button without proper labeling
      const line = getLineNumber(content, match.index);
      const column = getColumnNumber(content, match.index);

      violations.push({
        type: "icon-button-no-label",
        severity: "critical",
        line,
        column,
        code: getCodeSnippet(content, match.index, buttonContent.length),
        message: "Icon-only button missing aria-label",
        suggestion: 'Add aria-label="Description" to describe the button\'s action',
      });
    }
  }
}

/**
 * Check for decorative icons missing aria-hidden="true"
 *
 * Icons that are purely decorative should have aria-hidden="true"
 * to prevent screen readers from announcing them.
 */
function checkDecorativeIconsWithoutAriaHidden(
  content: string,
  violations: AccessibilityViolation[],
  stats: AccessibilityResult["stats"]
): void {
  for (const icon of DECORATIVE_ICONS) {
    // Find all usages of this icon
    const iconRegex = new RegExp(`<${icon}\\s+([^>]*)\\/>`, "g");
    let match;

    while ((match = iconRegex.exec(content)) !== null) {
      stats.decorativeIconsChecked++;
      const iconProps = match[1];

      // Check if it has aria-hidden="true"
      const hasAriaHidden = /aria-hidden\s*=\s*["']true["']/.test(iconProps);

      // Check if it's in a context that already handles accessibility
      // (e.g., inside a button with aria-label)
      const surroundingContext = content.substring(
        Math.max(0, match.index - 200),
        Math.min(content.length, match.index + match[0].length + 200)
      );

      // If inside a button with aria-label, it's acceptable not to have aria-hidden
      // because the button's label provides the accessible name
      const isInLabeledButton =
        /<button[^>]*aria-label=/.test(surroundingContext) &&
        surroundingContext.indexOf("<button") < match.index - (match.index - 200);

      if (!hasAriaHidden && !isInLabeledButton) {
        const line = getLineNumber(content, match.index);
        const column = getColumnNumber(content, match.index);

        violations.push({
          type: "decorative-icon-no-aria-hidden",
          severity: "high",
          line,
          column,
          code: getCodeSnippet(content, match.index, match[0].length),
          message: `Decorative ${icon} icon missing aria-hidden="true"`,
          suggestion: 'Add aria-hidden="true" to hide from screen readers',
        });
      }
    }
  }
}

/**
 * Check for interactive elements missing focus indicators
 *
 * Buttons and links should have focus-visible: styles
 */
function checkMissingFocusIndicators(
  content: string,
  violations: AccessibilityViolation[],
  stats: AccessibilityResult["stats"]
): void {
  // Check buttons for focus-visible
  const buttonRegex = /<button\s+[^>]*className=["'][^"']*["'][^>]*>/g;
  let match;

  while ((match = buttonRegex.exec(content)) !== null) {
    stats.focusIndicatorsChecked++;
    const buttonTag = match[0];

    // Extract className value
    const classNameMatch = /className=["']([^"']*)["']/.exec(buttonTag);
    if (!classNameMatch) continue;

    const className = classNameMatch[1];

    // Check for focus-visible: or focus: styles
    const hasFocusStyles =
      /focus-visible:/.test(className) ||
      /focus:ring/.test(className) ||
      /focus:outline/.test(className) ||
      /focus:border/.test(className);

    // Skip if button has role="button" on a non-button (handled differently)
    if (!hasFocusStyles) {
      const line = getLineNumber(content, match.index);
      const column = getColumnNumber(content, match.index);

      violations.push({
        type: "missing-focus-indicator",
        severity: "medium",
        line,
        column,
        code: getCodeSnippet(content, match.index, match[0].length),
        message: "Button missing visible focus indicator",
        suggestion: "Add focus-visible: styles (e.g., focus-visible:ring-2)",
      });
    }
  }
}

/**
 * Check for buttons without explicit type attribute
 *
 * Buttons inside forms should have type="button" if not submitting
 */
function checkButtonsMissingType(content: string, violations: AccessibilityViolation[]): void {
  // Find buttons without type attribute
  const buttonRegex = /<button\s+(?![^>]*type=)[^>]*>/g;
  let match;

  while ((match = buttonRegex.exec(content)) !== null) {
    const buttonTag = match[0];

    // Skip if it looks like a submit button based on context
    const isLikelySubmit = /submit/i.test(buttonTag) || /type\s*=\s*["']submit["']/.test(buttonTag);

    if (!isLikelySubmit) {
      const line = getLineNumber(content, match.index);
      const column = getColumnNumber(content, match.index);

      violations.push({
        type: "button-missing-type",
        severity: "medium",
        line,
        column,
        code: getCodeSnippet(content, match.index, match[0].length),
        message: 'Button missing type attribute (defaults to "submit")',
        suggestion: 'Add type="button" to prevent unintended form submissions',
      });
    }
  }
}

// =============================================================================
// MAIN CHECKER
// =============================================================================

/**
 * Run all accessibility checks on a file
 */
export function checkAccessibility(filePath: string, content: string): AccessibilityResult {
  const violations: AccessibilityViolation[] = [];
  const stats = {
    iconButtonsChecked: 0,
    decorativeIconsChecked: 0,
    focusIndicatorsChecked: 0,
  };

  // Run all checks
  checkIconButtonsWithoutLabel(content, violations, stats);
  checkDecorativeIconsWithoutAriaHidden(content, violations, stats);
  checkMissingFocusIndicators(content, violations, stats);
  checkButtonsMissingType(content, violations);

  return {
    filePath,
    violations,
    stats,
  };
}
