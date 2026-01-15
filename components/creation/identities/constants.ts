import type { SinnerQuality } from "@/lib/types";
import { SinnerQuality as SinnerQualityEnum } from "@/lib/types/character";

export const SIN_COST_PER_RATING = 2500; // Rating x 2,500
export const LICENSE_COST_PER_RATING = 200; // Rating x 200

export const SINNER_QUALITY_LABELS: Record<SinnerQuality, string> = {
  [SinnerQualityEnum.National]: "National",
  [SinnerQualityEnum.Criminal]: "Criminal",
  [SinnerQualityEnum.CorporateLimited]: "Corporate (Limited)",
  [SinnerQualityEnum.CorporateBorn]: "Corporate Born",
};

export const COMMON_LICENSE_TYPES = [
  "Firearms License",
  "Magic User License",
  "Driver's License",
  "Vehicle Registration",
  "Restricted Augmentation License",
  "Security License",
  "Private Investigator License",
  "Bounty Hunter License",
  "Bodyguard License",
  "Academic License",
  "Media License",
];

export const LIFESTYLE_TYPES = [
  { id: "street", name: "Street", monthlyCost: 0 },
  { id: "squatter", name: "Squatter", monthlyCost: 500 },
  { id: "low", name: "Low", monthlyCost: 2000 },
  { id: "medium", name: "Medium", monthlyCost: 5000 },
  { id: "high", name: "High", monthlyCost: 10000 },
  { id: "luxury", name: "Luxury", monthlyCost: 100000 },
];
