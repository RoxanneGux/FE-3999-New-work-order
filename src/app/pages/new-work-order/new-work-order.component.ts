import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
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
  AwCheckboxComponent,
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
    AwInputDirective,
    AwSelectMenuComponent,
    AwButtonDirective,
    AwButtonIconOnlyDirective,
    AwIconComponent,
    AwTableComponent,
    AwCheckboxComponent,
    TaskCommentsDrawerComponent,
    MockMapComponent,
    LinearAssetSliderComponent
  ],
  templateUrl: './new-work-order.component.html',
  styleUrl: './new-work-order.component.scss'
})
export class NewWorkOrderComponent {
  private readonly _dialogService = inject(DialogService);

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
  isLinearAsset = computed(() => this.selectedAssetType() === 'Linear' && !this.isPartRebuild());
  isPMLinear = computed(() => this.isPM() && this.isLinearAsset());
  showAssetField = computed(() => !this.isPartRebuild());
  showMeters = computed(() => !this.isPartRebuild() && !this.isLinearAsset());
  showWorkPosition = computed(() => !this.isPartRebuild() && !this.isLinearAsset());
  showRepairReason = computed(() => !this.isPartRebuild());

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
  }

  onLookup(field: string): void {
    if (field === 'asset') {
      this.openAssetSearchDialog();
      return;
    }
    console.log('Lookup:', field);
  }

  private openAssetSearchDialog(): void {
    this._dialogService.open(AssetSearchDialogComponent, undefined, (result?: AssetSearchDialogResult) => {
      if (result?.action === 'go' && result.selectedAsset) {
        const asset = result.selectedAsset;
        this.woForm.get('asset')?.setValue(`(${asset.AssetId}) ${asset.Description}`);
        this.selectedAssetType.set(asset.Type as 'Fleet' | 'Linear');

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
