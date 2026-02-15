"use client";

import type { Character } from "@/lib/types";
import { DisplayCard } from "./DisplayCard";
import { getAttributeBonus } from "./constants";
import { BarChart3, ArrowUp, ArrowDown } from "lucide-react";
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

const SPECIAL_ATTRIBUTES = ["edge", "essence", "magic", "resonance"];

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

function EssenceLossTooltipContent({
  losses,
}: {
  losses: Array<{ source: string; cost: number }>;
}) {
  const total = losses.reduce((sum, l) => sum + l.cost, 0);
  return (
    <div className="space-y-1">
      {losses.map((l, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <span className="text-zinc-400">{l.source}</span>
          <span className="font-mono font-semibold text-rose-400">-{l.cost.toFixed(2)}</span>
        </div>
      ))}
      {losses.length > 1 && (
        <>
          <div className="border-t border-zinc-600" />
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-200">
              Total Loss
            </span>
            <span className="font-mono font-bold text-rose-300">-{total.toFixed(2)}</span>
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
  essenceLosses,
  onClick,
}: {
  attrKey: string;
  value: number;
  essenceLosses?: Array<{ source: string; cost: number }>;
  onClick?: () => void;
}) {
  if (!SPECIAL_ATTRIBUTES.includes(attrKey)) return null;

  const label = attrKey.charAt(0).toUpperCase() + attrKey.slice(1);
  const isEssence = attrKey === "essence";
  const displayValue = isEssence ? value.toFixed(2) : String(value);
  const hasEssenceLoss = isEssence && essenceLosses && essenceLosses.length > 0;
  const totalLoss = hasEssenceLoss ? essenceLosses.reduce((sum, l) => sum + l.cost, 0) : 0;

  return (
    <div
      onClick={isEssence ? undefined : onClick}
      className={`group flex items-center justify-between rounded px-1 py-[7px] transition-colors [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50 ${
        isEssence ? "" : "cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700/30"
      }`}
    >
      <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">{label}</span>
      <div className="flex items-center gap-2">
        {hasEssenceLoss && (
          <span onClick={(e) => e.stopPropagation()}>
            <Tooltip
              content={<EssenceLossTooltipContent losses={essenceLosses} />}
              delay={200}
              showArrow={false}
            >
              <AriaButton
                aria-label="Essence loss details"
                className="inline-flex items-center gap-0.5 rounded bg-rose-500/15 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                -{totalLoss.toFixed(2)}
                <ArrowDown className="h-2.5 w-2.5" />
              </AriaButton>
            </Tooltip>
          </span>
        )}
        <div
          className={`flex h-7 items-center justify-center rounded-md font-mono text-sm font-bold bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50 ${
            isEssence ? "w-12" : "w-8"
          }`}
        >
          {displayValue}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function AttributesDisplay({ character, onSelect }: AttributesDisplayProps) {
  const essenceLosses: Array<{ source: string; cost: number }> = [];
  character.cyberware?.forEach((item) => {
    if (item.essenceCost > 0) essenceLosses.push({ source: item.name, cost: item.essenceCost });
  });
  character.bioware?.forEach((item) => {
    if (item.essenceCost > 0) essenceLosses.push({ source: item.name, cost: item.essenceCost });
  });

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
        <SpecialAttributeRow
          attrKey="essence"
          value={character.specialAttributes.essence}
          essenceLosses={essenceLosses}
        />
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
