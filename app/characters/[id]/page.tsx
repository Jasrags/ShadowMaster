"use client";

import { useEffect, useState, use, useMemo, useCallback } from "react";
import { Link, Button, Modal, ModalOverlay, Dialog, Heading } from "react-aria-components";
import type { Character } from "@/lib/types";

import { DiceRoller } from "@/components";
import { useAuth } from "@/lib/auth/AuthProvider";
import AdminActionsPanel from "../components/AdminActionsPanel";
import { RulesetProvider, useRuleset, useMergedRuleset, useRulesetStatus } from "@/lib/rules";
import { calculateLimit, calculateWoundModifier } from "@/lib/rules/qualities";
import {
  ArrowLeft,
  Download,
  Pencil,
  Dice5,
  Printer,
  TrendingUp,
  Users,
  X,
  Swords,
} from "lucide-react";
import { downloadCharacterJson } from "@/lib/utils";
import { ActionPanel } from "./components/ActionPanel";
import { QuickCombatControls } from "./components/QuickCombatControls";
import { QuickNPCPanel } from "./components/QuickNPCPanel";
import { useCharacterSheetPreferences } from "./hooks/useCharacterSheetPreferences";
import { useCharacterEffects } from "./hooks/useCharacterEffects";
import { CombatSessionProvider, useCombatSession } from "@/lib/combat";
import { MatrixSessionProvider, useMatrixSession } from "@/lib/matrix";
import { RiggingSessionProvider, useRiggingSession } from "@/lib/rigging";
import { CombatTrackerModal } from "./components/CombatTrackerModal";
import { THEMES, DEFAULT_THEME } from "@/lib/themes";

import {
  ActiveModifiersPanel,
  ATTRIBUTE_DISPLAY,
  AdeptPowersDisplay,
  AttributesDisplay,
  CombatDisplay,
  ComplexFormsDisplay,
  EffectsSummaryDisplay,
  ConditionDisplay,
  ContactsDisplay,
  CyberdeckConfigDisplay,
  DerivedStatsDisplay,
  DrugsDisplay,
  EncumbranceDisplay,
  FociDisplay,
  GearDisplay,
  MagicSummaryDisplay,
  IdentitiesDisplay,
  LifestylesDisplay,
  CharacterInfoDisplay,
  KnowledgeLanguagesDisplay,
  MatrixActionsDisplay,
  MatrixDevicesDisplay,
  MatrixMarksDisplay,
  MatrixSummaryDisplay,
  ProgramManagerDisplay,
  QualitiesDisplay,
  ReputationDisplay,
  SkillsDisplay,
  SpellsDisplay,
  VehiclesDisplay,
  WeaponsDisplay,
  WirelessDisplay,
  ArmorDisplay,
  AugmentationsDisplay,
  LoadoutSummaryDisplay,
  LoadoutDisplay,
  RiggingSummaryDisplay,
  DroneNetworkDisplay,
  JumpInControlDisplay,
  VehicleActionsDisplay,
  AutosoftManagerDisplay,
} from "@/components/character/sheet";
import type { EffectResolutionContext, EffectResolutionResult } from "@/lib/types/effects";
import { hasMatrixAccess, hasHackingCapability } from "@/lib/rules/matrix/cyberdeck-validator";
import { hasRiggingAccess } from "@/components/character/sheet/rigging-helpers";

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
  const matrixSession = useMatrixSession();
  const { isInCombat } = useCombatSession();
  const theme = THEMES[DEFAULT_THEME];
  const [showCombatTracker, setShowCombatTracker] = useState(false);
  const handleOpenCombatTracker = useCallback(() => setShowCombatTracker(true), []);
  const [firstMeeting, setFirstMeeting] = useState(false);
  const { sources: effectSources, resolve: resolveEffectsBase } = useCharacterEffects(
    character,
    ruleset
  );

  // Wrap resolveEffects to inject transient firstMeeting state
  const resolveEffects = useCallback(
    (ctx: EffectResolutionContext): EffectResolutionResult => {
      if (firstMeeting) {
        const merged = {
          ...ctx,
          characterState: { ...ctx.characterState, firstMeeting: true },
        };
        return resolveEffectsBase(merged);
      }
      return resolveEffectsBase(ctx);
    },
    [resolveEffectsBase, firstMeeting]
  );

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

  const handleExport = useCallback(() => downloadCharacterJson(character), [character]);

  // Dice roller open helper
  const openDiceRoller = useCallback(
    (pool: number, context?: string) => {
      setTargetPool(pool);
      setPoolContext(context);
      setShowDiceRoller(true);
    },
    [] // useState setters are stable references
  );

  const handleAttributeSelect = useCallback(
    (attrId: string, val: number) => openDiceRoller(val, ATTRIBUTE_DISPLAY[attrId]?.abbr),
    [openDiceRoller]
  );

  const handleSkillSelect = useCallback(
    (skillId: string, pool: number, attrAbbr?: string) => {
      const skillName = skillId.replace(/-/g, " ");
      const context = attrAbbr ? `${attrAbbr} + ${skillName}` : skillName;
      openDiceRoller(pool, context);
    },
    [openDiceRoller]
  );

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

  return (
    <div className="character-sheet min-h-screen transition-colors duration-300">
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

        {/* Approval Status Banners */}
        {character.status === "pending-review" && (
          <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-4 print-hidden dark:bg-indigo-500/20">
            <p className="text-sm font-medium text-indigo-700 dark:text-indigo-400">
              Pending GM Review — This character is awaiting approval from the Game Master before it
              can be used in play.
            </p>
          </div>
        )}
        {character.approvalStatus === "rejected" && character.approvalFeedback && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 print-hidden dark:bg-red-500/20">
            <p className="text-sm font-medium text-red-700 dark:text-red-400">Revision Requested</p>
            <p className="mt-1 text-sm text-red-600 dark:text-red-300">
              {character.approvalFeedback}
            </p>
          </div>
        )}

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
          {isInCombat && (
            <Button
              className="relative p-2 text-amber-500 hover:text-amber-400 transition-colors"
              onPress={() => setShowCombatTracker(true)}
              aria-label="Open Combat Tracker"
            >
              <Swords className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            </Button>
          )}
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

        {/* Combat Tracker Modal */}
        <CombatTrackerModal
          isOpen={showCombatTracker}
          onClose={() => setShowCombatTracker(false)}
          theme={theme}
          characterId={character.id}
          character={character}
        />

        {/* Main Content Grid */}
        <div className="character-sheet-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Left Column - Attributes & Condition */}
          <div className="space-y-6">
            <AttributesDisplay character={character} onSelect={handleAttributeSelect} />

            <DerivedStatsDisplay character={character} resolveEffects={resolveEffects} />

            <EncumbranceDisplay character={character} />

            <LoadoutSummaryDisplay character={character} />

            <LoadoutDisplay
              character={character}
              onCharacterUpdate={setCharacter}
              editable={character.status === "active"}
            />

            <WirelessDisplay
              character={character}
              onCharacterUpdate={setCharacter}
              editable={character.status === "active"}
            />

            <EffectsSummaryDisplay sources={effectSources} />

            <ActiveModifiersPanel
              character={character}
              editable={character.status === "active"}
              onCharacterUpdate={setCharacter}
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
              onPoolSelect={openDiceRoller}
              resolveEffects={resolveEffects}
            />

            {/* Action Panel */}
            <ActionPanel
              character={character}
              woundModifier={woundModifier}
              physicalLimit={physicalLimit}
              mentalLimit={mentalLimit}
              socialLimit={socialLimit}
              onOpenDiceRoller={openDiceRoller}
            />

            {/* Quick Combat Controls */}
            <QuickCombatControls
              character={character}
              editionCode={character.editionCode}
              onOpenCombatTracker={handleOpenCombatTracker}
            />

            <QuickNPCPanel />
          </div>

          {/* Middle Column - Skills & Powers */}
          <div className="space-y-6">
            <SkillsDisplay
              character={character}
              resolveEffects={resolveEffects}
              onSelect={handleSkillSelect}
            />

            {/* Magic Operations */}
            {character.magicalPath !== "mundane" && <MagicSummaryDisplay character={character} />}

            {character.spells && character.spells.length > 0 && (
              <SpellsDisplay spells={character.spells} onSelect={openDiceRoller} />
            )}

            {character.adeptPowers && character.adeptPowers.length > 0 && (
              <AdeptPowersDisplay adeptPowers={character.adeptPowers} />
            )}

            {/* Complex Forms */}
            {character.complexForms && character.complexForms.length > 0 && (
              <ComplexFormsDisplay
                complexForms={character.complexForms}
                onSelect={openDiceRoller}
              />
            )}

            {/* Matrix Operations */}
            {hasMatrixAccess(character) && (
              <>
                <MatrixSummaryDisplay
                  character={character}
                  onCharacterUpdate={setCharacter}
                  editable={character.status === "active"}
                  connectionMode={matrixSession.connectionMode}
                  overwatchScore={matrixSession.overwatchScore}
                />
                {(character.cyberdecks?.length ?? 0) > 0 && (
                  <CyberdeckConfigDisplay
                    character={character}
                    onCharacterUpdate={setCharacter}
                    editable={character.status === "active"}
                  />
                )}
                {(character.programs?.length ?? 0) > 0 && (
                  <ProgramManagerDisplay
                    character={character}
                    onCharacterUpdate={setCharacter}
                    editable={character.status === "active"}
                  />
                )}
                {hasHackingCapability(character) && (
                  <>
                    <MatrixActionsDisplay
                      character={character}
                      onSelect={openDiceRoller}
                      editable={character.status === "active"}
                    />
                    <MatrixMarksDisplay character={character} />
                  </>
                )}
              </>
            )}

            {/* Rigging Operations */}
            {hasRiggingAccess(character) && (
              <>
                <RiggingSummaryDisplay
                  character={character}
                  onCharacterUpdate={setCharacter}
                  editable={character.status === "active"}
                />
                <DroneNetworkDisplay
                  character={character}
                  onCharacterUpdate={setCharacter}
                  editable={character.status === "active"}
                />
                <JumpInControlDisplay
                  character={character}
                  onCharacterUpdate={setCharacter}
                  editable={character.status === "active"}
                />
                <VehicleActionsDisplay
                  character={character}
                  onSelect={openDiceRoller}
                  editable={character.status === "active"}
                />
                <AutosoftManagerDisplay
                  character={character}
                  onCharacterUpdate={setCharacter}
                  editable={character.status === "active"}
                />
              </>
            )}

            {/* Foci */}
            {character.foci && character.foci.length > 0 && <FociDisplay foci={character.foci} />}

            <KnowledgeLanguagesDisplay character={character} onSelect={openDiceRoller} />

            <QualitiesDisplay
              character={character}
              onUpdate={setCharacter}
              firstMeeting={firstMeeting}
              onFirstMeetingChange={setFirstMeeting}
            />
          </div>

          {/* Right Column - Gear & Assets */}
          <div className="space-y-6">
            {/* Combat Gear: Weapons + Armor */}
            <WeaponsDisplay
              character={character}
              onSelect={openDiceRoller}
              onCharacterUpdate={setCharacter}
              editable={character.status === "active"}
            />

            <ArmorDisplay
              character={character}
              onCharacterUpdate={setCharacter}
              editable={character.status === "active"}
            />

            {hasMatrixAccess(character) && (
              <MatrixDevicesDisplay
                character={character}
                onCharacterUpdate={setCharacter}
                editable={character.status === "active"}
              />
            )}

            <AugmentationsDisplay
              character={character}
              onCharacterUpdate={setCharacter}
              editable={character.status === "active"}
            />

            <VehiclesDisplay
              vehicles={character.vehicles}
              drones={character.drones}
              rccs={character.rccs}
              character={character}
              onCharacterUpdate={setCharacter}
              editable={character.status === "active"}
            />

            <GearDisplay
              character={character}
              gear={(character.gear || []).filter((item) => item.category !== "drug")}
              onCharacterUpdate={setCharacter}
              editable={character.status === "active"}
            />

            <DrugsDisplay
              drugs={(character.gear || []).filter((item) => item.category === "drug")}
            />

            <LifestylesDisplay
              character={character}
              onCharacterUpdate={setCharacter}
              editable={character.status === "active"}
            />

            <ContactsDisplay character={character} />

            <ReputationDisplay character={character} onUpdate={setCharacter} />

            <IdentitiesDisplay character={character} />
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
        <MatrixSessionProvider character={character}>
          <RiggingSessionProvider character={character}>
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
          </RiggingSessionProvider>
        </MatrixSessionProvider>
      </CombatSessionProvider>
    </RulesetProvider>
  );
}
