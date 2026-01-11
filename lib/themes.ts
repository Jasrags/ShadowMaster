export type ThemeId = "neon-rain" | "modern-card";

export interface Theme {
  id: ThemeId;
  name: string;
  colors: {
    background: string;
    card: string;
    border: string;
    accent: string;
    accentBg: string;
    muted: string;
    heading: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  components: {
    section: {
      wrapper: string;
      header: string;
      title: string;
      cornerAccent: boolean;
    };
    card: {
      wrapper: string;
      hover: string;
      border: string;
    };
    badge: {
      positive: string;
      negative: string;
      neutral: string;
    };
  };
}

export const THEMES: Record<ThemeId, Theme> = {
  "neon-rain": {
    id: "neon-rain",
    name: "Neon Rain",
    colors: {
      background: "bg-background",
      card: "bg-card/80 backdrop-blur-sm",
      border: "border-border",
      accent: "text-emerald-400",
      accentBg: "bg-emerald-500",
      muted: "text-muted-foreground",
      heading: "text-foreground",
    },
    fonts: {
      heading: "font-mono uppercase tracking-widest",
      body: "font-sans",
      mono: "font-mono",
    },
    components: {
      section: {
        wrapper: "border border-border bg-card/80 backdrop-blur-sm",
        header: "border-b border-border bg-card",
        title: "text-emerald-400 font-mono uppercase tracking-widest",
        cornerAccent: true,
      },
      card: {
        wrapper: "bg-muted/50 border-l-2",
        hover: "hover:bg-muted/80",
        border: "border-primary/40",
      },
      badge: {
        positive: "bg-emerald-950/50 text-emerald-400 border-emerald-700/50",
        negative: "bg-red-950/50 text-red-400 border-red-700/50",
        neutral: "bg-muted text-muted-foreground border-border",
      },
    },
  },
  "modern-card": {
    id: "modern-card",
    name: "Modern Card",
    colors: {
      background: "bg-stone-50 dark:bg-stone-950",
      card: "bg-stone-50 dark:bg-stone-900 shadow-sm",
      border: "border-stone-200 dark:border-stone-800",
      accent: "text-indigo-600 dark:text-indigo-400",
      accentBg: "bg-indigo-600 dark:bg-indigo-500",
      muted: "text-stone-500 dark:text-stone-400",
      heading: "text-stone-900 dark:text-stone-100",
    },
    fonts: {
      heading: "font-sans font-bold tracking-tight",
      body: "font-sans",
      mono: "font-mono",
    },
    components: {
      section: {
        wrapper:
          "bg-stone-50 dark:bg-stone-900 rounded-xl shadow-sm border border-stone-200 dark:border-stone-800",
        header:
          "border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50",
        title: "text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wide text-sm",
        cornerAccent: false,
      },
      card: {
        wrapper: "bg-stone-50 dark:bg-stone-900/50 border rounded-lg",
        hover: "hover:bg-stone-100 dark:hover:bg-stone-800 transition-all shadow-hover",
        border: "border-stone-200 dark:border-stone-700",
      },
      badge: {
        positive:
          "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
        negative:
          "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
        neutral:
          "bg-stone-100 text-stone-600 border-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700",
      },
    },
  },
};

export const DEFAULT_THEME: ThemeId = "neon-rain";
