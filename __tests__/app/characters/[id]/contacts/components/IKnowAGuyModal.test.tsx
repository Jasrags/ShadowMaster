import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

vi.mock("react-aria-components", () => ({
  ModalOverlay: ({ children, isOpen }: { children: React.ReactNode; isOpen: boolean }) =>
    isOpen ? <div data-testid="modal-overlay">{children}</div> : null,
  Modal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Dialog: ({
    children,
  }: {
    children: ((opts: { close: () => void }) => React.ReactNode) | React.ReactNode;
  }) =>
    typeof children === "function" ? (
      <div>{children({ close: vi.fn() })}</div>
    ) : (
      <div>{children}</div>
    ),
  Button: ({
    children,
    onPress,
    isDisabled,
    ...props
  }: {
    children: React.ReactNode;
    onPress?: () => void;
    isDisabled?: boolean;
    className?: string;
  }) => (
    <button onClick={onPress} disabled={isDisabled} {...props}>
      {children}
    </button>
  ),
}));

vi.mock("lucide-react", () => ({}));

vi.mock("@/lib/themes", () => ({
  THEMES: {
    "neon-rain": {
      id: "neon-rain",
      colors: {
        background: "",
        card: "",
        border: "",
        accent: "",
        accentBg: "",
        muted: "",
        heading: "",
      },
      fonts: { heading: "", body: "", mono: "" },
      components: {
        section: { wrapper: "", header: "", title: "", cornerAccent: false },
        card: { wrapper: "", hover: "", border: "" },
        badge: { positive: "", negative: "", neutral: "" },
      },
    },
  },
  DEFAULT_THEME: "neon-rain",
}));

vi.mock("@/lib/rules/i-know-a-guy", () => ({
  calculateEdgeCost: (connection: number) => connection * 2,
  calculateConfirmationKarmaCost: (connection: number) => connection + 1,
}));

import { IKnowAGuyModal } from "@/app/characters/[id]/contacts/components/IKnowAGuyModal";
import type { ContactArchetype } from "@/lib/types";

const sampleArchetypes = [
  {
    id: "fixer",
    name: "Fixer",
    description: "Gets things done",
    suggestedConnection: [2, 6] as [number, number],
    suggestedLoyalty: [1, 4] as [number, number],
    commonServices: ["gear"],
    riskProfile: "medium" as const,
    typicalCosts: {},
  },
  {
    id: "street-doc",
    name: "Street Doc",
    description: "Medical services",
    suggestedConnection: [2, 5] as [number, number],
    suggestedLoyalty: [1, 3] as [number, number],
    commonServices: ["medical"],
    riskProfile: "low" as const,
    typicalCosts: {},
  },
] satisfies ContactArchetype[];

describe("IKnowAGuyModal", () => {
  const onClose = vi.fn();
  const onSubmit = vi.fn().mockResolvedValue(undefined);

  const defaultProps = {
    isOpen: true,
    onClose,
    onSubmit,
    currentEdge: 6,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    onSubmit.mockResolvedValue(undefined);
  });

  it("renders title 'I Know a Guy' when open", () => {
    render(<IKnowAGuyModal {...defaultProps} />);
    expect(screen.getByText(/I Know a Guy/i)).toBeInTheDocument();
  });

  it("does NOT render when isOpen is false", () => {
    render(<IKnowAGuyModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId("modal-overlay")).not.toBeInTheDocument();
    expect(screen.queryByText(/I Know a Guy/i)).not.toBeInTheDocument();
  });

  it("shows 'Available Edge: N' matching currentEdge", () => {
    render(<IKnowAGuyModal {...defaultProps} currentEdge={6} />);
    // Text is split: "Available Edge:" in parent, "6" in a child <span>
    const container = screen.getByText(/available edge/i);
    expect(container.textContent).toContain("6");
  });

  it("shows 12 connection selector buttons", () => {
    render(<IKnowAGuyModal {...defaultProps} />);
    const connectionButtons = Array.from({ length: 12 }, (_, i) =>
      screen.queryByRole("button", { name: String(i + 1) })
    ).filter(Boolean);
    expect(connectionButtons).toHaveLength(12);
  });

  it("disables connection buttons that cost more Edge than available (currentEdge=4)", () => {
    // calculateEdgeCost = connection * 2
    // connection 1 costs 2 (ok), connection 2 costs 4 (ok), connection 3 costs 6 (disabled)
    render(<IKnowAGuyModal {...defaultProps} currentEdge={4} />);

    const btn1 = screen.getByRole("button", { name: "1" });
    const btn2 = screen.getByRole("button", { name: "2" });
    const btn3 = screen.getByRole("button", { name: "3" });
    const btn12 = screen.getByRole("button", { name: "12" });

    expect(btn1).not.toBeDisabled();
    expect(btn2).not.toBeDisabled();
    expect(btn3).toBeDisabled();
    expect(btn12).toBeDisabled();
  });

  it("shows Edge cost breakdown (Edge Cost, Edge Remaining, Karma to Confirm)", async () => {
    const user = userEvent.setup();
    render(<IKnowAGuyModal {...defaultProps} currentEdge={6} />);

    // Select connection 2 to trigger cost display
    const btn2 = screen.getByRole("button", { name: "2" });
    await user.click(btn2);

    expect(screen.getByText(/Edge Cost/i)).toBeInTheDocument();
    expect(screen.getByText(/Edge Remaining/i)).toBeInTheDocument();
    expect(screen.getByText(/Karma to Confirm/i)).toBeInTheDocument();
  });

  it("does NOT show Insufficient Edge warning when connection is affordable", () => {
    // currentEdge=6, default connection=1, cost=2 — affordable
    render(<IKnowAGuyModal {...defaultProps} currentEdge={6} />);
    expect(screen.queryByText(/insufficient edge/i)).not.toBeInTheDocument();
  });

  it("submit button is disabled when name is empty", async () => {
    const user = userEvent.setup();
    render(<IKnowAGuyModal {...defaultProps} />);

    // Select a connection
    await user.click(screen.getByRole("button", { name: "1" }));

    // Clear name field (should be empty by default)
    const nameInput = screen.getByPlaceholderText(/who do you know/i);
    expect(nameInput).toHaveValue("");

    const submitButton = screen.getByRole("button", { name: /spend.*edge/i });
    expect(submitButton).toBeDisabled();
  });

  it("submit button is disabled when archetype is empty", async () => {
    const user = userEvent.setup();
    // Without archetypes prop, archetype is a text input (empty by default)
    render(<IKnowAGuyModal {...defaultProps} />);

    const nameInput = screen.getByPlaceholderText(/who do you know/i);
    await user.type(nameInput, "John Smith");

    // Archetype still empty — submit should be disabled
    const submitButton = screen.getByRole("button", { name: /spend.*edge/i });
    expect(submitButton).toBeDisabled();
  });

  it("calls onSubmit with {connection, archetype, name, description} on submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<IKnowAGuyModal {...defaultProps} onSubmit={onSubmit} archetypes={sampleArchetypes} />);

    // Select connection 1
    await user.click(screen.getByRole("button", { name: "1" }));

    // Fill name
    const nameInput = screen.getByPlaceholderText(/who do you know/i);
    await user.type(nameInput, "John Smith");

    // Fill description if present
    const descriptionInput = screen.queryByLabelText(/Description/i);
    if (descriptionInput) {
      await user.type(descriptionInput, "A trusty fixer");
    }

    // Select archetype via dropdown — the <select> renders options with value=name
    const archetypeSelect = screen.getByRole("combobox");
    await user.selectOptions(archetypeSelect, "Fixer");

    const submitButton = screen.getByRole("button", { name: /spend.*edge/i });
    await user.click(submitButton);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        connection: 1,
        name: "John Smith",
      })
    );
  });

  it("calls onClose when Cancel pressed", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<IKnowAGuyModal {...defaultProps} onClose={onClose} />);

    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    await user.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows archetype dropdown when archetypes prop provided", () => {
    render(<IKnowAGuyModal {...defaultProps} archetypes={sampleArchetypes} />);

    // Select element should be present
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    // Options should include "Fixer"
    expect(screen.getByRole("option", { name: /fixer/i })).toBeInTheDocument();
  });
});
