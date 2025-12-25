"use client";

import { useState } from "react";
import {
  Zap,
  Shield,
  RefreshCw,
  Dice6,
  AlertTriangle,
  Crown,
  Star,
  Skull,
  CheckCircle,
} from "lucide-react";
import type { GruntTeam, IndividualGrunts, IndividualGrunt, ID } from "@/lib/types";
import { ConditionMonitor } from "./ConditionMonitor";

interface GruntTeamCombatTrackerTabProps {
  team: GruntTeam;
  individualGrunts?: IndividualGrunts;
  userRole: "gm" | "player";
  onApplyDamage?: (gruntId: ID, damage: number, damageType: "physical" | "stun") => Promise<void>;
  onSpendEdge?: (amount: number) => Promise<void>;
  onRollInitiative?: (type: "group" | "individual") => Promise<void>;
  onRefresh?: () => void;
}

function MoraleIndicator({
  moraleBroken,
  casualties,
  totalSize,
}: {
  moraleBroken: boolean;
  casualties: number;
  totalSize: number;
}) {
  const casualtyPercent = totalSize > 0 ? Math.round((casualties / totalSize) * 100) : 0;

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Morale Status
        </h3>
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            moraleBroken
              ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
              : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
          }`}
        >
          {moraleBroken ? "BROKEN" : "STEADY"}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Casualties</span>
          <span className="font-mono text-zinc-900 dark:text-zinc-100">
            {casualties}/{totalSize} ({casualtyPercent}%)
          </span>
        </div>
        <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              moraleBroken ? "bg-red-500" : casualtyPercent > 50 ? "bg-yellow-500" : "bg-green-500"
            }`}
            style={{ width: `${casualtyPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function GroupEdgePanel({
  groupEdge,
  groupEdgeMax,
  onSpendEdge,
  readonly,
}: {
  groupEdge: number;
  groupEdgeMax: number;
  onSpendEdge?: (amount: number) => Promise<void>;
  readonly: boolean;
}) {
  const [spending, setSpending] = useState(false);

  const handleSpend = async (amount: number) => {
    if (!onSpendEdge || spending) return;
    setSpending(true);
    try {
      await onSpendEdge(amount);
    } finally {
      setSpending(false);
    }
  };

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Group Edge
        </h3>
        <span className="font-mono text-lg font-bold text-zinc-900 dark:text-zinc-100">
          {groupEdge}/{groupEdgeMax}
        </span>
      </div>

      {/* Edge Pool Visual */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: groupEdgeMax }).map((_, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded-full border-2 transition-colors ${
              i < groupEdge
                ? "bg-yellow-400 border-yellow-500"
                : "bg-zinc-100 border-zinc-300 dark:bg-zinc-800 dark:border-zinc-600"
            }`}
          />
        ))}
      </div>

      {!readonly && onSpendEdge && groupEdge > 0 && (
        <div className="flex gap-2">
          <button
            onClick={() => handleSpend(1)}
            disabled={spending || groupEdge < 1}
            className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Spend 1
          </button>
          {groupEdge >= 2 && (
            <button
              onClick={() => handleSpend(2)}
              disabled={spending || groupEdge < 2}
              className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Spend 2
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function InitiativePanel({
  groupInitiative,
  onRollInitiative,
  readonly,
}: {
  groupInitiative?: number;
  onRollInitiative?: (type: "group" | "individual") => Promise<void>;
  readonly: boolean;
}) {
  const [rolling, setRolling] = useState(false);

  const handleRoll = async (type: "group" | "individual") => {
    if (!onRollInitiative || rolling) return;
    setRolling(true);
    try {
      await onRollInitiative(type);
    } finally {
      setRolling(false);
    }
  };

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Dice6 className="h-5 w-5" />
          Initiative
        </h3>
        {groupInitiative !== undefined && (
          <span className="font-mono text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {groupInitiative}
          </span>
        )}
      </div>

      {!readonly && onRollInitiative && (
        <div className="flex gap-2">
          <button
            onClick={() => handleRoll("group")}
            disabled={rolling}
            className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 disabled:opacity-50"
          >
            {rolling ? "Rolling..." : "Roll Group"}
          </button>
          <button
            onClick={() => handleRoll("individual")}
            disabled={rolling}
            className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 disabled:opacity-50"
          >
            Roll Individual
          </button>
        </div>
      )}
    </div>
  );
}

function IndividualGruntRow({
  gruntId,
  grunt,
  label,
  icon: Icon,
  iconColor,
  conditionMonitorSize,
  onApplyDamage,
  readonly,
}: {
  gruntId: string;
  grunt: IndividualGrunt;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  conditionMonitorSize: number;
  onApplyDamage?: (gruntId: ID, damage: number, damageType: "physical" | "stun") => Promise<void>;
  readonly: boolean;
}) {
  const [damageType, setDamageType] = useState<"physical" | "stun">("physical");
  const [applying, setApplying] = useState(false);

  const handleDamageChange = async (newDamage: number) => {
    if (!onApplyDamage || applying) return;
    setApplying(true);
    try {
      const damageDelta = newDamage - grunt.currentDamage;
      if (damageDelta > 0) {
        await onApplyDamage(gruntId, damageDelta, damageType);
      }
    } finally {
      setApplying(false);
    }
  };

  return (
    <div
      className={`p-3 rounded-lg border ${
        grunt.isDead
          ? "border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 opacity-60"
          : grunt.isStunned
          ? "border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20"
          : "border-zinc-200 dark:border-zinc-800"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {Icon && <Icon className={`h-4 w-4 ${iconColor || "text-zinc-400"}`} />}
          <span className="font-medium text-zinc-900 dark:text-zinc-100">{label}</span>
          {grunt.initiative !== undefined && (
            <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-mono">
              Init: {grunt.initiative}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {grunt.isDead ? (
            <Skull className="h-4 w-4 text-zinc-500" />
          ) : grunt.isStunned ? (
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
        </div>
      </div>

      <div className="flex items-start gap-4">
        <ConditionMonitor
          maxBoxes={conditionMonitorSize}
          currentDamage={grunt.currentDamage}
          damageType={damageType}
          isStunned={grunt.isStunned}
          isDead={grunt.isDead}
          onDamageChange={!readonly ? handleDamageChange : undefined}
          readonly={readonly || grunt.isDead}
          size="sm"
        />

        {!readonly && !grunt.isDead && (
          <div className="flex gap-1">
            <button
              onClick={() => setDamageType("physical")}
              className={`px-2 py-1 text-xs rounded ${
                damageType === "physical"
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              P
            </button>
            <button
              onClick={() => setDamageType("stun")}
              className={`px-2 py-1 text-xs rounded ${
                damageType === "stun"
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              S
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function GruntTeamCombatTrackerTab({
  team,
  individualGrunts,
  userRole,
  onApplyDamage,
  onSpendEdge,
  onRollInitiative,
  onRefresh,
}: GruntTeamCombatTrackerTabProps) {
  const isGM = userRole === "gm";
  const readonly = !isGM;

  const activeCount = team.state?.activeCount ?? team.initialSize;
  const casualties = team.state?.casualties ?? 0;
  const groupEdge = team.groupEdge ?? 0;
  const groupEdgeMax = team.groupEdgeMax ?? team.professionalRating;
  const moraleBroken = team.state?.moraleBroken ?? false;
  const groupInitiative = team.state?.groupInitiative;

  return (
    <div className="space-y-6">
      {/* Control Panel Header */}
      {isGM && onRefresh && (
        <div className="flex justify-end">
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      )}

      {/* Status Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MoraleIndicator
          moraleBroken={moraleBroken}
          casualties={casualties}
          totalSize={team.initialSize}
        />
        <GroupEdgePanel
          groupEdge={groupEdge}
          groupEdgeMax={groupEdgeMax}
          onSpendEdge={onSpendEdge}
          readonly={readonly}
        />
        <InitiativePanel
          groupInitiative={groupInitiative}
          onRollInitiative={onRollInitiative}
          readonly={readonly}
        />
      </div>

      {/* Individual Grunt Tracking */}
      {individualGrunts && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Individual Tracking
          </h3>

          {/* Lieutenant */}
          {individualGrunts.lieutenant && team.lieutenant && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-2">
                <Crown className="h-4 w-4 text-amber-500" />
                Lieutenant
              </h4>
              <IndividualGruntRow
                gruntId={individualGrunts.lieutenant.id}
                grunt={individualGrunts.lieutenant}
                label="Lieutenant"
                icon={Crown}
                iconColor="text-amber-500"
                conditionMonitorSize={team.lieutenant.conditionMonitorSize}
                onApplyDamage={onApplyDamage}
                readonly={readonly}
              />
            </div>
          )}

          {/* Specialists */}
          {individualGrunts.specialists &&
            Object.keys(individualGrunts.specialists).length > 0 &&
            team.specialists && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-indigo-500" />
                  Specialists
                </h4>
                <div className="space-y-2">
                  {Object.entries(individualGrunts.specialists).map(
                    ([specId, specGrunt]) => {
                      const specialist = team.specialists?.find(
                        (s) => s.id === specId
                      );
                      return (
                        <IndividualGruntRow
                          key={specId}
                          gruntId={specId}
                          grunt={specGrunt}
                          label={specialist?.type || "Specialist"}
                          icon={Star}
                          iconColor="text-indigo-500"
                          conditionMonitorSize={team.baseGrunts.conditionMonitorSize}
                          onApplyDamage={onApplyDamage}
                          readonly={readonly}
                        />
                      );
                    }
                  )}
                </div>
              </div>
            )}

          {/* Regular Grunts */}
          <div>
            <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Grunts ({activeCount}/{team.initialSize} active)
            </h4>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(individualGrunts.grunts).map(
                ([gruntId, grunt], index) => (
                  <IndividualGruntRow
                    key={gruntId}
                    gruntId={gruntId}
                    grunt={grunt}
                    label={`Grunt ${index + 1}`}
                    conditionMonitorSize={team.baseGrunts.conditionMonitorSize}
                    onApplyDamage={onApplyDamage}
                    readonly={readonly}
                  />
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* No Individual Tracking Message */}
      {!individualGrunts && isGM && (
        <div className="rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 p-8 text-center">
          <p className="text-zinc-500 dark:text-zinc-400">
            Individual grunt tracking is not initialized. Click "Refresh" to
            load combat tracking state.
          </p>
        </div>
      )}
    </div>
  );
}
