"use client";

/**
 * Quick NPC Panel Component
 *
 * Provides a UI for quickly adding NPC/grunt opponents to a combat session
 * for solo testing purposes. Supports templates for common enemy types.
 *
 * Phase 5.3.5: Quick NPC Management
 */

import React, { useState, useMemo, useCallback } from "react";
import { Button } from "react-aria-components";
import { Plus, Bot, Skull, Trash2, Shield, Swords, Heart, Loader2 } from "lucide-react";
import { DisplayCard } from "@/components/character/sheet/DisplayCard";
import { useCombatSession } from "@/lib/combat";
import type { CombatParticipant } from "@/lib/types";

/**
 * Quick NPC template for fast opponent creation
 */
interface NPCTemplate {
  id: string;
  name: string;
  type: "npc" | "grunt";
  description: string;
  /** Base initiative dice pool (REA + INT equivalent) */
  initiativePool: number;
  /** Number of initiative dice */
  initiativeDice: number;
  /** Professional Rating (affects dice pools) */
  professionalRating: number;
  /** Base condition monitor boxes */
  conditionMonitor: number;
  /** Default armor rating */
  armorRating: number;
  /** Primary attack pool */
  attackPool: number;
  /** Primary defense pool */
  defensePool: number;
}

/**
 * Default NPC templates for quick enemy creation
 */
const NPC_TEMPLATES: NPCTemplate[] = [
  {
    id: "ganger",
    name: "Ganger",
    type: "grunt",
    description: "Basic street gang member with pistol",
    initiativePool: 7,
    initiativeDice: 1,
    professionalRating: 1,
    conditionMonitor: 9,
    armorRating: 4,
    attackPool: 8,
    defensePool: 6,
  },
  {
    id: "security-guard",
    name: "Security Guard",
    type: "grunt",
    description: "Corporate security with SMG",
    initiativePool: 8,
    initiativeDice: 1,
    professionalRating: 2,
    conditionMonitor: 10,
    armorRating: 9,
    attackPool: 10,
    defensePool: 8,
  },
  {
    id: "corpsec-trooper",
    name: "CorpSec Trooper",
    type: "npc",
    description: "Professional corporate security",
    initiativePool: 10,
    initiativeDice: 1,
    professionalRating: 3,
    conditionMonitor: 11,
    armorRating: 12,
    attackPool: 12,
    defensePool: 10,
  },
  {
    id: "htrt-member",
    name: "HTR Member",
    type: "npc",
    description: "High Threat Response Team",
    initiativePool: 12,
    initiativeDice: 2,
    professionalRating: 4,
    conditionMonitor: 12,
    armorRating: 15,
    attackPool: 15,
    defensePool: 12,
  },
  {
    id: "street-samurai",
    name: "Street Samurai",
    type: "npc",
    description: "Experienced cybered fighter",
    initiativePool: 14,
    initiativeDice: 3,
    professionalRating: 4,
    conditionMonitor: 12,
    armorRating: 14,
    attackPool: 16,
    defensePool: 14,
  },
];

/**
 * Roll initiative for an NPC
 */
function rollNPCInitiative(template: NPCTemplate): { score: number; dice: number[] } {
  const dice: number[] = [];
  for (let i = 0; i < template.initiativeDice; i++) {
    dice.push(Math.floor(Math.random() * 6) + 1);
  }
  const diceTotal = dice.reduce((sum, d) => sum + d, 0);
  return {
    score: template.initiativePool + diceTotal,
    dice,
  };
}

interface QuickNPCPanelProps {
  /** Current session ID */
  sessionId?: string;
  /** Callback when NPC is added */
  onNPCAdded?: (participant: CombatParticipant) => void;
  /** Callback when NPC is removed */
  onNPCRemoved?: (participantId: string) => void;
}

export function QuickNPCPanel({ sessionId, onNPCAdded, onNPCRemoved }: QuickNPCPanelProps) {
  const { session, isInCombat } = useCombatSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get NPCs in current session
  const sessionNPCs = useMemo(() => {
    if (!session) return [];
    return session.participants.filter((p) => p.type === "npc" || p.type === "grunt");
  }, [session]);

  // Add NPC to session
  const addNPC = useCallback(
    async (template: NPCTemplate) => {
      if (!session) {
        setError("Not in combat session");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Roll initiative
        const initiative = rollNPCInitiative(template);

        // Generate unique name
        const existingCount = sessionNPCs.filter((n) => n.name.startsWith(template.name)).length;
        const name = existingCount > 0 ? `${template.name} ${existingCount + 1}` : template.name;

        // Add to session via API
        const response = await fetch(`/api/combat/${session.id}/participants`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: template.type,
            entityId: `quick-npc-${template.id}-${Date.now()}`,
            name,
            initiativeScore: initiative.score,
            initiativeDice: initiative.dice,
            isGMControlled: true,
            woundModifier: 0,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to add NPC");
        }

        // Notify parent
        if (onNPCAdded && data.participant) {
          onNPCAdded(data.participant);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to add NPC";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [session, sessionNPCs, onNPCAdded]
  );

  // Remove NPC from session
  const removeNPC = useCallback(
    async (participantId: string) => {
      if (!session) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/combat/${session.id}/participants/${participantId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to remove NPC");
        }

        // Notify parent
        if (onNPCRemoved) {
          onNPCRemoved(participantId);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to remove NPC";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [session, onNPCRemoved]
  );

  // Not in combat - show info
  if (!isInCombat) {
    return (
      <DisplayCard
        id="sheet-quick-npcs"
        title="Quick NPCs"
        icon={<Bot className="w-5 h-5 text-zinc-400" />}
      >
        <p className="text-sm text-zinc-500 italic">
          Start a combat session to add opponents for testing.
        </p>
      </DisplayCard>
    );
  }

  return (
    <DisplayCard
      id="sheet-quick-npcs"
      title="Quick NPCs"
      icon={<Bot className="w-5 h-5 text-amber-500" />}
      collapsible
      headerAction={
        sessionNPCs.length > 0 ? (
          <span className="text-xs px-1.5 py-0.5 rounded font-mono bg-muted text-muted-foreground">
            {sessionNPCs.length}
          </span>
        ) : undefined
      }
    >
      <div className="space-y-4">
        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-2 rounded text-xs border text-red-500 border-red-500/30 bg-red-500/10">
            {error}
          </div>
        )}

        {/* Current NPCs in Session */}
        {sessionNPCs.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs uppercase font-mono text-muted-foreground">In Combat</div>
            <div className="space-y-1">
              {sessionNPCs.map((npc) => (
                <div
                  key={npc.id}
                  className="flex items-center justify-between gap-2 p-2 rounded bg-zinc-800/50 border border-zinc-700/50"
                >
                  <div className="flex items-center gap-2">
                    {npc.type === "grunt" ? (
                      <Skull className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Bot className="w-4 h-4 text-blue-500" />
                    )}
                    <span className="text-sm text-foreground">{npc.name}</span>
                    {npc.status === "out" ? (
                      <span className="text-xs text-red-500">out</span>
                    ) : (
                      <span className="text-xs font-mono text-muted-foreground">
                        Init: {npc.initiativeScore}
                      </span>
                    )}
                  </div>
                  <Button
                    onPress={() => removeNPC(npc.id)}
                    isDisabled={isLoading}
                    className="p-1 rounded hover:bg-red-500/20 text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add NPC Templates */}
        <div className="space-y-2">
          <div className="text-xs uppercase font-mono text-muted-foreground">Add Opponent</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {NPC_TEMPLATES.map((template) => (
              <Button
                key={template.id}
                onPress={() => addNPC(template)}
                isDisabled={isLoading}
                className="flex flex-col items-start gap-1 p-3 rounded border text-left bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700/50 disabled:opacity-50 transition-colors"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    {template.type === "grunt" ? (
                      <Skull className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Bot className="w-4 h-4 text-blue-500" />
                    )}
                    <span className="font-medium text-foreground">{template.name}</span>
                  </div>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  ) : (
                    <Plus className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground">{template.description}</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-muted">
                    <Swords className="w-3 h-3 inline mr-0.5" />
                    {template.attackPool}
                  </span>
                  <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-muted">
                    <Shield className="w-3 h-3 inline mr-0.5" />
                    {template.defensePool}
                  </span>
                  <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-muted">
                    <Heart className="w-3 h-3 inline mr-0.5" />
                    {template.conditionMonitor}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground">Quick:</span>
          <Button
            onPress={() => addNPC(NPC_TEMPLATES[0])}
            isDisabled={isLoading}
            className={`
              flex items-center gap-1 px-2 py-1 rounded text-xs
              bg-amber-500/20 text-amber-500 border border-amber-500/30
              hover:bg-amber-500/30
              disabled:opacity-50
              transition-colors
            `}
          >
            <Plus className="w-3 h-3" />
            Ganger
          </Button>
          <Button
            onPress={() => addNPC(NPC_TEMPLATES[1])}
            isDisabled={isLoading}
            className={`
              flex items-center gap-1 px-2 py-1 rounded text-xs
              bg-blue-500/20 text-blue-500 border border-blue-500/30
              hover:bg-blue-500/30
              disabled:opacity-50
              transition-colors
            `}
          >
            <Plus className="w-3 h-3" />
            Guard
          </Button>
        </div>
      </div>
    </DisplayCard>
  );
}
