// Export stores directly
// Note: Devtools can be added to stores at creation time if needed
// For Zustand v5, devtools middleware is applied during store creation
export { useAuthStore } from './auth-store'
export { useCampaignStore } from './campaign-store'
export { useCharacterStore } from './character-store'
export { useGameStateStore } from './game-state-store'
export { useVTTStore } from './vtt-store'

// Export types
export type { ToolMode, InitiativeEntry, ActiveEffect } from './game-state-store'
export type { GridSettings, TokenPosition, LayerVisibility } from './vtt-store'

/**
 * Typed hooks for accessing store state and actions
 * These provide better TypeScript inference
 */

/**
 * Hook to get auth user
 */
export const useAuthUser = () => useAuthStore((state) => state.user)

/**
 * Hook to get auth profile
 */
export const useAuthProfile = () => useAuthStore((state) => state.profile)

/**
 * Hook to get auth session
 */
export const useAuthSession = () => useAuthStore((state) => state.session)

/**
 * Hook to get current campaign
 */
export const useCurrentCampaign = () =>
  useCampaignStore((state) => state.currentCampaign)

/**
 * Hook to get campaigns list
 */
export const useCampaigns = () => useCampaignStore((state) => state.campaigns)

/**
 * Hook to get active character
 */
export const useActiveCharacter = () =>
  useCharacterStore((state) => state.activeCharacter)

/**
 * Hook to get characters list
 */
export const useCharacters = () =>
  useCharacterStore((state) => state.characters)

/**
 * Hook to get game state initiative order
 */
export const useInitiativeOrder = () =>
  useGameStateStore((state) => state.initiativeOrder)

/**
 * Hook to get active effects
 */
export const useActiveEffects = () =>
  useGameStateStore((state) => state.activeEffects)

/**
 * Hook to get selected tokens
 */
export const useSelectedTokens = () =>
  useGameStateStore((state) => state.selectedTokens)

/**
 * Hook to get tool mode
 */
export const useToolMode = () => useGameStateStore((state) => state.toolMode)

/**
 * Hook to get VTT zoom
 */
export const useVTTZoom = () => useVTTStore((state) => state.zoom)

/**
 * Hook to get VTT pan
 */
export const useVTTPan = () => useVTTStore((state) => state.pan)

/**
 * Hook to get grid settings
 */
export const useGridSettings = () =>
  useVTTStore((state) => state.gridSettings)

/**
 * Hook to get token positions
 */
export const useTokenPositions = () =>
  useVTTStore((state) => state.tokenPositions)

/**
 * Helper function to initialize stores
 * Call this when the app starts to set up realtime subscriptions
 */
export function initializeStores() {
  // This can be called from a root component or layout
  // to set up initial subscriptions if needed
  // For now, stores handle their own subscriptions when needed
}

/**
 * Helper function to cleanup all store subscriptions
 * Call this when the app unmounts or user logs out
 */
export function cleanupStores() {
  useCampaignStore.getState().unsubscribe()
  useCharacterStore.getState().unsubscribe()
  useGameStateStore.getState().unsubscribe()
  useVTTStore.getState().unsubscribe()
}

