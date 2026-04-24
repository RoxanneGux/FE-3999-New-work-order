# Mock Data Guide — FE-3999 Harness (New Work Order Form)

Quick reference for which data to use to see specific UI treatments and states.

---

## Available Routes

| Route | Page |
|---|---|
| `/` or `/new-work-order` | New Work Order form |

---

## Mock Data Files

All mock data lives in `src/assets/mocks/`:

| File | Purpose |
|---|---|
| `work-order-defaults.json` | Job types (Repair, PM, Part Rebuild), meter validation options, warranty work options, priority options |
| `assets.json` | 6 assets with IDs, descriptions, license numbers, VIN/serial, lifecycle status, location, meter readings |
| `locations.json` | 5 locations (MAIN, NORTH, SOUTH, EAST, SHOP-A) with default location MAIN |
| `session.json` | Technician session profile (TECH001 / John Smith) with defaults for location, phone, email, contact, priority |
| `messages.json` | Read-only messages text showing open work orders and PM service warnings |
| `service-requests.json` | 4 existing service request records for the table |
| `services-inspections-due.json` | Services/inspections due per asset — used when Job Type = PM |
| `linear-assets.json` | 2 linear assets (ROAD07, UX-BRIDGE-LINEAR) with markers and offsets for the linear asset slider |

---

## Session / Logged-In User

| Field | Value |
|---|---|
| User ID | TECH001 |
| Employee ID | EMP-1001 |
| Employee Name | John Smith |
| Default Location | MAIN |
| Default Phone | 555-123-4567 |
| Default Email | john.smith@company.com |
| Default Contact Name | Jane Doe |
| Default Priority | (4) Normal |

---

## Job Types

| Job Type | Value | Form Behavior |
|---|---|---|
| Repair | REPAIR | Default form — all fields shown. If a linear asset is selected, switches to linear layout (slider, markers, no meters) |
| PM | PM | Shows "Services and Inspections Due" table. If a linear asset is selected, also shows PM Service field and linear layout |
| Part Rebuild | PART_REBUILD | Part-specific fields (Part ID, Restock Location, Quantity, Fabrication). Never shows linear layout |

The form auto-detects linear vs fleet assets from the Asset Search dialog. No explicit "Repair Linear Asset" or "PM Linear Asset" job type options exist — the form is smart enough to switch layout based on the selected asset's type.

When no job type is selected, the page title reads "New Work Order".
When a job type is selected, the title changes to "New Work Order - YYYY-LOCATION-###" (auto-generated).

---

## Assets (6 assets)

| Asset ID | Description | License | Location | Meter 1 | Meter 1 Units | Meter 2 | Meter 2 Units |
|---|---|---|---|---|---|---|---|
| R-12345 | MOTOR POOL SEDAN | ABC-1234 | MAIN | 45,230 | miles | 0 | miles |
| QA-FLEET-002 | QA FLEET TRUCK 002 | XYZ-5678 | NORTH | 78,100 | miles | 1,200 | hours |
| K123-456 | SERIES 50 DETROIT DIESEL GAS ENGINE | DEF-9012 | SHOP-A | 12,500 | hours | 0 | — |
| QA-C-001 | CARGO VAN 2500 | GHI-3456 | MAIN | 92,340 | miles | 0 | — |
| FL-VAN-03 | FLEET VAN 03 | JKL-7890 | SOUTH | 55,000 | miles | 800 | hours |
| TX-TRUCK-07 | PICKUP TRUCK F-150 | MNO-2345 | EAST | 34,500 | miles | 0 | — |

---

## Locations (5 locations)

| Location ID | Description |
|---|---|
| MAIN | Main Shop |
| NORTH | North Facility |
| SOUTH | South Yard |
| EAST | East Campus |
| SHOP-A | Shop A |

Default location: **MAIN**

---

## Linear Assets (2 assets)

Available in the Asset Search dialog (click the search icon on the Asset field). Selecting a linear asset auto-switches the form to the linear layout.

### ROAD07 — HIGHWAY 07 - MAIN CORRIDOR

| Marker ID | Offset From Segment Start |
|---|---|
| ROAD07-01 | 0 |
| ROAD07-02 | 82.5 |
| ROAD07-03 | 165 |
| ROAD07-04 | 247.5 |
| ROAD07-05 | 330 |

Total Length: 330 | Segment: SEG-ROAD07-01 | Location: MAIN

### UX-BRIDGE-LINEAR — UX TEST BRIDGE - LINEAR ASSET

| Marker ID | Offset From Segment Start |
|---|---|
| BRG-01 | 0 |
| BRG-02 | 50 |
| BRG-03 | 100 |
| BRG-04 | 150 |

Total Length: 150 | Segment: SEG-BRIDGE-01 | Location: NORTH

---

## Meter Validation Options

| Label | Value |
|---|---|
| (blank) | (none selected) |
| Update the asset record | UPDATE_ASSET |
| Update transaction only | UPDATE_TRANSACTION |
| Update transaction only on fail | UPDATE_TRANSACTION_FAIL |

---

## Existing Service Requests Table (4 rows)

| Task ID | Description | Has Comment? | Comment Text | Symptom ID | Symptom Desc | Entered Date | Time | Entered By | ID | Priority | Desc |
|---|---|---|---|---|---|---|---|---|---|---|---|
| BRK-001 | Replace brake pads | Yes | Front brake pads worn below minimum thickness... | SYM-BRK | Squealing noise when braking | 03/15/2023 | 10:30 AM | John Smith | TECH001 | 3 | High |
| OIL-002 | Oil change and filter | No | — | SYM-MNT | Scheduled maintenance | 03/18/2023 | 2:15 PM | Jane Doe | TECH002 | 4 | Normal |
| TRN-003 | Transmission fluid flush | Yes | Transmission fluid dark and burnt... | SYM-TRN | Hard shifting | 03/19/2023 | 9:00 AM | Mike Brown | TECH003 | 2 | Urgent |
| ENG-004 | Diagnose engine misfire | No | — | SYM-ENG | Check engine light | 03/20/2023 | 11:45 AM | John Smith | TECH001 | 3 | High |

**Comment column:** Shows icon-only button with `comment` icon + notification dot only when `hasComment = true`. Clicking opens a read-only side drawer.

---

## Services and Inspections Due (PM Job Type only)

Shown when Job Type = PM (for fleet assets) or PM + Linear asset. Data changes per asset.

| Asset | Services Due |
|---|---|
| R-12345 (default) | 2 services (PMS1, QA-PM-A) |
| QA-FLEET-002 | 0 services (empty — just shows count) |
| FL-VAN-03-CLEAN | 0 services (empty — just shows count) |
| All other assets | 2 services (PMS1, QA-PM-A) |

### Default Services Data (2 rows)

| Service ID | Description | Reason ID | Reason Description | Date Due | Days Until Due | Days Late | Meter 1 Until Due | Meter 2 Until Due |
|---|---|---|---|---|---|---|---|---|
| PMS1 | PM SERVICE 1 | RPR-001 | Scheduled PM overdue | 04/30/2025 | LATE | 337 | (10100) | 0 |
| QA-PM-A | QA PM SERVICE A | RPR-002 | Meter threshold exceeded | 04/30/2025 | LATE | 337 | (10100) | 0 |

---

## Warranty Work Options

| Label | Value |
|---|---|
| No | NO |
| Yes | YES |
| Unknown | UNKNOWN |

---

## Priority Options

| Label | Value |
|---|---|
| (1) Emergency | 1 |
| (2) Urgent | 2 |
| (3) High | 3 |
| (4) Normal | 4 |
| (5) Low | 5 |

---

## Form Default Values (on load)

| Field | Default Value |
|---|---|
| Job Type | (none — placeholder "Choose validation" shown) |
| Asset | (R-12345) MOTOR POOL SEDAN |
| Title | (empty) |
| Meter 1 / Meter 2 | (empty) |
| Meter Validation | (none — placeholder "Choose validation" shown) |
| Repair Reason | (empty) |
| Work Class | (empty) |
| Service Status | (empty) |
| Repair Site | (empty) |
| Date Time In | 03/21/2023 2:00 PM (Date object via `aw-date-time-picker`) |
| Date Time Due | 03/24/2023 2:00 PM (Date object via `aw-date-time-picker`) |
| Time Format | 12h (toggle between 12h / 24h via `aw-toggle` in Scheduling header) |
| Vendor | (empty) |
| Technician | (LOGGED in TECH ID) Tech Name (read-only) |
| Contact Name | Jane Doe |
| Phone | 555-123-4567 |
| Email Address | john.smith@company.com |
| Priority | (4) Normal |
| Financial Project Code | (TECH001) John Smith |
| Account | (empty) |
| Warranty Work | No |
| Notes | (empty) |

---

## Lookup Field Descriptions

All 13 lookup fields (fields with a magnifying glass search button) resolve typed values against mock data on blur. The input is uppercased, and a description appears below the field. If no match is found, "NOT DEFINED" is shown. Clearing the field hides the description.

### Asset

Resolves against inline asset data (same records as `assets.json`). Match key: `AssetId`. Also set when selecting an asset via the Asset Search Dialog.

| Type this... | Description shown |
|---|---|
| R-12345 | MOTOR POOL SEDAN |
| QA-FLEET-002 | QA FLEET TRUCK 002 |
| K123-456 | SERIES 50 DETROIT DIESEL GAS ENGINE |
| QA-C-001 | CARGO VAN 2500 |
| FL-VAN-03 | FLEET VAN 03 |
| FL-VAN-03-CLEAN | FLEET VAN 03 - NO PM DUE |
| TX-TRUCK-07 | PICKUP TRUCK F-150 |
| ROAD07 | HIGHWAY 07 - MAIN CORRIDOR |
| ROAD07-EMPTY | HIGHWAY 07 - NO SERVICE REQUESTS |
| UX-BRIDGE-LINEAR | UX TEST BRIDGE - LINEAR ASSET |

### Part ID

| Type this... | Description shown |
|---|---|
| PRT-001 | Brake Pad Set |
| PRT-002 | Oil Filter |
| PRT-003 | Air Filter |

### Equipment ID

| Type this... | Description shown |
|---|---|
| EQ-001 | Excavator CAT 320 |
| EQ-002 | Loader JD 544 |

### Repair Reason

| Type this... | Description shown |
|---|---|
| RR-001 | Scheduled Maintenance |
| RR-002 | Breakdown |
| RR-003 | Accident Damage |

### Work Class

Appears in Repair, Linear work details, and Part Rebuild sections. All instances share the same description.

| Type this... | Description shown |
|---|---|
| WC-001 | In-House Repair |
| WC-002 | Outsourced |
| WC-003 | Warranty |

### Service Status

Appears in Repair and Linear work details sections.

| Type this... | Description shown |
|---|---|
| SS-001 | Open |
| SS-002 | In Progress |
| SS-003 | Completed |

### Repair Site

| Type this... | Description shown |
|---|---|
| RS-001 | Main Shop |
| RS-002 | Field Service |
| RS-003 | Vendor Shop |

### PM Service

Only visible when Job Type = PM and a linear asset is selected.

| Type this... | Description shown |
|---|---|
| PM-001 | Oil Change Service |
| PM-002 | Brake Inspection |

### Vendor

| Type this... | Description shown |
|---|---|
| VND-001 | AutoParts Inc. |
| VND-002 | Fleet Services LLC |

### Location (Scheduling + Linear Asset)

Used in both the Scheduling section (all forms) and the Linear Asset section. Same data for both.

| Type this... | Description shown |
|---|---|
| MAIN | Main Shop |
| NORTH | North Facility |
| SOUTH | South Yard |
| EAST | East Campus |
| SHOP-A | Shop A |

### Contact Name

| Type this... | Description shown |
|---|---|
| JANE-DOE | Jane Doe |
| BOB-WILSON | Bob Wilson |

### Priority

| Type this... | Description shown |
|---|---|
| 1 | Emergency |
| 2 | Urgent |
| 3 | High |
| 4 | Normal |
| 5 | Low |

### Financial Project Code

| Type this... | Description shown |
|---|---|
| FPC-001 | FY2026 Infrastructure |
| FPC-002 | FY2026 Fleet Renewal |

### Account

| Type this... | Description shown |
|---|---|
| ACC-001 | General Maintenance |
| ACC-002 | Fleet Operations |

### Standard Jobs (New SR)

| Type this... | Description shown |
|---|---|
| SJ-001 | Oil Change |
| SJ-002 | Brake Inspection |
| SJ-003 | Tire Rotation |

### Symptom (New SR)

| Type this... | Description shown |
|---|---|
| SYMP-001 | Squealing Noise |
| SYMP-002 | Engine Misfire |
| SYMP-003 | Fluid Leak |

### Fail / Cause Code

| Type this... | Description shown |
|---|---|
| FC-001 | Wear and Tear |
| FC-002 | Manufacturing Defect |
| FC-003 | Operator Error |

### WAC

| Type this... | Description shown |
|---|---|
| WAC-001 | Replace Component |
| WAC-002 | Repair in Place |
| WAC-003 | Adjust Settings |

---

## Quick Scenarios

| I want to see... | How |
|---|---|
| Full Repair form | Select Job Type = Repair (default asset R-12345 shows both meters with miles) |
| Full PM form with services table | Select Job Type = PM (default asset R-12345 shows 2 services/inspections due) |
| PM services/inspections empty state | Select PM, then search and select QA-FLEET-002 (shows "Services and Inspections Due: 0" with no table) |
| Part Rebuild form | Select Job Type = Part Rebuild (shows Part ID with Lookup button, Part Suffix with +/- stepper, Restock Location, Quantity, Fabrication, Work Class) |
| Form with no WO ID | Clear the job type selection |
| Empty form (no asset data) | Clear the asset field — messages, service requests, and services/inspections all clear |
| Task comment drawer | Click the comment icon on BRK-001 or TRN-003 in the Existing Service Requests table |
| Task without comment | OIL-002 and ENG-004 have no comment icon |
| Existing Service Requests empty + retrieve overlapping | Select Repair + linear asset (e.g., ROAD07-EMPTY) — table is empty, click archive icon to load 3 overlapping SRs |
| Work Position map (fleet) | Select Repair or PM with a fleet asset, expand the "Work Position" panel |
| Linear asset slider (ROAD07, 5 markers) | Select Repair or PM, click Asset search icon, select ROAD07 |
| Linear asset slider (Bridge, 4 markers) | Select Repair or PM, click Asset search icon, select UX-BRIDGE-LINEAR |
| PM Linear with services + PM Service | Select PM, then search and select ROAD07 or UX-BRIDGE-LINEAR |
| Meter 2 hidden | Click Asset search icon, select K123-456, QA-C-001, or TX-TRUCK-07 (no Meter 2) |
| Meter hint with current reading | Select any fleet asset — hint shows "Current: 45,230 miles" etc. |
| Meter 1 in hours | Click Asset search icon, select K123-456 (shows "Current: 12,500 hours") |
| Meter 2 in hours | Click Asset search icon, select QA-FLEET-002 (shows "Current: 1,200 hours") or FL-VAN-03 (shows "Current: 800 hours") |
| Date/time picker overlay | Click the calendar icon next to Date Time In or Date Time Due in the Scheduling section |
| 12h / 24h time format toggle | Toggle the "24h" switch in the Scheduling section header — both date/time pickers update |
| Dark mode | Click the sun/moon FAB button in the bottom-right corner |
| Part Suffix stepper | Select Part Rebuild, click + or − buttons next to Part suffix — value increments/decrements (00-99, always 2 digits) |
| Part Suffix masked input | Select Part Rebuild, type in the Part suffix field — only digits allowed, max 2 chars, pads to 2 digits on blur |
| Location lookup (Scheduling) | Type `MAIN` in the Location field in the Scheduling section, tab off → "Main Shop" appears |
| Location lookup (Linear) | Select a linear asset — Location auto-fills (e.g., ROAD07 → MAIN) |
| Lookup description — match found | Type `ACC-001` in Account, tab off → "General Maintenance" appears below the field, input uppercased |
| Lookup description — no match | Type `invalid` in Account, tab off → "NOT DEFINED" appears below the field, input uppercased to "INVALID" |
| Lookup description — empty field | Clear a lookup field that has a description → description disappears |
| Lookup description — uppercase on blur | Type `prt-001` in Part ID, tab off → input becomes "PRT-001", description shows "Brake Pad Set" |
| Lookup description — asset via dialog | Click Asset search icon, select an asset → description appears below Asset field |
| Lookup description — all Repair fields | Select Repair, fill Repair Reason (`RR-001`), Work Class (`WC-002`), Service Status (`SS-001`), Repair Site (`RS-003`) → descriptions appear for each |
| Lookup description — PM Linear fields | Select PM + linear asset (ROAD07), type `PM-001` in PM Service → "Oil Change Service" appears |
| New Service Request section | Select Repair job type — "New Service Request" section appears with Standard Jobs, Symptom, Fail/Cause Code, WAC lookups and Comments |
