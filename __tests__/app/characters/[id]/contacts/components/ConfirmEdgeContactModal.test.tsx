import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { SocialContact } from "@/lib/types";

vi.mock("react-aria-components", () => ({
  ModalOverlay: ({
    children,
    isOpen,
  }: {
    children: React.ReactNode;
    isOpen: boolean;
    onOpenChange?: (open: boolean) => void;
    isDismissable?: boolean;
    className?: string | ((state: unknown) => string);
  }) => (isOpen ? <div data-testid="modal-overlay">{children}</div> : null),
  Modal: ({
    children,
  }: {
    children: React.ReactNode;
    className?: string | ((state: unknown) => string);
  }) =>
    typeof children === "function" ? (
      <div>
        {(children as (opts: unknown) => React.ReactNode)({ isEntering: false, isExiting: false })}
      </div>
    ) : (
      <div>{children}</div>
    ),
  Dialog: ({
    children,
  }: {
    children: ((opts: { close: () => void }) => React.ReactNode) | React.ReactNode;
    className?: string;
  }) =>
    typeof children === "function" ? (
      <div>{children({ close: vi.fn() })}</div>
    ) : (
      <div>{children}</div>
    ),
  Heading: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    slot?: string;
    className?: string;
  }) => <h2 {...props}>{children}</h2>,
  Button: ({
    children,
    onPress,
    isDisabled,
    type,
    ...props
  }: {
    children: React.ReactNode;
    onPress?: () => void;
    isDisabled?: boolean;
    type?: "button" | "submit" | "reset";
    className?: string;
  }) => (
    <button onClick={onPress} disabled={isDisabled} type={type || "button"} {...props}>
      {children}
    </button>
  ),
  Label: ({ children, ...props }: { children: React.ReactNode; className?: string }) => (
    <label {...props}>{children}</label>
  ),
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
  TextField: ({ children, ...props }: { children: React.ReactNode; className?: string }) => (
    <div {...props}>{children}</div>
  ),
  TextArea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} />,
}));

vi.mock("lucide-react", () => ({
  X: () => <svg data-testid="x-icon" />,
}));

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
  calculateConfirmationKarmaCost: (connection: number) => connection + 1,
}));

const makeContact = (overrides = {}): SocialContact => ({
  id: "cnt-edge",
  characterId: "char-1",
  name: "Ghost",
  connection: 3,
  loyalty: 1,
  archetype: "Street Doc",
  status: "active",
  favorBalance: 0,
  group: "personal",
  visibility: {
    playerVisible: true,
    showConnection: true,
    showLoyalty: true,
    showFavorBalance: true,
    showSpecializations: true,
  },
  pendingKarmaConfirmation: true,
  acquisitionMethod: "edge",
  createdAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

import { ConfirmEdgeContactModal } from "@/app/characters/[id]/contacts/components/ConfirmEdgeContactModal";

describe("ConfirmEdgeContactModal", () => {
  const onClose = vi.fn();
  const onConfirm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    onConfirm.mockResolvedValue(undefined);
  });

  const defaultProps = {
    isOpen: true,
    onClose,
    onConfirm,
    contact: makeContact(),
    characterKarma: 10,
  };

  it("renders contact name, archetype, connection, and loyalty", () => {
    render(<ConfirmEdgeContactModal {...defaultProps} />);

    expect(screen.getByText("Ghost")).toBeInTheDocument();
    expect(screen.getByText("Street Doc")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("shows karma cost as connection + 1", () => {
    const contact = makeContact({ connection: 3 });
    render(<ConfirmEdgeContactModal {...defaultProps} contact={contact} characterKarma={10} />);

    // connection=3, cost=4 — rendered as "4K"
    expect(screen.getByText("4K")).toBeInTheDocument();
  });

  it("shows character karma total", () => {
    render(<ConfirmEdgeContactModal {...defaultProps} characterKarma={7} />);

    expect(screen.getByText(/7/)).toBeInTheDocument();
  });

  it("disables confirm button when karma is insufficient", () => {
    const contact = makeContact({ connection: 5 });
    render(<ConfirmEdgeContactModal {...defaultProps} contact={contact} characterKarma={2} />);

    // connection=5, cost=6, karma=2 → insufficient
    // Button text is "Spend N Karma"
    const confirmButton = screen.getByRole("button", { name: /spend.*karma/i });
    expect(confirmButton).toBeDisabled();
  });

  it("shows insufficient karma warning when character cannot afford the cost", () => {
    const contact = makeContact({ connection: 5 });
    render(<ConfirmEdgeContactModal {...defaultProps} contact={contact} characterKarma={2} />);

    expect(screen.getByText(/insufficient karma/i)).toBeInTheDocument();
  });

  it("calls onConfirm when confirm button is pressed with sufficient karma", async () => {
    const user = userEvent.setup();
    const contact = makeContact({ connection: 3 });
    render(<ConfirmEdgeContactModal {...defaultProps} contact={contact} characterKarma={10} />);

    // connection=3, cost=4, karma=10 → sufficient
    const confirmButton = screen.getByRole("button", { name: /spend.*karma/i });
    expect(confirmButton).not.toBeDisabled();

    await user.click(confirmButton);

    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("calls onClose when cancel button is pressed", async () => {
    const user = userEvent.setup();
    render(<ConfirmEdgeContactModal {...defaultProps} />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not render when isOpen is false", () => {
    render(<ConfirmEdgeContactModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByTestId("modal-overlay")).not.toBeInTheDocument();
    expect(screen.queryByText("Ghost")).not.toBeInTheDocument();
  });
});
