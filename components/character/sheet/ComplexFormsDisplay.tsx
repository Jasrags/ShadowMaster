"use client";

import { useState, useMemo } from "react";
import { DisplayCard } from "./DisplayCard";
import { ChevronDown, ChevronRight, Braces } from "lucide-react";
import { useComplexForms, type ComplexFormData } from "@/lib/rules";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toTitleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ---------------------------------------------------------------------------
// ComplexFormRow (expandable, catalog-matched)
// ---------------------------------------------------------------------------

function ComplexFormRow({ form }: { form: ComplexFormData }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      data-testid="complex-form-row"
      onClick={() => setIsExpanded(!isExpanded)}
      className="cursor-pointer px-3 py-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/30 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
    >
      {/* Collapsed row: Chevron + Name + Target badge ... Fading pill */}
      <div className="flex min-w-0 items-center gap-1.5">
        <span data-testid="expand-button" className="shrink-0 text-zinc-400">
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </span>
        <span
          title={form.name}
          className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200"
        >
          {form.name}
        </span>
        <span
          data-testid="target-badge"
          className="shrink-0 rounded border border-zinc-400/20 bg-zinc-400/12 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-zinc-600 dark:text-zinc-300"
        >
          {form.target}
        </span>
        <span
          data-testid="fading-pill"
          className="ml-auto shrink-0 rounded border border-cyan-500/20 bg-cyan-500/12 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-cyan-600 dark:text-cyan-300"
        >
          {form.fading}
        </span>
      </div>

      {/* Expanded section */}
      {isExpanded && (
        <div
          data-testid="expanded-content"
          onClick={(e) => e.stopPropagation()}
          className="ml-5 mt-2 space-y-2 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700"
        >
          {/* Stats row */}
          <div
            data-testid="stats-row"
            className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400"
          >
            <span data-testid="stat-target">
              Target{" "}
              <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                {toTitleCase(form.target)}
              </span>
            </span>
            <span data-testid="stat-duration">
              Duration{" "}
              <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                {toTitleCase(form.duration)}
              </span>
            </span>
          </div>

          {/* Description */}
          {form.description && (
            <p
              data-testid="form-description"
              className="text-xs italic text-zinc-500 dark:text-zinc-400"
            >
              {form.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// FallbackRow (non-expandable, unmatched ID)
// ---------------------------------------------------------------------------

function FallbackRow({ formId }: { formId: string }) {
  return (
    <div
      data-testid="fallback-row"
      className="px-3 py-1.5 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
    >
      <div className="flex min-w-0 items-center gap-1.5">
        {/* Spacer instead of chevron */}
        <span className="inline-block h-3.5 w-3.5 shrink-0" />
        <span className="truncate text-[13px] font-medium capitalize text-zinc-800 dark:text-zinc-200">
          {formId.replace(/-/g, " ")}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ComplexFormsDisplay
// ---------------------------------------------------------------------------

interface ComplexFormsDisplayProps {
  complexForms: string[];
  onSelect?: (pool: number, label: string) => void;
}

export function ComplexFormsDisplay({ complexForms }: ComplexFormsDisplayProps) {
  const catalog = useComplexForms();

  const rows = useMemo(() => {
    return complexForms.map((id) => ({
      id,
      form: catalog.find((f) => f.id === id) ?? null,
    }));
  }, [complexForms, catalog]);

  if (complexForms.length === 0) return null;

  return (
    <DisplayCard title="Complex Forms" icon={<Braces className="h-4 w-4 text-cyan-400" />}>
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
        {rows.map(({ id, form }) =>
          form ? <ComplexFormRow key={id} form={form} /> : <FallbackRow key={id} formId={id} />
        )}
      </div>
    </DisplayCard>
  );
}
