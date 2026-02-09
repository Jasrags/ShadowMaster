"use client";

import type { Character } from "@/lib/types";
import { DisplayCard } from "./DisplayCard";
import { BookOpen } from "lucide-react";

interface KnowledgeLanguagesDisplayProps {
  character: Character;
  onSelect?: (pool: number, label: string) => void;
}

export function KnowledgeLanguagesDisplay({ character, onSelect }: KnowledgeLanguagesDisplayProps) {
  const knowledgeSkills = character.knowledgeSkills || [];
  const languages = character.languages || [];

  return (
    <DisplayCard
      title="Knowledge & Languages"
      icon={<BookOpen className="h-4 w-4 text-zinc-400" />}
    >
      {knowledgeSkills.length === 0 && languages.length === 0 ? (
        <p className="text-sm text-zinc-500 italic px-1">No knowledge skills or languages</p>
      ) : (
        <div className="space-y-6">
          {knowledgeSkills.length > 0 && (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-700/50">
                    <th className="py-2 px-1 font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[10px]">
                      Knowledge Skill
                    </th>
                    <th className="py-2 px-1 font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[10px] text-center">
                      Type
                    </th>
                    <th className="py-2 px-1 font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[10px] text-right">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {knowledgeSkills.map((skill, index) => (
                    <tr
                      key={index}
                      onClick={() => onSelect?.(skill.rating, skill.name)}
                      className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer group"
                    >
                      <td className="py-2 px-1 text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
                        {skill.name}
                      </td>
                      <td className="py-2 px-1 text-center text-zinc-500 dark:text-zinc-400 capitalize text-[10px]">
                        {skill.category}
                      </td>
                      <td className="py-2 px-1 text-right font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                        [{skill.rating}]
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {languages.length > 0 && (
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700/50">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase font-mono">
                  Languages:
                </span>
                {languages.map((lang, index) => (
                  <span
                    key={index}
                    onClick={() => !lang.isNative && onSelect?.(lang.rating, lang.name)}
                    className={`px-2 py-1 text-[11px] rounded border transition-colors ${
                      lang.isNative
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-medium"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
                    }`}
                  >
                    {lang.name} {lang.isNative ? "(N)" : `(${lang.rating})`}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </DisplayCard>
  );
}
