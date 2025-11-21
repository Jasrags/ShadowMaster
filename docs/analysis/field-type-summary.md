# Field Type Summary

This document summarizes field type patterns and recommendations across all analyzed XML files.

## Enum Candidates

Found 1197 fields that are good candidates for enum types.

### accel
Appears in 2 file(s):

- **vehicles** (`chummer/vehicles/vehicle/accel`)
  - Unique values: 15
  - Values: 0, 1, 1/1, 1/2, 1/3, 2, 2/3, 2/4, 3, 3/2, 4, 5, 6, 7, 8

- **vehicles** (`chummer/mods/mod/bonus/accel`)
  - Unique values: 4
  - Values: +Rating, -1, 0, Rating

### accessory
Appears in 2 file(s):

- **weapons** (`chummer/accessories/accessory/forbidden/oneof/accessory`)
  - Unique values: 25
  - Values: Advanced Safety System, Basic, Advanced Safety System, Electro Shocker, Advanced Safety System, Explosive Self Destruct, Advanced Safety System, Immobilization, Advanced Safety System, Self Destruct, Airburst Link, Ammo Skip, Ceramic/Plasteel Components, Chameleon Coating (Rifle), Easy Breakdown (Powered), Electronic Firing, Safe Target System, Base, Sawed Off/Shortbarrel, Sawed Off/Shortbarrel and Stock Removal, Smart Firing Platform, Smartgun System, External, Smartgun System, Internal, Stock Removal, Weapon Commlink, Weapon Personality

- **weapons** (`chummer/accessories/accessory/required/oneof/accessory`)
  - Unique values: 6
  - Values: Drum Magazine, 24-round, Drum Magazine, 32-round, Krime Dual-Mode External Smartgun Link, Safe Target System, Base, Smartgun System, External, Smartgun System, Internal

### accuracy
Appears in 3 file(s):

- **gear** (`chummer/gears/gear/weaponbonus/accuracy`)
  - Unique values: 2
  - Values: -1, -2

- **weapons** (`chummer/weapons/weapon/accuracy`)
  - Unique values: 15
  - Values: 0, 2, 3, 3+number({STR} >= 5)+number({STR} >= 7), 4, 5, 6, 7, 8, 9, Missile, Physical, Physical+1, Physical-1, Physical-2

- **weapons** (`chummer/accessories/accessory/accuracy`)
  - Unique values: 3
  - Values: -1, 1, 2

### action
Appears in 2 file(s):

- **critterpowers** (`chummer/powers/power/action`)
  - Unique values: 7
  - Values: As ritual, Auto, Complex, Free, None, Simple, Special

- **powers** (`chummer/powers/power/action`)
  - Unique values: 5
  - Values: Complex, Free, Interrupt, Simple, Special

### addlimit
Appears in 1 file(s):

- **actions** (`chummer/actions/action/boosts/boost/addlimit`)
  - Unique values: 2
  - Values: {Physical}, {Weapon: Accuracy}

### addmetamagic
Appears in 2 file(s):

- **qualities** (`chummer/qualities/quality/bonus/addmetamagic`)
  - Unique values: 3
  - Values: Psychometry, Reflection, Sensing

- **traditions** (`chummer/traditions/tradition/bonus/addmetamagic`)
  - Unique values: 2
  - Values: Exorcism, Masking

### addmodcategory
Appears in 1 file(s):

- **armor** (`chummer/armors/armor/addmodcategory`)
  - Unique values: 5
  - Values: Customized Ballistic Mask, Full Body Armor Mods, Nightshade IR, Rapid Transit Detailing, Urban Explorer Jumpsuit Accessories

### addoncategory
Appears in 2 file(s):

- **armor** (`chummer/mods/mod/addoncategory`)
  - Unique values: 5
  - Values: Commlinks, Cyberdecks, Drugs, Rigger Command Consoles, Toxins

- **gear** (`chummer/gears/gear/addoncategory`)
  - Unique values: 17
  - Values: Audio Enhancements, Common Programs, Currency, Custom, Cyberdeck Modules, Cyberdecks, Drug Grades, Drugs, Electronic Modification, Hacking Programs, ID/Credsticks, Nanogear, Sensor Functions, Sensors, Tools of the Trade, Toxins, Vision Enhancements

### addparentweaponaccessory
Appears in 1 file(s):

- **cyberware** (`chummer/cyberwares/cyberware/addparentweaponaccessory`)
  - Unique values: 4
  - Values: External Clip Port, Laser Sight, Overclocked, Silencer/Suppressor

### addquality
Appears in 5 file(s):

- **lifemodules** (`chummer/modules/module/versions/version/bonus/addqualities/addquality`)
  - Unique values: 14
  - Values: Allergy (Uncommon, Mild), Code of Honor, Codeslinger, Cynic, First Impression, Focused Concentration, Gearhead, Grease Monkey, Natural Athlete, Overclocker, SINner: National, Steely Eyed Wheelman, Toughness, Uneducated

- **mentors** (`chummer/mentors/mentor/bonus/addqualities/addquality`)
  - Unique values: 4
  - Values: Allergy (Common, Mild), Distinctive Style, Driven, Perceptive

- **mentors** (`chummer/mentors/mentor/choices/choice/bonus/addqualities/addquality`)
  - Unique values: 3
  - Values: Home Ground, Linguist, Witness My Hate

- **qualities** (`chummer/qualities/quality/bonus/addqualities/addquality`)
  - Unique values: 6
  - Values: Distinctive Style, High Pain Tolerance, Home Ground, Magic Resistance, SINner (Criminal), Wanted

- **traditions** (`chummer/traditions/tradition/bonus/addqualities/addquality`)
  - Unique values: 12
  - Values: Animal Familiar, Arcane Arrester, Barehanded Adept, Code of Honor, Dark Ally, Dedicated Conjurer, Mentor Spirit, Pacifist I, Spectral Warden, Spiritual Lodge, Spiritual Pilgrim, Vexcraft

### addvehicle
Appears in 1 file(s):

- **cyberware** (`chummer/cyberwares/cyberware/addvehicle`)
  - Unique values: 2
  - Values: Ocular Drone, Remote Cyberhand

### addweapon
Appears in 5 file(s):

- **armor** (`chummer/armors/armor/addweapon`)
  - Unique values: 4
  - Values: Ares Briefcase Shield, Ballistic Shield, Riot Shield, Shiawase Arms Simoom

- **bioware** (`chummer/biowares/bioware/addweapon`)
  - Unique values: 13
  - Values: Bone Spike I, Bone Spike II, Bone Spike III, Claws (Bio-Weapon), Electrical Discharge, Fangs (Bio-Weapon), Horns (Bio-Weapon), Large Stinger, Large Tusk(s), Medium Stinger, Medium Tusk(s), Retractable Claws (Bio-Weapon), Retractable Fangs (Bio-Weapon)

- **cyberware** (`chummer/cyberwares/cyberware/addweapon`)
  - Unique values: 31
  - Values: Cyber Heavy Pistol (2050), Cyber Hold-Out, Cyber Holdout Pistol (2050), Cyber Light Pistol (2050), Cyber Shotgun, Cyber Shotgun (2050), Cyber Submachine Gun, Cyber Submachine Gun (2050), Cyberfangs, Grapple Fist, Hand Blade, Hand Razors, Hand Razors, Fixed (2050), Hand Razors, Retractable (2050), Heavy Cyber Pistol, Junkyard Jaw, Light Cyber Pistol, Shock Hand, Spur, Fixed (2050), Spurs

- **qualities** (`chummer/qualities/quality/addweapon`)
  - Unique values: 10
  - Values: Bite (Naga), Digging Claws, Fangs, Functional Tail (Thagomizer), Goring Horns, Kick (Centaur), Larger Tusks, Raptor Beak, Razor Claws, Retractable Claws

- **weapons** (`chummer/weapons/weapon/addweapon`)
  - Unique values: 21
  - Values: Barrens Special: Bayonet, Gunstock War Club (Thrown), HK XM30 Carbine, HK XM30 Grenade Launcher, HK XM30 LMG, HK XM30 Shotgun, HK XM30 Sniper, Krime Reaver Knob, Krime Reaver Pick, Krime Trollbow Horns, Krime Whammy (Melee), Onotari HL-13 (Sniper Rifle), Onotari HL-13 Personal Defense Weapon, Onotari HL-13 Urban Assault, Steyr AUG-CSL Carbine (2050), Steyr AUG-CSL III (Carbine), Steyr AUG-CSL III (LMG), Steyr AUG-CSL III (Sniper Rifle), Steyr AUG-CSL LMG (2050), Steyr AUG-CSL SMG (2050)

### adept
Appears in 1 file(s):

- **metamagic** (`chummer/metamagics/metamagic/adept`)
  - Unique values: 2
  - Values: False, True

### adeptway
Appears in 1 file(s):

- **powers** (`chummer/powers/power/adeptway`)
  - Unique values: 3
  - Values: 0.25, 0.5, 0.75

### age
Appears in 1 file(s):

- **contacts** (`chummer/ages/age`)
  - Unique values: 4
  - Values: Middle-Aged, Old, Unknown, Young

### agi
Appears in 1 file(s):

- **traditions** (`chummer/spirits/spirit/agi`)
  - Unique values: 9
  - Values: 0, F, F+0, F+1, F+2, F+3, F-1, F-2, F-3

### agiaug
Appears in 4 file(s):

- **critters** (`chummer/metatypes/metatype/agiaug`)
  - Unique values: 24
  - Values: 0, 1, 10, 12, 13, 14, 3, 4, 6, 8, 9, F, F+1, F+2, F+3, F+4, F+5, F-1, F-2, F-3

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/agiaug`)
  - Unique values: 4
  - Values: F, F+1, F+2, F+3

- **metatypes** (`chummer/metatypes/metatype/agiaug`)
  - Unique values: 6
  - Values: 0, 10, 11, 12, 8, 9

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/agiaug`)
  - Unique values: 5
  - Values: 0, 10, 11, 12, 9

### agimax
Appears in 4 file(s):

- **critters** (`chummer/metatypes/metatype/agimax`)
  - Unique values: 20
  - Values: 0, 1, 10, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F+4, F+5, F-1, F-2, F-3

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/agimax`)
  - Unique values: 4
  - Values: F, F+1, F+2, F+3

- **metatypes** (`chummer/metatypes/metatype/agimax`)
  - Unique values: 6
  - Values: 0, 4, 5, 6, 7, 8

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/agimax`)
  - Unique values: 5
  - Values: 0, 5, 6, 7, 8

### agimin
Appears in 4 file(s):

- **critters** (`chummer/metatypes/metatype/agimin`)
  - Unique values: 20
  - Values: 0, 1, 10, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F+4, F+5, F-1, F-2, F-3

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/agimin`)
  - Unique values: 4
  - Values: F, F+1, F+2, F+3

- **metatypes** (`chummer/metatypes/metatype/agimin`)
  - Unique values: 4
  - Values: 0, 1, 2, 3

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/agimin`)
  - Unique values: 4
  - Values: 0, 1, 2, 3

### allowaccessory
Appears in 1 file(s):

- **weapons** (`chummer/weapons/weapon/allowaccessory`)
  - Unique values: 2
  - Values: False, True

### allowcyberwareessdiscounts
Appears in 1 file(s):

- **settings** (`chummer/settings/setting/allowcyberwareessdiscounts`)
  - Unique values: 2
  - Values: False, True

### allowed
Appears in 1 file(s):

- **lifestyles** (`chummer/qualities/quality/allowed`)
  - Unique values: 8
  - Values: Commercial, High, High, Luxury, High,Luxury, Low,Medium,High,Luxury, Luxury, Medium,High,Luxury, Squatter,Low,Medium,High,Luxury

### allowedweapons
Appears in 1 file(s):

- **vehicles** (`chummer/vehicles/vehicle/weaponmounts/weaponmount/allowedweapons`)
  - Unique values: 13
  - Values: Colt Cobra TZ-120, Defiance EX Shocker, GE Vindicator Mini-Gun, Jaws, Krupp Munitions 3E Firefighting Cannon, Melee Bite, Micro-Torpedo Launcher, Riot Shield, Siemens FWD Screamer Sonic Cannon, Stoner-Ares M202, Sword, Underbarrel Grenade Launcher, Yamaha Pulsar

### allowpointbuyspecializationsonkarmaskills
Appears in 1 file(s):

- **settings** (`chummer/settings/setting/allowpointbuyspecializationsonkarmaskills`)
  - Unique values: 2
  - Values: False, True

### allowspellrange
Appears in 1 file(s):

- **qualities** (`chummer/qualities/quality/bonus/allowspellrange`)
  - Unique values: 2
  - Values: T, T (A)

### alternaterange
Appears in 1 file(s):

- **weapons** (`chummer/weapons/weapon/alternaterange`)
  - Unique values: 2
  - Values: Harpoon Gun (Underwater), Shotguns (flechette)

### ammo
Appears in 2 file(s):

- **weapons** (`chummer/accessories/accessory/required/weapondetails/OR/ammo`)
  - Unique values: 6
  - Values: (belt), (c), (d), (m), Energy, External Source

- **weapons** (`chummer/accessories/accessory/required/oneof/weapondetails/OR/ammo`)
  - Unique values: 2
  - Values: (cy), (d)

### ammobonus
Appears in 1 file(s):

- **weapons** (`chummer/accessories/accessory/ammobonus`)
  - Unique values: 5
  - Values: -2, -25, -50, 50, 50 * Rating

### ammocategory
Appears in 2 file(s):

- **weapons** (`chummer/weapons/weapon/ammocategory`)
  - Unique values: 8
  - Values: Assault Rifles, Grenade Launchers, Heavy Pistols, Holdouts, Light Pistols, Shotguns, Sniper Rifles, Sporting Rifles

- **weapons** (`chummer/accessories/accessory/required/weapondetails/OR/ammocategory`)
  - Unique values: 2
  - Values: Grenade Launchers, Missile Launchers

### ammoforweapontype
Appears in 1 file(s):

- **gear** (`chummer/gears/gear/ammoforweapontype`)
  - Unique values: 32
  - Values: bow, cannon, crossbow, firefighting cannons, flame, flaregun, glauncher, gun, gyrojet, man-catcher, microglauncher, mlauncher, netgun, netgunxl, sfw-30 underbarrel weapon, spraypen, squirtgun, taser, torpglauncher, trackstopper

### ammoreplace
Appears in 1 file(s):

- **weapons** (`chummer/accessories/accessory/ammoreplace`)
  - Unique values: 9
  - Values: 10, 100(belt), 20, 24(d), 2500(belt), 30, 32(d), 40(c), External Source

### ap
Appears in 5 file(s):

- **critterpowers** (`chummer/powers/power/bonus/naturalweapon/ap`)
  - Unique values: 5
  - Values: +1, -1, -2, -6, 0

- **gear** (`chummer/gears/gear/weaponbonus/ap`)
  - Unique values: 10
  - Values: -1, -2, -3, -4, -5, 1, 2, 4, 5, 6

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/bonus/naturalweapon/ap`)
  - Unique values: 5
  - Values: -, -1, -2, -3, 0

- **qualities** (`chummer/qualities/quality/naturalweapons/naturalweapon/ap`)
  - Unique values: 4
  - Values: -1, -2, -4, 4

- **weapons** (`chummer/weapons/weapon/ap`)
  - Unique values: 24
  - Values: +1, +3, +4, +4//-8, +5, -, -(Rating/4), -1, -1//-2, -10, -3, -4, -4//-10, -6, -8, -{MAG}*0.5, 0, 4, Missile, Special

### appname
Appears in 1 file(s):

- **options** (`chummer/pdfarguments/pdfargument/appnames/appname`)
  - Unique values: 21
  - Values: AcroRd32.exe, Acrobat.exe, FoxitPDFReader.exe, FoxitReader.exe, FoxitReaderPortable.exe, PDFXCView.exe, PDFXEdit.exe, PDFXHost32.exe, PDFXHost64.exe, brave.exe, browser.exe, chrome.exe, firefox.exe, iexplore.exe, msedge.exe, opera.exe, qqbrowser.exe, safari.exe, sumatrapdf.exe, sumatrapdfportable.exe

### apreplace
Appears in 1 file(s):

- **gear** (`chummer/gears/gear/weaponbonus/apreplace`)
  - Unique values: 5
  - Values: -1, -5, -6, -8, 0

### armor
Appears in 10 file(s):

- **armor** (`chummer/armors/armor/armor`)
  - Unique values: 24
  - Values: +1, +10, +3, +4, +6, 0, 1, 10, 12, 13, 14, 15, 16, 20, 3, 4, 6, 8, 9, Rating

- **armor** (`chummer/mods/mod/armor`)
  - Unique values: 4
  - Values: +2, +3, 0, 4

- **bioware** (`chummer/biowares/bioware/bonus/armor`)
  - Unique values: 2
  - Values: -1, Rating

- **critters** (`chummer/metatypes/metatype/armor`)
  - Unique values: 11
  - Values: (F x 2)H, 0, 1, 10, 12, 12H, 4, 6, 6H, F, F*2

- **cyberware** (`chummer/cyberwares/cyberware/bonus/armor`)
  - Unique values: 4
  - Values: 1, 2, 3, Rating

- **metatypes** (`chummer/metatypes/metatype/bonus/armor`)
  - Unique values: 2
  - Values: 1, 8

- **qualities** (`chummer/qualities/quality/bonus/armor`)
  - Unique values: 4
  - Values: 1, 2, 3, 4

- **vehicles** (`chummer/vehicles/vehicle/armor`)
  - Unique values: 22
  - Values: 0, 1, 10, 12, 13, 14, 15, 16, 2, 20, 24, 25, 27, 3, 4, 5, 6, 7, 8, 9

- **vehicles** (`chummer/mods/mod/bonus/armor`)
  - Unique values: 3
  - Values: +Rating, -3, Rating

- **vessels** (`chummer/metatypes/metatype/bonus/armor`)
  - Unique values: 9
  - Values: 12, 16, 2, 20, 24, 32, 4, 6, 8

### armorcapacity
Appears in 3 file(s):

- **armor** (`chummer/armors/armor/armorcapacity`)
  - Unique values: 17
  - Values: 0, 1, 10, 12, 14, 15, 16, 18, 2, 20, 3, 4, 5, 6, 8, 9, Rating

- **armor** (`chummer/mods/mod/armorcapacity`)
  - Unique values: 9
  - Values: FixedValues([1],[2],[3],[4],[5],[6]), [-(Capacity * 0.5 + 0.5*(Capacity mod 2))], [0], [1], [2], [3], [4], [6], [Rating]

- **gear** (`chummer/gears/gear/armorcapacity`)
  - Unique values: 10
  - Values: 0, Rating/[1], [0], [1], [2], [3], [4], [5], [6], [Rating]

### armoroverride
Appears in 1 file(s):

- **armor** (`chummer/armors/armor/armoroverride`)
  - Unique values: 3
  - Values: +2, +3, +4

### art
Appears in 2 file(s):

- **metamagic** (`chummer/metamagics/metamagic/required/allof/art`)
  - Unique values: 15
  - Values: Advanced Alchemy, Advanced Ritual Casting, Advanced Spellcasting, Apotropaic Magic, Blood Magic, Centering, Channeling, Cleansing, Divination, Flexible Signature, Geomancy, Invocation, Necromancy, Quickening, Sensing

- **metamagic** (`chummer/metamagics/metamagic/required/oneof/art`)
  - Unique values: 5
  - Values: Advanced Ritual Casting, Exorcism, Flexible Signature, Masking, Psychometry

### attack
Appears in 2 file(s):

- **gear** (`chummer/gears/gear/attack`)
  - Unique values: 12
  - Values: 0, 1, 10, 2, 3, 4, 5, 6, 7, 8, 9, {CHA}

- **qualities** (`chummer/qualities/quality/bonus/livingpersona/attack`)
  - Unique values: 2
  - Values: -1, 2

### attribute
Appears in 5 file(s):

- **mentors** (`chummer/mentors/mentor/choices/choice/bonus/specificpower/bonusoverride/selectattribute/attribute`)
  - Unique values: 3
  - Values: AGI, REA, STR

- **powers** (`chummer/powers/power/bonus/selectattribute/attribute`)
  - Unique values: 4
  - Values: AGI, BOD, REA, STR

- **qualities** (`chummer/qualities/quality/bonus/selectattributes/selectattribute/attribute`)
  - Unique values: 8
  - Values: AGI, BOD, CHA, INT, LOG, REA, STR, WIL

- **skills** (`chummer/skills/skill/attribute`)
  - Unique values: 10
  - Values: AGI, BOD, CHA, INT, LOG, MAG, REA, RES, STR, WIL

- **skills** (`chummer/knowledgeskills/skill/attribute`)
  - Unique values: 2
  - Values: INT, LOG

### attributearray
Appears in 1 file(s):

- **gear** (`chummer/gears/gear/attributearray`)
  - Unique values: 21
  - Values: 2,2,1,1, 4,3,2,1, 4,3,3,1, 5,4,1,1, 5,4,3,2, 5,4,4,2, 6,5,4,3, 6,5,5,3, 7,4,3,2, 7,5,3,1, 7,5,5,4, 7,6,5,4, 8,5,4,3, 8,6,4,2, 8,7,5,5, 8,7,6,5, 8,7,7,5, 8,8,7,6, 9,8,7,6, 9,9,8,8

### attributemaxclamp
Appears in 1 file(s):

- **qualities** (`chummer/qualities/quality/firstlevelbonus/attributemaxclamp`)
  - Unique values: 4
  - Values: AGI, BOD, REA, STR

### attributes
Appears in 1 file(s):

- **priorities** (`chummer/priorities/priority/attributes`)
  - Unique values: 5
  - Values: 12, 14, 16, 20, 24

### aug
Appears in 2 file(s):

- **critters** (`chummer/metatypes/metatype/bonus/enableattribute/aug`)
  - Unique values: 9
  - Values: 10, 13, 3, 5, 6, 7, 8, 9, F

- **qualities** (`chummer/qualities/quality/bonus/replaceattributes/replaceattribute/aug`)
  - Unique values: 15
  - Values: 0, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 6, 7, 8, 9

### avail
Appears in 11 file(s):

- **armor** (`chummer/armors/armor/avail`)
  - Unique values: 32
  - Values: 0, 1, 10, 12, 14, 14R, 15, 16, 16F, 16R, 18F, 18R, 22F, 24, 24R, 30F, 8, 8F, 8R, 9

- **armor** (`chummer/mods/mod/avail`)
  - Unique values: 19
  - Values: +2, +3, +4, +6, +8R, 0, 10F, 10R, 12R, 14F, 14R, 16F, 4, 6, 6R, 7R, 8, FixedValues(6F,6F,6F,9F,9F,9F), Rating * 2

- **bioware** (`chummer/grades/grade/avail`)
  - Unique values: 6
  - Values: +12, +2, +4, +8, -4, 0

- **bioware** (`chummer/biowares/bioware/avail`)
  - Unique values: 48
  - Values: (Rating * 3)F, (Rating * 4)R, (Rating * 5)R, (Rating * 6)R, (Rating*3)R, 10, 11, 12, 13, 16, 16F, 18F, 6F, 7F, 8, 8F, 8R, FixedValues(4,5,6), Rating * 2, Rating * 3

- **cyberware** (`chummer/grades/grade/avail`)
  - Unique values: 6
  - Values: +12, +2, +4, +8, -4, 0

- **drugcomponents** (`chummer/drugs/drug/avail`)
  - Unique values: 25
  - Values: 0, 10F, 10R, 12R, 14F, 14R, 16F, 1R, 2R, 3, 3F, 3R, 4, 4F, 5, 5F, 6, 8, 8F, 8R

- **programs** (`chummer/programs/program/avail`)
  - Unique values: 9
  - Values: (Rating * 2)R, 0, 0F, 12F, 4, 4R, 6R, Rating * 2, Rating * 3

- **vehicles** (`chummer/vehicles/vehicle/avail`)
  - Unique values: 46
  - Values: 0, 10, 11R, 12, 13F, 14R, 15R, 16, 16F, 16R, 18F, 18R, 20, 21R, 22F, 24R, 28F, 8, 8F, 8R

- **vehicles** (`chummer/weaponmounts/weaponmount/avail`)
  - Unique values: 14
  - Values: 0, 1, 10F, 12F, 14F, 16F, 2, 20F, 4, 4R, 6, 6F, 8F, 8R

- **vehicles** (`chummer/weaponmountmods/mod/avail`)
  - Unique values: 2
  - Values: 0, 6R

- **weapons** (`chummer/accessories/accessory/avail`)
  - Unique values: 36
  - Values: +2F, +4, 0, 10, 11F, 12, 14R, 15R, 16F, 18F, 18R, 2R, 3, 3R, 6, 7R, 8, 8F, 8R, 9F

### availability
Appears in 2 file(s):

- **drugcomponents** (`chummer/drugcomponents/drugcomponent/availability`)
  - Unique values: 3
  - Values: +1, +2, +4R

- **settings** (`chummer/settings/setting/availability`)
  - Unique values: 4
  - Values: 10, 12, 15, 99

### bioware
Appears in 4 file(s):

- **bioware** (`chummer/biowares/bioware/forbidden/oneof/bioware`)
  - Unique values: 8
  - Values: Bone Density Augmentation, Chemical Gland (Spitter), Cold Adaptation, Elastic Joints, Electroshock, Enhanced Articulation, Heat Adaptation, Insulation

- **critters** (`chummer/metatypes/metatype/biowares/bioware`)
  - Unique values: 9
  - Values: Bone Density Augmentation, Cerebral Booster, Chameleon Skin (Dynamic), Muscle Augmentation, Neo-EPO, Neuro Retention Amplification, Synaptic Acceleration, Tailored Pheromones, Vocal Range Expander

- **cyberware** (`chummer/cyberwares/cyberware/forbidden/oneof/bioware`)
  - Unique values: 9
  - Values: Bone Density Augmentation, Cerebral Booster, Enhanced Articulation, Mnemonic Enhancer, Muscle Augmentation, Muscle Toner, Orthoskin, Suprathyroid Gland, Synaptic Booster

- **qualities** (`chummer/qualities/quality/forbidden/oneof/bioware`)
  - Unique values: 10
  - Values: Damage Compensators, Damage Compensators (2050), Genetic Optimization (Agility), Genetic Optimization (Body), Genetic Optimization (Charisma), Genetic Optimization (Intuition), Genetic Optimization (Logic), Genetic Optimization (Reaction), Genetic Optimization (Strength), Genetic Optimization (Willpower)

### biowareessmultiplier
Appears in 1 file(s):

- **qualities** (`chummer/qualities/quality/bonus/biowareessmultiplier`)
  - Unique values: 2
  - Values: 120, 90

### blockskillcategorydefaulting
Appears in 1 file(s):

- **qualities** (`chummer/qualities/quality/bonus/blockskillcategorydefaulting`)
  - Unique values: 3
  - Values: Academic, Professional, Technical Active

### blocksmounts
Appears in 2 file(s):

- **bioware** (`chummer/biowares/bioware/blocksmounts`)
  - Unique values: 2
  - Values: ankle,knee,hip, wrist,elbow,shoulder

- **cyberware** (`chummer/cyberwares/cyberware/blocksmounts`)
  - Unique values: 7
  - Values: ankle,knee,hip, ankle,knee,wrist,elbow,hip,shoulder, elbow, knee, elbow,shoulder, knee,hip, wrist,elbow,shoulder, wrist,elbow,shoulder,ankle,knee,hip

### bod
Appears in 1 file(s):

- **traditions** (`chummer/spirits/spirit/bod`)
  - Unique values: 14
  - Values: 0, 1, 2, 6, 8, F, F+0, F+1, F+2, F+3, F+4, F+5, F-1, F-2

### bodaug
Appears in 5 file(s):

- **critters** (`chummer/metatypes/metatype/bodaug`)
  - Unique values: 33
  - Values: 0, 1, 10, 12, 13, 15, 16, 17, 19, 20, 22, 8, 9, F, F+1, F+3, F+4, F+7, F-2, F-3

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/bodaug`)
  - Unique values: 4
  - Values: F, F+3, F+5, F-1

- **metatypes** (`chummer/metatypes/metatype/bodaug`)
  - Unique values: 10
  - Values: 0, 10, 11, 12, 13, 14, 15, 6, 8, 9

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/bodaug`)
  - Unique values: 9
  - Values: 0, 10, 11, 12, 13, 14, 15, 8, 9

- **vessels** (`chummer/metatypes/metatype/bodaug`)
  - Unique values: 9
  - Values: 1, 10, 12, 14, 16, 2, 4, 6, 8

### bodmax
Appears in 5 file(s):

- **critters** (`chummer/metatypes/metatype/bodmax`)
  - Unique values: 31
  - Values: 0, 1, 10, 12, 13, 15, 16, 17, 20, 24, 8, 9, F, F+1, F+3, F+4, F+5, F+7, F-2, F-3

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/bodmax`)
  - Unique values: 4
  - Values: F, F+3, F+5, F-1

- **metatypes** (`chummer/metatypes/metatype/bodmax`)
  - Unique values: 10
  - Values: 0, 10, 11, 2, 4, 5, 6, 7, 8, 9

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/bodmax`)
  - Unique values: 9
  - Values: 0, 10, 11, 4, 5, 6, 7, 8, 9

- **vessels** (`chummer/metatypes/metatype/bodmax`)
  - Unique values: 9
  - Values: 1, 10, 12, 14, 16, 2, 4, 6, 8

### bodmin
Appears in 5 file(s):

- **critters** (`chummer/metatypes/metatype/bodmin`)
  - Unique values: 30
  - Values: 0, 1, 10, 12, 13, 14, 15, 16, 17, 20, 8, 9, F, F+1, F+3, F+4, F+5, F+7, F-2, F-3

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/bodmin`)
  - Unique values: 4
  - Values: F, F+3, F+5, F-1

- **metatypes** (`chummer/metatypes/metatype/bodmin`)
  - Unique values: 7
  - Values: 0, 1, 2, 3, 4, 5, 6

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/bodmin`)
  - Unique values: 8
  - Values: 0, 1, 121, 2, 3, 4, 5, 6

- **vessels** (`chummer/metatypes/metatype/bodmin`)
  - Unique values: 9
  - Values: 1, 10, 12, 14, 16, 2, 4, 6, 8

### body
Appears in 2 file(s):

- **vehicles** (`chummer/vehicles/vehicle/body`)
  - Unique values: 28
  - Values: 0, 1, 10, 12, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24, 25, 27, 30, 6, 8, 9

- **vehicles** (`chummer/mods/mod/bonus/body`)
  - Unique values: 2
  - Values: -1, -Rating

### bodymodslots
Appears in 1 file(s):

- **vehicles** (`chummer/vehicles/vehicle/bodymodslots`)
  - Unique values: 2
  - Values: -7, 4

### bonus
Appears in 15 file(s):

- **bioware** (`chummer/biowares/bioware/bonus/specificskill/bonus`)
  - Unique values: 3
  - Values: 1, 2, 3

- **bioware** (`chummer/biowares/bioware/bonus/skillgroup/bonus`)
  - Unique values: 2
  - Values: 1, Rating

- **critterpowers** (`chummer/powers/power/bonus/specificskill/bonus`)
  - Unique values: 4
  - Values: 1, 2, 4, Rating

- **cyberware** (`chummer/cyberwares/cyberware/bonus/specificskill/bonus`)
  - Unique values: 2
  - Values: 4, Rating

- **cyberware** (`chummer/cyberwares/cyberware/wirelessbonus/specificskill/bonus`)
  - Unique values: 2
  - Values: 1, 2

- **drugcomponents** (`chummer/drugs/drug/bonus/specificskill/bonus`)
  - Unique values: 2
  - Values: 1, 2

- **mentors** (`chummer/mentors/mentor/choices/choice/bonus/specificskill/bonus`)
  - Unique values: 2
  - Values: 1, 2

- **mentors** (`chummer/mentors/mentor/bonus/specificskill/bonus`)
  - Unique values: 3
  - Values: -1, 1, 2

- **paragons** (`chummer/mentors/mentor/bonus/specificskill/bonus`)
  - Unique values: 2
  - Values: -2, 1

- **powers** (`chummer/powers/power/bonus/specificskill/bonus`)
  - Unique values: 3
  - Values: 1, 2, Rating

- **qualities** (`chummer/qualities/quality/bonus/skillattribute/bonus`)
  - Unique values: 2
  - Values: -Rating, 2

- **qualities** (`chummer/qualities/quality/bonus/specificskill/bonus`)
  - Unique values: 5
  - Values: -1, -2, 1, 2, 3

- **qualities** (`chummer/qualities/quality/bonus/skillcategory/bonus`)
  - Unique values: 7
  - Values: -1, -2, -3, -Rating, 1, 2, 3

- **qualities** (`chummer/qualities/quality/bonus/skillgroup/bonus`)
  - Unique values: 4
  - Values: -2, -4, 1, 2

- **traditions** (`chummer/traditions/tradition/bonus/specificskill/bonus`)
  - Unique values: 2
  - Values: 1, 2

### buildmethod
Appears in 1 file(s):

- **settings** (`chummer/settings/setting/buildmethod`)
  - Unique values: 4
  - Values: Karma, LifeModule, Priority, SumtoTen

### buildpoints
Appears in 1 file(s):

- **settings** (`chummer/settings/setting/buildpoints`)
  - Unique values: 6
  - Values: 1000, 13, 25, 35, 750, 800

### canformpersona
Appears in 1 file(s):

- **gear** (`chummer/gears/gear/canformpersona`)
  - Unique values: 2
  - Values: Parent, Self

### capacity
Appears in 4 file(s):

- **cyberware** (`chummer/cyberwares/cyberware/capacity`)
  - Unique values: 35
  - Values: 0, 1, 10, 12, 15, 17, 20, 40, 6, 8, [*], [-Rating], [0], [10], [15], [5], [6], [8], [Rating * 2], [Rating]

- **gear** (`chummer/gears/gear/gears/usegear/capacity`)
  - Unique values: 2
  - Values: 2/[2], [0]

- **gear** (`chummer/gears/gear/capacity`)
  - Unique values: 29
  - Values: 0, 1, 1/[1], 1000000, 3, 5000, 500000, 8/[6], Rating, Rating/[1], [0.066666666666667], [0.1], [0.28571428571429], [0.2], [0.33333333333333], [0.5], [0.99009900990099], [1.1111111111111], [1.25], [Rating]

- **vehicles** (`chummer/mods/mod/capacity`)
  - Unique values: 2
  - Values: 15, 20

### category
Appears in 75 file(s):

- **armor** (`chummer/categories/category`)
  - Unique values: 5
  - Values: Armor, Cloaks, Clothing, High-Fashion Armor Clothing, Specialty Armor

- **armor** (`chummer/modcategories/category`)
  - Unique values: 12
  - Values: Custom Liners (Rating 1), Custom Liners (Rating 2), Custom Liners (Rating 3), Custom Liners (Rating 4), Custom Liners (Rating 5), Custom Liners (Rating 6), Customized Ballistic Mask, Full Body Armor Mods, General, Nightshade IR, Rapid Transit Detailing, Urban Explorer Jumpsuit Accessories

- **armor** (`chummer/armors/armor/category`)
  - Unique values: 5
  - Values: Armor, Cloaks, Clothing, High-Fashion Armor Clothing, Specialty Armor

- **armor** (`chummer/armors/armor/selectmodsfromcategory/category`)
  - Unique values: 4
  - Values: Custom Liners (Rating 2), Custom Liners (Rating 3), Custom Liners (Rating 4), Custom Liners (Rating 6)

- **armor** (`chummer/armors/armor/gears/usegear/category`)
  - Unique values: 2
  - Values: Audio Devices, Vision Devices

- **armor** (`chummer/mods/mod/category`)
  - Unique values: 13
  - Values: Clothing, Custom Liners (Rating 1), Custom Liners (Rating 2), Custom Liners (Rating 3), Custom Liners (Rating 4), Custom Liners (Rating 5), Custom Liners (Rating 6), Customized Ballistic Mask, Full Body Armor Mods, General, Nightshade IR, Rapid Transit Detailing, Urban Explorer Jumpsuit Accessories

- **bioware** (`chummer/categories/category`)
  - Unique values: 16
  - Values: Basic, Bio-Weapons, Biosculpting, Chemical Gland Modifications, Complimentary Genetics, Cosmetic Bioware, Cultured, Environmental Microadaptation, Exotic Metagenetics, Genetic Restoration, Immunization, Orthoskin Upgrades, Phenotype Adjustment, Symbionts, Transgenic Alteration, Transgenics

- **bioware** (`chummer/biowares/bioware/category`)
  - Unique values: 16
  - Values: Basic, Bio-Weapons, Biosculpting, Chemical Gland Modifications, Complimentary Genetics, Cosmetic Bioware, Cultured, Environmental Microadaptation, Exotic Metagenetics, Genetic Restoration, Immunization, Orthoskin Upgrades, Phenotype Adjustment, Symbionts, Transgenic Alteration, Transgenics

- **critterpowers** (`chummer/categories/category`)
  - Unique values: 9
  - Values: Chimeric Modification, Drake, Emergent, Free Spirit, Infected, Mundane, Paranormal, Toxic Critter Powers, Weakness

- **critterpowers** (`chummer/powers/power/category`)
  - Unique values: 9
  - Values: Chimeric Modification, Drake, Emergent, Free Spirit, Infected, Mundane, Paranormal, Shapeshifter, Weakness

- **critterpowers** (`chummer/powers/power/bonus/movementreplace/category`)
  - Unique values: 2
  - Values: Fly, Ground

- **critters** (`chummer/categories/category`)
  - Unique values: 18
  - Values: Dracoforms, Extraplanar Travelers, Infected, Insect Spirits, Mundane Critters, Mutant Critters, Necro Spirits, Paranormal Critters, Protosapients, Ritual, Shadow Spirits, Shedim, Spirits, Sprites, Technocritters, Toxic Critters, Toxic Spirits, Warforms

- **critters** (`chummer/metatypes/metatype/category`)
  - Unique values: 18
  - Values: Dracoforms, Extraplanar Travelers, Infected, Insect Spirits, Mundane Critters, Mutant Critters, Necro Spirits, Paranormal Critters, Protosapients, Ritual, Shadow Spirits, Shedim, Spirits, Sprites, Technocritters, Toxic Critters, Toxic Spirits, Warforms

- **cyberware** (`chummer/categories/category`)
  - Unique values: 16
  - Values: Auto Injector Mods, Bodyware, Cosmetic Enhancement, Cyber Implant Weapon, Cyber Implant Weapon Accessory, Cyberlimb, Cyberlimb Accessory, Cyberlimb Enhancement, Cybersuite, Earware, Eyeware, Hard Nanoware, Headware, Nanocybernetics, Soft Nanoware, Special Biodrone Cyberware

- **cyberware** (`chummer/cyberwares/cyberware/category`)
  - Unique values: 16
  - Values: Auto Injector Mods, Bodyware, Cosmetic Enhancement, Cyber Implant Weapon, Cyber Implant Weapon Accessory, Cyberlimb, Cyberlimb Accessory, Cyberlimb Enhancement, Cybersuite, Earware, Eyeware, Hard Nanoware, Headware, Nanocybernetics, Soft Nanoware, Special Biodrone Cyberware

- **cyberware** (`chummer/cyberwares/cyberware/gears/usegear/category`)
  - Unique values: 2
  - Values: Commlink Accessories, Tools

- **cyberware** (`chummer/cyberwares/cyberware/allowsubsystems/category`)
  - Unique values: 12
  - Values: Auto Injector Mods, Bodyware, Cosmetic Enhancement, Cyber Implant Weapon, Cyber Implant Weapon Accessory, Cyberlimb, Cyberlimb Accessory, Cyberlimb Enhancement, Earware, Eyeware, Headware, Nanocybernetics

- **cyberware** (`chummer/cyberwares/cyberware/required/parentdetails/category`)
  - Unique values: 2
  - Values: Cyber Implant Weapon, Cyberlimb

- **cyberware** (`chummer/cyberwares/cyberware/pairbonus/walkmultiplier/category`)
  - Unique values: 2
  - Values: Ground, Swim

- **cyberware** (`chummer/cyberwares/cyberware/bonus/walkmultiplier/category`)
  - Unique values: 2
  - Values: Ground, Swim

- **drugcomponents** (`chummer/categories/category`)
  - Unique values: 3
  - Values: Block, Enhancer, Foundation

- **drugcomponents** (`chummer/drugs/drug/category`)
  - Unique values: 2
  - Values: Drugs, Toxins

- **drugcomponents** (`chummer/drugcomponents/drugcomponent/category`)
  - Unique values: 3
  - Values: Block, Enhancer, Foundation

- **gear** (`chummer/gears/gear/gears/usegear/category`)
  - Unique values: 13
  - Values: Audio Devices, Commlink Accessories, Commlink/Cyberdeck Form Factors, Common Programs, Electronics Accessories, Hacking Programs, Sensor Functions, Sensors, Software, Survival Gear, Tools, Vision Devices, Vision Enhancements

- **gear** (`chummer/gears/gear/required/geardetails/OR/category`)
  - Unique values: 11
  - Values: Armor, Cloaks, Clothing, Commlink, Commlinks, Custom, Cyberdecks, Cyberterminals, High-Fashion Armor Clothing, Sensors, Specialty Armor

- **lifestyles** (`chummer/categories/category`)
  - Unique values: 6
  - Values: Contracts, Entertainment - Asset, Entertainment - Outing, Entertainment - Service, Negative, Positive

- **lifestyles** (`chummer/qualities/quality/category`)
  - Unique values: 6
  - Values: Contracts, Entertainment - Asset, Entertainment - Outing, Entertainment - Service, Negative, Positive

- **mentors** (`chummer/mentors/mentor/choices/choice/bonus/specificpower/bonusoverride/selectskill/skillcategories/category`)
  - Unique values: 4
  - Values: Physical Active, Social Active, Technical Active, Vehicle Active

- **metatypes** (`chummer/categories/category`)
  - Unique values: 4
  - Values: Metahuman, Metasapient, Metavariant, Shapeshifter

- **metatypes** (`chummer/metatypes/metatype/category`)
  - Unique values: 3
  - Values: Metahuman, Metasapient, Shapeshifter

- **options** (`chummer/blackmarketpipelinecategories/category`)
  - Unique values: 11
  - Values: Armor, Bioware, Cyberware, Drugs, Electronics, Geneware, Magic, Nanoware, Software, Vehicles, Weapons

- **packs** (`chummer/categories/category`)
  - Unique values: 12
  - Values: Armor Packs, Color Packs, Community Packs, Core Packs, Custom, Cyber Packs, Decker Packs, Drone Packs, Lifestyle Packs, Magic Packs, Vehicle Packs, Weapon and Ammo Packs

- **packs** (`chummer/packs/pack/category`)
  - Unique values: 10
  - Values: Armor Packs, Color Packs, Community Packs, Core Packs, Cyber Packs, Decker Packs, Drone Packs, Lifstyle Packs, Vehicle Packs, Weapon and Ammo Packs

- **packs** (`chummer/packs/pack/gears/gear/category`)
  - Unique values: 24
  - Values: Ammunition, Audio Devices, Breaking and Entering Gear, Commlinks, Cyberdecks, DocWagon Contract, Electronics Accessories, Explosives, Grapple Gun, Hacking Programs, ID/Credsticks, RFID Tags, Sensor Functions, Skillsofts, Software, Survival Gear, Tools, Tools of the Trade, Toxins, Vision Devices

- **packs** (`chummer/packs/pack/gears/gear/gears/gear/category`)
  - Unique values: 7
  - Values: Audio Enhancements, Commlink Accessories, Electronics Accessories, Grapple Gun, ID/Credsticks, Toxins, Vision Enhancements

- **packs** (`chummer/packs/pack/armors/armor/gears/gear/category`)
  - Unique values: 4
  - Values: Biotech, Communications and Countermeasures, Survival Gear, Vision Enhancements

- **packs** (`chummer/packs/pack/vehicles/vehicle/gears/gear/category`)
  - Unique values: 3
  - Values: Audio Enhancements, Sensors, Vision Enhancements

- **packs** (`chummer/packs/pack/vehicles/vehicle/gears/gear/gears/gear/category`)
  - Unique values: 2
  - Values: Sensor Functions, Vision Enhancements

- **packs** (`chummer/packs/pack/vehicles/vehicle/gears/gear/gears/gear/gears/gear/category`)
  - Unique values: 2
  - Values: Audio Enhancements, Vision Enhancements

- **powers** (`chummer/powers/power/bonus/weaponcategorydv/selectcategory/category`)
  - Unique values: 5
  - Values: Astral Combat, Blades, Clubs, Exotic Melee Weapon, Unarmed Combat

- **powers** (`chummer/powers/power/bonus/selectskill/skillcategories/category`)
  - Unique values: 5
  - Values: Combat Active, Physical Active, Social Active, Technical Active, Vehicle Active

- **priorities** (`chummer/categories/category`)
  - Unique values: 5
  - Values: Attributes, Heritage, Resources, Skills, Talent

- **priorities** (`chummer/priorities/priority/category`)
  - Unique values: 5
  - Values: Attributes, Heritage, Resources, Skills, Talent

- **programs** (`chummer/categories/category`)
  - Unique values: 5
  - Values: Advanced Programs, Autosofts, Common Programs, Hacking Programs, Software

- **programs** (`chummer/programs/program/category`)
  - Unique values: 5
  - Values: Advanced Programs, Autosofts, Common Programs, Hacking Programs, Software

- **qualities** (`chummer/categories/category`)
  - Unique values: 2
  - Values: Negative, Positive

- **qualities** (`chummer/qualities/quality/category`)
  - Unique values: 2
  - Values: Negative, Positive

- **qualities** (`chummer/qualities/quality/bonus/addgear/category`)
  - Unique values: 2
  - Values: Commlinks, ID/Credsticks

- **qualities** (`chummer/qualities/quality/bonus/movementreplace/category`)
  - Unique values: 2
  - Values: Fly, Ground

- **qualities** (`chummer/qualities/quality/bonus/walkmultiplier/category`)
  - Unique values: 2
  - Values: Ground, Swim

- **qualities** (`chummer/qualities/quality/bonus/dealerconnection/category`)
  - Unique values: 4
  - Values: Aircraft, Drones, Groundcraft, Watercraft

- **skills** (`chummer/categories/category`)
  - Unique values: 13
  - Values: Academic, Combat Active, Interest, Language, Magical Active, Physical Active, Professional, Pseudo-Magical Active, Resonance Active, Social Active, Street, Technical Active, Vehicle Active

- **skills** (`chummer/skills/skill/category`)
  - Unique values: 8
  - Values: Combat Active, Magical Active, Physical Active, Pseudo-Magical Active, Resonance Active, Social Active, Technical Active, Vehicle Active

- **skills** (`chummer/knowledgeskills/skill/category`)
  - Unique values: 5
  - Values: Academic, Interest, Language, Professional, Street

- **spells** (`chummer/categories/category`)
  - Unique values: 7
  - Values: Combat, Detection, Enchantments, Health, Illusion, Manipulation, Rituals

- **spells** (`chummer/spells/spell/category`)
  - Unique values: 7
  - Values: Combat, Detection, Enchantments, Health, Illusion, Manipulation, Rituals

- **strings** (`chummer/spiritcategories/category`)
  - Unique values: 5
  - Values: Combat, Detection, Health, Illusion, Manipulation

- **traditions** (`chummer/spirits/spirit/category`)
  - Unique values: 2
  - Values: Shedim, Spirits

- **vehicles** (`chummer/categories/category`)
  - Unique values: 19
  - Values: Bikes, Boats, Cars, Corpsec/Police/Military, Drones: Anthro, Drones: Huge, Drones: Large, Drones: Medium, Drones: Micro, Drones: Mini, Drones: Missile, Drones: Small, Fixed-Wing Aircraft, LTAV, Municipal/Construction, Rotorcraft, Submarines, Trucks, VTOL/VSTOL

- **vehicles** (`chummer/modcategories/category`)
  - Unique values: 7
  - Values: Body, Cosmetic, Electromagnetic, Model-Specific, Powertrain, Protection, Weapons

- **vehicles** (`chummer/vehicles/vehicle/category`)
  - Unique values: 20
  - Values: Bikes, Boats, Cars, Corpsec/Police/Military, Drones: Anthro, Drones: Huge, Drones: Large, Drones: Medium, Drones: Micro, Drones: Mini, Drones: Missile, Drones: Small, Fixed-Wing Aircraft, Hovercraft, LTAV, Municipal/Construction, Rotorcraft, Submarines, Trucks, VTOL/VSTOL

- **vehicles** (`chummer/mods/mod/category`)
  - Unique values: 13
  - Values: Acceleration, All, Armor, Body, Cosmetic, Electromagnetic, Handling, Model-Specific, Powertrain, Protection, Sensor, Speed, Weapons

- **vehicles** (`chummer/mods/mod/required/vehicledetails/OR/category`)
  - Unique values: 12
  - Values: Bikes, Boats, Cars, Corpsec/Police/Military, Drones, Fixed-Wing Aircraft, LTAV, Municipal/Construction, Rotorcraft, Submarines, Trucks, VTOL/VSTOL

- **vehicles** (`chummer/weaponmounts/weaponmount/category`)
  - Unique values: 4
  - Values: Control, Flexibility, Size, Visibility

- **vehicles** (`chummer/weaponmountmods/mod/category`)
  - Unique values: 2
  - Values: All, Weapons

- **weapons** (`chummer/categories/category`)
  - Unique values: 31
  - Values: Assault Cannons, Bio-Weapon, Bows, Carbines, Cyberweapon, Exotic Ranged Weapons, Grenade Launchers, Heavy Pistols, Improvised Weapons, Light Machine Guns, Light Pistols, Machine Pistols, Medium Machine Guns, Micro-Drone Weapons, Missile Launchers, Shotguns, Sniper Rifles, Sporting Rifles, Unarmed, Underbarrel Weapons

- **weapons** (`chummer/weapons/weapon/category`)
  - Unique values: 32
  - Values: Assault Cannons, Bio-Weapon, Bows, Carbines, Cyberweapon, Exotic Ranged Weapons, Gear, Grenade Launchers, Heavy Pistols, Improvised Weapons, Light Machine Guns, Light Pistols, Machine Pistols, Medium Machine Guns, Missile Launchers, Quality, Shotguns, Sporting Rifles, Unarmed, Underbarrel Weapons

- **weapons** (`chummer/weapons/weapon/accessories/accessory/gears/usegear/category`)
  - Unique values: 5
  - Values: Autosofts, Commlinks, Sensors, Software, Vision Enhancements

- **weapons** (`chummer/weapons/weapon/required/weapondetails/OR/AND/OR/category`)
  - Unique values: 9
  - Values: Assault Cannons, Grenade Launchers, Heavy Machine Guns, Light Machine Guns, Medium Machine Guns, Missile Launchers, Shotguns, Sniper Rifles, Sporting Rifles

- **weapons** (`chummer/weapons/weapon/required/weapondetails/OR/category`)
  - Unique values: 3
  - Values: Assault Rifles, Sniper Rifles, Sporting Rifles

- **weapons** (`chummer/accessories/accessory/required/weapondetails/OR/category`)
  - Unique values: 21
  - Values: Assault Cannons, Assault Rifles, Bows, Flamethrowers, Grenade Launchers, Heavy Machine Guns, Heavy Pistols, Holdouts, Laser Weapons, Light Machine Guns, Light Pistols, Machine Pistols, Medium Machine Guns, Missile Launchers, Pistol, Shotguns, Sniper Rifles, Sporting Rifles, Tasers, Underbarrel Weapons

- **weapons** (`chummer/accessories/accessory/gears/usegear/category`)
  - Unique values: 6
  - Values: Electronics Accessories, Sensor Functions, Software, Survival Gear, Vision Devices, Vision Enhancements

- **weapons** (`chummer/accessories/accessory/forbidden/weapondetails/OR/category`)
  - Unique values: 6
  - Values: Bows, Heavy Pistols, Holdouts, Light Pistols, Machine Pistols, Shotguns

- **weapons** (`chummer/accessories/accessory/forbidden/weapondetails/OR/AND/OR/category`)
  - Unique values: 4
  - Values: Heavy Pistols, Holdouts, Light Pistols, Tasers

- **weapons** (`chummer/accessories/accessory/required/weapondetails/OR/AND/OR/category`)
  - Unique values: 9
  - Values: Assault Cannons, Grenade Launchers, Heavy Machine Guns, Light Machine Guns, Medium Machine Guns, Missile Launchers, Shotguns, Sniper Rifles, Sporting Rifles

### cfp
Appears in 1 file(s):

- **priorities** (`chummer/priorities/priority/talents/talent/cfp`)
  - Unique values: 3
  - Values: 3, 4, 7

### cha
Appears in 2 file(s):

- **streams** (`chummer/spirits/spirit/cha`)
  - Unique values: 4
  - Values: F+0, F+1, F+3, F-1

- **traditions** (`chummer/spirits/spirit/cha`)
  - Unique values: 8
  - Values: 0, 1, F, F+0, F+1, F-1, F-2, F/2

### chaaug
Appears in 3 file(s):

- **critters** (`chummer/metatypes/metatype/chaaug`)
  - Unique values: 20
  - Values: 0, 1, 10, 11, 12, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F+4, F-1, F-2

- **metatypes** (`chummer/metatypes/metatype/chaaug`)
  - Unique values: 5
  - Values: 10, 11, 12, 8, 9

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/chaaug`)
  - Unique values: 5
  - Values: 10, 11, 12, 8, 9

### chamax
Appears in 3 file(s):

- **critters** (`chummer/metatypes/metatype/chamax`)
  - Unique values: 17
  - Values: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F+4, F-1, F-2

- **metatypes** (`chummer/metatypes/metatype/chamax`)
  - Unique values: 5
  - Values: 4, 5, 6, 7, 8

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/chamax`)
  - Unique values: 5
  - Values: 4, 5, 6, 7, 8

### chamin
Appears in 3 file(s):

- **critters** (`chummer/metatypes/metatype/chamin`)
  - Unique values: 16
  - Values: 0, 1, 2, 3, 4, 5, 6, 8, 9, F, F+1, F+2, F+3, F+4, F-1, F-2

- **metatypes** (`chummer/metatypes/metatype/chamin`)
  - Unique values: 3
  - Values: 1, 2, 3

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/chamin`)
  - Unique values: 3
  - Values: 1, 2, 3

### characterquality
Appears in 2 file(s):

- **lifestyles** (`chummer/qualities/quality/required/oneof/characterquality`)
  - Unique values: 2
  - Values: SINner (Corporate Limited), SINner (Corporate)

- **lifestyles** (`chummer/qualities/quality/forbidden/oneof/characterquality`)
  - Unique values: 2
  - Values: SINner (Corporate Limited), SINner (Corporate)

### coldarmor
Appears in 2 file(s):

- **armor** (`chummer/mods/mod/bonus/coldarmor`)
  - Unique values: 7
  - Values: 1, 2, 3, 4, 5, 6, Rating

- **qualities** (`chummer/qualities/quality/bonus/coldarmor`)
  - Unique values: 2
  - Values: 2, 4

### complexform
Appears in 1 file(s):

- **critters** (`chummer/metatypes/metatype/complexforms/complexform`)
  - Unique values: 13
  - Values: Derezz, Diffusion of [Matrix Attribute], Editor, Infusion of [Matrix Attribute], Pulse Storm, Puppeteer, Resonance Channel, Resonance Spike, Resonance Veil, Static Bomb, Static Veil, Tattletale, Transcendent Grid

### conceal
Appears in 4 file(s):

- **weapons** (`chummer/weapons/weapon/conceal`)
  - Unique values: 15
  - Values: -1, -10, -2, -3, -4, -5, -6, 0, 1, 10, 2, 3, 4, 6, 8

- **weapons** (`chummer/accessories/accessory/conceal`)
  - Unique values: 9
  - Values: +1, +2, -1, -2, -6, 0, 1, 2, Rating

- **weapons** (`chummer/accessories/accessory/required/weapondetails/OR/conceal`)
  - Unique values: 2
  - Values: -2, 0

- **weapons** (`chummer/accessories/accessory/required/weapondetails/conceal`)
  - Unique values: 2
  - Values: 0, 4

### condition
Appears in 11 file(s):

- **armor** (`chummer/armors/armor/bonus/limitmodifier/condition`)
  - Unique values: 13
  - Values: LimitCondition_BunkerGearVisible, LimitCondition_CorporationVisible, LimitCondition_ExcludeFansGangers, LimitCondition_ExcludeIntimidationVisible, LimitCondition_GangVisible, LimitCondition_IntimidationVisible, LimitCondition_PublicVisible, LimitCondition_ShieldPhysicalPenalty, LimitCondition_SkillsActiveGymnasticsClimbing, LimitCondition_SkillsActiveSneakingVisible, LimitCondition_SportsFans, LimitCondition_SportsRivals, LimitCondition_Visible

- **armor** (`chummer/armors/armor/wirelessbonus/limitmodifier/condition`)
  - Unique values: 3
  - Values: LimitCondition_ClimbingTests, LimitCondition_IntimidationVisible, LimitCondition_Visible

- **armor** (`chummer/mods/mod/bonus/limitmodifier/condition`)
  - Unique values: 2
  - Values: LimitCondition_TestSneakingThermal, LimitCondition_Visible

- **bioware** (`chummer/biowares/bioware/bonus/limitmodifier/condition`)
  - Unique values: 6
  - Values: LimitCondition_SkillGroupStealthNaked, LimitCondition_SkillsActiveEscapeArtist, LimitCondition_SkillsActiveLeadership, LimitCondition_SkillsActivePerformanceSinging, LimitCondition_SkillsActiveSwimming, LimitCondition_TestSpeech

- **cyberware** (`chummer/cyberwares/cyberware/pairbonus/limitmodifier/condition`)
  - Unique values: 2
  - Values: LimitCondition_InUse, LimitCondition_SkillGroupStealth

- **mentors** (`chummer/mentors/mentor/choices/choice/bonus/specificskill/condition`)
  - Unique values: 17
  - Values: Contractual, Fire, Guardian Spirit, Physical Combat, Plague Spirit, Plant Spirit, Spirits of Air, Spirits of Beasts, Spirits of Earth, Spirits of Earth (Low Tide), Spirits of Fire, Spirits of Man, Spirits of Water, Spirits of Water (High Tide), Sun, Task Spirit, Toxic Spirits

- **mentors** (`chummer/mentors/mentor/bonus/specificskill/condition`)
  - Unique values: 4
  - Values: Balance, Climbing, Jumping, Unknown Areas

- **paragons** (`chummer/mentors/mentor/bonus/specificskill/condition`)
  - Unique values: 3
  - Values: Edit File, Matrix Search, Not against IC

- **qualities** (`chummer/qualities/quality/bonus/specificskill/condition`)
  - Unique values: 23
  - Values: Combat maneuvers, Communities of majority orks and/or trolls, Companion Sprite, Fault Sprite, Generalist Sprite, Groups of exclusively orks and/or trolls, Hearing, Hiding in a crowd, Hot-Sim, Items specifically for orks and/or trolls, Machine Sprite, Matrix Perception, Matters of life or death, Not Urban, Scent, Taste, Touch, Urban, Visual, With plausible-seeming evidence

- **qualities** (`chummer/qualities/quality/bonus/limitmodifier/condition`)
  - Unique values: 7
  - Values: LimitCondition_ExcludeIntimidation, LimitCondition_Megacorp, LimitCondition_NationalLanguageRanks, LimitCondition_QualityChatty, LimitCondition_QualityTrustworthy, LimitCondition_SkillsKnowledgeAcademic, LimitCondition_Sprawl

- **qualities** (`chummer/qualities/quality/bonus/skillgroup/condition`)
  - Unique values: 8
  - Values: Desert, Forest, Jungle, Mountain, Polar, Rural, Urban, When in hosts

### contactkarma
Appears in 1 file(s):

- **qualities** (`chummer/qualities/quality/bonus/contactkarma`)
  - Unique values: 2
  - Values: -1, -2

### contactpointsexpression
Appears in 1 file(s):

- **settings** (`chummer/settings/setting/contactpointsexpression`)
  - Unique values: 2
  - Values: {CHAUnaug} * 3, {CHAUnaug} * 6

### control
Appears in 3 file(s):

- **vehicles** (`chummer/vehicles/vehicle/weaponmounts/weaponmount/control`)
  - Unique values: 3
  - Values: Armored Manual, Manual, Remote

- **vehicles** (`chummer/weaponmounts/weaponmount/required/weaponmountdetails/control`)
  - Unique values: 3
  - Values: Manual [SR5], None, Remote [SR5]

- **vehicles** (`chummer/weaponmounts/weaponmount/forbidden/weaponmountdetails/control`)
  - Unique values: 3
  - Values: Manual [SR5], None, Remote [SR5]

### cost
Appears in 10 file(s):

- **bioware** (`chummer/grades/grade/cost`)
  - Unique values: 6
  - Values: 0.75, 1, 1.2, 1.5, 2.5, 5

- **cyberware** (`chummer/grades/grade/cost`)
  - Unique values: 7
  - Values: 0.75, 1, 1.2, 1.3, 1.5, 2.5, 5

- **drugcomponents** (`chummer/grades/grade/cost`)
  - Unique values: 4
  - Values: 0.5, 1, 2, 6

- **drugcomponents** (`chummer/drugs/drug/cost`)
  - Unique values: 32
  - Values: 10, 1000, 1100, 1250, 15, 150, 1500, 1700, 20, 200, 2000, 25, 250, 2500, 30, 300, 500, 750, 800, 900

- **drugcomponents** (`chummer/drugcomponents/drugcomponent/cost`)
  - Unique values: 5
  - Values: 20, 30, 40, 50, 75

- **lifestyles** (`chummer/lifestyles/lifestyle/cost`)
  - Unique values: 10
  - Values: 0, 1, 1000, 10000, 100000, 2000, 3000, 500, 5000, 8000

- **lifestyles** (`chummer/qualities/quality/cost`)
  - Unique values: 38
  - Values: -300, 0, 1000, 100000 div 12, 15, 150, 1500, 15000, 180, 20, 200, 2000, 25, 250, 25000 div 12, 300, 4500, 5000, 50000 div 12, 9000

- **vehicles** (`chummer/weaponmounts/weaponmount/cost`)
  - Unique values: 14
  - Values: 0, 1500, 1600, 2000, 2400, 2500, 3200, 400, 4000, 4800, 500, 5000, 750, 800

- **vehicles** (`chummer/weaponmountmods/mod/cost`)
  - Unique values: 5
  - Values: 200, 25, 50, 500, Slots * 100

- **weapons** (`chummer/accessories/accessory/cost`)
  - Unique values: 44
  - Values: 0, 10, 1000, 150, 1700, 20, 200, 2000, 22000, 25, 250, 300, 35, 3500, 70, 700, 750, 800, 900, Weapon Cost

### costfor
Appears in 1 file(s):

- **gear** (`chummer/gears/gear/costfor`)
  - Unique values: 10
  - Values: 1, 10, 100, 2, 20, 3, 4, 5, 50, 6

### crashdamage
Appears in 1 file(s):

- **drugcomponents** (`chummer/drugcomponents/drugcomponent/effects/effect/crashdamage`)
  - Unique values: 4
  - Values: 1, 2, 4, 8

### critterpower
Appears in 1 file(s):

- **qualities** (`chummer/qualities/quality/forbidden/oneof/critterpower`)
  - Unique values: 8
  - Values: Compulsion, Fear, Influence, Magical Guard, Mimicry, Paralyzing Howl, Psychokinesis, Regeneration

### cyberlegmovement
Appears in 1 file(s):

- **settings** (`chummer/settings/setting/cyberlegmovement`)
  - Unique values: 2
  - Values: False, True

### cyberseeker
Appears in 1 file(s):

- **qualities** (`chummer/qualities/quality/bonus/cyberseeker`)
  - Unique values: 4
  - Values: AGI, BOX, STR, WIL

### cyberware
Appears in 6 file(s):

- **bioware** (`chummer/biowares/bioware/forbidden/oneof/cyberware`)
  - Unique values: 5
  - Values: Bone Lacing (Aluminum), Bone Lacing (Plastic), Bone Lacing (Titanium), Dermal Plating, Smart Articulation

- **bioware** (`chummer/biowares/bioware/required/oneof/cyberware`)
  - Unique values: 3
  - Values: Control Rig, Reaction Enhancers, Wired Reflexes

- **cyberware** (`chummer/cyberwares/cyberware/forbidden/oneof/cyberware`)
  - Unique values: 42
  - Values: Bone Lacing (Plastic), Bone Lacing (Titanium), Cybereyes Basic System, Muscle Replacement, Obvious Full Arm, Obvious Full Leg, Obvious Hand, Obvious Lower Arm, Obvious Lower Leg, Obvious Skull, Olfactory Booster, Partial Cyberskull, Primitive Prosthetic Lower Leg, Skilljack, Skillwires, Smart Articulation, Synthetic Foot, Synthetic Full Leg, Synthetic Hand, Taste Booster

- **cyberware** (`chummer/cyberwares/cyberware/required/allof/cyberware`)
  - Unique values: 3
  - Values: Siemens Cyberspine, Siemens Cyberspine Upgrade (Elite Athletic), Siemens Cyberspine Upgrade (Elite Warrior)

- **tips** (`chummer/tips/tip/required/allof/cyberware`)
  - Unique values: 2
  - Values: Boosted Reflexes, Large Smuggling Compartment

- **tips** (`chummer/tips/tip/required/allof/grouponeof/cyberware`)
  - Unique values: 3
  - Values: Control Rig, Datajack, Datajack Plus

### cyberwarecontains
Appears in 1 file(s):

- **cyberware** (`chummer/cyberwares/cyberware/forbidden/oneof/cyberwarecontains`)
  - Unique values: 2
  - Values: Liminal, Skull

### cyberwareessmultiplier
Appears in 1 file(s):

- **qualities** (`chummer/qualities/quality/bonus/cyberwareessmultiplier`)
  - Unique values: 2
  - Values: 120, 90

### damage
Appears in 6 file(s):

- **critterpowers** (`chummer/powers/power/bonus/naturalweapon/damage`)
  - Unique values: 5
  - Values: ({STR}+1)P, ({STR}+2)P, ({STR}+3)P, ({STR}-1)P, {BOD}S(e)

- **gear** (`chummer/gears/gear/weaponbonus/damage`)
  - Unique values: 7
  - Values: -1, -2, -2S(e), -3, -4, 1, 2

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/bonus/naturalweapon/damage`)
  - Unique values: 3
  - Values: ({STR}+1)P, ({STR}+2)P, ({STR}+3)P

- **qualities** (`chummer/qualities/quality/naturalweapons/naturalweapon/damage`)
  - Unique values: 3
  - Values: ({STR}+1)P, ({STR}+2)P, ({STR}+3)P

- **spells** (`chummer/spells/spell/damage`)
  - Unique values: 4
  - Values: 0, P, S, Special

- **weapons** (`chummer/accessories/accessory/damage`)
  - Unique values: 3
  - Values: -1, -2, 1

### damagereplace
Appears in 1 file(s):

- **gear** (`chummer/gears/gear/weaponbonus/damagereplace`)
  - Unique values: 10
  - Values: 0S, 12S(e), 6P, 7P, 8P, 8S(e), 9P, As Drug/Toxin, As Narcoject, Special

### damageresistance
Appears in 3 file(s):

- **cyberware** (`chummer/cyberwares/cyberware/bonus/damageresistance`)
  - Unique values: 3
  - Values: 1, 2, 3

- **mentors** (`chummer/mentors/mentor/bonus/damageresistance`)
  - Unique values: 2
  - Values: 1, 2

- **qualities** (`chummer/qualities/quality/bonus/damageresistance`)
  - Unique values: 3
  - Values: 1, 2, 4

### damagetype
Appears in 2 file(s):

- **gear** (`chummer/gears/gear/weaponbonus/damagetype`)
  - Unique values: 6
  - Values: (M), (S), Acid, P(f), S, S(e)

- **gear** (`chummer/gears/gear/flechetteweaponbonus/damagetype`)
  - Unique values: 2
  - Values: P(f), S(e)

### dataprocessing
Appears in 2 file(s):

- **gear** (`chummer/gears/gear/dataprocessing`)
  - Unique values: 11
  - Values: 0, 1, 2, 3, 4, 5, 6, 7, 8, Rating, {LOG}

- **qualities** (`chummer/qualities/quality/bonus/livingpersona/dataprocessing`)
  - Unique values: 2
  - Values: -1, 2

### default
Appears in 1 file(s):

- **skills** (`chummer/skills/skill/default`)
  - Unique values: 2
  - Values: False, True

### defenselimit
Appears in 1 file(s):

- **actions** (`chummer/actions/action/test/defenselimit`)
  - Unique values: 2
  - Values: {Max: {Physical} or {Mental}}, {Mental}

### depaug
Appears in 3 file(s):

- **critters** (`chummer/metatypes/metatype/depaug`)
  - Unique values: 8
  - Values: 0, 10, 11, 14, 15, 5, 6, 9

- **metatypes** (`chummer/metatypes/metatype/depaug`)
  - Unique values: 2
  - Values: 0, 6

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/depaug`)
  - Unique values: 2
  - Values: 0, 6

### depmax
Appears in 3 file(s):

- **critters** (`chummer/metatypes/metatype/depmax`)
  - Unique values: 6
  - Values: 0, 10, 11, 5, 6, 7

- **metatypes** (`chummer/metatypes/metatype/depmax`)
  - Unique values: 2
  - Values: 0, 6

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/depmax`)
  - Unique values: 2
  - Values: 0, 6

### depmin
Appears in 3 file(s):

- **critters** (`chummer/metatypes/metatype/depmin`)
  - Unique values: 8
  - Values: 0, 2, 3, 4, 5, 6, 7, 8

- **metatypes** (`chummer/metatypes/metatype/depmin`)
  - Unique values: 2
  - Values: 0, 1

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/depmin`)
  - Unique values: 2
  - Values: 0, 1

### depth
Appears in 1 file(s):

- **priorities** (`chummer/priorities/priority/talents/talent/depth`)
  - Unique values: 5
  - Values: 1, 2, 3, 4, 6

### devicerating
Appears in 2 file(s):

- **cyberware** (`chummer/grades/grade/devicerating`)
  - Unique values: 5
  - Values: 2, 3, 4, 5, 6

- **gear** (`chummer/gears/gear/devicerating`)
  - Unique values: 12
  - Values: 0, 1, 2, 3, 4, 5, 6, 7, 8, Rating, {RES}, {Rating}

### dice
Appears in 1 file(s):

- **lifestyles** (`chummer/lifestyles/lifestyle/dice`)
  - Unique values: 7
  - Values: 0, 1, 2, 3, 4, 5, 6

### dicebonus
Appears in 1 file(s):

- **actions** (`chummer/actions/action/boosts/boost/dicebonus`)
  - Unique values: 7
  - Values: {AGI}, {CHA}, {Gymnastics}, {Perception}, {Unarmed Combat}, {WIL}, {Weapon: Skill}

### directoryname
Appears in 1 file(s):

- **settings** (`chummer/settings/setting/customdatadirectorynames/customdatadirectoryname/directoryname`)
  - Unique values: 12
  - Values: 39b1963e-dfb3-4082-8d7f-79f88dab786f>1.0, 4873b11d-347a-4aa5-a41c-5f7d60a6433d>2.0.0, 4b3a4c48-d2af-4e46-9d27-9f06eab83c0c>2.0.0, Chrome Flesh Stealth Errata, Dark Terrors Stealth Errata, Forbidden Arcana Stealth Errata, German Data Changes, No Future Stealth Errata, Only Allow Basic Metatypes at Character Creation, Shadowrun Missions Neotokyo Rules, Shadowrun Missions Rules, Sum-to-Ten Improved

### disablebiowaregrade
Appears in 2 file(s):

- **critterpowers** (`chummer/powers/power/bonus/disablebiowaregrade`)
  - Unique values: 12
  - Values: Alphaware, Alphaware (Adapsin), Betaware, Betaware (Adapsin), Omegaware, Omegaware (Adapsin), Standard, Standard (Adapsin), Standard (Burnout's Way), Standard (Burnout's Way) (Adapsin), Used, Used (Adapsin)

- **qualities** (`chummer/qualities/quality/bonus/disablebiowaregrade`)
  - Unique values: 5
  - Values: Alphaware, Omegaware, Standard, Standard (Burnout's Way), Used

### disablecyberwaregrade
Appears in 2 file(s):

- **critterpowers** (`chummer/powers/power/bonus/disablecyberwaregrade`)
  - Unique values: 12
  - Values: Alphaware, Alphaware (Adapsin), Betaware, Betaware (Adapsin), Omegaware, Omegaware (Adapsin), Standard, Standard (Adapsin), Standard (Burnout's Way), Standard (Burnout's Way) (Adapsin), Used, Used (Adapsin)

- **qualities** (`chummer/qualities/quality/bonus/disablecyberwaregrade`)
  - Unique values: 12
  - Values: Alphaware, Alphaware (Adapsin), Greyware, Greyware (Adapsin), Omegaware, Omegaware (Adapsin), Standard, Standard (Adapsin), Standard (Burnout's Way), Standard (Burnout's Way) (Adapsin), Used, Used (Adapsin)

### disablequality
Appears in 2 file(s):

- **bioware** (`chummer/biowares/bioware/bonus/disablequality`)
  - Unique values: 2
  - Values: 3564b678-7721-4a8d-ac79-1600cf92dc14, Celerity

- **cyberware** (`chummer/cyberwares/cyberware/bonus/disablequality`)
  - Unique values: 9
  - Values: 02e76a38-304e-4a0e-93a3-ad2938306afc, 210401d7-57fa-4260-9517-2725689a509e, 2f080d13-92d7-4b16-9ee6-93b5a89206e4, 3564b678-7721-4a8d-ac79-1600cf92dc14, 4390735f-54fa-44a5-bce7-d23a67427f25, 7a468691-1362-439a-a096-76da6933b24c, 8ec5c9bb-aeb9-42f2-a436-a60f764adfe4, Celerity, fd346177-3791-44c0-af8c-7cf176fc9aa3

### display
Appears in 1 file(s):

- **qualities** (`chummer/xpathqueries/query/display`)
  - Unique values: 7
  - Values: String_SelectQuality_XPathQuery_AddQualityBonus, String_SelectQuality_XPathQuery_KarmaRange, String_SelectQuality_XPathQuery_MetagenicOnly, String_SelectQuality_XPathQuery_NegativeOnly, String_SelectQuality_XPathQuery_PositiveOnly, String_SelectQuality_XPathQuery_RunFasterSource, String_SelectQuality_XPathQuery_SpellPoints

### dodge
Appears in 2 file(s):

- **bioware** (`chummer/biowares/bioware/bonus/dodge`)
  - Unique values: 2
  - Values: 1, 2

- **qualities** (`chummer/qualities/quality/bonus/dodge`)
  - Unique values: 3
  - Values: -Rating, 1, 2

### drain
Appears in 1 file(s):

- **traditions** (`chummer/traditions/tradition/drain`)
  - Unique values: 5
  - Values: {WIL} + {CHA}, {WIL} + {INT}, {WIL} + {LOG}, {WIL} + {MAG}, {WIL} + {WIL}

### dronemods
Appears in 1 file(s):

- **settings** (`chummer/settings/setting/dronemods`)
  - Unique values: 2
  - Values: False, True

### duration
Appears in 6 file(s):

- **actions** (`chummer/actions/action/boosts/boost/duration`)
  - Unique values: 2
  - Values: One Attack, Rest of Turn

- **complexforms** (`chummer/complexforms/complexform/duration`)
  - Unique values: 5
  - Values: E, I, P, S, Special

- **critterpowers** (`chummer/powers/power/duration`)
  - Unique values: 9
  - Values: Always, As ritual, F x 10 Combat Turns, Instant, Per Spell, Permanent, Predetermined by Sprite, Special, Sustained

- **drugcomponents** (`chummer/drugs/drug/duration`)
  - Unique values: 5
  - Values: (10-{BOD})*3600, (12-{BOD})*3600, (6-{BOD})*3600, 345600, {D6}*600

- **options** (`chummer/availmap/avail/duration`)
  - Unique values: 3
  - Values: 1, 2, 6

- **spells** (`chummer/spells/spell/duration`)
  - Unique values: 4
  - Values: I, P, S, Special

### dv
Appears in 1 file(s):

- **spells** (`chummer/spells/spell/dv`)
  - Unique values: 14
  - Values: 0, F, F+1, F+2, F+3, F+4, F+5, F-1, F-2, F-3, F-4, F-5, F-6, Special

### edg
Appears in 1 file(s):

- **traditions** (`chummer/spirits/spirit/edg`)
  - Unique values: 2
  - Values: F, F/2

### edgaug
Appears in 3 file(s):

- **critters** (`chummer/metatypes/metatype/edgaug`)
  - Unique values: 13
  - Values: 0, 1, 12, 2, 3, 4, 5, 6, 7, 8, 9, F, F/2

- **metatypes** (`chummer/metatypes/metatype/edgaug`)
  - Unique values: 3
  - Values: 5, 6, 7

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/edgaug`)
  - Unique values: 3
  - Values: 5, 6, 7

### edgmax
Appears in 3 file(s):

- **critters** (`chummer/metatypes/metatype/edgmax`)
  - Unique values: 13
  - Values: 0, 1, 12, 2, 3, 4, 5, 6, 7, 8, 9, F, F/2

- **metatypes** (`chummer/metatypes/metatype/edgmax`)
  - Unique values: 3
  - Values: 5, 6, 7

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/edgmax`)
  - Unique values: 3
  - Values: 5, 6, 7

### edgmin
Appears in 3 file(s):

- **critters** (`chummer/metatypes/metatype/edgmin`)
  - Unique values: 10
  - Values: 0, 1, 2, 3, 4, 5, 6, 9, F, F/2

- **metatypes** (`chummer/metatypes/metatype/edgmin`)
  - Unique values: 2
  - Values: 1, 2

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/edgmin`)
  - Unique values: 2
  - Values: 1, 2

### electricityarmor
Appears in 1 file(s):

- **bioware** (`chummer/biowares/bioware/bonus/electricityarmor`)
  - Unique values: 3
  - Values: -2, 1, 2

### element
Appears in 1 file(s):

- **strings** (`chummer/elements/element`)
  - Unique values: 7
  - Values: Acid, Cold, Electricity, Fire, Pollutant, Radiation, Water

### ess
Appears in 5 file(s):

- **bioware** (`chummer/grades/grade/ess`)
  - Unique values: 6
  - Values: 0.4, 0.5, 0.7, 0.8, 1, 1.25

- **bioware** (`chummer/biowares/bioware/ess`)
  - Unique values: 27
  - Values: (Rating)*0.5, -0.1, 0, 0.02, 0.05*Rating, 0.1, 0.1*Rating, 0.15*Rating, 0.2*Rating, 0.25, 0.3, 0.5, 0.7, 1, FixedValues(0,0.01,0.02), Rating * 0.05, Rating * 0.2, Rating * 0.25, Rating * 0.3, Rating * 0.75

- **cyberware** (`chummer/grades/grade/ess`)
  - Unique values: 13
  - Values: 0.3, 0.4, 0.5, 0.6, 0.65, 0.7, 0.75, 0.8, 0.9, 1, 1.0, 1.125, 1.25

- **qualities** (`chummer/qualities/quality/required/allof/ess`)
  - Unique values: 2
  - Values: -5, -5.0001

- **qualities** (`chummer/qualities/quality/required/oneof/ess`)
  - Unique values: 2
  - Values: 0.0001, 1

### essaug
Appears in 1 file(s):

- **critters** (`chummer/metatypes/metatype/essaug`)
  - Unique values: 8
  - Values: 0, 10, 2D6, 3D6, 5, 6, F, F-2

### essencepenaltymagonlyt100
Appears in 1 file(s):

- **qualities** (`chummer/qualities/quality/bonus/essencepenaltymagonlyt100`)
  - Unique values: 4
  - Values: 100, 150, 200, 50

### essencepenaltyt100
Appears in 1 file(s):

- **qualities** (`chummer/qualities/quality/bonus/essencepenaltyt100`)
  - Unique values: 4
  - Values: -100, -150, -200, -50

### essmax
Appears in 1 file(s):

- **critters** (`chummer/metatypes/metatype/essmax`)
  - Unique values: 8
  - Values: 0, 10, 2D6, 3D6, 5, 6, F, F-2

### essmin
Appears in 1 file(s):

- **critters** (`chummer/metatypes/metatype/essmin`)
  - Unique values: 5
  - Values: 0, 2D6, 6, F, F-2

### exceednegativequalities
Appears in 1 file(s):

- **settings** (`chummer/settings/setting/exceednegativequalities`)
  - Unique values: 2
  - Values: False, True

### exceednegativequalitiesnobonus
Appears in 1 file(s):

- **settings** (`chummer/settings/setting/exceednegativequalitiesnobonus`)
  - Unique values: 2
  - Values: False, True

### exclude
Appears in 2 file(s):

- **options** (`chummer/limbcounts/limb/exclude`)
  - Unique values: 3
  - Values: skull, torso, torso,skull

- **qualities** (`chummer/qualities/quality/bonus/skillcategory/exclude`)
  - Unique values: 3
  - Values: Gunnery, Intimidation, Perception

### excludeattribute
Appears in 2 file(s):

- **qualities** (`chummer/qualities/quality/bonus/selectattributes/selectattribute/excludeattribute`)
  - Unique values: 8
  - Values: AGI, BOD, DEP, EDG, MAG, REA, RES, STR

- **spells** (`chummer/spells/spell/bonus/selectattribute/excludeattribute`)
  - Unique values: 5
  - Values: DEP, EDG, INI, MAG, RES

### extracontains
Appears in 1 file(s):

- **qualities** (`chummer/qualities/quality/bonus/focusbindingkarmacost/extracontains`)
  - Unique values: 50
  - Values: Improved Ability (skill) (Aeronautics Mechanic), Improved Ability (skill) (Automotive Mechanic), Improved Ability (skill) (Cybercombat), Improved Ability (skill) (First Aid), Improved Ability (skill) (Flight), Improved Ability (skill) (Free-Fall), Improved Ability (skill) (Gunnery), Improved Ability (skill) (Hacking), Improved Ability (skill) (Impersonation), Improved Ability (skill) (Instruction), Improved Ability (skill) (Leadership), Improved Ability (skill) (Nautical Mechanic), Improved Ability (skill) (Negotiation), Improved Ability (skill) (Palming), Improved Ability (skill) (Pilot Aerospace), Improved Ability (skill) (Pilot Aircraft), Improved Ability (skill) (Pilot Watercraft), Improved Ability (skill) (Running), Improved Ability (skill) (Software), Improved Ability (skill) (Tracking)

### extramount
Appears in 2 file(s):

- **weapons** (`chummer/weapons/weapon/extramount`)
  - Unique values: 2
  - Values: Side, Under

- **weapons** (`chummer/accessories/accessory/extramount`)
  - Unique values: 3
  - Values: Barrel, Side, Under/Barrel

### extreme
Appears in 1 file(s):

- **ranges** (`chummer/ranges/range/extreme`)
  - Unique values: 19
  - Values: -1, 120, 1200, 150, 1500, 180, 20, 50, 500, 550, 60, 750, 800, {STR}*10, {STR}*15, {STR}*2.5, {STR}*5, {STR}*60, {STR}*7

### fatigueresist
Appears in 2 file(s):

- **bioware** (`chummer/biowares/bioware/bonus/fatigueresist`)
  - Unique values: 4
  - Values: -1, -2, 1, Rating

- **qualities** (`chummer/qualities/quality/bonus/fatigueresist`)
  - Unique values: 4
  - Values: 1, 2, 3, 4

### field
Appears in 1 file(s):

- **improvements** (`chummer/improvements/improvement/fields/field`)
  - Unique values: 22
  - Values: SelectAdeptPower, SelectAttribute, SelectComplexForm, SelectEcho, SelectKnowSkill, SelectMetamagic, SelectPhysicalAttribute, SelectSkill, SelectSkillCategory, SelectSkillGroup, SelectSpecialAttribute, SelectSpell, SelectWeaponCategory, applytorating, aug, free, max, min, percent, val

### firearmor
Appears in 1 file(s):

- **armor** (`chummer/mods/mod/bonus/firearmor`)
  - Unique values: 6
  - Values: 1, 2, 4, 5, 6, Rating

### firewall
Appears in 2 file(s):

- **gear** (`chummer/gears/gear/firewall`)
  - Unique values: 12
  - Values: 0, 1, 10, 2, 3, 4, 5, 6, 7, 8, Rating, {WIL}

- **qualities** (`chummer/qualities/quality/bonus/livingpersona/firewall`)
  - Unique values: 2
  - Values: -1, 2

### flexibility
Appears in 3 file(s):

- **vehicles** (`chummer/vehicles/vehicle/weaponmounts/weaponmount/flexibility`)
  - Unique values: 3
  - Values: Fixed, Flexible, Turret

- **vehicles** (`chummer/weaponmounts/weaponmount/required/weaponmountdetails/flexibility`)
  - Unique values: 2
  - Values: Flexible [SR5], None

- **vehicles** (`chummer/weaponmounts/weaponmount/forbidden/weaponmountdetails/flexibility`)
  - Unique values: 2
  - Values: Flexible [SR5], None

### forced
Appears in 2 file(s):

- **cyberware** (`chummer/cyberwares/cyberware/subsystems/cyberware/forced`)
  - Unique values: 2
  - Values: Left, Right

- **cyberware** (`chummer/cyberwares/cyberware/subsystems/bioware/forced`)
  - Unique values: 4
  - Values: Automatics, Locksmith, Pistols, Unarmed Combat

### forcegrade
Appears in 1 file(s):

- **cyberware** (`chummer/cyberwares/cyberware/forcegrade`)
  - Unique values: 2
  - Values: None, Standard

### freenegativequalities
Appears in 2 file(s):

- **lifemodules** (`chummer/modules/module/versions/version/bonus/freenegativequalities`)
  - Unique values: 2
  - Values: -5, -8

- **lifemodules** (`chummer/modules/module/bonus/freenegativequalities`)
  - Unique values: 9
  - Values: -10, -14, -15, -22, -24, -25, -5, -7, -8

### freepositivequalities
Appears in 1 file(s):

- **lifemodules** (`chummer/modules/module/bonus/freepositivequalities`)
  - Unique values: 6
  - Values: 1, 10, 3, 5, 8, 9

### fv
Appears in 1 file(s):

- **complexforms** (`chummer/complexforms/complexform/fv`)
  - Unique values: 10
  - Values: L, L+0, L+1, L+2, L+3, L+6, L-1, L-2, L-3, Special

### gameplayoptionname
Appears in 1 file(s):

- **settings** (`chummer/settings/setting/gameplayoptionname`)
  - Unique values: 15
  - Values: Full House, High Life, Life Modules, Neon Anarchy Prime, Neon Anarchy Standard, Newbie's Choice, Point Buy, Prime Runner, Shadowrun Missions Chicago, Shadowrun Missions Neotokyo, Standard, Street Level, Street Scum, Sum-to-Ten, Sum-to-Ten Improved

### gear
Appears in 3 file(s):

- **tips** (`chummer/tips/tip/required/allof/grouponeof/gear`)
  - Unique values: 2
  - Values: Trode Patch, Trodes

- **vehicles** (`chummer/vehicles/vehicle/gears/gear`)
  - Unique values: 23
  - Values: Ammo: Taser Dart, Clearsight Autosoft, Electronic Warfare Autosoft, Flashlight, Grenade: Flash-Pak, Grenade: Smoke, Ink Pouch, Jammer, Area, Jammer, Directional, Maersk Shipyards Wavecutter MPAC (Commlink), Medkit, Quicksilver Camera, Radio Signal Scanner, Skill Autosoft, SmartSafety Bracelet, Smartsoft, Tool Kit, Tutorsoft, [Model] Evasion Autosoft, [Model] Maneuvering Autosoft

- **vehicles** (`chummer/vehicles/vehicle/gears/gear/gears/gear`)
  - Unique values: 8
  - Values: Atmosphere Sensor, Camera, Geiger Counter, MAD Scanner, Olfactory Scanner, Radio Signal Scanner, Ultrasound, X-Ray

### gearcapacity
Appears in 1 file(s):

- **armor** (`chummer/mods/mod/gearcapacity`)
  - Unique values: 2
  - Values: 1, 6

### gearcategory
Appears in 4 file(s):

- **bioware** (`chummer/biowares/bioware/allowgear/gearcategory`)
  - Unique values: 5
  - Values: Chemicals, Custom, Custom Drug, Drugs, Toxins

- **cyberware** (`chummer/cyberwares/cyberware/allowgear/gearcategory`)
  - Unique values: 10
  - Values: Ammunition, Commlinks, Common Programs, Custom, Cyberdecks, Drugs, Hacking Programs, Hard Nanoware, Sensors, Toxins

- **weapons** (`chummer/weapons/weapon/allowgear/gearcategory`)
  - Unique values: 2
  - Values: Drugs, Toxins

- **weapons** (`chummer/accessories/accessory/allowgear/gearcategory`)
  - Unique values: 4
  - Values: Autosofts, Commlinks, Custom, Vision Enhancements

### gearname
Appears in 1 file(s):

- **cyberware** (`chummer/cyberwares/cyberware/allowgear/gearname`)
  - Unique values: 4
  - Values: Medkit, Medkit (2050), Medkit (Bullets & Bandages), Savior Medkit

### gender
Appears in 1 file(s):

- **contacts** (`chummer/genders/gender`)
  - Unique values: 3
  - Values: Female, Male, Unknown

### grade
Appears in 3 file(s):

- **bioware** (`chummer/biowares/bioware/bannedgrades/grade`)
  - Unique values: 6
  - Values: Alphaware, Omegaware, Standard, Standard (Burnout's Way), Used, Used (Adapsin)

- **cyberware** (`chummer/cyberwares/cyberware/bannedgrades/grade`)
  - Unique values: 4
  - Values: Greyware, Greyware (Adapsin), Used, Used (Adapsin)

- **settings** (`chummer/settings/setting/bannedwaregrades/grade`)
  - Unique values: 5
  - Values: Betaware, Deltaware, Gammaware, Greyware, Omegaware

### group
Appears in 3 file(s):

- **critters** (`chummer/metatypes/metatype/skills/group`)
  - Unique values: 6
  - Values: Athletics, Close Combat, Conjuring, Influence, Outdoors, Sorcery

- **lifemodules** (`chummer/modules/module/versions/version/bonus/knowledgeskilllevel/group`)
  - Unique values: 5
  - Values: Academic, Interest, Language, Professional, Street

- **lifemodules** (`chummer/modules/module/bonus/knowledgeskilllevel/group`)
  - Unique values: 6
  - Values: Academic, Interest, Language, Professional, Street, [Any]

### handling
Appears in 2 file(s):

- **vehicles** (`chummer/vehicles/vehicle/handling`)
  - Unique values: 32
  - Values: 0, 1, 1/1, 1/3, 2/1, 2/2, 3/1, 3/2, 3/3, 3/4, 3/5, 4/2, 4/5, 5/3, 5/4, 5/5, 6, 6/3, 6/4, 6/5

- **vehicles** (`chummer/mods/mod/bonus/handling`)
  - Unique values: 4
  - Values: +1, +Rating, -1, Rating

### hobbyvice
Appears in 1 file(s):

- **contacts** (`chummer/hobbiesvices/hobbyvice`)
  - Unique values: 33
  - Values: Animals (Paracritters), Entertainment (Artwork), Entertainment (Movies), Entertainment (RPGs, ARLARP, Graphic Novels), Entertainment (Trid Show 'Odd Coven'), Entertainment (Trid Shows), Family Obligations (Brother), Family Obligations (Kids), Family Obligations (Parents), Family Obligations (Sister), Gambling (Cards), Nothing of Interest, Personal Grooming (Clothes), Social Habit (Alcohol), Social Habit (Cigars), Social Habit (Elven Wines), Vehicles (Antique Cars), Vehicles (Drones), Weapons (Blades), Weapons (Military)

### id
Appears in 26 file(s):

- **bioware** (`chummer/grades/grade/id`)
  - Unique values: 9
  - Values: 0c86e85c-7e3e-4b6f-aa4b-26d8b379a7c9, 2b599ecd-4e80-4669-a78e-4db232c80a83, 9166244c-440b-44a1-8795-4917b53e6101, 9e24f0ce-b41e-496f-844a-82805fcb65a9, a6fba72c-9fbe-41dc-8310-cd047b50c81e, c2c6a3cc-c4bf-42c8-9260-868fd44d34ce, c4bbffe4-5818-4055-bc5e-f44562bde855, ee71d4f8-0fd0-4992-8b4e-70ef4dfbcce1, f0a67dc0-6b0a-43fa-b389-a110ba1dd59d

- **complexforms** (`chummer/complexforms/complexform/id`)
  - Unique values: 38
  - Values: 07b461db-3982-4fa2-8e24-cc5007c377a4, 080013b7-deb3-4a2e-822f-400ecf8293b2, 174f61be-5dad-41ad-8d6b-641bc514b9bb, 2badbff2-02e1-4218-97f0-f53f71f22cc4, 33e75cd6-cad7-43dd-87ac-9838c83eccb5, 3bed693e-d9dd-4873-8d54-2cbe97202174, 42a11004-5379-4b79-90fa-a30f7ddf4f14, 4856cfa1-89c8-484a-9127-ddc4a2327c63, 57566f59-ddbf-42bb-929a-2966ce2fde46, 5e5c8711-70a9-4068-b084-2ae23fce8fa7, 60b3f99f-f903-426a-ae13-ea604e77a956, 704abd70-c0e6-4f06-b186-53a7cb856584, 7cd49196-0912-43c5-b1a1-c9da96432340, 7d98d12d-5b02-4bc8-bf1f-b0b3507ebdaf, 92b4cf59-62ca-443b-aeb8-f5044967c835, d8b11a80-eb95-409e-a53b-18c48e09342e, f53a57c9-5073-4af3-aff9-45e3e449ac59, f64ccd1d-634f-4cf3-a020-ab03247abf25, f9a63582-6858-4b83-a76f-6daa52b127c5, f9dc77ad-bc06-4a1b-a967-0e78efe136e4

- **cyberware** (`chummer/grades/grade/id`)
  - Unique values: 19
  - Values: 0b15b0c5-4b98-4884-b080-e55a93491507, 210703b8-6df1-4d1b-b5e7-7f1f8a167f74, 23382221-fd16-44ec-8da7-9b935ed2c1ee, 453dcb77-f1b2-46d6-9e96-227ecb053297, 4db89466-a1e7-4507-9849-9ce3eef56fc9, 5fc14253-7bf8-4266-af24-072607a86d45, 62dd61be-f1c4-4310-8545-73a4a4645393, 75da0ff2-4137-4990-85e6-331977564712, 7ea3a157-867f-4c66-9f62-66b14b36b763, 81b6d909-699b-4fa5-8bb8-a5b2f3996da7, 9352d1b0-5288-4bbf-82b5-00073f7effc2, a9aec622-410a-444a-a569-c8d8cc0457b4, aa2393f5-0d01-4b93-988c-d743c35ec22b, b1b679e8-72ff-46b5-bd9d-652914731b17, c4d67932-0de4-4206-91b6-f3fd504c382f, ccb47e88-b940-41de-85fd-8d0f52c04c6e, dcecd7e5-8cf1-4f83-89fa-177e28cfba03, e77b7a1f-1c7b-4494-b9b5-6dcb5b61010b, f248cee4-4629-40ca-83c6-fbf6422d0cd9

- **drugcomponents** (`chummer/grades/grade/id`)
  - Unique values: 4
  - Values: b00a075a-2c2c-4816-bb4a-0d0a33d06370, b3366009-4884-44d7-9efa-34e213a75e7e, b8b70858-6433-451a-835b-49b67d7b63e2, cd20695d-fedb-476b-956b-1a1ecdd65f03

- **drugcomponents** (`chummer/drugcomponents/drugcomponent/id`)
  - Unique values: 22
  - Values: 04f24ebd-e1cc-4b57-abe7-c8aa3fa91539, 0737b976-ec7d-45cf-a84f-1c0524dac6f9, 1ed8c102-3b31-42ae-bf0f-4d9fe22fc4fb, 33ae6b1c-62f6-4824-967d-0e2b37c7d1b9, 41018f6e-beb4-4a6c-8d59-501db802ce1a, 47387cd3-836c-4283-a1ce-c62487dd669b, 5ff4db39-aa0e-42f5-ae24-2bf79560670b, 7eebc516-8298-4a7f-afef-10dceebb5e58, 9f4c87ba-4a0d-48e8-8c90-08b689da7203, a4d7e764-5aa7-4394-92f1-43ff58c1a801, c1a7dd91-61c9-49e1-8dfd-892882bd1816, c98d587d-5651-4a53-a9ab-cc2262236658, ca5e7e5e-6aab-472a-a273-6d21d4e9ad2e, cf8a2d2b-03b9-4440-873b-829c7d82489e, d67dbda7-b03f-4914-9f1d-a6a238f6944e, e6001189-e413-43bc-86ee-2136ca5d10bf, e93015ca-12ff-48c4-b45e-f1387f2ea1ef, ebbb6a0e-f3b1-47f3-85c1-e408b4a6ceb2, ef191753-a06e-4762-9674-47e3fe90ed1e, fdca4090-a933-4393-a3bd-7633aad967a2

- **echoes** (`chummer/echoes/echo/id`)
  - Unique values: 29
  - Values: 032d5d7f-41b9-47f5-8bd0-b7e2cf2c3adf, 0408da17-8327-4e8c-a64f-48431bba8e58, 0adbc66d-6b29-4427-b652-0a93a87804b2, 18269d5a-2750-4636-8ae3-f9f268d44577, 1e0405f3-3872-4a53-afd7-bd643899e7d9, 2c5953bf-3680-4ce5-9087-2e1e419937b2, 2fe27536-4de7-49c1-a933-8d9a65604533, 36aa9af4-5c04-40d9-ba09-31b401cc1ff0, 37e8342f-9aad-4ee0-8e68-7a5c00f2678b, 45ed755c-cf0e-4f57-95d2-2c01b4eda760, 61055141-71f5-400e-9e67-cef650ce4801, 64710f70-897a-4505-829d-7d0ade750b24, 6cb9bc65-7b64-44dd-ba9a-f96f3c09c741, 96f534c0-b53b-43af-bdac-54de468f0d70, a0966081-2534-4fc4-a2e6-504b4ecf9756, cd2e640c-06b7-4638-9eb4-bf75c28452a2, ce98f873-d261-4f1e-8bc7-fafa3c712700, cee8e3bc-447b-4a67-9752-15e3e104e57d, dbd2fbba-8487-45cc-a92a-33813c3643b6, e6f66ec1-af07-4008-abbe-e4d31cc82358

- **lifemodules** (`chummer/modules/module/bonus/knowledgeskilllevel/id`)
  - Unique values: 3
  - Values: 1082e017-a93f-4b64-a478-b329668d57d6, 6715b9d9-5445-4bc0-886c-b6ac309181b3, a9df9852-6f4d-423d-8251-c92a709c1476

- **lifestyles** (`chummer/lifestyles/lifestyle/id`)
  - Unique values: 12
  - Values: 00000000-0000-0000-0000-000000000000, 1a231a81-4985-4b57-83cf-659ad920cfb7, 2be1a0f7-6133-4966-be57-720ed9b927a9, 451eef87-d18e-4bee-a972-1ee165b08522, 4a37d519-c9be-4ecc-97bb-e9d78708c374, 4b513ac9-9eb3-471b-931b-839a04873b84, 4be85958-af8f-4404-812f-0d8a426f01d6, 559653df-a9af-44e2-9e04-3044c1d1b421, 9367556e-f82f-4f9d-840e-24c8f824ca68, 9cb0222c-14c1-4bea-bf83-055513a1f33e, b7b15c35-596d-4e00-92ee-2e999f062924, ed775c22-8f0c-40a0-bc6f-5dbb980cedba

- **mentors** (`chummer/mentors/mentor/choices/choice/bonus/spelldicepool/id`)
  - Unique values: 6
  - Values: 06d5a10b-b353-44bc-936a-4d6c08ebeaf8, 50f1bfce-a64d-4fac-b25d-d870e7ff312f, 85c12bae-3954-483c-a211-d8ee43a1c65e, 894e4bea-883e-421b-8a6f-6ca61274cca3, 9baed162-5e84-4f19-9b94-d543a560c067, d866f612-7160-41d2-8ce9-b64262327559

- **metamagic** (`chummer/arts/art/id`)
  - Unique values: 18
  - Values: 022c5efc-cd66-4e6e-8031-800a614d1cd8, 04e9d62d-3e45-45b5-8743-0fc8c74ee69b, 10071e27-4cdd-4b17-8e8c-1de28713839b, 155c3b67-7118-4cd6-90fa-d8d6a3dfe21b, 1aa93daa-ffee-4e35-9141-a849f739e2b2, 1ea5a816-2d5b-4dd2-86b0-0f780c68872f, 28b078bf-22eb-4ba7-8689-e0d9f357ceb1, 4a1e34dc-38c9-48e8-9808-a0cf9b1009af, 5b922bcf-4114-4c49-a4f3-0f3dcb45dd2f, 8691b2b4-dc2d-4ce4-8b75-931ef61ea874, 9613228a-6c83-41f4-beaa-20ce6276334f, adc0e5e6-29b3-4b9c-83ba-d06f30f597e5, c0fb021c-8dc3-46a5-9a88-7a4e15210d7d, d28fb2f1-e0e6-4ca6-8e26-43d1487d612a, dd8b45f3-054d-4b96-a065-0ca249de60cb, dec1323e-c728-45c6-8d24-59725e885dba, fa4098b8-4075-4656-8c07-35d7dc0e63a8, fa64531c-5f86-45a0-aaaf-b8425a5b6dd1

- **metatypes** (`chummer/metatypes/metatype/id`)
  - Unique values: 21
  - Values: 08f2c9cc-f9f8-4f1a-9efb-63555af71788, 2f51fff5-131a-465d-b054-b64d54059f28, 32c183be-74c8-403e-bcae-a5c4baadc3ec, 4286946f-7078-41a6-9b70-0f73f4f1db9d, 4f5d2d05-bccd-45d4-9d2e-e8904b1f255a, 5abf92b8-3d95-478c-8ebf-9ebc988cbcf4, 5bc6b1d8-8772-41f9-8c45-6f9abbd42cb1, 5f618c01-e149-4dc6-8fcd-22f548a9f155, 6b9844d0-3e17-442f-a34d-f12f52b1c291, 6c0cdaff-65a1-4b30-8a44-a43f8c7abcd0, 77fa1ed8-f4e6-4763-9f0b-f125318b9782, 79b7b632-2e2d-4d7f-b8c7-c99071bd9632, 7a096dc7-b1cb-4df8-b17e-9f28bf8f6d99, 8768ec05-4fbb-43ae-b3ba-94ba57610069, 8be9315f-c790-4900-b6b1-5ebacdb0b1df, 8ed6892f-88e6-42d0-a704-b805778ec13e, 9ebede5b-b693-4cab-9469-e72f625c485c, a53d885d-a4a4-443d-b6a6-b0a55b0a96c7, addc3f0f-5a61-44d0-b980-a1db52256faa, b3259991-b315-4dbe-ae3c-51f71a1116e2

- **options** (`chummer/availmap/avail/id`)
  - Unique values: 5
  - Values: 06B72D98-3510-4A91-825E-CB55AD873749, 0A39C082-AE54-4096-94D3-0CA213ACDA0A, 0DC43627-56E8-46DB-B4C8-3A389C6999D2, 335BB55A-A1A7-48C4-8852-4EA11929F242, 67BC5453-8AD0-4C69-A91C-8259FD070A1D

- **paragons** (`chummer/mentors/mentor/id`)
  - Unique values: 9
  - Values: 117e7c69-abea-4637-b5e7-3a927ae0ad60, 46f88748-8c6c-4230-ad59-2eccb463cc35, 690ccad8-3f42-4d62-a358-e099747fc4e4, acadd628-ebb5-4c79-a3c2-953ce7fa1885, b74d032e-5d39-4e4a-b043-0707ffa00b5e, c45c123c-06c7-42b3-a2ee-01e37f2f7bf8, da2f3bad-d934-461a-aa92-60fc6e5c3ef7, de755412-5cae-4859-880f-75a7bd68d5a4, df42911f-0542-4fae-80d1-39573547ff68

- **powers** (`chummer/enhancements/enhancement/id`)
  - Unique values: 11
  - Values: 19bafb80-2f5a-4370-8cbe-875477ce7471, 215a5a0e-09fc-47ff-9a84-74c99f4f1a53, 25f6368f-21ef-4544-ac55-3c20d8a60374, 2d2939f0-486c-4915-bbeb-084b857c2450, 3f0a99c7-6524-46cb-b43e-070a978c5052, 47cb80a1-a11b-4a60-a557-feada7114379, 855a7a07-5def-4ec5-bb69-29273327b885, 8dc0a8e3-535a-4935-8c90-2079666e6a01, e5cf0578-be0f-4453-9223-118234d3e749, e66fac54-39e4-4e3e-92c6-670485c28c25, fafc7fd4-8418-4a86-b396-6e90943d9e68

- **priorities** (`chummer/priorities/priority/id`)
  - Unique values: 35
  - Values: 0a224d86-d355-4cd6-8e4e-b94e31f97c4b, 0fdfe7f7-119d-4971-a629-4a4dea938c6c, 1c4a7955-1ae1-4a5b-9ed4-5ab8525d13b0, 2cbe209a-ae97-4985-b42f-4839613dfb28, 45a5f7b4-c152-4e05-839f-1b3d14e56058, 61e1758f-e4ca-4e53-ad45-bb88a0e5ac04, 774fd89a-ecea-4f5f-ad2b-c4476ca46f70, 91dccab9-c3fc-4868-abf8-1825b70e8a6c, 984600d8-5b2f-437c-86eb-693a5bbff030, 988b7ce3-5739-4300-bc21-a6c92b869262, aae3a140-d306-4811-a9d2-874140600150, b1ca5551-46a4-4ef0-9d07-c33ae0abbcd1, bde37645-6789-4401-bcec-4c0e61c7fe17, be69802a-5379-457b-8084-87b22d2e9ea6, c5b45f74-3396-45c7-afa9-b69c0c8db6ee, cb4060e7-61b9-40d7-b97f-9ab9129bfc26, dd4eb137-e218-4d92-9ac2-db4d6bad4704, ddb56487-f6ef-480d-9812-cf6077111c2b, edc5db00-8d4c-4510-85d2-8d82d6c66ed6, ee17af88-5564-4009-b0a1-4c8632bffaf4

- **qualities** (`chummer/xpathqueries/query/id`)
  - Unique values: 7
  - Values: 02d0c37b-c3c4-4892-ad32-c91e4de72742, 33868824-d80c-4db5-baee-d993d87fc70a, 3b5fca95-9f04-4815-999a-a35fca1f856a, 5760ec8d-f7ca-4290-8f9f-c711da200353, bc8adb44-f2a6-43c6-b3e8-e0825209f86c, cdd640dc-5b69-45a5-8d5e-5367ed3dddbc, d6a8a731-0225-4123-9388-212024bacd35

- **settings** (`chummer/settings/setting/id`)
  - Unique values: 34
  - Values: 0aa71387-6fe7-4b1b-b310-c968ca0cdc1f, 223a11ff-80e0-428b-89a9-6ef1c243b8b6, 2ef9b098-4cd2-4c2b-8f3d-76164e3f4f8e, 332253d0-dc04-437d-91c6-4785ebc317c7, 33e5317f-12aa-416e-816e-3b8b6ad95712, 3509a807-68ee-4c18-b7d5-b130313b4b77, 3bb81ab8-e752-4f80-92c2-645f26b3df93, 559f8285-d36e-4e2e-b16d-f6fd8e0cb8d1, 67e25032-2a4e-42ca-97fa-69f7f608236c, 684d3d2b-53bd-4168-8153-a3baef7742fe, 6bf7add9-34ac-4538-96ac-8015279bf602, 6ffb1fba-6f2e-4bf8-a8e0-35045bec3e88, 91429237-05d5-4e84-8ab0-f00f0e769f64, 9da22725-0596-4d68-ba2b-54f701e75e74, 9e1c2dec-d2fa-42a0-a842-8bf575943780, b378aff1-62ea-420e-a7af-7b15086b2d82, c1af7214-e718-491e-82d2-e32408939c4a, dc770cdd-0837-4d58-a1f2-8705972aa534, f16800fb-0c45-47be-bcc0-05862533e279, fe7bb0d9-3cd9-4a75-825e-135b95a4f3ef

- **streams** (`chummer/spirits/spirit/id`)
  - Unique values: 7
  - Values: 610c00a4-7f11-4c88-8074-158f33aeccc0, 61357134-dd63-442c-b532-355420b30b6e, 74db183e-2fef-4e6d-84a3-63e641d93bf0, 80788abc-4b14-40b0-8ffd-e36fe60653cb, 80bd0cd6-fcaa-49c2-a88f-c28b4eb28c61, acf0c123-0881-4f13-8a98-010516e74019, c3be27c2-247c-4039-9529-2ff3b2e670ec

- **tips** (`chummer/tips/tip/id`)
  - Unique values: 16
  - Values: 1e98f6d1-dfca-4dc3-9248-dd3da3589989, 250bf4c4-b71a-4ff7-8f99-4d59aaba89c1, 42262ca7-b414-4dde-b1b3-b7f72bc160c1, 4bf9379e-101a-4664-8049-7db867073943, 528f605f-9994-46b5-8583-cafe006507e4, 543af3b5-c490-4dcd-8db4-54ad214e32f4, 8bdb4ade-46e2-4ff6-b440-d8a8955766ed, ab52155b-d99e-4e2e-816b-16535afc206f, afc35a4b-a588-4080-9e77-0dbb5d223122, b669df07-528b-4df3-829b-54d095af1791, b6da9d78-024d-4516-821c-93ad8207075d, c2d32a52-25a7-4565-a9b6-1bde1f65c83e, ccaae7df-40ba-4da9-837e-c0df92f07038, d6d22084-a292-4938-a9b4-af8963111ce6, ee4bdb97-2b43-49ea-bc1e-487969258880, ff26b01d-1aa4-45ac-8685-0d199e115d1f

- **traditions** (`chummer/drainattributes/drainattribute/id`)
  - Unique values: 5
  - Values: 06b8b7da-1301-4963-aba7-4862024559a8, aca1fd74-0c25-41d5-b621-434c3892cfb3, c8adb0ec-7592-4801-b560-94805ef1c13e, f10d9639-45c8-4c45-87b9-6af0fef73723, f59248c7-7843-4b68-9a26-b966c32c8cae

- **vehicles** (`chummer/vehicles/vehicle/gears/gear/gears/gear/id`)
  - Unique values: 4
  - Values: c763fac2-8b08-4c61-8dc2-6291d905a2df, d98f419f-7625-4228-9723-0217950d8155, e140b671-dc22-429d-b12a-dfbf46951049, ffc069af-d3ec-4201-887c-0178dcdfeef9

- **vehicles** (`chummer/vehicles/vehicle/gears/gear/gears/gear/gears/gear/id`)
  - Unique values: 2
  - Values: 287c6d58-2217-48b2-9e14-6ba23584939a, f7f74a85-bd3b-4a46-9c3b-80688c72ef51

- **vehicles** (`chummer/weaponmounts/weaponmount/id`)
  - Unique values: 29
  - Values: 079a5c61-aee6-4383-81b7-32540f7a0a0b, 0c05f936-4826-418f-b798-848dafa4b4a0, 0ec991be-a888-4547-8ca2-ad43d7c7399e, 12342330-446f-4e2f-ad9b-6ccdc4d89a9b, 20e7d5d5-da20-4466-99b7-977a578155e4, 2ab20ea4-441c-482d-977e-a5e90f37cb51, 4a020775-9258-486a-a03f-7a48dd5c3bf9, 4d90a1e3-8602-488e-b837-f155b4549084, 4e9da56b-622c-439f-9718-98ac3a792351, 4fdb0fb3-c987-41a0-b11e-d82fe6ac85b1, 52973ba7-3dbb-49fe-9a4c-8105eb6ab4bc, 5d53c232-c18d-4546-bb50-5325f57eb422, 73f6f721-9732-4773-8ce6-0e3f5222a49f, 741bb6e2-0c6b-4af2-82b0-0c4b14c60367, 9ee5e112-8ced-4266-9141-02ef18e33f43, a567c5d3-38b8-496a-add8-1e176384e935, ad732625-c8bc-4e24-bc84-90c8449e82d5, b7333366-24bf-4f47-bb68-b1cfe8f450fd, be56fb91-88d3-4bfb-8e42-d12929b44fe5, c6939caa-e94d-4db3-94f6-a46fbcc4df07

- **vehicles** (`chummer/weaponmountmods/mod/id`)
  - Unique values: 5
  - Values: 45d84d77-5461-4441-a529-527aba347334, 6741d080-0e40-4941-a7b5-85ab3e1a9cb2, c3f9f5a4-b8d4-11e6-80f5-76304dec7eb7, c3f9fa86-b8d4-11e6-80f5-76304dec7eb7, dd03dc64-64e1-49a7-8836-d932cd4cb95b

- **vessels** (`chummer/metatypes/metatype/id`)
  - Unique values: 9
  - Values: 2643B4A2-05C6-47FF-8E15-FC094415FE44, 2ACF277D-76BF-45B7-BC85-FD084D1D7027, 2CC51D65-54DA-4FDA-AEF5-B641D4C9ED5F, 39B667F0-48AB-41D6-8FB9-54F3B34D42AC, 3E980802-7A90-49D2-B878-12983BB4B62F, 6B7BDAA6-99A5-4FB2-9648-E1E0E9568E30, 712889BF-CD58-425C-8D14-0E9720B2C713, AF455A22-2B54-469A-9A08-A029473282B3, E1556535-CC23-401A-9635-01AC2D640BEC

- **weapons** (`chummer/accessories/accessory/required/weapondetails/id`)
  - Unique values: 3
  - Values: 65b7803a-0efe-44d9-8b85-6410644f079d, ad28b2dd-4f4f-4089-af6b-39f3ff6900fd, dc1ce668-94ba-44a5-a61b-d5b330537ac2

### immunity
Appears in 1 file(s):

- **strings** (`chummer/immunities/immunity`)
  - Unique values: 2
  - Values: Age, Normal Weapons

### info
Appears in 1 file(s):

- **drugcomponents** (`chummer/drugcomponents/drugcomponent/effects/effect/info`)
  - Unique values: 3
  - Values: Crash Effect: -1d6 initiative dice, Ingestion, Inhalation

### ini
Appears in 2 file(s):

- **streams** (`chummer/spirits/spirit/ini`)
  - Unique values: 5
  - Values: (F*2), (F*2)+1, (F*2)+2, (F*2)+3, (F*2)+4

- **traditions** (`chummer/spirits/spirit/ini`)
  - Unique values: 14
  - Values: (F*2), (F*2)+1, (F*2)+2, (F*2)+3, (F*2)+4, (F*2)+5, (F*2)-1, (F-1), 0, 3, F+(F/2)+2, F+(F/2)+3, F+(F/2)+4, F+(F/2)-1

### iniaug
Appears in 4 file(s):

- **critters** (`chummer/metatypes/metatype/iniaug`)
  - Unique values: 34
  - Values: (F*2), (F*2)+1, (F*2)+2, (F*2)+4, (F*2)+6, 10, 12, 16, 17, 19, 20, 21, 22, 23, 24, 25, 27, 8, 9, F

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/iniaug`)
  - Unique values: 4
  - Values: (F*2)+1, (F*2)+2, (F*2)+3, (F*2)+4

- **metatypes** (`chummer/metatypes/metatype/iniaug`)
  - Unique values: 6
  - Values: 19, 20, 21, 22, 23, 29

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/iniaug`)
  - Unique values: 4
  - Values: 18, 19, 20, 21

### inimax
Appears in 4 file(s):

- **critters** (`chummer/metatypes/metatype/inimax`)
  - Unique values: 28
  - Values: (F*2), (F*2)+1, (F*2)+2, (F*2)+4, (F*2)+6, 10, 12, 13, 14, 15, 16, 17, 22, 3, 6, 8, 9, F, F+1, F-1

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/inimax`)
  - Unique values: 4
  - Values: (F*2)+1, (F*2)+2, (F*2)+3, (F*2)+4

- **metatypes** (`chummer/metatypes/metatype/inimax`)
  - Unique values: 5
  - Values: 11, 12, 13, 14, 15

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/inimax`)
  - Unique values: 4
  - Values: 10, 11, 12, 13

### inimin
Appears in 4 file(s):

- **critters** (`chummer/metatypes/metatype/inimin`)
  - Unique values: 26
  - Values: (F*2), (F*2)+1, (F*2)+2, (F*2)+4, (F*2)+5, (F*2)+6, 10, 12, 13, 14, 15, 16, 3, 4, 6, 8, 9, F, F+1, F-1

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/inimin`)
  - Unique values: 4
  - Values: (F*2)+1, (F*2)+2, (F*2)+3, (F*2)+4

- **metatypes** (`chummer/metatypes/metatype/inimin`)
  - Unique values: 4
  - Values: 2, 3, 4, 5

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/inimin`)
  - Unique values: 2
  - Values: 2, 3

### initiative
Appears in 1 file(s):

- **qualities** (`chummer/qualities/quality/bonus/initiative`)
  - Unique values: 2
  - Values: 1, 2

### initiativecost
Appears in 1 file(s):

- **actions** (`chummer/actions/action/initiativecost`)
  - Unique values: 3
  - Values: 10, 5, 7

### initiativedice
Appears in 3 file(s):

- **drugcomponents** (`chummer/drugs/drug/bonus/initiativedice`)
  - Unique values: 2
  - Values: 1, 2

- **drugcomponents** (`chummer/drugcomponents/drugcomponent/effects/effect/initiativedice`)
  - Unique values: 3
  - Values: 1, 2, 3

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/initiativedice`)
  - Unique values: 2
  - Values: 1, 2

### initiativepass
Appears in 3 file(s):

- **bioware** (`chummer/biowares/bioware/bonus/initiativepass`)
  - Unique values: 2
  - Values: 1, Rating

- **critters** (`chummer/metatypes/metatype/bonus/initiativepass`)
  - Unique values: 2
  - Values: 1, 2

- **cyberware** (`chummer/cyberwares/cyberware/bonus/initiativepass`)
  - Unique values: 2
  - Values: FixedValues(0,1,1), Rating

### int
Appears in 2 file(s):

- **streams** (`chummer/spirits/spirit/int`)
  - Unique values: 3
  - Values: F+0, F+1, F+3

- **traditions** (`chummer/spirits/spirit/int`)
  - Unique values: 7
  - Values: (F/2)+1, 1, F, F+0, F+1, F-2, F/2

### intaug
Appears in 4 file(s):

- **critters** (`chummer/metatypes/metatype/intaug`)
  - Unique values: 19
  - Values: 1, 10, 11, 12, 13, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F-1, F-2

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/intaug`)
  - Unique values: 2
  - Values: F, F+1

- **metatypes** (`chummer/metatypes/metatype/intaug`)
  - Unique values: 4
  - Values: 10, 11, 12, 9

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/intaug`)
  - Unique values: 4
  - Values: 10, 11, 8, 9

### interval
Appears in 1 file(s):

- **options** (`chummer/availmap/avail/interval`)
  - Unique values: 5
  - Values: String_Day, String_Days, String_Hours, String_Month, String_Week

### intmax
Appears in 4 file(s):

- **critters** (`chummer/metatypes/metatype/intmax`)
  - Unique values: 15
  - Values: 1, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F-1, F-2

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/intmax`)
  - Unique values: 2
  - Values: F, F+1

- **metatypes** (`chummer/metatypes/metatype/intmax`)
  - Unique values: 4
  - Values: 5, 6, 7, 8

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/intmax`)
  - Unique values: 4
  - Values: 4, 5, 6, 7

### intmin
Appears in 4 file(s):

- **critters** (`chummer/metatypes/metatype/intmin`)
  - Unique values: 15
  - Values: 1, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F-1, F-2

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/intmin`)
  - Unique values: 2
  - Values: F, F+1

- **metatypes** (`chummer/metatypes/metatype/intmin`)
  - Unique values: 3
  - Values: 1, 2, 3

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/intmin`)
  - Unique values: 2
  - Values: 1, 2

### karma
Appears in 6 file(s):

- **critterpowers** (`chummer/powers/power/karma`)
  - Unique values: 10
  - Values: 12, 14, 16, 25, 3, 5, 50, 6, 8, 9

- **lifemodules** (`chummer/modules/module/karma`)
  - Unique values: 9
  - Values: 0, 100, 115, 15, 40, 50, 55, 65, 80

- **metatypes** (`chummer/metatypes/metatype/karma`)
  - Unique values: 14
  - Values: 0, 100, 110, 120, 140, 150, 160, 180, 40, 50, 60, 70, 90, 95

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/karma`)
  - Unique values: 45
  - Values: 103, 105, 112, 122, 123, 128, 135, 143, 145, 150, 153, 155, 158, 160, 165, 168, 173, 180, 40, 70

- **priorities** (`chummer/priorities/priority/metatypes/metatype/karma`)
  - Unique values: 6
  - Values: 0, 10, 15, 20, 25, 5

- **priorities** (`chummer/priorities/priority/metatypes/metatype/metavariants/metavariant/karma`)
  - Unique values: 29
  - Values: -4, 0, 10, 12, 13, 15, 17, 20, 22, 25, 27, 28, 3, 30, 35, 38, 40, 43, 60, 8

### karmaknospecialization
Appears in 1 file(s):

- **settings** (`chummer/settings/setting/karmacost/karmaknospecialization`)
  - Unique values: 2
  - Values: 3, 7

### key
Appears in 1 file(s):

- **strings** (`chummer/matrixattributes/key`)
  - Unique values: 4
  - Values: String_Attack, String_DataProcessing, String_Firewall, String_Sleaze

### language
Appears in 1 file(s):

- **books** (`chummer/books/book/matches/match/language`)
  - Unique values: 3
  - Values: de-de, en-us, fr-fr

### level
Appears in 2 file(s):

- **drugcomponents** (`chummer/drugcomponents/drugcomponent/effects/effect/level`)
  - Unique values: 3
  - Values: 0, 1, 2

- **qualitylevels** (`chummer/qualitygroups/qualitygroup/levels/level`)
  - Unique values: 4
  - Values: SINner (Corporate Limited), SINner (Corporate), SINner (Criminal), SINner (National)

### levels
Appears in 1 file(s):

- **powers** (`chummer/powers/power/levels`)
  - Unique values: 2
  - Values: False, True

### license
Appears in 1 file(s):

- **licenses** (`chummer/licenses/license`)
  - Unique values: 36
  - Values: Adept License, Bounty Hunter's License, Concealed Carry Permit, Cyberdeck License, Exotic Weapons License, Heavy Weapons License, Marine License, Medical License, Military Ammunition License, Pet License, Pilot License, Pistol License, Private Investigator License, Projectile License, Restricted Cyberware License, Rifle License, Shotgun License, Small Blades License, Talismonger License, Weapon License

### lifestyle
Appears in 1 file(s):

- **lifestyles** (`chummer/qualities/quality/required/lifestyle`)
  - Unique values: 2
  - Values: Bolt Hole, Traveler

### lifestylecost
Appears in 4 file(s):

- **bioware** (`chummer/biowares/bioware/bonus/lifestylecost`)
  - Unique values: 3
  - Values: -10, 10, 25

- **metatypes** (`chummer/metatypes/metatype/bonus/lifestylecost`)
  - Unique values: 3
  - Values: 100, 150, 20

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/bonus/lifestylecost`)
  - Unique values: 2
  - Values: 100, 20

- **qualities** (`chummer/qualities/quality/bonus/lifestylecost`)
  - Unique values: 7
  - Values: -10, -100, -20, -50, 10, 20, 30

### lifestylequality
Appears in 2 file(s):

- **lifestyles** (`chummer/qualities/quality/forbidden/oneof/lifestylequality`)
  - Unique values: 5
  - Values: Cleaning Service, Discreet Candyman, Discreet Deliveryman, Local Bar Patron, Patron of the Arts (Private Club)

- **lifestyles** (`chummer/qualities/quality/required/oneof/lifestylequality`)
  - Unique values: 12
  - Values: Cramped Garage (Airplane), Cramped Garage (Boat), Cramped Garage (Car (Body 4 or Less)), Cramped Garage (Car (Body 5 or More)), Cramped Garage (Helicopter), Cramped Workshop/Facility, Garage (Airplane), Garage (Boat), Garage (Car (Body 4 or Less)), Garage (Car (Body 5 or More)), Garage (Helicopter), Workshop/Facility

### limb
Appears in 1 file(s):

- **settings** (`chummer/settings/setting/redlinerexclusion/limb`)
  - Unique values: 2
  - Values: skull, torso

### limbcount
Appears in 2 file(s):

- **options** (`chummer/limbcounts/limb/limbcount`)
  - Unique values: 3
  - Values: 4, 5, 6

- **settings** (`chummer/settings/setting/limbcount`)
  - Unique values: 2
  - Values: 5, 6

### limbslot
Appears in 1 file(s):

- **cyberware** (`chummer/cyberwares/cyberware/limbslot`)
  - Unique values: 5
  - Values: all, arm, leg, skull, torso

### limit
Appears in 17 file(s):

- **actions** (`chummer/actions/action/test/limit`)
  - Unique values: 19
  - Values: Variable, {Astral}, {Icon: Attack}, {Icon: Data Processing}, {Icon: Firewall}, {Icon: Sleaze}, {Max: {Icon: Sleaze} or {Icon: Attack}}, {Max: {Weapon: Accuracy} or {Vehicle: Sensor}}, {Mental}, {Physical}, {Social}, {Spell: Force}, {Spirit: Force}, {Target: {Icon: Rating}}, {Target: {Spell: Force}}, {Vehicle: Handling}, {Vehicle: Sensor}, {Weapon: Accuracy}, {Weapon: Limit}

- **armor** (`chummer/armors/armor/bonus/limitmodifier/limit`)
  - Unique values: 2
  - Values: Physical, Social

- **armor** (`chummer/armors/armor/wirelessbonus/limitmodifier/limit`)
  - Unique values: 2
  - Values: Physical, Social

- **armor** (`chummer/mods/mod/bonus/limitmodifier/limit`)
  - Unique values: 2
  - Values: Physical, Social

- **bioware** (`chummer/biowares/bioware/limit`)
  - Unique values: 5
  - Values: 1, False, {BODUnaug}, {arm}, {leg}

- **bioware** (`chummer/biowares/bioware/bonus/limitmodifier/limit`)
  - Unique values: 2
  - Values: Physical, Social

- **cyberware** (`chummer/cyberwares/cyberware/limit`)
  - Unique values: 8
  - Values: 1, 3, False, {arm}, {arm} * 5, {leg}, {skull}, {torso}

- **cyberware** (`chummer/cyberwares/cyberware/bonus/limitmodifier/limit`)
  - Unique values: 3
  - Values: Mental, Physical, Social

- **cyberware** (`chummer/cyberwares/cyberware/wirelessbonus/limitmodifier/limit`)
  - Unique values: 3
  - Values: Mental, Physical, Social

- **echoes** (`chummer/echoes/echo/limit`)
  - Unique values: 4
  - Values: 2, 3, 4, False

- **gear** (`chummer/gears/gear/bonus/limitmodifier/limit`)
  - Unique values: 3
  - Values: Mental, Physical, Social

- **lifestyles** (`chummer/comforts/comfort/limit`)
  - Unique values: 6
  - Values: 1, 2, 3, 4, 6, 8

- **lifestyles** (`chummer/neighborhoods/neighborhood/limit`)
  - Unique values: 7
  - Values: 1, 2, 3, 4, 5, 6, 7

- **lifestyles** (`chummer/securities/security/limit`)
  - Unique values: 7
  - Values: 1, 2, 3, 4, 6, 7, 8

- **powers** (`chummer/powers/power/limit`)
  - Unique values: 5
  - Values: 1, 100, 12, 20, 4

- **qualities** (`chummer/qualities/quality/limit`)
  - Unique values: 11
  - Values: 10, 11, 15, 2, 20, 3, 4, 5, 6, False, {arm} - 1

- **qualities** (`chummer/qualities/quality/bonus/limitmodifier/limit`)
  - Unique values: 2
  - Values: Mental, Social

### limitcritterpowercategory
Appears in 1 file(s):

- **qualities** (`chummer/qualities/quality/bonus/limitcritterpowercategory`)
  - Unique values: 2
  - Values: Drake, Infected

### limitspellcategory
Appears in 1 file(s):

- **traditions** (`chummer/traditions/tradition/bonus/limitspellcategory`)
  - Unique values: 2
  - Values: Combat, Health

### log
Appears in 2 file(s):

- **streams** (`chummer/spirits/spirit/log`)
  - Unique values: 5
  - Values: F, F+1, F+2, F+3, F+4

- **traditions** (`chummer/spirits/spirit/log`)
  - Unique values: 8
  - Values: (F/2)-1, 1, F, F+0, F+1, F-1, F-2, F/2

### logaug
Appears in 4 file(s):

- **critters** (`chummer/metatypes/metatype/logaug`)
  - Unique values: 18
  - Values: 1, 10, 12, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F+4, F-1, F-2

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/logaug`)
  - Unique values: 2
  - Values: F, F+1

- **metatypes** (`chummer/metatypes/metatype/logaug`)
  - Unique values: 4
  - Values: 10, 11, 8, 9

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/logaug`)
  - Unique values: 5
  - Values: 10, 11, 12, 8, 9

### logmax
Appears in 4 file(s):

- **critters** (`chummer/metatypes/metatype/logmax`)
  - Unique values: 16
  - Values: 1, 10, 2, 3, 4, 5, 6, 8, 9, F, F+1, F+2, F+3, F+4, F-1, F-2

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/logmax`)
  - Unique values: 2
  - Values: F, F+1

- **metatypes** (`chummer/metatypes/metatype/logmax`)
  - Unique values: 4
  - Values: 4, 5, 6, 7

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/logmax`)
  - Unique values: 5
  - Values: 4, 5, 6, 7, 8

### logmin
Appears in 4 file(s):

- **critters** (`chummer/metatypes/metatype/logmin`)
  - Unique values: 17
  - Values: 0, 1, 10, 2, 3, 4, 5, 6, 8, 9, F, F+1, F+2, F+3, F+4, F-1, F-2

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/logmin`)
  - Unique values: 2
  - Values: F, F+1

- **metatypes** (`chummer/metatypes/metatype/logmin`)
  - Unique values: 2
  - Values: 1, 2

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/logmin`)
  - Unique values: 3
  - Values: 1, 2, 3

### long
Appears in 1 file(s):

- **ranges** (`chummer/ranges/range/long`)
  - Unique values: 22
  - Values: -1, 120, 15, 150, 30, 350, 40, 450, 500, 60, 750, 80, 800, 90, {STR}*1.5, {STR}*3, {STR}*30, {STR}*5, {STR}*6, {STR}*8

### lp
Appears in 2 file(s):

- **lifestyles** (`chummer/lifestyles/lifestyle/lp`)
  - Unique values: 6
  - Values: 0, 12, 2, 3, 4, 6

- **lifestyles** (`chummer/qualities/quality/lp`)
  - Unique values: 7
  - Values: -1, 0, 1, 2, 3, 4, 5

### magaug
Appears in 3 file(s):

- **critters** (`chummer/metatypes/metatype/magaug`)
  - Unique values: 11
  - Values: 0, 10, 13, 3, 4, 5, 6, 7, 8, 9, F

- **metatypes** (`chummer/metatypes/metatype/magaug`)
  - Unique values: 2
  - Values: 0, 6

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/magaug`)
  - Unique values: 2
  - Values: 0, 6

### magic
Appears in 1 file(s):

- **priorities** (`chummer/priorities/priority/talents/talent/magic`)
  - Unique values: 5
  - Values: 2, 3, 4, 5, 6

### magician
Appears in 1 file(s):

- **metamagic** (`chummer/metamagics/metamagic/magician`)
  - Unique values: 2
  - Values: False, True

### magmax
Appears in 3 file(s):

- **critters** (`chummer/metatypes/metatype/magmax`)
  - Unique values: 11
  - Values: 0, 13, 2, 3, 4, 5, 6, 7, 8, 9, F

- **metatypes** (`chummer/metatypes/metatype/magmax`)
  - Unique values: 2
  - Values: 0, 6

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/magmax`)
  - Unique values: 2
  - Values: 0, 6

### magmin
Appears in 3 file(s):

- **critters** (`chummer/metatypes/metatype/magmin`)
  - Unique values: 9
  - Values: 0, 1, 10, 2, 3, 4, 5, 6, F

- **metatypes** (`chummer/metatypes/metatype/magmin`)
  - Unique values: 2
  - Values: 0, 1

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/magmin`)
  - Unique values: 2
  - Values: 0, 1

### matrixcmbonus
Appears in 1 file(s):

- **gear** (`chummer/gears/gear/matrixcmbonus`)
  - Unique values: 3
  - Values: -2, -3, 2

### max
Appears in 5 file(s):

- **bioware** (`chummer/biowares/bioware/bonus/specificattribute/max`)
  - Unique values: 2
  - Values: 1, Rating

- **critters** (`chummer/metatypes/metatype/bonus/enableattribute/max`)
  - Unique values: 9
  - Values: 13, 2, 3, 5, 6, 7, 8, 9, F

- **qualities** (`chummer/qualities/quality/bonus/selectattributes/selectattribute/max`)
  - Unique values: 2
  - Values: 1, 96

- **qualities** (`chummer/qualities/quality/bonus/specificattribute/max`)
  - Unique values: 5
  - Values: -1, -2, 1, 3, 99

- **qualities** (`chummer/qualities/quality/bonus/replaceattributes/replaceattribute/max`)
  - Unique values: 15
  - Values: 0, 10, 11, 12, 13, 14, 15, 2, 3, 4, 5, 6, 7, 8, 9

### maxlevels
Appears in 1 file(s):

- **powers** (`chummer/powers/power/maxlevels`)
  - Unique values: 3
  - Values: 3, 4, 6

### maxrating
Appears in 2 file(s):

- **armor** (`chummer/mods/mod/maxrating`)
  - Unique values: 4
  - Values: 0, 1, 4, 6

- **vehicles** (`chummer/vehicles/vehicle/gears/gear/maxrating`)
  - Unique values: 8
  - Values: 1, 2, 3, 4, 5, 6, 7, 8

### medium
Appears in 1 file(s):

- **ranges** (`chummer/ranges/range/medium`)
  - Unique values: 19
  - Values: -1, 10, 100, 15, 150, 20, 200, 24, 250, 30, 300, 350, 36, 40, 45, {STR}, {STR}*10, {STR}*2, {STR}*4

### memory
Appears in 2 file(s):

- **bioware** (`chummer/biowares/bioware/bonus/memory`)
  - Unique values: 2
  - Values: 2, Rating

- **qualities** (`chummer/qualities/quality/bonus/memory`)
  - Unique values: 3
  - Values: -Rating, 1, 2

### metamagic
Appears in 4 file(s):

- **metamagic** (`chummer/metamagics/metamagic/required/oneof/metamagic`)
  - Unique values: 3
  - Values: Adept Centering, Channeling, Paradigm Shift: Toxic

- **metamagic** (`chummer/metamagics/metamagic/required/allof/metamagic`)
  - Unique values: 9
  - Values: Adept Centering, Cannibalize, Fixation, Harmonious Defense, Improved Astral Form, Masking, Quickening, Sacrifice, Shielding

- **spells** (`chummer/spells/spell/required/allof/metamagic`)
  - Unique values: 3
  - Values: Home Advantage, Patronage, Sacrifice

- **traditions** (`chummer/traditions/tradition/bonus/metamagiclimit/metamagic`)
  - Unique values: 6
  - Values: Advanced Alchemy, Anchoring, Centering, Fixation, Quickening, Structured Spellcasting

### metamagicart
Appears in 2 file(s):

- **spells** (`chummer/spells/spell/required/allof/metamagicart`)
  - Unique values: 15
  - Values: Advanced Alchemy, Apotropaic Magic, Blood Magic, Centering, Channeling, Cleansing, Divination, Exorcism, Geomancy, Invocation, Masking, Necromancy, Psychometry, Quickening, Sensing

- **spells** (`chummer/spells/spell/required/oneof/metamagicart`)
  - Unique values: 2
  - Values: Advanced Ritual Casting, Geomancy

### metatype
Appears in 9 file(s):

- **bioware** (`chummer/biowares/bioware/required/oneof/metatype`)
  - Unique values: 2
  - Values: Ork, Troll

- **cyberware** (`chummer/cyberwares/cyberware/required/oneof/metatype`)
  - Unique values: 2
  - Values: Ork, Troll

- **lifemodules** (`chummer/modules/module/versions/version/required/oneof/metatype`)
  - Unique values: 5
  - Values: Dwarf, Elf, Human, Ork, Troll

- **lifemodules** (`chummer/modules/module/required/oneof/metatype`)
  - Unique values: 2
  - Values: Ork, Troll

- **powers** (`chummer/powers/power/forbidden/oneof/metatype`)
  - Unique values: 2
  - Values: Elf, Troll

- **powers** (`chummer/powers/power/required/oneof/metatype`)
  - Unique values: 2
  - Values: Elf, Troll

- **qualities** (`chummer/qualities/quality/required/oneof/metatype`)
  - Unique values: 10
  - Values: A.I., Centaur, Dwarf, Elf, Human, Naga, Ork, Pixie, Sasquatch, Troll

- **qualities** (`chummer/qualities/quality/forbidden/oneof/metatype`)
  - Unique values: 5
  - Values: Centaur, Human, Naga, Pixie, Sasquatch

- **qualities** (`chummer/qualities/quality/required/allof/metatype`)
  - Unique values: 9
  - Values: Centaur, Dwarf, Elf, Human, Naga, Ork, Pixie, Sasquatch, Troll

### metatypecategory
Appears in 1 file(s):

- **qualities** (`chummer/qualities/quality/forbidden/oneof/metatypecategory`)
  - Unique values: 2
  - Values: Metasapient, Shapeshifter

### min
Appears in 5 file(s):

- **critters** (`chummer/metatypes/metatype/bonus/enableattribute/min`)
  - Unique values: 6
  - Values: 1, 2, 3, 6, 7, F

- **cyberware** (`chummer/cyberwares/cyberware/bonus/knowledgeskillkarmacost/min`)
  - Unique values: 3
  - Values: 3, 4, 5

- **qualities** (`chummer/qualities/quality/bonus/specificattribute/min`)
  - Unique values: 2
  - Values: -1, 1

- **qualities** (`chummer/qualities/quality/bonus/replaceattributes/replaceattribute/min`)
  - Unique values: 7
  - Values: 0, 1, 2, 3, 4, 5, 6

- **ranges** (`chummer/ranges/range/min`)
  - Unique values: 3
  - Values: 0, 20, 5

### minastralinitiativedice
Appears in 1 file(s):

- **settings** (`chummer/settings/setting/minastralinitiativedice`)
  - Unique values: 2
  - Values: 2, 3

### minimum
Appears in 3 file(s):

- **lifestyles** (`chummer/comforts/comfort/minimum`)
  - Unique values: 6
  - Values: 0, 1, 2, 3, 4, 5

- **lifestyles** (`chummer/neighborhoods/neighborhood/minimum`)
  - Unique values: 5
  - Values: 0, 1, 2, 4, 5

- **lifestyles** (`chummer/securities/security/minimum`)
  - Unique values: 6
  - Values: 0, 1, 2, 3, 4, 5

### minrating
Appears in 4 file(s):

- **cyberware** (`chummer/cyberwares/cyberware/minrating`)
  - Unique values: 3
  - Values: 1, {AGIMinimum}+1, {STRMinimum}+1

- **gear** (`chummer/gears/gear/minrating`)
  - Unique values: 7
  - Values: 1, 12, 2, 3, 4, 5, 6

- **programs** (`chummer/programs/program/minrating`)
  - Unique values: 2
  - Values: 2, 3

- **vehicles** (`chummer/mods/mod/minrating`)
  - Unique values: 5
  - Values: Acceleration + 1, Armor + 1, Handling + 1, Sensor + 1, Speed + 1

### modattack
Appears in 1 file(s):

- **gear** (`chummer/gears/gear/modattack`)
  - Unique values: 3
  - Values: -1, 1, {Rating}

### modattributearray
Appears in 1 file(s):

- **gear** (`chummer/gears/gear/modattributearray`)
  - Unique values: 12
  - Values: -1,0,0,1, -1,0,1,0, -1,1,0,0, 0,-1,0,1, 0,-1,1,0, 0,0,-1,1, 0,0,1,-1, 0,1,-1,0, 0,1,0,-1, 1,-1,0,0, 1,0,-1,0, 1,0,0,-1

### moddataprocessing
Appears in 1 file(s):

- **gear** (`chummer/gears/gear/moddataprocessing`)
  - Unique values: 3
  - Values: -1, 1, {Rating}

### mode
Appears in 1 file(s):

- **weapons** (`chummer/weapons/weapon/mode`)
  - Unique values: 13
  - Values: -, 0, BF, BF/FA, FA, SA, SA/BF, SA/BF/FA, SA/FA, SS, SS/BF, SS/FA, SS/SA

### modfirewall
Appears in 1 file(s):

- **gear** (`chummer/gears/gear/modfirewall`)
  - Unique values: 3
  - Values: -1, 1, {Rating}

### modifyammocapacity
Appears in 1 file(s):

- **weapons** (`chummer/accessories/accessory/modifyammocapacity`)
  - Unique values: 2
  - Values: * 3 div 4, +(Weapon * 0.5)

### modsleaze
Appears in 1 file(s):

- **gear** (`chummer/gears/gear/modsleaze`)
  - Unique values: 3
  - Values: -1, 1, {Rating}

### modslots
Appears in 1 file(s):

- **vehicles** (`chummer/vehicles/vehicle/modslots`)
  - Unique values: 6
  - Values: 0, 1, 2, 3, 4, 7

### modularmount
Appears in 1 file(s):

- **cyberware** (`chummer/cyberwares/cyberware/modularmount`)
  - Unique values: 6
  - Values: ankle, elbow, hip, knee, shoulder, wrist

### mount
Appears in 5 file(s):

- **packs** (`chummer/packs/pack/weapons/weapon/accessories/accessory/mount`)
  - Unique values: 3
  - Values: Barrel, Top/Under, Under

- **weapons** (`chummer/weapons/weapon/accessorymounts/mount`)
  - Unique values: 5
  - Values: Barrel, Side, Stock, Top, Under

- **weapons** (`chummer/weapons/weapon/mount`)
  - Unique values: 2
  - Values: Barrel, Under

- **weapons** (`chummer/weapons/weapon/accessories/accessory/mount`)
  - Unique values: 4
  - Values: Side, Stock, Top, Under

- **weapons** (`chummer/accessories/accessory/mount`)
  - Unique values: 9
  - Values: Barrel, Side, Stock, Top, Top/Under, Top/Under/Barrel/Side/Internal, Top/Under/Side, Under, Under/Barrel

### mountsto
Appears in 1 file(s):

- **cyberware** (`chummer/cyberwares/cyberware/mountsto`)
  - Unique values: 6
  - Values: ankle, elbow, hip, knee, shoulder, wrist

### multiplier
Appears in 2 file(s):

- **lifestyles** (`chummer/lifestyles/lifestyle/multiplier`)
  - Unique values: 7
  - Values: 0, 100, 1000, 20, 40, 500, 60

- **lifestyles** (`chummer/qualities/quality/multiplier`)
  - Unique values: 3
  - Values: -10, -20, 10

### name
Appears in 142 file(s):

- **actions** (`chummer/actions/action/boosts/boost/name`)
  - Unique values: 13
  - Values: INT Data Processing Defense, INT Firewall Defense, LOG Attack Defense, LOG Data Processing Defense, LOG Firewall Defense, LOG Sleaze Defense, Melee Defense, Ranged Defense, Suppressive Fire Defense, WIL Attack Defense, WIL Data Processing Defense, WIL Firewall Defense, WIL Sleaze Defense

- **armor** (`chummer/armors/armor/wirelessbonus/skillcategory/name`)
  - Unique values: 2
  - Values: Social, Social Active

- **armor** (`chummer/armors/armor/mods/name`)
  - Unique values: 20
  - Values: Chemical Protection, Chemical Seal, Concealability, Custom Fit, Custom Fit (Stack), Drag Handle, Fire Resistance, Gear Access, Insulation, Internal Air Tank (5 Minutes), Micro-Hardpoint, Newest Model, Padded, Pantheon Armored Shell, Pantheon Quick-Charge Battery Pack, Parachute (Urban Explorer Daedalus), Radiation Shielding, Restrictive, Ruthenium Polymer Coating, Thermal Damping

- **armor** (`chummer/armors/armor/gears/usegear/name`)
  - Unique values: 2
  - Values: Camera, Microphone, Omni-Directional

- **armor** (`chummer/armors/armor/bonus/specificskill/name`)
  - Unique values: 2
  - Values: Etiquette, Intimidation

- **bioware** (`chummer/grades/grade/name`)
  - Unique values: 9
  - Values: Alphaware, Betaware, Deltaware, Gammaware, None, Omegaware, Standard, Standard (Burnout's Way), Used

- **bioware** (`chummer/biowares/bioware/bonus/specificattribute/name`)
  - Unique values: 8
  - Values: AGI, BOD, CHA, INT, LOG, REA, STR, WIL

- **bioware** (`chummer/biowares/bioware/bonus/specificskill/name`)
  - Unique values: 4
  - Values: Escape Artist, Gymnastics, Navigation, Perception

- **bioware** (`chummer/biowares/bioware/bonus/skillcategory/name`)
  - Unique values: 5
  - Values: Academic, Interest, Language, Professional, Street

- **bioware** (`chummer/biowares/bioware/bonus/skillgroup/name`)
  - Unique values: 3
  - Values: Acting, Athletics, Influence

- **bioware** (`chummer/biowares/bioware/pairinclude/name`)
  - Unique values: 2
  - Values: Striking Callus (Feet), Striking Callus (Hands)

- **bioware** (`chummer/biowares/bioware/bonus/skilllinkedattribute/name`)
  - Unique values: 2
  - Values: INT, LOG

- **complexforms** (`chummer/complexforms/complexform/name`)
  - Unique values: 38
  - Values: Arc Feedback, Bootleg Program, Causal Nexus, Cleaner, Coriolis, Derezz, Diffusion of [Matrix Attribute], Dissonance Spike, FAQ, Hyperthreading, Mirrored Persona, Overdrive, Pinch, Redundancy, Resonance Bind, Resonance Channel, Resonance Veil, Static Bomb, Transcendent Grid, Weaken Encryption

- **critterpowers** (`chummer/powers/power/bonus/specificskill/name`)
  - Unique values: 4
  - Values: Free-Fall, Gymnastics, Perception, Swimming

- **critterpowers** (`chummer/powers/power/bonus/critterpowerlevels/power/name`)
  - Unique values: 2
  - Values: Hardened Armor, Hardened Mystic Armor

- **critterpowers** (`chummer/powers/power/bonus/naturalweapon/name`)
  - Unique values: 9
  - Values: Bite, Claws, Electrocytes, Horns, Proboscis, Quills, Tail, Tunneling Claws, Tusk

- **critterpowers** (`chummer/powers/power/bonus/specificattribute/name`)
  - Unique values: 8
  - Values: AGI, BOD, CHA, INT, LOG, REA, STR, WIL

- **critters** (`chummer/metatypes/metatype/bonus/enabletab/name`)
  - Unique values: 3
  - Values: critter, magician, technomancer

- **critters** (`chummer/metatypes/metatype/bonus/enableattribute/name`)
  - Unique values: 3
  - Values: DEP, MAG, RES

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/name`)
  - Unique values: 11
  - Values: Ant, Beetle, Cicada, Firefly, Fly, Locust, Mantid, Mosquito, Roach, Termite, Wasp

- **cyberware** (`chummer/grades/grade/name`)
  - Unique values: 19
  - Values: Alphaware, Alphaware (Adapsin), Betaware, Betaware (Adapsin), Deltaware, Deltaware (Adapsin), Gammaware, Gammaware (Adapsin), Greyware, Greyware (Adapsin), None, Omegaware, Omegaware (Adapsin), Standard, Standard (Adapsin), Standard (Burnout's Way), Standard (Burnout's Way) (Adapsin), Used, Used (Adapsin)

- **cyberware** (`chummer/cyberwares/cyberware/gears/usegear/name`)
  - Unique values: 2
  - Values: Sim Module, Hot, Universal Connector Cord

- **cyberware** (`chummer/cyberwares/cyberware/subsystems/cyberware/name`)
  - Unique values: 45
  - Values: Bone Lacing (Aluminum), Bone Lacing (Plastic), Commlink, Control Rig, Cybereyes Basic System, Data Lock, Modular Mount, Muscle Replacement, Obvious Full Arm, Obvious Full Leg, Obvious Lower Arm, Obvious Lower Leg, Obvious Skull, Olfactory Booster, Skilljack, Skillwires, Spurs, Taste Booster, Touch Link, Visualizer

- **cyberware** (`chummer/cyberwares/cyberware/bonus/specificskill/name`)
  - Unique values: 4
  - Values: Disguise, Impersonation, Intimidation, Mathematics

- **cyberware** (`chummer/cyberwares/cyberware/bonus/specificattribute/name`)
  - Unique values: 4
  - Values: AGI, CHA, REA, STR

- **cyberware** (`chummer/cyberwares/cyberware/wirelesspairinclude/name`)
  - Unique values: 2
  - Values: Reaction Enhancers, Wired Reflexes

- **cyberware** (`chummer/cyberwares/cyberware/pairinclude/name`)
  - Unique values: 8
  - Values: Obvious Lower Arm, Obvious Lower Arm, Modular, Obvious Lower Leg, Obvious Lower Leg, Modular, Synthetic Lower Arm, Synthetic Lower Arm, Modular, Synthetic Lower Leg, Synthetic Lower Leg, Modular

- **cyberware** (`chummer/cyberwares/cyberware/required/parentdetails/OR/name`)
  - Unique values: 34
  - Values: Drone Leg, Foot, Full Arm, Full Leg, Hand, Liminal Body, Liminal Body, Wheeled (Full), Obvious Full Arm, Obvious Full Leg, Obvious Hand, Obvious Lower Arm, Obvious Lower Leg, Obvious Skull, Partial Cyberskull, Primitive Drone Arm, Primitive Drone Leg, Synthetic Foot, Synthetic Full Leg, Synthetic Hand, Synthetic Torso

- **cyberware** (`chummer/cyberwares/cyberware/wirelessbonus/specificskill/name`)
  - Unique values: 2
  - Values: Navigation, Perception

- **cyberware** (`chummer/cyberwares/cyberware/pairbonus/specificskill/name`)
  - Unique values: 2
  - Values: Palming, Swimming

- **cyberware** (`chummer/cyberwares/cyberware/bonus/skilllinkedattribute/name`)
  - Unique values: 2
  - Values: INT, LOG

- **cyberware** (`chummer/cyberwares/cyberware/subsystems/cyberware/gears/usegear/name`)
  - Unique values: 4
  - Values: MCT-5000, Shiawase Jishi, Sony Ronin, Transys Avalon

- **cyberware** (`chummer/cyberwares/cyberware/subsystems/bioware/name`)
  - Unique values: 10
  - Values: Bone Density Augmentation, Cerebral Booster, Enhanced Articulation, Mnemonic Enhancer, Muscle Augmentation, Muscle Toner, Orthoskin, Reflex Recorder, Suprathyroid Gland, Synaptic Booster

- **cyberware** (`chummer/cyberwares/cyberware/subsystems/cyberware/subsystems/cyberware/name`)
  - Unique values: 7
  - Values: Audio Enhancement, Flare Compensation, Low-Light Vision, Smartlink, Spatial Recognizer, Thermographic Vision, Vision Enhancement

- **drugcomponents** (`chummer/grades/grade/name`)
  - Unique values: 4
  - Values: Designer, Pharmaceutical, Standard, Street Cooked

- **drugcomponents** (`chummer/drugs/drug/bonus/attribute/name`)
  - Unique values: 8
  - Values: AGI, BOD, CHA, INT, LOG, REA, STR, WIL

- **drugcomponents** (`chummer/drugs/drug/bonus/limit/name`)
  - Unique values: 3
  - Values: Mental, Physical, Social

- **drugcomponents** (`chummer/drugcomponents/drugcomponent/name`)
  - Unique values: 22
  - Values: Brute, Charmer, Crush, Defender, Duration Enhancer, Genius, Gut Check, Ingestion Enhancer, Inhalation Enhancer, Lighting, Razor Mind, Resist, Shock and Awe, Smoothtalk, Speed Demon, Speed Enhancer, Stonewall, Strike, Tank, The General

- **drugcomponents** (`chummer/drugcomponents/drugcomponent/effects/effect/attribute/name`)
  - Unique values: 8
  - Values: AGI, BOD, CHA, INT, LOG, REA, STR, WIL

- **drugcomponents** (`chummer/drugcomponents/drugcomponent/effects/effect/limit/name`)
  - Unique values: 3
  - Values: Mental, Physical, Social

- **echoes** (`chummer/echoes/echo/name`)
  - Unique values: 29
  - Values: Aegis, Attack Upgrade, Contaminate, Draining Spike, Fight or Flight Filter, MMRI, Mathemagics, Predictive Analytics, Pryon, Quiet, Resonance Link, Resonance Riding, Resonance Scream, Resonance [Program], Siphon, Skinlink, Sleaze Upgrade, Sleepwalker, Sourcerer Daemon, The Van der Waals Effect

- **echoes** (`chummer/echoes/echo/bonus/specificattribute/name`)
  - Unique values: 2
  - Values: LOG, WIL

- **gear** (`chummer/gears/gear/gears/usegear/name`)
  - Unique values: 45
  - Values: Agent, Biofeedback Filter, Blood Alcohol Biosensor, Credstick Reader, Decryption, Earbuds, Edit, Fork, Gas Mask, Hammer, Matches, Microphone, Omni-Directional, Motion Sensor, RFID Tag Scanner, Radar Scanner, Secret Compartment with Faraday Cage, Touchscreen Display, Track, Water Purification Unit, Waterproof Casing

- **gear** (`chummer/gears/gear/required/geardetails/OR/name`)
  - Unique values: 10
  - Values: Add Attack Modification, Add Sleaze Modification, Camera, Contacts, Credstick, Fake (2050), Credstick, Standard (2050), Fake SIN, Fuchi Cyber-Ex, Fuchi Cyber-N, ProCam

- **gear** (`chummer/gears/gear/required/parentdetails/name`)
  - Unique values: 2
  - Values: Cyberdeck, Micro-Hardpoint

- **gear** (`chummer/gears/gear/forbidden/geardetails/OR/name`)
  - Unique values: 3
  - Values: Fake SIN, Fuchi Cyber-Ex, Fuchi Cyber-N

- **gear** (`chummer/gears/gear/bonus/specificskill/name`)
  - Unique values: 2
  - Values: Alchemy, Disenchanting

- **gear** (`chummer/gears/gear/bonus/spellcategory/name`)
  - Unique values: 5
  - Values: Combat, Detection, Health, Illusion, Manipulation

- **gear** (`chummer/gears/gear/required/geardetails/name`)
  - Unique values: 3
  - Values: Altskin, Binoculars (2050), Goggles (2050)

- **gear** (`chummer/gears/gear/allowgear/name`)
  - Unique values: 2
  - Values: External Synthlink, Internal Synthlink

- **lifemodules** (`chummer/modules/module/versions/version/bonus/attributelevel/name`)
  - Unique values: 8
  - Values: AGI, BOD, CHA, INT, LOG, REA, STR, WIL

- **lifemodules** (`chummer/modules/module/versions/version/bonus/skillgrouplevel/name`)
  - Unique values: 12
  - Values: Athletics, Biotech, Close Combat, Conjuring, Cracking, Electronics, Enchanting, Engineering, Firearms, Influence, Outdoors, Sorcery

- **lifemodules** (`chummer/modules/module/bonus/attributelevel/name`)
  - Unique values: 9
  - Values: AGI, BOD, CHA, INT, LOG, REA, RES, STR, WIL

- **lifemodules** (`chummer/modules/module/bonus/skillgrouplevel/name`)
  - Unique values: 12
  - Values: Acting, Athletics, Biotech, Close Combat, Cracking, Electronics, Engineering, Firearms, Influence, Outdoors, Stealth, Tasking

- **lifestyles** (`chummer/lifestyles/lifestyle/name`)
  - Unique values: 12
  - Values: Bolt Hole, Commercial, High, Hospitalized, Basic, Hospitalized, Intensive, ID ERROR. Re-add life style to fix, Low, Luxury, Medium, Squatter, Street, Traveler

- **lifestyles** (`chummer/comforts/comfort/name`)
  - Unique values: 9
  - Values: Bolt Hole, Commercial, High, Low, Luxury, Medium, Squatter, Street, Traveler

- **lifestyles** (`chummer/neighborhoods/neighborhood/name`)
  - Unique values: 9
  - Values: Bolt Hole, Commercial, High, Low, Luxury, Medium, Squatter, Street, Traveler

- **lifestyles** (`chummer/securities/security/name`)
  - Unique values: 9
  - Values: Bolt Hole, Commercial, High, Low, Luxury, Medium, Squatter, Street, Traveler

- **lifestyles** (`chummer/cities/city/name`)
  - Unique values: 17
  - Values: Atlanta, Berlin, Cheyenne, Chicago, Denver, Dubai, Europort, FDC, Hong Kong, Los Angeles, Nairobi, Neo-Tokyo, New York City, Portland, Pretoria-Witwatersrand-Vaal, Seattle, Tenochtitlán

- **mentors** (`chummer/mentors/mentor/choices/choice/bonus/spellcategory/name`)
  - Unique values: 5
  - Values: Combat, Detection, Health, Illusion, Manipulation

- **mentors** (`chummer/mentors/mentor/choices/choice/bonus/specificpower/name`)
  - Unique values: 41
  - Values: Analytics, Astral Perception, Berserk, Critical Strike, Enhanced Accuracy (skill), Improved Sense, Inertia Strike, Iron Will, Light Body, Motion Sense, Natural Immunity, Pain Resistance, Rapid Healing, Spirit Claw, Spirit Ram, Stillness, Temperature Tolerance, Three-Dimensional Memory, Toxic Strike, Traceless Walk

- **mentors** (`chummer/mentors/mentor/choices/choice/bonus/specificskill/name`)
  - Unique values: 22
  - Values: Alchemy, Artisan, Assensing, Banishing, Counterspelling, Demolitions, First Aid, Gymnastics, Instruction, Intimidation, Leadership, Medicine, Pilot Ground Craft, Pilot Watercraft, Ritual Spellcasting, Running, Sneaking, Spellcasting, Summoning, Swimming

- **mentors** (`chummer/mentors/mentor/bonus/specificskill/name`)
  - Unique values: 24
  - Values: Arcana, Artisan, Blades, Computer, Con, Demolitions, Etiquette, First Aid, Gymnastics, Locksmith, Negotiation, Palming, Perception, Ritual Spellcasting, Running, Sneaking, Survival, Swimming, Tracking, Unarmed Combat

- **mentors** (`chummer/mentors/mentor/bonus/skillcategory/name`)
  - Unique values: 5
  - Values: Academic, Interest, Language, Professional, Street

- **mentors** (`chummer/mentors/mentor/required/allof/attribute/name`)
  - Unique values: 2
  - Values: BOD, STR

- **metamagic** (`chummer/arts/art/name`)
  - Unique values: 18
  - Values: Advanced Alchemy, Advanced Ritual Casting, Advanced Spellcasting, Apotropaic Magic, Blood Magic, Centering, Channeling, Cleansing, Divination, Exorcism, Flexible Signature, Geomancy, Invocation, Masking, Necromancy, Psychometry, Quickening, Sensing

- **metatypes** (`chummer/metatypes/metatype/name`)
  - Unique values: 21
  - Values: A.I., Centaur, Dwarf, Elf, Human, Naga, Ork, Pixie, Sasquatch, Shapeshifter: Bovine, Shapeshifter: Canine, Shapeshifter: Equine, Shapeshifter: Falconine, Shapeshifter: Leonine, Shapeshifter: Lupine, Shapeshifter: Pantherine, Shapeshifter: Tigrine, Shapeshifter: Ursine, Shapeshifter: Vulpine, Troll

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/name`)
  - Unique values: 25
  - Values: Dryad, Dwarf, E-Ghost, Fomorian, Giant, Gnome, Hanuman, Hobgoblin, Human, Koborokuru, Minotaur, Nartaki, Nocturna, Ogre, Oni, Ork, Protosapient, Troll, Wakyambi, Xenosapient

- **metatypes** (`chummer/metatypes/metatype/bonus/enableattribute/name`)
  - Unique values: 2
  - Values: DEP, MAG

- **metatypes** (`chummer/metatypes/metatype/bonus/enabletab/name`)
  - Unique values: 2
  - Values: advanced programs, critter

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/bonus/enabletab/name`)
  - Unique values: 2
  - Values: advanced programs, critter

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/bonus/enableattribute/name`)
  - Unique values: 2
  - Values: DEP, MAG

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/bonus/naturalweapon/name`)
  - Unique values: 12
  - Values: Bite (Canine Form), Bite (Falconine Form), Bite (Leonine Form), Bite (Lupine Form), Bite (Pantherine Form), Bite (Phocine Form), Bite (Seal Form), Bite (Tigrine Form), Bite (Ursine Form), Bite (Vulpine Form), Claws, Talons (Falconine Form)

- **options** (`chummer/limbcounts/limb/name`)
  - Unique values: 4
  - Values: 4 (2 arms, 2 legs), 5 (2 arms, 2 legs, skull), 5 (2 arms, 2 legs, torso), 6 (2 arms, 2 legs, torso, skull)

- **options** (`chummer/pdfarguments/pdfargument/name`)
  - Unique values: 6
  - Values: Acrobat-style, Acrobat-style - New instance, Sumatra, Sumatra - Re-use instance, Unix-style, Web Browser

- **packs** (`chummer/packs/pack/armors/armor/name`)
  - Unique values: 11
  - Values: Actioneer Business Clothes, Armor Clothing, Armor Jacket, Armor Vest, Ballistic Mask, Chameleon Suit, Clothing, Helmet, Lined Coat, Urban Explorer Jumpsuit, Urban Explorer Jumpsuit: Helmet

- **packs** (`chummer/packs/pack/gears/gear/gears/gear/name`)
  - Unique values: 15
  - Values: Audio Enhancement, CS/Tear Gas, Fake License, Flare Compensation, Image Link, Low Light, Microwire (100m), Narcoject, Pepper Punch, Select Sound Filter, Sim Module, Subvocal Mic, Thermographic Vision, Vision Enhancement, Vision Magnification

- **packs** (`chummer/packs/pack/weapons/weapon/name`)
  - Unique values: 43
  - Values: Ares Light Fire 70, Ares Predator V, Aztechnology Striker, Bow (Rating 6), Browning Ultra-Power, Colt America L36, Colt Government 2066, Colt M23, Combat Axe, Extendable Baton, FN HAR, Ingram Valiant, Knife, Parashield Dart Pistol, Ruger Super Warhawk, Savalette Guardian, Spurs, Steyr TMP, Stoner-Ares M202, Telescoping Staff

- **packs** (`chummer/packs/pack/weapons/weapon/accessories/accessory/name`)
  - Unique values: 9
  - Values: Bipod, Concealable Holster, Laser Sight, Quick-Draw Holster, Shock Pad, Silencer, Spare Clip, Speed Loader, Tripod

- **packs** (`chummer/packs/pack/armors/armor/mods/mod/name`)
  - Unique values: 7
  - Values: Chemical Protection, Electrochromic Clothing, Fire Resistance, Insulation, Nonconductivity, Shock Frills, Thermal Damping

- **packs** (`chummer/packs/pack/armors/armor/gears/gear/name`)
  - Unique values: 7
  - Values: Biomonitor, Flare Compensation, Flashlight, Image Link, Low Light, Micro-Transceiver, Smartlink

- **packs** (`chummer/packs/pack/cyberwares/cyberware/name`)
  - Unique values: 14
  - Values: Bone Lacing (Aluminum), Control Rig, Cyberears, Cybereyes Basic System, Datajack, Dermal Plating, Hand Razors, Muscle Replacement, Olfactory Booster, Reaction Enhancers, Simrig, Spurs, Taste Booster, Wired Reflexes

- **packs** (`chummer/packs/pack/cyberwares/cyberware/cyberwares/cyberware/name`)
  - Unique values: 8
  - Values: Audio Enhancement, Flare Compensation, Low-Light Vision, Select Sound Filter, Smartlink, Thermographic Vision, Vision Enhancement, Vision Magnification

- **packs** (`chummer/packs/pack/biowares/bioware/name`)
  - Unique values: 6
  - Values: Bone Density Augmentation, Cat's Eyes, Cerebral Booster, Enhanced Articulation, Mnemonic Enhancer, Synaptic Booster

- **packs** (`chummer/packs/pack/vehicles/vehicle/name`)
  - Unique values: 8
  - Values: Chrysler-Nissan Jackrabbit (Subcompact), GM-Nissan Doberman (Medium), Lockheed Optic-X2 (Small), Shiawase Kanmushi (Microdrone), Steel Lynx Combat Drone (Large), Suzuki Mirage (Racing Bike), Toyota Gopher (Heavy-Duty Pickup), Yamaha Growler (Off-Road Bike)

- **packs** (`chummer/packs/pack/vehicles/vehicle/gears/gear/name`)
  - Unique values: 3
  - Values: Low Light, Select Sound Filter, Sensor Array

- **packs** (`chummer/packs/pack/vehicles/vehicle/gears/gear/gears/gear/name`)
  - Unique values: 5
  - Values: Camera, Directional Microphone, Low Light, Smartlink, Thermographic Vision

- **packs** (`chummer/packs/pack/vehicles/vehicle/gears/gear/gears/gear/gears/gear/name`)
  - Unique values: 3
  - Values: Select Sound Filter, Vision Enhancement, Vision Magnification

- **paragons** (`chummer/mentors/mentor/name`)
  - Unique values: 9
  - Values: 01 (The World Tree), Architect, Archivist (The Record Keeper), Black Hat (The Cracker), Daedalus (The Inventor), Delphi (The Oracle), Intrusion Countermeasure (The Guardian), Probe (The Scout), Shooter (The Soldier)

- **paragons** (`chummer/mentors/mentor/bonus/specificskill/name`)
  - Unique values: 4
  - Values: Compiling, Computer, Cybercombat, Hardware

- **paragons** (`chummer/mentors/mentor/bonus/weaponskillaccuracy/name`)
  - Unique values: 12
  - Values: Archery, Automatics, Blades, Clubs, Exotic Melee Weapon, Exotic Ranged Weapon, Gunnery, Heavy Weapons, Longarms, Pistols, Throwing Weapons, Unarmed Combat

- **powers** (`chummer/powers/power/bonus/specificskill/name`)
  - Unique values: 14
  - Values: Animal Handling, Assensing, Con, Disguise, Etiquette, Impersonation, Instruction, Intimidation, Leadership, Negotiation, Palming, Perception, Performance, Throwing Weapons

- **powers** (`chummer/powers/power/includeinlimit/name`)
  - Unique values: 2
  - Values: Power Swimming, Power Swimming (Elf or Troll)

- **powers** (`chummer/enhancements/enhancement/name`)
  - Unique values: 11
  - Values: Air Walking, Barrage, Claws, Digital Celerity, Hot Qi, Master of Taijiquan, Master of the Nine Chakras, Pied Piper, Shadow Touch, Silver-Tongued Devil, Skin Artist

- **priorities** (`chummer/priorities/priority/name`)
  - Unique values: 34
  - Values: A - 24 (12) Attributes, A - 75,000¥, A - Any metatype, B - 20 (10) Attributes, B - 275,000¥, B - 325,000¥, B - 36 Skills/5 Skill Groups, B - Adept, Magician, or Technomancer, C - 140,000¥, C - 25,000¥, C - 28 Skills/2 Skill Groups, D - 14 (7) Attributes, D - 150,000¥, D - 22 Skills/0 Skill Groups, D - 50,000¥, E - 100,000¥, E - 18 Skills/0 Skill Groups, E - 6,000¥, E - Human, E - Mundane

- **priorities** (`chummer/priorities/priority/metatypes/metatype/name`)
  - Unique values: 21
  - Values: A.I., Centaur, Dwarf, Elf, Human, Naga, Ork, Pixie, Sasquatch, Shapeshifter: Bovine, Shapeshifter: Canine, Shapeshifter: Equine, Shapeshifter: Falconine, Shapeshifter: Leonine, Shapeshifter: Lupine, Shapeshifter: Pantherine, Shapeshifter: Tigrine, Shapeshifter: Ursine, Shapeshifter: Vulpine, Troll

- **priorities** (`chummer/priorities/priority/metatypes/metatype/metavariants/metavariant/name`)
  - Unique values: 25
  - Values: Dryad, Dwarf, E-Ghost, Fomorian, Giant, Gnome, Hanuman, Hobgoblin, Human, Koborokuru, Minotaur, Nartaki, Nocturna, Ogre, Oni, Ork, Protosapient, Troll, Wakyambi, Xenosapient

- **priorities** (`chummer/priorities/priority/talents/talent/name`)
  - Unique values: 27
  - Values: A.I. - 1 Depth, A.I. - 2 Depth, A.I. - 3 Depth, A.I. - 4 Depth, A.I. - 6 Depth, Adept - 2 Magic, Adept - 6 Magic, Apprentice - 2 Magic, Apprentice - 3 Magic, Apprentice - 5 Magic, Aspected Magician - 2 Magic, Aspected Magician - 3 Magic, Aspected Magician - 5 Magic, Aware - 3 Magic, Enchanter - 5 Magic, Explorer - 5 Magic, Magician - 6 Magic/10 Spells, Mystic Adept - 4 Magic/7 Spells, Technomancer - 4 Resonance/4 Complex Forms, Technomancer - 6 Resonance/7 Complex Forms

- **qualities** (`chummer/qualities/quality/bonus/skillattribute/name`)
  - Unique values: 2
  - Values: INT, LOG

- **qualities** (`chummer/qualities/quality/bonus/specificskill/name`)
  - Unique values: 25
  - Values: Animal Handling, Artisan, Assensing, Computer, Con, Decompiling, Diving, Etiquette, Exotic Melee Weapon, Gunnery, Gymnastics, Hacking, Negotiation, Perception, Registering, Running, Sneaking, Software, Survival, Swimming

- **qualities** (`chummer/qualities/quality/bonus/skillcategory/name`)
  - Unique values: 9
  - Values: Academic, Combat Active, Interest, Language, Physical Active, Professional, Social Active, Street, Vehicle Active

- **qualities** (`chummer/qualities/quality/includeinlimit/name`)
  - Unique values: 5
  - Values: Indomitable (Mental), Indomitable (Physical), Indomitable (Social), Tough as Nails (Physical), Tough as Nails (Stun)

- **qualities** (`chummer/qualities/quality/bonus/specificattribute/name`)
  - Unique values: 10
  - Values: AGI, BOD, CHA, DEP, EDG, INT, LOG, REA, STR, WIL

- **qualities** (`chummer/qualities/quality/bonus/enableattribute/name`)
  - Unique values: 2
  - Values: MAG, RES

- **qualities** (`chummer/qualities/quality/bonus/enabletab/name`)
  - Unique values: 4
  - Values: adept, critter, magician, technomancer

- **qualities** (`chummer/qualities/quality/bonus/addgear/name`)
  - Unique values: 2
  - Values: Fake SIN, Living Persona

- **qualities** (`chummer/qualities/quality/bonus/skillcategorykarmacostmultiplier/name`)
  - Unique values: 4
  - Values: Academic, Professional, Social Active, Technical Active

- **qualities** (`chummer/qualities/quality/bonus/skillcategorypointcostmultiplier/name`)
  - Unique values: 5
  - Values: Academic, Language, Professional, Social Active, Street

- **qualities** (`chummer/qualities/quality/bonus/skillcategoryspecializationkarmacostmultiplier/name`)
  - Unique values: 3
  - Values: Academic, Professional, Technical Active

- **qualities** (`chummer/qualities/quality/bonus/focusbindingkarmacost/name`)
  - Unique values: 2
  - Values: Qi Focus, Weapon Focus

- **qualities** (`chummer/qualities/quality/bonus/skillgroup/name`)
  - Unique values: 7
  - Values: Close Combat, Conjuring, Electronics, Engineering, Influence, Outdoors, Stealth

- **qualities** (`chummer/qualities/quality/bonus/skillcategorykarmacost/name`)
  - Unique values: 4
  - Values: Academic, Language, Professional, Street

- **qualities** (`chummer/qualities/quality/naturalweapons/naturalweapon/name`)
  - Unique values: 10
  - Values: Crystal Claw, Crystal Jaw, Crystalline Blade, Crystalline Shards, Dracoform Claws, Dracoform Fangs, Dracoform Horns, Dracoform Tail, Infected Bite, Infected Claws

- **qualities** (`chummer/qualities/quality/bonus/replaceattributes/replaceattribute/name`)
  - Unique values: 8
  - Values: AGI, BOD, CHA, INT, LOG, REA, STR, WIL

- **qualities** (`chummer/qualities/quality/required/oneof/skill/name`)
  - Unique values: 18
  - Values: Alchemy, Animal Handling, Artificing, Assensing, Astral Combat, Banishing, Binding, Counterspelling, Disenchanting, Hacking, Magical Theory, Magical Theory (Academic), Magical Theory (Street), Palming, Performance, Ritual Spellcasting, Spellcasting, Summoning

- **qualities** (`chummer/qualities/quality/required/allof/skill/name`)
  - Unique values: 14
  - Values: Alchemy, Arcana, Armorer, Artisan, Assensing, Astral Combat, Binding, Chemistry, Counterspelling, First Aid, Industrial Mechanic, Leadership, Ritual Spellcasting, Zoology

- **qualities** (`chummer/qualities/quality/required/allof/spellcategory/name`)
  - Unique values: 5
  - Values: Combat, Detection, Health, Illusion, Manipulation

- **qualities** (`chummer/qualities/quality/required/oneof/group/skill/name`)
  - Unique values: 15
  - Values: Alchemy, Arcana, Assensing, Astral Combat, Counterspelling, Magical Theory, Magical Theory (Academic), Magical Theory (Street), Magical Traditions, Psychology, Ritual Spellcasting, Spellcasting, Summoning, Unarmed Combat, Zoology

- **ranges** (`chummer/ranges/range/name`)
  - Unique values: 31
  - Values: Aerodynamic Grenade, Assault Cannons, Bows, Carbines, Grenade Launchers, Harpoon Gun, Heavy Pistols, Light Crossbows, Light Machine Guns, Light Pistols, Machine Pistols, Medium Crossbows, Missile Launchers, Net, Shotguns, Sniper Rifles, Sporting Rifles, Standard Grenade, Tasers, Thrown Knife

- **settings** (`chummer/settings/setting/name`)
  - Unique values: 34
  - Values: Full House (German), Full House (Point Buy), Full House (Point Buy, German), Full House (Sum-to-Ten Improved), Full House (Sum-to-Ten, German), Neon Anarchy Prime, Neon Anarchy Prime Point Buy, Neon Anarchy Prime Sum-to-Ten, Newbie's Choice, Prime Runner, Shadowrun Missions Chicago (Point Buy), Shadowrun Missions Neotokyo, Standard, Standard (German), Street Level, Street Scum (BCDEE), Street Scum (CCDDE), Sum-to-Ten, Sum-to-Ten (German), Sum-to-Ten Improved

- **skills** (`chummer/skillgroups/name`)
  - Unique values: 15
  - Values: Acting, Athletics, Biotech, Close Combat, Conjuring, Cracking, Electronics, Enchanting, Engineering, Firearms, Influence, Outdoors, Sorcery, Stealth, Tasking

- **streams** (`chummer/spirits/spirit/name`)
  - Unique values: 7
  - Values: Companion Sprite, Courier Sprite, Crack Sprite, Data Sprite, Fault Sprite, Generalist Sprite, Machine Sprite

- **tips** (`chummer/tips/tip/required/allof/grouponeof/skill/name`)
  - Unique values: 8
  - Values: Archery, Automatics, Blades, Clubs, Longarms, Pistols, Throwing Weapons, Unarmed Combat

- **tips** (`chummer/tips/tip/forbidden/oneof/attribute/name`)
  - Unique values: 2
  - Values: DEP, RES

- **tips** (`chummer/tips/tip/required/allof/skill/name`)
  - Unique values: 5
  - Values: Alchemy, Automatics, Computer, Electronic Warfare, Hacking

- **tips** (`chummer/tips/tip/required/allof/attribute/name`)
  - Unique values: 3
  - Values: MAG, RES, WIL

- **tips** (`chummer/tips/tip/required/oneof/skill/name`)
  - Unique values: 5
  - Values: Con, Etiquette, Intimidation, Leadership, Negotiation

- **traditions** (`chummer/traditions/tradition/bonus/specificskill/name`)
  - Unique values: 5
  - Values: Artificing, Banishing, Counterspelling, Disenchanting, Navigation

- **traditions** (`chummer/traditions/tradition/bonus/spellcategory/name`)
  - Unique values: 3
  - Values: Combat, Health, Illusion

- **traditions** (`chummer/spirits/spirit/bonus/enabletab/name`)
  - Unique values: 2
  - Values: critter, magician

- **traditions** (`chummer/drainattributes/drainattribute/name`)
  - Unique values: 5
  - Values: {WIL} + {CHA}, {WIL} + {INT}, {WIL} + {LOG}, {WIL} + {MAG}, {WIL} + {WIL}

- **vehicles** (`chummer/vehicles/vehicle/gears/gear/name`)
  - Unique values: 4
  - Values: Grenade: Flash-Pak, Holster, Medkit, Sensor Array

- **vehicles** (`chummer/vehicles/vehicle/weapons/weapon/name`)
  - Unique values: 14
  - Values: Colt Cobra TZ-120, Defiance EX Shocker, GE Vindicator Mini-Gun, GE Vindicator Minigun, Jaws, Krupp Munitions 3E Firefighting Cannon, Melee Bite, Micro-Torpedo Launcher, Riot Shield, Siemens FWD Screamer Sonic Cannon, Stoner-Ares M202, Sword, Underbarrel Grenade Launcher, Yamaha Pulsar

- **vehicles** (`chummer/mods/mod/forbidden/vehicledetails/OR/name`)
  - Unique values: 2
  - Values: Caterpillar Omniwinder, Shiawase Motors Shuriken

- **vehicles** (`chummer/weaponmounts/weaponmount/name`)
  - Unique values: 27
  - Values: Armored Manual, Concealed, External, Fixed, Flexible, Flexible [SR5], Heavy (Drone), Heavy [SR5], Huge (Drone), Large (Drone), Light, Manual, Micro (Drone), Mini (Drone), None, Remote, Small (Drone), Standard, Standard (Drone), Standard [SR5]

- **vessels** (`chummer/metatypes/metatype/name`)
  - Unique values: 9
  - Values: Armored/Reinforced Material, Average Material, Cheap Material, Fragile Material, Hardened Material, Heavy Material, Heavy Structural Material, Reinforced Material, Structural Material

- **weapons** (`chummer/weapons/weapon/accessories/accessory/gears/usegear/name`)
  - Unique values: 11
  - Values: Clearsight Autosoft, Flare Compensation, Image Link, Krime Ripper Sensor Array, Low Light, Meta Link, Ogre Hammer SWS Assault Cannon (Commlink), Terracotta Arms AM-47 (Commlink), Tutorsoft, Vision Enhancement, [Weapon] Targeting Autosoft

- **weapons** (`chummer/accessories/accessory/required/weapondetails/name`)
  - Unique values: 16
  - Values: Ares Executioner, Ares Light Fire 70, Ares Light Fire 75, Auto-Assault 16, Enfield AS-7, GE Vindicator Mini-Gun, Glock MP Custodes, HK 223C, HK Puncheon, HK Urban Enforcer, HK Urban Striker, Hammerli Gemini, Onotari Arms Pressure KS-X, PPSK-4 Collapsible Machine Pistol, PSK-3 Collapsible Heavy Pistol, Terracotta Arms Pup

- **weapons** (`chummer/accessories/accessory/required/weapondetails/OR/name`)
  - Unique values: 20
  - Values: Ares Crusader II, Ares Lancer MP Laser, Ares Redline, Cavalier Flash, Ceska Black Scorpion, FN MAG-5, Ingram Valiant, Krime Wave, Onotari Arms SIG-6, PPSK-4 Collapsible Machine Pistol, RPK HMG, Repeating Laser, Ruhrmetall SF-20, Ruhrmetall SMK 252, Shiawase Armaments Nemesis, Steyr TMP, Stoner-Ares M202, Ultamax HMG-2, Ultamax MMG, Underbarrel Laser

- **weapons** (`chummer/accessories/accessory/gears/usegear/name`)
  - Unique values: 11
  - Values: ARO of Local Maps, Camera, Micro, Can Make Commcalls, GPS Monitor, Hidden Compartment, Laser Range Finder, Micro-Lighter, Mini-Multitool, Phosphorescent Blade Coating, Radio Signal Scanner, Vision Magnification

- **weapons** (`chummer/accessories/accessory/forbidden/weapondetails/OR/name`)
  - Unique values: 14
  - Values: Ares Crusader II, Ceska Black Scorpion, HK Urban Assassin, HK Urban Combat, HK Urban Enforcer, HK Urban Fighter, HK Urban Striker, Hammerli Gemini, Onotari Arms Pressure KS-X, Onotari Arms SIG-6, PPSK-4 Collapsible Machine Pistol, PSK-3 Collapsible Heavy Pistol, Ruhrmetall SMK 252, Steyr TMP

- **weapons** (`chummer/accessories/accessory/forbidden/weapondetails/name`)
  - Unique values: 3
  - Values: Glock MP Custodes, Glock MP Custodes (MPV), HK Urban Combat

### nameonpage
Appears in 1 file(s):

- **qualities** (`chummer/qualities/quality/nameonpage`)
  - Unique values: 5
  - Values: Adepts, Aspected Magicians, Magicians, Mystic Adepts, Special Modifications

### notoriety
Appears in 1 file(s):

- **qualities** (`chummer/qualities/quality/bonus/notoriety`)
  - Unique values: 3
  - Values: -1, 1, 3

### nuyen
Appears in 2 file(s):

- **tips** (`chummer/tips/tip/forbidden/allof/nuyen`)
  - Unique values: 2
  - Values: 1000000, 500000

- **tips** (`chummer/tips/tip/required/allof/nuyen`)
  - Unique values: 3
  - Values: 100000000, 200000, 500000

### nuyenamt
Appears in 2 file(s):

- **lifemodules** (`chummer/modules/module/bonus/nuyenamt`)
  - Unique values: 3
  - Values: 15000, 16000, 32000

- **qualities** (`chummer/qualities/quality/bonus/nuyenamt`)
  - Unique values: 2
  - Values: 10000, 5000

### nuyenbp
Appears in 1 file(s):

- **packs** (`chummer/packs/pack/nuyenbp`)
  - Unique values: 22
  - Values: 1, 10, 100, 12, 14, 20, 21, 28, 3, 4, 41, 5, 50, 52, 6, 62, 7, 75, 8, 9

### nuyenmaxbp
Appears in 2 file(s):

- **qualities** (`chummer/qualities/quality/bonus/nuyenmaxbp`)
  - Unique values: 2
  - Values: -1, 30

- **settings** (`chummer/settings/setting/nuyenmaxbp`)
  - Unique values: 5
  - Values: 10, 235, 25, 275, 5

### nuyenperbpwftm
Appears in 1 file(s):

- **settings** (`chummer/settings/setting/nuyenperbpwftm`)
  - Unique values: 3
  - Values: 1000, 2000, 3000

### nuyenperbpwftp
Appears in 1 file(s):

- **settings** (`chummer/settings/setting/nuyenperbpwftp`)
  - Unique values: 3
  - Values: 2000, 3000, 4000

### offroadaccel
Appears in 1 file(s):

- **vehicles** (`chummer/mods/mod/bonus/offroadaccel`)
  - Unique values: 4
  - Values: +Rating, -1, 0, Rating

### offroadhandling
Appears in 1 file(s):

- **vehicles** (`chummer/mods/mod/bonus/offroadhandling`)
  - Unique values: 4
  - Values: +1, +Rating, -1, Rating

### offroadspeed
Appears in 1 file(s):

- **vehicles** (`chummer/mods/mod/bonus/offroadspeed`)
  - Unique values: 4
  - Values: +Rating, -1, 0, Rating

### optionalpower
Appears in 6 file(s):

- **critters** (`chummer/metatypes/metatype/optionalpowers/optionalpower`)
  - Unique values: 37
  - Values: Accident, Banishing Resistance, Combat Skill, Compulsion, Concealment, Confusion, Elemental Attack, Fear, Ghost Chain, Guard, Magic Resistance, Natural Weapon, Noxious Breath, Paralyzing Howl, Regeneration, Sapience, Search, Silence, Vehicle Skill, Venom

- **critters** (`chummer/metatypes/metatype/bonus/optionalpowers/optionalpower`)
  - Unique values: 43
  - Values: Accident, Active Analytics, Animal Control, Combat Skill, Concealment, Confusion, Elemental Attack, Energy Aura, Enhance, Fear, Guard, Inhabitation, Natural Weapon, Noxious Breath, Possession, Reinforcement, Resilient Code, Resonance Spooling, Search, Venom

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/optionalpowers/optionalpower`)
  - Unique values: 13
  - Values: Binding, Compulsion, Concealment, Confusion, Enhanced Senses, Essence Drain, Fear, Guard, Magical Guard, Natural Weapon, Noxious Breath, Pestilence, Venom

- **qualities** (`chummer/qualities/quality/bonus/optionalpowers/optionalpower`)
  - Unique values: 4
  - Values: Armor, Enhanced Senses, Fear, Immunity

- **traditions** (`chummer/spirits/spirit/bonus/optionalpowers/optionalpower`)
  - Unique values: 3
  - Values: Inhabitation, Materialization, Possession

- **traditions** (`chummer/spirits/spirit/optionalpowers/optionalpower`)
  - Unique values: 8
  - Values: Accident, Aura Masking, Compulsion, Noxious Breath, Regeneration, Search, Shadow Cloak, Silence

### order
Appears in 1 file(s):

- **settings** (`chummer/settings/setting/customdatadirectorynames/customdatadirectoryname/order`)
  - Unique values: 6
  - Values: 0, 1, 2, 3, 4, 5

### page
Appears in 38 file(s):

- **actions** (`chummer/actions/action/page`)
  - Unique values: 46
  - Values: 119, 122, 123, 165, 167, 168, 179, 186, 195, 239, 242, 248, 249, 250, 283, 285, 295, 312, 38, 39

- **armor** (`chummer/armors/armor/page`)
  - Unique values: 41
  - Values: 173, 186, 253, 438, 57, 62, 63, 64, 65, 66, 69, 70, 71, 72, 78, 79, 81, 83, 91, 92

- **armor** (`chummer/mods/mod/page`)
  - Unique values: 14
  - Values: 138, 156, 173, 185, 23, 437, 438, 48, 59, 62, 65, 73, 84, 85

- **bioware** (`chummer/grades/grade/page`)
  - Unique values: 5
  - Values: 1, 177, 451, 71, 72

- **bioware** (`chummer/biowares/bioware/page`)
  - Unique values: 33
  - Values: 110, 112, 114, 115, 116, 119, 120, 123, 158, 160, 161, 163, 165, 175, 205, 206, 459, 460, 461, 67

- **books** (`chummer/books/book/matches/match/page`)
  - Unique values: 9
  - Values: 1, 10, 2, 3, 4, 5, 6, 7, 8

- **complexforms** (`chummer/complexforms/complexform/page`)
  - Unique values: 11
  - Values: 133, 134, 25, 252, 253, 58, 90, 91, 94, 95, 96

- **critterpowers** (`chummer/powers/power/bonus/naturalweapon/page`)
  - Unique values: 3
  - Values: 163, 171, 172

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/page`)
  - Unique values: 4
  - Values: 95, 96, 97, 98

- **cyberware** (`chummer/grades/grade/page`)
  - Unique values: 6
  - Values: 1, 158, 177, 451, 71, 72

- **drugcomponents** (`chummer/drugs/drug/page`)
  - Unique values: 16
  - Values: 179, 180, 181, 182, 183, 184, 185, 186, 187, 189, 19, 204, 205, 411, 412, 97

- **drugcomponents** (`chummer/drugcomponents/drugcomponent/page`)
  - Unique values: 2
  - Values: 190, 191

- **echoes** (`chummer/echoes/echo/page`)
  - Unique values: 8
  - Values: 101, 102, 165, 258, 58, 59, 85, 91

- **lifemodules** (`chummer/modules/module/page`)
  - Unique values: 50
  - Values: 0, 103, 128, 129, 150, 151, 179, 180, 181, 27, 29, 53, 66, 69, 70, 71, 72, 79, 81, 83

- **lifestyles** (`chummer/lifestyles/lifestyle/page`)
  - Unique values: 4
  - Values: 1, 216, 218, 369

- **lifestyles** (`chummer/qualities/quality/page`)
  - Unique values: 18
  - Values: 138, 140, 141, 144, 20, 220, 221, 222, 223, 224, 225, 226, 28, 370, 450, 78, 80, 81

- **martialarts** (`chummer/martialarts/martialart/page`)
  - Unique values: 13
  - Values: 101, 127, 128, 129, 130, 131, 132, 133, 134, 135, 17, 5, 6

- **martialarts** (`chummer/techniques/technique/page`)
  - Unique values: 18
  - Values: 102, 111, 112, 119, 120, 121, 122, 123, 124, 125, 131, 135, 136, 137, 138, 139, 140, 141

- **mentors** (`chummer/mentors/mentor/page`)
  - Unique values: 34
  - Values: 120, 122, 123, 129, 132, 137, 179, 200, 24, 29, 322, 41, 42, 43, 46, 86, 94, 95, 96, 99

- **metamagic** (`chummer/metamagics/metamagic/page`)
  - Unique values: 25
  - Values: 131, 145, 149, 150, 151, 152, 153, 155, 157, 158, 165, 325, 326, 35, 399, 43, 44, 46, 87, 90

- **metamagic** (`chummer/arts/art/page`)
  - Unique values: 11
  - Values: 143, 144, 147, 148, 149, 150, 152, 153, 154, 155, 89

- **metatypes** (`chummer/metatypes/metatype/page`)
  - Unique values: 6
  - Values: 105, 135, 147, 50, 98, 99

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/page`)
  - Unique values: 6
  - Values: 104, 135, 161, 50, 89, 90

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/bonus/naturalweapon/page`)
  - Unique values: 3
  - Values: 104, 105, 147

- **paragons** (`chummer/mentors/mentor/page`)
  - Unique values: 3
  - Values: 103, 104, 177

- **powers** (`chummer/powers/power/page`)
  - Unique values: 21
  - Values: 153, 160, 169, 170, 171, 172, 173, 174, 175, 176, 190, 191, 22, 23, 24, 309, 310, 311, 4, 68

- **powers** (`chummer/enhancements/enhancement/page`)
  - Unique values: 4
  - Values: 156, 157, 158, 159

- **programs** (`chummer/programs/program/page`)
  - Unique values: 11
  - Values: 127, 158, 159, 160, 245, 246, 269, 270, 31, 56, 57

- **qualities** (`chummer/qualities/quality/naturalweapons/naturalweapon/page`)
  - Unique values: 3
  - Values: 133, 137, 163

- **skills** (`chummer/skills/skill/page`)
  - Unique values: 14
  - Values: 130, 131, 132, 133, 134, 138, 139, 142, 143, 144, 145, 146, 147, 394

- **spiritpowers** (`chummer/powers/power/page`)
  - Unique values: 19
  - Values: 100, 101, 193, 194, 195, 196, 197, 198, 199, 256, 257, 394, 395, 396, 397, 398, 399, 400, 401

- **streams** (`chummer/spirits/spirit/page`)
  - Unique values: 2
  - Values: 100, 258

- **traditions** (`chummer/traditions/tradition/page`)
  - Unique values: 48
  - Values: 112, 13, 165, 25, 27, 28, 40, 41, 43, 44, 46, 62, 64, 65, 69, 76, 78, 81, 91, 94

- **traditions** (`chummer/spirits/spirit/page`)
  - Unique values: 19
  - Values: 117, 129, 135, 180, 181, 193, 200, 298, 303, 304, 387, 52, 53, 87, 88, 91, 93, 98, 99

- **vehicles** (`chummer/mods/mod/page`)
  - Unique values: 46
  - Values: 123, 128, 132, 153, 155, 160, 161, 165, 167, 168, 177, 186, 187, 189, 212, 220, 44, 461, 54, 70

- **vehicles** (`chummer/weaponmounts/weaponmount/page`)
  - Unique values: 4
  - Values: 0, 124, 163, 461

- **vehicles** (`chummer/weaponmountmods/mod/page`)
  - Unique values: 2
  - Values: 124, 159

- **weapons** (`chummer/accessories/accessory/page`)
  - Unique values: 41
  - Values: 0, 1, 12, 131, 161, 180, 181, 182, 186, 197, 21, 22, 25, 27, 35, 42, 432, 433, 46, 53

### pathogencontactresist
Appears in 2 file(s):

- **armor** (`chummer/mods/mod/bonus/pathogencontactresist`)
  - Unique values: 7
  - Values: 1, 2, 3, 4, 5, 6, Rating

- **qualities** (`chummer/qualities/quality/bonus/pathogencontactresist`)
  - Unique values: 3
  - Values: -2, 1, 2

### pathogeningestionresist
Appears in 1 file(s):

- **qualities** (`chummer/qualities/quality/bonus/pathogeningestionresist`)
  - Unique values: 3
  - Values: -2, 1, 2

### pathogeninhalationresist
Appears in 1 file(s):

- **qualities** (`chummer/qualities/quality/bonus/pathogeninhalationresist`)
  - Unique values: 3
  - Values: -2, 1, 2

### pathogeninjectionresist
Appears in 1 file(s):

- **qualities** (`chummer/qualities/quality/bonus/pathogeninjectionresist`)
  - Unique values: 3
  - Values: -2, 1, 2

### percent
Appears in 3 file(s):

- **cyberware** (`chummer/cyberwares/cyberware/pairbonus/walkmultiplier/percent`)
  - Unique values: 2
  - Values: 100, 50

- **cyberware** (`chummer/cyberwares/cyberware/bonus/walkmultiplier/percent`)
  - Unique values: 2
  - Values: -50, 100

- **cyberware** (`chummer/cyberwares/cyberware/pairbonus/runmultiplier/percent`)
  - Unique values: 2
  - Values: 100, 50

### personallife
Appears in 1 file(s):

- **contacts** (`chummer/personallives/personallife`)
  - Unique values: 7
  - Values: Divorced, Familial Relationship, In Relationship, None of Your Damn Business, Single, Unknown, Widowed

### physical
Appears in 2 file(s):

- **critterpowers** (`chummer/powers/power/bonus/conditionmonitor/physical`)
  - Unique values: 3
  - Values: -20, -Rating, Rating

- **qualities** (`chummer/qualities/quality/bonus/conditionmonitor/physical`)
  - Unique values: 4
  - Values: -1, -2, 1, 2

### physicalcmrecovery
Appears in 2 file(s):

- **bioware** (`chummer/biowares/bioware/bonus/physicalcmrecovery`)
  - Unique values: 3
  - Values: 1, 2, Rating

- **qualities** (`chummer/qualities/quality/bonus/physicalcmrecovery`)
  - Unique values: 2
  - Values: -2, 2

### physiologicaladdictionalreadyaddicted
Appears in 2 file(s):

- **bioware** (`chummer/biowares/bioware/bonus/physiologicaladdictionalreadyaddicted`)
  - Unique values: 3
  - Values: 1, 2, Rating

- **qualities** (`chummer/qualities/quality/bonus/physiologicaladdictionalreadyaddicted`)
  - Unique values: 3
  - Values: -1, -2, -Rating

### physiologicaladdictionfirsttime
Appears in 2 file(s):

- **bioware** (`chummer/biowares/bioware/bonus/physiologicaladdictionfirsttime`)
  - Unique values: 3
  - Values: -2, 1, Rating

- **qualities** (`chummer/qualities/quality/bonus/physiologicaladdictionfirsttime`)
  - Unique values: 4
  - Values: -1, -2, -Rating, 2

### pilot
Appears in 1 file(s):

- **vehicles** (`chummer/vehicles/vehicle/pilot`)
  - Unique values: 7
  - Values: 0, 1, 2, 3, 4, 5, 6

### points
Appears in 1 file(s):

- **powers** (`chummer/powers/power/points`)
  - Unique values: 6
  - Values: 0, 0.25, 0.5, 0.75, 1, 1.5

### power
Appears in 12 file(s):

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/powers/power`)
  - Unique values: 30
  - Values: Animal Control, Astral Form, Astral Gateway, Banishing Resistance, Compulsion, Concealment, Confusion, Elemental Attack, Energy Drain, Fear, Guard, Immunity, Inhabitation, Natural Weapon, Reinforcement, Sapience, Search, Sonic Projection, Venom, Wealth

- **metatypes** (`chummer/metatypes/metatype/powers/power`)
  - Unique values: 9
  - Values: Armor, Concealment, Dual Natured, Guard, Mimicry, Natural Weapon, Search, Vanishing, Venom

- **powers** (`chummer/powers/power/required/oneof/power`)
  - Unique values: 6
  - Values: Berserk, Elemental Strike, Facial Sculpt, Killing Hands, Kinesics, Mimic

- **powers** (`chummer/enhancements/enhancement/power`)
  - Unique values: 10
  - Values: Commanding Voice, Counterstrike, Keratin Control, Light Body, Living Focus, Melanin Control, Missile Mastery, Nerve Strike, Nimble Fingers, Traceless Walk

- **powers** (`chummer/enhancements/enhancement/required/allof/power`)
  - Unique values: 10
  - Values: Commanding Voice, Counterstrike, Keratin Control, Light Body, Living Focus, Melanin Control, Missile Mastery, Nerve Strike, Nimble Fingers, Traceless Walk

- **qualities** (`chummer/qualities/quality/required/oneof/power`)
  - Unique values: 4
  - Values: Adept Spell, Empathic Healing, Killing Hands, Rapid Healing

- **qualities** (`chummer/qualities/quality/bonus/critterpowers/power`)
  - Unique values: 43
  - Values: Adaptive Coloration, Animal Control, Compulsion, Concealment, Dual Natured, Elemental Attack, Empathy, Essence Loss, Fear, Immunity, Induced Dormancy, Innate Spell, Noxious Breath, Paralyzing Howl, Realistic Form, Reduced Sense, Regeneration, Venom, Vestigial Wings, Wall Walking

- **qualities** (`chummer/qualities/quality/required/oneof/group/power`)
  - Unique values: 2
  - Values: Killing Hands, Nerve Strike

- **qualities** (`chummer/qualities/quality/required/allof/power`)
  - Unique values: 7
  - Values: Cool Resolve, Counterstrike, Critical Strike, Elemental Body, Elemental Strike, Killing Hands, Missile Parry

- **streams** (`chummer/spirits/spirit/powers/power`)
  - Unique values: 11
  - Values: Bodyguard, Camouflage, Cookie, Diagnostics, Electron Storm, Gremlins, Hash, Shield, Stability, Suppression, Watermark

- **streams** (`chummer/spirits/spirit/optionalpowers/power`)
  - Unique values: 11
  - Values: Bodyguard, Camouflage, Cookie, Diagnostics, Electron Storm, Gremlins, Hash, Shield, Stability, Suppression, Watermark

- **traditions** (`chummer/spirits/spirit/optionalpowers/power`)
  - Unique values: 48
  - Values: Accident, Animal Control, Combat Skill, Concealment, Elemental Attack, Energy Aura, Enhanced Senses (Low-Light Vision), Enhanced Senses (Smell), Fear, Guard, Magic Resistance, Natural Weapon, Natural Weaponry, Noxious Breath, Reinforcement, Search, Skill (any Technical Skill), Skill (any Technical or Physical skill ), Skill (any combat skill), Venom

### powertrainmodslots
Appears in 1 file(s):

- **vehicles** (`chummer/vehicles/vehicle/powertrainmodslots`)
  - Unique values: 2
  - Values: -14, -7

### preferredpayment
Appears in 1 file(s):

- **contacts** (`chummer/preferredpayments/preferredpayment`)
  - Unique values: 10
  - Values: Barter (Easy-to-Sell Items), Barter (Hobby/Vice Items), Barter (Profession Items), Cash (Corp Scrip), Cash (Credstick), Cash (ECC), Cash (Hard Currency), Service (Drek Jobs), Service (Free-Labor Jobs), Service (Shadowrunner Job)

### priorityarray
Appears in 1 file(s):

- **settings** (`chummer/settings/setting/priorityarray`)
  - Unique values: 4
  - Values: AABCC, ABCDE, BCDEE, CCDDE

### prioritytable
Appears in 3 file(s):

- **priorities** (`chummer/prioritytables/prioritytable`)
  - Unique values: 3
  - Values: Prime Runner, Standard, Street Level

- **priorities** (`chummer/priorities/priority/prioritytable`)
  - Unique values: 3
  - Values: Prime Runner, Standard, Street Level

- **settings** (`chummer/settings/setting/prioritytable`)
  - Unique values: 3
  - Values: Prime Runner, Standard, Street Level

### program
Appears in 1 file(s):

- **programs** (`chummer/programs/program/required/oneof/program`)
  - Unique values: 14
  - Values: Biofeedback, Cat's Paw, Clearsight Autosoft, Decryption, Exploit, Guard, Lockdown, Shell, Sneak, Stealth, Toolbox, Wrapper, [Model] Maneuvering Autosoft, [Weapon] Targeting Autosoft

### programs
Appears in 1 file(s):

- **gear** (`chummer/gears/gear/programs`)
  - Unique values: 9
  - Values: 1, 2, 3, 4, 5, 6, 8, Rating, {Rating}+2

### protectionmodslots
Appears in 1 file(s):

- **vehicles** (`chummer/vehicles/vehicle/protectionmodslots`)
  - Unique values: 2
  - Values: -14, -7

### psychologicaladdictionalreadyaddicted
Appears in 2 file(s):

- **bioware** (`chummer/biowares/bioware/bonus/psychologicaladdictionalreadyaddicted`)
  - Unique values: 3
  - Values: 1, 2, Rating

- **qualities** (`chummer/qualities/quality/bonus/psychologicaladdictionalreadyaddicted`)
  - Unique values: 2
  - Values: -1, -2

### psychologicaladdictionfirsttime
Appears in 2 file(s):

- **bioware** (`chummer/biowares/bioware/bonus/psychologicaladdictionfirsttime`)
  - Unique values: 3
  - Values: -2, 1, Rating

- **qualities** (`chummer/qualities/quality/bonus/psychologicaladdictionfirsttime`)
  - Unique values: 3
  - Values: -1, -2, 2

### publicawareness
Appears in 1 file(s):

- **qualities** (`chummer/qualities/quality/bonus/publicawareness`)
  - Unique values: 4
  - Values: 2, 3, 5, 8

### pushtext
Appears in 2 file(s):

- **lifemodules** (`chummer/modules/module/versions/version/bonus/pushtext`)
  - Unique values: 12
  - Values: Algonkian-Manitou Council, Athabaskan Council, Caribbean League, Confederation of American States, Denver, Las Vegas, Pueblo Corporate Council, Salish-Shidhe Council, Salt Lake City, Sioux Nation, Trans-Polar Aleut Nation, United Canadian American States

- **lifemodules** (`chummer/modules/module/bonus/pushtext`)
  - Unique values: 5
  - Values: Corp-Citizens, Members of different Religions, Policeman, Poor, Tír Tairngire

### qty
Appears in 1 file(s):

- **packs** (`chummer/packs/pack/gears/gear/qty`)
  - Unique values: 29
  - Values: 10, 110, 12, 120, 14, 140, 170, 20, 200, 210, 250, 280, 3, 30, 300, 40, 500, 70, 8, 90

### quality
Appears in 28 file(s):

- **complexforms** (`chummer/complexforms/complexform/required/oneof/quality`)
  - Unique values: 7
  - Values: Dissonant Stream: Apophenian, Dissonant Stream: Erisian, Dissonant Stream: Morphinae, Resonant Stream: Cyberadept, Resonant Stream: Machinist, Resonant Stream: Sourceror, Resonant Stream: Technoshaman

- **critters** (`chummer/metatypes/metatype/qualities/positive/quality`)
  - Unique values: 18
  - Values: Adept, Agile Defender, Aspected Magician, Corrupter, Easily Exploitable, High Pain Tolerance, Inherent Program, Magician, Munge, Mystic Adept, Natural Athlete, Redundancy, Resistance to Pathogens/Toxins, Shiva Arms (Pair), Snooper, Toughness, Water Sprite, Will to Live

- **critters** (`chummer/metatypes/metatype/qualities/negative/quality`)
  - Unique values: 4
  - Values: Carrier (HMHVV Strain II), Cold-Blooded, Gremlins, Real World Naiveté

- **drugcomponents** (`chummer/drugcomponents/drugcomponent/effects/effect/quality`)
  - Unique values: 4
  - Values: High Pain Tolerance, Low Pain Tolerance, Uncouth, Unsteady Hands

- **lifemodules** (`chummer/modules/module/required/oneof/quality`)
  - Unique values: 4
  - Values: Adept, Aspected Magician, Magician, Mystic Adept

- **lifemodules** (`chummer/modules/module/bonus/selectquality/quality`)
  - Unique values: 4
  - Values: Biocompatibility (Bioware), Biocompatibility (Cyberware), College Education, Technical School Education

- **lifemodules** (`chummer/modules/module/bonus/addqualities/addquality/options/quality`)
  - Unique values: 2
  - Values: College Education, Technical School Education

- **martialarts** (`chummer/martialarts/martialart/required/oneof/quality`)
  - Unique values: 2
  - Values: Adept, Mystic Adept

- **metamagic** (`chummer/metamagics/metamagic/required/oneof/quality`)
  - Unique values: 29
  - Values: Adept, Infected: Bandersnatch, Infected: Banshee, Infected: Dzoo-Noo-Qua, Infected: Ghoul (Dwarf), Infected: Ghoul (Elf), Infected: Ghoul (Human), Infected: Ghoul (Sasquatch), Infected: Ghoul (Troll), Infected: Goblin, Infected: Harvester, Infected: Loup-Garou, Infected: Nosferatu, Infected: Sukuyan (Non-Human), Infected: Vampire (Non-Human), Mystic Adept, The Beast's Way, The Speaker's Way, The Spiritual Way, The Warrior's Way

- **metamagic** (`chummer/metamagics/metamagic/required/allof/quality`)
  - Unique values: 3
  - Values: Mentor Spirit, The Beast's Way, The Invisible Way

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/qualities/positive/quality`)
  - Unique values: 36
  - Values: Animal Pelage (Insulating Pelt), Arcane Arrester, Broadened Auditory System (Ultrasound), Celerity, Designer, Functional Tail (Prehensile), Hawk Eye, Home Ground, Keen-Eared, Lucky, Multiprocessing, Ogre Stomach, Redundancy, Resistance to Pathogens, Resistance to Pathogens/Toxins, Shiva Arms (Pair), Speed Reading, Underwater Vision, Vomeronasal Organ, Webbed Digits

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/qualities/negative/quality`)
  - Unique values: 14
  - Values: Allergy (Common, Mild), Celerity, Cyclopean Eye, Driven, Elongated Limbs, Neoteny, Nocturnal, Poor Self Control (Vindictive), Social Stress, Striking Skin Pigmentation, Symbiosis, Uncouth, Uneducated, Unusual Hair

- **metatypes** (`chummer/metatypes/metatype/qualities/positive/quality`)
  - Unique values: 10
  - Values: Astral Perception, Codeslinger, Low-Light Vision, Magic Sense, Natural Weapon: Bite (Naga), Natural Weapon: Kick (Centaur), Photographic Memory, Resistance to Pathogens/Toxins, Speed Reading, Thermographic Vision

- **metatypes** (`chummer/metatypes/metatype/qualities/negative/quality`)
  - Unique values: 3
  - Values: Cold-Blooded, Real World Naiveté, Uneducated

- **metatypes** (`chummer/metatypes/metatype/qualityrestriction/negative/quality`)
  - Unique values: 43
  - Values: Bad Luck, Code of Honor, Code of Honor: Avenging Angel, Corrupter, Curiosity Killed the Cat, Data Liberator, Day Job (10 hrs), Easily Exploitable, Fragmentation, Incompetent, Low Pain Tolerance, Prank Warrior, Prejudiced (Common, Biased), Prejudiced (Common, Outspoken), Prejudiced (Common, Radical), Prejudiced (Specific, Biased), SINner (National), Signature, Uneducated, Wanted by GOD

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/qualityrestriction/negative/quality`)
  - Unique values: 43
  - Values: Bad Luck, Code of Honor, Code of Honor: Avenging Angel, Corrupter, Curiosity Killed the Cat, Data Liberator, Day Job (10 hrs), Easily Exploitable, Fragmentation, Incompetent, Low Pain Tolerance, Prank Warrior, Prejudiced (Common, Biased), Prejudiced (Common, Outspoken), Prejudiced (Common, Radical), Prejudiced (Specific, Biased), SINner (National), Signature, Uneducated, Wanted by GOD

- **powers** (`chummer/powers/power/adeptwayrequires/required/oneof/quality`)
  - Unique values: 8
  - Values: The Artisan's Way, The Artist's Way, The Athlete's Way, The Beast's Way, The Invisible Way, The Speaker's Way, The Spiritual Way, The Warrior's Way

- **powers** (`chummer/enhancements/enhancement/required/allof/quality`)
  - Unique values: 8
  - Values: The Artist's Way, The Athlete's Way, The Beast's Way, The Burnout's Way, The Invisible Way, The Magician's Way, The Speaker's Way, The Warrior's Way

- **priorities** (`chummer/priorities/priority/talents/talent/qualities/quality`)
  - Unique values: 9
  - Values: Adept, Apprentice, Aspected Magician, Aware, Enchanter, Explorer, Magician, Mystic Adept, Technomancer

- **qualities** (`chummer/qualities/quality/costdiscount/required/oneof/quality`)
  - Unique values: 12
  - Values: Adept, Animal Familiar, Apprentice, Aspected Magician, Aware, Enchanter, Explorer, Infected: Mutaqua, Infected: Nosferatu, Infected: Wendigo, Magician, Mystic Adept

- **qualities** (`chummer/qualities/quality/required/allof/quality`)
  - Unique values: 9
  - Values: Crystal Limb (Arm), Crystalline Claws, Fangs, Mage Hunter I, Mage Hunter II, Records on File, Spirit Hunter I, Spirit Hunter II, Technomancer

- **qualities** (`chummer/qualities/quality/bonus/selectquality/discountqualities/quality`)
  - Unique values: 13
  - Values: Astral Hazing, Berserker, Bioluminescence, Cold-Blooded, Critter Spook, Cyclopean Eye, Impaired Attribute (Charisma), Impaired Attribute (Intuition), Impaired Attribute (Logic), Impaired Attribute (Willpower), Scales, Scent Glands, Third Eye

- **qualities** (`chummer/qualities/quality/required/oneof/group/quality`)
  - Unique values: 2
  - Values: Adept, Mystic Adept

- **qualities** (`chummer/qualities/quality/forbidden/allof/quality`)
  - Unique values: 2
  - Values: Adept, Mystic Adept

- **spells** (`chummer/spells/spell/required/oneof/quality`)
  - Unique values: 2
  - Values: Adept, Mystic Adept

- **tips** (`chummer/tips/tip/forbidden/oneof/quality`)
  - Unique values: 5
  - Values: Code of Honor, Code of Honor: Avenging Angel, Code of Honor: Black Hat, Code of Honor: Like a Boss, Perfect Time

- **tips** (`chummer/tips/tip/required/allof/quality`)
  - Unique values: 2
  - Values: Sharpshooter, Strive For Perfection

- **traditions** (`chummer/traditions/tradition/required/oneof/quality`)
  - Unique values: 8
  - Values: Adept, Apprentice, Aspected Magician, Aware, Explorer, Magician, Mentor Spirit, Mystic Adept

### qualitykarmalimit
Appears in 1 file(s):

- **settings** (`chummer/settings/setting/qualitykarmalimit`)
  - Unique values: 3
  - Values: 13, 25, 35

### qualitylevel
Appears in 2 file(s):

- **lifemodules** (`chummer/modules/module/bonus/qualitylevel`)
  - Unique values: 2
  - Values: 1, 3

- **lifemodules** (`chummer/modules/module/bonus/addqualities/qualitylevel`)
  - Unique values: 2
  - Values: 2, 3

### range
Appears in 3 file(s):

- **critterpowers** (`chummer/powers/power/range`)
  - Unique values: 11
  - Values: As ritual, LOS, LOS (A), MAG, MAG x 25 m, MAG x 50, Per Spell, Self, Special, Touch, Touch or LOS

- **spells** (`chummer/spells/spell/range`)
  - Unique values: 7
  - Values: LOS, LOS (A), S, S (A), Special, T, T (A)

- **weapons** (`chummer/weapons/weapon/range`)
  - Unique values: 27
  - Values: Aerodynamic Grenade, Flamethrowers, Grenade Launchers, Harpoon Gun, Heavy Pistols, Holdouts, Light Crossbows, Light Machine Guns, Light Pistols, Machine Pistols, Medium Crossbows, Missile Launchers, Net, Shotguns, Shotguns (slug), Sniper Rifles, Sporting Rifles, Standard Grenade, Tasers, Thrown Knife

### rating
Appears in 22 file(s):

- **armor** (`chummer/armors/armor/rating`)
  - Unique values: 3
  - Values: 24, 4, 6

- **bioware** (`chummer/biowares/bioware/rating`)
  - Unique values: 6
  - Values: 12, 2, 20, 3, 4, 6

- **critterpowers** (`chummer/powers/power/rating`)
  - Unique values: 3
  - Values: 2, 20, True

- **cyberware** (`chummer/cyberwares/cyberware/rating`)
  - Unique values: 14
  - Values: 0, 1, 10, 11980, 12, 2, 3, 4, 5, 6, 600, 9, {AGIMaximum}, {STRMaximum}

- **cyberware** (`chummer/cyberwares/cyberware/subsystems/cyberware/rating`)
  - Unique values: 5
  - Values: 1, 2, 3, 4, 6

- **cyberware** (`chummer/cyberwares/cyberware/subsystems/bioware/rating`)
  - Unique values: 4
  - Values: 1, 2, 3, 4

- **drugcomponents** (`chummer/drugcomponents/drugcomponent/rating`)
  - Unique values: 2
  - Values: 1, 6

- **gear** (`chummer/gears/gear/rating`)
  - Unique values: 21
  - Values: 0, 1, 10, 100, 1000, 100000, 1000000, 12, 2, 20, 20000, 25, 3, 4, 5, 6, 7, 8, 99, {Parent Rating}

- **gear** (`chummer/gears/gear/gears/usegear/rating`)
  - Unique values: 3
  - Values: 1, 2, 3

- **packs** (`chummer/packs/pack/gears/gear/rating`)
  - Unique values: 6
  - Values: 1, 2, 3, 4, 5, 6

- **packs** (`chummer/packs/pack/gears/gear/gears/gear/rating`)
  - Unique values: 4
  - Values: 1, 2, 3, 4

- **packs** (`chummer/packs/pack/armors/armor/mods/mod/rating`)
  - Unique values: 2
  - Values: 2, 4

- **packs** (`chummer/packs/pack/cyberwares/cyberware/rating`)
  - Unique values: 2
  - Values: 1, 2

- **packs** (`chummer/packs/pack/biowares/bioware/rating`)
  - Unique values: 2
  - Values: 1, 2

- **packs** (`chummer/packs/pack/vehicles/vehicle/gears/gear/rating`)
  - Unique values: 2
  - Values: 2, 3

- **packs** (`chummer/packs/pack/vehicles/vehicle/gears/gear/gears/gear/rating`)
  - Unique values: 2
  - Values: 1, 2

- **programs** (`chummer/programs/program/rating`)
  - Unique values: 4
  - Values: 0, 2, 3, 6

- **vehicles** (`chummer/vehicles/vehicle/gears/gear/rating`)
  - Unique values: 7
  - Values: 1, 2, 3, 4, 5, 6, 8

- **vehicles** (`chummer/mods/mod/rating`)
  - Unique values: 13
  - Values: 0, 10, 1000000, 2, 3, 4, 50, 6, 8, 99, Seats, body, qty

- **weapons** (`chummer/weapons/weapon/accessories/accessory/gears/usegear/rating`)
  - Unique values: 5
  - Values: 1, 2, 3, 4, 5

- **weapons** (`chummer/weapons/weapon/accessories/accessory/rating`)
  - Unique values: 4
  - Values: 1, 2, 4, 6

- **weapons** (`chummer/accessories/accessory/rating`)
  - Unique values: 6
  - Values: 0, 1, 10, 1000, 2, 6

### ratinglabel
Appears in 3 file(s):

- **cyberware** (`chummer/cyberwares/cyberware/ratinglabel`)
  - Unique values: 2
  - Values: Rating_LengthInCmBy10, Rating_Meters

- **gear** (`chummer/gears/gear/ratinglabel`)
  - Unique values: 4
  - Values: Rating_Meters, Rating_SqMeters, String_Force, String_Force_Potency

- **vehicles** (`chummer/mods/mod/ratinglabel`)
  - Unique values: 2
  - Values: String_Hours, String_UpgradedRating

### rc
Appears in 2 file(s):

- **weapons** (`chummer/weapons/weapon/rc`)
  - Unique values: 10
  - Values: -, -1, -2, -3, -5, -6, 0, 1, 2, 3

- **weapons** (`chummer/accessories/accessory/rc`)
  - Unique values: 5
  - Values: 1, 2, 3, 5, 6

### rcgroup
Appears in 1 file(s):

- **weapons** (`chummer/accessories/accessory/rcgroup`)
  - Unique values: 2
  - Values: 1, 2

### rea
Appears in 1 file(s):

- **traditions** (`chummer/spirits/spirit/rea`)
  - Unique values: 9
  - Values: 0, F, F+0, F+1, F+2, F+3, F+4, F-1, F-2

### reaaug
Appears in 4 file(s):

- **critters** (`chummer/metatypes/metatype/reaaug`)
  - Unique values: 24
  - Values: 0, 1, 10, 12, 13, 14, 15, 3, 4, 6, 8, 9, F, F+1, F+2, F+3, F+4, F+5, F-1, F-2

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/reaaug`)
  - Unique values: 5
  - Values: F, F+1, F+2, F+3, F+4

- **metatypes** (`chummer/metatypes/metatype/reaaug`)
  - Unique values: 6
  - Values: 0, 10, 11, 12, 8, 9

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/reaaug`)
  - Unique values: 4
  - Values: 0, 10, 11, 9

### reach
Appears in 6 file(s):

- **critterpowers** (`chummer/powers/power/bonus/naturalweapon/reach`)
  - Unique values: 3
  - Values: -1, 0, 1

- **critters** (`chummer/metatypes/metatype/bonus/reach`)
  - Unique values: 6
  - Values: -1, -2, 1, 2, 3, 4

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/bonus/naturalweapon/reach`)
  - Unique values: 3
  - Values: -1, 0, 1

- **qualities** (`chummer/qualities/quality/bonus/reach`)
  - Unique values: 2
  - Values: -1, 1

- **qualities** (`chummer/qualities/quality/naturalweapons/naturalweapon/reach`)
  - Unique values: 3
  - Values: -1, 0, 1

- **weapons** (`chummer/weapons/weapon/reach`)
  - Unique values: 5
  - Values: -1, 0, 1, 2, 3

### reamax
Appears in 4 file(s):

- **critters** (`chummer/metatypes/metatype/reamax`)
  - Unique values: 20
  - Values: 0, 1, 10, 11, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F+4, F+5, F-1, F-2

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/reamax`)
  - Unique values: 5
  - Values: F, F+1, F+2, F+3, F+4

- **metatypes** (`chummer/metatypes/metatype/reamax`)
  - Unique values: 6
  - Values: 0, 4, 5, 6, 7, 8

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/reamax`)
  - Unique values: 4
  - Values: 0, 5, 6, 7

### reamin
Appears in 4 file(s):

- **critters** (`chummer/metatypes/metatype/reamin`)
  - Unique values: 20
  - Values: 0, 1, 10, 11, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F+4, F+5, F-1, F-2

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/reamin`)
  - Unique values: 5
  - Values: F, F+1, F+2, F+3, F+4

- **metatypes** (`chummer/metatypes/metatype/reamin`)
  - Unique values: 4
  - Values: 0, 1, 2, 3

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/reamin`)
  - Unique values: 3
  - Values: 0, 1, 2

### registeredspriteexpression
Appears in 1 file(s):

- **settings** (`chummer/settings/setting/registeredspriteexpression`)
  - Unique values: 2
  - Values: {CHA}, {LOG}

### requireammo
Appears in 1 file(s):

- **weapons** (`chummer/weapons/weapon/requireammo`)
  - Unique values: 2
  - Values: False, microtorpedo

### resaug
Appears in 3 file(s):

- **critters** (`chummer/metatypes/metatype/resaug`)
  - Unique values: 5
  - Values: 0, 3, 5, 6, F

- **metatypes** (`chummer/metatypes/metatype/resaug`)
  - Unique values: 2
  - Values: 0, 6

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/resaug`)
  - Unique values: 2
  - Values: 0, 6

### resmax
Appears in 3 file(s):

- **critters** (`chummer/metatypes/metatype/resmax`)
  - Unique values: 5
  - Values: 0, 3, 5, 6, F

- **metatypes** (`chummer/metatypes/metatype/resmax`)
  - Unique values: 2
  - Values: 0, 6

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/resmax`)
  - Unique values: 2
  - Values: 0, 6

### resmin
Appears in 3 file(s):

- **critters** (`chummer/metatypes/metatype/resmin`)
  - Unique values: 7
  - Values: 0, 2, 3, 4, 5, 6, F

- **metatypes** (`chummer/metatypes/metatype/resmin`)
  - Unique values: 2
  - Values: 0, 1

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/resmin`)
  - Unique values: 2
  - Values: 0, 1

### resonance
Appears in 1 file(s):

- **priorities** (`chummer/priorities/priority/talents/talent/resonance`)
  - Unique values: 3
  - Values: 3, 4, 6

### resources
Appears in 1 file(s):

- **priorities** (`chummer/priorities/priority/resources`)
  - Unique values: 13
  - Values: 100000, 140000, 15000, 150000, 210000, 25000, 275000, 325000, 450000, 50000, 500000, 6000, 75000

### run
Appears in 3 file(s):

- **critters** (`chummer/metatypes/metatype/run`)
  - Unique values: 34
  - Values: 0/0/0, 0/0/4, 0/8/0, 18/0/0, 2/0/0, 2/0/4, 2/0/5, 2/2/0, 3/0/4, 3/0/5, 30/30/30, 36/0/0, 4/0/0, 4/0/4, 4/4/4, 5/0/0, 5/0/8, 56/0/0, 6/0/0, 64/0/0

- **metatypes** (`chummer/metatypes/metatype/run`)
  - Unique values: 9
  - Values: 2/0/6, 2/1/6, 2/8/0, 3/1/0, 4/0/0, 4/1/0, 4/6/0, 5/1/0, 6/1/0

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/run`)
  - Unique values: 7
  - Values: 2/1/6, 2/8/0, 3/1/0, 4/0/0, 4/1/0, 5/1/0, 6/1/0

### seats
Appears in 2 file(s):

- **vehicles** (`chummer/vehicles/vehicle/seats`)
  - Unique values: 22
  - Values: 0, 1, 10, 12, 14, 16, 20, 200, 22, 24, 3, 30, 4, 5, 50, 53, 6, 7, 8, 9

- **vehicles** (`chummer/mods/mod/bonus/seats`)
  - Unique values: 3
  - Values: +1, +16, +Seats * 0.5

### secRating
Appears in 1 file(s):

- **lifestyles** (`chummer/cities/city/district/borough/secRating`)
  - Unique values: 10
  - Values: A, A/B, AA, AAA, B, B/C, C, D, E, Z

### sensor
Appears in 2 file(s):

- **vehicles** (`chummer/vehicles/vehicle/sensor`)
  - Unique values: 9
  - Values: 0, 1, 2, 3, 4, 5, 6, 7, 8

- **vehicles** (`chummer/mods/mod/bonus/sensor`)
  - Unique values: 2
  - Values: -1, Rating

### short
Appears in 1 file(s):

- **ranges** (`chummer/ranges/range/short`)
  - Unique values: 13
  - Values: 10, 15, 2, 25, 40, 5, 50, 6, 70, 9, {STR}, {STR}*2, {STR}/2

### size
Appears in 1 file(s):

- **vehicles** (`chummer/vehicles/vehicle/weaponmounts/weaponmount/size`)
  - Unique values: 11
  - Values: Built-In, Heavy, Heavy (Drone), Heavy [SR5], Huge (Drone), Large (Drone), Light, Mini (Drone), Small (Drone), Standard, Standard (Drone)

### sizecategory
Appears in 1 file(s):

- **weapons** (`chummer/weapons/weapon/sizecategory`)
  - Unique values: 10
  - Values: Assault Rifles, Heavy Crossbows, Heavy Machine Guns, Heavy Pistols, Light Crossbows, Missile Launchers, Shotguns, Sporting Rifles, Submachine Guns, Tasers

### skill
Appears in 7 file(s):

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/skills/skill`)
  - Unique values: 13
  - Values: Assensing, Astral Combat, Con, Counterspelling, Exotic Ranged Weapon, Flight, Gymnastics, Leadership, Negotiation, Perception, Sneaking, Spellcasting, Unarmed Combat

- **lifemodules** (`chummer/modules/module/bonus/addskillspecialization/skill`)
  - Unique values: 3
  - Values: Animal Handling, Etiquette, Tracking

- **martialarts** (`chummer/martialarts/martialart/bonus/addskillspecializationoption/skill`)
  - Unique values: 5
  - Values: Archery, Blades, Clubs, Gymnastics, Unarmed Combat

- **martialarts** (`chummer/martialarts/martialart/bonus/addskillspecializationoption/skills/skill`)
  - Unique values: 5
  - Values: Automatics, Blades, Clubs, Longarms, Pistols

- **priorities** (`chummer/priorities/priority/talents/talent/skillchoices/skill`)
  - Unique values: 3
  - Values: Arcana, Assensing, Astral Combat

- **streams** (`chummer/spirits/spirit/skills/skill`)
  - Unique values: 5
  - Values: Computer, Cybercombat, Electronic Warfare, Hacking, Hardware

- **traditions** (`chummer/spirits/spirit/skills/skill`)
  - Unique values: 27
  - Values: Arcana, Artisan, Assensing, Astral Combat, Blades, Clubs, Con, Counterspelling, Flight, Gymnastics, Impersonation, Negotiation, Perception, Pilot Watercraft, Running, Sneaking, Spellcasting, Survival, Swimming, Unarmed Combat

### skilldisable
Appears in 2 file(s):

- **qualities** (`chummer/qualities/quality/bonus/skilldisable`)
  - Unique values: 6
  - Values: Alchemy, Artificing, Binding, Ritual Spellcasting, Spellcasting, Summoning

- **traditions** (`chummer/traditions/tradition/bonus/skilldisable`)
  - Unique values: 6
  - Values: Alchemy, Artificing, Binding, Ritual Spellcasting, Spellcasting, Summoning

### skillgroup
Appears in 2 file(s):

- **priorities** (`chummer/priorities/priority/talents/talent/skillgroupchoices/skillgroup`)
  - Unique values: 3
  - Values: Conjuring, Enchanting, Sorcery

- **skills** (`chummer/skills/skill/skillgroup`)
  - Unique values: 15
  - Values: Acting, Athletics, Biotech, Close Combat, Conjuring, Cracking, Electronics, Enchanting, Engineering, Firearms, Influence, Outdoors, Sorcery, Stealth, Tasking

### skillgroupdisable
Appears in 2 file(s):

- **qualities** (`chummer/qualities/quality/bonus/skillgroupdisable`)
  - Unique values: 3
  - Values: Conjuring, Enchanting, Sorcery

- **traditions** (`chummer/traditions/tradition/bonus/skillgroupdisable`)
  - Unique values: 2
  - Values: Enchanting, Sorcery

### skillgroups
Appears in 1 file(s):

- **priorities** (`chummer/priorities/priority/skillgroups`)
  - Unique values: 4
  - Values: 0, 10, 2, 5

### skillgroupval
Appears in 1 file(s):

- **priorities** (`chummer/priorities/priority/talents/talent/skillgroupval`)
  - Unique values: 3
  - Values: 0, 2, 4

### skillqty
Appears in 1 file(s):

- **priorities** (`chummer/priorities/priority/talents/talent/skillqty`)
  - Unique values: 3
  - Values: 1, 2, 3

### skills
Appears in 2 file(s):

- **priorities** (`chummer/priorities/priority/skills`)
  - Unique values: 5
  - Values: 18, 22, 28, 36, 46

- **tips** (`chummer/tips/tip/required/allof/skilltotal/skills`)
  - Unique values: 2
  - Values: Con+Etiquette+Negotiation+Leadership+Intimidation, Hardware+Software+Computer+Cybercombat

### skilltype
Appears in 1 file(s):

- **priorities** (`chummer/priorities/priority/talents/talent/skilltype`)
  - Unique values: 5
  - Values: magic, matrix, resonance, specific, xpath

### skillval
Appears in 1 file(s):

- **priorities** (`chummer/priorities/priority/talents/talent/skillval`)
  - Unique values: 4
  - Values: 2, 4, 5, 6

### skillwire
Appears in 1 file(s):

- **cyberware** (`chummer/cyberwares/cyberware/bonus/skillwire`)
  - Unique values: 2
  - Values: Rating, Rating * 2

### sleaze
Appears in 2 file(s):

- **gear** (`chummer/gears/gear/sleaze`)
  - Unique values: 6
  - Values: 0, 1, 3, 5, 6, {INT}

- **qualities** (`chummer/qualities/quality/bonus/livingpersona/sleaze`)
  - Unique values: 2
  - Values: -1, 2

### slots
Appears in 2 file(s):

- **vehicles** (`chummer/weaponmounts/weaponmount/slots`)
  - Unique values: 7
  - Values: 0, 1, 2, 3, 4, 5, 6

- **vehicles** (`chummer/weaponmountmods/mod/slots`)
  - Unique values: 3
  - Values: 0, 1, 2

### sociallimit
Appears in 1 file(s):

- **qualities** (`chummer/qualities/quality/bonus/sociallimit`)
  - Unique values: 2
  - Values: 1, 2

### source
Appears in 39 file(s):

- **actions** (`chummer/actions/action/source`)
  - Unique values: 5
  - Values: DT, KC, R5, RG, SR5

- **armor** (`chummer/armors/armor/source`)
  - Unique values: 14
  - Values: 2050, BB, CA, HAMG, HS, HT, KC, NF, RF, RG, SAG, SL, SR5, TCT

- **armor** (`chummer/mods/mod/source`)
  - Unique values: 9
  - Values: BB, BTB, CA, HAMG, HT, KC, RG, SL, SR5

- **bioware** (`chummer/grades/grade/source`)
  - Unique values: 3
  - Values: CF, SG, SR5

- **bioware** (`chummer/biowares/bioware/source`)
  - Unique values: 7
  - Values: 2050, CF, DTR, HT, KC, NF, SR5

- **complexforms** (`chummer/complexforms/complexform/source`)
  - Unique values: 4
  - Values: CF, DT, KC, SR5

- **critterpowers** (`chummer/powers/power/source`)
  - Unique values: 8
  - Values: AET, DTR, FA, HS, KC, RF, SG, SR5

- **critterpowers** (`chummer/powers/power/bonus/naturalweapon/source`)
  - Unique values: 2
  - Values: DTR, HS

- **critters** (`chummer/metatypes/metatype/source`)
  - Unique values: 12
  - Values: AET, BTB, DATG, DTR, FA, HS, HT, KC, SG, SOXG, SR5, SW

- **cyberware** (`chummer/grades/grade/source`)
  - Unique values: 4
  - Values: BTB, CF, SG, SR5

- **cyberware** (`chummer/cyberwares/cyberware/source`)
  - Unique values: 13
  - Values: 2050, BB, CF, HS, HT, KC, LCD, NF, R5, SAG, SR5, TCT, TSG

- **drugcomponents** (`chummer/drugs/drug/source`)
  - Unique values: 7
  - Values: BB, CF, LCD, SAG, SR5, SS, TVG

- **echoes** (`chummer/echoes/echo/source`)
  - Unique values: 5
  - Values: DT, DTD, DTR, KC, SR5

- **gear** (`chummer/gears/gear/source`)
  - Unique values: 39
  - Values: BB, BTB, CA, HAMG, HT, PBG, PGG, PZG, QSR, R5, RF, RG, SG, SL, SOXG, SPS, SS, TCT, TSG, TVG

- **lifemodules** (`chummer/modules/module/source`)
  - Unique values: 15
  - Values: BTB, CA, CF, DT, HT, KC, NF, R5, RF, SAG, SFCR, SFME, SFMO, SL, TCG

- **lifemodules** (`chummer/modules/module/versions/version/source`)
  - Unique values: 2
  - Values: BTB, R5

- **lifestyles** (`chummer/lifestyles/lifestyle/source`)
  - Unique values: 2
  - Values: RF, SR5

- **lifestyles** (`chummer/qualities/quality/source`)
  - Unique values: 7
  - Values: CA, CF, HT, RF, SFB, SFCR, SR5

- **martialarts** (`chummer/martialarts/martialart/source`)
  - Unique values: 4
  - Values: FA, RG, SAG, SOTG

- **martialarts** (`chummer/techniques/technique/source`)
  - Unique values: 2
  - Values: FA, RG

- **mentors** (`chummer/mentors/mentor/source`)
  - Unique values: 12
  - Values: BOTL, BTB, FA, HS, HT, SAG, SASS, SFCC, SG, SHB2, SOTG, SR5

- **metamagic** (`chummer/metamagics/metamagic/source`)
  - Unique values: 6
  - Values: DTR, FA, HT, PGG, SG, SR5

- **metatypes** (`chummer/metatypes/metatype/source`)
  - Unique values: 4
  - Values: DT, RF, SAG, SR5

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/source`)
  - Unique values: 3
  - Values: DT, RF, SR5

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/bonus/naturalweapon/source`)
  - Unique values: 2
  - Values: RF, SAG

- **powers** (`chummer/powers/power/source`)
  - Unique values: 11
  - Values: BB, BLB, BTB, CA, FA, HT, SG, SGE, SR5, SS, SSP

- **programs** (`chummer/programs/program/source`)
  - Unique values: 3
  - Values: DT, R5, SR5

- **qualities** (`chummer/qualities/quality/source`)
  - Unique values: 22
  - Values: AP, BB, CA, CF, DT, FA, HS, HT, KC, NF, R5, RF, RG, SAG, SASS, SG, SL, SR5, TCT, TSG

- **qualities** (`chummer/qualities/quality/naturalweapons/naturalweapon/source`)
  - Unique values: 3
  - Values: FA, HS, RF

- **spells** (`chummer/spells/spell/source`)
  - Unique values: 11
  - Values: BB, BTB, CA, FA, HT, PGG, SFCR, SG, SR5, SS, SSP

- **spiritpowers** (`chummer/powers/power/source`)
  - Unique values: 3
  - Values: KC, SG, SR5

- **streams** (`chummer/spirits/spirit/source`)
  - Unique values: 2
  - Values: KC, SR5

- **traditions** (`chummer/traditions/tradition/source`)
  - Unique values: 11
  - Values: DATG, DTR, FA, GE, HT, SAG, SFME, SG, SOTG, SR5, SSP

- **traditions** (`chummer/spirits/spirit/source`)
  - Unique values: 5
  - Values: FA, HS, HT, SG, SR5

- **vehicles** (`chummer/vehicles/vehicle/source`)
  - Unique values: 22
  - Values: 2050, BB, CA, HAMG, HT, KK, NF, NP, R5, SFME, SHB, SHB3, SL, SLG7, SOTG, SR5, SS, TCT, TSG, TVG

- **vehicles** (`chummer/mods/mod/source`)
  - Unique values: 14
  - Values: 2050, BB, HT, KK, R5, RF, SAG, SFME, SHB, SHB3, SL, SR5, SS, TCT

- **vehicles** (`chummer/weaponmounts/weaponmount/source`)
  - Unique values: 2
  - Values: R5, SR5

- **weapons** (`chummer/weapons/weapon/source`)
  - Unique values: 29
  - Values: AP, CA, DT, GH3, HAMG, HT, R5, RF, RG, SASS, SFM, SG, SHB, SHB4, SL, SLG2, SR5, SS, TCT, TSG

- **weapons** (`chummer/accessories/accessory/source`)
  - Unique values: 12
  - Values: 2050, BTB, CF, GH3, HT, KK, RG, SAG, SL, SLG2, SOTG, SR5

### spec
Appears in 9 file(s):

- **lifemodules** (`chummer/modules/module/bonus/skilllevel/spec`)
  - Unique values: 11
  - Values: Academic, Communications, Corporate, Data Bombs, Fast Talking, Forests, Personas, Professional, Seduction, Urban, [Specialization]

- **lifemodules** (`chummer/modules/module/versions/version/bonus/skilllevel/spec`)
  - Unique values: 4
  - Values: Drawing, Fashion, Writing, [Profession]

- **lifemodules** (`chummer/modules/module/bonus/addskillspecialization/spec`)
  - Unique values: 4
  - Values: Business, Desert, Moroccan, Riding

- **martialarts** (`chummer/martialarts/martialart/bonus/addskillspecializationoption/spec`)
  - Unique values: 41
  - Values: 52 Blocks, Aikido, Asthenologica, Bartitsu, Boxing (Brawler Style), Drunken Boxing, Fiore dei Liberi, Gun Kata, Jogo Du Pau, Kreussler Fencing, Kyujutsu, La Verdadera Destreza (Rapier Fighting), Muay Thai, Pentjak-Silat, Sangre Y Acero, Tae Kwon Do, Wrestling (MMA Style), Wrestling (Professional Style), Wrestling (Sport Style), Wudang Sword

- **qualities** (`chummer/qualities/quality/required/oneof/skill/spec`)
  - Unique values: 13
  - Values: Astral Barriers, Aura Reading, Combat, Health, Illusion, Magic, Manipulation, Prestidigitation, Spirits, Spirits of Air, Spirits of Earth, Spirits of Fire, Spirits of Water

- **qualities** (`chummer/qualities/quality/required/oneof/group/skill/spec`)
  - Unique values: 9
  - Values: Aura Reading, Manipulation, Spell Design, Spirits, Spirits of Air, Spirits of Earth, Spirits of Fire, Spirits of Water, [Martial Art]

- **weapons** (`chummer/weapons/weapon/spec`)
  - Unique values: 37
  - Values: Aerodynamic, Axes, Batons, Battering Ram, Grapple Gun, Grenade Launchers, Hammers, Knives, Machine Guns, Modified Spray Pen, Natural Weapons, Non-Aerodynamic, Pepper Punch Pen, Revolvers, Saps, Semi-Automatics, Shotguns, Slingshot, Sporting Rifles, Staves

- **weapons** (`chummer/accessories/accessory/required/weapondetails/OR/spec`)
  - Unique values: 3
  - Values: Bow, Grenade Launchers, Missile Launchers

- **weapons** (`chummer/accessories/accessory/forbidden/weapondetails/OR/spec`)
  - Unique values: 2
  - Values: Revolvers, Shotguns

### spec2
Appears in 3 file(s):

- **weapons** (`chummer/weapons/weapon/spec2`)
  - Unique values: 4
  - Values: Aerodynamic, Non-Aerodynamic, Revolvers, Semi-Automatics

- **weapons** (`chummer/accessories/accessory/required/weapondetails/OR/spec2`)
  - Unique values: 2
  - Values: Grenade Launchers, Missile Launchers

- **weapons** (`chummer/accessories/accessory/forbidden/weapondetails/OR/spec2`)
  - Unique values: 2
  - Values: Revolvers, Shotguns

### specialmodificationlimit
Appears in 1 file(s):

- **weapons** (`chummer/accessories/accessory/required/oneof/specialmodificationlimit`)
  - Unique values: 2
  - Values: 1, 2

### specname
Appears in 1 file(s):

- **actions** (`chummer/actions/action/specname`)
  - Unique values: 5
  - Values: Blocking, Data Bombs, Dodging, Parrying, Sprinting

### speed
Appears in 5 file(s):

- **critterpowers** (`chummer/powers/power/bonus/movementreplace/speed`)
  - Unique values: 3
  - Values: run, sprint, walk

- **drugcomponents** (`chummer/drugs/drug/speed`)
  - Unique values: 4
  - Values: 1, 300, 6, 600

- **qualities** (`chummer/qualities/quality/bonus/movementreplace/speed`)
  - Unique values: 3
  - Values: run, sprint, walk

- **vehicles** (`chummer/vehicles/vehicle/speed`)
  - Unique values: 21
  - Values: 0, 1, 1/1, 1/4, 1/7, 2, 2/3, 2/5, 3, 3/4, 3/6, 4, 4/3, 4/5, 5, 5/3, 6, 7, 8, 9

- **vehicles** (`chummer/mods/mod/bonus/speed`)
  - Unique values: 4
  - Values: +Rating, -1, 0, Rating

### spell
Appears in 4 file(s):

- **metamagic** (`chummer/metamagics/metamagic/required/allof/spell`)
  - Unique values: 2
  - Values: Attune Animal, Summon Great Form Spirit

- **qualities** (`chummer/qualities/quality/required/oneof/group/spell`)
  - Unique values: 2
  - Values: Shapechange, [Critter] Form

- **qualities** (`chummer/qualities/quality/required/oneof/spell`)
  - Unique values: 2
  - Values: Shapechange, [Critter] Form

- **qualities** (`chummer/qualities/quality/required/allof/spell`)
  - Unique values: 3
  - Values: Create Ally Spirit, Fling, [Critter] Form

### spellresistance
Appears in 1 file(s):

- **qualities** (`chummer/qualities/quality/bonus/spellresistance`)
  - Unique values: 2
  - Values: 1, 2

### spells
Appears in 1 file(s):

- **priorities** (`chummer/priorities/priority/talents/talent/spells`)
  - Unique values: 3
  - Values: 10, 5, 7

### spirit
Appears in 5 file(s):

- **metamagic** (`chummer/metamagics/metamagic/bonus/addspirit/spirit`)
  - Unique values: 11
  - Values: Guardian Spirit, Guidance Spirit, Plant Spirit, Shedim, Spirit of Air, Spirit of Beasts, Spirit of Earth, Spirit of Fire, Spirit of Man, Spirit of Water, Task Spirit

- **qualities** (`chummer/qualities/quality/bonus/limitspiritcategory/spirit`)
  - Unique values: 4
  - Values: Spirit of Air, Spirit of Earth, Spirit of Fire, Spirit of Water

- **spells** (`chummer/spells/spell/bonus/addspirit/spirit`)
  - Unique values: 17
  - Values: Ally Spirit, Carcass Spirit, Corpse Cadavre, Corpse Spirit, Detritus Spirit, Homunculus (Armored Material), Homunculus (Average Material), Homunculus (Cheap Material), Homunculus (Fragile), Homunculus (Hardened Material), Homunculus (Heavy Material), Homunculus (Heavy Structural Material), Homunculus (Reinforced Material), Homunculus (Structural Material), Palefire Spirit, Rot Spirit, Watcher

- **streams** (`chummer/traditions/tradition/spirits/spirit`)
  - Unique values: 7
  - Values: Companion Sprite, Courier Sprite, Crack Sprite, Data Sprite, Fault Sprite, Generalist Sprite, Machine Sprite

- **traditions** (`chummer/traditions/tradition/bonus/limitspiritcategory/spirit`)
  - Unique values: 6
  - Values: Abomination, Barren, Noxious, Nuclear, Plague, Sludge

### spiritcombat
Appears in 1 file(s):

- **traditions** (`chummer/traditions/tradition/spirits/spiritcombat`)
  - Unique values: 13
  - Values: All, Corpse Spirit, Guardian Spirit, Guidance Spirit, Plant Spirit, Soldier Spirit, Spirit of Air, Spirit of Beasts, Spirit of Earth, Spirit of Fire, Spirit of Man, Spirit of Water, Task Spirit

### spiritdetection
Appears in 1 file(s):

- **traditions** (`chummer/traditions/tradition/spirits/spiritdetection`)
  - Unique values: 12
  - Values: All, Carcass Spirit, Guardian Spirit, Guidance Spirit, Plant Spirit, Scout Spirit, Spirit of Air, Spirit of Beasts, Spirit of Earth, Spirit of Fire, Spirit of Water, Task Spirit

### spiritform
Appears in 1 file(s):

- **traditions** (`chummer/traditions/tradition/spiritform`)
  - Unique values: 2
  - Values: Inhabitation, Possession

### spirithealth
Appears in 1 file(s):

- **traditions** (`chummer/traditions/tradition/spirits/spirithealth`)
  - Unique values: 12
  - Values: All, Caretaker Spirit, Guardian Spirit, Guidance Spirit, Plant Spirit, Rot Spirit, Spirit of Air, Spirit of Earth, Spirit of Fire, Spirit of Man, Spirit of Water, Task Spirit

### spiritillusion
Appears in 1 file(s):

- **traditions** (`chummer/traditions/tradition/spirits/spiritillusion`)
  - Unique values: 11
  - Values: All, Detritus Spirit, Guidance Spirit, Nymph Spirit, Plant Spirit, Spirit of Air, Spirit of Beasts, Spirit of Earth, Spirit of Fire, Spirit of Man, Spirit of Water

### spiritmanipulation
Appears in 1 file(s):

- **traditions** (`chummer/traditions/tradition/spirits/spiritmanipulation`)
  - Unique values: 13
  - Values: All, Guardian Spirit, Guidance Spirit, Palefire Spirit, Plant Spirit, Spirit of Air, Spirit of Beasts, Spirit of Earth, Spirit of Fire, Spirit of Man, Spirit of Water, Task Spirit, Worker Spirit

### sprint
Appears in 4 file(s):

- **critters** (`chummer/metatypes/metatype/sprint`)
  - Unique values: 37
  - Values: 0/2/0, 0/3/0, 1/0/0, 1/1/1, 10/10/10, 2/0/0, 2/1/0, 2/1/2, 2/1/4, 2/2/0, 2/2/2, 4/0/0, 4/1/0, 4/8/1, 5/0/0, 5/1/2, 5/1/7, 5/5/5, 6/1/0, 6/1/2

- **metatypes** (`chummer/metatypes/metatype/sprint`)
  - Unique values: 9
  - Values: 0.5/1/2, 1/1/0, 1/1/2, 1/2/0, 1/4/0, 2/1/0, 2/2/0, 3/1/0, 4/1/0

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/sprint`)
  - Unique values: 6
  - Values: 0.5/1/2, 1/1/0, 1/4/0, 2/1/0, 3/1/0, 4/1/0

- **traditions** (`chummer/spirits/spirit/sprint`)
  - Unique values: 2
  - Values: 1/1/0, 2/1/0

### stage
Appears in 2 file(s):

- **lifemodules** (`chummer/stages/stage`)
  - Unique values: 5
  - Values: Formative Years, Further Education, Nationality, Real Life, Teen Years

- **lifemodules** (`chummer/modules/module/stage`)
  - Unique values: 5
  - Values: Formative Years, Further Education, Nationality, Real Life, Teen Years

### str
Appears in 1 file(s):

- **traditions** (`chummer/spirits/spirit/str`)
  - Unique values: 11
  - Values: 0, F, F+0, F+1, F+2, F+3, F+4, F+5, F-1, F-2, F-3

### straug
Appears in 4 file(s):

- **critters** (`chummer/metatypes/metatype/straug`)
  - Unique values: 35
  - Values: 0, 1, 10, 11, 12, 13, 16, 20, 35, 38, 40, 42, 8, 9, F, F+3, F+4, F+6, F-2, F-3

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/straug`)
  - Unique values: 5
  - Values: F, F+1, F+3, F+5, F-1

- **metatypes** (`chummer/metatypes/metatype/straug`)
  - Unique values: 10
  - Values: 0, 10, 11, 12, 13, 14, 16, 6, 8, 9

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/straug`)
  - Unique values: 8
  - Values: 0, 10, 11, 12, 14, 15, 8, 9

### strmax
Appears in 4 file(s):

- **critters** (`chummer/metatypes/metatype/strmax`)
  - Unique values: 33
  - Values: 0, 1, 10, 12, 13, 16, 19, 35, 40, 42, 8, 9, F, F+1, F+3, F+4, F+5, F+6, F-2, F-3

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/strmax`)
  - Unique values: 5
  - Values: F, F+1, F+3, F+5, F-1

- **metatypes** (`chummer/metatypes/metatype/strmax`)
  - Unique values: 10
  - Values: 0, 10, 12, 2, 4, 5, 6, 7, 8, 9

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/strmax`)
  - Unique values: 8
  - Values: 0, 10, 11, 4, 5, 6, 7, 8

### strmin
Appears in 4 file(s):

- **critters** (`chummer/metatypes/metatype/strmin`)
  - Unique values: 30
  - Values: 0, 1, 10, 12, 13, 16, 30, 35, 40, 42, 8, 9, F, F+1, F+3, F+4, F+5, F+6, F-2, F-3

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/strmin`)
  - Unique values: 5
  - Values: F, F+1, F+3, F+5, F-1

- **metatypes** (`chummer/metatypes/metatype/strmin`)
  - Unique values: 7
  - Values: 0, 1, 2, 3, 4, 5, 7

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/strmin`)
  - Unique values: 6
  - Values: 0, 1, 2, 3, 5, 6

### stun
Appears in 1 file(s):

- **qualities** (`chummer/qualities/quality/bonus/conditionmonitor/stun`)
  - Unique values: 2
  - Values: -1, 1

### stuncmrecovery
Appears in 2 file(s):

- **bioware** (`chummer/biowares/bioware/bonus/stuncmrecovery`)
  - Unique values: 2
  - Values: 1, Rating

- **qualities** (`chummer/qualities/quality/bonus/stuncmrecovery`)
  - Unique values: 2
  - Values: -2, 2

### subsystem
Appears in 1 file(s):

- **vehicles** (`chummer/mods/mod/subsystems/subsystem`)
  - Unique values: 7
  - Values: Bodyware, Cosmetic Enhancement, Cyber Implant Weapon, Cyberlimb, Cyberlimb Accessory, Cyberlimb Enhancement, Headware

### sumtoten
Appears in 1 file(s):

- **settings** (`chummer/settings/setting/sumtoten`)
  - Unique values: 2
  - Values: 10, 14

### surprise
Appears in 1 file(s):

- **qualities** (`chummer/qualities/quality/bonus/surprise`)
  - Unique values: 3
  - Values: -3, -Rating, 3

### target
Appears in 1 file(s):

- **complexforms** (`chummer/complexforms/complexform/target`)
  - Unique values: 9
  - Values: Cyberware, Device, File, Host, IC, Icon, Persona, Self, Sprite

### threshold
Appears in 1 file(s):

- **drugcomponents** (`chummer/drugcomponents/drugcomponent/threshold`)
  - Unique values: 2
  - Values: 1, 2

### toxincontactresist
Appears in 3 file(s):

- **armor** (`chummer/mods/mod/bonus/toxincontactresist`)
  - Unique values: 7
  - Values: 1, 2, 3, 4, 5, 6, Rating

- **bioware** (`chummer/biowares/bioware/bonus/toxincontactresist`)
  - Unique values: 3
  - Values: 1, 2, Rating

- **qualities** (`chummer/qualities/quality/bonus/toxincontactresist`)
  - Unique values: 4
  - Values: -1, -2, 1, 2

### toxiningestionresist
Appears in 2 file(s):

- **bioware** (`chummer/biowares/bioware/bonus/toxiningestionresist`)
  - Unique values: 3
  - Values: 1, 2, Rating

- **qualities** (`chummer/qualities/quality/bonus/toxiningestionresist`)
  - Unique values: 4
  - Values: -1, -2, 1, 2

### toxininhalationresist
Appears in 2 file(s):

- **bioware** (`chummer/biowares/bioware/bonus/toxininhalationresist`)
  - Unique values: 3
  - Values: 1, 2, Rating

- **qualities** (`chummer/qualities/quality/bonus/toxininhalationresist`)
  - Unique values: 4
  - Values: -1, -2, 1, 2

### toxininjectionresist
Appears in 2 file(s):

- **bioware** (`chummer/biowares/bioware/bonus/toxininjectionresist`)
  - Unique values: 2
  - Values: 1, Rating

- **qualities** (`chummer/qualities/quality/bonus/toxininjectionresist`)
  - Unique values: 4
  - Values: -1, -2, 1, 2

### tradition
Appears in 2 file(s):

- **qualities** (`chummer/qualities/quality/required/oneof/group/tradition`)
  - Unique values: 6
  - Values: Buddhism, Chaos Magic, Islam, Sioux, Wicca, Wuxing

- **qualities** (`chummer/qualities/quality/required/oneof/group/grouponeof/tradition`)
  - Unique values: 2
  - Values: Black Magic, Black Magic [Alt]

### trustfund
Appears in 1 file(s):

- **qualities** (`chummer/qualities/quality/bonus/trustfund`)
  - Unique values: 4
  - Values: 1, 2, 3, 4

### type
Appears in 5 file(s):

- **actions** (`chummer/actions/action/type`)
  - Unique values: 6
  - Values: Complex, Extended, Free, Interrupt, No, Simple

- **contacts** (`chummer/types/type`)
  - Unique values: 6
  - Values: Legwork, Networking, Personal Favors, Shadow Services, Support, Swag

- **critterpowers** (`chummer/powers/power/type`)
  - Unique values: 10
  - Values: As Spell, As ritual, Device, File, Host, Icon, M, P, Persona, Persona or Device

- **spells** (`chummer/spells/spell/type`)
  - Unique values: 2
  - Values: M, P

- **weapons** (`chummer/weapons/weapon/type`)
  - Unique values: 2
  - Values: Melee, Ranged

### unarmeddv
Appears in 3 file(s):

- **bioware** (`chummer/biowares/bioware/bonus/unarmeddv`)
  - Unique values: 2
  - Values: Rating*0.5, Rating-1

- **cyberware** (`chummer/cyberwares/cyberware/bonus/unarmeddv`)
  - Unique values: 3
  - Values: 1, 2, 3

- **qualities** (`chummer/qualities/quality/bonus/unarmeddv`)
  - Unique values: 2
  - Values: 1, 2

### underbarrel
Appears in 1 file(s):

- **weapons** (`chummer/weapons/weapon/underbarrels/underbarrel`)
  - Unique values: 20
  - Values: AK-98 Grenade Launcher, Ares Alpha Grenade Launcher, Cannon Shot (Melee), Colt M22A2 Grenade Launcher (2050), Defiance EX Shocker (Melee Contacts), Grenade: Krime Party (Flash-Bang), HK G12A4 Grenade Launcher, HK Urban Enforcer Microgrenade Launcher, Krime Ditch (Shotgun), Krime Soldier GL, Lemat 2072 (Shotgun Barrel), Mannlicher Dirmingen SX BD: Shotgun Barrel, Mannlicher Dirmingen SX BD: Small Caliber, Mannlicher Marpingen Pro D (Shotgun Barrels), Nissan Optimum II Shotgun, PJSS Model 75-III (Rifle Barrel), Rheinmetall Wrecking Ball (Morningstar Mode), Ruhrmetall SFW-30 Tracker Weapon, Steyr UCR Underbarrel Shotgun, Underbarrel Grenade Launcher

### unlockskills
Appears in 2 file(s):

- **critters** (`chummer/metatypes/metatype/bonus/unlockskills`)
  - Unique values: 2
  - Values: Magician, Name

- **qualities** (`chummer/qualities/quality/bonus/unlockskills`)
  - Unique values: 10
  - Values: Adept, Aware, Conjuring, Enchanting, Explorer, Magician, Name, Sorcery, Sorcery,Conjuring,Enchanting, Technomancer

### usegear
Appears in 1 file(s):

- **armor** (`chummer/armors/armor/gears/usegear`)
  - Unique values: 11
  - Values: Biomonitor, Concealable Holster, Flare Compensation, Gas Mask, Grenade: Flash-Pak, Holster, Image Link, Low Light, Medkit, Music Player, Renraku Sensei

### userange
Appears in 1 file(s):

- **gear** (`chummer/gears/gear/weaponbonus/userange`)
  - Unique values: 2
  - Values: Holdouts, Light Pistols

### useskill
Appears in 5 file(s):

- **critterpowers** (`chummer/powers/power/bonus/naturalweapon/useskill`)
  - Unique values: 2
  - Values: Exotic Melee Weapon, Unarmed Combat

- **qualities** (`chummer/qualities/quality/naturalweapons/naturalweapon/useskill`)
  - Unique values: 2
  - Values: Throwing Weapons, Unarmed Combat

- **weapons** (`chummer/weapons/weapon/useskill`)
  - Unique values: 12
  - Values: Archery, Automatics, Blades, Clubs, Exotic Melee Weapon, Exotic Ranged Weapon, Gunnery, Heavy Weapons, Longarms, Pistols, Throwing Weapons, Unarmed Combat

- **weapons** (`chummer/weapons/weapon/required/weapondetails/OR/useskill`)
  - Unique values: 2
  - Values: Heavy Weapons, Longarms

- **weapons** (`chummer/accessories/accessory/required/weapondetails/OR/useskill`)
  - Unique values: 2
  - Values: Heavy Weapons, Longarms

### useskillspec
Appears in 2 file(s):

- **critterpowers** (`chummer/powers/power/bonus/naturalweapon/useskillspec`)
  - Unique values: 2
  - Values: Quills, Trunk

- **weapons** (`chummer/weapons/weapon/useskillspec`)
  - Unique values: 7
  - Values: Bola, Crossbow, Grapple Gun, Grenade Launchers, Laser Weapons, Monofilament Bola, Shotguns

### val
Appears in 35 file(s):

- **bioware** (`chummer/biowares/bioware/bonus/specificattribute/val`)
  - Unique values: 2
  - Values: 1, Rating

- **critterpowers** (`chummer/powers/power/bonus/selectskill/val`)
  - Unique values: 2
  - Values: 2, MAG

- **critterpowers** (`chummer/powers/power/bonus/movementreplace/val`)
  - Unique values: 6
  - Values: 2, 3, 300, 4, 500, 6

- **critterpowers** (`chummer/powers/power/bonus/critterpowerlevels/power/val`)
  - Unique values: 2
  - Values: 1, 2

- **critters** (`chummer/metatypes/metatype/bonus/enableattribute/val`)
  - Unique values: 8
  - Values: 1, 10, 2, 3, 4, 5, 6, F

- **cyberware** (`chummer/cyberwares/cyberware/bonus/knowledgeskillkarmacost/val`)
  - Unique values: 3
  - Values: -1, -number(Rating >= 2), -number(Rating >= 3)

- **lifemodules** (`chummer/modules/module/versions/version/bonus/knowledgeskilllevel/val`)
  - Unique values: 9
  - Values: 0, 1, 10, 13, 2, 3, 4, 5, 6

- **lifemodules** (`chummer/modules/module/bonus/knowledgeskilllevel/val`)
  - Unique values: 7
  - Values: 0, 1, 2, 3, 4, 5, 6

- **lifemodules** (`chummer/modules/module/versions/version/bonus/skilllevel/val`)
  - Unique values: 2
  - Values: 2, 3

- **lifemodules** (`chummer/modules/module/versions/version/bonus/skillgrouplevel/val`)
  - Unique values: 3
  - Values: 1, 2, 3

- **lifemodules** (`chummer/modules/module/bonus/skilllevel/val`)
  - Unique values: 5
  - Values: 0, 1, 2, 3, 4

- **lifemodules** (`chummer/modules/module/bonus/attributelevel/val`)
  - Unique values: 2
  - Values: 1, 2

- **lifemodules** (`chummer/modules/module/bonus/skillgrouplevel/val`)
  - Unique values: 4
  - Values: 1, 2, 3, 4

- **lifemodules** (`chummer/modules/module/bonus/selectskill/val`)
  - Unique values: 2
  - Values: 1, 2

- **mentors** (`chummer/mentors/mentor/choices/choice/bonus/spellcategory/val`)
  - Unique values: 2
  - Values: 1, 2

- **mentors** (`chummer/mentors/mentor/choices/choice/bonus/specificpower/val`)
  - Unique values: 3
  - Values: 1, 2, 3

- **mentors** (`chummer/mentors/mentor/bonus/selectskill/val`)
  - Unique values: 3
  - Values: 1, 2, 4

- **powers** (`chummer/powers/power/bonus/sprintbonus/val`)
  - Unique values: 2
  - Values: 200, 400

- **qualities** (`chummer/qualities/quality/bonus/selectskill/val`)
  - Unique values: 2
  - Values: -2, 1

- **qualities** (`chummer/qualities/quality/bonus/skillcategorykarmacostmultiplier/val`)
  - Unique values: 2
  - Values: 200, 50

- **qualities** (`chummer/qualities/quality/bonus/skillcategorypointcostmultiplier/val`)
  - Unique values: 2
  - Values: 200, 50

- **qualities** (`chummer/qualities/quality/bonus/skillcategoryspecializationkarmacostmultiplier/val`)
  - Unique values: 2
  - Values: 200, 50

- **qualities** (`chummer/qualities/quality/bonus/activeskillkarmacost/val`)
  - Unique values: 2
  - Values: -1, 2

- **qualities** (`chummer/qualities/quality/bonus/knowledgeskillkarmacost/val`)
  - Unique values: 2
  - Values: -1, 2

- **qualities** (`chummer/qualities/quality/bonus/movementreplace/val`)
  - Unique values: 6
  - Values: 1, 2, 3, 50, 500, 6

- **qualities** (`chummer/qualities/quality/bonus/specificattribute/val`)
  - Unique values: 3
  - Values: -1, 1, 2

- **qualities** (`chummer/qualities/quality/required/oneof/skill/val`)
  - Unique values: 12
  - Values: 1, 10, 11, 12, 14, 3, 4, 5, 6, 7, 8, 9

- **qualities** (`chummer/qualities/quality/required/allof/skill/val`)
  - Unique values: 4
  - Values: 3, 4, 5, 6

- **qualities** (`chummer/qualities/quality/required/oneof/group/skill/val`)
  - Unique values: 9
  - Values: 1, 2, 3, 4, 5, 6, 7, 8, 9

- **qualities** (`chummer/qualities/quality/bonus/spellcategorydrain/val`)
  - Unique values: 2
  - Values: -2, 1

- **tips** (`chummer/tips/tip/required/allof/grouponeof/skill/val`)
  - Unique values: 2
  - Values: 4, 6

- **tips** (`chummer/tips/tip/forbidden/oneof/attribute/val`)
  - Unique values: 2
  - Values: 1, 2

- **tips** (`chummer/tips/tip/required/allof/skill/val`)
  - Unique values: 2
  - Values: 1, 6

- **tips** (`chummer/tips/tip/required/allof/skilltotal/val`)
  - Unique values: 2
  - Values: 13, 8

- **traditions** (`chummer/traditions/tradition/bonus/spellcategory/val`)
  - Unique values: 3
  - Values: -2, 2, 3

### value
Appears in 19 file(s):

- **armor** (`chummer/armors/armor/bonus/limitmodifier/value`)
  - Unique values: 4
  - Values: -1, 1, 2, 3

- **armor** (`chummer/armors/armor/wirelessbonus/limitmodifier/value`)
  - Unique values: 3
  - Values: 1, 2, 3

- **armor** (`chummer/mods/mod/bonus/limitmodifier/value`)
  - Unique values: 4
  - Values: 1, 2, 3, Rating

- **bioware** (`chummer/biowares/bioware/bonus/limitmodifier/value`)
  - Unique values: 3
  - Values: 1, 2, Rating

- **cyberware** (`chummer/cyberwares/cyberware/bonus/limitmodifier/value`)
  - Unique values: 5
  - Values: -1, 1, 2, 4, Rating

- **cyberware** (`chummer/cyberwares/cyberware/pairbonus/limitmodifier/value`)
  - Unique values: 3
  - Values: -1, -2, 1

- **drugcomponents** (`chummer/drugs/drug/bonus/attribute/value`)
  - Unique values: 3
  - Values: -2, 1, 2

- **drugcomponents** (`chummer/drugs/drug/bonus/limit/value`)
  - Unique values: 3
  - Values: -1, 1, 2

- **drugcomponents** (`chummer/drugcomponents/drugcomponent/effects/effect/attribute/value`)
  - Unique values: 5
  - Values: -1, -2, 1, 2, 3

- **drugcomponents** (`chummer/drugcomponents/drugcomponent/effects/effect/limit/value`)
  - Unique values: 3
  - Values: -1, -2, 1

- **gear** (`chummer/gears/gear/bonus/limitmodifier/value`)
  - Unique values: 4
  - Values: 1, 2, 3, Rating

- **options** (`chummer/pdfarguments/pdfargument/value`)
  - Unique values: 6
  - Values: "file://{absolutepath}#page={page}", -p {page} "{localpath}", -page {page} "{localpath}", -reuse-instance -page {page} "{localpath}", /A "page={page}" "{localpath}", /A /N "page={page}" "{localpath}"

- **options** (`chummer/availmap/avail/value`)
  - Unique values: 5
  - Values: 100.0, 1000.0, 10000.0, 100000.0, 79228162514264337593543950335

- **priorities** (`chummer/priorities/priority/value`)
  - Unique values: 5
  - Values: A, B, C, D, E

- **priorities** (`chummer/priorities/priority/metatypes/metatype/value`)
  - Unique values: 10
  - Values: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9

- **priorities** (`chummer/priorities/priority/metatypes/metatype/metavariants/metavariant/value`)
  - Unique values: 9
  - Values: 0, 1, 2, 3, 4, 5, 6, 7, 8

- **priorities** (`chummer/priorities/priority/talents/talent/value`)
  - Unique values: 11
  - Values: A.I., Adept, Apprentice, Aspected Magician, Aware, Enchanter, Explorer, Magician, Mundane, Mystic Adept, Technomancer

- **qualities** (`chummer/qualities/quality/costdiscount/value`)
  - Unique values: 4
  - Values: -10, -3, -5, 10

- **qualities** (`chummer/qualities/quality/bonus/limitmodifier/value`)
  - Unique values: 4
  - Values: -1, 1, 2, 3

### vectors
Appears in 1 file(s):

- **drugcomponents** (`chummer/drugs/drug/vectors`)
  - Unique values: 3
  - Values: Inhalation, Inhalation,Injection, Injection

### visibility
Appears in 3 file(s):

- **vehicles** (`chummer/vehicles/vehicle/weaponmounts/weaponmount/visibility`)
  - Unique values: 3
  - Values: Concealed, External, Internal

- **vehicles** (`chummer/weaponmounts/weaponmount/required/weaponmountdetails/visibility`)
  - Unique values: 2
  - Values: External [SR5], None

- **vehicles** (`chummer/weaponmounts/weaponmount/forbidden/weaponmountdetails/visibility`)
  - Unique values: 2
  - Values: External [SR5], None

### walk
Appears in 3 file(s):

- **critters** (`chummer/metatypes/metatype/walk`)
  - Unique values: 26
  - Values: 0/0/0, 0/0/1, 0/2/0, 0/3/0, 1/0/0, 1/1/2, 1/2/0, 1/3/0, 14/0/0, 15/15/15, 16/0/0, 18/0/0, 2/0/0, 2/1/0, 2/1/2, 2/1/3, 2/2/0, 2/2/2, 3/1/0, 3/1/4

- **metatypes** (`chummer/metatypes/metatype/walk`)
  - Unique values: 5
  - Values: 1/1/0, 1/1/2, 1/2/0, 1/3/0, 2/1/0

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/walk`)
  - Unique values: 4
  - Values: 1/1/0, 1/1/2, 1/3/0, 2/1/0

### weakness
Appears in 1 file(s):

- **traditions** (`chummer/spirits/spirit/weaknesses/weakness`)
  - Unique values: 7
  - Values: Allergy (Clean Earth, Severe), Allergy (Clean Water, Severe), Allergy (Fire, Severe), Allergy (Insecticides, Severe), Allergy (Water, Severe), Essence Loss (1 point per day), Evanescence

### weapon
Appears in 2 file(s):

- **tips** (`chummer/tips/tip/forbidden/oneof/weapon`)
  - Unique values: 3
  - Values: Ares Alpha, HK-227, Ingram Smartgun X

- **weapons** (`chummer/accessories/accessory/addunderbarrels/weapon`)
  - Unique values: 2
  - Values: Krime Stun-O-Net, Underbarrel Shotgun

### weaponmodslots
Appears in 1 file(s):

- **vehicles** (`chummer/vehicles/vehicle/weaponmodslots`)
  - Unique values: 3
  - Values: -7, 3, 4

### weapontype
Appears in 1 file(s):

- **weapons** (`chummer/weapons/weapon/weapontype`)
  - Unique values: 25
  - Values: energy, firefighting cannons, flame, flaregun, glauncher, grapplegun, gun, gyrojet, man-catcher, microglauncher, netgun, netgunxl, pepperpunch, sfw-30 main weapon, sfw-30 underbarrel weapon, slingshot, spraypen, squirtgun, torpglauncher, trackstopper

### weight
Appears in 2 file(s):

- **gear** (`chummer/gears/gear/weight`)
  - Unique values: 2
  - Values: 1, Rating

- **weapons** (`chummer/weapons/weapon/weight`)
  - Unique values: 2
  - Values: 60, 80

### wil
Appears in 2 file(s):

- **streams** (`chummer/spirits/spirit/wil`)
  - Unique values: 3
  - Values: F+1, F+2, F+4

- **traditions** (`chummer/spirits/spirit/wil`)
  - Unique values: 7
  - Values: 1, F, F+0, F+1, F+2, F-2, F/2

### wilaug
Appears in 4 file(s):

- **critters** (`chummer/metatypes/metatype/wilaug`)
  - Unique values: 20
  - Values: 1, 10, 11, 12, 13, 15, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+4, F-1, F-2

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/wilaug`)
  - Unique values: 2
  - Values: F, F+1

- **metatypes** (`chummer/metatypes/metatype/wilaug`)
  - Unique values: 4
  - Values: 10, 11, 12, 9

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/wilaug`)
  - Unique values: 3
  - Values: 10, 11, 9

### wilmax
Appears in 4 file(s):

- **critters** (`chummer/metatypes/metatype/wilmax`)
  - Unique values: 17
  - Values: 1, 10, 11, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+4, F-1, F-2

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/wilmax`)
  - Unique values: 2
  - Values: F, F+1

- **metatypes** (`chummer/metatypes/metatype/wilmax`)
  - Unique values: 4
  - Values: 5, 6, 7, 8

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/wilmax`)
  - Unique values: 3
  - Values: 5, 6, 7

### wilmin
Appears in 4 file(s):

- **critters** (`chummer/metatypes/metatype/wilmin`)
  - Unique values: 15
  - Values: 1, 10, 2, 3, 4, 5, 6, 8, 9, F, F+1, F+2, F+4, F-1, F-2

- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/wilmin`)
  - Unique values: 2
  - Values: F, F+1

- **metatypes** (`chummer/metatypes/metatype/wilmin`)
  - Unique values: 3
  - Values: 1, 2, 3

- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/wilmin`)
  - Unique values: 2
  - Values: 1, 2

### xpath
Appears in 1 file(s):

- **qualities** (`chummer/xpathqueries/query/xpath`)
  - Unique values: 7
  - Values: bonus/addquality, canbuywithspellpoints = 'True', category = 'Negative', category = 'Positive', karma >= 5 and karma <= 10, metagenic = 'True', source = 'RF'

## Numeric Type Candidates

Found 847 fields that should be numeric types (≥90% numeric).

### A
- **priorities** (`chummer/priortysumtotenvalues/A`): 100.0% numeric
  - Examples: 4

### B
- **priorities** (`chummer/priortysumtotenvalues/B`): 100.0% numeric
  - Examples: 3

### C
- **priorities** (`chummer/priortysumtotenvalues/C`): 100.0% numeric
  - Examples: 2

### D
- **priorities** (`chummer/priortysumtotenvalues/D`): 100.0% numeric
  - Examples: 1

### E
- **priorities** (`chummer/priortysumtotenvalues/E`): 100.0% numeric
  - Examples: 0

### accel
- **vehicles** (`chummer/vehicles/vehicle/accel`): 100.0% numeric
  - Examples: 1, 2, 1

### accessorycostmultiplier
- **weapons** (`chummer/accessories/accessory/accessorycostmultiplier`): 100.0% numeric
  - Examples: 2

### accuracy
- **gear** (`chummer/gears/gear/weaponbonus/accuracy`): 100.0% numeric
  - Examples: -1, -1, -1
- **weapons** (`chummer/weapons/weapon/wirelessweaponbonus/accuracy`): 100.0% numeric
  - Examples: 2
- **weapons** (`chummer/accessories/accessory/accuracy`): 100.0% numeric
  - Examples: 1, 2, 2

### accuracyreplace
- **gear** (`chummer/gears/gear/weaponbonus/accuracyreplace`): 100.0% numeric
  - Examples: 3, 3

### addictionthreshold
- **drugcomponents** (`chummer/grades/grade/addictionthreshold`): 100.0% numeric
  - Examples: -1

### addslots
- **vehicles** (`chummer/vehicles/vehicle/mods/addslots`): 100.0% numeric
  - Examples: 3

### adeptpowerpoints
- **metamagic** (`chummer/metamagics/metamagic/bonus/adeptpowerpoints`): 100.0% numeric
  - Examples: 1
- **qualities** (`chummer/qualities/quality/bonus/adeptpowerpoints`): 100.0% numeric
  - Examples: 1

### adeptway
- **powers** (`chummer/powers/power/adeptway`): 100.0% numeric
  - Examples: 0.5, 0.25, 0.25

### agi
- **streams** (`chummer/spirits/spirit/agi`): 100.0% numeric
  - Examples: 0, 0, 0

### agiaug
- **metatypes** (`chummer/metatypes/metatype/agiaug`): 100.0% numeric
  - Examples: 10, 11, 10
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/agiaug`): 100.0% numeric
  - Examples: 10, 11, 12
- **vessels** (`chummer/metatypes/metatype/agiaug`): 100.0% numeric
  - Examples: 0, 0, 0

### agimax
- **metatypes** (`chummer/metatypes/metatype/agimax`): 100.0% numeric
  - Examples: 6, 7, 6
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/agimax`): 100.0% numeric
  - Examples: 6, 7, 8
- **vessels** (`chummer/metatypes/metatype/agimax`): 100.0% numeric
  - Examples: 0, 0, 0

### agimin
- **metatypes** (`chummer/metatypes/metatype/agimin`): 100.0% numeric
  - Examples: 1, 2, 1
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/agimin`): 100.0% numeric
  - Examples: 1, 2, 3
- **vessels** (`chummer/metatypes/metatype/agimin`): 100.0% numeric
  - Examples: 0, 0, 0

### ammobonus
- **vehicles** (`chummer/weaponmountmods/mod/ammobonus`): 100.0% numeric
  - Examples: 250

### ammobonuspercent
- **vehicles** (`chummer/weaponmountmods/mod/ammobonuspercent`): 100.0% numeric
  - Examples: 100

### ammoslots
- **weapons** (`chummer/weapons/weapon/ammoslots`): 100.0% numeric
  - Examples: 6
- **weapons** (`chummer/accessories/accessory/ammoslots`): 100.0% numeric
  - Examples: 1, 1, 1

### amount
- **qualities** (`chummer/qualities/quality/bonus/restrictedgear/amount`): 100.0% numeric
  - Examples: 1

### ap
- **critterpowers** (`chummer/powers/power/bonus/naturalweapon/ap`): 100.0% numeric
  - Examples: -1, -6, -2
- **gear** (`chummer/gears/gear/weaponbonus/ap`): 100.0% numeric
  - Examples: -2, -5, 2
- **gear** (`chummer/gears/gear/flechetteweaponbonus/ap`): 100.0% numeric
  - Examples: -5
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/bonus/naturalweapon/ap`): 100.0% numeric
  - Examples: -1, -1, -1
- **qualities** (`chummer/qualities/quality/naturalweapons/naturalweapon/ap`): 100.0% numeric
  - Examples: -1, -1, -1
- **weapons** (`chummer/accessories/accessory/ap`): 100.0% numeric
  - Examples: -1
- **weapons** (`chummer/weapons/weapon/ap`): 96.5% numeric
  - Examples: -8, -6, -6

### apreplace
- **gear** (`chummer/gears/gear/weaponbonus/apreplace`): 100.0% numeric
  - Examples: -1, -5, -6

### area
- **lifestyles** (`chummer/qualities/quality/area`): 100.0% numeric
  - Examples: -1, -1

### armor
- **armor** (`chummer/mods/mod/armor`): 100.0% numeric
  - Examples: 0, 0, 4
- **metatypes** (`chummer/metatypes/metatype/bonus/armor`): 100.0% numeric
  - Examples: 1, 8
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/bonus/armor`): 100.0% numeric
  - Examples: 1, 1, 1
- **qualities** (`chummer/qualities/quality/bonus/armor`): 100.0% numeric
  - Examples: 2, 4, 3
- **traditions** (`chummer/spirits/spirit/armor`): 100.0% numeric
  - Examples: 0
- **vehicles** (`chummer/vehicles/vehicle/armor`): 100.0% numeric
  - Examples: 4, 3, 2
- **vessels** (`chummer/metatypes/metatype/bonus/armor`): 100.0% numeric
  - Examples: 2, 4, 6
- **armor** (`chummer/armors/armor/armor`): 99.5% numeric
  - Examples: 0, 8, 6

### armorcapacity
- **armor** (`chummer/armors/armor/armorcapacity`): 98.5% numeric
  - Examples: 0, 8, 6

### armoroverride
- **armor** (`chummer/armors/armor/armoroverride`): 100.0% numeric
  - Examples: +3, +3, +4

### astralreputation
- **qualities** (`chummer/qualities/quality/bonus/astralreputation`): 100.0% numeric
  - Examples: -1

### attack
- **echoes** (`chummer/echoes/echo/bonus/livingpersona/attack`): 100.0% numeric
  - Examples: 1
- **gear** (`chummer/gears/gear/required/geardetails/OR/attack`): 100.0% numeric
  - Examples: 0, 0, 0
- **gear** (`chummer/gears/gear/required/geardetails/OR/AND/attack`): 100.0% numeric
  - Examples: 0, 0, 0
- **qualities** (`chummer/qualities/quality/bonus/livingpersona/attack`): 100.0% numeric
  - Examples: 2, -1
- **gear** (`chummer/gears/gear/attack`): 97.7% numeric
  - Examples: {CHA}, 0, 0

### attributes
- **priorities** (`chummer/priorities/priority/attributes`): 100.0% numeric
  - Examples: 24, 20, 16

### aug
- **qualities** (`chummer/qualities/quality/bonus/replaceattributes/replaceattribute/aug`): 100.0% numeric
  - Examples: 16, 10, 11

### avail
- **bioware** (`chummer/grades/grade/avail`): 100.0% numeric
  - Examples: 0, 0, 0
- **cyberware** (`chummer/grades/grade/avail`): 100.0% numeric
  - Examples: 0, 0, 0

### availability
- **qualities** (`chummer/qualities/quality/bonus/restrictedgear/availability`): 100.0% numeric
  - Examples: 24
- **qualities** (`chummer/qualities/quality/bonus/availability`): 100.0% numeric
  - Examples: 1
- **settings** (`chummer/settings/setting/availability`): 100.0% numeric
  - Examples: 12, 10, 15

### biowareessmultiplier
- **critters** (`chummer/metatypes/metatype/bonus/biowareessmultiplier`): 100.0% numeric
  - Examples: 90, 90, 90
- **qualities** (`chummer/qualities/quality/bonus/biowareessmultiplier`): 100.0% numeric
  - Examples: 90, 120

### bod
- **streams** (`chummer/spirits/spirit/bod`): 100.0% numeric
  - Examples: 0, 0, 0

### bodaug
- **metatypes** (`chummer/metatypes/metatype/bodaug`): 100.0% numeric
  - Examples: 10, 10, 12
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/bodaug`): 100.0% numeric
  - Examples: 10, 10, 9
- **vessels** (`chummer/metatypes/metatype/bodaug`): 100.0% numeric
  - Examples: 1, 2, 4

### bodmax
- **metatypes** (`chummer/metatypes/metatype/bodmax`): 100.0% numeric
  - Examples: 6, 6, 8
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/bodmax`): 100.0% numeric
  - Examples: 6, 6, 5
- **vessels** (`chummer/metatypes/metatype/bodmax`): 100.0% numeric
  - Examples: 1, 2, 4

### bodmin
- **metatypes** (`chummer/metatypes/metatype/bodmin`): 100.0% numeric
  - Examples: 1, 1, 3
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/bodmin`): 100.0% numeric
  - Examples: 1, 1, 1
- **vessels** (`chummer/metatypes/metatype/bodmin`): 100.0% numeric
  - Examples: 1, 2, 4

### body
- **vehicles** (`chummer/vehicles/vehicle/body`): 100.0% numeric
  - Examples: 4, 4, 2
- **vehicles** (`chummer/mods/mod/required/vehicledetails/body`): 100.0% numeric
  - Examples: 6

### bodymodslots
- **vehicles** (`chummer/vehicles/vehicle/bodymodslots`): 100.0% numeric
  - Examples: 4, 4, 4

### bonus
- **armor** (`chummer/armors/armor/wirelessbonus/skillcategory/bonus`): 100.0% numeric
  - Examples: 1, 1, 1
- **armor** (`chummer/armors/armor/wirelessbonus/specificskill/bonus`): 100.0% numeric
  - Examples: 1, 1, 1
- **armor** (`chummer/armors/armor/bonus/specificskill/bonus`): 100.0% numeric
  - Examples: 1, 1
- **bioware** (`chummer/biowares/bioware/bonus/specificskill/bonus`): 100.0% numeric
  - Examples: 1, 1, 2
- **bioware** (`chummer/biowares/bioware/bonus/skillattribute/bonus`): 100.0% numeric
  - Examples: 1
- **bioware** (`chummer/biowares/bioware/bonus/skilllinkedattribute/bonus`): 100.0% numeric
  - Examples: 1, 1
- **cyberware** (`chummer/cyberwares/cyberware/wirelessbonus/specificskill/bonus`): 100.0% numeric
  - Examples: 1, 2
- **cyberware** (`chummer/cyberwares/cyberware/wirelessbonus/skillcategory/bonus`): 100.0% numeric
  - Examples: 1
- **cyberware** (`chummer/cyberwares/cyberware/pairbonus/specificskill/bonus`): 100.0% numeric
  - Examples: 1, 1, 1
- **cyberware** (`chummer/cyberwares/cyberware/bonus/skilllinkedattribute/bonus`): 100.0% numeric
  - Examples: 1, 1
- **drugcomponents** (`chummer/drugs/drug/bonus/specificskill/bonus`): 100.0% numeric
  - Examples: 2, 1
- **mentors** (`chummer/mentors/mentor/choices/choice/bonus/specificskill/bonus`): 100.0% numeric
  - Examples: 2, 2, 2
- **mentors** (`chummer/mentors/mentor/bonus/specificskill/bonus`): 100.0% numeric
  - Examples: 2, 2, 2
- **mentors** (`chummer/mentors/mentor/bonus/skillcategory/bonus`): 100.0% numeric
  - Examples: 2, 2, 2
- **mentors** (`chummer/mentors/mentor/bonus/skillgroup/bonus`): 100.0% numeric
  - Examples: 2
- **paragons** (`chummer/mentors/mentor/bonus/specificskill/bonus`): 100.0% numeric
  - Examples: 1, 1, 1
- **powers** (`chummer/powers/power/bonus/weaponcategorydv/bonus`): 100.0% numeric
  - Examples: 1
- **qualities** (`chummer/qualities/quality/bonus/specificskill/bonus`): 100.0% numeric
  - Examples: 2, 2, 2
- **qualities** (`chummer/qualities/quality/bonus/skillgroup/bonus`): 100.0% numeric
  - Examples: 1, 1, 2
- **qualities** (`chummer/qualities/quality/bonus/weaponcategorydv/bonus`): 100.0% numeric
  - Examples: 1
- **traditions** (`chummer/traditions/tradition/bonus/specificskill/bonus`): 100.0% numeric
  - Examples: 2, 2, 2
- **qualities** (`chummer/qualities/quality/bonus/skillcategory/bonus`): 92.0% numeric
  - Examples: 2, -3, 1

### bp
- **vessels** (`chummer/metatypes/metatype/bp`): 100.0% numeric
  - Examples: 0, 0, 0

### buildpoints
- **settings** (`chummer/settings/setting/buildpoints`): 100.0% numeric
  - Examples: 25, 13, 35

### capacity
- **bioware** (`chummer/biowares/bioware/capacity`): 100.0% numeric
  - Examples: 0, 0, 0
- **vehicles** (`chummer/mods/mod/capacity`): 100.0% numeric
  - Examples: 15, 15, 15

### careerkarma
- **tips** (`chummer/tips/tip/required/allof/careerkarma`): 100.0% numeric
  - Examples: 100, 100

### cfp
- **priorities** (`chummer/priorities/priority/talents/talent/cfp`): 100.0% numeric
  - Examples: 7, 4, 3

### chaaug
- **metatypes** (`chummer/metatypes/metatype/chaaug`): 100.0% numeric
  - Examples: 10, 12, 10
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/chaaug`): 100.0% numeric
  - Examples: 10, 12, 11
- **vessels** (`chummer/metatypes/metatype/chaaug`): 100.0% numeric
  - Examples: 0, 0, 0

### chamax
- **metatypes** (`chummer/metatypes/metatype/chamax`): 100.0% numeric
  - Examples: 6, 8, 6
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/chamax`): 100.0% numeric
  - Examples: 6, 8, 7
- **vessels** (`chummer/metatypes/metatype/chamax`): 100.0% numeric
  - Examples: 0, 0, 0

### chamin
- **metatypes** (`chummer/metatypes/metatype/chamin`): 100.0% numeric
  - Examples: 1, 3, 1
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/chamin`): 100.0% numeric
  - Examples: 1, 3, 2
- **vessels** (`chummer/metatypes/metatype/chamin`): 100.0% numeric
  - Examples: 0, 0, 0

### chargenlimit
- **qualities** (`chummer/qualities/quality/chargenlimit`): 100.0% numeric
  - Examples: 1

### coldarmor
- **bioware** (`chummer/biowares/bioware/bonus/coldarmor`): 100.0% numeric
  - Examples: 2, 2
- **qualities** (`chummer/qualities/quality/bonus/coldarmor`): 100.0% numeric
  - Examples: 4, 2

### comforts
- **lifestyles** (`chummer/qualities/quality/comforts`): 100.0% numeric
  - Examples: 1

### comfortsmaximum
- **lifestyles** (`chummer/qualities/quality/comfortsmaximum`): 100.0% numeric
  - Examples: -1

### comfortsminimum
- **lifestyles** (`chummer/qualities/quality/comfortsminimum`): 100.0% numeric
  - Examples: 1

### composure
- **bioware** (`chummer/biowares/bioware/bonus/composure`): 100.0% numeric
  - Examples: 1
- **mentors** (`chummer/mentors/mentor/bonus/composure`): 100.0% numeric
  - Examples: 2

### conceal
- **weapons** (`chummer/weapons/weapon/conceal`): 100.0% numeric
  - Examples: 10, 10, 10
- **weapons** (`chummer/weapons/weapon/required/weapondetails/conceal`): 100.0% numeric
  - Examples: 0, 0, 0
- **weapons** (`chummer/accessories/accessory/required/weapondetails/OR/conceal`): 100.0% numeric
  - Examples: 0, -2, 0
- **weapons** (`chummer/accessories/accessory/required/weapondetails/conceal`): 100.0% numeric
  - Examples: 0, 0, 0
- **weapons** (`chummer/accessories/accessory/forbidden/weapondetails/OR/conceal`): 100.0% numeric
  - Examples: 0
- **weapons** (`chummer/accessories/accessory/conceal`): 95.2% numeric
  - Examples: -1, -1, -6

### conditionmonitor
- **vehicles** (`chummer/mods/mod/conditionmonitor`): 100.0% numeric
  - Examples: 1, 1, 1

### connection
- **lifemodules** (`chummer/modules/module/bonus/addcontact/connection`): 100.0% numeric
  - Examples: 4, 4, 4
- **qualities** (`chummer/qualities/quality/bonus/addcontact/connection`): 100.0% numeric
  - Examples: 5

### contactkarma
- **qualities** (`chummer/qualities/quality/bonus/contactkarma`): 100.0% numeric
  - Examples: -2, -1

### contactkarmaminimum
- **qualities** (`chummer/qualities/quality/bonus/contactkarmaminimum`): 100.0% numeric
  - Examples: -1

### cosmeticmodslots
- **vehicles** (`chummer/vehicles/vehicle/cosmeticmodslots`): 100.0% numeric
  - Examples: -3

### cost
- **bioware** (`chummer/grades/grade/cost`): 100.0% numeric
  - Examples: 1, 1, 1
- **cyberware** (`chummer/grades/grade/cost`): 100.0% numeric
  - Examples: 1, 1, 1
- **drugcomponents** (`chummer/grades/grade/cost`): 100.0% numeric
  - Examples: 1, 0.5, 2
- **drugcomponents** (`chummer/drugs/drug/cost`): 100.0% numeric
  - Examples: 15, 10, 400
- **drugcomponents** (`chummer/drugcomponents/drugcomponent/cost`): 100.0% numeric
  - Examples: 75, 75, 75
- **lifestyles** (`chummer/lifestyles/lifestyle/cost`): 100.0% numeric
  - Examples: 1, 0, 500
- **martialarts** (`chummer/martialarts/martialart/cost`): 100.0% numeric
  - Examples: 15
- **vehicles** (`chummer/weaponmounts/weaponmount/cost`): 100.0% numeric
  - Examples: 0, 2500, 5000
- **vehicles** (`chummer/vehicles/vehicle/cost`): 99.7% numeric
  - Examples: 3000, 12000, 4500
- **weapons** (`chummer/weapons/weapon/cost`): 99.5% numeric
  - Examples: 26000, 24500, 23000
- **armor** (`chummer/armors/armor/cost`): 97.0% numeric
  - Examples: Variable(20-100000), 1500, 450
- **lifestyles** (`chummer/qualities/quality/cost`): 95.9% numeric
  - Examples: 1000, 100, 200
- **weapons** (`chummer/accessories/accessory/cost`): 93.4% numeric
  - Examples: 750, 0, 600

### costfor
- **gear** (`chummer/gears/gear/costfor`): 100.0% numeric
  - Examples: 1, 1, 1

### costforarea
- **lifestyles** (`chummer/lifestyles/lifestyle/costforarea`): 100.0% numeric
  - Examples: 50

### costforcomforts
- **lifestyles** (`chummer/lifestyles/lifestyle/costforcomforts`): 100.0% numeric
  - Examples: 50

### costforsecurity
- **lifestyles** (`chummer/lifestyles/lifestyle/costforsecurity`): 100.0% numeric
  - Examples: 50

### count
- **qualities** (`chummer/qualities/quality/required/allof/spellcategory/count`): 100.0% numeric
  - Examples: 4, 4, 4
- **qualities** (`chummer/qualities/quality/required/oneof/spelldescriptor/count`): 100.0% numeric
  - Examples: 5
- **traditions** (`chummer/traditions/tradition/required/spellcategory/count`): 100.0% numeric
  - Examples: 2

### crashdamage
- **drugcomponents** (`chummer/drugcomponents/drugcomponent/effects/effect/crashdamage`): 100.0% numeric
  - Examples: 2, 2, 2

### cyberlimbattributebonuscap
- **settings** (`chummer/settings/setting/cyberlimbattributebonuscap`): 100.0% numeric
  - Examples: 4, 4, 4

### cyberwareessmultiplier
- **qualities** (`chummer/qualities/quality/bonus/cyberwareessmultiplier`): 100.0% numeric
  - Examples: 90, 120

### cyberwaretotalessmultiplier
- **critterpowers** (`chummer/powers/power/bonus/cyberwaretotalessmultiplier`): 100.0% numeric
  - Examples: 200
- **qualities** (`chummer/qualities/quality/bonus/cyberwaretotalessmultiplier`): 100.0% numeric
  - Examples: 200

### damage
- **gear** (`chummer/gears/gear/flechetteweaponbonus/damage`): 100.0% numeric
  - Examples: -2
- **weapons** (`chummer/accessories/accessory/damage`): 100.0% numeric
  - Examples: -2, -1, -1
- **gear** (`chummer/gears/gear/weaponbonus/damage`): 96.2% numeric
  - Examples: 1, -4, -1

### damageresistance
- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/bonus/damageresistance`): 100.0% numeric
  - Examples: 2, 2, 2
- **cyberware** (`chummer/cyberwares/cyberware/bonus/damageresistance`): 100.0% numeric
  - Examples: 2, 1, 3
- **mentors** (`chummer/mentors/mentor/bonus/damageresistance`): 100.0% numeric
  - Examples: 2, 1
- **qualities** (`chummer/qualities/quality/bonus/damageresistance`): 100.0% numeric
  - Examples: 1, 2, 4

### dataprocessing
- **echoes** (`chummer/echoes/echo/bonus/livingpersona/dataprocessing`): 100.0% numeric
  - Examples: 1
- **gear** (`chummer/gears/gear/required/geardetails/OR/dataprocessing`): 100.0% numeric
  - Examples: 0, 0
- **gear** (`chummer/gears/gear/required/geardetails/OR/AND/dataprocessing`): 100.0% numeric
  - Examples: 0, 0, 0
- **qualities** (`chummer/qualities/quality/bonus/livingpersona/dataprocessing`): 100.0% numeric
  - Examples: 2, -1
- **gear** (`chummer/gears/gear/dataprocessing`): 98.0% numeric
  - Examples: {LOG}, Rating, 1

### decreaseagiresist
- **bioware** (`chummer/biowares/bioware/bonus/decreaseagiresist`): 100.0% numeric
  - Examples: 1

### decreasebodresist
- **bioware** (`chummer/biowares/bioware/bonus/decreasebodresist`): 100.0% numeric
  - Examples: 1

### decreasecharesist
- **bioware** (`chummer/biowares/bioware/bonus/decreasecharesist`): 100.0% numeric
  - Examples: 1

### decreaseintresist
- **bioware** (`chummer/biowares/bioware/bonus/decreaseintresist`): 100.0% numeric
  - Examples: 1

### decreaselogresist
- **bioware** (`chummer/biowares/bioware/bonus/decreaselogresist`): 100.0% numeric
  - Examples: 1

### decreaserearesist
- **bioware** (`chummer/biowares/bioware/bonus/decreaserearesist`): 100.0% numeric
  - Examples: 1

### decreasestrresist
- **bioware** (`chummer/biowares/bioware/bonus/decreasestrresist`): 100.0% numeric
  - Examples: 1

### decreasewilresist
- **bioware** (`chummer/biowares/bioware/bonus/decreasewilresist`): 100.0% numeric
  - Examples: 1

### defensetest
- **qualities** (`chummer/qualities/quality/bonus/defensetest`): 100.0% numeric
  - Examples: -1

### dep
- **traditions** (`chummer/spirits/spirit/dep`): 100.0% numeric
  - Examples: 0, 0, 0

### depaug
- **critters** (`chummer/metatypes/metatype/depaug`): 100.0% numeric
  - Examples: 0, 0, 0
- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/depaug`): 100.0% numeric
  - Examples: 0, 0, 0
- **metatypes** (`chummer/metatypes/metatype/depaug`): 100.0% numeric
  - Examples: 0, 0, 0
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/depaug`): 100.0% numeric
  - Examples: 0, 0, 0

### depmax
- **critters** (`chummer/metatypes/metatype/depmax`): 100.0% numeric
  - Examples: 0, 0, 0
- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/depmax`): 100.0% numeric
  - Examples: 0, 0, 0
- **metatypes** (`chummer/metatypes/metatype/depmax`): 100.0% numeric
  - Examples: 0, 0, 0
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/depmax`): 100.0% numeric
  - Examples: 0, 0, 0

### depmin
- **critters** (`chummer/metatypes/metatype/depmin`): 100.0% numeric
  - Examples: 0, 0, 0
- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/depmin`): 100.0% numeric
  - Examples: 0, 0, 0
- **metatypes** (`chummer/metatypes/metatype/depmin`): 100.0% numeric
  - Examples: 0, 0, 0
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/depmin`): 100.0% numeric
  - Examples: 0, 0, 0

### depth
- **priorities** (`chummer/priorities/priority/talents/talent/depth`): 100.0% numeric
  - Examples: 6, 4, 3

### detectionspellresist
- **bioware** (`chummer/biowares/bioware/bonus/detectionspellresist`): 100.0% numeric
  - Examples: 1

### devicerating
- **bioware** (`chummer/grades/grade/devicerating`): 100.0% numeric
  - Examples: 0, 0, 0
- **cyberware** (`chummer/grades/grade/devicerating`): 100.0% numeric
  - Examples: 2, 2, 2
- **vehicles** (`chummer/mods/mod/bonus/devicerating`): 100.0% numeric
  - Examples: 1
- **gear** (`chummer/gears/gear/devicerating`): 94.7% numeric
  - Examples: {RES}, Rating, 1

### dice
- **lifestyles** (`chummer/lifestyles/lifestyle/dice`): 100.0% numeric
  - Examples: 1, 1, 2

### dicepenaltysustaining
- **settings** (`chummer/settings/setting/dicepenaltysustaining`): 100.0% numeric
  - Examples: 2, 2, 2

### directmanaspellresist
- **bioware** (`chummer/biowares/bioware/bonus/directmanaspellresist`): 100.0% numeric
  - Examples: 1

### dodge
- **bioware** (`chummer/biowares/bioware/bonus/dodge`): 100.0% numeric
  - Examples: 2, 1

### drainresist
- **bioware** (`chummer/biowares/bioware/bonus/drainresist`): 100.0% numeric
  - Examples: 1
- **traditions** (`chummer/traditions/tradition/bonus/drainresist`): 100.0% numeric
  - Examples: -2

### drainvalue
- **metamagic** (`chummer/metamagics/metamagic/bonus/drainvalue`): 100.0% numeric
  - Examples: -1
- **qualities** (`chummer/qualities/quality/bonus/drainvalue`): 100.0% numeric
  - Examples: -1

### dronearmorflatnumber
- **settings** (`chummer/settings/setting/dronearmorflatnumber`): 100.0% numeric
  - Examples: 2, 2, 2

### duration
- **drugcomponents** (`chummer/drugcomponents/drugcomponent/effects/effect/duration`): 100.0% numeric
  - Examples: 1
- **options** (`chummer/availmap/avail/duration`): 100.0% numeric
  - Examples: 6, 1, 2

### edgaug
- **metatypes** (`chummer/metatypes/metatype/edgaug`): 100.0% numeric
  - Examples: 7, 6, 6
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/edgaug`): 100.0% numeric
  - Examples: 7, 6, 6
- **vessels** (`chummer/metatypes/metatype/edgaug`): 100.0% numeric
  - Examples: 0, 0, 0

### edgecost
- **actions** (`chummer/actions/action/edgecost`): 100.0% numeric
  - Examples: 1, 1

### edgmax
- **metatypes** (`chummer/metatypes/metatype/edgmax`): 100.0% numeric
  - Examples: 7, 6, 6
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/edgmax`): 100.0% numeric
  - Examples: 7, 6, 6
- **vessels** (`chummer/metatypes/metatype/edgmax`): 100.0% numeric
  - Examples: 0, 0, 0

### edgmin
- **metatypes** (`chummer/metatypes/metatype/edgmin`): 100.0% numeric
  - Examples: 2, 1, 1
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/edgmin`): 100.0% numeric
  - Examples: 2, 1, 1
- **vessels** (`chummer/metatypes/metatype/edgmin`): 100.0% numeric
  - Examples: 0, 0, 0

### electricityarmor
- **bioware** (`chummer/biowares/bioware/bonus/electricityarmor`): 100.0% numeric
  - Examples: 2, -2, 1

### electromagneticmodslots
- **vehicles** (`chummer/vehicles/vehicle/electromagneticmodslots`): 100.0% numeric
  - Examples: -7

### ess
- **bioware** (`chummer/grades/grade/ess`): 100.0% numeric
  - Examples: 1, 1, 0.8
- **cyberware** (`chummer/grades/grade/ess`): 100.0% numeric
  - Examples: 1, 1, 0.8
- **powers** (`chummer/powers/power/required/oneof/ess`): 100.0% numeric
  - Examples: 6
- **qualities** (`chummer/qualities/quality/required/allof/ess`): 100.0% numeric
  - Examples: -5, -5.0001
- **qualities** (`chummer/qualities/quality/required/oneof/ess`): 100.0% numeric
  - Examples: 1, 0.0001, 0.0001
- **tips** (`chummer/tips/tip/required/allof/ess`): 100.0% numeric
  - Examples: -1
- **cyberware** (`chummer/cyberwares/cyberware/ess`): 91.2% numeric
  - Examples: Rating * 0.01, Rating * -0.01, 0.2

### essaug
- **metatypes** (`chummer/metatypes/metatype/essaug`): 100.0% numeric
  - Examples: 6, 6, 6
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/essaug`): 100.0% numeric
  - Examples: 6, 6, 6
- **vessels** (`chummer/metatypes/metatype/essaug`): 100.0% numeric
  - Examples: 0, 0, 0

### essencemax
- **qualities** (`chummer/qualities/quality/bonus/essencemax`): 100.0% numeric
  - Examples: -1

### essencepenalty
- **qualities** (`chummer/qualities/quality/bonus/essencepenalty`): 100.0% numeric
  - Examples: -1, -1, -1

### essencepenaltymagonlyt100
- **qualities** (`chummer/qualities/quality/bonus/essencepenaltymagonlyt100`): 100.0% numeric
  - Examples: 100, 100, 100

### essencepenaltyt100
- **qualities** (`chummer/qualities/quality/bonus/essencepenaltyt100`): 100.0% numeric
  - Examples: -100, -100, -100

### essmax
- **metatypes** (`chummer/metatypes/metatype/essmax`): 100.0% numeric
  - Examples: 6, 6, 6
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/essmax`): 100.0% numeric
  - Examples: 6, 6, 6
- **vessels** (`chummer/metatypes/metatype/essmax`): 100.0% numeric
  - Examples: 0, 0, 0

### essmin
- **metatypes** (`chummer/metatypes/metatype/essmin`): 100.0% numeric
  - Examples: 0, 0, 0
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/essmin`): 100.0% numeric
  - Examples: 0, 0, 0
- **vessels** (`chummer/metatypes/metatype/essmin`): 100.0% numeric
  - Examples: 0, 0, 0

### extrapointcost
- **powers** (`chummer/powers/power/extrapointcost`): 100.0% numeric
  - Examples: 0.5

### extreme
- **ranges** (`chummer/modifiers/extreme`): 100.0% numeric
  - Examples: -6

### fadingresist
- **bioware** (`chummer/biowares/bioware/bonus/fadingresist`): 100.0% numeric
  - Examples: 1
- **qualities** (`chummer/qualities/quality/bonus/fadingresist`): 100.0% numeric
  - Examples: 2

### fadingvalue
- **qualities** (`chummer/qualities/quality/bonus/fadingvalue`): 100.0% numeric
  - Examples: -2, -2, -2

### fatigueresist
- **armor** (`chummer/armors/armor/bonus/fatigueresist`): 100.0% numeric
  - Examples: -2
- **qualities** (`chummer/qualities/quality/bonus/fatigueresist`): 100.0% numeric
  - Examples: 1, 1, 1

### firearmor
- **bioware** (`chummer/biowares/bioware/bonus/firearmor`): 100.0% numeric
  - Examples: 2, 2
- **qualities** (`chummer/qualities/quality/bonus/firearmor`): 100.0% numeric
  - Examples: 2

### firewall
- **echoes** (`chummer/echoes/echo/bonus/livingpersona/firewall`): 100.0% numeric
  - Examples: 1
- **gear** (`chummer/gears/gear/required/geardetails/OR/firewall`): 100.0% numeric
  - Examples: 0, 0
- **gear** (`chummer/gears/gear/required/geardetails/OR/AND/firewall`): 100.0% numeric
  - Examples: 0, 0, 0
- **paragons** (`chummer/mentors/mentor/bonus/livingpersona/firewall`): 100.0% numeric
  - Examples: 1
- **qualities** (`chummer/qualities/quality/bonus/livingpersona/firewall`): 100.0% numeric
  - Examples: 2, -1
- **gear** (`chummer/gears/gear/firewall`): 98.0% numeric
  - Examples: {WIL}, Rating, 1

### forbiddencostmultiplier
- **settings** (`chummer/settings/setting/forbiddencostmultiplier`): 100.0% numeric
  - Examples: 1, 1, 1

### forcedloyalty
- **qualities** (`chummer/qualities/quality/bonus/addcontact/forcedloyalty`): 100.0% numeric
  - Examples: 3, 3

### freenegativequalities
- **lifemodules** (`chummer/modules/module/versions/version/bonus/freenegativequalities`): 100.0% numeric
  - Examples: -5, -5, -5
- **lifemodules** (`chummer/modules/module/bonus/freenegativequalities`): 100.0% numeric
  - Examples: -5, -15, -24

### freepositivequalities
- **lifemodules** (`chummer/modules/module/bonus/freepositivequalities`): 100.0% numeric
  - Examples: 1, 9, 10

### gearcapacity
- **armor** (`chummer/mods/mod/gearcapacity`): 100.0% numeric
  - Examples: 6, 6, 1

### genetechcostmultiplier
- **critters** (`chummer/metatypes/metatype/bonus/genetechcostmultiplier`): 100.0% numeric
  - Examples: 80, 80, 80

### genetechessmultiplier
- **critters** (`chummer/metatypes/metatype/bonus/genetechessmultiplier`): 100.0% numeric
  - Examples: 90, 90, 90

### handling
- **vehicles** (`chummer/vehicles/vehicle/handling`): 100.0% numeric
  - Examples: 4/3, 3/1, 5/2

### iniaug
- **metatypes** (`chummer/metatypes/metatype/iniaug`): 100.0% numeric
  - Examples: 20, 20, 19
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/iniaug`): 100.0% numeric
  - Examples: 20, 20, 20
- **vessels** (`chummer/metatypes/metatype/iniaug`): 100.0% numeric
  - Examples: 0, 0, 0

### inimax
- **metatypes** (`chummer/metatypes/metatype/inimax`): 100.0% numeric
  - Examples: 12, 12, 11
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/inimax`): 100.0% numeric
  - Examples: 12, 12, 12
- **vessels** (`chummer/metatypes/metatype/inimax`): 100.0% numeric
  - Examples: 0, 0, 0

### inimin
- **metatypes** (`chummer/metatypes/metatype/inimin`): 100.0% numeric
  - Examples: 2, 2, 2
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/inimin`): 100.0% numeric
  - Examples: 2, 2, 2
- **vessels** (`chummer/metatypes/metatype/inimin`): 100.0% numeric
  - Examples: 0, 0, 0

### initiategrade
- **metamagic** (`chummer/metamagics/metamagic/required/oneof/group/initiategrade`): 100.0% numeric
  - Examples: 3
- **qualities** (`chummer/qualities/quality/required/allof/initiategrade`): 100.0% numeric
  - Examples: 1
- **spells** (`chummer/spells/spell/required/oneof/group/initiategrade`): 100.0% numeric
  - Examples: 2
- **tips** (`chummer/tips/tip/forbidden/allof/initiategrade`): 100.0% numeric
  - Examples: 1

### initiative
- **bioware** (`chummer/biowares/bioware/bonus/initiative`): 100.0% numeric
  - Examples: 1, 1
- **paragons** (`chummer/mentors/mentor/bonus/initiative`): 100.0% numeric
  - Examples: -2
- **qualities** (`chummer/qualities/quality/bonus/initiative`): 100.0% numeric
  - Examples: 1, 1, 1

### initiativecost
- **actions** (`chummer/actions/action/initiativecost`): 100.0% numeric
  - Examples: 5, 5, 5

### initiativedice
- **critterpowers** (`chummer/powers/power/bonus/initiativedice`): 100.0% numeric
  - Examples: 1
- **drugcomponents** (`chummer/drugs/drug/bonus/initiativedice`): 100.0% numeric
  - Examples: 1, 1, 2
- **drugcomponents** (`chummer/drugcomponents/drugcomponent/effects/effect/initiativedice`): 100.0% numeric
  - Examples: 1, 2, 3
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/initiativedice`): 100.0% numeric
  - Examples: 1, 1, 1

### initiativepass
- **critters** (`chummer/metatypes/metatype/bonus/initiativepass`): 100.0% numeric
  - Examples: 1, 1, 2
- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/bonus/initiativepass`): 100.0% numeric
  - Examples: 1, 1, 1
- **echoes** (`chummer/echoes/echo/bonus/initiativepass`): 100.0% numeric
  - Examples: 1
- **qualities** (`chummer/qualities/quality/bonus/initiativepass`): 100.0% numeric
  - Examples: 1, 1, 1
- **traditions** (`chummer/spirits/spirit/bonus/initiativepass`): 100.0% numeric
  - Examples: 1, 1

### intaug
- **metatypes** (`chummer/metatypes/metatype/intaug`): 100.0% numeric
  - Examples: 10, 10, 10
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/intaug`): 100.0% numeric
  - Examples: 10, 10, 10
- **vessels** (`chummer/metatypes/metatype/intaug`): 100.0% numeric
  - Examples: 0, 0, 0

### intmax
- **metatypes** (`chummer/metatypes/metatype/intmax`): 100.0% numeric
  - Examples: 6, 6, 6
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/intmax`): 100.0% numeric
  - Examples: 6, 6, 6
- **vessels** (`chummer/metatypes/metatype/intmax`): 100.0% numeric
  - Examples: 0, 0, 0

### intmin
- **metatypes** (`chummer/metatypes/metatype/intmin`): 100.0% numeric
  - Examples: 1, 1, 1
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/intmin`): 100.0% numeric
  - Examples: 1, 1, 1
- **vessels** (`chummer/metatypes/metatype/intmin`): 100.0% numeric
  - Examples: 0, 0, 0

### judgeintentions
- **mentors** (`chummer/mentors/mentor/choices/choice/bonus/judgeintentions`): 100.0% numeric
  - Examples: 2
- **mentors** (`chummer/mentors/mentor/bonus/judgeintentions`): 100.0% numeric
  - Examples: 2

### judgeintentionsdefense
- **bioware** (`chummer/biowares/bioware/bonus/judgeintentionsdefense`): 100.0% numeric
  - Examples: 1
- **qualities** (`chummer/qualities/quality/bonus/judgeintentionsdefense`): 100.0% numeric
  - Examples: 2

### karma
- **critterpowers** (`chummer/powers/power/karma`): 100.0% numeric
  - Examples: 9, 9, 50
- **critters** (`chummer/metatypes/metatype/karma`): 100.0% numeric
  - Examples: 0, 0, 0
- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/karma`): 100.0% numeric
  - Examples: 0, 0, 0
- **lifemodules** (`chummer/modules/module/karma`): 100.0% numeric
  - Examples: 15, 15, 15
- **metatypes** (`chummer/metatypes/metatype/karma`): 100.0% numeric
  - Examples: 0, 40, 50
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/karma`): 100.0% numeric
  - Examples: 40, 90, 60
- **priorities** (`chummer/priorities/priority/metatypes/metatype/karma`): 100.0% numeric
  - Examples: 0, 0, 0
- **priorities** (`chummer/priorities/priority/metatypes/metatype/metavariants/metavariant/karma`): 100.0% numeric
  - Examples: 0, 0, 0
- **qualities** (`chummer/qualities/quality/karma`): 100.0% numeric
  - Examples: 4, 5, 14

### karmaalchemicalfocus
- **settings** (`chummer/settings/setting/karmacost/karmaalchemicalfocus`): 100.0% numeric
  - Examples: 3, 3, 3

### karmaattribute
- **settings** (`chummer/settings/setting/karmacost/karmaattribute`): 100.0% numeric
  - Examples: 5, 5, 5

### karmabanishingfocus
- **settings** (`chummer/settings/setting/karmacost/karmabanishingfocus`): 100.0% numeric
  - Examples: 2, 2, 2

### karmabindingfocus
- **settings** (`chummer/settings/setting/karmacost/karmabindingfocus`): 100.0% numeric
  - Examples: 2, 2, 2

### karmacarryover
- **settings** (`chummer/settings/setting/karmacost/karmacarryover`): 100.0% numeric
  - Examples: 7, 7, 7

### karmacenteringfocus
- **settings** (`chummer/settings/setting/karmacost/karmacenteringfocus`): 100.0% numeric
  - Examples: 3, 3, 3

### karmacomplexformoption
- **settings** (`chummer/settings/setting/karmacost/karmacomplexformoption`): 100.0% numeric
  - Examples: 2, 2, 2

### karmacomplexformskillsoft
- **settings** (`chummer/settings/setting/karmacost/karmacomplexformskillsoft`): 100.0% numeric
  - Examples: 1, 1, 1

### karmacontact
- **settings** (`chummer/settings/setting/karmacost/karmacontact`): 100.0% numeric
  - Examples: 1, 1, 1

### karmacounterspellingfocus
- **settings** (`chummer/settings/setting/karmacost/karmacounterspellingfocus`): 100.0% numeric
  - Examples: 2, 2, 2

### karmadisenchantingfocus
- **settings** (`chummer/settings/setting/karmacost/karmadisenchantingfocus`): 100.0% numeric
  - Examples: 3, 3, 3

### karmaenemy
- **settings** (`chummer/settings/setting/karmacost/karmaenemy`): 100.0% numeric
  - Examples: 1, 1, 1

### karmaenhancement
- **settings** (`chummer/settings/setting/karmacost/karmaenhancement`): 100.0% numeric
  - Examples: 2, 2, 2

### karmaflexiblesignaturefocus
- **settings** (`chummer/settings/setting/karmacost/karmaflexiblesignaturefocus`): 100.0% numeric
  - Examples: 3, 3, 3

### karmaimproveactiveskill
- **settings** (`chummer/settings/setting/karmacost/karmaimproveactiveskill`): 100.0% numeric
  - Examples: 2, 2, 2

### karmaimprovecomplexform
- **settings** (`chummer/settings/setting/karmacost/karmaimprovecomplexform`): 100.0% numeric
  - Examples: 1, 1, 1

### karmaimproveknowledgeskill
- **settings** (`chummer/settings/setting/karmacost/karmaimproveknowledgeskill`): 100.0% numeric
  - Examples: 1, 1, 1

### karmaimproveskillgroup
- **settings** (`chummer/settings/setting/karmacost/karmaimproveskillgroup`): 100.0% numeric
  - Examples: 5, 5, 5

### karmainitiation
- **settings** (`chummer/settings/setting/karmacost/karmainitiation`): 100.0% numeric
  - Examples: 3, 3, 3

### karmainitiationflat
- **settings** (`chummer/settings/setting/karmacost/karmainitiationflat`): 100.0% numeric
  - Examples: 10, 10, 10

### karmajoingroup
- **settings** (`chummer/settings/setting/karmacost/karmajoingroup`): 100.0% numeric
  - Examples: 5, 5, 5

### karmaknospecialization
- **settings** (`chummer/settings/setting/karmacost/karmaknospecialization`): 100.0% numeric
  - Examples: 7, 7, 7

### karmaleavegroup
- **settings** (`chummer/settings/setting/karmacost/karmaleavegroup`): 100.0% numeric
  - Examples: 1, 1, 1

### karmamaneuver
- **settings** (`chummer/settings/setting/karmacost/karmamaneuver`): 100.0% numeric
  - Examples: 5, 5, 5

### karmamaskingfocus
- **settings** (`chummer/settings/setting/karmacost/karmamaskingfocus`): 100.0% numeric
  - Examples: 3, 3, 3

### karmametamagic
- **settings** (`chummer/settings/setting/karmacost/karmametamagic`): 100.0% numeric
  - Examples: 15, 15, 15

### karmamysadpp
- **settings** (`chummer/settings/setting/karmacost/karmamysadpp`): 100.0% numeric
  - Examples: 5, 5, 5

### karmanewactiveskill
- **settings** (`chummer/settings/setting/karmacost/karmanewactiveskill`): 100.0% numeric
  - Examples: 2, 2, 2

### karmanewaiadvancedprogram
- **settings** (`chummer/settings/setting/karmacost/karmanewaiadvancedprogram`): 100.0% numeric
  - Examples: 8, 8, 8

### karmanewaiprogram
- **settings** (`chummer/settings/setting/karmacost/karmanewaiprogram`): 100.0% numeric
  - Examples: 5, 5, 5

### karmanewcomplexform
- **settings** (`chummer/settings/setting/karmacost/karmanewcomplexform`): 100.0% numeric
  - Examples: 4, 4, 4

### karmanewknowledgeskill
- **settings** (`chummer/settings/setting/karmacost/karmanewknowledgeskill`): 100.0% numeric
  - Examples: 1, 1, 1

### karmanewskillgroup
- **settings** (`chummer/settings/setting/karmacost/karmanewskillgroup`): 100.0% numeric
  - Examples: 5, 5, 5

### karmapowerfocus
- **settings** (`chummer/settings/setting/karmacost/karmapowerfocus`): 100.0% numeric
  - Examples: 6, 6, 6

### karmaqifocus
- **settings** (`chummer/settings/setting/karmacost/karmaqifocus`): 100.0% numeric
  - Examples: 2, 2, 2

### karmaquality
- **settings** (`chummer/settings/setting/karmacost/karmaquality`): 100.0% numeric
  - Examples: 1, 1, 1

### karmaritualspellcastingfocus
- **settings** (`chummer/settings/setting/karmacost/karmaritualspellcastingfocus`): 100.0% numeric
  - Examples: 2, 2, 2

### karmaspecialization
- **settings** (`chummer/settings/setting/karmacost/karmaspecialization`): 100.0% numeric
  - Examples: 7, 7, 7

### karmaspell
- **settings** (`chummer/settings/setting/karmacost/karmaspell`): 100.0% numeric
  - Examples: 5, 5, 5

### karmaspellcastingfocus
- **settings** (`chummer/settings/setting/karmacost/karmaspellcastingfocus`): 100.0% numeric
  - Examples: 2, 2, 2

### karmaspellshapingfocus
- **settings** (`chummer/settings/setting/karmacost/karmaspellshapingfocus`): 100.0% numeric
  - Examples: 3, 3, 3

### karmaspirit
- **settings** (`chummer/settings/setting/karmacost/karmaspirit`): 100.0% numeric
  - Examples: 1, 1, 1

### karmaspiritfettering
- **settings** (`chummer/settings/setting/karmacost/karmaspiritfettering`): 100.0% numeric
  - Examples: 3, 3, 3

### karmasummoningfocus
- **settings** (`chummer/settings/setting/karmacost/karmasummoningfocus`): 100.0% numeric
  - Examples: 2, 2, 2

### karmasustainingfocus
- **settings** (`chummer/settings/setting/karmacost/karmasustainingfocus`): 100.0% numeric
  - Examples: 2, 2, 2

### karmatechnique
- **settings** (`chummer/settings/setting/karmacost/karmatechnique`): 100.0% numeric
  - Examples: 5, 5, 5

### karmaweaponfocus
- **settings** (`chummer/settings/setting/karmacost/karmaweaponfocus`): 100.0% numeric
  - Examples: 3, 3, 3

### level
- **drugcomponents** (`chummer/drugcomponents/drugcomponent/effects/effect/level`): 100.0% numeric
  - Examples: 0, 0, 0

### lifestylecost
- **bioware** (`chummer/biowares/bioware/bonus/lifestylecost`): 100.0% numeric
  - Examples: 25, -10, 10
- **metatypes** (`chummer/metatypes/metatype/bonus/lifestylecost`): 100.0% numeric
  - Examples: 20, 100, 150
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/bonus/lifestylecost`): 100.0% numeric
  - Examples: 20, 20, 20
- **qualities** (`chummer/qualities/quality/bonus/lifestylecost`): 100.0% numeric
  - Examples: 10, 20, 30

### limbcount
- **options** (`chummer/limbcounts/limb/limbcount`): 100.0% numeric
  - Examples: 4, 5, 5
- **settings** (`chummer/settings/setting/limbcount`): 100.0% numeric
  - Examples: 6, 6, 6

### limit
- **drugcomponents** (`chummer/drugcomponents/drugcomponent/limit`): 100.0% numeric
  - Examples: 3, 3
- **lifestyles** (`chummer/comforts/comfort/limit`): 100.0% numeric
  - Examples: 2, 1, 2
- **lifestyles** (`chummer/neighborhoods/neighborhood/limit`): 100.0% numeric
  - Examples: 4, 1, 2
- **lifestyles** (`chummer/securities/security/limit`): 100.0% numeric
  - Examples: 4, 1, 2
- **powers** (`chummer/powers/power/limit`): 100.0% numeric
  - Examples: 1, 1, 4
- **echoes** (`chummer/echoes/echo/limit`): 90.9% numeric
  - Examples: 2, 2, 2

### limitwithinclusions
- **qualities** (`chummer/qualities/quality/limitwithinclusions`): 100.0% numeric
  - Examples: 4, 4

### logaug
- **metatypes** (`chummer/metatypes/metatype/logaug`): 100.0% numeric
  - Examples: 10, 10, 10
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/logaug`): 100.0% numeric
  - Examples: 10, 10, 10
- **vessels** (`chummer/metatypes/metatype/logaug`): 100.0% numeric
  - Examples: 0, 0, 0

### logmax
- **metatypes** (`chummer/metatypes/metatype/logmax`): 100.0% numeric
  - Examples: 6, 6, 6
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/logmax`): 100.0% numeric
  - Examples: 6, 6, 6
- **vessels** (`chummer/metatypes/metatype/logmax`): 100.0% numeric
  - Examples: 0, 0, 0

### logmin
- **metatypes** (`chummer/metatypes/metatype/logmin`): 100.0% numeric
  - Examples: 1, 1, 1
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/logmin`): 100.0% numeric
  - Examples: 1, 1, 1
- **vessels** (`chummer/metatypes/metatype/logmin`): 100.0% numeric
  - Examples: 0, 0, 0

### long
- **ranges** (`chummer/modifiers/long`): 100.0% numeric
  - Examples: -3

### loyalty
- **lifemodules** (`chummer/modules/module/bonus/addcontact/loyalty`): 100.0% numeric
  - Examples: 3, 3, 3
- **qualities** (`chummer/qualities/quality/bonus/addcontact/loyalty`): 100.0% numeric
  - Examples: 1

### lp
- **lifestyles** (`chummer/lifestyles/lifestyle/lp`): 100.0% numeric
  - Examples: 0, 2, 2
- **lifestyles** (`chummer/qualities/quality/lp`): 100.0% numeric
  - Examples: 2, 1, 1

### magaug
- **metatypes** (`chummer/metatypes/metatype/magaug`): 100.0% numeric
  - Examples: 6, 6, 6
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/magaug`): 100.0% numeric
  - Examples: 6, 6, 6
- **vessels** (`chummer/metatypes/metatype/magaug`): 100.0% numeric
  - Examples: 0, 0, 0

### magic
- **priorities** (`chummer/priorities/priority/talents/talent/magic`): 100.0% numeric
  - Examples: 6, 6, 6

### magmax
- **metatypes** (`chummer/metatypes/metatype/magmax`): 100.0% numeric
  - Examples: 6, 6, 6
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/magmax`): 100.0% numeric
  - Examples: 6, 6, 6
- **vessels** (`chummer/metatypes/metatype/magmax`): 100.0% numeric
  - Examples: 0, 0, 0

### magmin
- **metatypes** (`chummer/metatypes/metatype/magmin`): 100.0% numeric
  - Examples: 1, 1, 1
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/magmin`): 100.0% numeric
  - Examples: 1, 1, 1
- **vessels** (`chummer/metatypes/metatype/magmin`): 100.0% numeric
  - Examples: 0, 0, 0

### manaillusionresist
- **bioware** (`chummer/biowares/bioware/bonus/manaillusionresist`): 100.0% numeric
  - Examples: 1

### matrixcmbonus
- **gear** (`chummer/gears/gear/matrixcmbonus`): 100.0% numeric
  - Examples: -3, -2, -2

### matrixinitiative
- **paragons** (`chummer/mentors/mentor/bonus/matrixinitiative`): 100.0% numeric
  - Examples: -2

### matrixinitiativedice
- **gear** (`chummer/gears/gear/bonus/matrixinitiativedice`): 100.0% numeric
  - Examples: 1

### matrixinitiativediceadd
- **echoes** (`chummer/echoes/echo/bonus/matrixinitiativediceadd`): 100.0% numeric
  - Examples: 1

### max
- **cyberware** (`chummer/grades/grade/bonus/specificattribute/max`): 100.0% numeric
  - Examples: -1, -1
- **cyberware** (`chummer/cyberwares/cyberware/bonus/specificattribute/max`): 100.0% numeric
  - Examples: 1
- **qualities** (`chummer/qualities/quality/bonus/selectskill/max`): 100.0% numeric
  - Examples: 1
- **qualities** (`chummer/qualities/quality/bonus/selectattributes/selectattribute/max`): 100.0% numeric
  - Examples: 1, 96
- **qualities** (`chummer/qualities/quality/bonus/specificattribute/max`): 100.0% numeric
  - Examples: 1, -1, -1
- **qualities** (`chummer/qualities/quality/bonus/activeskillkarmacost/max`): 100.0% numeric
  - Examples: 5
- **qualities** (`chummer/qualities/quality/bonus/knowledgeskillkarmacostmin/max`): 100.0% numeric
  - Examples: 5
- **qualities** (`chummer/qualities/quality/bonus/knowledgeskillkarmacost/max`): 100.0% numeric
  - Examples: 5
- **qualities** (`chummer/qualities/quality/bonus/replaceattributes/replaceattribute/max`): 100.0% numeric
  - Examples: 12, 6, 7
- **bioware** (`chummer/biowares/bioware/bonus/specificattribute/max`): 90.0% numeric
  - Examples: Rating, 1, 1

### maxastralinitiativedice
- **settings** (`chummer/settings/setting/maxastralinitiativedice`): 100.0% numeric
  - Examples: 5, 5, 5

### maxcoldsiminitiativedice
- **settings** (`chummer/settings/setting/maxcoldsiminitiativedice`): 100.0% numeric
  - Examples: 5, 5, 5

### maxhotsiminitiativedice
- **settings** (`chummer/settings/setting/maxhotsiminitiativedice`): 100.0% numeric
  - Examples: 5, 5, 5

### maxinitiativedice
- **settings** (`chummer/settings/setting/maxinitiativedice`): 100.0% numeric
  - Examples: 5, 5, 5

### maxlevels
- **powers** (`chummer/powers/power/maxlevels`): 100.0% numeric
  - Examples: 3, 3, 3

### maxrating
- **armor** (`chummer/mods/mod/maxrating`): 100.0% numeric
  - Examples: 1, 1, 1
- **gear** (`chummer/gears/gear/gears/usegear/maxrating`): 100.0% numeric
  - Examples: 1
- **vehicles** (`chummer/vehicles/vehicle/gears/gear/maxrating`): 100.0% numeric
  - Examples: 6, 6, 6
- **weapons** (`chummer/weapons/weapon/maxrating`): 100.0% numeric
  - Examples: 100000, 100000

### medium
- **ranges** (`chummer/modifiers/medium`): 100.0% numeric
  - Examples: -1

### memory
- **mentors** (`chummer/mentors/mentor/bonus/memory`): 100.0% numeric
  - Examples: 2

### mentallimit
- **qualities** (`chummer/qualities/quality/bonus/mentallimit`): 100.0% numeric
  - Examples: 1

### mentalmanipulationresist
- **bioware** (`chummer/biowares/bioware/bonus/mentalmanipulationresist`): 100.0% numeric
  - Examples: 1

### metageniclimit
- **qualities** (`chummer/qualities/quality/bonus/metageniclimit`): 100.0% numeric
  - Examples: 30, 30, 30

### metatypecostskarmamultiplier
- **settings** (`chummer/settings/setting/metatypecostskarmamultiplier`): 100.0% numeric
  - Examples: 1, 1, 1

### min
- **cyberware** (`chummer/cyberwares/cyberware/bonus/knowledgeskillkarmacost/min`): 100.0% numeric
  - Examples: 3, 4, 5
- **mentors** (`chummer/mentors/mentor/bonus/skillcategorykarmacost/min`): 100.0% numeric
  - Examples: 3
- **qualities** (`chummer/qualities/quality/bonus/skillcategorykarmacost/min`): 100.0% numeric
  - Examples: 3, 3, 3
- **qualities** (`chummer/qualities/quality/bonus/activeskillkarmacost/min`): 100.0% numeric
  - Examples: 6
- **qualities** (`chummer/qualities/quality/bonus/knowledgeskillkarmacost/min`): 100.0% numeric
  - Examples: 6
- **qualities** (`chummer/qualities/quality/bonus/specificattribute/min`): 100.0% numeric
  - Examples: 1, 1, 1
- **qualities** (`chummer/qualities/quality/bonus/replaceattributes/replaceattribute/min`): 100.0% numeric
  - Examples: 6, 1, 2
- **ranges** (`chummer/ranges/range/min`): 100.0% numeric
  - Examples: 0, 0, 0

### minastralinitiativedice
- **settings** (`chummer/settings/setting/minastralinitiativedice`): 100.0% numeric
  - Examples: 3, 3, 3

### mincoldsiminitiativedice
- **settings** (`chummer/settings/setting/mincoldsiminitiativedice`): 100.0% numeric
  - Examples: 3, 3, 3

### minhotsiminitiativedice
- **settings** (`chummer/settings/setting/minhotsiminitiativedice`): 100.0% numeric
  - Examples: 4, 4, 4

### minimum
- **lifestyles** (`chummer/comforts/comfort/minimum`): 100.0% numeric
  - Examples: 1, 0, 1
- **lifestyles** (`chummer/neighborhoods/neighborhood/minimum`): 100.0% numeric
  - Examples: 1, 0, 1
- **lifestyles** (`chummer/securities/security/minimum`): 100.0% numeric
  - Examples: 1, 0, 1

### mininitiativedice
- **settings** (`chummer/settings/setting/mininitiativedice`): 100.0% numeric
  - Examples: 1, 1, 1

### minrating
- **gear** (`chummer/gears/gear/minrating`): 100.0% numeric
  - Examples: 5, 3, 6
- **programs** (`chummer/programs/program/minrating`): 100.0% numeric
  - Examples: 3, 2

### modslots
- **vehicles** (`chummer/vehicles/vehicle/modslots`): 100.0% numeric
  - Examples: 0, 0, 1

### months
- **packs** (`chummer/packs/pack/lifestyles/lifestyle/months`): 100.0% numeric
  - Examples: 1, 1

### multiplier
- **lifestyles** (`chummer/lifestyles/lifestyle/multiplier`): 100.0% numeric
  - Examples: 0, 20, 40
- **lifestyles** (`chummer/qualities/quality/multiplier`): 100.0% numeric
  - Examples: -10, -20, 10

### multiplierbaseonly
- **lifestyles** (`chummer/qualities/quality/multiplierbaseonly`): 100.0% numeric
  - Examples: 20

### nativelanguagelimit
- **qualities** (`chummer/qualities/quality/bonus/nativelanguagelimit`): 100.0% numeric
  - Examples: 1

### newspellkarmacost
- **qualities** (`chummer/qualities/quality/bonus/newspellkarmacost`): 100.0% numeric
  - Examples: -1

### notoriety
- **qualities** (`chummer/qualities/quality/bonus/notoriety`): 100.0% numeric
  - Examples: -1, -1, -1
- **qualities** (`chummer/qualities/quality/firstlevelbonus/notoriety`): 100.0% numeric
  - Examples: 1

### nuyen
- **tips** (`chummer/tips/tip/forbidden/allof/nuyen`): 100.0% numeric
  - Examples: 500000, 1000000
- **tips** (`chummer/tips/tip/required/allof/nuyen`): 100.0% numeric
  - Examples: 200000, 500000, 100000000

### nuyenamt
- **lifemodules** (`chummer/modules/module/bonus/nuyenamt`): 100.0% numeric
  - Examples: 32000, 16000, 15000
- **qualities** (`chummer/qualities/quality/bonus/nuyenamt`): 100.0% numeric
  - Examples: 5000, 10000

### nuyenbp
- **packs** (`chummer/packs/pack/nuyenbp`): 100.0% numeric
  - Examples: 2, 5, 10

### nuyenmaxbp
- **qualities** (`chummer/qualities/quality/bonus/nuyenmaxbp`): 100.0% numeric
  - Examples: 30, -1, -1
- **settings** (`chummer/settings/setting/nuyenmaxbp`): 100.0% numeric
  - Examples: 10, 5, 25

### nuyenperbpwftm
- **settings** (`chummer/settings/setting/nuyenperbpwftm`): 100.0% numeric
  - Examples: 2000, 2000, 2000

### nuyenperbpwftp
- **settings** (`chummer/settings/setting/nuyenperbpwftp`): 100.0% numeric
  - Examples: 2000, 2000, 2000

### order
- **settings** (`chummer/settings/setting/customdatadirectorynames/customdatadirectoryname/order`): 100.0% numeric
  - Examples: 0, 0, 0

### overflow
- **qualities** (`chummer/qualities/quality/bonus/conditionmonitor/overflow`): 100.0% numeric
  - Examples: 1

### page
- **actions** (`chummer/actions/action/page`): 100.0% numeric
  - Examples: 168, 186, 179
- **armor** (`chummer/armors/armor/page`): 100.0% numeric
  - Examples: 437, 437, 437
- **armor** (`chummer/mods/mod/page`): 100.0% numeric
  - Examples: 437, 437, 437
- **bioware** (`chummer/grades/grade/page`): 100.0% numeric
  - Examples: 1, 451, 177
- **bioware** (`chummer/biowares/bioware/page`): 100.0% numeric
  - Examples: 459, 459, 459
- **books** (`chummer/books/book/matches/match/page`): 100.0% numeric
  - Examples: 2, 2, 3
- **complexforms** (`chummer/complexforms/complexform/page`): 100.0% numeric
  - Examples: 252, 252, 252
- **critterpowers** (`chummer/powers/power/page`): 100.0% numeric
  - Examples: 130, 133, 137
- **critterpowers** (`chummer/powers/power/bonus/naturalweapon/page`): 100.0% numeric
  - Examples: 163, 171, 172
- **critters** (`chummer/metatypes/metatype/page`): 100.0% numeric
  - Examples: 402, 402, 403
- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/page`): 100.0% numeric
  - Examples: 95, 95, 95
- **cyberware** (`chummer/grades/grade/page`): 100.0% numeric
  - Examples: 1, 451, 177
- **cyberware** (`chummer/cyberwares/cyberware/page`): 100.0% numeric
  - Examples: 0, 0, 451
- **drugcomponents** (`chummer/drugs/drug/page`): 100.0% numeric
  - Examples: 411, 411, 411
- **drugcomponents** (`chummer/drugcomponents/drugcomponent/page`): 100.0% numeric
  - Examples: 190, 190, 190
- **echoes** (`chummer/echoes/echo/page`): 100.0% numeric
  - Examples: 258, 258, 258
- **gear** (`chummer/gears/gear/page`): 100.0% numeric
  - Examples: 183, 187, 187
- **lifemodules** (`chummer/modules/module/page`): 100.0% numeric
  - Examples: 66, 66, 67
- **lifemodules** (`chummer/modules/module/versions/version/page`): 100.0% numeric
  - Examples: 163, 163, 163
- **lifestyles** (`chummer/lifestyles/lifestyle/page`): 100.0% numeric
  - Examples: 1, 369, 369
- **lifestyles** (`chummer/qualities/quality/page`): 100.0% numeric
  - Examples: 220, 220, 220
- **martialarts** (`chummer/martialarts/martialart/page`): 100.0% numeric
  - Examples: 128, 128, 128
- **martialarts** (`chummer/techniques/technique/page`): 100.0% numeric
  - Examples: 119, 135, 135
- **mentors** (`chummer/mentors/mentor/page`): 100.0% numeric
  - Examples: 321, 321, 321
- **metamagic** (`chummer/metamagics/metamagic/page`): 100.0% numeric
  - Examples: 325, 325, 325
- **metamagic** (`chummer/arts/art/page`): 100.0% numeric
  - Examples: 143, 143, 144
- **metatypes** (`chummer/metatypes/metatype/page`): 100.0% numeric
  - Examples: 50, 50, 50
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/page`): 100.0% numeric
  - Examples: 104, 104, 104
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/bonus/naturalweapon/page`): 100.0% numeric
  - Examples: 104, 104, 104
- **paragons** (`chummer/mentors/mentor/page`): 100.0% numeric
  - Examples: 103, 103, 177
- **powers** (`chummer/powers/power/page`): 100.0% numeric
  - Examples: 309, 309, 309
- **powers** (`chummer/enhancements/enhancement/page`): 100.0% numeric
  - Examples: 156, 156, 157
- **programs** (`chummer/programs/program/page`): 100.0% numeric
  - Examples: 245, 245, 245
- **qualities** (`chummer/qualities/quality/page`): 100.0% numeric
  - Examples: 71, 72, 72
- **qualities** (`chummer/qualities/quality/naturalweapons/naturalweapon/page`): 100.0% numeric
  - Examples: 137, 137, 137
- **references** (`chummer/rules/rule/page`): 100.0% numeric
  - Examples: 8, 14, 16
- **skills** (`chummer/skills/skill/page`): 100.0% numeric
  - Examples: 143, 142, 143
- **spells** (`chummer/spells/spell/page`): 100.0% numeric
  - Examples: 283, 283, 283
- **spiritpowers** (`chummer/powers/power/page`): 100.0% numeric
  - Examples: 394, 394, 394
- **streams** (`chummer/traditions/tradition/page`): 100.0% numeric
  - Examples: 258
- **streams** (`chummer/spirits/spirit/page`): 100.0% numeric
  - Examples: 258, 258, 258
- **traditions** (`chummer/traditions/tradition/page`): 100.0% numeric
  - Examples: 279, 279, 279
- **traditions** (`chummer/spirits/spirit/page`): 100.0% numeric
  - Examples: 303, 303, 303
- **vehicles** (`chummer/vehicles/vehicle/page`): 100.0% numeric
  - Examples: 462, 41, 42
- **vehicles** (`chummer/weaponmounts/weaponmount/page`): 100.0% numeric
  - Examples: 0, 461, 461
- **vehicles** (`chummer/weaponmountmods/mod/page`): 100.0% numeric
  - Examples: 124, 124, 124
- **vessels** (`chummer/metatypes/metatype/page`): 100.0% numeric
  - Examples: 298, 298, 298
- **weapons** (`chummer/weapons/weapon/page`): 100.0% numeric
  - Examples: 45, 46, 35
- **weapons** (`chummer/accessories/accessory/page`): 100.0% numeric
  - Examples: 425, 425, 431
- **vehicles** (`chummer/mods/mod/page`): 95.9% numeric
  - Examples: ?, ?, ?

### pathogencontactresist
- **critterpowers** (`chummer/powers/power/bonus/pathogencontactresist`): 100.0% numeric
  - Examples: 1
- **mentors** (`chummer/mentors/mentor/bonus/pathogencontactresist`): 100.0% numeric
  - Examples: 2
- **qualities** (`chummer/qualities/quality/bonus/pathogencontactresist`): 100.0% numeric
  - Examples: 1, 2, 1

### pathogeningestionresist
- **critterpowers** (`chummer/powers/power/bonus/pathogeningestionresist`): 100.0% numeric
  - Examples: 1
- **mentors** (`chummer/mentors/mentor/bonus/pathogeningestionresist`): 100.0% numeric
  - Examples: 2
- **qualities** (`chummer/qualities/quality/bonus/pathogeningestionresist`): 100.0% numeric
  - Examples: 1, 2, 1

### pathogeninhalationresist
- **critterpowers** (`chummer/powers/power/bonus/pathogeninhalationresist`): 100.0% numeric
  - Examples: 1
- **mentors** (`chummer/mentors/mentor/bonus/pathogeninhalationresist`): 100.0% numeric
  - Examples: 2
- **qualities** (`chummer/qualities/quality/bonus/pathogeninhalationresist`): 100.0% numeric
  - Examples: 1, 2, 1

### pathogeninjectionresist
- **critterpowers** (`chummer/powers/power/bonus/pathogeninjectionresist`): 100.0% numeric
  - Examples: 1
- **mentors** (`chummer/mentors/mentor/bonus/pathogeninjectionresist`): 100.0% numeric
  - Examples: 2
- **qualities** (`chummer/qualities/quality/bonus/pathogeninjectionresist`): 100.0% numeric
  - Examples: 1, 2, 1

### percent
- **critterpowers** (`chummer/powers/power/bonus/walkmultiplier/percent`): 100.0% numeric
  - Examples: 100
- **critterpowers** (`chummer/powers/power/bonus/runmultiplier/percent`): 100.0% numeric
  - Examples: 100
- **cyberware** (`chummer/cyberwares/cyberware/pairbonus/walkmultiplier/percent`): 100.0% numeric
  - Examples: 50, 50, 50
- **cyberware** (`chummer/cyberwares/cyberware/pairbonus/sprintbonus/percent`): 100.0% numeric
  - Examples: 50, 50
- **cyberware** (`chummer/cyberwares/cyberware/bonus/walkmultiplier/percent`): 100.0% numeric
  - Examples: -50, -50, -50
- **cyberware** (`chummer/cyberwares/cyberware/pairbonus/runmultiplier/percent`): 100.0% numeric
  - Examples: 50, 100
- **cyberware** (`chummer/cyberwares/cyberware/bonus/sprintbonus/percent`): 100.0% numeric
  - Examples: 100
- **cyberware** (`chummer/cyberwares/cyberware/bonus/runmultiplier/percent`): 100.0% numeric
  - Examples: 100, 100
- **powers** (`chummer/powers/power/bonus/walkmultiplier/percent`): 100.0% numeric
  - Examples: 100, 100

### physical
- **cyberware** (`chummer/cyberwares/cyberware/bonus/conditionmonitor/physical`): 100.0% numeric
  - Examples: 1, 1, 1
- **cyberware** (`chummer/cyberwares/cyberware/pairbonus/conditionmonitor/physical`): 100.0% numeric
  - Examples: 1, 1, 1
- **qualities** (`chummer/qualities/quality/bonus/conditionmonitor/physical`): 100.0% numeric
  - Examples: 1, -2, 2

### physicalcmrecovery
- **qualities** (`chummer/qualities/quality/bonus/physicalcmrecovery`): 100.0% numeric
  - Examples: 2, -2

### physicallimit
- **bioware** (`chummer/biowares/bioware/bonus/physicallimit`): 100.0% numeric
  - Examples: 1, 1
- **critterpowers** (`chummer/powers/power/bonus/physicallimit`): 100.0% numeric
  - Examples: 1
- **qualities** (`chummer/qualities/quality/bonus/physicallimit`): 100.0% numeric
  - Examples: 1

### pilot
- **vehicles** (`chummer/vehicles/vehicle/pilot`): 100.0% numeric
  - Examples: 1, 2, 2

### points
- **powers** (`chummer/powers/power/points`): 100.0% numeric
  - Examples: 0.25, 1, 0.25

### pointsperlevel
- **gear** (`chummer/gears/gear/bonus/selectpowers/selectpower/pointsperlevel`): 100.0% numeric
  - Examples: 0.25, 0.25, 0.25

### powertrainmodslots
- **vehicles** (`chummer/vehicles/vehicle/powertrainmodslots`): 100.0% numeric
  - Examples: -14, -7

### programs
- **gear** (`chummer/gears/gear/programs`): 97.6% numeric
  - Examples: 1, 1, 2

### protectionmodslots
- **vehicles** (`chummer/vehicles/vehicle/protectionmodslots`): 100.0% numeric
  - Examples: -14, -7

### prototypetranshuman
- **qualities** (`chummer/qualities/quality/bonus/prototypetranshuman`): 100.0% numeric
  - Examples: 1

### psychologicaladdictionalreadyaddicted
- **qualities** (`chummer/qualities/quality/bonus/psychologicaladdictionalreadyaddicted`): 100.0% numeric
  - Examples: -2, -1

### psychologicaladdictionfirsttime
- **qualities** (`chummer/qualities/quality/bonus/psychologicaladdictionfirsttime`): 100.0% numeric
  - Examples: 2, -2, -1

### publicawareness
- **qualities** (`chummer/qualities/quality/bonus/publicawareness`): 100.0% numeric
  - Examples: 2, 3, 5

### qty
- **packs** (`chummer/packs/pack/gears/gear/qty`): 100.0% numeric
  - Examples: 100, 20, 10
- **packs** (`chummer/packs/pack/gears/gear/gears/gear/qty`): 100.0% numeric
  - Examples: 4
- **vehicles** (`chummer/vehicles/vehicle/gears/gear/qty`): 100.0% numeric
  - Examples: 200

### qualitykarmalimit
- **settings** (`chummer/settings/setting/qualitykarmalimit`): 100.0% numeric
  - Examples: 25, 13, 35

### qualitylevel
- **lifemodules** (`chummer/modules/module/versions/version/bonus/qualitylevel`): 100.0% numeric
  - Examples: 1, 1, 1
- **lifemodules** (`chummer/modules/module/bonus/qualitylevel`): 100.0% numeric
  - Examples: 1, 3, 3
- **lifemodules** (`chummer/modules/module/bonus/addqualities/qualitylevel`): 100.0% numeric
  - Examples: 2, 2, 2

### radiationresist
- **bioware** (`chummer/biowares/bioware/bonus/radiationresist`): 100.0% numeric
  - Examples: 2

### rangemodifier
- **weapons** (`chummer/accessories/accessory/rangemodifier`): 100.0% numeric
  - Examples: 1

### rating
- **armor** (`chummer/armors/armor/rating`): 100.0% numeric
  - Examples: 6, 6, 4
- **armor** (`chummer/armors/armor/gears/usegear/rating`): 100.0% numeric
  - Examples: 2, 2
- **bioware** (`chummer/biowares/bioware/rating`): 100.0% numeric
  - Examples: 3, 4, 3
- **cyberware** (`chummer/cyberwares/cyberware/gears/usegear/rating`): 100.0% numeric
  - Examples: 1, 1
- **cyberware** (`chummer/cyberwares/cyberware/subsystems/cyberware/rating`): 100.0% numeric
  - Examples: 1, 1, 2
- **cyberware** (`chummer/cyberwares/cyberware/subsystems/bioware/rating`): 100.0% numeric
  - Examples: 2, 1, 1
- **cyberware** (`chummer/cyberwares/cyberware/subsystems/cyberware/subsystems/cyberware/rating`): 100.0% numeric
  - Examples: 2, 2, 2
- **drugcomponents** (`chummer/drugs/drug/rating`): 100.0% numeric
  - Examples: 0, 0, 0
- **drugcomponents** (`chummer/drugcomponents/drugcomponent/rating`): 100.0% numeric
  - Examples: 6, 6, 6
- **gear** (`chummer/gears/gear/gears/usegear/rating`): 100.0% numeric
  - Examples: 1, 1, 1
- **packs** (`chummer/packs/pack/gears/gear/rating`): 100.0% numeric
  - Examples: 1, 1, 1
- **packs** (`chummer/packs/pack/gears/gear/gears/gear/rating`): 100.0% numeric
  - Examples: 2, 1, 1
- **packs** (`chummer/packs/pack/armors/armor/mods/mod/rating`): 100.0% numeric
  - Examples: 2, 4, 4
- **packs** (`chummer/packs/pack/cyberwares/cyberware/rating`): 100.0% numeric
  - Examples: 1, 1, 1
- **packs** (`chummer/packs/pack/cyberwares/cyberware/gears/gear/rating`): 100.0% numeric
  - Examples: 1, 1, 1
- **packs** (`chummer/packs/pack/cyberwares/cyberware/cyberwares/cyberware/rating`): 100.0% numeric
  - Examples: 2, 2, 2
- **packs** (`chummer/packs/pack/biowares/bioware/rating`): 100.0% numeric
  - Examples: 2, 2, 1
- **packs** (`chummer/packs/pack/vehicles/vehicle/gears/gear/rating`): 100.0% numeric
  - Examples: 2, 2, 2
- **packs** (`chummer/packs/pack/vehicles/vehicle/gears/gear/gears/gear/rating`): 100.0% numeric
  - Examples: 2, 1
- **packs** (`chummer/packs/pack/vehicles/vehicle/gears/gear/gears/gear/gears/gear/rating`): 100.0% numeric
  - Examples: 1, 1
- **programs** (`chummer/programs/program/rating`): 100.0% numeric
  - Examples: 0, 0, 0
- **qualities** (`chummer/qualities/quality/bonus/addgear/rating`): 100.0% numeric
  - Examples: 3
- **qualities** (`chummer/qualities/quality/bonus/addgear/children/child/rating`): 100.0% numeric
  - Examples: 3, 3, 3
- **vehicles** (`chummer/vehicles/vehicle/gears/gear/rating`): 100.0% numeric
  - Examples: 1, 2, 2
- **vehicles** (`chummer/vehicles/vehicle/gears/gear/gears/gear/rating`): 100.0% numeric
  - Examples: 4, 4
- **vehicles** (`chummer/weaponmountmods/mod/rating`): 100.0% numeric
  - Examples: 0, 0, 0
- **weapons** (`chummer/weapons/weapon/accessories/accessory/gears/usegear/rating`): 100.0% numeric
  - Examples: 4, 1, 5
- **weapons** (`chummer/weapons/weapon/accessories/accessory/rating`): 100.0% numeric
  - Examples: 1, 4, 2
- **weapons** (`chummer/accessories/accessory/rating`): 100.0% numeric
  - Examples: 0, 0, 0
- **gear** (`chummer/gears/gear/rating`): 99.4% numeric
  - Examples: 0, 0, 12
- **cyberware** (`chummer/cyberwares/cyberware/rating`): 95.8% numeric
  - Examples: 600, 600, 3
- **vehicles** (`chummer/mods/mod/rating`): 95.4% numeric
  - Examples: 0, 0, 0

### rc
- **weapons** (`chummer/weapons/weapon/rc`): 100.0% numeric
  - Examples: 0, 0, 0
- **weapons** (`chummer/accessories/accessory/rc`): 100.0% numeric
  - Examples: 2, 1, 2

### rcgroup
- **weapons** (`chummer/accessories/accessory/rcgroup`): 100.0% numeric
  - Examples: 1, 1, 2

### rea
- **streams** (`chummer/spirits/spirit/rea`): 100.0% numeric
  - Examples: 0, 0, 0

### reaaug
- **metatypes** (`chummer/metatypes/metatype/reaaug`): 100.0% numeric
  - Examples: 10, 10, 9
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/reaaug`): 100.0% numeric
  - Examples: 10, 10, 10
- **vessels** (`chummer/metatypes/metatype/reaaug`): 100.0% numeric
  - Examples: 0, 0, 0

### reach
- **bioware** (`chummer/biowares/bioware/pairbonus/reach`): 100.0% numeric
  - Examples: 1, 1, 1
- **critterpowers** (`chummer/powers/power/bonus/naturalweapon/reach`): 100.0% numeric
  - Examples: 0, 0, -1
- **critters** (`chummer/metatypes/metatype/bonus/reach`): 100.0% numeric
  - Examples: 1, 3, -1
- **critters** (`chummer/metatypes/metatype/bonus/enabletab/reach`): 100.0% numeric
  - Examples: 1, 1
- **metatypes** (`chummer/metatypes/metatype/bonus/reach`): 100.0% numeric
  - Examples: 1
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/bonus/reach`): 100.0% numeric
  - Examples: 1, 1, 1
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/bonus/naturalweapon/reach`): 100.0% numeric
  - Examples: 0, 0, 0
- **qualities** (`chummer/qualities/quality/bonus/reach`): 100.0% numeric
  - Examples: 1, -1, 1
- **qualities** (`chummer/qualities/quality/naturalweapons/naturalweapon/reach`): 100.0% numeric
  - Examples: 0, -1, -1
- **weapons** (`chummer/weapons/weapon/reach`): 100.0% numeric
  - Examples: 0, 0, 0
- **weapons** (`chummer/accessories/accessory/reach`): 100.0% numeric
  - Examples: 1

### reamax
- **metatypes** (`chummer/metatypes/metatype/reamax`): 100.0% numeric
  - Examples: 6, 6, 5
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/reamax`): 100.0% numeric
  - Examples: 6, 6, 6
- **vessels** (`chummer/metatypes/metatype/reamax`): 100.0% numeric
  - Examples: 0, 0, 0

### reamin
- **metatypes** (`chummer/metatypes/metatype/reamin`): 100.0% numeric
  - Examples: 1, 1, 1
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/reamin`): 100.0% numeric
  - Examples: 1, 1, 1
- **vessels** (`chummer/metatypes/metatype/reamin`): 100.0% numeric
  - Examples: 0, 0, 0

### removalcost
- **cyberware** (`chummer/cyberwares/cyberware/removalcost`): 100.0% numeric
  - Examples: 16000

### res
- **traditions** (`chummer/spirits/spirit/res`): 100.0% numeric
  - Examples: 0, 0, 0

### resaug
- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/resaug`): 100.0% numeric
  - Examples: 0, 0, 0
- **metatypes** (`chummer/metatypes/metatype/resaug`): 100.0% numeric
  - Examples: 6, 6, 6
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/resaug`): 100.0% numeric
  - Examples: 6, 6, 6
- **vessels** (`chummer/metatypes/metatype/resaug`): 100.0% numeric
  - Examples: 0, 0, 0
- **critters** (`chummer/metatypes/metatype/resaug`): 97.4% numeric
  - Examples: 3, 3, 3

### resmax
- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/resmax`): 100.0% numeric
  - Examples: 0, 0, 0
- **metatypes** (`chummer/metatypes/metatype/resmax`): 100.0% numeric
  - Examples: 6, 6, 6
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/resmax`): 100.0% numeric
  - Examples: 6, 6, 6
- **vessels** (`chummer/metatypes/metatype/resmax`): 100.0% numeric
  - Examples: 0, 0, 0
- **critters** (`chummer/metatypes/metatype/resmax`): 97.4% numeric
  - Examples: 3, 3, 3

### resmin
- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/resmin`): 100.0% numeric
  - Examples: 0, 0, 0
- **metatypes** (`chummer/metatypes/metatype/resmin`): 100.0% numeric
  - Examples: 1, 1, 1
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/resmin`): 100.0% numeric
  - Examples: 1, 1, 1
- **vessels** (`chummer/metatypes/metatype/resmin`): 100.0% numeric
  - Examples: 0, 0, 0
- **critters** (`chummer/metatypes/metatype/resmin`): 97.4% numeric
  - Examples: 0, 0, 0

### resonance
- **priorities** (`chummer/priorities/priority/talents/talent/resonance`): 100.0% numeric
  - Examples: 6, 4, 3

### resources
- **priorities** (`chummer/priorities/priority/resources`): 100.0% numeric
  - Examples: 450000, 275000, 140000

### restrictedcostmultiplier
- **settings** (`chummer/settings/setting/restrictedcostmultiplier`): 100.0% numeric
  - Examples: 1, 1, 1

### run
- **critters** (`chummer/metatypes/metatype/run`): 100.0% numeric
  - Examples: 8/0/0, 6/0/0, 10/0/0
- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/run`): 100.0% numeric
  - Examples: 4/4/4, 4/4/4, 4/4/4
- **metatypes** (`chummer/metatypes/metatype/run`): 100.0% numeric
  - Examples: 4/0/0, 4/0/0, 4/0/0
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/run`): 100.0% numeric
  - Examples: 4/0/0, 4/1/0, 4/1/0
- **traditions** (`chummer/spirits/spirit/run`): 100.0% numeric
  - Examples: 4/0/0, 4/0/0, 4/0/0
- **vessels** (`chummer/metatypes/metatype/run`): 100.0% numeric
  - Examples: 0/0/0, 0/0/0, 0/0/0

### seats
- **vehicles** (`chummer/vehicles/vehicle/seats`): 100.0% numeric
  - Examples: 1, 1, 1
- **vehicles** (`chummer/mods/mod/required/vehicledetails/seats`): 100.0% numeric
  - Examples: 1

### security
- **lifestyles** (`chummer/qualities/quality/security`): 100.0% numeric
  - Examples: 1

### securityminimum
- **lifestyles** (`chummer/qualities/quality/securityminimum`): 100.0% numeric
  - Examples: 1

### sensor
- **vehicles** (`chummer/vehicles/vehicle/sensor`): 100.0% numeric
  - Examples: 1, 2, 2

### short
- **ranges** (`chummer/modifiers/short`): 100.0% numeric
  - Examples: 0

### shortburst
- **weapons** (`chummer/weapons/weapon/shortburst`): 100.0% numeric
  - Examples: 6

### singleshot
- **weapons** (`chummer/weapons/weapon/singleshot`): 100.0% numeric
  - Examples: 2

### skillgroupqty
- **priorities** (`chummer/priorities/priority/talents/talent/skillgroupqty`): 100.0% numeric
  - Examples: 1, 1, 1

### skillgroups
- **priorities** (`chummer/priorities/priority/skillgroups`): 100.0% numeric
  - Examples: 10, 5, 2

### skillgroupval
- **priorities** (`chummer/priorities/priority/talents/talent/skillgroupval`): 100.0% numeric
  - Examples: 4, 4, 2

### skillqty
- **priorities** (`chummer/priorities/priority/talents/talent/skillqty`): 100.0% numeric
  - Examples: 2, 2, 3

### skills
- **priorities** (`chummer/priorities/priority/skills`): 100.0% numeric
  - Examples: 46, 36, 28

### skillval
- **priorities** (`chummer/priorities/priority/talents/talent/skillval`): 100.0% numeric
  - Examples: 5, 5, 5

### sleaze
- **echoes** (`chummer/echoes/echo/bonus/livingpersona/sleaze`): 100.0% numeric
  - Examples: 1
- **gear** (`chummer/gears/gear/required/geardetails/OR/sleaze`): 100.0% numeric
  - Examples: 0, 0, 0
- **gear** (`chummer/gears/gear/required/geardetails/OR/AND/sleaze`): 100.0% numeric
  - Examples: 0, 0, 0
- **qualities** (`chummer/qualities/quality/bonus/livingpersona/sleaze`): 100.0% numeric
  - Examples: 2, -1
- **gear** (`chummer/gears/gear/sleaze`): 97.6% numeric
  - Examples: {INT}, 0, 0

### slots
- **vehicles** (`chummer/weaponmounts/weaponmount/slots`): 100.0% numeric
  - Examples: 0, 3, 6
- **vehicles** (`chummer/weaponmountmods/mod/slots`): 100.0% numeric
  - Examples: 0, 1, 1
- **vehicles** (`chummer/mods/mod/slots`): 90.4% numeric
  - Examples: 0, 0, 0

### smartlink
- **cyberware** (`chummer/cyberwares/cyberware/bonus/smartlink`): 100.0% numeric
  - Examples: 2, 2
- **gear** (`chummer/gears/gear/bonus/smartlink`): 100.0% numeric
  - Examples: 1, 1

### smartlinkpool
- **gear** (`chummer/gears/gear/weaponbonus/smartlinkpool`): 100.0% numeric
  - Examples: 1

### sociallimit
- **armor** (`chummer/armors/armor/bonus/sociallimit`): 100.0% numeric
  - Examples: 1
- **qualities** (`chummer/qualities/quality/bonus/sociallimit`): 100.0% numeric
  - Examples: 1, 2

### sonicresist
- **cyberware** (`chummer/cyberwares/cyberware/bonus/sonicresist`): 100.0% numeric
  - Examples: 2

### specialattburnmultiplier
- **qualities** (`chummer/qualities/quality/bonus/specialattburnmultiplier`): 100.0% numeric
  - Examples: 20

### specialmodificationlimit
- **qualities** (`chummer/qualities/quality/bonus/specialmodificationlimit`): 100.0% numeric
  - Examples: 2, 2
- **weapons** (`chummer/accessories/accessory/required/oneof/specialmodificationlimit`): 100.0% numeric
  - Examples: 1, 1, 1

### speed
- **drugcomponents** (`chummer/drugs/drug/speed`): 100.0% numeric
  - Examples: 1, 600, 1
- **drugcomponents** (`chummer/drugcomponents/drugcomponent/effects/effect/speed`): 100.0% numeric
  - Examples: -3
- **vehicles** (`chummer/vehicles/vehicle/speed`): 100.0% numeric
  - Examples: 3, 3, 2

### spellresistance
- **qualities** (`chummer/qualities/quality/bonus/spellresistance`): 100.0% numeric
  - Examples: 1, 2

### spells
- **priorities** (`chummer/priorities/priority/talents/talent/spells`): 100.0% numeric
  - Examples: 10, 10, 7

### sprint
- **critters** (`chummer/metatypes/metatype/sprint`): 100.0% numeric
  - Examples: 4/1/0, 4/1/0, 6/1/0
- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/sprint`): 100.0% numeric
  - Examples: 2/2/2, 2/2/2, 2/2/2
- **metatypes** (`chummer/metatypes/metatype/sprint`): 100.0% numeric
  - Examples: 2/1/0, 2/1/0, 1/1/0
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/sprint`): 100.0% numeric
  - Examples: 2/1/0, 1/1/0, 1/1/0
- **traditions** (`chummer/spirits/spirit/sprint`): 100.0% numeric
  - Examples: 1/1/0, 1/1/0, 1/1/0
- **vessels** (`chummer/metatypes/metatype/sprint`): 100.0% numeric
  - Examples: 0/0/0, 0/0/0, 0/0/0

### str
- **streams** (`chummer/spirits/spirit/str`): 100.0% numeric
  - Examples: 0, 0, 0

### straug
- **metatypes** (`chummer/metatypes/metatype/straug`): 100.0% numeric
  - Examples: 10, 10, 12
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/straug`): 100.0% numeric
  - Examples: 10, 9, 10
- **vessels** (`chummer/metatypes/metatype/straug`): 100.0% numeric
  - Examples: 0, 0, 0

### streetcredmultiplier
- **qualities** (`chummer/qualities/quality/bonus/streetcredmultiplier`): 100.0% numeric
  - Examples: 10

### strmax
- **metatypes** (`chummer/metatypes/metatype/strmax`): 100.0% numeric
  - Examples: 6, 6, 8
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/strmax`): 100.0% numeric
  - Examples: 6, 5, 6
- **vessels** (`chummer/metatypes/metatype/strmax`): 100.0% numeric
  - Examples: 0, 0, 0

### strmin
- **metatypes** (`chummer/metatypes/metatype/strmin`): 100.0% numeric
  - Examples: 1, 1, 3
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/strmin`): 100.0% numeric
  - Examples: 1, 1, 1
- **vessels** (`chummer/metatypes/metatype/strmin`): 100.0% numeric
  - Examples: 0, 0, 0

### stun
- **critterpowers** (`chummer/powers/power/bonus/conditionmonitor/stun`): 100.0% numeric
  - Examples: -20
- **qualities** (`chummer/qualities/quality/bonus/conditionmonitor/stun`): 100.0% numeric
  - Examples: 1, -1, -1

### stuncmrecovery
- **qualities** (`chummer/qualities/quality/bonus/stuncmrecovery`): 100.0% numeric
  - Examples: 2, -2

### submersiongrade
- **qualities** (`chummer/qualities/quality/required/allof/submersiongrade`): 100.0% numeric
  - Examples: 1
- **tips** (`chummer/tips/tip/forbidden/allof/submersiongrade`): 100.0% numeric
  - Examples: 1

### sumtoten
- **settings** (`chummer/settings/setting/sumtoten`): 100.0% numeric
  - Examples: 10, 10, 10

### threshold
- **drugcomponents** (`chummer/drugcomponents/drugcomponent/threshold`): 100.0% numeric
  - Examples: 2, 2, 2
- **qualities** (`chummer/qualities/quality/bonus/conditionmonitor/threshold`): 100.0% numeric
  - Examples: -1

### thresholdoffset
- **qualities** (`chummer/qualities/quality/bonus/conditionmonitor/thresholdoffset`): 100.0% numeric
  - Examples: 1

### throwstr
- **powers** (`chummer/powers/power/bonus/throwstr`): 100.0% numeric
  - Examples: 1

### total
- **critterpowers** (`chummer/powers/power/required/allof/attribute/total`): 100.0% numeric
  - Examples: 3, 3, 3
- **mentors** (`chummer/mentors/mentor/required/allof/attribute/total`): 100.0% numeric
  - Examples: 4, 4
- **tips** (`chummer/tips/tip/required/allof/grouponeof/attribute/total`): 100.0% numeric
  - Examples: 6
- **tips** (`chummer/tips/tip/required/oneof/attributetotal/total`): 100.0% numeric
  - Examples: 11
- **tips** (`chummer/tips/tip/required/oneof/group/attributetotal/total`): 100.0% numeric
  - Examples: 10
- **tips** (`chummer/tips/tip/required/allof/attribute/total`): 100.0% numeric
  - Examples: 3

### toxincontactresist
- **critterpowers** (`chummer/powers/power/bonus/toxincontactresist`): 100.0% numeric
  - Examples: 1
- **mentors** (`chummer/mentors/mentor/bonus/toxincontactresist`): 100.0% numeric
  - Examples: 2
- **qualities** (`chummer/qualities/quality/bonus/toxincontactresist`): 100.0% numeric
  - Examples: 1, 2, 1

### toxiningestionresist
- **critterpowers** (`chummer/powers/power/bonus/toxiningestionresist`): 100.0% numeric
  - Examples: 1
- **mentors** (`chummer/mentors/mentor/bonus/toxiningestionresist`): 100.0% numeric
  - Examples: 2
- **qualities** (`chummer/qualities/quality/bonus/toxiningestionresist`): 100.0% numeric
  - Examples: 1, 2, 1

### toxininhalationresist
- **critterpowers** (`chummer/powers/power/bonus/toxininhalationresist`): 100.0% numeric
  - Examples: 1
- **mentors** (`chummer/mentors/mentor/bonus/toxininhalationresist`): 100.0% numeric
  - Examples: 2
- **qualities** (`chummer/qualities/quality/bonus/toxininhalationresist`): 100.0% numeric
  - Examples: 1, 2, 1

### toxininjectionresist
- **critterpowers** (`chummer/powers/power/bonus/toxininjectionresist`): 100.0% numeric
  - Examples: 1
- **mentors** (`chummer/mentors/mentor/bonus/toxininjectionresist`): 100.0% numeric
  - Examples: 2
- **qualities** (`chummer/qualities/quality/bonus/toxininjectionresist`): 100.0% numeric
  - Examples: 1, 2, 1

### trustfund
- **qualities** (`chummer/qualities/quality/bonus/trustfund`): 100.0% numeric
  - Examples: 1, 2, 3

### unarmeddv
- **bioware** (`chummer/biowares/bioware/pairbonus/unarmeddv`): 100.0% numeric
  - Examples: 1, 1
- **critterpowers** (`chummer/powers/power/bonus/unarmeddv`): 100.0% numeric
  - Examples: 2
- **cyberware** (`chummer/cyberwares/cyberware/bonus/unarmeddv`): 100.0% numeric
  - Examples: 2, 1, 3
- **powers** (`chummer/enhancements/enhancement/bonus/unarmeddv`): 100.0% numeric
  - Examples: 1
- **qualities** (`chummer/qualities/quality/bonus/unarmeddv`): 100.0% numeric
  - Examples: 2, 1

### unarmedreach
- **bioware** (`chummer/biowares/bioware/bonus/unarmedreach`): 100.0% numeric
  - Examples: 1
- **bioware** (`chummer/biowares/bioware/pairbonus/unarmedreach`): 100.0% numeric
  - Examples: 1
- **martialarts** (`chummer/techniques/technique/bonus/unarmedreach`): 100.0% numeric
  - Examples: 1

### val
- **bioware** (`chummer/biowares/bioware/bonus/selectskill/val`): 100.0% numeric
  - Examples: 1, 1, 1
- **bioware** (`chummer/biowares/bioware/pairbonus/walkmultiplier/val`): 100.0% numeric
  - Examples: 1, 1
- **bioware** (`chummer/biowares/bioware/bonus/attributekarmacost/val`): 100.0% numeric
  - Examples: -2
- **critterpowers** (`chummer/powers/power/bonus/movementreplace/val`): 100.0% numeric
  - Examples: 2, 4, 300
- **critterpowers** (`chummer/powers/power/bonus/critterpowerlevels/power/val`): 100.0% numeric
  - Examples: 2, 1, 1
- **critterpowers** (`chummer/powers/power/bonus/sprintbonus/val`): 100.0% numeric
  - Examples: 100, 100
- **cyberware** (`chummer/grades/grade/bonus/specificattribute/val`): 100.0% numeric
  - Examples: -1, -1
- **cyberware** (`chummer/cyberwares/cyberware/bonus/runmultiplier/val`): 100.0% numeric
  - Examples: -1, -1, -1
- **cyberware** (`chummer/cyberwares/cyberware/pairbonus/runmultiplier/val`): 100.0% numeric
  - Examples: 1
- **cyberware** (`chummer/cyberwares/cyberware/bonus/addlimb/val`): 100.0% numeric
  - Examples: 2
- **cyberware** (`chummer/cyberwares/cyberware/pairbonus/selectskill/val`): 100.0% numeric
  - Examples: 1
- **echoes** (`chummer/echoes/echo/bonus/specificattribute/val`): 100.0% numeric
  - Examples: 1, 1
- **lifemodules** (`chummer/modules/module/versions/version/bonus/knowledgeskilllevel/val`): 100.0% numeric
  - Examples: 2, 2, 2
- **lifemodules** (`chummer/modules/module/bonus/knowledgeskilllevel/val`): 100.0% numeric
  - Examples: 0, 0, 0
- **lifemodules** (`chummer/modules/module/versions/version/bonus/skilllevel/val`): 100.0% numeric
  - Examples: 2, 2, 2
- **lifemodules** (`chummer/modules/module/versions/version/bonus/skillgrouplevel/val`): 100.0% numeric
  - Examples: 1, 1, 1
- **lifemodules** (`chummer/modules/module/bonus/skilllevel/val`): 100.0% numeric
  - Examples: 2, 2, 2
- **lifemodules** (`chummer/modules/module/bonus/attributelevel/val`): 100.0% numeric
  - Examples: 1, 1, 1
- **lifemodules** (`chummer/modules/module/bonus/skillgrouplevel/val`): 100.0% numeric
  - Examples: 2, 2, 2
- **lifemodules** (`chummer/modules/module/bonus/knowledgeskilllevel/options/val`): 100.0% numeric
  - Examples: 0
- **lifemodules** (`chummer/modules/module/bonus/selectskill/val`): 100.0% numeric
  - Examples: 2, 1
- **mentors** (`chummer/mentors/mentor/choices/choice/bonus/spellcategory/val`): 100.0% numeric
  - Examples: 2, 2, 2
- **mentors** (`chummer/mentors/mentor/choices/choice/bonus/specificpower/val`): 100.0% numeric
  - Examples: 1, 2, 1
- **mentors** (`chummer/mentors/mentor/bonus/selectskill/val`): 100.0% numeric
  - Examples: 2, 2, 2
- **mentors** (`chummer/mentors/mentor/choices/choice/bonus/selectpowers/selectpower/val`): 100.0% numeric
  - Examples: 1, 1, 1
- **mentors** (`chummer/mentors/mentor/choices/choice/bonus/selectskill/val`): 100.0% numeric
  - Examples: 2
- **mentors** (`chummer/mentors/mentor/choices/choice/bonus/spelldicepool/val`): 100.0% numeric
  - Examples: 2, 2, 2
- **mentors** (`chummer/mentors/mentor/bonus/skillcategorykarmacost/val`): 100.0% numeric
  - Examples: -1
- **mentors** (`chummer/mentors/mentor/bonus/skillgrouplevel/val`): 100.0% numeric
  - Examples: 1
- **mentors** (`chummer/mentors/mentor/choices/choice/bonus/specificskill/val`): 100.0% numeric
  - Examples: 1
- **metatypes** (`chummer/metatypes/metatype/bonus/addlimb/val`): 100.0% numeric
  - Examples: 2
- **paragons** (`chummer/mentors/mentor/bonus/actiondicepool/val`): 100.0% numeric
  - Examples: 1
- **powers** (`chummer/powers/power/bonus/selectlimit/val`): 100.0% numeric
  - Examples: 1
- **powers** (`chummer/powers/power/bonus/sprintbonus/val`): 100.0% numeric
  - Examples: 200, 400
- **qualities** (`chummer/qualities/quality/bonus/spelldicepool/val`): 100.0% numeric
  - Examples: 2
- **qualities** (`chummer/qualities/quality/bonus/selectskill/val`): 100.0% numeric
  - Examples: -2, 1
- **qualities** (`chummer/qualities/quality/bonus/skillcategorykarmacostmultiplier/val`): 100.0% numeric
  - Examples: 200, 200, 200
- **qualities** (`chummer/qualities/quality/bonus/skillcategorypointcostmultiplier/val`): 100.0% numeric
  - Examples: 200, 50, 50
- **qualities** (`chummer/qualities/quality/bonus/skillcategoryspecializationkarmacostmultiplier/val`): 100.0% numeric
  - Examples: 200, 200, 200
- **qualities** (`chummer/qualities/quality/bonus/skillgroupcategorykarmacostmultiplier/val`): 100.0% numeric
  - Examples: 200
- **qualities** (`chummer/qualities/quality/bonus/focusbindingkarmacost/val`): 100.0% numeric
  - Examples: -2, -2, -2
- **qualities** (`chummer/qualities/quality/bonus/knowledgeskillpoints/val`): 100.0% numeric
  - Examples: 5
- **qualities** (`chummer/qualities/quality/bonus/skillcategorykarmacost/val`): 100.0% numeric
  - Examples: -1, -1, -1
- **qualities** (`chummer/qualities/quality/bonus/activeskillkarmacost/val`): 100.0% numeric
  - Examples: -1, 2
- **qualities** (`chummer/qualities/quality/bonus/knowledgeskillkarmacostmin/val`): 100.0% numeric
  - Examples: 1
- **qualities** (`chummer/qualities/quality/bonus/knowledgeskillkarmacost/val`): 100.0% numeric
  - Examples: -1, 2
- **qualities** (`chummer/qualities/quality/bonus/spelldescriptordamage/val`): 100.0% numeric
  - Examples: 2
- **qualities** (`chummer/qualities/quality/bonus/spelldescriptordrain/val`): 100.0% numeric
  - Examples: 2
- **qualities** (`chummer/qualities/quality/bonus/movementreplace/val`): 100.0% numeric
  - Examples: 3, 6, 6
- **qualities** (`chummer/qualities/quality/bonus/sprintbonus/val`): 100.0% numeric
  - Examples: 100, 100
- **qualities** (`chummer/qualities/quality/bonus/addlimb/val`): 100.0% numeric
  - Examples: 2
- **qualities** (`chummer/qualities/quality/bonus/selectattributes/selectattribute/val`): 100.0% numeric
  - Examples: 1, 1, 1
- **qualities** (`chummer/qualities/quality/bonus/runmultiplier/val`): 100.0% numeric
  - Examples: 1, 1, 1
- **qualities** (`chummer/qualities/quality/bonus/walkmultiplier/val`): 100.0% numeric
  - Examples: 1, 1, 1
- **qualities** (`chummer/qualities/quality/bonus/specificattribute/val`): 100.0% numeric
  - Examples: -1, -1, -1
- **qualities** (`chummer/qualities/quality/required/oneof/skill/val`): 100.0% numeric
  - Examples: 3, 3, 3
- **qualities** (`chummer/qualities/quality/required/allof/skill/val`): 100.0% numeric
  - Examples: 4, 4, 6
- **qualities** (`chummer/qualities/quality/required/oneof/group/skill/val`): 100.0% numeric
  - Examples: 4, 4, 5
- **qualities** (`chummer/qualities/quality/bonus/spellcategorydamage/val`): 100.0% numeric
  - Examples: 1, 1
- **qualities** (`chummer/qualities/quality/bonus/spellcategorydrain/val`): 100.0% numeric
  - Examples: 1, 1, -2
- **tips** (`chummer/tips/tip/required/allof/grouponeof/skill/val`): 100.0% numeric
  - Examples: 6, 6, 6
- **tips** (`chummer/tips/tip/forbidden/oneof/attribute/val`): 100.0% numeric
  - Examples: 1, 1, 2
- **tips** (`chummer/tips/tip/forbidden/oneof/attributetotal/val`): 100.0% numeric
  - Examples: 2
- **tips** (`chummer/tips/tip/required/allof/skill/val`): 100.0% numeric
  - Examples: 6, 6, 1
- **tips** (`chummer/tips/tip/forbidden/allof/skill/val`): 100.0% numeric
  - Examples: 1
- **tips** (`chummer/tips/tip/required/allof/attribute/val`): 100.0% numeric
  - Examples: 1, 1
- **tips** (`chummer/tips/tip/required/allof/skilltotal/val`): 100.0% numeric
  - Examples: 13, 8
- **tips** (`chummer/tips/tip/required/oneof/skill/val`): 100.0% numeric
  - Examples: 6, 6, 6
- **tips** (`chummer/tips/tip/forbidden/oneof/skill/val`): 100.0% numeric
  - Examples: 6
- **traditions** (`chummer/traditions/tradition/bonus/spellcategory/val`): 100.0% numeric
  - Examples: 3, 2, -2
- **traditions** (`chummer/traditions/tradition/required/skill/val`): 100.0% numeric
  - Examples: 1

### value
- **armor** (`chummer/armors/armor/bonus/limitmodifier/value`): 100.0% numeric
  - Examples: 2, -1, -1
- **armor** (`chummer/armors/armor/wirelessbonus/limitmodifier/value`): 100.0% numeric
  - Examples: 1, 1, 1
- **armor** (`chummer/mods/mod/wirelessbonus/limitmodifier/value`): 100.0% numeric
  - Examples: 1
- **bioware** (`chummer/biowares/bioware/bonus/weaponaccuracy/value`): 100.0% numeric
  - Examples: 2
- **cyberware** (`chummer/cyberwares/cyberware/wirelessbonus/limitmodifier/value`): 100.0% numeric
  - Examples: 1, 1, 1
- **cyberware** (`chummer/cyberwares/cyberware/pairbonus/limitmodifier/value`): 100.0% numeric
  - Examples: 1, -1, -2
- **cyberware** (`chummer/cyberwares/cyberware/pairbonus/weaponaccuracy/value`): 100.0% numeric
  - Examples: 1
- **cyberware** (`chummer/cyberwares/cyberware/bonus/weaponskillaccuracy/value`): 100.0% numeric
  - Examples: 1
- **drugcomponents** (`chummer/drugs/drug/bonus/attribute/value`): 100.0% numeric
  - Examples: 1, 1, 1
- **drugcomponents** (`chummer/drugs/drug/bonus/limit/value`): 100.0% numeric
  - Examples: -1, -1, -1
- **drugcomponents** (`chummer/drugcomponents/drugcomponent/effects/effect/attribute/value`): 100.0% numeric
  - Examples: 2, -2, 1
- **drugcomponents** (`chummer/drugcomponents/drugcomponent/effects/effect/limit/value`): 100.0% numeric
  - Examples: 1, -1, -1
- **echoes** (`chummer/echoes/echo/bonus/limitmodifier/value`): 100.0% numeric
  - Examples: 2
- **options** (`chummer/availmap/avail/value`): 100.0% numeric
  - Examples: 100.0, 1000.0, 10000.0
- **paragons** (`chummer/mentors/mentor/bonus/weaponskillaccuracy/value`): 100.0% numeric
  - Examples: 1, 1, 1
- **powers** (`chummer/powers/power/bonus/weaponskillaccuracy/value`): 100.0% numeric
  - Examples: 1
- **powers** (`chummer/powers/power/bonus/weaponcategorydice/category/value`): 100.0% numeric
  - Examples: 1
- **priorities** (`chummer/priorities/priority/metatypes/metatype/value`): 100.0% numeric
  - Examples: 4, 9, 8
- **priorities** (`chummer/priorities/priority/metatypes/metatype/metavariants/metavariant/value`): 100.0% numeric
  - Examples: 4, 4, 4
- **qualities** (`chummer/qualities/quality/costdiscount/value`): 100.0% numeric
  - Examples: -3, -10, 10
- **qualities** (`chummer/qualities/quality/bonus/limitmodifier/value`): 100.0% numeric
  - Examples: 1, 1, 1
- **qualities** (`chummer/qualities/quality/bonus/weaponskillaccuracy/value`): 100.0% numeric
  - Examples: 1

### version
- **actions** (`chummer/version`): 100.0% numeric
  - Examples: 0

### walk
- **critters** (`chummer/metatypes/metatype/walk`): 100.0% numeric
  - Examples: 2/1/0, 2/1/0, 3/1/0
- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/walk`): 100.0% numeric
  - Examples: 2/2/2, 2/2/2, 2/2/2
- **metatypes** (`chummer/metatypes/metatype/walk`): 100.0% numeric
  - Examples: 2/1/0, 2/1/0, 2/1/0
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/walk`): 100.0% numeric
  - Examples: 2/1/0, 1/1/0, 1/1/0
- **traditions** (`chummer/spirits/spirit/walk`): 100.0% numeric
  - Examples: 2/1/0, 2/1/0, 2/1/0
- **vessels** (`chummer/metatypes/metatype/walk`): 100.0% numeric
  - Examples: 0/0/0, 0/0/0, 0/0/0

### weaponmodslots
- **vehicles** (`chummer/vehicles/vehicle/weaponmodslots`): 100.0% numeric
  - Examples: 3, 4, -7

### weight
- **weapons** (`chummer/weapons/weapon/weight`): 100.0% numeric
  - Examples: 60, 80

### wilaug
- **metatypes** (`chummer/metatypes/metatype/wilaug`): 100.0% numeric
  - Examples: 10, 10, 11
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/wilaug`): 100.0% numeric
  - Examples: 10, 10, 10
- **vessels** (`chummer/metatypes/metatype/wilaug`): 100.0% numeric
  - Examples: 0, 0, 0

### wilmax
- **metatypes** (`chummer/metatypes/metatype/wilmax`): 100.0% numeric
  - Examples: 6, 6, 7
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/wilmax`): 100.0% numeric
  - Examples: 6, 6, 6
- **vessels** (`chummer/metatypes/metatype/wilmax`): 100.0% numeric
  - Examples: 0, 0, 0

### wilmin
- **metatypes** (`chummer/metatypes/metatype/wilmin`): 100.0% numeric
  - Examples: 1, 1, 2
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/wilmin`): 100.0% numeric
  - Examples: 1, 1, 1
- **vessels** (`chummer/metatypes/metatype/wilmin`): 100.0% numeric
  - Examples: 0, 0, 0

## Boolean Type Candidates

Found 341 fields that should be boolean types (≥90% boolean).

### D
- **priorities** (`chummer/priortysumtotenvalues/D`): 100.0% boolean
  - Examples: 1

### E
- **priorities** (`chummer/priortysumtotenvalues/E`): 100.0% boolean
  - Examples: 0

### addtoselected
- **spells** (`chummer/spells/spell/bonus/addspirit/addtoselected`): 100.0% boolean
  - Examples: False, False, False

### adept
- **metamagic** (`chummer/metamagics/metamagic/adept`): 100.0% boolean
  - Examples: True, False, False

### adeptpowerpoints
- **metamagic** (`chummer/metamagics/metamagic/bonus/adeptpowerpoints`): 100.0% boolean
  - Examples: 1
- **qualities** (`chummer/qualities/quality/bonus/adeptpowerpoints`): 100.0% boolean
  - Examples: 1

### agi
- **streams** (`chummer/spirits/spirit/agi`): 100.0% boolean
  - Examples: 0, 0, 0

### agiaug
- **vessels** (`chummer/metatypes/metatype/agiaug`): 100.0% boolean
  - Examples: 0, 0, 0

### agimax
- **vessels** (`chummer/metatypes/metatype/agimax`): 100.0% boolean
  - Examples: 0, 0, 0

### agimin
- **vessels** (`chummer/metatypes/metatype/agimin`): 100.0% boolean
  - Examples: 0, 0, 0

### allow2ndmaxattribute
- **settings** (`chummer/settings/setting/allow2ndmaxattribute`): 100.0% boolean
  - Examples: False, False, False

### allowaccessory
- **weapons** (`chummer/weapons/weapon/allowaccessory`): 100.0% boolean
  - Examples: False, False, False

### allowbiowaresuites
- **settings** (`chummer/settings/setting/allowbiowaresuites`): 100.0% boolean
  - Examples: False, False, False

### allowbonuslp
- **lifestyles** (`chummer/lifestyles/lifestyle/allowbonuslp`): 100.0% boolean
  - Examples: True

### allowcyberwareessdiscounts
- **settings** (`chummer/settings/setting/allowcyberwareessdiscounts`): 100.0% boolean
  - Examples: False, False, False

### alloweditpartofbaseweapon
- **settings** (`chummer/settings/setting/alloweditpartofbaseweapon`): 100.0% boolean
  - Examples: False, False, False

### allowfreegrids
- **settings** (`chummer/settings/setting/allowfreegrids`): 100.0% boolean
  - Examples: False, False, False

### allowhigherstackedfoci
- **settings** (`chummer/settings/setting/allowhigherstackedfoci`): 100.0% boolean
  - Examples: False, False, False

### allowinitiationincreatemode
- **settings** (`chummer/settings/setting/allowinitiationincreatemode`): 100.0% boolean
  - Examples: False, False, False

### allowpointbuyspecializationsonkarmaskills
- **settings** (`chummer/settings/setting/allowpointbuyspecializationsonkarmaskills`): 100.0% boolean
  - Examples: False, False, False

### allowrename
- **gear** (`chummer/gears/gear/allowrename`): 100.0% boolean
  - Examples: True, True, True

### allowskilldicerolling
- **settings** (`chummer/settings/setting/allowskilldicerolling`): 100.0% boolean
  - Examples: True, True, True

### allowskillregrouping
- **settings** (`chummer/settings/setting/allowskillregrouping`): 100.0% boolean
  - Examples: True, True, True

### allowtechnomancerschooling
- **settings** (`chummer/settings/setting/allowtechnomancerschooling`): 100.0% boolean
  - Examples: False, False, False

### alternatemetatypeattributekarma
- **settings** (`chummer/settings/setting/alternatemetatypeattributekarma`): 100.0% boolean
  - Examples: False, False, False

### ammoslots
- **weapons** (`chummer/accessories/accessory/ammoslots`): 100.0% boolean
  - Examples: 1, 1, 1

### amount
- **qualities** (`chummer/qualities/quality/bonus/restrictedgear/amount`): 100.0% boolean
  - Examples: 1

### applytorating
- **bioware** (`chummer/biowares/bioware/bonus/selectskill/applytorating`): 100.0% boolean
  - Examples: True
- **critterpowers** (`chummer/powers/power/bonus/selectskill/applytorating`): 100.0% boolean
  - Examples: True, True, True
- **critterpowers** (`chummer/powers/power/bonus/specificskill/applytorating`): 100.0% boolean
  - Examples: True, True
- **mentors** (`chummer/mentors/mentor/bonus/selectskill/applytorating`): 100.0% boolean
  - Examples: True, True

### armor
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/bonus/armor`): 100.0% boolean
  - Examples: 1, 1, 1
- **traditions** (`chummer/spirits/spirit/armor`): 100.0% boolean
  - Examples: 0
- **armor** (`chummer/mods/mod/armor`): 94.3% boolean
  - Examples: 0, 0, 4

### armordegredation
- **settings** (`chummer/settings/setting/armordegredation`): 100.0% boolean
  - Examples: False, False, False

### attack
- **echoes** (`chummer/echoes/echo/bonus/livingpersona/attack`): 100.0% boolean
  - Examples: 1
- **gear** (`chummer/gears/gear/required/geardetails/OR/attack`): 100.0% boolean
  - Examples: 0, 0, 0
- **gear** (`chummer/gears/gear/required/geardetails/OR/AND/attack`): 100.0% boolean
  - Examples: 0, 0, 0

### autobackstory
- **settings** (`chummer/settings/setting/autobackstory`): 100.0% boolean
  - Examples: True, True, True

### availability
- **qualities** (`chummer/qualities/quality/bonus/availability`): 100.0% boolean
  - Examples: 1

### bod
- **streams** (`chummer/spirits/spirit/bod`): 100.0% boolean
  - Examples: 0, 0, 0

### bonus
- **armor** (`chummer/armors/armor/wirelessbonus/skillcategory/bonus`): 100.0% boolean
  - Examples: 1, 1, 1
- **armor** (`chummer/armors/armor/wirelessbonus/specificskill/bonus`): 100.0% boolean
  - Examples: 1, 1, 1
- **armor** (`chummer/armors/armor/bonus/specificskill/bonus`): 100.0% boolean
  - Examples: 1, 1
- **bioware** (`chummer/biowares/bioware/bonus/skillattribute/bonus`): 100.0% boolean
  - Examples: 1
- **bioware** (`chummer/biowares/bioware/bonus/skilllinkedattribute/bonus`): 100.0% boolean
  - Examples: 1, 1
- **cyberware** (`chummer/cyberwares/cyberware/wirelessbonus/skillcategory/bonus`): 100.0% boolean
  - Examples: 1
- **cyberware** (`chummer/cyberwares/cyberware/pairbonus/specificskill/bonus`): 100.0% boolean
  - Examples: 1, 1, 1
- **cyberware** (`chummer/cyberwares/cyberware/bonus/skilllinkedattribute/bonus`): 100.0% boolean
  - Examples: 1, 1
- **powers** (`chummer/powers/power/bonus/weaponcategorydv/bonus`): 100.0% boolean
  - Examples: 1
- **qualities** (`chummer/qualities/quality/bonus/weaponcategorydv/bonus`): 100.0% boolean
  - Examples: 1

### bp
- **vessels** (`chummer/metatypes/metatype/bp`): 100.0% boolean
  - Examples: 0, 0, 0

### breakskillgroupsincreatemode
- **settings** (`chummer/settings/setting/breakskillgroupsincreatemode`): 100.0% boolean
  - Examples: False, False, False

### canbuywithspellpoints
- **qualities** (`chummer/qualities/quality/canbuywithspellpoints`): 100.0% boolean
  - Examples: True, True, True

### capacity
- **bioware** (`chummer/biowares/bioware/capacity`): 100.0% boolean
  - Examples: 0, 0, 0

### chaaug
- **vessels** (`chummer/metatypes/metatype/chaaug`): 100.0% boolean
  - Examples: 0, 0, 0

### chamax
- **vessels** (`chummer/metatypes/metatype/chamax`): 100.0% boolean
  - Examples: 0, 0, 0

### chamin
- **vessels** (`chummer/metatypes/metatype/chamin`): 100.0% boolean
  - Examples: 0, 0, 0

### chargenlimit
- **qualities** (`chummer/qualities/quality/chargenlimit`): 100.0% boolean
  - Examples: 1

### comforts
- **lifestyles** (`chummer/qualities/quality/comforts`): 100.0% boolean
  - Examples: 1

### comfortsminimum
- **lifestyles** (`chummer/qualities/quality/comfortsminimum`): 100.0% boolean
  - Examples: 1

### compensateskillgroupkarmadifference
- **settings** (`chummer/settings/setting/compensateskillgroupkarmadifference`): 100.0% boolean
  - Examples: False, False, False

### composure
- **bioware** (`chummer/biowares/bioware/bonus/composure`): 100.0% boolean
  - Examples: 1

### conceal
- **weapons** (`chummer/weapons/weapon/required/weapondetails/conceal`): 100.0% boolean
  - Examples: 0, 0, 0
- **weapons** (`chummer/accessories/accessory/forbidden/weapondetails/OR/conceal`): 100.0% boolean
  - Examples: 0
- **weapons** (`chummer/accessories/accessory/required/weapondetails/conceal`): 90.9% boolean
  - Examples: 0, 0, 0

### conditionmonitor
- **vehicles** (`chummer/mods/mod/conditionmonitor`): 100.0% boolean
  - Examples: 1, 1, 1

### contributetobp
- **qualities** (`chummer/qualities/quality/contributetobp`): 100.0% boolean
  - Examples: False

### contributetolimit
- **qualities** (`chummer/qualities/quality/contributetolimit`): 100.0% boolean
  - Examples: False, False, False

### cyberlegmovement
- **settings** (`chummer/settings/setting/cyberlegmovement`): 100.0% boolean
  - Examples: False, False, False

### cyberlimbattributebonuscapoverride
- **settings** (`chummer/settings/setting/cyberlimbattributebonuscapoverride`): 100.0% boolean
  - Examples: True, True, True

### cyberware
- **weapons** (`chummer/weapons/weapon/cyberware`): 100.0% boolean
  - Examples: True, True, True

### dataprocessing
- **echoes** (`chummer/echoes/echo/bonus/livingpersona/dataprocessing`): 100.0% boolean
  - Examples: 1
- **gear** (`chummer/gears/gear/required/geardetails/OR/dataprocessing`): 100.0% boolean
  - Examples: 0, 0
- **gear** (`chummer/gears/gear/required/geardetails/OR/AND/dataprocessing`): 100.0% boolean
  - Examples: 0, 0, 0

### decreaseagiresist
- **bioware** (`chummer/biowares/bioware/bonus/decreaseagiresist`): 100.0% boolean
  - Examples: 1

### decreasebodresist
- **bioware** (`chummer/biowares/bioware/bonus/decreasebodresist`): 100.0% boolean
  - Examples: 1

### decreasecharesist
- **bioware** (`chummer/biowares/bioware/bonus/decreasecharesist`): 100.0% boolean
  - Examples: 1

### decreaseintresist
- **bioware** (`chummer/biowares/bioware/bonus/decreaseintresist`): 100.0% boolean
  - Examples: 1

### decreaselogresist
- **bioware** (`chummer/biowares/bioware/bonus/decreaselogresist`): 100.0% boolean
  - Examples: 1

### decreaserearesist
- **bioware** (`chummer/biowares/bioware/bonus/decreaserearesist`): 100.0% boolean
  - Examples: 1

### decreasestrresist
- **bioware** (`chummer/biowares/bioware/bonus/decreasestrresist`): 100.0% boolean
  - Examples: 1

### decreasewilresist
- **bioware** (`chummer/biowares/bioware/bonus/decreasewilresist`): 100.0% boolean
  - Examples: 1

### default
- **skills** (`chummer/skills/skill/default`): 100.0% boolean
  - Examples: False, False, True
- **skills** (`chummer/knowledgeskills/skill/default`): 100.0% boolean
  - Examples: False, False, False

### dep
- **traditions** (`chummer/spirits/spirit/dep`): 100.0% boolean
  - Examples: 0, 0, 0

### depaug
- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/depaug`): 100.0% boolean
  - Examples: 0, 0, 0
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/depaug`): 98.9% boolean
  - Examples: 0, 0, 0
- **critters** (`chummer/metatypes/metatype/depaug`): 97.4% boolean
  - Examples: 0, 0, 0
- **metatypes** (`chummer/metatypes/metatype/depaug`): 95.2% boolean
  - Examples: 0, 0, 0

### depmax
- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/depmax`): 100.0% boolean
  - Examples: 0, 0, 0
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/depmax`): 98.9% boolean
  - Examples: 0, 0, 0
- **critters** (`chummer/metatypes/metatype/depmax`): 97.4% boolean
  - Examples: 0, 0, 0
- **metatypes** (`chummer/metatypes/metatype/depmax`): 95.2% boolean
  - Examples: 0, 0, 0

### depmin
- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/depmin`): 100.0% boolean
  - Examples: 0, 0, 0
- **metatypes** (`chummer/metatypes/metatype/depmin`): 100.0% boolean
  - Examples: 0, 0, 0
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/depmin`): 100.0% boolean
  - Examples: 0, 0, 0
- **critters** (`chummer/metatypes/metatype/depmin`): 97.4% boolean
  - Examples: 0, 0, 0

### detectionspellresist
- **bioware** (`chummer/biowares/bioware/bonus/detectionspellresist`): 100.0% boolean
  - Examples: 1

### devicerating
- **bioware** (`chummer/grades/grade/devicerating`): 100.0% boolean
  - Examples: 0, 0, 0
- **vehicles** (`chummer/mods/mod/bonus/devicerating`): 100.0% boolean
  - Examples: 1

### directmanaspellresist
- **bioware** (`chummer/biowares/bioware/bonus/directmanaspellresist`): 100.0% boolean
  - Examples: 1

### donotroundessenceinternally
- **settings** (`chummer/settings/setting/donotroundessenceinternally`): 100.0% boolean
  - Examples: False, False, False

### dontdoublequalities
- **settings** (`chummer/settings/setting/dontdoublequalities`): 100.0% boolean
  - Examples: False, False, False

### dontdoublequalityrefunds
- **settings** (`chummer/settings/setting/dontdoublequalityrefunds`): 100.0% boolean
  - Examples: False, False, False

### dontusecyberlimbcalculation
- **settings** (`chummer/settings/setting/dontusecyberlimbcalculation`): 100.0% boolean
  - Examples: False, False, False

### doublecareer
- **qualities** (`chummer/qualities/quality/doublecareer`): 100.0% boolean
  - Examples: False, False, False

### doublecost
- **powers** (`chummer/powers/power/doublecost`): 100.0% boolean
  - Examples: False

### drainresist
- **bioware** (`chummer/biowares/bioware/bonus/drainresist`): 100.0% boolean
  - Examples: 1

### dronearmormultiplierenabled
- **settings** (`chummer/settings/setting/dronearmormultiplierenabled`): 100.0% boolean
  - Examples: False, False, False

### dronemods
- **settings** (`chummer/settings/setting/dronemods`): 100.0% boolean
  - Examples: False, False, False

### dronemodsmaximumpilot
- **settings** (`chummer/settings/setting/dronemodsmaximumpilot`): 100.0% boolean
  - Examples: False, False, False

### duration
- **drugcomponents** (`chummer/drugcomponents/drugcomponent/effects/effect/duration`): 100.0% boolean
  - Examples: 1

### edgaug
- **vessels** (`chummer/metatypes/metatype/edgaug`): 100.0% boolean
  - Examples: 0, 0, 0

### edgecost
- **actions** (`chummer/actions/action/edgecost`): 100.0% boolean
  - Examples: 1, 1

### edgmax
- **vessels** (`chummer/metatypes/metatype/edgmax`): 100.0% boolean
  - Examples: 0, 0, 0

### edgmin
- **vessels** (`chummer/metatypes/metatype/edgmin`): 100.0% boolean
  - Examples: 0, 0, 0
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/edgmin`): 91.2% boolean
  - Examples: 2, 1, 1
- **metatypes** (`chummer/metatypes/metatype/edgmin`): 90.5% boolean
  - Examples: 2, 1, 1

### enabled
- **settings** (`chummer/settings/setting/customdatadirectorynames/customdatadirectoryname/enabled`): 100.0% boolean
  - Examples: True, True, True

### enableenemytracking
- **settings** (`chummer/settings/setting/enableenemytracking`): 100.0% boolean
  - Examples: False, False, False

### enemykarmaqualitylimit
- **settings** (`chummer/settings/setting/enemykarmaqualitylimit`): 100.0% boolean
  - Examples: True, True, True

### enforcecapacity
- **settings** (`chummer/settings/setting/enforcecapacity`): 100.0% boolean
  - Examples: True, True, True

### essaug
- **vessels** (`chummer/metatypes/metatype/essaug`): 100.0% boolean
  - Examples: 0, 0, 0

### esslossreducesmaximumonly
- **settings** (`chummer/settings/setting/esslossreducesmaximumonly`): 100.0% boolean
  - Examples: False, False, False

### essmax
- **vessels** (`chummer/metatypes/metatype/essmax`): 100.0% boolean
  - Examples: 0, 0, 0

### essmin
- **metatypes** (`chummer/metatypes/metatype/essmin`): 100.0% boolean
  - Examples: 0, 0, 0
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/essmin`): 100.0% boolean
  - Examples: 0, 0, 0
- **vessels** (`chummer/metatypes/metatype/essmin`): 100.0% boolean
  - Examples: 0, 0, 0

### exceednegativequalities
- **settings** (`chummer/settings/setting/exceednegativequalities`): 100.0% boolean
  - Examples: False, False, False

### exceednegativequalitieslimit
- **settings** (`chummer/settings/setting/exceednegativequalitieslimit`): 100.0% boolean
  - Examples: True, True, True

### exceednegativequalitiesnobonus
- **settings** (`chummer/settings/setting/exceednegativequalitiesnobonus`): 100.0% boolean
  - Examples: False, False, False

### exceedpositivequalities
- **settings** (`chummer/settings/setting/exceedpositivequalities`): 100.0% boolean
  - Examples: False, False, False

### exceedpositivequalitiescostdoubled
- **settings** (`chummer/settings/setting/exceedpositivequalitiescostdoubled`): 100.0% boolean
  - Examples: False, False, False

### exotic
- **skills** (`chummer/skills/skill/exotic`): 100.0% boolean
  - Examples: True, True, True

### extendanydetectionspell
- **settings** (`chummer/settings/setting/extendanydetectionspell`): 100.0% boolean
  - Examples: False, False, False

### fadingresist
- **bioware** (`chummer/biowares/bioware/bonus/fadingresist`): 100.0% boolean
  - Examples: 1

### firewall
- **echoes** (`chummer/echoes/echo/bonus/livingpersona/firewall`): 100.0% boolean
  - Examples: 1
- **gear** (`chummer/gears/gear/required/geardetails/OR/firewall`): 100.0% boolean
  - Examples: 0, 0
- **gear** (`chummer/gears/gear/required/geardetails/OR/AND/firewall`): 100.0% boolean
  - Examples: 0, 0, 0
- **paragons** (`chummer/mentors/mentor/bonus/livingpersona/firewall`): 100.0% boolean
  - Examples: 1

### forbiddencostmultiplier
- **settings** (`chummer/settings/setting/forbiddencostmultiplier`): 100.0% boolean
  - Examples: 1, 1, 1

### freemartialartspecialization
- **settings** (`chummer/settings/setting/freemartialartspecialization`): 100.0% boolean
  - Examples: False, False, False

### freespiritpowerpointsmag
- **settings** (`chummer/settings/setting/freespiritpowerpointsmag`): 100.0% boolean
  - Examples: False, False, False

### ignoreart
- **settings** (`chummer/settings/setting/ignoreart`): 100.0% boolean
  - Examples: False, False, False

### ignorecomplexformlimit
- **settings** (`chummer/settings/setting/ignorecomplexformlimit`): 100.0% boolean
  - Examples: False, False, False

### ignorerating
- **gear** (`chummer/gears/gear/bonus/selectpowers/selectpower/ignorerating`): 100.0% boolean
  - Examples: True, True, True
- **mentors** (`chummer/mentors/mentor/choices/choice/bonus/selectpowers/selectpower/ignorerating`): 100.0% boolean
  - Examples: True

### implemented
- **qualities** (`chummer/qualities/quality/implemented`): 100.0% boolean
  - Examples: False, False

### increasedimprovedabilitymodifier
- **settings** (`chummer/settings/setting/increasedimprovedabilitymodifier`): 100.0% boolean
  - Examples: False, False, False

### iniaug
- **vessels** (`chummer/metatypes/metatype/iniaug`): 100.0% boolean
  - Examples: 0, 0, 0

### inimax
- **vessels** (`chummer/metatypes/metatype/inimax`): 100.0% boolean
  - Examples: 0, 0, 0

### inimin
- **vessels** (`chummer/metatypes/metatype/inimin`): 100.0% boolean
  - Examples: 0, 0, 0

### initiategrade
- **qualities** (`chummer/qualities/quality/required/allof/initiategrade`): 100.0% boolean
  - Examples: 1
- **tips** (`chummer/tips/tip/forbidden/allof/initiategrade`): 100.0% boolean
  - Examples: 1

### initiative
- **bioware** (`chummer/biowares/bioware/bonus/initiative`): 100.0% boolean
  - Examples: 1, 1

### initiativedice
- **critterpowers** (`chummer/powers/power/bonus/initiativedice`): 100.0% boolean
  - Examples: 1

### initiativepass
- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/bonus/initiativepass`): 100.0% boolean
  - Examples: 1, 1, 1
- **echoes** (`chummer/echoes/echo/bonus/initiativepass`): 100.0% boolean
  - Examples: 1
- **qualities** (`chummer/qualities/quality/bonus/initiativepass`): 100.0% boolean
  - Examples: 1, 1, 1
- **traditions** (`chummer/spirits/spirit/bonus/initiativepass`): 100.0% boolean
  - Examples: 1, 1
- **critters** (`chummer/metatypes/metatype/bonus/initiativepass`): 94.4% boolean
  - Examples: 1, 1, 2

### intaug
- **vessels** (`chummer/metatypes/metatype/intaug`): 100.0% boolean
  - Examples: 0, 0, 0

### intmax
- **vessels** (`chummer/metatypes/metatype/intmax`): 100.0% boolean
  - Examples: 0, 0, 0

### intmin
- **vessels** (`chummer/metatypes/metatype/intmin`): 100.0% boolean
  - Examples: 0, 0, 0
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/intmin`): 90.1% boolean
  - Examples: 1, 1, 1

### isflechetteammo
- **gear** (`chummer/gears/gear/isflechetteammo`): 100.0% boolean
  - Examples: True, True

### isquality
- **martialarts** (`chummer/martialarts/martialart/isquality`): 100.0% boolean
  - Examples: True

### judgeintentionsdefense
- **bioware** (`chummer/biowares/bioware/bonus/judgeintentionsdefense`): 100.0% boolean
  - Examples: 1

### karma
- **critters** (`chummer/metatypes/metatype/karma`): 100.0% boolean
  - Examples: 0, 0, 0
- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/karma`): 100.0% boolean
  - Examples: 0, 0, 0

### karmacomplexformskillsoft
- **settings** (`chummer/settings/setting/karmacost/karmacomplexformskillsoft`): 100.0% boolean
  - Examples: 1, 1, 1

### karmacontact
- **settings** (`chummer/settings/setting/karmacost/karmacontact`): 100.0% boolean
  - Examples: 1, 1, 1

### karmaenemy
- **settings** (`chummer/settings/setting/karmacost/karmaenemy`): 100.0% boolean
  - Examples: 1, 1, 1

### karmaimprovecomplexform
- **settings** (`chummer/settings/setting/karmacost/karmaimprovecomplexform`): 100.0% boolean
  - Examples: 1, 1, 1

### karmaimproveknowledgeskill
- **settings** (`chummer/settings/setting/karmacost/karmaimproveknowledgeskill`): 100.0% boolean
  - Examples: 1, 1, 1

### karmaleavegroup
- **settings** (`chummer/settings/setting/karmacost/karmaleavegroup`): 100.0% boolean
  - Examples: 1, 1, 1

### karmanewknowledgeskill
- **settings** (`chummer/settings/setting/karmacost/karmanewknowledgeskill`): 100.0% boolean
  - Examples: 1, 1, 1

### karmaquality
- **settings** (`chummer/settings/setting/karmacost/karmaquality`): 100.0% boolean
  - Examples: 1, 1, 1

### karmaspirit
- **settings** (`chummer/settings/setting/karmacost/karmaspirit`): 100.0% boolean
  - Examples: 1, 1, 1

### levels
- **powers** (`chummer/powers/power/levels`): 100.0% boolean
  - Examples: True, False, True

### licenserestricted
- **settings** (`chummer/settings/setting/licenserestricted`): 100.0% boolean
  - Examples: False, False, False

### limit
- **metamagic** (`chummer/metamagics/metamagic/limit`): 100.0% boolean
  - Examples: False

### limitspiritchoices
- **traditions** (`chummer/traditions/tradition/limitspiritchoices`): 100.0% boolean
  - Examples: False

### logaug
- **vessels** (`chummer/metatypes/metatype/logaug`): 100.0% boolean
  - Examples: 0, 0, 0

### logmax
- **vessels** (`chummer/metatypes/metatype/logmax`): 100.0% boolean
  - Examples: 0, 0, 0

### logmin
- **vessels** (`chummer/metatypes/metatype/logmin`): 100.0% boolean
  - Examples: 0, 0, 0
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/logmin`): 95.0% boolean
  - Examples: 1, 1, 1
- **metatypes** (`chummer/metatypes/metatype/logmin`): 90.5% boolean
  - Examples: 1, 1, 1

### loyalty
- **qualities** (`chummer/qualities/quality/bonus/addcontact/loyalty`): 100.0% boolean
  - Examples: 1

### magaug
- **vessels** (`chummer/metatypes/metatype/magaug`): 100.0% boolean
  - Examples: 0, 0, 0

### magician
- **metamagic** (`chummer/metamagics/metamagic/magician`): 100.0% boolean
  - Examples: False, True, True

### magmax
- **vessels** (`chummer/metatypes/metatype/magmax`): 100.0% boolean
  - Examples: 0, 0, 0

### magmin
- **metatypes** (`chummer/metatypes/metatype/magmin`): 100.0% boolean
  - Examples: 1, 1, 1
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/magmin`): 100.0% boolean
  - Examples: 1, 1, 1
- **vessels** (`chummer/metatypes/metatype/magmin`): 100.0% boolean
  - Examples: 0, 0, 0

### manaillusionresist
- **bioware** (`chummer/biowares/bioware/bonus/manaillusionresist`): 100.0% boolean
  - Examples: 1

### matrixinitiativedice
- **gear** (`chummer/gears/gear/bonus/matrixinitiativedice`): 100.0% boolean
  - Examples: 1

### matrixinitiativediceadd
- **echoes** (`chummer/echoes/echo/bonus/matrixinitiativediceadd`): 100.0% boolean
  - Examples: 1

### max
- **cyberware** (`chummer/cyberwares/cyberware/bonus/specificattribute/max`): 100.0% boolean
  - Examples: 1
- **qualities** (`chummer/qualities/quality/bonus/selectskill/max`): 100.0% boolean
  - Examples: 1
- **bioware** (`chummer/biowares/bioware/bonus/specificattribute/max`): 90.0% boolean
  - Examples: Rating, 1, 1

### maximumarmormodifications
- **settings** (`chummer/settings/setting/maximumarmormodifications`): 100.0% boolean
  - Examples: False, False, False

### maxrating
- **gear** (`chummer/gears/gear/gears/usegear/maxrating`): 100.0% boolean
  - Examples: 1

### mentallimit
- **qualities** (`chummer/qualities/quality/bonus/mentallimit`): 100.0% boolean
  - Examples: 1

### mentalmanipulationresist
- **bioware** (`chummer/biowares/bioware/bonus/mentalmanipulationresist`): 100.0% boolean
  - Examples: 1

### metagenic
- **qualities** (`chummer/qualities/quality/metagenic`): 100.0% boolean
  - Examples: True, True, True

### metatypecostskarma
- **settings** (`chummer/settings/setting/metatypecostskarma`): 100.0% boolean
  - Examples: True, True, True

### metatypecostskarmamultiplier
- **settings** (`chummer/settings/setting/metatypecostskarmamultiplier`): 100.0% boolean
  - Examples: 1, 1, 1

### min
- **ranges** (`chummer/ranges/range/min`): 93.5% boolean
  - Examples: 0, 0, 0

### mininitiativedice
- **settings** (`chummer/settings/setting/mininitiativedice`): 100.0% boolean
  - Examples: 1, 1, 1

### months
- **packs** (`chummer/packs/pack/lifestyles/lifestyle/months`): 100.0% boolean
  - Examples: 1, 1

### morelethalgameplay
- **settings** (`chummer/settings/setting/morelethalgameplay`): 100.0% boolean
  - Examples: False, False, False

### multiplyforbiddencost
- **settings** (`chummer/settings/setting/multiplyforbiddencost`): 100.0% boolean
  - Examples: False, False, False

### multiplyrestrictedcost
- **settings** (`chummer/settings/setting/multiplyrestrictedcost`): 100.0% boolean
  - Examples: False, False, False

### mutant
- **qualities** (`chummer/qualities/quality/mutant`): 100.0% boolean
  - Examples: True

### mysaddppcareer
- **settings** (`chummer/settings/setting/mysaddppcareer`): 100.0% boolean
  - Examples: False, False, False

### mysadeptsecondmagattribute
- **settings** (`chummer/settings/setting/mysadeptsecondmagattribute`): 100.0% boolean
  - Examples: False, False, False

### nativelanguagelimit
- **qualities** (`chummer/qualities/quality/bonus/nativelanguagelimit`): 100.0% boolean
  - Examples: 1

### noarmorencumbrance
- **settings** (`chummer/settings/setting/noarmorencumbrance`): 100.0% boolean
  - Examples: False, False, False

### nosinglearmorencumbrance
- **settings** (`chummer/settings/setting/nosinglearmorencumbrance`): 100.0% boolean
  - Examples: False, False, False

### notoriety
- **qualities** (`chummer/qualities/quality/firstlevelbonus/notoriety`): 100.0% boolean
  - Examples: 1

### overflow
- **qualities** (`chummer/qualities/quality/bonus/conditionmonitor/overflow`): 100.0% boolean
  - Examples: 1

### pathogencontactresist
- **critterpowers** (`chummer/powers/power/bonus/pathogencontactresist`): 100.0% boolean
  - Examples: 1

### pathogeningestionresist
- **critterpowers** (`chummer/powers/power/bonus/pathogeningestionresist`): 100.0% boolean
  - Examples: 1

### pathogeninhalationresist
- **critterpowers** (`chummer/powers/power/bonus/pathogeninhalationresist`): 100.0% boolean
  - Examples: 1

### pathogeninjectionresist
- **critterpowers** (`chummer/powers/power/bonus/pathogeninjectionresist`): 100.0% boolean
  - Examples: 1

### physical
- **cyberware** (`chummer/cyberwares/cyberware/bonus/conditionmonitor/physical`): 100.0% boolean
  - Examples: 1, 1, 1
- **cyberware** (`chummer/cyberwares/cyberware/pairbonus/conditionmonitor/physical`): 100.0% boolean
  - Examples: 1, 1, 1

### physicallimit
- **bioware** (`chummer/biowares/bioware/bonus/physicallimit`): 100.0% boolean
  - Examples: 1, 1
- **critterpowers** (`chummer/powers/power/bonus/physicallimit`): 100.0% boolean
  - Examples: 1
- **qualities** (`chummer/qualities/quality/bonus/physicallimit`): 100.0% boolean
  - Examples: 1

### priorityspellsasadeptpowers
- **settings** (`chummer/settings/setting/priorityspellsasadeptpowers`): 100.0% boolean
  - Examples: False, False, False

### prototypetranshuman
- **qualities** (`chummer/qualities/quality/bonus/prototypetranshuman`): 100.0% boolean
  - Examples: 1

### qualitylevel
- **lifemodules** (`chummer/modules/module/versions/version/bonus/qualitylevel`): 100.0% boolean
  - Examples: 1, 1, 1

### rangemodifier
- **weapons** (`chummer/accessories/accessory/rangemodifier`): 100.0% boolean
  - Examples: 1

### rating
- **cyberware** (`chummer/cyberwares/cyberware/gears/usegear/rating`): 100.0% boolean
  - Examples: 1, 1
- **drugcomponents** (`chummer/drugs/drug/rating`): 100.0% boolean
  - Examples: 0, 0, 0
- **packs** (`chummer/packs/pack/cyberwares/cyberware/gears/gear/rating`): 100.0% boolean
  - Examples: 1, 1, 1
- **packs** (`chummer/packs/pack/vehicles/vehicle/gears/gear/gears/gear/gears/gear/rating`): 100.0% boolean
  - Examples: 1, 1
- **vehicles** (`chummer/weaponmountmods/mod/rating`): 100.0% boolean
  - Examples: 0, 0, 0
- **weapons** (`chummer/accessories/accessory/rating`): 95.4% boolean
  - Examples: 0, 0, 0
- **critterpowers** (`chummer/powers/power/rating`): 90.0% boolean
  - Examples: True, True, True

### rc
- **weapons** (`chummer/weapons/weapon/rc`): 94.9% boolean
  - Examples: 0, 0, 0

### rcdeployable
- **weapons** (`chummer/accessories/accessory/rcdeployable`): 100.0% boolean
  - Examples: True, True, True

### rea
- **streams** (`chummer/spirits/spirit/rea`): 100.0% boolean
  - Examples: 0, 0, 0

### reaaug
- **vessels** (`chummer/metatypes/metatype/reaaug`): 100.0% boolean
  - Examples: 0, 0, 0

### reach
- **bioware** (`chummer/biowares/bioware/pairbonus/reach`): 100.0% boolean
  - Examples: 1, 1, 1
- **critters** (`chummer/metatypes/metatype/bonus/enabletab/reach`): 100.0% boolean
  - Examples: 1, 1
- **metatypes** (`chummer/metatypes/metatype/bonus/reach`): 100.0% boolean
  - Examples: 1
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/bonus/reach`): 100.0% boolean
  - Examples: 1, 1, 1
- **weapons** (`chummer/accessories/accessory/reach`): 100.0% boolean
  - Examples: 1
- **weapons** (`chummer/weapons/weapon/reach`): 96.2% boolean
  - Examples: 0, 0, 0

### reamax
- **vessels** (`chummer/metatypes/metatype/reamax`): 100.0% boolean
  - Examples: 0, 0, 0

### reamin
- **vessels** (`chummer/metatypes/metatype/reamin`): 100.0% boolean
  - Examples: 0, 0, 0
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/reamin`): 95.4% boolean
  - Examples: 1, 1, 1

### requiresflymovement
- **skills** (`chummer/skills/skill/requiresflymovement`): 100.0% boolean
  - Examples: True

### requiresgroundmovement
- **skills** (`chummer/skills/skill/requiresgroundmovement`): 100.0% boolean
  - Examples: True

### requiresswimmovement
- **skills** (`chummer/skills/skill/requiresswimmovement`): 100.0% boolean
  - Examples: True

### res
- **traditions** (`chummer/spirits/spirit/res`): 100.0% boolean
  - Examples: 0, 0, 0

### resaug
- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/resaug`): 100.0% boolean
  - Examples: 0, 0, 0
- **vessels** (`chummer/metatypes/metatype/resaug`): 100.0% boolean
  - Examples: 0, 0, 0

### resmax
- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/resmax`): 100.0% boolean
  - Examples: 0, 0, 0
- **vessels** (`chummer/metatypes/metatype/resmax`): 100.0% boolean
  - Examples: 0, 0, 0

### resmin
- **critters** (`chummer/metatypes/metatype/metavariants/metavariant/resmin`): 100.0% boolean
  - Examples: 0, 0, 0
- **metatypes** (`chummer/metatypes/metatype/resmin`): 100.0% boolean
  - Examples: 1, 1, 1
- **metatypes** (`chummer/metatypes/metatype/metavariants/metavariant/resmin`): 100.0% boolean
  - Examples: 1, 1, 1
- **vessels** (`chummer/metatypes/metatype/resmin`): 100.0% boolean
  - Examples: 0, 0, 0

### restrictedcostmultiplier
- **settings** (`chummer/settings/setting/restrictedcostmultiplier`): 100.0% boolean
  - Examples: 1, 1, 1

### restrictrecoil
- **settings** (`chummer/settings/setting/restrictrecoil`): 100.0% boolean
  - Examples: True, True, True

### reverseattributepriorityorder
- **settings** (`chummer/settings/setting/reverseattributepriorityorder`): 100.0% boolean
  - Examples: False, False, False

### seats
- **vehicles** (`chummer/mods/mod/required/vehicledetails/seats`): 100.0% boolean
  - Examples: 1

### security
- **lifestyles** (`chummer/qualities/quality/security`): 100.0% boolean
  - Examples: 1

### securityminimum
- **lifestyles** (`chummer/qualities/quality/securityminimum`): 100.0% boolean
  - Examples: 1

### short
- **ranges** (`chummer/modifiers/short`): 100.0% boolean
  - Examples: 0

### skillgroupqty
- **priorities** (`chummer/priorities/priority/talents/talent/skillgroupqty`): 100.0% boolean
  - Examples: 1, 1, 1

### sleaze
- **echoes** (`chummer/echoes/echo/bonus/livingpersona/sleaze`): 100.0% boolean
  - Examples: 1
- **gear** (`chummer/gears/gear/required/geardetails/OR/sleaze`): 100.0% boolean
  - Examples: 0, 0, 0
- **gear** (`chummer/gears/gear/required/geardetails/OR/AND/sleaze`): 100.0% boolean
  - Examples: 0, 0, 0

### smartlink
- **gear** (`chummer/gears/gear/bonus/smartlink`): 100.0% boolean
  - Examples: 1, 1

### smartlinkpool
- **gear** (`chummer/gears/gear/weaponbonus/smartlinkpool`): 100.0% boolean
  - Examples: 1

### sociallimit
- **armor** (`chummer/armors/armor/bonus/sociallimit`): 100.0% boolean
  - Examples: 1

### specialkarmacostbasedonshownvalue
- **settings** (`chummer/settings/setting/specialkarmacostbasedonshownvalue`): 100.0% boolean
  - Examples: False, False, False

### specialmodification
- **weapons** (`chummer/accessories/accessory/specialmodification`): 100.0% boolean
  - Examples: True, True, True

### spiritforcebasedontotalmag
- **settings** (`chummer/settings/setting/spiritforcebasedontotalmag`): 100.0% boolean
  - Examples: False, False, False

### stagedpurchase
- **qualities** (`chummer/qualities/quality/stagedpurchase`): 100.0% boolean
  - Examples: True, True, True

### str
- **streams** (`chummer/spirits/spirit/str`): 100.0% boolean
  - Examples: 0, 0, 0

### straug
- **vessels** (`chummer/metatypes/metatype/straug`): 100.0% boolean
  - Examples: 0, 0, 0

### strmax
- **vessels** (`chummer/metatypes/metatype/strmax`): 100.0% boolean
  - Examples: 0, 0, 0

### strmin
- **vessels** (`chummer/metatypes/metatype/strmin`): 100.0% boolean
  - Examples: 0, 0, 0

### submersiongrade
- **qualities** (`chummer/qualities/quality/required/allof/submersiongrade`): 100.0% boolean
  - Examples: 1
- **tips** (`chummer/tips/tip/forbidden/allof/submersiongrade`): 100.0% boolean
  - Examples: 1

### thresholdoffset
- **qualities** (`chummer/qualities/quality/bonus/conditionmonitor/thresholdoffset`): 100.0% boolean
  - Examples: 1

### throwstr
- **powers** (`chummer/powers/power/bonus/throwstr`): 100.0% boolean
  - Examples: 1

### toxic
- **critterpowers** (`chummer/powers/power/toxic`): 100.0% boolean
  - Examples: True, True, True

### toxincontactresist
- **critterpowers** (`chummer/powers/power/bonus/toxincontactresist`): 100.0% boolean
  - Examples: 1

### toxiningestionresist
- **critterpowers** (`chummer/powers/power/bonus/toxiningestionresist`): 100.0% boolean
  - Examples: 1

### toxininhalationresist
- **critterpowers** (`chummer/powers/power/bonus/toxininhalationresist`): 100.0% boolean
  - Examples: 1

### toxininjectionresist
- **critterpowers** (`chummer/powers/power/bonus/toxininjectionresist`): 100.0% boolean
  - Examples: 1

### unarmeddv
- **bioware** (`chummer/biowares/bioware/pairbonus/unarmeddv`): 100.0% boolean
  - Examples: 1, 1
- **powers** (`chummer/enhancements/enhancement/bonus/unarmeddv`): 100.0% boolean
  - Examples: 1

### unarmedimprovementsapplytoweapons
- **settings** (`chummer/settings/setting/unarmedimprovementsapplytoweapons`): 100.0% boolean
  - Examples: False, False, False

### unarmedreach
- **bioware** (`chummer/biowares/bioware/bonus/unarmedreach`): 100.0% boolean
  - Examples: 1
- **bioware** (`chummer/biowares/bioware/pairbonus/unarmedreach`): 100.0% boolean
  - Examples: 1
- **martialarts** (`chummer/techniques/technique/bonus/unarmedreach`): 100.0% boolean
  - Examples: 1

### uncappedarmoraccessorybonuses
- **settings** (`chummer/settings/setting/uncappedarmoraccessorybonuses`): 100.0% boolean
  - Examples: False, False, False

### unclampattributeminimum
- **settings** (`chummer/settings/setting/unclampattributeminimum`): 100.0% boolean
  - Examples: False, False, False

### unrestrictednuyen
- **settings** (`chummer/settings/setting/unrestrictednuyen`): 100.0% boolean
  - Examples: False, False, False

### usecalculatedpublicawareness
- **settings** (`chummer/settings/setting/usecalculatedpublicawareness`): 100.0% boolean
  - Examples: False, False, False

### usepointsonbrokengroups
- **settings** (`chummer/settings/setting/usepointsonbrokengroups`): 100.0% boolean
  - Examples: False, False, False

### val
- **bioware** (`chummer/biowares/bioware/bonus/selectskill/val`): 100.0% boolean
  - Examples: 1, 1, 1
- **bioware** (`chummer/biowares/bioware/pairbonus/walkmultiplier/val`): 100.0% boolean
  - Examples: 1, 1
- **cyberware** (`chummer/cyberwares/cyberware/pairbonus/runmultiplier/val`): 100.0% boolean
  - Examples: 1
- **cyberware** (`chummer/cyberwares/cyberware/pairbonus/selectskill/val`): 100.0% boolean
  - Examples: 1
- **echoes** (`chummer/echoes/echo/bonus/specificattribute/val`): 100.0% boolean
  - Examples: 1, 1
- **lifemodules** (`chummer/modules/module/bonus/knowledgeskilllevel/options/val`): 100.0% boolean
  - Examples: 0
- **mentors** (`chummer/mentors/mentor/choices/choice/bonus/selectpowers/selectpower/val`): 100.0% boolean
  - Examples: 1, 1, 1
- **mentors** (`chummer/mentors/mentor/bonus/skillgrouplevel/val`): 100.0% boolean
  - Examples: 1
- **mentors** (`chummer/mentors/mentor/choices/choice/bonus/specificskill/val`): 100.0% boolean
  - Examples: 1
- **paragons** (`chummer/mentors/mentor/bonus/actiondicepool/val`): 100.0% boolean
  - Examples: 1
- **powers** (`chummer/powers/power/bonus/selectlimit/val`): 100.0% boolean
  - Examples: 1
- **qualities** (`chummer/qualities/quality/bonus/knowledgeskillkarmacostmin/val`): 100.0% boolean
  - Examples: 1
- **qualities** (`chummer/qualities/quality/bonus/selectattributes/selectattribute/val`): 100.0% boolean
  - Examples: 1, 1, 1
- **qualities** (`chummer/qualities/quality/bonus/runmultiplier/val`): 100.0% boolean
  - Examples: 1, 1, 1
- **qualities** (`chummer/qualities/quality/bonus/walkmultiplier/val`): 100.0% boolean
  - Examples: 1, 1, 1
- **qualities** (`chummer/qualities/quality/bonus/spellcategorydamage/val`): 100.0% boolean
  - Examples: 1, 1
- **tips** (`chummer/tips/tip/forbidden/allof/skill/val`): 100.0% boolean
  - Examples: 1
- **tips** (`chummer/tips/tip/required/allof/attribute/val`): 100.0% boolean
  - Examples: 1, 1
- **traditions** (`chummer/traditions/tradition/required/skill/val`): 100.0% boolean
  - Examples: 1

### value
- **armor** (`chummer/mods/mod/wirelessbonus/limitmodifier/value`): 100.0% boolean
  - Examples: 1
- **cyberware** (`chummer/cyberwares/cyberware/wirelessbonus/limitmodifier/value`): 100.0% boolean
  - Examples: 1, 1, 1
- **cyberware** (`chummer/cyberwares/cyberware/pairbonus/weaponaccuracy/value`): 100.0% boolean
  - Examples: 1
- **cyberware** (`chummer/cyberwares/cyberware/bonus/weaponskillaccuracy/value`): 100.0% boolean
  - Examples: 1
- **paragons** (`chummer/mentors/mentor/bonus/weaponskillaccuracy/value`): 100.0% boolean
  - Examples: 1, 1, 1
- **powers** (`chummer/powers/power/bonus/weaponskillaccuracy/value`): 100.0% boolean
  - Examples: 1
- **powers** (`chummer/powers/power/bonus/weaponcategorydice/category/value`): 100.0% boolean
  - Examples: 1
- **qualities** (`chummer/qualities/quality/bonus/weaponskillaccuracy/value`): 100.0% boolean
  - Examples: 1

### version
- **actions** (`chummer/version`): 100.0% boolean
  - Examples: 0

### wilaug
- **vessels** (`chummer/metatypes/metatype/wilaug`): 100.0% boolean
  - Examples: 0, 0, 0

### wilmax
- **vessels** (`chummer/metatypes/metatype/wilmax`): 100.0% boolean
  - Examples: 0, 0, 0

### wilmin
- **vessels** (`chummer/metatypes/metatype/wilmin`): 100.0% boolean
  - Examples: 0, 0, 0

## Common Patterns

### Cost Fields

Cost fields often contain expressions like `(Rating * 30)` or simple numbers.

Recommendation: Keep as string to support expressions, or create custom Cost type.


### Availability Fields

Availability fields use format like `6F`, `12R`, `28F` (number + letter).

Recommendation: Create custom Availability type or keep as string.


### Rating Fields

Rating fields are mostly numeric but may contain expressions.

Recommendation: Keep as string or create Rating type that supports expressions.

