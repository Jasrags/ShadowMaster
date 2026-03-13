export interface InfectedTypeData {
  id: string;
  name: string;
  source: { book: string; page: number };
  hmhvvStrain: string;
  baseMetatypes: string[];
  karmaCost: number;
  karmaCostAwakened?: number;
  physicalAttributeBonus: number;
  mentalAttributeBonus: number;
  mandatoryPowers: string[];
  optionalPowers: string[];
  weaknesses: string[];
  essenceDrain?: { method: string; description: string };
  notes?: string;
}

export interface DiseaseStrainData {
  id: string;
  name: string;
  vector: string;
  speed: string;
  power: number;
  description: string;
}

export interface InfectedCatalogData {
  types: InfectedTypeData[];
  diseaseStrains: DiseaseStrainData[];
  optionalPowerCosts: Record<string, number>;
}
