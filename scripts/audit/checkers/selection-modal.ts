/**
 * Selection Modal Pattern Checker
 *
 * Checks that selection/purchase modal components follow established patterns:
 *
 * DUAL-COLUMN SELECTION MODALS (for browsing catalogs):
 * - Uses BaseModalRoot with size="2xl"
 * - Has max-h-[85vh] container
 * - Split content with w-1/2 columns
 * - Search bar with icon
 * - Detail preview with empty state
 * - Purchase button full-width with accent color
 *
 * FORM-BASED CONFIGURATION MODALS (for item configuration):
 * - Uses ModalHeader, ModalBody, ModalFooter components
 * - Single column form layout
 * - Cancel and submit buttons in footer
 *
 * Reference: docs/patterns/selection-modal-pattern.md
 */

import {
  SELECTION_MODAL_FILE_PATTERNS,
  FORM_MODAL_FILE_PATTERNS,
  MODAL_SPLIT_CONTENT_PATTERN,
  MODAL_PURCHASE_BUTTON_PATTERN,
  MODAL_EMPTY_PREVIEW_PATTERN,
  FORM_MODAL_STRUCTURE,
} from "../patterns/expected-patterns";

// =============================================================================
// TYPES
// =============================================================================

export type ModalType = "selection" | "form" | "unknown";

export interface SelectionModalViolation {
  type:
    | "missing-split-layout"
    | "missing-search-bar"
    | "wrong-column-width"
    | "missing-empty-preview"
    | "wrong-purchase-button"
    | "missing-modal-components"
    | "wrong-modal-size";
  severity: "high" | "medium" | "low";
  line: number;
  column: number;
  code: string;
  message: string;
  expected: string;
  found: string;
  suggestion?: string;
}

export interface SelectionModalResult {
  filePath: string;
  modalType: ModalType;
  violations: SelectionModalViolation[];
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
 * Determine what type of modal this file represents
 */
function getModalType(filePath: string): ModalType {
  if (SELECTION_MODAL_FILE_PATTERNS.some((pattern) => pattern.test(filePath))) {
    return "selection";
  }
  if (FORM_MODAL_FILE_PATTERNS.some((pattern) => pattern.test(filePath))) {
    return "form";
  }
  // Check if filename contains "Modal"
  if (/Modal\.tsx$/.test(filePath)) {
    return "unknown"; // Modal but not in our known lists - still worth checking basics
  }
  return "unknown";
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
// CHECKERS FOR SELECTION (DUAL-COLUMN) MODALS
// =============================================================================

/**
 * Check for dual-column split layout
 */
function checkSplitLayout(
  content: string,
  violations: SelectionModalViolation[],
  stats: SelectionModalResult["stats"]
): void {
  stats.checksPerformed++;

  // Look for flex container with two w-1/2 children
  const hasFlexContainer = /className=["'][^"']*flex[^"']*flex-1[^"']*overflow-hidden/.test(
    content
  );
  const hasLeftColumn = /className=["'][^"']*w-1\/2[^"']*overflow-y-auto[^"']*border-r/.test(
    content
  );
  const hasRightColumn = /className=["'][^"']*w-1\/2[^"']*overflow-y-auto[^"']*p-4/.test(content);

  if (!hasFlexContainer || !hasLeftColumn || !hasRightColumn) {
    const missing = [];
    if (!hasFlexContainer) missing.push("flex flex-1 overflow-hidden container");
    if (!hasLeftColumn) missing.push("left column (w-1/2 with border-r)");
    if (!hasRightColumn) missing.push("right column (w-1/2)");

    violations.push({
      type: "missing-split-layout",
      severity: "high",
      line: 0,
      column: 0,
      code: "",
      message: `Selection modal missing dual-column layout: ${missing.join(", ")}`,
      expected: "Split content with w-1/2 columns, left with border-r",
      found: "Layout not matching dual-column pattern",
      suggestion: "Use flex flex-1 overflow-hidden container with two w-1/2 columns",
    });
    stats.failed++;
  } else {
    stats.passed++;
  }
}

/**
 * Check for search bar with icon
 */
function checkSearchBar(
  content: string,
  violations: SelectionModalViolation[],
  stats: SelectionModalResult["stats"]
): void {
  stats.checksPerformed++;

  // Look for search input with icon
  const hasSearchIcon = /<Search[^>]*className=["'][^"']*absolute[^"']*left-3/.test(content);
  const hasSearchInput = /placeholder=["']Search/.test(content);

  if (!hasSearchIcon || !hasSearchInput) {
    violations.push({
      type: "missing-search-bar",
      severity: "medium",
      line: 0,
      column: 0,
      code: "",
      message: "Selection modal missing search bar with icon",
      expected: "Search input with Search icon positioned inside (left-3)",
      found: hasSearchInput ? "Search input without icon positioning" : "No search input found",
      suggestion: "Add search bar with: <Search className='absolute left-3 top-1/2 ...' />",
    });
    stats.failed++;
  } else {
    stats.passed++;
  }
}

/**
 * Check for empty preview state
 */
function checkEmptyPreview(
  content: string,
  violations: SelectionModalViolation[],
  stats: SelectionModalResult["stats"]
): void {
  stats.checksPerformed++;

  // Look for empty state text like "Select a X to see details"
  const hasEmptyState = /Select\s+(?:a|an)\s+\w+\s+to\s+see\s+details/i.test(content);

  if (!hasEmptyState) {
    violations.push({
      type: "missing-empty-preview",
      severity: "medium",
      line: 0,
      column: 0,
      code: "",
      message: "Selection modal missing empty preview state",
      expected: "Empty state text like 'Select a {item} to see details'",
      found: "No empty preview state found",
      suggestion: "Add: <p>Select a {item} to see details</p> when nothing is selected",
    });
    stats.failed++;
  } else {
    stats.passed++;
  }
}

/**
 * Check purchase/add button styling
 */
function checkPurchaseButton(
  content: string,
  violations: SelectionModalViolation[],
  stats: SelectionModalResult["stats"]
): void {
  stats.checksPerformed++;

  // Look for full-width purchase button
  const purchaseButtonRegex =
    /<button[^>]*className=["']([^"']*w-full[^"']*py-3[^"']*)["'][^>]*>[\s\S]*?(?:Purchase|Add|Buy|Select)[\s\S]*?<\/button>/gi;

  const match = purchaseButtonRegex.exec(content);

  if (!match) {
    violations.push({
      type: "wrong-purchase-button",
      severity: "medium",
      line: 0,
      column: 0,
      code: "",
      message: "Selection modal missing full-width purchase button",
      expected: "Full-width button (w-full py-3) with accent color",
      found: "No matching purchase button found",
      suggestion: "Add purchase button with: w-full py-3 rounded-lg text-sm font-medium",
    });
    stats.failed++;
    return;
  }

  const className = match[1];

  // Check for required classes
  const hasRoundedLg = /rounded-lg/.test(className);
  const hasTextSm = /text-sm/.test(className);
  const hasFontMedium = /font-medium/.test(className);
  const hasTransition = /transition/.test(className);

  const missing = [];
  if (!hasRoundedLg) missing.push("rounded-lg");
  if (!hasTextSm) missing.push("text-sm");
  if (!hasFontMedium) missing.push("font-medium");
  if (!hasTransition) missing.push("transition-colors");

  if (missing.length > 0) {
    violations.push({
      type: "wrong-purchase-button",
      severity: "low",
      line: getLineNumber(content, match.index),
      column: getColumnNumber(content, match.index),
      code: getCodeSnippet(content, match.index, 80),
      message: `Purchase button missing classes: ${missing.join(", ")}`,
      expected: MODAL_PURCHASE_BUTTON_PATTERN.required.join(" "),
      found: className,
    });
    stats.failed++;
  } else {
    stats.passed++;
  }
}

/**
 * Check modal size
 */
function checkModalSize(
  content: string,
  violations: SelectionModalViolation[],
  stats: SelectionModalResult["stats"],
  expectedSize: string
): void {
  stats.checksPerformed++;

  const sizeMatch = /size=["'](\w+)["']/.exec(content);
  const actualSize = sizeMatch ? sizeMatch[1] : "not specified";

  if (actualSize !== expectedSize) {
    violations.push({
      type: "wrong-modal-size",
      severity: "low",
      line: sizeMatch ? getLineNumber(content, sizeMatch.index) : 0,
      column: sizeMatch ? getColumnNumber(content, sizeMatch.index) : 0,
      code: sizeMatch ? getCodeSnippet(content, sizeMatch.index, 40) : "",
      message: `Modal size should be "${expectedSize}" for this modal type`,
      expected: `size="${expectedSize}"`,
      found: `size="${actualSize}"`,
    });
    stats.failed++;
  } else {
    stats.passed++;
  }
}

// =============================================================================
// CHECKERS FOR FORM MODALS
// =============================================================================

/**
 * Check for ModalHeader, ModalBody, ModalFooter components
 */
function checkFormModalComponents(
  content: string,
  violations: SelectionModalViolation[],
  stats: SelectionModalResult["stats"]
): void {
  stats.checksPerformed++;

  const hasModalHeader = /<ModalHeader/.test(content);
  const hasModalBody = /<ModalBody/.test(content);
  const hasModalFooter = /<ModalFooter/.test(content);

  const missing = [];
  if (!hasModalHeader) missing.push("ModalHeader");
  if (!hasModalBody) missing.push("ModalBody");
  if (!hasModalFooter) missing.push("ModalFooter");

  if (missing.length > 0) {
    violations.push({
      type: "missing-modal-components",
      severity: "medium",
      line: 0,
      column: 0,
      code: "",
      message: `Form modal missing standard components: ${missing.join(", ")}`,
      expected: FORM_MODAL_STRUCTURE.components.join(", "),
      found: `Has: ${[hasModalHeader && "ModalHeader", hasModalBody && "ModalBody", hasModalFooter && "ModalFooter"].filter(Boolean).join(", ") || "none"}`,
      suggestion: "Use ModalHeader, ModalBody, and ModalFooter from @/components/ui",
    });
    stats.failed++;
  } else {
    stats.passed++;
  }
}

// =============================================================================
// MAIN CHECKER
// =============================================================================

/**
 * Run selection modal pattern checks on a file
 */
export function checkSelectionModal(filePath: string, content: string): SelectionModalResult {
  const modalType = getModalType(filePath);
  const violations: SelectionModalViolation[] = [];
  const stats = {
    checksPerformed: 0,
    passed: 0,
    failed: 0,
  };

  // Skip if not a modal file
  if (modalType === "unknown" && !/Modal\.tsx$/.test(filePath)) {
    return {
      filePath,
      modalType,
      violations,
      stats,
    };
  }

  // Run checks based on modal type
  if (modalType === "selection") {
    checkSplitLayout(content, violations, stats);
    checkSearchBar(content, violations, stats);
    checkEmptyPreview(content, violations, stats);
    checkPurchaseButton(content, violations, stats);
    checkModalSize(content, violations, stats, "2xl");
  } else if (modalType === "form") {
    checkFormModalComponents(content, violations, stats);
    checkModalSize(content, violations, stats, "lg");
  }

  return {
    filePath,
    modalType,
    violations,
    stats,
  };
}
