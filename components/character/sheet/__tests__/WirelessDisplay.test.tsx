/**
 * WirelessDisplay Component Tests
 *
 * Tests the wireless status card showing global toggle state,
 * equipment counts, active bonus summary, and toggle interaction.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { setupDisplayCardMock, LUCIDE_MOCK, createSheetCharacter } from "./test-helpers";

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

vi.mock("@/lib/rules/wireless", () => ({
  isGlobalWirelessEnabled: vi.fn(),
  getWirelessBonusSummary: vi.fn(),
}));

vi.mock("@/lib/rules/inventory", () => ({
  getEquipmentStateSummary: vi.fn(),
}));

import { WirelessDisplay } from "../WirelessDisplay";
import { isGlobalWirelessEnabled, getWirelessBonusSummary } from "@/lib/rules/wireless";
import { getEquipmentStateSummary } from "@/lib/rules/inventory";

const mockIsGlobalWirelessEnabled = vi.mocked(isGlobalWirelessEnabled);
const mockGetWirelessBonusSummary = vi.mocked(getWirelessBonusSummary);
const mockGetEquipmentStateSummary = vi.mocked(getEquipmentStateSummary);

// Default mocks
function setupMocks({
  enabled = true,
  bonuses = [] as { category: string; description: string; modifier: string }[],
  wirelessEnabled = 3,
  wirelessDisabled = 1,
}: {
  enabled?: boolean;
  bonuses?: { category: string; description: string; modifier: string }[];
  wirelessEnabled?: number;
  wirelessDisabled?: number;
} = {}) {
  mockIsGlobalWirelessEnabled.mockReturnValue(enabled);
  mockGetWirelessBonusSummary.mockReturnValue(bonuses);
  mockGetEquipmentStateSummary.mockReturnValue({
    readiedWeapons: 1,
    holsteredWeapons: 0,
    storedWeapons: 0,
    stashedWeapons: 0,
    wornArmor: 1,
    storedArmor: 0,
    stashedArmor: 0,
    wirelessEnabled,
    wirelessDisabled,
    brickedDevices: 0,
  });
}

const baseCharacter = createSheetCharacter();

describe("WirelessDisplay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders card with Wireless title", () => {
    setupMocks();
    render(<WirelessDisplay character={baseCharacter} />);
    expect(screen.getByText("Wireless")).toBeInTheDocument();
  });

  it('shows "Wireless Active" when enabled', () => {
    setupMocks({ enabled: true });
    render(<WirelessDisplay character={baseCharacter} />);
    expect(screen.getByText("Wireless Active")).toBeInTheDocument();
  });

  it('shows "Wireless Silent" when disabled', () => {
    setupMocks({ enabled: false });
    render(<WirelessDisplay character={baseCharacter} />);
    expect(screen.getByText("Wireless Silent")).toBeInTheDocument();
  });

  it("shows equipment counts", () => {
    setupMocks({ wirelessEnabled: 5, wirelessDisabled: 2 });
    render(<WirelessDisplay character={baseCharacter} />);
    expect(screen.getByText("5 on / 2 off")).toBeInTheDocument();
  });

  it("shows toggle switch only when editable", () => {
    setupMocks();
    const { rerender } = render(<WirelessDisplay character={baseCharacter} editable={false} />);
    expect(screen.queryByRole("switch")).not.toBeInTheDocument();

    rerender(<WirelessDisplay character={baseCharacter} editable={true} />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("calls onCharacterUpdate with toggled wirelessBonusesEnabled on click", () => {
    setupMocks({ enabled: true });
    const onUpdate = vi.fn();
    render(
      <WirelessDisplay character={baseCharacter} onCharacterUpdate={onUpdate} editable={true} />
    );

    fireEvent.click(screen.getByRole("switch"));
    expect(onUpdate).toHaveBeenCalledTimes(1);
    const updated = onUpdate.mock.calls[0][0];
    expect(updated.wirelessBonusesEnabled).toBe(false);
  });

  it("toggles from disabled to enabled", () => {
    setupMocks({ enabled: false });
    const onUpdate = vi.fn();
    render(
      <WirelessDisplay character={baseCharacter} onCharacterUpdate={onUpdate} editable={true} />
    );

    fireEvent.click(screen.getByRole("switch"));
    expect(onUpdate).toHaveBeenCalledTimes(1);
    const updated = onUpdate.mock.calls[0][0];
    expect(updated.wirelessBonusesEnabled).toBe(true);
  });

  it("renders bonus summary rows when bonuses exist and wireless ON", () => {
    setupMocks({
      enabled: true,
      bonuses: [
        { category: "Attack", description: "Wireless bonus to attack pools", modifier: "+2" },
        { category: "Initiative", description: "Wireless bonus to Initiative", modifier: "+1" },
      ],
    });
    render(<WirelessDisplay character={baseCharacter} />);
    expect(screen.getByText("Active Bonuses")).toBeInTheDocument();
    expect(screen.getByText("Attack")).toBeInTheDocument();
    expect(screen.getByText("Wireless bonus to attack pools")).toBeInTheDocument();
    expect(screen.getByText("+2")).toBeInTheDocument();
    expect(screen.getByText("Initiative")).toBeInTheDocument();
    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  it('shows "No active wireless bonuses" when empty array and wireless ON', () => {
    setupMocks({ enabled: true, bonuses: [] });
    render(<WirelessDisplay character={baseCharacter} />);
    expect(screen.getByText("Active Bonuses")).toBeInTheDocument();
    expect(screen.getByText("No active wireless bonuses")).toBeInTheDocument();
  });

  it("hides bonus section when wireless OFF", () => {
    setupMocks({ enabled: false });
    render(<WirelessDisplay character={baseCharacter} />);
    expect(screen.queryByText("Active Bonuses")).not.toBeInTheDocument();
  });

  it("handles wirelessBonusesEnabled: undefined (defaults to true)", () => {
    const char = createSheetCharacter({ wirelessBonusesEnabled: undefined });
    setupMocks({ enabled: true });
    render(<WirelessDisplay character={char} />);
    expect(screen.getByText("Wireless Active")).toBeInTheDocument();
    expect(mockIsGlobalWirelessEnabled).toHaveBeenCalledWith(char);
  });

  it("does not call onCharacterUpdate when toggle clicked without handler", () => {
    setupMocks({ enabled: true });
    render(<WirelessDisplay character={baseCharacter} editable={true} />);
    // Should not throw
    fireEvent.click(screen.getByRole("switch"));
  });
});
