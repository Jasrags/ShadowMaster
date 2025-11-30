import type { Tradition } from '../../lib/types';
import { ViewModal } from '../common/ViewModal';
import { Section, FieldGrid, LabelValue } from '../common/FieldDisplay';

interface TraditionViewModalProps {
  tradition: Tradition | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function TraditionViewModal({ tradition, isOpen, onOpenChange }: TraditionViewModalProps) {
  if (!tradition) return null;

  return (
    <ViewModal
      item={tradition}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {tradition.description && (
          <Section title="Description">
            <p className="text-sm text-gray-200 whitespace-pre-wrap">{tradition.description}</p>
          </Section>
        )}

        <Section title="Details">
          <FieldGrid columns={2}>
            {tradition.drain_formula && (
              <LabelValue label="Drain Formula" value={tradition.drain_formula} />
            )}
            {tradition.drain_attributes && tradition.drain_attributes.length > 0 && (
              <LabelValue label="Drain Attributes" value={tradition.drain_attributes.join(', ')} />
            )}
            {tradition.source?.source && (
              <LabelValue label="Source" value={tradition.source.source} />
            )}
            {tradition.source?.page && (
              <LabelValue label="Page" value={tradition.source.page} />
            )}
          </FieldGrid>
        </Section>

        {(tradition.combat_element || tradition.detection_element || tradition.health_element || tradition.illusion_element || tradition.manipulation_element) && (
          <Section title="Elements">
            <FieldGrid columns={2}>
              {tradition.combat_element && (
                <LabelValue label="Combat" value={tradition.combat_element} />
              )}
              {tradition.detection_element && (
                <LabelValue label="Detection" value={tradition.detection_element} />
              )}
              {tradition.health_element && (
                <LabelValue label="Health" value={tradition.health_element} />
              )}
              {tradition.illusion_element && (
                <LabelValue label="Illusion" value={tradition.illusion_element} />
              )}
              {tradition.manipulation_element && (
                <LabelValue label="Manipulation" value={tradition.manipulation_element} />
              )}
            </FieldGrid>
          </Section>
        )}
      </div>
    </ViewModal>
  );
}

