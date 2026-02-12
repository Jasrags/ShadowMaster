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

function KnowledgeSkillRow({ skill, onClick }: { skill: KnowledgeSkill; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded px-1 py-[7px] transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/30 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
    >
      {/* Line 1: Name + Rating pill */}
      <div className="flex items-center justify-between">
        <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
          {skill.name}
        </span>
        <div
          data-testid="rating-pill"
          className="flex h-7 w-8 items-center justify-center rounded-md font-mono text-sm font-bold bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
        >
          {skill.rating}
        </div>
      </div>

      {/* Line 2: Category subtitle */}
      <div className="ml-1 mt-0.5 text-xs capitalize text-zinc-500 dark:text-zinc-400">
        {skill.category}
      </div>

      {/* Line 3: Specialization (conditional) */}
      {skill.specialization && (
        <div className="ml-1 mt-1 flex flex-wrap gap-1">
          <span
            data-testid="specialization-pill"
            className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
          >
            {skill.specialization}
          </span>
        </div>
      )}
    </div>
  );
}

function LanguageRow({ language, onClick }: { language: LanguageSkill; onClick?: () => void }) {
  return (
    <div
      onClick={language.isNative ? undefined : onClick}
      className={`group rounded px-1 py-[7px] transition-colors [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50 ${
        language.isNative ? "" : "cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700/30"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
          {language.name}
        </span>
        {language.isNative ? (
          <div
            data-testid="native-pill"
            className="flex h-7 w-8 items-center justify-center rounded-md font-mono text-sm font-bold border border-emerald-500/20 bg-emerald-500/12 text-emerald-600 dark:text-emerald-300"
          >
            N
          </div>
        ) : (
          <div
            data-testid="rating-pill"
            className="flex h-7 w-8 items-center justify-center rounded-md font-mono text-sm font-bold bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
          >
            {language.rating}
          </div>
        )}
      </div>
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
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1 dark:border-zinc-800 dark:bg-zinc-950">
                {sortedKnowledge.map((skill, index) => (
                  <KnowledgeSkillRow
                    key={index}
                    skill={skill}
                    onClick={() => onSelect?.(skill.rating, skill.name)}
                  />
                ))}
              </div>
            </div>
          )}

          {languages.length > 0 && (
            <div>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Languages
              </div>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1 dark:border-zinc-800 dark:bg-zinc-950">
                {languages.map((lang, index) => (
                  <LanguageRow
                    key={index}
                    language={lang}
                    onClick={() => onSelect?.(lang.rating, lang.name)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </DisplayCard>
  );
}
