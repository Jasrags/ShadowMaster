"use client";

import type { Character } from "@/lib/types";
import { useSkills, type SkillData } from "@/lib/rules";
import { DisplayCard } from "./DisplayCard";
import { ATTRIBUTE_DISPLAY, getAttributeBonus } from "./constants";
import { Crosshair } from "lucide-react";

interface SkillsDisplayProps {
  character: Character;
  onSelect?: (skillId: string, rating: number, attrAbbr?: string) => void;
}

export function SkillsDisplay({ character, onSelect }: SkillsDisplayProps) {
  const { activeSkills } = useSkills();
  const skills = character.skills || {};
  const specializations = character.skillSpecializations || {};
  const sortedSkills = Object.entries(skills).sort((a, b) => b[1] - a[1]);

  return (
    <DisplayCard title="Skills" icon={<Crosshair className="h-4 w-4 text-zinc-400" />}>
      {sortedSkills.length === 0 ? (
        <p className="text-sm text-zinc-500 italic px-1">No skills assigned</p>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700/50">
                <th className="py-2 px-1 font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[10px]">
                  Skill
                </th>
                <th className="py-2 px-1 font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[10px] text-center">
                  Attr
                </th>
                <th className="py-2 px-1 font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[10px] text-center">
                  Rtg
                </th>
                <th className="py-2 px-1 font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[10px]">
                  Spec
                </th>
                <th className="py-2 px-1 font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[10px] text-right">
                  Dice Pool
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedSkills.map(([skillId, rating]) => {
                const skillData = activeSkills.find((s: SkillData) => s.id === skillId);
                const attrId = skillData?.linkedAttribute.toLowerCase();
                const attrDisplay = attrId ? ATTRIBUTE_DISPLAY[attrId] : null;

                let dicePool = rating;
                if (attrId) {
                  const baseAttr = character.attributes[attrId] || 0;
                  const bonuses = getAttributeBonus(character, attrId);
                  const augTotal = bonuses.reduce((sum, b) => sum + b.value, 0);
                  dicePool += baseAttr + augTotal;
                }

                const rawSpecs = specializations[skillId];
                const specs = rawSpecs ? (Array.isArray(rawSpecs) ? rawSpecs : [rawSpecs]) : [];
                const specDisplay = specs.length > 0 ? specs.join(", ") : "__________";

                return (
                  <tr
                    key={skillId}
                    onClick={() => onSelect?.(skillId, dicePool, attrDisplay?.abbr)}
                    className="group border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 cursor-pointer transition-colors"
                  >
                    <td className="py-2 px-1 max-w-[100px] truncate">
                      <span className="capitalize font-medium text-zinc-900 dark:text-zinc-100">
                        {skillId.replace(/-/g, " ")}
                      </span>
                    </td>
                    <td className="py-2 px-1 text-center">
                      {attrDisplay && (
                        <span className={`text-[10px] ${attrDisplay.color}`}>
                          {attrDisplay.abbr}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-1 text-center font-bold text-zinc-900 dark:text-zinc-100">
                      [{rating}]
                    </td>
                    <td className="py-2 px-1 max-w-[120px] truncate">
                      <span className="text-zinc-500 dark:text-zinc-400 italic text-[10px]">
                        {specDisplay}
                      </span>
                    </td>
                    <td className="py-2 px-1 text-right font-bold tabular-nums">
                      <span className="text-emerald-500">{dicePool}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DisplayCard>
  );
}
