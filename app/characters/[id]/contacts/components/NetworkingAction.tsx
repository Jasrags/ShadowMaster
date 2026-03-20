"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Button, Label, Input, TextField } from "react-aria-components";
import type { ContactArchetype, SocialContact } from "@/lib/types";
import type { Theme } from "@/lib/themes";
import { THEMES, DEFAULT_THEME } from "@/lib/themes";
import { Search, DollarSign, Clock, CheckCircle, XCircle, Dice5, PenLine } from "lucide-react";
import { DiceRoller, type RollResult } from "@/components/DiceRoller";

interface NetworkingActionProps {
  characterId: string;
  archetypes: ContactArchetype[];
  characterNuyen: number;
  /** Character attributes keyed by code (e.g. "charisma") */
  characterAttributes?: Record<string, number>;
  /** Character skills keyed by name (e.g. "etiquette", "negotiation") */
  characterSkills?: Record<string, number>;
  onSuccess?: (suggestedContact: Partial<SocialContact>) => void;
  theme?: Theme;
}

interface NetworkingResult {
  success: boolean;
  contactFound: boolean;
  suggestedContact?: Partial<SocialContact>;
  timeSpent: string;
  nuyenSpent: number;
  bonusFromNuyen: number;
  dicePool: {
    base: number;
    modifiers: { source: string; modifier: number }[];
    total: number;
  };
  message: string;
}

type DiceMode = "roll" | "manual";

const DEFAULT_ARCHETYPES = [
  "Fixer",
  "Street Doc",
  "Talismonger",
  "Mr. Johnson",
  "Gang Leader",
  "Fence",
  "Armorer",
  "ID Manufacturer",
  "Bartender",
  "Corporate Contact",
  "Law Enforcement",
  "Media Contact",
  "Academic",
  "Decker",
  "Rigger",
];

export function NetworkingAction({
  characterId,
  archetypes,
  characterNuyen,
  characterAttributes,
  characterSkills,
  onSuccess,
  theme,
}: NetworkingActionProps) {
  const t = theme || THEMES[DEFAULT_THEME];

  const [targetArchetype, setTargetArchetype] = useState("");
  const [location, setLocation] = useState("");
  const [nuyenBudget, setNuyenBudget] = useState(0);
  const [diceRoll, setDiceRoll] = useState(0);
  const [diceMode, setDiceMode] = useState<DiceMode>("roll");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<NetworkingResult | null>(null);

  const archetypeList = archetypes.length > 0 ? archetypes.map((a) => a.name) : DEFAULT_ARCHETYPES;

  // Calculate dice pool from character stats
  const charisma = characterAttributes?.charisma ?? 0;
  const etiquette = characterSkills?.etiquette ?? characterSkills?.Etiquette ?? 0;
  const negotiation = characterSkills?.negotiation ?? characterSkills?.Negotiation ?? 0;
  const bestSkill = Math.max(etiquette, negotiation);
  const bestSkillName = etiquette >= negotiation ? "Etiquette" : "Negotiation";
  const baseDicePool = charisma + bestSkill;
  const hasStats = charisma > 0 && bestSkill > 0;

  // Pool label for DiceRoller context
  const contextLabel = useMemo(
    () => (hasStats ? `Charisma ${charisma} + ${bestSkillName} ${bestSkill}` : "Networking"),
    [hasStats, charisma, bestSkillName, bestSkill]
  );

  const handleDiceRoll = useCallback((rollResult: RollResult) => {
    setDiceRoll(rollResult.hits);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!targetArchetype) {
      setError("Please select a target archetype");
      return;
    }

    if (diceRoll < 0) {
      setError("Dice roll must be 0 or more");
      return;
    }

    if (nuyenBudget > characterNuyen) {
      setError(`Insufficient nuyen. You have ¥${characterNuyen.toLocaleString()}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/characters/${characterId}/social-actions/networking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetArchetype,
          location: location || undefined,
          nuyenBudget,
          diceRoll,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Networking failed");
      }

      setResult(data);

      if (data.contactFound && data.suggestedContact && onSuccess) {
        onSuccess(data.suggestedContact);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Networking action failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setDiceRoll(0);
  };

  return (
    <div className="space-y-4">
      {result ? (
        // Result View
        <div className="space-y-4">
          {/* Result Banner */}
          <div
            className={`p-4 rounded-lg border ${
              result.contactFound
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-amber-500/10 border-amber-500/30"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              {result.contactFound ? (
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              ) : (
                <XCircle className="w-6 h-6 text-amber-400" />
              )}
              <span
                className={`text-lg font-bold ${
                  result.contactFound ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {result.contactFound ? "Contact Found!" : "No Contact Found"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{result.message}</p>
          </div>

          {/* Suggested Contact */}
          {result.contactFound && result.suggestedContact && (
            <div className={`p-4 rounded border ${t.colors.border} ${t.colors.card}`}>
              <div className="text-xs font-mono text-muted-foreground uppercase mb-2">
                Suggested Contact
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`font-bold ${t.colors.heading}`}>
                    {result.suggestedContact.archetype}
                  </span>
                  {result.suggestedContact.location && (
                    <span className="text-sm text-muted-foreground">
                      {result.suggestedContact.location}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <div className="text-[10px] text-muted-foreground uppercase">Connection</div>
                    <div className={`text-xl font-bold ${t.colors.accent}`}>
                      {result.suggestedContact.connection}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <div className="text-[10px] text-muted-foreground uppercase">Loyalty</div>
                    <div className="text-xl font-bold text-pink-400">
                      {result.suggestedContact.loyalty}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  Give this contact a name and add them to your network!
                </p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className={`p-3 rounded ${t.colors.card} border ${t.colors.border}`}>
              <div className="text-[10px] text-muted-foreground uppercase">Time Spent</div>
              <div className="font-mono text-foreground">{result.timeSpent}</div>
            </div>
            <div className={`p-3 rounded ${t.colors.card} border ${t.colors.border}`}>
              <div className="text-[10px] text-muted-foreground uppercase">Nuyen Spent</div>
              <div className="font-mono text-foreground">¥{result.nuyenSpent.toLocaleString()}</div>
            </div>
            <div className={`p-3 rounded ${t.colors.card} border ${t.colors.border}`}>
              <div className="text-[10px] text-muted-foreground uppercase">Dice Pool</div>
              <div className="font-mono text-foreground">{result.dicePool.total}</div>
            </div>
          </div>

          {/* Try Again */}
          <Button
            onPress={handleReset}
            className={`w-full px-4 py-2 rounded ${t.colors.accentBg} text-white`}
          >
            Try Again
          </Button>
        </div>
      ) : (
        // Form View
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Target Archetype */}
          <div className="space-y-1">
            <Label className="text-xs font-mono text-muted-foreground uppercase">
              Target Archetype *
            </Label>
            <select
              value={targetArchetype}
              onChange={(e) => setTargetArchetype(e.target.value)}
              className={`w-full px-3 py-2 rounded border ${t.colors.border} bg-background text-foreground`}
            >
              <option value="">Who are you looking for?</option>
              {archetypeList.map((arch) => (
                <option key={arch} value={arch}>
                  {arch}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <TextField className="space-y-1">
            <Label className="text-xs font-mono text-muted-foreground uppercase">
              Location (optional)
            </Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`w-full px-3 py-2 rounded border ${t.colors.border} bg-background text-foreground`}
              placeholder="Where are you searching?"
            />
          </TextField>

          {/* Nuyen Budget */}
          <div className="space-y-1">
            <Label className="text-xs font-mono text-muted-foreground uppercase">
              Nuyen Budget
            </Label>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                min={0}
                max={characterNuyen}
                value={nuyenBudget}
                onChange={(e) => setNuyenBudget(Math.max(0, parseInt(e.target.value) || 0))}
                className={`flex-1 px-3 py-2 rounded border ${t.colors.border} bg-background text-foreground`}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Available: ¥{characterNuyen.toLocaleString()}</span>
              <span>+1 die per ¥500 spent</span>
            </div>
          </div>

          {/* Dice Roll Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-mono text-muted-foreground uppercase">
                Dice Roll *
              </Label>
              {/* Mode Toggle */}
              <div className="flex items-center gap-0.5 p-0.5 bg-muted/30 rounded">
                <button
                  type="button"
                  onClick={() => setDiceMode("roll")}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono transition-colors ${
                    diceMode === "roll"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Dice5 className="w-3 h-3" />
                  Roll
                </button>
                <button
                  type="button"
                  onClick={() => setDiceMode("manual")}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono transition-colors ${
                    diceMode === "manual"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <PenLine className="w-3 h-3" />
                  Manual
                </button>
              </div>
            </div>

            {diceMode === "roll" ? (
              <div className={`p-3 rounded border ${t.colors.border} bg-muted/20`}>
                <DiceRoller
                  initialPool={hasStats ? baseDicePool : 6}
                  compact
                  showHistory={false}
                  label="Dice Pool"
                  contextLabel={contextLabel}
                  onRoll={handleDiceRoll}
                />
                {diceRoll > 0 && (
                  <div className="mt-3 pt-3 border-t border-border text-xs font-mono text-muted-foreground">
                    Using <span className={t.colors.accent}>{diceRoll} hits</span> for networking
                    check
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                <Input
                  type="number"
                  min={0}
                  value={diceRoll}
                  onChange={(e) => setDiceRoll(Math.max(0, parseInt(e.target.value) || 0))}
                  className={`w-full px-3 py-2 rounded border ${t.colors.border} bg-background text-foreground`}
                  placeholder="Enter your hits (5s and 6s)"
                />
                <div className="text-[10px] text-muted-foreground">
                  Roll Charisma + Etiquette (or Negotiation) and enter the number of hits
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            isDisabled={isSubmitting || !targetArchetype}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded ${t.colors.accentBg} text-white disabled:opacity-50`}
          >
            <Search className="w-4 h-4" />
            {isSubmitting ? "Searching..." : "Search for Contact"}
          </Button>

          {/* Info */}
          <div className="flex items-start gap-2 p-3 bg-muted/50 rounded text-xs text-muted-foreground">
            <Clock className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p>Networking takes time and resources. Each attempt costs at least 8 hours.</p>
              <p className="mt-1">
                Spending nuyen on drinks, tips, and bribes adds dice to your pool.
              </p>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
