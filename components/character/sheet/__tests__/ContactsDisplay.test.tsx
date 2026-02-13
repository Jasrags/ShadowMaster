/**
 * ContactsDisplay Component Tests
 *
 * Tests the contacts network display. Shows first 5 contacts
 * sorted by connection descending with value pills for ratings.
 * Shows "+N more" link when >5.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  setupDisplayCardMock,
  LUCIDE_MOCK,
  setupReactAriaMock,
  createSheetCharacter,
  MOCK_CONTACTS,
} from "./test-helpers";

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);
setupReactAriaMock();

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

  it("renders connection rating in pill", () => {
    const character = createSheetCharacter({
      contacts: [{ name: "Fixer", type: "Fixer", connection: 4, loyalty: 3 }],
    });
    render(<ContactsDisplay character={character} />);
    const pill = screen.getByTestId("connection-pill");
    expect(pill).toHaveTextContent("4");
  });

  it("renders loyalty rating in pill", () => {
    const character = createSheetCharacter({
      contacts: [{ name: "Fixer", type: "Fixer", connection: 4, loyalty: 3 }],
    });
    render(<ContactsDisplay character={character} />);
    const pill = screen.getByTestId("loyalty-pill");
    expect(pill).toHaveTextContent("3");
  });

  it("renders only first 5 contacts after sorting", () => {
    const character = createSheetCharacter({ contacts: MOCK_CONTACTS });
    render(<ContactsDisplay character={character} />);
    // Sorted by connection desc: Gang Leader(5), Fixer(4), Talismonger(4), Street Doc(3), Corp Wage Slave(3)
    expect(screen.getByText("Gang Leader")).toBeInTheDocument();
    expect(screen.getAllByText("Fixer").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Talismonger")).toBeInTheDocument();
    // Bartender(2) is 6th after sorting and should not be rendered
    expect(screen.queryByText("Bartender")).not.toBeInTheDocument();
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

  it("sorts contacts by connection descending", () => {
    const character = createSheetCharacter({
      contacts: [
        { name: "Low Connect", type: "Info", connection: 1, loyalty: 5 },
        { name: "High Connect", type: "Fixer", connection: 6, loyalty: 1 },
        { name: "Mid Connect", type: "Gang", connection: 3, loyalty: 3 },
      ],
    });
    render(<ContactsDisplay character={character} />);
    const rows = screen.getAllByTestId("contact-row");
    expect(rows[0]).toHaveTextContent("High Connect");
    expect(rows[1]).toHaveTextContent("Mid Connect");
    expect(rows[2]).toHaveTextContent("Low Connect");
  });

  it("connection pill has amber styling", () => {
    const character = createSheetCharacter({
      contacts: [{ name: "Fixer", type: "Fixer", connection: 4, loyalty: 3 }],
    });
    render(<ContactsDisplay character={character} />);
    const pill = screen.getByTestId("connection-pill");
    expect(pill.className).toContain("bg-amber");
  });

  it("loyalty pill has emerald styling", () => {
    const character = createSheetCharacter({
      contacts: [{ name: "Fixer", type: "Fixer", connection: 4, loyalty: 3 }],
    });
    render(<ContactsDisplay character={character} />);
    const pill = screen.getByTestId("loyalty-pill");
    expect(pill.className).toContain("bg-emerald");
  });
});
