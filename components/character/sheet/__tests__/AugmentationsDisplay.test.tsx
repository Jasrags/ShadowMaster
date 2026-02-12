/**
 * AugmentationsDisplay Component Tests
 *
 * Tests the augmentations (cyberware/bioware) display.
 * Returns null when no augmentations. Shows cyberware vs bioware sections,
 * grade pills, essence cost pills, and attribute bonuses.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  createSheetCharacter,
  setupDisplayCardMock,
  LUCIDE_MOCK,
  MOCK_CYBERWARE,
  MOCK_BIOWARE,
} from "./test-helpers";

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

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

  it("renders grade pill", () => {
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);
    const pill = screen.getByTestId("grade-pill");
    expect(pill).toHaveTextContent("standard");
  });

  it("renders essence cost pill with 2 decimal places", () => {
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);
    const pill = screen.getByTestId("essence-pill");
    expect(pill).toHaveTextContent("2.00");
  });

  it("renders attribute bonuses", () => {
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);
    expect(screen.getByText("REACTION +1")).toBeInTheDocument();
  });

  it("renders bioware attribute bonuses", () => {
    const character = createSheetCharacter({ bioware: [MOCK_BIOWARE] });
    render(<AugmentationsDisplay character={character} />);
    expect(screen.getByText("AGILITY +2")).toBeInTheDocument();
  });

  it("renders rating when present", () => {
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);
    expect(screen.getByText(/Rating 1/)).toBeInTheDocument();
  });

  it("renders category", () => {
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);
    expect(screen.getByText(/bodyware/i)).toBeInTheDocument();
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

  it("bonus pill has emerald styling", () => {
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);
    const pill = screen.getByTestId("bonus-pill");
    expect(pill.className).toContain("bg-emerald-100");
  });
});
