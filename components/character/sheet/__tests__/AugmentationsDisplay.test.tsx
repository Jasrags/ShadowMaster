/**
 * AugmentationsDisplay Component Tests
 *
 * Tests the augmentations (cyberware/bioware) display with expandable rows.
 * Returns null when no augmentations. Shows cyberware vs bioware sections,
 * collapsed rows with name + rating, expanded detail content, and wireless
 * management controls (toggle, bonus text, effects pills).
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  createSheetCharacter,
  setupDisplayCardMock,
  LUCIDE_MOCK,
  MOCK_CYBERWARE,
  MOCK_BIOWARE,
} from "./test-helpers";

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

vi.mock("@/components/character/sheet/WirelessIndicator", () => ({
  WirelessIndicator: (props: {
    enabled: boolean;
    globalEnabled?: boolean;
    bonusDescription?: string;
    onToggle?: (v: boolean) => void;
  }) => (
    <div
      data-testid="wireless-indicator"
      data-enabled={String(props.enabled)}
      data-global-enabled={String(props.globalEnabled)}
    >
      {props.onToggle && (
        <button
          data-testid="wireless-indicator-toggle"
          onClick={() => props.onToggle!(!props.enabled)}
        >
          Toggle
        </button>
      )}
      {props.bonusDescription && <span>{props.bonusDescription}</span>}
    </div>
  ),
}));

vi.mock("@/lib/rules/wireless", () => ({
  isGlobalWirelessEnabled: vi.fn(() => true),
}));

vi.mock("@/lib/rules/RulesetContext", () => ({
  useCyberwareCatalog: vi.fn(() => []),
  useBiowareCatalog: vi.fn(() => []),
  useCyberware: vi.fn(() => ({ catalog: [] })),
}));

vi.mock("@/lib/rules/augmentations/cyberlimb-hooks", () => ({
  useAddCyberlimbEnhancement: vi.fn(() => ({
    add: vi.fn(),
    reset: vi.fn(),
    data: null,
    loading: false,
    error: null,
  })),
  useRemoveCyberlimbEnhancement: vi.fn(() => ({
    remove: vi.fn(),
    reset: vi.fn(),
    data: null,
    loading: false,
    error: null,
  })),
  useAddCyberlimbAccessory: vi.fn(() => ({
    add: vi.fn(),
    reset: vi.fn(),
    data: null,
    loading: false,
    error: null,
  })),
  useRemoveCyberlimbAccessory: vi.fn(() => ({
    remove: vi.fn(),
    reset: vi.fn(),
    data: null,
    loading: false,
    error: null,
  })),
  useToggleCyberlimbWireless: vi.fn(() => ({
    toggle: vi.fn(),
    reset: vi.fn(),
    data: null,
    loading: false,
    error: null,
  })),
}));

vi.mock("@/components/cyberlimbs/CyberlimbEnhancementModal", () => ({
  CyberlimbEnhancementModal: () => null,
}));

vi.mock("@/components/cyberlimbs/CyberlimbAccessoryModal", () => ({
  CyberlimbAccessoryModal: () => null,
}));

import { AugmentationsDisplay } from "../AugmentationsDisplay";

describe("AugmentationsDisplay", () => {
  it("returns null when no cyberware or bioware", () => {
    const character = createSheetCharacter({ cyberware: [], bioware: [] });
    const { container } = render(<AugmentationsDisplay character={character} />);
    expect(container.innerHTML).toBe("");
  });

  it("returns null when cyberware and bioware are undefined", () => {
    const character = createSheetCharacter({ cyberware: undefined, bioware: undefined });
    const { container } = render(<AugmentationsDisplay character={character} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders cyberware section header", () => {
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);
    expect(screen.getByText("Cyberware")).toBeInTheDocument();
  });

  it("renders bioware section header", () => {
    const character = createSheetCharacter({ bioware: [MOCK_BIOWARE] });
    render(<AugmentationsDisplay character={character} />);
    expect(screen.getByText("Bioware")).toBeInTheDocument();
  });

  it("renders both sections when character has both", () => {
    const character = createSheetCharacter({
      cyberware: [MOCK_CYBERWARE],
      bioware: [MOCK_BIOWARE],
    });
    render(<AugmentationsDisplay character={character} />);
    expect(screen.getByText("Cyberware")).toBeInTheDocument();
    expect(screen.getByText("Bioware")).toBeInTheDocument();
  });

  it("renders augmentation name", () => {
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);
    expect(screen.getByText("Wired Reflexes")).toBeInTheDocument();
  });

  it("strips (Rating N) suffix from display name", () => {
    const withRating = { ...MOCK_CYBERWARE, name: "Wired Reflexes (Rating 2)" };
    const character = createSheetCharacter({ cyberware: [withRating] });
    render(<AugmentationsDisplay character={character} />);
    expect(screen.getByText("Wired Reflexes")).toBeInTheDocument();
    expect(screen.queryByText(/Rating 2/)).not.toBeInTheDocument();
  });

  it("renders rating number inline when present", () => {
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);
    const pill = screen.getByTestId("rating-pill");
    expect(pill).toHaveTextContent("1");
  });

  it("does not render rating pill when rating is absent", () => {
    const noRating = { ...MOCK_CYBERWARE, rating: undefined };
    const character = createSheetCharacter({ cyberware: [noRating] });
    render(<AugmentationsDisplay character={character} />);
    expect(screen.queryByTestId("rating-pill")).not.toBeInTheDocument();
  });

  it("sorts augmentations by essence cost descending", () => {
    const lowEssence = { ...MOCK_CYBERWARE, name: "Low Essence", essenceCost: 0.5 };
    const highEssence = { ...MOCK_CYBERWARE, name: "High Essence", essenceCost: 3.0 };
    const character = createSheetCharacter({ cyberware: [lowEssence, highEssence] });
    render(<AugmentationsDisplay character={character} />);
    const rows = screen.getAllByTestId("augmentation-row");
    expect(rows[0]).toHaveTextContent("High Essence");
    expect(rows[1]).toHaveTextContent("Low Essence");
  });

  // --- Expand/collapse interaction ---

  it("shows expand button on each row", () => {
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);
    expect(screen.getByTestId("expand-button")).toBeInTheDocument();
  });

  it("does not show expanded content by default", () => {
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);
    expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
  });

  it("collapses row on second chevron click", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);

    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("expanded-content")).toBeInTheDocument();

    await user.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
  });

  // --- Expanded content ---

  it("renders essence cost in expanded section", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);

    expect(screen.queryByTestId("stat-essence")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("expand-button"));

    expect(screen.getByTestId("stat-essence")).toHaveTextContent("2.00");
  });

  it("renders grade in expanded section", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);

    expect(screen.queryByTestId("stat-grade")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("expand-button"));

    expect(screen.getByTestId("stat-grade")).toHaveTextContent("standard");
  });

  it("renders attribute bonuses in expanded section", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);

    expect(screen.queryByTestId("bonus-pill")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("expand-button"));

    const pill = screen.getByTestId("bonus-pill");
    expect(pill).toHaveTextContent("REACTION +1");
  });

  it("renders bioware attribute bonuses in expanded section", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ bioware: [MOCK_BIOWARE] });
    render(<AugmentationsDisplay character={character} />);

    expect(screen.queryByText("AGILITY +2")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("expand-button"));

    expect(screen.getByText("AGILITY +2")).toBeInTheDocument();
  });

  it("renders category in expanded section", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);

    expect(screen.queryByTestId("stat-category")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("expand-button"));

    expect(screen.getByTestId("stat-category")).toHaveTextContent("bodyware");
  });

  it("bonus pill has emerald styling in expanded section", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);

    await user.click(screen.getByTestId("expand-button"));

    const pill = screen.getByTestId("bonus-pill");
    expect(pill.className).toContain("bg-emerald-100");
  });

  it("renders notes in expanded section when present", async () => {
    const user = userEvent.setup();
    const withNotes = { ...MOCK_CYBERWARE, notes: "Requires calibration" };
    const character = createSheetCharacter({ cyberware: [withNotes] });
    render(<AugmentationsDisplay character={character} />);

    await user.click(screen.getByTestId("expand-button"));

    expect(screen.getByText("Requires calibration")).toBeInTheDocument();
  });

  // --- Wireless controls ---

  it("shows wifi icon in collapsed row when augmentation has wirelessBonus", () => {
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);
    expect(screen.getByTestId("wireless-icon")).toBeInTheDocument();
  });

  it("shows WifiOff icon when wireless is disabled", () => {
    const disabled = { ...MOCK_CYBERWARE, wirelessEnabled: false };
    const character = createSheetCharacter({ cyberware: [disabled] });
    render(<AugmentationsDisplay character={character} />);
    expect(screen.getByTestId("wireless-icon-off")).toBeInTheDocument();
  });

  it("does not show wireless icon for augmentation without wirelessBonus", () => {
    const noWireless = { ...MOCK_CYBERWARE, wirelessBonus: undefined, wirelessEffects: undefined };
    const character = createSheetCharacter({ cyberware: [noWireless] });
    render(<AugmentationsDisplay character={character} />);
    expect(screen.queryByTestId("wireless-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("wireless-icon-off")).not.toBeInTheDocument();
  });

  it("shows wireless toggle in expanded section when editable", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(
      <AugmentationsDisplay character={character} editable={true} onCharacterUpdate={onUpdate} />
    );

    await user.click(screen.getByTestId("expand-button"));

    expect(screen.getByTestId("wireless-toggle")).toBeInTheDocument();
  });

  it("hides wireless toggle in expanded section when not editable", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);

    await user.click(screen.getByTestId("expand-button"));

    expect(screen.queryByTestId("wireless-toggle")).not.toBeInTheDocument();
  });

  it("toggle calls onCharacterUpdate with toggled wirelessEnabled", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(
      <AugmentationsDisplay character={character} editable={true} onCharacterUpdate={onUpdate} />
    );

    await user.click(screen.getByTestId("expand-button"));
    await user.click(screen.getByTestId("wireless-indicator-toggle"));

    expect(onUpdate).toHaveBeenCalledTimes(1);
    const updated = onUpdate.mock.calls[0][0];
    expect(updated.cyberware[0].wirelessEnabled).toBe(false);
  });

  it("displays wirelessBonus text in read-only expanded section", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);

    await user.click(screen.getByTestId("expand-button"));

    expect(screen.getByTestId("wireless-bonus-text")).toHaveTextContent(
      "Gain +1 Reaction while wireless is active"
    );
  });

  it("displays wireless effects pills in expanded section", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);

    await user.click(screen.getByTestId("expand-button"));

    const effectsContainer = screen.getByTestId("wireless-effects");
    expect(effectsContainer).toBeInTheDocument();
    expect(effectsContainer).toHaveTextContent("REACTION +1");
  });

  it("dims wireless effects when wireless is off", async () => {
    const user = userEvent.setup();
    const disabled = { ...MOCK_CYBERWARE, wirelessEnabled: false };
    const character = createSheetCharacter({ cyberware: [disabled] });
    render(<AugmentationsDisplay character={character} />);

    await user.click(screen.getByTestId("expand-button"));

    const effects = screen.getByTestId("wireless-effects");
    expect(effects.className).toContain("opacity-40");
  });

  it("toggle works for bioware items", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const character = createSheetCharacter({ bioware: [MOCK_BIOWARE] });
    render(
      <AugmentationsDisplay character={character} editable={true} onCharacterUpdate={onUpdate} />
    );

    await user.click(screen.getByTestId("expand-button"));
    await user.click(screen.getByTestId("wireless-indicator-toggle"));

    expect(onUpdate).toHaveBeenCalledTimes(1);
    const updated = onUpdate.mock.calls[0][0];
    expect(updated.bioware[0].wirelessEnabled).toBe(false);
  });
});
