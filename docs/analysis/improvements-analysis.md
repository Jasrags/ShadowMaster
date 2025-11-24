# Analysis Report: improvements.xml

**File**: `data\chummerxml\improvements.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 699
- **Unique Fields**: 6
- **Unique Attributes**: 1
- **Unique Element Types**: 10

## Fields

### field
**Path**: `chummer/improvements/improvement/fields/field`

- **Count**: 106
- **Presence Rate**: 100.0%
- **Unique Values**: 22
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-23 characters
- **Examples**:
  - `SelectSpecialAttribute`
  - `SelectAttribute`
  - `val`
  - `min`
  - `max`
- **All Values**: SelectAdeptPower, SelectAttribute, SelectComplexForm, SelectEcho, SelectKnowSkill, SelectMetamagic, SelectPhysicalAttribute, SelectSkill, SelectSkillCategory, SelectSkillGroup, SelectSpecialAttribute, SelectSpell, SelectWeaponCategory, applytorating, aug, free, max, min, percent, val

### name
**Path**: `chummer/improvements/improvement/name`

- **Count**: 86
- **Presence Rate**: 100.0%
- **Unique Values**: 86
- **Type Patterns**: string
- **Length Range**: 5-53 characters
- **Examples**:
  - `Enable Special Attribute`
  - `Attribute`
  - `Replace Attribute`
  - `Enable Spells and Spirits Tab`
  - `Enable Technomancer Tab`

### id
**Path**: `chummer/improvements/improvement/id`

- **Count**: 86
- **Presence Rate**: 100.0%
- **Unique Values**: 85
- **Type Patterns**: string
- **Length Range**: 5-27 characters
- **Examples**:
  - `enableattribute`
  - `specificattribute`
  - `replaceattribute`
  - `enablemagiciantab`
  - `enabletechnomancertab`

### internal
**Path**: `chummer/improvements/improvement/internal`

- **Count**: 86
- **Presence Rate**: 100.0%
- **Unique Values**: 74
- **Type Patterns**: string
- **Length Range**: 5-25 characters
- **Examples**:
  - `enableattribute`
  - `specificattribute`
  - `replaceattributes`
  - `enabletab`
  - `enabletab`

### page
**Path**: `chummer/improvements/improvement/page`

- **Count**: 86
- **Presence Rate**: 100.0%
- **Unique Values**: 85
- **Type Patterns**: string
- **Length Range**: 56-580 characters
- **Examples**:
  - `Unlocks the controls for an attribute, allowing the values to be increased. Expected values are MAG, RES or DEP for Magic, Resonance and Depth respectively.`
  - `Adjusts the values for one of the character's Attributes. Positive numbers increase an Attribute. Negative numbers decrease an Attribute. Select an Attribute to affect by clicking the Select Value button. Value adjusts the Attribute's current value. Minimum adjusts the Metatype's minimum value for the Attribute. Maximum adjusts the Metatype's maximum value for the Attribute. Augmented Maximum Maximum adjusts the Metatype's augmented maximum value for the Attribute. Fields may be left at 0 if you do not want to affect that particular aspect of the Attribute.`
  - `Overrides the Metatype limitations for an attribute. Minimum adjusts the Metatype's minimum value for the Attribute. Maximum adjusts the Metatype's maximum value for the Attribute. Augmented Maximum Maximum adjusts the Metatype's augmented maximum value for the Attribute. Fields may be left at 0 if you do not want to affect that particular aspect of the Attribute.`
  - `Enables the character's Spells and Spirits tab, allowing them to buy spells and bind spirits. The character is flagged as a Magician for the purposes of quality requirements, but does not receive access to the Initiation tab, unlock their Magic attribute or receive any of the Magical skills. Incompatible with improvements that enable the Complex Forms and Sprites tab.`
  - `Enables the character's 'Complex Forms and Sprites' tab, allowing them to purchase Complex Forms and compile Sprites. The character is flagged as a Technomancer for the purposes of quality requirements, but does not receive access to the Submersion tab, unlock their Resonance attribute or receive any of the Resonance skills. Incompatible with improvements that enable the Spells and Spirits tab.`

### xml
**Path**: `chummer/improvements/improvement/xml`

- **Count**: 79
- **Presence Rate**: 100.0%
- **Unique Values**: 27
- **Type Patterns**: string
- **Length Range**: 3-106 characters
- **Examples**:
  - `<name>{select}</name>`
  - `<name>{select}</name><val>{val}</val><min>{min}</min><max>{max}</max><aug>{aug}</aug>`
  - `<replaceattribute><name>{select}</name><min>{min}</min><max>{max}</max><aug>{aug}</aug></replaceattribute>`
  - `<name>magician</name>`
  - `<name>technomancer</name>`

## Attributes

### xml@forced
**Path**: `chummer/improvements/improvement/xml@forced`

- **Count**: 4
- **Unique Values**: 1
- **Examples**:
  - `True`
  - `True`
  - `True`
  - `True`

## Type Improvement Recommendations

### Enum Candidates
- **field** (`chummer/improvements/improvement/fields/field`): 22 unique values
  - Values: SelectAdeptPower, SelectAttribute, SelectComplexForm, SelectEcho, SelectKnowSkill, SelectMetamagic, SelectPhysicalAttribute, SelectSkill, SelectSkillCategory, SelectSkillGroup, SelectSpecialAttribute, SelectSpell, SelectWeaponCategory, applytorating, aug, free, max, min, percent, val
