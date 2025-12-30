'use client';

/**
 * RiggingSummary - Displays character's rigging equipment and status
 *
 * Shows VCR status, active RCC, drone network count, and jumped-in status.
 */

import type { Character } from '@/lib/types/character';
import type { VehicleControlRig, RiggerVRMode } from '@/lib/types/rigging';

interface RiggingSummaryProps {
  character: Character;
  vcr?: VehicleControlRig | null;
  activeRCCId?: string | null;
  slavedDroneCount?: number;
  maxDrones?: number;
  jumpedInto?: {
    name: string;
    type: 'vehicle' | 'drone';
    vrMode: RiggerVRMode;
  } | null;
  className?: string;
}

export function RiggingSummary({
  character,
  vcr,
  activeRCCId,
  slavedDroneCount = 0,
  maxDrones = 0,
  jumpedInto = null,
  className = ''
}: RiggingSummaryProps) {
  const { vehicles = [], drones = [], rccs = [], autosofts = [] } = character;

  // Non-rigger characters
  const hasRiggingGear = vehicles.length > 0 || drones.length > 0 || rccs.length > 0;
  
  if (!hasRiggingGear && !vcr) {
    return (
      <div className={`rigging-summary rigging-summary--no-gear ${className}`}>
        <h3 className="rigging-summary__title">Rigging</h3>
        <p className="rigging-summary__no-rigging">No rigging equipment</p>
      </div>
    );
  }

  const activeRCC = rccs.find(r => r.id === activeRCCId) ?? rccs[0] ?? null;

  return (
    <div className={`rigging-summary ${className}`}>
      <h3 className="rigging-summary__title">Rigging</h3>

      {/* VCR Status */}
      {vcr && (
        <div className="rigging-summary__row">
          <span className="rigging-summary__label">Vehicle Control Rig:</span>
          <span className="rigging-summary__value">Rating {vcr.rating}</span>
        </div>
      )}

      {/* Jumped-In Status */}
      {jumpedInto && (
        <div className="rigging-summary__section rigging-summary__jumped-in">
          <span className="rigging-summary__label">Jumped Into:</span>
          <div className="rigging-summary__jump-details">
            <span className="rigging-summary__value">{jumpedInto.name}</span>
            <span className="rigging-summary__vr-mode">
              ({jumpedInto.vrMode === 'cold-sim' ? 'Cold-Sim' : 'Hot-Sim'})
            </span>
          </div>
        </div>
      )}

      {/* Active RCC */}
      {activeRCC && (
        <>
          <div className="rigging-summary__row">
            <span className="rigging-summary__label">RCC:</span>
            <span className="rigging-summary__value">{activeRCC.name}</span>
          </div>
          <div className="rigging-summary__row">
            <span className="rigging-summary__label">Device Rating:</span>
            <span className="rigging-summary__value">{activeRCC.deviceRating}</span>
          </div>
        </>
      )}

      {/* Drone Network */}
      {maxDrones > 0 && (
        <div className="rigging-summary__row">
          <span className="rigging-summary__label">Slaved Drones:</span>
          <span className="rigging-summary__value">
            {slavedDroneCount} / {maxDrones}
          </span>
        </div>
      )}

      {/* Equipment Count */}
      <div className="rigging-summary__footer">
        {vehicles.length > 0 && (
          <span className="rigging-summary__count">
            {vehicles.length} vehicle{vehicles.length > 1 ? 's' : ''}
          </span>
        )}
        {drones.length > 0 && (
          <span className="rigging-summary__count">
            {drones.length} drone{drones.length > 1 ? 's' : ''}
          </span>
        )}
        {autosofts.length > 0 && (
          <span className="rigging-summary__count">
            {autosofts.length} autosoft{autosofts.length > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
}
