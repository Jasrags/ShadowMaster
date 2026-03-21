import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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
  Label: ({ children, ...props }: { children: React.ReactNode; className?: string }) => (
    <label {...props}>{children}</label>
  ),
  TextField: ({
    children,
    onChange,
    value,
    ...props
  }: {
    children: React.ReactNode;
    className?: string;
    value?: string;
    onChange?: (value: string) => void;
  }) => (
    <div {...props} data-value={value} data-testid="text-field">
      {typeof children === "function" ? children : children}
    </div>
  ),
  TextArea: ({
    onChange,
    ...props
  }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  }) => <textarea onChange={onChange} {...props} />,
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

import { ConfirmActionModal } from "@/app/characters/[id]/contacts/components/ConfirmActionModal";

describe("ConfirmActionModal", () => {
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
    title: "Delete Contact",
    description: "Are you sure?",
    confirmLabel: "Delete",
  };

  it("renders title and description when open", () => {
    render(<ConfirmActionModal {...defaultProps} />);

    expect(screen.getByText("Delete Contact")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(<ConfirmActionModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByTestId("modal-overlay")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete Contact")).not.toBeInTheDocument();
  });

  it("renders confirm and cancel buttons", () => {
    render(<ConfirmActionModal {...defaultProps} />);

    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("calls onConfirm when confirm button is pressed", async () => {
    const user = userEvent.setup();
    render(<ConfirmActionModal {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onConfirm).toHaveBeenCalledWith(undefined);
  });

  it("calls onClose when cancel button is pressed", async () => {
    const user = userEvent.setup();
    render(<ConfirmActionModal {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("shows confirming label while submitting", async () => {
    // Make onConfirm hang to test submitting state
    let resolveConfirm: () => void;
    onConfirm.mockReturnValue(
      new Promise<void>((r) => {
        resolveConfirm = r;
      })
    );

    const user = userEvent.setup();
    render(<ConfirmActionModal {...defaultProps} confirmingLabel="Deleting..." />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(screen.getByRole("button", { name: "Deleting..." })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Deleting..." })).toBeDisabled();

    resolveConfirm!();
  });

  it("shows default confirming label when confirmingLabel is not provided", async () => {
    let resolveConfirm: () => void;
    onConfirm.mockReturnValue(
      new Promise<void>((r) => {
        resolveConfirm = r;
      })
    );

    const user = userEvent.setup();
    render(<ConfirmActionModal {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(screen.getByRole("button", { name: "Processing..." })).toBeInTheDocument();

    resolveConfirm!();
  });

  it("displays error when onConfirm rejects", async () => {
    onConfirm.mockRejectedValue(new Error("Server error"));

    const user = userEvent.setup();
    render(<ConfirmActionModal {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(screen.getByText("Server error")).toBeInTheDocument();
  });

  it("renders reason text field when reasonField is provided", () => {
    render(
      <ConfirmActionModal
        {...defaultProps}
        reasonField={{
          label: "Reason",
          placeholder: "Why?",
        }}
      />
    );

    expect(screen.getByText("Reason")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Why?")).toBeInTheDocument();
  });

  it("does not render reason text field when reasonField is omitted", () => {
    render(<ConfirmActionModal {...defaultProps} />);

    expect(screen.queryByTestId("text-field")).not.toBeInTheDocument();
  });

  it("shows required indicator when reasonField.required is true", () => {
    render(
      <ConfirmActionModal
        {...defaultProps}
        reasonField={{
          label: "Reason",
          required: true,
        }}
      />
    );

    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("calls onClose after successful confirmation", async () => {
    const user = userEvent.setup();
    render(<ConfirmActionModal {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not call onClose when confirmation fails", async () => {
    onConfirm.mockRejectedValue(new Error("Failed"));

    const user = userEvent.setup();
    render(<ConfirmActionModal {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(onClose).not.toHaveBeenCalled();
  });
});
