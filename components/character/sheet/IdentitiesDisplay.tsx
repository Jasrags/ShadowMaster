"use client";

import { useState } from "react";
import type { Character, Identity, Lifestyle } from "@/lib/types";
import { SinnerQuality } from "@/lib/types";
import { DisplayCard } from "./DisplayCard";
import { ChevronDown, ChevronRight, Fingerprint } from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCost(cost: number): string {
  return `¥${cost.toLocaleString()}/mo`;
}

function formatSinnerQuality(quality: SinnerQuality): string {
  switch (quality) {
    case SinnerQuality.National:
      return "National";
    case SinnerQuality.Criminal:
      return "Criminal";
    case SinnerQuality.CorporateLimited:
      return "Corporate (Limited)";
    case SinnerQuality.CorporateBorn:
      return "Corporate Born";
    default:
      return String(quality);
  }
}

// ---------------------------------------------------------------------------
// Section config
// ---------------------------------------------------------------------------

const IDENTITY_SECTIONS = [
  { key: "real" as const, label: "Real SINs" },
  { key: "fake" as const, label: "Fake SINs" },
];

// ---------------------------------------------------------------------------
// IdentityRow
// ---------------------------------------------------------------------------

function IdentityRow({
  identity,
  lifestyles,
  primaryLifestyleId,
}: {
  identity: Identity;
  lifestyles: Lifestyle[];
  primaryLifestyleId?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const associatedLifestyles = identity.id
    ? lifestyles.filter((l) => l.associatedIdentityId === identity.id)
    : [];

  const hasExpandableContent =
    associatedLifestyles.length > 0 || identity.licenses.length > 0 || !!identity.notes;

  const isFake = identity.sin.type === "fake";

  return (
    <div
      data-testid="identity-row"
      className={`px-3 py-1.5 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50${
        hasExpandableContent
          ? " cursor-pointer transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/30"
          : ""
      }`}
      onClick={hasExpandableContent ? () => setIsExpanded(!isExpanded) : undefined}
    >
      {/* Collapsed row: chevron + name + SIN badge + value pill */}
      <div className="flex min-w-0 items-center gap-1.5">
        {hasExpandableContent ? (
          <span data-testid="expand-button" className="shrink-0 text-zinc-400">
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </span>
        ) : (
          <div className="w-3.5 shrink-0" />
        )}
        <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
          {identity.name}
        </span>
        <span
          data-testid="sin-type-badge"
          className="shrink-0 rounded border border-zinc-400/20 bg-zinc-400/10 px-1 text-[9px] font-bold uppercase text-zinc-500 dark:text-zinc-400"
        >
          {isFake ? "Fake" : "Real"}
        </span>
        <span
          data-testid="value-pill"
          className={`ml-auto shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
            isFake
              ? "border-violet-500/20 bg-violet-500/12 text-violet-600 dark:text-violet-300"
              : "border-amber-500/20 bg-amber-500/12 text-amber-600 dark:text-amber-300"
          }`}
        >
          {identity.sin.type === "fake"
            ? `R${identity.sin.rating}`
            : formatSinnerQuality(identity.sin.sinnerQuality)}
        </span>
      </div>

      {/* Expanded section */}
      {isExpanded && hasExpandableContent && (
        <div
          data-testid="expanded-content"
          className="ml-5 mt-2 space-y-2 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Lifestyles */}
          {associatedLifestyles.length > 0 && (
            <div data-testid="lifestyles-section">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Lifestyles
              </div>
              <div className="space-y-1">
                {associatedLifestyles.map((ls, idx) => (
                  <div
                    key={ls.id || `lifestyle-${idx}`}
                    data-testid="lifestyle-row"
                    className="text-xs text-zinc-600 dark:text-zinc-400"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium capitalize text-zinc-700 dark:text-zinc-300">
                        {ls.type}
                      </span>
                      {primaryLifestyleId === ls.id && (
                        <span
                          data-testid="lifestyle-primary-badge"
                          className="shrink-0 rounded border border-emerald-500/20 bg-emerald-500/12 px-1 text-[9px] font-bold uppercase text-emerald-600 dark:text-emerald-300"
                        >
                          Primary
                        </span>
                      )}
                      <span
                        data-testid="lifestyle-cost"
                        className="ml-auto shrink-0 font-mono text-[11px] text-zinc-500 dark:text-zinc-500"
                      >
                        {formatCost(ls.monthlyCost)}
                      </span>
                    </div>
                    {ls.location && (
                      <div className="mt-0.5 text-[10px] text-zinc-400 dark:text-zinc-500">
                        {ls.location}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Licenses */}
          {identity.licenses.length > 0 && (
            <div data-testid="licenses-section">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Licenses
              </div>
              <div className="space-y-0.5">
                {identity.licenses.map((license, idx) => (
                  <div
                    key={license.id || `license-${idx}`}
                    data-testid="license-row"
                    className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400"
                  >
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">
                      {license.name}
                    </span>
                    {license.rating != null && (
                      <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-500">
                        R{license.rating}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {identity.notes && (
            <p
              data-testid="identity-notes"
              className="text-xs italic text-zinc-500 dark:text-zinc-400"
            >
              {identity.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// IdentitiesDisplay
// ---------------------------------------------------------------------------

interface IdentitiesDisplayProps {
  character: Character;
}

export function IdentitiesDisplay({ character }: IdentitiesDisplayProps) {
  const identities = character.identities || [];

  if (identities.length === 0) return null;

  const grouped: Record<"real" | "fake", Identity[]> = {
    real: identities.filter((i) => i.sin.type === "real"),
    fake: identities.filter((i) => i.sin.type === "fake"),
  };

  return (
    <DisplayCard title="Identities & SINs" icon={<Fingerprint className="h-4 w-4 text-zinc-400" />}>
      <div className="space-y-3">
        {IDENTITY_SECTIONS.map(({ key, label }) => {
          if (grouped[key].length === 0) return null;
          return (
            <div key={key}>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                {label}
              </div>
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                {grouped[key].map((identity, idx) => (
                  <IdentityRow
                    key={identity.id || `identity-${idx}`}
                    identity={identity}
                    lifestyles={character.lifestyles || []}
                    primaryLifestyleId={character.primaryLifestyleId}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </DisplayCard>
  );
}
