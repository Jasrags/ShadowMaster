/**
 * AugmentationsDisplay Component Tests
 *
 * Tests the augmentations (cyberware/bioware) display with expandable rows.
 * Returns null when no augmentations. Shows cyberware vs bioware sections,
 * collapsed rows with name + rating, and expanded detail content.
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

  it("renders grade pill in expanded section", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);

    expect(screen.queryByTestId("grade-pill")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("expand-button"));

    const pill = screen.getByTestId("grade-pill");
    expect(pill).toHaveTextContent("standard");
  });

  it("renders attribute bonuses in expanded section", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);

    expect(screen.queryByText("REACTION +1")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("expand-button"));

    expect(screen.getByText("REACTION +1")).toBeInTheDocument();
  });

  it("renders bioware attribute bonuses in expanded section", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ bioware: [MOCK_BIOWARE] });
    render(<AugmentationsDisplay character={character} />);

    expect(screen.queryByText("AGILITY +2")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("expand-button"));

    expect(screen.getByText("AGILITY +2")).toBeInTheDocument();
  });

  it("renders essence cost pill in expanded section", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);

    expect(screen.queryByTestId("essence-pill")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("expand-button"));

    const pill = screen.getByTestId("essence-pill");
    expect(pill).toHaveTextContent("2.00");
  });

  it("renders category in expanded section", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);

    expect(screen.queryByText(/bodyware/i)).not.toBeInTheDocument();

    await user.click(screen.getByTestId("expand-button"));

    expect(screen.getByText("bodyware")).toBeInTheDocument();
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
});
