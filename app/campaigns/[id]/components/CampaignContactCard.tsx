"use client";

import { useState } from "react";
import { Button } from "react-aria-components";
import { Info, Eye, EyeOff, ChevronDown, ChevronUp, X } from "lucide-react";
import type { SocialContact } from "@/lib/types";
import type { BetrayalTypeData, JohnsonFactionData } from "@/lib/rules/module-payloads";
import { BetrayalAssessmentPanel } from "./BetrayalAssessmentPanel";

const RISK_COLORS: Record<string, string> = {
  "very-low": "text-green-400 bg-green-500/10",
  low: "text-green-300 bg-green-500/10",
  moderate: "text-amber-400 bg-amber-500/10",
  high: "text-orange-400 bg-orange-500/10",
  "very-high": "text-red-400 bg-red-500/10",
  uncertain: "text-zinc-400 bg-zinc-500/10",
};

export interface CampaignContactCardProps {
  contact: SocialContact;
  faction: JohnsonFactionData | null;
  ownerLabel: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleVisibility: () => void;
  betrayalTypes: BetrayalTypeData[];
  factions: JohnsonFactionData[];
  campaignId: string;
  onContactUpdated: (c: SocialContact) => void;
  isLoyaltyExpanded: boolean;
  onToggleLoyalty: () => void;
  characterNames: Record<string, string>;
  onSetLoyaltyOverride: (characterId: string, value: number) => void;
  onRemoveLoyaltyOverride: (characterId: string) => void;
}

export function CampaignContactCard({
  contact,
  faction,
  ownerLabel,
  isExpanded,
  onToggleExpand,
  onToggleVisibility,
  betrayalTypes,
  factions,
  campaignId,
  onContactUpdated,
  isLoyaltyExpanded,
  onToggleLoyalty,
  characterNames,
  onSetLoyaltyOverride,
  onRemoveLoyaltyOverride,
}: CampaignContactCardProps) {
  const isCampaignContact = !contact.characterId;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      {/* Contact Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <Button
          onPress={onToggleExpand}
          aria-expanded={isExpanded}
          aria-label={`${isExpanded ? "Collapse" : "Expand"} details for ${contact.name}`}
          className="flex flex-1 items-center gap-3 text-left outline-none"
        >
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {contact.name}
              </span>
              {/* Owner Badge */}
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                  isCampaignContact
                    ? "bg-indigo-500/10 text-indigo-400"
                    : "bg-cyan-500/10 text-cyan-400"
                }`}
              >
                {ownerLabel}
              </span>
              {/* Betrayal Planned */}
              {contact.betrayalPlanning && (
                <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-red-400">
                  Betrayal Planned
                </span>
              )}
              {/* Status */}
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-mono ${
                  contact.status === "active"
                    ? "bg-green-500/10 text-green-400"
                    : "bg-zinc-500/10 text-zinc-400"
                }`}
              >
                {contact.status}
              </span>
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
              <span>{contact.archetype}</span>
              {faction && (
                <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-amber-400">
                  {faction.name}
                </span>
              )}
              <span>
                C:{contact.connection} / L:{contact.loyalty}
              </span>
            </div>
          </div>
        </Button>

        <div className="flex items-center gap-2">
          {/* Visibility Toggle (campaign contacts only) */}
          {isCampaignContact && (
            <Button
              onPress={onToggleVisibility}
              aria-label={
                contact.visibility.playerVisible ? "Hide from players" : "Show to players"
              }
              className={`rounded p-1 outline-none ${
                contact.visibility.playerVisible
                  ? "text-green-400 hover:bg-green-500/10"
                  : "text-zinc-400 hover:bg-zinc-500/10"
              }`}
            >
              {contact.visibility.playerVisible ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
          )}
          {/* Visibility badge for character contacts */}
          {!isCampaignContact && (
            <span className="text-[10px] text-zinc-400">
              {contact.visibility.playerVisible ? "visible" : "private"}
            </span>
          )}
          {/* Risk Badge */}
          {faction?.betrayalRisk && (
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                RISK_COLORS[faction.betrayalRisk] ?? "text-zinc-400 bg-zinc-500/10"
              }`}
            >
              Risk: {faction.betrayalRisk}
            </span>
          )}
        </div>
      </div>

      {/* Per-Character Loyalty Section (campaign contacts only) */}
      {isCampaignContact && isExpanded && (
        <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-700">
          <Button
            onPress={onToggleLoyalty}
            className="flex items-center gap-1 text-xs font-medium text-zinc-500 outline-none hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            {isLoyaltyExpanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
            Per-Character Loyalty
          </Button>

          {isLoyaltyExpanded && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <span>Campaign default: L:{contact.loyalty}</span>
              </div>
              {Object.entries(characterNames).map(([charId, charName]) => (
                <LoyaltyOverrideRow
                  key={charId}
                  characterId={charId}
                  characterName={charName}
                  override={contact.loyaltyOverrides?.[charId]}
                  defaultLoyalty={contact.loyalty}
                  onSetOverride={onSetLoyaltyOverride}
                  onRemoveOverride={onRemoveLoyaltyOverride}
                />
              ))}
              {Object.keys(characterNames).length === 0 && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  No campaign characters found.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Betrayal Assessment Panel (Johnson contacts) */}
      {isExpanded && contact.factionId && betrayalTypes.length > 0 && (
        <div className="border-t border-zinc-200 px-4 py-4 dark:border-zinc-700">
          <BetrayalAssessmentPanel
            contact={contact}
            campaignId={campaignId}
            betrayalTypes={betrayalTypes}
            factions={factions}
            onContactUpdated={onContactUpdated}
          />
        </div>
      )}

      {isExpanded && contact.factionId && betrayalTypes.length === 0 && (
        <div className="border-t border-zinc-200 px-4 py-4 dark:border-zinc-700">
          <div className="rounded border border-dashed border-zinc-600 p-4 text-center text-xs text-zinc-500">
            <Info className="mx-auto mb-1 h-5 w-5" />
            Betrayal type data not available. Enable the Run Faster sourcebook in campaign settings.
          </div>
        </div>
      )}

      {/* Description (non-Johnson contacts expanded) */}
      {isExpanded && !contact.factionId && contact.description && (
        <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-700">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">{contact.description}</p>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Loyalty Override Row — uses onBlur to avoid API calls on every keystroke
// =============================================================================

interface LoyaltyOverrideRowProps {
  characterId: string;
  characterName: string;
  override: number | undefined;
  defaultLoyalty: number;
  onSetOverride: (characterId: string, value: number) => void;
  onRemoveOverride: (characterId: string) => void;
}

function LoyaltyOverrideRow({
  characterId,
  characterName,
  override,
  defaultLoyalty,
  onSetOverride,
  onRemoveOverride,
}: LoyaltyOverrideRowProps) {
  const [localValue, setLocalValue] = useState<number>(override ?? defaultLoyalty);

  const handleBlur = () => {
    const clamped = Math.max(1, Math.min(6, localValue));
    if (clamped !== (override ?? defaultLoyalty)) {
      onSetOverride(characterId, clamped);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="min-w-[100px] text-xs text-zinc-600 dark:text-zinc-300">
        {characterName}
      </span>
      <input
        type="number"
        min={1}
        max={6}
        value={localValue}
        onChange={(e) => setLocalValue(Math.max(1, Math.min(6, Number(e.target.value))))}
        onBlur={handleBlur}
        className="w-16 rounded border border-zinc-300 bg-white px-2 py-0.5 text-xs text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
      />
      {override !== undefined && (
        <Button
          onPress={() => onRemoveOverride(characterId)}
          aria-label={`Reset loyalty for ${characterName} to campaign default`}
          className="text-xs text-zinc-400 outline-none hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
      {override !== undefined && <span className="text-[10px] text-amber-400">override</span>}
    </div>
  );
}
