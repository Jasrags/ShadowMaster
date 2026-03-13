export type { InfectedTypeData, DiseaseStrainData, InfectedCatalogData } from "./types";

export { isCharacterInfected, validateInfectedPrerequisites, getInfectedType } from "./validator";

export { applyInfectedAttributeBonuses, getAttributeBonusBreakdown } from "./attribute-modifier";
