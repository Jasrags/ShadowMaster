import '@testing-library/jest-dom/vitest';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CampaignList } from '../components/CampaignList';
import type { ShadowmasterAuthState } from '../types/auth';
import type { CampaignSummary } from '../types/campaigns';
import type { ShadowmasterLegacyApp } from '../types/legacy';

const campaigns: CampaignSummary[] = [
  {
    id: 'camp-1',
    name: 'Seattle Nights',
    edition: 'sr5',
    creation_method: 'priority',
    gameplay_level: 'experienced',
    status: 'Active',
    gm_name: 'Nova',
    gm_user_id: 'gm-1',
    enabled_books: ['SR5'],
    can_edit: true,
    can_delete: true,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2025-01-02T00:00:00.000Z',
  },
  {
    id: 'camp-2',
    name: 'Neo-Tokyo Vault',
    edition: 'sr5',
    creation_method: 'priority',
    gameplay_level: 'street',
    status: 'Paused',
    gm_name: 'Zero',
    gm_user_id: 'gm-2',
    enabled_books: ['SR5'],
    can_edit: false,
    can_delete: false,
    created_at: '2025-01-03T00:00:00.000Z',
    updated_at: '2025-01-04T00:00:00.000Z',
  },
];

const gmRoster = [
  { id: 'gm-1', username: 'Nova', email: 'nova@example.com', roles: ['gamemaster'] },
  { id: 'gm-2', username: 'Zero', email: 'zero@example.com', roles: ['gamemaster'] },
];

const fetchMock = vi.fn<typeof fetch>();
const confirmMock = vi.fn();
const legacyApp: ShadowmasterLegacyApp = {};

beforeEach(() => {
  document.body.innerHTML = `
    <div id="campaigns-list"></div>
  `;

  fetchMock.mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    const options = init ?? {};

    if (url === '/api/campaigns' && options.method?.toUpperCase() === 'DELETE') {
      return Promise.resolve({ ok: true, status: 204, json: async () => ({}) } as Response);
    }

    if (url === '/api/campaigns' && (!options.method || options.method === 'GET')) {
      return Promise.resolve({ ok: true, json: async () => campaigns } as Response);
    }

    if (url.startsWith('/api/campaigns/') && options.method?.toUpperCase() === 'PUT') {
      const updated = JSON.parse(options.body as string);
      return Promise.resolve({
        ok: true,
        json: async () => ({
          ...campaigns[0],
          ...updated,
          id: campaigns[0].id,
          updated_at: new Date().toISOString(),
        }),
      } as Response);
    }

    if (url.startsWith('/api/users')) {
      return Promise.resolve({ ok: true, json: async () => gmRoster } as Response);
    }

    return Promise.resolve({ ok: true, json: async () => ({}) } as Response);
  });

  vi.stubGlobal('fetch', fetchMock);

  confirmMock.mockReturnValue(true);
  vi.stubGlobal('confirm', confirmMock);

  const authState: ShadowmasterAuthState = {
    isAdministrator: false,
    user: { id: 'gm-1', username: 'Nova', email: 'nova@example.com' },
  };
  window.ShadowmasterAuth = authState;
  window.ShadowmasterLegacyApp = legacyApp;
});

afterEach(() => {
  fetchMock.mockReset();
  confirmMock.mockReset();
  vi.unstubAllGlobals();
});

describe('CampaignList integration', () => {
  it('opens the view drawer and renders campaign details', async () => {
    const user = userEvent.setup();
    render(<CampaignList />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/campaigns', expect.anything());
    });

    const seattleRow = await screen.findByRole('row', { name: /Seattle Nights/i });
    await user.click(within(seattleRow).getByRole('button', { name: /view/i }));

    const heading = await screen.findByRole('heading', { name: /Seattle Nights/i });
    expect(heading).toBeInTheDocument();
    expect(screen.getByText(/SR5 \u00b7 Priority \u00b7 Experienced/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /close/i }));

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /Seattle Nights/i })).not.toBeInTheDocument();
    });
  });

  it('opens the manage drawer and saves an update', async () => {
    const user = userEvent.setup();
    render(<CampaignList />);

    await screen.findByRole('columnheader', { name: /Campaign/i });

    const seattleRow = await screen.findByRole('row', { name: /Seattle Nights/i });
    await user.click(within(seattleRow).getByRole('button', { name: /edit/i }));

    const drawerHeading = await screen.findByRole('heading', { name: /Seattle Nights/i });
    expect(drawerHeading).toBeInTheDocument();

    const nameInput = await screen.findByLabelText(/campaign name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Seattle Nights Updated');

    await user.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/campaigns/camp-1', expect.objectContaining({ method: 'PUT' }));
    });

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /Seattle Nights/i })).not.toBeInTheDocument();
    });

    await screen.findByText('Campaign "Seattle Nights Updated" updated.');
  });
});
