"use client";

import { DisplayCard } from "./DisplayCard";
import { Braces } from "lucide-react";

interface ComplexFormsDisplayProps {
  complexForms: string[];
  onSelect?: (pool: number, label: string) => void;
}

export function ComplexFormsDisplay({ complexForms, onSelect }: ComplexFormsDisplayProps) {
  if (complexForms.length === 0) return null;

  return (
    <DisplayCard title="Complex Forms" icon={<Braces className="h-4 w-4 text-zinc-400" />}>
      <div className="space-y-2">
        {complexForms.map((formId) => (
          <div
            key={formId}
            onClick={() => onSelect?.(6, formId.replace(/-/g, " "))}
            className="p-3 rounded border border-cyan-500/30 bg-zinc-50 dark:bg-zinc-800/30 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors group"
          >
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 capitalize group-hover:text-cyan-500 transition-colors">
              {formId.replace(/-/g, " ")}
            </span>
          </div>
        ))}
      </div>
    </DisplayCard>
  );
}
