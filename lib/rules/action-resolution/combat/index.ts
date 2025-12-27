/**
 * Combat Module Index
 *
 * Exports all combat-related action resolution components.
 */

// Weapon handling
export {
  // Types
  type FiringMode,
  type AttackType,
  type RangeCategory,
  type CalledShotType,
  type WeaponAttackRequest,
  type WeaponAttackResult,
  type RecoilState,
  // Constants
  AMMO_CONSUMPTION,
  FIRING_MODE_ATTACK_BONUS,
  FIRING_MODE_DEFENSE_PENALTY,
  FIRING_MODE_RECOIL,
  DEFAULT_RANGE_MODIFIERS,
  CALLED_SHOT_PENALTIES,
  // Functions
  getWeaponSkill,
  getAttackType,
  parseDamage,
  calculateRecoilCompensation,
  calculateRecoilPenalty,
  getRangeCategory,
  getRangeModifier,
  calculateAttackPool,
  calculateDefensePool,
  processWeaponAttack,
  finalizeWeaponAttack,
  hasEnoughAmmo,
  consumeAmmo,
  reloadWeapon,
  calculateReachDifferential,
  getMeleeDamage,
} from "./weapon-handler";

// Damage handling
export {
  // Types
  type DamageType,
  type DamageApplication,
  type ElementType,
  type ConditionMonitorState,
  type DamageResult,
  type ResistanceResult,
  // Constants
  BASE_PHYSICAL_BOXES,
  BASE_STUN_BOXES,
  KNOCKDOWN_THRESHOLD,
  // Functions
  calculatePhysicalMax,
  calculateStunMax,
  calculateOverflowMax,
  getConditionMonitorState,
  getArmorValue,
  calculateModifiedArmor,
  shouldConvertToStun,
  calculateResistancePool,
  buildStunResistancePool,
  applyDamageToMonitor,
  calculateWoundModifierFromState,
  processDamageApplication,
  applyHealing,
  calculateNaturalHealingPool,
  processElementalDamage,
  createConditionUpdates,
  canAct,
  getStatusDescription,
} from "./damage-handler";
