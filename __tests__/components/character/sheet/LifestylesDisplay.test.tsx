/**
 * Tests for LifestylesDisplay component
 */

import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Character, Lifestyle, Identity } from "@/lib/types";
import {
  LifestylesDisplay,
  calculateLifestyleMonthlyCost,
} from "@/components/character/sheet/LifestylesDisplay";

// Mock RulesetContext hooks
vi.mock("@/lib/rules/RulesetContext", () => ({
  useLifestyles: () => [
    { id: "street", name: "Street", monthlyCost: 0, startingNuyen: "1d6 × 20" },
    { id: "squatter", name: "Squatter", monthlyCost: 500, startingNuyen: "2d6 × 20" },
    { id: "low", name: "Low", monthlyCost: 2000, startingNuyen: "3d6 × 60" },
    { id: "medium", name: "Medium", monthlyCost: 5000, startingNuyen: "4d6 × 100" },
    { id: "high", name: "High", monthlyCost: 10000, startingNuyen: "4d6 × 500" },
    { id: "luxury", name: "Luxury", monthlyCost: 100000, startingNuyen: "6d6 × 1000" },
  ],
  useEntertainmentOptions: () => [],
}));

// Mock the LifestyleModal since it depends on RulesetContext
vi.mock("@/components/creation/identities/LifestyleModal", () => ({
  LifestyleModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="lifestyle-modal">Modal Open</div> : null,
}));

// Mock fetch for Pay Month API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

function makeCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: "char-1",
    userId: "user-1",
    name: "Test Runner",
    edition: "sr5",
    creationMethod: "priority",
    status: "active",
    metatype: "human",
    magicalPath: "mundane",
    nuyen: 10000,
    startingNuyen: 50000,
    karmaCurrent: 10,
    karmaTotal: 25,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    attributes: {} as Character["attributes"],
    skills: [],
    positiveQualities: [],
    negativeQualities: [],
    gear: [],
    contacts: [],
    weapons: [],
    armor: [],
    lifestyles: [],
    identities: [],
    ...overrides,
  } as Character;
}

function makeLifestyle(overrides: Partial<Lifestyle> = {}): Lifestyle {
  return {
    type: "medium",
    monthlyCost: 5000,
    ...overrides,
  };
}

describe("LifestylesDisplay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  test("returns null when no lifestyles and not editable", () => {
    const character = makeCharacter({ lifestyles: [] });
    const { container } = render(<LifestylesDisplay character={character} />);
    expect(container.firstChild).toBeNull();
  });

  test("renders empty state when editable with no lifestyles", () => {
    const character = makeCharacter({ lifestyles: [] });
    render(<LifestylesDisplay character={character} onCharacterUpdate={vi.fn()} editable />);
    expect(screen.getByText(/No lifestyles configured/)).toBeTruthy();
  });

  test("renders lifestyle rows with tier badge and cost", () => {
    const character = makeCharacter({
      lifestyles: [makeLifestyle({ type: "medium", monthlyCost: 5000 })],
    });
    render(<LifestylesDisplay character={character} />);

    expect(screen.getByText("Medium")).toBeTruthy();
    // Cost appears in both the row pill and header summary — use getAllByText
    expect(screen.getAllByText("¥5,000/mo").length).toBeGreaterThanOrEqual(1);
  });

  test("renders multiple lifestyles", () => {
    const character = makeCharacter({
      lifestyles: [
        makeLifestyle({ type: "medium", monthlyCost: 5000 }),
        makeLifestyle({ type: "low", monthlyCost: 2000 }),
      ],
    });
    render(<LifestylesDisplay character={character} />);

    expect(screen.getByText("Medium")).toBeTruthy();
    expect(screen.getByText("Low")).toBeTruthy();
  });

  test("shows prepaid months pill when prepaid > 0", () => {
    const character = makeCharacter({
      lifestyles: [makeLifestyle({ prepaidMonths: 3 })],
    });
    render(<LifestylesDisplay character={character} />);

    expect(screen.getByText("3mo prepaid")).toBeTruthy();
  });

  test("does not show prepaid pill when prepaid is 0", () => {
    const character = makeCharacter({
      lifestyles: [makeLifestyle({ prepaidMonths: 0 })],
    });
    render(<LifestylesDisplay character={character} />);

    expect(screen.queryByText(/prepaid/)).toBeNull();
  });

  test("shows location when set", () => {
    const character = makeCharacter({
      lifestyles: [makeLifestyle({ location: "Downtown Seattle" })],
    });
    render(<LifestylesDisplay character={character} />);

    expect(screen.getByText("Downtown Seattle")).toBeTruthy();
  });

  test("shows linked identity name via associatedIdentityId", () => {
    const character = makeCharacter({
      lifestyles: [makeLifestyle({ associatedIdentityId: "id-1" })],
      identities: [
        {
          id: "id-1",
          name: "John Smith",
          sin: { type: "fake", rating: 4 },
          licenses: [],
        } as Identity,
      ],
    });
    render(<LifestylesDisplay character={character} />);

    expect(screen.getByText("John Smith")).toBeTruthy();
  });

  test("displays nuyen warning when balance < total monthly cost", () => {
    const character = makeCharacter({
      nuyen: 3000,
      lifestyles: [makeLifestyle({ type: "medium", monthlyCost: 5000 })],
    });
    render(<LifestylesDisplay character={character} />);

    expect(screen.getByText(/Insufficient nuyen/)).toBeTruthy();
  });

  test("does not show warning when balance is sufficient", () => {
    const character = makeCharacter({
      nuyen: 10000,
      lifestyles: [makeLifestyle({ type: "medium", monthlyCost: 5000 })],
    });
    render(<LifestylesDisplay character={character} />);

    expect(screen.queryByText(/Insufficient nuyen/)).toBeNull();
  });

  test("shows Add button only when editable", () => {
    const character = makeCharacter({
      lifestyles: [makeLifestyle()],
    });

    const { rerender } = render(<LifestylesDisplay character={character} />);
    expect(screen.queryByText("Add")).toBeNull();

    rerender(<LifestylesDisplay character={character} onCharacterUpdate={vi.fn()} editable />);
    expect(screen.getByText("Add")).toBeTruthy();
  });

  test("shows Edit/Remove/Pay Month buttons in expanded row when editable", async () => {
    const user = userEvent.setup();
    const character = makeCharacter({
      lifestyles: [makeLifestyle()],
    });

    render(<LifestylesDisplay character={character} onCharacterUpdate={vi.fn()} editable />);

    // Click to expand
    await user.click(screen.getByText("Medium"));

    expect(screen.getByText("Edit")).toBeTruthy();
    expect(screen.getByText("Remove")).toBeTruthy();
    expect(screen.getByText("Pay Month")).toBeTruthy();
  });

  test("does not show action buttons in expanded row when not editable", async () => {
    const user = userEvent.setup();
    const character = makeCharacter({
      lifestyles: [makeLifestyle()],
    });

    render(<LifestylesDisplay character={character} />);

    // Click to expand
    await user.click(screen.getByText("Medium"));

    expect(screen.queryByText("Edit")).toBeNull();
    expect(screen.queryByText("Remove")).toBeNull();
    expect(screen.queryByText("Pay Month")).toBeNull();
  });

  test("Pay Month decrements prepaid months locally when prepaid > 0", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const character = makeCharacter({
      lifestyles: [makeLifestyle({ prepaidMonths: 2 })],
    });

    render(<LifestylesDisplay character={character} onCharacterUpdate={onUpdate} editable />);

    // Expand row
    await user.click(screen.getByText("Medium"));
    // Pay
    await user.click(screen.getByText("Pay Month"));

    expect(onUpdate).toHaveBeenCalledTimes(1);
    const updatedChar = onUpdate.mock.calls[0][0] as Character;
    expect(updatedChar.lifestyles?.[0].prepaidMonths).toBe(1);
    // Should NOT call fetch (no API call for prepaid)
    expect(mockFetch).not.toHaveBeenCalled();
  });

  test("Pay Month calls gameplay API when prepaid = 0", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const character = makeCharacter({
      nuyen: 10000,
      lifestyles: [makeLifestyle({ prepaidMonths: 0 })],
    });

    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          success: true,
          character: { ...character, nuyen: 5000 },
        }),
    });

    render(<LifestylesDisplay character={character} onCharacterUpdate={onUpdate} editable />);

    // Expand row
    await user.click(screen.getByText("Medium"));
    // Pay
    await user.click(screen.getByText("Pay Month"));

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/characters/char-1/gameplay",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("spendNuyen"),
      })
    );
  });

  test("Remove shows confirm before deleting", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const character = makeCharacter({
      lifestyles: [makeLifestyle()],
    });

    render(<LifestylesDisplay character={character} onCharacterUpdate={onUpdate} editable />);

    await user.click(screen.getByText("Medium"));
    await user.click(screen.getByText("Remove"));

    // Should show confirm/cancel
    expect(screen.getByText("Confirm")).toBeTruthy();
    expect(screen.getByText("Cancel")).toBeTruthy();

    // Confirm removal
    await user.click(screen.getByText("Confirm"));

    expect(onUpdate).toHaveBeenCalledTimes(1);
    const updatedChar = onUpdate.mock.calls[0][0] as Character;
    expect(updatedChar.lifestyles).toHaveLength(0);
  });

  test("shows total monthly cost in header", () => {
    const character = makeCharacter({
      lifestyles: [
        makeLifestyle({ type: "medium", monthlyCost: 5000 }),
        makeLifestyle({ type: "low", monthlyCost: 2000 }),
      ],
    });
    render(<LifestylesDisplay character={character} />);

    expect(screen.getByText("¥7,000/mo")).toBeTruthy();
  });
});
