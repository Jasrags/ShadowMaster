"use client";

import { useEffect, useState, use } from "react";
import { Link } from "react-aria-components";
import { RulesetProvider, useRulesetStatus, useRuleset } from "@/lib/rules";
import { QualitiesAdvancement } from "./qualities";
import { AttributesTab } from "./components/AttributesTab";
import { SkillsTab } from "./components/SkillsTab";
import { TrainingDashboard } from "./components/TrainingDashboard";
import { HistoryTab } from "./components/HistoryTab";
import type { Character } from "@/lib/types";

interface AdvancementContentProps {
  character: Character;
  characterId: string;
}

type AdvancementTab = "attributes" | "skills" | "qualities" | "training" | "history";

function AdvancementContent({ character, characterId }: AdvancementContentProps) {
  const { loading, error, ready } = useRulesetStatus();
  const { loadRuleset, ruleset } = useRuleset();
  const [currentCharacter, setCurrentCharacter] = useState<Character>(character);
  const [activeTab, setActiveTab] = useState<AdvancementTab>("attributes");
  const [isGM, setIsGM] = useState(false);

  useEffect(() => {
    if (character.editionCode) {
      loadRuleset(character.editionCode);
    }
  }, [character.editionCode, loadRuleset]);

  // Determine GM status if in a campaign
  useEffect(() => {
    async function checkGMStatus() {
      if (!currentCharacter.campaignId) return;

      try {
        const response = await fetch(`/api/campaigns/${currentCharacter.campaignId}`);
        const data = await response.json();
        if (data.success && data.userRole === "gm") {
          setIsGM(true);
        }
      } catch (err) {
        console.error("Failed to check GM status:", err);
      }
    }

    checkGMStatus();
  }, [currentCharacter.campaignId]);

  const handleCharacterUpdate = async (updatedCharacter: Character) => {
    setCurrentCharacter(updatedCharacter);
    // Optionally refresh from server
    try {
      const response = await fetch(`/api/characters/${characterId}`);
      const data = await response.json();
      if (data.success && data.character) {
        setCurrentCharacter(data.character);
      }
    } catch (err) {
      console.error("Failed to refresh character:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-r-transparent" />
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">Loading ruleset...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            Failed to load ruleset
          </h3>
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!ready || !ruleset) {
    return null;
  }

  // Tabs configuration
  const tabs: Array<{ id: AdvancementTab; label: string }> = [
    { id: "attributes", label: "Attributes" },
    { id: "skills", label: "Skills" },
    { id: "qualities", label: "Qualities" },
    { id: "training", label: "Training" },
    { id: "history", label: "History" },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab.id
                ? "text-zinc-100 border-b-2 border-emerald-500"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "attributes" && ruleset && (
          <AttributesTab
            character={currentCharacter}
            ruleset={ruleset}
            onCharacterUpdate={handleCharacterUpdate}
          />
        )}
        {activeTab === "skills" && ruleset && (
          <SkillsTab
            character={currentCharacter}
            ruleset={ruleset}
            onCharacterUpdate={handleCharacterUpdate}
          />
        )}
        {activeTab === "qualities" && (
          <QualitiesAdvancement
            character={currentCharacter}
            onCharacterUpdate={handleCharacterUpdate}
          />
        )}
        {activeTab === "training" && (
          <TrainingDashboard
            character={currentCharacter}
            onCharacterUpdate={handleCharacterUpdate}
          />
        )}
        {activeTab === "history" && (
          <HistoryTab
            character={currentCharacter}
            isGM={isGM}
            onCharacterUpdate={handleCharacterUpdate}
          />
        )}
      </div>
    </div>
  );
}

export default function AdvancementPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCharacter() {
      try {
        const response = await fetch(`/api/characters/${resolvedParams.id}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to load character");
        }

        const char = data.character;
        if (char.status === "draft") {
          throw new Error(
            "Cannot manage advancement for draft characters. Please finalize the character first."
          );
        }

        setCharacter(char);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchCharacter();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-emerald-500/20 rounded-full animate-spin border-t-emerald-500" />
          <span className="text-sm font-mono text-zinc-500 animate-pulse">
            LOADING CHARACTER...
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
          href={`/characters/${resolvedParams.id}`}
          className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
        >
          ← Return to character
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Character Advancement
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Advance {character.name || "your character"} with karma
          </p>
        </div>
        <Link
          href={`/characters/${resolvedParams.id}`}
          className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
        >
          ← Back to Character
        </Link>
      </div>

      <RulesetProvider>
        <AdvancementContent character={character} characterId={resolvedParams.id} />
      </RulesetProvider>
    </div>
  );
}
