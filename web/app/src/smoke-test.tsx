import { JSDOM } from 'jsdom';
import { render, cleanup } from '@testing-library/react';
import { EditionProvider } from './context/EditionContext';
import { App } from './App';

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
const { window } = dom;

Object.defineProperty(globalThis, 'window', {
  value: window,
  configurable: true,
  writable: true,
});

Object.defineProperty(globalThis, 'document', {
  value: window.document,
  configurable: true,
  writable: true,
});

Object.defineProperty(globalThis, 'HTMLElement', {
  value: window.HTMLElement,
  configurable: true,
  writable: true,
});

if (!('navigator' in globalThis)) {
  Object.defineProperty(globalThis, 'navigator', {
    value: { userAgent: 'node' },
    configurable: true,
  });
}

const originalFetch = globalThis.fetch;

globalThis.fetch = async () =>
  new Response(
    JSON.stringify({
      edition: 'sr5',
      character_creation: { priorities: {}, metatypes: [] },
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );

const container = window.document.getElementById('root') ?? window.document.body;

render(
  <EditionProvider>
    <App />
  </EditionProvider>,
  { container },
);

const textContent = container.textContent ?? '';

if (!/React shell active/i.test(textContent)) {
  cleanup();
  if (originalFetch) {
    globalThis.fetch = originalFetch;
  }
  throw new Error('Smoke test failed: Expected React banner not found.');
}

cleanup();

if (originalFetch) {
  globalThis.fetch = originalFetch;
} else {
  delete (globalThis as { fetch?: typeof fetch }).fetch;
}

console.log('Smoke test passed: React shell rendered successfully.');
