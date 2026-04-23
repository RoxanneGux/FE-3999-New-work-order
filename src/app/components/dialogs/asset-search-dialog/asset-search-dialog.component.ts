import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AwDialogComponent,
  DialogOptions,
  DialogVariants,
  TableCellInput,
  TableCellTypes,
} from '@assetworks-llc/aw-component-lib';
import { BaseDialogComponent } from '../base-dialog.component';

/** Mock asset row for the search dialog table. */
export interface MockAssetRow {
  AssetId: string;
  Description: string;
  Location: string;
  Status: string;
  Type: string;
  Meter1Units: string;
  Meter1Reading: number;
  Meter2Units: string;
  Meter2Reading: number;
}

/** Result emitted when the dialog closes. */
export interface AssetSearchDialogResult {
  selectedAsset: MockAssetRow | null;
  action: 'go' | 'cancel';
}

@Component({
  selector: 'app-asset-search-dialog',
  standalone: true,
  imports: [CommonModule, AwDialogComponent],
  templateUrl: './asset-search-dialog.component.html',
  styleUrl: './asset-search-dialog.component.scss',
})
export class AssetSearchDialogComponent extends BaseDialogComponent {

  /** All mock assets — fleet + linear combined, sorted by Asset ID A→Z. */
  readonly tableData = computed(() => [
    { AssetId: 'FL-VAN-03', Description: 'FLEET VAN 03', Location: 'SOUTH', Status: 'Active', Type: 'Fleet', Meter1Units: 'miles', Meter1Reading: 55000, Meter2Units: 'hours', Meter2Reading: 800 },
    { AssetId: 'FL-VAN-03-CLEAN', Description: 'FLEET VAN 03 - NO PM DUE', Location: 'SOUTH', Status: 'Active', Type: 'Fleet', Meter1Units: 'miles', Meter1Reading: 55000, Meter2Units: '', Meter2Reading: 0 },
    { AssetId: 'K123-456', Description: 'SERIES 50 DETROIT DIESEL GAS ENGINE', Location: 'SHOP-A', Status: 'In Service', Type: 'Fleet', Meter1Units: 'hours', Meter1Reading: 12500, Meter2Units: '', Meter2Reading: 0 },
    { AssetId: 'QA-C-001', Description: 'CARGO VAN 2500', Location: 'MAIN', Status: 'Active', Type: 'Fleet', Meter1Units: 'miles', Meter1Reading: 92340, Meter2Units: '', Meter2Reading: 0 },
    { AssetId: 'QA-FLEET-002', Description: 'QA FLEET TRUCK 002', Location: 'NORTH', Status: 'Active', Type: 'Fleet', Meter1Units: 'miles', Meter1Reading: 78100, Meter2Units: 'hours', Meter2Reading: 1200 },
    { AssetId: 'R-12345', Description: 'MOTOR POOL SEDAN', Location: 'MAIN', Status: 'Active', Type: 'Fleet', Meter1Units: 'miles', Meter1Reading: 45230, Meter2Units: 'miles', Meter2Reading: 0 },
    { AssetId: 'ROAD07', Description: 'HIGHWAY 07 - MAIN CORRIDOR', Location: 'MAIN', Status: 'Active', Type: 'Linear', Meter1Units: '', Meter1Reading: 0, Meter2Units: '', Meter2Reading: 0 },
    { AssetId: 'ROAD07-EMPTY', Description: 'HIGHWAY 07 - NO SERVICE REQUESTS', Location: 'MAIN', Status: 'Active', Type: 'Linear', Meter1Units: '', Meter1Reading: 0, Meter2Units: '', Meter2Reading: 0 },
    { AssetId: 'TX-TRUCK-07', Description: 'PICKUP TRUCK F-150', Location: 'EAST', Status: 'Active', Type: 'Fleet', Meter1Units: 'miles', Meter1Reading: 34500, Meter2Units: '', Meter2Reading: 0 },
    { AssetId: 'UX-BRIDGE-LINEAR', Description: 'UX TEST BRIDGE - LINEAR ASSET', Location: 'NORTH', Status: 'Active', Type: 'Linear', Meter1Units: '', Meter1Reading: 0, Meter2Units: '', Meter2Reading: 0 },
  ]);

  readonly columnsDefinition: TableCellInput[] = [
    {
      type: TableCellTypes.Custom, key: 'AssetId', label: 'Asset', sort: true, align: 'left',
      combineFields: ['AssetId', 'Description'],
      combineTemplate: (data: any[]) => ({
        template: `<div><span class="aw-b-1">${data[0] || ''}</span><br><span class="aw-c-1">${data[1] || ''}</span></div>`,
      }),
    },
    { type: TableCellTypes.Title, key: 'Type', label: 'Type', sort: true, align: 'left' },
    { type: TableCellTypes.Title, key: 'Location', label: 'Location', sort: true, align: 'left' },
    { type: TableCellTypes.Title, key: 'Status', label: 'Status', sort: true, align: 'left' },
  ];

  readonly dialogOptions = computed<DialogOptions>(() => ({
    variant: DialogVariants.TABLE,
    title: 'Search Assets',
    primaryButtonLabel: 'Select',
    secondaryButtonLabel: 'Cancel',
    enableSearch: true,
    additionalActions: [
      {
        label: 'Advanced Search',
        ariaLabel: 'Open Advanced Asset Search',
        action: () => alert('This would open the Advanced Asset Search slide-in service.'),
      },
    ],
  }));

  onSelect(event: any): void {
    if (event?.row) {
      this.close.emit({ selectedAsset: event.row, action: 'go' } as AssetSearchDialogResult);
    }
  }

  onCancel(): void {
    this.close.emit({ selectedAsset: null, action: 'cancel' } as AssetSearchDialogResult);
  }
}
