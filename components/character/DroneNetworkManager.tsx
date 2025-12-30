'use client';

/**
 * DroneNetworkManager - Manage slaved drones in the RCC network
 *
 * Lists owned drones, shows slave status, condition, and noise.
 */

import type { CharacterDrone } from '@/lib/types/character';
import type { SlavedDrone } from '@/lib/types/rigging';

interface DroneNetworkManagerProps {
  ownedDrones: CharacterDrone[];
  slavedDrones: SlavedDrone[];
  maxDrones: number;
  onSlaveDrone?: (droneId: string) => void;
  onReleaseDrone?: (droneId: string) => void;
  className?: string;
}

export function DroneNetworkManager({
  ownedDrones,
  slavedDrones,
  maxDrones,
  onSlaveDrone,
  onReleaseDrone,
  className = ''
}: DroneNetworkManagerProps) {
  const slavedIds = new Set(slavedDrones.map(d => d.droneId));
  const canSlaveMore = slavedDrones.length < maxDrones;

  if (ownedDrones.length === 0) {
    return (
      <div className={`drone-manager drone-manager--empty ${className}`}>
        <h3 className="drone-manager__title">Drone Network</h3>
        <p className="drone-manager__empty">No drones owned</p>
      </div>
    );
  }

  return (
    <div className={`drone-manager ${className}`}>
      <h3 className="drone-manager__title">Drone Network</h3>
      
      <div className="drone-manager__capacity">
        <span>{slavedDrones.length} / {maxDrones} slaved</span>
      </div>

      <ul className="drone-manager__list">
        {ownedDrones.map(drone => {
          const isSlaved = slavedIds.has(drone.id ?? '');
          const slavedData = slavedDrones.find(d => d.droneId === drone.id);
          
          return (
            <li key={drone.id} className={`drone-manager__item ${isSlaved ? 'drone-manager__item--slaved' : ''}`}>
              <div className="drone-manager__drone-info">
                <span className="drone-manager__drone-name">{drone.name}</span>
                <span className="drone-manager__drone-size">{drone.size}</span>
              </div>
              
              <div className="drone-manager__drone-stats">
                <span>P: {drone.pilot}</span>
                <span>B: {drone.body}</span>
                <span>A: {drone.armor}</span>
              </div>

              {isSlaved && slavedData && (
                <div className="drone-manager__slaved-info">
                  {slavedData.noisePenalty > 0 && (
                    <span className="drone-manager__noise">
                      Noise: -{slavedData.noisePenalty}
                    </span>
                  )}
                  {slavedData.conditionDamageTaken > 0 && (
                    <span className="drone-manager__damage">
                      Damage: {slavedData.conditionDamageTaken}/{slavedData.conditionMonitorMax}
                    </span>
                  )}
                </div>
              )}

              <div className="drone-manager__actions">
                {isSlaved ? (
                  <button
                    className="drone-manager__btn drone-manager__btn--release"
                    onClick={() => onReleaseDrone?.(drone.id ?? '')}
                  >
                    Release
                  </button>
                ) : (
                  <button
                    className="drone-manager__btn drone-manager__btn--slave"
                    onClick={() => onSlaveDrone?.(drone.id ?? '')}
                    disabled={!canSlaveMore}
                  >
                    Slave
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
