import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CampaignManageDrawer } from '../components/CampaignManageDrawer';
import type { CampaignSummary } from '../types/campaigns';
import type { GameplayRules, UserSummary } from '../types/editions';

const loadCampaignCharacterCreation = vi.fn();

vi.mock('../hooks/useEdition', () => {
  return {
    useEdition: () => ({
      loadCampaignCharacterCreation,
      campaignCharacterCreation: {
        campaign_support: {
          factions: [
            {
              id: 'faction-ancients',
              name: 'Ancients Seattle Chapter',
              tags: 'Go-gang, Elven, Smuggling',
              notes: 'Fast bikes and faster tempers.'
            },
            {
              id: 'faction-shiawase',
              name: 'Shiawase Executive Taskforce',
              tags: 'Corporate',
              notes: 'Containment specialists.'
            }
          ],
          locations: [
            {
              id: 'location-matchstick',
              name: 'The Matchstick Jazz Club',
              descriptor: 'Runner-friendly speakeasy with bolt-holes.'
            }
          ]
        }
      },
      characterCreationData: undefined,
    }),
  };
});

const baseCampaign: CampaignSummary = {
  id: 'camp-1',
  name: 'Neo-Seattle Ops',
  edition: 'sr5',
  creation_method: 'priority',
  gameplay_level: 'experienced',
  status: 'Active',
  house_rules: '{}',
  enabled_books: [],
  can_edit: true,
  can_delete: true,
};

const gmUsers: UserSummary[] = [
  { id: 'gm-1', email: 'gm@example.com', username: 'GM', roles: ['gamemaster'] },
];

const gameplayRules: GameplayRules = {
  key: 'experienced',
  label: 'Experienced'
};

describe('CampaignManageDrawer preset picker', () => {
  beforeEach(() => {
    loadCampaignCharacterCreation.mockClear();
  });

  it('allows adding a faction from the library search', async () => {
    const user = userEvent.setup();
    render(
      <CampaignManageDrawer
        campaign={baseCampaign}
        gmUsers={gmUsers}
        gameplayRules={gameplayRules}
        onClose={() => undefined}
        onSave={vi.fn()}
      />,
    );

    const [factionBrowseButton] = screen.getAllByRole('button', { name: /browse library/i });
    await user.click(factionBrowseButton);
    await user.type(screen.getByPlaceholderText(/search faction library/i), 'ancients');
    await user.click(screen.getByRole('button', { name: /ancients seattle chapter/i }));

    expect(await screen.findByDisplayValue('Ancients Seattle Chapter')).toBeInTheDocument();
  });

  it('allows adding a location from the library search', async () => {
    const user = userEvent.setup();
    render(
      <CampaignManageDrawer
        campaign={baseCampaign}
        gmUsers={gmUsers}
        gameplayRules={gameplayRules}
        onClose={() => undefined}
        onSave={vi.fn()}
      />,
    );

    const browseButtons = screen.getAllByRole('button', { name: /browse library/i });
    await user.click(browseButtons[1]);

    await user.type(screen.getByPlaceholderText(/search location library/i), 'matchstick');
    await user.click(screen.getByRole('button', { name: /the matchstick jazz club/i }));

    expect(await screen.findByDisplayValue('The Matchstick Jazz Club')).toBeInTheDocument();
  });
});
