### Campaign Management Drawer Stress Tests

1. **Load Existing Campaign**
   - Navigate to the campaigns table and open the drawer for a campaign that already has factions, locations, placeholders, and a session seed.
   - Verify each section renders the stored data without falling back to raw JSON mode.

2. **Automation Toggles Round-trip**
   - Toggle each automation option on and off.
   - Save, reopen the drawer, and confirm the toggled state matches the saved value.

3. **Faction CRUD**
   - Add two new factions, populate name/tags/notes, then remove one.
   - Save and reopen to ensure only the expected faction remains and fields retain their values.

4. **Location CRUD Edge Cases**
   - Add a location, leave the name blank, and attempt to save—confirm the location is pruned.
   - Add another location with name/descriptor, save, reopen, and ensure the entry persists.

5. **Placeholder Runners Validation**
   - Add placeholders with/without roles, save, reopen, and confirm blank names are removed while valid ones remain.

6. **Session Seed Flip**
   - Toggle the “skip planning” checkbox on, save, reopen, toggle off, add details, save, reopen—all fields should reflect the last saved state.

7. **Theme & Notes Updates**
   - Update the theme and GM notes with multiline content, save, reopen, and confirm line breaks and text are preserved.

8. **Raw JSON Fallback**
   - Manually edit house_rules in the DB (or API) to an invalid JSON blob, open the drawer, and verify raw mode activates with guidance text. Restore original data after the test.

9. **Cancel Flow**
   - Make edits in multiple sections, hit Cancel, reopen, and ensure no changes were persisted.

10. **Concurrent Refresh**
    - With the drawer open, modify the campaign via API/another browser tab, then trigger a `shadowmaster:campaigns:refresh` event—drawer should reflect fresh data without errors.

---

### Automated Regression
- Run `npm --prefix web/ui run test` to execute the test suite covering preset-library interactions in the campaign drawer. Ensure it passes after completing the manual sweep.
