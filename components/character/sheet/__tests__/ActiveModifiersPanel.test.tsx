/**
 * Tests for ActiveModifiersPanel
 *
 * @see Issue #114
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { setupDisplayCardMock, LUCIDE_MOCK, createSheetCharacter } from "./test-helpers";
import type { ActiveModifier } from "@/lib/types/effects";

// ---------------------------------------------------------------------------
// Mocks (must be before imports of the component under test)
// ---------------------------------------------------------------------------
setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

// Mock AddModifierModal to avoid pulling in BaseModal/react-aria
vi.mock("../AddModifierModal", () => ({
  AddModifierModal: () => <div data-testid="add-modifier-modal" />,
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

import { ActiveModifiersPanel } from "../ActiveModifiersPanel";

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------

const MOCK_MODIFIER: ActiveModifier = {
  id: "mod-1",
  name: "Partial Cover",
  source: "environment",
  effect: {
    id: "partial-cover-effect",
    type: "dice-pool-modifier",
    triggers: ["ranged-attack"],
    target: {},
    value: -2,
  },
  appliedBy: "user-1",
  appliedAt: "2025-06-15T12:00:00.000Z",
};

const MOCK_POSITIVE_MODIFIER: ActiveModifier = {
  id: "mod-2",
  name: "Aspected Domain",
  source: "environment",
  effect: {
    id: "aspected-domain-effect",
    type: "dice-pool-modifier",
    triggers: ["magic-use"],
    target: {},
    value: 2,
  },
  appliedBy: "user-1",
  appliedAt: "2025-06-15T12:00:00.000Z",
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ActiveModifiersPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders empty state when no modifiers", () => {
    const character = createSheetCharacter({ activeModifiers: [] });
    render(<ActiveModifiersPanel character={character} />);
    expect(screen.getByText("No active modifiers")).toBeInTheDocument();
  });

  it("renders modifier rows", () => {
    const character = createSheetCharacter({
      activeModifiers: [MOCK_MODIFIER, MOCK_POSITIVE_MODIFIER],
    });
    render(<ActiveModifiersPanel character={character} />);
    expect(screen.getByText("Partial Cover")).toBeInTheDocument();
    expect(screen.getByText("Aspected Domain")).toBeInTheDocument();
  });

  it("shows source badges", () => {
    const character = createSheetCharacter({
      activeModifiers: [MOCK_MODIFIER],
    });
    render(<ActiveModifiersPanel character={character} />);
    expect(screen.getByText("Environment")).toBeInTheDocument();
  });

  it("shows effect type badges", () => {
    const character = createSheetCharacter({
      activeModifiers: [MOCK_MODIFIER],
    });
    render(<ActiveModifiersPanel character={character} />);
    expect(screen.getByText("dice pool modifier")).toBeInTheDocument();
  });

  it("shows negative value pill", () => {
    const character = createSheetCharacter({
      activeModifiers: [MOCK_MODIFIER],
    });
    render(<ActiveModifiersPanel character={character} />);
    expect(screen.getByText("-2")).toBeInTheDocument();
  });

  it("shows positive value pill with plus sign", () => {
    const character = createSheetCharacter({
      activeModifiers: [MOCK_POSITIVE_MODIFIER],
    });
    render(<ActiveModifiersPanel character={character} />);
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("does not show remove buttons when not editable", () => {
    const character = createSheetCharacter({
      activeModifiers: [MOCK_MODIFIER],
    });
    render(<ActiveModifiersPanel character={character} editable={false} />);
    expect(screen.queryByLabelText("Remove Partial Cover")).not.toBeInTheDocument();
  });

  it("shows remove buttons when editable", () => {
    const character = createSheetCharacter({
      activeModifiers: [MOCK_MODIFIER],
    });
    render(<ActiveModifiersPanel character={character} editable />);
    expect(screen.getByLabelText("Remove Partial Cover")).toBeInTheDocument();
  });

  it("shows add button when editable", () => {
    const character = createSheetCharacter();
    render(<ActiveModifiersPanel character={character} editable />);
    expect(screen.getByLabelText("Add modifier")).toBeInTheDocument();
  });

  it("does not show add button when not editable", () => {
    const character = createSheetCharacter();
    render(<ActiveModifiersPanel character={character} editable={false} />);
    expect(screen.queryByLabelText("Add modifier")).not.toBeInTheDocument();
  });

  it("renders multiple modifier rows", () => {
    const character = createSheetCharacter({
      activeModifiers: [MOCK_MODIFIER, MOCK_POSITIVE_MODIFIER],
    });
    render(<ActiveModifiersPanel character={character} />);
    expect(screen.getByText("Partial Cover")).toBeInTheDocument();
    expect(screen.getByText("Aspected Domain")).toBeInTheDocument();
    expect(screen.getByText("-2")).toBeInTheDocument();
    expect(screen.getByText("+2")).toBeInTheDocument();
  });
});
