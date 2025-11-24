# Database Table Creation Prompt Template

Copy and fill in this prompt when creating a new data table:

---

**Create a new database table page following our established UI patterns:**

**Entity Details:**
- Entity Name: `[EntityName]` (e.g., "Spell", "Vehicle", "Program")
- API Endpoint: `[entity]Api.get[Entity]()` (e.g., `spellApi.getSpells()`)
- TypeScript Type: `[Entity]` (e.g., `Spell`)
- API File: `web/ui/src/lib/api.ts` (add if needed)
- Types File: `web/ui/src/lib/types.ts` (add if needed)

**Table Configuration:**
- Has grouped view: `[Yes/No]`
- Primary identifier column: `[name/id/etc]`
- Searchable fields: `[list fields, e.g., name, category, source]`
- Default sort column: `[name/id/etc]`
- Filters needed: `[Category, Source, Custom filters]`

**Column Definitions:**
1. `[column1]` - `[header]` - `[type: string/number/computed]` - `[sortable: yes/no]`
2. `[column2]` - `[header]` - `[type]` - `[sortable]`
3. ... (list all columns)

**Additional Requirements:**
- View modal needed: `[Yes/No]`
- Additional data dependencies: `[e.g., gearMap, accessoryMap]`
- Special formatting needed: `[describe any special column formatting]`

**Files to Create:**
- Page: `web/ui/src/pages/[Entity]Page.tsx`
- Table: `web/ui/src/components/[entity]/[Entity]Table.tsx`
- Grouped Table (if needed): `web/ui/src/components/[entity]/[Entity]TableGrouped.tsx`
- View Modal (if needed): `web/ui/src/components/[entity]/[Entity]ViewModal.tsx`
- Filters (if needed): `web/ui/src/components/[entity]/[Entity]CategoryFilter.tsx`, etc.

**Implementation Requirements:**
1. Use `DatabasePageLayout` wrapper component
2. Wrap table component with `React.memo`
3. Memoize column definitions with `useMemo`
4. Use `useCallback` for event handlers
5. Memoize filtered data with `useMemo`
6. Use `useToast` for error handling
7. Follow existing patterns from `GearPage`/`GearTable` as reference
8. Include proper TypeScript types
9. Add accessibility labels
10. Configure DataTable with appropriate props

---

## Quick Checklist

After implementation, verify:
- [ ] Page uses `DatabasePageLayout`
- [ ] Table component is memoized
- [ ] Columns are memoized
- [ ] Handlers use `useCallback`
- [ ] Filtered data is memoized
- [ ] Error handling with toast
- [ ] Loading states work
- [ ] View mode toggle (if applicable)
- [ ] All DataTable props configured
- [ ] Types properly defined
- [ ] Accessibility labels present

