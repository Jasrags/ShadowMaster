package common

// This file contains bonus type structs generated from bonuses.xsd

// Actiondicepool represents a actiondicepool bonus
type Actiondicepool struct {
	Name string `xml:"name" json:"name"`
	Val  int    `xml:"val" json:"val"`
}

// Activeskillkarmacost represents a activeskillkarmacost bonus
type Activeskillkarmacost struct {
	Name      string  `xml:"name" json:"name"`
	Val       string  `xml:"val" json:"val"`
	Min       *string `xml:"min,omitempty" json:"min"`
	Max       *string `xml:"max,omitempty" json:"max"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Activeskillkarmacostmultiplier represents a activeskillkarmacostmultiplier bonus
type Activeskillkarmacostmultiplier struct {
	Name      string  `xml:"name" json:"name"`
	Val       string  `xml:"val" json:"val"`
	Min       *string `xml:"min,omitempty" json:"min"`
	Max       *string `xml:"max,omitempty" json:"max"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Activeskillpointcost represents a activeskillpointcost bonus
type Activeskillpointcost struct {
	Name      string  `xml:"name" json:"name"`
	Val       string  `xml:"val" json:"val"`
	Min       *string `xml:"min,omitempty" json:"min"`
	Max       *string `xml:"max,omitempty" json:"max"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Activeskillpointcostmultiplier represents a activeskillpointcostmultiplier bonus
type Activeskillpointcostmultiplier struct {
	Name      string  `xml:"name" json:"name"`
	Val       string  `xml:"val" json:"val"`
	Min       *string `xml:"min,omitempty" json:"min"`
	Max       *string `xml:"max,omitempty" json:"max"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Activesoft represents a activesoft bonus
type Activesoft struct {
	Val             *string          `xml:"val,omitempty" json:"val"`
	Skillcategories *Skillcategories `xml:"skillcategories,omitempty" json:"skillcategories"`
}

// Addcontact represents a addcontact bonus
type Addcontact struct {
	Loyalty       *string `xml:"loyalty,omitempty" json:"loyalty"`
	Connection    *string `xml:"connection,omitempty" json:"connection"`
	Forcedloyalty *string `xml:"forcedloyalty,omitempty" json:"forcedloyalty"`
	Forcegroup    *string `xml:"forcegroup,omitempty" json:"forcegroup"`
	Free          *string `xml:"free,omitempty" json:"free"`
	Group         *string `xml:"group,omitempty" json:"group"`
}

// Addgear represents a addgear bonus
type Addgear struct {
	Name     string    `xml:"name" json:"name"`
	Category string    `xml:"category" json:"category"`
	Rating   *string   `xml:"rating,omitempty" json:"rating"`
	Quantity *string   `xml:"quantity,omitempty" json:"quantity"`
	Fullcost *string   `xml:"fullcost,omitempty" json:"fullcost"`
	Children *Children `xml:"children,omitempty" json:"children"`
}

// Addlimb represents a addlimb bonus
type Addlimb struct {
	Limbslot string `xml:"limbslot" json:"limbslot"`
	Val      string `xml:"val" json:"val"`
}

// Addmetamagic represents a addmetamagic bonus
type Addmetamagic struct {
	Content string  `xml:",chardata" json:"+content,omitempty"`
	Forced  *string `xml:"forced,omitempty" json:"forced"`
}

// Addqualities represents a addqualities bonus
type Addqualities struct {
	Addquality []Addquality `xml:"addquality,omitempty" json:"addquality"`
	Content    string       `xml:",chardata" json:"+content,omitempty"`
	Forced     *bool        `xml:"forced,omitempty" json:"forced"`
	Select     *string      `xml:"select,omitempty" json:"select"`
	Rating     *string      `xml:"rating,omitempty" json:"rating"`
}

// Addquality represents a addquality bonus
type Addquality struct {
	Content string  `xml:",chardata" json:"+content,omitempty"`
	Forced  *bool   `xml:"forced,omitempty" json:"forced"`
	Select  *string `xml:"select,omitempty" json:"select"`
	Rating  *string `xml:"rating,omitempty" json:"rating"`
}

// Addspell represents a addspell bonus
type Addspell struct {
	Content     string  `xml:",chardata" json:"+content,omitempty"`
	Alchemical  *bool   `xml:"alchemical,omitempty" json:"alchemical"`
	Extended    *bool   `xml:"extended,omitempty" json:"extended"`
	Limited     *bool   `xml:"limited,omitempty" json:"limited"`
	Select      *string `xml:"select,omitempty" json:"select"`
	Usesunarmed *bool   `xml:"usesunarmed,omitempty" json:"usesunarmed"`
}

// Addspirit represents a addspirit bonus
type Addspirit struct {
	Addtoselected *string  `xml:"addtoselected,omitempty" json:"addtoselected"`
	Spirit        []string `xml:"spirit,omitempty" json:"spirit"`
}

// Addsprite represents a addsprite bonus
type Addsprite struct {
	Addtoselected *string  `xml:"addtoselected,omitempty" json:"addtoselected"`
	Spirit        []string `xml:"spirit,omitempty" json:"spirit"`
}

// Addware represents a addware bonus
type Addware struct {
	Name   string  `xml:"name" json:"name"`
	Grade  string  `xml:"grade" json:"grade"`
	Type   string  `xml:"type" json:"type"`
	Rating *string `xml:"rating,omitempty" json:"rating"`
}

// Addweapon represents a addweapon bonus
type Addweapon struct {
	Name     string  `xml:"name" json:"name"`
	Fullcost *string `xml:"fullcost,omitempty" json:"fullcost"`
}

// Armor represents a armor bonus
type Armor struct {
	Content string  `xml:",chardata" json:"+content,omitempty"`
	Group   *string `xml:"group,omitempty" json:"group"`
}

// Attributekarmacost represents a attributekarmacost bonus
type Attributekarmacost struct {
	Name      string  `xml:"name" json:"name"`
	Val       string  `xml:"val" json:"val"`
	Min       *string `xml:"min,omitempty" json:"min"`
	Max       *string `xml:"max,omitempty" json:"max"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Attributekarmacostmultiplier represents a attributekarmacostmultiplier bonus
type Attributekarmacostmultiplier struct {
	Name      string  `xml:"name" json:"name"`
	Val       string  `xml:"val" json:"val"`
	Min       *string `xml:"min,omitempty" json:"min"`
	Max       *string `xml:"max,omitempty" json:"max"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Attributepointcost represents a attributepointcost bonus
type Attributepointcost struct {
	Name      string  `xml:"name" json:"name"`
	Val       string  `xml:"val" json:"val"`
	Min       *string `xml:"min,omitempty" json:"min"`
	Max       *string `xml:"max,omitempty" json:"max"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Attributepointcostmultiplier represents a attributepointcostmultiplier bonus
type Attributepointcostmultiplier struct {
	Name      string  `xml:"name" json:"name"`
	Val       string  `xml:"val" json:"val"`
	Min       *string `xml:"min,omitempty" json:"min"`
	Max       *string `xml:"max,omitempty" json:"max"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Availability represents a availability bonus
type Availability struct {
	Content   string  `xml:",chardata" json:"+content,omitempty"`
	Id        *string `xml:"id,omitempty" json:"id"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Basiclifestylecost represents a basiclifestylecost bonus
type Basiclifestylecost struct {
	Content   string  `xml:",chardata" json:"+content,omitempty"`
	Lifestyle *string `xml:"lifestyle,omitempty" json:"lifestyle"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Blockskilldefaulting represents a blockskilldefaulting bonus
type Blockskilldefaulting struct {
	Val             *string          `xml:"val,omitempty" json:"val"`
	Skillcategories *Skillcategories `xml:"skillcategories,omitempty" json:"skillcategories"`
}

// BonusCategory represents a category bonus
type BonusCategory struct {
	Name  []string `xml:"name,omitempty" json:"name"`
	Value *string  `xml:"value,omitempty" json:"value"`
}

// Child represents a child bonus
type Child struct {
	Name     string  `xml:"name" json:"name"`
	Category string  `xml:"category" json:"category"`
	Rating   *string `xml:"rating,omitempty" json:"rating"`
	Quantity *string `xml:"quantity,omitempty" json:"quantity"`
}

// Children represents a children bonus
type Children struct {
	Child []Child `xml:"child,omitempty" json:"child"`
}

// Conditionmonitor represents a conditionmonitor bonus
type Conditionmonitor struct {
	Physical        *string          `xml:"physical,omitempty" json:"physical"`
	Stun            *string          `xml:"stun,omitempty" json:"stun"`
	Threshold       *Threshold       `xml:"threshold,omitempty" json:"threshold"`
	Thresholdoffset *Thresholdoffset `xml:"thresholdoffset,omitempty" json:"thresholdoffset"`
	Overflow        *string          `xml:"overflow,omitempty" json:"overflow"`
	Content         string           `xml:",chardata" json:"+content,omitempty"`
	Precedence      *int             `xml:"precedence,omitempty" json:"precedence"`
}

// Critterpowers represents a critterpowers bonus
type Critterpowers struct {
	Power   []Power `xml:"power,omitempty" json:"power"`
	Content string  `xml:",chardata" json:"+content,omitempty"`
	Select  *string `xml:"select,omitempty" json:"select"`
	Rating  *string `xml:"rating,omitempty" json:"rating"`
}

// Cyberlimbattributebonus represents a cyberlimbattributebonus bonus
type Cyberlimbattributebonus struct {
	Name string `xml:"name" json:"name"`
	Val  string `xml:"val" json:"val"`
}

// Dealerconnection represents a dealerconnection bonus
type Dealerconnection struct {
	Category []string `xml:"category" json:"category"`
}

// Disabletab represents a disabletab bonus
type Disabletab struct {
	Name []string `xml:"name" json:"name"`
}

// Discountqualities represents a discountqualities bonus
type Discountqualities struct {
	Quality  []Quality `xml:"quality,omitempty" json:"quality"`
	Content  string    `xml:",chardata" json:"+content,omitempty"`
	Discount *int      `xml:"discount,omitempty" json:"discount"`
}

// Drainvalue represents a drainvalue bonus
type Drainvalue struct {
	Content  string  `xml:",chardata" json:"+content,omitempty"`
	Specific *string `xml:"specific,omitempty" json:"specific"`
}

// Enableattribute represents a enableattribute bonus
type Enableattribute struct {
	Name string  `xml:"name" json:"name"`
	Min  *string `xml:"min,omitempty" json:"min"`
	Max  *string `xml:"max,omitempty" json:"max"`
	Aug  *string `xml:"aug,omitempty" json:"aug"`
	Val  *string `xml:"val,omitempty" json:"val"`
}

// Enabletab represents a enabletab bonus
type Enabletab struct {
	Name []string `xml:"name" json:"name"`
}

// Fadingvalue represents a fadingvalue bonus
type Fadingvalue struct {
	Content  string  `xml:",chardata" json:"+content,omitempty"`
	Specific *string `xml:"specific,omitempty" json:"specific"`
}

// Focusbindingkarmacost represents a focusbindingkarmacost bonus
type Focusbindingkarmacost struct {
	Name          string  `xml:"name" json:"name"`
	Val           string  `xml:"val" json:"val"`
	Extracontains *string `xml:"extracontains,omitempty" json:"extracontains"`
}

// Focusbindingkarmamultiplier represents a focusbindingkarmamultiplier bonus
type Focusbindingkarmamultiplier struct {
	Name          string  `xml:"name" json:"name"`
	Val           string  `xml:"val" json:"val"`
	Extracontains *string `xml:"extracontains,omitempty" json:"extracontains"`
}

// Freespells represents a freespells bonus
type Freespells struct {
	Content   string  `xml:",chardata" json:"+content,omitempty"`
	Attribute *string `xml:"attribute,omitempty" json:"attribute"`
	Limit     *string `xml:"limit,omitempty" json:"limit"`
	Skill     *string `xml:"skill,omitempty" json:"skill"`
}

// Hardwires represents a hardwires bonus
type Hardwires struct {
	Content          string  `xml:",chardata" json:"+content,omitempty"`
	Knowledgeskill   *string `xml:"knowledgeskill,omitempty" json:"knowledgeskill"`
	Skillgroup       *string `xml:"skillgroup,omitempty" json:"skillgroup"`
	Skillcategory    *string `xml:"skillcategory,omitempty" json:"skillcategory"`
	Excludecategory  *string `xml:"excludecategory,omitempty" json:"excludecategory"`
	Excludeskill     *string `xml:"excludeskill,omitempty" json:"excludeskill"`
	Limittoskill     *string `xml:"limittoskill,omitempty" json:"limittoskill"`
	Limittoattribute *string `xml:"limittoattribute,omitempty" json:"limittoattribute"`
}

// Initiative represents a initiative bonus
type Initiative struct {
	Content    string `xml:",chardata" json:"+content,omitempty"`
	Precedence *int   `xml:"precedence,omitempty" json:"precedence"`
}

// Initiativepass represents a initiativepass bonus
type Initiativepass struct {
	Content    string `xml:",chardata" json:"+content,omitempty"`
	Precedence *int   `xml:"precedence,omitempty" json:"precedence"`
}

// Knowledgeskillkarmacost represents a knowledgeskillkarmacost bonus
type Knowledgeskillkarmacost struct {
	Name      string  `xml:"name" json:"name"`
	Val       string  `xml:"val" json:"val"`
	Min       *string `xml:"min,omitempty" json:"min"`
	Max       *string `xml:"max,omitempty" json:"max"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Knowledgeskillkarmacostmin represents a knowledgeskillkarmacostmin bonus
type Knowledgeskillkarmacostmin struct {
	Name      string  `xml:"name" json:"name"`
	Val       string  `xml:"val" json:"val"`
	Min       *string `xml:"min,omitempty" json:"min"`
	Max       *string `xml:"max,omitempty" json:"max"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Knowledgeskillkarmacostmultiplier represents a knowledgeskillkarmacostmultiplier bonus
type Knowledgeskillkarmacostmultiplier struct {
	Name      string  `xml:"name" json:"name"`
	Val       string  `xml:"val" json:"val"`
	Min       *string `xml:"min,omitempty" json:"min"`
	Max       *string `xml:"max,omitempty" json:"max"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Knowledgeskillpointcost represents a knowledgeskillpointcost bonus
type Knowledgeskillpointcost struct {
	Name      string  `xml:"name" json:"name"`
	Val       string  `xml:"val" json:"val"`
	Min       *string `xml:"min,omitempty" json:"min"`
	Max       *string `xml:"max,omitempty" json:"max"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Knowledgeskillpointcostmultiplier represents a knowledgeskillpointcostmultiplier bonus
type Knowledgeskillpointcostmultiplier struct {
	Name      string  `xml:"name" json:"name"`
	Val       string  `xml:"val" json:"val"`
	Min       *string `xml:"min,omitempty" json:"min"`
	Max       *string `xml:"max,omitempty" json:"max"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Knowledgeskillpoints represents a knowledgeskillpoints bonus
type Knowledgeskillpoints struct {
	Val *string `xml:"val,omitempty" json:"val"`
}

// Lifestylecost represents a lifestylecost bonus
type Lifestylecost struct {
	Content   string  `xml:",chardata" json:"+content,omitempty"`
	Lifestyle *string `xml:"lifestyle,omitempty" json:"lifestyle"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Limitmodifier represents a limitmodifier bonus
type Limitmodifier struct {
	Limit     *string `xml:"limit,omitempty" json:"limit"`
	Value     *string `xml:"value,omitempty" json:"value"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Limitspellcategory represents a limitspellcategory bonus
type Limitspellcategory struct {
	Content string  `xml:",chardata" json:"+content,omitempty"`
	Exclude *string `xml:"exclude,omitempty" json:"exclude"`
}

// Limitspiritcategory represents a limitspiritcategory bonus
type Limitspiritcategory struct {
	Spirit []string `xml:"spirit,omitempty" json:"spirit"`
}

// Livingpersona represents a livingpersona bonus
type Livingpersona struct {
	Attack         *string `xml:"attack,omitempty" json:"attack"`
	Dataprocessing *string `xml:"dataprocessing,omitempty" json:"dataprocessing"`
	Devicerating   *string `xml:"devicerating,omitempty" json:"devicerating"`
	Firewall       *string `xml:"firewall,omitempty" json:"firewall"`
	Matrixcm       *string `xml:"matrixcm,omitempty" json:"matrixcm"`
	Programlimit   *string `xml:"programlimit,omitempty" json:"programlimit"`
	Sleaze         *string `xml:"sleaze,omitempty" json:"sleaze"`
}

// Matrixinitiativedice represents a matrixinitiativedice bonus
type Matrixinitiativedice struct {
	Content    string `xml:",chardata" json:"+content,omitempty"`
	Precedence *int   `xml:"precedence,omitempty" json:"precedence"`
}

// Movementreplace represents a movementreplace bonus
type Movementreplace struct {
	Category string `xml:"category" json:"category"`
	Speed    string `xml:"speed" json:"speed"`
	Val      string `xml:"val" json:"val"`
}

// Name represents a name bonus
type Name struct {
	Content    string `xml:",chardata" json:"+content,omitempty"`
	Precedence *int   `xml:"precedence,omitempty" json:"precedence"`
}

// Newspellkarmacost represents a newspellkarmacost bonus
type Newspellkarmacost struct {
	Content string  `xml:",chardata" json:"+content,omitempty"`
	Type    *string `xml:"type,omitempty" json:"type"`
}

// Nuyenamt represents a nuyenamt bonus
type Nuyenamt struct {
	Content   string  `xml:",chardata" json:"+content,omitempty"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Optionalpower represents a optionalpower bonus
type Optionalpower struct {
	Content string  `xml:",chardata" json:"+content,omitempty"`
	Select  *string `xml:"select,omitempty" json:"select"`
}

// Optionalpowers represents a optionalpowers bonus
type Optionalpowers struct {
	Optionalpower []Optionalpower `xml:"optionalpower,omitempty" json:"optionalpower"`
	Content       string          `xml:",chardata" json:"+content,omitempty"`
	Select        *string         `xml:"select,omitempty" json:"select"`
}

// Penaltyfreesustain represents a penaltyfreesustain bonus
type Penaltyfreesustain struct {
	Count *string `xml:"count,omitempty" json:"count"`
	Force *string `xml:"force,omitempty" json:"force"`
}

// Power represents a power bonus
type Power struct {
	Content string  `xml:",chardata" json:"+content,omitempty"`
	Select  *string `xml:"select,omitempty" json:"select"`
	Rating  *string `xml:"rating,omitempty" json:"rating"`
}

// Pushtextforqualitygroup represents a pushtextforqualitygroup bonus
type Pushtextforqualitygroup struct {
	Content string  `xml:",chardata" json:"+content,omitempty"`
	Group   *string `xml:"group,omitempty" json:"group"`
}

// Quality represents a quality bonus
type Quality struct {
	Content  string `xml:",chardata" json:"+content,omitempty"`
	Discount *int   `xml:"discount,omitempty" json:"discount"`
}

// Qualitylevel represents a qualitylevel bonus
type Qualitylevel struct {
	Content int     `xml:",chardata" json:"+content,omitempty"`
	Group   *string `xml:"group,omitempty" json:"group"`
}

// Replaceattribute represents a replaceattribute bonus
type Replaceattribute struct {
	Name *string `xml:"name,omitempty" json:"name"`
	Min  *string `xml:"min,omitempty" json:"min"`
	Max  *string `xml:"max,omitempty" json:"max"`
	Aug  *string `xml:"aug,omitempty" json:"aug"`
}

// Replaceattributes represents a replaceattributes bonus
type Replaceattributes struct {
	Replaceattribute []Replaceattribute `xml:"replaceattribute,omitempty" json:"replaceattribute"`
}

// Restrictedgear represents a restrictedgear bonus
type Restrictedgear struct {
	Availability string  `xml:"availability" json:"availability"`
	Amount       *string `xml:"amount,omitempty" json:"amount"`
}

// Runmultiplier represents a runmultiplier bonus
type Runmultiplier struct {
	Category string  `xml:"category" json:"category"`
	Val      *string `xml:"val,omitempty" json:"val"`
	Percent  *string `xml:"percent,omitempty" json:"percent"`
}

// Selectattribute represents a selectattribute bonus
type Selectattribute struct {
	Attribute        []string `xml:"attribute,omitempty" json:"attribute"`
	Excludeattribute []string `xml:"excludeattribute,omitempty" json:"excludeattribute"`
	Aug              *string  `xml:"aug,omitempty" json:"aug"`
	Max              *string  `xml:"max,omitempty" json:"max"`
	Min              *string  `xml:"min,omitempty" json:"min"`
	Val              *string  `xml:"val,omitempty" json:"val"`
	Affectbase       *string  `xml:"affectbase,omitempty" json:"affectbase"`
}

// Selectattributes represents a selectattributes bonus
type Selectattributes struct {
	Selectattribute []Selectattribute `xml:"selectattribute,omitempty" json:"selectattribute"`
}

// Selectcategory represents a selectcategory bonus
type Selectcategory struct {
	Category []string `xml:"category,omitempty" json:"category"`
	Value    *string  `xml:"value,omitempty" json:"value"`
}

// Selectcontact represents a selectcontact bonus
type Selectcontact struct {
	Forcedloyalty *string `xml:"forcedloyalty,omitempty" json:"forcedloyalty"`
	Forcegroup    *string `xml:"forcegroup,omitempty" json:"forcegroup"`
	Free          *string `xml:"free,omitempty" json:"free"`
	Loyalty       *string `xml:"loyalty,omitempty" json:"loyalty"`
	Type          *string `xml:"type,omitempty" json:"type"`
}

// Selectexpertise represents a selectexpertise bonus
type Selectexpertise struct {
	Skillcategories *Skillcategories `xml:"skillcategories,omitempty" json:"skillcategories"`
}

// Selectpower represents a selectpower bonus
type Selectpower struct {
	Ignorerating   []string `xml:"ignorerating,omitempty" json:"ignorerating"`
	Val            []string `xml:"val,omitempty" json:"val"`
	Limit          []string `xml:"limit,omitempty" json:"limit"`
	Pointsperlevel []string `xml:"pointsperlevel,omitempty" json:"pointsperlevel"`
}

// Selectpowers represents a selectpowers bonus
type Selectpowers struct {
	Selectpower []Selectpower `xml:"selectpower,omitempty" json:"selectpower"`
}

// Selectquality represents a selectquality bonus
type Selectquality struct {
	Quality           []Quality          `xml:"quality,omitempty" json:"quality"`
	Discountqualities *Discountqualities `xml:"discountqualities,omitempty" json:"discountqualities"`
	Content           string             `xml:",chardata" json:"+content,omitempty"`
	Contributetobp    *string            `xml:"contributetobp,omitempty" json:"contributetobp"`
	Forced            *bool              `xml:"forced,omitempty" json:"forced"`
	Rating            *int               `xml:"rating,omitempty" json:"rating"`
}

// Selectskill represents a selectskill bonus
type Selectskill struct {
	Minimumrating   *string          `xml:"minimumrating,attr,omitempty" json:"+@minimumrating,omitempty"`
	Val             *string          `xml:"val,omitempty" json:"val"`
	Applytorating   *string          `xml:"applytorating,omitempty" json:"applytorating"`
	Skillcategories *Skillcategories `xml:"skillcategories,omitempty" json:"skillcategories"`
}

// Selectskillgroup represents a selectskillgroup bonus
type Selectskillgroup struct {
	Bonus         *string `xml:"bonus,omitempty" json:"bonus"`
	Applytorating *string `xml:"applytorating,omitempty" json:"applytorating"`
}

// Selecttext represents a selecttext bonus
type Selecttext struct {
	XML       *string `xml:"xml,attr,omitempty" json:"+@xml,omitempty"`
	Xpath     *string `xml:"xpath,attr,omitempty" json:"+@xpath,omitempty"`
	Allowedit *string `xml:"allowedit,attr,omitempty" json:"+@allowedit,omitempty"`
}

// Selectweapon represents a selectweapon bonus
type Selectweapon struct {
	Excludecategory *string `xml:"excludecategory,attr,omitempty" json:"+@excludecategory,omitempty"`
	Includeunarmed  *string `xml:"includeunarmed,attr,omitempty" json:"+@includeunarmed,omitempty"`
	Weapondetails   *string `xml:"weapondetails,attr,omitempty" json:"+@weapondetails,omitempty"`
}

// Skillarticulation represents a skillarticulation bonus
type Skillarticulation struct {
	Bonus *string `xml:"bonus,omitempty" json:"bonus"`
}

// Skillattribute represents a skillattribute bonus
type Skillattribute struct {
	Name          *Name   `xml:"name,omitempty" json:"name"`
	Bonus         *string `xml:"bonus,omitempty" json:"bonus"`
	Exclude       *string `xml:"exclude,omitempty" json:"exclude"`
	Applytorating *string `xml:"applytorating,omitempty" json:"applytorating"`
	Condition     *string `xml:"condition,omitempty" json:"condition"`
	Content       string  `xml:",chardata" json:"+content,omitempty"`
	Precedence    *int    `xml:"precedence,omitempty" json:"precedence"`
}

// Skillcategories represents a skillcategories bonus
type Skillcategories struct {
	Category []string `xml:"category,omitempty" json:"category"`
}

// Skillcategory represents a skillcategory bonus
type Skillcategory struct {
	Name          *string `xml:"name,omitempty" json:"name"`
	Bonus         *string `xml:"bonus,omitempty" json:"bonus"`
	Exclude       *string `xml:"exclude,omitempty" json:"exclude"`
	Applytorating *string `xml:"applytorating,omitempty" json:"applytorating"`
	Condition     *string `xml:"condition,omitempty" json:"condition"`
}

// Skillcategorykarmacost represents a skillcategorykarmacost bonus
type Skillcategorykarmacost struct {
	Name      string  `xml:"name" json:"name"`
	Val       string  `xml:"val" json:"val"`
	Min       *string `xml:"min,omitempty" json:"min"`
	Max       *string `xml:"max,omitempty" json:"max"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Skillcategorykarmacostmultiplier represents a skillcategorykarmacostmultiplier bonus
type Skillcategorykarmacostmultiplier struct {
	Name      string  `xml:"name" json:"name"`
	Val       string  `xml:"val" json:"val"`
	Min       *string `xml:"min,omitempty" json:"min"`
	Max       *string `xml:"max,omitempty" json:"max"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Skillcategorypointcost represents a skillcategorypointcost bonus
type Skillcategorypointcost struct {
	Name      string  `xml:"name" json:"name"`
	Val       string  `xml:"val" json:"val"`
	Min       *string `xml:"min,omitempty" json:"min"`
	Max       *string `xml:"max,omitempty" json:"max"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Skillcategorypointcostmultiplier represents a skillcategorypointcostmultiplier bonus
type Skillcategorypointcostmultiplier struct {
	Name      string  `xml:"name" json:"name"`
	Val       string  `xml:"val" json:"val"`
	Min       *string `xml:"min,omitempty" json:"min"`
	Max       *string `xml:"max,omitempty" json:"max"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Skillcategoryspecializationkarmacost represents a skillcategoryspecializationkarmacost bonus
type Skillcategoryspecializationkarmacost struct {
	Name      string  `xml:"name" json:"name"`
	Val       string  `xml:"val" json:"val"`
	Min       *string `xml:"min,omitempty" json:"min"`
	Max       *string `xml:"max,omitempty" json:"max"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Skillcategoryspecializationkarmacostmultiplier represents a skillcategoryspecializationkarmacostmultiplier bonus
type Skillcategoryspecializationkarmacostmultiplier struct {
	Name      string  `xml:"name" json:"name"`
	Val       string  `xml:"val" json:"val"`
	Min       *string `xml:"min,omitempty" json:"min"`
	Max       *string `xml:"max,omitempty" json:"max"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Skillgroup represents a skillgroup bonus
type Skillgroup struct {
	Name          *string `xml:"name,omitempty" json:"name"`
	Exclude       *string `xml:"exclude,omitempty" json:"exclude"`
	Bonus         *string `xml:"bonus,omitempty" json:"bonus"`
	Applytorating *string `xml:"applytorating,omitempty" json:"applytorating"`
	Condition     *string `xml:"condition,omitempty" json:"condition"`
}

// Skillgroupcategorykarmacost represents a skillgroupcategorykarmacost bonus
type Skillgroupcategorykarmacost struct {
	Name      string  `xml:"name" json:"name"`
	Val       string  `xml:"val" json:"val"`
	Min       *string `xml:"min,omitempty" json:"min"`
	Max       *string `xml:"max,omitempty" json:"max"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Skillgroupcategorykarmacostmultiplier represents a skillgroupcategorykarmacostmultiplier bonus
type Skillgroupcategorykarmacostmultiplier struct {
	Name      string  `xml:"name" json:"name"`
	Val       string  `xml:"val" json:"val"`
	Min       *string `xml:"min,omitempty" json:"min"`
	Max       *string `xml:"max,omitempty" json:"max"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Skillgroupcategorypointcost represents a skillgroupcategorypointcost bonus
type Skillgroupcategorypointcost struct {
	Name      string  `xml:"name" json:"name"`
	Val       string  `xml:"val" json:"val"`
	Min       *string `xml:"min,omitempty" json:"min"`
	Max       *string `xml:"max,omitempty" json:"max"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Skillgroupcategorypointcostmultiplier represents a skillgroupcategorypointcostmultiplier bonus
type Skillgroupcategorypointcostmultiplier struct {
	Name      string  `xml:"name" json:"name"`
	Val       string  `xml:"val" json:"val"`
	Min       *string `xml:"min,omitempty" json:"min"`
	Max       *string `xml:"max,omitempty" json:"max"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Skillgroupkarmacost represents a skillgroupkarmacost bonus
type Skillgroupkarmacost struct {
	Name      string  `xml:"name" json:"name"`
	Val       string  `xml:"val" json:"val"`
	Min       *string `xml:"min,omitempty" json:"min"`
	Max       *string `xml:"max,omitempty" json:"max"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Skillgroupkarmacostmultiplier represents a skillgroupkarmacostmultiplier bonus
type Skillgroupkarmacostmultiplier struct {
	Name      string  `xml:"name" json:"name"`
	Val       string  `xml:"val" json:"val"`
	Min       *string `xml:"min,omitempty" json:"min"`
	Max       *string `xml:"max,omitempty" json:"max"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Skillgrouplevel represents a skillgrouplevel bonus
type Skillgrouplevel struct {
	Name string  `xml:"name,omitempty" json:"name"`
	Val  *string `xml:"val,omitempty" json:"val"`
}

// Skillgrouppointcost represents a skillgrouppointcost bonus
type Skillgrouppointcost struct {
	Name      string  `xml:"name" json:"name"`
	Val       string  `xml:"val" json:"val"`
	Min       *string `xml:"min,omitempty" json:"min"`
	Max       *string `xml:"max,omitempty" json:"max"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Skillgrouppointcostmultiplier represents a skillgrouppointcostmultiplier bonus
type Skillgrouppointcostmultiplier struct {
	Name      string  `xml:"name" json:"name"`
	Val       string  `xml:"val" json:"val"`
	Min       *string `xml:"min,omitempty" json:"min"`
	Max       *string `xml:"max,omitempty" json:"max"`
	Condition *string `xml:"condition,omitempty" json:"condition"`
}

// Skilllinkedattribute represents a skilllinkedattribute bonus
type Skilllinkedattribute struct {
	Name          *Name   `xml:"name,omitempty" json:"name"`
	Bonus         *string `xml:"bonus,omitempty" json:"bonus"`
	Exclude       *string `xml:"exclude,omitempty" json:"exclude"`
	Applytorating *string `xml:"applytorating,omitempty" json:"applytorating"`
	Condition     *string `xml:"condition,omitempty" json:"condition"`
	Content       string  `xml:",chardata" json:"+content,omitempty"`
	Precedence    *int    `xml:"precedence,omitempty" json:"precedence"`
}

// Skillsoft represents a skillsoft bonus
type Skillsoft struct {
	Val             *string          `xml:"val,omitempty" json:"val"`
	Skillcategories *Skillcategories `xml:"skillcategories,omitempty" json:"skillcategories"`
}

// Skillsoftaccess represents a skillsoftaccess bonus
type Skillsoftaccess struct {
	Content    string `xml:",chardata" json:"+content,omitempty"`
	Precedence *int   `xml:"precedence,omitempty" json:"precedence"`
}

// Skillwire represents a skillwire bonus
type Skillwire struct {
	Content    string `xml:",chardata" json:"+content,omitempty"`
	Precedence *int   `xml:"precedence,omitempty" json:"precedence"`
}

// Specificattribute represents a specificattribute bonus
type Specificattribute struct {
	Name       *Name   `xml:"name,omitempty" json:"name"`
	Aug        *string `xml:"aug,omitempty" json:"aug"`
	Max        *string `xml:"max,omitempty" json:"max"`
	Min        *string `xml:"min,omitempty" json:"min"`
	Val        *string `xml:"val,omitempty" json:"val"`
	Affectbase *string `xml:"affectbase,omitempty" json:"affectbase"`
	Content    string  `xml:",chardata" json:"+content,omitempty"`
	Precedence *int    `xml:"precedence,omitempty" json:"precedence"`
}

// Specificpower represents a specificpower bonus
type Specificpower struct {
	Name            *string           `xml:"name,omitempty" json:"name"`
	Val             *string           `xml:"val,omitempty" json:"val"`
	Selectskill     *Selectskill      `xml:"selectskill,omitempty" json:"selectskill"`
	Selectattribute []Selectattribute `xml:"selectattribute,omitempty" json:"selectattribute"`
	Selecttext      *string           `xml:"selecttext,omitempty" json:"selecttext"`
}

// Specificskill represents a specificskill bonus
type Specificskill struct {
	Name          string  `xml:"name,omitempty" json:"name"`
	Bonus         *string `xml:"bonus,omitempty" json:"bonus"`
	Applytorating *string `xml:"applytorating,omitempty" json:"applytorating"`
	Condition     *string `xml:"condition,omitempty" json:"condition"`
	Misceffect    *string `xml:"misceffect,omitempty" json:"misceffect"`
	Max           *string `xml:"max,omitempty" json:"max"`
}

// Spellcategory represents a spellcategory bonus
type Spellcategory struct {
	Name string `xml:"name" json:"name"`
	Val  string `xml:"val" json:"val"`
}

// Spellcategorydamage represents a spellcategorydamage bonus
type Spellcategorydamage struct {
	Category string `xml:"category" json:"category"`
	Val      string `xml:"val" json:"val"`
}

// Spellcategorydrain represents a spellcategorydrain bonus
type Spellcategorydrain struct {
	Category *string `xml:"category,omitempty" json:"category"`
	Val      string  `xml:"val" json:"val"`
}

// Spelldescriptordamage represents a spelldescriptordamage bonus
type Spelldescriptordamage struct {
	Descriptor string `xml:"descriptor" json:"descriptor"`
	Val        string `xml:"val" json:"val"`
}

// Spelldescriptordrain represents a spelldescriptordrain bonus
type Spelldescriptordrain struct {
	Descriptor string `xml:"descriptor" json:"descriptor"`
	Val        string `xml:"val" json:"val"`
}

// Spelldicepool represents a spelldicepool bonus
type Spelldicepool struct {
	Name string `xml:"name" json:"name"`
	Val  string `xml:"val" json:"val"`
}

// Sprintbonus represents a sprintbonus bonus
type Sprintbonus struct {
	Category string  `xml:"category" json:"category"`
	Val      *string `xml:"val,omitempty" json:"val"`
	Percent  *string `xml:"percent,omitempty" json:"percent"`
}

// Swapskillattribute represents a swapskillattribute bonus
type Swapskillattribute struct {
	Attribute    []string `xml:"attribute,omitempty" json:"attribute"`
	Limittoskill *string  `xml:"limittoskill,omitempty" json:"limittoskill"`
}

// Swapskillspecattribute represents a swapskillspecattribute bonus
type Swapskillspecattribute struct {
	Attribute    []string `xml:"attribute,omitempty" json:"attribute"`
	Limittoskill *string  `xml:"limittoskill,omitempty" json:"limittoskill"`
	Spec         string   `xml:"spec" json:"spec"`
}

// Threshold represents a threshold bonus
type Threshold struct {
	Content    string `xml:",chardata" json:"+content,omitempty"`
	Precedence *int   `xml:"precedence,omitempty" json:"precedence"`
}

// Thresholdoffset represents a thresholdoffset bonus
type Thresholdoffset struct {
	Content    string `xml:",chardata" json:"+content,omitempty"`
	Precedence *int   `xml:"precedence,omitempty" json:"precedence"`
}

// Unlockskills represents a unlockskills bonus
type Unlockskills struct {
	Content string  `xml:",chardata" json:"+content,omitempty"`
	Name    *string `xml:"name,omitempty" json:"name"`
}

// Walkmultiplier represents a walkmultiplier bonus
type Walkmultiplier struct {
	Category string  `xml:"category" json:"category"`
	Val      *string `xml:"val,omitempty" json:"val"`
	Percent  *string `xml:"percent,omitempty" json:"percent"`
}

// Weaponaccuracy represents a weaponaccuracy bonus
type Weaponaccuracy struct {
	Name  *string `xml:"name,omitempty" json:"name"`
	Value *string `xml:"value,omitempty" json:"value"`
}

// Weaponcategorydice represents a weaponcategorydice bonus
type Weaponcategorydice struct {
	Selectcategory []Selectcategory `xml:"selectcategory,omitempty" json:"selectcategory"`
	Category       []BonusCategory  `xml:"category,omitempty" json:"category"`
}

// Weaponcategorydv represents a weaponcategorydv bonus
type Weaponcategorydv struct {
	Selectskill *Selectskill `xml:"selectskill,omitempty" json:"selectskill"`
	Bonus       *string      `xml:"bonus,omitempty" json:"bonus"`
	Name        *string      `xml:"name,omitempty" json:"name"`
}

// Weaponrangemodifier represents a weaponrangemodifier bonus
type Weaponrangemodifier struct {
	Name  *string `xml:"name,omitempty" json:"name"`
	Value *string `xml:"value,omitempty" json:"value"`
}

// Weaponskillaccuracy represents a weaponskillaccuracy bonus
type Weaponskillaccuracy struct {
	Selectskill *Selectskill `xml:"selectskill,omitempty" json:"selectskill"`
	Name        *string      `xml:"name,omitempty" json:"name"`
	Value       *string      `xml:"value,omitempty" json:"value"`
}

// Additional bonus types (to be expanded)
// Note: This is a partial implementation - bonuses.xsd contains 642 elements
