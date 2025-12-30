'use client';

/**
 * JumpInControl - Control jumping into vehicles and drones
 *
 * Shows available targets, VR mode selection, and current jumped-in status.
 */

import type { RiggerVRMode, JumpedInState } from '@/lib/types/rigging';
import type { CharacterDrone, Vehicle } from '@/lib/types/character';

interface JumpInControlProps {
  vehicles: Vehicle[];
  drones: CharacterDrone[];
  vcrRating: number;
  jumpedInState?: JumpedInState | null;
  onJumpIn?: (targetId: string, targetType: 'vehicle' | 'drone', vrMode: RiggerVRMode) => void;
  onJumpOut?: () => void;
  className?: string;
}

export function JumpInControl({
  vehicles,
  drones,
  vcrRating,
  jumpedInState = null,
  onJumpIn,
  onJumpOut,
  className = ''
}: JumpInControlProps) {
  // If currently jumped in, show status and jump out button
  if (jumpedInState?.isActive) {
    return (
      <div className={`jump-control jump-control--active ${className}`}>
        <h3 className="jump-control__title">Jumped In</h3>
        
        <div className="jump-control__status">
          <div className="jump-control__row">
            <span className="jump-control__label">Target:</span>
            <span className="jump-control__value">{jumpedInState.targetName}</span>
          </div>
          <div className="jump-control__row">
            <span className="jump-control__label">VR Mode:</span>
            <span className="jump-control__value">
              {jumpedInState.vrMode === 'cold-sim' ? 'Cold-Sim VR' : 'Hot-Sim VR'}
            </span>
          </div>
          <div className="jump-control__row">
            <span className="jump-control__label">Control Bonus:</span>
            <span className="jump-control__value">+{jumpedInState.controlBonus}</span>
          </div>
          <div className="jump-control__row">
            <span className="jump-control__label">Initiative Dice:</span>
            <span className="jump-control__value">+{jumpedInState.initiativeDiceBonus}d6</span>
          </div>
        </div>

        {jumpedInState.bodyVulnerable && (
          <div className="jump-control__warning">
            ⚠️ Physical body is vulnerable while jumped in
          </div>
        )}

        <button
          className="jump-control__btn jump-control__btn--jump-out"
          onClick={onJumpOut}
        >
          Jump Out
        </button>
      </div>
    );
  }

  // No VCR = cannot jump in
  if (vcrRating === 0) {
    return (
      <div className={`jump-control jump-control--no-vcr ${className}`}>
        <h3 className="jump-control__title">Jump In</h3>
        <p className="jump-control__no-vcr">Requires Vehicle Control Rig</p>
      </div>
    );
  }

  // Show available targets
  const targets = [
    ...vehicles.map(v => ({ id: v.id ?? '', name: v.name, type: 'vehicle' as const })),
    ...drones.map(d => ({ id: d.id ?? '', name: d.name, type: 'drone' as const })),
  ];

  if (targets.length === 0) {
    return (
      <div className={`jump-control jump-control--no-targets ${className}`}>
        <h3 className="jump-control__title">Jump In</h3>
        <p className="jump-control__no-targets">No vehicles or drones available</p>
      </div>
    );
  }

  return (
    <div className={`jump-control ${className}`}>
      <h3 className="jump-control__title">Jump In</h3>
      
      <div className="jump-control__vcr-info">
        <span>VCR Rating {vcrRating}: +{vcrRating} Control, +{vcrRating}d6 Initiative</span>
      </div>

      <ul className="jump-control__targets">
        {targets.map(target => (
          <li key={target.id} className="jump-control__target">
            <span className="jump-control__target-name">{target.name}</span>
            <span className="jump-control__target-type">({target.type})</span>
            <div className="jump-control__target-actions">
              <button
                className="jump-control__btn jump-control__btn--cold"
                onClick={() => onJumpIn?.(target.id, target.type, 'cold-sim')}
              >
                Cold-Sim
              </button>
              <button
                className="jump-control__btn jump-control__btn--hot"
                onClick={() => onJumpIn?.(target.id, target.type, 'hot-sim')}
              >
                Hot-Sim
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
