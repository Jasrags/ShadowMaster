"use client";

import type { Character } from "@/lib/types";
import { DisplayCard } from "./DisplayCard";
import { Activity } from "lucide-react";
import { Tooltip } from "@/components/ui";
import { Button as AriaButton } from "react-aria-components";

interface DerivedStatsDisplayProps {
  character: Character;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function attr(character: Character, key: string): number {
  return character.attributes?.[key] || 1;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface BreakdownItem {
  label: string;
  value: number | string;
}

function BreakdownTooltipContent({
  formula,
  items,
  result,
}: {
  formula: string;
  items: BreakdownItem[];
  result: string | number;
}) {
  return (
    <div className="space-y-1">
      <div className="font-mono text-[11px] text-zinc-400">{formula}</div>
      {items.map((item, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <span className="text-zinc-400">{item.label}</span>
          <span className="font-mono font-semibold text-zinc-200">{item.value}</span>
        </div>
      ))}
      <div className="border-t border-zinc-600" />
      <div className="flex items-center justify-between gap-4">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-200">
          Result
        </span>
        <span className="font-mono font-bold text-zinc-100">{result}</span>
      </div>
    </div>
  );
}

function StatRow({
  label,
  value,
  formula,
  breakdown,
}: {
  label: string;
  value: string | number;
  formula?: string;
  breakdown?: BreakdownItem[];
}) {
  const pillClasses =
    "rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50";

  return (
    <div className="flex items-center justify-between px-3 py-1.5 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50">
      <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">{label}</span>
      {formula && breakdown ? (
        <Tooltip
          content={<BreakdownTooltipContent formula={formula} items={breakdown} result={value} />}
          delay={200}
          showArrow={false}
        >
          <AriaButton
            aria-label={`${label} formula breakdown`}
            className={`${pillClasses} cursor-help focus:outline-none focus:ring-2 focus:ring-zinc-500`}
          >
            {value}
          </AriaButton>
        </Tooltip>
      ) : (
        <span className={pillClasses}>{value}</span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function DerivedStatsDisplay({ character }: DerivedStatsDisplayProps) {
  const body = attr(character, "body");
  const agility = attr(character, "agility");
  const reaction = attr(character, "reaction");
  const strength = attr(character, "strength");
  const willpower = attr(character, "willpower");
  const logic = attr(character, "logic");
  const intuition = attr(character, "intuition");
  const charisma = attr(character, "charisma");
  const essence = character.specialAttributes?.essence ?? 6;

  // Derived values
  const initiative = reaction + intuition;
  const physicalLimit = Math.ceil((strength * 2 + body + reaction) / 3);
  const mentalLimit = Math.ceil((logic * 2 + intuition + willpower) / 3);
  const socialLimit = Math.ceil((charisma * 2 + willpower + Math.ceil(essence)) / 3);
  const physicalCM = Math.ceil(body / 2) + 8;
  const stunCM = Math.ceil(willpower / 2) + 8;
  const overflow = body;
  const composure = charisma + willpower;
  const judgeIntentions = charisma + intuition;
  const memory = logic + willpower;
  const liftCarry = body + strength;
  const walkSpeed = agility * 2;
  const runSpeed = agility * 4;

  // Armor total from equipped armor
  const equippedArmor = (character.armor || []).filter((a) => a.equipped);
  const armorTotal = equippedArmor.reduce((sum, a) => sum + (a.armorRating || 0), 0);
  const hasArmor = equippedArmor.length > 0;

  return (
    <DisplayCard
      id="sheet-derived-stats"
      title="Derived Stats"
      icon={<Activity className="h-4 w-4 text-zinc-400" />}
      collapsible
    >
      <div className="space-y-3">
        {/* Initiative */}
        <div>
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Initiative
          </div>
          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
            <StatRow
              label="Initiative"
              value={`${initiative}+1d6`}
              formula="REA + INT + 1d6"
              breakdown={[
                { label: "REA", value: reaction },
                { label: "INT", value: intuition },
              ]}
            />
          </div>
        </div>

        {/* Limits */}
        <div>
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Limits
          </div>
          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
            <StatRow
              label="Physical"
              value={physicalLimit}
              formula="(STR×2 + BOD + REA) / 3"
              breakdown={[
                { label: "STR × 2", value: strength * 2 },
                { label: "BOD", value: body },
                { label: "REA", value: reaction },
              ]}
            />
            <StatRow
              label="Mental"
              value={mentalLimit}
              formula="(LOG×2 + INT + WIL) / 3"
              breakdown={[
                { label: "LOG × 2", value: logic * 2 },
                { label: "INT", value: intuition },
                { label: "WIL", value: willpower },
              ]}
            />
            <StatRow
              label="Social"
              value={socialLimit}
              formula="(CHA×2 + WIL + ESS) / 3"
              breakdown={[
                { label: "CHA × 2", value: charisma * 2 },
                { label: "WIL", value: willpower },
                { label: "ESS", value: Math.ceil(essence) },
              ]}
            />
          </div>
        </div>

        {/* Condition Monitors */}
        <div>
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Condition Monitors
          </div>
          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
            <StatRow
              label="Physical CM"
              value={physicalCM}
              formula="(BOD / 2) + 8"
              breakdown={[{ label: "BOD", value: body }]}
            />
            <StatRow
              label="Stun CM"
              value={stunCM}
              formula="(WIL / 2) + 8"
              breakdown={[{ label: "WIL", value: willpower }]}
            />
            <StatRow
              label="Overflow"
              value={overflow}
              formula="= BOD"
              breakdown={[{ label: "BOD", value: body }]}
            />
          </div>
        </div>

        {/* Pools */}
        <div>
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Pools
          </div>
          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
            <StatRow
              label="Composure"
              value={composure}
              formula="CHA + WIL"
              breakdown={[
                { label: "CHA", value: charisma },
                { label: "WIL", value: willpower },
              ]}
            />
            <StatRow
              label="Judge Intentions"
              value={judgeIntentions}
              formula="CHA + INT"
              breakdown={[
                { label: "CHA", value: charisma },
                { label: "INT", value: intuition },
              ]}
            />
            <StatRow
              label="Memory"
              value={memory}
              formula="LOG + WIL"
              breakdown={[
                { label: "LOG", value: logic },
                { label: "WIL", value: willpower },
              ]}
            />
            <StatRow
              label="Lift/Carry"
              value={`${liftCarry} kg`}
              formula="BOD + STR"
              breakdown={[
                { label: "BOD", value: body },
                { label: "STR", value: strength },
              ]}
            />
          </div>
        </div>

        {/* Movement */}
        <div>
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Movement
          </div>
          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
            <StatRow
              label="Walk"
              value={`${walkSpeed}m`}
              formula="AGI × 2"
              breakdown={[{ label: "AGI", value: agility }]}
            />
            <StatRow
              label="Run"
              value={`${runSpeed}m`}
              formula="AGI × 4"
              breakdown={[{ label: "AGI", value: agility }]}
            />
          </div>
        </div>

        {/* Armor */}
        {hasArmor && (
          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Armor
            </div>
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
              <StatRow
                label="Total"
                value={armorTotal}
                formula="Sum of equipped armor"
                breakdown={equippedArmor.map((a) => ({
                  label: a.name,
                  value: a.armorRating || 0,
                }))}
              />
            </div>
          </div>
        )}
      </div>
    </DisplayCard>
  );
}
