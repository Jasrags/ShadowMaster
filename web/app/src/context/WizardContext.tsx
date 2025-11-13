import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface WizardContextValue {
  isOpen: boolean;
  campaignId: string | null;
  openWizard: (campaignId?: string | null) => void;
  closeWizard: () => void;
}

const WizardContext = createContext<WizardContextValue | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [campaignId, setCampaignId] = useState<string | null>(null);

  const openWizard = useCallback((id?: string | null) => {
    setCampaignId(id ?? null);
    setIsOpen(true);
  }, []);

  const closeWizard = useCallback(() => {
    setIsOpen(false);
    setCampaignId(null);
  }, []);

  return (
    <WizardContext.Provider value={{ isOpen, campaignId, openWizard, closeWizard }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within WizardProvider');
  }
  return context;
}

