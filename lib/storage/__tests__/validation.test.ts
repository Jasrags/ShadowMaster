import { describe, it, expect } from "vitest";
import {
  validateLocationData,
  validateLocationTemplateData,
  validateCampaignTemplateData,
  assertValid,
  StorageValidationError,
} from "../validation";

describe("Storage Validation", () => {
  // ==========================================================================
  // validateLocationData
  // ==========================================================================

  describe("validateLocationData", () => {
    const validLocation = {
      id: "loc-123",
      campaignId: "camp-456",
      name: "Test Location",
      type: "physical",
      visibility: "gm-only",
      createdAt: "2024-01-01T00:00:00Z",
    };

    it("accepts valid location data", () => {
      const result = validateLocationData(validLocation);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("accepts location with all optional fields", () => {
      const fullLocation = {
        ...validLocation,
        description: "A test location description",
        gmNotes: "Secret GM notes",
        address: "123 Main Street",
        district: "Downtown",
        city: "Seattle",
        country: "UCAS",
        imageUrl: "https://example.com/image.jpg",
        mapUrl: "/maps/location1.png",
        tags: ["safe", "corporate"],
        securityRating: 5,
        visitCount: 10,
        coordinates: { latitude: 47.6062, longitude: -122.3321 },
        childLocationIds: ["child-1", "child-2"],
        parentLocationId: "parent-1",
      };
      const result = validateLocationData(fullLocation);
      expect(result.valid).toBe(true);
    });

    it("rejects non-object data", () => {
      expect(validateLocationData(null).valid).toBe(false);
      expect(validateLocationData("string").valid).toBe(false);
      expect(validateLocationData(123).valid).toBe(false);
    });

    it("rejects missing required fields", () => {
      const result = validateLocationData({});
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("id is required");
      expect(result.errors).toContain("campaignId is required");
      expect(result.errors).toContain("name is required");
      expect(result.errors).toContain("type is required");
      expect(result.errors).toContain("visibility is required");
    });

    it("rejects invalid location type", () => {
      const result = validateLocationData({
        ...validLocation,
        type: "invalid-type",
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("type must be one of"))).toBe(true);
    });

    it("rejects invalid visibility", () => {
      const result = validateLocationData({
        ...validLocation,
        visibility: "secret",
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("visibility must be one of"))).toBe(true);
    });

    it("rejects name exceeding max length", () => {
      const result = validateLocationData({
        ...validLocation,
        name: "x".repeat(501),
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("name exceeds maximum length"))).toBe(true);
    });

    it("rejects dangerous control characters in name", () => {
      const result = validateLocationData({
        ...validLocation,
        name: "Test\x00Location",
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("invalid control characters"))).toBe(true);
    });

    it("allows newlines in description (legitimate multi-line)", () => {
      const result = validateLocationData({
        ...validLocation,
        description: "Line 1\nLine 2\nLine 3",
      });
      expect(result.valid).toBe(true);
    });

    it("rejects invalid coordinates", () => {
      const result = validateLocationData({
        ...validLocation,
        coordinates: { latitude: 100, longitude: 0 },
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("latitude must be between"))).toBe(true);
    });

    it("rejects security rating out of range", () => {
      const result = validateLocationData({
        ...validLocation,
        securityRating: 25,
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("securityRating must be between"))).toBe(true);
    });

    it("rejects invalid URL format", () => {
      const result = validateLocationData({
        ...validLocation,
        imageUrl: "not-a-url",
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("imageUrl must be a valid URL"))).toBe(true);
    });

    it("accepts relative URLs", () => {
      const result = validateLocationData({
        ...validLocation,
        imageUrl: "/images/location.jpg",
      });
      expect(result.valid).toBe(true);
    });
  });

  // ==========================================================================
  // validateLocationTemplateData
  // ==========================================================================

  describe("validateLocationTemplateData", () => {
    const validTemplate = {
      id: "template-123",
      createdBy: "user-456",
      name: "Test Template",
      type: "corporate",
      templateData: {
        name: "Template Location",
        type: "corporate",
        visibility: "gm-only",
      },
      isPublic: false,
      usageCount: 0,
      createdAt: "2024-01-01T00:00:00Z",
    };

    it("accepts valid template data", () => {
      const result = validateLocationTemplateData(validTemplate);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("rejects missing required fields", () => {
      const result = validateLocationTemplateData({});
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("id is required");
      expect(result.errors).toContain("createdBy is required");
      expect(result.errors).toContain("name is required");
      expect(result.errors).toContain("type is required");
    });

    it("rejects invalid template type", () => {
      const result = validateLocationTemplateData({
        ...validTemplate,
        type: "bad-type",
      });
      expect(result.valid).toBe(false);
    });

    it("rejects non-boolean isPublic", () => {
      const result = validateLocationTemplateData({
        ...validTemplate,
        isPublic: "yes",
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("isPublic must be a boolean");
    });
  });

  // ==========================================================================
  // validateCampaignTemplateData
  // ==========================================================================

  describe("validateCampaignTemplateData", () => {
    const validCampaignTemplate = {
      id: "ctemplate-123",
      createdBy: "user-456",
      name: "Test Campaign Template",
      editionCode: "sr5",
      enabledBookIds: ["core-rulebook"],
      enabledCreationMethodIds: ["priority"],
      isPublic: false,
      createdAt: "2024-01-01T00:00:00Z",
    };

    it("accepts valid campaign template data", () => {
      const result = validateCampaignTemplateData(validCampaignTemplate);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("rejects missing required fields", () => {
      const result = validateCampaignTemplateData({});
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("id is required");
      expect(result.errors).toContain("createdBy is required");
      expect(result.errors).toContain("name is required");
      expect(result.errors).toContain("editionCode is required");
    });

    it("rejects invalid edition code", () => {
      const result = validateCampaignTemplateData({
        ...validCampaignTemplate,
        editionCode: "sr99",
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("editionCode must be one of"))).toBe(true);
    });

    it("accepts all valid edition codes", () => {
      const editions = ["sr1", "sr2", "sr3", "sr4", "sr4a", "sr5", "sr6", "anarchy"];
      for (const edition of editions) {
        const result = validateCampaignTemplateData({
          ...validCampaignTemplate,
          editionCode: edition,
        });
        expect(result.valid).toBe(true);
      }
    });

    it("rejects non-boolean isPublic", () => {
      const result = validateCampaignTemplateData({
        ...validCampaignTemplate,
        isPublic: 1,
      });
      expect(result.valid).toBe(false);
    });
  });

  // ==========================================================================
  // assertValid
  // ==========================================================================

  describe("assertValid", () => {
    it("does not throw for valid data", () => {
      expect(() => {
        assertValid({ valid: true, errors: [] }, "TestData");
      }).not.toThrow();
    });

    it("throws StorageValidationError for invalid data", () => {
      expect(() => {
        assertValid({ valid: false, errors: ["error1", "error2"] }, "TestData");
      }).toThrow(StorageValidationError);
    });

    it("includes error details in exception", () => {
      try {
        assertValid({ valid: false, errors: ["field1 is required", "field2 invalid"] }, "Location");
        expect.fail("Should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(StorageValidationError);
        const validationError = error as StorageValidationError;
        expect(validationError.errors).toContain("field1 is required");
        expect(validationError.errors).toContain("field2 invalid");
        expect(validationError.dataType).toBe("Location");
        expect(validationError.message).toContain("Location");
      }
    });
  });

  // ==========================================================================
  // Security-focused tests
  // ==========================================================================

  describe("security validation", () => {
    const baseLocation = {
      id: "loc-123",
      campaignId: "camp-456",
      name: "Test",
      type: "physical",
      visibility: "gm-only",
    };

    it("rejects null byte injection attempts", () => {
      const result = validateLocationData({
        ...baseLocation,
        name: "Normal\x00Malicious",
      });
      expect(result.valid).toBe(false);
    });

    it("rejects backspace character injection", () => {
      const result = validateLocationData({
        ...baseLocation,
        description: "Visible\x08\x08\x08\x08Hidden",
      });
      expect(result.valid).toBe(false);
    });

    it("rejects escape sequence injection", () => {
      const result = validateLocationData({
        ...baseLocation,
        name: "Test\x1b[31mRED",
      });
      expect(result.valid).toBe(false);
    });

    it("prevents excessively long strings (DoS mitigation)", () => {
      const result = validateLocationData({
        ...baseLocation,
        description: "x".repeat(100000),
      });
      expect(result.valid).toBe(false);
    });

    it("prevents excessively long tag arrays", () => {
      const result = validateLocationData({
        ...baseLocation,
        tags: Array(200).fill("tag"),
      });
      expect(result.valid).toBe(false);
    });
  });
});
