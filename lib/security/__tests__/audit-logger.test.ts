import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AuditLogger, SecurityEvent } from "../audit-logger";

// Use vi.hoisted to create mocks that are available when vi.mock is hoisted
const mocks = vi.hoisted(() => ({
  mkdir: vi.fn().mockResolvedValue(undefined),
  appendFile: vi.fn().mockResolvedValue(undefined),
}));

// Mock fs.promises using dynamic import pattern
vi.mock("fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("fs")>();
  return {
    ...actual,
    default: {
      ...actual,
      promises: {
        ...actual.promises,
        mkdir: mocks.mkdir,
        appendFile: mocks.appendFile,
      },
    },
    promises: {
      ...actual.promises,
      mkdir: mocks.mkdir,
      appendFile: mocks.appendFile,
    },
  };
});

describe("AuditLogger", () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  const fixedDate = new Date("2024-06-15T10:30:00.000Z");

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("creates logs directory with recursive option", async () => {
    await AuditLogger.log({
      event: "signin.success",
      userId: "user-123",
    });

    expect(mocks.mkdir).toHaveBeenCalledWith(expect.stringContaining("data/security/logs"), {
      recursive: true,
    });
  });

  it("writes to daily log file with correct date format", async () => {
    await AuditLogger.log({
      event: "signin.success",
      userId: "user-123",
    });

    expect(mocks.appendFile).toHaveBeenCalledWith(
      expect.stringContaining("2024-06-15.jsonl"),
      expect.any(String),
      "utf-8"
    );
  });

  it("adds ISO timestamp to record", async () => {
    await AuditLogger.log({
      event: "signin.success",
      userId: "user-123",
    });

    const writtenContent = mocks.appendFile.mock.calls[0][1] as string;
    const parsedRecord = JSON.parse(writtenContent.trim());

    expect(parsedRecord.timestamp).toBe("2024-06-15T10:30:00.000Z");
  });

  it("writes valid JSON with newline", async () => {
    await AuditLogger.log({
      event: "signin.success",
      userId: "user-123",
    });

    const writtenContent = mocks.appendFile.mock.calls[0][1] as string;

    // Should end with newline
    expect(writtenContent.endsWith("\n")).toBe(true);

    // Should be valid JSON (without the newline)
    expect(() => JSON.parse(writtenContent.trim())).not.toThrow();
  });

  describe("event types", () => {
    const eventTypes: SecurityEvent[] = [
      "signin.success",
      "signin.failure",
      "signup.success",
      "lockout.triggered",
      "lockout.expired",
      "password.change",
    ];

    eventTypes.forEach((event) => {
      it(`handles ${event} event`, async () => {
        await AuditLogger.log({
          event,
          userId: "user-123",
        });

        const writtenContent = mocks.appendFile.mock.calls[0][1] as string;
        const parsedRecord = JSON.parse(writtenContent.trim());

        expect(parsedRecord.event).toBe(event);
      });
    });
  });

  describe("optional fields", () => {
    it("preserves userId", async () => {
      await AuditLogger.log({
        event: "signin.success",
        userId: "user-123",
      });

      const writtenContent = mocks.appendFile.mock.calls[0][1] as string;
      const parsedRecord = JSON.parse(writtenContent.trim());

      expect(parsedRecord.userId).toBe("user-123");
    });

    it("preserves email", async () => {
      await AuditLogger.log({
        event: "signin.failure",
        email: "test@example.com",
      });

      const writtenContent = mocks.appendFile.mock.calls[0][1] as string;
      const parsedRecord = JSON.parse(writtenContent.trim());

      expect(parsedRecord.email).toBe("test@example.com");
    });

    it("preserves ip", async () => {
      await AuditLogger.log({
        event: "signin.success",
        userId: "user-123",
        ip: "192.168.1.1",
      });

      const writtenContent = mocks.appendFile.mock.calls[0][1] as string;
      const parsedRecord = JSON.parse(writtenContent.trim());

      expect(parsedRecord.ip).toBe("192.168.1.1");
    });

    it("preserves metadata", async () => {
      const metadata = {
        attemptNumber: 3,
        browser: "Chrome",
        success: true,
        previousLogin: null,
      };

      await AuditLogger.log({
        event: "signin.success",
        userId: "user-123",
        metadata,
      });

      const writtenContent = mocks.appendFile.mock.calls[0][1] as string;
      const parsedRecord = JSON.parse(writtenContent.trim());

      expect(parsedRecord.metadata).toEqual(metadata);
    });

    it("handles record with all optional fields", async () => {
      await AuditLogger.log({
        event: "signin.success",
        userId: "user-123",
        email: "test@example.com",
        ip: "192.168.1.1",
        metadata: { source: "web" },
      });

      const writtenContent = mocks.appendFile.mock.calls[0][1] as string;
      const parsedRecord = JSON.parse(writtenContent.trim());

      expect(parsedRecord.userId).toBe("user-123");
      expect(parsedRecord.email).toBe("test@example.com");
      expect(parsedRecord.ip).toBe("192.168.1.1");
      expect(parsedRecord.metadata).toEqual({ source: "web" });
    });
  });

  describe("console logging", () => {
    it("logs event with userId", async () => {
      await AuditLogger.log({
        event: "signin.success",
        userId: "user-123",
      });

      expect(consoleLogSpy).toHaveBeenCalledWith("[AuditLog] signin.success: user-123");
    });

    it("logs event with email when no userId", async () => {
      await AuditLogger.log({
        event: "signin.failure",
        email: "test@example.com",
      });

      expect(consoleLogSpy).toHaveBeenCalledWith("[AuditLog] signin.failure: test@example.com");
    });

    it("logs event with ip when no userId or email", async () => {
      await AuditLogger.log({
        event: "signin.failure",
        ip: "192.168.1.1",
      });

      expect(consoleLogSpy).toHaveBeenCalledWith("[AuditLog] signin.failure: 192.168.1.1");
    });
  });

  describe("error handling", () => {
    it("catches and logs fs mkdir error without throwing", async () => {
      const error = new Error("Permission denied");
      mocks.mkdir.mockRejectedValueOnce(error);

      // Should not throw
      await expect(
        AuditLogger.log({
          event: "signin.success",
          userId: "user-123",
        })
      ).resolves.not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to write to audit log:", error);
    });

    it("catches and logs fs appendFile error without throwing", async () => {
      const error = new Error("Disk full");
      mocks.appendFile.mockRejectedValueOnce(error);

      // Should not throw
      await expect(
        AuditLogger.log({
          event: "signin.success",
          userId: "user-123",
        })
      ).resolves.not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to write to audit log:", error);
    });
  });
});
