# Requirements Document

## Introduction

Add description text below all lookup fields (fields with magnifying glass search buttons) in the New Work Order form. When a user types a value and tabs off (blur), the field resolves the value against mock data and shows either the matching description or "NOT DEFINED" below the input. Input values are uppercased on blur. Descriptions clear when the field is emptied. Form row alignment changes from `flex-end` to `flex-start` to prevent misalignment when descriptions appear. This is a port of the same feature built in FE-528/fe-harness-FE-528, adapted for the New Work Order form's 13 lookup fields across Repair, PM, Part Rebuild, and Linear Asset form variants.

## Glossary

- **New_Work_Order_Form**: The single-entry form page (`NewWorkOrderComponent`) for creating work orders, supporting Repair, PM, Part Rebuild, and Linear Asset variants.
- **Lookup_Field**: A text input field with a search icon button that resolves typed values against mock data to display a description. The 13 lookup fields are: Asset, Part ID, Equipment ID, Repair Reason, Work Class, Service Status, Repair Site, PM Service, Vendor, Contact Name, Priority, Financial Project Code, and Account.
- **Description_Text**: A `<span>` element displayed below a lookup field showing the resolved description of the typed value, or "NOT DEFINED" if no match is found.
- **Mock_Lookup_Data**: Inline arrays of `{ id: string; name: string }` objects defined in the component for each lookup field, used to resolve typed values to descriptions.
- **Asset_Search_Dialog**: The existing `AssetSearchDialogComponent` that allows searching and selecting an asset from `assets.json`.
- **WAC_Pattern**: The production field pattern: `aw-form-field` with input and search button, followed by a description `<span>` using `aw-c-1` typography and `text-secondary` color.

## Requirements

### Requirement 1: Asset Description

**User Story:** As a technician, I want to see the asset description below the Asset field after typing a value and tabbing off, so that I can confirm I entered the correct asset.

#### Acceptance Criteria

1. WHEN the user types a value in the Asset field and blurs, THE New_Work_Order_Form SHALL look up the typed value against the asset data from `assets.json` (case-insensitive match on Asset ID).
2. WHEN a matching asset is found, THE New_Work_Order_Form SHALL display the asset description below the Asset field using `aw-c-1` typography class and `text-secondary` color.
3. WHEN no matching asset is found and the field is not empty, THE New_Work_Order_Form SHALL display "NOT DEFINED" below the Asset field using `aw-c-1` typography class and `text-secondary` color.
4. WHEN the Asset field is empty, THE New_Work_Order_Form SHALL hide the description text below the Asset field.
5. WHEN the user clears the Asset field value, THE New_Work_Order_Form SHALL clear the description text.
6. WHEN the user selects an asset via the Asset Search Dialog, THE New_Work_Order_Form SHALL display the selected asset's description below the Asset field.
7. WHEN the user blurs the Asset field with a non-empty value, THE New_Work_Order_Form SHALL uppercase the input value.

### Requirement 2: Part ID Description

**User Story:** As a technician, I want to see the part description below the Part ID field after typing a value and tabbing off, so that I can confirm I entered the correct part.

#### Acceptance Criteria

1. WHEN the user types a value in the Part ID field and blurs, THE New_Work_Order_Form SHALL look up the typed value against Mock_Lookup_Data for parts (case-insensitive match on part ID).
2. WHEN a matching part is found, THE New_Work_Order_Form SHALL display the part name below the Part ID field using `aw-c-1` typography class and `text-secondary` color.
3. WHEN no matching part is found and the field is not empty, THE New_Work_Order_Form SHALL display "NOT DEFINED" below the Part ID field.
4. WHEN the Part ID field is empty, THE New_Work_Order_Form SHALL hide the description text below the Part ID field.
5. WHEN the user clears the Part ID field value, THE New_Work_Order_Form SHALL clear the description text.
6. WHEN the user blurs the Part ID field with a non-empty value, THE New_Work_Order_Form SHALL uppercase the input value.

### Requirement 3: Equipment ID Description

**User Story:** As a technician, I want to see the equipment description below the Equipment ID field after typing a value and tabbing off, so that I can confirm I entered the correct equipment.

#### Acceptance Criteria

1. WHEN the user types a value in the Equipment ID field and blurs, THE New_Work_Order_Form SHALL look up the typed value against Mock_Lookup_Data for equipment (case-insensitive match on equipment ID).
2. WHEN a matching equipment is found, THE New_Work_Order_Form SHALL display the equipment name below the Equipment ID field using `aw-c-1` typography class and `text-secondary` color.
3. WHEN no matching equipment is found and the field is not empty, THE New_Work_Order_Form SHALL display "NOT DEFINED" below the Equipment ID field.
4. WHEN the Equipment ID field is empty, THE New_Work_Order_Form SHALL hide the description text below the Equipment ID field.
5. WHEN the user clears the Equipment ID field value, THE New_Work_Order_Form SHALL clear the description text.
6. WHEN the user blurs the Equipment ID field with a non-empty value, THE New_Work_Order_Form SHALL uppercase the input value.

### Requirement 4: Repair Reason Description

**User Story:** As a technician, I want to see the repair reason description below the Repair Reason field after typing a value and tabbing off, so that I can confirm I entered the correct reason.

#### Acceptance Criteria

1. WHEN the user types a value in the Repair Reason field and blurs, THE New_Work_Order_Form SHALL look up the typed value against Mock_Lookup_Data for repair reasons (case-insensitive match on reason ID).
2. WHEN a matching repair reason is found, THE New_Work_Order_Form SHALL display the reason name below the Repair Reason field using `aw-c-1` typography class and `text-secondary` color.
3. WHEN no matching repair reason is found and the field is not empty, THE New_Work_Order_Form SHALL display "NOT DEFINED" below the Repair Reason field.
4. WHEN the Repair Reason field is empty, THE New_Work_Order_Form SHALL hide the description text below the Repair Reason field.
5. WHEN the user clears the Repair Reason field value, THE New_Work_Order_Form SHALL clear the description text.
6. WHEN the user blurs the Repair Reason field with a non-empty value, THE New_Work_Order_Form SHALL uppercase the input value.

### Requirement 5: Work Class Description

**User Story:** As a technician, I want to see the work class description below the Work Class field after typing a value and tabbing off, so that I can confirm I entered the correct work class.

#### Acceptance Criteria

1. WHEN the user types a value in the Work Class field and blurs, THE New_Work_Order_Form SHALL look up the typed value against Mock_Lookup_Data for work classes (case-insensitive match on work class ID).
2. WHEN a matching work class is found, THE New_Work_Order_Form SHALL display the work class name below the Work Class field using `aw-c-1` typography class and `text-secondary` color.
3. WHEN no matching work class is found and the field is not empty, THE New_Work_Order_Form SHALL display "NOT DEFINED" below the Work Class field.
4. WHEN the Work Class field is empty, THE New_Work_Order_Form SHALL hide the description text below the Work Class field.
5. WHEN the user clears the Work Class field value, THE New_Work_Order_Form SHALL clear the description text.
6. WHEN the user blurs the Work Class field with a non-empty value, THE New_Work_Order_Form SHALL uppercase the input value.

### Requirement 6: Service Status Description

**User Story:** As a technician, I want to see the service status description below the Service Status field after typing a value and tabbing off, so that I can confirm I entered the correct status.

#### Acceptance Criteria

1. WHEN the user types a value in the Service Status field and blurs, THE New_Work_Order_Form SHALL look up the typed value against Mock_Lookup_Data for service statuses (case-insensitive match on status ID).
2. WHEN a matching service status is found, THE New_Work_Order_Form SHALL display the status name below the Service Status field using `aw-c-1` typography class and `text-secondary` color.
3. WHEN no matching service status is found and the field is not empty, THE New_Work_Order_Form SHALL display "NOT DEFINED" below the Service Status field.
4. WHEN the Service Status field is empty, THE New_Work_Order_Form SHALL hide the description text below the Service Status field.
5. WHEN the user clears the Service Status field value, THE New_Work_Order_Form SHALL clear the description text.
6. WHEN the user blurs the Service Status field with a non-empty value, THE New_Work_Order_Form SHALL uppercase the input value.

### Requirement 7: Repair Site Description

**User Story:** As a technician, I want to see the repair site description below the Repair Site field after typing a value and tabbing off, so that I can confirm I entered the correct site.

#### Acceptance Criteria

1. WHEN the user types a value in the Repair Site field and blurs, THE New_Work_Order_Form SHALL look up the typed value against Mock_Lookup_Data for repair sites (case-insensitive match on site ID).
2. WHEN a matching repair site is found, THE New_Work_Order_Form SHALL display the site name below the Repair Site field using `aw-c-1` typography class and `text-secondary` color.
3. WHEN no matching repair site is found and the field is not empty, THE New_Work_Order_Form SHALL display "NOT DEFINED" below the Repair Site field.
4. WHEN the Repair Site field is empty, THE New_Work_Order_Form SHALL hide the description text below the Repair Site field.
5. WHEN the user clears the Repair Site field value, THE New_Work_Order_Form SHALL clear the description text.
6. WHEN the user blurs the Repair Site field with a non-empty value, THE New_Work_Order_Form SHALL uppercase the input value.

### Requirement 8: PM Service Description

**User Story:** As a technician, I want to see the PM service description below the PM Service field after typing a value and tabbing off, so that I can confirm I entered the correct service.

#### Acceptance Criteria

1. WHEN the user types a value in the PM Service field and blurs, THE New_Work_Order_Form SHALL look up the typed value against Mock_Lookup_Data for PM services (case-insensitive match on service ID).
2. WHEN a matching PM service is found, THE New_Work_Order_Form SHALL display the service name below the PM Service field using `aw-c-1` typography class and `text-secondary` color.
3. WHEN no matching PM service is found and the field is not empty, THE New_Work_Order_Form SHALL display "NOT DEFINED" below the PM Service field.
4. WHEN the PM Service field is empty, THE New_Work_Order_Form SHALL hide the description text below the PM Service field.
5. WHEN the user clears the PM Service field value, THE New_Work_Order_Form SHALL clear the description text.
6. WHEN the user blurs the PM Service field with a non-empty value, THE New_Work_Order_Form SHALL uppercase the input value.

### Requirement 9: Vendor Description

**User Story:** As a technician, I want to see the vendor description below the Vendor field after typing a value and tabbing off, so that I can confirm I entered the correct vendor.

#### Acceptance Criteria

1. WHEN the user types a value in the Vendor field and blurs, THE New_Work_Order_Form SHALL look up the typed value against Mock_Lookup_Data for vendors (case-insensitive match on vendor ID).
2. WHEN a matching vendor is found, THE New_Work_Order_Form SHALL display the vendor name below the Vendor field using `aw-c-1` typography class and `text-secondary` color.
3. WHEN no matching vendor is found and the field is not empty, THE New_Work_Order_Form SHALL display "NOT DEFINED" below the Vendor field.
4. WHEN the Vendor field is empty, THE New_Work_Order_Form SHALL hide the description text below the Vendor field.
5. WHEN the user clears the Vendor field value, THE New_Work_Order_Form SHALL clear the description text.
6. WHEN the user blurs the Vendor field with a non-empty value, THE New_Work_Order_Form SHALL uppercase the input value.

### Requirement 10: Contact Name Description

**User Story:** As a technician, I want to see the contact description below the Contact Name field after typing a value and tabbing off, so that I can confirm I entered the correct contact.

#### Acceptance Criteria

1. WHEN the user types a value in the Contact Name field and blurs, THE New_Work_Order_Form SHALL look up the typed value against Mock_Lookup_Data for contacts (case-insensitive match on contact ID).
2. WHEN a matching contact is found, THE New_Work_Order_Form SHALL display the contact name below the Contact Name field using `aw-c-1` typography class and `text-secondary` color.
3. WHEN no matching contact is found and the field is not empty, THE New_Work_Order_Form SHALL display "NOT DEFINED" below the Contact Name field.
4. WHEN the Contact Name field is empty, THE New_Work_Order_Form SHALL hide the description text below the Contact Name field.
5. WHEN the user clears the Contact Name field value, THE New_Work_Order_Form SHALL clear the description text.
6. WHEN the user blurs the Contact Name field with a non-empty value, THE New_Work_Order_Form SHALL uppercase the input value.

### Requirement 11: Priority Description

**User Story:** As a technician, I want to see the priority description below the Priority field after typing a value and tabbing off, so that I can confirm I entered the correct priority.

#### Acceptance Criteria

1. WHEN the user types a value in the Priority field and blurs, THE New_Work_Order_Form SHALL look up the typed value against Mock_Lookup_Data for priorities (case-insensitive match on priority ID).
2. WHEN a matching priority is found, THE New_Work_Order_Form SHALL display the priority name below the Priority field using `aw-c-1` typography class and `text-secondary` color.
3. WHEN no matching priority is found and the field is not empty, THE New_Work_Order_Form SHALL display "NOT DEFINED" below the Priority field.
4. WHEN the Priority field is empty, THE New_Work_Order_Form SHALL hide the description text below the Priority field.
5. WHEN the user clears the Priority field value, THE New_Work_Order_Form SHALL clear the description text.
6. WHEN the user blurs the Priority field with a non-empty value, THE New_Work_Order_Form SHALL uppercase the input value.

### Requirement 12: Financial Project Code Description

**User Story:** As a technician, I want to see the financial project code description below the Financial Project Code field after typing a value and tabbing off, so that I can confirm I entered the correct code.

#### Acceptance Criteria

1. WHEN the user types a value in the Financial Project Code field and blurs, THE New_Work_Order_Form SHALL look up the typed value against Mock_Lookup_Data for financial project codes (case-insensitive match on code ID).
2. WHEN a matching financial project code is found, THE New_Work_Order_Form SHALL display the code name below the Financial Project Code field using `aw-c-1` typography class and `text-secondary` color.
3. WHEN no matching financial project code is found and the field is not empty, THE New_Work_Order_Form SHALL display "NOT DEFINED" below the Financial Project Code field.
4. WHEN the Financial Project Code field is empty, THE New_Work_Order_Form SHALL hide the description text below the Financial Project Code field.
5. WHEN the user clears the Financial Project Code field value, THE New_Work_Order_Form SHALL clear the description text.
6. WHEN the user blurs the Financial Project Code field with a non-empty value, THE New_Work_Order_Form SHALL uppercase the input value.

### Requirement 13: Account Description

**User Story:** As a technician, I want to see the account description below the Account field after typing a value and tabbing off, so that I can confirm I entered the correct account.

#### Acceptance Criteria

1. WHEN the user types a value in the Account field and blurs, THE New_Work_Order_Form SHALL look up the typed value against Mock_Lookup_Data for accounts (case-insensitive match on account ID).
2. WHEN a matching account is found, THE New_Work_Order_Form SHALL display the account name below the Account field using `aw-c-1` typography class and `text-secondary` color.
3. WHEN no matching account is found and the field is not empty, THE New_Work_Order_Form SHALL display "NOT DEFINED" below the Account field.
4. WHEN the Account field is empty, THE New_Work_Order_Form SHALL hide the description text below the Account field.
5. WHEN the user clears the Account field value, THE New_Work_Order_Form SHALL clear the description text.
6. WHEN the user blurs the Account field with a non-empty value, THE New_Work_Order_Form SHALL uppercase the input value.

### Requirement 14: Description Styling and Layout

**User Story:** As a developer, I want all lookup field descriptions to follow the production WAC pattern styling and form rows to align correctly when descriptions appear, so that the harness matches the production application's visual design.

#### Acceptance Criteria

1. THE Description_Text SHALL use the `aw-c-1` typography class (12px/16px caption).
2. THE Description_Text SHALL use `text-secondary` color (`var(--system-text-text-secondary)`).
3. THE Description_Text SHALL be positioned inside the parent `.form-field` div, below the `.field-with-icon` div.
4. THE Description_Text SHALL have a left margin of 2px (matching the production `.field-desc` pattern).
5. THE New_Work_Order_Form SHALL use `align-items: flex-start` instead of `flex-end` on `.form-row` elements at the desktop breakpoint, so that description text below one field does not misalign the adjacent field.

### Requirement 15: Uppercase on Blur

**User Story:** As a technician, I want lookup field values to be automatically uppercased when I tab off, so that the values match the production WAC behavior.

#### Acceptance Criteria

1. WHEN the user blurs any Lookup_Field with a non-empty value, THE New_Work_Order_Form SHALL convert the trimmed input value to uppercase and update the form control.

### Requirement 16: Clear Description on Empty

**User Story:** As a technician, I want the description to disappear when I clear a lookup field, so that stale descriptions do not remain visible.

#### Acceptance Criteria

1. WHEN a Lookup_Field value changes to empty (via X button, select-all+delete, or manual clearing), THE New_Work_Order_Form SHALL clear the corresponding description text.
2. THE New_Work_Order_Form SHALL monitor all Lookup_Field form controls for value changes and clear descriptions when the value becomes empty.

### Requirement 17: Mock Data Definition

**User Story:** As a developer, I want mock data defined for each lookup field so that descriptions can be resolved without API calls.

#### Acceptance Criteria

1. THE New_Work_Order_Form SHALL define inline Mock_Lookup_Data for Part ID with entries: PRT-001 "Brake Pad Set", PRT-002 "Oil Filter", PRT-003 "Air Filter".
2. THE New_Work_Order_Form SHALL define inline Mock_Lookup_Data for Equipment ID with entries: EQ-001 "Excavator CAT 320", EQ-002 "Loader JD 544".
3. THE New_Work_Order_Form SHALL define inline Mock_Lookup_Data for Repair Reason with entries: RR-001 "Scheduled Maintenance", RR-002 "Breakdown", RR-003 "Accident Damage".
4. THE New_Work_Order_Form SHALL define inline Mock_Lookup_Data for Work Class with entries: WC-001 "In-House Repair", WC-002 "Outsourced", WC-003 "Warranty".
5. THE New_Work_Order_Form SHALL define inline Mock_Lookup_Data for Service Status with entries: SS-001 "Open", SS-002 "In Progress", SS-003 "Completed".
6. THE New_Work_Order_Form SHALL define inline Mock_Lookup_Data for Repair Site with entries: RS-001 "Main Shop", RS-002 "Field Service", RS-003 "Vendor Shop".
7. THE New_Work_Order_Form SHALL define inline Mock_Lookup_Data for PM Service with entries: PM-001 "Oil Change Service", PM-002 "Brake Inspection".
8. THE New_Work_Order_Form SHALL define inline Mock_Lookup_Data for Vendor with entries: VND-001 "AutoParts Inc.", VND-002 "Fleet Services LLC".
9. THE New_Work_Order_Form SHALL define inline Mock_Lookup_Data for Contact Name with entries: CN-001 "Jane Doe", CN-002 "Bob Wilson".
10. THE New_Work_Order_Form SHALL define inline Mock_Lookup_Data for Priority with entries: 1 "Emergency", 2 "Urgent", 3 "High", 4 "Normal", 5 "Low".
11. THE New_Work_Order_Form SHALL define inline Mock_Lookup_Data for Financial Project Code with entries: FPC-001 "FY2026 Infrastructure", FPC-002 "FY2026 Fleet Renewal".
12. THE New_Work_Order_Form SHALL define inline Mock_Lookup_Data for Account with entries: ACC-001 "General Maintenance", ACC-002 "Fleet Operations".
13. THE New_Work_Order_Form SHALL resolve Asset descriptions against the existing asset data loaded from `assets.json` (matching on `AssetId`).

### Requirement 18: Documentation Updates

**User Story:** As a developer, I want the MOCK-DATA-GUIDE.md and README.md to reflect the new lookup field description behavior, so that the documentation stays current.

#### Acceptance Criteria

1. THE MOCK-DATA-GUIDE.md SHALL document which mock data IDs and descriptions are available for each lookup field.
2. THE README.md SHALL describe the lookup field description behavior (blur resolves description, "NOT DEFINED" on mismatch, hidden when empty, uppercase on blur).
3. THE MOCK-DATA-GUIDE.md SHALL include quick scenarios for testing lookup field descriptions (match found, no match, empty field).
