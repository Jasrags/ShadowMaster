/**
 * localStorage mock for testing
 *
 * Provides a mock implementation of localStorage that can be used
 * in tests for draft auto-save functionality.
 */

export class MockLocalStorage {
  private store: Record<string, string> = {};

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  get length(): number {
    return Object.keys(this.store).length;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
}

/**
 * Set up localStorage mock for tests
 */
export function setupLocalStorageMock(): MockLocalStorage {
  const mockStorage = new MockLocalStorage();

  // Replace global localStorage
  Object.defineProperty(window, "localStorage", {
    value: mockStorage,
    writable: true,
  });

  return mockStorage;
}

/**
 * Clean up localStorage mock after tests
 */
export function cleanupLocalStorageMock(): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (window as any).localStorage;
}
