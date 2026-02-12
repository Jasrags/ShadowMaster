/**
 * KnowledgeLanguagesDisplay Component Tests
 *
 * Tests the knowledge skills and languages display.
 * Uses grouped sunken sections with value pills, category subtitles,
 * specialization amber pills, and native emerald pills.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createSheetCharacter, setupDisplayCardMock, LUCIDE_MOCK } from "./test-helpers";

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

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

  it("renders knowledge skill rating as value pill", () => {
    const character = createSheetCharacter({
      knowledgeSkills: [{ name: "Security Design", category: "professional", rating: 4 }],
    });
    render(<KnowledgeLanguagesDisplay character={character} />);
    const pill = screen.getAllByTestId("rating-pill")[0];
    expect(pill).toHaveTextContent("4");
    expect(screen.queryByText("[4]")).not.toBeInTheDocument();
  });

  it("renders native language name with emerald N pill", () => {
    const character = createSheetCharacter({
      languages: [{ name: "English", rating: 0, isNative: true }],
    });
    render(<KnowledgeLanguagesDisplay character={character} />);
    expect(screen.getByText("English")).toBeInTheDocument();
    const nativePill = screen.getByTestId("native-pill");
    expect(nativePill).toHaveTextContent("N");
    expect(nativePill.className).toContain("emerald");
  });

  it("renders non-native language name with rating pill", () => {
    const character = createSheetCharacter({
      languages: [{ name: "Japanese", rating: 3, isNative: false }],
    });
    render(<KnowledgeLanguagesDisplay character={character} />);
    expect(screen.getByText("Japanese")).toBeInTheDocument();
    const pill = screen.getByTestId("rating-pill");
    expect(pill).toHaveTextContent("3");
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

    fireEvent.click(screen.getByText("Japanese"));
    expect(onSelect).toHaveBeenCalledWith(3, "Japanese");
  });

  it("does not call onSelect for native language clicks", () => {
    const onSelect = vi.fn();
    const character = createSheetCharacter({
      languages: [{ name: "English", rating: 0, isNative: true }],
    });
    render(<KnowledgeLanguagesDisplay character={character} onSelect={onSelect} />);

    fireEvent.click(screen.getByText("English"));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("renders Knowledge and Languages section headers", () => {
    const character = createSheetCharacter({
      knowledgeSkills: [{ name: "Security Design", category: "professional", rating: 4 }],
      languages: [{ name: "English", rating: 0, isNative: true }],
    });
    render(<KnowledgeLanguagesDisplay character={character} />);
    expect(screen.getByText("Knowledge")).toBeInTheDocument();
    expect(screen.getByText("Languages")).toBeInTheDocument();
  });

  it("hides Knowledge section when no knowledge skills", () => {
    const character = createSheetCharacter({
      knowledgeSkills: [],
      languages: [{ name: "English", rating: 0, isNative: true }],
    });
    render(<KnowledgeLanguagesDisplay character={character} />);
    expect(screen.queryByText("Knowledge")).not.toBeInTheDocument();
    expect(screen.getByText("Languages")).toBeInTheDocument();
  });

  it("sorts knowledge skills by rating descending", () => {
    const character = createSheetCharacter({
      knowledgeSkills: [
        { name: "History", category: "academic", rating: 2 },
        { name: "Security Design", category: "professional", rating: 5 },
        { name: "Street Rumors", category: "street", rating: 3 },
      ],
    });
    render(<KnowledgeLanguagesDisplay character={character} />);
    const pills = screen.getAllByTestId("rating-pill");
    expect(pills[0]).toHaveTextContent("5");
    expect(pills[1]).toHaveTextContent("3");
    expect(pills[2]).toHaveTextContent("2");
  });

  it("renders specialization as amber pill when present", () => {
    const character = createSheetCharacter({
      knowledgeSkills: [
        {
          name: "Security Design",
          category: "professional",
          rating: 4,
          specialization: "Maglocks",
        },
      ],
    });
    render(<KnowledgeLanguagesDisplay character={character} />);
    const specPill = screen.getByTestId("specialization-pill");
    expect(specPill).toHaveTextContent("Maglocks");
    expect(specPill.className).toContain("amber");
  });

  it("does not render specialization when absent", () => {
    const character = createSheetCharacter({
      knowledgeSkills: [{ name: "Security Design", category: "professional", rating: 4 }],
    });
    render(<KnowledgeLanguagesDisplay character={character} />);
    expect(screen.queryByTestId("specialization-pill")).not.toBeInTheDocument();
  });
});
