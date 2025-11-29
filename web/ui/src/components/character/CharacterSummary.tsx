import type { CharacterSR5 } from '../../lib/types';

interface CharacterSummaryProps {
  character: Partial<CharacterSR5>;
}

export function CharacterSummary({ character }: CharacterSummaryProps) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
        <h4 className="text-md font-semibold text-gray-200 mb-3">Derived Attributes</h4>
        {character.initiative && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Physical Initiative:</span>
              <span className="text-gray-100">
                {character.initiative.physical.base}+{character.initiative.physical.dice}D6
              </span>
            </div>
            {character.magic && (
              <div className="flex justify-between">
                <span className="text-gray-300">Astral Initiative:</span>
                <span className="text-gray-100">
                  {character.initiative.astral.base}+{character.initiative.astral.dice}D6
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {character.inherent_limits && (
        <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
          <h4 className="text-md font-semibold text-gray-200 mb-3">Inherent Limits</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-300">Mental:</span>
              <span className="text-gray-100 ml-2">{character.inherent_limits.mental}</span>
            </div>
            <div>
              <span className="text-gray-300">Physical:</span>
              <span className="text-gray-100 ml-2">{character.inherent_limits.physical}</span>
            </div>
            <div>
              <span className="text-gray-300">Social:</span>
              <span className="text-gray-100 ml-2">{character.inherent_limits.social}</span>
            </div>
          </div>
        </div>
      )}

      {character.condition_monitor && (
        <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
          <h4 className="text-md font-semibold text-gray-200 mb-3">Condition Monitors</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-300">Physical:</span>
              <span className="text-gray-100 ml-2">{character.condition_monitor.physical}</span>
            </div>
            <div>
              <span className="text-gray-300">Stun:</span>
              <span className="text-gray-100 ml-2">{character.condition_monitor.stun}</span>
            </div>
            <div>
              <span className="text-gray-300">Overflow:</span>
              <span className="text-gray-100 ml-2">{character.condition_monitor.overflow}</span>
            </div>
          </div>
        </div>
      )}

      {character.living_persona && (
        <div className="p-4 bg-sr-light-gray/30 border border-sr-light-gray rounded-md">
          <h4 className="text-md font-semibold text-gray-200 mb-3">Living Persona</h4>
          <div className="grid grid-cols-5 gap-2 text-sm">
            <div>
              <span className="text-gray-300">Attack:</span>
              <span className="text-gray-100 ml-1">{character.living_persona.attack}</span>
            </div>
            <div>
              <span className="text-gray-300">Sleaze:</span>
              <span className="text-gray-100 ml-1">{character.living_persona.sleaze}</span>
            </div>
            <div>
              <span className="text-gray-300">Data Proc:</span>
              <span className="text-gray-100 ml-1">{character.living_persona.data_processing}</span>
            </div>
            <div>
              <span className="text-gray-300">Firewall:</span>
              <span className="text-gray-100 ml-1">{character.living_persona.firewall}</span>
            </div>
            <div>
              <span className="text-gray-300">Device Rating:</span>
              <span className="text-gray-100 ml-1">{character.living_persona.device_rating}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

