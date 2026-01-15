"use client";

import { X, FileText, Home, Edit2 } from "lucide-react";
import type { Identity, Lifestyle } from "@/lib/types";
import { SINNER_QUALITY_LABELS, LIFESTYLE_TYPES } from "./constants";

interface IdentityCardProps {
  identity: Identity;
  lifestyles: Lifestyle[];
  onEdit: () => void;
  onRemove: () => void;
  onAddLicense: () => void;
  onEditLicense: (licenseIndex: number) => void;
  onRemoveLicense: (licenseIndex: number) => void;
  onAddLifestyle: () => void;
  onEditLifestyle: (lifestyleId: string) => void;
  onRemoveLifestyle: (lifestyleId: string) => void;
}

export function IdentityCard({
  identity,
  lifestyles,
  onEdit,
  onRemove,
  onAddLicense,
  onEditLicense,
  onRemoveLicense,
  onAddLifestyle,
  onEditLifestyle,
  onRemoveLifestyle,
}: IdentityCardProps) {
  // Get all lifestyles associated with this identity
  const associatedLifestyles = lifestyles.filter(
    (l) => l.id === identity.associatedLifestyleId || l.associatedIdentityId === identity.id
  );

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800/50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-700/50">
        <div>
          <div className="font-medium text-zinc-900 dark:text-zinc-100">{identity.name}</div>
          {identity.sin.type === "fake" ? (
            <span className="mt-1 inline-block rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              Fake SIN (Rating {identity.sin.rating})
            </span>
          ) : (
            <span className="mt-1 inline-block rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              Real SIN ({SINNER_QUALITY_LABELS[identity.sin.sinnerQuality!]})
            </span>
          )}
        </div>
        <div className="flex items-center">
          <button
            onClick={onEdit}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
            title="Edit identity"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <div className="mx-1 h-5 w-px bg-zinc-300 dark:bg-zinc-600" />
          <button
            onClick={onRemove}
            className="rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
            title="Remove identity"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 p-4">
        {/* Licenses Section */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Licenses{identity.licenses?.length ? ` (${identity.licenses.length})` : ""}
            </span>
            <button
              onClick={onAddLicense}
              className="rounded bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700"
            >
              + Add License
            </button>
          </div>

          {identity.licenses && identity.licenses.length > 0 ? (
            <div className="space-y-1.5">
              {identity.licenses.map((license, licenseIndex) => (
                <div
                  key={license.id || licenseIndex}
                  className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-700/50"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {license.name}
                      {license.type === "fake" && license.rating && (
                        <span className="ml-1 text-zinc-500">(Rating {license.rating})</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => onEditLicense(licenseIndex)}
                      className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                      title="Edit license"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <div className="mx-1 h-4 w-px bg-zinc-300 dark:bg-zinc-600" />
                    <button
                      onClick={() => onRemoveLicense(licenseIndex)}
                      className="rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                      title="Remove license"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              No licenses added yet. Click &quot;Add License&quot; to add a license to this
              identity.
            </p>
          )}
        </div>

        {/* Associated Lifestyles Section */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Lifestyles{associatedLifestyles.length ? ` (${associatedLifestyles.length})` : ""}
            </span>
            <button
              onClick={onAddLifestyle}
              className="rounded bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700"
            >
              + Add Lifestyle
            </button>
          </div>

          {associatedLifestyles.length > 0 ? (
            <div className="space-y-1.5">
              {associatedLifestyles.map((lifestyle) => {
                const lifestyleType = LIFESTYLE_TYPES.find((lt) => lt.id === lifestyle.type);
                return (
                  <div
                    key={lifestyle.id}
                    className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-700/50"
                  >
                    <div className="flex items-center gap-2">
                      <Home className="h-3.5 w-3.5 text-zinc-400" />
                      <div>
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          {lifestyleType?.name || lifestyle.type}
                        </span>
                        {lifestyle.location && (
                          <span className="ml-1 text-xs text-zinc-500 dark:text-zinc-400">
                            ({lifestyle.location})
                          </span>
                        )}
                        <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">
                          {lifestyle.monthlyCost.toLocaleString()}/mo
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => onEditLifestyle(lifestyle.id!)}
                        className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                        title="Edit lifestyle"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <div className="mx-1 h-4 w-px bg-zinc-300 dark:bg-zinc-600" />
                      <button
                        onClick={() => onRemoveLifestyle(lifestyle.id!)}
                        className="rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                        title="Remove lifestyle"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              No lifestyles added yet. Click &quot;+ Add Lifestyle&quot; to add a lifestyle for this
              identity.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
