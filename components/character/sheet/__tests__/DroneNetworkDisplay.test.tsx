import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  setupDisplayCardMock,
  LUCIDE_MOCK,
  createRiggerCharacter,
  createSheetCharacter,
  MOCK_DRONE,
  MOCK_DRONE_WITH_AUTOSOFTS,
  MOCK_RCC,
  MOCK_RCC_WITH_OPTIONS,
} from "./test-helpers";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

const mockGetOwnedDrones = vi.fn();
const mockGetActiveRCC = vi.fn();
const mockCalculateMaxSlavedDrones = vi.fn();

vi.mock("@/lib/rules/rigging", () => ({
  getOwnedDrones: (...args: unknown[]) => mockGetOwnedDrones(...args),
  getActiveRCC: (...args: unknown[]) => mockGetActiveRCC(...args),
  calculateMaxSlavedDrones: (...args: unknown[]) => mockCalculateMaxSlavedDrones(...args),
}));

import { DroneNetworkDisplay } from "../DroneNetworkDisplay";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("DroneNetworkDisplay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetOwnedDrones.mockReturnValue([]);
    mockGetActiveRCC.mockReturnValue(null);
    mockCalculateMaxSlavedDrones.mockReturnValue(0);
  });

  it("returns null when no drones and no RCC", () => {
    const character = createSheetCharacter();
    const { container } = render(<DroneNetworkDisplay character={character} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders drone rows with name, size badge, and pilot rating", () => {
    mockGetOwnedDrones.mockReturnValue([MOCK_DRONE, MOCK_DRONE_WITH_AUTOSOFTS]);
    mockGetActiveRCC.mockReturnValue(null);

    const character = createRiggerCharacter();
    render(<DroneNetworkDisplay character={character} />);

    const rows = screen.getAllByTestId("drone-row");
    expect(rows).toHaveLength(2);

    expect(screen.getByText("MCT Fly-Spy")).toBeInTheDocument();
    expect(screen.getByText("Rex")).toBeInTheDocument(); // customName
  });

  it("shows expanded content with stats on click", () => {
    mockGetOwnedDrones.mockReturnValue([MOCK_DRONE]);
    mockGetActiveRCC.mockReturnValue(null);

    const character = createRiggerCharacter();
    render(<DroneNetworkDisplay character={character} />);

    // Initially no expanded content
    expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(screen.getByTestId("drone-row"));
    expect(screen.getByTestId("expanded-content")).toBeInTheDocument();
    expect(screen.getByTestId("stat-body")).toHaveTextContent("Body");
    expect(screen.getByTestId("stat-armor")).toHaveTextContent("Armor");
  });

  it("shows installed autosofts in expanded drone section", () => {
    mockGetOwnedDrones.mockReturnValue([MOCK_DRONE_WITH_AUTOSOFTS]);
    mockGetActiveRCC.mockReturnValue(null);

    const character = createRiggerCharacter();
    render(<DroneNetworkDisplay character={character} />);

    // Expand the drone row
    fireEvent.click(screen.getByTestId("drone-row"));

    expect(screen.getByTestId("installed-autosofts")).toBeInTheDocument();
    const rows = screen.getAllByTestId("autosoft-row");
    expect(rows).toHaveLength(2);
    expect(screen.getByText("Clearsight")).toBeInTheDocument();
    expect(screen.getByText("Targeting (Automatics)")).toBeInTheDocument();
  });

  it("renders network header with RCC and capacity", () => {
    mockGetOwnedDrones.mockReturnValue([MOCK_DRONE]);
    mockGetActiveRCC.mockReturnValue(MOCK_RCC);
    mockCalculateMaxSlavedDrones.mockReturnValue(12);

    const character = createRiggerCharacter();
    render(<DroneNetworkDisplay character={character} />);

    expect(screen.getByTestId("network-header")).toBeInTheDocument();
    expect(screen.getByText("RCC-Standard")).toBeInTheDocument();
    expect(screen.getByTestId("capacity-badge")).toHaveTextContent("0 / 12 Slaved");
  });

  it("renders shared autosofts section when RCC has running autosofts", () => {
    mockGetOwnedDrones.mockReturnValue([]);
    mockGetActiveRCC.mockReturnValue(MOCK_RCC_WITH_OPTIONS);
    mockCalculateMaxSlavedDrones.mockReturnValue(18);

    const character = createRiggerCharacter();
    render(<DroneNetworkDisplay character={character} />);

    expect(screen.getByTestId("shared-autosofts")).toBeInTheDocument();
    expect(screen.getByText("Electronic Warfare")).toBeInTheDocument();
    expect(screen.getByText("Stealth")).toBeInTheDocument();
  });
});
