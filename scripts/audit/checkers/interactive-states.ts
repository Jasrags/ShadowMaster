/**
 * Interactive States Checker
 *
 * Checks for proper interactive state coverage:
 * - Buttons: hover:, focus-visible:, disabled:
 * - Inputs: focus:, placeholder:
 * - Links: hover:, focus-visible:
 */

// =============================================================================
// TYPES
// =============================================================================

export interface InteractiveStateViolation {
  type:
    | "button-missing-hover"
    | "button-missing-focus"
    | "button-missing-disabled"
    | "input-missing-focus"
    | "input-missing-placeholder"
    | "link-missing-hover";
  severity: "high" | "medium" | "low";
  line: number;
  column: number;
  code: string;
  message: string;
  missingStates: string[];
}

export interface InteractiveStatesResult {
  filePath: string;
  violations: InteractiveStateViolation[];
  stats: {
    buttonsChecked: number;
    inputsChecked: number;
    linksChecked: number;
    completeButtons: number;
    completeInputs: number;
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
 * Check which interactive states are present in a className
 */
function findPresentStates(className: string): {
  hover: boolean;
  focus: boolean;
  focusVisible: boolean;
  disabled: boolean;
  active: boolean;
  placeholder: boolean;
} {
  return {
    hover: /hover:/.test(className),
    focus: /focus:/.test(className),
    focusVisible: /focus-visible:/.test(className),
    disabled: /disabled:/.test(className),
    active: /active:/.test(className),
    placeholder: /placeholder:/.test(className),
  };
}

/**
 * Check if button can be disabled (has disabled prop or state)
 */
function checkIfCanBeDisabled(content: string, buttonMatch: RegExpExecArray): boolean {
  // Look in surrounding context for disabled prop
  const surroundingStart = Math.max(0, buttonMatch.index - 100);
  const surroundingEnd = Math.min(content.length, buttonMatch.index + buttonMatch[0].length + 100);
  const context = content.substring(surroundingStart, surroundingEnd);

  return /disabled[=:{]/.test(context);
}

// =============================================================================
// CHECKERS
// =============================================================================

/**
 * Check buttons for interactive states
 */
function checkButtonStates(
  content: string,
  violations: InteractiveStateViolation[],
  stats: InteractiveStatesResult["stats"]
): void {
  // Find all button elements with className
  const buttonRegex = /<button[^>]*className=["']([^"']+)["'][^>]*>/g;
  let match;

  while ((match = buttonRegex.exec(content)) !== null) {
    stats.buttonsChecked++;
    const className = match[1];
    const states = findPresentStates(className);

    const missingStates: string[] = [];

    // Check for hover state
    if (!states.hover) {
      missingStates.push("hover:");
    }

    // Check for focus state (prefer focus-visible over focus)
    if (!states.focusVisible && !states.focus) {
      missingStates.push("focus-visible:");
    }

    // Check for disabled state only if button can be disabled
    const canBeDisabled = checkIfCanBeDisabled(content, match);
    if (canBeDisabled && !states.disabled) {
      missingStates.push("disabled:");
    }

    if (missingStates.length > 0) {
      // Determine severity
      let severity: "high" | "medium" | "low" = "medium";
      if (missingStates.includes("focus-visible:") || missingStates.includes("hover:")) {
        severity = "high";
      }

      violations.push({
        type: missingStates.includes("hover:")
          ? "button-missing-hover"
          : missingStates.includes("focus-visible:")
            ? "button-missing-focus"
            : "button-missing-disabled",
        severity,
        line: getLineNumber(content, match.index),
        column: getColumnNumber(content, match.index),
        code: getCodeSnippet(content, match.index, match[0].length),
        message: `Button missing interactive states: ${missingStates.join(", ")}`,
        missingStates,
      });
    } else {
      stats.completeButtons++;
    }
  }
}

/**
 * Check inputs for interactive states
 */
function checkInputStates(
  content: string,
  violations: InteractiveStateViolation[],
  stats: InteractiveStatesResult["stats"]
): void {
  // Find all input elements with className
  const inputRegex = /<input[^>]*className=["']([^"']+)["'][^>]*>/g;
  let match;

  while ((match = inputRegex.exec(content)) !== null) {
    stats.inputsChecked++;
    const className = match[1];
    const states = findPresentStates(className);

    const missingStates: string[] = [];

    // Check for focus state
    if (!states.focus && !states.focusVisible) {
      missingStates.push("focus:");
    }

    // Placeholder is optional but recommended for text inputs
    // Skip check for certain input types
    const inputType = match[0].match(/type=["']([^"']+)["']/);
    const typeValue = inputType ? inputType[1] : "text";

    if (
      ["text", "email", "password", "search", "tel", "url"].includes(typeValue) &&
      !states.placeholder
    ) {
      // This is a soft recommendation, not a violation
    }

    if (missingStates.length > 0) {
      violations.push({
        type: "input-missing-focus",
        severity: "high",
        line: getLineNumber(content, match.index),
        column: getColumnNumber(content, match.index),
        code: getCodeSnippet(content, match.index, match[0].length),
        message: `Input missing interactive states: ${missingStates.join(", ")}`,
        missingStates,
      });
    } else {
      stats.completeInputs++;
    }
  }

  // Also check textarea and select elements
  const textareaRegex = /<textarea[^>]*className=["']([^"']+)["'][^>]*>/g;
  while ((match = textareaRegex.exec(content)) !== null) {
    stats.inputsChecked++;
    const className = match[1];
    const states = findPresentStates(className);

    if (!states.focus && !states.focusVisible) {
      violations.push({
        type: "input-missing-focus",
        severity: "high",
        line: getLineNumber(content, match.index),
        column: getColumnNumber(content, match.index),
        code: getCodeSnippet(content, match.index, match[0].length),
        message: "Textarea missing focus state",
        missingStates: ["focus:"],
      });
    } else {
      stats.completeInputs++;
    }
  }

  const selectRegex = /<select[^>]*className=["']([^"']+)["'][^>]*>/g;
  while ((match = selectRegex.exec(content)) !== null) {
    stats.inputsChecked++;
    const className = match[1];
    const states = findPresentStates(className);

    if (!states.focus && !states.focusVisible) {
      violations.push({
        type: "input-missing-focus",
        severity: "high",
        line: getLineNumber(content, match.index),
        column: getColumnNumber(content, match.index),
        code: getCodeSnippet(content, match.index, match[0].length),
        message: "Select missing focus state",
        missingStates: ["focus:"],
      });
    } else {
      stats.completeInputs++;
    }
  }
}

/**
 * Check links for interactive states
 */
function checkLinkStates(
  content: string,
  violations: InteractiveStateViolation[],
  stats: InteractiveStatesResult["stats"]
): void {
  // Find all anchor elements with className
  const linkRegex = /<a[^>]*className=["']([^"']+)["'][^>]*>/g;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    stats.linksChecked++;
    const className = match[1];
    const states = findPresentStates(className);

    // Links should have hover state
    if (!states.hover) {
      violations.push({
        type: "link-missing-hover",
        severity: "medium",
        line: getLineNumber(content, match.index),
        column: getColumnNumber(content, match.index),
        code: getCodeSnippet(content, match.index, match[0].length),
        message: "Link missing hover state",
        missingStates: ["hover:"],
      });
    }
  }
}

/**
 * Check interactive divs (with onClick handlers)
 */
function checkInteractiveDivs(content: string, violations: InteractiveStateViolation[]): void {
  // Find divs with onClick handlers
  const divRegex = /<div[^>]*onClick[^>]*className=["']([^"']+)["'][^>]*>/g;
  let match;

  while ((match = divRegex.exec(content)) !== null) {
    const className = match[1];
    const states = findPresentStates(className);

    // Interactive divs should have hover and cursor-pointer
    const hasCursor = /cursor-pointer/.test(className);

    if (!states.hover || !hasCursor) {
      const missing: string[] = [];
      if (!states.hover) missing.push("hover:");
      if (!hasCursor) missing.push("cursor-pointer");

      violations.push({
        type: "button-missing-hover",
        severity: "medium",
        line: getLineNumber(content, match.index),
        column: getColumnNumber(content, match.index),
        code: getCodeSnippet(content, match.index, match[0].length),
        message: `Interactive div missing: ${missing.join(", ")}`,
        missingStates: missing,
      });
    }
  }
}

// =============================================================================
// MAIN CHECKER
// =============================================================================

/**
 * Run interactive states checks on a file
 */
export function checkInteractiveStates(filePath: string, content: string): InteractiveStatesResult {
  const violations: InteractiveStateViolation[] = [];
  const stats = {
    buttonsChecked: 0,
    inputsChecked: 0,
    linksChecked: 0,
    completeButtons: 0,
    completeInputs: 0,
  };

  // Run all checks
  checkButtonStates(content, violations, stats);
  checkInputStates(content, violations, stats);
  checkLinkStates(content, violations, stats);
  checkInteractiveDivs(content, violations);

  return {
    filePath,
    violations,
    stats,
  };
}
