import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  setupDisplayCardMock,
  LUCIDE_MOCK,
  createRiggerCharacter,
  createSheetCharacter,
  MOCK_DRONE_WITH_AUTOSOFTS,
  MOCK_RCC_WITH_OPTIONS,
  MOCK_AUTOSOFT_PERCEPTION,
  MOCK_AUTOSOFT_COMBAT,
  MOCK_AUTOSOFT_MOVEMENT,
} from "./test-helpers";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

const mockGetOwnedAutosofts = vi.fn();
const mockGetOwnedDrones = vi.fn();
const mockGetActiveRCC = vi.fn();

vi.mock("@/lib/rules/rigging", () => ({
  getOwnedAutosofts: (...args: unknown[]) => mockGetOwnedAutosofts(...args),
  getOwnedDrones: (...args: unknown[]) => mockGetOwnedDrones(...args),
  getActiveRCC: (...args: unknown[]) => mockGetActiveRCC(...args),
}));

import { AutosoftManagerDisplay } from "../AutosoftManagerDisplay";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("AutosoftManagerDisplay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetOwnedAutosofts.mockReturnValue([]);
    mockGetOwnedDrones.mockReturnValue([]);
    mockGetActiveRCC.mockReturnValue(null);
  });

  it("returns null when no autosofts, no running autosofts, no drone autosofts", () => {
    const character = createSheetCharacter();
    const { container } = render(<AutosoftManagerDisplay character={character} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders RCC running autosofts section", () => {
    mockGetActiveRCC.mockReturnValue(MOCK_RCC_WITH_OPTIONS);

    const character = createRiggerCharacter();
    render(<AutosoftManagerDisplay character={character} />);

    expect(screen.getByTestId("rcc-running-section")).toBeInTheDocument();
    expect(screen.getByText("Electronic Warfare")).toBeInTheDocument();
    expect(screen.getByText("Stealth")).toBeInTheDocument();
  });

  it("renders per-drone installed autosofts section", () => {
    mockGetOwnedDrones.mockReturnValue([MOCK_DRONE_WITH_AUTOSOFTS]);

    const character = createRiggerCharacter();
    render(<AutosoftManagerDisplay character={character} />);

    expect(screen.getByTestId("drone-autosofts-section")).toBeInTheDocument();
    expect(screen.getByText("Rex")).toBeInTheDocument(); // customName of MOCK_DRONE_WITH_AUTOSOFTS
    expect(screen.getByText("Clearsight")).toBeInTheDocument();
    expect(screen.getByText("Targeting (Automatics)")).toBeInTheDocument();
  });

  it("shows available autosofts section with toggle", () => {
    mockGetOwnedAutosofts.mockReturnValue([
      MOCK_AUTOSOFT_PERCEPTION,
      MOCK_AUTOSOFT_COMBAT,
      MOCK_AUTOSOFT_MOVEMENT,
    ]);

    const character = createRiggerCharacter();
    render(<AutosoftManagerDisplay character={character} />);

    // Available section exists but collapsed by default
    expect(screen.getByTestId("available-section")).toBeInTheDocument();
    expect(screen.getByTestId("available-toggle")).toHaveTextContent("Owned (3)");

    // No autosoft rows visible initially (collapsed)
    expect(screen.queryAllByTestId("autosoft-row")).toHaveLength(0);

    // Click to expand
    fireEvent.click(screen.getByTestId("available-toggle"));

    // Now autosoft rows are visible
    const rows = screen.getAllByTestId("autosoft-row");
    expect(rows).toHaveLength(3);
  });

  it("displays category badges with correct labels", () => {
    mockGetOwnedAutosofts.mockReturnValue([
      MOCK_AUTOSOFT_PERCEPTION,
      MOCK_AUTOSOFT_COMBAT,
      MOCK_AUTOSOFT_MOVEMENT,
    ]);

    const character = createRiggerCharacter();
    render(<AutosoftManagerDisplay character={character} />);

    // Expand to see badges
    fireEvent.click(screen.getByTestId("available-toggle"));

    const badges = screen.getAllByTestId("category-badge");
    const badgeTexts = badges.map((b) => b.textContent);
    expect(badgeTexts).toContain("Perception");
    expect(badgeTexts).toContain("Combat");
    expect(badgeTexts).toContain("Movement");
  });

  it("displays rating pills", () => {
    mockGetOwnedAutosofts.mockReturnValue([MOCK_AUTOSOFT_PERCEPTION]);

    const character = createRiggerCharacter();
    render(<AutosoftManagerDisplay character={character} />);

    // Expand available section
    fireEvent.click(screen.getByTestId("available-toggle"));

    const ratingPills = screen.getAllByTestId("rating-pill");
    expect(ratingPills[0]).toHaveTextContent("R3");
  });

  it("shows target text for targeted autosofts", () => {
    mockGetOwnedAutosofts.mockReturnValue([MOCK_AUTOSOFT_COMBAT]);

    const character = createRiggerCharacter();
    render(<AutosoftManagerDisplay character={character} />);

    fireEvent.click(screen.getByTestId("available-toggle"));

    expect(screen.getByText("(automatics)")).toBeInTheDocument();
  });
});
