# The Matrix

**Source:** SR5 Core Rulebook
**Book Pages:** 214–259
**PDF Pages:** 216–261
**Section:** 6

---

## Overview

The Matrix is the worldwide wireless telecommunications network connecting virtually every electronic device on the planet. Users interact with it through icons — virtual representations of personas, devices, files, hosts, and marks — using either augmented reality (AR) overlays on the physical world or full virtual reality (VR) immersion. Hackers (deckers and technomancers) exploit the Matrix to gather intelligence, control devices, and attack opponents. The Matrix is governed by the Grid Overwatch Division (GOD), which enforces security on behalf of the megacorporations that own the infrastructure. This section covers all mechanical rules for Matrix interaction, including user modes, attributes, actions, hosts, IC, programs, agents, and the technomancer subsystem.

---

## Rules

### Matrix Basics

Every object in the Matrix is represented by an **icon**: a virtual representation that allows interaction. Icons can look like anything within Matrix protocols, which require them to be intuitively persona-shaped (between adult-dwarf and adult-troll size). The six types of Matrix objects are: **persona**, **device**, **file**, **host**, **mark**, and (rarely visible) **datastream**.

### Personas

A **persona** is the combination of a user and a device that gets the user onto the Matrix. A persona is usually based on a commlink, cyberdeck, or rigged vehicle/drone; technomancers have a **living persona** requiring no device. Only one persona can run at a time per user; switching requires rebooting both devices. Agents running alongside a persona appear as a separate persona.

### Devices

A device is any wireless-enabled physical object. It has a **Device Rating** (1–6) and two Matrix attributes: **Data Processing** and **Firewall**, both equal to its Device Rating by default. Files do not have their own ratings; they use their owner's ratings when defending.

### Personal Area Networks (PANs)

A commlink or cyberdeck can have up to (Device Rating × 3) **slaved** devices, becoming the **master**. The group of slaved devices plus the master is a **PAN**. Slaved devices use the higher of their own rating or the master's rating for defense tests. A mark on a slave also places a mark on the master (except for failed Sleaze actions, which only mark the device owner). Slaved devices under direct-connection attack cannot use the master's ratings.

### Wide Area Networks (WANs)

A host can slave a practically unlimited number of devices. All devices in a WAN are considered directly connected to each other. Only devices can be slaves in a WAN; the master must be a host.

### Files

A **file** is a collection of data (films, songs, books, financial records, images, etc.), including collections of other files ("folders"). Files can be protected with the Edit File action; protection rating equals the hits on the protection test. Protected files cannot be read, changed, deleted, or copied until the protection is broken (Crack File action).

### Hosts

**Hosts** are self-contained virtual places in the Matrix with no physical location. From outside, hosts are as large as buildings; inside they are typically larger than their exterior. A host's attributes are: Attack, Sleaze, Data Processing, Firewall — all equal to its **Host Rating** distributed as (Rating), (Rating+1), (Rating+2), (Rating+3) in any order. Host rating ranges from 1–12. Hosts share marks and spotting information with their IC. GOD does not track Overwatch Scores inside hosts (see Host Convergence).

### Matrix Authentication Recognition Keys (Marks)

A **mark** (Matrix Authentication Recognition Key) is a token placed on an icon that grants access. You can have up to **three marks** on any given icon (owners effectively have four). Marks are only visible to you by default; others need a Matrix Perception Test to see them. Marks last only one Matrix session and are deleted on reboot. Hackers reboot frequently to clear marks. You can give marks to others via Invite Mark. Marks are persona-specific and cannot be transferred.

### Owners

Every icon has exactly one **owner**. Owning an icon is equivalent to having four marks on it. The owner can always spot the icon. Ownership can be transferred (legitimate process takes ~1 minute; illegal change requires Extended Hardware + Logic [Mental] (24, 1 hour) Test — a glitch reports to authorities). File ownership changes by copying with Edit File.

### Grids

Three types of grids exist: **public grid** (slow, unreliable; all Matrix actions at −2 dice pool; accessible globally), **local grids** (AAA/AA megacorp sponsored; accessible only within physical service area), and **global grids** (10 Big Ten megacorp grids; accessible worldwide including orbit). Grid access is determined by lifestyle: Low/Squatter = public; Middle = local; High = global (one corp); Luxury = any grid. Cross-grid attacks suffer a −2 dice pool penalty unless you hop grids. Use Grid Hop (Data Processing action) if you have access, or Brute Force/Hack on the Fly to hop illegally. Grid penalties do not apply inside hosts.

### Matrix Attributes (ASDF)

There are four Matrix attributes, abbreviated **ASDF**:

- **Attack:** Offensive programs; used for Matrix combat and loud intrusion. Attack actions are illegal and raise OS.
- **Sleaze:** Stealth programs; used for quiet intrusion and subtle manipulation. Sleaze actions are illegal and raise OS.
- **Data Processing:** Information handling; used for most legal Matrix actions. Serves as the limit for Data Processing actions.
- **Firewall:** Defensive protection; the first line of defense against Matrix attacks. Acts as virtual armor (Device Rating + Firewall resists Matrix damage).

Commlinks have only Data Processing and Firewall (both equal to commlink rating). Decks and hosts have all four. The Matrix attribute for an action serves as the **limit** for that action's test.

### Cyberdecks

A cyberdeck is required for hacking. It has a **Device Rating**, an **Attribute Array** (four values distributed among ASDF in any order), a **Programs** count (max simultaneously running programs), and **Availability/Cost**. See Table: Cyberdecks. Decks have a built-in sim module (DNI suffices for VR). Reconfiguring a deck is a **Free Action** on your own Action Phase (not a Matrix action): swap two attributes, or swap a running program for a stored one.

**Cyberdeck Attribute Array assignment:** When you boot your deck, assign the four array values to Attack, Sleaze, Data Processing, and Firewall in any order you choose.

### Matrix Damage

Each device has a **Matrix Condition Monitor** with **8 + (Device Rating / 2)** boxes (round down). Matrix damage is always resisted by **Device Rating + Firewall**. When a persona is hit, the device it runs on takes the damage (technomancers take it as Stun). Matrix damage has no wound modifiers until the monitor is full. Matrix damage that becomes Stun for technomancers still applies wound penalties.

### Bricking

When a device's Matrix Condition Monitor is completely filled, it is **bricked** — ceases functioning, batteries drain, components fuse. A bricked device in VR causes dumpshock. Bricked devices can be repaired unless critically glitched during repair (permanently bricked). Devices that retain non-electronic functionality still work physically (a locked gun can still be used as a club; a bricked vibrosword still cuts).

### Repairing Matrix Damage

Repair requires a toolkit, one hour of work minimum, and a **Hardware + Logic [Mental]** test. Each hit removes one box of Matrix damage OR halves the time remaining (first halving: 1 hour → 30 min; second: 15 min; minimum: 1 Combat Turn = 3 seconds). Device is offline and unresponsive during repair.

### Non-Devices and Matrix Damage

IC programs and sprites have Matrix Condition Monitors (8 + Level/2 boxes) but cannot be repaired — they lose all damage when they stop running or return to the Resonance. Hosts and files cannot be attacked with Matrix damage and have no Matrix Condition Monitors. Technomancers have no Matrix Condition Monitor; all Matrix damage they take is converted to Stun (resisted with living persona's Device Rating + Firewall = Resonance + Willpower).

### Biofeedback Damage

Biofeedback is Matrix code that forces the sim module to misbehave, causing temporary or permanent physical damage. It only applies in VR mode. In **cold-sim VR**, biofeedback is **Stun**. In **hot-sim VR**, biofeedback is **Physical**. Biofeedback is resisted with **Willpower + Firewall**.

### Dumpshock

Disconnecting from VR without gracefully switching to AR first causes **dumpshock**: biofeedback damage with DV **6S** (cold-sim) or **6P** (hot-sim), resisted with Willpower + Firewall. Additionally, the victim is disoriented and takes a **−2 dice pool modifier to all actions for (10 − Willpower) minutes**. If bricked while in VR, use only Willpower for the resistance test (no Firewall available).

### Link-Locking

A persona or device can be **link-locked** by another persona sending keep-alive signals that cancel any attempt to leave the Matrix. While link-locked, you cannot use Switch Interface Mode, Enter/Exit Host, or Reboot. Escape requires the **Jack Out** action (p. 240); success usually causes dumpshock. Any persona, agent, technomancer, or sprite can link-lock. If multiple personas have you link-locked, beat each individually with a single Jack Out roll (compare hits to each separately).

### User Modes

Three modes of Matrix interaction:

| User Mode              | Initiative                  | Initiative Dice          | Notes                                                                     |
| ---------------------- | --------------------------- | ------------------------ | ------------------------------------------------------------------------- |
| Augmented Reality (AR) | Physical Initiative         | Physical Initiative Dice | Can be distracting (−2 to Perception tests if attention is split)         |
| Cold-Sim VR            | Data Processing + Intuition | 3D6                      | Body goes limp; biofeedback = Stun                                        |
| Hot-Sim VR             | Data Processing + Intuition | 4D6                      | +2 dice pool bonus to all Matrix actions; biofeedback = Physical; illegal |

Maximum Initiative Dice cap is 5D6 regardless of bonuses.

### Noise

**Noise** is a negative dice pool modifier applied to Matrix actions (not defense or resistance tests). Calculate noise as: (distance noise) + (situation noise) − (noise reduction). Any positive result is a penalty.

**Distance noise:**

- Directly connected (any distance): 0
- Up to 100 meters: 0
- 101–1,000 m (1 km): 1
- 1,001–10,000 m (10 km): 3
- 10,001–100,000 m (100 km): 5
- Greater than 100 km: 8

**Situation noise:**

- Dense foliage: 1 per 5 meters
- Faraday cage: no signal (action blocked)
- Fresh water: 1 per 10 cm
- Jamming: 1 per hit on Jam Signals actions
- Metal-laced earth or wall: 1 per 5 meters
- Salt water: 1 per centimeter
- Spam zone or static zone: Rating
- Wireless negation (wallpaper or paint): Rating

**Spam and Static Zone Noise Ratings:**
| Spam Zone | Static Zone | Noise Rating |
|---|---|---|
| City downtown | Abandoned building | 1 |
| Sprawl downtown | Abandoned neighborhood, barrens | 2 |
| Major event or advertising blitz | Rural area, abandoned underground area, heavy rain or snow | 3 |
| Commercial area in a city | Wilderness, severe storm | 4 |
| Commercial area in a sprawl | Remote place with satellite access only | 5 |
| Massive gathering or widespread emergency | Remote, enclosed place (cave, desert ruin) | 6 |

Direct connections ignore all noise.

### Direct Connections

All devices have a **universal data connector** (UDC), the global standard for wired connections. Cyberdecks and datajacks include ~1 meter of retractable microfil cable; external cables cost ~5¥/meter. Direct connections ignore all noise and cross-grid penalties. Devices without wireless capability (**throwbacks**) can only be hacked via direct connection.

### Illegal Actions

All **Attack** and **Sleaze** actions are illegal. Failing an Attack action causes the target to send rejected code back at you: 1 box of Matrix damage per net hit on the defense test (unresisted). Failing a Sleaze action causes the target to immediately place a free mark on you (and alert its owner / launch IC).

### Overwatch Score and Convergence

Every Attack or Sleaze action generates **Overwatch Score (OS)**: increases by the number of hits the **target** gets on its defense test. OS also increases by 2D6 every 15 minutes (rolled secretly by the GM). When OS reaches **40**, **convergence** occurs:

1. The grid's demiGOD hits the persona for **12 DV Matrix damage** (resisted normally)
2. Forces the persona to reboot (erasing all marks, dumping from VR)
3. Reports physical location to grid owner, host owner, and authorities

GOD-sanctioned users (spiders, G-men) never accumulate OS. Inside a host, OS does not change; if convergence is reached while in a host, the host places 3 marks on you and starts launching IC (host convergence). Leaving the host after convergence triggers immediate demiGOD convergence.

### Matrix Perception

**Matrix Perception** (Complex Action; Computer + Intuition [Data Processing] v. Logic + Sleaze for silent targets) is used both for finding icons and analyzing them. Each net hit reveals one piece of information:

- Spot a target icon / icon type (host, persona, device, file)
- Most recent edit date of a file
- Number of Matrix damage boxes on the target's Condition Monitor
- Presence of a Data Bomb on a file, and its rating
- Programs being run by a persona
- Target's Device Rating
- Target's commcode
- Rating of one of the target's Matrix attributes
- Whether a file is protected, and at what rating
- The grid a persona, device, or host is using
- Whether a silent-running icon is within 100 meters (on grid) or in the host
- The last Matrix action an icon performed, and when
- The marks on an icon (but not their owners)

**Spotting rules (Matrix Spotting Table):**

| Target is...       | Not Running Silent                            | Running Silent                                                   |
| ------------------ | --------------------------------------------- | ---------------------------------------------------------------- |
| Within 100 meters  | Automatic                                     | —                                                                |
| Outside 100 meters | Simple Computer + Intuition [Data Processing] | Opposed Computer + Intuition [Data Processing] v. Logic + Sleaze |
| A host             | Automatic                                     | —                                                                |

You can always spot icons you have a mark on (no test, no distance limit). Marks cannot run silent.

### Spotting Duration

Once spotted, you continue to spot an icon until: (a) the icon successfully uses Hide against you, or (b) the target reboots or jacks out. If looking for a silent icon already known to be present, find it with Opposed Computer + Intuition [Data Processing] v. Logic + Sleaze (net hits: first hit spots, remainder give info).

### Running Silent

Switching a commlink, deck, device, or living persona to **silent running** is a **Simple Action**. Running silent imposes a **−2 dice pool modifier to all your Matrix actions** due to the extra processing overhead. Silent icons within 100 meters can be detected with a Matrix Perception hit; finding them requires the opposed spotting test.

### Noticing Hackers

- **Attack action success:** Target becomes aware it is under attack (actively searches, almost always alerts owner / launches IC). Attack action failure: target is not notified.
- **Sleaze action failure:** Target immediately places a free mark on the attacker (or the device owner if the target is a device). If the target already has 3 marks on it from that source, it does not get another, but it still alerts and launches IC.

### Device Ratings

| Device Type   | Device Rating | Examples                                                                                                |
| ------------- | ------------- | ------------------------------------------------------------------------------------------------------- |
| Simple        | 1             | General appliances, public terminals, entertainment systems                                             |
| Average       | 2             | Standard personal electronics, basic cyberware, vehicles, drones, weapons, residential security devices |
| Smart         | 3             | Security vehicles, alphaware, corporate security devices                                                |
| Advanced      | 4             | High-end devices, betaware, military vehicles and security devices                                      |
| Cutting Edge  | 5             | Deltaware, credsticks, black-ops vehicles and security devices                                          |
| Bleeding Edge | 6             | Billion-nuyen experimental devices, spacecraft                                                          |

### Matrix Actions

Matrix actions are only available in the Matrix. When a defense test calls for a Mental attribute, use the owner's rating. Unattended devices substitute Device Rating for any Mental attribute they lack (e.g., Device Rating replaces Intuition vs. Control Device). All Matrix action tests use the relevant Matrix attribute as the **limit**.

#### Action Listings

**BRUTE FORCE** (Complex Action)
Marks Required: none | Test: Cybercombat + Logic [Attack] v. Willpower + Firewall
Places 1 mark on the target (Attack action = loud/illegal). Optionally inflict 1 DV Matrix damage per 2 full net hits (resisted with Device Rating + Firewall). Declaring 2 marks: −4 dice pool; 3 marks: −10 dice pool. Can also hop to a grid without access (defense pool: 4 dice for local, 6 dice for global); success hops the grid without alerting GOD.

**CHANGE ICON** (Simple Action)
Marks Required: Owner | Test: none (Data Processing)
Change the target icon's appearance.

**CHECK OVERWATCH SCORE** (Simple Action)
Marks Required: none | Test: Electronic Warfare + Logic [Sleaze] v. 6 dice
Reveals your OS as it was when the action started, plus defense hits. This is a Sleaze action.

**CONTROL DEVICE** (Variable Action)
Marks Required: varies | Test: [Data Processing (or special)] v. [action type] or Electronic Warfare + Intuition [Sleaze] v. Intuition + Firewall
Perform an action through a device you control. Skill and attribute for the test match what you'd use physically. Data Processing is the limit (or special). Action type (Free/Simple/Standard/Complex) matches the device action; mark requirements: 1 mark for Free, 2 for Simple, 3 for Standard or Complex. Split dice pool for multiple devices (unless identical commands as owner). Uses Sleaze when Sleaze is the limit (incurs OS).

**CRACK FILE** (Complex Action)
Marks Required: 1 | Test: Hacking + Logic [Attack] v. Protection Rating × 2
Removes protection from a file. Does not need to be on the file that holds the protected file.

**CRASH PROGRAM** (Complex Action)
Marks Required: 1 | Test: Cybercombat + Logic [Attack] v. Intuition + Firewall
Crashes and ends one of the target's running programs (specify which, after learning via Matrix Perception). Cannot restart until the device reboots.

**DATA SPIKE** (Complex Action)
Marks Required: none | Test: Cybercombat + Logic [Attack] v. Intuition + Firewall
Causes Matrix damage: DV = Attack rating + 1 per net hit + 2 per mark you have on the target. Resisted with Device Rating + Firewall.

**DISARM DATA BOMB** (Complex Action)
Marks Required: none | Test: Software + Intuition [Firewall] v. Data Bomb Rating × 2
Any net hits removes and deletes the Data Bomb. Failure triggers the bomb (damage + possible file deletion).

**EDIT FILE** (Complex Action)
Marks Required: 1 | Test: Computer + Logic [Data Processing] v. Intuition + Firewall
Create, change, copy, delete, or protect any file. Each action alters one detail. Defender is the host (if in a host) or file owner. Copying a file makes you the new owner. Fails automatically if copying a file with active Data Bomb protection. To protect a file: Simple Computer + Logic [Data Processing] test; hits = protection rating. For continuous edits (e.g., removing from video feed), perform once per Combat Turn.

**ENTER/EXIT HOST** (Complex Action)
Marks Required: 1 | Test: n/a
Enter a host you have a mark on, or exit a host you're already in. No test required; hosts allow anyone with a mark to enter, and anyone inside can exit.

**ERASE MARK** (Complex Action)
Marks Required: special | Test: Computer + Logic [Attack] v. Willpower + Firewall
Erase a mark from your persona or another icon. Requires 3 marks on the icon from which you're erasing. Erasing 2 marks at once: −4 dice pool; 3 at once: −10 dice pool (all marks must be from same icon/source). Cannot change the target's owner.

**ERASE MATRIX SIGNATURE** (Complex Action)
Marks Required: none | Test: Computer + Resonance [Attack] v. (Signature Rating) × 2
Erase a Resonance signature (technomancer or sprite). Requires Resonance attribute. Attack action (raises OS and risks Matrix damage). Temporarily hide a signature: Erase Signature test; gone for 1 Combat Turn per hit.

**FORMAT DEVICE** (Complex Action)
Marks Required: 3 | Test: Computer + Logic [Sleaze] v. Willpower + Firewall
Rewrites device boot code to shut it down permanently (or until software is replaced: Extended Software + Logic [Mental] (12, 1 hour)). Device loses all wireless modifiers but retains physical mechanical function.

**FULL MATRIX DEFENSE** (Interrupt Action)
Marks Required: Owner | Test: none (Firewall action)
Adds Willpower to the defense dice pool against any Attack action defense test (or stacks if already added). Initiative Score reduced by 10. Effect lasts for the rest of the Combat Turn.

**GRID HOP** (Complex Action)
Marks Required: none | Test: none (Data Processing)
Hop to another grid you have legitimate access to. Must leave host first. If no legitimate access, use Brute Force or Hack on the Fly.

**HACK ON THE FLY** (Complex Action)
Marks Required: none | Test: Hacking + Logic [Sleaze] v. Intuition + Firewall
Places 1 mark on target (Sleaze action = quiet/illegal). Every 2 full net hits = 1 hit for Matrix Perception. Declaring 2 marks: −4; 3 marks: −10. Can also hop grids without access (defense: 4 dice local, 6 dice global); success hops without alerting GOD/demiGOD.

**HIDE** (Complex Action)
Marks Required: 0 | Test: Electronic Warfare + Intuition [Sleaze] v. Intuition + Data Processing
Makes a target that was spotting you lose you. Cannot hide from an icon that has a mark on you (must clear marks first).

**INVITE MARK** (Simple Action)
Marks Required: Owner | Test: none (Data Processing)
Offer other personas the opportunity to put a mark on your device, file, persona, host, or IC program. Set the number, duration, and offer duration. Revocable before the mark is placed; after placement requires Erase Mark or reboot.

**JACK OUT** (Simple Action)
Marks Required: Owner | Test: Hardware + Willpower [Firewall] v. Logic + Attack (if link-locked)
Jacks out of the Matrix and reboots the device, causing dumpshock if link-locked and test fails (or if normally booted while in VR). Beat each link-locking persona individually with a single roll.

**JAM SIGNALS** (Complex Action)
Marks Required: Owner | Test: Electronic Warfare + Logic [Attack]
Turns the device into a local jammer. All devices and Matrix actions within 100 meters receive noise equal to your hits on this test. Cannot perform any other Matrix actions while jamming. For directional or selective jamming, use a dedicated jammer device.

**JUMP INTO RIGGED DEVICE** (Complex Action)
Marks Required: 3 | Test: Electronic Warfare + Logic [Data Processing] v. Willpower + Firewall
Prerequisites: 3 marks on target, be in VR, device has rigger adaptation, have a control rig. The device's icon becomes part of your persona. As device owner/with permission, no test needed. Only one person can be jumped in at a time.

**MATRIX PERCEPTION** (Complex Action)
Marks Required: none | Test: Computer + Intuition [Data Processing] (v. Logic + Sleaze for silent targets)
Find icons and analyze Matrix objects. Simple test for non-silent distant targets, opposed for silent. First hit spots the target; additional hits reveal information (see Matrix Perception section).

**MATRIX SEARCH** (Special Action)
Marks Required: n/a | Test: Simple Computer + Intuition [Data Processing]
Search the Matrix for information. Time and threshold depend on availability:

| Information Type                     | Threshold | Base Time  |
| ------------------------------------ | --------- | ---------- |
| General Knowledge or Public          | 1         | 1 minute   |
| Limited Interest or Not Publicized   | 3         | 30 minutes |
| Hidden or Actively Hunted and Erased | 6         | 12 hours   |
| Protected or Secret                  | N/A       | N/A        |

Dice pool modifiers: Intricate/Specialized −1; Obscure −2; On another grid −2.
Net hits above threshold halve the remaining time (divide base time by net hits). Failing still costs the full base time. Protected info requires entering the relevant host and searching there (base time: 1 minute regardless).

**REBOOT DEVICE** (Complex Action)
Marks Required: 3 | Test: Computer + Logic [Data Processing] v. Willpower + Firewall
Shuts down and reboots the target device at end of current Combat Turn. Device disappears from Matrix until reboot completes. Rebooting resets OS to 0 and erases all marks. If in VR when rebooted, suffer dumpshock. Can set a delay. Doesn't work on hosts, living beings (technomancers), or Resonance constructs. Only works on devices you own (no test needed). Cannot reboot a link-locked device.

**SEND MESSAGE** (Simple Action)
Marks Required: n/a (or 1) | Test: none (Data Processing)
Send a text/audio message (short sentence), image, or file to a user whose commcode you have. Via DNI (AR or VR), can send up to a paragraph. Can also open a live feed to recipients.

**SET DATA BOMB** (Complex Action)
Marks Required: 1 | Test: Software + Logic [Sleaze] v. (Device Rating × 2)
Set a Data Bomb on a file. Choose rating (up to net hits on the test), choose whether it deletes the file on activation, and set the disarming passcode. One Data Bomb per file at a time. Triggered when someone tries to read, edit, copy, protect, delete, or add another Data Bomb without the passcode. On activation: causes (Rating)D6 Matrix damage (resisted normally) to the triggering icon; deletes the file if set to do so; then self-deletes. Can be detected with Matrix Perception; disarmed with Disarm Data Bomb.

**SNOOP** (Complex Action)
Marks Required: 1 | Test: Electronic Warfare + Intuition [Sleaze] v. Logic + Firewall
Intercept Matrix traffic between your target and any other icon as long as you have the mark. Listen/view live or save for later.

**SPOOF COMMAND** (Complex Action)
Marks Required: 1 (see description) | Test: Hacking + Intuition [Sleaze] v. Logic + Firewall
Spoof a device owner's identity to make a device think a command is legitimate. Need 1 mark on the icon you're imitating (not on the target). Only works on devices and agents (not IC, sprites, hosts, personas).

**SWITCH INTERFACE MODE** (Simple Action)
Marks Required: Owner | Test: none (Data Processing)
Switch between AR and VR (or vice versa). Switching VR→AR loses bonus Initiative Dice. Cannot switch if link-locked.

**TRACE ICON** (Complex Action)
Marks Required: 2 | Test: Computer + Intuition [Data Processing] v. Willpower + Sleaze
Find the physical location of a device or persona. Know the location as long as you have at least 1 mark on the target. Does not work on hosts (no physical location) or IC (confined to host).

### Programs

Programs (technically **cyberprograms**) are files that run on a deck. Only one copy of a program type can run at a time. Benefits apply only while running. Max simultaneous programs = deck's Programs value (can store any number). Programs appear as icons connected to your persona.

**Common Programs** (80¥ each, available everywhere):

- **Browse:** Halves time for Matrix Search actions.
- **Configurator:** Stores an alternate deck configuration; switch to it on next reconfigure (even if Configurator stops running at that point). Configuration stored doesn't change when recalled.
- **Edit:** +2 to Data Processing limit for Edit File tests.
- **Encryption:** +1 bonus to Firewall attribute.
- **Signal Scrub:** Rating 2 noise reduction.
- **Toolbox:** +1 bonus to Data Processing attribute.
- **Virtual Machine:** Run 2 additional programs simultaneously; whenever persona takes Matrix damage, take 1 additional unresistable box of Matrix damage.

**Hacking Programs** (250¥, 4R each):

- **Armor:** +2 dice pool modifier to resist Matrix damage.
- **Baby Monitor:** Always know your current Overwatch Score (uses GOD algorithms).
- **Biofeedback:** Attacks against other icons with biofeedback signals. Only vs. biological targets. When attack causes Matrix damage, target also takes equal Stun (cold-sim) or Physical (hot-sim) biofeedback damage. Also applies to damage from failed Attack actions against you. Biofeedback damage resisted with Willpower + Firewall.
- **Biofeedback Filter:** +2 dice pool to resist biofeedback damage.
- **Blackout:** Like Biofeedback but only causes Stun, even in hot-sim.
- **Decryption:** +1 bonus to Attack attribute.
- **Defuse:** +4 dice pool modifier to resist Data Bomb damage.
- **Demolition:** +1 to the rating of any Data Bomb you set while this is running.
- **Exploit:** +2 bonus to Sleaze attribute when attempting Hack on the Fly.
- **Fork:** Perform a single Matrix action on two targets. Single test; each target defends separately. Modifiers from each count toward your pool.
- **Guard:** Reduces extra damage from marks by 1 DV per mark.
- **Hammer:** +2 DV worth of Matrix damage whenever you cause Matrix damage with an action (does not apply to targets damaged by failed Attack actions against you).
- **Lockdown:** When you cause damage to a persona, the target is link-locked until they stop running this program or successfully Jack Out.
- **Mugger:** Bonus damage from marks increased by 1 DV per mark.
- **Shell:** +1 dice pool modifier to resist both Matrix damage and biofeedback damage (stacks with similar modifiers).
- **Sneak:** +2 dice pool modifier to defend against Trace Icon. If a demiGOD converges while this program runs, they don't get your physical location (still suffer other convergence effects).
- **Stealth:** +1 bonus to Sleaze attribute.
- **Track:** +2 to Data Processing attribute for Trace Icon tests. If target is running Sneak, negates the Sneak +2 bonus from that program (not both).
- **Wrapper:** Icons can look like anything when you use Change Icon. Others can see the true icon with Matrix Perception (but must suspect enough to check).

**Programs Table:**

| Program            | Availability | Cost            |
| ------------------ | ------------ | --------------- |
| Common Program     | —            | 80¥             |
| Hacking Program    | 4R           | 250¥            |
| Agent (Rating 1–3) | Rating × 3   | Rating × 1,000¥ |
| Agent (Rating 4–6) | Rating × 3   | Rating × 2,000¥ |

### Agents

Agents are autonomous programs rated 1–6. Each occupies one program slot. Agents use the Matrix attributes of the device they run on and have Computer, Hacking, and Cybercombat skills at a rating equal to their own. An agent runs as a program and can use other programs running on the same device. Agents have their own persona and icon. An agent is as smart as a pilot program of the same rating. Any attack on an agent damages the device it runs on (not the agent itself), sharing the device's Matrix Condition Monitor.

### Hosts

Hosts are self-contained virtual spaces on the Matrix. Inside a host you can interact with other icons; outside you cannot. The virtual space inside is separate from the outside grid. Each host is on a specific grid and can be accessed from any grid (you use your own grid while inside). GOD tracks traffic to and from hosts (Overwatch Score still increases). Host attributes are assigned in any order: (Rating), (Rating+1), (Rating+2), (Rating+3). All IC in a host share marks and spotting information with each other and the host.

### Host Archives

**Archives** are areas within hosts that hold files not in use; they are inaccessible to average hackers. To retrieve an archived file, you must first get a mark on the file (which requires convincing someone who already has a mark to bring it out).

### Host Convergence

GOD doesn't track Overwatch Score inside a host. OS continues accumulating but doesn't trigger normal convergence. If convergence is reached while inside a host, the **host** places 3 marks on you and starts deploying IC (instead of the normal demiGOD consequences). If you then leave the host, you immediately face demiGOD convergence. Recommendation: jack out from inside the host.

### Security Response

When a host spots illegal or suspicious activity, it informs its owner (or security spider) and launches IC. A host can launch **one IC program per Combat Turn** at the start of each turn. Maximum IC running simultaneously equals the host's rating; no more than one of each type at a time. When an IC program is bricked, it crashes and vanishes; the host can relaunch a copy at the start of the next Combat Turn. Patrol IC is always running and does not count against the IC limit.

### Types of IC

IC rolls **Host Rating × 2 [Attack]** for its attack test. Resistance dice pool for each IC type is listed. IC attacks are always legal (no OS). IC is considered hot-sim (4D6 Initiative Dice). IC shares marks and spotting data with host. IC cannot be repaired; bricked IC vanishes.

- **Acid:** [Attack] v. Willpower + Firewall. On 1+ net hits: reduces target's Firewall by 1 (cumulative, until reboot). At Firewall 0: 1 DV Matrix damage per net hit.
- **Binder:** [Attack] v. Willpower + Data Processing. On 1+ net hits: reduces target's Data Processing by 1 (cumulative, until reboot). At DP 0: 1 DV Matrix damage per net hit.
- **Black IC:** [Attack] v. Intuition + Firewall. Causes (Attack) DV Matrix damage (+1 DV/net hit, +2 DV/mark on target) AND equal amount of biofeedback damage. Link-locks target.
- **Blaster (Grey IC):** [Attack] v. Logic + Firewall. Causes (Attack) DV Matrix damage (+1 DV/net hit, +2 DV/mark). Biofeedback damage is only Stun. Single successful attack also link-locks target.
- **Crash:** [Attack] v. Intuition + Firewall. If IC has a mark on target and hits, crashes one of target's running programs (random).
- **Jammer:** [Attack] v. Willpower + Attack. On 1+ net hits: reduces target's Attack by 1 (cumulative, until reboot). At Attack 0: 1 DV Matrix damage per net hit.
- **Killer:** [Attack] v. Intuition + Firewall. Causes (Attack) DV Matrix damage (+1 DV/net hit, +2 DV/mark).
- **Marker:** [Attack] v. Willpower + Sleaze. On 1+ net hits: reduces target's Sleaze by 1 (cumulative, until reboot). At Sleaze 0: 1 DV Matrix damage per net hit.
- **Patrol:** No Attack. Scans all marks in the host using Matrix Perception action; alerts host/IC to illegal activity. Never attacks; doesn't take Matrix damage from failed attacks. Shares spotting info with host. Usually running 24/7. Does not count against IC limit for always-running.
- **Probe:** [Attack] v. Intuition + Firewall. Each successful "attack" adds another mark (up to 3) on the target for the host and its IC.
- **Scramble:** [Attack] v. Willpower + Firewall. If host has 3 marks on target when this hits, target reboots immediately (dumpshock if in VR).
- **Sparky (Psycho Killer):** [Attack] v. Intuition + Firewall. (Attack) DV Matrix damage (+1 DV/net hit, +2 DV/mark) plus equal biofeedback damage.
- **Tar Baby:** [Attack] v. Logic + Firewall. Link-locks target on hit. If already link-locked, places a mark (up to 3).
- **Track:** [Attack] v. Willpower + Sleaze. If IC has 2+ marks on target and hits, host (and owners) discover target's physical location.

### Technomancers

Technomancers are metahumans who interface with the Matrix without hardware, using an innate ability called **Resonance**. They have a **Resonance** attribute (natural max = Essence, rounded down) that affects all their Resonance abilities and their living persona. For every point (or fraction) of Essence lost, both current Resonance and maximum Resonance are reduced by 1. Resonance = 0 means loss of all Technomancer qualities and Resonance abilities. Technomancers use AR or hot-sim VR natively (cold-sim requires a cyberdeck/commlink). In hot-sim VR, Resonance is added to the dice pool for Addiction Tests. Technomancers get +2 dice pool bonus to all Matrix Perception Tests. They have no separate Matrix Condition Monitor; all Matrix damage is taken as Stun (resisted with living persona Device Rating + Firewall = Resonance + Willpower).

### Living Persona

The technomancer's **living persona** exists in the Matrix as long as they are awake. Its attributes:

| Matrix Attribute | Rating    |
| ---------------- | --------- |
| Device Rating    | Resonance |
| Attack           | Charisma  |
| Sleaze           | Intuition |
| Data Processing  | Logic     |
| Firewall         | Willpower |

Living personas cannot be reconfigured, cannot run programs, cannot be slaved or master, and cannot be part of a PAN or WAN. Technomancers cannot store files on their living persona (no onboard storage; use nearby devices). Rebooting a living persona is the same as the Reboot Device action mechanically but doesn't count as a Matrix action. Technomancers using a commlink or cyberdeck cannot use Resonance abilities (only one persona at a time).

### Resonance Signatures

When a technomancer uses a Resonance ability, they leave a **Resonance signature** on the target (in a host, the signature is left there too). The signature has a rating equal to the technomancer's Resonance when the ability was used; it lasts for (signature rating × 1 hour). Signatures can be detected by other Resonance beings with 3+ hits on a Matrix Perception Test. With 5+ hits, detect the type and power of the ability. Signatures can be erased with the Erase Matrix Signature action.

### Resonance Actions

Resonance actions only operate in the Matrix but are **not** Matrix actions — they do not follow noise rules, do not trigger Overwatch Score, do not require marks. Technomancers can still perform normal Matrix actions (which do follow all Matrix action rules including OS). Almost all Resonance actions cause **Fading**.

**Resonance Action listing:**

- **Call/Dismiss Sprite** (Simple Action): Call a registered sprite to appear at the start of next Combat Turn; or dismiss a sprite (releasing remaining tasks).
- **Command Sprite** (Simple Action): Command a sprite to do something, using up one of its tasks.
- **Compile Sprite** (Complex Action): Test: Compiling + Resonance [Level] v. Sprite Level. Brings a new sprite into existence (see Sprites).
- **Decompile Sprite** (Complex Action): Test: Decompiling + Resonance [Level] v. Sprite Rating (+ compiler's Resonance if registered). Reduces sprite tasks; at 0 tasks it returns to the Resonance.
- **Kill Complex Form** (Complex Action): Test: Software + Resonance [Level] v. Complex Form Level + threader's Resonance. Ends a sustained complex form being run by another technomancer.
- **Register Sprite** (Complex Action): Test: Registering + Resonance [Level] v. Sprite Level × 2. Registers a compiled sprite with the Matrix for extended service (see Registering a Sprite).
- **Thread Complex Form** (Complex Action): Test: Software + Resonance [Level] v. special. Threads a complex form (see Threading).

### Complex Forms

Complex forms are abilities unique to technomancers, analogous to programs. A technomancer can know (Resonance × 2) complex forms. Learn a new complex form: analyze an existing one with Software + Intuition [Mental]; divide 12 by net hits = days to learn; spend Karma = days at the end.

Each complex form has:

- **Target:** what it works on (Device, Persona, File, Self, Sprite)
- **Duration:** I (Immediate), S (Sustained), or P (Permanent)
- **Fading Value (FV):** the DV of Fading damage caused (expressed as L ± modifier, where L = Level chosen)

Threading is affected by noise, cross-grid penalties (−2 for targets on another grid, −2 for public grid), and requires the target to be spotted. Sustained complex forms require concentration: −2 dice pool to all actions per sustained form. If concentration broken, GM calls Simple Resonance + Willpower (2) to maintain. Cannot sustain complex forms while unconscious.

**Fading from threading:** DV = FV based on the Level chosen (minimum 2 DV before resistance). If threading test hits > Resonance rating, Fading is Physical; otherwise Stun.

**Resonance Library — Complex Forms:**

| Complex Form                    | Target  | Duration | FV  | Effect                                                                                                                                                                                           |
| ------------------------------- | ------- | -------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Cleaner                         | Persona | P        | L+1 | Reduce target's Overwatch Score by 1 per hit (Simple Software + Resonance [Level] test)                                                                                                          |
| Diffusion of [Matrix Attribute] | Device  | S        | L+1 | Opposed Software + Resonance [Level] v. Willpower + Firewall; reduce target attribute by net hits (min 1)                                                                                        |
| Editor                          | File    | P        | L+2 | Software + Resonance [Level] v. owner's Intuition + Data Processing; make Edit File-equivalent changes per net hits                                                                              |
| Infusion of [Matrix Attribute]  | Device  | S        | L+1 | Boost target attribute by hits scored (max 2× normal rating); one Infusion per attribute at a time; swapping attribute in Reconfigure ends it                                                    |
| Pulse Storm                     | Persona | I        | L+0 | Software + Resonance [Level] v. Logic + Data Processing; each net hit adds 1 to target's noise                                                                                                   |
| Puppeteer                       | Device  | I        | L+4 | Software + Resonance [Level] v. Willpower + Firewall; threshold 1/2/3 for Free/Simple/Complex; forces device to perform a Matrix action                                                          |
| Resonance Channel               | Device  | S        | L-1 | Communicate through Resonance channel; Simple Software + Resonance [Level]; each net hit reduces distance noise to target by 1                                                                   |
| Resonance Spike                 | Device  | I        | L+0 | Software + Resonance [Level] v. Willpower + Firewall; 1 box Matrix damage per net hit (unresistable)                                                                                             |
| Resonance Veil                  | Device  | S        | L-1 | Software + Resonance [Level] v. Intuition + Data Processing; convincing illusion — target must make Matrix Perception (threshold = net hits) to see through                                      |
| Static Bomb                     | Self    | I        | L+2 | Software + Resonance [Level] v. Intuition + Data Processing (all spotting icons); beat each separately; lose spotting of icons you beat                                                          |
| Static Veil                     | Persona | S        | L-1 | Simple Software + Resonance [Level] (threshold 1 on public grid, 2 elsewhere); veiled persona's OS doesn't increase due to time; still increases from illegal actions; don't hop to another grid |
| Stitches                        | Sprite  | P        | L-2 | Simple Software + Resonance [Level]; remove 1 box of Matrix damage per hit from target sprite                                                                                                    |
| Tattletale                      | Persona | P        | L-2 | Simple Software + Resonance [Level]; increase target's Overwatch Score by 1 per hit (only targets with an OS)                                                                                    |
| Transcendent Grid               | Self    | I        | L-3 | Simple Software + Resonance [Level]; connect to all grids simultaneously for 1 minute per hit (no cross-grid or public-grid penalties; you don't take them but others targeting you do)          |

### Fading

**Fading** is the mental drain from using Resonance abilities. Fading DV is indicated by each complex form/sprite action. Fading from threading: if threading test hits > Resonance, Fading is Physical; otherwise Stun. From compiling/decompiling/registering a sprite: Fading = 2 × sprite's net hits on its Opposed Test (minimum 2 DV); Physical if sprite Level > Resonance, otherwise Stun. Fading can only be healed naturally (rest, not medically).

Resist Fading with **Resonance + Willpower**.

### Sprites

Sprites are digital entities formed from (or summoned from) the Resonance. They are personas without devices, semi-autonomous and obedient. A sprite has:

- Device Rating = Level
- Resonance = Level (of its compiler)
- Matrix Condition Monitor: 8 + (Level / 2) boxes
- Initiative: (Level × 2) + bonus (varies by type), 4D6 Initiative Dice
- Four Matrix attributes based on type and Level
- Skills: Computer, Hacking, and/or Electronic Warfare and/or Hardware and/or Cybercombat (varies by type) at rating equal to Level
- All IC in host share marks/spotting with sprites

Using a sprite power is a **Standard Resonance action** (not a Matrix action).

### Compiling a Sprite

**Compile Sprite** (Complex Action — Resonance action): Compiling + Resonance [Level] v. Sprite Level.

- Choose Level up to (Resonance × 2)
- Net hits = tasks the sprite owes you
- One compiled sprite at a time (limit)
- Fading: 2 DV per net hit (not net hit) on the sprite's resistance roll, minimum 2 DV; Stun unless sprite Level > Resonance (then Physical)
- Sprite's Overwatch Score starts counting immediately on compilation

### Compiled Sprite Tasks

A task is one simple job: a single use of a sprite power, one Combat Turn of Matrix actions toward the same job, participation in cybercombat until all enemies defeated or escape, or sustaining a complex form (costs one task per Level per sustained Combat Turn).

**Remote tasks:** Sending a sprite to another grid or host you're not in. When done, sprite returns to the Resonance (loses remaining tasks).

### Registering a Sprite

**Register Sprite** (Complex Action — Resonance action): Registering + Resonance [Level] v. Sprite Level × 2.

- Takes hours equal to sprite's Level (OS doesn't increase during this time; neither party can take other actions)
- End of time: Opposed test. Net hits on the Registering test = additional tasks the sprite owes you. Fading: 2 DV per net hit on sprite's defense roll (not net hit), minimum 2 DV.
- Registered sprites: OS is erased; can be restarted if performing an illegal action. Net hits added to task count minus 1 (for the re-registering task).
- Can register up to (Logic) registered sprites simultaneously.
- Registered sprites don't count toward the compiled sprite limit.

**Registered sprite additional tasks:**

- **Aid Study:** Gives a bonus equal to its Level for learning a new complex form (one task per form)
- **Assist Threading:** Adds its Level to a single complex form threading test
- **Loaned Task:** Sprite follows orders of another persona (not necessarily a technomancer); you choose how many tasks to loan
- **Remote Task:** Sprite returns to you when done (not back to Resonance)
- **Re-register Sprite:** Attempt to re-register for 1 task
- **Standby:** Sprite returns to Resonance until called; 1 task cost
- **Sustain Complex Form:** Sprite takes on sustaining a complex form (costs tasks equal to Level per sustaining Combat Turns)

### Sprite-Technomancer Link

Mental link exists while connected to the Matrix. Communication via text, images, words. Disconnection from the Matrix = loss of link (sprites continue working; registered sprites wait for reconnection; compiled sprites vanish when done). Sprites are personas, not devices; they cannot be part of a PAN or WAN.

### Decompiling Sprites

**Decompile Sprite** (Complex Action): Decompiling + Resonance [Level] v. target's Level (+ compiler's Resonance if registered). Each net hit reduces sprite's tasks by 1. At 0 tasks, sprite returns to Resonance on its next action. Fading: 2 DV per net hit (not net hit) on the sprite's defense roll, minimum 2 DV.

### Sprite Powers

Sprite powers are Standard Resonance actions (not Matrix actions). Each sprite type has specific powers:

- **Camouflage** (Data Sprite): Conceal a file within another file; hidden file only findable with Matrix Perception specifically looking for it; sprite must make this test to find and extract the file itself.
- **Cookie** (Courier Sprite): Tag a target persona with a cookie file; Hacking + Resonance [Sleaze] v. Intuition + Firewall; tracks all icon activity (hosts entered, communications metadata, programs used); transfers data to sprite at end of set duration. Cookie file runs silent, protected at sprite Level rating. Detected with Matrix Perception; removed by deleting the file's protection.
- **Diagnostics** (Machine Sprite): Evaluate inner workings of a device; Simple Hardware + Level [Data Processing]; each hit = +1 limit bonus to use/repair rolls for the device; takes the sprite's entire attention while active.
- **Electron Storm** (Fault Sprite): Sustained barrage of corrupting datastreams; Cybercombat + Resonance [Attack] v. Intuition + Firewall; first successful attack and each subsequent: (Resonance) DV Matrix damage (resisted normally); 2 points noise to the target; if sprite takes any Matrix damage, all electron storms end immediately.
- **Gremlins** (Machine Sprite): Hardware + Level [Attack] v. Device Rating + Firewall; causes device malfunction (glitch on 1–3 net hits; critical glitch on 4+ net hits chosen by GM).
- **Hash** (Machine Sprite): Temporarily protect a file with a unique Resonance algorithm; only the sprite can unprotect it; if sprite destroyed while carrying the file, file is permanently corrupted. Lasts up to (Level × 10) Combat Turns.
- **Stability** (Machine Sprite): Prevent normal malfunctions and accidents from affecting a marked target (including standard glitches, Gremlins, Accident powers); reduce critical glitches to standard glitches.
- **Suppression** (Crack Sprite): If sprite is in a host using this power when host launches IC, that IC is delayed by (Level / 2) Combat Turns; delayed IC can't act or be targeted.
- **Watermark** (Data Sprite): Tag an icon with an invisible Resonance-only visible marking; sprite can secretly leave messages on Matrix objects. Overwrite existing watermarks. Erasable with Erase Matrix Signature; otherwise lasts as long as the icon does.

### Sprite Database (All Five Types)

| Sprite  | Attack | Sleaze | Data Processing | Firewall | Initiative | Init Dice | Resonance | Skills                                 | Powers                           |
| ------- | ------ | ------ | --------------- | -------- | ---------- | --------- | --------- | -------------------------------------- | -------------------------------- |
| Courier | L      | L+3    | L+1             | L+2      | (L×2)+1    | 4D6       | L         | Computer, Hacking                      | Cookie, Hash                     |
| Crack   | L      | L+3    | L+2             | L+1      | (L×2)+2    | 4D6       | L         | Computer, Electronic Warfare, Hacking  | Suppression                      |
| Data    | L−1    | L      | L+4             | L+1      | (L×2)+4    | 4D6       | L         | Computer, Electronic Warfare           | Camouflage, Watermark            |
| Fault   | L+3    | L      | L+1             | L+2      | (L×2)+1    | 4D6       | L         | Computer, Cybercombat, Hacking         | Electron Storm                   |
| Machine | L+1    | L      | L+3             | L+2      | (L×2)+3    | 4D6       | L         | Computer, Electronic Warfare, Hardware | Diagnostics, Gremlins, Stability |

### Submersion

Technomancers can strengthen their connection to the Resonance through **submersion**. Submersion is measured in grades starting at Grade 1. Each grade costs Karma equal to (10 × Grade × 3). Submersion grade cannot exceed Resonance attribute. If Resonance is ever reduced below Submersion grade, grade is reduced (no refund; can re-purchase if Resonance recovers).

**Benefits of submersion:**

- Increases natural maximum Resonance by Submersion grade (natural max = 6 + Submersion grade)
- Access to Resonance Realms (mysterious data spaces only accessible by submerged technomancers)
- One **echo** per grade of Submersion

### Echoes

Echoes are new powers gained through each Submersion grade. Cannot pick the same echo twice (unless noted). Stackable echoes stack.

- **Attack Upgrade:** Living persona Attack +1 (can be taken twice)
- **Data Processing Upgrade:** Living persona Data Processing +1 (can be taken twice)
- **Firewall Upgrade:** Living persona Firewall +1 (can be taken twice)
- **Mind over Machine:** Benefit of Rating 1 control rig (can take up to 3 times; effective rating increases by 1 each time to max 3)
- **NeuroFilter:** +1 dice pool bonus to resist biofeedback damage (can be taken twice)
- **Overclocking:** +1D6 Initiative Dice while in hot-sim VR
- **Resonance Link:** One-way empathic link with another technomancer of choice (discern dominant mood and emotions, danger sense); both taking the echo creates a two-way link
- **Resonance [Program]:** Copy effects of one common or hacking program; can take multiple times, different program each time
- **Sleaze Upgrade:** Living persona Sleaze +1 (can be taken twice)

---

## Tables

| Table Name                 | Description                                                                          | Reference                                             |
| -------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| User Modes Table           | Initiative and Initiative Dice by mode (AR, Cold-Sim, Hot-Sim)                       | `the-matrix.json → tables.user-modes`                 |
| Noise and Matrix Use       | Distance-based noise levels                                                          | `the-matrix.json → tables.noise-distance`             |
| Spam and Static Zones      | Environmental noise ratings for common locations                                     | `the-matrix.json → tables.noise-zones`                |
| Device Ratings             | Device Rating by category with examples                                              | `the-matrix.json → tables.device-ratings`             |
| Matrix Spotting Table      | Spotting rules by target distance and silent running status                          | `the-matrix.json → tables.matrix-spotting`            |
| Cyberdecks                 | All standard decks with Device Rating, Attribute Array, Programs, Availability, Cost | `the-matrix.json → tables.cyberdecks`                 |
| Matrix Search Table        | Threshold and time by information type, dice pool modifiers                          | `the-matrix.json → tables.matrix-search`              |
| Matrix Actions by Function | All actions grouped by category (device manipulation, file manipulation, etc.)       | `the-matrix.json → tables.matrix-actions-by-function` |
| Matrix Actions by Limit    | All actions grouped by Matrix attribute (Attack, Sleaze, Data Processing, Firewall)  | `the-matrix.json → tables.matrix-actions-by-limit`    |
| Programs Table             | Programs with availability and cost                                                  | `the-matrix.json → tables.programs`                   |
| Sample Host Ratings        | Example host ratings by organization type                                            | `the-matrix.json → tables.sample-host-ratings`        |
| Living Persona Table       | Technomancer living persona attribute mappings                                       | `the-matrix.json → tables.living-persona`             |
| Sprite Database            | All five sprite types with full attribute arrays, skills, and powers                 | `the-matrix.json → tables.sprites`                    |

---

## Validation Checklist

- [ ] Matrix Condition Monitor = 8 + (Device Rating / 2), rounded down
- [ ] Matrix damage resisted by Device Rating + Firewall (always)
- [ ] Dumpshock DV = 6S cold-sim, 6P hot-sim; resisted by Willpower + Firewall; bricked device means Willpower only
- [ ] Dumpshock disorientation: −2 to all actions for (10 − Willpower) minutes
- [ ] Hot-sim VR grants +2 dice pool to all Matrix actions and 4D6 Initiative Dice
- [ ] Cold-sim VR grants 3D6 Initiative Dice; hot-sim grants 4D6; max cap 5D6
- [ ] Overwatch Score at 40 triggers convergence: 12 DV Matrix damage (unresisted) + forced reboot + physical location reported
- [ ] OS increases: (a) by hits target gets on defense test after Attack/Sleaze action, (b) by 2D6 every 15 minutes (GM secret roll)
- [ ] Host convergence (not grid convergence): 3 marks placed on persona, IC launched
- [ ] Running silent: −2 dice pool to all your Matrix actions
- [ ] Noise is a negative modifier to Matrix actions only (not defense or resistance tests)
- [ ] Direct connection: ignores all noise and cross-grid penalties
- [ ] Slaved device mark also marks the master (Attack actions and Brute Force mark master; failed Sleaze on slaved device only marks device owner)
- [ ] PAN: master can have up to (Device Rating × 3) slaved devices
- [ ] Brute Force: Cybercombat + Logic [Attack] v. Willpower + Firewall; Hack on the Fly: Hacking + Logic [Sleaze] v. Intuition + Firewall
- [ ] Data Spike DV = Attack rating + 1/net hit + 2/mark on target
- [ ] IC rolls Host Rating × 2 [Attack]; IC is always considered legal (no OS)
- [ ] IC Initiative: 4D6 (hot-sim equivalent)
- [ ] Host attributes distributed: (Rating), (Rating+1), (Rating+2), (Rating+3) in any order
- [ ] Fading minimum DV = 2 (before resistance); Physical if threading hits > Resonance, otherwise Stun
- [ ] Sprite Fading: 2 DV × sprite's defense net hits (not net hit), minimum 2 DV
- [ ] Technomancer Matrix damage → Stun (resisted with Resonance + Willpower)
- [ ] Technomancer Resonance max = Essence (rounded down); reduces 1:1 with Essence loss
- [ ] Sprite compiled max Level = Resonance × 2; only 1 compiled sprite at a time
- [ ] Registered sprites: up to (Logic) simultaneously; don't count toward compiled sprite limit
- [ ] Agent: uses device's Matrix attributes; Computer/Hacking/Cybercombat at agent rating; attacks damage the device it runs on
- [ ] Edit File protection: Simple Computer + Logic [Data Processing] test; hits = protection rating; protected file cannot be interacted with until Crack File succeeds
- [ ] Set Data Bomb: DV = (Rating)D6 Matrix damage, resisted normally; triggers on read/edit/copy/protect/delete/another-bomb-without-passcode
- [ ] Full Matrix Defense: adds Willpower to defense pool, −10 Initiative Score, lasts rest of Combat Turn
- [ ] Erase Mark: needs 3 marks on the icon; erasing 2 at once −4 pool; 3 at once −10 pool
- [ ] Jack Out (link-locked): Hardware + Willpower [Firewall] v. Logic + Attack; beat each link-locker separately with single roll
- [ ] Grid hop without access via Brute Force: defense 4 dice (local) or 6 dice (global); hop succeeds without alerting GOD
- [ ] Trace Icon: 2 marks required; Computer + Intuition [Data Processing] v. Willpower + Sleaze
- [ ] Reboot Device: 3 marks required; Computer + Logic [Data Processing] v. Willpower + Firewall; resets OS to 0, erases all marks
- [ ] Format Device: 3 marks required; device loses wireless mods but retains physical mechanical function
- [ ] Submersion Karma cost: 10 × Grade × 3 per grade

---

## Implementation Notes

### Priority for Implementation

1. **Core mechanics first:** Matrix Condition Monitor, damage/resistance formula, user modes and initiative, noise table, illegal actions / OS / convergence
2. **Actions:** Implement the full action table with correct tests, mark requirements, and limits before building any Matrix UI
3. **Hosts:** Host attributes formula (Rating, R+1, R+2, R+3) and convergence behavior differ meaningfully from grid behavior
4. **IC:** IC is always hot-sim, always legal, shares marks with host; each type has different mechanical effects
5. **Technomancers:** Living persona attribute table is the foundation; complex forms and sprites build on top

### Key Formulas

- `matrixConditionMonitor = 8 + Math.floor(deviceRating / 2)`
- `matrixDamageResistance = deviceRating + firewall`
- `biofeedbackResistance = willpower + firewall`
- `icAttackPool = hostRating * 2` (limit = host Attack rating)
- `dumpshockDV = inVR ? (hotSim ? 6 : 6) : 0` (P in hot-sim, S in cold-sim)
- `spriteConditionMonitor = 8 + Math.floor(spriteLevel / 2)`
- `fadingMinDV = 2`

### Data Storage Guidance

- Deck configurations are mutable at runtime (not character creation only); store `currentAttributeAssignment` separately from the deck's `attributeArray`
- Marks are session-state (not persistent character data); track as `marks: { [iconId: string]: number }` on the persona
- Overwatch Score is session-state; reset to 0 on reboot
- Host attributes should be stored as a distributed array of 4 values, not pre-labeled (owner assigns labels)
- Sprite tasks are session-state; compiled sprite is session-state; registered sprites are persistent character data

### Ambiguities and Edge Cases

> **Ambiguity:** The rules state that a slaved device under direct-connection attack "cannot use its master's ratings to defend itself" (p. 233). It is unclear whether this means the slave uses only its own ratings or is simply unprotected. Interpret as: use the slave's own Device Rating and Firewall only.

> **Ambiguity:** Full Matrix Defense states it adds Willpower to the defense dice pool "or adds it again if it's already in there." It is not defined whether FMD can be used multiple times per Combat Turn to keep stacking Willpower. Interpret as: one use per Combat Turn (reduces Initiative by 10 once).

> **Ambiguity:** The Matrix Spotting Table (p. 234/241) shows hosts as "automatic" to spot when not running silent, but provides no column for running-silent hosts. Interpret as: hosts cannot run silent (consistent with the rules text that "marks can't run silent" and hosts are effectively always addressable).

> **Cross-reference:** Rigger jump-in (Jump Into Rigged Device action) requires a control rig (see Rigger section). The Matrix chapter specifies 3 marks, VR mode, rigger adaptation on the device, and a control rig on the decker. The rigger chapter covers vehicle/drone combat details.

> **Cross-reference:** Better-than-Life (BTL) chips, hot-sim addiction mechanics, and the Drug/Addiction tables are referenced at p. 413 but defined in the Gear/Lifestyle section.

> **Cross-reference:** Changing Initiative when switching modes mid-combat (VR→AR loses bonus Initiative Dice) references the Changing Initiative rules at p. 160.

> **Cross-reference:** The Resonance Realms are mentioned as accessible through Submersion but are detailed in the Data Trails sourcebook, not the core rulebook.

> **Implementation note:** The "one of each type" IC limit means you should track which IC types are currently running in a host and prevent launching a second copy of the same type while the first is running (even after the first is bricked — wait until it's fully resolved/crashed before launching a new copy of that type).
