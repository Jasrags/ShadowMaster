import type { WeaponConsumable } from '../../lib/types';
import { formatCost } from '../../lib/formatUtils';
import { ViewModal } from '../common/ViewModal';
import { Section, FieldGrid, LabelValue } from '../common/FieldDisplay';

interface WeaponConsumableViewModalProps {
  consumable: WeaponConsumable | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function WeaponConsumableViewModal({ consumable, isOpen, onOpenChange }: WeaponConsumableViewModalProps) {
  if (!consumable) return null;

  return (
    <ViewModal
      item={consumable}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      subtitle={
        <span className="text-gray-400">
          Source: {consumable.source?.source || 'Unknown'} • Category: {consumable.category}
        </span>
      }
      maxWidth="2xl"
    >
      <div className="space-y-4">
        <Section title="Details">
          <FieldGrid columns={2}>
            <LabelValue label="ID" value={<span className="font-mono text-xs">{consumable.id}</span>} />
            <LabelValue label="Category" value={consumable.category} />
            <LabelValue label="Cost" value={formatCost(consumable.cost)} />
            {consumable.quantity_per_purchase && (
              <LabelValue
                label="Quantity per Purchase"
                value={`${consumable.quantity_per_purchase} ${consumable.unit_type || 'units'}`}
              />
            )}
            {consumable.availability && (
              <LabelValue label="Availability" value={consumable.availability} />
            )}
            <LabelValue
              label="Source"
              value={`${consumable.source?.source || '-'}${consumable.source?.page ? ` (p. ${consumable.source.page})` : ''}`}
            />
          </FieldGrid>
        </Section>

        {/* Base Stats (for ammunition that replaces weapon stats) */}
        {(consumable.base_dv || consumable.base_ap || consumable.base_acc) && (
          <Section title="Base Stats">
            <FieldGrid columns={2}>
              {consumable.base_dv && (
                <LabelValue label="Damage Value" value={consumable.base_dv} />
              )}
              {consumable.base_ap && (
                <LabelValue label="Armor Penetration" value={consumable.base_ap} />
              )}
              {consumable.base_acc && (
                <LabelValue label="Accuracy" value={consumable.base_acc} />
              )}
            </FieldGrid>
          </Section>
        )}

        {/* Modifier Stats (for ammunition that modifies weapon stats) */}
        {(consumable.modifier_dv || consumable.modifier_ap || consumable.modifier_acc) && (
          <Section title="Modifiers">
            <FieldGrid columns={2}>
              {consumable.modifier_dv && (
                <LabelValue label="Damage Value Modifier" value={consumable.modifier_dv} />
              )}
              {consumable.modifier_ap && (
                <LabelValue label="Armor Penetration Modifier" value={consumable.modifier_ap} />
              )}
              {consumable.modifier_acc && (
                <LabelValue label="Accuracy Modifier" value={consumable.modifier_acc} />
              )}
            </FieldGrid>
          </Section>
        )}

        {/* Direct Stats (for grenades, rockets, missiles) */}
        {(consumable.dv || consumable.ap || consumable.blast) && (
          <Section title="Stats">
            <FieldGrid columns={2}>
              {consumable.dv && (
                <LabelValue label="Damage Value" value={consumable.dv} />
              )}
              {consumable.ap && (
                <LabelValue label="Armor Penetration" value={consumable.ap} />
              )}
              {consumable.blast && (
                <LabelValue label="Blast" value={consumable.blast} />
              )}
            </FieldGrid>
          </Section>
        )}

        {consumable.description && (
          <Section title="Description">
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
              {consumable.description}
            </p>
          </Section>
        )}
      </div>
    </ViewModal>
  );
}

