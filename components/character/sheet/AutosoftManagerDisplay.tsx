"use client";

import { useState, useMemo } from "react";
import type { Character, CharacterAutosoft } from "@/lib/types";
import { DisplayCard } from "./DisplayCard";
import { Cpu, ChevronDown, ChevronRight, Upload, X } from "lucide-react";
import {
  getOwnedAutosofts,
  getOwnedDrones,
  getActiveRCC,
  validateAutosoftOnRCC,
} from "@/lib/rules/rigging";
import { getEffectiveAutosofts } from "@/lib/rules/rigging/drone-network";
import { AUTOSOFT_CATEGORY_BADGE } from "./rigging-helpers";
import { useRiggingSession, useDroneNetwork } from "@/lib/rigging";

// ---------------------------------------------------------------------------
// AutosoftRow — static listing of an owned autosoft
// ---------------------------------------------------------------------------

interface AutosoftRowProps {
  autosoft: CharacterAutosoft;
  /** Whether a rigging session is active and editable */
  canShare: boolean;
  /** Whether this autosoft is already shared to the RCC network */
  isShared: boolean;
  /** Whether sharing is blocked (e.g. rating exceeds device rating) */
  shareBlocked: boolean;
  /** Reason share is blocked */
  shareBlockedReason?: string;
  onShare?: () => void;
  onUnshare?: () => void;
}

function AutosoftRow({
  autosoft,
  canShare,
  isShared,
  shareBlocked,
  shareBlockedReason,
  onShare,
  onUnshare,
}: AutosoftRowProps) {
  const catBadge = AUTOSOFT_CATEGORY_BADGE[autosoft.category] ?? AUTOSOFT_CATEGORY_BADGE.stealth;

  return (
    <div
      data-testid="autosoft-row"
      className="flex items-center gap-2 px-3 py-1.5 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
    >
      <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
        {autosoft.name}
      </span>
      <span
        data-testid="category-badge"
        className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-semibold ${catBadge.style}`}
      >
        {catBadge.label}
      </span>
      <span
        data-testid="rating-pill"
        className="shrink-0 rounded border border-indigo-500/20 bg-indigo-500/12 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-indigo-600 dark:text-indigo-300"
      >
        R{autosoft.rating}
      </span>
      {autosoft.target && (
        <span className="text-[10px] text-zinc-500 dark:text-zinc-400">({autosoft.target})</span>
      )}

      <span className="ml-auto" />

      {/* Share / Unshare controls */}
      {canShare && !isShared && (
        <button
          data-testid="share-button"
          onClick={onShare}
          disabled={shareBlocked}
          title={shareBlocked ? shareBlockedReason : "Share to RCC network"}
          className={`flex items-center gap-0.5 rounded border px-1.5 py-0.5 text-[10px] font-semibold ${
            shareBlocked
              ? "cursor-not-allowed border-zinc-300/40 bg-zinc-100/50 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-600"
              : "border-violet-400/30 bg-violet-400/10 text-violet-600 hover:bg-violet-400/20 dark:text-violet-400"
          }`}
        >
          <Upload className="h-3 w-3" />
          Load
        </button>
      )}
      {canShare && isShared && (
        <button
          data-testid="unshare-button"
          onClick={onUnshare}
          className="flex items-center gap-0.5 rounded border border-zinc-300/40 bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-600 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
        >
          <X className="h-3 w-3" />
          Unload
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// EffectiveAutosoftRow — shows resolved autosoft per drone
// ---------------------------------------------------------------------------

interface EffectiveAutosoftRowProps {
  name: string;
  category: string;
  rating: number;
  source: "installed" | "shared";
  target?: string;
}

function EffectiveAutosoftRow({
  name,
  category,
  rating,
  source,
  target,
}: EffectiveAutosoftRowProps) {
  const catBadge = AUTOSOFT_CATEGORY_BADGE[category] ?? AUTOSOFT_CATEGORY_BADGE.stealth;

  return (
    <div className="flex items-center gap-2 px-3 py-1 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50">
      <span className="truncate text-[12px] font-medium text-zinc-700 dark:text-zinc-300">
        {name}
      </span>
      <span
        className={`shrink-0 rounded border px-1 py-0.5 text-[9px] font-semibold ${catBadge.style}`}
      >
        {catBadge.label}
      </span>
      <span className="shrink-0 font-mono text-[10px] font-semibold text-indigo-600 dark:text-indigo-300">
        R{rating}
      </span>
      {target && <span className="text-[9px] text-zinc-500 dark:text-zinc-400">({target})</span>}
      <span className="ml-auto" />
      <span
        data-testid="source-badge"
        className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
          source === "shared"
            ? "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400"
            : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
        }`}
      >
        {source === "shared" ? "RCC" : "Installed"}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AutosoftManagerDisplay
// ---------------------------------------------------------------------------

interface AutosoftManagerDisplayProps {
  character: Character;
  onCharacterUpdate?: (updated: Character) => void;
  editable?: boolean;
}

export function AutosoftManagerDisplay({
  character,
  editable = false,
}: AutosoftManagerDisplayProps) {
  const [showAvailable, setShowAvailable] = useState(false);
  const [showEffective, setShowEffective] = useState(false);
  const autosofts = useMemo(() => getOwnedAutosofts(character), [character]);
  const drones = useMemo(() => getOwnedDrones(character), [character]);
  const rcc = useMemo(() => getActiveRCC(character), [character]);

  const { isSessionActive, shareAutosoft, unshareAutosoft } = useRiggingSession();
  const { network } = useDroneNetwork();

  const sharedAutosofts = network?.sharedAutosofts ?? [];
  const slavedDrones = network?.slavedDrones ?? [];

  const runningAutosofts = rcc?.runningAutosofts ?? [];

  // Drones with installed autosofts
  const dronesWithAutosofts = useMemo(
    () => drones.filter((d) => d.installedAutosofts && d.installedAutosofts.length > 0),
    [drones]
  );

  // Set of shared autosoft IDs for quick lookup
  const sharedAutosoftIds = useMemo(
    () => new Set(sharedAutosofts.map((a) => a.autosoftId)),
    [sharedAutosofts]
  );

  // Validation cache for autosoft sharing
  const autosoftValidation = useMemo(() => {
    if (!rcc) return new Map<string, { valid: boolean; reason?: string }>();
    const map = new Map<string, { valid: boolean; reason?: string }>();
    for (const soft of autosofts) {
      const result = validateAutosoftOnRCC(soft, rcc.deviceRating);
      map.set(soft.id ?? soft.catalogId, {
        valid: result.valid,
        reason: result.errors?.[0]?.message,
      });
    }
    return map;
  }, [autosofts, rcc]);

  const canShare = editable && isSessionActive && !!rcc;

  const hasContent =
    autosofts.length > 0 || runningAutosofts.length > 0 || dronesWithAutosofts.length > 0;

  if (!hasContent) return null;

  return (
    <DisplayCard
      id="sheet-autosofts"
      title="Autosofts"
      icon={<Cpu className="h-4 w-4 text-zinc-400" />}
      collapsible
      defaultCollapsed
    >
      <div className="space-y-3">
        {/* RCC Shared Autosofts (live session) */}
        {isSessionActive && sharedAutosofts.length > 0 && (
          <div data-testid="rcc-shared-section">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Shared on RCC ({sharedAutosofts.length})
            </div>
            <div className="overflow-hidden rounded-lg border border-violet-300/30 bg-violet-50/30 dark:border-violet-500/20 dark:bg-violet-950/20">
              {sharedAutosofts.map((soft) => (
                <div
                  key={soft.autosoftId}
                  data-testid="rcc-shared-row"
                  className="flex items-center gap-2 px-3 py-1.5 [&+&]:border-t [&+&]:border-violet-200/30 dark:[&+&]:border-violet-800/30"
                >
                  <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
                    {soft.name}
                  </span>
                  <span
                    className={`shrink-0 rounded border px-1 py-0.5 text-[9px] font-semibold ${
                      (AUTOSOFT_CATEGORY_BADGE[soft.category] ?? AUTOSOFT_CATEGORY_BADGE.stealth)
                        .style
                    }`}
                  >
                    {
                      (AUTOSOFT_CATEGORY_BADGE[soft.category] ?? AUTOSOFT_CATEGORY_BADGE.stealth)
                        .label
                    }
                  </span>
                  <span className="font-mono text-[10px] font-semibold text-indigo-600 dark:text-indigo-300">
                    R{soft.rating}
                  </span>
                  {soft.target && (
                    <span className="text-[9px] text-zinc-500 dark:text-zinc-400">
                      ({soft.target})
                    </span>
                  )}
                  <span className="ml-auto" />
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400">
                    Shared
                  </span>
                  {canShare && (
                    <button
                      data-testid="unshare-shared-button"
                      onClick={() => unshareAutosoft(soft.autosoftId)}
                      className="flex items-center gap-0.5 rounded border border-zinc-300/40 bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-600 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RCC Running Autosofts (static — from character data when session is NOT active) */}
        {!isSessionActive && runningAutosofts.length > 0 && (
          <div data-testid="rcc-running-section">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Running on RCC ({runningAutosofts.length})
            </div>
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
              {runningAutosofts.map((soft, idx) => (
                <div
                  key={`${soft}-${idx}`}
                  data-testid="rcc-autosoft-row"
                  className="flex items-center gap-2 px-3 py-1.5 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
                >
                  <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
                    {soft}
                  </span>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400">
                    Shared
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Per-Drone Effective Autosofts (live session with slaved drones) */}
        {isSessionActive && slavedDrones.length > 0 && (
          <div data-testid="effective-autosofts-section">
            <button
              data-testid="effective-toggle"
              onClick={() => setShowEffective(!showEffective)}
              className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              {showEffective ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
              Effective per Drone ({slavedDrones.length})
            </button>
            {showEffective &&
              slavedDrones.map((drone) => {
                const effective = getEffectiveAutosofts(drone, sharedAutosofts);
                if (effective.length === 0) return null;
                return (
                  <div key={drone.droneId} className="mb-2" data-testid="drone-effective-section">
                    <div className="mb-0.5 text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                      {drone.name}
                    </div>
                    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                      {effective.map((eff) => {
                        // Determine source: check if drone has a matching installed autosoft with equal or higher rating
                        const installedMatch = drone.installedAutosofts.find(
                          (a) => a.category === eff.category && a.rating >= eff.rating
                        );
                        const source = installedMatch
                          ? ("installed" as const)
                          : ("shared" as const);
                        return (
                          <EffectiveAutosoftRow
                            key={`${eff.category}-${eff.target ?? "any"}`}
                            name={eff.name}
                            category={eff.category}
                            rating={eff.rating}
                            source={source}
                            target={eff.target}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* Per-Drone Installed Autosofts (static) */}
        {dronesWithAutosofts.map((drone, droneIdx) => (
          <div key={`drone-${drone.name}-${droneIdx}`} data-testid="drone-autosofts-section">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              {drone.customName ?? drone.name}
            </div>
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
              {drone.installedAutosofts!.map((soft, idx) => (
                <div
                  key={`${soft}-${idx}`}
                  data-testid="drone-autosoft-row"
                  className="flex items-center gap-2 px-3 py-1.5 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
                >
                  <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
                    {soft}
                  </span>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    Installed
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Available (Owned) Autosofts with Load/Unload controls */}
        {autosofts.length > 0 && (
          <div data-testid="available-section">
            <button
              data-testid="available-toggle"
              onClick={() => setShowAvailable(!showAvailable)}
              className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              {showAvailable ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
              Owned ({autosofts.length})
            </button>
            {showAvailable && (
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                {autosofts.map((soft, idx) => {
                  const softId = soft.id ?? soft.catalogId;
                  const validation = autosoftValidation.get(softId);
                  const isShared = sharedAutosoftIds.has(softId);
                  return (
                    <AutosoftRow
                      key={`${soft.catalogId}-${idx}`}
                      autosoft={soft}
                      canShare={canShare}
                      isShared={isShared}
                      shareBlocked={!!(validation && !validation.valid)}
                      shareBlockedReason={validation?.reason}
                      onShare={() => shareAutosoft(soft)}
                      onUnshare={() => unshareAutosoft(softId)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </DisplayCard>
  );
}
