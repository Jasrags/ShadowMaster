"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { Check, Search } from "lucide-react";
import { Heading } from "react-aria-components";
import { BaseModalRoot, ModalFooter } from "@/components/ui/BaseModal";
import { METATYPE_DESCRIPTIONS } from "./constants";
import type { MetatypeModalProps, MetatypeOption } from "./types";
import { isShapeshifterMetatype } from "@/lib/rules/shapeshifter";

/** Group label for base metatypes and metasapients */
const BASE_METATYPE_LABELS: Record<string, string> = {
  human: "Human",
  elf: "Elf",
  dwarf: "Dwarf",
  ork: "Ork",
  troll: "Troll",
};

/** Filter pill options */
const FILTER_OPTIONS = [
  { id: "all", label: "All" },
  { id: "human", label: "Human" },
  { id: "elf", label: "Elf" },
  { id: "dwarf", label: "Dwarf" },
  { id: "ork", label: "Ork" },
  { id: "troll", label: "Troll" },
  { id: "shapeshifter", label: "Shapeshifter" },
  { id: "sapient", label: "Sapient" },
] as const;

interface MetatypeGroup {
  readonly id: string;
  readonly label: string;
  readonly metatypes: readonly MetatypeOption[];
}

/** Standard human attribute range — attributes exceeding max 6 are highlighted */
const STANDARD_MAX = 6;

/** Attribute display abbreviations */
const ATTRIBUTE_ABBREVS: Record<string, string> = {
  body: "BOD",
  agility: "AGI",
  reaction: "REA",
  strength: "STR",
  willpower: "WIL",
  logic: "LOG",
  intuition: "INT",
  charisma: "CHA",
  edge: "EDG",
  magic: "MAG",
  resonance: "RES",
};

/** Group metatypes: base types first, then variants nested under parent, then shapeshifters, then metasapients */
function groupMetatypes(metatypes: readonly MetatypeOption[]): readonly MetatypeGroup[] {
  const baseTypes = metatypes.filter((m) => !m.baseMetatype);
  const variants = metatypes.filter((m) => !!m.baseMetatype);

  const groups: MetatypeGroup[] = [];

  for (const base of baseTypes) {
    const label = BASE_METATYPE_LABELS[base.id];
    if (label) {
      const children = variants.filter((v) => v.baseMetatype === base.id);
      groups.push({ id: base.id, label, metatypes: [base, ...children] });
    }
  }

  // Separate shapeshifters from other metasapients
  const shapeshifters = baseTypes.filter(
    (m) => !BASE_METATYPE_LABELS[m.id] && isShapeshifterMetatype(m.id)
  );
  if (shapeshifters.length > 0) {
    groups.push({ id: "shapeshifter", label: "Shapeshifters", metatypes: shapeshifters });
  }

  const metasapients = baseTypes.filter(
    (m) => !BASE_METATYPE_LABELS[m.id] && !isShapeshifterMetatype(m.id)
  );
  if (metasapients.length > 0) {
    groups.push({ id: "sapient", label: "Metasapients", metatypes: metasapients });
  }

  return groups;
}

/** Get the group id a metatype belongs to (for filtering) */
function getMetatypeGroupId(metatype: MetatypeOption): string {
  if (!metatype.baseMetatype && isShapeshifterMetatype(metatype.id)) {
    return "shapeshifter";
  }
  if (!metatype.baseMetatype && !BASE_METATYPE_LABELS[metatype.id]) {
    return "sapient";
  }
  return metatype.baseMetatype || metatype.id;
}

/** Get the type badge for a metatype */
function getTypeBadge(metatype: MetatypeOption): { label: string; className: string } {
  if (!metatype.baseMetatype && BASE_METATYPE_LABELS[metatype.id]) {
    return {
      label: "Base",
      className: "bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300",
    };
  }
  if (metatype.baseMetatype) {
    const parentLabel = BASE_METATYPE_LABELS[metatype.baseMetatype] || metatype.baseMetatype;
    return {
      label: `${parentLabel} Variant`,
      className: "bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300",
    };
  }
  if (isShapeshifterMetatype(metatype.id)) {
    return {
      label: "Shapeshifter",
      className: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
    };
  }
  return {
    label: "Metasapient",
    className: "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300",
  };
}

// ─── Detail Panel ────────────────────────────────────────────────────────────

function MetatypeDetailPanel({
  metatype,
  priorityLevel,
}: {
  metatype: MetatypeOption | null;
  priorityLevel?: string;
}) {
  if (!metatype) {
    return (
      <div className="flex h-full items-center justify-center text-sm italic text-zinc-500">
        Select a metatype to see details
      </div>
    );
  }

  const description = METATYPE_DESCRIPTIONS[metatype.id] || metatype.description || "";
  const badge = getTypeBadge(metatype);
  const attrs = Object.entries(metatype.attributes);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h3 className="text-xl font-extrabold uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
          {metatype.name}
        </h3>
        <div className="mt-1.5 flex gap-1.5">
          <span
            className={`inline-flex rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${badge.className}`}
          >
            {badge.label}
          </span>
        </div>
      </div>

      {/* Cost chips */}
      <div className="flex flex-wrap gap-2">
        {metatype.karmaCost !== undefined && (
          <div className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900">
            <span className="text-zinc-500">Karma</span>
            <span
              className={`font-mono font-semibold ${metatype.karmaCost > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}
            >
              {metatype.karmaCost > 0 ? metatype.karmaCost : "+0"}
            </span>
          </div>
        )}
        <div className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900">
          <span className="text-zinc-500">SAP</span>
          <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-200">
            {metatype.specialAttributePoints}
          </span>
        </div>
      </div>

      {/* Shapeshifter info box */}
      {isShapeshifterMetatype(metatype.id) && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800/60 dark:bg-amber-900/20 dark:text-amber-300">
          <span className="font-semibold">Dual-Form:</span> Shapeshifters have a natural animal
          form and must select a metahuman form (Human, Dwarf, Elf, Ork, or Troll). They cannot
          be Technomancers.
        </div>
      )}

      {/* Description */}
      {description && (
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{description}</p>
      )}

      {/* Attributes */}
      <div>
        <div className="mb-2 border-b border-zinc-200 pb-1.5 text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:border-zinc-700">
          Attributes
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-3">
          {attrs.map(([name, range]) => {
            const abbrev = ATTRIBUTE_ABBREVS[name] || name.slice(0, 3).toUpperCase();
            const isAboveRange = range.max > STANDARD_MAX;
            return (
              <div
                key={name}
                className={`flex items-center justify-between rounded-md border px-3 py-2 ${
                  isAboveRange
                    ? "border-amber-300 bg-amber-50 dark:border-amber-800/60 dark:bg-zinc-900"
                    : "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900"
                }`}
              >
                <span
                  className={`text-xs font-semibold uppercase ${
                    isAboveRange ? "text-amber-600 dark:text-amber-400/80" : "text-zinc-500"
                  }`}
                >
                  {abbrev}
                </span>
                <span
                  className={`font-mono text-sm font-semibold ${
                    isAboveRange
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {range.min} / {range.max}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Racial Traits */}
      <div>
        <div className="mb-2 border-b border-zinc-200 pb-1.5 text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:border-zinc-700">
          Racial Traits
        </div>
        {metatype.racialTraits.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {metatype.racialTraits.map((trait) => (
              <span
                key={trait}
                className="inline-flex rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
              >
                {trait}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-sm text-zinc-500">None</span>
        )}
      </div>

      {/* Priority Availability (only for priority-based, not point buy) */}
      {metatype.priorityAvailability && priorityLevel && (
        <div>
          <div className="mb-2 border-b border-zinc-200 pb-1.5 text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:border-zinc-700">
            Priority Availability
          </div>
          <div className="flex gap-2">
            {["A", "B", "C", "D", "E"].map((level) => {
              const sap = metatype.priorityAvailability?.[level];
              const isCurrent = level === priorityLevel;
              const isUnavailable = sap === null || sap === undefined;
              return (
                <div
                  key={level}
                  className={`flex flex-1 flex-col items-center rounded-md border px-2 py-2 ${
                    isCurrent
                      ? "border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-900/30"
                      : isUnavailable
                        ? "border-zinc-200 bg-zinc-50 opacity-30 dark:border-zinc-800 dark:bg-zinc-900"
                        : "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900"
                  }`}
                >
                  <span
                    className={`text-[11px] font-bold uppercase ${
                      isCurrent ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-500"
                    }`}
                  >
                    {level}
                  </span>
                  <span
                    className={`font-mono text-base font-bold ${
                      isCurrent
                        ? "text-emerald-600 dark:text-emerald-300"
                        : isUnavailable
                          ? "text-zinc-400 dark:text-zinc-600"
                          : "text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {isUnavailable ? "-" : sap}
                  </span>
                  {!isUnavailable && (
                    <span className="text-[9px] uppercase text-zinc-400 dark:text-zinc-600">
                      SAP
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Modal ──────────────────────────────────────────────────────────────

export function MetatypeModal({
  isOpen,
  onClose,
  onConfirm,
  metatypes,
  priorityLevel,
  currentSelection,
}: MetatypeModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(currentSelection);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const groups = useMemo(() => groupMetatypes(metatypes), [metatypes]);

  // Reset state when modal opens with new data
  useEffect(() => {
    if (isOpen) {
      setSelectedId(currentSelection);
      setSearchQuery("");
      setActiveFilter("all");
    }
  }, [isOpen, currentSelection]);

  const handleConfirm = useCallback(() => {
    if (selectedId) {
      onConfirm(selectedId);
      onClose();
    }
  }, [selectedId, onConfirm, onClose]);

  // Filter metatypes by search + group filter
  const filteredGroups = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return groups
      .map((group) => {
        const filtered = group.metatypes.filter((m) => {
          const matchesSearch = !query || m.name.toLowerCase().includes(query);
          const matchesFilter = activeFilter === "all" || getMetatypeGroupId(m) === activeFilter;
          return matchesSearch && matchesFilter;
        });
        return { ...group, metatypes: filtered };
      })
      .filter((group) => group.metatypes.length > 0);
  }, [groups, searchQuery, activeFilter]);

  // Get the metatype for detail panel (selected or first available)
  const detailMetatype = useMemo(() => {
    if (selectedId) {
      return metatypes.find((m) => m.id === selectedId) ?? null;
    }
    return null;
  }, [selectedId, metatypes]);

  // Selected metatype data for footer preview
  const selectedMetatype = useMemo(() => {
    return selectedId ? metatypes.find((m) => m.id === selectedId) : null;
  }, [selectedId, metatypes]);

  return (
    <BaseModalRoot isOpen={isOpen} onClose={onClose} size="full">
      {({ close }) => (
        <>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
            <Heading
              slot="title"
              className="text-lg font-bold uppercase tracking-wide text-zinc-900 dark:text-zinc-100"
            >
              Select Metatype
            </Heading>
            <button
              onClick={close}
              aria-label="Close modal"
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* Toolbar: search + filter pills */}
          <div className="flex items-center gap-3 border-b border-zinc-200 bg-zinc-50 px-6 py-3 dark:border-zinc-700 dark:bg-zinc-800/50">
            {/* Search */}
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900">
              <Search className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search metatypes..."
                className="w-full bg-transparent text-sm text-zinc-900 placeholder-zinc-400 outline-none dark:text-zinc-200 dark:placeholder-zinc-600"
              />
            </div>

            {/* Filter pills */}
            <div className="hidden gap-1 sm:flex" data-testid="filter-pills">
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setActiveFilter(opt.id)}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition-colors ${
                    activeFilter === opt.id
                      ? "bg-emerald-600 text-white"
                      : "border border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Two-panel body */}
          <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
            {/* Left panel: browse list */}
            <div
              data-testid="metatype-list"
              className="max-h-[200px] w-full shrink-0 overflow-y-auto border-b border-zinc-200 bg-zinc-50 sm:max-h-none sm:w-60 sm:border-b-0 sm:border-r dark:border-zinc-700 dark:bg-zinc-800/30 [scrollbar-width:thin]"
            >
              {filteredGroups.length === 0 ? (
                <div className="p-4 text-center text-sm italic text-zinc-500">
                  No metatypes match
                </div>
              ) : (
                filteredGroups.map((group) => (
                  <div key={group.label}>
                    {/* Group header */}
                    <div className="sticky top-0 z-10 bg-zinc-100/80 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 backdrop-blur-sm dark:bg-zinc-800/80">
                      {group.label}
                      <span className="ml-1 font-normal text-zinc-400 dark:text-zinc-600">
                        ({group.metatypes.length})
                      </span>
                    </div>

                    {/* Metatype items */}
                    {group.metatypes.map((metatype) => {
                      const isSelected = selectedId === metatype.id;
                      const isVariant = !!metatype.baseMetatype;
                      return (
                        <button
                          key={metatype.id}
                          onClick={() => setSelectedId(metatype.id)}
                          className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors ${
                            isSelected
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                          }`}
                        >
                          {/* Radio dot */}
                          <div
                            className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 ${
                              isSelected
                                ? "border-emerald-500 bg-emerald-500"
                                : "border-zinc-300 dark:border-zinc-600"
                            }`}
                          >
                            {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
                          </div>

                          {/* Name */}
                          <span className={`flex-1 font-medium ${isVariant ? "pl-2" : ""}`}>
                            {metatype.name}
                          </span>

                          {/* SAP */}
                          <span
                            className={`font-mono text-xs ${
                              isSelected
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-zinc-400 dark:text-zinc-600"
                            }`}
                          >
                            {metatype.specialAttributePoints}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Right panel: detail */}
            <div
              data-testid="metatype-detail"
              className="flex-1 overflow-y-auto p-5 [scrollbar-width:thin]"
            >
              <MetatypeDetailPanel metatype={detailMetatype} priorityLevel={priorityLevel} />
            </div>
          </div>

          {/* Footer */}
          <ModalFooter className="bg-zinc-50 dark:bg-zinc-800/50">
            <div className="text-sm text-zinc-500">
              {selectedMetatype ? (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>
                    Selected:{" "}
                    <strong className="text-zinc-700 dark:text-zinc-300">
                      {selectedMetatype.name}
                    </strong>
                    <span className="text-zinc-300 dark:text-zinc-600"> · </span>
                    {selectedMetatype.specialAttributePoints} SAP
                    {selectedMetatype.racialTraits.length > 0 && (
                      <>
                        <span className="text-zinc-300 dark:text-zinc-600"> · </span>
                        {selectedMetatype.racialTraits.length} trait
                        {selectedMetatype.racialTraits.length !== 1 ? "s" : ""}
                      </>
                    )}
                  </span>
                </div>
              ) : (
                <span>
                  {priorityLevel
                    ? `Priority ${priorityLevel}: ${metatypes.length} metatype${metatypes.length !== 1 ? "s" : ""}`
                    : `All metatypes available — Karma cost from budget`}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={close}
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedId}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  selectedId
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
                }`}
              >
                Confirm
              </button>
            </div>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
