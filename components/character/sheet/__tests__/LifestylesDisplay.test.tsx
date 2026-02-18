/**
 * LifestylesDisplay Component Tests
 *
 * Tests the lifestyles display with expandable-row pattern.
 * Returns null when empty. Shows monthly cost pills, location
 * annotation, and expanded details (prepaid months, notes,
 * modifications, subscriptions).
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Lifestyle } from "@/lib/types";
import { setupDisplayCardMock, LUCIDE_MOCK } from "./test-helpers";

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

import { LifestylesDisplay } from "../LifestylesDisplay";

const baseLifestyle: Lifestyle = {
  id: "lifestyle-1",
  type: "medium",
  monthlyCost: 5000,
  location: "Downtown Seattle",
};

describe("LifestylesDisplay", () => {
  // -----------------------------------------------------------------------
  // Null / empty
  // -----------------------------------------------------------------------
  it("returns null when lifestyles array is empty", () => {
    const { container } = render(<LifestylesDisplay lifestyles={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("returns null when lifestyles is undefined", () => {
    const { container } = render(
      <LifestylesDisplay lifestyles={undefined as unknown as Lifestyle[]} />
    );
    expect(container.innerHTML).toBe("");
  });

  // -----------------------------------------------------------------------
  // Collapsed row
  // -----------------------------------------------------------------------
  it("renders lifestyle type", () => {
    render(<LifestylesDisplay lifestyles={[baseLifestyle]} />);
    expect(screen.getByText("medium")).toBeInTheDocument();
  });

  it("renders monthly cost in cost pill", () => {
    render(<LifestylesDisplay lifestyles={[baseLifestyle]} />);
    const pill = screen.getByTestId("cost-pill");
    expect(pill).toHaveTextContent("¥5,000/mo");
  });

  it("renders location as inline annotation", () => {
    render(<LifestylesDisplay lifestyles={[baseLifestyle]} />);
    expect(screen.getByText("(Downtown Seattle)")).toBeInTheDocument();
  });

  it("does not render location when not present", () => {
    const noLocation: Lifestyle = { ...baseLifestyle, location: undefined };
    render(<LifestylesDisplay lifestyles={[noLocation]} />);
    expect(screen.queryByText(/Downtown Seattle/)).not.toBeInTheDocument();
  });

  it("renders multiple lifestyles", () => {
    const secondLifestyle: Lifestyle = {
      id: "lifestyle-2",
      type: "low",
      monthlyCost: 2000,
      location: "Redmond Barrens",
    };
    render(<LifestylesDisplay lifestyles={[baseLifestyle, secondLifestyle]} />);
    const rows = screen.getAllByTestId("lifestyle-row");
    expect(rows).toHaveLength(2);
    expect(screen.getByText("medium")).toBeInTheDocument();
    expect(screen.getByText("low")).toBeInTheDocument();
  });

  it("formats large monthly costs with commas", () => {
    const expensive: Lifestyle = {
      id: "lifestyle-3",
      type: "luxury",
      monthlyCost: 100000,
    };
    render(<LifestylesDisplay lifestyles={[expensive]} />);
    const pill = screen.getByTestId("cost-pill");
    expect(pill).toHaveTextContent("¥100,000/mo");
  });

  // -----------------------------------------------------------------------
  // Expand / collapse
  // -----------------------------------------------------------------------
  it("does not show expanded content by default", () => {
    render(<LifestylesDisplay lifestyles={[baseLifestyle]} />);
    expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
  });

  it("expands on click and collapses on second click", async () => {
    const user = userEvent.setup();
    const richLifestyle: Lifestyle = {
      ...baseLifestyle,
      prepaidMonths: 3,
    };
    render(<LifestylesDisplay lifestyles={[richLifestyle]} />);

    // Click to expand
    await user.click(screen.getByTestId("lifestyle-row"));
    expect(screen.getByTestId("expanded-content")).toBeInTheDocument();

    // Click to collapse
    await user.click(screen.getByTestId("lifestyle-row"));
    expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
  });

  it("shows ChevronRight when collapsed and ChevronDown when expanded", async () => {
    const user = userEvent.setup();
    const richLifestyle: Lifestyle = {
      ...baseLifestyle,
      prepaidMonths: 3,
    };
    render(<LifestylesDisplay lifestyles={[richLifestyle]} />);

    const expandBtn = screen.getByTestId("expand-button");
    expect(expandBtn.querySelector('[data-testid="icon-ChevronRight"]')).toBeInTheDocument();
    expect(expandBtn.querySelector('[data-testid="icon-ChevronDown"]')).not.toBeInTheDocument();

    await user.click(screen.getByTestId("lifestyle-row"));
    expect(expandBtn.querySelector('[data-testid="icon-ChevronDown"]')).toBeInTheDocument();
    expect(expandBtn.querySelector('[data-testid="icon-ChevronRight"]')).not.toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // Expanded details
  // -----------------------------------------------------------------------
  it("shows prepaid months when present", async () => {
    const user = userEvent.setup();
    const lifestyle: Lifestyle = {
      ...baseLifestyle,
      prepaidMonths: 6,
    };
    render(<LifestylesDisplay lifestyles={[lifestyle]} />);
    await user.click(screen.getByTestId("lifestyle-row"));
    const stat = screen.getByTestId("stat-prepaid");
    expect(stat).toHaveTextContent("Prepaid");
    expect(stat).toHaveTextContent("6 mo");
  });

  it("shows custom expenses and income when present", async () => {
    const user = userEvent.setup();
    const lifestyle: Lifestyle = {
      ...baseLifestyle,
      customExpenses: 500,
      customIncome: 1200,
    };
    render(<LifestylesDisplay lifestyles={[lifestyle]} />);
    await user.click(screen.getByTestId("lifestyle-row"));
    expect(screen.getByTestId("stat-expenses")).toHaveTextContent("¥500");
    expect(screen.getByTestId("stat-income")).toHaveTextContent("¥1,200");
  });

  it("shows notes when present", async () => {
    const user = userEvent.setup();
    const lifestyle: Lifestyle = {
      ...baseLifestyle,
      notes: "Near a Stuffer Shack",
    };
    render(<LifestylesDisplay lifestyles={[lifestyle]} />);
    await user.click(screen.getByTestId("lifestyle-row"));
    const notes = screen.getByTestId("notes");
    expect(notes).toHaveTextContent("Near a Stuffer Shack");
  });

  it("shows modifications with type badge and modifier", async () => {
    const user = userEvent.setup();
    const lifestyle: Lifestyle = {
      ...baseLifestyle,
      modifications: [
        {
          name: "Extra Secure",
          type: "positive",
          modifierType: "percentage",
          modifier: 20,
        },
        {
          name: "Cramped",
          type: "negative",
          modifierType: "fixed",
          modifier: -1000,
        },
      ],
    };
    render(<LifestylesDisplay lifestyles={[lifestyle]} />);
    await user.click(screen.getByTestId("lifestyle-row"));

    expect(screen.getByTestId("modifications-section")).toBeInTheDocument();
    const modRows = screen.getAllByTestId("mod-row");
    expect(modRows).toHaveLength(2);
    expect(screen.getByText("Extra Secure")).toBeInTheDocument();
    expect(screen.getByText("+20%")).toBeInTheDocument();
    expect(screen.getByText("Cramped")).toBeInTheDocument();
    expect(screen.getByText("-1,000¥")).toBeInTheDocument();

    const typeBadges = screen.getAllByTestId("mod-type");
    expect(typeBadges[0]).toHaveTextContent("positive");
    expect(typeBadges[1]).toHaveTextContent("negative");
  });

  it("shows subscriptions with category and cost", async () => {
    const user = userEvent.setup();
    const lifestyle: Lifestyle = {
      ...baseLifestyle,
      subscriptions: [
        {
          name: "DocWagon Gold",
          monthlyCost: 500,
          category: "medical",
        },
        {
          name: "GridGuide",
          monthlyCost: 50,
        },
      ],
    };
    render(<LifestylesDisplay lifestyles={[lifestyle]} />);
    await user.click(screen.getByTestId("lifestyle-row"));

    expect(screen.getByTestId("subscriptions-section")).toBeInTheDocument();
    const subRows = screen.getAllByTestId("sub-row");
    expect(subRows).toHaveLength(2);
    expect(screen.getByText("DocWagon Gold")).toBeInTheDocument();
    expect(screen.getByText("(medical)")).toBeInTheDocument();
    expect(screen.getByText("GridGuide")).toBeInTheDocument();
  });

  it("does not render stats/mods/subs sections when data is absent", async () => {
    const user = userEvent.setup();
    // baseLifestyle has no prepaidMonths, notes, mods, or subs — but we still
    // need *something* to trigger the expanded section to render. We'll just
    // click and verify the sections are NOT present.
    render(<LifestylesDisplay lifestyles={[baseLifestyle]} />);
    await user.click(screen.getByTestId("lifestyle-row"));

    // expanded-content is rendered but no sub-sections inside
    expect(screen.getByTestId("expanded-content")).toBeInTheDocument();
    expect(screen.queryByTestId("stat-prepaid")).not.toBeInTheDocument();
    expect(screen.queryByTestId("notes")).not.toBeInTheDocument();
    expect(screen.queryByTestId("modifications-section")).not.toBeInTheDocument();
    expect(screen.queryByTestId("subscriptions-section")).not.toBeInTheDocument();
  });
});
