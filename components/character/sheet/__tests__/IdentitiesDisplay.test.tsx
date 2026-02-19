/**
 * IdentitiesDisplay Component Tests
 *
 * Tests the identities & SINs display with expandable rows grouped into
 * Real SINs / Fake SINs sections. Validates section grouping, collapsed/expanded
 * states, SIN type badges, value pills, licenses subsection, and notes.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  setupDisplayCardMock,
  LUCIDE_MOCK,
  createSheetCharacter,
  MOCK_IDENTITY_FAKE,
  MOCK_IDENTITY_REAL,
} from "./test-helpers";
import { SinnerQuality } from "@/lib/types";
import type { Lifestyle } from "@/lib/types";

// ---------------------------------------------------------------------------
// Mock lifestyle data
// ---------------------------------------------------------------------------

const MOCK_LIFESTYLE_MEDIUM: Lifestyle = {
  id: "lifestyle-1",
  type: "medium",
  monthlyCost: 5000,
  location: "Downtown Seattle",
  associatedIdentityId: "id-fake-1",
};

const MOCK_LIFESTYLE_LOW: Lifestyle = {
  id: "lifestyle-2",
  type: "low",
  monthlyCost: 2000,
  associatedIdentityId: "id-real-1",
};

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

import { IdentitiesDisplay } from "../IdentitiesDisplay";

describe("IdentitiesDisplay", () => {
  // --- Empty state ---

  it("returns null when no identities", () => {
    const character = createSheetCharacter({ identities: [] });
    const { container } = render(<IdentitiesDisplay character={character} />);
    expect(container.innerHTML).toBe("");
  });

  it("returns null when identities is undefined", () => {
    const character = createSheetCharacter({ identities: undefined });
    const { container } = render(<IdentitiesDisplay character={character} />);
    expect(container.innerHTML).toBe("");
  });

  // --- Section grouping ---

  it("renders Fake SINs section for fake identities", () => {
    const character = createSheetCharacter({ identities: [MOCK_IDENTITY_FAKE] });
    render(<IdentitiesDisplay character={character} />);
    expect(screen.getByText("Fake SINs")).toBeInTheDocument();
  });

  it("renders Real SINs section for real identities", () => {
    const character = createSheetCharacter({ identities: [MOCK_IDENTITY_REAL] });
    render(<IdentitiesDisplay character={character} />);
    expect(screen.getByText("Real SINs")).toBeInTheDocument();
  });

  it("hides Real SINs section when only fake identities exist", () => {
    const character = createSheetCharacter({ identities: [MOCK_IDENTITY_FAKE] });
    render(<IdentitiesDisplay character={character} />);
    expect(screen.queryByText("Real SINs")).not.toBeInTheDocument();
  });

  it("hides Fake SINs section when only real identities exist", () => {
    const character = createSheetCharacter({ identities: [MOCK_IDENTITY_REAL] });
    render(<IdentitiesDisplay character={character} />);
    expect(screen.queryByText("Fake SINs")).not.toBeInTheDocument();
  });

  it("renders both sections when both types exist", () => {
    const character = createSheetCharacter({
      identities: [MOCK_IDENTITY_FAKE, MOCK_IDENTITY_REAL],
    });
    render(<IdentitiesDisplay character={character} />);
    expect(screen.getByText("Real SINs")).toBeInTheDocument();
    expect(screen.getByText("Fake SINs")).toBeInTheDocument();
  });

  // --- Collapsed row ---

  it("renders identity name in collapsed row", () => {
    const character = createSheetCharacter({ identities: [MOCK_IDENTITY_FAKE] });
    render(<IdentitiesDisplay character={character} />);
    expect(screen.getByText("John Smith")).toBeInTheDocument();
  });

  it("renders SIN type badge for fake identity", () => {
    const character = createSheetCharacter({ identities: [MOCK_IDENTITY_FAKE] });
    render(<IdentitiesDisplay character={character} />);
    const badge = screen.getByTestId("sin-type-badge");
    expect(badge).toHaveTextContent("Fake");
  });

  it("renders SIN type badge for real identity", () => {
    const character = createSheetCharacter({ identities: [MOCK_IDENTITY_REAL] });
    render(<IdentitiesDisplay character={character} />);
    const badge = screen.getByTestId("sin-type-badge");
    expect(badge).toHaveTextContent("Real");
  });

  it("renders fake SIN value pill with rating and violet color", () => {
    const character = createSheetCharacter({ identities: [MOCK_IDENTITY_FAKE] });
    render(<IdentitiesDisplay character={character} />);
    const pill = screen.getByTestId("value-pill");
    expect(pill).toHaveTextContent("R4");
    expect(pill.className).toContain("violet");
  });

  it("renders real SIN value pill with sinner quality and amber color", () => {
    const character = createSheetCharacter({ identities: [MOCK_IDENTITY_REAL] });
    render(<IdentitiesDisplay character={character} />);
    const pill = screen.getByTestId("value-pill");
    expect(pill).toHaveTextContent("National");
    expect(pill.className).toContain("amber");
  });

  // --- Sinner quality formatting ---

  it("formats CorporateLimited as 'Corporate (Limited)'", () => {
    const identity = {
      ...MOCK_IDENTITY_REAL,
      sin: { type: "real" as const, sinnerQuality: SinnerQuality.CorporateLimited },
    };
    const character = createSheetCharacter({ identities: [identity] });
    render(<IdentitiesDisplay character={character} />);
    expect(screen.getByTestId("value-pill")).toHaveTextContent("Corporate (Limited)");
  });

  it("formats CorporateBorn as 'Corporate Born'", () => {
    const identity = {
      ...MOCK_IDENTITY_REAL,
      sin: { type: "real" as const, sinnerQuality: SinnerQuality.CorporateBorn },
    };
    const character = createSheetCharacter({ identities: [identity] });
    render(<IdentitiesDisplay character={character} />);
    expect(screen.getByTestId("value-pill")).toHaveTextContent("Corporate Born");
  });

  it("formats Criminal as 'Criminal'", () => {
    const identity = {
      ...MOCK_IDENTITY_REAL,
      sin: { type: "real" as const, sinnerQuality: SinnerQuality.Criminal },
    };
    const character = createSheetCharacter({ identities: [identity] });
    render(<IdentitiesDisplay character={character} />);
    expect(screen.getByTestId("value-pill")).toHaveTextContent("Criminal");
  });

  // --- Expand/collapse ---

  it("shows chevron for identity with licenses", () => {
    const character = createSheetCharacter({ identities: [MOCK_IDENTITY_FAKE] });
    render(<IdentitiesDisplay character={character} />);
    expect(screen.getByTestId("expand-button")).toBeInTheDocument();
  });

  it("does not show chevron for identity with no licenses and no notes", () => {
    const character = createSheetCharacter({ identities: [MOCK_IDENTITY_REAL] });
    render(<IdentitiesDisplay character={character} />);
    expect(screen.queryByTestId("expand-button")).not.toBeInTheDocument();
  });

  it("does not show expanded content by default", () => {
    const character = createSheetCharacter({ identities: [MOCK_IDENTITY_FAKE] });
    render(<IdentitiesDisplay character={character} />);
    expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
  });

  it("expands row on click", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ identities: [MOCK_IDENTITY_FAKE] });
    render(<IdentitiesDisplay character={character} />);

    await user.click(screen.getByTestId("identity-row"));
    expect(screen.getByTestId("expanded-content")).toBeInTheDocument();
  });

  it("collapses row on second click", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ identities: [MOCK_IDENTITY_FAKE] });
    render(<IdentitiesDisplay character={character} />);

    await user.click(screen.getByTestId("identity-row"));
    expect(screen.getByTestId("expanded-content")).toBeInTheDocument();

    await user.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
  });

  // --- Expanded licenses ---

  it("renders licenses section label when expanded", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ identities: [MOCK_IDENTITY_FAKE] });
    render(<IdentitiesDisplay character={character} />);

    await user.click(screen.getByTestId("identity-row"));
    expect(screen.getByText("Licenses")).toBeInTheDocument();
    expect(screen.getByTestId("licenses-section")).toBeInTheDocument();
  });

  it("renders license names and ratings when expanded", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ identities: [MOCK_IDENTITY_FAKE] });
    render(<IdentitiesDisplay character={character} />);

    await user.click(screen.getByTestId("identity-row"));

    const licenseRows = screen.getAllByTestId("license-row");
    expect(licenseRows).toHaveLength(2);
    expect(licenseRows[0]).toHaveTextContent("Firearms License");
    expect(licenseRows[0]).toHaveTextContent("R4");
    expect(licenseRows[1]).toHaveTextContent("Driver's License");
    expect(licenseRows[1]).toHaveTextContent("R4");
  });

  // --- Expanded notes ---

  it("renders notes when expanded", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ identities: [MOCK_IDENTITY_FAKE] });
    render(<IdentitiesDisplay character={character} />);

    await user.click(screen.getByTestId("identity-row"));
    expect(screen.getByTestId("identity-notes")).toHaveTextContent("Primary fake ID");
  });

  it("shows notes-only identity as expandable", async () => {
    const user = userEvent.setup();
    const identity = { ...MOCK_IDENTITY_REAL, notes: "Born in Seattle" };
    const character = createSheetCharacter({ identities: [identity] });
    render(<IdentitiesDisplay character={character} />);

    expect(screen.getByTestId("expand-button")).toBeInTheDocument();
    await user.click(screen.getByTestId("identity-row"));
    expect(screen.getByTestId("identity-notes")).toHaveTextContent("Born in Seattle");
    expect(screen.queryByTestId("licenses-section")).not.toBeInTheDocument();
  });

  // --- Expanded lifestyles ---

  it("renders lifestyles section with label when expanded", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({
      identities: [MOCK_IDENTITY_FAKE],
      lifestyles: [MOCK_LIFESTYLE_MEDIUM],
    });
    render(<IdentitiesDisplay character={character} />);

    await user.click(screen.getByTestId("identity-row"));
    expect(screen.getByTestId("lifestyles-section")).toBeInTheDocument();
    expect(screen.getByText("Lifestyles")).toBeInTheDocument();
    const row = screen.getByTestId("lifestyle-row");
    expect(row).toHaveTextContent("medium");
    expect(screen.getByTestId("lifestyle-cost")).toHaveTextContent("¥5,000/mo");
  });

  it("renders lifestyle location on its own line", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({
      identities: [MOCK_IDENTITY_FAKE],
      lifestyles: [MOCK_LIFESTYLE_MEDIUM],
    });
    render(<IdentitiesDisplay character={character} />);

    await user.click(screen.getByTestId("identity-row"));
    expect(screen.getByText("Downtown Seattle")).toBeInTheDocument();
  });

  it("no lifestyles section when no association", async () => {
    const user = userEvent.setup();
    const unlinkedLifestyle: Lifestyle = {
      id: "lifestyle-unlinked",
      type: "high",
      monthlyCost: 10000,
    };
    const character = createSheetCharacter({
      identities: [MOCK_IDENTITY_FAKE],
      lifestyles: [unlinkedLifestyle],
    });
    render(<IdentitiesDisplay character={character} />);

    await user.click(screen.getByTestId("identity-row"));
    expect(screen.queryByTestId("lifestyles-section")).not.toBeInTheDocument();
  });

  it("lifestyle-only identity is expandable", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({
      identities: [MOCK_IDENTITY_REAL],
      lifestyles: [MOCK_LIFESTYLE_LOW],
    });
    render(<IdentitiesDisplay character={character} />);

    expect(screen.getByTestId("expand-button")).toBeInTheDocument();
    await user.click(screen.getByTestId("identity-row"));
    expect(screen.getByTestId("lifestyles-section")).toBeInTheDocument();
    expect(screen.getByTestId("lifestyle-cost")).toHaveTextContent("¥2,000/mo");
    expect(screen.queryByTestId("licenses-section")).not.toBeInTheDocument();
  });

  it("renders multiple lifestyles for one identity", async () => {
    const user = userEvent.setup();
    const secondLifestyle: Lifestyle = {
      id: "lifestyle-3",
      type: "high",
      monthlyCost: 10000,
      location: "Bellevue",
      associatedIdentityId: "id-fake-1",
    };
    const character = createSheetCharacter({
      identities: [MOCK_IDENTITY_FAKE],
      lifestyles: [MOCK_LIFESTYLE_MEDIUM, secondLifestyle],
    });
    render(<IdentitiesDisplay character={character} />);

    await user.click(screen.getByTestId("identity-row"));
    const rows = screen.getAllByTestId("lifestyle-row");
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent("medium");
    expect(rows[1]).toHaveTextContent("high");
  });

  // --- Multiple identities ---

  it("renders multiple identities across sections", () => {
    const character = createSheetCharacter({
      identities: [MOCK_IDENTITY_FAKE, MOCK_IDENTITY_REAL],
    });
    render(<IdentitiesDisplay character={character} />);
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });
});
