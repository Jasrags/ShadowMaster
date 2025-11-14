import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';

import { CampaignViewDrawer } from '../components/CampaignViewDrawer';
import type { CampaignSummary } from '../types/campaigns';
import type { GameplayRules } from '../types/editions';

const gameplayRules: GameplayRules = {
  key: 'prime_runner',
  label: 'Prime Runner',
};

describe('CampaignViewDrawer', () => {
  it('renders campaign summary details and structured house rules read-only', () => {
    const campaign: CampaignSummary = {
      id: 'campaign-structured',
      name: 'Neo-Seattle Ops',
      edition: 'sr5',
      creation_method: 'priority',
      gameplay_level: 'prime_runner',
      gameplay_rules: gameplayRules,
      gm_name: 'GM Jane Doe',
      gm_user_id: 'gm-1',
      status: 'Active',
      created_at: '2080-05-01T12:00:00.000Z',
      updated_at: '2080-05-02T15:30:00.000Z',
      setup_locked_at: '2080-05-03T18:45:00.000Z',
      enabled_books: ['SR5', 'RG'],
      theme: 'Chrome Noir',
      house_rule_notes: 'Keep the shadows stylish.',
      automation: {
        initiative_automation: true,
        recoil_tracking: false,
      },
      factions: [
        {
          id: 'f-1',
          name: 'Ancients Seattle Chapter',
          tags: 'Go-gang',
          notes: 'Green bikes and sharper ears.',
        },
      ],
      locations: [
        {
          id: 'l-1',
          name: 'The Matchstick Jazz Club',
          descriptor: 'Runner-friendly speakeasy',
        },
      ],
      placeholders: [
        {
          id: 'p-1',
          name: 'Ghost',
          role: 'Face',
        },
      ],
      session_seed: {
        title: 'Session 1: Meet the Johnson',
        objectives: 'Secure the briefcase; keep collateral to a minimum.',
        sceneTemplate: 'social_meetup',
        summary: 'Downtown meet-and-greet to set the tone.',
        skip: false,
      },
      players: [
        {
          id: 'player-1',
          username: 'Razr',
        },
      ],
      player_user_ids: ['player-1'],
      can_edit: false,
      can_delete: false,
    };

    render(<CampaignViewDrawer campaign={campaign} onClose={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Neo-Seattle Ops' })).toBeInTheDocument();
    expect(screen.getByText('GM Jane Doe')).toBeInTheDocument();
    const summarySection = screen.getByRole('heading', { level: 4, name: 'Summary' }).closest('section');
    expect(summarySection).not.toBeNull();
    expect(within(summarySection as HTMLElement).getByText('Prime Runner')).toBeInTheDocument();
    expect(within(summarySection as HTMLElement).getByText('SR5')).toBeInTheDocument();

    const sourcebooksSection = screen
      .getByRole('heading', { level: 4, name: 'Enabled Sourcebooks' })
      .closest('section');
    expect(sourcebooksSection).not.toBeNull();
    const sourcebooksList = within(sourcebooksSection as HTMLElement).getByRole('list');
    expect(within(sourcebooksList).getByText('SR5')).toBeInTheDocument();
    expect(within(sourcebooksList).getByText('RG')).toBeInTheDocument();

    expect(screen.getByText(/Theme:/i)).toBeInTheDocument();
    expect(screen.getByText('Chrome Noir')).toBeInTheDocument();
    expect(screen.getByText(/Notes:/i)).toBeInTheDocument();
    expect(screen.getByText('Keep the shadows stylish.')).toBeInTheDocument();

    expect(screen.getByText('Initiative Automation')).toBeInTheDocument();
    expect(screen.getByText('Recoil Tracking')).toBeInTheDocument();
    expect(screen.getByText('Ancients Seattle Chapter')).toBeInTheDocument();
    expect(screen.getByText(/Go-gang/)).toBeInTheDocument();
    expect(screen.getByText('The Matchstick Jazz Club')).toBeInTheDocument();
    expect(screen.getByText(/Runner-friendly speakeasy/)).toBeInTheDocument();
    expect(screen.getByText('Ghost')).toBeInTheDocument();
    expect(screen.getByText(/Face/)).toBeInTheDocument();
    expect(screen.getByText('Session 1: Meet the Johnson')).toBeInTheDocument();
    expect(screen.getByText('Razr')).toBeInTheDocument();

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryAllByRole('combobox')).toHaveLength(0);
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
  });

  it('falls back to raw house rule JSON when parsing fails', () => {
    const rawHouseRules = '{ invalid json }';
    const campaign: CampaignSummary = {
      id: 'campaign-raw',
      name: 'Shadows of Neo-Tokyo',
      edition: 'sr5',
      creation_method: 'priority',
      status: 'Paused',
      enabled_books: [],
      house_rules: rawHouseRules,
      can_edit: false,
      can_delete: false,
    };

    render(<CampaignViewDrawer campaign={campaign} onClose={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Shadows of Neo-Tokyo' })).toBeInTheDocument();
    expect(screen.getByText('Raw House Rules')).toBeInTheDocument();
    expect(screen.getByText(rawHouseRules)).toBeInTheDocument();
  });
});
