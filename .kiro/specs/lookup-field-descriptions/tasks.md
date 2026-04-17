# Implementation Plan: Lookup Field Descriptions

## Overview

Add description text below all 13 lookup fields in the New Work Order form (`NewWorkOrderComponent`). Single-entry form only — no multi-entry table. A shared `lookupField()` helper resolves typed values against inline mock data arrays (or `assets.json` for Asset). On blur, the input is uppercased and the description is displayed. Descriptions clear when the field is emptied. Form row alignment changes from `flex-end` to `flex-start`. All changes in `fe-harness-FE-3999/`.

## Tasks

- [x] 1. Add mock data, description signals, lookupField() helper, blur handler, and clear watcher to component TS
  - [x] 1.1 Add inline mock data arrays to `new-work-order.component.ts`
    - Add 12 `private readonly` arrays of `{ id: string; name: string }` for: Part ID, Equipment ID, Repair Reason, Work Class, Service Status, Repair Site, PM Service, Vendor, Contact Name, Priority, Financial Project Code, Account
    - Add `_assetData` signal for asset data loaded from `assets.json`
    - Fetch `assets.json` in constructor and populate `_assetData`
    - _Requirements: 17.1–17.13_

  - [x] 1.2 Add 26 description signals (13 fields × text + error)
    - `assetDesc` / `assetDescError`, `partIdDesc` / `partIdDescError`, `equipmentIdDesc` / `equipmentIdDescError`, `repairReasonDesc` / `repairReasonDescError`, `workClassDesc` / `workClassDescError`, `serviceStatusDesc` / `serviceStatusDescError`, `repairSiteDesc` / `repairSiteDescError`, `pmServiceDesc` / `pmServiceDescError`, `vendorDesc` / `vendorDescError`, `contactNameDesc` / `contactNameDescError`, `priorityDesc` / `priorityDescError`, `financialProjectCodeDesc` / `financialProjectCodeDescError`, `accountDesc` / `accountDescError`
    - All `signal<string>('')` / `signal<boolean>(false)`
    - _Requirements: 1.1–1.7, 2.1–2.6, 3.1–3.6, 4.1–4.6, 5.1–5.6, 6.1–6.6, 7.1–7.6, 8.1–8.6, 9.1–9.6, 10.1–10.6, 11.1–11.6, 12.1–12.6, 13.1–13.6_

  - [x] 1.3 Add `lookupField(fieldName, value)` helper method
    - Switch on fieldName for all 13 fields
    - Asset: match `_assetData()` by `AssetId`, return `Description`
    - Other 12 fields: match inline mock array by `id`, return `name`
    - Case-insensitive `.toLowerCase()` comparison, trim input
    - Empty/whitespace → `{ text: '', isError: false }`, no match → `{ text: 'NOT DEFINED', isError: true }`
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1, 9.1, 10.1, 11.1, 12.1, 13.1_

  - [x] 1.4 Add `onLookupFieldBlur(fieldName)` handler
    - Read form value from `woForm.get(fieldName)`
    - Trim and uppercase the value, write back with `{ emitEvent: false }`
    - Call `lookupField()`, set the matching signal pair via switch
    - _Requirements: 1.1–1.7, 2.1–2.6, 3.1–3.6, 4.1–4.6, 5.1–5.6, 6.1–6.6, 7.1–7.6, 8.1–8.6, 9.1–9.6, 10.1–10.6, 11.1–11.6, 12.1–12.6, 13.1–13.6, 15.1_

  - [x] 1.5 Add `_watchLookupFieldClears()` method
    - Subscribe to `valueChanges` on all 13 lookup form controls
    - When value becomes empty, clear the corresponding description and error signals
    - Call in constructor
    - _Requirements: 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5, 12.5, 13.5, 16.1, 16.2_

  - [x] 1.6 Add `onLookupFieldInput(fieldName, event)` handler
    - Fires on native `(input)` event — clears description immediately when input value is empty
    - Handles X clear button and select-all+delete without waiting for blur
    - _Requirements: 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5, 12.5, 13.5, 16.1_

  - [x] 1.7 Update `openAssetSearchDialog()` to set asset description on dialog selection
    - After setting asset value from dialog result, call `lookupField('asset', asset.AssetId)` and set `assetDesc` / `assetDescError`
    - _Requirements: 1.6_

- [x] 2. Add (blur) bindings and description spans to template HTML
  - [x] 2.1 Update `new-work-order.component.html` — add `(blur)`, `(input)`, and `<span>` for Asset, Part ID, Equipment ID
    - Asset: `(blur)="onLookupFieldBlur('asset')" (input)="onLookupFieldInput('asset', $event)"` on input, `@if (assetDesc()) { <span class="aw-c-1 field-desc">{{ assetDesc() }}</span> }` below `field-with-icon`
    - Part ID: same pattern with `partId` / `partIdDesc()`
    - Equipment ID: same pattern with `equipmentId` / `equipmentIdDesc()`
    - _Requirements: 1.1–1.7, 2.1–2.6, 3.1–3.6, 14.1–14.4_

  - [x] 2.2 Update `new-work-order.component.html` — add `(blur)`, `(input)`, and `<span>` for Repair Reason, Work Class (all instances)
    - Repair Reason appears in Repair meters section AND Linear work details section — add to both
    - Work Class appears in Repair meters section, Linear work details section, AND Part Rebuild section — add to all three
    - All instances share the same form control and description signals
    - _Requirements: 4.1–4.6, 5.1–5.6, 14.1–14.4_

  - [x] 2.3 Update `new-work-order.component.html` — add `(blur)`, `(input)`, and `<span>` for Service Status, Repair Site, PM Service
    - Service Status appears in Repair section AND Linear work details section — add to both
    - Repair Site appears in Repair section only
    - PM Service appears in Linear work details section only (inside `@if (isPMLinear())`)
    - All inputs get both `(blur)="onLookupFieldBlur('...')"` and `(input)="onLookupFieldInput('...', $event)"`
    - _Requirements: 6.1–6.6, 7.1–7.6, 8.1–8.6, 14.1–14.4_

  - [x] 2.4 Update `new-work-order.component.html` — add `(blur)`, `(input)`, and `<span>` for Vendor, Contact Name, Priority, Financial Project Code, Account
    - Vendor in Scheduling section
    - Contact Name in Contact Information section
    - Priority, Financial Project Code, Account in Financial section
    - All inputs get both `(blur)="onLookupFieldBlur('...')"` and `(input)="onLookupFieldInput('...', $event)"`
    - _Requirements: 9.1–9.6, 10.1–10.6, 11.1–11.6, 12.1–12.6, 13.1–13.6, 14.1–14.4_

- [x] 3. Add .field-desc SCSS class and fix form-row alignment
  - Add `.field-desc` class: `display: block; color: var(--system-text-text-secondary, #5b6670); margin-left: 2px;`
  - Change `.form-row` at desktop breakpoint from `align-items: flex-end` to `align-items: flex-start`
  - _Requirements: 14.1–14.5_

- [x] 4. Checkpoint — first batch of fields
  - Ensure the app compiles. Verify: type `ACC-001` in Account → "General Maintenance" on blur, input uppercased; type `invalid` → "NOT DEFINED", uppercased to "INVALID"; clear field → description hidden. Repeat for Asset (select via dialog), Part ID (`PRT-001`), Equipment ID (`EQ-001`), Priority (`1` → "Emergency"), Vendor (`VND-001`), Contact Name (`CN-001`), Financial Project Code (`FPC-001`). Verify form row alignment — description below one field doesn't misalign adjacent field. Ask the user if questions arise.

- [x] 5. Checkpoint — remaining fields across form variants
  - Select Repair job type: type `RR-001` in Repair Reason → "Scheduled Maintenance"; `WC-002` in Work Class → "Outsourced"; `SS-001` in Service Status → "Open"; `RS-003` in Repair Site → "Vendor Shop". Switch to PM + Linear (select ROAD07): verify `PM-001` in PM Service → "Oil Change Service"; verify Repair Reason, Work Class, Service Status descriptions work in Linear work details section. Switch to Part Rebuild: verify Work Class description works. Ask the user if questions arise.

- [x] 6. Update Asset Search Dialog to set description on selection
  - Verify `openAssetSearchDialog()` sets `assetDesc` / `assetDescError` after dialog selection (implemented in task 1.6)
  - Test: select asset via dialog → description appears; manually edit asset field and blur → description re-evaluates
  - _Requirements: 1.6_

- [x] 7. Update documentation
  - [x] 7.1 Update `MOCK-DATA-GUIDE.md`
    - Add "Lookup Field Descriptions" section documenting all 13 fields with their mock data IDs and descriptions
    - Add quick scenarios: match found, no match, empty field, uppercase on blur
    - _Requirements: 18.1, 18.3_

  - [x] 7.2 Update `README.md`
    - Add description behavior to the "How Developers Should Use This" or a new "Lookup Fields" section
    - Document: blur resolves description, "NOT DEFINED" on mismatch, hidden when empty, uppercase on blur
    - _Requirements: 18.2_

- [x] 8. Final checkpoint
  - Ensure all tests pass and the app compiles cleanly. Ask the user if questions arise.

- [ ]* 9. Write property tests for lookupField correctness
  - [ ]* 9.1 Write property test for valid ID lookup
    - **Property 1: Lookup returns correct description for valid IDs**
    - **Validates: Requirements 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1, 9.1, 10.1, 11.1, 12.1, 13.1**
    - Jasmine loop, 100 iterations: random field type from 13 options, random valid ID from that field's mock data
    - Assert `lookupField(type, id)` returns `{ text: <expected name>, isError: false }`

  - [ ]* 9.2 Write property test for case-insensitive lookup
    - **Property 2: Lookup is case-insensitive**
    - **Validates: Requirements 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1, 9.1, 10.1, 11.1, 12.1, 13.1**
    - Jasmine loop, 100 iterations: random field type, random valid ID with randomized casing
    - Assert same description returned regardless of case

  - [ ]* 9.3 Write property test for invalid ID lookup
    - **Property 3: Lookup returns "NOT DEFINED" for invalid non-empty inputs**
    - **Validates: Requirements 1.3, 2.3, 3.3, 4.3, 5.3, 6.3, 7.3, 8.3, 9.3, 10.3, 11.3, 12.3, 13.3**
    - Jasmine loop, 100 iterations: random field type, random string guaranteed not in mock data
    - Assert `lookupField(type, invalidValue)` returns `{ text: 'NOT DEFINED', isError: true }`

  - [ ]* 9.4 Write property test for empty/whitespace input
    - **Property 4: Lookup returns empty for empty/whitespace input**
    - **Validates: Requirements 1.4, 1.5, 2.4, 2.5, 3.4, 3.5, 4.4, 4.5, 5.4, 5.5, 6.4, 6.5, 7.4, 7.5, 8.4, 8.5, 9.4, 9.5, 10.4, 10.5, 11.4, 11.5, 12.4, 12.5, 13.4, 13.5**
    - Jasmine loop, 100 iterations: random field type, random whitespace-only string
    - Assert `lookupField(type, whitespace)` returns `{ text: '', isError: false }`

- [ ]* 10. Write unit tests for lookup field descriptions
  - [ ]* 10.1 Write unit tests for description rendering
    - Verify `<span class="aw-c-1 field-desc">` appears with correct text after blur
    - Verify span hidden when field empty
    - Verify uppercase on blur sets form control value to uppercase
    - _Requirements: 1.1–1.7, 2.1–2.6, 14.1–14.4, 15.1_

  - [ ]* 10.2 Write unit tests for dialog selection and clear watcher
    - Verify dialog selection updates `assetDesc` / `assetDescError`
    - Verify `_watchLookupFieldClears()` clears description when field value becomes empty
    - Verify `.form-row` uses `align-items: flex-start` at desktop breakpoint
    - _Requirements: 1.6, 16.1, 16.2, 14.5_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation — checkpoint 4 after first batch, checkpoint 5 after remaining fields across variants
- Property tests validate the four correctness properties from the design document
- No multi-entry table mode — this form is single-entry only
- Fields appearing in multiple form variants (Work Class, Repair Reason, Service Status) share the same form control and signals — `(blur)` and `@if` span added to every template instance
- Asset data comes from `assets.json` (fetched at startup), not inline mock data

---

## Property Coverage Matrix

| Property | Description | Task(s) | Status |
|----------|-------------|---------|--------|
| Property 1 | Lookup returns correct description for valid IDs | 9.1 | ✅ |
| Property 2 | Lookup is case-insensitive | 9.2 | ✅ |
| Property 3 | Lookup returns "NOT DEFINED" for invalid non-empty inputs | 9.3 | ✅ |
| Property 4 | Lookup returns empty for empty/whitespace input | 9.4 | ✅ |

**Coverage: 4/4 (100%)** ✅

### How to Use This Matrix

1. **During Task Creation**: Check this matrix to ensure every property has a task
2. **During Implementation**: Reference the property number in test comments
3. **During Review**: Verify all properties are tested before merging
4. **After Changes**: Update this matrix if properties or tasks change
