import { AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy, Component, signal, computed, inject, ViewChild, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ActionBarLeft,
  ActionBarRight,
  AwActionBarComponent,
  AwBreadCrumbComponent,
  AwDateTimePickerComponent,
  AwDividerComponent,
  AwExpansionPanelComponent,
  AwFormFieldComponent,
  AwFormFieldLabelComponent,
  AwFormMessageComponent,
  AwInputDirective,
  AwSelectMenuComponent,
  AwButtonDirective,
  AwButtonIconOnlyDirective,
  AwIconComponent,
  AwTableComponent,
  AwCheckboxComponent,
  AwSearchComponent,
  AwToastComponent,
  AwToolTipDirective,
  BreadCrumb,
  SingleSelectOption,
  TableCellInput,
  TableCellTypes
} from '@assetworks-llc/aw-component-lib';
import { TableTextSubtextComponent } from '../../components/table-text-subtext/table-text-subtext.component';
import { TaskCommentCellComponent } from '../../components/task-comment-cell/task-comment-cell.component';
import { TaskCommentsDrawerComponent } from '../../components/task-comments-drawer/task-comments-drawer.component';
import { MockMapComponent } from '../../components/mock-map/mock-map.component';
import { Marker } from './linear-asset.interface';
import { LinearAssetSliderComponent } from '../../components/linear-asset-slider/linear-asset-slider.component';
import { DialogService } from '../../services/dialog.service';
import { AssetSearchDialogComponent, AssetSearchDialogResult } from '../../components/dialogs/asset-search-dialog/asset-search-dialog.component';
import { TableLinkCellComponent } from '../../components/table-link-cell/table-link-cell.component';
import { ServiceRequestDialogComponent } from '../../components/dialogs/service-request-dialog/service-request-dialog.component';

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
    AwFormMessageComponent,
    AwInputDirective,
    AwSelectMenuComponent,
    AwButtonDirective,
    AwButtonIconOnlyDirective,
    AwIconComponent,
    AwTableComponent,
    AwCheckboxComponent,
    AwSearchComponent,
    AwToastComponent,
    AwToolTipDirective,
    AwDateTimePickerComponent,
    TaskCommentsDrawerComponent,
    MockMapComponent,
    LinearAssetSliderComponent
  ],
  templateUrl: './new-work-order.component.html',
  styleUrl: './new-work-order.component.scss'
})
export class NewWorkOrderComponent implements AfterViewInit {
  @ViewChild('dateTimeInPicker') private _dateTimeInPicker!: AwDateTimePickerComponent;
  @ViewChild('dateTimeDuePicker') private _dateTimeDuePicker!: AwDateTimePickerComponent;
  @ViewChild('toast') private _toast!: AwToastComponent;
  @ViewChild('srTable') private _srTable!: AwTableComponent;

  private readonly _dialogService = inject(DialogService);
  private readonly _cdr = inject(ChangeDetectorRef);

  // ── Inline mock data for lookup field descriptions ──

  /** Asset data from the asset search dialog for lookup resolution. */
  private readonly _assetData: readonly { id: string; name: string }[] = [
    { id: 'R-12345', name: 'MOTOR POOL SEDAN' },
    { id: 'QA-FLEET-002', name: 'QA FLEET TRUCK 002' },
    { id: 'K123-456', name: 'SERIES 50 DETROIT DIESEL GAS ENGINE' },
    { id: 'QA-C-001', name: 'CARGO VAN 2500' },
    { id: 'FL-VAN-03', name: 'FLEET VAN 03' },
    { id: 'FL-VAN-03-CLEAN', name: 'FLEET VAN 03 - NO PM DUE' },
    { id: 'TX-TRUCK-07', name: 'PICKUP TRUCK F-150' },
    { id: 'ROAD07', name: 'HIGHWAY 07 - MAIN CORRIDOR' },
    { id: 'ROAD07-EMPTY', name: 'HIGHWAY 07 - NO SERVICE REQUESTS' },
    { id: 'UX-BRIDGE-LINEAR', name: 'UX TEST BRIDGE - LINEAR ASSET' },
  ];

  private readonly _mockPartData: readonly { id: string; name: string }[] = [
    { id: 'PRT-001', name: 'Brake Pad Set' },
    { id: 'PRT-002', name: 'Oil Filter' },
    { id: 'PRT-003', name: 'Air Filter' },
  ];

  private readonly _mockEquipmentData: readonly { id: string; name: string }[] = [
    { id: 'EQ-001', name: 'Excavator CAT 320' },
    { id: 'EQ-002', name: 'Loader JD 544' },
  ];

  private readonly _mockRepairReasonData: readonly { id: string; name: string }[] = [
    { id: 'RR-001', name: 'Scheduled Maintenance' },
    { id: 'RR-002', name: 'Breakdown' },
    { id: 'RR-003', name: 'Accident Damage' },
  ];

  private readonly _mockWorkClassData: readonly { id: string; name: string }[] = [
    { id: 'WC-001', name: 'In-House Repair' },
    { id: 'WC-002', name: 'Outsourced' },
    { id: 'WC-003', name: 'Warranty' },
  ];

  private readonly _mockServiceStatusData: readonly { id: string; name: string }[] = [
    { id: 'SS-001', name: 'Open' },
    { id: 'SS-002', name: 'In Progress' },
    { id: 'SS-003', name: 'Completed' },
  ];

  private readonly _mockRepairSiteData: readonly { id: string; name: string }[] = [
    { id: 'RS-001', name: 'Main Shop' },
    { id: 'RS-002', name: 'Field Service' },
    { id: 'RS-003', name: 'Vendor Shop' },
  ];

  private readonly _mockPmServiceData: readonly { id: string; name: string }[] = [
    { id: 'PM-001', name: 'Oil Change Service' },
    { id: 'PM-002', name: 'Brake Inspection' },
  ];

  private readonly _mockVendorData: readonly { id: string; name: string }[] = [
    { id: 'VND-001', name: 'AutoParts Inc.' },
    { id: 'VND-002', name: 'Fleet Services LLC' },
  ];

  private readonly _mockContactData: readonly { id: string; name: string }[] = [
    { id: 'JANE-DOE', name: 'Jane Doe' },
    { id: 'BOB-WILSON', name: 'Bob Wilson' },
  ];

  private readonly _mockPriorityData: readonly { id: string; name: string }[] = [
    { id: '1', name: 'Emergency' },
    { id: '2', name: 'Urgent' },
    { id: '3', name: 'High' },
    { id: '4', name: 'Normal' },
    { id: '5', name: 'Low' },
  ];

  private readonly _mockFpcData: readonly { id: string; name: string }[] = [
    { id: 'FPC-001', name: 'FY2026 Infrastructure' },
    { id: 'FPC-002', name: 'FY2026 Fleet Renewal' },
  ];

  private readonly _mockAccountData: readonly { id: string; name: string }[] = [
    { id: 'ACC-001', name: 'General Maintenance' },
    { id: 'ACC-002', name: 'Fleet Operations' },
  ];

  private readonly _mockStandardJobsData: readonly { id: string; name: string }[] = [
    { id: 'SJ-001', name: 'Oil Change' },
    { id: 'SJ-002', name: 'Brake Inspection' },
    { id: 'SJ-003', name: 'Tire Rotation' },
  ];

  private readonly _mockSymptomData: readonly { id: string; name: string }[] = [
    { id: 'SYMP-001', name: 'Squealing Noise' },
    { id: 'SYMP-002', name: 'Engine Misfire' },
    { id: 'SYMP-003', name: 'Fluid Leak' },
  ];

  private readonly _mockFailCauseCodeData: readonly { id: string; name: string }[] = [
    { id: 'FC-001', name: 'Wear and Tear' },
    { id: 'FC-002', name: 'Manufacturing Defect' },
    { id: 'FC-003', name: 'Operator Error' },
  ];

  private readonly _mockWacData: readonly { id: string; name: string }[] = [
    { id: 'WAC-001', name: 'Replace Component' },
    { id: 'WAC-002', name: 'Repair in Place' },
    { id: 'WAC-003', name: 'Adjust Settings' },
  ];

  // ── Description signals (13 fields × text + error) ──

  public readonly assetDesc = signal<string>('');
  public readonly assetDescError = signal<boolean>(false);
  public readonly partIdDesc = signal<string>('');
  public readonly partIdDescError = signal<boolean>(false);
  public readonly equipmentIdDesc = signal<string>('');
  public readonly equipmentIdDescError = signal<boolean>(false);
  public readonly repairReasonDesc = signal<string>('');
  public readonly repairReasonDescError = signal<boolean>(false);
  public readonly workClassDesc = signal<string>('');
  public readonly workClassDescError = signal<boolean>(false);
  public readonly serviceStatusDesc = signal<string>('');
  public readonly serviceStatusDescError = signal<boolean>(false);
  public readonly repairSiteDesc = signal<string>('');
  public readonly repairSiteDescError = signal<boolean>(false);
  public readonly pmServiceDesc = signal<string>('');
  public readonly pmServiceDescError = signal<boolean>(false);
  public readonly vendorDesc = signal<string>('');
  public readonly vendorDescError = signal<boolean>(false);
  public readonly schedulingLocationDesc = signal<string>('');
  public readonly schedulingLocationDescError = signal<boolean>(false);
  public readonly contactNameDesc = signal<string>('');
  public readonly contactNameDescError = signal<boolean>(false);
  public readonly priorityDesc = signal<string>('');
  public readonly priorityDescError = signal<boolean>(false);
  public readonly financialProjectCodeDesc = signal<string>('');
  public readonly financialProjectCodeDescError = signal<boolean>(false);
  public readonly accountDesc = signal<string>('');
  public readonly accountDescError = signal<boolean>(false);
  public readonly locationDesc = signal<string>('');
  public readonly locationDescError = signal<boolean>(false);
  public readonly srStandardJobsDesc = signal<string>('');
  public readonly srStandardJobsDescError = signal<boolean>(false);
  public readonly srSymptomDesc = signal<string>('');
  public readonly srSymptomDescError = signal<boolean>(false);
  public readonly srFailCauseCodeDesc = signal<string>('');
  public readonly srFailCauseCodeDescError = signal<boolean>(false);
  public readonly srWacDesc = signal<string>('');
  public readonly srWacDescError = signal<boolean>(false);

  /** Validation error for date-time-in date field. Null means no error. */
  public readonly dateTimeInDateError = signal<string | null>(null);

  /** Validation error for date-time-in time field. Null means no error. */
  public readonly dateTimeInTimeError = signal<string | null>(null);

  /** Validation error for date-time-due date field. Null means no error. */
  public readonly dateTimeDueDateError = signal<string | null>(null);

  /** Validation error for date-time-due time field. Null means no error. */
  public readonly dateTimeDueTimeError = signal<string | null>(null);

  /** Attach keydown and blur listeners to internal date/time inputs after view initializes. */
  ngAfterViewInit(): void {
    this.attachInputListeners(this._dateTimeInPicker, 'dateTimeIn');
    this.attachInputListeners(this._dateTimeDuePicker, 'dateTimeDue');
  }

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
  isPartRebuild = computed(() => this.selectedJobType() === 'PART_REBUILD');
  isRepair = computed(() => this.selectedJobType() === 'REPAIR');
  selectedAssetType = signal<'Fleet' | 'Linear'>('Fleet');
  meter1Units = signal<string>('miles');
  meter1Reading = signal<number>(45230);
  meter2Units = signal<string>('miles');
  meter2Reading = signal<number>(0);
  hasMeter2 = computed(() => !!this.meter2Units());
  meter1Hint = computed(() => this.meter1Units() ? `Current: ${this.meter1Reading().toLocaleString()} ${this.meter1Units()}` : '');
  meter2Hint = computed(() => this.meter2Units() ? `Current: ${this.meter2Reading().toLocaleString()} ${this.meter2Units()}` : '');
  isLinearAsset = computed(() => this.selectedAssetType() === 'Linear' && !this.isPartRebuild());
  isPMLinear = computed(() => this.isPM() && this.isLinearAsset());
  showAssetField = computed(() => !this.isPartRebuild());
  showMeters = computed(() => !this.isPartRebuild() && !this.isLinearAsset());
  showWorkPosition = computed(() => !this.isPartRebuild() && !this.isLinearAsset());
  showRepairReason = computed(() => !this.isPartRebuild());
  showEstimatedHours = computed(() => !this.isPartRebuild());
  showNewServiceRequest = computed(() => this.isRepair());

  hasAsset = signal(true);

  messagesText = `Other Open Work Orders
  Work Order Number        Type    Status   Scheduled         Reason  Service
  UX-TEST-1-2024-30        PM      OPEN                       Q2      C
  UX-TEST-1-2024-34        REPAIR  PENDING                    QA-1
Unit is 337 days late for PM service QA-PM-A - due date 04/30/2025
Unit is Overdue 10100 life MILES on meter 1 for service QA-PM-A
  - life meter 1 due at 100`;

  use24HourFormat = signal(false);
  timeFormat = computed<'12h' | '24h'>(() => this.use24HourFormat() ? '24h' : '12h');

  timeFormatOptions: SingleSelectOption[] = [
    { label: '12 Hour', value: '12h' },
    { label: '24 Hour', value: '24h' },
  ];

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
    jobType: new FormControl<SingleSelectOption | null>({ label: 'Repair', value: 'REPAIR' }),
    asset: new FormControl('(R-12345) MOTOR POOL SEDAN'),
    title: new FormControl(''),
    meter1: new FormControl(''),
    meter1Validation: new FormControl<SingleSelectOption | null>(null),
    meter2: new FormControl(''),
    meter2Validation: new FormControl<SingleSelectOption | null>(null),
    repairReason: new FormControl(''),
    workClass: new FormControl(''),
    serviceStatus: new FormControl(''),
    repairSite: new FormControl(''),
    dateTimeIn: new FormControl<Date | null>(new Date(2023, 2, 21, 14, 0)),
    dateTimeDue: new FormControl<Date | null>(new Date(2023, 2, 24, 14, 0)),
    schedulingLocation: new FormControl(''),
    vendor: new FormControl(''),
    technician: new FormControl('(LOGGED in TECH ID) Tech Name'),
    contactName: new FormControl('JANE-DOE'),
    phone: new FormControl('555-123-4567'),
    emailAddress: new FormControl('john.smith@company.com'),
    priority: new FormControl('(4) Normal'),
    financialProjectCode: new FormControl('(TECH001) John Smith'),
    account: new FormControl(''),
    warrantyWork: new FormControl<SingleSelectOption | null>({ label: 'No', value: 'NO' }),
    messages: new FormControl(this.messagesText),
    notes: new FormControl(''),
    // Part Rebuild fields
    partId: new FormControl(''),
    partSuffix: new FormControl('00'),
    restockLocation: new FormControl<SingleSelectOption | null>(null),
    quantityRequired: new FormControl(''),
    fabricationNoCore: new FormControl(false),
    // Linear Asset fields
    location: new FormControl(''),
    equipmentId: new FormControl(''),
    fromMarker: new FormControl(''),
    fromOffset: new FormControl('0.0000'),
    toMarker: new FormControl(''),
    toOffset: new FormControl('0.0000'),
    fromOffsetSlider: new FormControl(0),
    toOffsetSlider: new FormControl(0),
    pmService: new FormControl(''),
    overlapServiceRequests: new FormControl(false),
    // New Service Request fields (Repair only)
    srStandardJobs: new FormControl(''),
    srSymptom: new FormControl(''),
    srFailCauseCode: new FormControl(''),
    srWac: new FormControl(''),
    srComments: new FormControl(''),
    srCorrectionPerformed: new FormControl(''),
    estimatedAppointmentHours: new FormControl(''),
    comments: new FormControl('')
  });

  jobTypeOptions: SingleSelectOption[] = [
    { label: 'Repair', value: 'REPAIR' },
    { label: 'PM', value: 'PM' },
    { label: 'Part Rebuild', value: 'PART_REBUILD' }
  ];

  validationOptions: SingleSelectOption[] = [
    { label: 'Update the asset record', value: 'UPDATE_ASSET' },
    { label: 'Update transaction only', value: 'UPDATE_TRANSACTION' },
    { label: 'Update transaction only on fail', value: 'UPDATE_TRANSACTION_FAIL' }
  ];

  warrantyWorkOptions: SingleSelectOption[] = [
    { label: 'No', value: 'NO' },
    { label: 'Yes', value: 'YES' },
    { label: 'Unknown', value: 'UNKNOWN' }
  ];

  restockLocationOptions: SingleSelectOption[] = [
    { label: 'QA-FULL-01 - QA FULL SRV LOCATION', value: 'QA-FULL-01' },
    { label: 'MAIN - Main Shop', value: 'MAIN' },
    { label: 'NORTH - North Facility', value: 'NORTH' },
    { label: 'SOUTH - South Yard', value: 'SOUTH' }
  ];

  locationOptions: SingleSelectOption[] = [
    { label: 'MAIN - Main Shop', value: 'MAIN' },
    { label: 'NORTH - North Facility', value: 'NORTH' },
    { label: 'SOUTH - South Yard', value: 'SOUTH' },
    { label: 'EAST - East Campus', value: 'EAST' },
    { label: 'SHOP-A - Shop A', value: 'SHOP-A' }
  ];

  linearAssetMarkers = signal<Marker[]>([]);
  linearAssetLength = signal<number>(0);

  sliderFormGroup = computed(() => {
    return new FormGroup({
      fromMarker: this.woForm.get('fromMarker') as FormControl,
      fromOffset: this.woForm.get('fromOffset') as FormControl,
      toMarker: this.woForm.get('toMarker') as FormControl,
      toOffset: this.woForm.get('toOffset') as FormControl,
      fromOffsetSlider: this.woForm.get('fromOffsetSlider') as FormControl,
      toOffsetSlider: this.woForm.get('toOffsetSlider') as FormControl,
    });
  });

  serviceRequestColumns: TableCellInput[] = [
    { type: TableCellTypes.Checkbox, key: 'selected', label: 'Assign' },
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
      sort: false, align: 'center', type: TableCellTypes.Custom, key: 'viewAction', label: ' ',
      combineFields: ['taskId'],
      combineTemplate: (values: any[]) => ({
        component: TableLinkCellComponent,
        componentData: {
          label: 'View Service Request',
          callback: () => this.onViewServiceRequest(values[0])
        }
      })
    }
  ];

  serviceRequestData = signal([
    { selected: false, taskId: 'BRK-001', taskDescription: 'Replace brake pads', comment: { hasComment: true, text: 'Front brake pads worn below minimum thickness. Recommend immediate replacement with OEM parts.' }, symptomId: 'SYM-BRK', symptomDescription: 'Squealing noise when braking', enteredDate: '03/15/2023', enteredTime: '10:30 AM', enteredByName: 'John Smith', enteredById: 'TECH001', priorityId: '3', priorityDescription: 'High' },
    { selected: false, taskId: 'OIL-002', taskDescription: 'Oil change and filter', comment: { hasComment: false, text: '' }, symptomId: 'SYM-MNT', symptomDescription: 'Scheduled maintenance', enteredDate: '03/18/2023', enteredTime: '2:15 PM', enteredByName: 'Jane Doe', enteredById: 'TECH002', priorityId: '4', priorityDescription: 'Normal' },
    { selected: false, taskId: 'TRN-003', taskDescription: 'Transmission fluid flush', comment: { hasComment: true, text: 'Transmission fluid dark and burnt. Possible internal wear. Monitor after flush for shifting issues.' }, symptomId: 'SYM-TRN', symptomDescription: 'Hard shifting', enteredDate: '03/19/2023', enteredTime: '9:00 AM', enteredByName: 'Mike Brown', enteredById: 'TECH003', priorityId: '2', priorityDescription: 'Urgent' },
    { selected: false, taskId: 'ENG-004', taskDescription: 'Diagnose engine misfire', comment: { hasComment: false, text: '' }, symptomId: 'SYM-ENG', symptomDescription: 'Check engine light', enteredDate: '03/20/2023', enteredTime: '11:45 AM', enteredByName: 'John Smith', enteredById: 'TECH001', priorityId: '3', priorityDescription: 'High' }
  ]);

  /** Rows to pre-check in the Assign column via [selectedCheckboxRows]. */
  selectedServiceRequests = signal<any[]>([]);

  /** Search query for filtering the service requests table. */
  srSearchQuery = signal('');

  /** Filtered service request data based on search query. */
  filteredServiceRequestData = computed(() => {
    const query = this.srSearchQuery().toLowerCase();
    const data = this.serviceRequestData();
    if (!query) return data;
    return data.filter(row =>
      row.taskId.toLowerCase().includes(query) ||
      row.taskDescription.toLowerCase().includes(query) ||
      row.symptomId.toLowerCase().includes(query) ||
      row.symptomDescription.toLowerCase().includes(query) ||
      row.enteredByName.toLowerCase().includes(query) ||
      row.priorityDescription.toLowerCase().includes(query)
    );
  });

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
    { sort: true, align: 'left', type: TableCellTypes.Custom, key: 'reason', label: 'Reason',
      combineFields: ['reasonId', 'reasonDescription'],
      combineTemplate: (values: any[]) => ({
        component: TableTextSubtextComponent,
        componentData: { text: values[0], subText: values[1] }
      })
    },
    { sort: true, align: 'center', type: TableCellTypes.Title, key: 'dateDue', label: 'Date due' },
    { sort: true, align: 'center', type: TableCellTypes.Title, key: 'daysUntilDue', label: 'Days Until Due' },
    { sort: true, align: 'center', type: TableCellTypes.Title, key: 'daysLate', label: 'Days late' },
    { sort: true, align: 'center', type: TableCellTypes.Title, key: 'meter1UntilDue', label: 'Meter 1 until due' },
    { sort: true, align: 'center', type: TableCellTypes.Title, key: 'meter2UntilDue', label: 'Meter 2 until due' }
  ];

  servicesInspectionsData = signal<any[]>([
    { addToWorkOrder: false, serviceId: 'PMS1', serviceDescription: 'PM SERVICE 1', reasonId: 'RPR-001', reasonDescription: 'Scheduled PM overdue', dateDue: '04/30/2025', daysUntilDue: 'LATE', daysLate: 337, meter1UntilDue: '(10100)', meter2UntilDue: 0 },
    { addToWorkOrder: false, serviceId: 'QA-PM-A', serviceDescription: 'QA PM SERVICE A', reasonId: 'RPR-002', reasonDescription: 'Meter threshold exceeded', dateDue: '04/30/2025', daysUntilDue: 'LATE', daysLate: 337, meter1UntilDue: '(10100)', meter2UntilDue: 0 }
  ]);

  servicesInspectionsCount = computed(() => this.servicesInspectionsData().length);

  get actionLeft(): ActionBarLeft[] {
    return [{ textCallback: { title: 'Back', action: () => alert('This would navigate back to the initial New Work Order page.') } }];
  }

  get actionRight(): ActionBarRight[] {
    return [
      { buttonCallback: { label: 'Cancel', buttonType: 'primary', action: () => alert('This would cancel and navigate back.') } },
      { buttonCallback: { label: 'Save', buttonType: 'outlined', action: () => this.onSave() } }
    ];
  }

  constructor() {
    // Set initial state for default job type
    const year = new Date().getFullYear();
    this.generatedWoId.set(`${year}-${this._defaultLocation}-${this._woSequence}`);
    this.selectedJobType.set('REPAIR');

    this.woForm.get('jobType')?.valueChanges.subscribe((value) => {
      if (value && typeof value === 'object' && value.value) {
        this.generatedWoId.set(`${year}-${this._defaultLocation}-${this._woSequence}`);
        this.selectedJobType.set(value.value);
      } else {
        this.generatedWoId.set('');
        this.selectedJobType.set('');
      }
    });

    // Clear asset-dependent data when asset field is emptied
    this.woForm.get('asset')?.valueChanges.subscribe((value) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        this.hasAsset.set(false);
        this.serviceRequestData.set([]);
        this.servicesInspectionsData.set([]);
        this.selectedAssetType.set('Fleet');
        this.linearAssetMarkers.set([]);
        this.linearAssetLength.set(0);
        this.woForm.get('messages')?.setValue('');
      }
    });

    this._watchLookupFieldClears();

    // Wire up search control to filter service requests
    this.srSearchControl.valueChanges.subscribe(val => {
      this.srSearchQuery.set(val || '');
    });
  }

  onLookup(field: string): void {
    if (field === 'asset') {
      this.openAssetSearchDialog();
      return;
    }
    // Browser alert placeholder for fields without a dedicated lookup dialog
    const fieldLabels: Record<string, string> = {
      partId: 'Part ID',
      equipmentId: 'Equipment ID',
      repairReason: 'Repair Reason',
      workClass: 'Work Class',
      serviceStatus: 'Service Status',
      repairSite: 'Repair Site',
      pmService: 'PM Service',
      vendor: 'Vendor',
      location: 'Location',
      schedulingLocation: 'Location',
      contactName: 'Contact Name',
      priority: 'Priority',
      financialProjectCode: 'Financial Project Code',
      account: 'Account',
      srStandardJobs: 'Standard Jobs',
      srSymptom: 'Symptom',
      srFailCauseCode: 'Fail / Cause Code',
      srWac: 'WAC',
    };
    const label = fieldLabels[field] || field;
    alert(`This button would open an aw-dialog with a table inside for searching ${label} records.`);
  }

  /** Placeholder for the Advanced Asset Search slide-in. */
  onAdvancedAssetSearch(): void {
    alert('This would open the Advanced Asset Search slide-in service.');
  }

  /** Save the work order — shows success toast with WO number. */
  onSave(): void {
    const woNumber = this.generatedWoId() || 'NEW';
    console.log('Save', this.woForm.value);
    this._toast.showToast({
      variant: 'success',
      title: 'Success',
      description: `Work Order ${woNumber} created successfully`,
    });
  }

  /** Placeholder for the Asset Enterprise Portal screen. */
  onOpenAssetPortal(): void {
    alert('This would open the Asset Enterprise Portal screen.');
  }

  /** Placeholder for the Advanced Parts Lookup slide-in. */
  onAdvancedPartSearch(): void {
    alert('This would open the Advanced Parts Lookup slide-in service.');
  }

  /** Increment part suffix (00-99, always 2 digits). */
  incrementPartSuffix(): void {
    const current = parseInt(this.woForm.get('partSuffix')?.value || '0', 10);
    const next = current >= 99 ? 99 : current + 1;
    this.woForm.get('partSuffix')?.setValue(next.toString().padStart(2, '0'));
  }

  /** Decrement part suffix (00-99, always 2 digits). */
  decrementPartSuffix(): void {
    const current = parseInt(this.woForm.get('partSuffix')?.value || '0', 10);
    const next = current <= 0 ? 0 : current - 1;
    this.woForm.get('partSuffix')?.setValue(next.toString().padStart(2, '0'));
  }

  /** Restrict part suffix input to digits only, max 2 characters. */
  onPartSuffixKeydown(event: KeyboardEvent): void {
    const allowed = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End'];
    if (allowed.includes(event.key)) return;
    if (event.key >= '0' && event.key <= '9') {
      const input = event.target as HTMLInputElement;
      if (input.value.length >= 2 && input.selectionStart === input.selectionEnd) {
        event.preventDefault();
      }
      return;
    }
    event.preventDefault();
  }

  /** Pad part suffix to 2 digits on blur. */
  onPartSuffixBlur(): void {
    const ctrl = this.woForm.get('partSuffix');
    if (!ctrl) return;
    const val = ctrl.value || '0';
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      ctrl.setValue('00');
    } else {
      ctrl.setValue(Math.min(99, Math.max(0, num)).toString().padStart(2, '0'));
    }
  }

  /** Update the time format when the floating selector is changed. */
  onTimeFormatChange(event: any): void {
    const value = typeof event === 'object' ? event?.value : event;
    this.use24HourFormat.set(value === '24h');
  }

  /** Resolve a lookup field value against mock data. */
  public lookupField(fieldName: string, value: string): { text: string; isError: boolean } {
    const trimmed = (value ?? '').trim();
    if (!trimmed) return { text: '', isError: false };

    const lower = trimmed.toLowerCase();

    switch (fieldName) {
      case 'asset': {
        const match = this._assetData.find(a => a.id.toLowerCase() === lower);
        return match ? { text: match.name, isError: false } : { text: 'NOT DEFINED', isError: true };
      }
      case 'partId': {
        const match = this._mockPartData.find(p => p.id.toLowerCase() === lower);
        return match ? { text: match.name, isError: false } : { text: 'NOT DEFINED', isError: true };
      }
      case 'equipmentId': {
        const match = this._mockEquipmentData.find(e => e.id.toLowerCase() === lower);
        return match ? { text: match.name, isError: false } : { text: 'NOT DEFINED', isError: true };
      }
      case 'repairReason': {
        const match = this._mockRepairReasonData.find(r => r.id.toLowerCase() === lower);
        return match ? { text: match.name, isError: false } : { text: 'NOT DEFINED', isError: true };
      }
      case 'workClass': {
        const match = this._mockWorkClassData.find(w => w.id.toLowerCase() === lower);
        return match ? { text: match.name, isError: false } : { text: 'NOT DEFINED', isError: true };
      }
      case 'serviceStatus': {
        const match = this._mockServiceStatusData.find(s => s.id.toLowerCase() === lower);
        return match ? { text: match.name, isError: false } : { text: 'NOT DEFINED', isError: true };
      }
      case 'repairSite': {
        const match = this._mockRepairSiteData.find(r => r.id.toLowerCase() === lower);
        return match ? { text: match.name, isError: false } : { text: 'NOT DEFINED', isError: true };
      }
      case 'pmService': {
        const match = this._mockPmServiceData.find(p => p.id.toLowerCase() === lower);
        return match ? { text: match.name, isError: false } : { text: 'NOT DEFINED', isError: true };
      }
      case 'vendor': {
        const match = this._mockVendorData.find(v => v.id.toLowerCase() === lower);
        return match ? { text: match.name, isError: false } : { text: 'NOT DEFINED', isError: true };
      }
      case 'schedulingLocation': {
        const match = this.locationOptions.find(l => l.value.toLowerCase() === lower);
        return match ? { text: match.label, isError: false } : { text: 'NOT DEFINED', isError: true };
      }
      case 'location': {
        const locationData: readonly { id: string; name: string }[] = [
          { id: 'MAIN', name: 'Main Shop' },
          { id: 'NORTH', name: 'North Facility' },
          { id: 'SOUTH', name: 'South Yard' },
          { id: 'EAST', name: 'East Campus' },
          { id: 'SHOP-A', name: 'Shop A' },
        ];
        const match = locationData.find(l => l.id.toLowerCase() === lower);
        return match ? { text: match.name, isError: false } : { text: 'NOT DEFINED', isError: true };
      }
      case 'contactName': {
        const match = this._mockContactData.find(c => c.id.toLowerCase() === lower);
        return match ? { text: match.name, isError: false } : { text: 'NOT DEFINED', isError: true };
      }
      case 'priority': {
        const match = this._mockPriorityData.find(p => p.id.toLowerCase() === lower);
        return match ? { text: match.name, isError: false } : { text: 'NOT DEFINED', isError: true };
      }
      case 'financialProjectCode': {
        const match = this._mockFpcData.find(f => f.id.toLowerCase() === lower);
        return match ? { text: match.name, isError: false } : { text: 'NOT DEFINED', isError: true };
      }
      case 'account': {
        const match = this._mockAccountData.find(a => a.id.toLowerCase() === lower);
        return match ? { text: match.name, isError: false } : { text: 'NOT DEFINED', isError: true };
      }
      case 'srStandardJobs': {
        const match = this._mockStandardJobsData.find(s => s.id.toLowerCase() === lower);
        return match ? { text: match.name, isError: false } : { text: 'NOT DEFINED', isError: true };
      }
      case 'srSymptom': {
        const match = this._mockSymptomData.find(s => s.id.toLowerCase() === lower);
        return match ? { text: match.name, isError: false } : { text: 'NOT DEFINED', isError: true };
      }
      case 'srFailCauseCode': {
        const match = this._mockFailCauseCodeData.find(f => f.id.toLowerCase() === lower);
        return match ? { text: match.name, isError: false } : { text: 'NOT DEFINED', isError: true };
      }
      case 'srWac': {
        const match = this._mockWacData.find(w => w.id.toLowerCase() === lower);
        return match ? { text: match.name, isError: false } : { text: 'NOT DEFINED', isError: true };
      }
      default:
        return { text: '', isError: false };
    }
  }

  /** Handle blur on any lookup field — uppercase, resolve description, set signals. */
  public onLookupFieldBlur(fieldName: string): void {
    const control = this.woForm.get(fieldName);
    const rawValue = (control?.value ?? '').toString();
    const trimmed = rawValue.trim();

    if (trimmed) {
      control?.setValue(trimmed.toUpperCase(), { emitEvent: false });
    }

    const result = this.lookupField(fieldName, trimmed);

    switch (fieldName) {
      case 'asset':              this.assetDesc.set(result.text); this.assetDescError.set(result.isError); break;
      case 'partId':             this.partIdDesc.set(result.text); this.partIdDescError.set(result.isError); break;
      case 'equipmentId':        this.equipmentIdDesc.set(result.text); this.equipmentIdDescError.set(result.isError); break;
      case 'repairReason':       this.repairReasonDesc.set(result.text); this.repairReasonDescError.set(result.isError); break;
      case 'workClass':          this.workClassDesc.set(result.text); this.workClassDescError.set(result.isError); break;
      case 'serviceStatus':      this.serviceStatusDesc.set(result.text); this.serviceStatusDescError.set(result.isError); break;
      case 'repairSite':         this.repairSiteDesc.set(result.text); this.repairSiteDescError.set(result.isError); break;
      case 'pmService':          this.pmServiceDesc.set(result.text); this.pmServiceDescError.set(result.isError); break;
      case 'vendor':             this.vendorDesc.set(result.text); this.vendorDescError.set(result.isError); break;
      case 'schedulingLocation': this.schedulingLocationDesc.set(result.text); this.schedulingLocationDescError.set(result.isError); break;
      case 'contactName':        this.contactNameDesc.set(result.text); this.contactNameDescError.set(result.isError); break;
      case 'priority':           this.priorityDesc.set(result.text); this.priorityDescError.set(result.isError); break;
      case 'financialProjectCode': this.financialProjectCodeDesc.set(result.text); this.financialProjectCodeDescError.set(result.isError); break;
      case 'account':            this.accountDesc.set(result.text); this.accountDescError.set(result.isError); break;
      case 'location':           this.locationDesc.set(result.text); this.locationDescError.set(result.isError); break;
      case 'srStandardJobs':  this.srStandardJobsDesc.set(result.text); this.srStandardJobsDescError.set(result.isError); break;
      case 'srSymptom':       this.srSymptomDesc.set(result.text); this.srSymptomDescError.set(result.isError); break;
      case 'srFailCauseCode': this.srFailCauseCodeDesc.set(result.text); this.srFailCauseCodeDescError.set(result.isError); break;
      case 'srWac':           this.srWacDesc.set(result.text); this.srWacDescError.set(result.isError); break;
    }
  }

  /** Clear description immediately when a lookup field input is emptied (X button, select-all+delete). */
  public onLookupFieldInput(fieldName: string, event: Event): void {
    const value = (event.target as HTMLInputElement)?.value ?? '';
    if (!value.trim()) {
      const fieldSignalMap: Record<string, { desc: WritableSignal<string>; error: WritableSignal<boolean> }> = {
        asset:                { desc: this.assetDesc, error: this.assetDescError },
        partId:               { desc: this.partIdDesc, error: this.partIdDescError },
        equipmentId:          { desc: this.equipmentIdDesc, error: this.equipmentIdDescError },
        repairReason:         { desc: this.repairReasonDesc, error: this.repairReasonDescError },
        workClass:            { desc: this.workClassDesc, error: this.workClassDescError },
        serviceStatus:        { desc: this.serviceStatusDesc, error: this.serviceStatusDescError },
        repairSite:           { desc: this.repairSiteDesc, error: this.repairSiteDescError },
        pmService:            { desc: this.pmServiceDesc, error: this.pmServiceDescError },
        vendor:               { desc: this.vendorDesc, error: this.vendorDescError },
        schedulingLocation:  { desc: this.schedulingLocationDesc, error: this.schedulingLocationDescError },
        contactName:          { desc: this.contactNameDesc, error: this.contactNameDescError },
        priority:             { desc: this.priorityDesc, error: this.priorityDescError },
        financialProjectCode: { desc: this.financialProjectCodeDesc, error: this.financialProjectCodeDescError },
        account:              { desc: this.accountDesc, error: this.accountDescError },
        location:             { desc: this.locationDesc, error: this.locationDescError },
        srStandardJobs:       { desc: this.srStandardJobsDesc, error: this.srStandardJobsDescError },
        srSymptom:            { desc: this.srSymptomDesc, error: this.srSymptomDescError },
        srFailCauseCode:      { desc: this.srFailCauseCodeDesc, error: this.srFailCauseCodeDescError },
        srWac:                { desc: this.srWacDesc, error: this.srWacDescError },
      };
      const signals = fieldSignalMap[fieldName];
      if (signals) {
        signals.desc.set('');
        signals.error.set(false);
      }
    }
  }

  /** Subscribe to valueChanges on all lookup fields — clear description when value becomes empty. */
  private _watchLookupFieldClears(): void {
    const fieldSignalMap: Record<string, { desc: WritableSignal<string>; error: WritableSignal<boolean> }> = {
      asset:                { desc: this.assetDesc, error: this.assetDescError },
      partId:               { desc: this.partIdDesc, error: this.partIdDescError },
      equipmentId:          { desc: this.equipmentIdDesc, error: this.equipmentIdDescError },
      repairReason:         { desc: this.repairReasonDesc, error: this.repairReasonDescError },
      workClass:            { desc: this.workClassDesc, error: this.workClassDescError },
      serviceStatus:        { desc: this.serviceStatusDesc, error: this.serviceStatusDescError },
      repairSite:           { desc: this.repairSiteDesc, error: this.repairSiteDescError },
      pmService:            { desc: this.pmServiceDesc, error: this.pmServiceDescError },
      vendor:               { desc: this.vendorDesc, error: this.vendorDescError },
      schedulingLocation:  { desc: this.schedulingLocationDesc, error: this.schedulingLocationDescError },
      contactName:          { desc: this.contactNameDesc, error: this.contactNameDescError },
      priority:             { desc: this.priorityDesc, error: this.priorityDescError },
      financialProjectCode: { desc: this.financialProjectCodeDesc, error: this.financialProjectCodeDescError },
      account:              { desc: this.accountDesc, error: this.accountDescError },
      location:             { desc: this.locationDesc, error: this.locationDescError },
      srStandardJobs:       { desc: this.srStandardJobsDesc, error: this.srStandardJobsDescError },
      srSymptom:            { desc: this.srSymptomDesc, error: this.srSymptomDescError },
      srFailCauseCode:      { desc: this.srFailCauseCodeDesc, error: this.srFailCauseCodeDescError },
      srWac:                { desc: this.srWacDesc, error: this.srWacDescError },
    };

    for (const [fieldName, signals] of Object.entries(fieldSignalMap)) {
      this.woForm.get(fieldName)?.valueChanges.subscribe(value => {
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          signals.desc.set('');
          signals.error.set(false);
        }
      });
    }
  }

  private openAssetSearchDialog(): void {
    this._dialogService.open(AssetSearchDialogComponent, undefined, (result?: AssetSearchDialogResult) => {
      if (result?.action === 'go' && result.selectedAsset) {
        const asset = result.selectedAsset;
        this.woForm.get('asset')?.setValue(`(${asset.AssetId}) ${asset.Description}`);
        this.hasAsset.set(true);
        this.woForm.get('messages')?.setValue(this.messagesText);
        this.selectedAssetType.set(asset.Type as 'Fleet' | 'Linear');
        this.meter1Units.set(asset.Meter1Units || '');
        this.meter1Reading.set(asset.Meter1Reading || 0);
        this.meter2Units.set(asset.Meter2Units || '');
        this.meter2Reading.set(asset.Meter2Reading || 0);
        this.loadAssetRelatedData(asset.AssetId);

        // Set asset description from dialog selection
        const assetResult = this.lookupField('asset', asset.AssetId);
        this.assetDesc.set(assetResult.text);
        this.assetDescError.set(assetResult.isError);

        if (asset.Type === 'Linear') {
          this.loadLinearAssetData(asset.AssetId);
        } else {
          // Clear linear data when switching to fleet
          this.linearAssetMarkers.set([]);
          this.linearAssetLength.set(0);
        }
      }
    });
  }

  /** Load marker data for a linear asset by ID. */
  private loadLinearAssetData(assetId: string): void {
    const linearAssets: Record<string, { markers: Marker[]; length: number }> = {
      'ROAD07': {
        markers: [
          { MarkerId: 'ROAD07-01', OffsetFromSegmentStart: 0 },
          { MarkerId: 'ROAD07-02', OffsetFromSegmentStart: 82.5 },
          { MarkerId: 'ROAD07-03', OffsetFromSegmentStart: 165 },
          { MarkerId: 'ROAD07-04', OffsetFromSegmentStart: 247.5 },
          { MarkerId: 'ROAD07-05', OffsetFromSegmentStart: 330 }
        ],
        length: 330
      },
      'UX-BRIDGE-LINEAR': {
        markers: [
          { MarkerId: 'BRG-01', OffsetFromSegmentStart: 0 },
          { MarkerId: 'BRG-02', OffsetFromSegmentStart: 50 },
          { MarkerId: 'BRG-03', OffsetFromSegmentStart: 100 },
          { MarkerId: 'BRG-04', OffsetFromSegmentStart: 150 }
        ],
        length: 150
      },
      'ROAD07-EMPTY': {
        markers: [
          { MarkerId: 'ROAD07-01', OffsetFromSegmentStart: 0 },
          { MarkerId: 'ROAD07-02', OffsetFromSegmentStart: 82.5 },
          { MarkerId: 'ROAD07-03', OffsetFromSegmentStart: 165 },
          { MarkerId: 'ROAD07-04', OffsetFromSegmentStart: 247.5 },
          { MarkerId: 'ROAD07-05', OffsetFromSegmentStart: 330 }
        ],
        length: 330
      }
    };

    const data = linearAssets[assetId];
    if (!data) return;

    this.linearAssetMarkers.set(data.markers);
    this.linearAssetLength.set(data.length);
    this.woForm.get('fromMarker')?.setValue(data.markers[0].MarkerId, { emitEvent: false });
    this.woForm.get('fromOffset')?.setValue('0.0000', { emitEvent: false });
    this.woForm.get('toMarker')?.setValue(data.markers[data.markers.length - 1].MarkerId, { emitEvent: false });
    this.woForm.get('toOffset')?.setValue('0.0000', { emitEvent: false });
    this.woForm.get('fromOffsetSlider')?.setValue(0, { emitEvent: false });
    this.woForm.get('toOffsetSlider')?.setValue(data.length, { emitEvent: false });

    // Set location for the linear asset
    const assetLocations: Record<string, string> = {
      'ROAD07': 'MAIN',
      'UX-BRIDGE-LINEAR': 'EAST',
      'ROAD07-EMPTY': 'MAIN',
    };
    const loc = assetLocations[assetId] || 'MAIN';
    this.woForm.get('location')?.setValue(loc, { emitEvent: false });
    const locResult = this.lookupField('location', loc);
    this.locationDesc.set(locResult.text);
    this.locationDescError.set(locResult.isError);
  }

  /** Load per-asset service requests and services/inspections data. */
  private loadAssetRelatedData(assetId: string): void {
    const defaultServiceRequests = [
      { selected: false, taskId: 'BRK-001', taskDescription: 'Replace brake pads', comment: { hasComment: true, text: 'Front brake pads worn below minimum thickness. Recommend immediate replacement with OEM parts.' }, symptomId: 'SYM-BRK', symptomDescription: 'Squealing noise when braking', enteredDate: '03/15/2023', enteredTime: '10:30 AM', enteredByName: 'John Smith', enteredById: 'TECH001', priorityId: '3', priorityDescription: 'High' },
      { selected: false, taskId: 'OIL-002', taskDescription: 'Oil change and filter', comment: { hasComment: false, text: '' }, symptomId: 'SYM-MNT', symptomDescription: 'Scheduled maintenance', enteredDate: '03/18/2023', enteredTime: '2:15 PM', enteredByName: 'Jane Doe', enteredById: 'TECH002', priorityId: '4', priorityDescription: 'Normal' },
      { selected: false, taskId: 'TRN-003', taskDescription: 'Transmission fluid flush', comment: { hasComment: true, text: 'Transmission fluid dark and burnt. Possible internal wear. Monitor after flush for shifting issues.' }, symptomId: 'SYM-TRN', symptomDescription: 'Hard shifting', enteredDate: '03/19/2023', enteredTime: '9:00 AM', enteredByName: 'Mike Brown', enteredById: 'TECH003', priorityId: '2', priorityDescription: 'Urgent' },
      { selected: false, taskId: 'ENG-004', taskDescription: 'Diagnose engine misfire', comment: { hasComment: false, text: '' }, symptomId: 'SYM-ENG', symptomDescription: 'Check engine light', enteredDate: '03/20/2023', enteredTime: '11:45 AM', enteredByName: 'John Smith', enteredById: 'TECH001', priorityId: '3', priorityDescription: 'High' }
    ];

    const defaultServicesInspections = [
      { addToWorkOrder: false, serviceId: 'PMS1', serviceDescription: 'PM SERVICE 1', reasonId: 'RPR-001', reasonDescription: 'Scheduled PM overdue', dateDue: '04/30/2025', daysUntilDue: 'LATE', daysLate: 337, meter1UntilDue: '(10100)', meter2UntilDue: 0 },
      { addToWorkOrder: false, serviceId: 'QA-PM-A', serviceDescription: 'QA PM SERVICE A', reasonId: 'RPR-002', reasonDescription: 'Meter threshold exceeded', dateDue: '04/30/2025', daysUntilDue: 'LATE', daysLate: 337, meter1UntilDue: '(10100)', meter2UntilDue: 0 }
    ];

    // Assets with no service requests (empty table → shows overlap checkbox for linear)
    const emptyServiceRequestAssets = ['QA-C-001', 'ROAD07-EMPTY'];
    // Assets with no services/inspections due (empty PM table)
    const emptyServicesInspectionsAssets = ['QA-FLEET-002', 'FL-VAN-03-CLEAN'];

    this.serviceRequestData.set(emptyServiceRequestAssets.includes(assetId) ? [] : defaultServiceRequests);
    this.servicesInspectionsData.set(emptyServicesInspectionsAssets.includes(assetId) ? [] : defaultServicesInspections);
  }

  /** Block non-numeric keys on meter inputs (allow digits, decimal, backspace, tab, arrows). */
  onMeterKeydown(event: KeyboardEvent): void {
    const allowed = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Delete', 'Home', 'End'];
    if (allowed.includes(event.key)) return;
    if (event.key === '.' && !(event.target as HTMLInputElement).value.includes('.')) return;
    if (event.key >= '0' && event.key <= '9') return;
    event.preventDefault();
  }

  /** Enforce max 2 decimal places on meter inputs. */
  onMeterInput(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    let val = input.value;
    // Remove anything that's not a digit or decimal
    val = val.replace(/[^0-9.]/g, '');
    // Only allow one decimal point
    const parts = val.split('.');
    if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');
    // Limit to 2 decimal places
    if (parts.length === 2 && parts[1].length > 2) val = parts[0] + '.' + parts[1].substring(0, 2);
    if (val !== input.value) {
      this.woForm.get(controlName)?.setValue(val, { emitEvent: false });
    }
  }

  /** Handle search input on the Existing Service Requests table. */
  srSearchControl = new FormControl('');
  srSearchValue = '';
  onServiceRequestSearch(event: any): void {
    const value = typeof event === 'string' ? event : '';
    console.log('SR Search:', value);
    this.srSearchValue = value;
    this.srSearchQuery.set(value);
  }

  /** Retrieve overlapping service requests for the current linear asset position. */
  retrieveOverlappingServiceRequests(): void {
    if (!this.hasAsset() || !this.isLinearAsset()) return;

    // Mock overlapping SRs that would come from the API
    this.serviceRequestData.set([
      { selected: false, taskId: 'SR-LIN-001', taskDescription: 'Pothole repair - marker 2 to 3', comment: { hasComment: true, text: 'Large pothole near marker ROAD07-02. Reported by maintenance crew.' }, symptomId: 'SYM-RD', symptomDescription: 'Road surface damage', enteredDate: '02/10/2026', enteredTime: '8:30 AM', enteredByName: 'John Smith', enteredById: 'TECH001', priorityId: '2', priorityDescription: 'Urgent' },
      { selected: false, taskId: 'SR-LIN-002', taskDescription: 'Guard rail replacement', comment: { hasComment: false, text: '' }, symptomId: 'SYM-GR', symptomDescription: 'Damaged guard rail', enteredDate: '02/15/2026', enteredTime: '10:00 AM', enteredByName: 'Jane Doe', enteredById: 'TECH002', priorityId: '3', priorityDescription: 'High' },
      { selected: false, taskId: 'SR-LIN-003', taskDescription: 'Line marking refresh', comment: { hasComment: false, text: '' }, symptomId: 'SYM-LM', symptomDescription: 'Faded lane markings', enteredDate: '03/01/2026', enteredTime: '2:15 PM', enteredByName: 'Mike Brown', enteredById: 'TECH003', priorityId: '4', priorityDescription: 'Normal' }
    ]);
  }

  /** Open the Service Request detail dialog for a given task ID. */
  onViewServiceRequest(taskId: string): void {
    const srData = this.serviceRequestData().find(sr => sr.taskId === taskId);
    if (!srData) return;

    this._dialogService.open(ServiceRequestDialogComponent, {
      taskId: srData.taskId,
      taskDescription: srData.taskDescription,
      symptomId: srData.symptomId,
      symptomDescription: srData.symptomDescription,
      enteredDate: srData.enteredDate,
      enteredTime: srData.enteredTime,
      enteredByName: srData.enteredByName,
      priorityId: srData.priorityId,
      priorityDescription: srData.priorityDescription,
    }, (result?: any) => {
      if (result?.action === 'select') {
        // Add the row to selectedCheckboxRows so the Assign checkbox gets checked
        const row = this.serviceRequestData().find(r => r.taskId === result.taskId);
        if (row) {
          this.selectedServiceRequests.update(current => [...current, row]);
        }
      }
    });
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

  /** Restrict date input to digits and forward slash. */
  public onDateKeydown(event: KeyboardEvent): void {
    const navigationKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End'];
    if (navigationKeys.includes(event.key)) return;
    if (/^[0-9/]$/.test(event.key)) return;
    event.preventDefault();
  }

  /** Restrict time input based on active time format. */
  public onTimeKeydown(event: KeyboardEvent): void {
    const navigationKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End'];
    if (navigationKeys.includes(event.key)) return;
    if (this.timeFormat() === '24h') {
      if (/^[0-9:]$/.test(event.key)) return;
    } else {
      if (/^[0-9:AaMmPp ]$/.test(event.key)) return;
    }
    event.preventDefault();
  }

  /** Validate date string on blur. Returns error message or null. */
  public validateDate(value: string): string | null {
    if (!value || value.trim() === '') return null;
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return 'Invalid date format. Use MM/DD/YYYY';
    const [monthStr, dayStr, yearStr] = value.split('/');
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);
    const year = parseInt(yearStr, 10);
    if (month < 1 || month > 12) return 'Invalid date';
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) return 'Invalid date';
    return null;
  }

  /** Validate time string on blur based on format. Returns error message or null. */
  public validateTime(value: string, format: '12h' | '24h'): string | null {
    if (!value || value.trim() === '') return null;
    if (format === '12h') {
      if (!/^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM|am|pm)$/.test(value)) {
        return 'Invalid time. Use HH:MM AM/PM (1-12)';
      }
    } else {
      if (!/^([01]?\d|2[0-3]):[0-5]\d$/.test(value)) {
        return 'Invalid time. Use HH:MM (0-23)';
      }
    }
    return null;
  }

  /** Attach keydown and blur listeners to the internal date and time inputs of a date-time picker. */
  private attachInputListeners(picker: AwDateTimePickerComponent, prefix: 'dateTimeIn' | 'dateTimeDue'): void {
    if (!picker) return;
    const dateInput = (picker as any).dateInput?.nativeElement;
    const timeInput = (picker as any).timeInput?.nativeElement;
    if (dateInput) {
      dateInput.addEventListener('keydown', (e: KeyboardEvent) => this.onDateKeydown(e));
      dateInput.addEventListener('blur', (e: Event) => {
        const input = (e.target as HTMLInputElement);
        const value = input.value.trim();
        if (value) {
          const error = this.validateDate(value);
          if (error) {
            // Clear garbage input — reset to CCL's committed display value
            input.value = (picker as any).getDateDisplayValue?.() ?? '';
          }
          if (prefix === 'dateTimeIn') this.dateTimeInDateError.set(error);
          else this.dateTimeDueDateError.set(error);
        } else {
          if (prefix === 'dateTimeIn') this.dateTimeInDateError.set(null);
          else this.dateTimeDueDateError.set(null);
        }
        this._cdr.markForCheck();
      });
    }
    if (timeInput) {
      timeInput.addEventListener('keydown', (e: KeyboardEvent) => this.onTimeKeydown(e));
      timeInput.addEventListener('blur', (e: Event) => {
        const input = (e.target as HTMLInputElement);
        const value = input.value.trim();
        if (value) {
          const error = this.validateTime(value, this.timeFormat());
          if (error) {
            // Clear garbage input — reset to CCL's committed display value
            input.value = (picker as any).getTimeDisplayValue?.() ?? '';
          }
          if (prefix === 'dateTimeIn') this.dateTimeInTimeError.set(error);
          else this.dateTimeDueTimeError.set(error);
        } else {
          if (prefix === 'dateTimeIn') this.dateTimeInTimeError.set(null);
          else this.dateTimeDueTimeError.set(null);
        }
        this._cdr.markForCheck();
      });
    }
  }
}
