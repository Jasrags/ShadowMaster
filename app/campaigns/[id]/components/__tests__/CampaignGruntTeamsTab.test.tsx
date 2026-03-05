/**
 * Tests for CampaignGruntTeamsTab component
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import CampaignGruntTeamsTab from "../CampaignGruntTeamsTab";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("CampaignGruntTeamsTab", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should show loading state initially", () => {
    mockFetch.mockReturnValue(new Promise(() => {})); // Never resolves

    render(<CampaignGruntTeamsTab campaignId="campaign-1" />);

    expect(document.querySelector(".animate-spin")).toBeTruthy();
  });

  it("should show empty state when no teams", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, teams: [] }),
    });

    render(<CampaignGruntTeamsTab campaignId="campaign-1" />);

    await waitFor(() => {
      expect(screen.getByText("No grunt teams yet")).toBeInTheDocument();
    });
  });

  it("should render team cards when teams exist", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        teams: [
          {
            id: "team-1",
            campaignId: "campaign-1",
            name: "Street Thugs",
            professionalRating: 1,
            initialSize: 4,
            groupEdge: 1,
            groupEdgeMax: 1,
            state: { activeCount: 4, casualties: 0, moraleBroken: false },
            createdAt: "2024-01-01T00:00:00Z",
            baseGrunts: {
              attributes: {
                body: 3,
                agility: 3,
                reaction: 3,
                strength: 3,
                willpower: 2,
                logic: 2,
                intuition: 2,
                charisma: 2,
              },
              essence: 6,
              skills: {},
              weapons: [],
              armor: [],
              gear: [],
              conditionMonitorSize: 10,
            },
          },
        ],
      }),
    });

    render(<CampaignGruntTeamsTab campaignId="campaign-1" />);

    await waitFor(() => {
      expect(screen.getByText("Street Thugs")).toBeInTheDocument();
    });
  });

  it("should show Create Grunt Team button", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, teams: [] }),
    });

    render(<CampaignGruntTeamsTab campaignId="campaign-1" />);

    await waitFor(() => {
      expect(screen.getByText("Create Grunt Team")).toBeInTheDocument();
    });
  });

  it("should show error on fetch failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, error: "Not authorized" }),
    });

    render(<CampaignGruntTeamsTab campaignId="campaign-1" />);

    await waitFor(() => {
      expect(screen.getByText("Not authorized")).toBeInTheDocument();
    });
  });

  it("should show team count", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        teams: [
          {
            id: "team-1",
            campaignId: "campaign-1",
            name: "Team Alpha",
            professionalRating: 2,
            initialSize: 6,
            groupEdge: 2,
            groupEdgeMax: 2,
            state: { activeCount: 6, casualties: 0, moraleBroken: false },
            createdAt: "2024-01-01T00:00:00Z",
            baseGrunts: {
              attributes: {
                body: 3,
                agility: 3,
                reaction: 3,
                strength: 3,
                willpower: 3,
                logic: 3,
                intuition: 3,
                charisma: 3,
              },
              essence: 6,
              skills: {},
              weapons: [],
              armor: [],
              gear: [],
              conditionMonitorSize: 10,
            },
          },
          {
            id: "team-2",
            campaignId: "campaign-1",
            name: "Team Bravo",
            professionalRating: 3,
            initialSize: 4,
            groupEdge: 3,
            groupEdgeMax: 3,
            state: { activeCount: 4, casualties: 0, moraleBroken: false },
            createdAt: "2024-01-01T00:00:00Z",
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
              skills: {},
              weapons: [],
              armor: [],
              gear: [],
              conditionMonitorSize: 10,
            },
          },
        ],
      }),
    });

    render(<CampaignGruntTeamsTab campaignId="campaign-1" />);

    await waitFor(() => {
      expect(screen.getByText("Showing 2 grunt teams")).toBeInTheDocument();
    });
  });
});
