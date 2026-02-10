"use client";

import { DisplayCard } from "./DisplayCard";
import { Activity, Shield, Heart, Brain, Footprints, ShieldCheck } from "lucide-react";

interface DerivedStatsDisplayProps {
  // Existing (required)
  physicalLimit: number;
  mentalLimit: number;
  socialLimit: number;
  initiative: number;
  // Condition Monitors (optional)
  physicalMonitorMax?: number;
  stunMonitorMax?: number;
  overflow?: number;
  // Secondary Pools (optional)
  composure?: number;
  judgeIntentions?: number;
  memory?: number;
  liftCarry?: number;
  // Movement (optional)
  walkSpeed?: number;
  runSpeed?: number;
  // Armor (optional)
  armorTotal?: number;
}

function StatBlock({
  label,
  value,
  colorClass = "text-zinc-900 dark:text-zinc-100",
}: {
  label: string;
  value: string | number;
  colorClass?: string;
}) {
  return (
    <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-800/30 rounded">
      <span className="block text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase">
        {label}
      </span>
      <span className={`text-xl font-mono font-bold ${colorClass}`}>{value}</span>
    </div>
  );
}

function SectionHeader({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
      {icon}
      {label}
    </div>
  );
}

export function DerivedStatsDisplay({
  physicalLimit,
  mentalLimit,
  socialLimit,
  initiative,
  physicalMonitorMax,
  stunMonitorMax,
  overflow,
  composure,
  judgeIntentions,
  memory,
  liftCarry,
  walkSpeed,
  runSpeed,
  armorTotal,
}: DerivedStatsDisplayProps) {
  const hasConditionMonitors =
    physicalMonitorMax !== undefined || stunMonitorMax !== undefined || overflow !== undefined;
  const hasPools =
    composure !== undefined ||
    judgeIntentions !== undefined ||
    memory !== undefined ||
    liftCarry !== undefined;
  const hasMovement = walkSpeed !== undefined || runSpeed !== undefined;
  const hasArmor = armorTotal !== undefined;

  return (
    <DisplayCard title="Derived Stats" icon={<Activity className="h-4 w-4 text-zinc-400" />}>
      <div className="space-y-4">
        {/* Initiative */}
        <div>
          <SectionHeader icon={<Activity className="h-3.5 w-3.5" />} label="Initiative" />
          <div className="grid grid-cols-1 gap-2">
            <StatBlock
              label="Initiative"
              value={`${initiative}+1d6`}
              colorClass="text-emerald-400"
            />
          </div>
        </div>

        {/* Limits */}
        <div>
          <SectionHeader icon={<Shield className="h-3.5 w-3.5" />} label="Limits" />
          <div className="grid grid-cols-3 gap-2">
            <StatBlock label="Physical" value={physicalLimit} colorClass="text-red-500" />
            <StatBlock label="Mental" value={mentalLimit} colorClass="text-blue-400" />
            <StatBlock label="Social" value={socialLimit} colorClass="text-pink-400" />
          </div>
        </div>

        {/* Condition Monitors */}
        {hasConditionMonitors && (
          <div>
            <SectionHeader icon={<Heart className="h-3.5 w-3.5" />} label="Condition Monitors" />
            <div className="grid grid-cols-3 gap-2">
              {physicalMonitorMax !== undefined && (
                <StatBlock
                  label="Physical CM"
                  value={physicalMonitorMax}
                  colorClass="text-red-500"
                />
              )}
              {stunMonitorMax !== undefined && (
                <StatBlock label="Stun CM" value={stunMonitorMax} colorClass="text-amber-400" />
              )}
              {overflow !== undefined && <StatBlock label="Overflow" value={overflow} />}
            </div>
          </div>
        )}

        {/* Pools */}
        {hasPools && (
          <div>
            <SectionHeader icon={<Brain className="h-3.5 w-3.5" />} label="Pools" />
            <div className="grid grid-cols-2 gap-2">
              {composure !== undefined && <StatBlock label="Composure" value={composure} />}
              {judgeIntentions !== undefined && (
                <StatBlock label="Judge Intentions" value={judgeIntentions} />
              )}
              {memory !== undefined && <StatBlock label="Memory" value={memory} />}
              {liftCarry !== undefined && (
                <StatBlock label="Lift/Carry" value={`${liftCarry} kg`} />
              )}
            </div>
          </div>
        )}

        {/* Movement */}
        {hasMovement && (
          <div>
            <SectionHeader icon={<Footprints className="h-3.5 w-3.5" />} label="Movement" />
            <div className="grid grid-cols-2 gap-2">
              {walkSpeed !== undefined && <StatBlock label="Walk" value={`${walkSpeed}m`} />}
              {runSpeed !== undefined && <StatBlock label="Run" value={`${runSpeed}m`} />}
            </div>
          </div>
        )}

        {/* Armor */}
        {hasArmor && (
          <div>
            <SectionHeader icon={<ShieldCheck className="h-3.5 w-3.5" />} label="Armor" />
            <div className="grid grid-cols-1 gap-2">
              <StatBlock label="Total" value={armorTotal} />
            </div>
          </div>
        )}
      </div>
    </DisplayCard>
  );
}
