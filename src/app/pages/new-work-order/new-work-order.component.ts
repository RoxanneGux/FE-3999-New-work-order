import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ActionBarLeft,
  ActionBarRight,
  AwActionBarComponent,
  AwBreadCrumbComponent,
  AwDividerComponent,
  AwExpansionPanelComponent,
  AwFormFieldComponent,
  AwFormFieldLabelComponent,
  AwInputDirective,
  AwSelectMenuComponent,
  AwButtonDirective,
  AwButtonIconOnlyDirective,
  AwIconComponent,
  AwTableComponent,
  BreadCrumb,
  SingleSelectOption,
  TableCellInput,
  TableCellTypes
} from '@assetworks-llc/aw-component-lib';

@Component({
  selector: 'app-new-work-order',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AwActionBarComponent,
    AwBreadCrumbComponent,
    AwDividerComponent,
    AwExpansionPanelComponent,
    AwFormFieldComponent,
    AwFormFieldLabelComponent,
    AwInputDirective,
    AwSelectMenuComponent,
    AwButtonDirective,
    AwButtonIconOnlyDirective,
    AwIconComponent,
    AwTableComponent
  ],
  templateUrl: './new-work-order.component.html',
  styleUrl: './new-work-order.component.scss'
})
export class NewWorkOrderComponent {
  breadcrumbs = signal<BreadCrumb[]>([
    { label: 'HomePage Title', route: '/' },
    { label: 'Link 1', route: '/' },
    { label: 'Current Page Title' }
  ]);

  woForm = new FormGroup({
    jobType: new FormControl<SingleSelectOption | null>({ label: 'Repair', value: 'repair' }),
    asset: new FormControl(''),
    title: new FormControl(''),
    meter1: new FormControl(''),
    meter1Validation: new FormControl<SingleSelectOption | null>(null),
    meter2: new FormControl(''),
    meter2Validation: new FormControl<SingleSelectOption | null>(null),
    repairReason: new FormControl(''),
    workClass: new FormControl(''),
    serviceStatus: new FormControl(''),
    repairSite: new FormControl(''),
    dateTimeInDate: new FormControl('03/21/2023'),
    dateTimeInTime: new FormControl('2:00 PM'),
    dateTimeDueDate: new FormControl('03/24/2023'),
    dateTimeDueTime: new FormControl('2:00 PM'),
    vendor: new FormControl(''),
    contactName: new FormControl('Default contact name'),
    phone: new FormControl('Default phone'),
    emailAddress: new FormControl('Default email address'),
    priority: new FormControl(''),
    financialProjectCode: new FormControl(''),
    account: new FormControl(''),
    warrantyWork: new FormControl<SingleSelectOption | null>({ label: 'No', value: 'no' }),
    notes: new FormControl('')
  });

  jobTypeOptions: SingleSelectOption[] = [
    { label: 'Repair', value: 'repair' },
    { label: 'PM', value: 'pm' },
    { label: 'Inspection', value: 'inspection' }
  ];

  validationOptions: SingleSelectOption[] = [
    { label: 'Warning', value: 'warning' },
    { label: 'Error', value: 'error' },
    { label: 'None', value: 'none' }
  ];

  warrantyWorkOptions: SingleSelectOption[] = [
    { label: 'No', value: 'no' },
    { label: 'Yes', value: 'yes' }
  ];

  messagesText = `Other Open Work Orders
  Work Order Number        Type    Status   Scheduled         Reason  Service
  UX-TEST-1-2024-30        PM      OPEN                       Q2      C
  UX-TEST-1-2024-34        REPAIR  PENDING                    QA-1
Unit is 337 days late for PM service QA-PM-A - due date 04/30/2025
Unit is Overdue 10100 life MILES on meter 1 for service QA-PM-A
  - life meter 1 due at 100`;

  serviceRequestColumns: TableCellInput[] = [
    { label: 'Task', key: 'task', type: TableCellTypes.Title, sort: true },
    { label: 'Symptom', key: 'symptom', type: TableCellTypes.Title, sort: true },
    { label: 'Entered When', key: 'enteredWhen', type: TableCellTypes.Title, sort: true },
    { label: 'Entered By', key: 'enteredBy', type: TableCellTypes.Title, sort: true },
    { label: 'Priority', key: 'priority', type: TableCellTypes.Title, sort: true }
  ];

  serviceRequestData = signal([
    { task: 'Task ID', symptom: 'Symptom ID', enteredWhen: 'MM/DD/YYYY', enteredBy: 'User Name', priority: 'Priority ID' },
    { task: 'Text', symptom: 'Text', enteredWhen: 'Text', enteredBy: 'Text', priority: 'Text' }
  ]);

  get actionLeft(): ActionBarLeft[] {
    return [{ textCallback: { title: 'Cancel', action: () => console.log('Cancel') } }];
  }

  get actionRight(): ActionBarRight[] {
    return [{ buttonCallback: { label: 'Save', buttonType: 'outlined', action: () => console.log('Save', this.woForm.value) } }];
  }

  onLookup(field: string): void {
    console.log('Lookup:', field);
  }
}
