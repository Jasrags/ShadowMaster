import type { Lifestyle } from '../../lib/types';
import { formatCost } from '../../lib/formatUtils';
import { ViewModal } from '../common/ViewModal';
import { Section, FieldGrid, LabelValue } from '../common/FieldDisplay';

interface LifestyleViewModalProps {
  lifestyle: Lifestyle | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function LifestyleViewModal({ lifestyle, isOpen, onOpenChange }: LifestyleViewModalProps) {
  if (!lifestyle) return null;

  return (
    <ViewModal
      item={lifestyle}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      subtitle={
        <span className="text-gray-400">
          Source: {lifestyle.source} • Cost: {formatCost(lifestyle.cost)}
        </span>
      }
      maxWidth="2xl"
    >
      <div className="space-y-4">
        <Section title="Details">
          <FieldGrid columns={2}>
            <LabelValue label="ID" value={<span className="font-mono text-xs">{lifestyle.id}</span>} />
            <LabelValue label="Cost" value={formatCost(lifestyle.cost)} />
            <LabelValue label="Source" value={lifestyle.source} />
          </FieldGrid>
        </Section>

        {lifestyle.description && (
          <Section title="Description">
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
              {lifestyle.description}
            </p>
          </Section>
        )}
      </div>
    </ViewModal>
  );
}

