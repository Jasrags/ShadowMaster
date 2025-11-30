import type { Spell } from '../../lib/types';
import { ViewModal } from '../common/ViewModal';
import { Section, FieldGrid, LabelValue, ArrayDisplay } from '../common/FieldDisplay';

interface SpellViewModalProps {
  spell: Spell | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function SpellViewModal({ spell, isOpen, onOpenChange }: SpellViewModalProps) {
  if (!spell) return null;

  return (
    <ViewModal
      item={spell}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      subtitle={spell.category ? <span className="capitalize">{spell.category}</span> : undefined}
      maxWidth="2xl"
      showFooter={false}
    >
      <div className="space-y-4">
        {spell.description && (
          <Section title="Description">
            <p className="text-sm text-gray-200 whitespace-pre-wrap">{spell.description}</p>
          </Section>
        )}

        <Section title="Details">
          <FieldGrid columns={2}>
            {spell.category && (
              <LabelValue label="Category" value={<span className="capitalize">{spell.category}</span>} />
            )}
            {spell.type && (
              <LabelValue label="Type" value={<span className="capitalize">{spell.type}</span>} />
            )}
            {spell.range && <LabelValue label="Range" value={spell.range} />}
            {spell.duration && (
              <LabelValue label="Duration" value={<span className="capitalize">{spell.duration}</span>} />
            )}
            {spell.drain && <LabelValue label="Drain" value={spell.drain.formula || '-'} />}
            {spell.damage && (
              <LabelValue label="Damage" value={<span className="capitalize">{spell.damage}</span>} />
            )}
            {spell.source?.source && <LabelValue label="Source" value={spell.source.source} />}
            {spell.source?.page && <LabelValue label="Page" value={spell.source.page} />}
          </FieldGrid>
        </Section>

        {spell.effects && (spell.effects.keywords || spell.effects.description) && (
          <Section title="Effects">
            {spell.effects.keywords && spell.effects.keywords.length > 0 && (
              <div className="mb-2">
                <div className="text-xs text-gray-400 mb-1">Keywords</div>
                <ArrayDisplay
                  items={spell.effects.keywords}
                  itemClassName="px-2 py-1 bg-sr-accent/20 text-sr-accent rounded text-xs"
                />
              </div>
            )}
            {spell.effects.description && (
              <p className="text-sm text-gray-200">{spell.effects.description}</p>
            )}
          </Section>
        )}
      </div>
    </ViewModal>
  );
}

