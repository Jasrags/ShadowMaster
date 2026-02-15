"use client";

import { useEffect, useState, use, useMemo, useCallback } from "react";
import { Link, Button, Modal, ModalOverlay, Dialog, Heading } from "react-aria-components";
import type { Character } from "@/lib/types";

import { DiceRoller } from "@/components";
import { useAuth } from "@/lib/auth/AuthProvider";
import AdminActionsPanel from "../components/AdminActionsPanel";
import { RulesetProvider, useRuleset, useMergedRuleset, useRulesetStatus } from "@/lib/rules";
import { calculateLimit, calculateWoundModifier } from "@/lib/rules/qualities";
import { ArrowLeft, Download, Pencil, Dice5, Printer, TrendingUp, Users, X } from "lucide-react";
import { downloadCharacterJson } from "@/lib/utils";
import { ActionPanel } from "./components/ActionPanel";
import { QuickCombatControls } from "./components/QuickCombatControls";
import { QuickNPCPanel } from "./components/QuickNPCPanel";
import { InventoryPanel } from "./components/InventoryPanel";
import { useCharacterSheetPreferences } from "./hooks/useCharacterSheetPreferences";
import { CombatSessionProvider } from "@/lib/combat";

import {
  ATTRIBUTE_DISPLAY,
  AdeptPowersDisplay,
  AttributesDisplay,
  CombatDisplay,
  ComplexFormsDisplay,
  ConditionDisplay,
  ContactsDisplay,
  DerivedStatsDisplay,
  DrugsDisplay,
  FociDisplay,
  GearDisplay,
  IdentitiesDisplay,
  CharacterInfoDisplay,
  KnowledgeLanguagesDisplay,
  LifestylesDisplay,
  QualitiesDisplay,
  SkillsDisplay,
  SpellsDisplay,
  VehiclesDisplay,
  WeaponsDisplay,
  ArmorDisplay,
  AugmentationsDisplay,
} from "@/components/character/sheet";

// =============================================================================
// MAIN CHARACTER SHEET PAGE
// =============================================================================

function CharacterSheet({
  character,
  setCharacter,
  showDiceRoller,
  setShowDiceRoller,
  targetPool,
  setTargetPool,
  poolContext,
  setPoolContext,
  isAdmin,
  onRefresh,
}: {
  character: Character;
  showDiceRoller: boolean;
  setShowDiceRoller: (show: boolean) => void;
  targetPool: number;
  setTargetPool: (pool: number) => void;
  poolContext: string | undefined;
  setPoolContext: (context: string | undefined) => void;
  setCharacter: (character: Character) => void;
  isAdmin: boolean;
  onRefresh: () => void;
}) {
  const { loadRuleset } = useRuleset();
  const { ready, loading: rulesetLoading } = useRulesetStatus();
  const ruleset = useMergedRuleset();

  const { updatePreference: updateSheetPref } = useCharacterSheetPreferences(character.id);

  // ActionPanel state
  const [actionPanelExpanded, setActionPanelExpanded] = useState(true);

  useEffect(() => {
    if (character.editionCode) {
      loadRuleset(character.editionCode);
    }
  }, [character.editionCode, loadRuleset]);

  const handleToggleDiceRoller = useCallback(() => {
    const newValue = !showDiceRoller;
    setShowDiceRoller(newValue);
    updateSheetPref("diceRollerVisible", newValue);
  }, [showDiceRoller, setShowDiceRoller, updateSheetPref]);

  // Derived values
  const physicalMonitorMax = Math.ceil((character.attributes?.body || 1) / 2) + 8;
  const stunMonitorMax = Math.ceil((character.attributes?.willpower || 1) / 2) + 8;

  const woundModifier = useMemo(() => {
    if (ruleset) {
      const physicalMod = calculateWoundModifier(character, ruleset, "physical");
      const stunMod = calculateWoundModifier(character, ruleset, "stun");
      return physicalMod + stunMod;
    }
    const physicalDamage = character.condition?.physicalDamage || 0;
    const stunDamage = character.condition?.stunDamage || 0;
    return -Math.floor(physicalDamage / 3) - Math.floor(stunDamage / 3);
  }, [character, ruleset]);

  const handleDamageApplied = useCallback(
    (type: "physical" | "stun" | "overflow", newValue: number) => {
      setCharacter({
        ...character,
        condition: {
          ...character.condition,
          [type === "physical"
            ? "physicalDamage"
            : type === "stun"
              ? "stunDamage"
              : "overflowDamage"]: newValue,
        },
      });
    },
    [character, setCharacter]
  );

  const physicalLimit = useMemo(() => {
    if (ruleset) return calculateLimit(character, ruleset, "physical");
    return Math.ceil(
      ((character.attributes?.strength || 1) * 2 +
        (character.attributes?.body || 1) +
        (character.attributes?.reaction || 1)) /
        3
    );
  }, [character, ruleset]);

  const mentalLimit = useMemo(() => {
    if (ruleset) return calculateLimit(character, ruleset, "mental");
    return Math.ceil(
      ((character.attributes?.logic || 1) * 2 +
        (character.attributes?.intuition || 1) +
        (character.attributes?.willpower || 1)) /
        3
    );
  }, [character, ruleset]);

  const socialLimit = useMemo(() => {
    if (ruleset) return calculateLimit(character, ruleset, "social");
    return Math.ceil(
      ((character.attributes?.charisma || 1) * 2 +
        (character.attributes?.willpower || 1) +
        Math.ceil(character.specialAttributes?.essence || 6)) /
        3
    );
  }, [character, ruleset]);

  const armorTotal = useMemo(() => {
    if (!character.armor || character.armor.length === 0) return 0;
    return character.armor
      .filter((a) => a.equipped)
      .reduce((sum, a) => sum + (a.armorRating || 0), 0);
  }, [character.armor]);

  if (!ready || rulesetLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-emerald-500/20 rounded-full" />
            <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-emerald-500 rounded-full animate-spin" />
          </div>
          <span className="text-sm font-mono text-muted-foreground animate-pulse uppercase">
            Synchronizing Ruleset Data...
          </span>
        </div>
      </div>
    );
  }

  const initiative = (character.attributes?.reaction || 1) + (character.attributes?.intuition || 1);

  const composure = (character.attributes?.charisma || 1) + (character.attributes?.willpower || 1);
  const judgeIntentions =
    (character.attributes?.charisma || 1) + (character.attributes?.intuition || 1);
  const memoryPool = (character.attributes?.logic || 1) + (character.attributes?.willpower || 1);
  const liftCarry = (character.attributes?.body || 1) + (character.attributes?.strength || 1);
  const walkSpeed = (character.attributes?.agility || 1) * 2;
  const runSpeed = (character.attributes?.agility || 1) * 4;
  const overflow = character.attributes?.body || 1;

  const handleExport = () => downloadCharacterJson(character);

  // Dice roller open helper
  const openDiceRoller = (pool: number, context?: string) => {
    setTargetPool(pool);
    setPoolContext(context);
    setShowDiceRoller(true);
  };

  return (
    <div className="character-sheet min-h-screen transition-colors duration-300 bg-background p-4 sm:p-6 lg:p-8">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Navigation Header */}
        <div className="flex items-center justify-between print-hidden">
          <Link
            href="/characters"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-400 transition-colors back-button"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Characters
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded border border-border transition-colors"
              title="Export Character JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>
            <div className="h-4 w-px bg-border mx-1" />
            <span className="text-xs font-mono text-muted-foreground uppercase">
              {character.editionCode}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-end gap-2 mb-4 print-hidden">
          <Button
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            onPress={() => window.print()}
            aria-label="Print character sheet"
          >
            <Printer className="w-5 h-5" />
          </Button>
          <Button
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            onPress={handleToggleDiceRoller}
          >
            <Dice5 className={`w-6 h-6 ${showDiceRoller ? "text-emerald-400" : ""}`} />
          </Button>
          {character.status === "active" && (
            <>
              <Link
                href={`/characters/${character.id}/contacts`}
                className="p-2 text-muted-foreground hover:text-emerald-400 transition-colors"
                aria-label="Contact Network"
              >
                <Users className="w-5 h-5" />
              </Link>
              <Link
                href={`/characters/${character.id}/advancement`}
                className="p-2 text-muted-foreground hover:text-emerald-400 transition-colors"
                aria-label="Character Advancement"
              >
                <TrendingUp className="w-5 h-5" />
              </Link>
            </>
          )}
          {character.status === "draft" && (
            <Link
              href={`/characters/${character.id}/edit`}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Pencil className="w-5 h-5" />
            </Link>
          )}
        </div>

        {/* Admin Actions Panel */}
        {isAdmin && (
          <AdminActionsPanel character={character} isAdmin={isAdmin} onStatusChange={onRefresh} />
        )}

        {/* Character Header Card */}
        <CharacterInfoDisplay character={character} />

        {/* Dice Roller Modal */}
        <ModalOverlay
          isOpen={showDiceRoller}
          onOpenChange={setShowDiceRoller}
          isDismissable
          className={({ isEntering, isExiting }) => `
            fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm
            ${isEntering ? "animate-in fade-in duration-300" : ""}
            ${isExiting ? "animate-out fade-out duration-200" : ""}
          `}
        >
          <Modal
            className={({ isEntering, isExiting }) => `
              w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card/80 backdrop-blur-sm shadow-2xl
              ${isEntering ? "animate-in zoom-in-95 duration-300" : ""}
              ${isExiting ? "animate-out zoom-out-95 duration-200" : ""}
            `}
          >
            <Dialog className="outline-none">
              {({ close }) => (
                <div className="flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <Heading slot="title" className="text-lg font-bold text-foreground">
                      Dice Roller
                    </Heading>
                    <Button
                      onPress={close}
                      className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    <DiceRoller
                      initialPool={targetPool}
                      contextLabel={poolContext || "Quick Roll"}
                      compact={false}
                      showHistory={true}
                      characterId={character.id}
                      persistRolls={true}
                    />
                  </div>
                </div>
              )}
            </Dialog>
          </Modal>
        </ModalOverlay>

        {/* Main Content Grid */}
        <div className="character-sheet-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Left Column - Attributes & Condition */}
          <div className="space-y-6">
            <AttributesDisplay
              character={character}
              onSelect={(attrId, val) => openDiceRoller(val, ATTRIBUTE_DISPLAY[attrId]?.abbr)}
            />

            <DerivedStatsDisplay
              physicalLimit={physicalLimit}
              mentalLimit={mentalLimit}
              socialLimit={socialLimit}
              initiative={initiative}
              physicalMonitorMax={physicalMonitorMax}
              stunMonitorMax={stunMonitorMax}
              overflow={overflow}
              composure={composure}
              judgeIntentions={judgeIntentions}
              memory={memoryPool}
              liftCarry={liftCarry}
              walkSpeed={walkSpeed}
              runSpeed={runSpeed}
              armorTotal={armorTotal}
            />

            <ConditionDisplay
              character={character}
              woundModifier={woundModifier}
              physicalMonitorMax={physicalMonitorMax}
              stunMonitorMax={stunMonitorMax}
              readonly={character.status !== "draft" && character.status !== "active"}
              onDamageApplied={handleDamageApplied}
            />

            <CombatDisplay
              character={character}
              woundModifier={woundModifier}
              physicalLimit={physicalLimit}
              onPoolSelect={(pool, context) => openDiceRoller(pool, context)}
            />

            {/* Action Panel */}
            <ActionPanel
              character={character}
              woundModifier={woundModifier}
              physicalLimit={physicalLimit}
              mentalLimit={mentalLimit}
              socialLimit={socialLimit}
              isExpanded={actionPanelExpanded}
              onToggleExpand={() => setActionPanelExpanded(!actionPanelExpanded)}
              onOpenDiceRoller={(pool, context) => openDiceRoller(pool, context)}
            />

            {/* Quick Combat Controls */}
            <QuickCombatControls character={character} editionCode={character.editionCode} />

            <QuickNPCPanel />
          </div>

          {/* Middle Column - Skills & Powers */}
          <div className="space-y-6">
            <SkillsDisplay
              character={character}
              onSelect={(skillId, pool, attrAbbr) => {
                const skillName = skillId.replace(/-/g, " ");
                const context = attrAbbr ? `${attrAbbr} + ${skillName}` : skillName;
                openDiceRoller(pool, context);
              }}
            />

            {character.spells && character.spells.length > 0 && (
              <SpellsDisplay
                spells={character.spells}
                onSelect={(pool, label) => openDiceRoller(pool, label)}
              />
            )}

            {character.adeptPowers && character.adeptPowers.length > 0 && (
              <AdeptPowersDisplay adeptPowers={character.adeptPowers} />
            )}

            {/* Complex Forms */}
            {character.complexForms && character.complexForms.length > 0 && (
              <ComplexFormsDisplay
                complexForms={character.complexForms}
                onSelect={(pool, label) => openDiceRoller(pool, label)}
              />
            )}

            {/* Foci */}
            {character.foci && character.foci.length > 0 && <FociDisplay foci={character.foci} />}

            <KnowledgeLanguagesDisplay
              character={character}
              onSelect={(pool, label) => openDiceRoller(pool, label)}
            />

            <QualitiesDisplay character={character} onUpdate={(updated) => setCharacter(updated)} />
          </div>

          {/* Right Column - Gear & Assets */}
          <div className="space-y-6">
            {/* Combat Gear: Weapons + Armor */}
            <WeaponsDisplay
              character={character}
              onSelect={(pool, label) => openDiceRoller(pool, label)}
            />

            {character.armor && character.armor.length > 0 && (
              <ArmorDisplay armor={character.armor} />
            )}

            <AugmentationsDisplay character={character} />

            <VehiclesDisplay
              vehicles={character.vehicles}
              drones={character.drones}
              rccs={character.rccs}
            />

            {/* Inventory Management Panel */}
            <InventoryPanel
              character={character}
              onUpdate={(updated) => setCharacter(updated)}
              showActions={character.status === "active"}
            />

            <GearDisplay gear={(character.gear || []).filter((item) => item.category !== "drug")} />

            <DrugsDisplay
              drugs={(character.gear || []).filter((item) => item.category === "drug")}
            />

            <ContactsDisplay character={character} />

            <IdentitiesDisplay character={character} />

            <LifestylesDisplay
              lifestyles={character.lifestyles || []}
              primaryLifestyleId={character.primaryLifestyleId}
            />
          </div>
        </div>

        {/* Footer with metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-4">
          <span className="font-mono">ID: {character.id}</span>
          <span className="font-mono">
            Created: {new Date(character.createdAt).toLocaleDateString()}
            {character.updatedAt &&
              ` • Updated: ${new Date(character.updatedAt).toLocaleDateString()}`}
          </span>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

interface CharacterPageProps {
  params: Promise<{ id: string }>;
}

export default function CharacterPage({ params }: CharacterPageProps) {
  const resolvedParams = use(params);
  const { user } = useAuth();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDiceRoller, setShowDiceRoller] = useState(false);
  const [targetPool, setTargetPool] = useState(6);
  const [poolContext, setPoolContext] = useState<string | undefined>(undefined);

  const isAdmin = user?.role?.includes("administrator") ?? false;

  const fetchCharacter = useCallback(async () => {
    try {
      const response = await fetch(`/api/characters/${resolvedParams.id}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to load character");
      }

      setCharacter(data.character);
      return data.character;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id]);

  const handleStatusChange = useCallback(async () => {
    const updatedCharacter = await fetchCharacter();
    if (updatedCharacter?.status === "draft") {
      window.location.href = `/characters/${resolvedParams.id}/edit`;
    }
  }, [fetchCharacter, resolvedParams.id]);

  useEffect(() => {
    fetchCharacter();
  }, [fetchCharacter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-emerald-500/20 rounded-full" />
            <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-emerald-500 rounded-full animate-spin" />
          </div>
          <span className="text-sm font-mono text-muted-foreground animate-pulse uppercase">
            Loading Runner Data...
          </span>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="text-red-400 font-mono">{error || "Character not found"}</p>
        <Link
          href="/characters"
          className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors"
        >
          ← Return to characters
        </Link>
      </div>
    );
  }

  return (
    <RulesetProvider>
      <CombatSessionProvider characterId={character.id} pollInterval={5000}>
        <CharacterSheet
          character={character}
          setCharacter={setCharacter}
          showDiceRoller={showDiceRoller}
          setShowDiceRoller={setShowDiceRoller}
          targetPool={targetPool}
          setTargetPool={setTargetPool}
          poolContext={poolContext}
          setPoolContext={setPoolContext}
          isAdmin={isAdmin}
          onRefresh={handleStatusChange}
        />
      </CombatSessionProvider>
    </RulesetProvider>
  );
}
