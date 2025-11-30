import type { VehicleModification } from '../../lib/types';
import { ViewModal } from '../common/ViewModal';
import { Section, FieldGrid, LabelValue } from '../common/FieldDisplay';

interface VehicleModificationViewModalProps {
  modification: VehicleModification | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function VehicleModificationViewModal({ modification, isOpen, onOpenChange }: VehicleModificationViewModalProps) {
  if (!modification) return null;

  return (
    <ViewModal
      item={modification}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      subtitle={modification.type ? <span className="text-gray-400">{modification.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span> : undefined}
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {modification.description && (
          <Section title="Description">
            <p className="text-sm text-gray-200 whitespace-pre-wrap">{modification.description}</p>
          </Section>
        )}

        <Section title="Details">
          <FieldGrid columns={2}>
            {modification.type && (
              <LabelValue
                label="Type"
                value={modification.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              />
            )}
            {modification.slots && (
              <LabelValue label="Slots" value={modification.slots.description || '-'} />
            )}
            {modification.cost && (
              <LabelValue label="Cost" value={modification.cost.formula || '-'} />
            )}
            {modification.availability && (
              <LabelValue
                label="Availability"
                value={
                  modification.availability.value !== undefined
                    ? `${modification.availability.value}${modification.availability.restricted ? 'R' : ''}${modification.availability.forbidden ? 'F' : ''}`
                    : modification.availability.formula || '-'
                }
              />
            )}
            {modification.tools && (
              <LabelValue label="Tools" value={<span className="capitalize">{modification.tools}</span>} />
            )}
            {modification.skill && (
              <LabelValue label="Skill" value={<span className="capitalize">{modification.skill}</span>} />
            )}
            {modification.source?.source && (
              <LabelValue label="Source" value={modification.source.source} />
            )}
            {modification.source?.page && (
              <LabelValue label="Page" value={modification.source.page} />
            )}
          </FieldGrid>
        </Section>
      </div>
    </ViewModal>
  );
}

