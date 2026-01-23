"use client";

/**
 * IdentitiesCard
 *
 * Card for managing identities, SINs, licenses, and lifestyles during character creation.
 *
 * Features:
 * - Create identities with fake or real SINs (modal-based)
 * - Add licenses to identities with type chips
 * - Associate lifestyles with identities
 * - Track nuyen costs for fake SINs and licenses
 * - SINner quality integration for real SINs
 */

import { useMemo, useCallback, useState } from "react";
import { Plus, AlertTriangle } from "lucide-react";
import type { CreationState, Identity, License, SIN, SinnerQuality, Lifestyle } from "@/lib/types";
import { SinnerQuality as SinnerQualityEnum } from "@/lib/types/character";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard, SummaryFooter } from "../shared";
import { IdentityCard } from "./IdentityCard";
import { IdentityModal } from "./IdentityModal";
import { LicenseModal } from "./LicenseModal";
import { LifestyleModal } from "./LifestyleModal";
import {
  SIN_COST_PER_RATING,
  LICENSE_COST_PER_RATING,
  SINNER_QUALITY_LABELS,
  LIFESTYLE_TYPES,
} from "./constants";
import type { ModalType, NewIdentityState, NewLicenseState, NewLifestyleState } from "./types";

interface IdentitiesCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

export function IdentitiesCard({ state, updateState }: IdentitiesCardProps) {
  const { budgets } = useCreationBudgets();

  // Modal state
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [editingIdentityIndex, setEditingIdentityIndex] = useState<number | null>(null);
  const [editingLicenseIndex, setEditingLicenseIndex] = useState<number | null>(null);
  const [editingLifestyleId, setEditingLifestyleId] = useState<string | null>(null);

  // Get identities and lifestyles from state
  const identities = useMemo(() => {
    return (state.selections.identities || []) as Identity[];
  }, [state.selections.identities]);

  const lifestyles = useMemo(() => {
    return (state.selections.lifestyles || []) as Lifestyle[];
  }, [state.selections.lifestyles]);

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

  // Calculate total costs
  const totalCosts = useMemo(() => {
    let sinsCost = 0;
    let licensesCost = 0;
    let lifestylesCost = 0;

    identities.forEach((identity) => {
      if (identity.sin?.type === "fake" && identity.sin.rating) {
        sinsCost += identity.sin.rating * SIN_COST_PER_RATING;
      }
      identity.licenses?.forEach((license) => {
        if (license.type === "fake" && license.rating) {
          licensesCost += license.rating * LICENSE_COST_PER_RATING;
        }
      });
    });

    lifestyles.forEach((lifestyle) => {
      lifestylesCost += lifestyle.monthlyCost * (lifestyle.prepaidMonths || 1);
    });

    return {
      sinsCost,
      licensesCost,
      lifestylesCost,
      total: sinsCost + licensesCost + lifestylesCost,
    };
  }, [identities, lifestyles]);

  // Get nuyen remaining
  const nuyenRemaining = budgets["nuyen"]?.remaining ?? 0;

  // Validation
  const needsRealSIN = hasSINnerQuality && !hasRealSIN;

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  const handleAddIdentity = useCallback(
    (newIdentityData: NewIdentityState) => {
      const sin: SIN =
        newIdentityData.sinType === "fake"
          ? { type: "fake", rating: newIdentityData.sinRating }
          : { type: "real", sinnerQuality: sinnerQualityLevel || SinnerQualityEnum.National };

      const identity: Identity = {
        id: `identity-${Date.now()}`,
        name: newIdentityData.name.trim(),
        sin,
        licenses: [],
      };

      updateState({
        selections: {
          ...state.selections,
          identities: [...identities, identity],
        },
      });
    },
    [identities, state.selections, updateState, sinnerQualityLevel]
  );

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

  const handleAddLicense = useCallback(
    (identityIndex: number, licenseData: NewLicenseState) => {
      const identity = identities[identityIndex];
      const licenseType = identity.sin.type === "fake" ? "fake" : "real";

      const license: License = {
        id: `license-${Date.now()}`,
        type: licenseType,
        name: licenseData.name.trim(),
        rating: licenseType === "fake" ? licenseData.rating : undefined,
        notes: licenseData.notes || undefined,
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
    },
    [identities, state.selections, updateState]
  );

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

  const handleAddLifestyle = useCallback(
    (identityIndex: number, lifestyleData: NewLifestyleState) => {
      const lifestyleType = LIFESTYLE_TYPES.find((l) => l.id === lifestyleData.type);
      if (!lifestyleType) return;

      const identity = identities[identityIndex];

      const lifestyle: Lifestyle = {
        id: `lifestyle-${Date.now()}`,
        type: lifestyleData.type,
        monthlyCost: lifestyleType.monthlyCost,
        prepaidMonths: 1,
        location: lifestyleData.location || undefined,
        customExpenses: lifestyleData.customExpenses || undefined,
        customIncome: lifestyleData.customIncome || undefined,
        notes: lifestyleData.notes || undefined,
        modifications:
          lifestyleData.modifications.length > 0 ? lifestyleData.modifications : undefined,
        subscriptions:
          lifestyleData.subscriptions.length > 0 ? lifestyleData.subscriptions : undefined,
        // Associate with the identity
        associatedIdentityId: identity.id,
      };

      // Add lifestyle to lifestyles array
      const updatedLifestyles = [...lifestyles, lifestyle];

      updateState({
        selections: {
          ...state.selections,
          lifestyles: updatedLifestyles,
        },
      });
    },
    [identities, lifestyles, state.selections, updateState]
  );

  const handleRemoveLifestyleById = useCallback(
    (lifestyleId: string) => {
      // Remove lifestyle from lifestyles array
      const updatedLifestyles = lifestyles.filter((l) => l.id !== lifestyleId);

      updateState({
        selections: {
          ...state.selections,
          lifestyles: updatedLifestyles,
        },
      });
    },
    [lifestyles, state.selections, updateState]
  );

  // Edit handlers
  const handleEditIdentity = useCallback(
    (identityIndex: number, identityData: NewIdentityState) => {
      const oldIdentity = identities[identityIndex];
      const sin: SIN =
        identityData.sinType === "fake"
          ? { type: "fake", rating: identityData.sinRating }
          : { type: "real", sinnerQuality: sinnerQualityLevel || SinnerQualityEnum.National };

      const updatedIdentities = [...identities];
      updatedIdentities[identityIndex] = {
        ...oldIdentity,
        name: identityData.name.trim(),
        sin,
      };

      updateState({
        selections: {
          ...state.selections,
          identities: updatedIdentities,
        },
      });
    },
    [identities, state.selections, updateState, sinnerQualityLevel]
  );

  const handleEditLicense = useCallback(
    (identityIndex: number, licenseIndex: number, licenseData: NewLicenseState) => {
      const identity = identities[identityIndex];
      const licenseType = identity.sin.type === "fake" ? "fake" : "real";
      const oldLicense = identity.licenses[licenseIndex];

      const updatedLicense: License = {
        ...oldLicense,
        type: licenseType,
        name: licenseData.name.trim(),
        rating: licenseType === "fake" ? licenseData.rating : undefined,
        notes: licenseData.notes || undefined,
      };

      const updatedIdentities = [...identities];
      const updatedLicenses = [...identity.licenses];
      updatedLicenses[licenseIndex] = updatedLicense;
      updatedIdentities[identityIndex] = {
        ...identity,
        licenses: updatedLicenses,
      };

      updateState({
        selections: {
          ...state.selections,
          identities: updatedIdentities,
        },
      });
    },
    [identities, state.selections, updateState]
  );

  const handleEditLifestyle = useCallback(
    (lifestyleId: string, lifestyleData: NewLifestyleState) => {
      const lifestyleType = LIFESTYLE_TYPES.find((l) => l.id === lifestyleData.type);
      if (!lifestyleType) return;

      const lifestyleIndex = lifestyles.findIndex((l) => l.id === lifestyleId);
      if (lifestyleIndex === -1) return;

      const oldLifestyle = lifestyles[lifestyleIndex];
      const updatedLifestyle: Lifestyle = {
        ...oldLifestyle, // Preserves id and associatedIdentityId
        type: lifestyleData.type,
        monthlyCost: lifestyleType.monthlyCost,
        location: lifestyleData.location || undefined,
        customExpenses: lifestyleData.customExpenses || undefined,
        customIncome: lifestyleData.customIncome || undefined,
        notes: lifestyleData.notes || undefined,
        modifications:
          lifestyleData.modifications.length > 0 ? lifestyleData.modifications : undefined,
        subscriptions:
          lifestyleData.subscriptions.length > 0 ? lifestyleData.subscriptions : undefined,
      };

      const updatedLifestyles = [...lifestyles];
      updatedLifestyles[lifestyleIndex] = updatedLifestyle;

      updateState({
        selections: {
          ...state.selections,
          lifestyles: updatedLifestyles,
        },
      });
    },
    [lifestyles, state.selections, updateState]
  );

  // Modal handlers
  const openAddIdentityModal = () => setActiveModal("identity");
  const openAddLicenseModal = (identityIndex: number) => {
    setEditingIdentityIndex(identityIndex);
    setEditingLicenseIndex(null);
    setActiveModal("license");
  };
  const openAddLifestyleModal = (identityIndex: number) => {
    setEditingIdentityIndex(identityIndex);
    setEditingLifestyleId(null);
    setActiveModal("lifestyle");
  };

  // Edit modal handlers
  const openEditIdentityModal = (identityIndex: number) => {
    setEditingIdentityIndex(identityIndex);
    setActiveModal("edit-identity");
  };
  const openEditLicenseModal = (identityIndex: number, licenseIndex: number) => {
    setEditingIdentityIndex(identityIndex);
    setEditingLicenseIndex(licenseIndex);
    setActiveModal("edit-license");
  };
  const openEditLifestyleModal = (identityIndex: number, lifestyleId: string) => {
    setEditingIdentityIndex(identityIndex);
    setEditingLifestyleId(lifestyleId);
    setActiveModal("edit-lifestyle");
  };

  const closeModal = () => {
    setActiveModal(null);
    setEditingIdentityIndex(null);
    setEditingLicenseIndex(null);
    setEditingLifestyleId(null);
  };

  // Get current identity for modal context
  const currentIdentity = editingIdentityIndex !== null ? identities[editingIdentityIndex] : null;

  // Get current license for edit modal
  const currentLicense =
    editingIdentityIndex !== null && editingLicenseIndex !== null
      ? identities[editingIdentityIndex]?.licenses?.[editingLicenseIndex]
      : null;

  // Get current lifestyle for edit modal
  const currentLifestyle = editingLifestyleId
    ? lifestyles.find((l) => l.id === editingLifestyleId)
    : null;

  return (
    <>
      <CreationCard
        title="Identities & SINs"
        status={needsRealSIN ? "error" : identities.length > 0 ? "valid" : "warning"}
        headerAction={
          <button
            onClick={openAddIdentityModal}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-amber-600"
          >
            <Plus className="h-3.5 w-3.5" />
            Identity
          </button>
        }
      >
        <div className="space-y-3">
          {/* SINner Quality Warning */}
          {needsRealSIN && (
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm dark:bg-amber-900/20">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
              <span className="text-amber-700 dark:text-amber-300">
                SINner quality requires at least one identity with a real SIN (
                {sinnerQualityLevel && SINNER_QUALITY_LABELS[sinnerQualityLevel]}).
              </span>
            </div>
          )}

          {/* Identities List */}
          {identities.length > 0 && (
            <div className="space-y-3">
              {identities.map((identity, index) => (
                <IdentityCard
                  key={identity.id || index}
                  identity={identity}
                  lifestyles={lifestyles}
                  onEdit={() => openEditIdentityModal(index)}
                  onRemove={() => handleRemoveIdentity(index)}
                  onAddLicense={() => openAddLicenseModal(index)}
                  onEditLicense={(licenseIndex) => openEditLicenseModal(index, licenseIndex)}
                  onRemoveLicense={(licenseIndex) => handleRemoveLicense(index, licenseIndex)}
                  onAddLifestyle={() => openAddLifestyleModal(index)}
                  onEditLifestyle={(lifestyleId) => openEditLifestyleModal(index, lifestyleId)}
                  onRemoveLifestyle={(lifestyleId) => handleRemoveLifestyleById(lifestyleId)}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {identities.length === 0 && (
            <>
              <div className="rounded-lg border-2 border-dashed border-zinc-200 p-3 text-center dark:border-zinc-700">
                <p className="text-xs text-zinc-400 dark:text-zinc-500">No identities added</p>
              </div>
              <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
                Every runner needs at least one identity with a SIN.
              </p>
            </>
          )}

          {/* Footer Summary */}
          <SummaryFooter
            count={identities.length}
            total={totalCosts.total}
            format="currency"
            label="identity"
          />
        </div>
      </CreationCard>

      {/* Modals */}
      {/* Add Identity Modal */}
      <IdentityModal
        isOpen={activeModal === "identity"}
        onClose={closeModal}
        onSave={handleAddIdentity}
        hasSINnerQuality={hasSINnerQuality}
        sinnerQualityLevel={sinnerQualityLevel}
        nuyenRemaining={nuyenRemaining}
      />

      {/* Edit Identity Modal */}
      {currentIdentity && editingIdentityIndex !== null && (
        <IdentityModal
          isOpen={activeModal === "edit-identity"}
          onClose={closeModal}
          onSave={(identityData) => {
            handleEditIdentity(editingIdentityIndex, identityData);
            closeModal();
          }}
          hasSINnerQuality={hasSINnerQuality}
          sinnerQualityLevel={sinnerQualityLevel}
          nuyenRemaining={nuyenRemaining}
          isEditMode
          initialData={{
            name: currentIdentity.name,
            sinType: currentIdentity.sin.type,
            sinRating: currentIdentity.sin.type === "fake" ? currentIdentity.sin.rating || 1 : 1,
          }}
        />
      )}

      {currentIdentity && (
        <>
          {/* Add License Modal */}
          <LicenseModal
            isOpen={activeModal === "license"}
            onClose={closeModal}
            onSave={(license) => handleAddLicense(editingIdentityIndex!, license)}
            sinType={currentIdentity.sin.type}
            nuyenRemaining={nuyenRemaining}
          />

          {/* Edit License Modal */}
          {currentLicense && editingLicenseIndex !== null && (
            <LicenseModal
              isOpen={activeModal === "edit-license"}
              onClose={closeModal}
              onSave={(licenseData) => {
                handleEditLicense(editingIdentityIndex!, editingLicenseIndex, licenseData);
                closeModal();
              }}
              sinType={currentIdentity.sin.type}
              nuyenRemaining={nuyenRemaining}
              isEditMode
              initialData={{
                name: currentLicense.name,
                rating: currentLicense.rating || 1,
                notes: currentLicense.notes || "",
              }}
            />
          )}

          {/* Add Lifestyle Modal */}
          <LifestyleModal
            isOpen={activeModal === "lifestyle"}
            onClose={closeModal}
            onSave={(lifestyle) => handleAddLifestyle(editingIdentityIndex!, lifestyle)}
            nuyenRemaining={nuyenRemaining}
          />

          {/* Edit Lifestyle Modal */}
          {currentLifestyle && editingLifestyleId && (
            <LifestyleModal
              isOpen={activeModal === "edit-lifestyle"}
              onClose={closeModal}
              onSave={(lifestyleData) => {
                handleEditLifestyle(editingLifestyleId, lifestyleData);
                closeModal();
              }}
              nuyenRemaining={nuyenRemaining}
              isEditMode
              initialData={{
                type: currentLifestyle.type,
                location: currentLifestyle.location || "",
                customExpenses: currentLifestyle.customExpenses || 0,
                customIncome: currentLifestyle.customIncome || 0,
                notes: currentLifestyle.notes || "",
                modifications: currentLifestyle.modifications || [],
                subscriptions: currentLifestyle.subscriptions || [],
              }}
            />
          )}
        </>
      )}
    </>
  );
}
