import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { SocialContact } from "@/lib/types";
import { ContactCard } from "@/app/characters/[id]/contacts/components/ContactCard";

vi.mock("react-aria-components", () => ({
  Link: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  Button: ({
    children,
    onPress,
    ...props
  }: {
    children: React.ReactNode;
    onPress?: () => void;
    className?: string;
  }) => (
    <button onClick={onPress} {...props}>
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
        background: "bg-bg",
        card: "bg-card",
        border: "border-b",
        accent: "text-accent",
        accentBg: "bg-accent",
        muted: "text-muted",
        heading: "text-heading",
      },
      fonts: { heading: "font-h", body: "font-b", mono: "font-m" },
      components: {
        section: { wrapper: "sec-w", header: "sec-h", title: "sec-t", cornerAccent: false },
        card: { wrapper: "card-w", hover: "card-h", border: "card-b" },
        badge: { positive: "badge-p", negative: "badge-n", neutral: "badge-x" },
      },
    },
  },
  DEFAULT_THEME: "neon-rain",
}));

const makeContact = (overrides: Partial<SocialContact> = {}): SocialContact => ({
  id: "cnt-test",
  characterId: "char-1",
  name: "Test Contact",
  connection: 4,
  loyalty: 3,
  archetype: "Fixer",
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
  createdAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

describe("ContactCard", () => {
  describe("basic rendering", () => {
    it("renders contact name", () => {
      render(<ContactCard characterId="char-1" contact={makeContact()} />);
      expect(screen.getByText("Test Contact")).toBeInTheDocument();
    });

    it("renders contact archetype", () => {
      render(<ContactCard characterId="char-1" contact={makeContact()} />);
      expect(screen.getByText("Fixer")).toBeInTheDocument();
    });

    it("renders contact connection rating", () => {
      render(<ContactCard characterId="char-1" contact={makeContact({ connection: 4 })} />);
      expect(screen.getByText("4")).toBeInTheDocument();
    });

    it("renders contact loyalty rating", () => {
      render(<ContactCard characterId="char-1" contact={makeContact({ loyalty: 3 })} />);
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  describe("relationship quality badges", () => {
    it("shows Blackmail badge when relationshipQualities includes blackmail", () => {
      render(
        <ContactCard
          characterId="char-1"
          contact={makeContact({ relationshipQualities: ["blackmail"] })}
        />
      );
      expect(screen.getByText(/blackmail/i)).toBeInTheDocument();
    });

    it("shows Family badge when relationshipQualities includes family", () => {
      render(
        <ContactCard
          characterId="char-1"
          contact={makeContact({ relationshipQualities: ["family"] })}
        />
      );
      expect(screen.getByText(/family/i)).toBeInTheDocument();
    });

    it("does not show Blackmail badge when not in relationshipQualities", () => {
      render(
        <ContactCard characterId="char-1" contact={makeContact({ relationshipQualities: [] })} />
      );
      expect(screen.queryByText(/blackmail/i)).not.toBeInTheDocument();
    });

    it("does not show Family badge when not in relationshipQualities", () => {
      render(
        <ContactCard characterId="char-1" contact={makeContact({ relationshipQualities: [] })} />
      );
      expect(screen.queryByText(/family/i)).not.toBeInTheDocument();
    });
  });

  describe("group badge", () => {
    it("shows Org badge when group is organization", () => {
      render(<ContactCard characterId="char-1" contact={makeContact({ group: "organization" })} />);
      expect(screen.getByText(/org/i)).toBeInTheDocument();
    });

    it("does not show Org badge when group is personal", () => {
      render(<ContactCard characterId="char-1" contact={makeContact({ group: "personal" })} />);
      expect(screen.queryByText(/org/i)).not.toBeInTheDocument();
    });
  });

  describe("pending karma confirmation badge", () => {
    it("shows Pending badge when pendingKarmaConfirmation is true", () => {
      render(
        <ContactCard
          characterId="char-1"
          contact={makeContact({ pendingKarmaConfirmation: true })}
        />
      );
      expect(screen.getByText(/pending/i)).toBeInTheDocument();
    });

    it("does not show Pending badge when pendingKarmaConfirmation is false", () => {
      render(
        <ContactCard
          characterId="char-1"
          contact={makeContact({ pendingKarmaConfirmation: false })}
        />
      );
      expect(screen.queryByText(/pending/i)).not.toBeInTheDocument();
    });

    it("does not show Pending badge when pendingKarmaConfirmation is not set", () => {
      render(<ContactCard characterId="char-1" contact={makeContact()} />);
      expect(screen.queryByText(/pending/i)).not.toBeInTheDocument();
    });
  });

  describe("chip balance display", () => {
    it("shows chip count when favorBalance is positive", () => {
      render(<ContactCard characterId="char-1" contact={makeContact({ favorBalance: 3 })} />);
      expect(screen.getByText(/3 chips/i)).toBeInTheDocument();
    });

    it("shows chip count when favorBalance is negative", () => {
      render(<ContactCard characterId="char-1" contact={makeContact({ favorBalance: -3 })} />);
      expect(screen.getByText(/3 chips/i)).toBeInTheDocument();
    });

    it("shows singular chip for favorBalance of 1", () => {
      render(<ContactCard characterId="char-1" contact={makeContact({ favorBalance: 1 })} />);
      expect(screen.getByText(/1 chip/i)).toBeInTheDocument();
      expect(screen.queryByText(/1 chips/i)).not.toBeInTheDocument();
    });

    it("shows singular chip for favorBalance of -1", () => {
      render(<ContactCard characterId="char-1" contact={makeContact({ favorBalance: -1 })} />);
      expect(screen.getByText(/1 chip/i)).toBeInTheDocument();
      expect(screen.queryByText(/1 chips/i)).not.toBeInTheDocument();
    });

    it("does not show chip count when favorBalance is 0", () => {
      render(<ContactCard characterId="char-1" contact={makeContact({ favorBalance: 0 })} />);
      expect(screen.queryByText(/chip/i)).not.toBeInTheDocument();
    });
  });

  describe("confirm edge button", () => {
    it("shows Confirm button when pendingKarmaConfirmation is true and onConfirmEdge is provided", () => {
      const onConfirmEdge = vi.fn();
      render(
        <ContactCard
          characterId="char-1"
          contact={makeContact({ pendingKarmaConfirmation: true })}
          onConfirmEdge={onConfirmEdge}
        />
      );
      expect(screen.getByRole("button", { name: /confirm/i })).toBeInTheDocument();
    });

    it("does not show Confirm button when not pending", () => {
      const onConfirmEdge = vi.fn();
      render(
        <ContactCard
          characterId="char-1"
          contact={makeContact({ pendingKarmaConfirmation: false })}
          onConfirmEdge={onConfirmEdge}
        />
      );
      expect(screen.queryByRole("button", { name: /confirm/i })).not.toBeInTheDocument();
    });

    it("does not show Confirm button when pending but onConfirmEdge is not provided", () => {
      render(
        <ContactCard
          characterId="char-1"
          contact={makeContact({ pendingKarmaConfirmation: true })}
        />
      );
      expect(screen.queryByRole("button", { name: /confirm/i })).not.toBeInTheDocument();
    });

    it("calls onConfirmEdge when Confirm button is clicked", async () => {
      const user = userEvent.setup();
      const onConfirmEdge = vi.fn();
      render(
        <ContactCard
          characterId="char-1"
          contact={makeContact({ pendingKarmaConfirmation: true })}
          onConfirmEdge={onConfirmEdge}
        />
      );
      await user.click(screen.getByRole("button", { name: /confirm/i }));
      expect(onConfirmEdge).toHaveBeenCalledTimes(1);
    });
  });

  describe("burned contacts", () => {
    it("does not show actions for burned contacts", () => {
      const onConfirmEdge = vi.fn();
      render(
        <ContactCard
          contact={makeContact({
            status: "burned",
            pendingKarmaConfirmation: true,
          })}
          characterId="char-1"
          onConfirmEdge={onConfirmEdge}
        />
      );
      expect(screen.queryByRole("button", { name: /confirm/i })).not.toBeInTheDocument();
    });

    it("does not show actions for inactive contacts", () => {
      const onConfirmEdge = vi.fn();
      render(
        <ContactCard
          contact={makeContact({
            status: "inactive",
            pendingKarmaConfirmation: true,
          })}
          characterId="char-1"
          onConfirmEdge={onConfirmEdge}
        />
      );
      expect(screen.queryByRole("button", { name: /confirm/i })).not.toBeInTheDocument();
    });
  });
});
