/**
 * KnowledgeLanguagesDisplay Component Tests
 *
 * Tests the knowledge skills and languages display.
 * Shows empty state, knowledge skills table with category/rating,
 * native language badges, and onSelect callback.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createSheetCharacter } from "./test-helpers";

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

import { KnowledgeLanguagesDisplay } from "../KnowledgeLanguagesDisplay";

describe("KnowledgeLanguagesDisplay", () => {
  it("renders empty state when no knowledge skills or languages", () => {
    const character = createSheetCharacter({ knowledgeSkills: [], languages: [] });
    render(<KnowledgeLanguagesDisplay character={character} />);
    expect(screen.getByText("No knowledge skills or languages")).toBeInTheDocument();
  });

  it("renders knowledge skill name", () => {
    const character = createSheetCharacter({
      knowledgeSkills: [{ name: "Security Design", category: "professional", rating: 4 }],
    });
    render(<KnowledgeLanguagesDisplay character={character} />);
    expect(screen.getByText("Security Design")).toBeInTheDocument();
  });

  it("renders knowledge skill category", () => {
    const character = createSheetCharacter({
      knowledgeSkills: [{ name: "Security Design", category: "professional", rating: 4 }],
    });
    render(<KnowledgeLanguagesDisplay character={character} />);
    expect(screen.getByText("professional")).toBeInTheDocument();
  });

  it("renders knowledge skill rating in brackets", () => {
    const character = createSheetCharacter({
      knowledgeSkills: [{ name: "Security Design", category: "professional", rating: 4 }],
    });
    render(<KnowledgeLanguagesDisplay character={character} />);
    expect(screen.getByText("[4]")).toBeInTheDocument();
  });

  it("renders native language with (N) marker", () => {
    const character = createSheetCharacter({
      languages: [{ name: "English", rating: 0, isNative: true }],
    });
    render(<KnowledgeLanguagesDisplay character={character} />);
    expect(screen.getByText("English (N)")).toBeInTheDocument();
  });

  it("renders non-native language with rating", () => {
    const character = createSheetCharacter({
      languages: [{ name: "Japanese", rating: 3, isNative: false }],
    });
    render(<KnowledgeLanguagesDisplay character={character} />);
    expect(screen.getByText("Japanese (3)")).toBeInTheDocument();
  });

  it("renders native language with green styling", () => {
    const character = createSheetCharacter({
      languages: [{ name: "English", rating: 0, isNative: true }],
    });
    render(<KnowledgeLanguagesDisplay character={character} />);
    const badge = screen.getByText("English (N)");
    expect(badge.className).toContain("emerald");
  });

  it("calls onSelect for knowledge skill clicks", () => {
    const onSelect = vi.fn();
    const character = createSheetCharacter({
      knowledgeSkills: [{ name: "Security Design", category: "professional", rating: 4 }],
    });
    render(<KnowledgeLanguagesDisplay character={character} onSelect={onSelect} />);

    fireEvent.click(screen.getByText("Security Design"));
    expect(onSelect).toHaveBeenCalledWith(4, "Security Design");
  });

  it("calls onSelect for non-native language clicks", () => {
    const onSelect = vi.fn();
    const character = createSheetCharacter({
      languages: [{ name: "Japanese", rating: 3, isNative: false }],
    });
    render(<KnowledgeLanguagesDisplay character={character} onSelect={onSelect} />);

    fireEvent.click(screen.getByText("Japanese (3)"));
    expect(onSelect).toHaveBeenCalledWith(3, "Japanese");
  });

  it("does not call onSelect for native language clicks", () => {
    const onSelect = vi.fn();
    const character = createSheetCharacter({
      languages: [{ name: "English", rating: 0, isNative: true }],
    });
    render(<KnowledgeLanguagesDisplay character={character} onSelect={onSelect} />);

    fireEvent.click(screen.getByText("English (N)"));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("renders table headers for knowledge skills", () => {
    const character = createSheetCharacter({
      knowledgeSkills: [{ name: "Security Design", category: "professional", rating: 4 }],
    });
    render(<KnowledgeLanguagesDisplay character={character} />);
    expect(screen.getByText("Knowledge Skill")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Rating")).toBeInTheDocument();
  });

  it("renders Languages label", () => {
    const character = createSheetCharacter({
      languages: [{ name: "English", rating: 0, isNative: true }],
    });
    render(<KnowledgeLanguagesDisplay character={character} />);
    expect(screen.getByText("Languages:")).toBeInTheDocument();
  });
});
