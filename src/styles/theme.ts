/**
 * Shadowrun Cyberpunk Theme Configuration
 * 
 * This theme provides a dark, neon-accented color palette inspired by
 * Shadowrun's cyberpunk aesthetic with support for dark mode.
 */

export const shadowrunTheme = {
  colors: {
    // Primary colors - Neon green (matrix green)
    primary: {
      DEFAULT: "hsl(142, 76%, 36%)", // Bright neon green
      fg: "hsl(0, 0%, 100%)", // White text on primary
    },
    
    // Secondary colors - Electric blue
    secondary: {
      DEFAULT: "hsl(200, 100%, 50%)", // Electric blue
      fg: "hsl(0, 0%, 100%)", // White text on secondary
    },
    
    // Warning colors - Amber/yellow
    warning: {
      DEFAULT: "hsl(45, 100%, 51%)", // Amber warning
      fg: "hsl(0, 0%, 0%)", // Black text on warning
    },
    
    // Danger colors - Neon red/pink
    danger: {
      DEFAULT: "hsl(340, 75%, 55%)", // Neon pink-red
      fg: "hsl(0, 0%, 100%)", // White text on danger
    },
    
    // Background colors
    bg: {
      DEFAULT: "hsl(220, 20%, 8%)", // Very dark blue-gray
      muted: "hsl(220, 22%, 24%)", // Lighter for cards and sidebars (improved contrast)
    },
    
    // Foreground colors
    fg: {
      DEFAULT: "hsl(142, 35%, 92%)", // Light green-tinted text (brighter for better contrast)
      muted: "hsl(220, 10%, 60%)", // Muted text
      subtle: "hsl(220, 8%, 45%)", // Very subtle text
    },
    
    // Border and ring colors
    border: "hsl(220, 15%, 25%)",
    ring: "hsl(142, 76%, 36%)", // Primary green for focus rings
    
    // Overlay colors (for modals, popovers)
    overlay: {
      DEFAULT: "hsl(220, 20%, 10%)", // Dark overlay background
      fg: "hsl(142, 30%, 85%)", // Light text on overlay
    },
    
    // Input colors
    input: {
      DEFAULT: "hsl(220, 15%, 15%)", // Input background
      border: "hsl(220, 15%, 30%)", // Input border
    },
  },
  
  // Border radius
  radius: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
  },
  
  // Spacing scale (using rem units)
  spacing: {
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      mono: ['Menlo', 'Monaco', 'Consolas', 'monospace'],
    },
  },
} as const;

/**
 * CSS variable definitions for Intent UI components
 * These map to the CSS variables used by Intent UI components
 */
export const themeCSSVariables = {
  // Color variables
  "--color-primary": shadowrunTheme.colors.primary.DEFAULT,
  "--color-primary-fg": shadowrunTheme.colors.primary.fg,
  "--color-secondary": shadowrunTheme.colors.secondary.DEFAULT,
  "--color-secondary-fg": shadowrunTheme.colors.secondary.fg,
  "--color-warning": shadowrunTheme.colors.warning.DEFAULT,
  "--color-warning-fg": shadowrunTheme.colors.warning.fg,
  "--color-danger": shadowrunTheme.colors.danger.DEFAULT,
  "--color-danger-fg": shadowrunTheme.colors.danger.fg,
  "--color-muted-fg": shadowrunTheme.colors.fg.muted,
  "--color-fg": shadowrunTheme.colors.fg.DEFAULT,
  "--color-ring": shadowrunTheme.colors.ring,
  "--color-border": shadowrunTheme.colors.border,
  
  // Background variables
  "--color-bg": shadowrunTheme.colors.bg.DEFAULT,
  "--color-bg-muted": shadowrunTheme.colors.bg.muted,
  
  // Overlay variables
  "--color-overlay": shadowrunTheme.colors.overlay.DEFAULT,
  "--color-overlay-fg": shadowrunTheme.colors.overlay.fg,
  
  // Input variables
  "--color-input": shadowrunTheme.colors.input.DEFAULT,
  "--color-input-border": shadowrunTheme.colors.input.border,
  
  // Radius variables
  "--radius-sm": shadowrunTheme.radius.sm,
  "--radius-md": shadowrunTheme.radius.md,
  "--radius-lg": shadowrunTheme.radius.lg,
  "--radius-xl": shadowrunTheme.radius.xl,
  "--radius-2xl": shadowrunTheme.radius["2xl"],
} as const;

