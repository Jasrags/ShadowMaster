"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Link } from "react-aria-components";
import { RulesetProvider, useRulesetStatus, useRuleset } from "@/lib/rules";
import { QualitiesAdvancement } from "./qualities";
import type { Character } from "@/lib/types";

interface AdvancementContentProps {
  character: Character;
  characterId: string;
}

function AdvancementContent({ character, characterId }: AdvancementContentProps) {
  const router = useRouter();
  const { loading, error, ready } = useRulesetStatus();
  const { loadRuleset } = useRuleset();
  const [currentCharacter, setCurrentCharacter] = useState<Character>(character);

  useEffect(() => {
    if (character.editionCode) {
      loadRuleset(character.editionCode);
    }
  }, [character.editionCode, loadRuleset]);

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
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            Loading ruleset...
          </p>
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

  if (ready) {
    return (
      <QualitiesAdvancement
        character={currentCharacter}
        onCharacterUpdate={handleCharacterUpdate}
      />
    );
  }

  return null;
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
          throw new Error("Cannot manage advancement for draft characters. Please finalize the character first.");
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
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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
            Quality Advancement
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Manage qualities for {character.name || "your character"}
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

