/**
 * Type exports
 *
 * Central export point for all application types.
 */

// Core types
export type { ID, ISODateString, Metadata } from "./core";

// Edition and ruleset types
export type {
  EditionCode,
  Edition,
  BookCategory,
  Book,
  RuleModuleType,
  RuleModule,
  MergeStrategy,
  RuleOverride,
  BookPayload,
  BookModuleEntry,
  MergedRuleset,
  CyberwareCatalogItem,
  BiowareCatalogItem,
  AugmentationRules,
  // Modification catalog types
  WeaponMountType,
  ModifiableGearType,
  WeaponModificationCatalogItem,
  ArmorModificationCatalogItem,
  ModificationsCatalog,
  // Spirit types
  SpiritPower,
  Spirit,
} from "./edition";

// Character types
export type {
  MagicalPath,
  CharacterStatus,
  CharacterApprovalStatus,
  Character,
  KnowledgeSkill,
  LanguageSkill,
  SkillSource,
  SkillWithSource,
  AdeptPower,
  BoundSpirit,
  Lifestyle,
  LifestyleModification,
  LifestyleSubscription,
  SIN,
  License,
  Identity,
  GearItem,
  Weapon,
  ArmorItem,
  // Modification types for character gear
  WeaponMount,
  InstalledWeaponMod,
  InstalledArmorMod,
  CyberwareGrade,
  CyberwareCategory,
  CyberwareItem,
  BiowareGrade,
  BiowareCategory,
  BiowareItem,
  EssenceHole,
  Vehicle,
  Contact,
  CharacterDrone,
  CharacterRCC,
  CharacterAutosoft,
  FocusItem,
  CharacterDraft,
  CreateCharacterRequest,
  UpdateCharacterRequest,
  CharacterResponse,
  CharactersListResponse,
  ContactTemplateData,
} from "./character";

// Cyberware/Bioware grade multipliers and modifiers
export {
  CYBERWARE_GRADE_MULTIPLIERS,
  CYBERWARE_GRADE_AVAILABILITY_MODIFIERS,
  CYBERWARE_GRADE_COST_MULTIPLIERS,
  BIOWARE_GRADE_MULTIPLIERS,
  SinnerQuality,
} from "./character";

// Spirit types enum
export { SpiritType } from "./edition";

// Creation method types
export type {
  CreationMethodType,
  CreationMethod,
  CreationStepType,
  CreationStep,
  CreationStepPayload,
  SelectStepPayload,
  PriorityStepPayload,
  PriorityCategory,
  AllocateStepPayload,
  ChooseStepPayload,
  PurchaseStepPayload,
  InfoStepPayload,
  ValidateStepPayload,
  CreationBudget,
  ConstraintType,
  CreationConstraint,
  StepDependency,
  OptionalRule,
  OptionalRuleEffect,
  SR5PriorityTable,
  SR5PriorityLevel,
  SR5MetatypePriority,
  SR5MagicPriority,
  SR5SkillsPriority,
  FreeSkillAllocation,
  CreationState,
  ValidationError,
} from "./creation";

// User types (existing)
export type {
  UserRole,
  User,
  SignupRequest,
  SigninRequest,
  AuthResponse,
  PublicUser,
  UpdateUserRequest,
  UpdateUserResponse,
  UsersListResponse,
  DeleteUserResponse,
} from "./user";

// Vehicle & Drone catalog types (for ruleset data)
export type {
  VehicleCategory,
  HandlingRating,
  VehicleCatalogItem,
  DroneSize,
  Drone,
  DroneCatalogItem,
  RCC,
  RCCCatalogItem,
  AutosoftCategory,
  Autosoft,
  AutosoftCatalogItem,
  VehicleModCategory,
  VehicleModification,
  OwnedVehicle,
  OwnedDrone,
  OwnedRCC,
  OwnedAutosoft,
  VehiclesModuleData,
} from "./vehicles";

// Matrix Program types
export type {
  ProgramCategory,
  ProgramCatalogItem,
  ProgramsModule,
  CharacterProgram,
} from "./programs";

// Campaign types
export type {
  CampaignVisibility,
  GameplayLevel,
  CampaignStatus,
  Campaign,
  CampaignMembership,
  CampaignNote,
  CampaignSession,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  CampaignResponse,
  CampaignsListResponse,
  JoinCampaignRequest,
} from "./campaign";
