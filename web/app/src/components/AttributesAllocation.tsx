import { useEffect, useMemo, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useEdition } from '../hooks/useEdition';
import { useCharacterWizard } from '../context/CharacterWizardContext';
import type { MetatypeDefinition } from '../types/editions';

export type AttributeKey = 'body' | 'quickness' | 'strength' | 'charisma' | 'intelligence' | 'willpower';

interface AttributeRowConfig {
  key: AttributeKey;
  label: string;
  abbreviation: string;
}

const ATTRIBUTE_ROWS: AttributeRowConfig[] = [
  { key: 'body', label: 'Body', abbreviation: 'BOD' },
  { key: 'quickness', label: 'Quickness', abbreviation: 'QUI' },
  { key: 'strength', label: 'Strength', abbreviation: 'STR' },
  { key: 'charisma', label: 'Charisma', abbreviation: 'CHA' },
  { key: 'intelligence', label: 'Intelligence', abbreviation: 'INT' },
  { key: 'willpower', label: 'Willpower', abbreviation: 'WIL' },
];

const PRIORITY_POINTS: Record<string, number> = {
  A: 30,
  B: 27,
  C: 24,
  D: 21,
  E: 18,
};

export type AttributeValues = Record<AttributeKey, number>;

interface AllocationState {
  values: AttributeValues;
  startingValues: AttributeValues;
  modifiers: AttributeValues;
  usedPoints: number;
  remainingPoints: number;
}

interface AttributesAllocationProps {
  metatypeName: string;
  modifiers: AttributeValues;
  magicType: string | null;
  priority: string;
  storedValues?: Partial<AttributeValues> | null;
  onStateChange: (state: AllocationState) => void;
  onBack: () => void;
  onSave: (state: AllocationState) => void;
}

interface ValidationResult {
  status: 'idle' | 'error' | 'success';
  message: string;
}

function clamp(value: number, minValue: number, maxValue: number): number {
  if (Number.isNaN(value)) {
    return minValue;
  }
  return Math.min(Math.max(value, minValue), maxValue);
}

function createStartingValues(modifiers: AttributeValues): AttributeValues {
  return ATTRIBUTE_ROWS.reduce<AttributeValues>((acc, { key }) => {
    acc[key] = 1 + (modifiers[key] || 0);
    return acc;
  }, {} as AttributeValues);
}

function createInitialValues(
  startingValues: AttributeValues,
  storedValues?: Partial<AttributeValues> | null,
): AttributeValues {
  return ATTRIBUTE_ROWS.reduce<AttributeValues>((acc, { key }) => {
    const stored = storedValues?.[key];
    if (typeof stored === 'number' && !Number.isNaN(stored)) {
      acc[key] = Math.max(stored, startingValues[key]);
    } else {
      acc[key] = startingValues[key];
    }
    return acc;
  }, {} as AttributeValues);
}

function getMagicRating(magicType: string | null): { rating: number; note: string } {
  if (magicType === 'Full Magician') {
    return { rating: 6, note: 'Full Magician' };
  }
  if (magicType === 'Aspected Magician' || magicType === 'Adept') {
    return { rating: 4, note: magicType };
  }
  return { rating: 0, note: 'Mundane (no magic)' };
}

function calculatePoints(values: AttributeValues, startingValues: AttributeValues): number {
  return ATTRIBUTE_ROWS.reduce((total, { key }) => {
    const starting = startingValues[key];
    const current = values[key];
    // Racial modifiers don't count against attribute points budget
    // Only count points spent by the player above the starting value (which already includes modifiers)
    // 
    // Examples:
    // - Dwarf Body: starting = 2 (1 base + 1 modifier), current = 4: pay 2 points (4 - 2)
    //   The +1 modifier is free - doesn't cost attribute points
    // - Troll Charisma: starting = -1 (1 base + -2 modifier), current = 1: pay 2 points (1 - (-1))
    //   Player must spend points to raise from negative modifier back to 1+
    // - Human Body: starting = 1 (no modifier), current = 3: pay 2 points (3 - 1)
    return total + Math.max(0, current - starting);
  }, 0);
}

function toAttributeValues(modifiers: Partial<AttributeValues> | undefined): AttributeValues {
  return ATTRIBUTE_ROWS.reduce<AttributeValues>((acc, { key }) => {
    acc[key] = modifiers?.[key] ?? 0;
    return acc;
  }, {} as AttributeValues);
}

export function AttributesAllocation({
  metatypeName,
  modifiers,
  magicType,
  priority,
  storedValues,
  onStateChange,
  onBack,
  onSave,
}: AttributesAllocationProps) {
  const normalizedPriority = priority?.toUpperCase?.() ?? '';
  const availablePoints = PRIORITY_POINTS[normalizedPriority] ?? 0;

  const startingValues = useMemo(() => createStartingValues(modifiers), [modifiers]);
  const [values, setValues] = useState<AttributeValues>(() => createInitialValues(startingValues, storedValues));

  useEffect(() => {
    setValues(createInitialValues(startingValues, storedValues));
  }, [startingValues, storedValues]);

  const usedPoints = useMemo(() => calculatePoints(values, startingValues), [values, startingValues]);
  const remainingPoints = availablePoints - usedPoints;

  const validation: ValidationResult = useMemo(() => {
    if (!normalizedPriority) {
      return { status: 'error', message: 'Assign an attributes priority before continuing.' };
    }

    const errors: string[] = [];

    ATTRIBUTE_ROWS.forEach(({ key, label }) => {
      const value = values[key];
      const minValue = startingValues[key];
      if (value < minValue) {
        errors.push(`${label} cannot be reduced below ${minValue}.`);
      }
      if (value > 6) {
        errors.push(`${label} cannot exceed 6 before racial modifiers.`);
      }
      if (value < 1) {
        errors.push(`${label} is ${value}. Raise it to at least 1.`);
      }
    });

    if (usedPoints > availablePoints) {
      errors.push(`Using ${usedPoints} points, but only ${availablePoints} are available.`);
    } else if (usedPoints < availablePoints) {
      // Require all points to be spent before allowing save
      if (usedPoints > 0) {
        // Only show "spend all points" message if player has actually allocated some points
        // Don't show it on initial load when no points have been spent yet
        const remaining = availablePoints - usedPoints;
        errors.push(`Spend all ${availablePoints} points before continuing. ${remaining} remaining.`);
      } else {
        // On initial load with 0 points, don't show error message but still prevent save
        // The button will be disabled because validation status is not 'success'
      }
    }

    if (errors.length > 0) {
      return { status: 'error', message: errors[0] };
    }

    // Only return success if all points are spent
    if (usedPoints === availablePoints) {
      return { status: 'success', message: 'Attributes ready. Continue to skills.' };
    }

    // If usedPoints < availablePoints (including 0), return error status to disable save
    return { status: 'error', message: 'Allocate all attribute points before continuing.' };
  }, [availablePoints, normalizedPriority, startingValues, usedPoints, values]);

  useEffect(() => {
    onStateChange({ values, startingValues, modifiers, usedPoints, remainingPoints });
  }, [values, startingValues, modifiers, usedPoints, remainingPoints, onStateChange]);

  const { rating: magicRating, note: magicNote } = getMagicRating(magicType);

  const reaction = useMemo(() => {
    const quickness = values.quickness ?? 0;
    const intelligence = values.intelligence ?? 0;
    return Math.floor((quickness + intelligence) / 2);
  }, [values.quickness, values.intelligence]);

  const handleChange = (key: AttributeKey, rawValue: string) => {
    const parsed = Number.parseInt(rawValue, 10);
    // Allow values from starting (can be negative) up to 6
    // But enforce minimum of 1 for final validation (handled in validation)
    const minAllowed = Math.min(startingValues[key], 1); // Allow going below 1 temporarily if starting is negative
    const clamped = clamp(Number.isNaN(parsed) ? startingValues[key] : parsed, minAllowed, 6);
    setValues((prev) => ({ ...prev, [key]: clamped }));
  };

  const handleSave = () => {
    if (validation.status !== 'success') {
      return;
    }
    onSave({ values, startingValues, modifiers, usedPoints, remainingPoints });
  };

  const validationClass = validation.status === 'success' ? 'react-attributes__validation--success' : 'react-attributes__validation--error';

  return (
    <div className="react-attributes">
      <header className="react-attributes__header">
        <div className="react-attributes__points">
          <span>
            Available: <strong>{availablePoints}</strong>
          </span>
          <span>
            Used: <strong>{Math.max(0, usedPoints)}</strong>
          </span>
          <span>
            Remaining: <strong>{Math.max(0, remainingPoints)}</strong>
          </span>
        </div>
        <div className={`react-attributes__validation ${validationClass}`}>{validation.message}</div>
      </header>

      <section className="react-attributes__grid" aria-label="Attribute assignment">
        {ATTRIBUTE_ROWS.map(({ key, label, abbreviation }) => {
          const modifier = modifiers[key] ?? 0;
          const starting = startingValues[key];
          const value = values[key];
          const modifierClass = modifier > 0 ? 'positive' : modifier < 0 ? 'negative' : '';
          const finalClass = value < 1 ? 'react-attributes__final react-attributes__final--warning' : 'react-attributes__final';

          return (
            <div key={key} className="react-attributes__row">
              <div className="react-attributes__label">
                <span>
                  {label} ({abbreviation})
                </span>
                <span className="react-attributes__start">
                  Start {starting >= 1 ? starting : `${starting} → raise to 1+`}
                </span>
              </div>
              <input
                type="number"
                inputMode="numeric"
                pattern="[0-9-]*"
                min={Math.min(starting, 1)}
                max={6}
                className="react-attributes__input"
                value={value}
                onChange={(event) => handleChange(key, event.target.value)}
                aria-label={`${label} value`}
              />
              <span className={`react-attributes__modifier ${modifierClass}`}>
                {modifier >= 0 ? `+${modifier}` : modifier}
              </span>
              <span className={finalClass}>{value}</span>
            </div>
          );
        })}
      </section>

      <section className="react-attributes__derived">
        <h4>Derived Attributes</h4>
        <div className="react-attributes__derived-row">
          <div>
            <strong>Reaction</strong>
            <small>(Quickness + Intelligence) ÷ 2, rounded down</small>
          </div>
          <span>{reaction}</span>
        </div>
        <div className="react-attributes__derived-row">
          <div>
            <strong>Essence</strong>
            <small>Base essence before implants</small>
          </div>
          <span>6.0</span>
        </div>
        <div className="react-attributes__derived-row">
          <div>
            <strong>Magic Rating</strong>
            <small>{magicNote}</small>
          </div>
          <span>{magicRating}</span>
        </div>
      </section>

      <footer className="react-attributes__footer">
        <button type="button" className="btn-secondary" onClick={onBack}>
          Back to Magical Abilities
        </button>
        <div className={`react-attributes__status ${validation.status === 'success' ? 'ready' : ''}`}>
          {validation.status === 'success'
            ? `Priority ${normalizedPriority || '—'} · ${metatypeName}`
            : 'Adjust attributes to satisfy priority limits.'}
        </div>
        <button type="button" className="btn-primary" disabled={validation.status !== 'success'} onClick={handleSave}>
          Save Attributes
        </button>
      </footer>
    </div>
  );
}

export function AttributesPortal() {
  const [container, setContainer] = useState<Element | null>(null);
  const { characterCreationData, activeEdition } = useEdition();
  const wizard = useCharacterWizard();
  const [priority, setPriority] = useState('');
  const [metatypeId, setMetatypeId] = useState<string | null>(null);
  const [magicType, setMagicType] = useState<string | null>(null);
  const [storedValues, setStoredValues] = useState<Partial<AttributeValues> | null>(null);

  useEffect(() => {
    setContainer(document.getElementById('attributes-react-root'));
  }, []);

  useEffect(() => {
    document.body.classList.add('react-attributes-enabled');
    return () => {
      document.body.classList.remove('react-attributes-enabled');
    };
  }, []);

  const contextPriority = wizard.state.priorities.attributes ?? '';
  const contextMetatypeId = wizard.state.selectedMetatype;
  const contextMagicType = wizard.state.magicSelection?.type ?? null;
  const contextAttributes = wizard.state.attributes;

  // Use ref to track previous JSON string and only update when it actually changes
  const prevAttributesKey = useRef<string>('');

  useEffect(() => {
    const attributesKey = JSON.stringify(contextAttributes);
    
    // Clear stored values if metatype or priority changed (new character creation session)
    if (contextMetatypeId !== metatypeId || contextPriority !== priority) {
      setStoredValues(null);
    }
    
    setPriority(contextPriority);
    setMetatypeId(contextMetatypeId);
    setMagicType(contextMagicType);
    
    // Load from context only if attributes actually changed
    if (attributesKey !== prevAttributesKey.current) {
      prevAttributesKey.current = attributesKey;
      
      if (contextAttributes && contextMetatypeId !== null && contextPriority !== '') {
        setStoredValues(contextAttributes);
      } else if (metatypeId === null || priority === '') {
        // On first load, ensure stored values are cleared
        setStoredValues(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextPriority, contextMetatypeId, contextMagicType, metatypeId, priority]); // contextAttributes checked via JSON.stringify

  if (!container) {
    return null;
  }

  if (!characterCreationData) {
    return createPortal(<p className="react-attributes__status">Loading attribute data…</p>, container);
  }

  const metatype: MetatypeDefinition | undefined = characterCreationData.metatypes.find(
    (entry) => entry.id === metatypeId,
  );

  // For SR5, use SR3 racial modifications table values (as per user requirement)
  // For SR3, use attribute_modifiers from data
  let modifiers: AttributeValues;
  if (activeEdition.key === 'sr5') {
    // SR5: Use SR3 racial modifications table
    const sr5Modifiers: Record<string, Record<string, number>> = {
      human: {},
      dwarf: { body: 1, strength: 2, willpower: 1 },
      elf: { quickness: 1, charisma: 2 },
      ork: { body: 3, strength: 2, charisma: -1, intelligence: -1 },
      troll: { body: 5, quickness: -1, strength: 4, intelligence: -2, charisma: -2 },
    };
    const metatypeKey = metatype?.name?.toLowerCase() ?? 'human';
    const sr5Mods = sr5Modifiers[metatypeKey] || {};
    modifiers = toAttributeValues(sr5Mods);
  } else {
    // SR3: Use attribute_modifiers from data
    modifiers = toAttributeValues(metatype?.attribute_modifiers);
  }
  
  const metatypeName = metatype?.name ?? 'Human';

  const handleStateChange = (state: AllocationState) => {
    const currentValuesKey = JSON.stringify(wizard.state.attributes ?? {});
    const nextValuesKey = JSON.stringify(state.values);
    if (currentValuesKey !== nextValuesKey) {
      wizard.setAttributes(state.values);
    }

    const currentStartingKey = JSON.stringify(wizard.state.attributeStartingValues ?? {});
    const nextStartingKey = JSON.stringify(state.startingValues);
    if (currentStartingKey !== nextStartingKey) {
      wizard.setAttributeStartingValues(state.startingValues);
    }

    const currentBaseKey = JSON.stringify(wizard.state.attributeBaseValues ?? {});
    const nextBaseKey = JSON.stringify(state.modifiers);
    if (currentBaseKey !== nextBaseKey) {
      wizard.setAttributeBaseValues(state.modifiers);
    }
  };

  const handleSave = (state: AllocationState) => {
    // Sync to context
    wizard.setAttributes(state.values);
    wizard.setAttributeStartingValues(state.startingValues);
    wizard.setAttributeBaseValues(state.modifiers);

    const description = `Stored attribute allocation for ${metatypeName}. Reaction ${Math.floor(
      (state.values.quickness + state.values.intelligence) / 2,
    )}, Magic ${getMagicRating(magicType).rating}.`;

    if (typeof window.ShadowmasterNotify === 'function') {
      window.ShadowmasterNotify({
        type: 'info',
        title: 'Attributes saved',
        description,
      });
    } else {
      console.info(description);
    }

    wizard.navigateToStep(5);
  };

  return createPortal(
    <AttributesAllocation
      metatypeName={metatypeName}
      modifiers={modifiers}
      magicType={magicType}
      priority={priority}
      storedValues={storedValues}
      onStateChange={handleStateChange}
      onBack={() => wizard.navigateToStep(3)}
      onSave={handleSave}
    />, container);
}

AttributesPortal.displayName = 'AttributesPortal';

export default AttributesPortal;
