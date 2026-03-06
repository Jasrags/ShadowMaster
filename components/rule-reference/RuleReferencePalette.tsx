"use client";

import { useRuleReferenceContext } from "@/lib/contexts/RuleReferenceContext";
import { BaseModalRoot, ModalHeader, ModalBody } from "@/components/ui/BaseModal";
import { useRuleReference } from "./useRuleReference";
import { RuleReferenceSearch } from "./RuleReferenceSearch";
import { RuleReferenceCategoryTabs } from "./RuleReferenceCategoryTabs";
import { RuleReferenceList } from "./RuleReferenceList";
import { RuleReferenceCard } from "./RuleReferenceCard";

export function RuleReferencePalette() {
  const { isOpen, close, defaultCategory } = useRuleReferenceContext();
  const {
    filteredEntries,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedEntry,
    setSelectedEntry,
    isLoading,
    error,
    categories,
  } = useRuleReference(defaultCategory);

  if (!isOpen) return null;

  return (
    <BaseModalRoot isOpen={isOpen} onClose={close} size="2xl" zIndex={60}>
      {({ close: modalClose }) => (
        <>
          <ModalHeader title="Rule Quick-Reference" onClose={modalClose} />
          <ModalBody className="flex min-h-0 flex-col p-0">
            {/* Search + Filters */}
            <div className="space-y-3 border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
              <RuleReferenceSearch value={searchQuery} onChange={setSearchQuery} />
              <RuleReferenceCategoryTabs
                categories={categories}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />
            </div>

            {/* Content area */}
            <div className="flex min-h-0 flex-1">
              {isLoading ? (
                <div className="flex w-full items-center justify-center py-12">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                </div>
              ) : error ? (
                <div className="flex w-full items-center justify-center py-12 text-sm text-red-500">
                  {error}
                </div>
              ) : (
                <>
                  {/* Entry list */}
                  <div className="w-2/5 shrink-0 overflow-y-auto border-r border-zinc-200 p-2 dark:border-zinc-700">
                    <RuleReferenceList
                      entries={filteredEntries}
                      selectedEntry={selectedEntry}
                      onSelect={setSelectedEntry}
                    />
                  </div>

                  {/* Detail view */}
                  <div className="flex-1 overflow-y-auto p-6">
                    {selectedEntry ? (
                      <RuleReferenceCard entry={selectedEntry} />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-zinc-400 dark:text-zinc-500">
                        Select a rule to view details
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Footer hint */}
            <div className="border-t border-zinc-200 px-6 py-2 dark:border-zinc-700">
              <p className="text-xs text-zinc-400 dark:text-zinc-600">
                <kbd className="rounded border border-zinc-300 px-1 py-0.5 font-mono text-[10px] dark:border-zinc-600">
                  Cmd+/
                </kbd>{" "}
                to toggle &middot;{" "}
                <kbd className="rounded border border-zinc-300 px-1 py-0.5 font-mono text-[10px] dark:border-zinc-600">
                  Esc
                </kbd>{" "}
                to close &middot;{" "}
                <kbd className="rounded border border-zinc-300 px-1 py-0.5 font-mono text-[10px] dark:border-zinc-600">
                  &uarr;&darr;
                </kbd>{" "}
                to navigate
              </p>
            </div>
          </ModalBody>
        </>
      )}
    </BaseModalRoot>
  );
}
