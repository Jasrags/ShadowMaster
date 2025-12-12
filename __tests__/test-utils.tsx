/**
 * Test utilities for React component testing
 * 
 * Provides custom render function with context providers and
 * helper functions for common test scenarios.
 */

import type { ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { AuthProvider } from '@/lib/auth/AuthProvider';
import { RulesetProvider } from '@/lib/rules/RulesetContext';

/**
 * Custom render function that wraps components with necessary providers
 */
function AllTheProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RulesetProvider>
        {children}
      </RulesetProvider>
    </AuthProvider>
  );
}

/**
 * Custom render function for testing components that need context providers
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllTheProviders, ...options });
}

/**
 * Render without providers (for testing isolated components)
 */
function renderWithoutProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, options);
}

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { customRender as render, renderWithoutProviders };

