/**
 * CharacterInfoDisplay Component Tests
 *
 * Tests the top-level character info banner on the sheet page.
 * Covers name, metatype, status badge, karma link, nuyen/essence/edge formatting.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { createSheetCharacter, setupStabilityShieldMock, setupReactAriaMock } from "./test-helpers";

// Mocks must be hoisted before imports
setupStabilityShieldMock();
setupReactAriaMock();

import { CharacterInfoDisplay } from "../CharacterInfoDisplay";

describe("CharacterInfoDisplay", () => {
  it("renders character name", () => {
    const character = createSheetCharacter({ name: "Razor" });
    render(<CharacterInfoDisplay character={character} />);
    expect(screen.getByText("Razor")).toBeInTheDocument();
  });

  it("renders metatype", () => {
    const character = createSheetCharacter({ metatype: "Elf" });
    render(<CharacterInfoDisplay character={character} />);
    expect(screen.getByText("Elf")).toBeInTheDocument();
  });

  it("renders active status badge", () => {
    const character = createSheetCharacter({ status: "active" });
    render(<CharacterInfoDisplay character={character} />);
    const badge = screen.getByText("active");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("emerald");
  });

  it("renders draft status badge", () => {
    const character = createSheetCharacter({ status: "draft" });
    render(<CharacterInfoDisplay character={character} />);
    const badge = screen.getByText("draft");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("zinc");
  });

  it("renders karma link to advancement page", () => {
    const character = createSheetCharacter({ id: "char-123", karmaCurrent: 5, karmaTotal: 25 });
    render(<CharacterInfoDisplay character={character} />);

    const karmaLink = screen.getByRole("link", { name: /karma/i });
    expect(karmaLink).toHaveAttribute("href", "/characters/char-123/advancement");
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("of 25 earned")).toBeInTheDocument();
  });

  it("formats nuyen with yen symbol", () => {
    const character = createSheetCharacter({ nuyen: 15000 });
    render(<CharacterInfoDisplay character={character} />);
    expect(screen.getByText(/¥15,000/)).toBeInTheDocument();
  });

  it("renders essence value with 2 decimal places", () => {
    const character = createSheetCharacter({ specialAttributes: { edge: 3, essence: 4.2 } });
    render(<CharacterInfoDisplay character={character} />);
    expect(screen.getByText("4.20")).toBeInTheDocument();
  });

  it("renders edge current/max", () => {
    const character = createSheetCharacter({ specialAttributes: { edge: 3, essence: 6 } });
    render(<CharacterInfoDisplay character={character} />);
    // Edge renders as "current/max" in a single span
    expect(screen.getByText("3/3")).toBeInTheDocument();
  });

  it("renders magical path", () => {
    const character = createSheetCharacter({ magicalPath: "mundane" });
    render(<CharacterInfoDisplay character={character} />);
    expect(screen.getByText("mundane")).toBeInTheDocument();
  });

  it("renders edition code when present", () => {
    const character = createSheetCharacter({ editionCode: "sr5" });
    render(<CharacterInfoDisplay character={character} />);
    expect(screen.getByText("sr5")).toBeInTheDocument();
  });

  it("renders StabilityShield component", () => {
    const character = createSheetCharacter();
    render(<CharacterInfoDisplay character={character} />);
    expect(screen.getByTestId("stability-shield")).toBeInTheDocument();
  });
});
