"use client";

import { useMemo } from "react";
import { DisplayCard } from "./DisplayCard";
import { Braces } from "lucide-react";
import { useComplexForms, type ComplexFormData } from "@/lib/rules";

interface ComplexFormsDisplayProps {
  complexForms: string[];
  onSelect?: (pool: number, label: string) => void;
}

function ComplexFormItem({
  formId,
  catalog,
  onSelect,
}: {
  formId: string;
  catalog: ComplexFormData[];
  onSelect?: (pool: number, label: string) => void;
}) {
  const form = useMemo(() => catalog.find((f) => f.id === formId), [formId, catalog]);

  // Fallback: no catalog match — render kebab-case display
  if (!form) {
    return (
      <div
        onClick={() => onSelect?.(6, formId.replace(/-/g, " "))}
        className="p-3 rounded border border-cyan-500/30 bg-zinc-50 dark:bg-zinc-800/30 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors group"
      >
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 capitalize group-hover:text-cyan-500 transition-colors">
          {formId.replace(/-/g, " ")}
        </span>
      </div>
    );
  }

  // Rich rendering with catalog metadata
  return (
    <div
      onClick={() => onSelect?.(6, form.name)}
      className="p-3 rounded transition-all cursor-pointer group bg-zinc-50 dark:bg-zinc-800/30 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 border border-cyan-500/30"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200 transition-colors group-hover:text-cyan-500 dark:group-hover:text-cyan-400">
            {form.name}
          </span>
          {form.description && (
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
              {form.description}
            </p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono mt-1">
            <div className="flex gap-1.5">
              <span className="text-zinc-400 dark:text-zinc-500">TARGET</span>
              <span className="text-blue-500 dark:text-blue-400 uppercase">{form.target}</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-zinc-400 dark:text-zinc-500">DUR</span>
              <span className="text-emerald-500 dark:text-emerald-400 uppercase">
                {form.duration}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-mono leading-none mb-1">
            Fading
          </div>
          <div className="text-sm font-mono text-cyan-500 dark:text-cyan-400 font-bold leading-none">
            {form.fading}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ComplexFormsDisplay({ complexForms, onSelect }: ComplexFormsDisplayProps) {
  const catalog = useComplexForms();

  if (complexForms.length === 0) return null;

  return (
    <DisplayCard title="Complex Forms" icon={<Braces className="h-4 w-4 text-cyan-400" />}>
      <div className="space-y-3">
        {complexForms.map((formId) => (
          <ComplexFormItem key={formId} formId={formId} catalog={catalog} onSelect={onSelect} />
        ))}
      </div>
    </DisplayCard>
  );
}
