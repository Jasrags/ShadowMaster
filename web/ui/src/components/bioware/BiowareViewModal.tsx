import type { Bioware } from '../../lib/types';
import { ViewModal } from '../common/ViewModal';
import { Section, FieldGrid, LabelValue } from '../common/FieldDisplay';

interface BiowareViewModalProps {
  bioware: Bioware | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function BiowareViewModal({ bioware, isOpen, onOpenChange }: BiowareViewModalProps) {
  if (!bioware) return null;

  // Bioware uses 'device' instead of 'name', so we need to create a compatible item
  const biowareWithName = { ...bioware, name: bioware.device || 'Unknown Bioware' };

  return (
    <ViewModal
      item={biowareWithName}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      subtitle={bioware.type ? <span className="text-gray-400">{bioware.type}</span> : undefined}
      maxWidth="2xl"
    >
      <div className="space-y-4">
        <Section title="Details">
          <FieldGrid columns={2}>
            {bioware.type && (
              <LabelValue label="Type" value={bioware.type} />
            )}
            <LabelValue
              label="Essence"
              value={bioware.essence || bioware.essence_formula?.formula || '-'}
            />
            <LabelValue
              label="Cost"
              value={bioware.cost || bioware.cost_formula?.formula || '-'}
            />
            <LabelValue
              label="Availability"
              value={bioware.availability || bioware.availability_formula?.formula || '-'}
            />
            {bioware.source?.source && (
              <LabelValue label="Source" value={bioware.source.source} />
            )}
            {bioware.source?.page && (
              <LabelValue label="Page" value={bioware.source.page} />
            )}
          </FieldGrid>
        </Section>
      </div>
    </ViewModal>
  );
}

