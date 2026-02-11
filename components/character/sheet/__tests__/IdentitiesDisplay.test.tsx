/**
 * IdentitiesDisplay Component Tests
 *
 * Tests the identities & SINs display. Returns null when no identities.
 * Shows real vs fake SIN badges, license badges, and notes.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { createSheetCharacter, MOCK_IDENTITY_FAKE, MOCK_IDENTITY_REAL } from "./test-helpers";

vi.mock("../DisplayCard", () => ({
  DisplayCard: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div data-testid="display-card">
      <h2>{title}</h2>
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

import { IdentitiesDisplay } from "../IdentitiesDisplay";

describe("IdentitiesDisplay", () => {
  it("returns null when no identities", () => {
    const character = createSheetCharacter({ identities: [] });
    const { container } = render(<IdentitiesDisplay character={character} />);
    expect(container.innerHTML).toBe("");
  });

  it("returns null when identities is undefined", () => {
    const character = createSheetCharacter({ identities: undefined });
    const { container } = render(<IdentitiesDisplay character={character} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders identity name", () => {
    const character = createSheetCharacter({ identities: [MOCK_IDENTITY_FAKE] });
    render(<IdentitiesDisplay character={character} />);
    expect(screen.getByText("John Smith")).toBeInTheDocument();
  });

  it("renders fake SIN badge with rating", () => {
    const character = createSheetCharacter({ identities: [MOCK_IDENTITY_FAKE] });
    render(<IdentitiesDisplay character={character} />);
    expect(screen.getByText("Fake SIN R4")).toBeInTheDocument();
  });

  it("renders fake SIN with violet styling", () => {
    const character = createSheetCharacter({ identities: [MOCK_IDENTITY_FAKE] });
    render(<IdentitiesDisplay character={character} />);
    const badge = screen.getByText("Fake SIN R4");
    expect(badge.className).toContain("violet");
  });

  it("renders real SIN badge with sinner quality", () => {
    const character = createSheetCharacter({ identities: [MOCK_IDENTITY_REAL] });
    render(<IdentitiesDisplay character={character} />);
    expect(screen.getByText("Real SIN (national)")).toBeInTheDocument();
  });

  it("renders real SIN with amber styling", () => {
    const character = createSheetCharacter({ identities: [MOCK_IDENTITY_REAL] });
    render(<IdentitiesDisplay character={character} />);
    const badge = screen.getByText("Real SIN (national)");
    expect(badge.className).toContain("amber");
  });

  it("renders license badges", () => {
    const character = createSheetCharacter({ identities: [MOCK_IDENTITY_FAKE] });
    render(<IdentitiesDisplay character={character} />);
    expect(screen.getByText("Firearms License R4")).toBeInTheDocument();
    expect(screen.getByText("Driver's License R4")).toBeInTheDocument();
  });

  it("does not render licenses section when no licenses", () => {
    const character = createSheetCharacter({ identities: [MOCK_IDENTITY_REAL] });
    render(<IdentitiesDisplay character={character} />);
    expect(screen.queryByText(/License/)).not.toBeInTheDocument();
  });

  it("renders notes when present", () => {
    const character = createSheetCharacter({ identities: [MOCK_IDENTITY_FAKE] });
    render(<IdentitiesDisplay character={character} />);
    expect(screen.getByText("Primary fake ID")).toBeInTheDocument();
  });

  it("renders multiple identities", () => {
    const character = createSheetCharacter({
      identities: [MOCK_IDENTITY_FAKE, MOCK_IDENTITY_REAL],
    });
    render(<IdentitiesDisplay character={character} />);
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });
});
