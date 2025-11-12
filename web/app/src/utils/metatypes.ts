import { CharacterCreationData, MetatypeDefinition, PriorityCode } from '../types/editions';

const ATTRIBUTE_LABELS: Record<string, string> = {
  // SR3 attributes
  body: 'Body',
  quickness: 'Quickness',
  strength: 'Strength',
  charisma: 'Charisma',
  intelligence: 'Intelligence',
  willpower: 'Willpower',
  // SR5 attributes
  agility: 'Agility',
  reaction: 'Reaction',
  logic: 'Logic',
  intuition: 'Intuition',
  edge: 'Edge',
};

export interface MetatypeDisplayDefinition extends MetatypeDefinition {
  priorityAllowed: boolean;
}

export function getMetatypesForPriority(
  data: CharacterCreationData | undefined,
  priority: PriorityCode | '',
): MetatypeDisplayDefinition[] {
  if (!data) {
    return [];
  }

  const normalizedPriority = (priority || 'E') as PriorityCode;
  return data.metatypes
    .map((metatype) => ({
      ...metatype,
      priorityAllowed: metatype.priority_tiers?.includes(normalizedPriority) ?? false,
    }))
    .filter((metatype) => metatype.priorityAllowed);
}

export function formatModifier(value: number): string {
  if (value === 0) {
    return '+0';
  }
  return value > 0 ? `+${value}` : `${value}`;
}

export function formatAttributeLabel(attributeKey: string): string {
  const normalized = attributeKey.toLowerCase();
  const label = ATTRIBUTE_LABELS[normalized];
  if (label) {
    return label;
  }
  // Fallback: capitalize first letter if not found
  return attributeKey.charAt(0).toUpperCase() + attributeKey.slice(1);
}
