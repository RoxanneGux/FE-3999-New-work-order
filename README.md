# FE-3999 — New Work Order Form Harness

UX sandbox for prototyping the New Work Order form with `@assetworks-llc/aw-component-lib`. This harness contains validated front-end logic and layout for 5 form variants that developers can reference when building the full-stack implementation.

## What This Is

This is a standalone Angular 18 app that runs independently from FA-Suite. It uses mock data (no API calls) to render all work order form variants so designers and developers can review the UX before integration.

The harness covers:
- Repair, PM, and Part Rebuild work order forms
- Linear asset forms (Repair + Linear, PM + Linear) with a dual-handle marker/offset slider
- New Service Request section (Repair only) with Standard Jobs, Symptom, Fail/Cause Code, WAC lookups, Comments, and Correction Performed (linear only)
- Existing Service Requests table with search, comment drawer, detail dialog, and overlap toggle (linear)
- Estimated Appointment Hours field (Repair and PM)
- Asset search dialog with table variant
- Service request detail dialog with navigate-away alert
- Dark/light mode toggle
- Responsive layout down to mobile

## Quick Start

```bash
npm install
ng serve
```

Navigate to `http://localhost:4200/`. The form loads with Job Type = Repair by default.

## How Developers Should Use This

### 1. Add to your workspace

Clone this repo alongside FA-Suite in your IDE workspace. This lets you reference the harness code while building the real implementation:

```
Your Workspace/
├── FA-Suite/                    # Main app (your integration target)
├── FE-3999/fe-harness-FE-3999/ # This harness (reference code)
└── INN-ComponentLibrary/        # CCL source (optional)
```

### 2. Reference the component patterns

The harness demonstrates how to wire up CCL components with reactive forms, signals, and conditional visibility. Key files to reference:

| What | File |
|------|------|
| Form layout, conditional sections, signals | `src/app/pages/new-work-order/new-work-order.component.ts` |
| Template with `@if` blocks for all 5 variants | `src/app/pages/new-work-order/new-work-order.component.html` |
| Form SCSS (responsive, design tokens) | `src/app/pages/new-work-order/new-work-order.component.scss` |
| Linear asset slider (dual-handle range) | `src/app/components/linear-asset-slider/` |
| Asset search dialog (aw-dialog table variant) | `src/app/components/dialogs/asset-search-dialog/` |
| Service request detail dialog | `src/app/components/dialogs/service-request-dialog/` |
| Dialog service (programmatic dialog opening) | `src/app/services/dialog.service.ts` |
| Base dialog component | `src/app/components/dialogs/base-dialog.component.ts` |
| Task comments drawer (read-only side drawer) | `src/app/components/task-comments-drawer/` |
| Theme toggle service | `src/app/services/theme.service.ts` |

### 3. Replace mock data with real API calls

All mock data is either inline in the component or in `src/assets/mocks/`. When integrating:
- Replace hardcoded arrays with service calls
- Replace `signal()` initial values with API response data
- The form structure, `@if` guards, and computed signals stay the same


## Seeing Different Form Variants

The form layout changes based on two things: the Job Type dropdown and the selected asset type.

| Job Type | Asset Type | What You See |
|----------|-----------|--------------|
| Repair | Fleet (default) | Meters, Repair Reason, Work Class, Service Status, Work Position (collapsible map), Estimated Appointment Hours, New Service Request section (Standard Jobs, Symptom, Fail/Cause Code, WAC, Comments) |
| PM | Fleet | Same as Repair (minus New SR section) + Services and Inspections Due table |
| Part Rebuild | Any | Part ID, Restock Location, Quantity, Fabrication checkbox, Work Class |
| Repair | Linear | Location, Equipment ID, Work Position with slider + markers, Work Details, Estimated Appointment Hours, New Service Request section (with Correction Performed), Overlap toggle |
| PM | Linear | Same as Repair Linear (minus New SR section) + Services and Inspections Due table + PM Service field |

To switch to a linear asset: click the search icon on the Asset field, then select ROAD07 or UX-BRIDGE-LINEAR from the dialog.

See `MOCK-DATA-GUIDE.md` for the full list of mock data, assets, and quick scenarios.

## Lookup Field Descriptions

All 19 lookup fields (fields with a magnifying glass search button) resolve typed values against mock data on blur. When the user tabs off a lookup field, the input is uppercased and a description appears below the field using `aw-c-1` typography and `text-secondary` color. If no match is found, "NOT DEFINED" is shown instead. When the field is cleared (typing, X button, or select-all+delete), the description disappears immediately. Asset descriptions are also set when selecting via the Asset Search Dialog. Fields appearing in multiple form variants (Work Class, Repair Reason, Service Status) share the same description signals across all instances.

| Behavior | Detail |
|----------|--------|
| Blur with valid ID | Input uppercased, matching description shown below field |
| Blur with invalid ID | Input uppercased, "NOT DEFINED" shown below field |
| Field cleared | Description hidden immediately |
| Asset Search Dialog | Description set on selection |
| Case sensitivity | Lookup is case-insensitive |
| Styling | `aw-c-1` class, `text-secondary` color, 2px left margin |
| Shared fields | Work Class, Repair Reason, Service Status work across all form variants |

See `MOCK-DATA-GUIDE.md` for the full list of valid IDs per field.

## Mock Data

All mock data lives in `src/assets/mocks/` and inline in component files. The `MOCK-DATA-GUIDE.md` file is the single source of truth for what data is available and how to trigger each UI state.

| File | Contents |
|------|----------|
| `assets.json` | 6 fleet assets with meter readings and units |
| `linear-assets.json` | 2 linear assets (ROAD07, UX-BRIDGE-LINEAR) with markers; ROAD07-EMPTY variant for empty SR testing |
| `locations.json` | 5 locations |
| `session.json` | Technician session profile |
| `messages.json` | Read-only messages text |
| `service-requests.json` | 4 existing service request records |
| `services-inspections-due.json` | PM services/inspections data |

## Project Structure

```
src/app/
├── components/
│   ├── dialogs/
│   │   ├── asset-search-dialog/   # Asset lookup dialog (aw-dialog table variant)
│   │   ├── service-request-dialog/ # Service request detail dialog with navigate-away alert
│   │   └── base-dialog.component.ts
│   ├── linear-asset-slider/       # Dual-handle range slider with marker sync
│   ├── mock-map/                  # Placeholder map component
│   ├── table-text-subtext/        # Custom table cell renderer
│   ├── table-link-cell/           # Clickable link cell for service requests table
│   ├── task-comment-cell/         # Comment icon cell for service requests table
│   └── task-comments-drawer/      # Read-only comment side drawer
├── pages/
│   └── new-work-order/            # Main form page
│       ├── new-work-order.component.ts/html/scss
│       └── linear-asset.interface.ts
├── services/
│   ├── dialog.service.ts          # Programmatic dialog opening
│   └── theme.service.ts           # Dark/light mode toggle
├── app.component.ts/html/scss     # Shell with navigation + theme FAB
├── app.config.ts
└── app.routes.ts
```

## Tech Stack

- Angular 18 with standalone components
- `@assetworks-llc/aw-component-lib` (CCL) for all UI components
- SCSS with CCL design tokens (no Tailwind, no inline styles)
- Reactive forms with Angular signals and computed values
- `ChangeDetectionStrategy.OnPush` on all components

## npm Authentication

This project pulls from the private AssetWorks npm registry. You need a `.npmrc` file in the project root with valid credentials. Copy it from the FA-Suite repo if you don't have one.
