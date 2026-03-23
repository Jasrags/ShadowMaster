"use client";

import { useState, useMemo } from "react";
import { Button, Dialog, DialogTrigger, Modal } from "react-aria-components";
import { Minus, Plus } from "lucide-react";
import type { LifestyleEntertainmentOption } from "@/lib/types";
import {
  useEntertainmentOptions,
  type EntertainmentOptionCatalogItem,
} from "@/lib/rules/RulesetContext";
import { meetsMinimumLifestyle } from "@/lib/rules/lifestyle/validation";

interface EntertainmentOptionSelectorProps {
  lifestyleId: string;
  selectedOptions: LifestyleEntertainmentOption[];
  onUpdate: (options: LifestyleEntertainmentOption[]) => void;
}

function TypeBadge({ type }: { type: "asset" | "service" | "outing" }) {
  const colors: Record<string, string> = {
    asset: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    service: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
    outing: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  };
  return (
    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${colors[type]}`}>
      {type}
    </span>
  );
}

export function EntertainmentOptionSelector({
  lifestyleId,
  selectedOptions,
  onUpdate,
}: EntertainmentOptionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "asset" | "service" | "outing">("all");
  const catalogOptions = useEntertainmentOptions();

  const availableOptions = useMemo(() => {
    return catalogOptions.filter((opt) => {
      if (!meetsMinimumLifestyle(lifestyleId, opt.minLifestyle)) return false;
      if (filter !== "all" && opt.type !== filter) return false;
      return true;
    });
  }, [catalogOptions, lifestyleId, filter]);

  const getQuantity = (catalogId: string): number => {
    return selectedOptions.find((o) => o.catalogId === catalogId)?.quantity ?? 0;
  };

  const handleAdd = (item: EntertainmentOptionCatalogItem) => {
    const existing = selectedOptions.find((o) => o.catalogId === item.id);
    if (existing) {
      if (!item.purchasableMultipleTimes) return;
      onUpdate(
        selectedOptions.map((o) =>
          o.catalogId === item.id ? { ...o, quantity: o.quantity + 1 } : o
        )
      );
    } else {
      onUpdate([...selectedOptions, { catalogId: item.id, name: item.name, quantity: 1 }]);
    }
  };

  const handleRemove = (catalogId: string) => {
    const existing = selectedOptions.find((o) => o.catalogId === catalogId);
    if (!existing) return;
    if (existing.quantity <= 1) {
      onUpdate(selectedOptions.filter((o) => o.catalogId !== catalogId));
    } else {
      onUpdate(
        selectedOptions.map((o) =>
          o.catalogId === catalogId ? { ...o, quantity: o.quantity - 1 } : o
        )
      );
    }
  };

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button className="rounded bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700">
        + Add Entertainment
      </Button>
      <Modal className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <Dialog className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          {({ close }) => (
            <>
              <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Entertainment Options
              </h3>

              {/* Type filter */}
              <div className="mb-4 flex gap-2">
                {(["all", "asset", "service", "outing"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFilter(t)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      filter === t
                        ? "bg-amber-500 text-white"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              {availableOptions.length === 0 ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  No entertainment options available for this lifestyle tier.
                </p>
              ) : (
                <div className="space-y-2">
                  {availableOptions.map((item) => {
                    const qty = getQuantity(item.id);
                    const isSelected = qty > 0;
                    const canAddMore = item.purchasableMultipleTimes || qty === 0;

                    return (
                      <div
                        key={item.id}
                        className={`rounded-md border p-3 ${
                          isSelected
                            ? "border-amber-400 bg-amber-50/50 dark:border-amber-600 dark:bg-amber-900/10"
                            : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-zinc-900 dark:text-zinc-50">
                                {item.name}
                              </span>
                              <TypeBadge type={item.type} />
                              <span className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                                {item.points}pt
                              </span>
                              <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                                ¥{item.monthlyCost.toLocaleString()}/mo
                              </span>
                            </div>
                            {item.description && (
                              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                {item.description}
                              </p>
                            )}
                          </div>

                          {/* Quantity controls */}
                          <div className="ml-3 flex items-center gap-1.5">
                            {isSelected && (
                              <button
                                type="button"
                                onClick={() => handleRemove(item.id)}
                                className="rounded border border-zinc-300 p-1 text-zinc-500 hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                            )}
                            {isSelected && (
                              <span className="min-w-[1.5rem] text-center text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                {qty}
                              </span>
                            )}
                            {canAddMore && (
                              <button
                                type="button"
                                onClick={() => handleAdd(item)}
                                className="rounded border border-zinc-300 p-1 text-zinc-500 hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button
                  onPress={close}
                  className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  Done
                </Button>
              </div>
            </>
          )}
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}
