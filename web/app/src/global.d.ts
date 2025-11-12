declare global {
  interface Window {
    ShadowmasterAuth?: ShadowmasterAuthState;
    ShadowmasterNotify?: (descriptor: NotificationDescriptor) => string;
    ShadowmasterLegacyApp?: import('./types/legacy').ShadowmasterLegacyApp;
  }
}
