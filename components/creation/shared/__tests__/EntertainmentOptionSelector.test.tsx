/**
 * EntertainmentOptionSelector Component Tests
 *
 * Tests the entertainment option browser/selector dialog for expanded lifestyles.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EntertainmentOptionSelector } from "../EntertainmentOptionSelector";
import type { LifestyleEntertainmentOption } from "@/lib/types";

const mockOptions = [
  {
    id: "pool",
    name: "Swimming Pool",
    type: "asset" as const,
    points: 2,
    monthlyCost: 500,
    minLifestyle: "middle",
    purchasableMultipleTimes: false,
    description: "A private pool",
  },
  {
    id: "cleaning-service",
    name: "Cleaning Service",
    type: "service" as const,
    points: 1,
    monthlyCost: 200,
    minLifestyle: "low",
    purchasableMultipleTimes: true,
    description: "Weekly cleaning",
  },
  {
    id: "fine-dining",
    name: "Fine Dining",
    type: "outing" as const,
    points: 2,
    monthlyCost: 1000,
    minLifestyle: "high",
    purchasableMultipleTimes: false,
  },
];

vi.mock("@/lib/rules/RulesetContext", () => ({
  useEntertainmentOptions: () => mockOptions,
}));

// Mock react-aria-components to always show dialog content
vi.mock("react-aria-components", () => ({
  Button: ({
    children,
    onPress,
    ...props
  }: React.ComponentProps<"button"> & { onPress?: () => void }) => (
    <button {...props} onClick={onPress}>
      {children}
    </button>
  ),
  Dialog: ({ children }: { children: (props: { close: () => void }) => React.ReactNode }) => (
    <div data-testid="dialog">{children({ close: vi.fn() })}</div>
  ),
  DialogTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Modal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("EntertainmentOptionSelector", () => {
  const defaultProps = {
    lifestyleId: "middle",
    selectedOptions: [] as LifestyleEntertainmentOption[],
    onUpdate: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the trigger button", () => {
    render(<EntertainmentOptionSelector {...defaultProps} />);
    expect(screen.getByText("+ Add Entertainment")).toBeInTheDocument();
  });

  it("renders dialog title", () => {
    render(<EntertainmentOptionSelector {...defaultProps} />);
    expect(screen.getByText("Entertainment Options")).toBeInTheDocument();
  });

  it("filters options by minimum lifestyle", () => {
    render(<EntertainmentOptionSelector {...defaultProps} lifestyleId="low" />);

    // "low" lifestyle: pool requires "middle" so should NOT appear
    // cleaning-service requires "low" so SHOULD appear
    // fine-dining requires "high" so should NOT appear
    expect(screen.queryByText("Swimming Pool")).not.toBeInTheDocument();
    expect(screen.getByText("Cleaning Service")).toBeInTheDocument();
    expect(screen.queryByText("Fine Dining")).not.toBeInTheDocument();
  });

  it("shows all options that meet minimum lifestyle for high tier", () => {
    render(<EntertainmentOptionSelector {...defaultProps} lifestyleId="high" />);

    expect(screen.getByText("Swimming Pool")).toBeInTheDocument();
    expect(screen.getByText("Cleaning Service")).toBeInTheDocument();
    expect(screen.getByText("Fine Dining")).toBeInTheDocument();
  });

  it("calls onUpdate when adding an option", () => {
    const onUpdate = vi.fn();
    render(
      <EntertainmentOptionSelector {...defaultProps} lifestyleId="high" onUpdate={onUpdate} />
    );

    // Find the + button within the Swimming Pool row
    const poolText = screen.getByText("Swimming Pool");
    const row = poolText.closest("div[class*='rounded-md']")!;
    const buttons = row.querySelectorAll("button");
    // For unselected items, there's only the + button
    fireEvent.click(buttons[buttons.length - 1]);

    expect(onUpdate).toHaveBeenCalledWith([
      { catalogId: "pool", name: "Swimming Pool", quantity: 1 },
    ]);
  });

  it("increments quantity for multi-purchasable options", () => {
    const onUpdate = vi.fn();
    const selected: LifestyleEntertainmentOption[] = [
      { catalogId: "cleaning-service", name: "Cleaning Service", quantity: 1 },
    ];

    render(
      <EntertainmentOptionSelector
        {...defaultProps}
        lifestyleId="high"
        selectedOptions={selected}
        onUpdate={onUpdate}
      />
    );

    const row = screen.getByText("Cleaning Service").closest("div[class*='rounded-md']")!;
    const buttons = row.querySelectorAll("button");
    // Last button is the + button
    fireEvent.click(buttons[buttons.length - 1]);

    expect(onUpdate).toHaveBeenCalledWith([
      { catalogId: "cleaning-service", name: "Cleaning Service", quantity: 2 },
    ]);
  });

  it("removes option when quantity reaches zero", () => {
    const onUpdate = vi.fn();
    const selected: LifestyleEntertainmentOption[] = [
      { catalogId: "pool", name: "Swimming Pool", quantity: 1 },
    ];

    render(
      <EntertainmentOptionSelector
        {...defaultProps}
        lifestyleId="high"
        selectedOptions={selected}
        onUpdate={onUpdate}
      />
    );

    const row = screen.getByText("Swimming Pool").closest("div[class*='rounded-md']")!;
    const buttons = row.querySelectorAll("button");
    // First button should be the minus button for selected items
    fireEvent.click(buttons[0]);

    expect(onUpdate).toHaveBeenCalledWith([]);
  });

  it("filters by type when filter buttons clicked", () => {
    render(<EntertainmentOptionSelector {...defaultProps} lifestyleId="high" />);

    fireEvent.click(screen.getByText("Asset"));

    expect(screen.getByText("Swimming Pool")).toBeInTheDocument();
    expect(screen.queryByText("Cleaning Service")).not.toBeInTheDocument();
    expect(screen.queryByText("Fine Dining")).not.toBeInTheDocument();
  });

  it("shows All filter resets type filter", () => {
    render(<EntertainmentOptionSelector {...defaultProps} lifestyleId="high" />);

    // Filter to assets
    fireEvent.click(screen.getByText("Asset"));
    expect(screen.queryByText("Cleaning Service")).not.toBeInTheDocument();

    // Reset to All
    fireEvent.click(screen.getByText("All"));
    expect(screen.getByText("Cleaning Service")).toBeInTheDocument();
  });

  it("displays point cost and monthly cost", () => {
    render(<EntertainmentOptionSelector {...defaultProps} lifestyleId="high" />);

    // Pool: 2pt, ¥500/mo
    expect(screen.getAllByText("2pt").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("1pt").length).toBeGreaterThanOrEqual(1);
  });

  it("highlights selected options with amber border", () => {
    const selected: LifestyleEntertainmentOption[] = [
      { catalogId: "pool", name: "Swimming Pool", quantity: 1 },
    ];

    render(
      <EntertainmentOptionSelector
        {...defaultProps}
        lifestyleId="high"
        selectedOptions={selected}
      />
    );

    const row = screen.getByText("Swimming Pool").closest("div[class*='rounded-md']")!;
    expect(row.className).toContain("border-amber");
  });

  it("shows quantity for selected items", () => {
    const selected: LifestyleEntertainmentOption[] = [
      { catalogId: "cleaning-service", name: "Cleaning Service", quantity: 3 },
    ];

    render(
      <EntertainmentOptionSelector
        {...defaultProps}
        lifestyleId="high"
        selectedOptions={selected}
      />
    );

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("shows empty message when no options available for tier", () => {
    render(<EntertainmentOptionSelector {...defaultProps} lifestyleId="street" />);

    // Street lifestyle: nothing meets minimum
    expect(
      screen.getByText("No entertainment options available for this lifestyle tier.")
    ).toBeInTheDocument();
  });

  it("shows type badges on options", () => {
    render(<EntertainmentOptionSelector {...defaultProps} lifestyleId="high" />);

    expect(screen.getByText("asset")).toBeInTheDocument();
    expect(screen.getByText("service")).toBeInTheDocument();
    expect(screen.getByText("outing")).toBeInTheDocument();
  });
});
