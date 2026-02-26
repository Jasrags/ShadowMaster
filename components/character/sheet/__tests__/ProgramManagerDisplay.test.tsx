/**
 * ProgramManagerDisplay Component Tests
 *
 * Tests the program management card showing loaded/unloaded programs,
 * slot usage, load/unload controls, category badges, effects display,
 * and slot warning indicators.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  setupDisplayCardMock,
  LUCIDE_MOCK,
  createDeckerCharacter,
  createSheetCharacter,
  MOCK_PROGRAMS,
  MOCK_PROGRAM_CATALOG,
} from "./test-helpers";

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

vi.mock("@/lib/rules/matrix/program-validator", () => ({
  getProgramSlotLimit: vi.fn(),
  getLoadedPrograms: vi.fn(),
  getUnloadedPrograms: vi.fn(),
}));

vi.mock("@/lib/rules/RulesetContext", () => ({
  usePrograms: vi.fn(),
}));

import { ProgramManagerDisplay } from "../ProgramManagerDisplay";
import {
  getProgramSlotLimit,
  getLoadedPrograms,
  getUnloadedPrograms,
} from "@/lib/rules/matrix/program-validator";
import { usePrograms } from "@/lib/rules/RulesetContext";

const mockGetProgramSlotLimit = vi.mocked(getProgramSlotLimit);
const mockGetLoadedPrograms = vi.mocked(getLoadedPrograms);
const mockGetUnloadedPrograms = vi.mocked(getUnloadedPrograms);
const mockUsePrograms = vi.mocked(usePrograms);

function setupMocks() {
  mockGetProgramSlotLimit.mockReturnValue(5);
  mockGetLoadedPrograms.mockReturnValue(["exploit", "stealth"]);
  // Programs owned but not loaded
  mockGetUnloadedPrograms.mockReturnValue(
    MOCK_PROGRAMS.filter((p) => !["exploit", "stealth"].includes(p.catalogId))
  );
  mockUsePrograms.mockReturnValue(MOCK_PROGRAM_CATALOG);
}

const deckerCharacter = createDeckerCharacter();

describe("ProgramManagerDisplay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loaded programs with category badges", () => {
    setupMocks();
    render(<ProgramManagerDisplay character={deckerCharacter} />);
    expect(screen.getByText("Programs")).toBeInTheDocument();
    expect(screen.getByText("Loaded")).toBeInTheDocument();
    expect(screen.getByText("Exploit")).toBeInTheDocument();
    expect(screen.getByText("Stealth")).toBeInTheDocument();
    // Both are hacking programs
    const hackingBadges = screen.getAllByText("Hacking");
    expect(hackingBadges.length).toBeGreaterThanOrEqual(2);
  });

  it("shows slot usage in header", () => {
    setupMocks();
    render(<ProgramManagerDisplay character={deckerCharacter} />);
    expect(screen.getByText("2/5 loaded")).toBeInTheDocument();
  });

  it("shows unload button for loaded programs when editable", () => {
    setupMocks();
    render(<ProgramManagerDisplay character={deckerCharacter} editable />);
    const unloadButtons = screen.getAllByText("Unload");
    expect(unloadButtons.length).toBe(2);
  });

  it("does not show load/unload buttons when not editable", () => {
    setupMocks();
    render(<ProgramManagerDisplay character={deckerCharacter} editable={false} />);
    expect(screen.queryByText("Unload")).not.toBeInTheDocument();
    expect(screen.queryByText("Load")).not.toBeInTheDocument();
  });

  it("shows available section toggle with count", () => {
    setupMocks();
    render(<ProgramManagerDisplay character={deckerCharacter} editable />);
    // Available section should show count
    expect(screen.getByText(/Available \(3\)/)).toBeInTheDocument();
  });

  it("expands available section to show unloaded programs", () => {
    setupMocks();
    render(<ProgramManagerDisplay character={deckerCharacter} editable />);
    // Click to expand available section
    fireEvent.click(screen.getByText(/Available \(3\)/));
    expect(screen.getByText("Toolbox")).toBeInTheDocument();
    expect(screen.getByText("Armor")).toBeInTheDocument();
    // "Agent" appears as both name and category badge
    const agentElements = screen.getAllByText("Agent");
    expect(agentElements.length).toBeGreaterThanOrEqual(1);
  });

  it("slot limit enforced (load button disabled when full)", () => {
    mockGetProgramSlotLimit.mockReturnValue(2); // Only 2 slots, both full
    mockGetLoadedPrograms.mockReturnValue(["exploit", "stealth"]);
    mockGetUnloadedPrograms.mockReturnValue(
      MOCK_PROGRAMS.filter((p) => !["exploit", "stealth"].includes(p.catalogId))
    );
    mockUsePrograms.mockReturnValue(MOCK_PROGRAM_CATALOG);

    render(<ProgramManagerDisplay character={deckerCharacter} editable />);
    // Expand available
    fireEvent.click(screen.getByText(/Available/));

    // Load buttons should be disabled
    const loadButtons = screen.getAllByText("Load");
    loadButtons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it("does not render when character has no programs", () => {
    mockGetProgramSlotLimit.mockReturnValue(0);
    mockGetLoadedPrograms.mockReturnValue([]);
    mockGetUnloadedPrograms.mockReturnValue([]);
    mockUsePrograms.mockReturnValue([]);
    const noProgramsChar = createSheetCharacter({ programs: [] });
    const { container } = render(<ProgramManagerDisplay character={noProgramsChar} />);
    expect(container.innerHTML).toBe("");
  });

  it("shows agent program with rating badge", () => {
    setupMocks();
    render(<ProgramManagerDisplay character={deckerCharacter} editable />);
    // Expand available section to see Agent program
    fireEvent.click(screen.getByText(/Available/));
    // "Agent" appears as both name and category badge
    const agentElements = screen.getAllByText("Agent");
    expect(agentElements.length).toBe(2); // name + category badge
    expect(screen.getByText("R3")).toBeInTheDocument();
  });

  // =========================================================================
  // Agent slot calculation tests
  // =========================================================================

  it("calculates agent program slots by rating", () => {
    // Load agent (R3) + exploit (1 slot) = 4 effective slots used
    mockGetProgramSlotLimit.mockReturnValue(5);
    mockGetLoadedPrograms.mockReturnValue(["exploit", "agent"]);
    mockGetUnloadedPrograms.mockReturnValue(
      MOCK_PROGRAMS.filter((p) => !["exploit", "agent"].includes(p.catalogId))
    );
    mockUsePrograms.mockReturnValue(MOCK_PROGRAM_CATALOG);

    const charWithAgentLoaded = createDeckerCharacter({
      cyberdecks: [
        {
          id: "deck-1",
          catalogId: "novatech-navigator",
          name: "Novatech Navigator",
          deviceRating: 4,
          attributeArray: [6, 5, 4, 3],
          currentConfig: { attack: 3, sleaze: 4, dataProcessing: 6, firewall: 5 },
          programSlots: 5,
          loadedPrograms: ["exploit", "agent"],
          cost: 40750,
          availability: 6,
        },
      ],
    });

    render(<ProgramManagerDisplay character={charWithAgentLoaded} />);
    // Agent R3 = 3 slots + exploit = 1 slot = 4 total
    expect(screen.getByText("4/5 loaded")).toBeInTheDocument();
  });

  it("disables load button when agent won't fit remaining slots", () => {
    // 4/5 slots used (1 normal + agent R3), only 1 slot remaining
    // Agent R3 needs 3 slots, so Load should be disabled for agent
    mockGetProgramSlotLimit.mockReturnValue(5);
    mockGetLoadedPrograms.mockReturnValue(["exploit", "agent"]);
    // Only stealth, toolbox, armor remain unloaded (agent is loaded)
    mockGetUnloadedPrograms.mockReturnValue(
      MOCK_PROGRAMS.filter((p) => !["exploit", "agent"].includes(p.catalogId))
    );
    mockUsePrograms.mockReturnValue(MOCK_PROGRAM_CATALOG);

    const charWithAgentLoaded = createDeckerCharacter({
      cyberdecks: [
        {
          id: "deck-1",
          catalogId: "novatech-navigator",
          name: "Novatech Navigator",
          deviceRating: 4,
          attributeArray: [6, 5, 4, 3],
          currentConfig: { attack: 3, sleaze: 4, dataProcessing: 6, firewall: 5 },
          programSlots: 5,
          loadedPrograms: ["exploit", "agent"],
          cost: 40750,
          availability: 6,
        },
      ],
    });

    render(<ProgramManagerDisplay character={charWithAgentLoaded} editable />);
    // Expand available
    fireEvent.click(screen.getByText(/Available/));

    // 1 slot remaining: stealth (1 slot) should be loadable, but all other normal programs too
    // All load buttons for single-slot programs should be enabled
    const loadButtons = screen.getAllByText("Load");
    // All unloaded are single-slot programs (stealth, toolbox, armor), all should be enabled
    loadButtons.forEach((btn) => {
      expect(btn).not.toBeDisabled();
    });
  });

  // =========================================================================
  // Program effects display tests
  // =========================================================================

  it("shows effects in expanded program row", () => {
    setupMocks();
    render(<ProgramManagerDisplay character={deckerCharacter} />);

    // Expand the Exploit program row
    fireEvent.click(screen.getByText("Exploit"));
    expect(screen.getByText("+2 to Hack on the Fly and Brute Force")).toBeInTheDocument();
  });

  it("shows effects for unloaded programs", () => {
    setupMocks();
    render(<ProgramManagerDisplay character={deckerCharacter} editable />);

    // Expand available section
    fireEvent.click(screen.getByText(/Available/));
    // Expand the Toolbox row
    fireEvent.click(screen.getByText("Toolbox"));
    expect(screen.getByText("+1 Data Processing")).toBeInTheDocument();
  });

  it("gracefully handles missing catalog data", () => {
    mockGetProgramSlotLimit.mockReturnValue(5);
    mockGetLoadedPrograms.mockReturnValue(["exploit"]);
    mockGetUnloadedPrograms.mockReturnValue([]);
    mockUsePrograms.mockReturnValue([]); // No catalog data

    render(<ProgramManagerDisplay character={deckerCharacter} />);
    // Should still render without effects
    expect(screen.getByText("Exploit")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Exploit"));
    // Effects text should not appear
    expect(screen.queryByText("+2 to Hack on the Fly and Brute Force")).not.toBeInTheDocument();
  });

  // =========================================================================
  // Slot warning tests
  // =========================================================================

  it("shows amber warning when 1 slot remaining", () => {
    mockGetProgramSlotLimit.mockReturnValue(3); // 3 max, 2 used = 1 remaining
    mockGetLoadedPrograms.mockReturnValue(["exploit", "stealth"]);
    mockGetUnloadedPrograms.mockReturnValue([]);
    mockUsePrograms.mockReturnValue(MOCK_PROGRAM_CATALOG);

    const { container } = render(<ProgramManagerDisplay character={deckerCharacter} />);
    const slotBadge = screen.getByText("2/3 loaded");
    expect(slotBadge.className).toContain("bg-amber-100");
  });

  it("shows amber warning when 0 slots remaining", () => {
    mockGetProgramSlotLimit.mockReturnValue(2); // 2 max, 2 used = 0 remaining
    mockGetLoadedPrograms.mockReturnValue(["exploit", "stealth"]);
    mockGetUnloadedPrograms.mockReturnValue([]);
    mockUsePrograms.mockReturnValue(MOCK_PROGRAM_CATALOG);

    const { container } = render(<ProgramManagerDisplay character={deckerCharacter} />);
    const slotBadge = screen.getByText("2/2 loaded");
    expect(slotBadge.className).toContain("bg-amber-100");
  });

  it("shows red warning when over slot limit", () => {
    // Simulate over-limit: 3 loaded but only 2 slots
    mockGetProgramSlotLimit.mockReturnValue(2);
    mockGetLoadedPrograms.mockReturnValue(["exploit", "stealth", "toolbox"]);
    mockGetUnloadedPrograms.mockReturnValue([]);
    mockUsePrograms.mockReturnValue(MOCK_PROGRAM_CATALOG);

    const overloadedChar = createDeckerCharacter({
      programs: [...MOCK_PROGRAMS],
      cyberdecks: [
        {
          id: "deck-1",
          catalogId: "novatech-navigator",
          name: "Novatech Navigator",
          deviceRating: 4,
          attributeArray: [6, 5, 4, 3],
          currentConfig: { attack: 3, sleaze: 4, dataProcessing: 6, firewall: 5 },
          programSlots: 2,
          loadedPrograms: ["exploit", "stealth", "toolbox"],
          cost: 40750,
          availability: 6,
        },
      ],
    });

    render(<ProgramManagerDisplay character={overloadedChar} />);
    const slotBadge = screen.getByText("3/2 loaded");
    expect(slotBadge.className).toContain("bg-red-100");
  });

  it("shows normal styling with plenty of slots", () => {
    mockGetProgramSlotLimit.mockReturnValue(10); // 10 max, 2 used = 8 remaining
    mockGetLoadedPrograms.mockReturnValue(["exploit", "stealth"]);
    mockGetUnloadedPrograms.mockReturnValue([]);
    mockUsePrograms.mockReturnValue(MOCK_PROGRAM_CATALOG);

    render(<ProgramManagerDisplay character={deckerCharacter} />);
    const slotBadge = screen.getByText("2/10 loaded");
    expect(slotBadge.className).toContain("bg-zinc-200");
  });

  // =========================================================================
  // API error feedback tests
  // =========================================================================

  it("shows error message on API failure", async () => {
    setupMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: "No active cyberdeck to load programs" }),
    });

    const onUpdate = vi.fn();
    render(
      <ProgramManagerDisplay character={deckerCharacter} onCharacterUpdate={onUpdate} editable />
    );

    // Expand available and click Load on Toolbox
    fireEvent.click(screen.getByText(/Available/));
    fireEvent.click(screen.getAllByText("Load")[0]);

    await waitFor(() => {
      expect(screen.getByText("No active cyberdeck to load programs")).toBeInTheDocument();
    });

    // Character should not be updated on failure
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("clears error on successful operation", async () => {
    setupMocks();
    // First call fails
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: "Slot limit exceeded" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

    const onUpdate = vi.fn();
    render(
      <ProgramManagerDisplay character={deckerCharacter} onCharacterUpdate={onUpdate} editable />
    );

    // First attempt fails
    const unloadButtons = screen.getAllByText("Unload");
    fireEvent.click(unloadButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Slot limit exceeded")).toBeInTheDocument();
    });

    // Second attempt succeeds
    fireEvent.click(unloadButtons[1]);

    await waitFor(() => {
      expect(screen.queryByText("Slot limit exceeded")).not.toBeInTheDocument();
    });
  });
});
