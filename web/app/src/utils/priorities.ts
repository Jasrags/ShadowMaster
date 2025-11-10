import { CharacterCreationData, PriorityCategory, PriorityCode, PriorityOption } from '../types/editions';

export const PRIORITY_CATEGORIES: PriorityCategory[] = [
  'magic',
  'metatype',
  'attributes',
  'skills',
  'resources',
];

const DEFAULT_PRIORITY_CODES: PriorityCode[] = ['A', 'B', 'C', 'D', 'E'];

const CATEGORY_LABELS: Record<PriorityCategory, string> = {
  magic: 'Magic',
  metatype: 'Metatype',
  attributes: 'Attributes',
  skills: 'Skills',
  resources: 'Resources',
};

export function getCategoryLabel(category: PriorityCategory): string {
  return CATEGORY_LABELS[category];
}

export interface PriorityOptionDescriptor {
  code: PriorityCode;
  option: PriorityOption;
}

export function getPriorityOptions(
  data: CharacterCreationData | undefined,
  category: PriorityCategory,
): PriorityOptionDescriptor[] {
  const categoryTable = data?.priorities?.[category];
  if (!categoryTable) {
    return DEFAULT_PRIORITY_CODES.map((code) => ({
      code,
      option: { label: `Priority ${code}` },
    }));
  }

  return DEFAULT_PRIORITY_CODES.map((code) => {
    const option = categoryTable[code] ?? { label: `Priority ${code}` };
    return { code, option };
  });
}

export type PriorityAssignments = Record<PriorityCategory, PriorityCode | ''>;

export function createEmptyAssignments(): PriorityAssignments {
  return {
    magic: '',
    metatype: '',
    attributes: '',
    skills: '',
    resources: '',
  };
}
