package v5

// Code generated from improvements.xml. DO NOT EDIT.

var improvementsData = &ImprovementsChummer{
	Improvements: ImprovementItems{
		Improvement: []ImprovementItem{
			{
				Name: "Enable Special Attribute",
				ID: "enableattribute",
				Internal: "enableattribute",
				Fields: &ImprovementFields{
					Field: []string{
						"SelectSpecialAttribute",
					},
				},
				XML: stringPtr("<name>{select}</name>"),
				Page: "Unlocks the controls for an attribute, allowing the values to be increased. Expected values are MAG, RES or DEP for Magic, Resonance and Depth respectively.",
			},
			{
				Name: "Attribute",
				ID: "specificattribute",
				Internal: "specificattribute",
				Fields: &ImprovementFields{
					Field: []string{
						"SelectAttribute",
						"val",
						"min",
						"max",
						"aug",
					},
				},
				XML: stringPtr("<name>{select}</name><val>{val}</val><min>{min}</min><max>{max}</max><aug>{aug}</aug>"),
				Page: "Adjusts the values for one of the character's Attributes. Positive numbers increase an Attribute. Negative numbers decrease an Attribute. Select an Attribute to affect by clicking the Select Value button. Value adjusts the Attribute's current value. Minimum adjusts the Metatype's minimum value for the Attribute. Maximum adjusts the Metatype's maximum value for the Attribute. Augmented Maximum Maximum adjusts the Metatype's augmented maximum value for the Attribute. Fields may be left at 0 if you do not want to affect that particular aspect of the Attribute.",
			},
			{
				Name: "Replace Attribute",
				ID: "replaceattribute",
				Internal: "replaceattributes",
				Fields: &ImprovementFields{
					Field: []string{
						"SelectAttribute",
						"min",
						"max",
						"aug",
					},
				},
				XML: stringPtr("<replaceattribute><name>{select}</name><min>{min}</min><max>{max}</max><aug>{aug}</aug></replaceattribute>"),
				Page: "Overrides the Metatype limitations for an attribute. Minimum adjusts the Metatype's minimum value for the Attribute. Maximum adjusts the Metatype's maximum value for the Attribute. Augmented Maximum Maximum adjusts the Metatype's augmented maximum value for the Attribute. Fields may be left at 0 if you do not want to affect that particular aspect of the Attribute.",
			},
			{
				Name: "Enable Spells and Spirits Tab",
				ID: "enablemagiciantab",
				Internal: "enabletab",
				XML: stringPtr("<name>magician</name>"),
				Page: "Enables the character's Spells and Spirits tab, allowing them to buy spells and bind spirits. The character is flagged as a Magician for the purposes of quality requirements, but does not receive access to the Initiation tab, unlock their Magic attribute or receive any of the Magical skills. Incompatible with improvements that enable the Complex Forms and Sprites tab.",
			},
			{
				Name: "Enable Technomancer Tab",
				ID: "enabletechnomancertab",
				Internal: "enabletab",
				XML: stringPtr("<name>technomancer</name>"),
				Page: "Enables the character's 'Complex Forms and Sprites' tab, allowing them to purchase Complex Forms and compile Sprites. The character is flagged as a Technomancer for the purposes of quality requirements, but does not receive access to the Submersion tab, unlock their Resonance attribute or receive any of the Resonance skills. Incompatible with improvements that enable the Spells and Spirits tab.",
			},
			{
				Name: "Force Disable Initiation/Submersion Tab",
				ID: "disableinitiationtab",
				Internal: "disabletab",
				XML: stringPtr("<name>initiation</name>"),
				Page: "Forcibly disables the character's Initiation or Submersion tab, forbidding them from getting metamagics or echoes.",
			},
			{
				Name: "Enable Critter Tab",
				ID: "enablecrittertab",
				Internal: "enabletab",
				XML: stringPtr("<name>critter</name>"),
				Page: "Enables the character's Critter Powers tab, allowing them to buy critter powers. The character is flagged as a Critter.",
			},
			{
				Name: "Cyber-Singularity Seeker/Redliner (Attribute)",
				ID: "cyberseeker",
				Internal: "cyberseeker",
				Fields: &ImprovementFields{
					Field: []string{
						"SelectAttribute",
					},
				},
				XML: stringPtr("{select}"),
				Page: "Grants bonuses to the specified attribute based on the number of cyberlimbs a character has. Special attributes are invalid",
			},
			{
				Name: "Cyber-Singularity Seeker/Redliner (Condition Monitor)",
				ID: "cyberseeker",
				Internal: "cyberseeker",
				XML: stringPtr("BOX"),
				Page: "Grants bonuses to the character's physical Condition Monitor based on the number of cyberlimbs a character has. See Redliner in Chrome Flesh for more details.",
			},
			{
				Name: "Condition Monitor, Physical",
				ID: "conditionmonitorphysical",
				Internal: "conditionmonitor",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("<physical>{val}</physical>"),
				Page: "Adjusts the number of boxes the character has in their Physical Condition Monitor. Positive numbers increase the number of boxes in the Condition Monitor. Negative numbers reduce the number of boxes in the Condition Monitor.",
			},
			{
				Name: "Condition Monitor, Stun",
				ID: "conditionmonitorstun",
				Internal: "conditionmonitor",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("<stun>{val}</stun>"),
				Page: "Adjusts the number of boxes the character has in their Stun Condition Monitor. Positive numbers increase the number of boxes in the Condition Monitor. Negative numbers reduce the number of boxes in the Condition Monitor.",
			},
			{
				Name: "Condition Monitor, Threshold",
				ID: "conditionmonitorthreshold",
				Internal: "conditionmonitor",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("<threshold>{val}</threshold>"),
				Page: "Adjusts the number of boxes between each Condition Monitor Threshold. Positive numbers increase the number of boxes between each Threshold. Negative numbers reduce the number of boxes between each Threshold.",
			},
			{
				Name: "Condition Monitor, Threshold Offset",
				ID: "conditionmonitoroffset",
				Internal: "conditionmonitor",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("<thresholdoffset>{val}</thresholdoffset>"),
				Page: "Adjusts the number of boxes between the start of each Condition Monitor and the first Threshold. Positive numbers increase the starting position of the first Threshold. Negative numbers reduce the starting position of each Threshold.",
			},
			{
				Name: "Block Skillgroup Defaulting",
				ID: "blockskillgroupdefaulting",
				Internal: "blockskillgroupdefaulting",
				Fields: &ImprovementFields{
					Field: []string{
						"SelectSkillGroup",
					},
				},
				XML: stringPtr(""),
				Page: "Prevents the character from seeing dicepool values for skills in the selected skillgroup.",
			},
			{
				Name: "Attribute Level",
				ID: "attributelevel",
				Internal: "attributelevel",
				Fields: &ImprovementFields{
					Field: []string{
						"SelectAttribute",
						"val",
					},
				},
				XML: stringPtr("<name>{select}</name><val>{val}</val>"),
				Page: "Adds to the selected attribute's base Value, increasing Karma costs for subsequent purchases.",
			},
			{
				Name: "Skill Level",
				ID: "skilllevel",
				Internal: "skilllevel",
				Fields: &ImprovementFields{
					Field: []string{
						"SelectSkill",
						"val",
					},
				},
				XML: stringPtr("<name>{select}</name><val>{val}</val>"),
				Page: "Adds to the selected attribute's base Value, increasing Karma costs for subsequent purchases.",
			},
			{
				Name: "KnowSoft",
				ID: "knowsoft",
				Internal: "knowsoft",
				Fields: &ImprovementFields{
					Field: []string{
						"SelectKnowSkill",
						"val",
					},
				},
				XML: stringPtr("<name>{select}</name><val>{val}</val><require>skilljack</require>"),
				Page: "Creates a Knowledge Skill that requires the skillsoftaccess improvement to be activated.",
			},
			{
				Name: "Adept Power",
				ID: "specificpower",
				Internal: "specificpower",
				Fields: &ImprovementFields{
					Field: []string{
						"SelectAdeptPower",
						"val",
						"free",
					},
				},
				XML: stringPtr("<name>{select}</name><val>{val}</val><free>{free}</free>"),
				Page: "Creates a free Adept Power. If the selected power already exists, the power will either be marked as free, or have free levels added to it.",
			},
			{
				Name: "Living Persona, Device Rating",
				ID: "livingpersonadevicerating",
				Internal: "livingpersona",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("<devicerating>{val}</devicerating>"),
				Page: "Adjusts the Living Persona's Device Rating by the value entered. Positive numbers improve the Device Rating. Negative numbers reduce the Device Rating. You may enter XPath operations as well. This has no effect on characters that do not have a Living Persona.",
			},
			{
				Name: "Living Persona, Program Limit",
				ID: "livingpersonaprogramlimit",
				Internal: "livingpersona",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("<programlimit>{val}</programlimit>"),
				Page: "Adjusts the Living Persona's Program Limit by the value entered. Positive numbers improve the Program Limit. Negative numbers reduce the Program Limit. You may enter XPath operations as well. This has no effect on characters that do not have a Living Persona.",
			},
			{
				Name: "Living Persona, Attack",
				ID: "livingpersonaattack",
				Internal: "livingpersona",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("<attack>{val}</attack>"),
				Page: "Adjusts the Living Persona's Attack by the value entered. Positive numbers improve Attack. Negative numbers reduce Attack. You may enter XPath operations as well. This has no effect on characters that do not have a Living Persona.",
			},
			{
				Name: "Living Persona, Sleaze",
				ID: "livingpersonasleaze",
				Internal: "livingpersona",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("<sleaze>{val}</sleaze>"),
				Page: "Adjusts the Living Persona's Sleaze by the value entered. Positive numbers improve Sleaze. Negative numbers reduce Sleaze. You may enter XPath operations as well. This has no effect on characters that do not have a Living Persona.",
			},
			{
				Name: "Living Persona, Data Processing",
				ID: "livingpersonadataprocessing",
				Internal: "livingpersona",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("<dataprocessing>{val}</dataprocessing>"),
				Page: "Adjusts the Living Persona's Data Processing by the value entered. Positive numbers improve Data Processing. Negative numbers reduce Data Processing. You may enter XPath operations as well. This has no effect on characters that do not have a Living Persona.",
			},
			{
				Name: "Living Persona, Firewall",
				ID: "livingpersonafirewall",
				Internal: "livingpersona",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("<firewall>{val}</firewall>"),
				Page: "Adjusts the Living Persona's Firewall by the value entered. Positive numbers improve Firewall. Negative numbers reduce Firewall. You may enter XPath operations as well. This has no effect on characters that do not have a Living Persona.",
			},
			{
				Name: "Skill",
				ID: "specificskill",
				Internal: "specificskill",
				Fields: &ImprovementFields{
					Field: []string{
						"SelectSkill",
						"val",
						"applytorating",
					},
				},
				XML: stringPtr("<name>{select}</name><bonus>{val}</bonus>{applytorating}"),
				Page: "Adjusts the value for one of the character's Skills by the value entered. Positive numbers increase the Skill. Negative numbers decrease the Skill. Select a Skill to affect by clicking the Select Value button. The modifier can be applied to the Skill's Rating by selecting Apply to Rating, otherwise the modifier is applied as a dice pool modifier.",
			},
			{
				Name: "Skills in Category",
				ID: "skillcategory",
				Internal: "skillcategory",
				Fields: &ImprovementFields{
					Field: []string{
						"SelectSkillCategory",
						"val",
						"applytorating",
					},
				},
				XML: stringPtr("<name>{select}</name><bonus>{val}</bonus>{applytorating}"),
				Page: "Adjusts the value for all of the Skills in one category by the value entered. Positive numbers increase the Skills. Negative numbers decrease the Skills. Select a Skill category to affect by clicking the Select Value button. The modifier can be applied to the Skills' Ratings by selecting Apply to Rating, otherwise the modifier is applied as a dice pool modifier.",
			},
			{
				Name: "Skills in Group",
				ID: "skillgroup",
				Internal: "skillgroup",
				Fields: &ImprovementFields{
					Field: []string{
						"SelectSkillGroup",
						"val",
						"applytorating",
					},
				},
				XML: stringPtr("<name>{select}</name><bonus>{val}</bonus>{applytorating}"),
				Page: "Adjusts the value for all of the Skills in a Skill Group by the value entered. Positive numbers increase the Skills. Negative numbers decrease the Skills. Select a Skill Group to affect by clicking the Select Value button. The modifier can be applied to the Skills' Ratings by selecting Apply to Rating, otherwise the modifier is applied as a dice pool modifier.",
			},
			{
				Name: "Skills linked to Attribute",
				ID: "skillattribute",
				Internal: "skillattribute",
				Fields: &ImprovementFields{
					Field: []string{
						"SelectAttribute",
						"val",
						"applytorating",
					},
				},
				XML: stringPtr("<name>{select}</name><bonus>{val}</bonus>{applytorating}"),
				Page: "Adjusts the value for all of the Skills linked to an Attribute by the value entered. Positive numbers increase the Skills. Negative numbers decrease the Skills. Select a linked Attribute to affect by clicking the Select Value button. The modifier can be applied to the Skills' Ratings by selecting Apply to Rating, otherwise the modifier is applied as a dice pool modifier.",
			},
			{
				Name: "Armor",
				ID: "armor",
				Internal: "armor",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the character's Armor Rating by the value entered. Positive numbers improve Armor. Negative numbers reduce Armor.",
			},
			{
				Name: "Reach",
				ID: "reach",
				Internal: "reach",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the character's Reach by the value entered. Positive numbers increase Reach. Negative numbers reduce Reach.",
			},
			{
				Name: "Unarmed DV",
				ID: "unarmeddv",
				Internal: "unarmeddv",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the Damage Value for a character's Unarmed Attacks by the value entered. Positive numbers increase the Damage Value. Negative numbers decrease the Damage Value.",
			},
			{
				Name: "Unarmed DV Physical",
				ID: "unarmeddvphysical",
				Internal: "unarmeddvphysical",
				XML: stringPtr(""),
				Page: "All of the character's Unarmed Attacks will do Physical damage instead of Stun damage.",
			},
			{
				Name: "Unarmed AP",
				ID: "unarmedap",
				Internal: "unarmedap",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the Armor Penetration value for a character's Unarmed Attacks by the value entered. Positive numbers reduce Armor Penetration. Negative numbers increase Armor Penetration.",
			},
			{
				Name: "Initiative",
				ID: "initiative",
				Internal: "initiative",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the character's Initiative by the value entered. Positive numbers increase Initiative. Negative numbers reduce Initiative.",
			},
			{
				Name: "Initiative Dice",
				ID: "initiativediceadd",
				Internal: "initiativediceadd",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the number of Initiative Dice the character receives by the value entered. Positive numbers increase the number of Initiative Dice. Negative numbers reduce the number of Initiative Dice.",
			},
			{
				Name: "Matrix Initiative",
				ID: "matrixinitiative",
				Internal: "matrixinitiative",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the character's Matrix Initiative by the value entered. Positive numbers increase Matrix Initiative. Negative numbers reduce Matrix Initiative.",
			},
			{
				Name: "Matrix Initiative Passes",
				ID: "matrixinitiativediceadd",
				Internal: "matrixinitiativediceadd",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the number of Matrix Initiative Passes the character receives by the value entered. Positive numbers increase the number of Matrix Initiative Passes. Negative numbers reduce the number of Matrix Initiative Passes.",
			},
			{
				Name: "Lifestyle Cost",
				ID: "lifestylecost",
				Internal: "lifestylecost",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the Nuyen cost of all Lifestyles by the percent value entered. All Lifestyles will now cost an additional X% per month. Positive number increase the Lifestyle's monthly Nuyen cost. Negative numbers reduce the Lifestyle's monthly Nuyen cost.",
			},
			{
				Name: "Genetech Cost",
				ID: "genetechcostmultiplier",
				Internal: "genetechcostmultiplier",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the Nuyen cost of Bioware in the Genetech categories by the percent value entered. All Genetech Nuyen costs will now be X% of their original value. Numbers lower than 100 reduce the Nuyen cost. Numbers higher than 100 increase the Nuyen cost.",
			},
			{
				Name: "Basic Bioware Essence Cost",
				ID: "basicbiowareessmultiplier",
				Internal: "basicbiowareessmultiplier",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the Essence cost of Bioware in the Basic category by the percent value entered. All Basic Bioware Essence costs will now be X% of their original value. Numbers lower than 100 reduce the Essence cost. Numbers higher than 100 increase the Essence cost.",
			},
			{
				Name: "Bioware Essence Cost",
				ID: "biowareessmultiplier",
				Internal: "biowareessmultiplier",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the Essence cost of Bioware by the percent value entered. All Bioware Essence costs will now be X% of their original value. Numbers lower than 100 reduce the Essence cost. Numbers higher than 100 increase the Essence cost.",
			},
			{
				Name: "Genetech Essence Cost",
				ID: "genetechessmultiplier",
				Internal: "genetechessmultiplier",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the Essence cost of Genetech by the percent value entered. All Genetech Essence costs will now be X% of their original value. Numbers lower than 100 reduce the Essence cost. Numbers higher than 100 increase the Essence cost.",
			},
			{
				Name: "Cyberware Essence Cost",
				ID: "cyberwareessmultiplier",
				Internal: "cyberwareessmultiplier",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the Essence cost of Cyberware by the percent value entered. All Cyberware Essence costs will now be X% of their original value. Numbers lower than 100 reduce the Essence cost. Numbers higher than 100 increase the Essence cost.",
			},
			{
				Name: "Weapon Category DV",
				ID: "weaponcategorydv",
				Internal: "weaponcategorydv",
				Fields: &ImprovementFields{
					Field: []string{
						"SelectWeaponCategory",
						"val",
					},
				},
				XML: stringPtr("<name>{select}</name><bonus>{val}</bonus>"),
				Page: "Adjusts the Damage Value of all Weapons in the selected category by the value entered. Positive numbers increase Weapon Damage Value. Negative numbers decrease Weapon Damage Value.",
			},
			{
				Name: "Power Points, Free Spirit",
				ID: "freespiritpowerpoints",
				Internal: "freespiritpowerpoints",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the number of Power Points a Free Spirit receives to spend on Critter Powers by the value entered. Positive numbers increase the number of Power Points. Negative numbers decrease the number of Power Points. This has no effect on non-Free Spirit characters.",
			},
			{
				Name: "Power Points, Adept",
				ID: "adeptpowerpoints",
				Internal: "adeptpowerpoints",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the number of Power Points an Adept receives to spend on Adept Powers by the value entered. Positive numbers increase the number of Power Points. Negative numbers decrease the number of Power Points. This has no effect on non-Adept characters.",
			},
			{
				Name: "Armor Encumbrance Penalty",
				ID: "armorencumbrancepenalty",
				Internal: "armorencumbrancepenalty",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the character's Armor Encumbrance penalty by the value entered. Positive numbers increase the Armor Encumbrance penalty (bad). Negative numbers decrease the Armor Encumbrance penalty (good).",
			},
			{
				Name: "Damage Resistance",
				ID: "damageresistance",
				Internal: "damageresistance",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the size of the character's Damage Resistance Test dice pool by the value entered. Positive numbers increase the size of the pool. Negative numbers decrease the size of the pool.",
			},
			{
				Name: "Judge Intentions",
				ID: "judgeintentions",
				Internal: "judgeintentions",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the character's Judge Intentions Special Attribute by the value entered. Positive numbers improve Judge Intentions. Negative numbers reduce Judge Intentions.",
			},
			{
				Name: "Composure",
				ID: "composure",
				Internal: "composure",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the character's Composure Special Attribute by the value entered. Positive numbers improve Composure. Negative numbers reduce Composure.",
			},
			{
				Name: "Lift and Carry",
				ID: "liftandcarry",
				Internal: "liftandcarry",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the character's Lift and Carry Special Attribute by the value entered. Positive numbers improve Lift and Carry. Negative numbers reduce Lift and Carry.",
			},
			{
				Name: "Memory",
				ID: "memory",
				Internal: "memory",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the character's Memory Special Attribute by the value entered. Positive numbers improve Memory. Negative numbers reduce Memory.",
			},
			{
				Name: "Concealability",
				ID: "concealability",
				Internal: "concealability",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the character's ability to conceal Weapons by the value entered. This bonus applies to the Concealability of all Weapons. Positive values improve Concealability. Negative values reduce Concealability.",
			},
			{
				Name: "Drain Resistance",
				ID: "drainresist",
				Internal: "drainresist",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the size of the character's Drain Resistance pool by the value entered. Positive values increase the size of the pool. Negative values decrease the size of the pool.",
			},
			{
				Name: "Fading Resistance",
				ID: "fadingresist",
				Internal: "fadingresist",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the size of the character's Fading Resistance pool by the value entered. Positive values increase the size of the pool. Negative values decrease the size of the pool.",
			},
			{
				Name: "Spells in Category",
				ID: "spellcategory",
				Internal: "spellcategory",
				Fields: &ImprovementFields{
					Field: []string{
						"SelectSpellCategory",
						"val",
					},
				},
				XML: stringPtr("<name>{select}</name><val>{val}</val>"),
				Page: "Adjusts the size of the character's Spellcasting pool when casting Spell in the selected category. Positive values improve Spellcasting. Negative values reduce Spellcasting.",
			},
			{
				Name: "Specific Spell Dicepool",
				ID: "spelldicepool",
				Internal: "spelldicepool",
				Fields: &ImprovementFields{
					Field: []string{
						"SelectSpell",
						"val",
					},
				},
				XML: stringPtr("<name>{select}</name><val>{val}</val>"),
				Page: "Adjusts the size of the character's Spellcasting pool when casting the Spell with the selected name. Positive values improve Spellcasting. Negative values reduce Spellcasting.",
			},
			{
				Name: "Skillsoft Access",
				ID: "skillsoftaccess",
				Internal: "skillsoftaccess",
				XML: stringPtr(""),
				Page: "The character can use Knowsoft and Linguasoft Skillsofts as though they had a direct neural link.",
			},
			{
				Name: "Essence Maximum",
				ID: "essencemax",
				Internal: "essencemax",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the character's Maximum Essence by the value entered. Positive values increase Maximum Essence. Negative values decrease Maximum Essence.",
			},
			{
				Name: "Throwing Weapon Range",
				ID: "throwrange",
				Internal: "throwrange",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts a character's STR for the purpose of determining the range of Throwing Weapons. Positive numbers increase the character's effective STR. Negative numbers reduce the character's effective STR.",
			},
			{
				Name: "Skillwire Rating",
				ID: "skillwire",
				Internal: "skillwire",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Grants the character access to Skillwires at the specified Rating which limits the effective Rating of all Skillsofts the character takes.",
			},
			{
				Name: "Swap Skill Attribute (Physical for Mental)",
				ID: "swapskillattribute",
				Internal: "swapskillattribute",
				Fields: &ImprovementFields{
					Field: []string{
						"SelectPhysicalAttribute",
					},
				},
				XML: stringPtr("<attribute>{select}</attribute>"),
				Page: "Swaps the Physical Attribute used by Active Skills with the corresponding Mental Attribute as described in the Astral Attributes table on SR4 192. (AGI/LOG; BOD/WIL; REA/INT; STR/CHA)",
			},
			{
				Name: "Quickening",
				ID: "quickeningmetamagic",
				Internal: "quickeningmetamagic",
				XML: stringPtr(""),
				Page: "Grants the character access to Quickening in the same manner as the Quickening Metamagic.",
			},
			{
				Name: "Basic Lifestyle Cost",
				ID: "basiclifestylecost",
				Internal: "basiclifestylecost",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the Nuyen cost of all basic Lifestyles by the percent value entered. All basic Lifestyles will now cost an additional X% per month. Basic Lifestyles are only those found in the SR4 book and do not include Advanced Lifestyles, Safehouses, or Bolt Holes. Positive number increase the basic Lifestyle's monthly Nuyen cost. Negative numbers reduce the basic Lifestyle's monthly Nuyen cost.",
			},
			{
				Name: "Throwing Weapon STR",
				ID: "throwstr",
				Internal: "throwstr",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts a character's STR for the purpose of determining the DV of Throwing Weapons. Positive numbers increase the character's effective STR. Negative numbers reduce the character's effective STR.",
			},
			{
				Name: "Knowledge Skill",
				ID: "specificknowskill",
				Internal: "specificskill",
				Fields: &ImprovementFields{
					Field: []string{
						"SelectKnowSkill",
						"val",
						"applytorating",
					},
				},
				XML: stringPtr("<name>{select}</name><bonus>{val}</bonus>{applytorating}"),
				Page: "Adjusts the value for one of the character's Knowledge Skills by the value entered. Positive numbers increase the Knowledge Skill. Negative numbers decrease the Knowledge Skill. Select a Knowledge Skill to affect by clicking the Select Value button. The modifier can be applied to the Knowledge Skill's Rating by selecting Apply to Rating, otherwise the modifier is applied as a dice pool modifier.",
			},
			{
				Name: "Enable Skill Movement",
				ID: "skillenablemovement",
				Internal: "skillenablemovement",
				Fields: &ImprovementFields{
					Field: []string{
						"SelectSkill",
					},
				},
				XML: stringPtr("{select}"),
				Page: "Enables a skill that requires fly or swim movement even if the character doesn't have that movement type. This allows skills like Flight to be used even without a flight speed, or Swimming to be used without a swim speed.",
			},
			{
				Name: "Ignore Condition Monitor Penalty, Stun",
				ID: "ignorecmpenaltystun",
				Internal: "ignorecmpenaltystun",
				XML: stringPtr(""),
				Page: "Reduces the characters Stun Condition Monitor Penalty to 0 while the Improvement is active.",
			},
			{
				Name: "Ignore Condition Monitor Penalty, Physical",
				ID: "ignorecmpenaltyphysical",
				Internal: "ignorecmpenaltyphysical",
				XML: stringPtr(""),
				Page: "Reduces the characters Physical Condition Monitor Penalty to 0 while the Improvement is active.",
			},
			{
				Name: "Street Cred Multiplier",
				ID: "streetcredmultiplier",
				Internal: "streetcredmultiplier",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Increases or reduces the multiplier used to calculate Street Cred.",
			},
			{
				Name: "Bonus Street Cred",
				ID: "streetcred",
				Internal: "streetcred",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Increases the character's Street Cred by the listed value.",
			},
			{
				Name: "Dodge",
				ID: "dodge",
				Internal: "dodge",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Increases the character's Dodge pool by the listed value.",
			},
			{
				Name: "Enable Cyberzombie Conversion",
				ID: "enablecyberzombie",
				Internal: "enablecyberzombie",
				XML: stringPtr(""),
				Page: "Allows the character to be converted into a Cyberzombie.",
			},
			{
				Name: "Free Spells",
				ID: "freespells",
				Internal: "freespells",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Allows the character to mark some spells as Free, avoiding Karma costs.",
			},
			{
				Name: "Mental Limit",
				ID: "mentallimit",
				Internal: "mentallimit",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the character's Mental Limit by the listed value.",
			},
			{
				Name: "Physical Limit",
				ID: "physicallimit",
				Internal: "physicallimit",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the character's Physical Limit by the listed value.",
			},
			{
				Name: "Social Limit",
				ID: "sociallimit",
				Internal: "sociallimit",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the character's Social Limit by the listed value.",
			},
			{
				Name: "Walk Multiplier",
				ID: "walkmultiplier",
				Internal: "walkmultiplier",
				Fields: &ImprovementFields{
					Field: []string{
						"category",
						"val",
						"percent",
					},
				},
				XML: stringPtr("<category>{category}</category><val>{val}</val><percent>{percent}</percent>"),
				Page: "Increases the walking speed of a character for a particular category of movement. Positive numbers increase the factor by which attributes are multiplied to get walking speeds. Negative numbers decrease the factor by which attributes are multiplied to get walking speeds. Category can be Ground, Swim, or Fly for walking speed on land, in water, and in the air respectively. Value increases the walking factor by a fixed amount. Percent increases the walking factor by a percentage amount. Fields may be left at 0 if you do not want to affect walking speed in that particular way.",
			},
			{
				Name: "Run Multiplier",
				ID: "runmultiplier",
				Internal: "runmultiplier",
				Fields: &ImprovementFields{
					Field: []string{
						"category",
						"val",
						"percent",
					},
				},
				XML: stringPtr("<category>{category}</category><val>{val}</val><percent>{percent}</percent>"),
				Page: "Increases the running speed of a character for a particular category of movement. Positive numbers increase the factor by which attributes are multiplied to get running speeds. Negative numbers decrease the factor by which attributes are multiplied to get running speeds. Category can be Ground, Swim, or Fly for running speed on land, in water, and in the air respectively. Value increases the running factor by a fixed amount. Percent increases the running factor by a percentage amount. Fields may be left at 0 if you do not want to affect running speed in that particular way.",
			},
			{
				Name: "Sprint Bonus",
				ID: "sprintbonus",
				Internal: "sprintbonus",
				Fields: &ImprovementFields{
					Field: []string{
						"category",
						"val",
						"percent",
					},
				},
				XML: stringPtr("<category>{category}</category><val>{val}</val><percent>{percent}</percent>"),
				Page: "Increases the sprinting speed of a character for a particular category of movement. Positive numbers increase the number of meters sprinted per hit. Negative numbers decrease the number of meters sprinted per hit. Category can be Ground, Swim, or Fly for sprinting speed on land, in water, and in the air respectively. Value increases sprinted meters per hit by a fixed amount. Percent increases the sprinted meters per hit by a percentage amount. Fields may be left at 0 if you do not want to affect sprinting speed in that particular way.",
			},
			{
				Name: "Add Metamagic",
				ID: "addmetamagic",
				Internal: "addmetamagic",
				Fields: &ImprovementFields{
					Field: []string{
						"SelectMetamagic",
					},
				},
				XML: stringPtr("{select}"),
				Page: "Adds a free metamagic to the character. Any metamagic can be added, even ones for which the character would not be normally eligible.",
			},
			{
				Name: "Add Echo",
				ID: "addecho",
				Internal: "addecho",
				Fields: &ImprovementFields{
					Field: []string{
						"SelectEcho",
					},
				},
				XML: stringPtr("{select}"),
				Page: "Adds a free echo to the character. Any echo can be added, even ones for which the character would not be normally eligible.",
			},
			{
				Name: "Add Spell",
				ID: "addspell",
				Internal: "addspell",
				Fields: &ImprovementFields{
					Field: []string{
						"SelectSpell",
					},
				},
				XML: stringPtr("{select}"),
				Page: "Adds a free spell to the character. Any spell can be added, even ones for which the character would not be normally eligible.",
			},
			{
				Name: "Add Complex Form",
				ID: "addcomplexform",
				Internal: "addcomplexform",
				Fields: &ImprovementFields{
					Field: []string{
						"SelectComplexForm",
					},
				},
				XML: stringPtr("{select}"),
				Page: "Adds a free Complex Form to the character. Any Complex Form can be added, even ones for which the character would not be normally eligible.",
			},
			{
				Name: "Surprise",
				ID: "surprise",
				Internal: "surprise",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the character's Surprise dicepool by the value entered. Positive numbers improve the dicepool. Negative numbers reduce the dicepool.",
			},
			{
				Name: "Availability",
				ID: "availability",
				Internal: "availability",
				Fields: &ImprovementFields{
					Field: []string{
						"val",
					},
				},
				XML: stringPtr("{val}"),
				Page: "Adjusts the availability of all of the character's items by the value entered. Positive numbers increase availability. Negative numbers reduce availability.",
			},
		},
	},
}

// GetImprovementsData returns the loaded improvements data.
func GetImprovementsData() *ImprovementsChummer {
	return improvementsData
}

// GetAllImprovements returns all improvements.
func GetAllImprovements() []ImprovementItem {
	return improvementsData.Improvements.Improvement
}

// GetImprovementByID returns the improvement with the given ID, or nil if not found.
func GetImprovementByID(id string) *ImprovementItem {
	improvements := GetAllImprovements()
	for i := range improvements {
		if improvements[i].ID == id {
			return &improvements[i]
		}
	}
	return nil
}
