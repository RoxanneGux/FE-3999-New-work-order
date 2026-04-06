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
| Repair | REPAIR | Default form — all fields shown |
| PM | PM | Shows "Services and Inspections Due" table below Repair Reason / Work Class |
| Part Rebuild | PART_REBUILD | (TBD — form field adjustments pending) |
| Repair Linear Asset | REPAIR_LINEAR | Shows Location, Equipment ID, Work Position with linear asset slider (markers/offsets), Work Details (Repair Reason, Work Class, Service Status), Existing Service Requests with overlap checkbox |
| PM Linear Asset | PM_LINEAR | Same as Repair Linear Asset plus Services and Inspections Due table and PM Service field |

When no job type is selected, the page title reads "New Work Order".
When a job type is selected, the title changes to "New Work Order - YYYY-LOCATION-###" (auto-generated).

---

## Assets (6 assets)

| Asset ID | Description | License | Location | Meter 1 | Meter 1 Units | Meter 2 | Meter 2 Units |
|---|---|---|---|---|---|---|---|
| R-12345 | MOTOR POOL SEDAN LINEAR - TEST | ABC-1234 | MAIN | 45,230 | miles | 0 | miles |
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

Used when Job Type = Repair Linear Asset or PM Linear Asset. Default asset is ROAD07.

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
| Update the ticket record | UPDATE_TICKET |
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

Shown when Job Type = PM, below the Repair Reason / Work Class row.

### Asset R-12345 — 2 services due

| Service ID | Description | Reason | Date Due | Days Until Due | Days Late | Meter 1 Until Due | Meter 2 Until Due |
|---|---|---|---|---|---|---|---|
| PMS1 | PM SERVICE 1 | DATE | 04/30/2025 | LATE | 337 | 10,100 | 0 |
| QA-PM-A | QA PM SERVICE A | DATE | 04/30/2025 | LATE | 337 | 10,100 | 0 |

### Asset QA-FLEET-002 — 0 services due (empty state)

No services or inspections due. Table shows empty state message.

### Asset K123-456 — 3 services due

| Service ID | Description | Reason | Date Due | Days Until Due | Days Late | Meter 1 Until Due | Meter 2 Until Due |
|---|---|---|---|---|---|---|---|
| INS-01 | ANNUAL INSPECTION | DATE | 06/15/2025 | LATE | 292 | 500 | 0 |
| PMS2 | PM SERVICE 2 | METER | 08/01/2025 | 245 | 0 | 200 | 0 |
| OIL-CHG | OIL CHANGE SERVICE | METER | 09/15/2025 | 200 | 0 | 1,500 | 0 |

---

## Warranty Work Options

| Label | Value |
|---|---|
| No | NO |
| Yes | YES |
| Pending | PENDING |

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
| Asset | (R-12345) MOTOR POOL SEDAN LINEAR - TEST |
| Title | (empty) |
| Meter 1 / Meter 2 | (empty) |
| Meter Validation | (none — placeholder "Choose validation" shown) |
| Repair Reason | (empty) |
| Work Class | (empty) |
| Service Status | (empty) |
| Repair Site | (empty) |
| Date Time In | 03/21/2023 / 2:00 PM |
| Date Time Due | 03/24/2023 / 2:00 PM |
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

## Quick Scenarios

| I want to see... | How |
|---|---|
| Full form with all fields | Select any job type |
| Form with no WO ID | Don't select a job type |
| PM services/inspections table (with data) | Select Job Type = PM (default asset R-12345 has 2 services due) |
| PM services/inspections empty state | Select Job Type = PM, change asset to QA-FLEET-002 |
| Task comment drawer | Click the comment icon on BRK-001 or TRN-003 in the Existing Service Requests table |
| Task without comment | OIL-002 and ENG-004 have no comment icon |
| Work Position map | Expand the "Work Position" expansion panel |
| Linear asset slider with markers | Select Job Type = Repair Linear Asset or PM Linear Asset (loads ROAD07 with 5 markers) |
| PM Linear with services table | Select Job Type = PM Linear Asset (shows Services and Inspections Due table) |
| Linear asset overlap checkbox | Select Job Type = Repair Linear Asset (overlap checkbox shown when service requests table is empty) |
