import type { Power } from '../../lib/types';
import { ViewModal } from '../common/ViewModal';
import { Section, FieldGrid, LabelValue } from '../common/FieldDisplay';

interface PowerViewModalProps {
  power: Power | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function PowerViewModal({ power, isOpen, onOpenChange }: PowerViewModalProps) {
  if (!power) return null;

  return (
    <ViewModal
      item={power}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      subtitle={power.activation_description ? <span className="text-gray-400">{power.activation_description}</span> : undefined}
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {power.description && (
          <Section title="Description">
            <p className="text-sm text-gray-200 whitespace-pre-wrap">{power.description}</p>
          </Section>
        )}

        <Section title="Details">
          <FieldGrid columns={2}>
            {power.activation && (
              <LabelValue
                label="Activation"
                value={power.activation_description || power.activation.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              />
            )}
            {power.cost && (
              <LabelValue label="Cost" value={power.cost.formula || '-'} />
            )}
            {power.prerequisite && (
              <LabelValue label="Prerequisite" value={power.prerequisite} />
            )}
            {power.parameter && (
              <LabelValue label="Parameter" value={power.parameter} />
            )}
            {power.source?.source && (
              <LabelValue label="Source" value={power.source.source} />
            )}
            {power.source?.page && (
              <LabelValue label="Page" value={power.source.page} />
            )}
          </FieldGrid>
        </Section>
      </div>
    </ViewModal>
  );
}

