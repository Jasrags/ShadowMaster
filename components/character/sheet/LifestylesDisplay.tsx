"use client";

import { useState, useCallback } from "react";
import { Home, ChevronDown, ChevronRight, MapPin, User, AlertTriangle, Plus } from "lucide-react";
import type { Character, Lifestyle, LifestyleSubscription } from "@/lib/types";
import { LIFESTYLE_TYPES } from "@/components/creation/identities/constants";
import { LifestyleModal } from "@/components/creation/identities/LifestyleModal";
import type { NewLifestyleState } from "@/components/creation/identities/types";
import { DisplayCard } from "./DisplayCard";

// =============================================================================
// COST CALCULATION HELPER (exported for testing)
// =============================================================================

/**
 * Calculate the total monthly cost for a single lifestyle including
 * base cost, modifications, subscriptions, and custom expenses/income.
 */
export function calculateLifestyleMonthlyCost(lifestyle: Lifestyle): number {
  const lifestyleType = LIFESTYLE_TYPES.find((lt) => lt.id === lifestyle.type);
  const baseCost = lifestyleType?.monthlyCost ?? lifestyle.monthlyCost;

  const modificationsCost = (lifestyle.modifications || []).reduce((sum, mod) => {
    if (mod.modifierType === "percentage") {
      return sum + ((baseCost * mod.modifier) / 100) * (mod.type === "positive" ? 1 : -1);
    }
    return sum + mod.modifier * (mod.type === "positive" ? 1 : -1);
  }, 0);

  const subscriptionsCost = (lifestyle.subscriptions || []).reduce(
    (sum, sub) => sum + sub.monthlyCost,
    0
  );

  return Math.max(
    0,
    baseCost +
      modificationsCost +
      subscriptionsCost +
      (lifestyle.customExpenses || 0) -
      (lifestyle.customIncome || 0)
  );
}

// =============================================================================
// TIER BADGE COLORS
// =============================================================================

function getTierColor(type: string): string {
  switch (type) {
    case "street":
      return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
    case "squatter":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300";
    case "low":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300";
    case "medium":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300";
    case "high":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300";
    case "luxury":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300";
    default:
      return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
  }
}

function getTierName(type: string): string {
  return LIFESTYLE_TYPES.find((lt) => lt.id === type)?.name || type;
}

// =============================================================================
// LIFESTYLE ROW
// =============================================================================

interface LifestyleRowProps {
  lifestyle: Lifestyle;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  identityName?: string;
  editable: boolean;
  onEdit: () => void;
  onRemove: () => void;
  onPayMonth: () => void;
}

function LifestyleRow({
  lifestyle,
  isExpanded,
  onToggle,
  identityName,
  editable,
  onEdit,
  onRemove,
  onPayMonth,
}: LifestyleRowProps) {
  const monthlyCost = calculateLifestyleMonthlyCost(lifestyle);
  const [confirmRemove, setConfirmRemove] = useState(false);

  return (
    <div className="border-b border-zinc-100 last:border-b-0 dark:border-zinc-800">
      {/* Collapsed row */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
      >
        {isExpanded ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
        )}

        {/* Tier badge */}
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getTierColor(lifestyle.type)}`}
        >
          {getTierName(lifestyle.type)}
        </span>

        {/* Cost pill */}
        <span className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[10px] font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          ¥{monthlyCost.toLocaleString()}/mo
        </span>

        {/* Prepaid months */}
        {(lifestyle.prepaidMonths ?? 0) > 0 && (
          <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
            {lifestyle.prepaidMonths}mo prepaid
          </span>
        )}

        {/* Location */}
        {lifestyle.location && (
          <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            <MapPin className="h-3 w-3" />
            {lifestyle.location}
          </span>
        )}

        {/* Linked identity */}
        {identityName && (
          <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            <User className="h-3 w-3" />
            {identityName}
          </span>
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="ml-5 space-y-3 border-l-2 border-zinc-200 pb-3 pl-3 dark:border-zinc-700">
          {/* Modifications */}
          {(lifestyle.modifications || []).length > 0 && (
            <div>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Modifications
              </div>
              <div className="space-y-1">
                {(lifestyle.modifications || []).map((mod, i) => (
                  <div key={mod.catalogId || i} className="flex items-center gap-2 text-xs">
                    <span className="text-zinc-700 dark:text-zinc-300">{mod.name}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                        mod.type === "positive"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                      }`}
                    >
                      {mod.type === "positive" ? "+" : "-"}
                      {mod.modifierType === "percentage"
                        ? `${mod.modifier}%`
                        : `¥${mod.modifier.toLocaleString()}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subscriptions */}
          {(lifestyle.subscriptions || []).length > 0 && (
            <div>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Subscriptions
              </div>
              <div className="space-y-1">
                {(lifestyle.subscriptions || []).map((sub: LifestyleSubscription, i: number) => (
                  <div key={sub.catalogId || i} className="flex items-center gap-2 text-xs">
                    <span className="text-zinc-700 dark:text-zinc-300">{sub.name}</span>
                    {sub.level && (
                      <span className="rounded border border-blue-500/20 bg-blue-500/10 px-1 py-0.5 text-[10px] text-blue-600 dark:text-blue-300">
                        {sub.level}
                      </span>
                    )}
                    <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                      ¥{sub.monthlyCost.toLocaleString()}/mo
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom expenses/income */}
          {((lifestyle.customExpenses ?? 0) > 0 || (lifestyle.customIncome ?? 0) > 0) && (
            <div>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Custom Adjustments
              </div>
              <div className="space-y-1 text-xs">
                {(lifestyle.customExpenses ?? 0) > 0 && (
                  <div className="text-red-600 dark:text-red-400">
                    +¥{(lifestyle.customExpenses ?? 0).toLocaleString()}/mo expenses
                  </div>
                )}
                {(lifestyle.customIncome ?? 0) > 0 && (
                  <div className="text-emerald-600 dark:text-emerald-400">
                    -¥{(lifestyle.customIncome ?? 0).toLocaleString()}/mo income
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {lifestyle.notes && (
            <div>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Notes
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">{lifestyle.notes}</p>
            </div>
          )}

          {/* Actions */}
          {editable && (
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onPayMonth}
                className="rounded bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700"
              >
                Pay Month
              </button>
              <button
                type="button"
                onClick={onEdit}
                className="rounded border border-zinc-300 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Edit
              </button>
              {!confirmRemove ? (
                <button
                  type="button"
                  onClick={() => setConfirmRemove(true)}
                  className="rounded border border-red-300 bg-white px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:bg-zinc-800 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  Remove
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      onRemove();
                      setConfirmRemove(false);
                    }}
                    className="rounded bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmRemove(false)}
                    className="rounded px-2.5 py-1 text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

interface LifestylesDisplayProps {
  character: Character;
  onCharacterUpdate?: (updatedCharacter: Character) => void;
  editable?: boolean;
}

export function LifestylesDisplay({
  character,
  onCharacterUpdate,
  editable = false,
}: LifestylesDisplayProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const toggleRow = useCallback((index: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const lifestyles = character.lifestyles || [];

  if (lifestyles.length === 0 && !editable) {
    return null;
  }

  const totalMonthlyCost = lifestyles.reduce(
    (sum, ls) => sum + calculateLifestyleMonthlyCost(ls),
    0
  );
  const isLowFunds = character.nuyen < totalMonthlyCost;

  // Get identity name by ID
  const getIdentityName = (identityId?: string): string | undefined => {
    if (!identityId) return undefined;
    const identities = character.identities || [];
    for (const identity of identities) {
      if (identity.id === identityId) {
        return identity.name;
      }
    }
    return undefined;
  };

  // Convert Lifestyle to NewLifestyleState for the modal
  const lifestyleToFormState = (ls: Lifestyle): NewLifestyleState => ({
    type: ls.type,
    location: ls.location || "",
    customExpenses: ls.customExpenses || 0,
    customIncome: ls.customIncome || 0,
    notes: ls.notes || "",
    modifications: ls.modifications || [],
    subscriptions: ls.subscriptions || [],
    prepaidMonths: ls.prepaidMonths || 0,
  });

  // Convert NewLifestyleState back to Lifestyle
  const formStateToLifestyle = (form: NewLifestyleState, existing?: Lifestyle): Lifestyle => {
    const lifestyleType = LIFESTYLE_TYPES.find((lt) => lt.id === form.type);
    return {
      ...(existing || {}),
      type: form.type,
      monthlyCost: lifestyleType?.monthlyCost || 0,
      location: form.location || undefined,
      customExpenses: form.customExpenses || undefined,
      customIncome: form.customIncome || undefined,
      notes: form.notes || undefined,
      modifications: form.modifications.length > 0 ? form.modifications : undefined,
      subscriptions: (form.subscriptions || []).length > 0 ? form.subscriptions : undefined,
      prepaidMonths: (form.prepaidMonths ?? 0) > 0 ? form.prepaidMonths : undefined,
    };
  };

  const handleAdd = (formState: NewLifestyleState) => {
    if (!onCharacterUpdate) return;
    const newLifestyle = formStateToLifestyle(formState);
    onCharacterUpdate({
      ...character,
      lifestyles: [...lifestyles, newLifestyle],
    });
    setModalOpen(false);
  };

  const handleEdit = (formState: NewLifestyleState) => {
    if (!onCharacterUpdate || editIndex === null) return;
    const updated = formStateToLifestyle(formState, lifestyles[editIndex]);
    onCharacterUpdate({
      ...character,
      lifestyles: lifestyles.map((ls, i) => (i === editIndex ? updated : ls)),
    });
    setEditIndex(null);
  };

  const handleRemove = (index: number) => {
    if (!onCharacterUpdate) return;
    onCharacterUpdate({
      ...character,
      lifestyles: lifestyles.filter((_, i) => i !== index),
    });
  };

  const handlePayMonth = async (index: number) => {
    if (!onCharacterUpdate) return;
    const lifestyle = lifestyles[index];
    const prepaid = lifestyle.prepaidMonths ?? 0;

    if (prepaid > 0) {
      // Decrement prepaid months locally
      onCharacterUpdate({
        ...character,
        lifestyles: lifestyles.map((ls, i) =>
          i === index ? { ...ls, prepaidMonths: prepaid - 1 } : ls
        ),
      });
    } else {
      // Deduct nuyen via gameplay API
      const cost = calculateLifestyleMonthlyCost(lifestyle);
      if (character.nuyen < cost) return;

      try {
        const res = await fetch(`/api/characters/${character.id}/gameplay`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "spendNuyen",
            amount: cost,
            reason: `Lifestyle payment: ${getTierName(lifestyle.type)}`,
          }),
        });
        const data = await res.json();
        if (data.success && data.character) {
          onCharacterUpdate(data.character);
        }
      } catch {
        // Silently fail — user can retry
      }
    }
  };

  const isEditable = editable && character.status === "active" && !!onCharacterUpdate;

  const headerAction = isEditable ? (
    <button
      type="button"
      onClick={() => {
        setEditIndex(null);
        setModalOpen(true);
      }}
      className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
    >
      <Plus className="h-3 w-3" />
      Add
    </button>
  ) : undefined;

  // Summary for collapsed state
  const collapsedSummary =
    lifestyles.length > 0 ? (
      <span className="text-xs text-zinc-500 dark:text-zinc-400">
        {lifestyles.length} lifestyle{lifestyles.length !== 1 ? "s" : ""} — ¥
        {totalMonthlyCost.toLocaleString()}/mo
      </span>
    ) : undefined;

  return (
    <div data-testid="sheet-lifestyles">
      <DisplayCard
        id="sheet-lifestyles"
        title="Lifestyles"
        icon={<Home className="h-4 w-4" />}
        headerAction={headerAction}
        collapsible
        collapsedSummary={collapsedSummary}
      >
        {/* Header summary */}
        {lifestyles.length > 0 && (
          <div className="mb-2 flex items-center gap-2 px-3">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Total monthly:</span>
            <span className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              ¥{totalMonthlyCost.toLocaleString()}/mo
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">|</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Balance:</span>
            <span
              className={`rounded border px-1.5 py-0.5 font-mono text-xs font-medium ${
                isLowFunds
                  ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                  : "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              ¥{character.nuyen.toLocaleString()}
            </span>
          </div>
        )}

        {/* Low funds warning */}
        {isLowFunds && lifestyles.length > 0 && (
          <div className="mx-3 mb-2 flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 dark:border-amber-700 dark:bg-amber-900/20">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span className="text-xs text-amber-700 dark:text-amber-300">
              Insufficient nuyen for monthly lifestyle costs (need ¥
              {totalMonthlyCost.toLocaleString()}, have ¥{character.nuyen.toLocaleString()})
            </span>
          </div>
        )}

        {/* Lifestyle rows */}
        {lifestyles.length > 0 ? (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {lifestyles.map((lifestyle, index) => (
              <LifestyleRow
                key={lifestyle.id || index}
                lifestyle={lifestyle}
                index={index}
                isExpanded={expandedRows.has(index)}
                onToggle={() => toggleRow(index)}
                identityName={getIdentityName(lifestyle.associatedIdentityId)}
                editable={isEditable}
                onEdit={() => {
                  setEditIndex(index);
                  setModalOpen(true);
                }}
                onRemove={() => handleRemove(index)}
                onPayMonth={() => handlePayMonth(index)}
              />
            ))}
          </div>
        ) : (
          <p className="px-3 py-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
            No lifestyles configured. {isEditable ? 'Click "Add" to add a lifestyle.' : ""}
          </p>
        )}
      </DisplayCard>

      {/* Add/Edit Modal */}
      <LifestyleModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditIndex(null);
        }}
        onSave={editIndex !== null ? handleEdit : handleAdd}
        nuyenRemaining={character.nuyen}
        initialData={editIndex !== null ? lifestyleToFormState(lifestyles[editIndex]) : undefined}
        isEditMode={editIndex !== null}
      />
    </div>
  );
}
