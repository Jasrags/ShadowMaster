import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ShadowmasterLegacyApp } from '../types/legacy';

export type LifestyleOption = 'Street' | 'Squatter' | 'Low' | 'Middle' | 'High' | 'Luxury' | '';

const LIFESTYLE_OPTIONS: Array<{ value: Exclude<LifestyleOption, ''>; label: string; description: string }> = [
  { value: 'Street', label: 'Street', description: 'Living on the streets, no permanent residence' },
  { value: 'Squatter', label: 'Squatter', description: 'Squatting in abandoned buildings' },
  { value: 'Low', label: 'Low', description: 'Basic apartment or shared housing' },
  { value: 'Middle', label: 'Middle', description: 'Comfortable apartment or small house' },
  { value: 'High', label: 'High', description: 'Luxury apartment or nice house' },
  { value: 'Luxury', label: 'Luxury', description: 'High-end penthouse or mansion' },
];

export interface LifestyleState {
  lifestyle: LifestyleOption;
}

interface LifestyleSelectionProps {
  storedLifestyle?: LifestyleOption;
  onBack: () => void;
  onStateChange: (state: LifestyleState) => void;
  onSave: (state: LifestyleState) => void;
}

function LifestyleSelection({ storedLifestyle = '', onBack, onStateChange, onSave }: LifestyleSelectionProps) {
  const [lifestyle, setLifestyle] = useState<LifestyleOption>(storedLifestyle);

  const validation = useMemo(() => {
    if (!lifestyle || lifestyle === '') {
      return {
        status: 'error' as const,
        message: 'Please select a lifestyle.',
      };
    }
    return {
      status: 'success' as const,
      message: `Selected: ${lifestyle}`,
    };
  }, [lifestyle]);

  const state: LifestyleState = useMemo(
    () => ({
      lifestyle,
    }),
    [lifestyle],
  );

  useEffect(() => {
    onStateChange(state);
  }, [state, onStateChange]);

  const handleSave = () => {
    if (validation.status === 'success') {
      onSave(state);
    }
  };

  const selectedOption = LIFESTYLE_OPTIONS.find((opt) => opt.value === lifestyle);

  return (
    <div className="lifestyle-selection">
      <header className="lifestyle-selection__header">
        <div className={validation.status === 'success' ? 'lifestyle-selection__validation lifestyle-selection__validation--success' : 'lifestyle-selection__validation lifestyle-selection__validation--error'}>
          {validation.message}
        </div>
      </header>

      <section className="lifestyle-selection__body">
        <div className="lifestyle-selection__options">
          {LIFESTYLE_OPTIONS.map((option) => (
            <label key={option.value} className={`lifestyle-selection__option ${lifestyle === option.value ? 'lifestyle-selection__option--selected' : ''}`}>
              <input
                type="radio"
                name="lifestyle"
                value={option.value}
                checked={lifestyle === option.value}
                onChange={(e) => setLifestyle(e.target.value as LifestyleOption)}
              />
              <div className="lifestyle-selection__option-content">
                <div className="lifestyle-selection__option-label">{option.label}</div>
                <div className="lifestyle-selection__option-description">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </section>

      <footer className="lifestyle-selection__footer">
        <button type="button" className="btn-secondary" onClick={onBack}>
          Back to Contacts
        </button>
        <div
          className={`lifestyle-selection__status ${validation.status === 'success' ? 'lifestyle-selection__status--ready' : ''}`}
        >
          {validation.status === 'success' && selectedOption
            ? `${selectedOption.label} lifestyle selected`
            : 'Select a lifestyle to continue.'}
        </div>
        <button type="button" className="btn-primary" disabled={validation.status !== 'success'} onClick={handleSave}>
          Save Lifestyle
        </button>
      </footer>
    </div>
  );
}

export function LifestylePortal() {
  const [container, setContainer] = useState<Element | null>(null);
  const [storedLifestyle, setStoredLifestyle] = useState<LifestyleOption>('');

  useEffect(() => {
    setContainer(document.getElementById('lifestyle-react-root'));
  }, []);

  useEffect(() => {
    document.body.classList.add('react-lifestyle-enabled');
    return () => {
      document.body.classList.remove('react-lifestyle-enabled');
    };
  }, []);

  useEffect(() => {
    const legacy = window.ShadowmasterLegacyApp as ShadowmasterLegacyApp | undefined;
    if (!legacy) {
      return;
    }

    const syncState = () => {
      const lifestyleState = legacy.getLifestyleState?.();
      if (lifestyleState) {
        setStoredLifestyle((lifestyleState.lifestyle as LifestyleOption) || '');
      } else {
        setStoredLifestyle('');
      }
    };

    syncState();

    // Subscribe to state changes if available
    const unsubscribe = legacy.subscribeLifestyleState?.(syncState);
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const handleStateChange = (state: LifestyleState) => {
    const legacy = window.ShadowmasterLegacyApp as ShadowmasterLegacyApp | undefined;
    if (legacy?.setLifestyleState) {
      legacy.setLifestyleState({
        lifestyle: state.lifestyle,
      });
    }
  };

  const handleSave = (state: LifestyleState) => {
    handleStateChange(state);
    const legacy = window.ShadowmasterLegacyApp as ShadowmasterLegacyApp | undefined;
    if (legacy?.showWizardStep) {
      legacy.showWizardStep(9); // Move to Final Review/Submit step
    }
  };

  const handleBack = () => {
    const legacy = window.ShadowmasterLegacyApp as ShadowmasterLegacyApp | undefined;
    if (legacy?.showWizardStep) {
      legacy.showWizardStep(7); // Back to Contacts step
    }
  };

  if (!container) {
    return null;
  }

  return createPortal(
    <LifestyleSelection storedLifestyle={storedLifestyle} onBack={handleBack} onStateChange={handleStateChange} onSave={handleSave} />,
    container,
  );
}

