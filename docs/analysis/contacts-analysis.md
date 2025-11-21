# Analysis Report: contacts.xml

**File**: `data\chummerxml\contacts.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 146
- **Unique Fields**: 7
- **Unique Attributes**: 0
- **Unique Element Types**: 15

## Fields

### contact
**Path**: `chummer/contacts/contact`

- **Count**: 75
- **Presence Rate**: 100.0%
- **Unique Values**: 75
- **Type Patterns**: string
- **Length Range**: 4-31 characters
- **Examples**:
  - `Amerindian Tribesperson`
  - `Antiquities and Oddities Dealer`
  - `Armorer`
  - `Bartender`
  - `Beat Cop`

### hobbyvice
**Path**: `chummer/hobbiesvices/hobbyvice`

- **Count**: 33
- **Presence Rate**: 100.0%
- **Unique Values**: 33
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 14-44 characters
- **Examples**:
  - `Animals (Paracritters)`
  - `Bad Habit (Dream Chips)`
  - `Bad Habit (Novacoke)`
  - `Bad Habit (Trip Chips)`
  - `Entertainment (Trid Shows)`

### preferredpayment
**Path**: `chummer/preferredpayments/preferredpayment`

- **Count**: 10
- **Presence Rate**: 100.0%
- **Unique Values**: 10
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 10-27 characters
- **Examples**:
  - `Barter (Easy-to-Sell Items)`
  - `Barter (Hobby/Vice Items)`
  - `Barter (Profession Items)`
  - `Cash (Corp Scrip)`
  - `Cash (Credstick)`
- **All Values**: Barter (Easy-to-Sell Items), Barter (Hobby/Vice Items), Barter (Profession Items), Cash (Corp Scrip), Cash (Credstick), Cash (ECC), Cash (Hard Currency), Service (Drek Jobs), Service (Free-Labor Jobs), Service (Shadowrunner Job)

### personallife
**Path**: `chummer/personallives/personallife`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-26 characters
- **Examples**:
  - `Divorced`
  - `Familial Relationship`
  - `In Relationship`
  - `None of Your Damn Business`
  - `Single`
- **All Values**: Divorced, Familial Relationship, In Relationship, None of Your Damn Business, Single, Unknown, Widowed

### type
**Path**: `chummer/types/type`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-15 characters
- **Examples**:
  - `Legwork`
  - `Networking`
  - `Swag`
  - `Shadow Services`
  - `Personal Favors`
- **All Values**: Legwork, Networking, Personal Favors, Shadow Services, Support, Swag

### age
**Path**: `chummer/ages/age`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-11 characters
- **Examples**:
  - `Young`
  - `Middle-Aged`
  - `Old`
  - `Unknown`
- **All Values**: Middle-Aged, Old, Unknown, Young

### gender
**Path**: `chummer/genders/gender`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-7 characters
- **Examples**:
  - `Female`
  - `Male`
  - `Unknown`
- **All Values**: Female, Male, Unknown

## Type Improvement Recommendations

### Enum Candidates
- **gender** (`chummer/genders/gender`): 3 unique values
  - Values: Female, Male, Unknown
- **age** (`chummer/ages/age`): 4 unique values
  - Values: Middle-Aged, Old, Unknown, Young
- **personallife** (`chummer/personallives/personallife`): 7 unique values
  - Values: Divorced, Familial Relationship, In Relationship, None of Your Damn Business, Single, Unknown, Widowed
- **type** (`chummer/types/type`): 6 unique values
  - Values: Legwork, Networking, Personal Favors, Shadow Services, Support, Swag
- **preferredpayment** (`chummer/preferredpayments/preferredpayment`): 10 unique values
  - Values: Barter (Easy-to-Sell Items), Barter (Hobby/Vice Items), Barter (Profession Items), Cash (Corp Scrip), Cash (Credstick), Cash (ECC), Cash (Hard Currency), Service (Drek Jobs), Service (Free-Labor Jobs), Service (Shadowrunner Job)
- **hobbyvice** (`chummer/hobbiesvices/hobbyvice`): 33 unique values
  - Values: Animals (Paracritters), Entertainment (Artwork), Entertainment (Movies), Entertainment (RPGs, ARLARP, Graphic Novels), Entertainment (Trid Show 'Odd Coven'), Entertainment (Trid Shows), Family Obligations (Brother), Family Obligations (Kids), Family Obligations (Parents), Family Obligations (Sister), Gambling (Cards), Nothing of Interest, Personal Grooming (Clothes), Social Habit (Alcohol), Social Habit (Cigars), Social Habit (Elven Wines), Vehicles (Antique Cars), Vehicles (Drones), Weapons (Blades), Weapons (Military)
