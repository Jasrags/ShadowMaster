import type { Action } from '../../lib/types';
import { ViewModal } from '../common/ViewModal';
import { Section, FieldGrid, LabelValue } from '../common/FieldDisplay';

interface ActionViewModalProps {
  action: Action | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ActionViewModal({ action, isOpen, onOpenChange }: ActionViewModalProps) {
  if (!action) return null;

  return (
    <ViewModal
      item={action}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      subtitle={action.type ? <span className="text-gray-400 capitalize">{action.type}</span> : undefined}
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {action.description && (
          <Section title="Description">
            <p className="text-sm text-gray-200 whitespace-pre-wrap">{action.description}</p>
          </Section>
        )}

        <Section title="Details">
          <FieldGrid columns={2}>
            {action.type && (
              <LabelValue label="Type" value={<span className="capitalize">{action.type}</span>} />
            )}
            {action.initiative_cost !== undefined && (
              <LabelValue label="Initiative Cost" value={action.initiative_cost} />
            )}
            {action.source?.source && (
              <LabelValue label="Source" value={action.source.source} />
            )}
            {action.source?.page && (
              <LabelValue label="Page" value={action.source.page} />
            )}
          </FieldGrid>
        </Section>
      </div>
    </ViewModal>
  );
}

