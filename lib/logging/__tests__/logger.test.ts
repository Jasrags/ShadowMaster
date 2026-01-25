import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

// Mock pino to capture log calls
const mockChildFn = vi.fn().mockReturnThis();
const mockLogger = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
  fatal: vi.fn(),
  trace: vi.fn(),
  child: mockChildFn,
};

const mockPino = Object.assign(
  vi.fn(() => mockLogger),
  {
    stdTimeFunctions: {
      isoTime: () => ',"time":"2024-01-01T00:00:00.000Z"',
    },
  }
);

vi.mock("pino", () => ({
  default: mockPino,
}));

// Mock getBuildInfo
vi.mock("@/lib/env", () => ({
  getBuildInfo: vi.fn(() => ({
    env: "local",
    version: "1.0.0",
    gitSha: "abc123",
    buildDate: "2024-01-01T00:00:00.000Z",
    isDev: true,
  })),
}));

describe("Logger Module", () => {
  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
    mockPino.mockClear();
    mockChildFn.mockClear();
    // Clear environment variable overrides
    delete process.env.LOG_LEVEL;
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe("getLogger", () => {
    it("should return a singleton logger instance", async () => {
      const { getLogger, resetLogger } = await import("../logger");
      resetLogger();
      mockPino.mockClear();

      const logger1 = getLogger();
      const logger2 = getLogger();

      expect(logger1).toBe(logger2);
    });

    it("should create logger only once", async () => {
      const { getLogger, resetLogger } = await import("../logger");
      resetLogger();
      mockPino.mockClear();

      getLogger();
      getLogger();
      getLogger();

      // pino should only be called once
      expect(mockPino).toHaveBeenCalledTimes(1);
    });
  });

  describe("resetLogger", () => {
    it("should allow creating a new logger after reset", async () => {
      const { getLogger, resetLogger } = await import("../logger");
      resetLogger();
      mockPino.mockClear();

      getLogger();
      expect(mockPino).toHaveBeenCalledTimes(1);

      resetLogger();
      getLogger();
      expect(mockPino).toHaveBeenCalledTimes(2);
    });
  });

  describe("createChildLogger", () => {
    it("should create a child logger with bindings", async () => {
      const { createChildLogger, resetLogger } = await import("../logger");
      resetLogger();
      mockChildFn.mockClear();

      createChildLogger({ module: "test", userId: "user-123" });

      expect(mockChildFn).toHaveBeenCalledWith({
        module: "test",
        userId: "user-123",
      });
    });
  });

  describe("environment configuration", () => {
    it("should use debug level for local environment", async () => {
      const { getLogger, resetLogger } = await import("../logger");
      resetLogger();
      mockPino.mockClear();

      getLogger("local");

      expect(mockPino).toHaveBeenCalledWith(
        expect.objectContaining({
          level: "debug",
        })
      );
    });

    it("should respect LOG_LEVEL environment variable override", async () => {
      process.env.LOG_LEVEL = "warn";
      vi.resetModules();
      mockPino.mockClear();

      const { getLogger, resetLogger } = await import("../logger");
      resetLogger();

      getLogger();

      expect(mockPino).toHaveBeenCalledWith(
        expect.objectContaining({
          level: "warn",
        })
      );
    });
  });

  describe("redaction", () => {
    it("should configure redaction paths", async () => {
      const { getLogger, resetLogger } = await import("../logger");
      resetLogger();
      mockPino.mockClear();

      getLogger();

      expect(mockPino).toHaveBeenCalledWith(
        expect.objectContaining({
          redact: expect.objectContaining({
            censor: "[REDACTED]",
            paths: expect.arrayContaining([
              "password",
              "*.password",
              "*.*.password",
              "token",
              "*.token",
              "secret",
              "*.secret",
              "apiKey",
              "*.apiKey",
            ]),
          }),
        })
      );
    });
  });
});

describe("Child Loggers", () => {
  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
    mockPino.mockClear();
    mockChildFn.mockClear();
  });

  it("should export pre-configured child loggers", async () => {
    const childLoggers = await import("../child-loggers");

    expect(childLoggers.emailLogger).toBeDefined();
    expect(childLoggers.authLogger).toBeDefined();
    expect(childLoggers.storageLogger).toBeDefined();
    expect(childLoggers.rulesetLogger).toBeDefined();
    expect(childLoggers.securityLogger).toBeDefined();
    expect(childLoggers.combatLogger).toBeDefined();
    expect(childLoggers.apiLogger).toBeDefined();
  });

  it("should create email logger with correct module binding", async () => {
    const { resetLogger } = await import("../logger");
    resetLogger();
    mockChildFn.mockClear();

    // Import child-loggers to trigger child logger creation
    await import("../child-loggers");

    expect(mockChildFn).toHaveBeenCalledWith({ module: "email" });
  });
});

describe("Types", () => {
  it("should export REDACTED_FIELDS constant", async () => {
    const { REDACTED_FIELDS } = await import("../types");

    expect(REDACTED_FIELDS).toContain("password");
    expect(REDACTED_FIELDS).toContain("token");
    expect(REDACTED_FIELDS).toContain("secret");
    expect(REDACTED_FIELDS).toContain("apiKey");
    expect(REDACTED_FIELDS).toContain("sessionSecretHash");
  });
});
