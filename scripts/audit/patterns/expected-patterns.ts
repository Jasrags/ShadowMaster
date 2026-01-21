/**
 * Expected Patterns for Creation UX Audit
 *
 * Reference patterns extracted from shared components (CreationCard, ValidationBadge)
 * that all creation components should follow.
 */

// =============================================================================
// VISUAL PATTERNS
// =============================================================================

/**
 * Card structure patterns from CreationCard.tsx
 */
export const CARD_PATTERNS = {
  container: "rounded-lg border bg-white dark:bg-zinc-900",
  border: {
    default: "border-zinc-200 dark:border-zinc-700",
    valid: "border-emerald-200 dark:border-emerald-800",
    warning: "border-amber-200 dark:border-amber-800",
    error: "border-red-200 dark:border-red-800",
  },
  innerBorder: "border-zinc-100 dark:border-zinc-800",
};

/**
 * Typography patterns
 */
export const TYPOGRAPHY_PATTERNS = {
  title: "font-medium text-zinc-900 dark:text-zinc-100",
  description: "text-xs text-zinc-500 dark:text-zinc-400",
  sectionHeader: "text-[10px] font-semibold uppercase tracking-wider",
  label: "text-zinc-400 dark:text-zinc-500",
  value: "text-zinc-700 dark:text-zinc-300",
  muted: "text-zinc-400 dark:text-zinc-500",
};

/**
 * Icon size patterns (standard sizes used across components)
 */
export const ICON_SIZES = {
  standard: ["h-4 w-4", "h-4", "w-4"],
  small: ["h-3.5 w-3.5", "h-3.5", "w-3.5"],
  xsmall: ["h-3 w-3", "h-3", "w-3"],
};

// =============================================================================
// DARK MODE PAIRS
// =============================================================================

/**
 * Required light/dark class pairs
 * Key is light mode class, value is expected dark mode pair
 */
export const DARK_MODE_PAIRS: Record<string, string> = {
  // Background colors
  "bg-white": "dark:bg-zinc-900",
  "bg-zinc-50": "dark:bg-zinc-800",
  "bg-zinc-100": "dark:bg-zinc-800",
  "bg-zinc-200": "dark:bg-zinc-700",

  // Text colors
  "text-zinc-900": "dark:text-zinc-100",
  "text-zinc-800": "dark:text-zinc-200",
  "text-zinc-700": "dark:text-zinc-300",
  "text-zinc-600": "dark:text-zinc-400",
  "text-zinc-500": "dark:text-zinc-400",
  "text-zinc-400": "dark:text-zinc-500",

  // Border colors
  "border-zinc-200": "dark:border-zinc-700",
  "border-zinc-300": "dark:border-zinc-600",
  "border-zinc-100": "dark:border-zinc-800",

  // Status colors (these have established pairs)
  "text-emerald-600": "dark:text-emerald-400",
  "text-amber-600": "dark:text-amber-400",
  "text-red-600": "dark:text-red-400",
  "bg-emerald-100": "dark:bg-emerald-900",
  "bg-amber-100": "dark:bg-amber-900",
  "bg-red-100": "dark:bg-red-900",

  // Hover states on backgrounds
  "hover:bg-zinc-50": "dark:hover:bg-zinc-800",
  "hover:bg-zinc-100": "dark:hover:bg-zinc-800",
  "hover:bg-red-100": "dark:hover:bg-red-900/30",
};

/**
 * Dark mode pairs that should be treated as optional/acceptable
 * (e.g., colors that don't need dark variants)
 */
export const EXEMPT_FROM_DARK_PAIRS: string[] = [
  // Pure utility colors that work in both modes
  "text-blue-500",
  "text-blue-600",
  "bg-blue-500",
  "bg-blue-600",
  // Transparent backgrounds
  "bg-transparent",
  // Colors that are intentionally the same
  "text-white",
  "bg-black",
];

// =============================================================================
// ACCESSIBILITY PATTERNS
// =============================================================================

/**
 * Icons from lucide-react that are commonly decorative
 */
export const DECORATIVE_ICONS = [
  "Wifi",
  "WifiOff",
  "ChevronDown",
  "ChevronRight",
  "ChevronUp",
  "ChevronLeft",
  "Check",
  "X",
  "Plus",
  "Minus",
  "AlertTriangle",
  "AlertCircle",
  "Info",
  "HelpCircle",
  "ExternalLink",
  "Edit",
  "Trash",
  "Trash2",
  "Settings",
  "MoreHorizontal",
  "MoreVertical",
  "Search",
  "Filter",
  "ArrowRight",
  "ArrowLeft",
  "ArrowUp",
  "ArrowDown",
];

/**
 * Regex patterns for finding icon-only buttons without aria-label
 */
export const ICON_BUTTON_PATTERNS = [
  // Button containing only an icon component
  /<button[^>]*>\s*<(?:Wifi|X|Plus|Minus|ChevronDown|ChevronRight|Edit|Trash|Trash2|Settings)[^/]*\/>\s*<\/button>/g,
  // onClick handler followed directly by icon (simplified detection)
  /onClick=\{[^}]+\}[^>]*>\s*<(?:X|Plus|Trash)[^/]*\/>/g,
];

// =============================================================================
// INTERACTIVE STATE PATTERNS
// =============================================================================

/**
 * Required interactive state classes for buttons
 */
export const BUTTON_STATES = {
  required: ["hover:", "focus-visible:"],
  conditional: ["disabled:"], // Required only if button can be disabled
};

/**
 * Required interactive state classes for inputs
 */
export const INPUT_STATES = {
  required: ["focus:"],
  conditional: ["placeholder:"],
};

// =============================================================================
// RESPONSIVE PATTERNS
// =============================================================================

/**
 * Expected responsive breakpoint prefixes
 */
export const BREAKPOINTS = ["sm:", "md:", "lg:", "xl:", "2xl:"];

/**
 * Modal max-width constraints that should be present
 */
export const MODAL_MAX_WIDTHS = [
  "max-w-xs",
  "max-w-sm",
  "max-w-md",
  "max-w-lg",
  "max-w-xl",
  "max-w-2xl",
  "max-w-3xl",
  "max-w-4xl",
];

/**
 * Minimum touch target size (in tailwind classes)
 */
export const MIN_TOUCH_TARGETS = [
  "p-2", // 8px padding on all sides with content = ~32px+
  "p-2.5",
  "p-3",
  "px-3 py-2",
  "px-4 py-2",
  "h-10",
  "h-11",
  "h-12",
  "min-h-[44px]",
  "min-w-[44px]",
];

// =============================================================================
// FILE CATEGORIZATION
// =============================================================================

/**
 * Component categories based on file path patterns
 */
export const COMPONENT_CATEGORIES = {
  cards: /Card\.tsx$/,
  modals: /Modal\.tsx$/,
  rows: /Row\.tsx$/,
  panels: /Panel\.tsx$/,
  shared: /\/shared\//,
  selectors: /Selector\.tsx$/,
};

/**
 * Files that are exempt from certain checks
 */
export const EXEMPT_FILES = {
  // Test files don't need UX auditing
  tests: /__tests__\//,
  // Index files are re-exports
  index: /index\.tsx?$/,
};
