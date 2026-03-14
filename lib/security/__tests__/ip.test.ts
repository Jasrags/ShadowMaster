import { describe, expect, it } from "vitest";
import { getClientIp } from "@/lib/security/ip";
import { NextRequest } from "next/server";

function makeRequest(headers: Record<string, string> = {}): NextRequest {
  const req = new NextRequest("http://localhost:3000/api/test", {
    headers,
  });
  return req;
}

describe("getClientIp", () => {
  it("returns a single x-forwarded-for IP", () => {
    const req = makeRequest({ "x-forwarded-for": "192.168.1.1" });
    expect(getClientIp(req)).toBe("192.168.1.1");
  });

  it("returns the first IP from a comma-separated x-forwarded-for chain", () => {
    const req = makeRequest({ "x-forwarded-for": "10.0.0.1, 172.16.0.1, 192.168.1.1" });
    expect(getClientIp(req)).toBe("10.0.0.1");
  });

  it("trims whitespace around the first IP", () => {
    const req = makeRequest({ "x-forwarded-for": "  203.0.113.5 , 10.0.0.1" });
    expect(getClientIp(req)).toBe("203.0.113.5");
  });

  it("falls back to x-real-ip when x-forwarded-for is absent", () => {
    const req = makeRequest({ "x-real-ip": "198.51.100.7" });
    expect(getClientIp(req)).toBe("198.51.100.7");
  });

  it('returns "unknown" when no IP headers are present', () => {
    const req = makeRequest();
    expect(getClientIp(req)).toBe("unknown");
  });

  it('returns "unknown" when x-forwarded-for is an empty string', () => {
    const req = makeRequest({ "x-forwarded-for": "" });
    expect(getClientIp(req)).toBe("unknown");
  });

  it("handles IPv6 addresses", () => {
    const req = makeRequest({ "x-forwarded-for": "::1, 10.0.0.1" });
    expect(getClientIp(req)).toBe("::1");
  });

  it("handles full IPv6 address", () => {
    const req = makeRequest({ "x-forwarded-for": "2001:db8::1" });
    expect(getClientIp(req)).toBe("2001:db8::1");
  });

  it("prefers x-forwarded-for over x-real-ip", () => {
    const req = makeRequest({
      "x-forwarded-for": "10.0.0.1",
      "x-real-ip": "192.168.1.1",
    });
    expect(getClientIp(req)).toBe("10.0.0.1");
  });
});
