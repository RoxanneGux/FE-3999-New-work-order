import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
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
import { TableTextSubtextComponent } from '../../components/table-text-subtext/table-text-subtext.component';
import { TaskCommentCellComponent } from '../../components/task-comment-cell/task-comment-cell.component';
import { TaskCommentsDrawerComponent } from '../../components/task-comments-drawer/task-comments-drawer.component';
import { MockMapComponent } from '../../components/mock-map/mock-map.component';

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
    AwTableComponent,
    TaskCommentsDrawerComponent,
    MockMapComponent
  ],
  templateUrl: './new-work-order.component.html',
  styleUrl: './new-work-order.component.scss'
})
export class NewWorkOrderComponent {
  // Drawer state
  showCommentDrawer = signal(false);
  drawerTaskId = signal('');
  drawerTaskDescription = signal('');
  drawerComment = signal('');

  // Auto-generated WO ID
  private readonly _defaultLocation = 'MAIN';
  private readonly _woSequence = Math.floor(Math.random() * 900) + 100;
  generatedWoId = signal('');
  selectedJobType = signal<string>('');

  isPM = computed(() => this.selectedJobType() === 'PM');

  pageTitle = computed(() => {
    const woId = this.generatedWoId();
    return woId ? `New Work Order - ${woId}` : 'New Work Order';
  });

  breadcrumbs = signal<BreadCrumb[]>([
    { label: 'HomePage Title', route: '/' },
    { label: 'Link 1', route: '/' },
    { label: 'Current Page Title' }
  ]);

  woForm = new FormGroup({
    jobType: new FormControl<SingleSelectOption | null>(null),
    asset: new FormControl('(R-12345) MOTOR POOL SEDAN LINEAR - TEST'),
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
    contactName: new FormControl('Jane Doe'),
    phone: new FormControl('555-123-4567'),
    emailAddress: new FormControl('john.smith@company.com'),
    priority: new FormControl('(4) Normal'),
    financialProjectCode: new FormControl('(TECH001) John Smith'),
    account: new FormControl(''),
    warrantyWork: new FormControl<SingleSelectOption | null>({ label: 'No', value: 'NO' }),
    notes: new FormControl('')
  });

  jobTypeOptions: SingleSelectOption[] = [
    { label: 'Repair', value: 'REPAIR' },
    { label: 'PM', value: 'PM' },
    { label: 'Part Rebuild', value: 'PART_REBUILD' }
  ];

  validationOptions: SingleSelectOption[] = [
    { label: ' ', value: '' },
    { label: 'Update the ticket record', value: 'UPDATE_TICKET' },
    { label: 'Update transaction only', value: 'UPDATE_TRANSACTION' },
    { label: 'Update transaction only on fail', value: 'UPDATE_TRANSACTION_FAIL' }
  ];

  warrantyWorkOptions: SingleSelectOption[] = [
    { label: 'No', value: 'NO' },
    { label: 'Yes', value: 'YES' },
    { label: 'Pending', value: 'PENDING' }
  ];

  messagesText = `Other Open Work Orders
  Work Order Number        Type    Status   Scheduled         Reason  Service
  UX-TEST-1-2024-30        PM      OPEN                       Q2      C
  UX-TEST-1-2024-34        REPAIR  PENDING                    QA-1
Unit is 337 days late for PM service QA-PM-A - due date 04/30/2025
Unit is Overdue 10100 life MILES on meter 1 for service QA-PM-A
  - life meter 1 due at 100`;

  serviceRequestColumns: TableCellInput[] = [
    { type: TableCellTypes.Checkbox, key: 'selected', label: '' },
    {
      sort: true, align: 'left', type: TableCellTypes.Custom, key: 'taskId', label: 'Task',
      combineFields: ['taskId', 'taskDescription'],
      combineTemplate: (values: any[]) => ({
        component: TableTextSubtextComponent,
        componentData: { text: values[0], subText: values[1] }
      })
    },
    {
      sort: false, align: 'center', type: TableCellTypes.Custom, key: 'commentCell', label: ' ',
      combineFields: ['comment.hasComment', 'taskId', 'taskDescription', 'comment.text'],
      combineTemplate: (values: any[]) => ({
        component: TaskCommentCellComponent,
        componentData: {
          hasComment: values[0] === true,
          taskId: values[1] || '',
          taskDescription: values[2] || '',
          comment: values[3] || '',
          onOpenDrawer: (id: string, desc: string, comment: string) => this.openCommentDrawer(id, desc, comment)
        }
      })
    },
    {
      sort: true, align: 'left', type: TableCellTypes.Custom, key: 'symptomId', label: 'Symptom',
      combineFields: ['symptomId', 'symptomDescription'],
      combineTemplate: (values: any[]) => ({
        component: TableTextSubtextComponent,
        componentData: { text: values[0], subText: values[1] }
      })
    },
    {
      sort: true, align: 'left', type: TableCellTypes.Custom, key: 'enteredDate', label: 'Entered When',
      combineFields: ['enteredDate', 'enteredTime'],
      combineTemplate: (values: any[]) => ({
        component: TableTextSubtextComponent,
        componentData: { text: values[0], subText: values[1] }
      })
    },
    {
      sort: true, align: 'left', type: TableCellTypes.Custom, key: 'enteredByName', label: 'Entered By',
      combineFields: ['enteredByName', 'enteredById'],
      combineTemplate: (values: any[]) => ({
        component: TableTextSubtextComponent,
        componentData: { text: values[0], subText: values[1] }
      })
    },
    {
      sort: true, align: 'left', type: TableCellTypes.Custom, key: 'priorityId', label: 'Priority',
      combineFields: ['priorityId', 'priorityDescription'],
      combineTemplate: (values: any[]) => ({
        component: TableTextSubtextComponent,
        componentData: { text: values[0], subText: values[1] }
      })
    },
    {
      type: TableCellTypes.IconButton, key: 'searchAction', label: ' ', align: 'center',
      buttonType: 'primary', icon: 'search',
      action: (data?: any) => console.log('Search row:', data)
    }
  ];

  serviceRequestData = [
    { selected: false, taskId: 'BRK-001', taskDescription: 'Replace brake pads', comment: { hasComment: true, text: 'Front brake pads worn below minimum thickness. Recommend immediate replacement with OEM parts.' }, symptomId: 'SYM-BRK', symptomDescription: 'Squealing noise when braking', enteredDate: '03/15/2023', enteredTime: '10:30 AM', enteredByName: 'John Smith', enteredById: 'TECH001', priorityId: '3', priorityDescription: 'High', searchAction: '' },
    { selected: false, taskId: 'OIL-002', taskDescription: 'Oil change and filter', comment: { hasComment: false, text: '' }, symptomId: 'SYM-MNT', symptomDescription: 'Scheduled maintenance', enteredDate: '03/18/2023', enteredTime: '2:15 PM', enteredByName: 'Jane Doe', enteredById: 'TECH002', priorityId: '4', priorityDescription: 'Normal', searchAction: '' },
    { selected: false, taskId: 'TRN-003', taskDescription: 'Transmission fluid flush', comment: { hasComment: true, text: 'Transmission fluid dark and burnt. Possible internal wear. Monitor after flush for shifting issues.' }, symptomId: 'SYM-TRN', symptomDescription: 'Hard shifting', enteredDate: '03/19/2023', enteredTime: '9:00 AM', enteredByName: 'Mike Brown', enteredById: 'TECH003', priorityId: '2', priorityDescription: 'Urgent', searchAction: '' },
    { selected: false, taskId: 'ENG-004', taskDescription: 'Diagnose engine misfire', comment: { hasComment: false, text: '' }, symptomId: 'SYM-ENG', symptomDescription: 'Check engine light', enteredDate: '03/20/2023', enteredTime: '11:45 AM', enteredByName: 'John Smith', enteredById: 'TECH001', priorityId: '3', priorityDescription: 'High', searchAction: '' }
  ];

  // Services and Inspections Due table (PM only)
  servicesInspectionsColumns: TableCellInput[] = [
    { type: TableCellTypes.Checkbox, key: 'addToWorkOrder', label: 'Add to Work Order' },
    {
      sort: true, align: 'left', type: TableCellTypes.Custom, key: 'serviceId', label: 'Service / Inspection due',
      combineFields: ['serviceId', 'serviceDescription'],
      combineTemplate: (values: any[]) => ({
        component: TableTextSubtextComponent,
        componentData: { text: values[0], subText: values[1] }
      })
    },
    { sort: true, align: 'center', type: TableCellTypes.Title, key: 'reason', label: 'Reason' },
    { sort: true, align: 'center', type: TableCellTypes.Title, key: 'dateDue', label: 'Date due' },
    { sort: true, align: 'center', type: TableCellTypes.Title, key: 'daysUntilDue', label: 'Days Until Due' },
    { sort: true, align: 'center', type: TableCellTypes.Title, key: 'daysLate', label: 'Days late' },
    { sort: true, align: 'center', type: TableCellTypes.Title, key: 'meter1UntilDue', label: 'Meter 1 until due' },
    { sort: true, align: 'center', type: TableCellTypes.Title, key: 'meter2UntilDue', label: 'Meter 2 until due' }
  ];

  servicesInspectionsData = signal<any[]>([
    { addToWorkOrder: false, serviceId: 'PMS1', serviceDescription: 'PM SERVICE 1', reason: 'DATE', dateDue: '04/30/2025', daysUntilDue: 'LATE', daysLate: 337, meter1UntilDue: '(10100)', meter2UntilDue: 0 },
    { addToWorkOrder: false, serviceId: 'QA-PM-A', serviceDescription: 'QA PM SERVICE A', reason: 'DATE', dateDue: '04/30/2025', daysUntilDue: 'LATE', daysLate: 337, meter1UntilDue: '(10100)', meter2UntilDue: 0 }
  ]);

  servicesInspectionsCount = computed(() => this.servicesInspectionsData().length);

  get actionLeft(): ActionBarLeft[] {
    return [{ textCallback: { title: 'Cancel', action: () => console.log('Cancel') } }];
  }

  get actionRight(): ActionBarRight[] {
    return [{ buttonCallback: { label: 'Save', buttonType: 'outlined', action: () => console.log('Save', this.woForm.value) } }];
  }

  constructor() {
    this.woForm.get('jobType')?.valueChanges.subscribe((value) => {
      if (value && typeof value === 'object' && value.value) {
        const year = new Date().getFullYear();
        this.generatedWoId.set(`${year}-${this._defaultLocation}-${this._woSequence}`);
        this.selectedJobType.set(value.value);
      } else {
        this.generatedWoId.set('');
        this.selectedJobType.set('');
      }
    });
  }

  onLookup(field: string): void {
    console.log('Lookup:', field);
  }

  openCommentDrawer(taskId: string, taskDescription: string, comment: string): void {
    this.drawerTaskId.set(taskId);
    this.drawerTaskDescription.set(taskDescription);
    this.drawerComment.set(comment);
    this.showCommentDrawer.set(true);
  }

  closeCommentDrawer(): void {
    this.showCommentDrawer.set(false);
  }
}
