/**
 * Matrix Data Verification Tests
 *
 * These tests verify that all SR5 Core Rulebook Matrix items are present
 * in core-rulebook.json. Created as part of Issue #140 to ensure example
 * character gear requirements are satisfied and to prevent regression.
 *
 * Reference: SR5 CRB p.245-246 (Programs), p.438 (Cyberdecks, Commlinks)
 */
import { describe, it, expect, beforeAll } from "vitest";
import * as fs from "fs";
import * as path from "path";

interface BookPayload {
  modules: {
    gear?: {
      payload: {
        cyberdecks?: Array<{ id: string; name: string; deviceRating: number; programs: number }>;
        commlinks?: Array<{ id: string; name: string; deviceRating: number }>;
      };
    };
    programs?: {
      payload: {
        common?: Array<{ id: string; name: string; category: string }>;
        hacking?: Array<{ id: string; name: string; category: string }>;
        skillsofts?: Array<{ id: string; name: string; category: string }>;
        tutorsofts?: Array<{ id: string; name: string; category: string }>;
      };
    };
  };
}

// Expected SR5 CRB items per the plan
const SR5_CYBERDECKS = [
  "erika-mcd-1",
  "microdeck-summit",
  "microtronica-azteca-200",
  "hermes-chariot",
  "novatech-navigator",
  "renraku-tsurugi",
  "sony-ciy-720",
  "shiawase-cyber-5",
  "fairlight-excalibur",
];

const SR5_COMMON_PROGRAMS = [
  "browse",
  "configurator",
  "edit",
  "encryption",
  "signal-scrub",
  "toolbox",
  "virtual-machine",
];

const SR5_HACKING_PROGRAMS = [
  "armor",
  "baby-monitor",
  "biofeedback",
  "biofeedback-filter",
  "blackout",
  "decryption",
  "defuse",
  "demolition",
  "exploit",
  "fork",
  "guard",
  "hammer",
  "lockdown",
  "mugger",
  "shell",
  "sneak",
  "stealth",
  "track",
  "wrapper",
];

const SR5_COMMLINKS = [
  "meta-link",
  "sony-emperor",
  "renraku-sensei",
  "erika-elite",
  "hermes-ikon",
  "transys-avalon",
  "fairlight-caliban",
];

// Skillsofts are in the skillsofts array
const SR5_SKILLSOFTS = ["activesoft", "knowsoft", "linguasoft"];
// Tutorsoft is in its own tutorsofts array
const SR5_TUTORSOFTS = ["tutorsoft"];

describe("SR5 CRB Matrix Data Verification", () => {
  let bookData: BookPayload;

  beforeAll(() => {
    const filePath = path.join(process.cwd(), "data", "editions", "sr5", "core-rulebook.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    bookData = JSON.parse(rawData) as BookPayload;
  });

  describe("Cyberdecks (SR5 CRB p.438)", () => {
    it("should have all 9 SR5 CRB cyberdecks", () => {
      const cyberdecks = bookData.modules.gear?.payload.cyberdecks ?? [];
      const cyberdeckIds = cyberdecks.map((c) => c.id);

      for (const expectedId of SR5_CYBERDECKS) {
        expect(cyberdeckIds).toContain(expectedId);
      }
      expect(cyberdecks.length).toBeGreaterThanOrEqual(SR5_CYBERDECKS.length);
    });

    it("each cyberdeck should have required fields", () => {
      const cyberdecks = bookData.modules.gear?.payload.cyberdecks ?? [];

      for (const deck of cyberdecks) {
        expect(deck.id).toBeDefined();
        expect(deck.name).toBeDefined();
        expect(deck.deviceRating).toBeGreaterThanOrEqual(1);
        expect(deck.programs).toBeGreaterThanOrEqual(1);
      }
    });

    it("should include Hermes Chariot (decker example character deck)", () => {
      const cyberdecks = bookData.modules.gear?.payload.cyberdecks ?? [];
      const hermesChariot = cyberdecks.find((c) => c.id === "hermes-chariot");

      expect(hermesChariot).toBeDefined();
      expect(hermesChariot?.name).toBe("Hermes Chariot");
      expect(hermesChariot?.deviceRating).toBe(2);
    });
  });

  describe("Common Programs (SR5 CRB p.245)", () => {
    it("should have all 7 SR5 CRB common programs", () => {
      const commonPrograms = bookData.modules.programs?.payload.common ?? [];
      const programIds = commonPrograms.map((p) => p.id);

      for (const expectedId of SR5_COMMON_PROGRAMS) {
        expect(programIds).toContain(expectedId);
      }
      expect(commonPrograms.length).toBeGreaterThanOrEqual(SR5_COMMON_PROGRAMS.length);
    });

    it("each common program should have required fields", () => {
      const commonPrograms = bookData.modules.programs?.payload.common ?? [];

      for (const program of commonPrograms) {
        expect(program.id).toBeDefined();
        expect(program.name).toBeDefined();
        expect(program.category).toBe("common");
      }
    });

    it("should include decker example character programs", () => {
      const commonPrograms = bookData.modules.programs?.payload.common ?? [];
      const programIds = commonPrograms.map((p) => p.id);

      // Programs used by the decker example character
      const deckerPrograms = ["edit", "encryption", "signal-scrub", "toolbox"];
      for (const progId of deckerPrograms) {
        expect(programIds).toContain(progId);
      }
    });
  });

  describe("Hacking Programs (SR5 CRB p.245-246)", () => {
    it("should have all 19 SR5 CRB hacking programs", () => {
      const hackingPrograms = bookData.modules.programs?.payload.hacking ?? [];
      const programIds = hackingPrograms.map((p) => p.id);

      for (const expectedId of SR5_HACKING_PROGRAMS) {
        expect(programIds).toContain(expectedId);
      }
      expect(hackingPrograms.length).toBeGreaterThanOrEqual(SR5_HACKING_PROGRAMS.length);
    });

    it("each hacking program should have required fields", () => {
      const hackingPrograms = bookData.modules.programs?.payload.hacking ?? [];

      for (const program of hackingPrograms) {
        expect(program.id).toBeDefined();
        expect(program.name).toBeDefined();
        expect(program.category).toBe("hacking");
      }
    });

    it("should include decker example character hacking programs", () => {
      const hackingPrograms = bookData.modules.programs?.payload.hacking ?? [];
      const programIds = hackingPrograms.map((p) => p.id);

      // Hacking programs used by the decker example character
      const deckerHackingPrograms = ["armor", "biofeedback-filter", "hammer"];
      for (const progId of deckerHackingPrograms) {
        expect(programIds).toContain(progId);
      }
    });
  });

  describe("Commlinks (SR5 CRB p.438)", () => {
    it("should have all 7 SR5 CRB commlinks", () => {
      const commlinks = bookData.modules.gear?.payload.commlinks ?? [];
      // Filter out accessories (sim modules)
      const actualCommlinks = commlinks.filter((c) => !c.id.includes("sim-module"));
      const commlinkIds = actualCommlinks.map((c) => c.id);

      for (const expectedId of SR5_COMMLINKS) {
        expect(commlinkIds).toContain(expectedId);
      }
      expect(actualCommlinks.length).toBeGreaterThanOrEqual(SR5_COMMLINKS.length);
    });

    it("each commlink should have required fields", () => {
      const commlinks = bookData.modules.gear?.payload.commlinks ?? [];
      const actualCommlinks = commlinks.filter((c) => !c.id.includes("sim-module"));

      for (const commlink of actualCommlinks) {
        expect(commlink.id).toBeDefined();
        expect(commlink.name).toBeDefined();
        expect(commlink.deviceRating).toBeGreaterThanOrEqual(1);
      }
    });

    it("should include Meta Link (decker example character backup commlink)", () => {
      const commlinks = bookData.modules.gear?.payload.commlinks ?? [];
      const metaLink = commlinks.find((c) => c.id === "meta-link");

      expect(metaLink).toBeDefined();
      expect(metaLink?.name).toBe("Meta Link");
      expect(metaLink?.deviceRating).toBe(1);
    });
  });

  describe("Skillsofts (SR5 CRB p.442)", () => {
    it("should have all 3 SR5 CRB skillsoft types", () => {
      const skillsofts = bookData.modules.programs?.payload.skillsofts ?? [];
      const skillsoftIds = skillsofts.map((s) => s.id);

      for (const expectedId of SR5_SKILLSOFTS) {
        expect(skillsoftIds).toContain(expectedId);
      }
    });

    it("should have tutorsoft in tutorsofts array", () => {
      const tutorsofts = bookData.modules.programs?.payload.tutorsofts ?? [];
      const tutorsoftIds = tutorsofts.map((s) => s.id);

      for (const expectedId of SR5_TUTORSOFTS) {
        expect(tutorsoftIds).toContain(expectedId);
      }
    });

    it("should include linguasoft and knowsoft (decker example character items)", () => {
      const skillsofts = bookData.modules.programs?.payload.skillsofts ?? [];
      const skillsoftIds = skillsofts.map((s) => s.id);

      expect(skillsoftIds).toContain("linguasoft");
      expect(skillsoftIds).toContain("knowsoft");
    });
  });

  describe("Decker Example Character Requirements", () => {
    it("should have all gear required for the decker example character", () => {
      // Verify all gear from the decker example character exists
      const cyberdecks = bookData.modules.gear?.payload.cyberdecks ?? [];
      const commlinks = bookData.modules.gear?.payload.commlinks ?? [];
      const commonPrograms = bookData.modules.programs?.payload.common ?? [];
      const hackingPrograms = bookData.modules.programs?.payload.hacking ?? [];
      const skillsofts = bookData.modules.programs?.payload.skillsofts ?? [];

      // Cyberdeck
      expect(cyberdecks.map((c) => c.id)).toContain("hermes-chariot");

      // Commlink
      expect(commlinks.map((c) => c.id)).toContain("meta-link");

      // Common programs
      expect(commonPrograms.map((p) => p.id)).toContain("edit");
      expect(commonPrograms.map((p) => p.id)).toContain("encryption");
      expect(commonPrograms.map((p) => p.id)).toContain("signal-scrub");
      expect(commonPrograms.map((p) => p.id)).toContain("toolbox");

      // Hacking programs
      expect(hackingPrograms.map((p) => p.id)).toContain("armor");
      expect(hackingPrograms.map((p) => p.id)).toContain("biofeedback-filter");
      expect(hackingPrograms.map((p) => p.id)).toContain("hammer");

      // Skillsofts
      expect(skillsofts.map((s) => s.id)).toContain("linguasoft");
      expect(skillsofts.map((s) => s.id)).toContain("knowsoft");
    });
  });
});
