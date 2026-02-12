"use client";

import type { Character } from "@/lib/types";
import { DisplayCard } from "./DisplayCard";
import { getAttributeBonus } from "./constants";
import { BarChart3, Star, Sparkles, Cpu, CirclePlus, ArrowUp } from "lucide-react";
import { Tooltip } from "@/components/ui";
import { Button as AriaButton } from "react-aria-components";

interface AttributesDisplayProps {
  character: Character;
  onSelect?: (attrId: string, value: number) => void;
}

const PHYSICAL_ATTRIBUTES = [
  { id: "body", label: "Body" },
  { id: "agility", label: "Agility" },
  { id: "reaction", label: "Reaction" },
  { id: "strength", label: "Strength" },
];

const MENTAL_ATTRIBUTES = [
  { id: "willpower", label: "Willpower" },
  { id: "logic", label: "Logic" },
  { id: "intuition", label: "Intuition" },
  { id: "charisma", label: "Charisma" },
];

/**
 * Special attribute display config.
 * Dark-mode colors match the approved HTML mock exactly; light-mode
 * uses the closest readable equivalent on a white/zinc-50 background.
 */
const SPECIAL_ATTR_CONFIG: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
    nameColor: string;
    pillClasses: string;
  }
> = {
  // Edge — amber  (mock: icon #f59e0b, name #fbbf24, pill bg amber/15)
  edge: {
    icon: Star,
    iconColor: "text-amber-500",
    nameColor: "text-amber-600 dark:text-amber-400",
    pillClasses:
      "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/15 dark:border-amber-500/20 dark:text-amber-400",
  },
  // Essence — cyan  (mock: icon #22d3ee, name #67e8f9, pill bg cyan/12)
  essence: {
    icon: CirclePlus,
    iconColor: "text-cyan-500 dark:text-cyan-400",
    nameColor: "text-cyan-600 dark:text-cyan-300",
    pillClasses:
      "bg-cyan-50 border-cyan-200 text-cyan-700 dark:bg-cyan-400/12 dark:border-cyan-400/20 dark:text-cyan-300",
  },
  // Magic — purple  (mock: icon #a855f7, name #c084fc, pill bg purple/15)
  magic: {
    icon: Sparkles,
    iconColor: "text-purple-500",
    nameColor: "text-purple-600 dark:text-purple-400",
    pillClasses:
      "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-500/15 dark:border-purple-500/20 dark:text-purple-400",
  },
  // Resonance — sky  (mock: icon #38bdf8, name #7dd3fc, pill bg sky/12)
  resonance: {
    icon: Cpu,
    iconColor: "text-sky-500 dark:text-sky-400",
    nameColor: "text-sky-600 dark:text-sky-300",
    pillClasses:
      "bg-sky-50 border-sky-200 text-sky-700 dark:bg-sky-400/12 dark:border-sky-400/20 dark:text-sky-300",
  },
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function AugTooltipContent({ bonuses }: { bonuses: Array<{ source: string; value: number }> }) {
  const total = bonuses.reduce((sum, b) => sum + b.value, 0);
  return (
    <div className="space-y-1">
      {bonuses.map((b, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <span className="text-zinc-400">{b.source}</span>
          <span className="font-mono font-semibold text-emerald-400">+{b.value}</span>
        </div>
      ))}
      {bonuses.length > 1 && (
        <>
          <div className="border-t border-zinc-600" />
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-200">
              Total Aug
            </span>
            <span className="font-mono font-bold text-emerald-300">+{total}</span>
          </div>
        </>
      )}
    </div>
  );
}

function CoreAttributeRow({
  label,
  base,
  augTotal,
  bonuses,
  onClick,
}: {
  label: string;
  base: number;
  augTotal: number;
  bonuses: Array<{ source: string; value: number }>;
  onClick?: () => void;
}) {
  const effective = base + augTotal;
  const isAugmented = augTotal > 0;

  return (
    <div
      onClick={onClick}
      className="group flex cursor-pointer items-center justify-between rounded px-1 py-[7px] transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/30 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
    >
      <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">{label}</span>
      <div className="flex items-center gap-2">
        {isAugmented && (
          <span onClick={(e) => e.stopPropagation()}>
            <Tooltip
              content={<AugTooltipContent bonuses={bonuses} />}
              delay={200}
              showArrow={false}
            >
              <AriaButton
                aria-label={`${label} augmentation details`}
                className="inline-flex items-center gap-0.5 rounded bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                +{augTotal}
                <ArrowUp className="h-2.5 w-2.5" />
              </AriaButton>
            </Tooltip>
          </span>
        )}
        <div
          className={`flex h-7 w-8 items-center justify-center rounded-md font-mono text-sm font-bold ${
            isAugmented
              ? "border border-emerald-500/20 bg-emerald-500/12 text-emerald-300"
              : "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
          }`}
        >
          {effective}
        </div>
      </div>
    </div>
  );
}

function SpecialAttributeRow({
  attrKey,
  value,
  onClick,
}: {
  attrKey: string;
  value: number;
  onClick?: () => void;
}) {
  const config = SPECIAL_ATTR_CONFIG[attrKey];
  if (!config) return null;

  const Icon = config.icon;
  const label = attrKey.charAt(0).toUpperCase() + attrKey.slice(1);
  const isEssence = attrKey === "essence";
  const displayValue = isEssence ? value.toFixed(2) : String(value);

  return (
    <div
      onClick={isEssence ? undefined : onClick}
      className={`group flex items-center justify-between rounded px-1 py-[7px] transition-colors [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50 ${
        isEssence ? "" : "cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700/30"
      }`}
    >
      <div className="flex items-center gap-1.5">
        <Icon className={`h-3.5 w-3.5 shrink-0 ${config.iconColor}`} />
        <span className={`text-[13px] font-medium ${config.nameColor}`}>{label}</span>
      </div>
      <div
        className={`flex h-7 items-center justify-center rounded-md border font-mono text-sm font-bold ${config.pillClasses} ${
          isEssence ? "w-12" : "w-8"
        }`}
      >
        {displayValue}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function AttributesDisplay({ character, onSelect }: AttributesDisplayProps) {
  function renderCoreSection(title: string, attrs: Array<{ id: string; label: string }>) {
    return (
      <>
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          {title}
        </div>
        <div className="mb-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1 dark:border-zinc-800 dark:bg-zinc-950">
          {attrs.map(({ id, label }) => {
            const base = character.attributes[id] || 0;
            const bonuses = getAttributeBonus(character, id);
            const augTotal = bonuses.reduce((sum, b) => sum + b.value, 0);

            return (
              <CoreAttributeRow
                key={id}
                label={label}
                base={base}
                augTotal={augTotal}
                bonuses={bonuses}
                onClick={() => onSelect?.(id, base + augTotal)}
              />
            );
          })}
        </div>
      </>
    );
  }

  return (
    <DisplayCard title="Attributes" icon={<BarChart3 className="h-4 w-4 text-zinc-400" />}>
      {renderCoreSection("Physical", PHYSICAL_ATTRIBUTES)}
      {renderCoreSection("Mental", MENTAL_ATTRIBUTES)}

      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
        Special
      </div>
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1 dark:border-zinc-800 dark:bg-zinc-950">
        <SpecialAttributeRow
          attrKey="edge"
          value={character.specialAttributes.edge}
          onClick={() => onSelect?.("edge", character.specialAttributes.edge)}
        />
        <SpecialAttributeRow attrKey="essence" value={character.specialAttributes.essence} />
        {character.specialAttributes.magic !== undefined && (
          <SpecialAttributeRow
            attrKey="magic"
            value={character.specialAttributes.magic}
            onClick={() => onSelect?.("magic", character.specialAttributes.magic!)}
          />
        )}
        {character.specialAttributes.resonance !== undefined && (
          <SpecialAttributeRow
            attrKey="resonance"
            value={character.specialAttributes.resonance}
            onClick={() => onSelect?.("resonance", character.specialAttributes.resonance!)}
          />
        )}
      </div>
    </DisplayCard>
  );
}
