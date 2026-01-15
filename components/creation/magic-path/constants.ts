import type { AspectedMageGroup, PathInfo } from "./types";

// Aspected mage can choose ONE of these skill groups
export const ASPECTED_MAGE_GROUPS: AspectedMageGroup[] = [
  {
    id: "sorcery",
    name: "Sorcery",
    description: "Cast spells and rituals",
    skills: ["Spellcasting", "Counterspelling", "Ritual Spellcasting"],
  },
  {
    id: "conjuring",
    name: "Conjuring",
    description: "Summon and control spirits",
    skills: ["Summoning", "Banishing", "Binding"],
  },
  {
    id: "enchanting",
    name: "Enchanting",
    description: "Create preparations and foci",
    skills: ["Alchemy", "Artificing", "Disenchanting"],
  },
];

// Paths that can select a tradition
export const TRADITION_PATHS = ["magician", "mystic-adept", "aspected-mage"];

// Paths that can select a mentor spirit
export const MENTOR_SPIRIT_PATHS = ["magician", "mystic-adept", "aspected-mage", "adept"];

export const MENTOR_SPIRIT_QUALITY_ID = "mentor-spirit";
export const MENTOR_SPIRIT_KARMA_COST = 5;

// Path descriptions and features for the modal
export const PATH_INFO: Record<string, PathInfo> = {
  magician: {
    description: "Full spellcaster with summoning and enchanting",
    features: ["5 free spells", "Requires tradition selection", "All magical skills available"],
  },
  "mystic-adept": {
    description: "Blend of adept powers and spellcasting",
    features: ["Split Magic between powers and spells", "Requires tradition", "No counterspelling"],
  },
  adept: {
    description: "Physical magic channeled through the body",
    features: ["Power Points = Magic Rating", "No spells", "No tradition needed"],
  },
  "aspected-mage": {
    description: "Specialist in one magical discipline only",
    features: ["Choose: Sorcery, Conjuring, or Enchanting", "Requires tradition"],
  },
  technomancer: {
    description: "Living interface with the Matrix",
    features: ["Complex forms", "Compile sprites", "Living Persona"],
  },
  mundane: {
    description: "Focus your build on physical, technical, or social strengths",
    features: [
      "No essence concerns for cyberware/bioware",
      "Street Samurai, Rigger, Decker, Face archetypes",
    ],
  },
};

// Awakened paths (magic-based)
export const AWAKENED_PATHS = ["magician", "mystic-adept", "adept", "aspected-mage"];

// Emerged paths (resonance-based)
export const EMERGED_PATHS = ["technomancer"];
