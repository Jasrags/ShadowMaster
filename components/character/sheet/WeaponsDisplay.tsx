"use client";

import type { Character, Weapon } from "@/lib/types";
import { DisplayCard } from "./DisplayCard";
import { isMeleeWeapon } from "./constants";
import { Swords } from "lucide-react";

interface WeaponsDisplayProps {
  character: Character;
  onSelect?: (pool: number, label: string) => void;
}

function WeaponTable({
  weapons,
  character,
  type,
  onSelect,
}: {
  weapons: Weapon[];
  character: Character;
  type: "ranged" | "melee";
  onSelect?: (pool: number, label: string) => void;
}) {
  const skills = character.skills || {};

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse font-mono text-xs">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-700/50">
            <th className="py-2 px-1 font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[10px]">
              Name
            </th>
            <th className="py-2 px-1 font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[10px] text-center">
              Dmg
            </th>
            <th className="py-2 px-1 font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[10px] text-center">
              AP
            </th>
            {type === "ranged" ? (
              <>
                <th className="py-2 px-1 font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[10px] text-center">
                  Acc
                </th>
                <th className="py-2 px-1 font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[10px] text-center">
                  Mode
                </th>
              </>
            ) : (
              <th className="py-2 px-1 font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[10px] text-center">
                Reach
              </th>
            )}
            <th className="py-2 px-1 font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[10px] text-right">
              Pool
            </th>
          </tr>
        </thead>
        <tbody>
          {weapons.map((w, idx) => {
            const isMelee = isMeleeWeapon(w);

            let basePool = 0;
            let poolLabel = w.name;

            if (isMelee) {
              basePool = character.attributes?.strength || 3;
              poolLabel = `STR + ${w.name}`;
            } else {
              basePool = character.attributes?.agility || 3;
              poolLabel = `AGI + ${w.name}`;
            }

            const commonCombatSkills = [
              "pistols",
              "automatics",
              "longarms",
              "unarmed-combat",
              "blades",
              "clubs",
              "archery",
              "throwing-weapons",
            ];
            const foundSkill = commonCombatSkills.find((s) =>
              w.category.toLowerCase().includes(s.replace(/-/g, " "))
            );

            if (foundSkill && skills[foundSkill]) {
              basePool += skills[foundSkill];
              poolLabel = `${isMelee ? "STR" : "AGI"} + ${foundSkill.replace(/-/g, " ")}`;
            }

            return (
              <tr
                key={`${w.name}-${idx}`}
                onClick={() => onSelect?.(basePool, poolLabel)}
                className="group border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 cursor-pointer transition-colors"
              >
                <td className="py-2 px-1">
                  <div className="flex flex-col">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{w.name}</span>
                    <span className="text-[9px] text-zinc-500 dark:text-zinc-400 uppercase opacity-70">
                      {w.subcategory}
                    </span>
                  </div>
                </td>
                <td className="py-2 px-1 text-center">
                  <span className="text-emerald-500">{w.damage}</span>
                </td>
                <td className="py-2 px-1 text-center text-amber-500">{w.ap}</td>
                {type === "ranged" ? (
                  <>
                    <td className="py-2 px-1 text-center text-cyan-500">{w.accuracy || "-"}</td>
                    <td className="py-2 px-1 text-center text-[9px] text-zinc-500 dark:text-zinc-400">
                      {w.mode?.join("/") || "-"}
                    </td>
                  </>
                ) : (
                  <td className="py-2 px-1 text-center text-purple-500">
                    {w.reach != null && Number(w.reach) !== 0 ? w.reach : "-"}
                  </td>
                )}
                <td className="py-2 px-1 text-right font-bold tabular-nums">
                  <span className="text-emerald-500">{basePool}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function WeaponsDisplay({ character, onSelect }: WeaponsDisplayProps) {
  const ranged = character.weapons?.filter((w) => !isMeleeWeapon(w)) || [];
  const melee = character.weapons?.filter((w) => isMeleeWeapon(w)) || [];

  if (ranged.length === 0 && melee.length === 0) return null;

  return (
    <DisplayCard title="Weapons" icon={<Swords className="h-4 w-4 text-zinc-400" />}>
      <div className="space-y-6">
        {ranged.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block ml-1">
              Ranged Weapons
            </span>
            <WeaponTable type="ranged" character={character} weapons={ranged} onSelect={onSelect} />
          </div>
        )}
        {melee.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block ml-1">
              Melee Weapons
            </span>
            <WeaponTable type="melee" character={character} weapons={melee} onSelect={onSelect} />
          </div>
        )}
      </div>
    </DisplayCard>
  );
}
