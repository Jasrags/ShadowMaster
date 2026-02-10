"use client";

import { useEffect, useState, use, useMemo, useCallback } from "react";
import { Link, Button, Modal, ModalOverlay, Dialog, Heading } from "react-aria-components";
import type { Character, AdeptPower, Vehicle, CharacterDrone, CharacterRCC } from "@/lib/types";

import { DiceRoller } from "@/components";
import { useAuth } from "@/lib/auth/AuthProvider";
import AdminActionsPanel from "../components/AdminActionsPanel";
import {
  RulesetProvider,
  useRuleset,
  useMergedRuleset,
  useRulesetStatus,
  useSpells,
  type SpellData,
  type SpellsCatalogData,
} from "@/lib/rules";
import { calculateLimit, calculateWoundModifier } from "@/lib/rules/qualities";
import { ArrowLeft, Download, Pencil, Dice5, Printer, TrendingUp, Users, X } from "lucide-react";
import { THEMES, DEFAULT_THEME, type Theme, type ThemeId } from "@/lib/themes";
import { Section } from "./components/Section";
import { InteractiveConditionMonitor } from "./components/InteractiveConditionMonitor";
import { CombatQuickReference } from "./components/CombatQuickReference";
import { ActionPanel } from "./components/ActionPanel";
import { QuickCombatControls } from "./components/QuickCombatControls";
import { QuickNPCPanel } from "./components/QuickNPCPanel";
import { InventoryPanel } from "./components/InventoryPanel";
import { useCharacterSheetPreferences } from "./hooks/useCharacterSheetPreferences";
import { CombatSessionProvider } from "@/lib/combat";

import {
  ATTRIBUTE_DISPLAY,
  AttributesDisplay,
  SkillsDisplay,
  DerivedStatsDisplay,
  KnowledgeLanguagesDisplay,
  WeaponsDisplay,
  ArmorDisplay,
  GearDisplay,
  AugmentationsDisplay,
  ContactsDisplay,
  IdentitiesDisplay,
  CharacterInfoDisplay,
  QualitiesDisplay,
  FociDisplay,
  ComplexFormsDisplay,
} from "@/components/character/sheet";

// =============================================================================
// SPELL CARD COMPONENT (uses theme + spellsCatalog — migrates in Phase 4)
// =============================================================================

interface SpellCardProps {
  spellId: string;
  spellsCatalog: SpellsCatalogData | null;
  onSelect?: (pool: number, label: string) => void;
  theme?: Theme;
}

function SpellCard({ spellId, spellsCatalog, onSelect, theme }: SpellCardProps) {
  const t = theme || THEMES[DEFAULT_THEME];
  const spell = useMemo(() => {
    if (!spellsCatalog) return null;
    for (const cat in spellsCatalog) {
      const categorySpells = spellsCatalog[cat as keyof typeof spellsCatalog] as SpellData[];
      const found = categorySpells.find((s) => s.id === spellId);
      if (found) return found;
    }
    return null;
  }, [spellId, spellsCatalog]);

  if (!spell) return null;

  return (
    <div
      onClick={() => onSelect?.(6, spell.name)}
      className={`p-3 rounded transition-all cursor-pointer group ${t.components.card.wrapper} ${t.components.card.hover} ${t.id === "modern-card" ? t.components.card.border : "border-violet-500/50"}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-bold text-foreground transition-colors ${t.id === "modern-card" ? "group-hover:text-foreground" : "group-hover:text-violet-400"}`}
            >
              {spell.name}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter px-1.5 py-0.5 border border-border rounded">
              {spell.category}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
            {spell.description}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono mt-1">
            <div className="flex gap-1.5">
              <span className="text-muted-foreground opacity-70">TYPE</span>
              <span className="text-blue-400 uppercase">{spell.type}</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-muted-foreground opacity-70">RANGE</span>
              <span className="text-emerald-400 uppercase">{spell.range}</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-muted-foreground opacity-70">DUR</span>
              <span className="text-amber-400 uppercase">{spell.duration}</span>
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] text-muted-foreground uppercase font-mono leading-none mb-1">
            Drain
          </div>
          <div className="text-sm font-mono text-violet-400 font-bold leading-none">
            {spell.drain}
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// ADEPT POWER CARD COMPONENT (uses theme — migrates in Phase 4)
// =============================================================================

function AdeptPowerCard({ power, theme }: { power: AdeptPower; theme?: Theme }) {
  const t = theme || THEMES[DEFAULT_THEME];
  return (
    <div
      className={`p-3 rounded transition-all group ${t.components.card.wrapper} ${t.components.card.hover} ${t.id === "modern-card" ? t.components.card.border : "border-amber-500/50"}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-bold text-foreground transition-colors ${t.id === "modern-card" ? "group-hover:text-foreground" : "group-hover:text-amber-400"}`}
            >
              {power.name}
            </span>
            {power.rating && (
              <span className="text-[10px] font-mono text-amber-500 uppercase tracking-tighter px-1.5 py-0.5 border border-amber-500/30 rounded bg-amber-500/5">
                Level {power.rating}
              </span>
            )}
          </div>
          {power.specification && (
            <p className="text-[11px] text-muted-foreground font-mono italic">
              Spec: {power.specification}
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] text-muted-foreground uppercase font-mono leading-none mb-1">
            Cost
          </div>
          <div className="text-sm font-mono text-amber-500 dark:text-amber-400 font-bold leading-none">
            {power.powerPointCost} PP
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// VEHICLE CARD COMPONENT (uses theme — migrates in Phase 4)
// =============================================================================

function VehicleCard({
  vehicle,
  theme,
}: {
  vehicle: Vehicle | CharacterDrone | CharacterRCC;
  theme?: Theme;
}) {
  const isRCC = "deviceRating" in vehicle;
  const isDrone = "size" in vehicle;
  const t = theme || THEMES[DEFAULT_THEME];

  return (
    <div
      className={`p-3 rounded transition-all group ${t.components.card.wrapper} ${t.components.card.hover} ${t.id === "modern-card" ? t.components.card.border : isRCC ? "border-orange-500/50" : "border-border/50"}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <div
            className={`font-bold text-foreground transition-colors ${t.id === "modern-card" ? "" : "group-hover:text-amber-400"}`}
          >
            {vehicle.name}
          </div>
          <div className="text-[10px] text-muted-foreground uppercase font-mono">
            {isRCC ? "RCC" : isDrone ? `${(vehicle as CharacterDrone).size} Drone` : "Vehicle"}
          </div>
        </div>
        {isRCC && (
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground uppercase font-mono">Rating</div>
            <div className="text-lg font-bold font-mono text-orange-400">
              {(vehicle as CharacterRCC).deviceRating}
            </div>
          </div>
        )}
      </div>

      {!isRCC && (
        <div className="grid grid-cols-4 gap-2 text-center border-t border-border/50 pt-2">
          <div className="space-y-0.5">
            <div className="text-[9px] text-muted-foreground opacity-70 uppercase font-mono">
              Hand
            </div>
            <div className="text-xs font-mono text-foreground/80">
              {(vehicle as Vehicle).handling}
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[9px] text-muted-foreground opacity-70 uppercase font-mono">
              Spd
            </div>
            <div className="text-xs font-mono text-foreground/80">{(vehicle as Vehicle).speed}</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[9px] text-muted-foreground opacity-70 uppercase font-mono">
              Body
            </div>
            <div className="text-xs font-mono text-foreground/80">{(vehicle as Vehicle).body}</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[9px] text-muted-foreground opacity-70 uppercase font-mono">
              Armor
            </div>
            <div className="text-xs font-mono text-foreground/80">{(vehicle as Vehicle).armor}</div>
          </div>
        </div>
      )}

      {isRCC && (
        <div className="grid grid-cols-2 gap-4 text-center border-t border-border/50 pt-2">
          <div className="space-y-0.5">
            <div className="text-[9px] text-muted-foreground opacity-70 uppercase font-mono">
              Data Proc
            </div>
            <div className="text-xs font-mono text-foreground/80">
              {(vehicle as CharacterRCC).dataProcessing}
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[9px] text-muted-foreground opacity-70 uppercase font-mono">
              Firewall
            </div>
            <div className="text-xs font-mono text-foreground/80">
              {(vehicle as CharacterRCC).firewall}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// THEME SELECTOR
// =============================================================================

function ThemeSelector({
  currentTheme,
  onSelect,
}: {
  currentTheme: ThemeId;
  onSelect: (id: ThemeId) => void;
}) {
  return (
    <div className="flex items-center gap-1 bg-muted/20 p-1 rounded-lg border border-border/50">
      {Object.values(THEMES).map((theme) => (
        <button
          key={theme.id}
          onClick={() => onSelect(theme.id)}
          className={`
            px-3 py-1.5 text-xs font-medium rounded-md transition-all
            ${
              currentTheme === theme.id
                ? "bg-emerald-500 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }
          `}
        >
          {theme.name}
        </button>
      ))}
    </div>
  );
}

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
  const spellsCatalog = useSpells();

  const ruleset = useMergedRuleset();

  // Theme State
  const {
    preferences: sheetPrefs,
    updatePreference: updateSheetPref,
    isLoading: prefsLoading,
  } = useCharacterSheetPreferences(character.id);

  const currentThemeId = sheetPrefs.theme;
  const theme = THEMES[currentThemeId] || THEMES[DEFAULT_THEME];

  // ActionPanel state
  const [actionPanelExpanded, setActionPanelExpanded] = useState(true);

  useEffect(() => {
    if (character.editionCode) {
      loadRuleset(character.editionCode);
    }
  }, [character.editionCode, loadRuleset]);

  const handleThemeChange = (id: ThemeId) => {
    updateSheetPref("theme", id);
  };

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

  const handleExport = () => {
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(character, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${character.name || "character"}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Dice roller open helper
  const openDiceRoller = (pool: number, context?: string) => {
    setTargetPool(pool);
    setPoolContext(context);
    setShowDiceRoller(true);
  };

  return (
    <div
      className={`character-sheet min-h-screen transition-colors duration-300 ${theme.colors.background} p-4 sm:p-6 lg:p-8`}
    >
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
          <ThemeSelector currentTheme={currentThemeId} onSelect={handleThemeChange} />
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
            <Dice5 className={`w-6 h-6 ${showDiceRoller ? theme.colors.accent : ""}`} />
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
          <AdminActionsPanel
            character={character}
            isAdmin={isAdmin}
            theme={theme}
            onStatusChange={onRefresh}
          />
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
              w-full max-w-lg overflow-hidden rounded-xl border ${theme.colors.border} ${theme.colors.card} shadow-2xl
              ${isEntering ? "animate-in zoom-in-95 duration-300" : ""}
              ${isExiting ? "animate-out zoom-out-95 duration-200" : ""}
            `}
          >
            <Dialog className="outline-none">
              {({ close }) => (
                <div className="flex flex-col">
                  <div
                    className={`flex items-center justify-between p-4 border-b ${theme.colors.border}`}
                  >
                    <Heading slot="title" className={`text-lg font-bold ${theme.colors.heading}`}>
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
            />

            {/* Condition Monitors (uses theme + InteractiveConditionMonitor — Phase 4) */}
            <Section theme={theme} title="Condition">
              <div className="space-y-6">
                {woundModifier !== 0 && (
                  <div
                    className={`p-2 rounded text-center ${
                      theme.id === "modern-card"
                        ? "bg-amber-50 border border-amber-200 text-amber-700"
                        : "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                    }`}
                  >
                    <span className="text-xs font-mono uppercase">Total Wound Modifier: </span>
                    <span className="font-mono font-bold">{woundModifier}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <InteractiveConditionMonitor
                    characterId={character.id}
                    type="physical"
                    current={character.condition?.physicalDamage ?? 0}
                    max={physicalMonitorMax}
                    theme={theme}
                    readonly={character.status !== "draft" && character.status !== "active"}
                    onDamageApplied={(newValue) => handleDamageApplied("physical", newValue)}
                  />
                  <InteractiveConditionMonitor
                    characterId={character.id}
                    type="stun"
                    current={character.condition?.stunDamage ?? 0}
                    max={stunMonitorMax}
                    theme={theme}
                    readonly={character.status !== "draft" && character.status !== "active"}
                    onDamageApplied={(newValue) => handleDamageApplied("stun", newValue)}
                  />
                </div>
                <InteractiveConditionMonitor
                  characterId={character.id}
                  type="overflow"
                  current={character.condition?.overflowDamage ?? 0}
                  max={character.attributes?.body || 3}
                  theme={theme}
                  readonly={character.status !== "draft" && character.status !== "active"}
                  onDamageApplied={(newValue) => handleDamageApplied("overflow", newValue)}
                />
              </div>
            </Section>

            {/* Combat Quick Reference */}
            <Section theme={theme} title="Combat">
              <CombatQuickReference
                character={character}
                woundModifier={woundModifier}
                physicalLimit={physicalLimit}
                theme={theme}
                onPoolSelect={(pool, context) => openDiceRoller(pool, context)}
              />
            </Section>

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
              theme={theme}
            />

            {/* Quick Combat Controls */}
            <QuickCombatControls
              character={character}
              editionCode={character.editionCode}
              theme={theme}
            />

            <QuickNPCPanel theme={theme} />
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

            {/* Spells & Adept Powers (uses theme + spellsCatalog — Phase 4) */}
            {(character.spells?.length || 0) > 0 || (character.adeptPowers?.length || 0) > 0 ? (
              <Section theme={theme} title="Magic & Resonance">
                <div className="space-y-4">
                  {character.spells && character.spells.length > 0 && (
                    <div>
                      <span className="text-xs font-mono text-violet-500 uppercase mb-2 block">
                        Spells
                      </span>
                      <div className="space-y-3">
                        {character.spells.map((spellEntry, idx) => {
                          const spellId =
                            typeof spellEntry === "string"
                              ? spellEntry
                              : (spellEntry as { id: string }).id;
                          return (
                            <SpellCard
                              theme={theme}
                              key={spellId || idx}
                              spellId={spellId}
                              spellsCatalog={spellsCatalog}
                              onSelect={(pool, label) => openDiceRoller(pool, label)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {character.adeptPowers && character.adeptPowers.length > 0 && (
                    <div>
                      <span className="text-xs font-mono text-amber-500 uppercase mb-2 block">
                        Adept Powers
                      </span>
                      <div className="space-y-3">
                        {character.adeptPowers.map((power, idx) => (
                          <AdeptPowerCard theme={theme} key={idx} power={power} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Section>
            ) : null}

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

            {/* Vehicles & Assets (uses theme — Phase 4) */}
            {character.vehicles?.length || character.drones?.length || character.rccs?.length ? (
              <Section theme={theme} title="Gear & Assets">
                <div className="space-y-3">
                  {character.rccs?.map((rcc, idx) => (
                    <VehicleCard theme={theme} key={`rcc-${idx}`} vehicle={rcc} />
                  ))}
                  {character.vehicles?.map((v, idx) => (
                    <VehicleCard theme={theme} key={`veh-${idx}`} vehicle={v} />
                  ))}
                  {character.drones?.map((d, idx) => (
                    <VehicleCard theme={theme} key={`drone-${idx}`} vehicle={d} />
                  ))}
                </div>
              </Section>
            ) : null}

            {/* Inventory Management Panel */}
            <InventoryPanel
              character={character}
              theme={theme}
              onUpdate={(updated) => setCharacter(updated)}
              showActions={character.status === "active"}
            />

            <QualitiesDisplay
              character={character}
              theme={theme}
              onUpdate={(updated) => setCharacter(updated)}
            />

            <GearDisplay gear={character.gear || []} />

            <ContactsDisplay character={character} />

            <IdentitiesDisplay character={character} />

            {/* Lifestyles (uses theme — Phase 4) */}
            {character.lifestyles && character.lifestyles.length > 0 && (
              <Section theme={theme} title="Lifestyles">
                <div className="space-y-3">
                  {character.lifestyles.map((lifestyle, index) => {
                    const isPrimary = character.primaryLifestyleId === lifestyle.id;
                    return (
                      <div
                        key={`lifestyle-${index}`}
                        className={`p-3 rounded border-l-2 transition-colors ${
                          isPrimary
                            ? "bg-emerald-500/10 border-emerald-500/50"
                            : "bg-muted/30 border-border"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground/90 capitalize">
                              {lifestyle.type}
                            </span>
                            {isPrimary && (
                              <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded uppercase font-mono tracking-tighter">
                                Primary
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-mono text-emerald-400">
                            ¥{lifestyle.monthlyCost.toLocaleString()}/mo
                          </span>
                        </div>
                        {lifestyle.location && (
                          <p className="text-xs text-muted-foreground mt-1">{lifestyle.location}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Section>
            )}
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
