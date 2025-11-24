package v5

// dataQualities contains all quality definitions
var dataQualities = map[string]QualityDefinition{
	"ambidextrous": {
		Name: "Ambidextrous",
		Type: QualityTypePositive,
		Cost: CostStructure{
			BaseCost:  4,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "The Ambidextrous character can handle objects equally well with either hand. Without this quality, any action performed solely with the off–hand (i.e., firing a gun) suffers a –2 dice pool modifier (see Attacker Using Off-Hand Weapon, p. 178).",
		Bonus: &QualityBonus{
			Ambidextrous: []bool{true},
		},
		Requirements: nil,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"analytical_mind": {
		Name: "Analytical Mind",
		Type: QualityTypePositive,
		Cost: CostStructure{
			BaseCost:  5,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "Analytical Mind describes the uncanny ability to logically analyze information, deduce solutions to problems, or separate vital information from distractions and noise. It's useful in cracking cyphers, solving puzzles, figuring out traps, and sifting through data. This quality gives the character a +2 dice pool modifier to any Logic Tests involving pattern recognition, evidence analysis, clue hunting, or solving puzzles. This quality also reduces the time it takes the character to solve a problem by half.",
		Bonus: &QualityBonus{
			SkillDicePoolBonuses: []SkillDicePoolBonus{
				{
					Target:     "Logic",
					Bonus:      2,
					Conditions: []string{"pattern recognition", "evidence analysis", "clue hunting", "solving puzzles"},
				},
			},
		},
		Requirements: nil,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"aptitude": {
		Name: "Aptitude",
		Type: QualityTypePositive,
		Cost: CostStructure{
			BaseCost:  14,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "This quality is how you become even better than the best in the world. The standard limit for skills is 12. Every so often, there is a character who can exceed limitations and be truly exceptional in a particular skill. With this particular quality, the character can have one skill rated at 7 at character creation, and may eventually build that skill up to rating 13. Characters may only take the Aptitude quality once.",
		Bonus: &QualityBonus{
			SkillRatingModifiers: []SkillRatingModifier{
				{
					SkillName:          "", // Empty means player selects one skill
					MaxRatingAtChargen: 7,  // Can start at 7 instead of 6
					MaxRating:          13, // Can go up to 13 instead of 12
				},
			},
		},
		Requirements: &QualityRequirements{
			MaxTimes: 1, // Can only be taken once
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"astral_chameleon": {
		Name: "Astral Chameleon",
		Type: QualityTypePositive,
		Cost: CostStructure{
			BaseCost:  10,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "With the Astral Chameleon quality, the character's astral signature blends into the background of astral space and is difficult to detect. All signatures left by the character last only half as long as other astral signatures. Any individuals assensing astral signatures left behind by a character with this quality receive a –2 dice pool modifier for the Assensing Test. Only characters with a Magic rating and capable of leaving astral signatures may have this quality.",
		Bonus: &QualityBonus{
			AstralSignatureModifiers: []AstralSignatureModifier{
				{
					SignatureDurationMultiplier: 0.5,
					AssensingPenalty:            -2,
				},
			},
		},
		Requirements: &QualityRequirements{
			MagicRequired: true,
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"bilingual": {
		Name: "Bilingual",
		Type: QualityTypePositive,
		Cost: CostStructure{
			BaseCost:  5,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "A character with this quality reads, writes, and speaks a second language fluently. They can list a second language as a native tongue (see Language Skills, p. 150). This quality can only be acquired at character creation; selecting it gives the character a second free language skill during Step Five: Purchase Active, Knowledge, and Language Skills, (p. 88).",
		Bonus: &QualityBonus{
			FreeLanguageSkills: 1,
		},
		Requirements: &QualityRequirements{
			ChargenOnly: true,
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"blandness": {
		Name: "Blandness",
		Type: QualityTypePositive,
		Cost: CostStructure{
			BaseCost:  8,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "This character blends into a crowd; he's seldom noticed and easily forgotten. He is unremarkable in every aspect of physical appearance. Anyone attempting to describe the character cannot come up with anything more precise than \"average height, average build, average hair, etc.\" Increase the threshold for anyone to recall specific details about the character by 1. This means a Memory Test with a difficulty of Average (threshold of 2) becomes a Hard test (threshold of 3). Individuals attempting to shadow or physically locate a character with the Blandness quality in a populated setting receive a –2 dice pool modifier on all tests related to their search. The same penalty applies if they're asking around about the person based on the individual's physical appearance. The modifier does not, however, apply to magical or Matrix searches. If the character acquires any visible tattoos, scars, obvious cyberware, or other distinguishing features, the bonuses from the Blandness quality go away until the distinctive features are removed from the character's appearance. In certain circumstances and specific situations, the gamemaster may determine that Blandness does not apply. For example, a troll with the Blandness quality still towers head and shoulders over a crowd of humans and so still stands out, no matter how average their horns may be. The character only regains his bonus by leaving the situation where he stands out.",
		Bonus: &QualityBonus{
			MemoryTestThresholdIncrease: 1,
			ShadowingPenalty:            -2,
		},
		Requirements: nil,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"catlike": {
		Name: "Catlike",
		Type: QualityTypePositive,
		Cost: CostStructure{
			BaseCost:  7,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "A character with the Catlike quality is gifted with an uncanny elegance, a stealthy gait, and an almost preternatural ability to move without making a sound. They also claim they land on their feet when dropped, though they tend not to let people test this. This quality adds a +2 dice pool modifier to Sneaking skill tests.",
		Bonus: &QualityBonus{
			SkillDicePoolBonuses: []SkillDicePoolBonus{
				{
					Target:     "Sneaking",
					Bonus:      2,
					Conditions: []string{},
				},
			},
		},
		Requirements: nil,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"codeslinger": {
		Name: "Codeslinger",
		Type: QualityTypePositive,
		Cost: CostStructure{
			BaseCost:  10,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "Ones and zeroes are practically a native language to a Codeslinger. The character is adept at performing a particular Matrix action (which she selects when she selects this quality) and receives a +2 dice pool modifier to that Matrix action. This can only be selected for Matrix Actions (p. 237) that have a test associated with them.",
		Bonus: &QualityBonus{
			MatrixActionBonus: &SkillDicePoolBonus{
				Target:     "", // Player selects Matrix action
				Bonus:      2,
				Conditions: []string{},
			},
		},
		Requirements: nil,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"double_jointed": {
		Name: "Double-Jointed",
		Type: QualityTypePositive,
		Cost: CostStructure{
			BaseCost:  6,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "A Double-Jointed character has unusually flexible joints and can bend and contort his body into extreme positions. The character receives a +2 dice pool modifier for Escape Artist tests. The character may also be able to squeeze into small, cramped spaces where less limber characters cannot. They're also great at parties and bars.",
		Bonus: &QualityBonus{
			SkillDicePoolBonuses: []SkillDicePoolBonus{
				{
					Target:     "Escape Artist",
					Bonus:      2,
					Conditions: []string{},
				},
			},
		},
		Requirements: nil,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"exceptional_attribute": {
		Name: "Exceptional Attribute",
		Type: QualityTypePositive,
		Cost: CostStructure{
			BaseCost:  14,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "The Exceptional Attribute quality is how you get to be the charismatic troll, or the agile dwarf. It allows you to possess one attribute at a level one point above the metatype maximum limit. For example, an ork character with the Exceptional Attribute quality for Strength could take his Strength attribute up to 10 before augmentations are applied, instead of the normal limit of 9. Exceptional Attribute also applies toward Special Attributes such as Magic and Resonance. Edge cannot affected by the Exceptional Attribute (Edge is raised by another quality called Lucky). A character may only take Exceptional Attribute once, and only with the gamemaster's approval.",
		Bonus: &QualityBonus{
			AttributeModifiers: []AttributeModifier{
				{
					AttributeName:     "", // Player selects one attribute (except Edge)
					MaxRatingIncrease: 1,
				},
			},
		},
		Requirements: &QualityRequirements{
			MaxTimes:          1,
			OtherRestrictions: []string{"Cannot be applied to Edge attribute"},
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"first_impression": {
		Name: "First Impression",
		Type: QualityTypePositive,
		Cost: CostStructure{
			BaseCost:  11,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "The First Impression quality enables a character to slide easily into new environments, situations, groups, and jobs. Whether infiltrating a gang, making contacts in a new city, or wrangling an invite to a private meet, the character gains a temporary +2 dice pool modifier for relevant Social Tests such as Negotiation and Con during the first meeting. This modifier does not apply to second and subsequent encounters",
		Bonus: &QualityBonus{
			SocialTestBonus: &SkillDicePoolBonus{
				Target:     "Social Tests",
				Bonus:      2,
				Conditions: []string{"first meeting only"},
			},
		},
		Requirements: nil,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"focused_concentration": {
		Name: "Focused Concentration",
		Type: QualityTypePositive,
		Cost: CostStructure{
			BaseCost:  4,
			PerRating: true,
			MaxRating: 6,
		},
		Description: "A technomancer or magic user with the Focused Concentration quality has the discipline to manipulate mana or Resonance more precisely than otherwise possible. This precision reduces stress to the magic user's or technomancer's body. She is able to sustain one spell/complex form with a force/level equal to her Focused Concentration rating without suffering any penalties. For example, a magic user with Focused Concentration rating 3 may sustain a Force 3 Armor spell without taking the negative dice pool modifier for sustaining a spell. Sustaining any additional spells or complex forms incurs the standard –2 dice pool modifier per spell or complex form sustained. This quality may only be taken by magic user characters that are able to cast spells and technomancers.",
		Bonus: &QualityBonus{
			SustainedSpellModifier: &SustainedSpellModifier{
				PenaltyFreeSustainRating: 0, // Rating equals quality rating
			},
		},
		Requirements: &QualityRequirements{
			MagicRequired:     true,
			ResonanceRequired: false, // Can be either magic user OR technomancer
			OtherRestrictions: []string{"Must be able to cast spells (magic user) or be a technomancer"},
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"guts": {
		Name: "Guts",
		Type: QualityTypePositive,
		Cost: CostStructure{
			BaseCost:  10,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "When a bug spirit with dripping mandibles comes calling, the character with Guts is the one most likely to stand and fight instead of freaking the hell out. Guts gives a character a +2 dice pool modifier on tests to resist fear and intimidation, including magically induced fear from spells or critter powers.",
		Bonus: &QualityBonus{
			FearResistanceBonus: 2,
		},
		Requirements: nil,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"high_pain_tolerance": {
		Name: "High Pain Tolerance",
		Type: QualityTypePositive,
		Cost: CostStructure{
			BaseCost:  7,
			PerRating: true,
			MaxRating: 3,
		},
		Description: "High Pain Tolerance lets a character keep delivering the pain even if she's had plenty piled on her own head. A character with High Pain Tolerance can ignore one box of damage per rating point of this quality when calculating wound modifiers (see Wound Modifiers, p. 169). So a character with this quality at Rating 2 can take 4 boxes of damage but carry on without wound modifiers as if she only had 2 boxes of damage. The –1 wound modifier would then kick in when the character takes her fifth box in damage. This quality may not be used with the Pain Resistance adept power, pain editor bioware, or damage compensator bioware.",
		Bonus: &QualityBonus{
			WoundModifierIgnore: 0, // Rating equals number of boxes ignored
		},
		Requirements: &QualityRequirements{
			OtherRestrictions: []string{"May not be used with Pain Resistance adept power, pain editor bioware, or damage compensator bioware"},
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"addiction": {
		Name: "Addiction",
		Type: QualityTypeNegative,
		Cost: CostStructure{
			BaseCost:  -4, // Negative represents karma bonus, varies by severity (4-25)
			PerRating: false,
			MaxRating: 0,
		},
		Description: "A character with the Addiction quality is hooked on chemical substances, such as street drugs (novacoke, bliss, tempo); technological or magical devices, such as better-than-life (BTL) chips or foci; or potentially addictive activities such as gambling or sex. Physiological Addictions affect the Body's functions, producing pain, nausea, shakes, and other side effects that can impair the runner, particularly during withdrawal. Some possible effects of psychological Addictions include paranoia, anxiety, insomnia, poor concentration, mood disorders, and depression. For specific rules on Addiction Tests, Withdrawal Tests, and staying clean, see p. 414. The bonus Karma value of this quality depends on how severe the addiction is. Levels of addiction include: Mild, Moderate, Severe, or Burnout. Addictions get worse over prolonged periods of time without treatment. Each level of Addiction has a starting dosage level that tells the character how much of a substance or activity they must use for a craving to be sated. This level can be increased if the character has augmentations. The more severe a character's Addiction, the more substance or time devoted to the activity he needs to satisfy his cravings. At the lower end of the spectrum for the Addiction quality (Mild, Moderate), it is easier to hide the effects of an Addiction. At the most severe levels (Severe, Burnout), there are noticeable physical and mental signs of Addiction. These signs negatively impact his Social Tests even if he is not suffering the effects of withdrawal.",
		Bonus: &QualityBonus{
			AddictionModifiers: []AddictionModifier{
				// Note: Player selects type (physiological/psychological) and severity level
				// This is a template - actual values depend on player selection
				{
					Type:              "", // Player selects: "physiological" or "psychological"
					Severity:          "", // Player selects: "mild", "moderate", "severe", "burnout"
					DosageRequired:    0,  // Varies by severity: 1 (mild/moderate), 2 (severe), 3 (burnout)
					CravingsFrequency: "", // Varies: "once a month" (mild), "every two weeks" (moderate), "once a week" (severe), "daily" (burnout)
					WithdrawalPenalty: 0,  // Varies: -2 (mild), -4 (moderate/severe), -6 (burnout)
					SocialTestPenalty: 0,  // Varies: 0 (mild/moderate), -2 (severe), -3 (burnout)
					SubstanceName:     "", // Player selects the substance or activity
				},
			},
		},
		Requirements: nil,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"allergy": {
		Name: "Allergy",
		Type: QualityTypeNegative,
		Cost: CostStructure{
			BaseCost:  -5, // Negative represents karma bonus, varies 5-25 based on rarity + severity
			PerRating: false,
			MaxRating: 0,
		},
		Description: "A character with the Allergy quality is allergic to a substance or condition found in their environment. The value of this quality depends on two factors. The first is whether the substance or condition is Uncommon (2 Karma) or Common (7 Karma). Next, determine the severity of the symptoms: Mild (3 Karma), Moderate (8 Karma), Severe (13 Karma), or Extreme (18 Karma). Add the appropriate point values together to find the final value. For example, the value of an Uncommon Moderate Allergy (Silver) is 10 Karma (2+8 Karma). If a character is attacked with a substance to which they are allergic, they lose 1 die from their Resistance Test for each stage of severity of the Allergy (e.g., 1 die for a Mild allergy, 2 dice for a Moderate allergy, etc.).",
		Bonus: &QualityBonus{
			AllergyModifiers: []AllergyModifier{
				{
					Rarity:                "", // Player selects: "uncommon" or "common"
					Severity:              "", // Player selects: "mild", "moderate", "severe", "extreme"
					ResistanceTestPenalty: 0,  // 1 per severity stage
					AllergenName:          "", // Player selects
				},
			},
		},
		Requirements: nil,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"astral_beacon": {
		Name: "Astral Beacon",
		Type: QualityTypeNegative,
		Cost: CostStructure{
			BaseCost:  -10,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "The astral signature of a character with the Astral Beacon quality is like, well, a beacon—highly visible on the astral plane. The signature also lasts twice as long as it would without the Astral Beacon quality and others assensing it receive a –1 to the threshold of their Assensing Test for gathering information about it. Only characters with a Magic rating may take this quality.",
		Bonus: &QualityBonus{
			AstralSignatureModifiers: []AstralSignatureModifier{
				{
					SignatureDurationMultiplier: 2.0,
					AssensingPenalty:            0, // -1 to threshold (not dice pool)
				},
			},
		},
		Requirements: &QualityRequirements{
			MagicRequired: true,
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"bad_luck": {
		Name: "Bad Luck",
		Type: QualityTypeNegative,
		Cost: CostStructure{
			BaseCost:  -12,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "This character is cursed—his own luck often turns against him. When the character uses Edge, roll 1D6. On a result of 1, the point of Edge is spent, but it has the exact opposite effect intended. For example, if a character hopes to gain additional dice he loses that many dice from his dice pool. If a character spends Edge to go first in an Initiative Pass, he ends up going last. If a character spent Edge to negate a glitch, Bad Luck turns it into a critical glitch. The character suffers Bad Luck on only one Edge roll per game session. After the character has suffered his Bad Luck, he does not need to roll the test for Bad Luck for any more expenditures of Edge for the duration of that game session.",
		Bonus: &QualityBonus{
			BadLuckEdgePenalty: true,
		},
		Requirements: nil,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"bad_rep": {
		Name: "Bad Rep",
		Type: QualityTypeNegative,
		Cost: CostStructure{
			BaseCost:  -7,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "A character with a Bad Rep quality has a dark and lasting stain on her reputation. She may be a former Knight Errant cop known to have been particularly brutal in dealing with shadowrunners. Or word on the street might be that she once killed a member of her own runner team. If she's Awakened and comes from a polluted region, it may be generally accepted that she's a toxic shaman. Whether she is actually guilty of any wrongdoing is not relevant. What people believe she has done has permanently tainted the way they see her and how they deal with her. Whatever the reason, the character starts play with 3 points of Notoriety (p. 372) that can only be removed or decreased by confronting and resolving the source of the bad reputation. Only then may the Bad Rep quality be bought off with Karma.",
		Bonus: &QualityBonus{
			NotorietyBonus: 3,
		},
		Requirements: nil,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"code_of_honor": {
		Name: "Code of Honor",
		Type: QualityTypeNegative,
		Cost: CostStructure{
			BaseCost:  -15,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "The character has a binding Code of Honor when it comes to killing members of a specific group; it's a matter of unwavering principle. The character with the Code of Honor quality chooses a specific group that they will not kill or allow others to kill. Examples of this group could include women, children, innocent bystanders, or a specific metatype. A character can choose to protect specific paracritters, but only if the specified paracritter possesses the Sapience power. The gamemaster must approve the group that the character designates as being \"off limits.\" If the group (such as children) is not regularly encountered in campaigns, the gamemaster can reject the choice. If the player feels strongly about his choice, the gamemaster may allow the player to take two groups they will not harm, (i.e., women and children), one of which must be likely to be encountered in the campaign. A magician can legitimately choose to not destroy any type of spirit from which their Mentor Spirit bestows a bonus for summoning. This Code of Honor respects their Mentor Spirit and is worthy of the Karma. Characters can't pick an obscure or non-existent group to acquire this quality—you can't acquire Karma by vowing to never kill sapient hamsters, for example. Any time anyone attempts to kill a member of the character's protected list, the character must make a Charisma + Willpower (4) Test. A failed roll means the character must immediately put a stop the violence against the member of their protected group. If the situation forces the character to take action against any of his protected group, he will always choose non-lethal methods. Killing a member of the group he has sworn to protect is a line he will not cross for any reason. There are drawbacks to having a Code of Honor. For example, it can leave witnesses behind. For each person in the protected group the character leaves alive and who is in a position to remember them, increase the character's Public Awareness by 1. The character's job options are also limited—he will not take a job if the objective is the death of a member of his protected group and will have reservations about taking part in a mission with a high probability of causing collateral harm to members of his protected group. There is always a chance things will go wrong whenever non-lethal force is used. A person may have a life-threatening allergic reaction to a usually harmless knockout drug, or a heart condition that makes a taser shock deadly. For this reason, each time the character takes a violent action or allows others to take violent action against a member of his chosen group, the gamemaster makes a secret roll of 1D6. On a roll of 1, there is an unforeseen complication from the use of non-lethal force. With a metahuman it could be a life-threatening medical condition; with a spirit, an attempt to banish rather than destroy may in fact set the spirit free. When a complication arises, the gamemaster makes a secret Perception (4) Test for the character to notice if anything has gone wrong. If a person in the character's chosen group is killed, whether intentionally or inadvertently, the character loses a point of Karma for that adventure for each person in their \"protected group\" that is killed. The Code of Honor can take other forms as well. For example: Assassin's Creed: A character never kills anyone that they are not paid to kill. Being precise as an assassin, not leaving collateral damage, and being invisible are important hallmarks of those who believe in the Assassin's Creed. Characters who take this version of Code of Honor lose 1 point of Karma for every unintentional and/or unpaid murder they commit, and their Public Awareness goes up by 1 for each such death. Warrior's Code: The character who follows a Warrior's Code maintains a strict sense of personal honor. In 2075, this likely means a character will not kill an unarmed person, take lethal action against an opponent who is unaware or unprepared for an attack (i.e., a guard who doesn't know the runner is there), or knowingly take an action that could kill someone who is defenseless (i.e., from a stray bullet or allow someone to be killed from a sniper shot). The character loses 1 Karma per unarmed or defenseless person that they kill or allow to be killed through their actions.",
		Bonus: &QualityBonus{
			CodeOfHonorProtectedGroups: []string{}, // Player selects protected group(s)
		},
		Requirements: nil,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"codeblock": {
		Name: "Codeblock",
		Type: QualityTypeNegative,
		Cost: CostStructure{
			BaseCost:  -10,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "A character with the Codeblock quality always has trouble with a particular Matrix action. He receives a –2 dice pool modifier any time he attempts that type of Matrix action. Codeblock only applies to Matrix actions with an associated test; it does not apply to actions that do not require a test (p. 237). Characters cannot apply Codeblock toward hacking actions they are never likely to take.",
		Bonus: &QualityBonus{
			MatrixActionPenalty: &SkillDicePoolBonus{
				Target:     "", // Player selects Matrix action
				Bonus:      -2,
				Conditions: []string{},
			},
		},
		Requirements: nil,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"combat_paralysis": {
		Name: "Combat Paralysis",
		Type: QualityTypeNegative,
		Cost: CostStructure{
			BaseCost:  -12,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "A character with Combat Paralysis freezes in combat. On the character's first Initiative Test, the character divides their Initiative Score for that round in half (rounded up). In subsequent Combat Turns, the character may roll their normal Initiative. Combat Paralysis also gives the character a –3 dice pool modifier on Surprise Tests. If the character must make a Composure Test while under fire or in a similar combat situation, the gamemaster applies a +1 threshold modifier.",
		Bonus: &QualityBonus{
			InitiativeModifier: &InitiativeModifier{
				FirstTurnDivisor: 2,
			},
			SurpriseTestPenalty:            -3,
			ComposureTestThresholdModifier: 1,
		},
		Requirements: nil,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"dependents": {
		Name: "Dependents",
		Type: QualityTypeNegative,
		Cost: CostStructure{
			BaseCost:  -3, // Can be 3, 6, or 9 karma
			PerRating: false,
			MaxRating: 0,
		},
		Description: "A character with the Dependents quality has one or more loved ones who depend on them for emotional support and financial aid. Dependents may include children, parents, a spouse or lover, a sibling, or an old friend. Meeting the needs of a dependent should take up a fair amount of the character's time, as well as some of the character's money. Increase the amount of time it takes to learn a new skill or improve an existing skill by fifty percent. See the Character Advancement section on p. 103 for more information on how long it takes to improve skills. Also increase the base time for any long-term projects by fifty percent. A dependent could also be a hindrance in other ways—getting underfoot, sharing living space, involving herself in the character's work, borrowing the car, calling at the most inopportune moments, etc. For 3 Karma, the dependent is an occasional nuisance: dropping in unexpectedly (such as when the character must go to a meet), needing emotional support, favors, or other confirmations of friendship/commitment, and occasionally money. Examples of dependents at this level include: slacker sibling, long-term boyfriend/girlfriend, or a child not living with the character but for whom the character pays child support and visits regularly. Raise the character's lifestyle cost by 10 percent each month. For 6 Karma, the dependent is a regular inconvenience: needing attention and commitment on a regular basis, getting involved in the character's affairs, sharing living space. Examples of dependents at this level include: a live-in lover/wife/husband or family member, a child for whom the character shares custody and routinely has in his home (every other weekend, etc.), or a young child or close sibling for whom the character is responsible. Increase the character's lifestyle cost by 20 percent each month. At the 9 Karma level, the dependent is close family or a life partner and lives with the character. The dependent is a strain on the character's time and resources, and/or requires special care and attention that limits the character's availability for missions or specific actions. Examples of these dependents include large family sharing the living space, parents or grandparents with medical or physical needs, and full custody of any children. Increase the lifestyle cost for the character by 30 percent each month.",
		Bonus: &QualityBonus{
			DependentsLevel:                0, // Player selects: 3, 6, or 9
			LifestyleCostIncreasePercent:   0, // 10, 20, or 30 based on level
			SkillAdvancementTimeMultiplier: 1.5,
		},
		Requirements: nil,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"distinctive_style": {
		Name: "Distinctive Style",
		Type: QualityTypeNegative,
		Cost: CostStructure{
			BaseCost:  -5,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "A character with the Distinctive Style quality has at least one aspect of his appearance, mannerism, or personality that makes him inconveniently memorable. Choices for Distinctive Style include, but are by no means limited to: tattoos that cannot be easily concealed, an accent or atypical manner of speaking, bizarre fashion choices, scars, gang or prison signs, flashy custom augmentations, or non-metahuman modifications like a tail. Note that what's distinctive in one culture or location may not be in another. Whatever Distinctive Style the player selects makes her character easy to remember. Anyone who attempts to identify, trace, or physically locate this character (or gain information about him via legwork) receives a +2 dice pool modifier for relevant tests. If an NPC makes a Memory Test (p. 152) to determine how much they recall about the character, reduce the Difficulty Threshold by 1, to a minimum of 1. This quality is physical in nature and does not apply to astral searches. This quality may only be taken once. This quality is incompatible with Blandness.",
		Bonus: &QualityBonus{
			IdentificationBonus:         2,
			MemoryTestThresholdDecrease: 1,
		},
		Requirements: &QualityRequirements{
			MaxTimes:          1,
			OtherRestrictions: []string{"Incompatible with Blandness"},
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"elf_poser": {
		Name: "Elf Poser",
		Type: QualityTypeNegative,
		Cost: CostStructure{
			BaseCost:  -6,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "The Elf Poser is a human character who wants to be an elf. She associates with elves as much as possible, talks like elves, and alters her appearance to resemble an elf. Characters with this quality may undergo cosmetic surgery to get elf ears and elf eyes, and they may successfully pass as elves and avoid any negative Social modifiers associated with being a non-elf. Real elves consider Elf Posers an embarrassment, many humans think of them as sellouts, and other metatypes generally consider posers to be pathetic. If an elf discovers the character's secret, the elf is likely to treat her with contempt and hostility (see Social Modifiers Table, p. 140). An outed elf poser may also face stigma from prejudiced humans as a \"race traitor.\" Only human characters may take the Elf Poser quality.",
		Bonus:       nil,
		Requirements: &QualityRequirements{
			MetatypeRestrictions: []string{"Human"},
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"gremlins": {
		Name: "Gremlins",
		Type: QualityTypeNegative,
		Cost: CostStructure{
			BaseCost:  -4,
			PerRating: true,
			MaxRating: 4,
		},
		Description: "Characters with the Gremlins quality don't get along with technology. Devices malfunction inexplicably, software crashes unexpectedly, vehicles refuse to start, components become unusually fragile at his touch, and wireless links suffer faltering connections and odd interference whenever he's involved. For each level (maximum of 4), reduce the number of rolled 1s necessary to get a glitch (p. 45) by 1 whenever the character is attempting to use a moderately sophisticated device. For example, a character with a dice pool of 8 and Gremlins level 2 (8 Karma) would trigger a glitch if two or more 1s result from the test (instead of the normal 4). The gamemaster may also require the character to make a test for operation that would otherwise succeed automatically to see whether or not a glitch occurs. When describing the effects of a Gremlin-induced glitch, gamemasters should play up the notion of a particularly weird mechanical or electronics malfunction. Some examples of Gremlin-induced glitches include: the magazine falling out of a pistol when attempting a critical shot, a keypad inexplicably burning out while entering a code to disarm an alarm system, or the commlink interface converting to Sperethiel mid-sentence when attempting to access a restricted node. Note that Gremlins is a Negative quality—its effects hinder the character (and probably entertain others). The character cannot use his Gremlins quality to damage an opponent's high-tech equipment merely by touching it. Anything the character attempts to sabotage using only Gremlins will function flawlessly. (Obviously, he can try any ordinary means of sabotage, but Gremlins will haunt his efforts.) The effect only applies to external equipment and does not affect cyberware, bioware, or other implants.",
		Bonus: &QualityBonus{
			GlitchReductionPerLevel: 1, // Reduces 1s needed for glitch by 1 per level
		},
		Requirements: nil,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"incompetent": {
		Name: "Incompetent",
		Type: QualityTypeNegative,
		Cost: CostStructure{
			BaseCost:  -5,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "An Incompetent character possesses a total lack of knowledge or ability with a certain Active skill group—or, perhaps worse, they have some vague knowledge or the skills contained in the group, but they have neither the coordination nor the comprehension to come anywhere close to carrying it off properly. No matter how much effort they put into this area, they simply cannot grasp it—it would take a miracle for them to somehow, someday advance to the level of \"poor\" in those skills. Incompetent may not be applied to Language or Knowledge skills. The Incompetent character is treated as having skill level of \"unaware\" for all skills in the skill group (see the Skill Rating Table, p. 131). In some cases, a Success Test may be required for tasks most people take for granted. Characters may not possess that skill group for which they have the Incompetent quality. If gear grants a bonus or requires the use of a specific skill in which the character is Incompetent, the character gains no benefits from the gear. Gamemasters are free to reject any choices that would prove irrelevant or exploitative in actual play, such as Incompetent: Outdoors in a campaign based entirely inside an arcology. (This should go without saying, but just in case: Characters may never choose Incompetent for any skill group that they are physically incapable of using. A non-magician cannot take Incompetent in Sorcery, Conjuring, or Enchanting; a non-technomancer cannot be Incompetent in a skill that requires Resonance; and so on.) Incompetent may be purchased only once.",
		Bonus: &QualityBonus{
			IncompetentSkillGroups: []string{}, // Player selects one skill group
		},
		Requirements: &QualityRequirements{
			MaxTimes:          1,
			OtherRestrictions: []string{"May not be applied to Language or Knowledge skills"},
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"insomnia": {
		Name: "Insomnia",
		Type: QualityTypeNegative,
		Cost: CostStructure{
			BaseCost:  -10, // Can be 10 or 15 karma
			PerRating: false,
			MaxRating: 0,
		},
		Description: "A character with the Insomnia quality has trouble falling asleep and seldom feels well rested. Usually, this is only an annoyance. For runners, however, this can become a major problem when they are dependent on being able to rest at every opportunity to remain sharp. Insomnia can lengthen the amount of time it takes for a character to recover Stun damage. At the 10 Karma level, before a character rolls his Body + Willpower to recover Stun damage, the character rolls an Intuition + Willpower (4) Test. If the character succeeds on this test, the character is not impeded by Insomnia and the character regains Stun damage as normal. He also regains 1 point of Edge after 8 hours of restful sleep. If the character fails, double the amount of time it normally would take for a character to recover their Stun damage. So instead of healing a number of boxes of Stun damage in an hour, it now takes two hours per roll. If the character is affected by Insomnia, the character does not have his Edge refreshed and may not have it refreshed for up to another 24 hours. At the 15 Karma level, a failed Willpower + Intuition (4) Test means that all efforts to regain Stun damage through rest are negated during that time period, and the character must try again later. No Stun damage is regained from the attempt due to the insomnia the character experiences, and the character must wait for 24 hours before their Edge refreshes.",
		Bonus: &QualityBonus{
			InsomniaLevel: 0, // Player selects: 10 or 15
		},
		Requirements: nil,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"loss_of_confidence": {
		Name: "Loss of Confidence",
		Type: QualityTypeNegative,
		Cost: CostStructure{
			BaseCost:  -10,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "The Loss of Confidence quality means something has caused the character to lose confidence in himself and one of his abilities. Though a skilled decker, he failed to hack into a Stuffer Shack host, or despite high Agility, he glitched an easy Climbing Test and fell into a dumpster—whatever the reason, he now doubts himself and his abilities. In tests involving the affected skill, the character suffers a –2 dice pool modifier. If the character has a specialization with the skill, the character cannot use that specialization while suffering a loss of confidence. The skill chosen for the character to have a Loss of Confidence must be one that the character prides himself in and has invested in building. Only skills with a rating 4 or higher may suffer the Loss of Confidence quality. Edge may not be used for tests involving this skill when the character is suffering Loss of Confidence.",
		Bonus: &QualityBonus{
			LossOfConfidenceSkill: "", // Player selects skill (rating 4+)
			SkillDicePoolBonuses: []SkillDicePoolBonus{
				{
					Target:     "", // Same as LossOfConfidenceSkill
					Bonus:      -2,
					Conditions: []string{},
				},
			},
		},
		Requirements: &QualityRequirements{
			OtherRestrictions: []string{"Only skills with rating 4 or higher"},
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"low_pain_tolerance": {
		Name: "Low Pain Tolerance",
		Type: QualityTypeNegative,
		Cost: CostStructure{
			BaseCost:  -9,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "Characters with Low Pain Tolerance are particularly sensitive to pain; they incur a –1 wound modifier for every 2 boxes of cumulative damage, instead of the normal 3 boxes. This affects both Physical and Stun damage tracks.",
		Bonus: &QualityBonus{
			WoundModifierFrequency: 2, // Every 2 boxes instead of 3
		},
		Requirements: nil,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"ork_poser": {
		Name: "Ork Poser",
		Type: QualityTypeNegative,
		Cost: CostStructure{
			BaseCost:  -6,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "Influenced by Goblin Rock or over-hyped orxploitation trends, an Ork Poser is an elf or human character who alters her appearance to appear as an ork. Various cosmetic biomods—tusk implants, steroids, larynx alterations, etc.—allow him to successfully pass as an ork. Ork posers are an embarrassment to many orks, but some tolerate, if not appreciate, the compliment behind the effort. This means an ork who discovers the character's secret may either become very hostile toward him or be willing to let the character join the \"family\"—provided he passes an appropriate hazing ritual to prove his \"orkness.\" An outed ork poser may also face stigma from other humans or elves as \"race traitors,\" if those humans/elves harbor any prejudice against orks. Only humans and elves may take the Ork Poser quality.",
		Bonus:       nil,
		Requirements: &QualityRequirements{
			MetatypeRestrictions: []string{"Human", "Elf"},
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"prejudiced": {
		Name: "Prejudiced",
		Type: QualityTypeNegative,
		Cost: CostStructure{
			BaseCost:  -3, // Varies 3-10 based on group and severity
			PerRating: false,
			MaxRating: 0,
		},
		Description: "With this quality the character is Prejudiced against members of a specific group of people: metahumans, Awakened, non-metahuman sapient critters, or some other group. The character is not merely intolerant—he is outspoken about his beliefs and may actively work against the target of his prejudice. Depending upon the degree of prejudice, this quality can get the character into trouble for expressing his views or when forced to confront the targets of his prejudice. The Karma bonus granted by this quality varies depending upon how common the hated group is, how often the character is likely to encounter members of the group, and the degree to which the character is openly antagonistic toward them. Refer to the Prejudiced Table to determine the Karma value of the quality based on the prevalence of the hated group and the degree of prejudice. When dealing with the target of their prejudice, a character receives a –2 dice pool modifier per level of severity of the Prejudiced quality for all Social Tests. If negotiations are a part of the encounter, the target receives a +2 modifier per level of the Prejudiced quality. So if a character who is radical in their prejudiced views against the Awakened tries to negotiate with the target of their prejudice, they receive a –6 to their Negotiation Test while the target receives a +6 dice pool modifier.",
		Bonus: &QualityBonus{
			PrejudicedModifiers: []PrejudicedModifier{
				{
					TargetGroup:               "", // Player selects
					SeverityLevel:             0,  // Player selects
					SocialTestPenaltyPerLevel: -2,
					NegotiationBonusPerLevel:  2,
				},
			},
		},
		Requirements: nil,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"scorched": {
		Name: "Scorched",
		Type: QualityTypeNegative,
		Cost: CostStructure{
			BaseCost:  -10,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "A Scorched character is coping with neurological problems brought on by damage caused in some way by Black IC, Psychotropic IC, or BTL. The problem can manifest as short- or long-term memory loss, unexpected blackouts, frequent migraines, diminished senses (sight, touch, smell, etc.), and mood disorders such as paranoia and anxiety. The player chooses one specific effect of Scorched, and its effect should be pronounced enough to hinder the character and present potential plot hooks for the gamemaster. Whenever he enters VR or slots a BTL chip, the character must make a Body + Willpower (4) Test. On a failed roll, he experiences the specified physical effects for six hours. A glitch or critical glitch on this test results in suffering the effects for 24 hours. The only way to eliminate the Scorched quality is to get the medical treatment necessary to repair the damage, then spend the Karma to buy off the Negative quality. Once Scorched, though, the character remains susceptible to the condition. Another bad encounter with Black or Psychotropic IC or a BTL will bring this quality back. In addition to the physical side effects the character may experience from being Scorched, the character is vulnerable to damage inflicted by either Black or Psychotropic IC or BTLs. When faced with this IC, the character must make a Willpower (3) Test to be able to confront it without panicking. If he is able to confront the IC that caused their Scorched condition, the character suffers a –2 to Damage Resistance Tests when these programs are inflicting damage. To take the Scorched quality for BTLs, the character must have at least a Mild Addiction to BTLs and possess the gear necessary to use BTLs. To take the Scorched quality for Black and/or Psychotropic IC, the character must be either a decker or a technomancer.",
		Bonus: &QualityBonus{
			ScorchedEffects: &ScorchedEffects{
				EffectDescription:           "", // Player selects
				VRBTLTestThreshold:          4,
				EffectDurationHours:         6,
				CriticalGlitchDurationHours: 24,
				DamageResistancePenalty:     -2,
				RequiresAddiction:           false, // True for BTL version
			},
		},
		Requirements: &QualityRequirements{
			OtherRestrictions: []string{"For BTL: requires Mild Addiction to BTLs. For IC: must be decker or technomancer"},
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"sensitive_system": {
		Name: "Sensitive System",
		Type: QualityTypeNegative,
		Cost: CostStructure{
			BaseCost:  -12,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "A character with the Sensitive System quality has immuno-suppressive problems with cybernetic implants. Double all Essence losses caused by cyberware. Bioware implants, regardless of how they are grown or designed, are rejected by the character's body. This quality works differently for characters who are technomancers or Awakened and therefore never plan to take implants. Awakened individuals or technomancers remain fully capable of channeling mana or using Resonance, but they are potentially more susceptible to Drain or Fading. A magic user or technomancer with a Sensitive System must make a Willpower (2) Test before any Drain or Fading Tests. Failure on this test results in Drain or Fading Values being increased by +2 for that particular Drain or Fading Test, as the energy traveling through their body does more damage to their Sensitive System.",
		Bonus: &QualityBonus{
			SensitiveSystemEffects: &SensitiveSystemEffects{
				CyberwareEssenceMultiplier: 2.0,
				BiowareRejected:            true,
				DrainFadingTestThreshold:   2,
				DrainFadingValueIncrease:   2,
			},
		},
		Requirements: nil,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"simsense_vertigo": {
		Name: "Simsense Vertigo",
		Type: QualityTypeNegative,
		Cost: CostStructure{
			BaseCost:  -5,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "Characters who suffer from Simsense Vertigo experience feelings of disorientation whenever they work with augmented reality, virtual reality, or simsense (including smartlinks, simrigs, and image links). Such characters receive a –2 dice pool modifier to all tests when interacting with AR, VR, or simsense.",
		Bonus: &QualityBonus{
			SimsenseVertigoPenalty: -2,
		},
		Requirements: nil,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"sinner": {
		Name: "SINner",
		Type: QualityTypeNegative,
		Cost: CostStructure{
			BaseCost:  -5, // Varies 5-25 based on type
			PerRating: false,
			MaxRating: 0,
		},
		Description: "There are four types of SINs that fall under the SINner (Layered) quality: National SIN, Criminal SIN (either Corporate or National), Corporate Limited SIN, or Corporate Born. Individuals with SINs are required by law to always broadcast their SINs. A legal SIN is required for all legal purchases. This makes them very useful things to have, so those who are SINless generally get by with the use of fake SINs (p. 367) just so they can participate in society. NATIONAL SIN: At the 5 Karma level, the character has what is called a National SIN. The character's parents were legal citizens of a nation (such as the UCAS or CAS) and he has been a citizen of that nation from birth. He has the right to vote, qualify for passports issued by his nation, enlist in the national military, or work in the national government. A National SIN is required for any national security clearance or any form of national military career. A character with a National SIN pays fifteen percent of their gross income in taxes. He is also in no way connected to any of the megacorporations. The main drawback to having a legal National SIN is the character is in the system. The nation in the player character's background has the character's biometric data (DNA, fingerprints, retinal scans) on file, and that biometric data is shared with law enforcement agencies through the Global SIN Registry. This makes it much easier to track a character should a job go sideways. Also, nations typically sell the personal information tied to the character's SIN to corporations. Those with a legal SIN get nearly three times as much spam as those who don't have a SIN or rely on fake SINs, and the spam messages they receive are disturbingly tailored to their preferences (based on their buying and browsing habits). CRIMINAL SIN: At the 10 Karma level, the character has a Criminal SIN (either Corporate or National); his Criminal SIN replaces any previous SIN. At some point in his life, the character was arrested and served time for a felony-level offense and was branded a criminal for the rest of his life. He is legally required to broadcast his Criminal SIN at all times; failure to do so is a felony and can lead to re-incarceration. He is shunned by law-abiding society. Law-abiding citizens will, if they must, deal with a SINless character before they'd have any interaction with a known criminal. With his Criminal SIN, the character will experience prejudiced views, suspicion, and/or open hostility from most people with SINs. He will often be denied entry to certain locations (high-end stores, car dealerships, museums, galleries, etc.) and will have difficulty finding legal employment. He can expect to be brought in and held up to 48 hours for questioning anytime a crime is committed in his area. The judicial system in 2075 is more an assembly line than institution of justice. Suspects are treated as guilty unless proven innocent, plausible circumstantial evidence is often sufficient for conviction, and sentencing has more to do with the judge's mood than the crime. In this environment it's likely the cops will be more interested in closing the case than solving any crime; they may try to pin crimes on the character with the Criminal SIN whether or not she had anything to do with it. Some degree of \"adjusting\" facts and \"interpreting\" witness accounts to support allegations is common; fabricating evidence, if only to meet conviction productivity goals, is not rare. Magic users tend to receive much harsher treatment from the judicial system than mundane criminals. If the character is a magic user with a Criminal SIN, he is registered with local law enforcement. He can expect regular—but usually not scheduled—checks to confirm he lives and to ensure he is not using forbidden spell formula, foci, or other magical gear. The nation or corporation that issued the Criminal SIN will keep close tabs on the character, if he fails to update residential information or appears in any way to be trying to evade their oversight, he is subject to arrest. He is also required to pay a fifteen percent tax on his gross income to the entity that issued his Criminal SIN. CORPORATE LIMITED SIN: At the 15 Karma level the character has the Corporate Limited SIN; he has somehow gained a position in a megacorporation from the outside. He may have been hired as a wageslave (or been the minor child of a person hired as a wageslave), or perhaps brought in by someone in the megacorp who saw advantage in his skill, talent, area of expertise, or some other useful attribute. Under most circumstances the Corporate Limited SIN replaces any National SIN. His Corporate Limited SIN becomes part of the Global SIN Registry, to which law enforcement agencies and security corporations alike have access. Many of these Corporate Limited SINs record whether or not the character is Awakened. The Corporate Limited SIN allows the character to be employed by the megacorp under most circumstances, and it replaces any National SIN that the character may have had previously. With the Corporate SIN, the character can be gainfully employed by the issuing megacorporation as a wageslave, a low-ranking member of the corporation's security services, or an enlisted member of the corporation's military. Though he could have a secret-level security clearance to perform his duties, he cannot rise to a leadership position, become an officer, or be part of the megacorporation's Special Forces (such as the Red Samurai). As a group, characters that possess Corporate Limited SINs are believed to either know something valuable about the inner workings of the megacorporation or have a skill set rival megacorps would want; as such they are considered valid targets for extraction, even if they are no longer active with the corporation. Characters with the Corporate Limited SIN experience prejudice and hostility from those in the shadows who are SINless. The SINless believe the corporations deliberately keep them poor and powerless so they can be exploited. The character with the Corporate Limited SIN may find himself being personally blamed for his corporation's actions—protesting he has no real authority and no connection with the actions in question usually does little good. To the SINless and neo-anarchists the character with the Corporate Limited SIN has sold out and chosen a corrupt and oppressive system over his own people. The character pays twenty percent of his gross income in taxes to his megacorporation. CORPORATE SIN: At the 25 Karma level is the Corporate Born SIN. The character with this ID was probably born into a megacorporation, or belonged to one when it achieved extra-territoriality. At least one of his parents probably had the Corporate Born SIN as well. He grew up in the corporation, his social involvement, education, and almost every aspect of his life was managed by the corporation. His skills and aptitudes were evaluated constantly, and he was groomed for the career path to which he was best suited; his whole world was the corporation. Characters with the Corporate Born SIN had the potential and the opportunity to advance through the corporation hierarchy. He could have been a department administrator, a finance strategist, an agent of corporate intelligence, an officer in a megacorp's military, or even a member of Corporate Special Forces (Renraku's Red Samurai or Ares' Firewatch). With a Corporate Born SIN, he could have enjoyed top-secret clearance within the corporation and access to nearly unlimited resources. Then something happened. An unforgivably costly mistake, the machinations of a rival, a supervisor in need of a scapegoat—something pushed the character out of the corporation and into the cold and unforgiving shadows. In the shadows a SIN that had been the key to opportunity is now a deadly liability. Most in the shadows see the Corporate Born as the privileged few, the aristocrats in the armored limousines who look down on them, oppress them, exploit them and deny them their basic rights. If the SINless discover the character's Corporate Born SIN, reactions will range from deep suspicion to violent hostility; serious injury and death are real possibilities. The character's loyalty to his corporation is never questioned, which can be an insurmountable liability in a culture that works against the megacorps. Would-be runners have been killed for holding Corporate Born SINs. Fortunately, Corporate Born records are limited to the megacorporation that generated them. Files in the Global SIN Registry can confirm she has a valid SIN, but do not contain any additional information. Those with Corporate Born SINs pay a tax of ten percent of their gross income to their corporation",
		Bonus: &QualityBonus{
			SINType: "", // Player selects: "National", "Criminal", "Corporate Limited", "Corporate Born"
		},
		Requirements: nil,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"social_stress": {
		Name: "Social Stress",
		Type: QualityTypeNegative,
		Cost: CostStructure{
			BaseCost:  -8,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "Whether as a result of loss or trauma or due to innate psychological makeup, the Social Stress quality burdens the character with emotions that interfere with his ability to interact with others. A specific cause and trigger for the Social Stress must be established. For example, if his Social Stress is caused by survivor's guilt after the loss of a close friend, unexpectedly encountering someone who looks similar to the lost friend will heighten stress. When a character is using Leadership or Etiquette skills, reduce the number of 1s required to glitch the test by 1. Gamemasters should call for more Social Tests for characters with Social Stress to determine how a character reacts to others, particularly if a situation related to the cause of their stress arises.",
		Bonus: &QualityBonus{
			SocialStressAffectedSkills: []string{"Leadership", "Etiquette"},
			GlitchReductionPerLevel:    1,
		},
		Requirements: nil,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"spirit_bane": {
		Name: "Spirit Bane",
		Type: QualityTypeNegative,
		Cost: CostStructure{
			BaseCost:  -7,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "A character with a Spirit Bane really torques off a certain type of spirit (p. 303). Whether the character has a reputation for harming this sort of spirit or something about her aura enrages them, spirits of the type affected by the Spirit Bane are likely to harass the character when she is in their presence, and they may be reluctant to obey or perform favors for the character or her friends. If spirits of this type are ordered to attack a party that includes the character, these spirits will single her out and attempt to destroy her first. Affected spirits will always use lethal force against these characters with the Spirit Bane quality. If the character with Spirit Bane tries to summon or bind this spirit, she suffers a –2 dice pool modifier for the attempt. If the summoner tries to banish a spirit of this type, the spirit receives a +2 dice pool modifier for resisting her attempt. Watchers and minions do not count for Spirit Bane, as they are constructs that are not summoned like normal spirits. This quality may only be taken by magic users. Magic users may possess this quality for a type of spirit that is not a part of their magical tradition.",
		Bonus: &QualityBonus{
			SpiritBaneSpiritType: "", // Player selects spirit type
			SkillDicePoolBonuses: []SkillDicePoolBonus{
				{
					Target:     "Summoning/Binding",
					Bonus:      -2,
					Conditions: []string{"spirits of bane type"},
				},
			},
		},
		Requirements: &QualityRequirements{
			MagicRequired: true,
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"uncouth": {
		Name: "Uncouth",
		Type: QualityTypeNegative,
		Cost: CostStructure{
			BaseCost:  -14,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "The character with the Uncouth quality has difficulty interacting with others. He acts impulsively, overreacts to any perceived provocation, and tends to do whatever pops into his head without considering the consequences (i.e., flipping off Mr. Johnson, calling a drunk troll a \"Trog,\" or responding to casual trash talk from a rival runner by punching her in the face). All Social Tests made by the character to resist acting improperly or impulsively receive a –2 dice pool modifier. Additionally, the cost for learning or improving Social Skills is double for Uncouth characters (including at character creation), and they may never learn any Social skill groups. Uncouth characters are treated as \"unaware\" in any Social skills that they do not possess at Rating 1 or higher (see Skill Ratings, p. 129). The gamemaster may require the character to make Success Tests for social situations that pose no difficulty for normal characters.",
		Bonus: &QualityBonus{
			SocialSkillCostMultiplier: 2.0,
			SkillDicePoolBonuses: []SkillDicePoolBonus{
				{
					Target:     "Social Tests",
					Bonus:      -2,
					Conditions: []string{"to resist acting improperly or impulsively"},
				},
			},
		},
		Requirements: &QualityRequirements{
			OtherRestrictions: []string{"May never learn Social skill groups"},
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"uneducated": {
		Name: "Uneducated",
		Type: QualityTypeNegative,
		Cost: CostStructure{
			BaseCost:  -8,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "An Uneducated character is not mentally impaired—she just never had the opportunity to learn. Whether because she and her family were isolated squatters, or were SINless, or otherwise underprivileged, she was denied access to the education system. She has only a rudimentary knowledge of reading, writing, and arithmetic. Characters with the Uneducated quality are considered \"unaware\" in Technical, Academic Knowledge, and Professional Knowledge skills they do not possess (see Skill Ratings, p. 129), and they may not default on skill tests for those skills. The gamemaster may also require the character to make Success Tests for ordinary tasks that the typical sprawl-dweller takes for granted. Additionally, the Karma cost for learning new skills or improving existing ones in these categories is twice the normal rating (including at character creation), and it's possible the character will never learn some skill groups belonging to these categories.",
		Bonus: &QualityBonus{
			KnowledgeSkillRestrictions: &KnowledgeSkillRestrictions{
				AffectedCategories: []string{"Technical", "Academic Knowledge", "Professional Knowledge"},
				CostMultiplier:     2.0,
				CannotDefault:      true,
			},
		},
		Requirements: nil,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"unsteady_hands": {
		Name: "Unsteady Hands",
		Type: QualityTypeNegative,
		Cost: CostStructure{
			BaseCost:  -7,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "A character with Unsteady Hands has mild shakes that affect the dexterity and finesse in his hands. The character suffers a –2 dice pool modifier for all Agility-based tests when symptoms manifest themselves. The condition could be physiological (an untreated genetic disorder or damaged nerves, for example), caused by psychological trauma, or even be symptomatic of age. Certain augmentations or medications can mask these symptoms under normal circumstances. Under more stressful situations in the course of the run, there is a chance the Unsteady Hands condition can reappear. The character makes an Agility + Body (4) Test following a stressful encounter (combat, for example). A successful test means the character does not experience the symptoms of this condition (this time). A failed test causes the difficulties associated with unsteady hands to re-emerge, and they remain with the character for the remainder of the run.",
		Bonus: &QualityBonus{
			AgilityTestPenalty: -2,
		},
		Requirements: nil,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"weak_immune_system": {
		Name: "Weak Immune System",
		Type: QualityTypeNegative,
		Cost: CostStructure{
			BaseCost:  -10,
			PerRating: false,
			MaxRating: 0,
		},
		Description: "A character with a Weak Immune System has reduced resistance to infections and disease. Increase the Power of any disease by +2 for every Resistance Test. A character with Weak Immune System cannot take the Natural Immunity or Resistance to Pathogens/Toxins qualities. A Weak Immune System often results from immune-suppression treatments used in cybersurgery and bio-genetic procedures, so it is reasonable to believe that characters that have undergone extensive body modifications are more likely to acquire this quality.",
		Bonus: &QualityBonus{
			DiseasePowerIncrease: 2,
		},
		Requirements: &QualityRequirements{
			OtherRestrictions: []string{"Cannot take Natural Immunity or Resistance to Pathogens/Toxins"},
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
}

// GetAllQualities returns all quality definitions as a slice
func GetAllQualities() []QualityDefinition {
	qualities := make([]QualityDefinition, 0, len(dataQualities))
	for _, quality := range dataQualities {
		qualities = append(qualities, quality)
	}
	return qualities
}

// GetQualityByName returns the quality definition with the given name, or nil if not found
func GetQualityByName(name string) *QualityDefinition {
	for _, quality := range dataQualities {
		if quality.Name == name {
			return &quality
		}
	}
	return nil
}

// GetQualityByKey returns the quality definition with the given key (lowercase with underscores), or nil if not found
func GetQualityByKey(key string) *QualityDefinition {
	if quality, ok := dataQualities[key]; ok {
		return &quality
	}
	return nil
}
