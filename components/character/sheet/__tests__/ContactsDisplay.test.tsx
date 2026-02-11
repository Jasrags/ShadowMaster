/**
 * ContactsDisplay Component Tests
 *
 * Tests the contacts network display. Shows first 5 contacts
 * with connection/loyalty ratings. Shows "+N more" link when >5.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { createSheetCharacter, MOCK_CONTACTS } from "./test-helpers";

vi.mock("../DisplayCard", () => ({
  DisplayCard: ({
    title,
    children,
    headerAction,
  }: {
    title: string;
    children: React.ReactNode;
    headerAction?: React.ReactNode;
  }) => (
    <div data-testid="display-card">
      <h2>{title}</h2>
      {headerAction}
      {children}
    </div>
  ),
}));

vi.mock("lucide-react", () => ({
  Activity: (props: Record<string, unknown>) => <span data-testid="icon-Activity" {...props} />,
  Shield: (props: Record<string, unknown>) => <span data-testid="icon-Shield" {...props} />,
  Heart: (props: Record<string, unknown>) => <span data-testid="icon-Heart" {...props} />,
  Brain: (props: Record<string, unknown>) => <span data-testid="icon-Brain" {...props} />,
  Footprints: (props: Record<string, unknown>) => <span data-testid="icon-Footprints" {...props} />,
  ShieldCheck: (props: Record<string, unknown>) => (
    <span data-testid="icon-ShieldCheck" {...props} />
  ),
  BarChart3: (props: Record<string, unknown>) => <span data-testid="icon-BarChart3" {...props} />,
  Crosshair: (props: Record<string, unknown>) => <span data-testid="icon-Crosshair" {...props} />,
  Swords: (props: Record<string, unknown>) => <span data-testid="icon-Swords" {...props} />,
  Package: (props: Record<string, unknown>) => <span data-testid="icon-Package" {...props} />,
  Pill: (props: Record<string, unknown>) => <span data-testid="icon-Pill" {...props} />,
  Sparkles: (props: Record<string, unknown>) => <span data-testid="icon-Sparkles" {...props} />,
  Braces: (props: Record<string, unknown>) => <span data-testid="icon-Braces" {...props} />,
  Cpu: (props: Record<string, unknown>) => <span data-testid="icon-Cpu" {...props} />,
  BookOpen: (props: Record<string, unknown>) => <span data-testid="icon-BookOpen" {...props} />,
  Users: (props: Record<string, unknown>) => <span data-testid="icon-Users" {...props} />,
  Fingerprint: (props: Record<string, unknown>) => (
    <span data-testid="icon-Fingerprint" {...props} />
  ),
  Zap: (props: Record<string, unknown>) => <span data-testid="icon-Zap" {...props} />,
  Car: (props: Record<string, unknown>) => <span data-testid="icon-Car" {...props} />,
  Home: (props: Record<string, unknown>) => <span data-testid="icon-Home" {...props} />,
}));

vi.mock("react-aria-components", () => ({
  Link: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

import { ContactsDisplay } from "../ContactsDisplay";

describe("ContactsDisplay", () => {
  it("renders no contacts message when contacts is empty", () => {
    const character = createSheetCharacter({ contacts: [] });
    render(<ContactsDisplay character={character} />);
    expect(screen.getByText("No contacts established")).toBeInTheDocument();
  });

  it("renders no contacts message when contacts is undefined", () => {
    const character = createSheetCharacter({ contacts: undefined });
    render(<ContactsDisplay character={character} />);
    expect(screen.getByText("No contacts established")).toBeInTheDocument();
  });

  it("renders contact count", () => {
    const character = createSheetCharacter({ contacts: MOCK_CONTACTS.slice(0, 3) });
    render(<ContactsDisplay character={character} />);
    expect(screen.getByText("3 contacts in network")).toBeInTheDocument();
  });

  it("renders contact name", () => {
    const character = createSheetCharacter({
      contacts: [{ name: "Street Doc", type: "Medical", connection: 3, loyalty: 4 }],
    });
    render(<ContactsDisplay character={character} />);
    expect(screen.getByText("Street Doc")).toBeInTheDocument();
  });

  it("renders contact type", () => {
    const character = createSheetCharacter({
      contacts: [{ name: "Fixer", type: "Fixer", connection: 4, loyalty: 3 }],
    });
    render(<ContactsDisplay character={character} />);
    // The type appears separately from the name
    const typeElements = screen.getAllByText("Fixer");
    expect(typeElements.length).toBeGreaterThanOrEqual(1);
  });

  it("renders connection rating", () => {
    const character = createSheetCharacter({
      contacts: [{ name: "Fixer", type: "Fixer", connection: 4, loyalty: 3 }],
    });
    render(<ContactsDisplay character={character} />);
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("renders loyalty rating", () => {
    const character = createSheetCharacter({
      contacts: [{ name: "Fixer", type: "Fixer", connection: 4, loyalty: 3 }],
    });
    render(<ContactsDisplay character={character} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders only first 5 contacts", () => {
    const character = createSheetCharacter({ contacts: MOCK_CONTACTS });
    render(<ContactsDisplay character={character} />);
    // First 5 should be visible
    expect(screen.getByText("Bartender")).toBeInTheDocument();
    expect(screen.getByText("Gang Leader")).toBeInTheDocument();
    expect(screen.getByText("Corp Wage Slave")).toBeInTheDocument();
    // 6th should not be rendered directly
    expect(screen.queryByText("Talismonger")).not.toBeInTheDocument();
  });

  it("shows +N more link when more than 5 contacts", () => {
    const character = createSheetCharacter({ id: "char-123", contacts: MOCK_CONTACTS });
    render(<ContactsDisplay character={character} />);
    expect(screen.getByText("+1 more contacts...")).toBeInTheDocument();
  });

  it("links +N more to contacts management page", () => {
    const character = createSheetCharacter({ id: "char-123", contacts: MOCK_CONTACTS });
    render(<ContactsDisplay character={character} />);
    const moreLink = screen.getByText("+1 more contacts...");
    expect(moreLink.closest("a")).toHaveAttribute("href", "/characters/char-123/contacts");
  });

  it("does not show +N more when 5 or fewer contacts", () => {
    const character = createSheetCharacter({ contacts: MOCK_CONTACTS.slice(0, 5) });
    render(<ContactsDisplay character={character} />);
    expect(screen.queryByText(/more contacts/)).not.toBeInTheDocument();
  });

  it("renders Manage link in header", () => {
    const character = createSheetCharacter({ id: "char-123" });
    render(<ContactsDisplay character={character} />);
    const manageLink = screen.getByText("Manage →");
    expect(manageLink.closest("a")).toHaveAttribute("href", "/characters/char-123/contacts");
  });
});
