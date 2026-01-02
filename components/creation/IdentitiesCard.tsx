"use client";

/**
 * IdentitiesCard
 *
 * Compact card for managing identities, SINs, and licenses during character creation.
 * Features:
 * - Create identities with fake or real SINs
 * - Add licenses to identities
 * - Track nuyen costs for fake SINs and licenses
 * - SINner quality integration for real SINs
 */

import { useMemo, useCallback, useState } from "react";
import {
  Plus,
  X,
  Trash2,
  Shield,
  FileText,
  AlertTriangle,
} from "lucide-react";
import type { CreationState, Identity, License, SIN, SinnerQuality } from "@/lib/types";
import { SinnerQuality as SinnerQualityEnum } from "@/lib/types/character";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard } from "./shared";

// =============================================================================
// TYPES
// =============================================================================

interface IdentitiesCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const SIN_COST_PER_RATING = 2500; // Rating × 2,500¥
const LICENSE_COST_PER_RATING = 200; // Rating × 200¥

const SINNER_QUALITY_LABELS: Record<SinnerQuality, string> = {
  [SinnerQualityEnum.National]: "National",
  [SinnerQualityEnum.Criminal]: "Criminal",
  [SinnerQualityEnum.CorporateLimited]: "Corporate (Limited)",
  [SinnerQualityEnum.CorporateBorn]: "Corporate Born",
};

const LICENSE_SUGGESTIONS = [
  "Firearms License",
  "Concealed Carry Permit",
  "Driver License",
  "Restricted Augmentation License",
  "Mage License",
  "Bounty Hunter License",
  "Private Investigator License",
  "Security Provider License",
  "Bodyguard License",
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function IdentitiesCard({ state, updateState }: IdentitiesCardProps) {
  const { budgets } = useCreationBudgets();

  // Local state
  const [isAddingIdentity, setIsAddingIdentity] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [addingLicenseToIndex, setAddingLicenseToIndex] = useState<number | null>(null);
  const [newIdentity, setNewIdentity] = useState<{
    name: string;
    sinType: "fake" | "real";
    sinRating: number;
    sinnerQuality: SinnerQuality;
  }>({
    name: "",
    sinType: "fake",
    sinRating: 4,
    sinnerQuality: SinnerQualityEnum.National,
  });
  const [newLicense, setNewLicense] = useState({ name: "", rating: 4 });

  // Get identities from state
  const identities = useMemo(() => {
    return (state.selections.identities || []) as Identity[];
  }, [state.selections.identities]);

  // Check if character has SINner quality
  const hasSINnerQuality = useMemo(() => {
    const negativeQualitiesList = (state.selections.negativeQualities || []) as string[];
    return negativeQualitiesList.includes("sinner");
  }, [state.selections.negativeQualities]);

  // Get SINner quality level if present
  const sinnerQualityLevel = useMemo(() => {
    if (!hasSINnerQuality) return null;
    const qualityLevels = (state.selections.qualityLevels || {}) as Record<string, number>;
    const sinnerLevel = qualityLevels["sinner"] || 1;
    const levelMap: Record<number, SinnerQuality> = {
      1: SinnerQualityEnum.National,
      2: SinnerQualityEnum.Criminal,
      3: SinnerQualityEnum.CorporateLimited,
      4: SinnerQualityEnum.CorporateBorn,
    };
    return levelMap[sinnerLevel] || SinnerQualityEnum.National;
  }, [hasSINnerQuality, state.selections.qualityLevels]);

  // Check if has real SIN identity (required if SINner quality)
  const hasRealSIN = useMemo(() => {
    return identities.some((id) => id.sin?.type === "real");
  }, [identities]);

  // Calculate identity costs
  const identityCosts = useMemo(() => {
    let total = 0;
    identities.forEach((identity) => {
      if (identity.sin?.type === "fake" && identity.sin.rating) {
        total += identity.sin.rating * SIN_COST_PER_RATING;
      }
      identity.licenses?.forEach((license) => {
        if (license.type === "fake" && license.rating) {
          total += license.rating * LICENSE_COST_PER_RATING;
        }
      });
    });
    return total;
  }, [identities]);

  // Get nuyen remaining
  const nuyenRemaining = budgets["nuyen"]?.remaining ?? 0;

  // Format currency
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US").format(value);

  // Calculate new identity cost
  const newIdentityCost = useMemo(() => {
    if (newIdentity.sinType === "real") return 0;
    return newIdentity.sinRating * SIN_COST_PER_RATING;
  }, [newIdentity.sinType, newIdentity.sinRating]);

  // Handle adding identity
  const handleAddIdentity = useCallback(() => {
    if (!newIdentity.name.trim()) return;
    if (newIdentity.sinType === "fake" && newIdentityCost > nuyenRemaining) return;

    const sin: SIN =
      newIdentity.sinType === "fake"
        ? { type: "fake", rating: newIdentity.sinRating }
        : { type: "real", sinnerQuality: sinnerQualityLevel || newIdentity.sinnerQuality };

    const identity: Identity = {
      id: `identity-${Date.now()}`,
      name: newIdentity.name.trim(),
      sin,
      licenses: [],
    };

    const updatedIdentities = [...identities, identity];

    updateState({
      selections: {
        ...state.selections,
        identities: updatedIdentities,
      },
    });

    setNewIdentity({
      name: "",
      sinType: "fake",
      sinRating: 4,
      sinnerQuality: SinnerQualityEnum.National,
    });
    setIsAddingIdentity(false);
  }, [newIdentity, newIdentityCost, nuyenRemaining, identities, state.selections, updateState, sinnerQualityLevel]);

  // Handle removing identity
  const handleRemoveIdentity = useCallback(
    (index: number) => {
      const updatedIdentities = identities.filter((_, i) => i !== index);
      updateState({
        selections: {
          ...state.selections,
          identities: updatedIdentities,
        },
      });
    },
    [identities, state.selections, updateState]
  );

  // Handle adding license
  const handleAddLicense = useCallback(
    (identityIndex: number) => {
      if (!newLicense.name.trim()) return;

      const identity = identities[identityIndex];
      const licenseType = identity.sin.type === "fake" ? "fake" : "real";
      const licenseCost =
        licenseType === "fake" ? newLicense.rating * LICENSE_COST_PER_RATING : 0;

      if (licenseCost > nuyenRemaining) return;

      const license: License = {
        id: `license-${Date.now()}`,
        type: licenseType,
        name: newLicense.name.trim(),
        rating: licenseType === "fake" ? newLicense.rating : undefined,
      };

      const updatedIdentities = [...identities];
      updatedIdentities[identityIndex] = {
        ...identity,
        licenses: [...(identity.licenses || []), license],
      };

      updateState({
        selections: {
          ...state.selections,
          identities: updatedIdentities,
        },
      });

      setNewLicense({ name: "", rating: 4 });
      setAddingLicenseToIndex(null);
    },
    [newLicense, identities, state.selections, updateState, nuyenRemaining]
  );

  // Handle removing license
  const handleRemoveLicense = useCallback(
    (identityIndex: number, licenseIndex: number) => {
      const updatedIdentities = [...identities];
      const identity = { ...updatedIdentities[identityIndex] };
      identity.licenses = identity.licenses.filter((_, i) => i !== licenseIndex);
      updatedIdentities[identityIndex] = identity;

      updateState({
        selections: {
          ...state.selections,
          identities: updatedIdentities,
        },
      });
    },
    [identities, state.selections, updateState]
  );

  // Validation
  const needsRealSIN = hasSINnerQuality && !hasRealSIN;

  return (
    <CreationCard
      title="Identities & SINs"
      description={`${identities.length} identit${identities.length !== 1 ? "ies" : "y"}${identityCosts > 0 ? ` • ¥${formatCurrency(identityCosts)}` : ""}`}
      status={
        needsRealSIN
          ? "error"
          : identities.length > 0
          ? "valid"
          : "warning"
      }
    >
      <div className="space-y-3">
        {/* Cost Summary */}
        {identityCosts > 0 && (
          <div className="flex items-center justify-between rounded-md bg-zinc-50 p-2 text-sm dark:bg-zinc-800">
            <span className="text-zinc-600 dark:text-zinc-400">
              SINs & Licenses Cost:
            </span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              ¥{formatCurrency(identityCosts)}
            </span>
          </div>
        )}

        {/* SINner Quality Warning */}
        {needsRealSIN && (
          <div className="flex items-start gap-2 rounded-md bg-amber-50 p-2 text-xs dark:bg-amber-900/20">
            <AlertTriangle className="mt-0.5 h-3 w-3 flex-shrink-0 text-amber-600" />
            <span className="text-amber-700 dark:text-amber-300">
              SINner quality requires at least one identity with a real SIN (
              {sinnerQualityLevel && SINNER_QUALITY_LABELS[sinnerQualityLevel]}).
            </span>
          </div>
        )}

        {/* Identities List */}
        {identities.length > 0 && (
          <div className="space-y-2">
            {identities.map((identity, index) => (
              <div
                key={identity.id || index}
                className="rounded-md border border-zinc-200 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-800/50"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {identity.name}
                      </span>
                      {identity.sin.type === "fake" ? (
                        <span className="flex-shrink-0 rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          Fake R{identity.sin.rating}
                        </span>
                      ) : (
                        <span className="flex-shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                          Real ({SINNER_QUALITY_LABELS[identity.sin.sinnerQuality]})
                        </span>
                      )}
                    </div>

                    {/* Licenses */}
                    {identity.licenses && identity.licenses.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {identity.licenses.map((license, licenseIndex) => (
                          <div
                            key={license.id || licenseIndex}
                            className="flex items-center justify-between rounded bg-zinc-50 px-2 py-1 text-xs dark:bg-zinc-700/50"
                          >
                            <div className="flex items-center gap-1.5">
                              <FileText className="h-3 w-3 text-zinc-400" />
                              <span className="text-zinc-700 dark:text-zinc-300">
                                {license.name}
                                {license.type === "fake" && license.rating && (
                                  <span className="ml-1 text-zinc-500">
                                    (R{license.rating})
                                  </span>
                                )}
                              </span>
                            </div>
                            <button
                              onClick={() => handleRemoveLicense(index, licenseIndex)}
                              className="rounded p-0.5 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add License */}
                    {addingLicenseToIndex === index ? (
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="text"
                          value={newLicense.name}
                          onChange={(e) =>
                            setNewLicense({ ...newLicense, name: e.target.value })
                          }
                          list="license-suggestions"
                          className="flex-1 rounded border border-zinc-300 bg-white px-2 py-1 text-xs dark:border-zinc-600 dark:bg-zinc-800"
                          placeholder="License name"
                          autoFocus
                        />
                        {identity.sin.type === "fake" && (
                          <select
                            value={newLicense.rating}
                            onChange={(e) =>
                              setNewLicense({
                                ...newLicense,
                                rating: parseInt(e.target.value),
                              })
                            }
                            className="rounded border border-zinc-300 bg-white px-1 py-1 text-xs dark:border-zinc-600 dark:bg-zinc-800"
                          >
                            {[1, 2, 3, 4].map((r) => (
                              <option key={r} value={r}>
                                R{r}
                              </option>
                            ))}
                          </select>
                        )}
                        <button
                          onClick={() => handleAddLicense(index)}
                          disabled={!newLicense.name.trim()}
                          className="rounded bg-emerald-500 px-2 py-1 text-xs text-white hover:bg-emerald-600 disabled:opacity-50"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => setAddingLicenseToIndex(null)}
                          className="rounded p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setNewLicense({ name: "", rating: 4 });
                          setAddingLicenseToIndex(index);
                        }}
                        className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        <Plus className="h-3 w-3" />
                        Add License
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleRemoveIdentity(index)}
                    className="ml-2 rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Identity Form */}
        {isAddingIdentity ? (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-900/20">
            <div className="space-y-3">
              <input
                type="text"
                value={newIdentity.name}
                onChange={(e) =>
                  setNewIdentity({ ...newIdentity, name: e.target.value })
                }
                className="w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800"
                placeholder="Identity name *"
                autoFocus
              />

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="sinType"
                    checked={newIdentity.sinType === "fake"}
                    onChange={() =>
                      setNewIdentity({ ...newIdentity, sinType: "fake" })
                    }
                    className="text-blue-600"
                  />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    Fake SIN
                  </span>
                </label>
                {hasSINnerQuality && (
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sinType"
                      checked={newIdentity.sinType === "real"}
                      onChange={() =>
                        setNewIdentity({ ...newIdentity, sinType: "real" })
                      }
                      className="text-emerald-600"
                    />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      Real SIN
                    </span>
                  </label>
                )}
              </div>

              {newIdentity.sinType === "fake" && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">
                    Rating:
                  </span>
                  <select
                    value={newIdentity.sinRating}
                    onChange={(e) =>
                      setNewIdentity({
                        ...newIdentity,
                        sinRating: parseInt(e.target.value),
                      })
                    }
                    className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-800"
                  >
                    {[1, 2, 3, 4].map((r) => (
                      <option key={r} value={r}>
                        {r} (¥{formatCurrency(r * SIN_COST_PER_RATING)})
                      </option>
                    ))}
                  </select>
                  <span
                    className={`ml-auto text-xs font-medium ${
                      newIdentityCost > nuyenRemaining
                        ? "text-red-600"
                        : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    ¥{formatCurrency(newIdentityCost)}
                  </span>
                </div>
              )}

              {newIdentity.sinType === "real" && sinnerQualityLevel && (
                <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <Shield className="h-3 w-3" />
                  <span>
                    SINner Quality: {SINNER_QUALITY_LABELS[sinnerQualityLevel]}
                  </span>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsAddingIdentity(false);
                    setNewIdentity({
                      name: "",
                      sinType: "fake",
                      sinRating: 4,
                      sinnerQuality: SinnerQualityEnum.National,
                    });
                  }}
                  className="rounded px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddIdentity}
                  disabled={
                    !newIdentity.name.trim() ||
                    (newIdentity.sinType === "fake" && newIdentityCost > nuyenRemaining)
                  }
                  className={`rounded px-2 py-1 text-xs font-medium ${
                    newIdentity.name.trim() &&
                    (newIdentity.sinType === "real" || newIdentityCost <= nuyenRemaining)
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
                  }`}
                >
                  Add Identity
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingIdentity(true)}
            className="flex w-full items-center justify-center gap-1 rounded-md border-2 border-dashed border-zinc-300 py-2 text-xs font-medium text-zinc-600 transition-colors hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 dark:border-zinc-600 dark:text-zinc-400 dark:hover:border-emerald-600 dark:hover:bg-emerald-900/20"
          >
            <Plus className="h-3 w-3" />
            Add Identity
          </button>
        )}

        {/* License suggestions datalist */}
        <datalist id="license-suggestions">
          {LICENSE_SUGGESTIONS.map((license) => (
            <option key={license} value={license} />
          ))}
        </datalist>

        {/* Empty state */}
        {identities.length === 0 && !isAddingIdentity && (
          <div className="text-center text-xs text-zinc-500 dark:text-zinc-400">
            Every runner needs at least one identity with a SIN.
          </div>
        )}
      </div>
    </CreationCard>
  );
}
