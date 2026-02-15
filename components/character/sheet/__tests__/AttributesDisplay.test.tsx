/**
 * AttributesDisplay Component Tests
 *
 * Tests the character attributes display with Physical/Mental/Special
 * grouped sections, augmentation pills with tooltips, and essence
 * loss breakdown.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createSheetCharacter, MOCK_CYBERWARE, MOCK_BIOWARE } from "./test-helpers";

vi.mock("../DisplayCard", () => ({
  DisplayCard: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div data-testid="display-card">
      <h2>{title}</h2>
      {children}
    </div>
  ),
}));

vi.mock("lucide-react", () => ({
  BarChart3: (props: Record<string, unknown>) => <span data-testid="icon-BarChart3" {...props} />,
  ArrowUp: (props: Record<string, unknown>) => <span data-testid="icon-ArrowUp" {...props} />,
  ArrowDown: (props: Record<string, unknown>) => <span data-testid="icon-ArrowDown" {...props} />,
}));

vi.mock("@/components/ui", () => ({
  Tooltip: ({ children, content }: { children: React.ReactNode; content: React.ReactNode }) => (
    <div>
      {children}
      <div data-testid="tooltip-content">{content}</div>
    </div>
  ),
}));

import { AttributesDisplay } from "../AttributesDisplay";

describe("AttributesDisplay", () => {
  it("renders all 8 core attributes", () => {
    const character = createSheetCharacter();
    render(<AttributesDisplay character={character} />);

    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Agility")).toBeInTheDocument();
    expect(screen.getByText("Reaction")).toBeInTheDocument();
    expect(screen.getByText("Strength")).toBeInTheDocument();
    expect(screen.getByText("Willpower")).toBeInTheDocument();
    expect(screen.getByText("Logic")).toBeInTheDocument();
    expect(screen.getByText("Intuition")).toBeInTheDocument();
    expect(screen.getByText("Charisma")).toBeInTheDocument();
  });

  it("renders Physical, Mental, Special section headers", () => {
    const character = createSheetCharacter();
    render(<AttributesDisplay character={character} />);

    expect(screen.getByText("Physical")).toBeInTheDocument();
    expect(screen.getByText("Mental")).toBeInTheDocument();
    expect(screen.getByText("Special")).toBeInTheDocument();
  });

  it("renders augmentation pill when bonus > 0", () => {
    const character = createSheetCharacter({
      attributes: {
        body: 5,
        agility: 6,
        reaction: 5,
        strength: 4,
        willpower: 3,
        logic: 3,
        intuition: 4,
        charisma: 2,
      },
      cyberware: [MOCK_CYBERWARE],
    });
    render(<AttributesDisplay character={character} />);
    // Wired Reflexes gives +1 reaction — aug pill and tooltip both show "+1"
    const plusOnes = screen.getAllByText("+1");
    expect(plusOnes.length).toBeGreaterThanOrEqual(1);
  });

  it("does not render augmentation pill when no bonuses", () => {
    const character = createSheetCharacter({
      cyberware: [],
      bioware: [],
    });
    render(<AttributesDisplay character={character} />);
    // No ArrowUp icons should be present (aug pills contain ArrowUp)
    expect(screen.queryByTestId("icon-ArrowUp")).not.toBeInTheDocument();
  });

  it("renders multi-source augmentation tooltip with total", () => {
    // MOCK_CYBERWARE gives reaction: +1, MOCK_BIOWARE gives agility: +2
    // We need two sources on the SAME attribute to test the total row
    const character = createSheetCharacter({
      attributes: {
        body: 5,
        agility: 6,
        reaction: 5,
        strength: 4,
        willpower: 3,
        logic: 3,
        intuition: 4,
        charisma: 2,
      },
      cyberware: [
        {
          ...MOCK_CYBERWARE,
          attributeBonuses: { agility: 1 },
        },
      ],
      bioware: [MOCK_BIOWARE],
    });
    render(<AttributesDisplay character={character} />);

    // Tooltip should show both source names (may appear in both aug + essence tooltips)
    expect(screen.getAllByText("Wired Reflexes").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Muscle Toner").length).toBeGreaterThanOrEqual(1);
    // Total row should show "Total Aug"
    expect(screen.getByText("Total Aug")).toBeInTheDocument();
  });

  it("renders Edge in the special attributes section", () => {
    const character = createSheetCharacter({ specialAttributes: { edge: 3, essence: 6 } });
    render(<AttributesDisplay character={character} />);
    expect(screen.getByText("Edge")).toBeInTheDocument();
    // Edge value "3" appears alongside other attribute values - verify it exists
    const threes = screen.getAllByText("3");
    expect(threes.length).toBeGreaterThanOrEqual(1);
  });

  it("renders Essence with 2 decimal places", () => {
    const character = createSheetCharacter({ specialAttributes: { edge: 3, essence: 4.2 } });
    render(<AttributesDisplay character={character} />);
    expect(screen.getByText("Essence")).toBeInTheDocument();
    expect(screen.getByText("4.20")).toBeInTheDocument();
  });

  it("renders Magic attribute when present", () => {
    const character = createSheetCharacter({
      specialAttributes: { edge: 3, essence: 6, magic: 7 },
    });
    render(<AttributesDisplay character={character} />);
    expect(screen.getByText("Magic")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("renders Resonance attribute when present", () => {
    const character = createSheetCharacter({
      specialAttributes: { edge: 3, essence: 6, resonance: 5 },
    });
    render(<AttributesDisplay character={character} />);
    expect(screen.getByText("Resonance")).toBeInTheDocument();
  });

  it("does not render Magic or Resonance when neither defined", () => {
    const character = createSheetCharacter({
      specialAttributes: { edge: 3, essence: 6 },
    });
    render(<AttributesDisplay character={character} />);
    expect(screen.queryByText("Magic")).not.toBeInTheDocument();
    expect(screen.queryByText("Resonance")).not.toBeInTheDocument();
  });

  it("calls onSelect with attribute id and total value when clicked", () => {
    const onSelect = vi.fn();
    const character = createSheetCharacter({
      attributes: {
        body: 5,
        agility: 6,
        reaction: 5,
        strength: 4,
        willpower: 3,
        logic: 3,
        intuition: 4,
        charisma: 2,
      },
    });
    render(<AttributesDisplay character={character} onSelect={onSelect} />);

    fireEvent.click(screen.getByText("Body"));
    expect(onSelect).toHaveBeenCalledWith("body", 5);
  });

  it("includes augmentation bonus in onSelect value", () => {
    const onSelect = vi.fn();
    const character = createSheetCharacter({
      attributes: {
        body: 5,
        agility: 6,
        reaction: 5,
        strength: 4,
        willpower: 3,
        logic: 3,
        intuition: 4,
        charisma: 2,
      },
      cyberware: [MOCK_CYBERWARE],
    });
    render(<AttributesDisplay character={character} onSelect={onSelect} />);

    // Click on Reaction row - should be base 5 + aug 1 = 6
    fireEvent.click(screen.getByText("Reaction"));
    expect(onSelect).toHaveBeenCalledWith("reaction", 6);
  });

  it("shows essence loss tooltip when augmentations present", () => {
    const character = createSheetCharacter({
      specialAttributes: { edge: 3, essence: 3.8 },
      cyberware: [MOCK_CYBERWARE],
    });
    render(<AttributesDisplay character={character} />);

    // Loss badge should be present with aria label
    const lossButton = screen.getByLabelText("Essence loss details");
    expect(lossButton).toBeInTheDocument();
    // Badge and tooltip both show the cost (badge + item row)
    expect(screen.getAllByText("-2.00").length).toBe(2);
    // Tooltip shows augmentation name (may also appear in attribute tooltip)
    expect(screen.getAllByText("Wired Reflexes").length).toBeGreaterThanOrEqual(1);
  });

  it("shows total row in essence tooltip when multiple augmentations", () => {
    const character = createSheetCharacter({
      specialAttributes: { edge: 3, essence: 3.8 },
      cyberware: [MOCK_CYBERWARE],
      bioware: [MOCK_BIOWARE],
    });
    render(<AttributesDisplay character={character} />);

    // Both sources should appear (may also appear in attribute tooltips)
    expect(screen.getAllByText("Wired Reflexes").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Muscle Toner").length).toBeGreaterThanOrEqual(1);
    // Total row should appear
    expect(screen.getByText("Total Loss")).toBeInTheDocument();
    // Total = 2.00 + 0.20 = 2.20 (appears in both badge and total row)
    expect(screen.getAllByText("-2.20").length).toBe(2);
  });

  it("does not show essence loss tooltip when no augmentations", () => {
    const character = createSheetCharacter({
      specialAttributes: { edge: 3, essence: 6 },
      cyberware: [],
      bioware: [],
    });
    render(<AttributesDisplay character={character} />);

    // Essence value should render
    expect(screen.getByText("6.00")).toBeInTheDocument();
    // No loss badge or ArrowDown icon
    expect(screen.queryByLabelText("Essence loss details")).not.toBeInTheDocument();
    expect(screen.queryByTestId("icon-ArrowDown")).not.toBeInTheDocument();
  });
});
