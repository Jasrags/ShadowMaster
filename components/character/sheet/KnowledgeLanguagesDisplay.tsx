"use client";

import { useState } from "react";
import type { Character, KnowledgeSkill, LanguageSkill } from "@/lib/types";
import { DisplayCard } from "./DisplayCard";
import { BookOpen, ChevronDown, ChevronRight } from "lucide-react";

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
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded px-1 py-[7px] transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/30 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
    >
      {/* Collapsed row: Chevron + Name ... Rating pill */}
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-1.5">
          <button
            data-testid="expand-button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
          <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
            {skill.name}
          </span>
        </div>
        <div
          data-testid="rating-pill"
          className="flex h-7 w-8 items-center justify-center rounded-md font-mono text-sm font-bold bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
        >
          {skill.rating}
        </div>
      </div>

      {/* Expanded section */}
      {isExpanded && (
        <div
          data-testid="expanded-content"
          onClick={(e) => e.stopPropagation()}
          className="ml-5 mt-2 space-y-1.5 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700"
        >
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Category:{" "}
            <span className="font-medium capitalize text-zinc-700 dark:text-zinc-300">
              {skill.category}
            </span>
          </div>
          {skill.specialization && (
            <div className="flex flex-wrap gap-1">
              <span
                data-testid="specialization-pill"
                className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
              >
                {skill.specialization}
              </span>
            </div>
          )}
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
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="inline-block w-3.5 shrink-0" />
          <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
            {language.name}
          </span>
        </div>
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
