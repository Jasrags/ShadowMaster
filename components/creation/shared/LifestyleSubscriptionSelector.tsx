"use client";

import { useState, useMemo } from "react";
import { Button, Dialog, DialogTrigger, Modal } from "react-aria-components";
import type { LifestyleSubscription } from "@/lib/types";
import { useLifestyleSubscriptions } from "@/lib/rules/RulesetContext";

interface LifestyleSubscriptionSelectorProps {
  onAdd: (subscription: LifestyleSubscription) => void;
  existingSubscriptions: LifestyleSubscription[];
}

export function LifestyleSubscriptionSelector({
  onAdd,
  existingSubscriptions,
}: LifestyleSubscriptionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(1);

  const availableSubscriptions = useLifestyleSubscriptions();

  const filteredSubscriptions = useMemo(() => {
    return availableSubscriptions.filter(
      (sub) => !existingSubscriptions.some((existing) => existing.catalogId === sub.id)
    );
  }, [availableSubscriptions, existingSubscriptions]);

  const selectedSubData = useMemo(() => {
    return selectedSubscription
      ? filteredSubscriptions.find((sub) => sub.id === selectedSubscription)
      : null;
  }, [selectedSubscription, filteredSubscriptions]);

  const handleSelect = () => {
    if (!selectedSubData) return;

    let monthlyCost = 0;

    // Handle cost per rating (e.g., Food Service)
    if (selectedSubData.costPerRating && selectedSubData.monthlyCost) {
      monthlyCost = selectedSubData.monthlyCost * rating;
    } else if (selectedSubData.monthlyCost) {
      // Use monthly cost directly (already calculated from yearly if needed)
      monthlyCost = selectedSubData.monthlyCost;
    } else if (selectedSubData.yearlyCost) {
      // Fallback: convert yearly to monthly
      monthlyCost = selectedSubData.yearlyCost / 12;
    }

    const subscription: LifestyleSubscription = {
      catalogId: selectedSubData.id,
      name: selectedSubData.name,
      monthlyCost,
      category: selectedSubData.category,
    };

    onAdd(subscription);
    setIsOpen(false);
    setSelectedSubscription(null);
    setRating(1);
  };

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button className="rounded px-2.5 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700">
        + Add Subscription
      </Button>
      <Modal className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <Dialog className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          {({ close }) => (
            <>
              <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Select Lifestyle Subscription
              </h3>

              {filteredSubscriptions.length === 0 ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  All available subscriptions have been added.
                </p>
              ) : (
                <>
                  <div className="space-y-2 mb-4">
                    {filteredSubscriptions.map((sub) => {
                      const isSelected = selectedSubscription === sub.id;
                      const displayCost = sub.costPerRating
                        ? `Rating × ${sub.monthlyCost?.toLocaleString() || 0}¥/month`
                        : sub.yearlyCost
                          ? `${sub.yearlyCost.toLocaleString()}¥/year (${(sub.yearlyCost / 12).toFixed(2)}¥/month)`
                          : `${sub.monthlyCost?.toLocaleString() || 0}¥/month`;

                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => setSelectedSubscription(sub.id)}
                          className={`w-full rounded-md border p-4 text-left transition-colors ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20"
                              : "border-zinc-200 bg-white hover:border-blue-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-500"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-zinc-900 dark:text-zinc-50">
                                  {sub.name}
                                </h4>
                                {sub.category && (
                                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                    {sub.category}
                                  </span>
                                )}
                              </div>
                              {sub.description && (
                                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                                  {sub.description}
                                </p>
                              )}
                              <div className="mt-2 text-sm">
                                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                                  Cost:{" "}
                                </span>
                                <span className="text-zinc-900 dark:text-zinc-50">
                                  {displayCost}
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {selectedSubData && selectedSubData.costPerRating && (
                    <div className="mb-4 rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Rating ({selectedSubData.minRating || 1} - {selectedSubData.maxRating || 6})
                      </label>
                      <input
                        type="number"
                        value={rating}
                        onChange={(e) => {
                          const value = Math.max(
                            selectedSubData.minRating || 1,
                            Math.min(
                              selectedSubData.maxRating || 6,
                              Number.parseInt(e.target.value) || 1
                            )
                          );
                          setRating(value);
                        }}
                        min={selectedSubData.minRating || 1}
                        max={selectedSubData.maxRating || 6}
                        className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                      />
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        Monthly cost:{" "}
                        {((selectedSubData.monthlyCost || 0) * rating).toLocaleString()}¥
                      </p>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end gap-2">
                    <Button
                      onPress={close}
                      className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onPress={handleSelect}
                      isDisabled={!selectedSubscription}
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      Add Subscription
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}
