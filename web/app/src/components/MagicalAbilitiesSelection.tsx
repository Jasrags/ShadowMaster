import { useEffect, useMemo } from 'react';
import { useEdition } from '../hooks/useEdition';

export interface MagicalSelection {
  type: string | null;
  tradition: string | null;
  totem: string | null;
}

interface Props {
  priority: string;
  selection: MagicalSelection;
  onChange: (selection: MagicalSelection) => void;
}

const TRADITIONS = ['Hermetic', 'Shamanic'] as const;

const TOTEMS = [
  {
    id: 'Bear',
    name: 'Bear',
    description:
      'The Bear totem represents strength, healing, and the protective nature of the forest. Bear shamans draw power from the wilderness and have a deep connection to natural healing.',
    notes: [
      '+2 dice for Health spells',
      '+2 dice for Forest spirits',
      'Risk of berserk rage when wounded in combat',
    ],
  },
];

function normalizePriority(priority: string): string {
  return (priority || '').toUpperCase();
}

export function MagicalAbilitiesSelection({ priority, selection, onChange }: Props) {
  const { characterCreationData, activeEdition } = useEdition();
  const normalizedPriority = normalizePriority(priority);
  const priorityTable = characterCreationData?.priorities?.magic ?? null;
  const priorityInfo = useMemo(() => {
    if (!priorityTable) return null;
    return priorityTable[normalizedPriority as keyof typeof priorityTable] || null;
  }, [priorityTable, normalizedPriority]);

  useEffect(() => {
    document.body.classList.add('react-magic-enabled');
    return () => {
      document.body.classList.remove('react-magic-enabled');
    };
  }, []);

  useEffect(() => {
    if (!normalizedPriority) {
      if (selection.type !== 'Mundane' || selection.tradition || selection.totem) {
        onChange({ type: 'Mundane', tradition: null, totem: null });
      }
      return;
    }

    if (normalizedPriority === 'A') {
      const desiredTradition = selection.tradition ?? 'Hermetic';
      const desiredTotem = desiredTradition === 'Shamanic' ? selection.totem : null;
      if (
        selection.type !== 'Full Magician' ||
        selection.tradition !== desiredTradition ||
        selection.totem !== desiredTotem
      ) {
        onChange({ type: 'Full Magician', tradition: desiredTradition, totem: desiredTotem });
      }
    } else if (normalizedPriority === 'B') {
      let desiredType = selection.type;
      if (selection.type !== 'Adept' && selection.type !== 'Aspected Magician') {
        desiredType = 'Adept';
      }

      let desiredTradition = selection.tradition;
      let desiredTotem = selection.totem;

      if (desiredType === 'Aspected Magician') {
        desiredTradition = desiredTradition ?? 'Hermetic';
        if (desiredTradition !== 'Shamanic') {
          desiredTotem = null;
        }
      } else {
        desiredTradition = null;
        desiredTotem = null;
      }

      if (
        selection.type !== desiredType ||
        selection.tradition !== desiredTradition ||
        selection.totem !== desiredTotem
      ) {
        onChange({ type: desiredType, tradition: desiredTradition, totem: desiredTotem });
      }
    } else {
      if (selection.type !== 'Mundane' || selection.tradition || selection.totem) {
        onChange({ type: 'Mundane', tradition: null, totem: null });
      }
    }
  }, [normalizedPriority]);

  const updateSelection = (updates: Partial<MagicalSelection>) => {
    const nextSelection: MagicalSelection = {
      type: updates.type !== undefined ? updates.type : selection.type,
      tradition: updates.tradition !== undefined ? updates.tradition : selection.tradition,
      totem: updates.totem !== undefined ? updates.totem : selection.totem,
    };

    if (nextSelection.type !== 'Full Magician' && nextSelection.type !== 'Aspected Magician') {
      nextSelection.tradition = null;
      nextSelection.totem = null;
    }

    if (nextSelection.tradition !== 'Shamanic') {
      nextSelection.totem = null;
    }

    if (
      nextSelection.type === selection.type &&
      nextSelection.tradition === selection.tradition &&
      nextSelection.totem === selection.totem
    ) {
      return;
    }

    onChange(nextSelection);
  };

  const renderMagicCards = () => {
    if (!normalizedPriority || ['C', 'D', 'E', ''].includes(normalizedPriority)) {
      return (
        <div className="react-magic-grid">
          <article
            className={`react-magic-card ${selection.type === 'Mundane' ? 'selected' : ''}`}
            onClick={() => updateSelection({ type: 'Mundane', tradition: null, totem: null })}
          >
            <h4>Mundane</h4>
            <p>No magical ability. Magic Rating 0.</p>
          </article>
        </div>
      );
    }

    if (normalizedPriority === 'A') {
      return (
        <div className="react-magic-grid">
          <article
            className={`react-magic-card ${selection.type === 'Full Magician' ? 'selected' : ''}`}
            onClick={() => updateSelection({ type: 'Full Magician' })}
          >
            <h4>Full Magician</h4>
            <p>Magic Rating 6. Spell Points 25.</p>
            <p>Must choose a magical tradition.</p>
          </article>
        </div>
      );
    }

    if (normalizedPriority === 'B') {
      return (
        <div className="react-magic-grid">
          <article
            className={`react-magic-card ${selection.type === 'Adept' ? 'selected' : ''}`}
            onClick={() => updateSelection({ type: 'Adept', tradition: null, totem: null })}
          >
            <h4>Adept</h4>
            <p>Magic Rating 4. Gain Power Points for physical enhancements.</p>
          </article>
          <article
            className={`react-magic-card ${selection.type === 'Aspected Magician' ? 'selected' : ''}`}
            onClick={() => updateSelection({ type: 'Aspected Magician' })}
          >
            <h4>Aspected Magician</h4>
            <p>Magic Rating 4. Specializes in a single tradition aspect.</p>
            <p>Must choose a magical tradition.</p>
          </article>
        </div>
      );
    }

    return null;
  };

  const renderTraditions = () => {
    if (!selection.type || !['Full Magician', 'Aspected Magician'].includes(selection.type)) {
      return null;
    }

    return (
      <div className="react-magic-traditions">
        <strong>Tradition</strong>
        <div className="tradition-options">
          {TRADITIONS.map((trad) => (
            <label key={trad} className={`tradition-option ${selection.tradition === trad ? 'selected' : ''}`}>
              <input
                type="radio"
                name="react-tradition"
                value={trad}
                checked={selection.tradition === trad}
                onChange={() => updateSelection({ tradition: trad })}
              />
              <span>{trad}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const renderTotems = () => {
    if (selection.tradition !== 'Shamanic') {
      return null;
    }

    return (
      <div className="react-magic-totems">
        <strong>Select Totem</strong>
        <div className="totem-grid">
          {TOTEMS.map((totem) => (
            <article
              key={totem.id}
              className={`totem-card ${selection.totem === totem.id ? 'selected' : ''}`}
              onClick={() => updateSelection({ totem: totem.id })}
            >
              <h5>{totem.name}</h5>
              <p>{totem.description}</p>
              <ul>
                {totem.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    );
  };

  const renderStatus = () => {
    if (!selection.type) {
      return <p className="react-magic-status">Select a magical path to proceed.</p>;
    }

    if (selection.type === 'Full Magician' || selection.type === 'Aspected Magician') {
      if (!selection.tradition) {
        return <p className="react-magic-status">Choose a tradition to continue.</p>;
      }
      if (selection.tradition === 'Shamanic' && !selection.totem) {
        return <p className="react-magic-status">Select a totem for your shamanic path.</p>;
      }
    }

    return <p className="react-magic-status ready">Magical abilities ready. Continue to Attributes.</p>;
  };

  return (
    <div className="react-magic-wrapper">
      <div className="react-magic-header">
        <span>Magical Abilities</span>
        <span>
          Priority {normalizedPriority || '—'}{' '}
          {priorityInfo?.summary ? `— ${priorityInfo.summary}` : ''}
        </span>
      </div>

      {renderMagicCards()}
      {renderTraditions()}
      {renderTotems()}
      {renderStatus()}

      <footer className="react-magic-footer">
        <small>Edition: {activeEdition.label}</small>
      </footer>
    </div>
  );
}
