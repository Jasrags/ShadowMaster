# Data Verification Report

**Generated:** 2026-01-12T07:12:14.156Z
**Sources:** Core
**Categories:** all

## Summary

- **Total Categories Checked:** 15
- **Total Findings:** 342

### By Priority

| Priority | Count | Description |
|----------|-------|-------------|
| 1 | 38 | Missing items |
| 2 | 14 | Data mismatches |
| 3 | 1 | Duplicates |
| 4 | 289 | Invalid source |
| 5 | 0 | Naming issues |

## Priority 1: Missing Items

### weapons.pistols.light

- **Taurus Omni-6, light pistol rounds**
  - Item from Core not found in JSON
  - Expected: `{"weapon":"Taurus Omni-6, light pistol rounds","acc":5,"dv":6,"ap":"–","modes":"SA","rc":"–","ammo":6,"avail":3,"cost":300,"source":"Core"}`
  - Recommendation: Add "Taurus Omni-6, light pistol rounds" to modules.gear.payload.weapons.pistols

- **Taurus Omni-6, heavy pistol rounds**
  - Item from Core not found in JSON
  - Expected: `{"weapon":"Taurus Omni-6, heavy pistol rounds","acc":5,"dv":7,"ap":-1,"modes":"SS","rc":"–","ammo":6,"avail":3,"cost":300,"source":"Core"}`
  - Recommendation: Add "Taurus Omni-6, heavy pistol rounds" to modules.gear.payload.weapons.pistols

### weapons.pistols.heavy

- **Ares Viper Silvergun**
  - Item from Core not found in JSON
  - Expected: `{"weapon":"Ares Viper Silvergun","acc":4,"dv":9,"ap":4,"modes":"SA/BF","rc":"–","ammo":30,"avail":8,"cost":380,"source":"Core"}`
  - Recommendation: Add "Ares Viper Silvergun" to modules.gear.payload.weapons.pistols

### weapons.pistols.machine

- **Ares Crusader II**
  - Item from Core not found in JSON
  - Expected: `{"weapon":"Ares Crusader II","acc":5,"dv":7,"ap":"–","modes":"SA/BF","rc":2,"ammo":40,"avail":9,"cost":830,"source":"Core"}`
  - Recommendation: Add "Ares Crusader II" to modules.gear.payload.weapons.pistols

- **Ceska Black Scorpion**
  - Item from Core not found in JSON
  - Expected: `{"weapon":"Ceska Black Scorpion","acc":5,"dv":6,"ap":"–","modes":"SA/BF","rc":"– (1)","ammo":35,"avail":6,"cost":270,"source":"Core"}`
  - Recommendation: Add "Ceska Black Scorpion" to modules.gear.payload.weapons.pistols

- **Steyr TMP**
  - Item from Core not found in JSON
  - Expected: `{"weapon":"Steyr TMP","acc":4,"dv":7,"ap":"–","modes":"SA/BF/FA","rc":"–","ammo":30,"avail":8,"cost":350,"source":"Core"}`
  - Recommendation: Add "Steyr TMP" to modules.gear.payload.weapons.pistols

### weapons.shotguns

- **Defiance T-250, short-barreled**
  - Item from Core not found in JSON
  - Expected: `{"weapon":"Defiance T-250, short-barreled","acc":4,"dv":9,"ap":-1,"modes":"SS/SA","rc":"–","ammo":5,"avail":4,"cost":450,"source":"Core"}`
  - Recommendation: Add "Defiance T-250, short-barreled" to modules.gear.payload.weapons.shotguns

### cyberware

- **+1**
  - Item from Core not found in JSON
  - Expected: `{"body boost":1,"armor":1,"unarmed damage":"(STR + 1)P"}`
  - Recommendation: Add "+1" to modules.cyberware.payload.catalog

- **+2**
  - Item from Core not found in JSON
  - Expected: `{"body boost":2,"armor":2,"unarmed damage":"(STR + 2)P"}`
  - Recommendation: Add "+2" to modules.cyberware.payload.catalog

- **+3**
  - Item from Core not found in JSON
  - Expected: `{"body boost":3,"armor":3,"unarmed damage":"(STR + 3)P"}`
  - Recommendation: Add "+3" to modules.cyberware.payload.catalog

### armor

- **-**
  - Item from Core not found in JSON
  - Expected: `{"armor":"-","capacity":"-","avail":"-","cost":20,"source":"Core"}`
  - Recommendation: Add "-" to modules.gear.payload.armor

- **-**
  - Item from Core not found in JSON
  - Expected: `{"armor":"-","capacity":"-","avail":2,"cost":500,"source":"Core"}`
  - Recommendation: Add "-" to modules.gear.payload.armor

- **-**
  - Item from Core not found in JSON
  - Expected: `{"armor":"-","capacity":"-","avail":8,"cost":500,"source":"Core"}`
  - Recommendation: Add "-" to modules.gear.payload.armor

- **Features Increase Social Limit by 2 Wireless Bonus +1 dice pool bonus to Social Tests**
  - Item from Core not found in JSON
  - Expected: `{"armor":"Features Increase Social Limit by 2 Wireless Bonus +1 dice pool bonus to Social Tests","capacity":"Looking forward, expect next year’s designs to host amix of Native American and old American styles as theOlympics, held in Seattle, will be the place to highlightfashion in ’76. Plan 9 Armanté has always been a leader in the armored fashionfield in terms of quality product, but while they manage tobe aces in that category, their lines have absolutely zerointerchangeability. You obviously cannot mix fashionsfrom different years, as they change radically, but evenmixing pieces from the same year is a challenge. The cutsand styles of their pieces look terrible if mixed. Thorn Taking a look back, we can see that Armanté lookedto Sub-Saharan Africa to influence their ’74 line, likelydue to a heavy push on the Kilimanjaro Mass Driver—aproject that still hasn’t been fully brought online, I mightadd. I actually thought Armanté was taking a seriousfashion forward leap in ’73 when they came back onthe scene with a totally retro/post-apocalypse-chic lookpulled from the styles of 1920s America blended withsomething out of an episode of Dark Futures. Bull Dark Futures! I love that show. The “What If?” take onsome of the recent major world events is awesome. Slamm-0!"}`
  - Recommendation: Add "Features Increase Social Limit by 2 Wireless Bonus +1 dice pool bonus to Social Tests" to modules.gear.payload.armor

- **Features Increase Social Limit by 2 Wireless Bonus +1 dice pool bonus to Social Tests**
  - Item from Core not found in JSON
  - Expected: `{"armor":"Features Increase Social Limit by 2 Wireless Bonus +1 dice pool bonus to Social Tests","capacity":"Looking forward, expect next year’s designs to host amix of Native American and old American styles as theOlympics, held in Seattle, will be the place to highlightfashion in ’76. Plan 9 Armanté has always been a leader in the armored fashionfield in terms of quality product, but while they manage tobe aces in that category, their lines have absolutely zerointerchangeability. You obviously cannot mix fashionsfrom different years, as they change radically, but evenmixing pieces from the same year is a challenge. The cutsand styles of their pieces look terrible if mixed. Thorn Taking a look back, we can see that Armanté lookedto Sub-Saharan Africa to influence their ’74 line, likelydue to a heavy push on the Kilimanjaro Mass Driver—aproject that still hasn’t been fully brought online, I mightadd. I actually thought Armanté was taking a seriousfashion forward leap in ’73 when they came back onthe scene with a totally retro/post-apocalypse-chic lookpulled from the styles of 1920s America blended withsomething out of an episode of Dark Futures. Bull Dark Futures! I love that show. The “What If?” take onsome of the recent major world events is awesome. Slamm-0!"}`
  - Recommendation: Add "Features Increase Social Limit by 2 Wireless Bonus +1 dice pool bonus to Social Tests" to modules.gear.payload.armor

- **Features Custom Fit, Newest Model, increase Social Limit by 1 Wireless Bonus Increase Social Limit by 2**
  - Item from Core not found in JSON
  - Expected: `{"armor":"Features Custom Fit, Newest Model, increase Social Limit by 1 Wireless Bonus Increase Social Limit by 2","capacity":"That means the newer suits have better protection, but the older outfits, which you may be able to find in Armand’s Lightly Worn section, will still blend in visually. Thorn"}`
  - Recommendation: Add "Features Custom Fit, Newest Model, increase Social Limit by 1 Wireless Bonus Increase Social Limit by 2" to modules.gear.payload.armor

- **Features Custom Fit Newest Model increase Social Limit by 2**
  - Item from Core not found in JSON
  - Expected: `{"armor":"Features Custom Fit Newest Model increase Social Limit by 2","capacity":"Truth is, no runner needs to buy this line, unless you need to slip into a secure meeting where everyone in the corp is wearing Heritage. This line has become a security feature at a lot of corporate functions in order to limit extractions as anyone present has to be wearing a very expensive outfit. Thorn Wait, Thorn, are you posting from a cell somewhere? Netcat It’s always good to know someone on the inside. But I hope to not be here long. Thorn What you say helps explain why Lightly Worn Heritage pieces would be tough to find. Mika"}`
  - Recommendation: Add "Features Custom Fit Newest Model increase Social Limit by 2" to modules.gear.payload.armor

- **Features Custom Fit increase Social Limit by 1 Wireless Bonus Illuminating (+1,500¥ for IR and contacts)**
  - Item from Core not found in JSON
  - Expected: `{"armor":"Features Custom Fit increase Social Limit by 1 Wireless Bonus Illuminating (+1,500¥ for IR and contacts)","capacity":"This line mainly exists to give you a way to stay armored while blending at high-society functions. The fact that these dresses, as well as the shirts, coat cuffs, and coat lapels, glow makes them extremely contradictory to the idea of SHADOWrunning. Bull Sometimes those in the shadows must step into the light to pull someone down into our darkness. Man-of-Many-Names That was surprisingly clear for you. Perhaps even a little too obvious. Slamm-0!"}`
  - Recommendation: Add "Features Custom Fit increase Social Limit by 1 Wireless Bonus Illuminating (+1,500¥ for IR and contacts)" to modules.gear.payload.armor

- **Features Custom Fit (Stack) Newest Model Ruthenium Polymer Coating 4**
  - Item from Core not found in JSON
  - Expected: `{"armor":"Features Custom Fit (Stack) Newest Model Ruthenium Polymer Coating 4","capacity":"Story time. I was making an extraction from a beach of an exec’s wife. She was there sunbathing with two of her girlfriends, string bikinis all around. I walked up, flashed my palm pistol, and then asked Mrs. Exec to come quietly. All of a sudden the girlfriend on the right is naked. Poof, bikini is gone. The distraction was enough for the other girlfriend to kick up a footfull of sand in my face. The brawl started after that, and I was not happy to discover that both of her “girlfriends” were wearing Second Skin. Kane Never seen boobies before, Kane-o? Slamm-0! Plenty, including your mother’s. Kane"}`
  - Recommendation: Add "Features Custom Fit (Stack) Newest Model Ruthenium Polymer Coating 4" to modules.gear.payload.armor

- **Features Custom Protection (6) Holster Gear Access Wireless Bonus +1 dice pool bonus to Survival Tests in Custom Protection terrain.**
  - Item from Core not found in JSON
  - Expected: `{"armor":"Features Custom Protection (6) Holster Gear Access Wireless Bonus +1 dice pool bonus to Survival Tests in Custom Protection terrain.","capacity":"Beware the camo/environmental match-ups on the Lightly Worn versions of these. Not everyone buys them and uses them for the same things. Usually they match up, but sometimes you have winter camo with fireproofing instead of cold insulation. When you buy it new, you get to be the one who makes those calls. Hard Exit"}`
  - Recommendation: Add "Features Custom Protection (6) Holster Gear Access Wireless Bonus +1 dice pool bonus to Survival Tests in Custom Protection terrain." to modules.gear.payload.armor

- **Features Increase Social Limit by 1 (when wearing clothing suited to a particular corporate environment) Gear Access Wireless Bonus +1 dice pool bonus to Social Tests when worn within the appropriate corp.**
  - Item from Core not found in JSON
  - Expected: `{"armor":"Features Increase Social Limit by 1 (when wearing clothing suited to a particular corporate environment) Gear Access Wireless Bonus +1 dice pool bonus to Social Tests when worn within the appropriate corp.","capacity":"Or things that look like the right equipment. These outfits are great for getting past guards without firing a shot and then putting your gun together on the back end to get out when the trouble starts. Ma’fan"}`
  - Recommendation: Add "Features Increase Social Limit by 1 (when wearing clothing suited to a particular corporate environment) Gear Access Wireless Bonus +1 dice pool bonus to Social Tests when worn within the appropriate corp." to modules.gear.payload.armor

- **Features Custom Fit Custom Protection (6) Holster Gear Access Wireless Bonus +1 dice pool bonus to Survival Tests (when in terrain addressed with Custom Protection).**
  - Item from Core not found in JSON
  - Expected: `{"armor":"Features Custom Fit Custom Protection (6) Holster Gear Access Wireless Bonus +1 dice pool bonus to Survival Tests (when in terrain addressed with Custom Protection).","capacity":"This is not the line to wear in the hub of any urban sprawl, but out in the barrens, or in some of our less civilized sprawls around the world, these clothes can fit in just fine. Stone"}`
  - Recommendation: Add "Features Custom Fit Custom Protection (6) Holster Gear Access Wireless Bonus +1 dice pool bonus to Survival Tests (when in terrain addressed with Custom Protection)." to modules.gear.payload.armor

- **Features Increase Social Limit (Elite +1, +600¥; Platinum +2, +1,100¥; Diamond +3, +2,400¥)**
  - Item from Core not found in JSON
  - Expected: `{"armor":"Features Increase Social Limit (Elite +1, +600¥; Platinum +2, +1,100¥; Diamond +3, +2,400¥)","capacity":"Not fashionable at all, but it blends in around almost every place in any ‘plex. Sunshine The three upper lines look almost the same as the basic line, with the main differences being on the inside tags, monograms, and price tags. If you want to blend in working out at the Ares Executive gym, you’ll need those upper-line touches. If you don’t think management types notice that sort of thing, you haven’t met enough management types. Sticks Just so everyone is up to speed, this line no longer has the Restraint Melter option after a few dozen of the units malfunctioned and burned through their wearer’s wrists. Pistons That was one of the most effective covert ops I’ve ever seen pulled off. The units that “malfunctioned” had all been tampered with at manufacturing sites all over the globe. Ares started their own back-end investigation, but cut it off before they found who was responsible. It wasn’t worth the loss to the bottom line. Just goes to show, if you do your job right, you really can stay in the shadows. Hanibelle"}`
  - Recommendation: Add "Features Increase Social Limit (Elite +1, +600¥; Platinum +2, +1,100¥; Diamond +3, +2,400¥)" to modules.gear.payload.armor

- **+3**
  - Item from Core not found in JSON
  - Expected: `{"armor":3,"capacity":6,"avail":"-","cost":500,"source":"Core"}`
  - Recommendation: Add "+3" to modules.gear.payload.armor

- **-**
  - Item from Core not found in JSON
  - Expected: `{"armor":"-","capacity":"-","avail":6,"cost":6000,"source":"Core"}`
  - Recommendation: Add "-" to modules.gear.payload.armor

- **-**
  - Item from Core not found in JSON
  - Expected: `{"armor":"-","capacity":"-","avail":3,"cost":1000,"source":"Core"}`
  - Recommendation: Add "-" to modules.gear.payload.armor

- **+2**
  - Item from Core not found in JSON
  - Expected: `{"armor":2,"capacity":2,"avail":"-","cost":100,"source":"Core"}`
  - Recommendation: Add "+2" to modules.gear.payload.armor

- **+2**
  - Item from Core not found in JSON
  - Expected: `{"armor":2,"capacity":6,"avail":"-","cost":100,"source":"Core"}`
  - Recommendation: Add "+2" to modules.gear.payload.armor

- **+6**
  - Item from Core not found in JSON
  - Expected: `{"armor":6,"capacity":6,"avail":12,"cost":1200,"source":"Core"}`
  - Recommendation: Add "+6" to modules.gear.payload.armor

- **+6**
  - Item from Core not found in JSON
  - Expected: `{"armor":6,"capacity":6,"avail":10,"cost":1500,"source":"Core"}`
  - Recommendation: Add "+6" to modules.gear.payload.armor

- **Features Custom Fit, Concealability (–6)**
  - Item from Core not found in JSON
  - Expected: `{"armor":"Features Custom Fit, Concealability (–6)","capacity":"I had a really nice set of this stored from my last female turn, but I have to get it adjusted. You wouldn’t think a few millimeters of fur would make a difference, but it does. Plan 9 So you’re back to male again? Turbo Bunny Yep. Still adjusting to all the itchiness from the hair. Plan 9 And the chorus of voices in your head? Turbo Bunny Sing in sweet harmony. Plan 9"}`
  - Recommendation: Add "Features Custom Fit, Concealability (–6)" to modules.gear.payload.armor

- **Features Increase Social Limit by 2 in emergency situations, Fire Resistance 8, Restrictive Wireless Bonus +1 dice pool bonus to Social Tests to calm or pacify an individual at the site of an emergency.**
  - Item from Core not found in JSON
  - Expected: `{"armor":"Features Increase Social Limit by 2 in emergency situations, Fire Resistance 8, Restrictive Wireless Bonus +1 dice pool bonus to Social Tests to calm or pacify an individual at the site of an emergency.","capacity":"This is the armor for the creative runner looking for access to a site where emergency personnel are milling about. It’s not just about running into active fires—you can use this anywhere firefighters can go, once the alarm has been pulled. Combine it with the right credentials and you’re one false alarm away from access to almost anywhere. Thorn"}`
  - Recommendation: Add "Features Increase Social Limit by 2 in emergency situations, Fire Resistance 8, Restrictive Wireless Bonus +1 dice pool bonus to Social Tests to calm or pacify an individual at the site of an emergency." to modules.gear.payload.armor

- **Features Padded, Increase Social Limit by 1 for Intimidation Tests, Restrictive Wireless Bonus Increase Social Limit by 2 for Intimidation Tests**
  - Item from Core not found in JSON
  - Expected: `{"armor":"Features Padded, Increase Social Limit by 1 for Intimidation Tests, Restrictive Wireless Bonus Increase Social Limit by 2 for Intimidation Tests","capacity":"Armand’s right that it’s mostly about intimidation, but it’s still great protection. The stuff is so fluffy it’s hard to tell the man from the armor. It’s certainly not the best to wear in most social situations (if only because every time you turn around you’ll knock over all the drinks), but it has its place in the world. Picador"}`
  - Recommendation: Add "Features Padded, Increase Social Limit by 1 for Intimidation Tests, Restrictive Wireless Bonus Increase Social Limit by 2 for Intimidation Tests" to modules.gear.payload.armor

- **Features Gear Access, Increase Social Limit by 2 for Intimidation Tests and reduce it by 1 for all other Social Tests with the general public Wireless Bonus Increase Social Limit by 3 for Intimidation Tests**
  - Item from Core not found in JSON
  - Expected: `{"armor":"Features Gear Access, Increase Social Limit by 2 for Intimidation Tests and reduce it by 1 for all other Social Tests with the general public Wireless Bonus Increase Social Limit by 3 for Intimidation Tests","capacity":"Close to the protective value of security armor but not quite, this stuff really shows its value in how easy it is to organize your tac gear. Stone"}`
  - Recommendation: Add "Features Gear Access, Increase Social Limit by 2 for Intimidation Tests and reduce it by 1 for all other Social Tests with the general public Wireless Bonus Increase Social Limit by 3 for Intimidation Tests" to modules.gear.payload.armor

- **Features Decrease Social Limit by 1 when worn, Concealability (–6), Restrictive**
  - Item from Core not found in JSON
  - Expected: `{"armor":"Features Decrease Social Limit by 1 when worn, Concealability (–6), Restrictive","capacity":"It’s a handy backup and rarely gets a second glance lying around the doss or even thrown over a shoulder on a stroll in the heart of the sprawl. Sticks My biggest issue with this piece is how embarrassing you look when you throw it on. Deranged squatters in the Barrens look better than people wearing this shapeless mess. /dev/grrl Luckily it’s intended to save your hide, not get you best dressed at the corp ball. Sticks"}`
  - Recommendation: Add "Features Decrease Social Limit by 1 when worn, Concealability (–6), Restrictive" to modules.gear.payload.armor

- **Features Custom Fit, Padded, increase Social Limit by 1 when dealing with gang members, decrease Social Limit by 1 when dealing with the general public.**
  - Item from Core not found in JSON
  - Expected: `{"armor":"Features Custom Fit, Padded, increase Social Limit by 1 when dealing with gang members, decrease Social Limit by 1 when dealing with the general public.","capacity":"Who would order more than eight pieces? /dev/grrl Anyone looking to give cheap protection to a large group of people for relatively cheap without drawing law enforcement’s attention. So, gangs. Some of those ganger leathers are actually this stuff. There’s added protection, and while it’s cheaper than some forms of armor it’s a hell of a lot more expensive than a simple leather jacket. Spending that money tells your members and other people who know your gang that you’re on the rise. 2XL"}`
  - Recommendation: Add "Features Custom Fit, Padded, increase Social Limit by 1 when dealing with gang members, decrease Social Limit by 1 when dealing with the general public." to modules.gear.payload.armor

- **Features Flashpak (10 charges; recharges 1 charge every 10 seconds when connected to a power source. Requires a Complex Action to activate). Wireless Bonus Setting off the Flashpak is a Simple Action.**
  - Item from Core not found in JSON
  - Expected: `{"armor":"Features Flashpak (10 charges; recharges 1 charge every 10 seconds when connected to a power source. Requires a Complex Action to activate). Wireless Bonus Setting off the Flashpak is a Simple Action.","capacity":"Not exactly a necessity, but it’s good to be aware of these pieces when you’re looking at the sec-team stomping in to break up your latest frag up. Just keep an eye out for the ocular device, usually located in the middle of the shield, that sets off the flashing. Identifying it is the first step to stopping it or avoiding it. DangerSensei Every time I stop in to see Sparks, a ganger pal of mine with the Tesla Armageddon, I get a chuckle at these things leaned all over the place. And gang scuffles are quite the sight as those guys turn it into a strobe rave and zap everything in sight. 2XL"}`
  - Recommendation: Add "Features Flashpak (10 charges; recharges 1 charge every 10 seconds when connected to a power source. Requires a Complex Action to activate). Wireless Bonus Setting off the Flashpak is a Simple Action." to modules.gear.payload.armor

- **Features Biomonitor, Custom Fit, Holster Special Rules Characters shot while wearing Murder Armor may use an Interrupt Action (–5 Initiative Score) to play dead with an opposed Charisma + Performance [Social] vs. Intuition + Perception [Mental] Test. Use of this armor imposes a –4 dice pool penalty on the observer. Success means the observer ignores the character assuming they are down, and so they get no Defense Test against the character’s next attack. Gorepak replacement requires a Logic + Armorer [Mental] (4, 1 hour) Extended Test.**
  - Item from Core not found in JSON
  - Expected: `{"armor":"Features Biomonitor, Custom Fit, Holster Special Rules Characters shot while wearing Murder Armor may use an Interrupt Action (–5 Initiative Score) to play dead with an opposed Charisma + Performance [Social] vs. Intuition + Perception [Mental] Test. Use of this armor imposes a –4 dice pool penalty on the observer. Success means the observer ignores the character assuming they are down, and so they get no Defense Test against the character’s next attack. Gorepak replacement requires a Logic + Armorer [Mental] (4, 1 hour) Extended Test.","capacity":"The twisted mind behind this stuff is a genius. Now mind you, it doesn’t work against real pros who put a bullet through the brainpan to make sure no one is left to come after them. It is great against gangers though, and even average corpsec officers who see a lot of blood and automatically think that means a kill. Thorn"}`
  - Recommendation: Add "Features Biomonitor, Custom Fit, Holster Special Rules Characters shot while wearing Murder Armor may use an Interrupt Action (–5 Initiative Score) to play dead with an opposed Charisma + Performance [Social] vs. Intuition + Perception [Mental] Test. Use of this armor imposes a –4 dice pool penalty on the observer. Success means the observer ignores the character assuming they are down, and so they get no Defense Test against the character’s next attack. Gorepak replacement requires a Logic + Armorer [Mental] (4, 1 hour) Extended Test." to modules.gear.payload.armor

## Priority 2: Data Mismatches

### weapons.pistols.holdout

- **Fichetti Tiffani Needler**
  - Field "availability" mismatch
  - Expected: `6`
  - Actual: `5`
  - Recommendation: Update fichetti-tiffani-needler.availability from 5 to 6

### weapons.pistols.light

- **Ares Light Fire 70**
  - Field "damage" mismatch
  - Expected: `8`
  - Actual: `"6P"`
  - Recommendation: Update ares-light-fire-70.damage from 6P to 8

- **Beretta 201T**
  - Field "rc" mismatch
  - Expected: `"– (1)"`
  - Actual: `0`
  - Recommendation: Update beretta-201t.rc from 0 to – (1)

- **Fichetti Security 600**
  - Field "rc" mismatch
  - Expected: `"– (1)"`
  - Actual: `0`
  - Recommendation: Update fichetti-security-600.rc from 0 to – (1)

### weapons.smgs

- **HK-227**
  - Field "rc" mismatch
  - Expected: `"– (1)"`
  - Actual: `0`
  - Recommendation: Update hk-227.rc from 0 to – (1)

- **SCK Model 100**
  - Field "rc" mismatch
  - Expected: `"– (1)"`
  - Actual: `0`
  - Recommendation: Update sck-model-100.rc from 0 to – (1)

- **Uzi IV**
  - Field "rc" mismatch
  - Expected: `"– (1)"`
  - Actual: `0`
  - Recommendation: Update uzi-iv.rc from 0 to – (1)

### weapons.rifles.assault

- **AK-97**
  - Field "accuracy" mismatch
  - Expected: `4`
  - Actual: `5`
  - Recommendation: Update ak-97.accuracy from 5 to 4

- **Yamaha Raiden**
  - Field "rc" mismatch
  - Expected: `2`
  - Actual: `1`
  - Recommendation: Update yamaha-raiden.rc from 1 to 2

### weapons.sniperRifles

- **Ares Desert Strike**
  - Field "rc" mismatch
  - Expected: `"– (1)"`
  - Actual: `0`
  - Recommendation: Update ares-desert-strike.rc from 0 to – (1)

- **Cavalier Arms Crockett EBR**
  - Field "rc" mismatch
  - Expected: `"– (1)"`
  - Actual: `0`
  - Recommendation: Update cavalier-arms-crockett-ebr.rc from 0 to – (1)

- **Ranger Arms SM-5**
  - Field "rc" mismatch
  - Expected: `"– (1)"`
  - Actual: `0`
  - Recommendation: Update ranger-arms-sm-5.rc from 0 to – (1)

- **Ruger 100**
  - Field "rc" mismatch
  - Expected: `"– (1)"`
  - Actual: `0`
  - Recommendation: Update ruger-100.rc from 0 to – (1)

### weapons.shotguns

- **PJSS Model 55**
  - Field "rc" mismatch
  - Expected: `"– (1)"`
  - Actual: `0`
  - Recommendation: Update pjss-model-55.rc from 0 to – (1)

## Priority 3: Duplicates

### cyberware

- **Cyber Holster**
  - 2 items with similar names: cyberlimb-holster, cyber-holster
  - Recommendation: Review and deduplicate: cyberlimb-holster, cyber-holster

## Priority 4: Invalid Source

### weapons.melee

- **Knucks**
  - Item "knucks" not found in reference files for sources: Core
  - Recommendation: Verify source of "knucks" - may need removal or move to sourcebook

- **Monofilament whip**
  - Item "monofilament-whip" not found in reference files for sources: Core
  - Recommendation: Verify source of "monofilament-whip" - may need removal or move to sourcebook

- **Shock Gloves**
  - Item "shock-gloves" not found in reference files for sources: Core
  - Recommendation: Verify source of "shock-gloves" - may need removal or move to sourcebook

### weapons.pistols.holdout

- **Ares Light Fire 70**
  - Item "ares-light-fire-70" not found in reference files for sources: Core
  - Recommendation: Verify source of "ares-light-fire-70" - may need removal or move to sourcebook

- **Ares Light Fire 75**
  - Item "ares-light-fire-75" not found in reference files for sources: Core
  - Recommendation: Verify source of "ares-light-fire-75" - may need removal or move to sourcebook

- **Ares Predator V**
  - Item "ares-predator-v" not found in reference files for sources: Core
  - Recommendation: Verify source of "ares-predator-v" - may need removal or move to sourcebook

- **Ares S-III Super Squirt**
  - Item "ares-s-iii-super-squirt" not found in reference files for sources: Core
  - Recommendation: Verify source of "ares-s-iii-super-squirt" - may need removal or move to sourcebook

- **Ares Viper Slivergun**
  - Item "ares-viper-slivergun" not found in reference files for sources: Core
  - Recommendation: Verify source of "ares-viper-slivergun" - may need removal or move to sourcebook

- **Beretta 201T**
  - Item "beretta-201t" not found in reference files for sources: Core
  - Recommendation: Verify source of "beretta-201t" - may need removal or move to sourcebook

- **Browning Ultra-Power**
  - Item "browning-ultra-power" not found in reference files for sources: Core
  - Recommendation: Verify source of "browning-ultra-power" - may need removal or move to sourcebook

- **Colt America L36**
  - Item "colt-america-l36" not found in reference files for sources: Core
  - Recommendation: Verify source of "colt-america-l36" - may need removal or move to sourcebook

- **Colt Government 2066**
  - Item "colt-government-2066" not found in reference files for sources: Core
  - Recommendation: Verify source of "colt-government-2066" - may need removal or move to sourcebook

- **Defiance EX Shocker**
  - Item "defiance-ex-shocker" not found in reference files for sources: Core
  - Recommendation: Verify source of "defiance-ex-shocker" - may need removal or move to sourcebook

- **Fichetti Pain Inducer**
  - Item "fichetti-pain-inducer" not found in reference files for sources: Core
  - Recommendation: Verify source of "fichetti-pain-inducer" - may need removal or move to sourcebook

- **Fichetti Security 600**
  - Item "fichetti-security-600" not found in reference files for sources: Core
  - Recommendation: Verify source of "fichetti-security-600" - may need removal or move to sourcebook

- **Parashield Dart Pistol**
  - Item "parashield-dart-pistol" not found in reference files for sources: Core
  - Recommendation: Verify source of "parashield-dart-pistol" - may need removal or move to sourcebook

- **Parashield Dart Rifle**
  - Item "parashield-dart-rifle" not found in reference files for sources: Core
  - Recommendation: Verify source of "parashield-dart-rifle" - may need removal or move to sourcebook

- **Remington Roomsweeper**
  - Item "remington-roomsweeper" not found in reference files for sources: Core
  - Recommendation: Verify source of "remington-roomsweeper" - may need removal or move to sourcebook

- **Ruger Super Warhawk**
  - Item "ruger-super-warhawk" not found in reference files for sources: Core
  - Recommendation: Verify source of "ruger-super-warhawk" - may need removal or move to sourcebook

- **Taurus Omni-6**
  - Item "taurus-omni-6" not found in reference files for sources: Core
  - Recommendation: Verify source of "taurus-omni-6" - may need removal or move to sourcebook

- **Yamaha Pulsar**
  - Item "yamaha-pulsar" not found in reference files for sources: Core
  - Recommendation: Verify source of "yamaha-pulsar" - may need removal or move to sourcebook

### weapons.pistols.light

- **Ares Predator V**
  - Item "ares-predator-v" not found in reference files for sources: Core
  - Recommendation: Verify source of "ares-predator-v" - may need removal or move to sourcebook

- **Ares S-III Super Squirt**
  - Item "ares-s-iii-super-squirt" not found in reference files for sources: Core
  - Recommendation: Verify source of "ares-s-iii-super-squirt" - may need removal or move to sourcebook

- **Ares Viper Slivergun**
  - Item "ares-viper-slivergun" not found in reference files for sources: Core
  - Recommendation: Verify source of "ares-viper-slivergun" - may need removal or move to sourcebook

- **Browning Ultra-Power**
  - Item "browning-ultra-power" not found in reference files for sources: Core
  - Recommendation: Verify source of "browning-ultra-power" - may need removal or move to sourcebook

- **Colt Government 2066**
  - Item "colt-government-2066" not found in reference files for sources: Core
  - Recommendation: Verify source of "colt-government-2066" - may need removal or move to sourcebook

- **Defiance EX Shocker**
  - Item "defiance-ex-shocker" not found in reference files for sources: Core
  - Recommendation: Verify source of "defiance-ex-shocker" - may need removal or move to sourcebook

- **Fichetti Pain Inducer**
  - Item "fichetti-pain-inducer" not found in reference files for sources: Core
  - Recommendation: Verify source of "fichetti-pain-inducer" - may need removal or move to sourcebook

- **Fichetti Tiffani Needler**
  - Item "fichetti-tiffani-needler" not found in reference files for sources: Core
  - Recommendation: Verify source of "fichetti-tiffani-needler" - may need removal or move to sourcebook

- **Parashield Dart Pistol**
  - Item "parashield-dart-pistol" not found in reference files for sources: Core
  - Recommendation: Verify source of "parashield-dart-pistol" - may need removal or move to sourcebook

- **Parashield Dart Rifle**
  - Item "parashield-dart-rifle" not found in reference files for sources: Core
  - Recommendation: Verify source of "parashield-dart-rifle" - may need removal or move to sourcebook

- **Remington Roomsweeper**
  - Item "remington-roomsweeper" not found in reference files for sources: Core
  - Recommendation: Verify source of "remington-roomsweeper" - may need removal or move to sourcebook

- **Ruger Super Warhawk**
  - Item "ruger-super-warhawk" not found in reference files for sources: Core
  - Recommendation: Verify source of "ruger-super-warhawk" - may need removal or move to sourcebook

- **Streetline Special**
  - Item "streetline-special" not found in reference files for sources: Core
  - Recommendation: Verify source of "streetline-special" - may need removal or move to sourcebook

- **Taurus Omni-6**
  - Item "taurus-omni-6" not found in reference files for sources: Core
  - Recommendation: Verify source of "taurus-omni-6" - may need removal or move to sourcebook

- **Walther Palm Pistol**
  - Item "walther-palm-pistol" not found in reference files for sources: Core
  - Recommendation: Verify source of "walther-palm-pistol" - may need removal or move to sourcebook

- **Yamaha Pulsar**
  - Item "yamaha-pulsar" not found in reference files for sources: Core
  - Recommendation: Verify source of "yamaha-pulsar" - may need removal or move to sourcebook

### weapons.pistols.heavy

- **Ares Light Fire 70**
  - Item "ares-light-fire-70" not found in reference files for sources: Core
  - Recommendation: Verify source of "ares-light-fire-70" - may need removal or move to sourcebook

- **Ares Light Fire 75**
  - Item "ares-light-fire-75" not found in reference files for sources: Core
  - Recommendation: Verify source of "ares-light-fire-75" - may need removal or move to sourcebook

- **Ares S-III Super Squirt**
  - Item "ares-s-iii-super-squirt" not found in reference files for sources: Core
  - Recommendation: Verify source of "ares-s-iii-super-squirt" - may need removal or move to sourcebook

- **Ares Viper Slivergun**
  - Item "ares-viper-slivergun" not found in reference files for sources: Core
  - Recommendation: Verify source of "ares-viper-slivergun" - may need removal or move to sourcebook

- **Beretta 201T**
  - Item "beretta-201t" not found in reference files for sources: Core
  - Recommendation: Verify source of "beretta-201t" - may need removal or move to sourcebook

- **Colt America L36**
  - Item "colt-america-l36" not found in reference files for sources: Core
  - Recommendation: Verify source of "colt-america-l36" - may need removal or move to sourcebook

- **Defiance EX Shocker**
  - Item "defiance-ex-shocker" not found in reference files for sources: Core
  - Recommendation: Verify source of "defiance-ex-shocker" - may need removal or move to sourcebook

- **Fichetti Pain Inducer**
  - Item "fichetti-pain-inducer" not found in reference files for sources: Core
  - Recommendation: Verify source of "fichetti-pain-inducer" - may need removal or move to sourcebook

- **Fichetti Security 600**
  - Item "fichetti-security-600" not found in reference files for sources: Core
  - Recommendation: Verify source of "fichetti-security-600" - may need removal or move to sourcebook

- **Fichetti Tiffani Needler**
  - Item "fichetti-tiffani-needler" not found in reference files for sources: Core
  - Recommendation: Verify source of "fichetti-tiffani-needler" - may need removal or move to sourcebook

- **Parashield Dart Pistol**
  - Item "parashield-dart-pistol" not found in reference files for sources: Core
  - Recommendation: Verify source of "parashield-dart-pistol" - may need removal or move to sourcebook

- **Parashield Dart Rifle**
  - Item "parashield-dart-rifle" not found in reference files for sources: Core
  - Recommendation: Verify source of "parashield-dart-rifle" - may need removal or move to sourcebook

- **Streetline Special**
  - Item "streetline-special" not found in reference files for sources: Core
  - Recommendation: Verify source of "streetline-special" - may need removal or move to sourcebook

- **Taurus Omni-6**
  - Item "taurus-omni-6" not found in reference files for sources: Core
  - Recommendation: Verify source of "taurus-omni-6" - may need removal or move to sourcebook

- **Walther Palm Pistol**
  - Item "walther-palm-pistol" not found in reference files for sources: Core
  - Recommendation: Verify source of "walther-palm-pistol" - may need removal or move to sourcebook

- **Yamaha Pulsar**
  - Item "yamaha-pulsar" not found in reference files for sources: Core
  - Recommendation: Verify source of "yamaha-pulsar" - may need removal or move to sourcebook

### weapons.pistols.machine

- **Ares Light Fire 70**
  - Item "ares-light-fire-70" not found in reference files for sources: Core
  - Recommendation: Verify source of "ares-light-fire-70" - may need removal or move to sourcebook

- **Ares Light Fire 75**
  - Item "ares-light-fire-75" not found in reference files for sources: Core
  - Recommendation: Verify source of "ares-light-fire-75" - may need removal or move to sourcebook

- **Ares Predator V**
  - Item "ares-predator-v" not found in reference files for sources: Core
  - Recommendation: Verify source of "ares-predator-v" - may need removal or move to sourcebook

- **Ares S-III Super Squirt**
  - Item "ares-s-iii-super-squirt" not found in reference files for sources: Core
  - Recommendation: Verify source of "ares-s-iii-super-squirt" - may need removal or move to sourcebook

- **Ares Viper Slivergun**
  - Item "ares-viper-slivergun" not found in reference files for sources: Core
  - Recommendation: Verify source of "ares-viper-slivergun" - may need removal or move to sourcebook

- **Beretta 201T**
  - Item "beretta-201t" not found in reference files for sources: Core
  - Recommendation: Verify source of "beretta-201t" - may need removal or move to sourcebook

- **Browning Ultra-Power**
  - Item "browning-ultra-power" not found in reference files for sources: Core
  - Recommendation: Verify source of "browning-ultra-power" - may need removal or move to sourcebook

- **Colt America L36**
  - Item "colt-america-l36" not found in reference files for sources: Core
  - Recommendation: Verify source of "colt-america-l36" - may need removal or move to sourcebook

- **Colt Government 2066**
  - Item "colt-government-2066" not found in reference files for sources: Core
  - Recommendation: Verify source of "colt-government-2066" - may need removal or move to sourcebook

- **Defiance EX Shocker**
  - Item "defiance-ex-shocker" not found in reference files for sources: Core
  - Recommendation: Verify source of "defiance-ex-shocker" - may need removal or move to sourcebook

- **Fichetti Pain Inducer**
  - Item "fichetti-pain-inducer" not found in reference files for sources: Core
  - Recommendation: Verify source of "fichetti-pain-inducer" - may need removal or move to sourcebook

- **Fichetti Security 600**
  - Item "fichetti-security-600" not found in reference files for sources: Core
  - Recommendation: Verify source of "fichetti-security-600" - may need removal or move to sourcebook

- **Fichetti Tiffani Needler**
  - Item "fichetti-tiffani-needler" not found in reference files for sources: Core
  - Recommendation: Verify source of "fichetti-tiffani-needler" - may need removal or move to sourcebook

- **Parashield Dart Pistol**
  - Item "parashield-dart-pistol" not found in reference files for sources: Core
  - Recommendation: Verify source of "parashield-dart-pistol" - may need removal or move to sourcebook

- **Parashield Dart Rifle**
  - Item "parashield-dart-rifle" not found in reference files for sources: Core
  - Recommendation: Verify source of "parashield-dart-rifle" - may need removal or move to sourcebook

- **Remington Roomsweeper**
  - Item "remington-roomsweeper" not found in reference files for sources: Core
  - Recommendation: Verify source of "remington-roomsweeper" - may need removal or move to sourcebook

- **Ruger Super Warhawk**
  - Item "ruger-super-warhawk" not found in reference files for sources: Core
  - Recommendation: Verify source of "ruger-super-warhawk" - may need removal or move to sourcebook

- **Streetline Special**
  - Item "streetline-special" not found in reference files for sources: Core
  - Recommendation: Verify source of "streetline-special" - may need removal or move to sourcebook

- **Taurus Omni-6**
  - Item "taurus-omni-6" not found in reference files for sources: Core
  - Recommendation: Verify source of "taurus-omni-6" - may need removal or move to sourcebook

- **Walther Palm Pistol**
  - Item "walther-palm-pistol" not found in reference files for sources: Core
  - Recommendation: Verify source of "walther-palm-pistol" - may need removal or move to sourcebook

- **Yamaha Pulsar**
  - Item "yamaha-pulsar" not found in reference files for sources: Core
  - Recommendation: Verify source of "yamaha-pulsar" - may need removal or move to sourcebook

### weapons.smgs

- **Ares Crusader II**
  - Item "ares-crusader-ii" not found in reference files for sources: Core
  - Recommendation: Verify source of "ares-crusader-ii" - may need removal or move to sourcebook

- **Ceska Black Scorpion**
  - Item "ceska-black-scorpion" not found in reference files for sources: Core
  - Recommendation: Verify source of "ceska-black-scorpion" - may need removal or move to sourcebook

- **Steyr TMP**
  - Item "steyr-tmp" not found in reference files for sources: Core
  - Recommendation: Verify source of "steyr-tmp" - may need removal or move to sourcebook

### weapons.rifles.assault

- **Ares Antioch-2**
  - Item "ares-antioch-2" not found in reference files for sources: Core
  - Recommendation: Verify source of "ares-antioch-2" - may need removal or move to sourcebook

- **ArmTech MGL-12**
  - Item "armtech-mgl-12" not found in reference files for sources: Core
  - Recommendation: Verify source of "armtech-mgl-12" - may need removal or move to sourcebook

- **Aztechnology Striker**
  - Item "aztechnology-striker" not found in reference files for sources: Core
  - Recommendation: Verify source of "aztechnology-striker" - may need removal or move to sourcebook

- **Ingram Valiant**
  - Item "ingram-valiant" not found in reference files for sources: Core
  - Recommendation: Verify source of "ingram-valiant" - may need removal or move to sourcebook

- **Krime Cannon**
  - Item "krime-cannon" not found in reference files for sources: Core
  - Recommendation: Verify source of "krime-cannon" - may need removal or move to sourcebook

- **Onotari Interceptor**
  - Item "onotari-interceptor" not found in reference files for sources: Core
  - Recommendation: Verify source of "onotari-interceptor" - may need removal or move to sourcebook

- **Panther XXL**
  - Item "panther-xxl" not found in reference files for sources: Core
  - Recommendation: Verify source of "panther-xxl" - may need removal or move to sourcebook

- **RPK HMG**
  - Item "rpk-hmg" not found in reference files for sources: Core
  - Recommendation: Verify source of "rpk-hmg" - may need removal or move to sourcebook

- **Stoner-Ares M202**
  - Item "stoner-ares-m202" not found in reference files for sources: Core
  - Recommendation: Verify source of "stoner-ares-m202" - may need removal or move to sourcebook

### modifications.weaponMods

- **Airburst Link**
  - Item "airburst-link" not found in reference files for sources: Core
  - Recommendation: Verify source of "airburst-link" - may need removal or move to sourcebook

- **Bipod**
  - Item "bipod" not found in reference files for sources: Core
  - Recommendation: Verify source of "bipod" - may need removal or move to sourcebook

- **Concealable Holster**
  - Item "concealable-holster" not found in reference files for sources: Core
  - Recommendation: Verify source of "concealable-holster" - may need removal or move to sourcebook

- **Gas-Vent System**
  - Item "gas-vent-system" not found in reference files for sources: Core
  - Recommendation: Verify source of "gas-vent-system" - may need removal or move to sourcebook

- **Gyro Mount**
  - Item "gyro-mount" not found in reference files for sources: Core
  - Recommendation: Verify source of "gyro-mount" - may need removal or move to sourcebook

- **Hidden Arm Slide**
  - Item "hidden-arm-slide" not found in reference files for sources: Core
  - Recommendation: Verify source of "hidden-arm-slide" - may need removal or move to sourcebook

- **Imaging Scope**
  - Item "imaging-scope" not found in reference files for sources: Core
  - Recommendation: Verify source of "imaging-scope" - may need removal or move to sourcebook

- **Laser Sight**
  - Item "laser-sight" not found in reference files for sources: Core
  - Recommendation: Verify source of "laser-sight" - may need removal or move to sourcebook

- **Periscope**
  - Item "periscope" not found in reference files for sources: Core
  - Recommendation: Verify source of "periscope" - may need removal or move to sourcebook

- **Quick-Draw Holster**
  - Item "quick-draw-holster" not found in reference files for sources: Core
  - Recommendation: Verify source of "quick-draw-holster" - may need removal or move to sourcebook

- **Shock Pad**
  - Item "shock-pad" not found in reference files for sources: Core
  - Recommendation: Verify source of "shock-pad" - may need removal or move to sourcebook

- **Silencer/Suppressor**
  - Item "silencer-suppressor" not found in reference files for sources: Core
  - Recommendation: Verify source of "silencer-suppressor" - may need removal or move to sourcebook

- **Smart Firing Platform**
  - Item "smart-firing-platform" not found in reference files for sources: Core
  - Recommendation: Verify source of "smart-firing-platform" - may need removal or move to sourcebook

- **Smartgun System, Internal**
  - Item "smartgun-internal" not found in reference files for sources: Core
  - Recommendation: Verify source of "smartgun-internal" - may need removal or move to sourcebook

- **Smartgun System, External**
  - Item "smartgun-external" not found in reference files for sources: Core
  - Recommendation: Verify source of "smartgun-external" - may need removal or move to sourcebook

- **Spare Clip**
  - Item "spare-clip" not found in reference files for sources: Core
  - Recommendation: Verify source of "spare-clip" - may need removal or move to sourcebook

- **Speed Loader**
  - Item "speed-loader" not found in reference files for sources: Core
  - Recommendation: Verify source of "speed-loader" - may need removal or move to sourcebook

- **Tripod**
  - Item "tripod" not found in reference files for sources: Core
  - Recommendation: Verify source of "tripod" - may need removal or move to sourcebook

### cyberware

- **Control Rig**
  - Item "control-rig" not found in reference files for sources: Core
  - Recommendation: Verify source of "control-rig" - may need removal or move to sourcebook

- **Cybereyes**
  - Item "cybereyes" not found in reference files for sources: Core
  - Recommendation: Verify source of "cybereyes" - may need removal or move to sourcebook

- **Cyberears**
  - Item "cyberears" not found in reference files for sources: Core
  - Recommendation: Verify source of "cyberears" - may need removal or move to sourcebook

- **Dermal Plating**
  - Item "dermal-plating" not found in reference files for sources: Core
  - Recommendation: Verify source of "dermal-plating" - may need removal or move to sourcebook

- **Internal Air Tank**
  - Item "internal-air-tank" not found in reference files for sources: Core
  - Recommendation: Verify source of "internal-air-tank" - may need removal or move to sourcebook

- **Muscle Replacement**
  - Item "muscle-replacement" not found in reference files for sources: Core
  - Recommendation: Verify source of "muscle-replacement" - may need removal or move to sourcebook

- **Reaction Enhancers**
  - Item "reaction-enhancers" not found in reference files for sources: Core
  - Recommendation: Verify source of "reaction-enhancers" - may need removal or move to sourcebook

- **Wired Reflexes**
  - Item "wired-reflexes" not found in reference files for sources: Core
  - Recommendation: Verify source of "wired-reflexes" - may need removal or move to sourcebook

- **Datajack**
  - Item "datajack" not found in reference files for sources: Core
  - Recommendation: Verify source of "datajack" - may need removal or move to sourcebook

- **Commlink (Implanted)**
  - Item "commlink-implant" not found in reference files for sources: Core
  - Recommendation: Verify source of "commlink-implant" - may need removal or move to sourcebook

- **Cortex Bomb (Kink)**
  - Item "cortex-bomb" not found in reference files for sources: Core
  - Recommendation: Verify source of "cortex-bomb" - may need removal or move to sourcebook

- **Cortex Bomb (Micro)**
  - Item "cortex-bomb-micro" not found in reference files for sources: Core
  - Recommendation: Verify source of "cortex-bomb-micro" - may need removal or move to sourcebook

- **Cortex Bomb (Area)**
  - Item "cortex-bomb-area" not found in reference files for sources: Core
  - Recommendation: Verify source of "cortex-bomb-area" - may need removal or move to sourcebook

- **Olfactory Booster**
  - Item "olfactory-booster" not found in reference files for sources: Core
  - Recommendation: Verify source of "olfactory-booster" - may need removal or move to sourcebook

- **Taste Booster**
  - Item "taste-booster" not found in reference files for sources: Core
  - Recommendation: Verify source of "taste-booster" - may need removal or move to sourcebook

- **Tooth Compartment**
  - Item "tooth-compartment" not found in reference files for sources: Core
  - Recommendation: Verify source of "tooth-compartment" - may need removal or move to sourcebook

- **Ultrasound Sensor**
  - Item "ultrasound-sensor" not found in reference files for sources: Core
  - Recommendation: Verify source of "ultrasound-sensor" - may need removal or move to sourcebook

- **Voice Modulator**
  - Item "voice-modulator" not found in reference files for sources: Core
  - Recommendation: Verify source of "voice-modulator" - may need removal or move to sourcebook

- **Skilljack**
  - Item "skilljack" not found in reference files for sources: Core
  - Recommendation: Verify source of "skilljack" - may need removal or move to sourcebook

- **Simrig**
  - Item "simrig" not found in reference files for sources: Core
  - Recommendation: Verify source of "simrig" - may need removal or move to sourcebook

- **Data Lock**
  - Item "data-lock" not found in reference files for sources: Core
  - Recommendation: Verify source of "data-lock" - may need removal or move to sourcebook

- **Cyberdeck (Implanted)**
  - Item "cyberdeck-implant" not found in reference files for sources: Core
  - Recommendation: Verify source of "cyberdeck-implant" - may need removal or move to sourcebook

- **Flare Compensation**
  - Item "eye-flare-compensation" not found in reference files for sources: Core
  - Recommendation: Verify source of "eye-flare-compensation" - may need removal or move to sourcebook

- **Image Link**
  - Item "eye-image-link" not found in reference files for sources: Core
  - Recommendation: Verify source of "eye-image-link" - may need removal or move to sourcebook

- **Low-Light Vision**
  - Item "eye-low-light-vision" not found in reference files for sources: Core
  - Recommendation: Verify source of "eye-low-light-vision" - may need removal or move to sourcebook

- **Smartlink**
  - Item "eye-smartlink" not found in reference files for sources: Core
  - Recommendation: Verify source of "eye-smartlink" - may need removal or move to sourcebook

- **Thermographic Vision**
  - Item "eye-thermographic-vision" not found in reference files for sources: Core
  - Recommendation: Verify source of "eye-thermographic-vision" - may need removal or move to sourcebook

- **Vision Enhancement**
  - Item "eye-vision-enhancement" not found in reference files for sources: Core
  - Recommendation: Verify source of "eye-vision-enhancement" - may need removal or move to sourcebook

- **Vision Magnification**
  - Item "eye-vision-magnification" not found in reference files for sources: Core
  - Recommendation: Verify source of "eye-vision-magnification" - may need removal or move to sourcebook

- **Ocular Drone**
  - Item "ocular-drone" not found in reference files for sources: Core
  - Recommendation: Verify source of "ocular-drone" - may need removal or move to sourcebook

- **Retinal Duplication**
  - Item "retinal-duplication" not found in reference files for sources: Core
  - Recommendation: Verify source of "retinal-duplication" - may need removal or move to sourcebook

- **Audio Enhancement**
  - Item "ear-audio-enhancement" not found in reference files for sources: Core
  - Recommendation: Verify source of "ear-audio-enhancement" - may need removal or move to sourcebook

- **Balance Augmenter**
  - Item "ear-balance-augmenter" not found in reference files for sources: Core
  - Recommendation: Verify source of "ear-balance-augmenter" - may need removal or move to sourcebook

- **Damper**
  - Item "ear-damper" not found in reference files for sources: Core
  - Recommendation: Verify source of "ear-damper" - may need removal or move to sourcebook

- **Select Sound Filter**
  - Item "ear-select-sound-filter" not found in reference files for sources: Core
  - Recommendation: Verify source of "ear-select-sound-filter" - may need removal or move to sourcebook

- **Spatial Recognizer**
  - Item "ear-spatial-recognizer" not found in reference files for sources: Core
  - Recommendation: Verify source of "ear-spatial-recognizer" - may need removal or move to sourcebook

- **Bone Lacing (Plastic)**
  - Item "bone-lacing-plastic" not found in reference files for sources: Core
  - Recommendation: Verify source of "bone-lacing-plastic" - may need removal or move to sourcebook

- **Bone Lacing (Aluminum)**
  - Item "bone-lacing-aluminum" not found in reference files for sources: Core
  - Recommendation: Verify source of "bone-lacing-aluminum" - may need removal or move to sourcebook

- **Bone Lacing (Titanium)**
  - Item "bone-lacing-titanium" not found in reference files for sources: Core
  - Recommendation: Verify source of "bone-lacing-titanium" - may need removal or move to sourcebook

- **Fingertip Compartment**
  - Item "fingertip-compartment" not found in reference files for sources: Core
  - Recommendation: Verify source of "fingertip-compartment" - may need removal or move to sourcebook

- **Grapple Gun (Implant)**
  - Item "grapple-gun-implant" not found in reference files for sources: Core
  - Recommendation: Verify source of "grapple-gun-implant" - may need removal or move to sourcebook

- **Skillwires**
  - Item "skillwires" not found in reference files for sources: Core
  - Recommendation: Verify source of "skillwires" - may need removal or move to sourcebook

- **Smuggling Compartment**
  - Item "smuggling-compartment" not found in reference files for sources: Core
  - Recommendation: Verify source of "smuggling-compartment" - may need removal or move to sourcebook

- **Obvious Cyberarm**
  - Item "cyberlimb-arm" not found in reference files for sources: Core
  - Recommendation: Verify source of "cyberlimb-arm" - may need removal or move to sourcebook

- **Synthetic Cyberarm**
  - Item "cyberlimb-arm-synthetic" not found in reference files for sources: Core
  - Recommendation: Verify source of "cyberlimb-arm-synthetic" - may need removal or move to sourcebook

- **Obvious Cyberleg**
  - Item "cyberlimb-leg" not found in reference files for sources: Core
  - Recommendation: Verify source of "cyberlimb-leg" - may need removal or move to sourcebook

- **Synthetic Cyberleg**
  - Item "cyberlimb-leg-synthetic" not found in reference files for sources: Core
  - Recommendation: Verify source of "cyberlimb-leg-synthetic" - may need removal or move to sourcebook

- **Obvious Cybertorso**
  - Item "cyberlimb-torso" not found in reference files for sources: Core
  - Recommendation: Verify source of "cyberlimb-torso" - may need removal or move to sourcebook

- **Obvious Cyberskull**
  - Item "cyberlimb-skull" not found in reference files for sources: Core
  - Recommendation: Verify source of "cyberlimb-skull" - may need removal or move to sourcebook

- **Obvious Cyberhand**
  - Item "cyberlimb-hand" not found in reference files for sources: Core
  - Recommendation: Verify source of "cyberlimb-hand" - may need removal or move to sourcebook

- **Obvious Cyberfoot**
  - Item "cyberlimb-foot" not found in reference files for sources: Core
  - Recommendation: Verify source of "cyberlimb-foot" - may need removal or move to sourcebook

- **Obvious Lower Cyberarm**
  - Item "cyberlimb-lower-arm" not found in reference files for sources: Core
  - Recommendation: Verify source of "cyberlimb-lower-arm" - may need removal or move to sourcebook

- **Obvious Lower Cyberleg**
  - Item "cyberlimb-lower-leg" not found in reference files for sources: Core
  - Recommendation: Verify source of "cyberlimb-lower-leg" - may need removal or move to sourcebook

- **Cyberlimb Agility Enhancement**
  - Item "cyberlimb-agility" not found in reference files for sources: Core
  - Recommendation: Verify source of "cyberlimb-agility" - may need removal or move to sourcebook

- **Cyberlimb Strength Enhancement**
  - Item "cyberlimb-strength" not found in reference files for sources: Core
  - Recommendation: Verify source of "cyberlimb-strength" - may need removal or move to sourcebook

- **Cyberlimb Armor Enhancement**
  - Item "cyberlimb-armor" not found in reference files for sources: Core
  - Recommendation: Verify source of "cyberlimb-armor" - may need removal or move to sourcebook

- **Cyberarm Gyromount**
  - Item "cyberlimb-gyromount" not found in reference files for sources: Core
  - Recommendation: Verify source of "cyberlimb-gyromount" - may need removal or move to sourcebook

- **Cyber Holster**
  - Item "cyberlimb-holster" not found in reference files for sources: Core
  - Recommendation: Verify source of "cyberlimb-holster" - may need removal or move to sourcebook

- **Cyberarm Slide**
  - Item "cyberlimb-slide" not found in reference files for sources: Core
  - Recommendation: Verify source of "cyberlimb-slide" - may need removal or move to sourcebook

- **Hydraulic Jacks**
  - Item "cyberlimb-hydraulic-jacks" not found in reference files for sources: Core
  - Recommendation: Verify source of "cyberlimb-hydraulic-jacks" - may need removal or move to sourcebook

- **Large Smuggling Compartment**
  - Item "cyberlimb-large-smuggling-compartment" not found in reference files for sources: Core
  - Recommendation: Verify source of "cyberlimb-large-smuggling-compartment" - may need removal or move to sourcebook

- **Synthetic Cyberhand**
  - Item "cyberlimb-hand-synthetic" not found in reference files for sources: Core
  - Recommendation: Verify source of "cyberlimb-hand-synthetic" - may need removal or move to sourcebook

- **Synthetic Cyberfoot**
  - Item "cyberlimb-foot-synthetic" not found in reference files for sources: Core
  - Recommendation: Verify source of "cyberlimb-foot-synthetic" - may need removal or move to sourcebook

- **Synthetic Lower Cyberarm**
  - Item "cyberlimb-lower-arm-synthetic" not found in reference files for sources: Core
  - Recommendation: Verify source of "cyberlimb-lower-arm-synthetic" - may need removal or move to sourcebook

- **Synthetic Lower Cyberleg**
  - Item "cyberlimb-lower-leg-synthetic" not found in reference files for sources: Core
  - Recommendation: Verify source of "cyberlimb-lower-leg-synthetic" - may need removal or move to sourcebook

- **Synthetic Cybertorso**
  - Item "cyberlimb-torso-synthetic" not found in reference files for sources: Core
  - Recommendation: Verify source of "cyberlimb-torso-synthetic" - may need removal or move to sourcebook

- **Synthetic Cyberskull**
  - Item "cyberlimb-skull-synthetic" not found in reference files for sources: Core
  - Recommendation: Verify source of "cyberlimb-skull-synthetic" - may need removal or move to sourcebook

- **Hand Blade**
  - Item "hand-blade" not found in reference files for sources: Core
  - Recommendation: Verify source of "hand-blade" - may need removal or move to sourcebook

- **Hand Razors**
  - Item "hand-razors" not found in reference files for sources: Core
  - Recommendation: Verify source of "hand-razors" - may need removal or move to sourcebook

- **Spur**
  - Item "spur" not found in reference files for sources: Core
  - Recommendation: Verify source of "spur" - may need removal or move to sourcebook

- **Shock Hand**
  - Item "shock-hand" not found in reference files for sources: Core
  - Recommendation: Verify source of "shock-hand" - may need removal or move to sourcebook

- **Implant Weapon (Hold-Out Pistol)**
  - Item "implant-weapon-holdout" not found in reference files for sources: Core
  - Recommendation: Verify source of "implant-weapon-holdout" - may need removal or move to sourcebook

- **Implant Weapon (Light Pistol)**
  - Item "implant-weapon-light-pistol" not found in reference files for sources: Core
  - Recommendation: Verify source of "implant-weapon-light-pistol" - may need removal or move to sourcebook

- **Implant Weapon (Machine Pistol)**
  - Item "implant-weapon-machine-pistol" not found in reference files for sources: Core
  - Recommendation: Verify source of "implant-weapon-machine-pistol" - may need removal or move to sourcebook

- **Implant Weapon (Heavy Pistol)**
  - Item "implant-weapon-heavy-pistol" not found in reference files for sources: Core
  - Recommendation: Verify source of "implant-weapon-heavy-pistol" - may need removal or move to sourcebook

- **Implant Weapon (Submachine Gun)**
  - Item "implant-weapon-smg" not found in reference files for sources: Core
  - Recommendation: Verify source of "implant-weapon-smg" - may need removal or move to sourcebook

- **Implant Weapon (Shotgun)**
  - Item "implant-weapon-shotgun" not found in reference files for sources: Core
  - Recommendation: Verify source of "implant-weapon-shotgun" - may need removal or move to sourcebook

- **Implant Weapon (Grenade Launcher)**
  - Item "implant-weapon-grenade-launcher" not found in reference files for sources: Core
  - Recommendation: Verify source of "implant-weapon-grenade-launcher" - may need removal or move to sourcebook

- **External Clip Port**
  - Item "implant-weapon-external-clip" not found in reference files for sources: Core
  - Recommendation: Verify source of "implant-weapon-external-clip" - may need removal or move to sourcebook

- **Laser Sight (Implant)**
  - Item "implant-weapon-laser-sight" not found in reference files for sources: Core
  - Recommendation: Verify source of "implant-weapon-laser-sight" - may need removal or move to sourcebook

- **Silencer/Suppressor (Implant)**
  - Item "implant-weapon-silencer" not found in reference files for sources: Core
  - Recommendation: Verify source of "implant-weapon-silencer" - may need removal or move to sourcebook

- **Cyber Holster**
  - Item "cyber-holster" not found in reference files for sources: Core
  - Recommendation: Verify source of "cyber-holster" - may need removal or move to sourcebook

### bioware

- **Adrenaline Pump**
  - Item "adrenaline-pump" not found in reference files for sources: Core
  - Recommendation: Verify source of "adrenaline-pump" - may need removal or move to sourcebook

- **Muscle Augmentation**
  - Item "muscle-augmentation" not found in reference files for sources: Core
  - Recommendation: Verify source of "muscle-augmentation" - may need removal or move to sourcebook

- **Muscle Toner**
  - Item "muscle-toner" not found in reference files for sources: Core
  - Recommendation: Verify source of "muscle-toner" - may need removal or move to sourcebook

- **Pathogenic Defense**
  - Item "pathogenic-defense" not found in reference files for sources: Core
  - Recommendation: Verify source of "pathogenic-defense" - may need removal or move to sourcebook

- **Symbiotes**
  - Item "symbiotes" not found in reference files for sources: Core
  - Recommendation: Verify source of "symbiotes" - may need removal or move to sourcebook

- **Tracheal Filter**
  - Item "tracheal-filter" not found in reference files for sources: Core
  - Recommendation: Verify source of "tracheal-filter" - may need removal or move to sourcebook

- **Tailored Pheromones**
  - Item "tailored-pheromones" not found in reference files for sources: Core
  - Recommendation: Verify source of "tailored-pheromones" - may need removal or move to sourcebook

- **Bone Density Augmentation**
  - Item "bone-density-augmentation" not found in reference files for sources: Core
  - Recommendation: Verify source of "bone-density-augmentation" - may need removal or move to sourcebook

- **Toxin Extractor**
  - Item "toxin-extractor" not found in reference files for sources: Core
  - Recommendation: Verify source of "toxin-extractor" - may need removal or move to sourcebook

- **Cerebral Booster**
  - Item "cerebral-booster" not found in reference files for sources: Core
  - Recommendation: Verify source of "cerebral-booster" - may need removal or move to sourcebook

- **Damage Compensators**
  - Item "damage-compensators" not found in reference files for sources: Core
  - Recommendation: Verify source of "damage-compensators" - may need removal or move to sourcebook

- **Mnemonic Enhancer**
  - Item "mnemonic-enhancer" not found in reference files for sources: Core
  - Recommendation: Verify source of "mnemonic-enhancer" - may need removal or move to sourcebook

- **Synaptic Booster**
  - Item "synaptic-booster" not found in reference files for sources: Core
  - Recommendation: Verify source of "synaptic-booster" - may need removal or move to sourcebook

- **Cat's Eyes**
  - Item "cat-eyes" not found in reference files for sources: Core
  - Recommendation: Verify source of "cat-eyes" - may need removal or move to sourcebook

- **Enhanced Articulation**
  - Item "enhanced-articulation" not found in reference files for sources: Core
  - Recommendation: Verify source of "enhanced-articulation" - may need removal or move to sourcebook

- **Orthoskin**
  - Item "orthoskin" not found in reference files for sources: Core
  - Recommendation: Verify source of "orthoskin" - may need removal or move to sourcebook

- **Platelet Factories**
  - Item "platelet-factories" not found in reference files for sources: Core
  - Recommendation: Verify source of "platelet-factories" - may need removal or move to sourcebook

- **Reflex Recorder**
  - Item "reflex-recorder" not found in reference files for sources: Core
  - Recommendation: Verify source of "reflex-recorder" - may need removal or move to sourcebook

- **Skin Pocket**
  - Item "skin-pocket" not found in reference files for sources: Core
  - Recommendation: Verify source of "skin-pocket" - may need removal or move to sourcebook

- **Suprathyroid Gland**
  - Item "suprathyroid-gland" not found in reference files for sources: Core
  - Recommendation: Verify source of "suprathyroid-gland" - may need removal or move to sourcebook

- **Synthacardium**
  - Item "synthacardium" not found in reference files for sources: Core
  - Recommendation: Verify source of "synthacardium" - may need removal or move to sourcebook

- **Pain Editor**
  - Item "pain-editor" not found in reference files for sources: Core
  - Recommendation: Verify source of "pain-editor" - may need removal or move to sourcebook

- **Sleep Regulator**
  - Item "sleep-regulator" not found in reference files for sources: Core
  - Recommendation: Verify source of "sleep-regulator" - may need removal or move to sourcebook

### armor

- **(Synth)Leather**
  - Item "synth-leather" not found in reference files for sources: Core
  - Recommendation: Verify source of "synth-leather" - may need removal or move to sourcebook

- **Actioneer Business Clothes**
  - Item "actioneer-business-clothes" not found in reference files for sources: Core
  - Recommendation: Verify source of "actioneer-business-clothes" - may need removal or move to sourcebook

- **Armor Clothing**
  - Item "armor-clothing" not found in reference files for sources: Core
  - Recommendation: Verify source of "armor-clothing" - may need removal or move to sourcebook

- **Armor Jacket**
  - Item "armor-jacket" not found in reference files for sources: Core
  - Recommendation: Verify source of "armor-jacket" - may need removal or move to sourcebook

- **Armor Vest**
  - Item "armor-vest" not found in reference files for sources: Core
  - Recommendation: Verify source of "armor-vest" - may need removal or move to sourcebook

- **Ballistic Shield**
  - Item "ballistic-shield" not found in reference files for sources: Core
  - Recommendation: Verify source of "ballistic-shield" - may need removal or move to sourcebook

- **Chameleon Suit**
  - Item "chameleon-suit" not found in reference files for sources: Core
  - Recommendation: Verify source of "chameleon-suit" - may need removal or move to sourcebook

- **Clothing**
  - Item "clothing" not found in reference files for sources: Core
  - Recommendation: Verify source of "clothing" - may need removal or move to sourcebook

- **Electrochromic Modification**
  - Item "electrochromic-modification" not found in reference files for sources: Core
  - Recommendation: Verify source of "electrochromic-modification" - may need removal or move to sourcebook

- **Feedback Clothing**
  - Item "feedback-clothing" not found in reference files for sources: Core
  - Recommendation: Verify source of "feedback-clothing" - may need removal or move to sourcebook

- **Full Body Armor**
  - Item "full-body-armor" not found in reference files for sources: Core
  - Recommendation: Verify source of "full-body-armor" - may need removal or move to sourcebook

- **Full Body Armor Helmet**
  - Item "full-body-armor-helmet" not found in reference files for sources: Core
  - Recommendation: Verify source of "full-body-armor-helmet" - may need removal or move to sourcebook

- **Helmet**
  - Item "helmet" not found in reference files for sources: Core
  - Recommendation: Verify source of "helmet" - may need removal or move to sourcebook

- **Lined Coat**
  - Item "lined-coat" not found in reference files for sources: Core
  - Recommendation: Verify source of "lined-coat" - may need removal or move to sourcebook

- **Riot Shield**
  - Item "riot-shield" not found in reference files for sources: Core
  - Recommendation: Verify source of "riot-shield" - may need removal or move to sourcebook

- **Urban Explorer Jumpsuit**
  - Item "urban-explorer-jumpsuit" not found in reference files for sources: Core
  - Recommendation: Verify source of "urban-explorer-jumpsuit" - may need removal or move to sourcebook

- **Urban Explorer Jumpsuit Helmet**
  - Item "urban-explorer-jumpsuit-helmet" not found in reference files for sources: Core
  - Recommendation: Verify source of "urban-explorer-jumpsuit-helmet" - may need removal or move to sourcebook

- **Full Body Armor Chemical Seal**
  - Item "full-body-armor-chemical-seal" not found in reference files for sources: Core
  - Recommendation: Verify source of "full-body-armor-chemical-seal" - may need removal or move to sourcebook

- **Full Body Armor Environmental Adaptation**
  - Item "full-body-armor-environmental-adaptation" not found in reference files for sources: Core
  - Recommendation: Verify source of "full-body-armor-environmental-adaptation" - may need removal or move to sourcebook

### qualities.positive

- **Ambidextrous**
  - Item "ambidextrous" not found in reference files for sources: Core
  - Recommendation: Verify source of "ambidextrous" - may need removal or move to sourcebook

- **Analytical Mind**
  - Item "analytical-mind" not found in reference files for sources: Core
  - Recommendation: Verify source of "analytical-mind" - may need removal or move to sourcebook

- **Aptitude**
  - Item "aptitude" not found in reference files for sources: Core
  - Recommendation: Verify source of "aptitude" - may need removal or move to sourcebook

- **Astral Chameleon**
  - Item "astral-chameleon" not found in reference files for sources: Core
  - Recommendation: Verify source of "astral-chameleon" - may need removal or move to sourcebook

- **Bilingual**
  - Item "bilingual" not found in reference files for sources: Core
  - Recommendation: Verify source of "bilingual" - may need removal or move to sourcebook

- **Blandness**
  - Item "blandness" not found in reference files for sources: Core
  - Recommendation: Verify source of "blandness" - may need removal or move to sourcebook

- **Catlike**
  - Item "catlike" not found in reference files for sources: Core
  - Recommendation: Verify source of "catlike" - may need removal or move to sourcebook

- **Codeslinger**
  - Item "codeslinger" not found in reference files for sources: Core
  - Recommendation: Verify source of "codeslinger" - may need removal or move to sourcebook

- **Double-Jointed**
  - Item "double-jointed" not found in reference files for sources: Core
  - Recommendation: Verify source of "double-jointed" - may need removal or move to sourcebook

- **Exceptional Attribute**
  - Item "exceptional-attribute" not found in reference files for sources: Core
  - Recommendation: Verify source of "exceptional-attribute" - may need removal or move to sourcebook

- **First Impression**
  - Item "first-impression" not found in reference files for sources: Core
  - Recommendation: Verify source of "first-impression" - may need removal or move to sourcebook

- **Focused Concentration**
  - Item "focused-concentration" not found in reference files for sources: Core
  - Recommendation: Verify source of "focused-concentration" - may need removal or move to sourcebook

- **Gearhead**
  - Item "gearhead" not found in reference files for sources: Core
  - Recommendation: Verify source of "gearhead" - may need removal or move to sourcebook

- **Guts**
  - Item "guts" not found in reference files for sources: Core
  - Recommendation: Verify source of "guts" - may need removal or move to sourcebook

- **High Pain Tolerance**
  - Item "high-pain-tolerance" not found in reference files for sources: Core
  - Recommendation: Verify source of "high-pain-tolerance" - may need removal or move to sourcebook

- **Home Ground**
  - Item "home-ground" not found in reference files for sources: Core
  - Recommendation: Verify source of "home-ground" - may need removal or move to sourcebook

- **Human-Looking**
  - Item "human-looking" not found in reference files for sources: Core
  - Recommendation: Verify source of "human-looking" - may need removal or move to sourcebook

- **Indomitable**
  - Item "indomitable" not found in reference files for sources: Core
  - Recommendation: Verify source of "indomitable" - may need removal or move to sourcebook

- **Juryrigger**
  - Item "juryrigger" not found in reference files for sources: Core
  - Recommendation: Verify source of "juryrigger" - may need removal or move to sourcebook

- **Low-Light Vision**
  - Item "low-light-vision" not found in reference files for sources: Core
  - Recommendation: Verify source of "low-light-vision" - may need removal or move to sourcebook

- **Lucky**
  - Item "lucky" not found in reference files for sources: Core
  - Recommendation: Verify source of "lucky" - may need removal or move to sourcebook

- **Magical Resistance**
  - Item "magical-resistance" not found in reference files for sources: Core
  - Recommendation: Verify source of "magical-resistance" - may need removal or move to sourcebook

- **Mentor Spirit**
  - Item "mentor-spirit" not found in reference files for sources: Core
  - Recommendation: Verify source of "mentor-spirit" - may need removal or move to sourcebook

- **Natural Athlete**
  - Item "natural-athlete" not found in reference files for sources: Core
  - Recommendation: Verify source of "natural-athlete" - may need removal or move to sourcebook

- **Natural Hardening**
  - Item "natural-hardening" not found in reference files for sources: Core
  - Recommendation: Verify source of "natural-hardening" - may need removal or move to sourcebook

- **Natural Immunity**
  - Item "natural-immunity" not found in reference files for sources: Core
  - Recommendation: Verify source of "natural-immunity" - may need removal or move to sourcebook

- **Photographic Memory**
  - Item "photographic-memory" not found in reference files for sources: Core
  - Recommendation: Verify source of "photographic-memory" - may need removal or move to sourcebook

- **Quick Healer**
  - Item "quick-healer" not found in reference files for sources: Core
  - Recommendation: Verify source of "quick-healer" - may need removal or move to sourcebook

- **Resistance to Pathogens/Toxins**
  - Item "resistance-pathogens-toxins" not found in reference files for sources: Core
  - Recommendation: Verify source of "resistance-pathogens-toxins" - may need removal or move to sourcebook

- **Spirit Affinity**
  - Item "spirit-affinity" not found in reference files for sources: Core
  - Recommendation: Verify source of "spirit-affinity" - may need removal or move to sourcebook

- **Thermographic Vision**
  - Item "thermographic-vision" not found in reference files for sources: Core
  - Recommendation: Verify source of "thermographic-vision" - may need removal or move to sourcebook

- **Toughness**
  - Item "toughness" not found in reference files for sources: Core
  - Recommendation: Verify source of "toughness" - may need removal or move to sourcebook

- **Will to Live**
  - Item "will-to-live" not found in reference files for sources: Core
  - Recommendation: Verify source of "will-to-live" - may need removal or move to sourcebook

### qualities.negative

- **Addiction**
  - Item "addiction" not found in reference files for sources: Core
  - Recommendation: Verify source of "addiction" - may need removal or move to sourcebook

- **Allergy**
  - Item "allergy" not found in reference files for sources: Core
  - Recommendation: Verify source of "allergy" - may need removal or move to sourcebook

- **Astral Beacon**
  - Item "astral-beacon" not found in reference files for sources: Core
  - Recommendation: Verify source of "astral-beacon" - may need removal or move to sourcebook

- **Bad Luck**
  - Item "bad-luck" not found in reference files for sources: Core
  - Recommendation: Verify source of "bad-luck" - may need removal or move to sourcebook

- **Bad Rep**
  - Item "bad-rep" not found in reference files for sources: Core
  - Recommendation: Verify source of "bad-rep" - may need removal or move to sourcebook

- **Code of Honor**
  - Item "code-of-honor" not found in reference files for sources: Core
  - Recommendation: Verify source of "code-of-honor" - may need removal or move to sourcebook

- **Codeblock**
  - Item "codeblock" not found in reference files for sources: Core
  - Recommendation: Verify source of "codeblock" - may need removal or move to sourcebook

- **Combat Paralysis**
  - Item "combat-paralysis" not found in reference files for sources: Core
  - Recommendation: Verify source of "combat-paralysis" - may need removal or move to sourcebook

- **Dependents**
  - Item "dependents" not found in reference files for sources: Core
  - Recommendation: Verify source of "dependents" - may need removal or move to sourcebook

- **Distinctive Style**
  - Item "distinctive-style" not found in reference files for sources: Core
  - Recommendation: Verify source of "distinctive-style" - may need removal or move to sourcebook

- **Elf Poser**
  - Item "elf-poser" not found in reference files for sources: Core
  - Recommendation: Verify source of "elf-poser" - may need removal or move to sourcebook

- **Gremlins**
  - Item "gremlins" not found in reference files for sources: Core
  - Recommendation: Verify source of "gremlins" - may need removal or move to sourcebook

- **Incompetent**
  - Item "incompetent" not found in reference files for sources: Core
  - Recommendation: Verify source of "incompetent" - may need removal or move to sourcebook

- **Insomnia**
  - Item "insomnia" not found in reference files for sources: Core
  - Recommendation: Verify source of "insomnia" - may need removal or move to sourcebook

- **Loss of Confidence**
  - Item "loss-of-confidence" not found in reference files for sources: Core
  - Recommendation: Verify source of "loss-of-confidence" - may need removal or move to sourcebook

- **Low Pain Tolerance**
  - Item "low-pain-tolerance" not found in reference files for sources: Core
  - Recommendation: Verify source of "low-pain-tolerance" - may need removal or move to sourcebook

- **Ork Poser**
  - Item "ork-poser" not found in reference files for sources: Core
  - Recommendation: Verify source of "ork-poser" - may need removal or move to sourcebook

- **Prejudiced**
  - Item "prejudiced" not found in reference files for sources: Core
  - Recommendation: Verify source of "prejudiced" - may need removal or move to sourcebook

- **Scorched**
  - Item "scorched" not found in reference files for sources: Core
  - Recommendation: Verify source of "scorched" - may need removal or move to sourcebook

- **Sensitive System**
  - Item "sensitive-system" not found in reference files for sources: Core
  - Recommendation: Verify source of "sensitive-system" - may need removal or move to sourcebook

- **Simsense Vertigo**
  - Item "simsense-vertigo" not found in reference files for sources: Core
  - Recommendation: Verify source of "simsense-vertigo" - may need removal or move to sourcebook

- **SINner**
  - Item "sinner" not found in reference files for sources: Core
  - Recommendation: Verify source of "sinner" - may need removal or move to sourcebook

- **Social Stress**
  - Item "social-stress" not found in reference files for sources: Core
  - Recommendation: Verify source of "social-stress" - may need removal or move to sourcebook

- **Spirit Bane**
  - Item "spirit-bane" not found in reference files for sources: Core
  - Recommendation: Verify source of "spirit-bane" - may need removal or move to sourcebook

- **Uncouth**
  - Item "uncouth" not found in reference files for sources: Core
  - Recommendation: Verify source of "uncouth" - may need removal or move to sourcebook

- **Uneducated**
  - Item "uneducated" not found in reference files for sources: Core
  - Recommendation: Verify source of "uneducated" - may need removal or move to sourcebook

- **Unsteady Hands**
  - Item "unsteady-hands" not found in reference files for sources: Core
  - Recommendation: Verify source of "unsteady-hands" - may need removal or move to sourcebook

- **Weak Immune System**
  - Item "weak-immune-system" not found in reference files for sources: Core
  - Recommendation: Verify source of "weak-immune-system" - may need removal or move to sourcebook
