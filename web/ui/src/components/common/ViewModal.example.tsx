/**
 * Example: How to use the generic ViewModal component
 * 
 * This shows how SpellViewModal could be refactored to use the generic ViewModal
 * 
 * NOTE: This is an example file for demonstration purposes only
 */

import { useState } from 'react';
import { ViewModal } from './ViewModal';
import { Section, FieldGrid, LabelValue, ArrayDisplay } from './FieldDisplay';
import type { Spell } from '../../lib/types';

// BEFORE: Original SpellViewModal (130+ lines with modal structure)
// AFTER: Refactored using generic ViewModal (much simpler)

export function SpellViewModalRefactored({ spell, isOpen, onOpenChange }: {
  spell: Spell | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  if (!spell) return null;

  return (
    <ViewModal
      item={spell}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      subtitle={spell.category ? <span className="capitalize">{spell.category}</span> : undefined}
      maxWidth="2xl"
      showFooter={false} // SpellViewModal doesn't have a footer
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

/**
 * Alternative: Using sections prop (more declarative)
 */
export function SpellViewModalWithSections({ spell, isOpen, onOpenChange }: {
  spell: Spell | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  if (!spell) return null;

  return (
    <ViewModal
      item={spell}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      subtitle={spell.category ? <span className="capitalize">{spell.category}</span> : undefined}
      maxWidth="2xl"
      showFooter={false}
      sections={[
        {
          title: 'Description',
          content: <p className="text-sm text-gray-200 whitespace-pre-wrap">{spell.description}</p>,
          condition: !!spell.description,
        },
        {
          title: 'Details',
          content: (
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
          ),
        },
        {
          title: 'Effects',
          content: (
            <>
              {spell.effects?.keywords && spell.effects.keywords.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs text-gray-400 mb-1">Keywords</div>
                  <ArrayDisplay
                    items={spell.effects.keywords}
                    itemClassName="px-2 py-1 bg-sr-accent/20 text-sr-accent rounded text-xs"
                  />
                </div>
              )}
              {spell.effects?.description && (
                <p className="text-sm text-gray-200">{spell.effects.description}</p>
              )}
            </>
          ),
          condition: !!(spell.effects && (spell.effects.keywords || spell.effects.description)),
        },
      ]}
    />
  );
}

/**
 * Example with nested modals (like WeaponViewModal → WeaponAccessoryViewModal)
 */
export function WeaponViewModalWithNested({ weapon, isOpen, onOpenChange, accessoryMap }: {
  weapon: any;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  accessoryMap: Map<string, any>;
}) {
  const [selectedAccessory, setSelectedAccessory] = useState<any | null>(null);
  const [isAccessoryModalOpen, setIsAccessoryModalOpen] = useState(false);

  if (!weapon) return null;

  return (
    <ViewModal
      item={weapon}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      maxWidth="4xl"
      nestedModals={
        <WeaponAccessoryViewModal
          accessory={selectedAccessory}
          isOpen={isAccessoryModalOpen}
          onOpenChange={setIsAccessoryModalOpen}
        />
      }
    >
      {/* Custom content for weapon */}
      <div className="space-y-6">
        {/* Weapon-specific content */}
      </div>
    </ViewModal>
  );
}
