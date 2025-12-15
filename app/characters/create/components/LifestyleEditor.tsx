"use client";

import { useState, useMemo } from "react";
import { Button } from "react-aria-components";
import type { Lifestyle, LifestyleModification, LifestyleSubscription } from "@/lib/types";
import { LifestyleModificationSelector } from "./LifestyleModificationSelector";

interface LifestyleEditorProps {
  lifestyle: Lifestyle;
  availableLifestyles: Array<{ id: string; name: string; monthlyCost: number }>;
  lifestyleModifier: number; // Metatype modifier (e.g., 1.2 for Dwarf, 2.0 for Troll)
  onSave: (lifestyle: Lifestyle) => void;
  onCancel: () => void;
}

export function LifestyleEditor({
  lifestyle,
  availableLifestyles,
  lifestyleModifier,
  onSave,
  onCancel,
}: LifestyleEditorProps) {
  const [lifestyleType, setLifestyleType] = useState(lifestyle.type || "");
  const [location, setLocation] = useState(lifestyle.location || "");
  const [modifications, setModifications] = useState<LifestyleModification[]>(
    lifestyle.modifications || []
  );
  
  // Check if permanent modification exists (for cost calculation display)
  const hasPermanentModification = useMemo(() => {
    return modifications.some((mod) => mod.catalogId === "permanent-lifestyle" || mod.name.toLowerCase() === "permanent lifestyle");
  }, [modifications]);
  const [subscriptions, setSubscriptions] = useState<LifestyleSubscription[]>(
    lifestyle.subscriptions || []
  );
  const [customExpenses, setCustomExpenses] = useState<number>(lifestyle.customExpenses || 0);
  const [customIncome, setCustomIncome] = useState<number>(lifestyle.customIncome || 0);
  const [notes, setNotes] = useState(lifestyle.notes || "");

  // Get base monthly cost from selected lifestyle type
  const baseMonthlyCost = useMemo(() => {
    const selected = availableLifestyles.find((l) => l.id === lifestyleType || l.name === lifestyleType);
    return selected?.monthlyCost || 0;
  }, [lifestyleType, availableLifestyles]);

  // Calculate final monthly cost with modifications
  const calculatedMonthlyCost = useMemo(() => {
    let cost = baseMonthlyCost * lifestyleModifier;

    // Apply modifications
    modifications.forEach((mod) => {
      if (mod.modifierType === "percentage") {
        cost = cost * (1 + (mod.type === "positive" ? 1 : -1) * (mod.modifier / 100));
      } else {
        // Fixed cost modifier
        cost = cost + (mod.type === "positive" ? 1 : -1) * mod.modifier;
      }
    });

    // Add subscriptions
    const subscriptionCost = subscriptions.reduce((sum, sub) => sum + sub.monthlyCost, 0);
    cost = cost + subscriptionCost;

    // Add custom expenses, subtract custom income
    cost = cost + customExpenses - customIncome;

    return Math.max(0, Math.floor(cost));
  }, [baseMonthlyCost, lifestyleModifier, modifications, subscriptions, customExpenses, customIncome]);

  // Calculate permanent purchase cost (100 × monthly cost)
  const permanentCost = useMemo(() => {
    return calculatedMonthlyCost * 100;
  }, [calculatedMonthlyCost]);

  // Validation
  const isValid = useMemo(() => {
    return lifestyleType !== "" && baseMonthlyCost > 0;
  }, [lifestyleType, baseMonthlyCost]);

  const handleSave = () => {
    const updatedLifestyle: Lifestyle = {
      id: lifestyle.id,
      type: lifestyleType,
      monthlyCost: calculatedMonthlyCost,
      location: location.trim() || undefined,
      modifications: modifications.length > 0 ? modifications : undefined,
      subscriptions: subscriptions.length > 0 ? subscriptions : undefined,
      customExpenses: customExpenses > 0 ? customExpenses : undefined,
      customIncome: customIncome > 0 ? customIncome : undefined,
      notes: notes.trim() || undefined,
    };

    onSave(updatedLifestyle);
  };

  const handleAddModification = (modification: LifestyleModification) => {
    setModifications([...modifications, modification]);
  };

  const handleRemoveModification = (index: number) => {
    setModifications(modifications.filter((_, i) => i !== index));
  };

  const handleAddSubscription = (subscription: LifestyleSubscription) => {
    setSubscriptions([...subscriptions, subscription]);
  };

  const handleRemoveSubscription = (index: number) => {
    setSubscriptions(subscriptions.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {lifestyle.id ? "Edit Lifestyle" : "New Lifestyle"}
        </h3>

        {/* Lifestyle Type Selection */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Lifestyle Type *
          </label>
          <select
            value={lifestyleType}
            onChange={(e) => setLifestyleType(e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          >
            <option value="">Select a lifestyle...</option>
            {availableLifestyles.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.monthlyCost.toLocaleString()}¥/month)
              </option>
            ))}
          </select>
        </div>


        {/* Location */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Location (Optional)
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Downtown Seattle, Redmond Barrens"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>

        {/* Cost Summary */}
        {baseMonthlyCost > 0 && (
          <div className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h4 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Cost Calculation
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Base Cost:</span>
                <span className="text-zinc-900 dark:text-zinc-50">
                  {baseMonthlyCost.toLocaleString()}¥
                </span>
              </div>
              {lifestyleModifier !== 1 && (
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Metatype Modifier ({lifestyleModifier}×):
                  </span>
                  <span className="text-zinc-900 dark:text-zinc-50">
                    {(baseMonthlyCost * lifestyleModifier).toLocaleString()}¥
                  </span>
                </div>
              )}
              {modifications.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Modifications:</span>
                  <span className="text-zinc-900 dark:text-zinc-50">
                    {modifications.length} applied
                  </span>
                </div>
              )}
              {subscriptions.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Subscriptions:</span>
                  <span className="text-zinc-900 dark:text-zinc-50">
                    +{subscriptions.reduce((sum, s) => sum + s.monthlyCost, 0).toLocaleString()}¥
                  </span>
                </div>
              )}
              {(customExpenses > 0 || customIncome > 0) && (
                <>
                  {customExpenses > 0 && (
                    <div className="flex justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">Custom Expenses:</span>
                      <span className="text-zinc-900 dark:text-zinc-50">
                        +{customExpenses.toLocaleString()}¥
                      </span>
                    </div>
                  )}
                  {customIncome > 0 && (
                    <div className="flex justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">Custom Income:</span>
                      <span className="text-zinc-900 dark:text-zinc-50">
                        -{customIncome.toLocaleString()}¥
                      </span>
                    </div>
                  )}
                </>
              )}
              <div className="mt-2 border-t border-zinc-300 pt-2 dark:border-zinc-700">
                <div className="flex justify-between font-semibold">
                  <span className="text-zinc-900 dark:text-zinc-50">Final Monthly Cost:</span>
                  <span className="text-zinc-900 dark:text-zinc-50">
                    {calculatedMonthlyCost.toLocaleString()}¥
                  </span>
                </div>
                {hasPermanentModification && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Permanent Cost:</span>
                    <span className="text-zinc-900 dark:text-zinc-50">
                      {permanentCost.toLocaleString()}¥
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modifications Section */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Modifications
            </label>
            <LifestyleModificationSelector
              onAdd={handleAddModification}
              existingModifications={modifications}
            />
          </div>
          {modifications.length > 0 ? (
            <div className="space-y-2">
              {modifications.map((mod, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {mod.name}
                    </div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">
                      {mod.modifier !== 0 && (
                        <>
                          {mod.type === "positive" ? "+" : "-"}
                          {mod.modifierType === "percentage" ? `${mod.modifier}%` : `${mod.modifier.toLocaleString()}¥`}
                          {mod.effects && " • "}
                        </>
                      )}
                      {mod.effects || (mod.modifier === 0 && mod.name.toLowerCase() === "permanent lifestyle" && "Permanent purchase (100 × monthly cost)")}
                    </div>
                  </div>
                  <Button
                    onPress={() => handleRemoveModification(index)}
                    className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              No modifications added. Click &quot;Add Modification&quot; to add lifestyle modifications.
            </p>
          )}
        </div>

        {/* Subscriptions Section */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Subscriptions
            </label>
            <Button
              onPress={() => {
                // For now, create a simple subscription editor inline
                // In a full implementation, this would open a subscription selector
                const name = prompt("Subscription name:");
                if (name) {
                  const cost = Number.parseFloat(prompt("Monthly cost (¥):") || "0");
                  if (cost > 0) {
                    handleAddSubscription({
                      name: name.trim(),
                      monthlyCost: cost,
                    });
                  }
                }
              }}
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              + Add Subscription
            </Button>
          </div>
          {subscriptions.length > 0 ? (
            <div className="space-y-2">
              {subscriptions.map((sub, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {sub.name}
                    </div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">
                      {sub.monthlyCost.toLocaleString()}¥/month
                      {sub.category && ` • ${sub.category}`}
                    </div>
                  </div>
                  <Button
                    onPress={() => handleRemoveSubscription(index)}
                    className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              No subscriptions added. Click &quot;Add Subscription&quot; to add services like DocWagon contracts.
            </p>
          )}
        </div>

        {/* Custom Expenses/Income */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Custom Expenses (¥/month)
            </label>
            <input
              type="number"
              value={customExpenses}
              onChange={(e) => setCustomExpenses(Math.max(0, Number.parseFloat(e.target.value) || 0))}
              placeholder="0"
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Custom Income (¥/month)
            </label>
            <input
              type="number"
              value={customIncome}
              onChange={(e) => setCustomIncome(Math.max(0, Number.parseFloat(e.target.value) || 0))}
              placeholder="0"
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Notes (Optional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes about this lifestyle..."
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            onPress={onCancel}
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            Cancel
          </Button>
          <Button
            onPress={handleSave}
            isDisabled={!isValid}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Save Lifestyle
          </Button>
        </div>
      </div>
    </div>
  );
}
