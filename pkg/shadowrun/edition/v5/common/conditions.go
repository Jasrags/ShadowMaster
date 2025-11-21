package common

// This file contains condition/requirement structures generated from conditions.xsd

// Armormod represents a armormod check
type Armormod struct {
}

// Attribute represents a attribute check
type Attribute struct {
	Name string `xml:"name" json:"name"`
	Total int `xml:"total" json:"total"`
	Natural string `xml:"natural,omitempty" json:"natural,omitempty"`
}

// Attributetotal represents a attributetotal check
type Attributetotal struct {
	Attributes string `xml:"attributes" json:"attributes"`
	Val int `xml:"val" json:"val"`
	Natural string `xml:"natural,omitempty" json:"natural,omitempty"`
}

// Bioware represents a bioware check
type Bioware struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Count *int `xml:"count,omitempty" json:"count,omitempty"`
	Select *string `xml:"select,omitempty" json:"select,omitempty"`
}

// Biowarecontains represents a biowarecontains check
type Biowarecontains struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Count *int `xml:"count,omitempty" json:"count,omitempty"`
	Select *string `xml:"select,omitempty" json:"select,omitempty"`
}

// Characterquality represents a characterquality check
type Characterquality struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Extra *string `xml:"extra,omitempty" json:"extra,omitempty"`
}

// Cyberware represents a cyberware check
type Cyberware struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Count *int `xml:"count,omitempty" json:"count,omitempty"`
	Select *string `xml:"select,omitempty" json:"select,omitempty"`
}

// Cyberwarecontains represents a cyberwarecontains check
type Cyberwarecontains struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Count *int `xml:"count,omitempty" json:"count,omitempty"`
	Select *string `xml:"select,omitempty" json:"select,omitempty"`
}

// Ess represents a ess check
type Ess struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Grade *string `xml:"grade,omitempty" json:"grade,omitempty"`
}

// GearCheck represents a gear check (for requirements)
type GearCheck struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Minrating *int `xml:"minrating,omitempty" json:"minrating,omitempty"`
	Rating *int `xml:"rating,omitempty" json:"rating,omitempty"`
	Maxrating *int `xml:"maxrating,omitempty" json:"maxrating,omitempty"`
}

// Group represents a group check
type Group struct {
}

// Grouponeof represents a grouponeof check
type Grouponeof struct {
}

// Lifestylequality represents a lifestylequality check
type Lifestylequality struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Extra *string `xml:"extra,omitempty" json:"extra,omitempty"`
}

// QualityCheck represents a quality check (for requirements)
type QualityCheck struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Extra *string `xml:"extra,omitempty" json:"extra,omitempty"`
}

// Skill represents a skill check
type Skill struct {
	Name string `xml:"name" json:"name"`
	Val int `xml:"val" json:"val"`
	Spec *string `xml:"spec,omitempty" json:"spec,omitempty"`
	Type *string `xml:"type,omitempty" json:"type,omitempty"`
}

// Skillgrouptotal represents a skillgrouptotal check
type Skillgrouptotal struct {
	Skillgroups string `xml:"skillgroups" json:"skillgroups"`
	Val int `xml:"val" json:"val"`
}

// Skilltotal represents a skilltotal check
type Skilltotal struct {
	Skills string `xml:"skills" json:"skills"`
	Type *string `xml:"type,omitempty" json:"type,omitempty"`
	Val int `xml:"val" json:"val"`
}

// SpellcategoryCheck represents a spellcategory check (for requirements)
type SpellcategoryCheck struct {
	Name string `xml:"name" json:"name"`
	Count int `xml:"count" json:"count"`
}

// Spelldescriptor represents a spelldescriptor check
type Spelldescriptor struct {
	Name string `xml:"name" json:"name"`
	Count int `xml:"count" json:"count"`
}

// accessory represents a accessory check
type accessory []string

// allowspiritfettering represents a allowspiritfettering check
type allowspiritfettering []string

// art represents a art check
type art []string

// careerkarma represents a careerkarma check
type careerkarma *int

// critterpower represents a critterpower check
type critterpower []string

// damageresistance represents a damageresistance check
type damageresistance *string

// depenabled represents a depenabled check
type depenabled *string

// gameplayoption represents a gameplayoption check
type gameplayoption *string

// inherited represents a inherited check
type inherited *string

// initiategrade represents a initiategrade check
type initiategrade *string

// magenabled represents a magenabled check
type magenabled *string

// martialart represents a martialart check
type martialart *string

// martialtechnique represents a martialtechnique check
type martialtechnique *string

// metamagic represents a metamagic check
type metamagic []string

// metamagicart represents a metamagicart check
type metamagicart []string

// metatype represents a metatype check
type metatype []string

// metatypecategory represents a metatypecategory check
type metatypecategory []string

// metavariant represents a metavariant check
type metavariant []string

// power represents a power check
type power []string

// program represents a program check
type program []string

// resenabled represents a resenabled check
type resenabled *string

// spell represents a spell check
type spell []string

// streetcredvsnotoriety represents a streetcredvsnotoriety check
type streetcredvsnotoriety string

// submersiongrade represents a submersiongrade check
type submersiongrade *int

// tradition represents a tradition check
type tradition []string

// traditionspiritform represents a traditionspiritform check
type traditionspiritform []string

// Checks represents the checks group from conditions.xsd
// This contains all possible check types that can be used in requirements
type Checks struct {
	Armormod []Armormod `xml:"armormod,omitempty" json:"armormod,omitempty"`
	Attribute []Attribute `xml:"attribute,omitempty" json:"attribute,omitempty"`
	Attributetotal []Attributetotal `xml:"attributetotal,omitempty" json:"attributetotal,omitempty"`
	Bioware []Bioware `xml:"bioware,omitempty" json:"bioware,omitempty"`
	Biowarecontains []Biowarecontains `xml:"biowarecontains,omitempty" json:"biowarecontains,omitempty"`
	Characterquality []Characterquality `xml:"characterquality,omitempty" json:"characterquality,omitempty"`
	Cyberware []Cyberware `xml:"cyberware,omitempty" json:"cyberware,omitempty"`
	Cyberwarecontains []Cyberwarecontains `xml:"cyberwarecontains,omitempty" json:"cyberwarecontains,omitempty"`
	Ess []Ess `xml:"ess,omitempty" json:"ess,omitempty"`
	Gear []GearCheck `xml:"gear,omitempty" json:"gear,omitempty"`
	Group []Group `xml:"group,omitempty" json:"group,omitempty"`
	Grouponeof []Grouponeof `xml:"grouponeof,omitempty" json:"grouponeof,omitempty"`
	Lifestylequality []Lifestylequality `xml:"lifestylequality,omitempty" json:"lifestylequality,omitempty"`
	Quality []QualityCheck `xml:"quality,omitempty" json:"quality,omitempty"`
	Skill []Skill `xml:"skill,omitempty" json:"skill,omitempty"`
	Skillgrouptotal []Skillgrouptotal `xml:"skillgrouptotal,omitempty" json:"skillgrouptotal,omitempty"`
	Skilltotal []Skilltotal `xml:"skilltotal,omitempty" json:"skilltotal,omitempty"`
	Spellcategory []SpellcategoryCheck `xml:"spellcategory,omitempty" json:"spellcategory,omitempty"`
	Spelldescriptor []Spelldescriptor `xml:"spelldescriptor,omitempty" json:"spelldescriptor,omitempty"`
	Accessory [][]string `xml:"accessory,omitempty" json:"accessory,omitempty"`
	Allowspiritfettering [][]string `xml:"allowspiritfettering,omitempty" json:"allowspiritfettering,omitempty"`
	Art [][]string `xml:"art,omitempty" json:"art,omitempty"`
	Careerkarma **int `xml:"careerkarma,omitempty" json:"careerkarma,omitempty"`
	Critterpower [][]string `xml:"critterpower,omitempty" json:"critterpower,omitempty"`
	Damageresistance **string `xml:"damageresistance,omitempty" json:"damageresistance,omitempty"`
	Depenabled **string `xml:"depenabled,omitempty" json:"depenabled,omitempty"`
	Gameplayoption **string `xml:"gameplayoption,omitempty" json:"gameplayoption,omitempty"`
	Inherited **string `xml:"inherited,omitempty" json:"inherited,omitempty"`
	Initiategrade **string `xml:"initiategrade,omitempty" json:"initiategrade,omitempty"`
	Magenabled **string `xml:"magenabled,omitempty" json:"magenabled,omitempty"`
	Martialart **string `xml:"martialart,omitempty" json:"martialart,omitempty"`
	Martialtechnique **string `xml:"martialtechnique,omitempty" json:"martialtechnique,omitempty"`
	Metamagic [][]string `xml:"metamagic,omitempty" json:"metamagic,omitempty"`
	Metamagicart [][]string `xml:"metamagicart,omitempty" json:"metamagicart,omitempty"`
	Metatype [][]string `xml:"metatype,omitempty" json:"metatype,omitempty"`
	Metatypecategory [][]string `xml:"metatypecategory,omitempty" json:"metatypecategory,omitempty"`
	Metavariant [][]string `xml:"metavariant,omitempty" json:"metavariant,omitempty"`
	Power [][]string `xml:"power,omitempty" json:"power,omitempty"`
	Program [][]string `xml:"program,omitempty" json:"program,omitempty"`
	Resenabled **string `xml:"resenabled,omitempty" json:"resenabled,omitempty"`
	Spell [][]string `xml:"spell,omitempty" json:"spell,omitempty"`
	Streetcredvsnotoriety *string `xml:"streetcredvsnotoriety,omitempty" json:"streetcredvsnotoriety,omitempty"`
	Submersiongrade **int `xml:"submersiongrade,omitempty" json:"submersiongrade,omitempty"`
	Tradition [][]string `xml:"tradition,omitempty" json:"tradition,omitempty"`
	Traditionspiritform [][]string `xml:"traditionspiritform,omitempty" json:"traditionspiritform,omitempty"`
}

// GearDetailOption represents a detail option with operation attribute
type GearDetailOption struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Operation *string `xml:"operation,attr,omitempty" json:"+@operation,omitempty"`
}

// VehicleDetailOption represents a detail option with operation attribute
type VehicleDetailOption struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Operation *string `xml:"operation,attr,omitempty" json:"+@operation,omitempty"`
}

// WeaponDetailOption represents a detail option with operation attribute
type WeaponDetailOption struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Operation *string `xml:"operation,attr,omitempty" json:"+@operation,omitempty"`
}

// GearDetails represents gear detail requirements
type GearDetails struct {
	Or *GearDetailOptions `xml:"OR,omitempty" json:"or,omitempty"`
	Options *GearDetailOptions `xml:",omitempty" json:"options,omitempty"`
}

// GearDetailOptions contains gear detail option elements
type GearDetailOptions struct {
	Id []GearDetailOption `xml:"id,omitempty" json:"id,omitempty"`
	Name []GearDetailOption `xml:"name,omitempty" json:"name,omitempty"`
}

// VehicleDetails represents vehicle detail requirements
type VehicleDetails struct {
	Or *VehicleDetailOptions `xml:"OR,omitempty" json:"or,omitempty"`
	Options *VehicleDetailOptions `xml:",omitempty" json:"options,omitempty"`
}

// VehicleDetailOptions contains vehicle detail option elements
type VehicleDetailOptions struct {
	Body []VehicleDetailOption `xml:"body,omitempty" json:"body,omitempty"`
	Category []VehicleDetailOption `xml:"category,omitempty" json:"category,omitempty"`
	Id []VehicleDetailOption `xml:"id,omitempty" json:"id,omitempty"`
	Name []VehicleDetailOption `xml:"name,omitempty" json:"name,omitempty"`
	Seats []VehicleDetailOption `xml:"seats,omitempty" json:"seats,omitempty"`
}

// WeaponDetails represents weapon detail requirements
type WeaponDetails struct {
	Or *WeaponDetailOptions `xml:"OR,omitempty" json:"or,omitempty"`
	And *WeaponDetailOptions `xml:"AND,omitempty" json:"and,omitempty"`
	Options *WeaponDetailOptions `xml:",omitempty" json:"options,omitempty"`
}

// WeaponDetailOptions contains weapon detail option elements
type WeaponDetailOptions struct {
	Ammo []WeaponDetailOption `xml:"ammo,omitempty" json:"ammo,omitempty"`
	Accessorymounts []WeaponDetailOption `xml:"accessorymounts,omitempty" json:"accessorymounts,omitempty"`
	Ammocategory []WeaponDetailOption `xml:"ammocategory,omitempty" json:"ammocategory,omitempty"`
	And *WeaponDetailOptions `xml:"AND,omitempty" json:"and,omitempty"`
	Category []WeaponDetailOption `xml:"category,omitempty" json:"category,omitempty"`
	Conceal []WeaponDetailOption `xml:"conceal,omitempty" json:"conceal,omitempty"`
	Damage []WeaponDetailOption `xml:"damage,omitempty" json:"damage,omitempty"`
	Id []WeaponDetailOption `xml:"id,omitempty" json:"id,omitempty"`
	Name []WeaponDetailOption `xml:"name,omitempty" json:"name,omitempty"`
	Spec []WeaponDetailOption `xml:"spec,omitempty" json:"spec,omitempty"`
	Spec2 []WeaponDetailOption `xml:"spec2,omitempty" json:"spec2,omitempty"`
	Type []WeaponDetailOption `xml:"type,omitempty" json:"type,omitempty"`
	Useskill []WeaponDetailOption `xml:"useskill,omitempty" json:"useskill,omitempty"`
}

// WeaponMountDetails represents weapon mount detail requirements
type WeaponMountDetails struct {
	Control []string `xml:"control,omitempty" json:"control,omitempty"`
	Flexibility *string `xml:"flexibility,omitempty" json:"flexibility,omitempty"`
	Size *string `xml:"size,omitempty" json:"size,omitempty"`
	Visibility *string `xml:"visibility,omitempty" json:"visibility,omitempty"`
}

// Details represents the details group from conditions.xsd
type Details struct {
	GearDetails *GearDetails `xml:"geardetails,omitempty" json:"geardetails,omitempty"`
	VehicleDetails *VehicleDetails `xml:"vehicledetails,omitempty" json:"vehicledetails,omitempty"`
	WeaponDetails *WeaponDetails `xml:"weapondetails,omitempty" json:"weapondetails,omitempty"`
	WeaponMountDetails *WeaponMountDetails `xml:"weaponmountdetails,omitempty" json:"weaponmountdetails,omitempty"`
}

// RequirementOneOf represents a one-of requirement (at least one must be met)
type RequirementOneOf struct {
	Checks *Checks `xml:",omitempty" json:"checks,omitempty"`
}

// RequirementAllOf represents an all-of requirement (all must be met)
type RequirementAllOf struct {
	Checks *Checks `xml:",omitempty" json:"checks,omitempty"`
}

// Required represents a required condition element
type Required struct {
	AllOf *RequirementAllOf `xml:"allof,omitempty" json:"allof,omitempty"`
	OneOf []RequirementOneOf `xml:"oneof,omitempty" json:"oneof,omitempty"`
	Details *Details `xml:",omitempty" json:"details,omitempty"`
	Unique *string `xml:"unique,attr,omitempty" json:"+@unique,omitempty"`
}

// Forbidden represents a forbidden condition element
type Forbidden struct {
	AllOf *RequirementAllOf `xml:"allof,omitempty" json:"allof,omitempty"`
	OneOf []RequirementOneOf `xml:"oneof,omitempty" json:"oneof,omitempty"`
	Details *Details `xml:",omitempty" json:"details,omitempty"`
	Unique *string `xml:"unique,attr,omitempty" json:"+@unique,omitempty"`
}

