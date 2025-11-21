# Analysis Report: options.xml

**File**: `data\chummerxml\options.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 112
- **Unique Fields**: 11
- **Unique Attributes**: 0
- **Unique Element Types**: 20

## Fields

### appname
**Path**: `chummer/pdfarguments/pdfargument/appnames/appname`

- **Count**: 32
- **Presence Rate**: 100.0%
- **Unique Values**: 21
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 9-23 characters
- **Examples**:
  - `iexplore.exe`
  - `msedge.exe`
  - `chrome.exe`
  - `firefox.exe`
  - `safari.exe`
- **All Values**: AcroRd32.exe, Acrobat.exe, FoxitPDFReader.exe, FoxitReader.exe, FoxitReaderPortable.exe, PDFXCView.exe, PDFXEdit.exe, PDFXHost32.exe, PDFXHost64.exe, brave.exe, browser.exe, chrome.exe, firefox.exe, iexplore.exe, msedge.exe, opera.exe, qqbrowser.exe, safari.exe, sumatrapdf.exe, sumatrapdfportable.exe

### category
**Path**: `chummer/blackmarketpipelinecategories/category`

- **Count**: 11
- **Presence Rate**: 100.0%
- **Unique Values**: 11
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-11 characters
- **Examples**:
  - `Armor`
  - `Bioware`
  - `Cyberware`
  - `Drugs`
  - `Electronics`
- **All Values**: Armor, Bioware, Cyberware, Drugs, Electronics, Geneware, Magic, Nanoware, Software, Vehicles, Weapons

### name
**Path**: `chummer/pdfarguments/pdfargument/name`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-28 characters
- **Examples**:
  - `Web Browser`
  - `Acrobat-style`
  - `Acrobat-style - New instance`
  - `Unix-style`
  - `Sumatra - Re-use instance`
- **All Values**: Acrobat-style, Acrobat-style - New instance, Sumatra, Sumatra - Re-use instance, Unix-style, Web Browser

### value
**Path**: `chummer/pdfarguments/pdfargument/value`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 23-42 characters
- **Examples**:
  - `"file://{absolutepath}#page={page}"`
  - `/A "page={page}" "{localpath}"`
  - `/A /N "page={page}" "{localpath}"`
  - `-p {page} "{localpath}"`
  - `-reuse-instance -page {page} "{localpath}"`
- **All Values**: "file://{absolutepath}#page={page}", -p {page} "{localpath}", -page {page} "{localpath}", -reuse-instance -page {page} "{localpath}", /A "page={page}" "{localpath}", /A /N "page={page}" "{localpath}"

### id
**Path**: `chummer/availmap/avail/id`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 36-36 characters
- **Examples**:
  - `0A39C082-AE54-4096-94D3-0CA213ACDA0A`
  - `335BB55A-A1A7-48C4-8852-4EA11929F242`
  - `0DC43627-56E8-46DB-B4C8-3A389C6999D2`
  - `06B72D98-3510-4A91-825E-CB55AD873749`
  - `67BC5453-8AD0-4C69-A91C-8259FD070A1D`
- **All Values**: 06B72D98-3510-4A91-825E-CB55AD873749, 0A39C082-AE54-4096-94D3-0CA213ACDA0A, 0DC43627-56E8-46DB-B4C8-3A389C6999D2, 335BB55A-A1A7-48C4-8852-4EA11929F242, 67BC5453-8AD0-4C69-A91C-8259FD070A1D

### value
**Path**: `chummer/availmap/avail/value`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 5-29 characters
- **Examples**:
  - `100.0`
  - `1000.0`
  - `10000.0`
  - `100000.0`
  - `79228162514264337593543950335`
- **All Values**: 100.0, 1000.0, 10000.0, 100000.0, 79228162514264337593543950335

### duration
**Path**: `chummer/availmap/avail/duration`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 60.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `6`
  - `1`
  - `2`
  - `1`
  - `1`
- **All Values**: 1, 2, 6

### interval
**Path**: `chummer/availmap/avail/interval`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 10-12 characters
- **Examples**:
  - `String_Hours`
  - `String_Day`
  - `String_Days`
  - `String_Week`
  - `String_Month`
- **All Values**: String_Day, String_Days, String_Hours, String_Month, String_Week

### name
**Path**: `chummer/limbcounts/limb/name`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 18-32 characters
- **Examples**:
  - `4 (2 arms, 2 legs)`
  - `5 (2 arms, 2 legs, skull)`
  - `5 (2 arms, 2 legs, torso)`
  - `6 (2 arms, 2 legs, torso, skull)`
- **All Values**: 4 (2 arms, 2 legs), 5 (2 arms, 2 legs, skull), 5 (2 arms, 2 legs, torso), 6 (2 arms, 2 legs, torso, skull)

### limbcount
**Path**: `chummer/limbcounts/limb/limbcount`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `4`
  - `5`
  - `5`
  - `6`
- **All Values**: 4, 5, 6

### exclude
**Path**: `chummer/limbcounts/limb/exclude`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-11 characters
- **Examples**:
  - `torso,skull`
  - `torso`
  - `skull`
- **All Values**: skull, torso, torso,skull

## Type Improvement Recommendations

### Enum Candidates
- **name** (`chummer/limbcounts/limb/name`): 4 unique values
  - Values: 4 (2 arms, 2 legs), 5 (2 arms, 2 legs, skull), 5 (2 arms, 2 legs, torso), 6 (2 arms, 2 legs, torso, skull)
- **limbcount** (`chummer/limbcounts/limb/limbcount`): 3 unique values
  - Values: 4, 5, 6
- **exclude** (`chummer/limbcounts/limb/exclude`): 3 unique values
  - Values: skull, torso, torso,skull
- **name** (`chummer/pdfarguments/pdfargument/name`): 6 unique values
  - Values: Acrobat-style, Acrobat-style - New instance, Sumatra, Sumatra - Re-use instance, Unix-style, Web Browser
- **value** (`chummer/pdfarguments/pdfargument/value`): 6 unique values
  - Values: "file://{absolutepath}#page={page}", -p {page} "{localpath}", -page {page} "{localpath}", -reuse-instance -page {page} "{localpath}", /A "page={page}" "{localpath}", /A /N "page={page}" "{localpath}"
- **appname** (`chummer/pdfarguments/pdfargument/appnames/appname`): 21 unique values
  - Values: AcroRd32.exe, Acrobat.exe, FoxitPDFReader.exe, FoxitReader.exe, FoxitReaderPortable.exe, PDFXCView.exe, PDFXEdit.exe, PDFXHost32.exe, PDFXHost64.exe, brave.exe, browser.exe, chrome.exe, firefox.exe, iexplore.exe, msedge.exe, opera.exe, qqbrowser.exe, safari.exe, sumatrapdf.exe, sumatrapdfportable.exe
- **category** (`chummer/blackmarketpipelinecategories/category`): 11 unique values
  - Values: Armor, Bioware, Cyberware, Drugs, Electronics, Geneware, Magic, Nanoware, Software, Vehicles, Weapons
- **id** (`chummer/availmap/avail/id`): 5 unique values
  - Values: 06B72D98-3510-4A91-825E-CB55AD873749, 0A39C082-AE54-4096-94D3-0CA213ACDA0A, 0DC43627-56E8-46DB-B4C8-3A389C6999D2, 335BB55A-A1A7-48C4-8852-4EA11929F242, 67BC5453-8AD0-4C69-A91C-8259FD070A1D
- **value** (`chummer/availmap/avail/value`): 5 unique values
  - Values: 100.0, 1000.0, 10000.0, 100000.0, 79228162514264337593543950335
- **duration** (`chummer/availmap/avail/duration`): 3 unique values
  - Values: 1, 2, 6
- **interval** (`chummer/availmap/avail/interval`): 5 unique values
  - Values: String_Day, String_Days, String_Hours, String_Month, String_Week
