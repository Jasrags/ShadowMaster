"use client";

import { useState, useMemo } from "react";
import { Button, RadioGroup, Radio } from "react-aria-components";
import type { Identity, SIN, SinnerQuality, GearItem } from "@/lib/types";
import { SinnerQuality as SinnerQualityEnum } from "@/lib/types/character";

interface IdentityEditorProps {
  identity: Identity;
  fakeSINsFromGear: GearItem[];
  hasSINnerQuality: boolean;
  sinnerQualityLevel: SinnerQuality | null;
  onSave: (identity: Identity) => void;
  onCancel: () => void;
}

export function IdentityEditor({
  identity,
  fakeSINsFromGear,
  hasSINnerQuality,
  sinnerQualityLevel,
  onSave,
  onCancel,
}: IdentityEditorProps) {
  const [name, setName] = useState(identity.name || "");
  const [sinType, setSinType] = useState<"fake" | "real">(identity.sin?.type || "fake");
  const [fakeSINRating, setFakeSINRating] = useState<number>(
    identity.sin?.type === "fake" ? identity.sin.rating : 1
  );
  // Initialize selected fake SIN gear if identity already has a fake SIN
  const initialFakeSINGearId = useMemo(() => {
    if (identity.sin?.type === "fake" && fakeSINsFromGear.length > 0) {
      // For now, just select first available (simplified - in real implementation might need better matching)
      return fakeSINsFromGear[0]?.id || null;
    }
    return null;
  }, [identity.sin?.type, fakeSINsFromGear]);
  
  const [selectedFakeSINGearId, setSelectedFakeSINGearId] = useState<string | null>(initialFakeSINGearId);
  const [realSINQuality, setRealSINQuality] = useState<SinnerQuality>(
    identity.sin?.type === "real" 
      ? identity.sin.sinnerQuality 
      : (sinnerQualityLevel || SinnerQualityEnum.National)
  );

  // Validation
  const isValid = useMemo(() => {
    if (!name.trim()) return false;
    if (sinType === "fake") {
      if (fakeSINRating < 1 || fakeSINRating > 4) return false;
      // If fake SINs from gear are available, must select one
      if (fakeSINsFromGear.length > 0 && !selectedFakeSINGearId) return false;
    } else {
      if (!hasSINnerQuality) return false;
    }
    return true;
  }, [name, sinType, fakeSINRating, selectedFakeSINGearId, hasSINnerQuality, fakeSINsFromGear.length]);

  const handleSave = () => {
    let sin: SIN;
    
    if (sinType === "fake") {
      sin = {
        type: "fake",
        rating: fakeSINRating,
      };
    } else {
      sin = {
        type: "real",
        sinnerQuality: realSINQuality,
      };
    }

    const updatedIdentity: Identity = {
      ...identity,
      name: name.trim(),
      sin,
      licenses: identity.licenses || [],
    };

    onSave(updatedIdentity);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {identity.name ? "Edit Identity" : "New Identity"}
        </h3>

        {/* Identity Name */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Identity Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., John Smith, Jane Doe"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>

        {/* SIN Type Selection */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            SIN Type
          </label>
          <RadioGroup
            value={sinType}
            onChange={(value) => setSinType(value as "fake" | "real")}
            className="space-y-2"
          >
            <Radio
              value="fake"
              className="flex items-center gap-2 rounded-md border border-zinc-300 p-3 data-[selected]:border-blue-500 data-[selected]:bg-blue-50 dark:border-zinc-700 dark:data-[selected]:border-blue-500 dark:data-[selected]:bg-blue-900/20"
            >
              <div>
                <div className="font-medium text-zinc-900 dark:text-zinc-50">Fake SIN</div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400">
                  Purchased as gear (Rating 1-4)
                </div>
              </div>
            </Radio>
            <Radio
              value="real"
              className="flex items-center gap-2 rounded-md border border-zinc-300 p-3 data-[selected]:border-blue-500 data-[selected]:bg-blue-50 dark:border-zinc-700 dark:data-[selected]:border-blue-500 dark:data-[selected]:bg-blue-900/20"
              isDisabled={!hasSINnerQuality}
            >
              <div>
                <div className="font-medium text-zinc-900 dark:text-zinc-50">
                  Real SIN
                  {!hasSINnerQuality && (
                    <span className="ml-2 text-xs text-red-600 dark:text-red-400">
                      (Requires SINner quality)
                    </span>
                  )}
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400">
                  From SINner quality
                </div>
              </div>
            </Radio>
          </RadioGroup>
        </div>

        {/* Fake SIN Details */}
        {sinType === "fake" && (
          <div className="mb-4 space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            {fakeSINsFromGear.length > 0 ? (
              <>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Select Fake SIN from Gear
                </label>
                <select
                  value={selectedFakeSINGearId || ""}
                  onChange={(e) => setSelectedFakeSINGearId(e.target.value || null)}
                  className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <option value="">Select a fake SIN...</option>
                  {fakeSINsFromGear.map((gear) => (
                    <option key={gear.id || gear.name} value={gear.id || gear.name}>
                      {gear.name} {gear.rating ? `(Rating ${gear.rating})` : ""}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Select the fake SIN you purchased in the Gear step.
                </p>
              </>
            ) : (
              <>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Fake SIN Rating
                </label>
                <select
                  value={fakeSINRating}
                  onChange={(e) => setFakeSINRating(Number.parseInt(e.target.value, 10))}
                  className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <option value={1}>Rating 1</option>
                  <option value={2}>Rating 2</option>
                  <option value={3}>Rating 3</option>
                  <option value={4}>Rating 4</option>
                </select>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  ⚠ No fake SINs found in gear. Make sure to purchase a fake SIN in the Gear step first.
                </p>
              </>
            )}
          </div>
        )}

        {/* Real SIN Details */}
        {sinType === "real" && (
          <div className="mb-4 space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              SINner Quality Type
            </label>
            <select
              value={realSINQuality}
              onChange={(e) => setRealSINQuality(e.target.value as SinnerQuality)}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            >
              <option value={SinnerQualityEnum.National}>National</option>
              <option value={SinnerQualityEnum.Criminal}>Criminal</option>
              <option value={SinnerQualityEnum.CorporateLimited}>Corporate Limited</option>
              <option value={SinnerQualityEnum.CorporateBorn}>Corporate Born</option>
            </select>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              This must match the SINner quality level selected in the Qualities step.
            </p>
          </div>
        )}

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
            Save Identity
          </Button>
        </div>
      </div>
    </div>
  );
}
