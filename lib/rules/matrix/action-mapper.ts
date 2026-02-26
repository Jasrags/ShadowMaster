/**
 * Action Mapper
 *
 * Bridges the gap between ActionDefinition (ruleset data format) and
 * MatrixAction (rule engine format). The ruleset stores matrix actions
 * as ActionDefinition objects; the dice pool calculator and action
 * validator expect MatrixAction objects.
 */

import type { ActionDefinition, ActionSubcategory } from "@/lib/types/action-definitions";
import type { MatrixAction, MatrixActionCategory } from "@/lib/types/matrix";

/**
 * Map ActionDefinition subcategory to MatrixActionCategory.
 *
 * The mapping follows SR5 conventions:
 * - "hacking" subcategory → "sleaze" (covert actions)
 * - "cybercombat" → "attack" (offensive actions)
 * - "electronic-warfare" → "device" (general/utility)
 * - "technomancer" → "persona" (complex forms)
 *
 * Individual actions may override this via limitType when the mapping
 * is ambiguous (e.g., Erase Mark is "hacking" subcategory but uses Attack limit).
 */
export function subcategoryToMatrixCategory(subcategory?: ActionSubcategory): MatrixActionCategory {
  switch (subcategory) {
    case "hacking":
      return "sleaze";
    case "cybercombat":
      return "attack";
    case "electronic-warfare":
      return "device";
    case "technomancer":
      return "persona";
    default:
      return "persona";
  }
}

/**
 * Map a limitType display string to a typed ASDF attribute.
 */
export function limitTypeToAttribute(
  limitType?: string
): "attack" | "sleaze" | "dataProcessing" | "firewall" {
  switch (limitType?.toLowerCase()) {
    case "attack":
      return "attack";
    case "sleaze":
      return "sleaze";
    case "data processing":
      return "dataProcessing";
    case "firewall":
      return "firewall";
    default:
      return "dataProcessing";
  }
}

/**
 * Convert an ActionDefinition (ruleset format) to a MatrixAction (rule engine format).
 *
 * Used to bridge the component's ActionDefinition data to the rule engine
 * functions like calculateMatrixDicePool() and validateMatrixAction().
 */
export function actionDefinitionToMatrixAction(action: ActionDefinition): MatrixAction | null {
  // Actions without rollConfig can't be converted to a meaningful MatrixAction
  if (!action.rollConfig?.skill || !action.rollConfig?.attribute) {
    return null;
  }

  // Extract marks required from prerequisites
  const markPrereq = action.prerequisites?.find(
    (p) => p.type === "resource" && p.requirement === "marks"
  );
  const marksRequired = markPrereq?.minimumValue ?? 0;

  // Determine legality from tags
  const legality = action.tags?.includes("illegal") ? "illegal" : "legal";

  // Map category — use limitType as primary signal since it's more specific
  const limitAttribute = limitTypeToAttribute(action.rollConfig.limitType);
  let category: MatrixActionCategory;
  if (action.subcategory) {
    category = subcategoryToMatrixCategory(action.subcategory);
  } else {
    // Fallback: derive from limit attribute
    category =
      limitAttribute === "attack" ? "attack" : limitAttribute === "sleaze" ? "sleaze" : "device";
  }

  return {
    id: action.id,
    name: action.name,
    description: action.description,
    category,
    legality,
    marksRequired,
    limitAttribute,
    skill: action.rollConfig.skill,
    attribute: action.rollConfig.attribute,
  };
}
