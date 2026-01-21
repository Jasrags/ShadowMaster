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

// =============================================================================
// PURCHASE CARD PATTERNS
// =============================================================================

/**
 * Components that should follow the purchase card pattern
 * These are cards that allow purchasing/selecting items with budgets
 */
export const PURCHASE_CARD_COMPONENTS = [
  "WeaponsPanel",
  "ArmorCard",
  "GearCard",
  "MatrixGearCard",
  "VehiclesCard",
  "AugmentationsCard",
  "SpellsCard",
  "FociCard",
  "AdeptPowersCard",
  "ComplexFormsCard",
];

/**
 * File patterns that indicate a purchase card component
 */
export const PURCHASE_CARD_FILE_PATTERNS = [
  /WeaponsPanel\.tsx$/,
  /ArmorCard\.tsx$/,
  /GearCard\.tsx$/,
  /MatrixGearCard\.tsx$/,
  /VehiclesCard\.tsx$/,
  /AugmentationsCard\.tsx$/,
  /SpellsCard\.tsx$/,
  /FociCard\.tsx$/,
  /AdeptPowersCard\.tsx$/,
  /ComplexFormsCard\.tsx$/,
];

/**
 * Required Add button styling for purchase cards
 * All "Add" buttons must use amber styling
 */
export const ADD_BUTTON_PATTERN = {
  required: {
    background: "bg-amber-500",
    hoverBackground: "hover:bg-amber-600",
    textColor: "text-white",
    sizing: ["px-2", "py-1", "text-xs"],
  },
  forbidden: [
    // DO NOT use full-width dashed buttons
    "w-full.*border-dashed",
    // DO NOT use category-specific colors for add buttons
    "bg-purple-50",
    "bg-emerald-50",
    "border-purple-300",
    "border-emerald-400",
    "text-purple-700",
    "text-emerald-700",
  ],
};

/**
 * Empty state pattern for purchase cards
 */
export const EMPTY_STATE_PATTERN = {
  container: {
    required: [
      "rounded-lg",
      "border-2",
      "border-dashed",
      "border-zinc-200",
      "dark:border-zinc-700",
    ],
    sizing: ["p-3", "p-4"],
    layout: ["text-center"],
  },
  text: {
    required: ["text-xs", "text-zinc-400", "dark:text-zinc-500"],
  },
  // Empty state text should match these patterns
  textPatterns: [/No \w+ purchased/i, /No \w+ selected/i],
};

/**
 * Category section header pattern
 */
export const CATEGORY_HEADER_PATTERN = {
  container: "mb-2 flex items-center justify-between",
  title: {
    required: ["text-xs", "font-semibold", "uppercase", "tracking-wider"],
    colors: ["text-zinc-500", "dark:text-zinc-400"],
  },
  countBadge: {
    required: ["rounded-full", "px-1.5", "py-0.5", "text-[10px]", "font-medium"],
  },
  collapseIcon: {
    size: ["h-3.5", "w-3.5"],
  },
};

/**
 * Item row pattern for purchase cards
 */
export const ITEM_ROW_PATTERN = {
  container: "flex items-center gap-2 py-2",
  removeButton: {
    required: ["rounded", "p-1", "text-zinc-400"],
    hover: ["hover:bg-zinc-100", "hover:text-red-500", "dark:hover:bg-zinc-800"],
    icon: ["h-3.5", "w-3.5"],
  },
};

/**
 * Footer summary pattern
 */
export const FOOTER_PATTERN = {
  container: {
    required: ["flex", "items-center", "justify-between"],
    border: ["border-t", "border-zinc-200", "dark:border-zinc-700"],
    spacing: ["pt-3"],
  },
};

// =============================================================================
// SELECTION MODAL PATTERNS
// =============================================================================

/**
 * Modals that should follow the dual-column selection pattern
 */
export const SELECTION_MODAL_COMPONENTS = [
  "WeaponPurchaseModal",
  "CommlinkPurchaseModal",
  "CyberdeckPurchaseModal",
  "ArmorPurchaseModal",
  "GearPurchaseModal",
  "VehicleModal",
  "DroneModal",
  "AugmentationModal",
];

/**
 * File patterns that indicate a selection modal component
 */
export const SELECTION_MODAL_FILE_PATTERNS = [
  /WeaponPurchaseModal\.tsx$/,
  /CommlinkPurchaseModal\.tsx$/,
  /CyberdeckPurchaseModal\.tsx$/,
  /ArmorPurchaseModal\.tsx$/,
  /GearPurchaseModal\.tsx$/,
  /VehicleModal\.tsx$/,
  /DroneModal\.tsx$/,
  /AugmentationModal\.tsx$/,
];

/**
 * Required modal container pattern
 */
export const MODAL_CONTAINER_PATTERN = {
  root: {
    component: "BaseModalRoot",
    size: "2xl",
  },
  innerContainer: {
    required: ["flex", "max-h-[85vh]", "flex-col"],
  },
};

/**
 * Modal header pattern
 */
export const MODAL_HEADER_PATTERN = {
  container: {
    required: ["flex", "items-center", "justify-between", "border-b", "px-6", "py-4"],
    borderColor: ["border-zinc-200", "dark:border-zinc-700"],
  },
  title: {
    required: ["text-lg", "font-semibold"],
    colors: ["text-zinc-900", "dark:text-zinc-100"],
  },
  subtitle: {
    required: ["text-sm"],
    colors: ["text-zinc-500", "dark:text-zinc-400"],
  },
  closeButton: {
    required: ["rounded-lg", "p-2", "text-zinc-400"],
    hover: ["hover:bg-zinc-100", "hover:text-zinc-600", "dark:hover:bg-zinc-800"],
  },
};

/**
 * Modal search bar pattern
 */
export const MODAL_SEARCH_PATTERN = {
  container: {
    required: ["border-b", "px-6", "py-3"],
    borderColor: ["border-zinc-100", "dark:border-zinc-800"],
  },
  input: {
    required: ["w-full", "rounded-lg", "border", "py-2", "pl-10", "pr-4", "text-sm"],
    focus: ["focus:outline-none", "focus:ring-1"],
  },
  icon: {
    required: ["absolute", "left-3", "top-1/2", "-translate-y-1/2"],
    size: ["h-4", "w-4"],
  },
};

/**
 * Modal split content pattern
 */
export const MODAL_SPLIT_CONTENT_PATTERN = {
  container: {
    required: ["flex", "flex-1", "overflow-hidden"],
  },
  leftColumn: {
    required: ["w-1/2", "overflow-y-auto", "border-r", "p-4"],
    borderColor: ["border-zinc-100", "dark:border-zinc-800"],
  },
  rightColumn: {
    required: ["w-1/2", "overflow-y-auto", "p-4"],
  },
};

/**
 * Modal item row pattern (in left column)
 */
export const MODAL_ITEM_ROW_PATTERN = {
  container: {
    required: ["w-full", "rounded-lg", "border", "p-2.5", "text-left", "transition-all"],
  },
  states: {
    selected: ["border-{accent}-400", "bg-{accent}-50"],
    selectable: ["border-zinc-200", "bg-white", "hover:border-{accent}-400"],
    disabled: ["cursor-not-allowed", "opacity-50"],
  },
};

/**
 * Modal detail preview empty state
 */
export const MODAL_EMPTY_PREVIEW_PATTERN = {
  container: {
    required: ["flex", "items-center", "justify-center", "h-full"],
  },
  text: {
    required: ["text-sm"],
    colors: ["text-zinc-400", "dark:text-zinc-500"],
  },
};

/**
 * Modal purchase button pattern
 */
export const MODAL_PURCHASE_BUTTON_PATTERN = {
  required: ["w-full", "rounded-lg", "py-3", "text-sm", "font-medium", "transition-colors"],
  enabled: {
    // Should use accent color: bg-{accent}-500 hover:bg-{accent}-600
    textColor: "text-white",
  },
  disabled: {
    required: ["cursor-not-allowed"],
    colors: ["bg-zinc-100", "text-zinc-400", "dark:bg-zinc-800", "dark:text-zinc-500"],
  },
};

/**
 * Modal footer pattern
 */
export const MODAL_FOOTER_PATTERN = {
  container: {
    required: ["flex", "items-center", "justify-between", "border-t", "px-6", "py-3"],
    borderColor: ["border-zinc-200", "dark:border-zinc-700"],
  },
  cancelButton: {
    required: ["px-4", "py-2", "text-sm", "font-medium"],
    colors: ["text-zinc-600", "hover:text-zinc-900", "dark:text-zinc-400"],
  },
};

// =============================================================================
// FORM MODAL PATTERNS (Configuration-based modals)
// =============================================================================

/**
 * Modals that should follow the form-based configuration pattern
 */
export const FORM_MODAL_COMPONENTS = [
  "FocusModal",
  "ContactModal",
  "IdentityModal",
  "LicenseModal",
  "LifestyleModal",
  "SkillModal",
  "SkillGroupModal",
];

/**
 * File patterns that indicate a form modal component
 */
export const FORM_MODAL_FILE_PATTERNS = [
  /FocusModal\.tsx$/,
  /ContactModal\.tsx$/,
  /IdentityModal\.tsx$/,
  /LicenseModal\.tsx$/,
  /LifestyleModal\.tsx$/,
  /SkillModal\.tsx$/,
  /SkillGroupModal\.tsx$/,
];

/**
 * Form modal uses ModalHeader, ModalBody, ModalFooter components
 */
export const FORM_MODAL_STRUCTURE = {
  components: ["ModalHeader", "ModalBody", "ModalFooter"],
  size: "lg", // typically smaller than selection modals
};

/**
 * Form modal action buttons pattern
 */
export const FORM_MODAL_BUTTONS_PATTERN = {
  footer: {
    required: ["justify-end", "gap-3"],
  },
  cancelButton: {
    required: ["rounded-lg", "px-4", "py-2", "text-sm", "font-medium"],
    colors: ["text-zinc-600", "hover:bg-zinc-100", "dark:text-zinc-400", "dark:hover:bg-zinc-800"],
  },
  submitButton: {
    required: ["rounded-lg", "px-4", "py-2", "text-sm", "font-medium", "transition-colors"],
    // Should use accent color: bg-{accent}-500 hover:bg-{accent}-600
    textColor: "text-white",
    disabled: ["cursor-not-allowed", "bg-zinc-100", "text-zinc-400", "dark:bg-zinc-800"],
  },
};
