"use client";

import { useState } from "react";

interface ConditionMonitorProps {
  maxBoxes: number;
  currentDamage: number;
  damageType?: "physical" | "stun";
  isStunned?: boolean;
  isDead?: boolean;
  onDamageChange?: (newDamage: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  label?: string;
}

const SIZE_CLASSES = {
  sm: { box: "w-4 h-4", text: "text-xs" },
  md: { box: "w-5 h-5", text: "text-sm" },
  lg: { box: "w-6 h-6", text: "text-base" },
};

export function ConditionMonitor({
  maxBoxes,
  currentDamage,
  damageType = "physical",
  isStunned = false,
  isDead = false,
  onDamageChange,
  readonly = false,
  size = "md",
  label,
}: ConditionMonitorProps) {
  const [hoveredBox, setHoveredBox] = useState<number | null>(null);
  const sizeClasses = SIZE_CLASSES[size];

  const handleBoxClick = (boxIndex: number) => {
    if (readonly || !onDamageChange) return;

    // If clicking on a filled box, clear damage up to and including that box
    // If clicking on an empty box, fill damage up to and including that box
    const newDamage = boxIndex < currentDamage ? boxIndex : boxIndex + 1;
    onDamageChange(Math.min(newDamage, maxBoxes));
  };

  const getBoxColor = (boxIndex: number) => {
    const isFilled = boxIndex < currentDamage;
    const isHovered = hoveredBox !== null && boxIndex <= hoveredBox;

    if (isDead) {
      return "bg-zinc-800 border-zinc-600 dark:bg-zinc-900 dark:border-zinc-700";
    }

    if (isFilled) {
      if (damageType === "stun") {
        return "bg-yellow-500 border-yellow-600 dark:bg-yellow-600 dark:border-yellow-700";
      }
      return "bg-red-500 border-red-600 dark:bg-red-600 dark:border-red-700";
    }

    if (isHovered && !readonly) {
      if (damageType === "stun") {
        return "bg-yellow-200 border-yellow-300 dark:bg-yellow-900/50 dark:border-yellow-700";
      }
      return "bg-red-200 border-red-300 dark:bg-red-900/50 dark:border-red-700";
    }

    return "bg-white border-zinc-300 dark:bg-zinc-800 dark:border-zinc-600";
  };

  // Group boxes into rows of 3 (SR5 standard)
  const rows: number[][] = [];
  for (let i = 0; i < maxBoxes; i += 3) {
    rows.push(
      Array.from({ length: Math.min(3, maxBoxes - i) }, (_, j) => i + j)
    );
  }

  return (
    <div className="space-y-1">
      {label && (
        <div className="flex items-center justify-between">
          <span className={`font-medium text-zinc-700 dark:text-zinc-300 ${sizeClasses.text}`}>
            {label}
          </span>
          <span className={`text-zinc-500 dark:text-zinc-400 ${sizeClasses.text}`}>
            {currentDamage}/{maxBoxes}
          </span>
        </div>
      )}

      <div className="space-y-0.5">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-0.5">
            {row.map((boxIndex) => (
              <button
                key={boxIndex}
                type="button"
                disabled={readonly}
                onClick={() => handleBoxClick(boxIndex)}
                onMouseEnter={() => !readonly && setHoveredBox(boxIndex)}
                onMouseLeave={() => setHoveredBox(null)}
                className={`
                  ${sizeClasses.box}
                  border rounded-sm transition-colors
                  ${getBoxColor(boxIndex)}
                  ${!readonly ? "cursor-pointer hover:ring-1 hover:ring-indigo-400" : "cursor-default"}
                  ${isDead ? "opacity-50" : ""}
                `}
                title={`Box ${boxIndex + 1}: ${boxIndex < currentDamage ? "Filled" : "Empty"}`}
              />
            ))}
            {/* Wound modifier indicator after every 3 boxes */}
            {rowIndex < rows.length - 1 && (
              <span className={`ml-1 ${sizeClasses.text} text-zinc-400 self-center`}>
                -{rowIndex + 1}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Status indicators */}
      {(isStunned || isDead) && (
        <div className="flex gap-2 mt-1">
          {isStunned && !isDead && (
            <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded text-xs font-medium">
              Stunned
            </span>
          )}
          {isDead && (
            <span className="px-1.5 py-0.5 bg-zinc-800 text-zinc-100 dark:bg-zinc-900 dark:text-zinc-400 rounded text-xs font-medium">
              Dead
            </span>
          )}
        </div>
      )}
    </div>
  );
}
