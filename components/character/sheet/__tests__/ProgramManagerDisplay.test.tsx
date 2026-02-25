/**
 * ProgramManagerDisplay Component Tests
 *
 * Tests the program management card showing loaded/unloaded programs,
 * slot usage, load/unload controls, and category badges.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  setupDisplayCardMock,
  LUCIDE_MOCK,
  createDeckerCharacter,
  createSheetCharacter,
  MOCK_PROGRAMS,
} from "./test-helpers";

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

vi.mock("@/lib/rules/matrix/program-validator", () => ({
  getProgramSlotLimit: vi.fn(),
  getLoadedPrograms: vi.fn(),
  getUnloadedPrograms: vi.fn(),
}));

import { ProgramManagerDisplay } from "../ProgramManagerDisplay";
import {
  getProgramSlotLimit,
  getLoadedPrograms,
  getUnloadedPrograms,
} from "@/lib/rules/matrix/program-validator";

const mockGetProgramSlotLimit = vi.mocked(getProgramSlotLimit);
const mockGetLoadedPrograms = vi.mocked(getLoadedPrograms);
const mockGetUnloadedPrograms = vi.mocked(getUnloadedPrograms);

function setupMocks() {
  mockGetProgramSlotLimit.mockReturnValue(5);
  mockGetLoadedPrograms.mockReturnValue(["exploit", "stealth"]);
  // Programs owned but not loaded
  mockGetUnloadedPrograms.mockReturnValue(
    MOCK_PROGRAMS.filter((p) => !["exploit", "stealth"].includes(p.catalogId))
  );
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
});
