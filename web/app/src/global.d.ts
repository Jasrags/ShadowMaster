declare global {
  interface Window {
    ShadowmasterAuth?: ShadowmasterAuthState;
    ShadowmasterNotify?: (descriptor: NotificationDescriptor) => string;
    ShadowmasterLegacyApp?: import('./types/legacy').ShadowmasterLegacyApp;
    viewCharacterSheet?: (id: string) => void;
    openCharacterWizard?: (campaignId?: string | null) => void;
  }
}
