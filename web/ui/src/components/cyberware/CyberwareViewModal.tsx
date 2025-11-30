import type { Cyberware } from '../../lib/types';
import { ViewModal } from '../common/ViewModal';
import { Section, FieldGrid, LabelValue } from '../common/FieldDisplay';

interface CyberwareViewModalProps {
  cyberware: Cyberware | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function CyberwareViewModal({ cyberware, isOpen, onOpenChange }: CyberwareViewModalProps) {
  if (!cyberware) return null;

  // Cyberware uses 'device' instead of 'name', so we need to create a compatible item
  const cyberwareWithName = { ...cyberware, name: cyberware.device || 'Unknown Cyberware' };

  return (
    <ViewModal
      item={cyberwareWithName}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      subtitle={cyberware.part ? <span className="text-gray-400">{cyberware.part}</span> : undefined}
      maxWidth="2xl"
    >
      <div className="space-y-4">
        <Section title="Details">
          <FieldGrid columns={2}>
            {cyberware.part && (
              <LabelValue label="Part" value={cyberware.part} />
            )}
            <LabelValue
              label="Essence"
              value={cyberware.essence || cyberware.essence_formula?.formula || '-'}
            />
            <LabelValue
              label="Capacity"
              value={cyberware.capacity || cyberware.capacity_formula?.formula || '-'}
            />
            <LabelValue
              label="Cost"
              value={cyberware.cost || cyberware.cost_formula?.formula || '-'}
            />
            <LabelValue
              label="Availability"
              value={cyberware.availability || cyberware.availability_formula?.formula || '-'}
            />
            {cyberware.source?.source && (
              <LabelValue label="Source" value={cyberware.source.source} />
            )}
            {cyberware.source?.page && (
              <LabelValue label="Page" value={cyberware.source.page} />
            )}
          </FieldGrid>
        </Section>
      </div>
    </ViewModal>
  );
}

