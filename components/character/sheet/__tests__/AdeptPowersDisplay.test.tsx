/**
 * AdeptPowersDisplay Component Tests
 *
 * Tests the adept powers display with collapsible rows.
 * Shows name and inline rating in collapsed state.
 * Expanded state shows description, activation, specification, and rating from catalog.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AdeptPower } from "@/lib/types";

vi.mock("../DisplayCard", () => ({
  DisplayCard: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div data-testid="display-card">
      <h2>{title}</h2>
      {children}
    </div>
  ),
}));

vi.mock("lucide-react", () => ({
  Zap: (props: Record<string, unknown>) => <span data-testid="icon-Zap" {...props} />,
  ChevronDown: (props: Record<string, unknown>) => (
    <span data-testid="icon-ChevronDown" {...props} />
  ),
  ChevronRight: (props: Record<string, unknown>) => (
    <span data-testid="icon-ChevronRight" {...props} />
  ),
}));

const mockUseAdeptPowers = vi.fn().mockReturnValue([
  {
    id: "improved-reflexes",
    name: "Improved Reflexes",
    description: "+1 Reaction and +1D6 Initiative per level.",
    activation: "free",
    hasRating: true,
    minRating: 1,
    maxRating: 3,
  },
  {
    id: "improved-ability",
    name: "Improved Ability",
    description: "+1 Rating per level to a single Active skill.",
    activation: "free",
    hasRating: true,
    minRating: 1,
    maxRating: 4,
  },
  {
    id: "traceless-walk",
    name: "Traceless Walk",
    description: "Leave no physical trace when walking.",
  },
  {
    id: "killing-hands",
    name: "Killing Hands",
    description: "Unarmed attacks deal Physical damage.",
  },
]);

vi.mock("@/lib/rules", () => ({
  useAdeptPowers: () => mockUseAdeptPowers(),
}));

import { AdeptPowersDisplay } from "../AdeptPowersDisplay";

const basePower: AdeptPower = {
  id: "improved-reflexes",
  catalogId: "improved-reflexes",
  name: "Improved Reflexes",
  rating: 2,
  powerPointCost: 2.5,
};

describe("AdeptPowersDisplay", () => {
  it("returns null when adeptPowers array is empty", () => {
    const { container } = render(<AdeptPowersDisplay adeptPowers={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("returns null when adeptPowers is undefined", () => {
    const { container } = render(
      <AdeptPowersDisplay adeptPowers={undefined as unknown as AdeptPower[]} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders power name", () => {
    render(<AdeptPowersDisplay adeptPowers={[basePower]} />);
    expect(screen.getByText("Improved Reflexes")).toBeInTheDocument();
  });

  it("renders inline rating in collapsed state", () => {
    render(<AdeptPowersDisplay adeptPowers={[basePower]} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("does not render rating when no rating", () => {
    const noRating: AdeptPower = {
      id: "traceless-walk",
      catalogId: "traceless-walk",
      name: "Traceless Walk",
      powerPointCost: 1,
    };
    render(<AdeptPowersDisplay adeptPowers={[noRating]} />);
    expect(screen.getByText("Traceless Walk")).toBeInTheDocument();
    expect(screen.queryByText("1")).not.toBeInTheDocument();
  });

  it("shows chevron when catalog has expandable content", () => {
    render(<AdeptPowersDisplay adeptPowers={[basePower]} />);
    expect(screen.getByTestId("expand-button")).toBeInTheDocument();
  });

  it("does not show chevron when no catalog entry and no specification", () => {
    mockUseAdeptPowers.mockReturnValueOnce([]);
    const minimal: AdeptPower = {
      id: "unknown-power",
      catalogId: "unknown-power",
      name: "Unknown Power",
      powerPointCost: 1,
    };
    render(<AdeptPowersDisplay adeptPowers={[minimal]} />);
    expect(screen.queryByTestId("expand-button")).not.toBeInTheDocument();
  });

  it("shows description from catalog in expanded section", async () => {
    const user = userEvent.setup();
    render(<AdeptPowersDisplay adeptPowers={[basePower]} />);

    // Description not visible collapsed
    expect(screen.queryByText(/\+1 Reaction/)).not.toBeInTheDocument();

    await user.click(screen.getByTestId("expand-button"));

    expect(screen.getByText("+1 Reaction and +1D6 Initiative per level.")).toBeInTheDocument();
  });

  it("shows activation from catalog in expanded section", async () => {
    const user = userEvent.setup();
    render(<AdeptPowersDisplay adeptPowers={[basePower]} />);

    await user.click(screen.getByTestId("expand-button"));

    expect(screen.getByText("Free Action")).toBeInTheDocument();
  });

  it("shows specification in expanded section", async () => {
    const user = userEvent.setup();
    const withSpec: AdeptPower = {
      id: "improved-ability",
      catalogId: "improved-ability",
      name: "Improved Ability",
      rating: 2,
      powerPointCost: 1,
      specification: "Pistols",
    };
    render(<AdeptPowersDisplay adeptPowers={[withSpec]} />);

    // Specification not visible collapsed
    expect(screen.queryByText("Pistols")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("expand-button"));

    expect(screen.getByTestId("expanded-content")).toBeInTheDocument();
    expect(screen.getByText("Pistols")).toBeInTheDocument();
  });

  it("shows rating with max from catalog in expanded section", async () => {
    const user = userEvent.setup();
    render(<AdeptPowersDisplay adeptPowers={[basePower]} />);

    await user.click(screen.getByTestId("expand-button"));

    const expanded = screen.getByTestId("expanded-content");
    expect(expanded).toHaveTextContent("Rating:");
    expect(expanded).toHaveTextContent("2 / 3");
  });

  it("collapses row on second chevron click", async () => {
    const user = userEvent.setup();
    render(<AdeptPowersDisplay adeptPowers={[basePower]} />);

    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("expanded-content")).toBeInTheDocument();

    await user.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
  });

  it("renders multiple powers", () => {
    const secondPower: AdeptPower = {
      id: "killing-hands",
      catalogId: "killing-hands",
      name: "Killing Hands",
      powerPointCost: 0.5,
    };
    render(<AdeptPowersDisplay adeptPowers={[basePower, secondPower]} />);
    expect(screen.getByText("Improved Reflexes")).toBeInTheDocument();
    expect(screen.getByText("Killing Hands")).toBeInTheDocument();
  });
});
