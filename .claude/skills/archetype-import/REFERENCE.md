# Archetype Import Quick Reference

## Priority Tables

### Metatype Priority

| Priority | Human     | Elf       | Dwarf     | Ork       | Troll     |
| -------- | --------- | --------- | --------- | --------- | --------- |
| A        | 9 special | 8 special | 7 special | 7 special | 5 special |
| B        | 7 special | 6 special | 4 special | 4 special | 0 special |
| C        | 5 special | 3 special | 1 special | 0 special | -         |
| D        | 3 special | 0 special | -         | -         | -         |
| E        | 1 special | -         | -         | -         | -         |

### Attributes Priority

| Priority | Points |
| -------- | ------ |
| A        | 24     |
| B        | 20     |
| C        | 16     |
| D        | 14     |
| E        | 12     |

### Skills Priority

| Priority | Skill Points | Group Points |
| -------- | ------------ | ------------ |
| A        | 46           | 10           |
| B        | 36           | 5            |
| C        | 28           | 2            |
| D        | 22           | 0            |
| E        | 18           | 0            |

### Resources Priority

| Priority | Nuyen    |
| -------- | -------- |
| A        | 450,000¥ |
| B        | 275,000¥ |
| C        | 140,000¥ |
| D        | 50,000¥  |
| E        | 6,000¥   |

### Magic/Resonance Priority

| Priority | Magician/Mystic Adept             | Technomancer                      | Adept                 | Aspected              |
| -------- | --------------------------------- | --------------------------------- | --------------------- | --------------------- |
| A        | Magic 6, 2 skills at 5, 10 spells | Resonance 6, 2 skills at 5, 5 CFs | -                     | -                     |
| B        | Magic 4, 2 skills at 4, 7 spells  | Resonance 4, 2 skills at 4, 2 CFs | Magic 6, 1 skill at 4 | Magic 5, 1 group at 4 |
| C        | Magic 3, 5 spells                 | Resonance 3, 1 CF                 | Magic 4, 1 skill at 2 | Magic 3, 1 group at 2 |
| D        | -                                 | -                                 | Magic 2               | Magic 2               |
| E        | Mundane                           | Mundane                           | Mundane               | Mundane               |

---

## Metatype Base Attributes

| Metatype | BOD | AGI | REA | STR | WIL | LOG | INT | CHA | Max Attribute           |
| -------- | --- | --- | --- | --- | --- | --- | --- | --- | ----------------------- |
| Human    | 1   | 1   | 1   | 1   | 1   | 1   | 1   | 1   | 6                       |
| Elf      | 1   | 2   | 1   | 1   | 1   | 1   | 1   | 3   | 6 (AGI 7, CHA 8)        |
| Dwarf    | 3   | 1   | 1   | 3   | 2   | 1   | 1   | 1   | 6 (BOD 8, STR 8, WIL 7) |
| Ork      | 4   | 1   | 1   | 3   | 1   | 1   | 1   | 1   | 6 (BOD 9, STR 8)        |
| Troll    | 5   | 1   | 1   | 5   | 1   | 1   | 1   | 1   | 6 (BOD 10, STR 10)      |

---

## Cyberware Grade Multipliers

| Grade     | Essence Mult | Cost Mult    | Avail Mod |
| --------- | ------------ | ------------ | --------- |
| Used      | 1.25 (×1.25) | 0.75 (×0.75) | -4        |
| Standard  | 1.0 (base)   | 1.0 (base)   | +0        |
| Alphaware | 0.8 (×0.8)   | 2.0 (×2)     | +2        |
| Betaware  | 0.6 (×0.6)   | 4.0 (×4)     | +4        |
| Deltaware | 0.5 (×0.5)   | 10.0 (×10)   | +8        |

### Grade Calculation Examples

**Wired Reflexes 2 (Standard)**

- Base Essence: 3.0
- Base Cost: 149,000¥
- Standard: 3.0 essence, 149,000¥

**Wired Reflexes 2 (Alphaware)**

- Essence: 3.0 × 0.8 = 2.4
- Cost: 149,000¥ × 2 = 298,000¥
- Availability: 12R + 2 = 14R

**Dermal Plating 2 (Used)**

- Base Essence: 1.0
- Essence: 1.0 × 1.25 = 1.25
- Base Cost: 24,000¥
- Cost: 24,000¥ × 0.75 = 18,000¥

---

## Cyberlimb Base Capacity

| Limb Type            | Essence | Base Capacity | Base STR | Base AGI |
| -------------------- | ------- | ------------- | -------- | -------- |
| Full Arm (Obvious)   | 1.0     | 15            | 3        | 3        |
| Full Arm (Synthetic) | 1.0     | 8             | 3        | 3        |
| Full Leg (Obvious)   | 1.0     | 20            | 3        | 3        |
| Full Leg (Synthetic) | 1.0     | 10            | 3        | 3        |
| Torso (Obvious)      | 1.5     | 10            | -        | -        |
| Skull (Obvious)      | 0.75    | 4             | -        | -        |
| Hand                 | 0.25    | 4             | 3        | 3        |
| Foot                 | 0.25    | 4             | 3        | 3        |
| Lower Arm            | 0.45    | 10            | 3        | 3        |
| Lower Leg            | 0.45    | 12            | 3        | 3        |

### Cyberlimb Enhancement Costs

| Enhancement       | Capacity    | Cost per Point   |
| ----------------- | ----------- | ---------------- |
| STR Enhancement   | 1 per point | 3,000¥ per point |
| AGI Enhancement   | 1 per point | 6,000¥ per point |
| Armor Enhancement | 1 per point | 2,000¥ per point |

**Maximum Enhancements:**

- STR: Up to +3 per limb
- AGI: Up to +3 per limb
- Armor: Up to +3 per limb

---

## Weapon Mount Types

| Mount    | Location      | Common Accessories                    |
| -------- | ------------- | ------------------------------------- |
| Top      | Top rail      | Scopes, imaging devices, laser sights |
| Under    | Under barrel  | Grenade launchers, grips, bipods      |
| Side     | Side rails    | Flashlights, laser sights             |
| Barrel   | Barrel        | Suppressors, flash hiders             |
| Stock    | Stock         | Folding stock, shock pads             |
| Internal | Inside weapon | Smartgun system, personalization      |

### Mount Compatibility by Weapon Category

| Category       | Top | Under | Side | Barrel | Stock | Internal |
| -------------- | --- | ----- | ---- | ------ | ----- | -------- |
| Holdout Pistol | -   | -     | -    | Yes    | -     | Yes      |
| Light Pistol   | -   | -     | -    | Yes    | -     | Yes      |
| Heavy Pistol   | -   | Yes   | -    | Yes    | -     | Yes      |
| Machine Pistol | -   | Yes   | -    | Yes    | -     | Yes      |
| SMG            | Yes | Yes   | Yes  | Yes    | Yes   | Yes      |
| Assault Rifle  | Yes | Yes   | Yes  | Yes    | Yes   | Yes      |
| Sniper Rifle   | Yes | Yes   | -    | Yes    | Yes   | Yes      |
| Shotgun        | Yes | Yes   | -    | Yes    | Yes   | Yes      |
| LMG/HMG        | Yes | Yes   | -    | Yes    | Yes   | Yes      |

---

## Armor Capacity

Armor capacity equals armor rating.

| Armor                   | Rating | Capacity |
| ----------------------- | ------ | -------- |
| Lined Coat              | 9      | 9        |
| Armor Jacket            | 12     | 12       |
| Armor Vest              | 9      | 9        |
| Urban Explorer Jumpsuit | 9      | 9        |
| Full Body Armor         | 15     | 15       |
| Chameleon Suit          | 9      | 9        |

### Common Armor Modifications

| Mod                       | Capacity | Cost          |
| ------------------------- | -------- | ------------- |
| Chemical Protection (1-6) | Rating   | 250¥ × Rating |
| Fire Resistance (1-6)     | Rating   | 250¥ × Rating |
| Insulation (1-6)          | Rating   | 200¥ × Rating |
| Nonconductivity (1-6)     | Rating   | 250¥ × Rating |
| Thermal Damping (1-6)     | Rating   | 500¥ × Rating |
| Gel Packs                 | 2        | 600¥          |
| Shock Frills              | 2        | 250¥          |

---

## Common Gear Hierarchy Patterns

### Cybereyes with Enhancements

```
Cybereyes (Rating 1-4)
├── Capacity: 4/8/12/16 (by rating)
├── Essence: 0.2/0.3/0.4/0.5 (by rating)
└── Enhancements:
    ├── Flare Compensation (1 cap, 250¥)
    ├── Image Link (0 cap, free)
    ├── Low-Light Vision (2 cap, 500¥)
    ├── Smartlink (3 cap, 2,000¥)
    ├── Thermographic Vision (2 cap, 500¥)
    ├── Vision Enhancement 1-3 (1 cap each, 500¥ each)
    └── Vision Magnification (2 cap, 250¥)
```

### Cyberears with Enhancements

```
Cyberears (Rating 1-4)
├── Capacity: 4/8/12/16 (by rating)
├── Essence: 0.2/0.3/0.4/0.5 (by rating)
└── Enhancements:
    ├── Audio Enhancement 1-3 (1 cap each, 250¥ each)
    ├── Balance Augmenter (1 cap, 6,000¥)
    ├── Damper (1 cap, 2,000¥)
    ├── Select Sound Filter 1-6 (1 cap each, 250¥ each)
    └── Spatial Recognizer (2 cap, 1,000¥)
```

### Commlink with Software

```
Commlink (Rating 1-6)
├── Cost: varies by model
└── Software:
    ├── AR Gloves (150¥)
    ├── Mapsoft [Location] (20¥)
    ├── Datasoft [Subject] (120¥)
    └── Sim Module Hot (200¥, if not included)
```

### Fake SIN with Licenses

```
Fake SIN (Rating 1-6)
├── Cost: 2,500¥ × Rating
└── Fake Licenses (same rating as SIN):
    ├── Concealed Carry Permit (200¥)
    ├── Driver's License (200¥)
    ├── Firearms License (200¥)
    ├── Augmentation License (200¥)
    ├── Mage License (200¥)
    └── [Other] License (200¥)
```

---

## Validation Checklist

### Pre-Generation

- [ ] All equipment names match database exactly
- [ ] All cyberware grades specified
- [ ] All item costs include grade multipliers
- [ ] Availability ≤12 (or note if quality allows higher)

### Calculations

- [ ] Attribute points total matches priority
- [ ] Skill points total matches priority
- [ ] Essence total is correct (6 - sum of augmentation essence)
- [ ] Resource total within priority budget (±5% tolerance)
- [ ] Each priority used exactly once (A-E)

### Hierarchy

- [ ] Every weapon mod has parent weapon
- [ ] Every armor mod has parent armor
- [ ] Every cyberlimb enhancement has parent limb
- [ ] Every license has parent SIN at same rating
- [ ] No capacity overflows

### Database

- [ ] All items exist in core-rulebook.json
- [ ] Missing items documented in validation report
- [ ] Item IDs use kebab-case

---

## Common Transcription Errors

### Weapon Names

| Common Error       | Correct Name      |
| ------------------ | ----------------- |
| Ares Predator 5    | Ares Predator V   |
| HK-277             | HK-227            |
| Ingram Smart Gun X | Ingram Smartgun X |
| FN-HAR             | FN HAR            |
| AK97               | AK-97             |

### Cyberware Names

| Common Error         | Correct Name               |
| -------------------- | -------------------------- |
| Smartlink (external) | Smartgun System (External) |
| Wired Reflexes R2    | Wired Reflexes 2           |
| Cyber Eyes           | Cybereyes                  |
| Dermal Armor         | Dermal Plating             |

### Essence Values

| Augmentation       | Common Error | Correct Value |
| ------------------ | ------------ | ------------- |
| Wired Reflexes 1   | 1.5          | 2.0           |
| Wired Reflexes 2   | 2.0          | 3.0           |
| Wired Reflexes 3   | 3.0          | 5.0           |
| Synaptic Booster 1 | 0.25         | 0.5           |
| Synaptic Booster 2 | 0.5          | 1.0           |
| Synaptic Booster 3 | 0.75         | 1.5           |

### Grade Confusion

| Issue                  | Resolution                       |
| ---------------------- | -------------------------------- |
| "Alphaware" vs "Alpha" | Both acceptable, use "Alphaware" |
| Missing grade          | Assume Standard grade            |
| "Military Grade"       | Not a grade - check availability |

---

## Quick Formulas

### Essence Calculation

```
Remaining Essence = 6 - Σ(Augmentation Essence × Grade Multiplier)
```

### Attribute Points

```
Total Points = Σ(Current Attribute - Metatype Base)
```

### Cyberlimb Average

```
Limb Average STR/AGI = (Base 3 + Enhancements)
Character uses limb value when using that limb specifically
```

### License Cost

```
Per License = 200¥ (regardless of rating)
Total SIN + Licenses = (2,500¥ × Rating) + (200¥ × Number of Licenses)
```
