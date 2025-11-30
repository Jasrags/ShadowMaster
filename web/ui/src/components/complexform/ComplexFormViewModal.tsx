import type { ComplexForm } from '../../lib/types';
import { ViewModal } from '../common/ViewModal';
import { Section, FieldGrid, LabelValue } from '../common/FieldDisplay';

interface ComplexFormViewModalProps {
  complexForm: ComplexForm | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ComplexFormViewModal({ complexForm, isOpen, onOpenChange }: ComplexFormViewModalProps) {
  if (!complexForm) return null;

  return (
    <ViewModal
      item={complexForm}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {complexForm.description && (
          <Section title="Description">
            <p className="text-sm text-gray-200 whitespace-pre-wrap">{complexForm.description}</p>
          </Section>
        )}

        <Section title="Details">
          <FieldGrid columns={2}>
            {complexForm.target && (
              <LabelValue
                label="Target"
                value={complexForm.target.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              />
            )}
            {complexForm.duration && (
              <LabelValue
                label="Duration"
                value={complexForm.duration.description || complexForm.duration.type || '-'}
              />
            )}
            {complexForm.fading && (
              <LabelValue label="Fading" value={complexForm.fading.formula || '-'} />
            )}
            {complexForm.source?.source && (
              <LabelValue label="Source" value={complexForm.source.source} />
            )}
            {complexForm.source?.page && (
              <LabelValue label="Page" value={complexForm.source.page} />
            )}
          </FieldGrid>
        </Section>
      </div>
    </ViewModal>
  );
}

