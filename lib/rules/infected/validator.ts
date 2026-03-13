import type { InfectedCatalogData, InfectedTypeData } from "./types";

export function isCharacterInfected(qualities: ReadonlyArray<{ qualityId: string }>): boolean {
  return qualities.some((q) => q.qualityId === "hmhvv-infected");
}

export function validateInfectedPrerequisites(
  infectedTypeId: string,
  characterMetatype: string,
  catalog: InfectedCatalogData
): { valid: boolean; error?: string } {
  const infectedType = getInfectedType(infectedTypeId, catalog);

  if (!infectedType) {
    return { valid: false, error: `Unknown infected type: ${infectedTypeId}` };
  }

  const metatypeLower = characterMetatype.toLowerCase();
  const allowedMetatypes = infectedType.baseMetatypes.map((m) => m.toLowerCase());

  if (!allowedMetatypes.includes("any") && !allowedMetatypes.includes(metatypeLower)) {
    return {
      valid: false,
      error: `${infectedType.name} requires metatype: ${infectedType.baseMetatypes.join(", ")}. Character is ${characterMetatype}.`,
    };
  }

  return { valid: true };
}

export function getInfectedType(
  typeId: string,
  catalog: InfectedCatalogData
): InfectedTypeData | undefined {
  return catalog.types.find((t) => t.id === typeId);
}
