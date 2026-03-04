import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { setupDisplayCardMock, LUCIDE_MOCK, createSheetCharacter } from "./test-helpers";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

const mockUseTraditions = vi.fn();

vi.mock("@/lib/rules", () => ({
  useTraditions: (...args: unknown[]) => mockUseTraditions(...args),
}));

import { MagicSummaryDisplay } from "../MagicSummaryDisplay";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const HERMETIC_TRADITION = {
  id: "hermetic",
  name: "Hermetic",
  drainAttributes: ["logic", "willpower"] as [string, string],
  spiritTypes: {},
  description: "Hermetic tradition",
};

const SHAMAN_TRADITION = {
  id: "shamanic",
  name: "Shamanic",
  drainAttributes: ["charisma", "willpower"] as [string, string],
  spiritTypes: {},
  description: "Shamanic tradition",
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("MagicSummaryDisplay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTraditions.mockReturnValue([HERMETIC_TRADITION, SHAMAN_TRADITION]);
  });

  it("returns null for mundane characters", () => {
    const character = createSheetCharacter({ magicalPath: "mundane" });
    const { container } = render(<MagicSummaryDisplay character={character} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders full mage with tradition, drain formula, and Magic rating", () => {
    const character = createSheetCharacter({
      magicalPath: "full-mage",
      tradition: "hermetic",
      specialAttributes: { edge: 3, essence: 6, magic: 6 },
      spells: ["manabolt", "heal", "invisibility"],
      foci: [
        {
          catalogId: "power-focus",
          name: "Power Focus",
          type: "power" as never,
          force: 3,
          bonded: true,
          karmaToBond: 18,
          cost: 18000,
          availability: 12,
        },
      ],
    });

    render(<MagicSummaryDisplay character={character} />);

    // Path pill
    expect(screen.getByTestId("magic-path")).toHaveTextContent("Full Mage");
    // Magic rating
    expect(screen.getByTestId("magic-rating")).toHaveTextContent("MAG 6");
    // Tradition and drain formula
    expect(screen.getByTestId("tradition-info")).toHaveTextContent("Hermetic");
    expect(screen.getByTestId("tradition-info")).toHaveTextContent("LOG + WIL");
    // Resource counts
    expect(screen.getByTestId("resource-counts")).toHaveTextContent("3 Spells");
    expect(screen.getByTestId("resource-counts")).toHaveTextContent("1 Focus");
  });

  it("renders adept with power points section", () => {
    const character = createSheetCharacter({
      magicalPath: "adept",
      specialAttributes: { edge: 3, essence: 6, magic: 6 },
      adeptPowers: [
        {
          id: "imp-reflexes",
          catalogId: "improved-reflexes",
          name: "Improved Reflexes",
          rating: 2,
          powerPointCost: 3.5,
        },
        {
          id: "killing-hands",
          catalogId: "killing-hands",
          name: "Killing Hands",
          powerPointCost: 0.5,
        },
      ],
    });

    render(<MagicSummaryDisplay character={character} />);

    expect(screen.getByTestId("magic-path")).toHaveTextContent("Adept");
    expect(screen.getByTestId("magic-rating")).toHaveTextContent("MAG 6");
    // Power points
    expect(screen.getByTestId("power-points-section")).toBeInTheDocument();
    expect(screen.getByTestId("power-points-value")).toHaveTextContent("4 / 6 PP");
    // Resource counts
    expect(screen.getByTestId("resource-counts")).toHaveTextContent("2 Powers");
  });

  it("renders technomancer with Resonance title, stream, and complex forms", () => {
    const character = createSheetCharacter({
      magicalPath: "technomancer",
      stream: "Cyberadept",
      specialAttributes: { edge: 3, essence: 6, resonance: 5 },
      complexForms: ["cleaner", "resonance-spike", "puppeteer"],
    });

    render(<MagicSummaryDisplay character={character} />);

    // Title should be "Resonance" (checked via display-card mock)
    expect(screen.getByText("Resonance")).toBeInTheDocument();
    expect(screen.getByTestId("magic-path")).toHaveTextContent("Technomancer");
    expect(screen.getByTestId("magic-rating")).toHaveTextContent("RES 5");
    // Stream info
    expect(screen.getByTestId("stream-info")).toHaveTextContent("Cyberadept");
    // Resource counts
    expect(screen.getByTestId("resource-counts")).toHaveTextContent("3 Complex Forms");
  });

  it("renders initiate grade and metamagics when present", () => {
    const character = createSheetCharacter({
      magicalPath: "full-mage",
      tradition: "hermetic",
      specialAttributes: { edge: 3, essence: 6, magic: 7 },
      initiateGrade: 2,
      metamagics: ["centering", "shielding"],
    });

    render(<MagicSummaryDisplay character={character} />);

    expect(screen.getByTestId("initiate-grade")).toHaveTextContent("Grade 2");
    expect(screen.getByTestId("metamagics-section")).toBeInTheDocument();
    expect(screen.getByText("Centering")).toBeInTheDocument();
    expect(screen.getByText("Shielding")).toBeInTheDocument();
  });

  it("renders active effects with sustained spells, bound spirits, and active foci", () => {
    const character = createSheetCharacter({
      magicalPath: "full-mage",
      tradition: "shamanic",
      specialAttributes: { edge: 3, essence: 6, magic: 6 },
      sustainedSpells: [
        { spellId: "invisibility", hits: 3, force: 5 },
        { spellId: "armor", hits: 4, force: 6 },
      ],
      spirits: [
        { type: "fire" as never, force: 6, services: 3, bound: true },
        { type: "water" as never, force: 5, services: 2, bound: true },
        { type: "air" as never, force: 4, services: 0, bound: false },
      ],
      activeFoci: [{ id: "focus-1", type: "power", rating: 3 }],
    });

    render(<MagicSummaryDisplay character={character} />);

    expect(screen.getByTestId("active-effects-section")).toBeInTheDocument();
    // Sustained spells with penalty
    expect(screen.getByTestId("sustained-spells")).toHaveTextContent("2 Sustained");
    expect(screen.getByTestId("sustained-spells")).toHaveTextContent("(-4)");
    // Bound spirits (only bound=true count)
    expect(screen.getByTestId("bound-spirits")).toHaveTextContent("2 Bound Spirits");
    expect(screen.getByTestId("bound-spirits")).toHaveTextContent("(5 services)");
    // Active foci
    expect(screen.getByTestId("active-foci")).toHaveTextContent("1 Active Focus");
  });

  it("does not render active effects section when none exist", () => {
    const character = createSheetCharacter({
      magicalPath: "full-mage",
      tradition: "hermetic",
      specialAttributes: { edge: 3, essence: 6, magic: 6 },
    });

    render(<MagicSummaryDisplay character={character} />);

    expect(screen.queryByTestId("active-effects-section")).not.toBeInTheDocument();
  });

  it("does not render power points for non-adept mages", () => {
    const character = createSheetCharacter({
      magicalPath: "full-mage",
      tradition: "hermetic",
      specialAttributes: { edge: 3, essence: 6, magic: 6 },
    });

    render(<MagicSummaryDisplay character={character} />);

    expect(screen.queryByTestId("power-points-section")).not.toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // Magic/Resonance reduction in rating pill
  // ---------------------------------------------------------------------------

  it("shows MAG effective / base when essenceHole.magicLost > 0", () => {
    const character = createSheetCharacter({
      magicalPath: "adept",
      specialAttributes: { edge: 3, essence: 4.0, magic: 5 },
      essenceHole: {
        peakEssenceLoss: 2.0,
        currentEssenceLoss: 2.0,
        essenceHole: 0,
        magicLost: 1,
      },
    });

    render(<MagicSummaryDisplay character={character} />);

    const ratingPill = screen.getByTestId("magic-rating");
    expect(ratingPill).toHaveTextContent("MAG 5");
    expect(ratingPill).toHaveTextContent("/ 6");
  });

  it("shows RES effective / base for technomancer when essenceHole.magicLost > 0", () => {
    const character = createSheetCharacter({
      magicalPath: "technomancer",
      stream: "Cyberadept",
      specialAttributes: { edge: 3, essence: 4.0, resonance: 4 },
      essenceHole: {
        peakEssenceLoss: 2.0,
        currentEssenceLoss: 2.0,
        essenceHole: 0,
        magicLost: 1,
      },
    });

    render(<MagicSummaryDisplay character={character} />);

    const ratingPill = screen.getByTestId("magic-rating");
    expect(ratingPill).toHaveTextContent("RES 4");
    expect(ratingPill).toHaveTextContent("/ 5");
  });

  it("does not show base rating when no essence hole", () => {
    const character = createSheetCharacter({
      magicalPath: "full-mage",
      tradition: "hermetic",
      specialAttributes: { edge: 3, essence: 6, magic: 6 },
    });

    render(<MagicSummaryDisplay character={character} />);

    const ratingPill = screen.getByTestId("magic-rating");
    expect(ratingPill).toHaveTextContent("MAG 6");
    expect(ratingPill.textContent).not.toContain("/");
  });
});
