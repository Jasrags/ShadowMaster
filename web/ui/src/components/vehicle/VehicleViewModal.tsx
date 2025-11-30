import type { Vehicle } from '../../lib/types';
import { ViewModal } from '../common/ViewModal';
import { Section, FieldGrid, LabelValue } from '../common/FieldDisplay';

interface VehicleViewModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function VehicleViewModal({ vehicle, isOpen, onOpenChange }: VehicleViewModalProps) {
  if (!vehicle) return null;

  return (
    <ViewModal
      item={vehicle}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      subtitle={vehicle.type ? <span className="text-gray-400">{vehicle.type.replace(/\b\w/g, l => l.toUpperCase())}</span> : undefined}
      maxWidth="2xl"
    >
      <div className="space-y-4">
        <Section title="Details">
          <FieldGrid columns={2}>
            {vehicle.type && (
              <LabelValue
                label="Type"
                value={vehicle.type.replace(/\b\w/g, l => l.toUpperCase())}
              />
            )}
            {vehicle.subtype && (
              <LabelValue
                label="Subtype"
                value={vehicle.subtype.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              />
            )}
            {vehicle.handling && (
              <LabelValue
                label="Handling"
                value={
                  vehicle.handling.off_road !== undefined
                    ? `${vehicle.handling.on_road}/${vehicle.handling.off_road}`
                    : String(vehicle.handling.on_road || '-')
                }
              />
            )}
            {vehicle.speed && (
              <LabelValue
                label="Speed"
                value={
                  vehicle.speed.value !== undefined
                    ? `${vehicle.speed.value}${vehicle.speed.movement_type || ''}`
                    : '-'
                }
              />
            )}
            {vehicle.acceleration !== undefined && (
              <LabelValue label="Acceleration" value={vehicle.acceleration} />
            )}
            {vehicle.body && (
              <LabelValue
                label="Body"
                value={
                  vehicle.body.value !== undefined
                    ? `${vehicle.body.value}${vehicle.body.structure !== undefined ? `(${vehicle.body.structure})` : ''}`
                    : '-'
                }
              />
            )}
            {vehicle.armor !== undefined && (
              <LabelValue label="Armor" value={vehicle.armor} />
            )}
            {vehicle.pilot !== undefined && (
              <LabelValue label="Pilot" value={vehicle.pilot} />
            )}
            {vehicle.sensor !== undefined && (
              <LabelValue label="Sensor" value={vehicle.sensor} />
            )}
            {vehicle.seats !== undefined && (
              <LabelValue label="Seats" value={vehicle.seats} />
            )}
            {vehicle.cost !== undefined && (
              <LabelValue label="Cost" value={`${vehicle.cost.toLocaleString()}¥`} />
            )}
            {vehicle.availability && (
              <LabelValue
                label="Availability"
                value={
                  vehicle.availability.value !== undefined
                    ? `${vehicle.availability.value}${vehicle.availability.restricted ? 'R' : ''}${vehicle.availability.forbidden ? 'F' : ''}`
                    : '-'
                }
              />
            )}
            {vehicle.source?.source && (
              <LabelValue label="Source" value={vehicle.source.source} />
            )}
            {vehicle.source?.page && (
              <LabelValue label="Page" value={vehicle.source.page} />
            )}
          </FieldGrid>
        </Section>
      </div>
    </ViewModal>
  );
}

