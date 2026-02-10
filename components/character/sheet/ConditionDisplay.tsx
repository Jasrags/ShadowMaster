"use client";

import { DisplayCard } from "./DisplayCard";
import { Heart } from "lucide-react";
import { InteractiveConditionMonitor } from "@/app/characters/[id]/components/InteractiveConditionMonitor";
import type { Character } from "@/lib/types";
import { THEMES, DEFAULT_THEME, type Theme } from "@/lib/themes";

interface ConditionDisplayProps {
  character: Character;
  woundModifier: number;
  physicalMonitorMax: number;
  stunMonitorMax: number;
  theme?: Theme;
  readonly: boolean;
  onDamageApplied: (type: "physical" | "stun" | "overflow", newValue: number) => void;
}

export function ConditionDisplay({
  character,
  woundModifier,
  physicalMonitorMax,
  stunMonitorMax,
  theme,
  readonly,
  onDamageApplied,
}: ConditionDisplayProps) {
  const t = theme || THEMES[DEFAULT_THEME];
  return (
    <DisplayCard title="Condition" icon={<Heart className="h-4 w-4 text-zinc-400" />}>
      <div className="space-y-6">
        {woundModifier !== 0 && (
          <div className="p-2 rounded text-center bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400">
            <span className="text-xs font-mono uppercase">Total Wound Modifier: </span>
            <span className="font-mono font-bold">{woundModifier}</span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <InteractiveConditionMonitor
            characterId={character.id}
            type="physical"
            current={character.condition?.physicalDamage ?? 0}
            max={physicalMonitorMax}
            theme={t}
            readonly={readonly}
            onDamageApplied={(newValue) => onDamageApplied("physical", newValue)}
          />
          <InteractiveConditionMonitor
            characterId={character.id}
            type="stun"
            current={character.condition?.stunDamage ?? 0}
            max={stunMonitorMax}
            theme={t}
            readonly={readonly}
            onDamageApplied={(newValue) => onDamageApplied("stun", newValue)}
          />
        </div>
        <InteractiveConditionMonitor
          characterId={character.id}
          type="overflow"
          current={character.condition?.overflowDamage ?? 0}
          max={character.attributes?.body || 3}
          theme={t}
          readonly={readonly}
          onDamageApplied={(newValue) => onDamageApplied("overflow", newValue)}
        />
      </div>
    </DisplayCard>
  );
}
