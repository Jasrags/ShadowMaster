/**
 * MatrixDevicesDisplay Component Tests
 *
 * Tests the matrix devices card showing all cyberdecks and commlinks,
 * active device indicator, and device switching.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  setupDisplayCardMock,
  LUCIDE_MOCK,
  createDeckerCharacter,
  createCommlinkCharacter,
  createSheetCharacter,
  MOCK_CYBERDECK,
  MOCK_COMMLINK,
} from "./test-helpers";

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

vi.mock("@/lib/rules/matrix/cyberdeck-validator", () => ({
  getActiveCyberdeck: vi.fn(),
  getCharacterCyberdecks: vi.fn(),
  getCharacterCommlinks: vi.fn(),
}));

import { MatrixDevicesDisplay } from "../MatrixDevicesDisplay";
import {
  getActiveCyberdeck,
  getCharacterCyberdecks,
  getCharacterCommlinks,
} from "@/lib/rules/matrix/cyberdeck-validator";

const mockGetActiveCyberdeck = vi.mocked(getActiveCyberdeck);
const mockGetCharacterCyberdecks = vi.mocked(getCharacterCyberdecks);
const mockGetCharacterCommlinks = vi.mocked(getCharacterCommlinks);

function setupDeckerMocks() {
  mockGetActiveCyberdeck.mockReturnValue(MOCK_CYBERDECK);
  mockGetCharacterCyberdecks.mockReturnValue([MOCK_CYBERDECK]);
  mockGetCharacterCommlinks.mockReturnValue([]);
}

function setupCommlinkMocks() {
  mockGetActiveCyberdeck.mockReturnValue(null);
  mockGetCharacterCyberdecks.mockReturnValue([]);
  mockGetCharacterCommlinks.mockReturnValue([MOCK_COMMLINK]);
}

function setupBothDevicesMocks() {
  mockGetActiveCyberdeck.mockReturnValue(MOCK_CYBERDECK);
  mockGetCharacterCyberdecks.mockReturnValue([MOCK_CYBERDECK]);
  mockGetCharacterCommlinks.mockReturnValue([MOCK_COMMLINK]);
}

function setupNoDevicesMocks() {
  mockGetActiveCyberdeck.mockReturnValue(null);
  mockGetCharacterCyberdecks.mockReturnValue([]);
  mockGetCharacterCommlinks.mockReturnValue([]);
}

const deckerCharacter = createDeckerCharacter();
const commlinkCharacter = createCommlinkCharacter();
const mundaneCharacter = createSheetCharacter();

describe("MatrixDevicesDisplay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders cyberdeck with name, type badge, DR, and ASDF summary", () => {
    setupDeckerMocks();
    render(<MatrixDevicesDisplay character={deckerCharacter} />);

    expect(screen.getByText("Matrix Devices")).toBeInTheDocument();
    // Name appears in device row and active footer
    const navNames = screen.getAllByText("Novatech Navigator");
    expect(navNames.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Cyberdeck")).toBeInTheDocument();
    expect(screen.getByText("DR 4")).toBeInTheDocument();
    expect(screen.getByText("A3 S4 D6 F5")).toBeInTheDocument();
  });

  it("renders commlink with name, type badge, DR, DP, FW", () => {
    setupCommlinkMocks();
    render(<MatrixDevicesDisplay character={commlinkCharacter} />);

    // Name appears in device row and active footer
    const ikonNames = screen.getAllByText("Hermes Ikon");
    expect(ikonNames.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Commlink")).toBeInTheDocument();
    expect(screen.getByText("DR 5")).toBeInTheDocument();
    expect(screen.getByText(/DP 5/)).toBeInTheDocument();
    expect(screen.getByText(/FW 5/)).toBeInTheDocument();
  });

  it("shows active device star indicator on active device", () => {
    setupDeckerMocks();
    render(<MatrixDevicesDisplay character={deckerCharacter} />);

    // Star icons present: one in the device row, one in the active footer
    const stars = screen.getAllByTestId("icon-Star");
    expect(stars.length).toBe(2);
  });

  it("shows program slots and loaded programs for cyberdecks", () => {
    setupDeckerMocks();
    render(<MatrixDevicesDisplay character={deckerCharacter} />);

    expect(screen.getByText("Slots 2/5")).toBeInTheDocument();
    expect(screen.getByText(/Exploit, Stealth/)).toBeInTheDocument();
  });

  it("shows legality badge for restricted cyberdecks", () => {
    const restrictedDeck = { ...MOCK_CYBERDECK, legality: "restricted" as const };
    mockGetActiveCyberdeck.mockReturnValue(restrictedDeck);
    mockGetCharacterCyberdecks.mockReturnValue([restrictedDeck]);
    mockGetCharacterCommlinks.mockReturnValue([]);

    render(
      <MatrixDevicesDisplay character={createDeckerCharacter({ cyberdecks: [restrictedDeck] })} />
    );

    expect(screen.getByText("R")).toBeInTheDocument();
  });

  it("shows condition badge for bricked devices", () => {
    const brickedDeck = { ...MOCK_CYBERDECK, condition: "bricked" as const };
    mockGetActiveCyberdeck.mockReturnValue(brickedDeck);
    mockGetCharacterCyberdecks.mockReturnValue([brickedDeck]);
    mockGetCharacterCommlinks.mockReturnValue([]);

    render(
      <MatrixDevicesDisplay character={createDeckerCharacter({ cyberdecks: [brickedDeck] })} />
    );

    expect(screen.getByText("Bricked")).toBeInTheDocument();
  });

  it("does not render when no matrix devices", () => {
    setupNoDevicesMocks();
    const { container } = render(<MatrixDevicesDisplay character={mundaneCharacter} />);
    expect(container.innerHTML).toBe("");
  });

  it("shows both cyberdeck and commlink when character has both", () => {
    setupBothDevicesMocks();
    const bothCharacter = createDeckerCharacter({ commlinks: [MOCK_COMMLINK] });
    render(<MatrixDevicesDisplay character={bothCharacter} />);

    // Names appear in device rows and possibly in footer/dropdown
    const navNames = screen.getAllByText("Novatech Navigator");
    expect(navNames.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Hermes Ikon")).toBeInTheDocument();
    expect(screen.getByText("Cyberdeck")).toBeInTheDocument();
    expect(screen.getByText("Commlink")).toBeInTheDocument();
  });

  it("shows Switch button when editable and multiple devices exist", () => {
    setupBothDevicesMocks();
    const bothCharacter = createDeckerCharacter({ commlinks: [MOCK_COMMLINK] });
    render(<MatrixDevicesDisplay character={bothCharacter} onCharacterUpdate={vi.fn()} editable />);

    expect(screen.getByText("Switch")).toBeInTheDocument();
  });

  it("does not show Switch button when only one device exists", () => {
    setupDeckerMocks();
    render(
      <MatrixDevicesDisplay character={deckerCharacter} onCharacterUpdate={vi.fn()} editable />
    );

    expect(screen.queryByText("Switch")).not.toBeInTheDocument();
  });

  it("Switch dropdown calls matrix API and onCharacterUpdate with new activeMatrixDeviceId", async () => {
    setupBothDevicesMocks();
    const onUpdate = vi.fn();
    const bothCharacter = createDeckerCharacter({ commlinks: [MOCK_COMMLINK] });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    render(
      <MatrixDevicesDisplay character={bothCharacter} onCharacterUpdate={onUpdate} editable />
    );

    // Open the dropdown
    fireEvent.click(screen.getByText("Switch"));

    // Click the commlink option in the dropdown (second occurrence - first is in device list)
    const ikonElements = screen.getAllByText("Hermes Ikon");
    // The last one is in the dropdown
    fireEvent.click(ikonElements[ikonElements.length - 1]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/characters/${bothCharacter.id}/matrix`,
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ activeDeviceId: "comm-1" }),
        })
      );
    });

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ activeMatrixDeviceId: "comm-1" })
      );
    });
  });

  it("does not show Switch button when not editable", () => {
    setupBothDevicesMocks();
    const bothCharacter = createDeckerCharacter({
      commlinks: [MOCK_COMMLINK],
      status: "retired",
    });
    render(
      <MatrixDevicesDisplay
        character={bothCharacter}
        onCharacterUpdate={vi.fn()}
        editable={false}
      />
    );

    expect(screen.queryByText("Switch")).not.toBeInTheDocument();
  });
});
