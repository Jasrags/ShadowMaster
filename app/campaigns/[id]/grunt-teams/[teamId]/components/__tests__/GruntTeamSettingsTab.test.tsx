/**
 * Tests for GruntTeamSettingsTab component
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GruntTeamSettingsTab } from "../GruntTeamSettingsTab";
import type { GruntTeam } from "@/lib/types";

const mockFetch = vi.fn();
global.fetch = mockFetch;

function createMockTeam(overrides?: Partial<GruntTeam>): GruntTeam {
  return {
    id: "team-1",
    campaignId: "campaign-1",
    name: "Test Team",
    description: "A test grunt team",
    professionalRating: 3,
    groupEdge: 3,
    groupEdgeMax: 3,
    initialSize: 6,
    baseGrunts: {
      attributes: {
        body: 4,
        agility: 4,
        reaction: 4,
        strength: 4,
        willpower: 3,
        logic: 3,
        intuition: 3,
        charisma: 3,
      },
      essence: 6,
      skills: { Firearms: 4 },
      weapons: [],
      armor: [],
      gear: [],
      conditionMonitorSize: 10,
    },
    state: {
      activeCount: 6,
      casualties: 0,
      moraleBroken: false,
    },
    options: {
      useGroupInitiative: true,
      useSimplifiedRules: false,
    },
    visibility: {
      showToPlayers: false,
    },
    createdAt: "2024-01-01T00:00:00Z",
    ...overrides,
  } as GruntTeam;
}

describe("GruntTeamSettingsTab", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render team settings", () => {
    const team = createMockTeam();
    const onTeamUpdate = vi.fn();

    render(<GruntTeamSettingsTab team={team} onTeamUpdate={onTeamUpdate} />);

    expect(screen.getByDisplayValue("Test Team")).toBeInTheDocument();
    expect(screen.getByDisplayValue("A test grunt team")).toBeInTheDocument();
  });

  it("should display morale thresholds for PR3", () => {
    const team = createMockTeam({ professionalRating: 3 });
    const onTeamUpdate = vi.fn();

    render(<GruntTeamSettingsTab team={team} onTeamUpdate={onTeamUpdate} />);

    // PR3 break threshold is 50%
    expect(screen.getByText("50% casualties")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument(); // Can rally
  });

  it("should display Group Edge values", () => {
    const team = createMockTeam({ groupEdge: 2, groupEdgeMax: 3 });
    const onTeamUpdate = vi.fn();

    render(<GruntTeamSettingsTab team={team} onTeamUpdate={onTeamUpdate} />);

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("should save settings when Save button clicked", async () => {
    const team = createMockTeam();
    const onTeamUpdate = vi.fn();
    const updatedTeam = createMockTeam({ name: "Updated Team" });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, team: updatedTeam }),
    });

    render(<GruntTeamSettingsTab team={team} onTeamUpdate={onTeamUpdate} />);

    fireEvent.click(screen.getByText("Save Settings"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/grunt-teams/${team.id}`,
        expect.objectContaining({
          method: "PUT",
        })
      );
    });

    await waitFor(() => {
      expect(onTeamUpdate).toHaveBeenCalledWith(updatedTeam);
    });
  });

  it("should show error on save failure", async () => {
    const team = createMockTeam();
    const onTeamUpdate = vi.fn();

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, error: "Validation failed" }),
    });

    render(<GruntTeamSettingsTab team={team} onTeamUpdate={onTeamUpdate} />);

    fireEvent.click(screen.getByText("Save Settings"));

    await waitFor(() => {
      expect(screen.getByText("Validation failed")).toBeInTheDocument();
    });
  });

  it("should display combat options", () => {
    const team = createMockTeam();
    const onTeamUpdate = vi.fn();

    render(<GruntTeamSettingsTab team={team} onTeamUpdate={onTeamUpdate} />);

    expect(screen.getByText("Use Group Initiative")).toBeInTheDocument();
    expect(screen.getByText("Use Simplified Rules")).toBeInTheDocument();
  });
});
