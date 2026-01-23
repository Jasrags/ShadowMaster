"use client";

import { useState, useCallback, useMemo } from "react";
import { X } from "lucide-react";
import type { LifestyleModification, LifestyleSubscription } from "@/lib/types";
import { LifestyleModificationSelector } from "../shared/LifestyleModificationSelector";
import { LifestyleSubscriptionSelector } from "../shared/LifestyleSubscriptionSelector";
import { Modal } from "./Modal";
import { LIFESTYLE_TYPES } from "./constants";
import type { LifestyleModalProps, NewLifestyleState } from "./types";

export function LifestyleModal({
  isOpen,
  onClose,
  onSave,
  nuyenRemaining,
  initialData,
  isEditMode,
}: LifestyleModalProps) {
  const defaultFormState: NewLifestyleState = {
    type: "",
    location: "",
    customExpenses: 0,
    customIncome: 0,
    notes: "",
    modifications: [],
    subscriptions: [],
  };

  const [formState, setFormState] = useState<NewLifestyleState>(initialData || defaultFormState);

  // Reset form when modal opens with initialData (for edit mode)
  const resetFormOnOpen = useCallback(() => {
    if (isOpen && initialData) {
      setFormState(initialData);
    } else if (isOpen && !initialData) {
      setFormState(defaultFormState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialData]);

  // Use effect to reset form when modal opens
  useMemo(() => {
    resetFormOnOpen();
  }, [resetFormOnOpen]);

  const selectedLifestyle = LIFESTYLE_TYPES.find((l) => l.id === formState.type);

  // Calculate total cost including modifications and subscriptions
  const baseCost = selectedLifestyle?.monthlyCost || 0;
  const modificationsCost = formState.modifications.reduce((sum, mod) => {
    if (mod.modifierType === "percentage") {
      return sum + ((baseCost * mod.modifier) / 100) * (mod.type === "positive" ? 1 : -1);
    }
    return sum + mod.modifier * (mod.type === "positive" ? 1 : -1);
  }, 0);
  const subscriptionsCost = formState.subscriptions.reduce((sum, sub) => sum + sub.monthlyCost, 0);
  const totalCost = Math.max(0, baseCost + modificationsCost + subscriptionsCost);

  const canAfford = totalCost <= nuyenRemaining;
  const canSave = formState.type && canAfford;

  // Add modification handler
  const handleAddModification = (mod: LifestyleModification) => {
    setFormState({
      ...formState,
      modifications: [...formState.modifications, mod],
    });
  };

  // Remove modification handler
  const handleRemoveModification = (index: number) => {
    setFormState({
      ...formState,
      modifications: formState.modifications.filter((_, i) => i !== index),
    });
  };

  // Add subscription handler
  const handleAddSubscription = (sub: LifestyleSubscription) => {
    setFormState({
      ...formState,
      subscriptions: [...formState.subscriptions, sub],
    });
  };

  // Remove subscription handler
  const handleRemoveSubscription = (index: number) => {
    setFormState({
      ...formState,
      subscriptions: formState.subscriptions.filter((_, i) => i !== index),
    });
  };

  const handleSave = () => {
    if (canSave) {
      onSave(formState);
      setFormState({
        type: "",
        location: "",
        customExpenses: 0,
        customIncome: 0,
        notes: "",
        modifications: [],
        subscriptions: [],
      });
      onClose();
    }
  };

  const handleClose = () => {
    setFormState({
      type: "",
      location: "",
      customExpenses: 0,
      customIncome: 0,
      notes: "",
      modifications: [],
      subscriptions: [],
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Lifestyle" : "New Lifestyle"}
    >
      <div className="space-y-5">
        {/* Lifestyle Type */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Lifestyle Type *
          </label>
          <select
            value={formState.type}
            onChange={(e) => setFormState({ ...formState, type: e.target.value })}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          >
            <option value="">Select a lifestyle...</option>
            {LIFESTYLE_TYPES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.monthlyCost === 0 ? "Free" : `${l.monthlyCost.toLocaleString()}/month`}
                )
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Location (Optional)
          </label>
          <input
            type="text"
            value={formState.location}
            onChange={(e) => setFormState({ ...formState, location: e.target.value })}
            placeholder="e.g., Downtown Seattle, Redmond Barrens"
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        {/* Modifications */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Modifications
            </label>
            <LifestyleModificationSelector
              onAdd={handleAddModification}
              existingModifications={formState.modifications}
            />
          </div>
          {formState.modifications.length > 0 ? (
            <div className="space-y-2">
              {formState.modifications.map((mod, index) => (
                <div
                  key={mod.catalogId || index}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-900 dark:text-zinc-100">{mod.name}</span>
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
                        : `${mod.modifier.toLocaleString()}`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveModification(index)}
                    className="text-zinc-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              No modifications added. Click &quot;+ Add Modification&quot; to add lifestyle
              modifications.
            </p>
          )}
        </div>

        {/* Subscriptions */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Subscriptions
            </label>
            <LifestyleSubscriptionSelector
              onAdd={handleAddSubscription}
              existingSubscriptions={formState.subscriptions}
            />
          </div>
          {formState.subscriptions.length > 0 ? (
            <div className="space-y-2">
              {formState.subscriptions.map((sub, index) => (
                <div
                  key={sub.catalogId || index}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-900 dark:text-zinc-100">{sub.name}</span>
                    {sub.category && (
                      <span className="rounded-full bg-zinc-200 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                        {sub.category}
                      </span>
                    )}
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {sub.monthlyCost.toLocaleString()}/mo
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubscription(index)}
                    className="text-zinc-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              No subscriptions added. Click &quot;+ Add Subscription&quot; to add services like
              DocWagon contracts.
            </p>
          )}
        </div>

        {/* Custom Expenses / Income */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Custom Expenses (/month)
            </label>
            <input
              type="number"
              min="0"
              value={formState.customExpenses}
              onChange={(e) =>
                setFormState({ ...formState, customExpenses: parseInt(e.target.value) || 0 })
              }
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Custom Income (/month)
            </label>
            <input
              type="number"
              min="0"
              value={formState.customIncome}
              onChange={(e) =>
                setFormState({ ...formState, customIncome: parseInt(e.target.value) || 0 })
              }
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Notes (Optional)
          </label>
          <textarea
            value={formState.notes}
            onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
            placeholder="Additional notes about this lifestyle..."
            rows={2}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        {/* Cost Summary */}
        {formState.type && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
            <div className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Monthly Cost Summary
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Base ({selectedLifestyle?.name})</span>
                <span>{baseCost.toLocaleString()}</span>
              </div>
              {modificationsCost !== 0 && (
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Modifications</span>
                  <span
                    className={
                      modificationsCost > 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }
                  >
                    {modificationsCost > 0 ? "+" : ""}
                    {modificationsCost.toLocaleString()}
                  </span>
                </div>
              )}
              {subscriptionsCost > 0 && (
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Subscriptions</span>
                  <span>+{subscriptionsCost.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-zinc-200 pt-1 font-medium text-zinc-900 dark:border-zinc-700 dark:text-zinc-100">
                <span>Total</span>
                <span className={!canAfford ? "text-red-600 dark:text-red-400" : ""}>
                  {totalCost.toLocaleString()}/month
                </span>
              </div>
              {!canAfford && (
                <div className="mt-1 text-xs text-red-600 dark:text-red-400">
                  Exceeds available budget ({nuyenRemaining.toLocaleString()} remaining)
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={handleClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              canSave
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
            }`}
          >
            {isEditMode ? "Save Changes" : "Save Lifestyle"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
