/**
 * MatrixMarksDisplay Component Tests
 *
 * Tests the mark management card showing marks held on targets,
 * marks received on self, and forms to place/receive marks.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { setupDisplayCardMock, LUCIDE_MOCK, createDeckerCharacter } from "./test-helpers";
import type { MarkTargetType, MatrixMark } from "@/lib/types/matrix";

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

vi.mock("@/lib/matrix", () => ({
  useMatrixMarks: vi.fn(),
  useMatrixSession: vi.fn(),
}));

vi.mock("@/lib/rules/matrix/mark-tracker", () => ({
  getAuthorizationLevel: vi.fn(),
}));

import { MatrixMarksDisplay } from "../MatrixMarksDisplay";
import { useMatrixMarks, useMatrixSession } from "@/lib/matrix";
import { getAuthorizationLevel } from "@/lib/rules/matrix/mark-tracker";

const mockUseMatrixMarks = vi.mocked(useMatrixMarks);
const mockUseMatrixSession = vi.mocked(useMatrixSession);
const mockGetAuthorizationLevel = vi.mocked(getAuthorizationLevel);

const deckerCharacter = createDeckerCharacter();

function createMockMark(overrides: Partial<MatrixMark> = {}): MatrixMark {
  return {
    id: "mark-1",
    targetId: "corp-server",
    targetType: "host" as MarkTargetType,
    targetName: "Corp Server",
    markCount: 1,
    placedAt: "2025-01-01T00:00:00.000Z",
    ...overrides,
  };
}

const mockPlaceMark = vi.fn(() => ({
  success: true,
  mark: null,
  errors: [],
  newMarkCount: 1,
}));
const mockRemoveMark = vi.fn(() => ({
  success: true,
  marksRemoved: 1,
  remainingMarks: 0,
}));
const mockClearAllMarks = vi.fn();
const mockReceiveMarkOnSelf = vi.fn();
const mockRemoveReceivedMark = vi.fn();

describe("MatrixMarksDisplay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMatrixMarks.mockReturnValue({
      marksHeld: [],
      marksReceived: [],
      getMarksOnTarget: () => 0,
      hasRequiredMarks: () => false,
    });
    mockUseMatrixSession.mockReturnValue({
      placeMark: mockPlaceMark,
      removeMark: mockRemoveMark,
      clearAllMarks: mockClearAllMarks,
      receiveMarkOnSelf: mockReceiveMarkOnSelf,
      removeReceivedMark: mockRemoveReceivedMark,
      hasMatrixHardware: true,
    } as unknown as ReturnType<typeof useMatrixSession>);
    mockGetAuthorizationLevel.mockImplementation(
      (n: number) => ["Outsider", "User", "Security", "Admin"][n] ?? "Outsider"
    );
  });

  it("renders Matrix Marks card", () => {
    render(<MatrixMarksDisplay character={deckerCharacter} />);
    expect(screen.getByText("Matrix Marks")).toBeInTheDocument();
  });

  it("returns null when no matrix hardware", () => {
    mockUseMatrixSession.mockReturnValue({
      placeMark: mockPlaceMark,
      removeMark: mockRemoveMark,
      clearAllMarks: mockClearAllMarks,
      receiveMarkOnSelf: mockReceiveMarkOnSelf,
      removeReceivedMark: mockRemoveReceivedMark,
      hasMatrixHardware: false,
    } as unknown as ReturnType<typeof useMatrixSession>);
    const { container } = render(<MatrixMarksDisplay character={deckerCharacter} />);
    expect(container.innerHTML).toBe("");
  });

  it("shows empty state when no marks held", () => {
    render(<MatrixMarksDisplay character={deckerCharacter} />);
    expect(screen.getByText("No marks placed")).toBeInTheDocument();
  });

  it("shows empty state when no marks received", () => {
    render(<MatrixMarksDisplay character={deckerCharacter} />);
    expect(screen.getByText("No marks received")).toBeInTheDocument();
  });

  it("shows marks held with target name and auth level", () => {
    mockUseMatrixMarks.mockReturnValue({
      marksHeld: [createMockMark()],
      marksReceived: [],
      getMarksOnTarget: () => 1,
      hasRequiredMarks: () => true,
    });
    render(<MatrixMarksDisplay character={deckerCharacter} />);
    expect(screen.getByText("Corp Server")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
  });

  it("shows mark count pill (N/3)", () => {
    mockUseMatrixMarks.mockReturnValue({
      marksHeld: [createMockMark({ markCount: 2 })],
      marksReceived: [],
      getMarksOnTarget: () => 2,
      hasRequiredMarks: () => true,
    });
    render(<MatrixMarksDisplay character={deckerCharacter} />);
    expect(screen.getByText("2/3")).toBeInTheDocument();
  });

  it("shows target type badge", () => {
    mockUseMatrixMarks.mockReturnValue({
      marksHeld: [createMockMark({ targetType: "host" })],
      marksReceived: [],
      getMarksOnTarget: () => 1,
      hasRequiredMarks: () => true,
    });
    render(<MatrixMarksDisplay character={deckerCharacter} />);
    expect(screen.getByText("Host")).toBeInTheDocument();
  });

  it("stepper minus button calls removeMark", () => {
    mockUseMatrixMarks.mockReturnValue({
      marksHeld: [createMockMark({ markCount: 2 })],
      marksReceived: [],
      getMarksOnTarget: () => 2,
      hasRequiredMarks: () => true,
    });
    render(<MatrixMarksDisplay character={deckerCharacter} />);
    fireEvent.click(screen.getByTitle("Remove 1 mark"));
    expect(mockRemoveMark).toHaveBeenCalledWith("corp-server", 1);
  });

  it("stepper plus button calls placeMark to increment", () => {
    mockUseMatrixMarks.mockReturnValue({
      marksHeld: [createMockMark({ markCount: 1 })],
      marksReceived: [],
      getMarksOnTarget: () => 1,
      hasRequiredMarks: () => true,
    });
    render(<MatrixMarksDisplay character={deckerCharacter} />);
    fireEvent.click(screen.getByTitle("Add 1 mark"));
    expect(mockPlaceMark).toHaveBeenCalledWith("corp-server", "host", "Corp Server", 1);
  });

  it("stepper plus button is disabled at 3 marks", () => {
    mockUseMatrixMarks.mockReturnValue({
      marksHeld: [createMockMark({ markCount: 3 })],
      marksReceived: [],
      getMarksOnTarget: () => 3,
      hasRequiredMarks: () => true,
    });
    render(<MatrixMarksDisplay character={deckerCharacter} />);
    expect(screen.getByTitle("Add 1 mark")).toBeDisabled();
  });

  it("expand mark row shows Remove All when count > 1", () => {
    mockUseMatrixMarks.mockReturnValue({
      marksHeld: [createMockMark({ markCount: 2 })],
      marksReceived: [],
      getMarksOnTarget: () => 2,
      hasRequiredMarks: () => true,
    });
    render(<MatrixMarksDisplay character={deckerCharacter} />);
    fireEvent.click(screen.getByText("Corp Server"));
    expect(screen.getByText("Remove All")).toBeInTheDocument();
  });

  it("shows marks received with source info", () => {
    mockUseMatrixMarks.mockReturnValue({
      marksHeld: [],
      marksReceived: [
        createMockMark({
          id: "recv-1",
          targetId: "enemy-decker",
          targetType: "persona",
          targetName: "Enemy Decker",
          markCount: 1,
        }),
      ],
      getMarksOnTarget: () => 0,
      hasRequiredMarks: () => false,
    });
    render(<MatrixMarksDisplay character={deckerCharacter} />);
    expect(screen.getByText("Enemy Decker")).toBeInTheDocument();
    expect(screen.getByText("Persona")).toBeInTheDocument();
  });

  it("received mark stepper plus calls receiveMarkOnSelf", () => {
    const receivedMark = createMockMark({
      id: "recv-1",
      targetId: "enemy-decker",
      targetType: "persona",
      targetName: "Enemy Decker",
      markCount: 1,
    });
    mockUseMatrixMarks.mockReturnValue({
      marksHeld: [],
      marksReceived: [receivedMark],
      getMarksOnTarget: () => 0,
      hasRequiredMarks: () => false,
    });
    render(<MatrixMarksDisplay character={deckerCharacter} />);
    fireEvent.click(screen.getByTitle("Add 1 received mark"));
    expect(mockReceiveMarkOnSelf).toHaveBeenCalledWith(
      expect.objectContaining({ targetId: "enemy-decker", markCount: 1 })
    );
  });

  it("received mark stepper minus calls removeReceivedMark", () => {
    mockUseMatrixMarks.mockReturnValue({
      marksHeld: [],
      marksReceived: [
        createMockMark({
          id: "recv-1",
          targetId: "enemy-decker",
          targetType: "persona",
          targetName: "Enemy Decker",
          markCount: 1,
        }),
      ],
      getMarksOnTarget: () => 0,
      hasRequiredMarks: () => false,
    });
    render(<MatrixMarksDisplay character={deckerCharacter} />);
    fireEvent.click(screen.getByTitle("Remove received marks"));
    expect(mockRemoveReceivedMark).toHaveBeenCalledWith("enemy-decker");
  });

  it("Place Mark form appears on button click", () => {
    render(<MatrixMarksDisplay character={deckerCharacter} />);
    fireEvent.click(screen.getByText("Place Mark"));
    expect(screen.getByPlaceholderText("Target name")).toBeInTheDocument();
  });

  it("Place Mark form calls placeMark on submit", () => {
    render(<MatrixMarksDisplay character={deckerCharacter} />);
    fireEvent.click(screen.getByText("Place Mark"));
    const input = screen.getByPlaceholderText("Target name");
    fireEvent.change(input, { target: { value: "Corp Server" } });
    fireEvent.submit(input.closest("form")!);
    expect(mockPlaceMark).toHaveBeenCalledWith("corp-server", "device", "Corp Server", 1);
  });

  it("Clear All button calls clearAllMarks", () => {
    mockUseMatrixMarks.mockReturnValue({
      marksHeld: [createMockMark()],
      marksReceived: [],
      getMarksOnTarget: () => 1,
      hasRequiredMarks: () => true,
    });
    render(<MatrixMarksDisplay character={deckerCharacter} />);
    fireEvent.click(screen.getByText("Clear All"));
    expect(mockClearAllMarks).toHaveBeenCalled();
  });
});
