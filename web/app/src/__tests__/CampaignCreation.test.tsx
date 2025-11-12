import '@testing-library/jest-dom/vitest';
import { describe, it, expect, beforeEach, afterEach, beforeAll, vi } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CampaignCreation } from '../components/CampaignCreation';
import type { CharacterCreationData } from '../types/editions';

const mockPushNotification = vi.fn();
const mockReloadEdition = vi.fn();
const mockSetEdition = vi.fn();

const creationData: CharacterCreationData = {
  priorities: {},
  metatypes: [],
  gameplay_levels: {
    experienced: {
      label: 'Experienced',
    },
  },
  creation_methods: {
    priority: {
      label: 'Priority',
    },
  },
  campaign_support: {
    factions: [
      {
        id: 'faction-ares',
        name: 'Ares Macrotechnology',
        tags: 'Corporate, AAA',
        notes: 'Megacorp interested in experimental weapons testing.',
      },
    ],
    locations: [],
    placeholders: [
      {
        id: 'placeholder-face',
        name: 'Face Runner',
        role: 'Face',
      },
    ],
    session_seeds: [
      {
        id: 'seed-session-0',
        title: 'Session 0',
        objectives: 'Meet the fixer',
        scene_template: 'social_meetup',
        summary: 'Establish the team and expectations.',
      },
    ],
  },
};

vi.mock('../hooks/useEdition', () => ({
  useEdition: () => ({
    activeEdition: { key: 'sr5', label: 'Shadowrun 5th Edition', isPrimary: true, mockDataLoaded: true },
    supportedEditions: [
      { key: 'sr3', label: 'Shadowrun 3rd Edition', isPrimary: false, mockDataLoaded: true },
      { key: 'sr5', label: 'Shadowrun 5th Edition', isPrimary: true, mockDataLoaded: true },
    ],
    characterCreationData: creationData,
    campaignCharacterCreation: undefined,
    reloadEditionData: mockReloadEdition,
    setEdition: mockSetEdition,
  }),
}));

vi.mock('../context/NotificationContext', () => ({
  useNotifications: () => ({
    pushNotification: mockPushNotification,
  }),
}));

const respondWith = (payload: unknown) =>
  Promise.resolve({
    ok: true,
    json: async () => payload,
  } as Response);

const fetchMock = vi.fn<typeof fetch>();
const scrollIntoViewMock = vi.fn();

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    writable: true,
    value: scrollIntoViewMock,
  });
});

beforeEach(() => {
  document.body.innerHTML = '<div id="campaign-creation-react-root"></div>';

  fetchMock.mockImplementation((input: RequestInfo | URL) => {
    const url = typeof input === 'string' ? input : input.toString();

    if (url.includes('/books')) {
      return respondWith({
        books: [
          { id: 'sr5-core', name: 'Shadowrun 5 Core', code: 'SR5' },
        ],
      });
    }

    if (url.includes('/character-creation')) {
      return respondWith({ character_creation: creationData });
    }

    if (url.includes('/api/users')) {
      return respondWith([
        { id: 'gm-1', username: 'GM K', email: 'gm@example.com', roles: ['gamemaster'] },
      ]);
    }

    if (url.includes('/api/characters')) {
      return respondWith([]);
    }

    return respondWith({});
  });

  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  fetchMock.mockReset();
  mockPushNotification.mockReset();
  mockReloadEdition.mockReset();
  mockSetEdition.mockReset();
  scrollIntoViewMock.mockReset();
  vi.unstubAllGlobals();
});

describe('CampaignCreation wizard', () => {
  it('surfaces a single summary error when basics validation fails', async () => {
    const user = userEvent.setup();
    render(<CampaignCreation />);

    await user.click(await screen.findByRole('button', { name: /create campaign/i }));

    const nextButton = await screen.findByRole('button', { name: /^next$/i });
    await user.click(nextButton);

    const alerts = await screen.findAllByRole('alert');
    const banner = alerts.find((element) => element.classList.contains('form-error--banner'));
    expect(banner).toBeTruthy();
    const items = within(banner as HTMLElement).getAllByRole('listitem');

    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent(/provide a campaign name/i);
    expect(screen.getByText(/campaign name is required/i)).toBeInTheDocument();
  });

  it('allows selecting a faction preset and advancing past the world step', async () => {
    const user = userEvent.setup();
    render(<CampaignCreation />);

    await user.click(await screen.findByRole('button', { name: /create campaign/i }));

    const nameInput = await screen.findByLabelText(/campaign name/i);
    await user.type(nameInput, 'Emerald City Ops');

    await user.click(screen.getByRole('button', { name: /^next$/i }));
    await screen.findByRole('heading', { level: 4, name: /roster & roles/i });

    await user.click(screen.getByRole('button', { name: /add placeholder/i }));

    await user.click(screen.getByRole('button', { name: /^next$/i }));
    await screen.findByRole('heading', { level: 4, name: /world backbone/i });

    const browseButtons = screen.getAllByRole('button', { name: /browse library/i });
    await user.click(browseButtons[0]);

    const factionPanel = await screen.findByRole('region', { name: /faction library/i });
    await user.click(within(factionPanel).getByRole('button', { name: /ares macrotechnology/i }));

    await waitFor(() => {
      expect(screen.getByDisplayValue('Ares Macrotechnology')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /^next$/i }));

    await screen.findByRole('heading', { level: 4, name: /house rules & automation/i });
  });
});
