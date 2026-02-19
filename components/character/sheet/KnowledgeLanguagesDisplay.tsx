"use client";

import type { Character, KnowledgeSkill, LanguageSkill } from "@/lib/types";
import { DisplayCard } from "./DisplayCard";
import { BookOpen } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface KnowledgeLanguagesDisplayProps {
  character: Character;
  onSelect?: (pool: number, label: string) => void;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function KnowledgeSkillRow({
  skill,
  onSelect,
}: {
  skill: KnowledgeSkill;
  onSelect?: (pool: number, label: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50">
      <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
        {skill.name}
      </span>
      <span className="shrink-0 capitalize text-[10px] text-zinc-400 dark:text-zinc-500">
        ({skill.category})
      </span>
      {skill.specialization && (
        <span
          data-testid="specialization-pill"
          className="inline-flex shrink-0 items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
        >
          {skill.specialization}
        </span>
      )}
      {onSelect ? (
        <button
          data-testid="dice-pool-pill"
          onClick={() => onSelect(skill.rating, skill.name)}
          className="ml-auto shrink-0 cursor-pointer rounded border border-emerald-500/20 bg-emerald-500/12 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-600 dark:text-emerald-300"
        >
          {skill.rating}
        </button>
      ) : (
        <span
          data-testid="rating-pill"
          className="ml-auto shrink-0 font-mono text-[11px] text-zinc-500"
        >
          {skill.rating}
        </span>
      )}
    </div>
  );
}

function LanguageRow({
  language,
  onSelect,
}: {
  language: LanguageSkill;
  onSelect?: (pool: number, label: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50">
      <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
        {language.name}
      </span>
      {language.isNative ? (
        <span
          data-testid="native-pill"
          className="ml-auto shrink-0 rounded border border-emerald-500/20 bg-emerald-500/12 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-600 dark:text-emerald-300"
        >
          N
        </span>
      ) : onSelect ? (
        <button
          data-testid="dice-pool-pill"
          onClick={() => onSelect(language.rating, language.name)}
          className="ml-auto shrink-0 cursor-pointer rounded border border-emerald-500/20 bg-emerald-500/12 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-600 dark:text-emerald-300"
        >
          {language.rating}
        </button>
      ) : (
        <span
          data-testid="rating-pill"
          className="ml-auto shrink-0 font-mono text-[11px] text-zinc-500"
        >
          {language.rating}
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function KnowledgeLanguagesDisplay({ character, onSelect }: KnowledgeLanguagesDisplayProps) {
  const knowledgeSkills = character.knowledgeSkills || [];
  const languages = character.languages || [];

  const sortedKnowledge = [...knowledgeSkills].sort((a, b) => b.rating - a.rating);

  return (
    <DisplayCard
      title="Knowledge & Languages"
      icon={<BookOpen className="h-4 w-4 text-zinc-400" />}
    >
      {knowledgeSkills.length === 0 && languages.length === 0 ? (
        <p className="text-sm text-zinc-500 italic px-1">No knowledge skills or languages</p>
      ) : (
        <div className="space-y-3">
          {sortedKnowledge.length > 0 && (
            <div>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Knowledge
              </div>
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                {sortedKnowledge.map((skill, index) => (
                  <KnowledgeSkillRow key={index} skill={skill} onSelect={onSelect} />
                ))}
              </div>
            </div>
          )}

          {languages.length > 0 && (
            <div>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Languages
              </div>
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                {languages.map((lang, index) => (
                  <LanguageRow key={index} language={lang} onSelect={onSelect} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </DisplayCard>
  );
}
