/**
 * CyberdeckConfigDisplay Component Tests
 *
 * Tests the cyberdeck ASDF configuration card with swap controls
 * and preset configurations.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  setupDisplayCardMock,
  LUCIDE_MOCK,
  createDeckerCharacter,
  createSheetCharacter,
  MOCK_CYBERDECK,
} from "./test-helpers";

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

vi.mock("@/lib/rules/matrix/cyberdeck-validator", () => ({
  getActiveCyberdeck: vi.fn(),
  swapAttributes: vi.fn(),
  validateCyberdeckConfig: vi.fn(),
  createDefaultConfig: vi.fn(),
  createOffensiveConfig: vi.fn(),
  createStealthyConfig: vi.fn(),
}));

import { CyberdeckConfigDisplay } from "../CyberdeckConfigDisplay";
import {
  getActiveCyberdeck,
  swapAttributes,
  validateCyberdeckConfig,
  createDefaultConfig,
  createOffensiveConfig,
  createStealthyConfig,
} from "@/lib/rules/matrix/cyberdeck-validator";

const mockGetActiveCyberdeck = vi.mocked(getActiveCyberdeck);
const mockSwapAttributes = vi.mocked(swapAttributes);
const mockValidateCyberdeckConfig = vi.mocked(validateCyberdeckConfig);
const mockCreateDefaultConfig = vi.mocked(createDefaultConfig);
const mockCreateOffensiveConfig = vi.mocked(createOffensiveConfig);
const mockCreateStealthyConfig = vi.mocked(createStealthyConfig);

function setupMocks() {
  mockGetActiveCyberdeck.mockReturnValue(MOCK_CYBERDECK);
  mockSwapAttributes.mockImplementation((config, attr1, attr2) => ({
    ...config,
    [attr1]: config[attr2],
    [attr2]: config[attr1],
  }));
  mockValidateCyberdeckConfig.mockReturnValue({
    valid: true,
    errors: [],
    warnings: [],
    effectiveAttributes: MOCK_CYBERDECK.currentConfig,
  });
  mockCreateDefaultConfig.mockReturnValue({
    dataProcessing: 6,
    firewall: 5,
    sleaze: 4,
    attack: 3,
  });
  mockCreateOffensiveConfig.mockReturnValue({
    attack: 6,
    sleaze: 5,
    dataProcessing: 4,
    firewall: 3,
  });
  mockCreateStealthyConfig.mockReturnValue({
    sleaze: 6,
    dataProcessing: 5,
    firewall: 4,
    attack: 3,
  });
}

const deckerCharacter = createDeckerCharacter();

describe("CyberdeckConfigDisplay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders current ASDF configuration", () => {
    setupMocks();
    render(<CyberdeckConfigDisplay character={deckerCharacter} />);
    expect(screen.getByText("Deck Configuration")).toBeInTheDocument();
    expect(screen.getByText("Attack")).toBeInTheDocument();
    expect(screen.getByText("Sleaze")).toBeInTheDocument();
    expect(screen.getByText("Data Processing")).toBeInTheDocument();
    expect(screen.getByText("Firewall")).toBeInTheDocument();
  });

  it("shows deck attribute array reference", () => {
    setupMocks();
    render(<CyberdeckConfigDisplay character={deckerCharacter} />);
    expect(screen.getByText("Attribute Array")).toBeInTheDocument();
    expect(screen.getByText("[6, 5, 4, 3]")).toBeInTheDocument();
  });

  it("shows program slot usage in header", () => {
    setupMocks();
    render(<CyberdeckConfigDisplay character={deckerCharacter} />);
    // MOCK_CYBERDECK has 2 loaded programs and 5 slots
    expect(screen.getByText("2/5 slots")).toBeInTheDocument();
  });

  it("swap buttons swap correct attributes", () => {
    setupMocks();
    render(<CyberdeckConfigDisplay character={deckerCharacter} editable />);
    // Click swap button on Sleaze row (swaps with Attack above it)
    const swapButtons = screen.getAllByLabelText(/Swap/);
    fireEvent.click(swapButtons[0]); // First swap: Sleaze ↔ Attack
    expect(mockSwapAttributes).toHaveBeenCalledWith(
      MOCK_CYBERDECK.currentConfig,
      "sleaze",
      "attack"
    );
  });

  it("validates config before applying", async () => {
    setupMocks();
    mockValidateCyberdeckConfig.mockReturnValue({
      valid: false,
      errors: [{ code: "MISMATCH", message: "Values do not match array" }],
      warnings: [],
      effectiveAttributes: MOCK_CYBERDECK.currentConfig,
    });

    render(
      <CyberdeckConfigDisplay character={deckerCharacter} onCharacterUpdate={vi.fn()} editable />
    );

    // Trigger a swap to enable Apply button
    const swapButtons = screen.getAllByLabelText(/Swap/);
    fireEvent.click(swapButtons[0]);

    // Click Apply
    const applyButton = screen.getByText("Apply");
    fireEvent.click(applyButton);

    expect(mockValidateCyberdeckConfig).toHaveBeenCalled();
    // Should show error since validation failed
    expect(await screen.findByText("Values do not match array")).toBeInTheDocument();
  });

  it("does not show swap buttons when not editable", () => {
    setupMocks();
    render(<CyberdeckConfigDisplay character={deckerCharacter} editable={false} />);
    expect(screen.queryAllByLabelText(/Swap/)).toHaveLength(0);
  });

  it("does not render when no cyberdecks", () => {
    mockGetActiveCyberdeck.mockReturnValue(null);
    const mundane = createSheetCharacter();
    const { container } = render(<CyberdeckConfigDisplay character={mundane} />);
    expect(container.innerHTML).toBe("");
  });

  it("shows preset buttons when editable", () => {
    setupMocks();
    render(<CyberdeckConfigDisplay character={deckerCharacter} editable />);
    expect(screen.getByText("Defensive")).toBeInTheDocument();
    expect(screen.getByText("Offensive")).toBeInTheDocument();
    expect(screen.getByText("Stealth")).toBeInTheDocument();
  });

  it("applies preset configuration on click", () => {
    setupMocks();
    render(<CyberdeckConfigDisplay character={deckerCharacter} editable />);
    fireEvent.click(screen.getByText("Offensive"));
    expect(mockCreateOffensiveConfig).toHaveBeenCalledWith(MOCK_CYBERDECK.attributeArray);
  });
});
