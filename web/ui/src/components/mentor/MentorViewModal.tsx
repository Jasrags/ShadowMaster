import type { Mentor } from '../../lib/types';
import { ViewModal } from '../common/ViewModal';
import { Section, FieldGrid, LabelValue } from '../common/FieldDisplay';

interface MentorViewModalProps {
  mentor: Mentor | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function MentorViewModal({ mentor, isOpen, onOpenChange }: MentorViewModalProps) {
  if (!mentor) return null;

  return (
    <ViewModal
      item={mentor}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {mentor.description && (
          <Section title="Description">
            <p className="text-sm text-gray-200 whitespace-pre-wrap">{mentor.description}</p>
          </Section>
        )}

        <Section title="Details">
          <FieldGrid columns={2}>
            {mentor.similar_archetypes && mentor.similar_archetypes.length > 0 && (
              <div className="col-span-2">
                <LabelValue label="Similar Archetypes" value={mentor.similar_archetypes.join(', ')} />
              </div>
            )}
            {mentor.source?.source && (
              <LabelValue label="Source" value={mentor.source.source} />
            )}
            {mentor.source?.page && (
              <LabelValue label="Page" value={mentor.source.page} />
            )}
          </FieldGrid>
        </Section>
      </div>
    </ViewModal>
  );
}

