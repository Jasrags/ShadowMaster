import { JSDOM } from 'jsdom';
import { render, cleanup } from '@testing-library/react';
import { useEffect } from 'react';
import { EditionProvider } from './context/EditionContext';
import { App } from './App';
import { useEdition } from './hooks/useEdition';

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
const originalReplaceState = window.history.replaceState;

window.history.replaceState = () => {};

globalThis.fetch = async (input: RequestInfo | URL, _init?: RequestInit) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
  void _init;

  if (url.includes('/campaigns/') && url.endsWith('/character-creation')) {
    const isKarma = url.includes('campaign-karma');
    return new Response(
      JSON.stringify({
        campaign_id: isKarma ? 'campaign-karma' : 'campaign-123',
        edition: 'sr5',
        creation_method: isKarma ? 'karma' : 'sum_to_ten',
        edition_data: {
          priorities: {
            resources: {
              A: { label: '450,000¥' },
              B: { label: '275,000¥' },
              C: { label: '140,000¥' },
              D: { label: '50,000¥' },
              E: { label: '6,000¥' },
            },
          },
          metatypes: [],
          creation_methods: {
            priority: {
              label: 'Priority',
              description: 'Default priority-based creation.',
              point_budget: 0,
            },
            sum_to_ten: {
              label: 'Sum-to-Ten',
              description: 'Allocate ten points across the priority columns.',
              point_budget: 10,
              priority_costs: { A: 4, B: 3, C: 2, D: 1, E: 0 },
            },
            karma: {
              label: 'Karma Point-Buy',
              description: 'Start with 800 Karma. Purchase metatype, attributes, skills, and more.',
              karma_budget: 800,
              metatype_costs: {
                human: 0,
                elf: 40,
              },
              gear_conversion: {
                max_karma_for_gear: 200,
              },
            },
          },
          gameplay_levels: {},
        },
        gameplay_rules: {
          key: 'street',
          label: 'Street-Level Play',
          resources: { A: 75000, B: 50000, C: 25000, D: 15000, E: 6000 },
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }

  if (url.includes('/api/users')) {
    return new Response(
      JSON.stringify([
        {
          id: 'user-1',
          email: 'gm@example.com',
          username: 'Gamemaster',
          roles: ['gamemaster'],
        },
      ]),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }

  if (url.includes('/editions/') && url.endsWith('/character-creation')) {
    return new Response(
      JSON.stringify({
        priorities: {
          resources: {
            A: { label: '450,000¥' },
            B: { label: '275,000¥' },
            C: { label: '140,000¥' },
            D: { label: '50,000¥' },
            E: { label: '6,000¥' },
          },
        },
        metatypes: [],
        creation_methods: {
          priority: {
            label: 'Priority',
            point_budget: 0,
          },
          sum_to_ten: {
            label: 'Sum-to-Ten',
            point_budget: 10,
            priority_costs: { A: 4, B: 3, C: 2, D: 1, E: 0 },
          },
          karma: {
            label: 'Karma Point-Buy',
            karma_budget: 800,
            metatype_costs: {
              human: 0,
              elf: 40,
            },
            gear_conversion: {
              max_karma_for_gear: 200,
            },
          },
        },
        gameplay_levels: {},
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }

  return new Response('Not Found', { status: 404, headers: { 'Content-Type': 'text/plain' } });
};

function ContextProbe() {
  const context = useEdition();
  useEffect(() => {
    (window as unknown as { __editionContext?: ReturnType<typeof useEdition> }).__editionContext = context;
  });
  return null;
}

const container = window.document.getElementById('root') ?? window.document.body;

render(
  <EditionProvider>
    <ContextProbe />
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

await new Promise((resolve) => setTimeout(resolve, 0));

const editionContextHolder = window as unknown as {
  __editionContext?: ReturnType<typeof useEdition>;
};

const waitForEditionContextReady = async (expectedEdition?: string) => {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const context = editionContextHolder.__editionContext;
    if (
      context &&
      (!expectedEdition || context.activeEdition.key === expectedEdition) &&
      !context.isLoading &&
      context.characterCreationData
    ) {
      return context;
    }
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  return editionContextHolder.__editionContext;
};

const editionContext = await waitForEditionContextReady();

if (!editionContext) {
  cleanup();
  if (originalFetch) {
    globalThis.fetch = originalFetch;
  }
  throw new Error('Smoke test failed: Edition context not available.');
}

editionContext.setEdition('sr5');
await new Promise((resolve) => setTimeout(resolve, 20));

const sr5Context = await waitForEditionContextReady('sr5');

if (!sr5Context) {
  cleanup();
  if (originalFetch) {
    globalThis.fetch = originalFetch;
  }
  throw new Error('Smoke test failed: Unable to switch to SR5 edition.');
}

await sr5Context.loadCampaignCharacterCreation('campaign-123');
await new Promise((resolve) => setTimeout(resolve, 40));

const updatedContext = editionContextHolder.__editionContext;

if (!updatedContext?.campaignGameplayRules || updatedContext.campaignGameplayRules.key !== 'street') {
  // Debug logging to aid smoke-test failures
  console.error('Smoke test debug: campaign gameplay rules state', updatedContext?.campaignGameplayRules);
  console.error('Smoke test debug: campaign loading', updatedContext?.campaignLoading, 'campaign error', updatedContext?.campaignError);
  cleanup();
  if (originalFetch) {
    globalThis.fetch = originalFetch;
  }
  throw new Error('Smoke test failed: Campaign gameplay rules were not applied.');
}

const resourceTable = updatedContext.characterCreationData?.priorities?.resources;
const priorityALabel = resourceTable?.A?.label;

if (priorityALabel !== '75,000¥') {
  cleanup();
  if (originalFetch) {
    globalThis.fetch = originalFetch;
  }
  throw new Error(`Smoke test failed: Expected campaign resource override of 75,000¥, found ${priorityALabel}`);
}

const sumToTenSnapshot = container.textContent ?? '';

if (!/Sum-to-Ten Assignment/i.test(sumToTenSnapshot) || !/Spent 10 \/ 10 points/i.test(sumToTenSnapshot)) {
  cleanup();
  if (originalFetch) {
    globalThis.fetch = originalFetch;
  }
  throw new Error('Smoke test failed: Sum-to-Ten interface did not render with full budget summary.');
}

await sr5Context.loadCampaignCharacterCreation('campaign-karma');
await new Promise((resolve) => setTimeout(resolve, 40));

const karmaSnapshot = container.textContent ?? '';

if (!/Karma Point-Buy/i.test(karmaSnapshot) || !/Karma budget/i.test(karmaSnapshot)) {
  cleanup();
  if (originalFetch) {
    globalThis.fetch = originalFetch;
  }
  throw new Error('Smoke test failed: Karma point-buy interface did not render.');
}

cleanup();

if (originalFetch) {
  globalThis.fetch = originalFetch;
} else {
  delete (globalThis as { fetch?: typeof fetch }).fetch;
}

if (originalReplaceState) {
  window.history.replaceState = originalReplaceState;
}

console.log('Smoke test passed: React shell rendered successfully.');
