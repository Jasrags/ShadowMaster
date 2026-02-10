"use client";

/**
 * @deprecated Use DisplayCard from @/components/character/sheet instead.
 * This component uses the legacy theme system. New display components should
 * use DisplayCard which follows the creation card styling (zinc/emerald palette).
 * Existing usages will migrate incrementally in Phase 4.
 */

import React from "react";
import { Theme, THEMES, DEFAULT_THEME } from "@/lib/themes";

interface SectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  theme?: Theme;
}

export function Section({ title, icon, children, className = "", theme }: SectionProps) {
  const t = theme || THEMES[DEFAULT_THEME];

  return (
    <div className={`relative ${className}`}>
      {/* Corner accents */}
      {t.components.section.cornerAccent && (
        <>
          <div className="absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 border-emerald-500/50" />
          <div className="absolute -top-px -right-px w-4 h-4 border-t-2 border-r-2 border-emerald-500/50" />
          <div className="absolute -bottom-px -left-px w-4 h-4 border-b-2 border-l-2 border-emerald-500/50" />
          <div className="absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 border-emerald-500/50" />
        </>
      )}

      <div className={t.components.section.wrapper}>
        <div className={`flex items-center gap-2 px-4 py-2 ${t.components.section.header}`}>
          {icon}
          <h3 className={t.components.section.title}>{title}</h3>
          <div
            className={`flex-1 h-px ml-2 ${t.id === "modern-card" ? "bg-stone-200 dark:bg-stone-800" : "bg-linear-to-r from-emerald-500/20 to-transparent"}`}
          />
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
