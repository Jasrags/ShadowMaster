import { useEffect, useMemo } from 'react';
import { useEdition } from '../hooks/useEdition';
import { getMetatypesForPriority, formatModifier, formatAttributeLabel } from '../utils/metatypes';

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

  const metatypes = useMemo(() => getMetatypesForPriority(characterCreationData, priority as any), [
    characterCreationData,
    priority,
  ]);

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
                const entries = metatype.attribute_modifiers
                  ? Object.entries(metatype.attribute_modifiers).filter(([, value]) => value !== 0)
                  : [];

                if (entries.length === 0) {
                  return <div className="attribute-mod">No attribute modifiers.</div>;
                }

                return entries.map(([attr, value]) => (
                  <div key={attr} className="attribute-mod">
                    <span>{formatAttributeLabel(attr)}</span>
                    <span className={value > 0 ? 'positive' : 'negative'}>{formatModifier(value)}</span>
                  </div>
                ));
              })()}
            </section>

            {activeEdition.key === 'sr5' &&
              metatype.special_attribute_points &&
              Object.keys(metatype.special_attribute_points).length > 0 && (
              <section className="react-metatype-special">
                <strong>Special Attribute Points (SR5)</strong>
                {Object.entries(metatype.special_attribute_points).map(([priorityCode, points]) => (
                  <div key={priorityCode} className="ability">
                    <span>Priority {priorityCode}: {points}</span>
                  </div>
                ))}
              </section>
            )}

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
    </>
  );
}
