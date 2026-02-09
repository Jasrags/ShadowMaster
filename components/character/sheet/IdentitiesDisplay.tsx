"use client";

import type { Character } from "@/lib/types";
import { DisplayCard } from "./DisplayCard";
import { Fingerprint } from "lucide-react";

interface IdentitiesDisplayProps {
  character: Character;
}

export function IdentitiesDisplay({ character }: IdentitiesDisplayProps) {
  const identities = character.identities || [];

  if (identities.length === 0) return null;

  return (
    <DisplayCard title="Identities & SINs" icon={<Fingerprint className="h-4 w-4 text-zinc-400" />}>
      <div className="space-y-3">
        {identities.map((identity, index) => (
          <div
            key={identity.id || `identity-${index}`}
            className="p-3 bg-zinc-50 dark:bg-zinc-800/30 rounded border border-zinc-200 dark:border-zinc-700"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {identity.name}
              </span>
              <span
                className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                  identity.sin.type === "real"
                    ? "text-amber-500 border-amber-500/30 bg-amber-500/5"
                    : "text-violet-400 border-violet-500/30 bg-violet-500/5"
                }`}
              >
                {identity.sin.type === "real"
                  ? `Real SIN (${identity.sin.sinnerQuality})`
                  : `Fake SIN R${identity.sin.rating}`}
              </span>
            </div>
            {identity.licenses.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {identity.licenses.map((license, lIdx) => (
                  <span
                    key={license.id || `license-${lIdx}`}
                    className="px-2 py-0.5 text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded border border-zinc-200 dark:border-zinc-700"
                  >
                    {license.name}
                    {license.rating ? ` R${license.rating}` : ""}
                  </span>
                ))}
              </div>
            )}
            {identity.notes && (
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2 italic">
                {identity.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </DisplayCard>
  );
}
