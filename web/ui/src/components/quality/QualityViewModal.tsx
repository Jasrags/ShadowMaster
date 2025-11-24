import { Dialog, Modal, Heading, Button } from 'react-aria-components';
import type { Quality, QualityBonus, QualityRequirements } from '../../lib/types';

interface QualityViewModalProps {
  quality: Quality | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

// Format karma cost for display
function formatKarmaCost(cost: Quality['cost']): string {
  if (cost.per_rating) {
    if (cost.max_rating > 0) {
      return `${cost.base_cost} per rating (max ${cost.max_rating})`;
    }
    return `${cost.base_cost} per rating`;
  }
  return `${cost.base_cost}`;
}

// Display Quality Bonus
function QualityBonusDisplay({ bonus }: { bonus: QualityBonus }) {
  const sections: JSX.Element[] = [];

  // Ambidextrous
  if (bonus.ambidextrous && bonus.ambidextrous.length > 0) {
    sections.push(
      <div key="ambidextrous" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Ambidextrous</h3>
        <p className="text-gray-200 text-sm ml-4">Removes -2 dice pool modifier for off-hand actions</p>
      </div>
    );
  }

  // Skill Dice Pool Bonuses
  if (bonus.skill_dice_pool_bonuses && bonus.skill_dice_pool_bonuses.length > 0) {
    sections.push(
      <div key="skillDicePoolBonuses" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Skill/Attribute Dice Pool Bonuses</h3>
        <ul className="list-none space-y-1 ml-4">
          {bonus.skill_dice_pool_bonuses.map((b, idx) => (
            <li key={idx} className="text-gray-200 text-sm">
              <span className="font-medium">{b.target || 'Selected skill/attribute'}:</span>{' '}
              <span className="text-green-400">+{b.bonus}</span>
              {b.conditions && b.conditions.length > 0 && (
                <span className="text-gray-400 italic"> ({b.conditions.join(', ')})</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Skill Rating Modifiers
  if (bonus.skill_rating_modifiers && bonus.skill_rating_modifiers.length > 0) {
    sections.push(
      <div key="skillRatingModifiers" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Skill Rating Modifiers</h3>
        <ul className="list-none space-y-1 ml-4">
          {bonus.skill_rating_modifiers.map((m, idx) => (
            <li key={idx} className="text-gray-200 text-sm">
              <span className="font-medium">{m.skill_name || 'Selected skill'}:</span>
              {m.max_rating_at_chargen > 0 && (
                <> Max at chargen: {m.max_rating_at_chargen}</>
              )}
              {m.max_rating > 0 && (
                <> Max rating: {m.max_rating}</>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Attribute Modifiers
  if (bonus.attribute_modifiers && bonus.attribute_modifiers.length > 0) {
    sections.push(
      <div key="attributeModifiers" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Attribute Modifiers</h3>
        <ul className="list-none space-y-1 ml-4">
          {bonus.attribute_modifiers.map((m, idx) => (
            <li key={idx} className="text-gray-200 text-sm">
              <span className="font-medium">{m.attribute_name || 'Selected attribute'}:</span>{' '}
              Max rating increase: <span className="text-green-400">+{m.max_rating_increase}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Free Language Skills
  if (bonus.free_language_skills !== undefined && bonus.free_language_skills > 0) {
    sections.push(
      <div key="freeLanguageSkills" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Free Language Skills</h3>
        <p className="text-gray-200 text-sm ml-4">{bonus.free_language_skills} free language skill(s)</p>
      </div>
    );
  }

  // Memory Test Threshold
  if (bonus.memory_test_threshold_increase !== undefined && bonus.memory_test_threshold_increase > 0) {
    sections.push(
      <div key="memoryTestThresholdIncrease" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Memory Test Threshold</h3>
        <p className="text-gray-200 text-sm ml-4">+{bonus.memory_test_threshold_increase} to threshold for memory tests about this character</p>
      </div>
    );
  }
  if (bonus.memory_test_threshold_decrease !== undefined && bonus.memory_test_threshold_decrease > 0) {
    sections.push(
      <div key="memoryTestThresholdDecrease" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Memory Test Threshold</h3>
        <p className="text-gray-200 text-sm ml-4">-{bonus.memory_test_threshold_decrease} to threshold for memory tests about this character</p>
      </div>
    );
  }

  // Shadowing Penalty
  if (bonus.shadowing_penalty !== undefined && bonus.shadowing_penalty > 0) {
    sections.push(
      <div key="shadowingPenalty" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Shadowing Penalty</h3>
        <p className="text-gray-200 text-sm ml-4">
          <span className="text-red-400">-{bonus.shadowing_penalty}</span> dice pool penalty for shadowing/locating this character
        </p>
      </div>
    );
  }

  // Matrix Action Bonus/Penalty
  if (bonus.matrix_action_bonus) {
    sections.push(
      <div key="matrixActionBonus" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Matrix Action Bonus</h3>
        <p className="text-gray-200 text-sm ml-4">
          <span className="font-medium">{bonus.matrix_action_bonus.target || 'Selected Matrix action'}:</span>{' '}
          <span className="text-green-400">+{bonus.matrix_action_bonus.bonus}</span>
          {bonus.matrix_action_bonus.conditions && bonus.matrix_action_bonus.conditions.length > 0 && (
            <span className="text-gray-400 italic"> ({bonus.matrix_action_bonus.conditions.join(', ')})</span>
          )}
        </p>
      </div>
    );
  }
  if (bonus.matrix_action_penalty) {
    sections.push(
      <div key="matrixActionPenalty" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Matrix Action Penalty</h3>
        <p className="text-gray-200 text-sm ml-4">
          <span className="font-medium">{bonus.matrix_action_penalty.target || 'Selected Matrix action'}:</span>{' '}
          <span className="text-red-400">-{bonus.matrix_action_penalty.bonus}</span>
          {bonus.matrix_action_penalty.conditions && bonus.matrix_action_penalty.conditions.length > 0 && (
            <span className="text-gray-400 italic"> ({bonus.matrix_action_penalty.conditions.join(', ')})</span>
          )}
        </p>
      </div>
    );
  }

  // Social Test Bonus
  if (bonus.social_test_bonus) {
    sections.push(
      <div key="socialTestBonus" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Social Test Bonus</h3>
        <p className="text-gray-200 text-sm ml-4">
          <span className="font-medium">{bonus.social_test_bonus.target || 'Social tests'}:</span>{' '}
          <span className="text-green-400">+{bonus.social_test_bonus.bonus}</span>
          {bonus.social_test_bonus.conditions && bonus.social_test_bonus.conditions.length > 0 && (
            <span className="text-gray-400 italic"> ({bonus.social_test_bonus.conditions.join(', ')})</span>
          )}
        </p>
      </div>
    );
  }

  // Sustained Spell Modifier
  if (bonus.sustained_spell_modifier) {
    sections.push(
      <div key="sustainedSpellModifier" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Sustained Spell/Complex Form Modifier</h3>
        <p className="text-gray-200 text-sm ml-4">
          Can sustain spells/complex forms at rating {bonus.sustained_spell_modifier.penalty_free_sustain_rating} without penalty
        </p>
      </div>
    );
  }

  // Fear Resistance Bonus
  if (bonus.fear_resistance_bonus !== undefined && bonus.fear_resistance_bonus > 0) {
    sections.push(
      <div key="fearResistanceBonus" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Fear Resistance</h3>
        <p className="text-gray-200 text-sm ml-4">
          <span className="text-green-400">+{bonus.fear_resistance_bonus}</span> bonus to resist fear and intimidation
        </p>
      </div>
    );
  }

  // Wound Modifier
  if (bonus.wound_modifier_ignore !== undefined && bonus.wound_modifier_ignore > 0) {
    sections.push(
      <div key="woundModifierIgnore" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Wound Modifier</h3>
        <p className="text-gray-200 text-sm ml-4">Ignore {bonus.wound_modifier_ignore} damage box(es) for wound modifier calculation</p>
      </div>
    );
  }
  if (bonus.wound_modifier_frequency !== undefined && bonus.wound_modifier_frequency > 0) {
    sections.push(
      <div key="woundModifierFrequency" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Wound Modifier Frequency</h3>
        <p className="text-gray-200 text-sm ml-4">Wound modifier applies every {bonus.wound_modifier_frequency} damage box(es) (default: 3)</p>
      </div>
    );
  }

  // Addiction Modifiers
  if (bonus.addiction_modifiers && bonus.addiction_modifiers.length > 0) {
    sections.push(
      <div key="addictionModifiers" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Addiction</h3>
        <ul className="list-none space-y-2 ml-4">
          {bonus.addiction_modifiers.map((a, idx) => (
            <li key={idx} className="text-gray-200 text-sm border-l-2 border-red-500 pl-3">
              <div><span className="font-medium">Type:</span> {a.type || 'Player selects'}</div>
              <div><span className="font-medium">Severity:</span> {a.severity || 'Player selects'}</div>
              {a.substance_name && <div><span className="font-medium">Substance:</span> {a.substance_name}</div>}
              {a.dosage_required > 0 && <div><span className="font-medium">Dosage Required:</span> {a.dosage_required}</div>}
              {a.cravings_frequency && <div><span className="font-medium">Cravings Frequency:</span> {a.cravings_frequency}</div>}
              {a.withdrawal_penalty !== 0 && (
                <div><span className="font-medium">Withdrawal Penalty:</span> <span className="text-red-400">-{a.withdrawal_penalty}</span></div>
              )}
              {a.social_test_penalty !== 0 && (
                <div><span className="font-medium">Social Test Penalty:</span> <span className="text-red-400">-{a.social_test_penalty}</span></div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Allergy Modifiers
  if (bonus.allergy_modifiers && bonus.allergy_modifiers.length > 0) {
    sections.push(
      <div key="allergyModifiers" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Allergy</h3>
        <ul className="list-none space-y-2 ml-4">
          {bonus.allergy_modifiers.map((a, idx) => (
            <li key={idx} className="text-gray-200 text-sm border-l-2 border-red-500 pl-3">
              <div><span className="font-medium">Rarity:</span> {a.rarity || 'Player selects'}</div>
              <div><span className="font-medium">Severity:</span> {a.severity || 'Player selects'}</div>
              {a.allergen_name && <div><span className="font-medium">Allergen:</span> {a.allergen_name}</div>}
              {a.resistance_test_penalty > 0 && (
                <div><span className="font-medium">Resistance Test Penalty:</span> <span className="text-red-400">-{a.resistance_test_penalty}</span></div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Bad Luck Edge Penalty
  if (bonus.bad_luck_edge_penalty) {
    sections.push(
      <div key="badLuckEdgePenalty" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Bad Luck</h3>
        <p className="text-gray-200 text-sm ml-4">When using Edge, roll 1D6. On a result of 1, the effect is opposite of intended.</p>
      </div>
    );
  }

  // Notoriety Bonus
  if (bonus.notoriety_bonus !== undefined && bonus.notoriety_bonus > 0) {
    sections.push(
      <div key="notorietyBonus" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Notoriety</h3>
        <p className="text-gray-200 text-sm ml-4">Starting Notoriety: <span className="text-red-400">+{bonus.notoriety_bonus}</span></p>
      </div>
    );
  }

  // Code of Honor Protected Groups
  if (bonus.code_of_honor_protected_groups && bonus.code_of_honor_protected_groups.length > 0) {
    sections.push(
      <div key="codeOfHonorProtectedGroups" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Code of Honor - Protected Groups</h3>
        <p className="text-gray-200 text-sm ml-4">Won't kill: {bonus.code_of_honor_protected_groups.join(', ')}</p>
      </div>
    );
  }

  // Initiative Modifier
  if (bonus.initiative_modifier) {
    sections.push(
      <div key="initiativeModifier" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Initiative Modifier</h3>
        <p className="text-gray-200 text-sm ml-4">Initiative divided by {bonus.initiative_modifier.first_turn_divisor} on first turn</p>
      </div>
    );
  }

  // Surprise Test Penalty
  if (bonus.surprise_test_penalty !== undefined && bonus.surprise_test_penalty > 0) {
    sections.push(
      <div key="surpriseTestPenalty" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Surprise Test Penalty</h3>
        <p className="text-gray-200 text-sm ml-4">
          <span className="text-red-400">-{bonus.surprise_test_penalty}</span> dice pool penalty to Surprise Tests
        </p>
      </div>
    );
  }

  // Composure Test Threshold Modifier
  if (bonus.composure_test_threshold_modifier !== undefined && bonus.composure_test_threshold_modifier !== 0) {
    sections.push(
      <div key="composureTestThresholdModifier" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Composure Test Threshold</h3>
        <p className="text-gray-200 text-sm ml-4">
          {bonus.composure_test_threshold_modifier > 0 ? '+' : ''}{bonus.composure_test_threshold_modifier} to Composure Test thresholds
        </p>
      </div>
    );
  }

  // Dependents Level
  if (bonus.dependents_level !== undefined && bonus.dependents_level > 0) {
    sections.push(
      <div key="dependentsLevel" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Dependents</h3>
        <p className="text-gray-200 text-sm ml-4">Level {bonus.dependents_level} - Affects lifestyle cost and skill advancement time</p>
      </div>
    );
  }

  // Lifestyle Cost Increase
  if (bonus.lifestyle_cost_increase_percent !== undefined && bonus.lifestyle_cost_increase_percent > 0) {
    sections.push(
      <div key="lifestyleCostIncreasePercent" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Lifestyle Cost</h3>
        <p className="text-gray-200 text-sm ml-4">
          <span className="text-red-400">+{bonus.lifestyle_cost_increase_percent}%</span> increase to lifestyle cost
        </p>
      </div>
    );
  }

  // Skill Advancement Time Multiplier
  if (bonus.skill_advancement_time_multiplier !== undefined && bonus.skill_advancement_time_multiplier !== 1) {
    sections.push(
      <div key="skillAdvancementTimeMultiplier" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Skill Advancement Time</h3>
        <p className="text-gray-200 text-sm ml-4">
          Time to learn/improve skills multiplied by {bonus.skill_advancement_time_multiplier}x
        </p>
      </div>
    );
  }

  // Identification Bonus
  if (bonus.identification_bonus !== undefined && bonus.identification_bonus > 0) {
    sections.push(
      <div key="identificationBonus" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Identification Bonus</h3>
        <p className="text-gray-200 text-sm ml-4">
          <span className="text-green-400">+{bonus.identification_bonus}</span> bonus to identify/trace/locate this character
        </p>
      </div>
    );
  }

  // Glitch Reduction
  if (bonus.glitch_reduction_per_level !== undefined && bonus.glitch_reduction_per_level > 0) {
    sections.push(
      <div key="glitchReductionPerLevel" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Glitch Reduction</h3>
        <p className="text-gray-200 text-sm ml-4">Reduces number of 1s needed for glitch by {bonus.glitch_reduction_per_level} per level</p>
      </div>
    );
  }

  // Incompetent Skill Groups
  if (bonus.incompetent_skill_groups && bonus.incompetent_skill_groups.length > 0) {
    sections.push(
      <div key="incompetentSkillGroups" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Incompetent Skill Groups</h3>
        <p className="text-gray-200 text-sm ml-4">{bonus.incompetent_skill_groups.join(', ')}</p>
      </div>
    );
  }

  // Insomnia Level
  if (bonus.insomnia_level !== undefined && bonus.insomnia_level > 0) {
    sections.push(
      <div key="insomniaLevel" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Insomnia</h3>
        <p className="text-gray-200 text-sm ml-4">Level {bonus.insomnia_level} - Affects Stun recovery</p>
      </div>
    );
  }

  // Loss of Confidence Skill
  if (bonus.loss_of_confidence_skill) {
    sections.push(
      <div key="lossOfConfidenceSkill" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Loss of Confidence</h3>
        <p className="text-gray-200 text-sm ml-4">Affected skill: {bonus.loss_of_confidence_skill}</p>
      </div>
    );
  }

  // Prejudiced Modifiers
  if (bonus.prejudiced_modifiers && bonus.prejudiced_modifiers.length > 0) {
    sections.push(
      <div key="prejudicedModifiers" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Prejudiced</h3>
        <ul className="list-none space-y-2 ml-4">
          {bonus.prejudiced_modifiers.map((p, idx) => (
            <li key={idx} className="text-gray-200 text-sm border-l-2 border-red-500 pl-3">
              <div><span className="font-medium">Target Group:</span> {p.target_group || 'Player selects'}</div>
              <div><span className="font-medium">Severity Level:</span> {p.severity_level}</div>
              {p.social_test_penalty_per_level > 0 && (
                <div><span className="font-medium">Social Test Penalty:</span> <span className="text-red-400">-{p.social_test_penalty_per_level}</span> per level</div>
              )}
              {p.negotiation_bonus_per_level > 0 && (
                <div><span className="font-medium">Target's Negotiation Bonus:</span> <span className="text-green-400">+{p.negotiation_bonus_per_level}</span> per level</div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Scorched Effects
  if (bonus.scorched_effects) {
    const s = bonus.scorched_effects;
    sections.push(
      <div key="scorchedEffects" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Scorched</h3>
        <div className="text-gray-200 text-sm ml-4 space-y-1">
          {s.effect_description && <div><span className="font-medium">Effect:</span> {s.effect_description}</div>}
          {s.vrbtl_test_threshold > 0 && (
            <div><span className="font-medium">VR/BTL Test Threshold:</span> {s.vrbtl_test_threshold}</div>
          )}
          {s.effect_duration_hours > 0 && (
            <div><span className="font-medium">Effect Duration:</span> {s.effect_duration_hours} hours</div>
          )}
          {s.critical_glitch_duration_hours > 0 && (
            <div><span className="font-medium">Critical Glitch Duration:</span> {s.critical_glitch_duration_hours} hours</div>
          )}
          {s.damage_resistance_penalty !== 0 && (
            <div><span className="font-medium">Damage Resistance Penalty:</span> <span className="text-red-400">-{s.damage_resistance_penalty}</span> vs Black/Psychotropic IC</div>
          )}
          {s.requires_addiction && <div><span className="font-medium">Requires:</span> Mild Addiction to BTLs</div>}
        </div>
      </div>
    );
  }

  // Sensitive System Effects
  if (bonus.sensitive_system_effects) {
    const s = bonus.sensitive_system_effects;
    sections.push(
      <div key="sensitiveSystemEffects" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Sensitive System</h3>
        <div className="text-gray-200 text-sm ml-4 space-y-1">
          {s.cyberware_essence_multiplier !== 1 && (
            <div><span className="font-medium">Cyberware Essence Multiplier:</span> {s.cyberware_essence_multiplier}x</div>
          )}
          {s.bioware_rejected && <div><span className="font-medium">Bioware:</span> Rejected</div>}
          {s.drain_fading_test_threshold > 0 && (
            <div><span className="font-medium">Drain/Fading Test Threshold:</span> {s.drain_fading_test_threshold}</div>
          )}
          {s.drain_fading_value_increase > 0 && (
            <div><span className="font-medium">Drain/Fading Increase:</span> <span className="text-red-400">+{s.drain_fading_value_increase}</span> on failed test</div>
          )}
        </div>
      </div>
    );
  }

  // Simsense Vertigo Penalty
  if (bonus.simsense_vertigo_penalty !== undefined && bonus.simsense_vertigo_penalty > 0) {
    sections.push(
      <div key="simsenseVertigoPenalty" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Simsense Vertigo</h3>
        <p className="text-gray-200 text-sm ml-4">
          <span className="text-red-400">-{bonus.simsense_vertigo_penalty}</span> dice pool penalty to AR/VR/simsense tests
        </p>
      </div>
    );
  }

  // SIN Type
  if (bonus.sin_type) {
    sections.push(
      <div key="sinType" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">SIN Type</h3>
        <p className="text-gray-200 text-sm ml-4">{bonus.sin_type}</p>
      </div>
    );
  }

  // Social Stress Affected Skills
  if (bonus.social_stress_affected_skills && bonus.social_stress_affected_skills.length > 0) {
    sections.push(
      <div key="socialStressAffectedSkills" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Social Stress - Affected Skills</h3>
        <p className="text-gray-200 text-sm ml-4">{bonus.social_stress_affected_skills.join(', ')}</p>
      </div>
    );
  }

  // Spirit Bane Spirit Type
  if (bonus.spirit_bane_spirit_type) {
    sections.push(
      <div key="spiritBaneSpiritType" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Spirit Bane</h3>
        <p className="text-gray-200 text-sm ml-4">Affected spirit type: {bonus.spirit_bane_spirit_type}</p>
      </div>
    );
  }

  // Social Skill Cost Multiplier
  if (bonus.social_skill_cost_multiplier !== undefined && bonus.social_skill_cost_multiplier !== 1) {
    sections.push(
      <div key="socialSkillCostMultiplier" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Social Skill Cost</h3>
        <p className="text-gray-200 text-sm ml-4">
          Cost to learn Social skills multiplied by {bonus.social_skill_cost_multiplier}x
        </p>
      </div>
    );
  }

  // Knowledge Skill Restrictions
  if (bonus.knowledge_skill_restrictions) {
    const k = bonus.knowledge_skill_restrictions;
    sections.push(
      <div key="knowledgeSkillRestrictions" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Knowledge Skill Restrictions</h3>
        <div className="text-gray-200 text-sm ml-4 space-y-1">
          {k.affected_categories && k.affected_categories.length > 0 && (
            <div><span className="font-medium">Affected Categories:</span> {k.affected_categories.join(', ')}</div>
          )}
          {k.cost_multiplier !== 1 && (
            <div><span className="font-medium">Cost Multiplier:</span> {k.cost_multiplier}x</div>
          )}
          {k.cannot_default && <div><span className="font-medium">Cannot Default:</span> Yes</div>}
        </div>
      </div>
    );
  }

  // Agility Test Penalty
  if (bonus.agility_test_penalty !== undefined && bonus.agility_test_penalty > 0) {
    sections.push(
      <div key="agilityTestPenalty" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Agility Test Penalty</h3>
        <p className="text-gray-200 text-sm ml-4">
          <span className="text-red-400">-{bonus.agility_test_penalty}</span> dice pool penalty to Agility-based tests
        </p>
      </div>
    );
  }

  // Disease Power Increase
  if (bonus.disease_power_increase !== undefined && bonus.disease_power_increase > 0) {
    sections.push(
      <div key="diseasePowerIncrease" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Disease Power</h3>
        <p className="text-gray-200 text-sm ml-4">
          <span className="text-red-400">+{bonus.disease_power_increase}</span> increase to disease Power for Resistance Tests
        </p>
      </div>
    );
  }

  // Astral Signature Modifiers
  if (bonus.astral_signature_modifiers && bonus.astral_signature_modifiers.length > 0) {
    sections.push(
      <div key="astralSignatureModifiers" className="mb-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Astral Signature Modifiers</h3>
        <ul className="list-none space-y-1 ml-4">
          {bonus.astral_signature_modifiers.map((a, idx) => (
            <li key={idx} className="text-gray-200 text-sm">
              Signature duration: {a.signature_duration_multiplier}x
              {a.assensing_penalty !== 0 && (
                <> | Assensing penalty: <span className="text-red-400">-{a.assensing_penalty}</span></>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (sections.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-200 mb-3">Effects & Bonuses</h2>
      <div className="p-4 bg-sr-light-gray border border-sr-light-gray rounded-md">
        <div className="space-y-3">{sections}</div>
      </div>
    </section>
  );
}

// Display Quality Requirements
function QualityRequirementsDisplay({ requirements }: { requirements: QualityRequirements }) {
  const sections: JSX.Element[] = [];

  if (requirements.metatype_restrictions && requirements.metatype_restrictions.length > 0) {
    sections.push(
      <div key="metatypeRestrictions" className="mb-2">
        <span className="text-sm text-gray-400">Metatype Restrictions: </span>
        <span className="text-gray-100">{requirements.metatype_restrictions.join(', ')}</span>
      </div>
    );
  }

  if (requirements.magic_required) {
    sections.push(
      <div key="magicRequired" className="mb-2">
        <span className="text-sm text-gray-400">Magic Required: </span>
        <span className="text-gray-100">Yes</span>
      </div>
    );
  }

  if (requirements.resonance_required) {
    sections.push(
      <div key="resonanceRequired" className="mb-2">
        <span className="text-sm text-gray-400">Resonance Required: </span>
        <span className="text-gray-100">Yes</span>
      </div>
    );
  }

  if (requirements.chargen_only) {
    sections.push(
      <div key="chargenOnly" className="mb-2">
        <span className="text-sm text-gray-400">Character Creation Only: </span>
        <span className="text-gray-100">Yes</span>
      </div>
    );
  }

  if (requirements.max_times !== undefined && requirements.max_times > 0) {
    sections.push(
      <div key="maxTimes" className="mb-2">
        <span className="text-sm text-gray-400">Max Times: </span>
        <span className="text-gray-100">{requirements.max_times === 1 ? 'Once' : requirements.max_times}</span>
      </div>
    );
  }

  if (requirements.other_restrictions && requirements.other_restrictions.length > 0) {
    sections.push(
      <div key="otherRestrictions" className="mb-2">
        <span className="text-sm text-gray-400">Other Restrictions: </span>
        <div className="text-gray-100 mt-1">
          {requirements.other_restrictions.map((r, idx) => (
            <div key={idx} className="ml-4">{r}</div>
          ))}
        </div>
      </div>
    );
  }

  if (sections.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-200 mb-3">Requirements</h2>
      <div className="p-4 bg-sr-light-gray border border-sr-light-gray rounded-md">
        <div className="space-y-2">{sections}</div>
      </div>
    </section>
  );
}

export function QualityViewModal({ quality, isOpen, onOpenChange }: QualityViewModalProps) {
  const handleClose = () => {
    onOpenChange(false);
  };

  if (!quality || !isOpen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ zIndex: 50 }}>
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" onClick={handleClose} />
        <Dialog className="relative bg-sr-gray border border-sr-light-gray rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden outline-none flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-sr-light-gray">
            <Heading
              slot="title"
              className="text-2xl font-semibold text-gray-100"
            >
              {quality.name}
            </Heading>
            <Button
              onPress={handleClose}
              aria-label="Close quality view"
              className="p-2 text-gray-400 hover:text-gray-100 hover:bg-sr-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-sr-accent transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <section>
                <h2 className="text-lg font-semibold text-gray-200 mb-3">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Name</label>
                    <p className="text-gray-100 mt-1">{quality.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Type</label>
                    <p className="text-gray-100 mt-1">
                      <span className={`px-2 py-1 rounded text-sm ${
                        quality.type === 'positive' 
                          ? 'bg-green-900/30 text-green-300' 
                          : 'bg-red-900/30 text-red-300'
                      }`}>
                        {quality.type === 'positive' ? 'Positive' : 'Negative'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Karma Cost</label>
                    <p className={`text-gray-100 mt-1 font-semibold ${
                      quality.cost.base_cost < 0 ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {formatKarmaCost(quality.cost)}
                    </p>
                  </div>
                  {quality.source && (
                    <>
                      <div>
                        <label className="text-sm text-gray-400">Source</label>
                        <p className="text-gray-100 mt-1">{quality.source.source}</p>
                      </div>
                      {quality.source.page && (
                        <div>
                          <label className="text-sm text-gray-400">Page</label>
                          <p className="text-gray-100 mt-1">{quality.source.page}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </section>

              {/* Description */}
              {quality.description && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Description</h2>
                  <div className="p-4 bg-sr-light-gray border border-sr-light-gray rounded-md">
                    <p className="text-gray-200 text-sm whitespace-pre-wrap">{quality.description}</p>
                  </div>
                </section>
              )}

              {/* Requirements */}
              {quality.requirements && (
                <QualityRequirementsDisplay requirements={quality.requirements} />
              )}

              {/* Bonuses/Effects */}
              {quality.bonus && (
                <QualityBonusDisplay bonus={quality.bonus} />
              )}
            </div>
          </div>

          <div className="p-6 border-t border-sr-light-gray flex justify-end">
            <Button
              onPress={handleClose}
              className="px-4 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 hover:bg-sr-light-gray focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent transition-colors"
            >
              Close
            </Button>
          </div>
        </Dialog>
      </div>
    </Modal>
  );
}
