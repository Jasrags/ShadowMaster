/**
 * Shapeshifter Character Creation Rules
 *
 * Pure logic for shapeshifter species identification, metahuman form selection,
 * and karma costs. Based on Run Faster pp. 101-107.
 *
 * Key rules:
 * - Shapeshifters must select a metahuman form (human, dwarf, elf, ork, troll)
 * - Metahuman form has an additional karma cost
 * - Shapeshifters cannot be technomancers (no Resonance)
 * - All shapeshifters have innate Magic attribute
 */

/**
 * All 10 shapeshifter species IDs from Run Faster data.
 * These match the metatype catalog entries in run-faster.json.
 */
export const SHAPESHIFTER_METATYPE_IDS: readonly string[] = [
  "shapeshifter-bovine",
  "shapeshifter-canine",
  "shapeshifter-equine",
  "shapeshifter-falconine",
  "shapeshifter-leonine",
  "shapeshifter-lupine",
  "shapeshifter-pantherine",
  "shapeshifter-tigrine",
  "shapeshifter-ursine",
  "shapeshifter-vulpine",
] as const;

/**
 * Check if a metatype ID is a shapeshifter species.
 */
export function isShapeshifterMetatype(id: string): boolean {
  return SHAPESHIFTER_METATYPE_IDS.includes(id);
}

/**
 * Karma costs for selecting a metahuman form (Run Faster p. 101).
 * Human form is free; more exotic forms cost more karma.
 */
export const METAHUMAN_FORM_KARMA_COSTS: Readonly<Record<string, number>> = {
  human: 0,
  dwarf: 8,
  elf: 5,
  ork: 10,
  troll: 20,
} as const;

/**
 * Available metahuman form options for shapeshifters.
 * Each shapeshifter must choose one of these forms.
 */
export const METAHUMAN_FORM_OPTIONS: readonly { readonly id: string; readonly name: string }[] = [
  { id: "human", name: "Human" },
  { id: "dwarf", name: "Dwarf" },
  { id: "elf", name: "Elf" },
  { id: "ork", name: "Ork" },
  { id: "troll", name: "Troll" },
] as const;

/**
 * Valid metahuman form IDs for validation.
 */
export const VALID_METAHUMAN_FORM_IDS: readonly string[] = METAHUMAN_FORM_OPTIONS.map(
  (opt) => opt.id
);

/**
 * Get the karma cost for a metahuman form selection.
 * Returns undefined if the form ID is not valid.
 */
export function getMetahumanFormKarmaCost(formId: string): number | undefined {
  return METAHUMAN_FORM_KARMA_COSTS[formId];
}
