"use client";

import type { Character } from "@/lib/types";
import { useMetatypes } from "@/lib/rules";
import { DisplayCard } from "./DisplayCard";
import { ATTRIBUTE_DISPLAY, getAttributeBonus } from "./constants";
import { BarChart3 } from "lucide-react";

interface AttributesDisplayProps {
  character: Character;
  onSelect?: (attrId: string, value: number) => void;
}

const ATTRIBUTES = [
  { id: "body", label: "Body" },
  { id: "agility", label: "Agility" },
  { id: "reaction", label: "Reaction" },
  { id: "strength", label: "Strength" },
  { id: "willpower", label: "Willpower" },
  { id: "logic", label: "Logic" },
  { id: "intuition", label: "Intuition" },
  { id: "charisma", label: "Charisma" },
];

export function AttributesDisplay({ character, onSelect }: AttributesDisplayProps) {
  const metatypes = useMetatypes();
  const metatypeData = metatypes.find(
    (m) => m.name.toLowerCase() === character.metatype.toLowerCase()
  );

  return (
    <DisplayCard title="Attributes" icon={<BarChart3 className="h-4 w-4 text-zinc-400" />}>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-700/50">
              <th className="py-2 px-1 font-bold text-zinc-500 dark:text-zinc-400 uppercase">
                Attribute
              </th>
              <th className="py-2 px-1 font-bold text-zinc-500 dark:text-zinc-400 uppercase text-center">
                Base
              </th>
              <th className="py-2 px-1 font-bold text-zinc-500 dark:text-zinc-400 uppercase text-center">
                Aug
              </th>
              <th className="py-2 px-1 font-bold text-zinc-500 dark:text-zinc-400 uppercase text-center">
                Min/Max
              </th>
              <th className="py-2 px-1 font-bold text-zinc-500 dark:text-zinc-400 uppercase">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {ATTRIBUTES.map(({ id, label }) => {
              const base = character.attributes[id] || 0;
              const bonuses = getAttributeBonus(character, id);
              const augTotal = bonuses.reduce((sum, b) => sum + b.value, 0);
              const display = ATTRIBUTE_DISPLAY[id];

              const limit = metatypeData?.attributes[id];
              const minMaxStr =
                limit && "min" in limit && "max" in limit ? `(${limit.min}/${limit.max})` : "(1/6)";

              return (
                <tr
                  key={id}
                  onClick={() => onSelect?.(id, base + augTotal)}
                  className="group border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 cursor-pointer transition-colors"
                >
                  <td className="py-2 px-1">
                    <span
                      className={`font-bold ${display?.color || "text-zinc-900 dark:text-zinc-100"}`}
                    >
                      {label}
                    </span>
                  </td>
                  <td className="py-2 px-1 text-center font-bold text-zinc-900 dark:text-zinc-100">
                    [{base}]
                  </td>
                  <td className="py-2 px-1 text-center font-bold text-emerald-500">
                    {augTotal > 0 ? `[+${augTotal}]` : "[  ]"}
                  </td>
                  <td className="py-2 px-1 text-center text-zinc-500 dark:text-zinc-400">
                    {minMaxStr}
                  </td>
                  <td
                    className="py-2 px-1 text-[10px] text-zinc-500 dark:text-zinc-400 italic truncate max-w-[120px]"
                    title={bonuses.map((b) => `${b.source} (+${b.value})`).join(", ")}
                  >
                    {bonuses.length > 0 ? bonuses.map((b) => b.source).join(", ") : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700/50 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 dark:text-zinc-400 uppercase">Edge</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                [{character.specialAttributes.edge}]
              </span>
              <span className="text-zinc-500 dark:text-zinc-400">/</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                [{character.specialAttributes.edge}]
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 dark:text-zinc-400 uppercase">Essence</span>
            <span className="font-bold text-blue-400">
              [{character.specialAttributes.essence.toFixed(2)}]
            </span>
          </div>
          {(character.specialAttributes.magic !== undefined ||
            character.specialAttributes.resonance !== undefined) && (
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 dark:text-zinc-400 uppercase">
                {character.specialAttributes.magic !== undefined ? "Magic" : "Resonance"}
              </span>
              <span
                className={`font-bold ${
                  character.specialAttributes.magic !== undefined
                    ? "text-violet-400"
                    : "text-cyan-400"
                }`}
              >
                [{character.specialAttributes.magic ?? character.specialAttributes.resonance}]
              </span>
            </div>
          )}
        </div>
      </div>
    </DisplayCard>
  );
}
