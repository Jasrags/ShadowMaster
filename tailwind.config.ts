import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Intent UI theme colors
        primary: "var(--color-primary)",
        "primary-fg": "var(--color-primary-fg)",
        secondary: "var(--color-secondary)",
        "secondary-fg": "var(--color-secondary-fg)",
        warning: "var(--color-warning)",
        "warning-fg": "var(--color-warning-fg)",
        danger: "var(--color-danger)",
        "danger-fg": "var(--color-danger-fg)",
        fg: "var(--color-fg)",
        "muted-fg": "var(--color-muted-fg)",
        bg: "var(--color-bg)",
        "bg-muted": "var(--color-bg-muted)",
        border: "var(--color-border)",
        ring: "var(--color-ring)",
        overlay: "var(--color-overlay)",
        "overlay-fg": "var(--color-overlay-fg)",
        input: "var(--color-input)",
        "input-border": "var(--color-input-border)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
      },
    },
  },
  plugins: [],
};
export default config;

