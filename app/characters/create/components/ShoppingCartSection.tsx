"use client";

import { useState } from "react";
import type { GearItem, CyberwareItem, BiowareItem, Lifestyle, AdeptPower } from "@/lib/types";

interface ShoppingCartSectionProps {
  cartType: 'gear' | 'augmentations' | 'spells' | 'adept-powers' | null;
  isVisible: boolean;
  
  // Gear cart props
  gearItems?: GearItem[];
  lifestyle?: Lifestyle | null;
  gearTotal?: number;
  lifestyleCost?: number;
  onRemoveGear?: (index: number) => void;
  
  // Augmentation cart props
  cyberwareItems?: CyberwareItem[];
  biowareItems?: BiowareItem[];
  augmentationTotal?: number;
  essenceLoss?: number;
  onRemoveCyberware?: (index: number) => void;
  onRemoveBioware?: (index: number) => void;
  
  // Spells cart props
  spells?: string[];
  spellsKarmaSpent?: number;
  freeSpellsCount?: number;
  onRemoveSpell?: (spellId: string) => void;
  getSpellName?: (spellId: string) => string;
  
  // Adept powers cart props
  adeptPowers?: AdeptPower[];
  powerPointsSpent?: number;
  powerPointsBudget?: number;
  onRemoveAdeptPower?: (powerId: string) => void;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatEssence(value: number): string {
  return value.toFixed(2);
}

export function ShoppingCartSection({
  cartType,
  isVisible,
  gearItems = [],
  lifestyle,
  gearTotal = 0,
  lifestyleCost = 0,
  onRemoveGear,
  cyberwareItems = [],
  biowareItems = [],
  augmentationTotal = 0,
  essenceLoss = 0,
  onRemoveCyberware,
  onRemoveBioware,
  spells = [],
  spellsKarmaSpent = 0,
  freeSpellsCount = 0,
  onRemoveSpell,
  getSpellName,
  adeptPowers = [],
  powerPointsSpent = 0,
  powerPointsBudget = 0,
  onRemoveAdeptPower,
}: ShoppingCartSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!isVisible || !cartType) {
    return null;
  }

  const itemCount = cartType === 'gear' 
    ? gearItems.length 
    : cartType === 'augmentations'
    ? cyberwareItems.length + biowareItems.length
    : cartType === 'spells'
    ? spells.length
    : adeptPowers.length;

  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="p-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          <span>
            {cartType === 'gear' ? 'Shopping Cart' 
            : cartType === 'augmentations' ? 'Installed Augmentations'
            : cartType === 'spells' ? 'Selected Spells'
            : 'Selected Powers'}
          </span>
          <div className="flex items-center gap-2">
            {itemCount > 0 && (
              <span className="inline-flex h-5 items-center justify-center rounded-full bg-emerald-100 px-2 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                {itemCount}
              </span>
            )}
            <svg
              className={`h-4 w-4 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>

        {!isCollapsed && (
          <div className="mt-3 space-y-2">
            {cartType === 'spells' ? (
              <>
                {spells.length === 0 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    No spells selected yet.
                  </p>
                ) : (
                  <div className="max-h-[300px] space-y-2 overflow-y-auto">
                    {spells.map((spellId, index) => {
                      const isFree = index < freeSpellsCount;
                      const spellName = getSpellName ? getSpellName(spellId) : spellId;
                      return (
                        <div
                          key={spellId}
                          className="flex items-center justify-between rounded-lg bg-zinc-50 p-2 dark:bg-zinc-700/50"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium truncate">{spellName}</p>
                              {isFree ? (
                                <span className="flex-shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                  FREE
                                </span>
                              ) : (
                                <span className="flex-shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                                  5K
                                </span>
                              )}
                            </div>
                          </div>
                          {onRemoveSpell && (
                            <button
                              onClick={() => onRemoveSpell(spellId)}
                              className="ml-2 rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                              aria-label="Remove spell"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Summary */}
                {spells.length > 0 && (
                  <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-600">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-600 dark:text-zinc-400">Total Spells:</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {spells.length}
                      </span>
                    </div>
                    {spellsKarmaSpent > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-600 dark:text-zinc-400">Karma Spent:</span>
                        <span className="font-medium text-amber-600 dark:text-amber-400">
                          -{spellsKarmaSpent}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : cartType === 'adept-powers' ? (
              <>
                {adeptPowers.length === 0 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    No powers selected yet.
                  </p>
                ) : (
                  <div className="max-h-[300px] space-y-2 overflow-y-auto">
                    {adeptPowers.map((power) => (
                      <div
                        key={power.id}
                        className="flex items-center justify-between rounded-lg bg-zinc-50 p-2 dark:bg-zinc-700/50"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate">
                              {power.name}
                              {power.rating && ` ${power.rating}`}
                              {power.specification && ` (${power.specification})`}
                            </p>
                            <span className="flex-shrink-0 rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                              {power.powerPointCost} PP
                            </span>
                          </div>
                        </div>
                        {onRemoveAdeptPower && (
                          <button
                            onClick={() => onRemoveAdeptPower(power.id)}
                            className="ml-2 rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                            aria-label="Remove power"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Summary */}
                {adeptPowers.length > 0 && (
                  <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-600">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-600 dark:text-zinc-400">Power Points Used:</span>
                      <span className="font-medium text-violet-600 dark:text-violet-400">
                        {powerPointsSpent.toFixed(1)} / {powerPointsBudget.toFixed(1)} PP
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : cartType === 'gear' ? (
              <>
                {gearItems.length === 0 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    No items added yet.
                  </p>
                ) : (
                  <div className="max-h-[300px] space-y-2 overflow-y-auto">
                    {gearItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-zinc-50 p-2 dark:bg-zinc-700/50"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            ¥{formatCurrency(item.cost)} × {item.quantity} = ¥
                            {formatCurrency(item.cost * item.quantity)}
                          </p>
                        </div>
                        {onRemoveGear && (
                          <button
                            onClick={() => onRemoveGear(index)}
                            className="ml-2 rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                            aria-label="Remove item"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Totals */}
                {(gearItems.length > 0 || lifestyle) && (
                  <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-600">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-600 dark:text-zinc-400">Gear Total:</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        ¥{formatCurrency(gearTotal)}
                      </span>
                    </div>
                    {lifestyle && (
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-600 dark:text-zinc-400">Lifestyle:</span>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          ¥{formatCurrency(lifestyleCost)}
                        </span>
                      </div>
                    )}
                    <div className="mt-2 flex justify-between text-sm font-semibold">
                      <span>Grand Total:</span>
                      <span>¥{formatCurrency(gearTotal + lifestyleCost)}</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {cyberwareItems.length === 0 && biowareItems.length === 0 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    No augmentations installed yet.
                  </p>
                ) : (
                  <div className="max-h-[300px] space-y-4 overflow-y-auto">
                    {/* Cyberware */}
                    {cyberwareItems.length > 0 && (
                      <div>
                        <h4 className="mb-2 text-xs font-medium text-cyan-600 dark:text-cyan-400">
                          Cyberware
                        </h4>
                        <div className="space-y-2">
                          {cyberwareItems.map((item, index) => (
                            <div
                              key={item.id || index}
                              className="flex items-center justify-between rounded-lg bg-zinc-50 p-2 dark:bg-zinc-700/50"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.name}</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                  {item.grade} | {formatEssence(item.essenceCost)} ESS | ¥
                                  {formatCurrency(item.cost)}
                                </p>
                              </div>
                              {onRemoveCyberware && (
                                <button
                                  onClick={() => onRemoveCyberware(index)}
                                  className="ml-2 rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  aria-label="Remove item"
                                >
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bioware */}
                    {biowareItems.length > 0 && (
                      <div>
                        <h4 className="mb-2 text-xs font-medium text-green-600 dark:text-green-400">
                          Bioware
                        </h4>
                        <div className="space-y-2">
                          {biowareItems.map((item, index) => (
                            <div
                              key={item.id || index}
                              className="flex items-center justify-between rounded-lg bg-zinc-50 p-2 dark:bg-zinc-700/50"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.name}</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                  {item.grade} | {formatEssence(item.essenceCost)} ESS | ¥
                                  {formatCurrency(item.cost)}
                                </p>
                              </div>
                              {onRemoveBioware && (
                                <button
                                  onClick={() => onRemoveBioware(index)}
                                  className="ml-2 rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  aria-label="Remove item"
                                >
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Summary */}
                {(cyberwareItems.length > 0 || biowareItems.length > 0) && (
                  <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-600">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-600 dark:text-zinc-400">Total Essence:</span>
                      <span className="font-medium text-amber-600 dark:text-amber-400">
                        -{formatEssence(essenceLoss)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-600 dark:text-zinc-400">Total Cost:</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        ¥{formatCurrency(augmentationTotal)}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

