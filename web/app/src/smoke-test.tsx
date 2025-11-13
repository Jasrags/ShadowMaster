import { JSDOM } from 'jsdom';
import { render, cleanup } from '@testing-library/react';
import { useEffect } from 'react';
import { EditionProvider } from './context/EditionContext';
import { CharacterWizardProvider } from './context/CharacterWizardContext';
import { WizardProvider } from './context/WizardContext';
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

const portalHostIds = [
  'auth-root',
  'main-navigation-root',
  'campaign-creation-react-root',
  'campaigns-list',
  'characters-actions',
  'priority-assignment-react-root',
  'metatype-selection-react-root',
  'magical-abilities-react-root',
  'characters-view',
  'campaigns-view',
  'sessions-view',
];

portalHostIds.forEach((id) => {
  const host = window.document.createElement('div');
  host.id = id;
  window.document.body.appendChild(host);
});

const CustomEventPolyfill = (() => {
  if (typeof window.CustomEvent === 'function') {
    return window.CustomEvent;
  }
  function Polyfill(event: string, params?: CustomEventInit) {
    const detail = params ?? { bubbles: false, cancelable: false, detail: undefined };
    const evt = window.document.createEvent('CustomEvent');
    evt.initCustomEvent(event, detail.bubbles ?? false, detail.cancelable ?? false, detail.detail);
    return evt;
  }
  Polyfill.prototype = window.Event.prototype;
  return Polyfill as unknown as typeof window.CustomEvent;
})();

Object.defineProperty(window, 'CustomEvent', {
  value: CustomEventPolyfill,
  configurable: true,
  writable: true,
});

Object.defineProperty(globalThis, 'CustomEvent', {
  value: CustomEventPolyfill,
  configurable: true,
  writable: true,
});

Object.defineProperty(window.HTMLElement.prototype, 'focus', {
  value() {
    // no-op focus to satisfy components relying on focus management in tests
  },
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

  if (url.endsWith('/api/campaigns') && (!_init || !_init.method || _init.method === 'GET')) {
    return new Response(
      JSON.stringify([
        {
          id: 'campaign-123',
          name: 'Prime Run',
          description: 'A sample campaign',
          edition: 'sr5',
          creation_method: 'priority',
          gameplay_level: 'experienced',
          status: 'Active',
          enabled_books: ['SR5', 'AP'],
          can_edit: true,
          can_delete: true,
          gm_name: 'Gamemaster',
          gm_user_id: 'user-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }

  if (url.includes('/api/characters')) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
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

  if (url.includes('/editions/') && url.endsWith('/books')) {
    return new Response(
      JSON.stringify({
        books: [
          { id: 'sr5', name: 'Shadowrun 5th Edition', code: 'SR5' },
          { id: 'ap', name: "Assassin's Primer", code: 'AP' },
        ],
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
    <CharacterWizardProvider>
      <WizardProvider>
        <ContextProbe />
        <App />
      </WizardProvider>
    </CharacterWizardProvider>
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
await new Promise((resolve) => setTimeout(resolve, 100));

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

const sumToTenMethod = updatedContext.characterCreationData?.creation_methods?.sum_to_ten;

if (!sumToTenMethod || sumToTenMethod.point_budget !== 10) {
  cleanup();
  if (originalFetch) {
    globalThis.fetch = originalFetch;
  }
  throw new Error('Smoke test failed: Sum-to-Ten configuration unavailable or incorrect.');
}

await sr5Context.loadCampaignCharacterCreation('campaign-karma');
await new Promise((resolve) => setTimeout(resolve, 100));

const karmaMethod = editionContextHolder.__editionContext?.characterCreationData?.creation_methods?.karma;

if (!karmaMethod || karmaMethod.karma_budget !== 800) {
  cleanup();
  if (originalFetch) {
    globalThis.fetch = originalFetch;
  }
  throw new Error('Smoke test failed: Karma point-buy configuration unavailable or incorrect.');
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
