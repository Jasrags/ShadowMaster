"use client";

/**
 * MatrixGearDetailsPane
 *
 * Right-pane detail preview for the matrix gear purchase modal.
 * Shows commlink, cyberdeck, or software details with form fields
 * for software-specific options (rating, skill, specific details).
 */

import { Smartphone, Cpu, Database, AlertTriangle } from "lucide-react";
import type {
  CommlinkData,
  CyberdeckData,
  DataSoftwareCatalogItemData,
  SkillData,
} from "@/lib/rules/RulesetContext";
import {
  formatCurrency,
  getAvailabilityDisplay,
  SOFTWARE_SUBCATEGORIES,
  MAX_AVAILABILITY,
  type MatrixGearCategory,
  type SoftwareSubcategory,
} from "./matrixGearHelpers";
import { RatingSelector } from "./MatrixGearListItems";

// =============================================================================
// TYPES
// =============================================================================

export interface MatrixGearDetailsPaneProps {
  /** Active gear category */
  selectedCategory: MatrixGearCategory;
  /** Active software subcategory */
  selectedSoftwareType: SoftwareSubcategory;
  /** Remaining nuyen budget */
  remaining: number;
  /** Selected commlink (null if none selected) */
  selectedCommlink: CommlinkData | null;
  /** Selected cyberdeck (null if none selected) */
  selectedCyberdeck: CyberdeckData | null;
  /** Selected software item (null if none selected) */
  selectedSoftware: DataSoftwareCatalogItemData | null;
  /** Software-specific form state */
  specificDetails: string;
  /** Software-specific form state setter */
  onSpecificDetailsChange: (value: string) => void;
  /** Selected skill ID for tutorsofts */
  selectedSkillId: string;
  /** Skill ID change handler */
  onSelectedSkillIdChange: (value: string) => void;
  /** Current software rating */
  rating: number;
  /** Rating change handler */
  onRatingChange: (value: number) => void;
  /** Eligible skills for tutorsoft selection */
  eligibleSkills: SkillData[];
  /** Calculate cost for current software selection */
  calculateSoftwareCost: () => number;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function MatrixGearDetailsPane({
  selectedCategory,
  selectedSoftwareType,
  remaining,
  selectedCommlink,
  selectedCyberdeck,
  selectedSoftware,
  specificDetails,
  onSpecificDetailsChange,
  selectedSkillId,
  onSelectedSkillIdChange,
  rating,
  onRatingChange,
  eligibleSkills,
  calculateSoftwareCost,
}: MatrixGearDetailsPaneProps) {
  // Determine if we have a selected item
  const hasSelection =
    (selectedCategory === "commlinks" && selectedCommlink) ||
    (selectedCategory === "cyberdecks" && selectedCyberdeck) ||
    (selectedCategory === "software" && selectedSoftware);

  if (!hasSelection) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-zinc-400">
        {selectedCategory === "commlinks" && <Smartphone className="h-12 w-12" />}
        {selectedCategory === "cyberdecks" && <Cpu className="h-12 w-12" />}
        {selectedCategory === "software" && <Database className="h-12 w-12" />}
        <p className="mt-4 text-sm">Select an item from the list</p>
      </div>
    );
  }

  return (
    <>
      {/* Commlink Detail */}
      {selectedCategory === "commlinks" && selectedCommlink && (
        <CommlinkDetail commlink={selectedCommlink} remaining={remaining} />
      )}

      {/* Cyberdeck Detail */}
      {selectedCategory === "cyberdecks" && selectedCyberdeck && (
        <CyberdeckDetail cyberdeck={selectedCyberdeck} remaining={remaining} />
      )}

      {/* Software Detail */}
      {selectedCategory === "software" && selectedSoftware && (
        <SoftwareDetail
          software={selectedSoftware}
          softwareType={selectedSoftwareType}
          remaining={remaining}
          specificDetails={specificDetails}
          onSpecificDetailsChange={onSpecificDetailsChange}
          selectedSkillId={selectedSkillId}
          onSelectedSkillIdChange={onSelectedSkillIdChange}
          rating={rating}
          onRatingChange={onRatingChange}
          eligibleSkills={eligibleSkills}
          calculateSoftwareCost={calculateSoftwareCost}
        />
      )}
    </>
  );
}

// =============================================================================
// COMMLINK DETAIL
// =============================================================================

function CommlinkDetail({ commlink, remaining }: { commlink: CommlinkData; remaining: number }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{commlink.name}</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Commlink</p>
      </div>

      {commlink.description && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{commlink.description}</p>
      )}

      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Statistics
        </h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
            <span className="text-zinc-500 dark:text-zinc-400">Device Rating</span>
            <span className="font-medium text-cyan-600 dark:text-cyan-400">
              {commlink.deviceRating}
            </span>
          </div>
          <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
            <span className="text-zinc-500 dark:text-zinc-400">Data Processing</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {commlink.deviceRating}
            </span>
          </div>
          <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
            <span className="text-zinc-500 dark:text-zinc-400">Firewall</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {commlink.deviceRating}
            </span>
          </div>
          <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
            <span className="text-zinc-500 dark:text-zinc-400">Availability</span>
            <span
              className={`font-medium ${
                commlink.legality === "forbidden"
                  ? "text-red-600 dark:text-red-400"
                  : commlink.legality === "restricted"
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-zinc-900 dark:text-zinc-100"
              }`}
            >
              {getAvailabilityDisplay(commlink.availability, commlink.legality)}
            </span>
          </div>
        </div>
      </div>

      <CostCard
        cost={commlink.cost}
        remaining={remaining}
        colorClass="text-cyan-600 dark:text-cyan-400"
      />
    </div>
  );
}

// =============================================================================
// CYBERDECK DETAIL
// =============================================================================

function CyberdeckDetail({
  cyberdeck,
  remaining,
}: {
  cyberdeck: CyberdeckData;
  remaining: number;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{cyberdeck.name}</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Cyberdeck</p>
      </div>

      {cyberdeck.description && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{cyberdeck.description}</p>
      )}

      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Device Statistics
        </h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
            <span className="text-zinc-500 dark:text-zinc-400">Device Rating</span>
            <span className="font-medium text-purple-600 dark:text-purple-400">
              {cyberdeck.deviceRating}
            </span>
          </div>
          <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
            <span className="text-zinc-500 dark:text-zinc-400">Program Slots</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {cyberdeck.programs}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Matrix Attributes (ASDF)
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex justify-between rounded bg-red-50 px-3 py-2 text-sm dark:bg-red-900/20">
            <span className="text-red-600 dark:text-red-400">Attack</span>
            <span className="font-medium text-red-700 dark:text-red-300">
              {cyberdeck.attributes.attack}
            </span>
          </div>
          <div className="flex justify-between rounded bg-yellow-50 px-3 py-2 text-sm dark:bg-yellow-900/20">
            <span className="text-yellow-600 dark:text-yellow-400">Sleaze</span>
            <span className="font-medium text-yellow-700 dark:text-yellow-300">
              {cyberdeck.attributes.sleaze}
            </span>
          </div>
          <div className="flex justify-between rounded bg-blue-50 px-3 py-2 text-sm dark:bg-blue-900/20">
            <span className="text-blue-600 dark:text-blue-400">Data Proc</span>
            <span className="font-medium text-blue-700 dark:text-blue-300">
              {cyberdeck.attributes.dataProcessing}
            </span>
          </div>
          <div className="flex justify-between rounded bg-green-50 px-3 py-2 text-sm dark:bg-green-900/20">
            <span className="text-green-600 dark:text-green-400">Firewall</span>
            <span className="font-medium text-green-700 dark:text-green-300">
              {cyberdeck.attributes.firewall}
            </span>
          </div>
        </div>
      </div>

      {/* Legality Warning */}
      {(cyberdeck.legality === "restricted" || cyberdeck.legality === "forbidden") && (
        <div
          className={`rounded-lg p-3 ${
            cyberdeck.legality === "forbidden"
              ? "bg-red-50 dark:bg-red-900/20"
              : "bg-amber-50 dark:bg-amber-900/20"
          }`}
        >
          <div
            className={`flex items-center gap-2 text-sm font-medium ${
              cyberdeck.legality === "forbidden"
                ? "text-red-700 dark:text-red-300"
                : "text-amber-700 dark:text-amber-300"
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            {cyberdeck.legality === "forbidden"
              ? "Forbidden - Illegal to possess"
              : "Restricted - Requires license"}
          </div>
        </div>
      )}

      <CostCard
        cost={cyberdeck.cost}
        remaining={remaining}
        colorClass="text-purple-600 dark:text-purple-400"
      />
    </div>
  );
}

// =============================================================================
// SOFTWARE DETAIL
// =============================================================================

function SoftwareDetail({
  software,
  softwareType,
  remaining,
  specificDetails,
  onSpecificDetailsChange,
  selectedSkillId,
  onSelectedSkillIdChange,
  rating,
  onRatingChange,
  eligibleSkills,
  calculateSoftwareCost,
}: {
  software: DataSoftwareCatalogItemData;
  softwareType: SoftwareSubcategory;
  remaining: number;
  specificDetails: string;
  onSpecificDetailsChange: (value: string) => void;
  selectedSkillId: string;
  onSelectedSkillIdChange: (value: string) => void;
  rating: number;
  onRatingChange: (value: number) => void;
  eligibleSkills: SkillData[];
  calculateSoftwareCost: () => number;
}) {
  const cost = calculateSoftwareCost();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{software.name}</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {SOFTWARE_SUBCATEGORIES.find((s) => s.id === softwareType)?.label}
        </p>
      </div>

      {software.description && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{software.description}</p>
      )}

      {software.effects && (
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Effect
          </span>
          <p className="rounded bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {software.effects}
          </p>
        </div>
      )}

      {/* Specific Details Input */}
      {software.requiresSpecificDetails && (
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {software.specificDetailsLabel || "Details"} *
          </label>
          <input
            type="text"
            value={specificDetails}
            onChange={(e) => onSpecificDetailsChange(e.target.value)}
            placeholder={software.specificDetailsPlaceholder || "Enter details..."}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
      )}

      {/* Skill Selection (for Tutorsoft) */}
      {software.requiresSkillSelection && (
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Skill *
          </label>
          <select
            value={selectedSkillId}
            onChange={(e) => onSelectedSkillIdChange(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="">Select a skill...</option>
            {eligibleSkills.map((skill) => (
              <option key={skill.id} value={skill.id}>
                {skill.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Rating Selector */}
      {software.hasRating && (
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Rating
          </label>
          <RatingSelector
            value={rating}
            min={software.minRating || 1}
            max={Math.min(
              software.maxRating || 6,
              Math.max(
                ...Object.entries(software.ratings || {})
                  .filter(([, data]) => data.availability <= MAX_AVAILABILITY)
                  .map(([r]) => parseInt(r, 10))
              )
            )}
            onChange={onRatingChange}
          />
        </div>
      )}

      <CostCard cost={cost} remaining={remaining} colorClass="text-blue-600 dark:text-blue-400" />
    </div>
  );
}

// =============================================================================
// COST CARD (shared)
// =============================================================================

function CostCard({
  cost,
  remaining,
  colorClass,
}: {
  cost: number;
  remaining: number;
  colorClass: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Cost</span>
        <span
          className={`font-semibold ${
            cost <= remaining ? colorClass : "text-red-600 dark:text-red-400"
          }`}
        >
          {formatCurrency(cost)}¥
        </span>
      </div>
    </div>
  );
}
