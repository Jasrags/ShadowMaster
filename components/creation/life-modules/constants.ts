import type { LifeModulePhase } from "@/lib/types";

export interface PhaseInfo {
  readonly label: string;
  readonly description: string;
  readonly required: boolean;
  readonly allowMultiple: boolean;
}

export const PHASE_ORDER: readonly LifeModulePhase[] = [
  "nationality",
  "formative",
  "teen",
  "education",
  "career",
  "tour",
];

export const PHASE_INFO: Record<LifeModulePhase, PhaseInfo> = {
  nationality: {
    label: "Nationality",
    description: "Where you're from (15 Karma)",
    required: true,
    allowMultiple: false,
  },
  formative: {
    label: "Formative Years",
    description: "Childhood, age to 10 (40 Karma)",
    required: true,
    allowMultiple: false,
  },
  teen: {
    label: "Teen Years",
    description: "Teenage years, age to 17 (50 Karma)",
    required: true,
    allowMultiple: false,
  },
  education: {
    label: "Further Education",
    description: "Optional higher education (40-115 Karma)",
    required: false,
    allowMultiple: false,
  },
  career: {
    label: "Real Life",
    description: "Career modules, 4 years each (100 Karma)",
    required: false,
    allowMultiple: true,
  },
  tour: {
    label: "Tour of Duty",
    description: "Military service, 5 years each (100 Karma)",
    required: false,
    allowMultiple: true,
  },
};
