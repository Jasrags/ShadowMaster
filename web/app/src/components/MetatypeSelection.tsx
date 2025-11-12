import { useEffect, useMemo } from 'react';
import { useEdition } from '../hooks/useEdition';
import { getMetatypesForPriority, formatModifier, formatAttributeLabel } from '../utils/metatypes';
import { PriorityCode } from '../types/editions';

interface Props {
  priority: string;
  selectedMetatype: string | null;
  onSelect: (metatypeId: string) => void;
}

export function MetatypeSelection({ priority, selectedMetatype, onSelect }: Props) {
  const { characterCreationData, isLoading, error, activeEdition } = useEdition();

  useEffect(() => {
    document.body.classList.add('react-metatype-enabled');
    return () => {
      document.body.classList.remove('react-metatype-enabled');
    };
  }, []);

  const metatypes = useMemo(() => {
    const normalized = priority?.toUpperCase?.() ?? '';
    const allowed: PriorityCode[] = ['A', 'B', 'C', 'D', 'E'];
    const safePriority: PriorityCode | '' = allowed.includes(normalized as PriorityCode)
      ? (normalized as PriorityCode)
      : '';
    return getMetatypesForPriority(characterCreationData, safePriority);
  }, [characterCreationData, priority]);

  const canAdvance = Boolean(selectedMetatype);

  const handleBack = () => {
    window.ShadowmasterLegacyApp?.showWizardStep?.(1);
  };

  const handleNext = () => {
    if (!selectedMetatype) {
      return;
    }
    window.ShadowmasterLegacyApp?.showWizardStep?.(3);
  };

  if (isLoading) {
    return <p className="react-metatype-status">Loading metatype data…</p>;
  }

  if (error) {
    return <p className="react-metatype-status">Error loading metatypes: {error}</p>;
  }

  if (!metatypes.length) {
    return <p className="react-metatype-status">No metatypes available for this priority.</p>;
  }

  return (
    <>
      <div className="react-metatype-header">
        <span>Available Metatypes</span>
        <span>Priority: {priority || '—'}</span>
      </div>
      <div className="react-metatype-grid">
        {metatypes.map((metatype) => (
          <article
            key={metatype.id}
            className={`react-metatype-card ${selectedMetatype === metatype.id ? 'selected' : ''}`}
            onClick={() => onSelect(metatype.id)}
          >
            <h4>{metatype.name}</h4>

            <section className="react-metatype-modifiers">
              <strong>Attribute Modifiers</strong>
              {(() => {
                // For SR5, use SR3 racial modifications table as guidance for modifier values
                // Map SR3 attribute names to SR5 equivalents (Quickness→Agility, Intelligence→Logic)
                // For SR3, use attribute_modifiers directly
                let entries: Array<[string, number]> = [];
                
                if (activeEdition.key === 'sr5') {
                  // SR3 racial modifications table values, mapped to SR5 attribute names
                  const sr5Modifiers: Record<string, Record<string, number>> = {
                    human: {},
                    dwarf: {
                      body: 1,
                      strength: 2,
                      willpower: 1,
                    },
                    elf: {
                      quickness: 1, // Displayed as Agility in SR5
                      charisma: 2,
                    },
                    ork: {
                      body: 3,
                      strength: 2,
                      charisma: -1,
                      intelligence: -1, // Displayed as Logic in SR5
                    },
                    troll: {
                      body: 5,
                      quickness: -1, // Displayed as Agility in SR5
                      strength: 4,
                      intelligence: -2, // Displayed as Logic in SR5
                      charisma: -2,
                    },
                  };
                  
                  const metatypeKey = metatype.name.toLowerCase();
                  const modifiers = sr5Modifiers[metatypeKey] || {};
                  
                  // Map SR3 attribute names to SR5 display names
                  const attributeDisplayMapping: Record<string, string> = {
                    quickness: 'agility', // SR3 Quickness → SR5 Agility
                    intelligence: 'logic', // SR3 Intelligence → SR5 Logic
                  };
                  
                  entries = Object.entries(modifiers)
                    .map(([attr, value]) => {
                      const displayAttr = attributeDisplayMapping[attr.toLowerCase()] ?? attr;
                      return [displayAttr, value] as [string, number];
                    })
                    .filter(([, modifier]) => modifier !== 0);
                } else if (metatype.attribute_modifiers) {
                  // Use existing attribute_modifiers for SR3
                  entries = Object.entries(metatype.attribute_modifiers)
                    .filter(([, value]) => value !== 0)
                    .map(([attr, value]) => [attr, typeof value === 'number' ? value : Number(value)]);
                }

                if (entries.length === 0) {
                  return <div className="attribute-mod">No attribute modifiers.</div>;
                }

                return entries.map(([attr, value]) => {
                  const numValue = typeof value === 'number' ? value : Number(value);
                  return (
                    <div key={attr} className="attribute-mod">
                      <span>{formatAttributeLabel(attr)}</span>
                      <span className={numValue > 0 ? 'positive' : numValue < 0 ? 'negative' : ''}>
                        {formatModifier(numValue)}
                      </span>
                    </div>
                  );
                });
              })()}
            </section>

            {metatype.abilities && metatype.abilities.length > 0 && (
              <section className="react-metatype-abilities">
                <strong>Special Abilities</strong>
                {metatype.abilities.map((ability, index) => (
                  <div key={index} className="ability">
                    <span>{ability}</span>
                  </div>
                ))}
              </section>
            )}
            {(!metatype.abilities || metatype.abilities.length === 0) && (
              <section className="react-metatype-abilities">
                <strong>Special Abilities</strong>
                <div className="ability">
                  <span>No inherent metatype abilities.</span>
                </div>
              </section>
            )}
          </article>
        ))}
      </div>

      <div className="react-metatype-footer">
        <button type="button" className="btn btn-secondary" onClick={handleBack}>
          Back
        </button>
        <div className={`react-metatype-status ${canAdvance ? 'ready' : ''}`}>
          {canAdvance ? 'Metatype selected. Continue to magic.' : 'Select a metatype to continue.'}
        </div>
        <button type="button" className="btn btn-primary" disabled={!canAdvance} onClick={handleNext}>
          Next: Choose Magical Abilities
        </button>
      </div>
    </>
  );
}
