import { AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy, Component, signal, computed, inject, ViewChild } from '@angular/core';
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
  AwToggleComponent,
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
    AwToggleComponent,
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

  private readonly _dialogService = inject(DialogService);
  private readonly _cdr = inject(ChangeDetectorRef);

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
    vendor: new FormControl(''),
    technician: new FormControl('(LOGGED in TECH ID) Tech Name'),
    contactName: new FormControl('Jane Doe'),
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
    partSuffix: new FormControl<SingleSelectOption | null>(null),
    restockLocation: new FormControl<SingleSelectOption | null>(null),
    quantityRequired: new FormControl(''),
    fabricationNoCore: new FormControl(false),
    // Linear Asset fields
    location: new FormControl<SingleSelectOption | null>(null),
    equipmentId: new FormControl(''),
    fromMarker: new FormControl(''),
    fromOffset: new FormControl('0.0000'),
    toMarker: new FormControl(''),
    toOffset: new FormControl('0.0000'),
    fromOffsetSlider: new FormControl(0),
    toOffsetSlider: new FormControl(0),
    pmService: new FormControl(''),
    overlapServiceRequests: new FormControl(false)
  });

  jobTypeOptions: SingleSelectOption[] = [
    { label: 'Repair', value: 'REPAIR' },
    { label: 'PM', value: 'PM' },
    { label: 'Part Rebuild', value: 'PART_REBUILD' }
  ];

  validationOptions: SingleSelectOption[] = [
    { label: 'Update the ticket record', value: 'UPDATE_TICKET' },
    { label: 'Update transaction only', value: 'UPDATE_TRANSACTION' },
    { label: 'Update transaction only on fail', value: 'UPDATE_TRANSACTION_FAIL' }
  ];

  warrantyWorkOptions: SingleSelectOption[] = [
    { label: 'No', value: 'NO' },
    { label: 'Yes', value: 'YES' },
    { label: 'Pending', value: 'PENDING' }
  ];

  partSuffixOptions: SingleSelectOption[] = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' }
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

  serviceRequestData = signal([
    { selected: false, taskId: 'BRK-001', taskDescription: 'Replace brake pads', comment: { hasComment: true, text: 'Front brake pads worn below minimum thickness. Recommend immediate replacement with OEM parts.' }, symptomId: 'SYM-BRK', symptomDescription: 'Squealing noise when braking', enteredDate: '03/15/2023', enteredTime: '10:30 AM', enteredByName: 'John Smith', enteredById: 'TECH001', priorityId: '3', priorityDescription: 'High', searchAction: '' },
    { selected: false, taskId: 'OIL-002', taskDescription: 'Oil change and filter', comment: { hasComment: false, text: '' }, symptomId: 'SYM-MNT', symptomDescription: 'Scheduled maintenance', enteredDate: '03/18/2023', enteredTime: '2:15 PM', enteredByName: 'Jane Doe', enteredById: 'TECH002', priorityId: '4', priorityDescription: 'Normal', searchAction: '' },
    { selected: false, taskId: 'TRN-003', taskDescription: 'Transmission fluid flush', comment: { hasComment: true, text: 'Transmission fluid dark and burnt. Possible internal wear. Monitor after flush for shifting issues.' }, symptomId: 'SYM-TRN', symptomDescription: 'Hard shifting', enteredDate: '03/19/2023', enteredTime: '9:00 AM', enteredByName: 'Mike Brown', enteredById: 'TECH003', priorityId: '2', priorityDescription: 'Urgent', searchAction: '' },
    { selected: false, taskId: 'ENG-004', taskDescription: 'Diagnose engine misfire', comment: { hasComment: false, text: '' }, symptomId: 'SYM-ENG', symptomDescription: 'Check engine light', enteredDate: '03/20/2023', enteredTime: '11:45 AM', enteredByName: 'John Smith', enteredById: 'TECH001', priorityId: '3', priorityDescription: 'High', searchAction: '' }
  ]);

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
    return [{ textCallback: { title: 'Cancel', action: () => console.log('Cancel') } }];
  }

  get actionRight(): ActionBarRight[] {
    return [{ buttonCallback: { label: 'Save', buttonType: 'outlined', action: () => console.log('Save', this.woForm.value) } }];
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
  }

  onLookup(field: string): void {
    if (field === 'asset') {
      this.openAssetSearchDialog();
      return;
    }
    console.log('Lookup:', field);
  }

  /** Update the 24-hour format signal when the toggle is changed. */
  onTimeFormatToggle(value: boolean): void {
    this.use24HourFormat.set(value);
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
  }

  /** Load per-asset service requests and services/inspections data. */
  private loadAssetRelatedData(assetId: string): void {
    const defaultServiceRequests = [
      { selected: false, taskId: 'BRK-001', taskDescription: 'Replace brake pads', comment: { hasComment: true, text: 'Front brake pads worn below minimum thickness. Recommend immediate replacement with OEM parts.' }, symptomId: 'SYM-BRK', symptomDescription: 'Squealing noise when braking', enteredDate: '03/15/2023', enteredTime: '10:30 AM', enteredByName: 'John Smith', enteredById: 'TECH001', priorityId: '3', priorityDescription: 'High', searchAction: '' },
      { selected: false, taskId: 'OIL-002', taskDescription: 'Oil change and filter', comment: { hasComment: false, text: '' }, symptomId: 'SYM-MNT', symptomDescription: 'Scheduled maintenance', enteredDate: '03/18/2023', enteredTime: '2:15 PM', enteredByName: 'Jane Doe', enteredById: 'TECH002', priorityId: '4', priorityDescription: 'Normal', searchAction: '' },
      { selected: false, taskId: 'TRN-003', taskDescription: 'Transmission fluid flush', comment: { hasComment: true, text: 'Transmission fluid dark and burnt. Possible internal wear. Monitor after flush for shifting issues.' }, symptomId: 'SYM-TRN', symptomDescription: 'Hard shifting', enteredDate: '03/19/2023', enteredTime: '9:00 AM', enteredByName: 'Mike Brown', enteredById: 'TECH003', priorityId: '2', priorityDescription: 'Urgent', searchAction: '' },
      { selected: false, taskId: 'ENG-004', taskDescription: 'Diagnose engine misfire', comment: { hasComment: false, text: '' }, symptomId: 'SYM-ENG', symptomDescription: 'Check engine light', enteredDate: '03/20/2023', enteredTime: '11:45 AM', enteredByName: 'John Smith', enteredById: 'TECH001', priorityId: '3', priorityDescription: 'High', searchAction: '' }
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
  onServiceRequestSearch(query: string): void {
    // In a real app this would filter via API — here we just log it
    console.log('Service request search:', query);
  }

  /** Retrieve overlapping service requests for the current linear asset position. */
  retrieveOverlappingServiceRequests(): void {
    if (!this.hasAsset() || !this.isLinearAsset()) return;

    // Mock overlapping SRs that would come from the API
    this.serviceRequestData.set([
      { selected: false, taskId: 'SR-LIN-001', taskDescription: 'Pothole repair - marker 2 to 3', comment: { hasComment: true, text: 'Large pothole near marker ROAD07-02. Reported by maintenance crew.' }, symptomId: 'SYM-RD', symptomDescription: 'Road surface damage', enteredDate: '02/10/2026', enteredTime: '8:30 AM', enteredByName: 'John Smith', enteredById: 'TECH001', priorityId: '2', priorityDescription: 'Urgent', searchAction: '' },
      { selected: false, taskId: 'SR-LIN-002', taskDescription: 'Guard rail replacement', comment: { hasComment: false, text: '' }, symptomId: 'SYM-GR', symptomDescription: 'Damaged guard rail', enteredDate: '02/15/2026', enteredTime: '10:00 AM', enteredByName: 'Jane Doe', enteredById: 'TECH002', priorityId: '3', priorityDescription: 'High', searchAction: '' },
      { selected: false, taskId: 'SR-LIN-003', taskDescription: 'Line marking refresh', comment: { hasComment: false, text: '' }, symptomId: 'SYM-LM', symptomDescription: 'Faded lane markings', enteredDate: '03/01/2026', enteredTime: '2:15 PM', enteredByName: 'Mike Brown', enteredById: 'TECH003', priorityId: '4', priorityDescription: 'Normal', searchAction: '' }
    ]);
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
