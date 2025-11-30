import type { Metatype } from '../../lib/types';
import { ViewModal } from '../common/ViewModal';
import { Section, FieldGrid, LabelValue } from '../common/FieldDisplay';

interface MetatypeViewModalProps {
  metatype: Metatype | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function MetatypeViewModal({ metatype, isOpen, onOpenChange }: MetatypeViewModalProps) {
  if (!metatype) return null;

  return (
    <ViewModal
      item={metatype}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      subtitle={metatype.category ? <span className="text-gray-400 capitalize">{metatype.category}</span> : undefined}
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {metatype.description && (
          <Section title="Description">
            <p className="text-sm text-gray-200 whitespace-pre-wrap">{metatype.description}</p>
          </Section>
        )}

        <Section title="Details">
          <FieldGrid columns={2}>
            {metatype.category && (
              <LabelValue label="Category" value={<span className="capitalize">{metatype.category}</span>} />
            )}
            {metatype.base_race && (
              <LabelValue label="Base Race" value={metatype.base_race} />
            )}
            {metatype.essence !== undefined && (
              <LabelValue label="Essence" value={metatype.essence} />
            )}
            {metatype.body && (
              <LabelValue
                label="Body"
                value={
                  metatype.body.min !== undefined && metatype.body.max !== undefined
                    ? `${metatype.body.min}-${metatype.body.max}`
                    : metatype.body.min !== undefined
                    ? `${metatype.body.min}+`
                    : '-'
                }
              />
            )}
            {metatype.source?.source && (
              <LabelValue label="Source" value={metatype.source.source} />
            )}
            {metatype.source?.page && (
              <LabelValue label="Page" value={metatype.source.page} />
            )}
          </FieldGrid>
        </Section>

        {metatype.racial_traits && metatype.racial_traits.length > 0 && (
          <Section title="Racial Traits">
            <div className="space-y-2">
              {metatype.racial_traits.map((trait, index) => (
                <div key={index} className="bg-sr-dark border border-sr-light-gray rounded p-3">
                  <div className="font-medium text-gray-200">{trait.name}</div>
                  {trait.description && (
                    <div className="text-sm text-gray-300 mt-1">{trait.description}</div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </ViewModal>
  );
}

