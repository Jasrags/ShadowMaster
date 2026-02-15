/**
 * ArmorDisplay Component Tests
 *
 * Tests the armor display with expandable rows grouped into Worn/Stored sections.
 * Validates section grouping, collapsed/expanded states, stats, capacity bar,
 * modifications, and accessory badge rendering.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  setupDisplayCardMock,
  LUCIDE_MOCK,
  MOCK_ARMOR_EQUIPPED,
  MOCK_ARMOR_STORED,
  MOCK_ARMOR_WITH_MODS,
  MOCK_ARMOR_ACCESSORY,
} from "./test-helpers";

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

import { ArmorDisplay } from "../ArmorDisplay";

describe("ArmorDisplay", () => {
  // --- Empty state ---

  it("returns null when armor array is empty", () => {
    const { container } = render(<ArmorDisplay armor={[]} />);
    expect(container.innerHTML).toBe("");
  });

  // --- Section grouping ---

  it("renders Worn section for worn armor", () => {
    render(<ArmorDisplay armor={[MOCK_ARMOR_EQUIPPED]} />);
    expect(screen.getByText("Worn")).toBeInTheDocument();
  });

  it("renders Stored section for stored armor", () => {
    render(<ArmorDisplay armor={[MOCK_ARMOR_STORED]} />);
    expect(screen.getByText("Stored")).toBeInTheDocument();
  });

  it("hides Stored section when all armor is worn", () => {
    render(<ArmorDisplay armor={[MOCK_ARMOR_EQUIPPED]} />);
    expect(screen.queryByText("Stored")).not.toBeInTheDocument();
  });

  it("hides Worn section when all armor is stored", () => {
    render(<ArmorDisplay armor={[MOCK_ARMOR_STORED]} />);
    expect(screen.queryByText("Worn")).not.toBeInTheDocument();
  });

  it("renders both sections when armor includes worn and stored", () => {
    render(<ArmorDisplay armor={[MOCK_ARMOR_EQUIPPED, MOCK_ARMOR_STORED]} />);
    expect(screen.getByText("Worn")).toBeInTheDocument();
    expect(screen.getByText("Stored")).toBeInTheDocument();
  });

  it("falls back to equipped field when state is absent", () => {
    const legacyEquipped = { ...MOCK_ARMOR_EQUIPPED, state: undefined, equipped: true };
    const legacyStored = { ...MOCK_ARMOR_STORED, state: undefined, equipped: false };
    render(<ArmorDisplay armor={[legacyEquipped, legacyStored]} />);
    expect(screen.getByText("Worn")).toBeInTheDocument();
    expect(screen.getByText("Stored")).toBeInTheDocument();
  });

  // --- Collapsed row ---

  it("renders armor name in collapsed row", () => {
    render(<ArmorDisplay armor={[MOCK_ARMOR_EQUIPPED]} />);
    expect(screen.getByText("Armor Jacket")).toBeInTheDocument();
  });

  it("renders armor rating in sky-colored pill", () => {
    render(<ArmorDisplay armor={[MOCK_ARMOR_EQUIPPED]} />);
    const pill = screen.getByTestId("rating-pill");
    expect(pill).toHaveTextContent("12");
    expect(pill.className).toContain("sky");
  });

  it("renders accessory badge for armor modifiers", () => {
    render(<ArmorDisplay armor={[MOCK_ARMOR_ACCESSORY]} />);
    expect(screen.getByTestId("accessory-badge")).toHaveTextContent("Accessory");
  });

  it("does not render accessory badge for regular armor", () => {
    render(<ArmorDisplay armor={[MOCK_ARMOR_EQUIPPED]} />);
    expect(screen.queryByTestId("accessory-badge")).not.toBeInTheDocument();
  });

  it("does not show expanded content by default", () => {
    render(<ArmorDisplay armor={[MOCK_ARMOR_EQUIPPED]} />);
    expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
  });

  // --- Expand/collapse ---

  it("expands row on chevron click", async () => {
    const user = userEvent.setup();
    render(<ArmorDisplay armor={[MOCK_ARMOR_EQUIPPED]} />);

    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("expanded-content")).toBeInTheDocument();
  });

  it("collapses row on second chevron click", async () => {
    const user = userEvent.setup();
    render(<ArmorDisplay armor={[MOCK_ARMOR_EQUIPPED]} />);

    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("expanded-content")).toBeInTheDocument();

    await user.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
  });

  // --- Expanded stats ---

  it("renders availability with legality suffix when expanded", async () => {
    const user = userEvent.setup();
    render(<ArmorDisplay armor={[MOCK_ARMOR_WITH_MODS]} />);

    await user.click(screen.getAllByTestId("expand-button")[0]);

    const avail = screen.getByTestId("stat-availability");
    expect(avail).toHaveTextContent("14R");
  });

  it("renders weight when present and expanded", async () => {
    const user = userEvent.setup();
    render(<ArmorDisplay armor={[MOCK_ARMOR_WITH_MODS]} />);

    await user.click(screen.getAllByTestId("expand-button")[0]);

    const weight = screen.getByTestId("stat-weight");
    expect(weight).toHaveTextContent("8kg");
  });

  it("does not render availability when absent", async () => {
    const user = userEvent.setup();
    render(<ArmorDisplay armor={[MOCK_ARMOR_EQUIPPED]} />);

    await user.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("stat-availability")).not.toBeInTheDocument();
  });

  // --- Capacity ---

  it("renders capacity as used/total text for non-custom armor", async () => {
    const user = userEvent.setup();
    render(<ArmorDisplay armor={[MOCK_ARMOR_WITH_MODS]} />);

    await user.click(screen.getAllByTestId("expand-button")[0]);
    const section = screen.getByTestId("capacity-section");
    expect(section).toHaveTextContent("Capacity 7/15");
  });

  it("hides capacity section for custom items", async () => {
    const user = userEvent.setup();
    const customArmor = { ...MOCK_ARMOR_EQUIPPED, isCustom: true };
    render(<ArmorDisplay armor={[customArmor]} />);

    await user.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("capacity-section")).not.toBeInTheDocument();
  });

  // --- Modifications ---

  it("renders modifications section when mods exist", async () => {
    const user = userEvent.setup();
    render(<ArmorDisplay armor={[MOCK_ARMOR_WITH_MODS]} />);

    await user.click(screen.getAllByTestId("expand-button")[0]);
    expect(screen.getByTestId("modifications-section")).toBeInTheDocument();
    expect(screen.getByText("Modifications")).toBeInTheDocument();
  });

  it("renders mod names and ratings", async () => {
    const user = userEvent.setup();
    render(<ArmorDisplay armor={[MOCK_ARMOR_WITH_MODS]} />);

    await user.click(screen.getAllByTestId("expand-button")[0]);

    const modRows = screen.getAllByTestId("mod-row");
    expect(modRows).toHaveLength(2);

    expect(modRows[0]).toHaveTextContent("Fire Resistance");
    expect(modRows[0]).toHaveTextContent("3");
    expect(modRows[1]).toHaveTextContent("Chemical Protection");
    expect(modRows[1]).toHaveTextContent("4");
  });

  it("does not render modifications section when no mods", async () => {
    const user = userEvent.setup();
    render(<ArmorDisplay armor={[MOCK_ARMOR_EQUIPPED]} />);

    await user.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("modifications-section")).not.toBeInTheDocument();
  });

  // --- Multiple items ---

  it("renders multiple armor items", () => {
    render(<ArmorDisplay armor={[MOCK_ARMOR_EQUIPPED, MOCK_ARMOR_STORED]} />);
    expect(screen.getByText("Armor Jacket")).toBeInTheDocument();
    expect(screen.getByText("Lined Coat")).toBeInTheDocument();
  });
});
