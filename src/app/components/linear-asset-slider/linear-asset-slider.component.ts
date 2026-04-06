import { Component, ChangeDetectionStrategy, input, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  AwFormFieldComponent,
  AwFormFieldLabelComponent,
  AwInputDirective,
} from '@assetworks-llc/aw-component-lib';
import { Marker } from '../../pages/new-work-order/linear-asset.interface';

/** Direction type for from/to handle tracking. */
export type SliderDirection = 'from' | 'to';

/**
 * Dual-handle linear asset range slider with bidirectional marker/offset sync.
 *
 * Uses native `<input type="range">` (no Angular Material in harness).
 * Receives marker data and a FormGroup sub-group containing from/to controls.
 */
@Component({
  selector: 'app-linear-asset-slider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AwFormFieldComponent,
    AwFormFieldLabelComponent,
    AwInputDirective,
  ],
  templateUrl: './linear-asset-slider.component.html',
  styleUrl: './linear-asset-slider.component.scss',
})
export class LinearAssetSliderComponent {
  /** Array of markers with IDs and offsets along the linear asset. */
  readonly markers = input<Marker[]>([]);

  /** Total length of the linear asset. */
  readonly assetLength = input<number>(0);

  /** FormGroup sub-group with from/to marker/offset controls. */
  readonly formGroup = input<FormGroup>(new FormGroup({}));

  /** Whether the slider is interactive. */
  readonly allowEditing = input<boolean>(true);

  /** Tracks which handle was last selected. */
  readonly lastSelectedHandle = signal<SliderDirection>('from');

  /** Selected length computed from slider positions. */
  readonly selectedLength = signal<number>(0);

  /** Marker label positions as percentages for the axis row. */
  readonly markerPositions = computed(() => {
    const length = this.assetLength();
    const mkrs = this.markers();
    if (!length || !mkrs.length) return [];
    return mkrs.map((m) => ({
      marker: m,
      percent: (m.OffsetFromSegmentStart / length) * 100,
    }));
  });

  /** Width percentages for each marker label wrapper (cumulative difference). */
  readonly markerWidthPercentages = computed(() => {
    const positions = this.markerPositions();
    const widths: number[] = [];
    let total = 0;
    for (const pos of positions) {
      const width = pos.percent - total;
      widths.push(width);
      total += width;
    }
    return widths;
  });

  constructor() {
    // Sync slider value changes → marker/offset fields
    effect(() => {
      const fg = this.formGroup();
      const mkrs = this.markers();
      const length = this.assetLength();
      if (!fg || !mkrs.length || !length) return;

      const fromSlider = fg.get('fromOffsetSlider');
      const toSlider = fg.get('toOffsetSlider');

      fromSlider?.valueChanges.subscribe((val: number) => {
        this.onSliderChange(val, 'from');
      });

      toSlider?.valueChanges.subscribe((val: number) => {
        this.onSliderChange(val, 'to');
      });
    });
  }

  /** Handle slider input event for a given direction. */
  onSliderInput(event: Event, direction: SliderDirection): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    const fg = this.formGroup();
    const length = this.assetLength();
    const mkrs = this.markers();

    // Constrain from ≤ to
    if (direction === 'from') {
      const toVal = fg.get('toOffsetSlider')?.value ?? length;
      const constrained = Math.min(value, toVal);
      fg.get('fromOffsetSlider')?.setValue(constrained, { emitEvent: false });
      this.updateMarkersAndOffsets(constrained, 'from');
    } else {
      const fromVal = fg.get('fromOffsetSlider')?.value ?? 0;
      const constrained = Math.max(value, fromVal);
      fg.get('toOffsetSlider')?.setValue(constrained, { emitEvent: false });
      this.updateMarkersAndOffsets(constrained, 'to');
    }

    this.lastSelectedHandle.set(direction);
    this.recalculateSelectedLength();
  }

  /** Update marker and offset fields from a slider position value. */
  private updateMarkersAndOffsets(val: number, direction: SliderDirection): void {
    const fg = this.formGroup();
    const mkrs = this.markers();
    const length = this.assetLength();

    if (direction === 'from' && val === length) {
      // From slider at max → first marker, offset = assetLength
      fg.get('fromMarker')?.setValue(mkrs[0]?.MarkerId ?? '', { emitEvent: false });
      fg.get('fromOffset')?.setValue(this.formatOffset(length), { emitEvent: false });
      return;
    }

    if (direction === 'to' && val === length) {
      // To slider at max → last marker, offset = 0
      fg.get('toMarker')?.setValue(mkrs[mkrs.length - 1]?.MarkerId ?? '', { emitEvent: false });
      fg.get('toOffset')?.setValue('0.0000', { emitEvent: false });
      return;
    }

    // Find nearest marker whose offset ≤ val
    let nearestMarker = mkrs[0];
    for (const marker of mkrs) {
      if (val >= marker.OffsetFromSegmentStart) {
        nearestMarker = marker;
      }
    }

    const offset = val - nearestMarker.OffsetFromSegmentStart;
    fg.get(direction + 'Marker')?.setValue(nearestMarker.MarkerId, { emitEvent: false });
    fg.get(direction + 'Offset')?.setValue(this.formatOffset(offset), { emitEvent: false });
  }

  /** Handle slider valueChanges subscription (from effect). */
  private onSliderChange(val: number, direction: SliderDirection): void {
    this.updateMarkersAndOffsets(val, direction);
    this.recalculateSelectedLength();
  }

  /** On marker/offset field blur → update slider handle position. */
  onOffsetBlur(direction: SliderDirection): void {
    const fg = this.formGroup();
    const mkrs = this.markers();
    const offsetStr = fg.get(direction + 'Offset')?.value;
    const markerId = fg.get(direction + 'Marker')?.value;

    const marker = mkrs.find((m) => m.MarkerId === markerId);
    if (!marker) return;

    const offsetVal = parseFloat(offsetStr) || 0;
    const newPosition = marker.OffsetFromSegmentStart + offsetVal;

    fg.get(direction + 'OffsetSlider')?.setValue(newPosition, { emitEvent: false });

    // Format the offset field
    fg.get(direction + 'Offset')?.setValue(this.formatOffset(offsetVal), { emitEvent: false });

    this.recalculateSelectedLength();
  }

  /** On marker label click → move last-selected handle to that marker's position. */
  onMarkerClick(marker: Marker): void {
    if (!this.allowEditing()) return;

    const direction = this.lastSelectedHandle();
    const fg = this.formGroup();
    const mkrs = this.markers();

    // Constrain: if moving from past to, snap to to position (and vice versa)
    const markerIdx = mkrs.findIndex((m) => m.MarkerId === marker.MarkerId);

    if (direction === 'from') {
      const toMarkerId = fg.get('toMarker')?.value;
      const toIdx = mkrs.findIndex((m) => m.MarkerId === toMarkerId);
      if (toIdx >= 0 && markerIdx > toIdx) {
        marker = mkrs[toIdx];
      }
    } else {
      const fromMarkerId = fg.get('fromMarker')?.value;
      const fromIdx = mkrs.findIndex((m) => m.MarkerId === fromMarkerId);
      if (fromIdx >= 0 && markerIdx < fromIdx) {
        marker = mkrs[fromIdx];
      }
    }

    fg.get(direction + 'Marker')?.setValue(marker.MarkerId, { emitEvent: false });
    fg.get(direction + 'Offset')?.setValue('0.0000', { emitEvent: false });
    fg.get(direction + 'OffsetSlider')?.setValue(marker.OffsetFromSegmentStart, { emitEvent: false });

    this.recalculateSelectedLength();
  }

  /** Track which handle was clicked. */
  onHandleClick(direction: SliderDirection): void {
    this.lastSelectedHandle.set(direction);
  }

  /** Recalculate selected length from current slider positions. */
  private recalculateSelectedLength(): void {
    const fg = this.formGroup();
    const fromVal = fg.get('fromOffsetSlider')?.value ?? 0;
    const toVal = fg.get('toOffsetSlider')?.value ?? 0;
    this.selectedLength.set(parseFloat((toVal - fromVal).toFixed(4)));
  }

  /**
   * Format a number to exactly 4 decimal places.
   * Non-numeric or negative values return "0.0000".
   */
  formatOffset(value: number | string): string {
    const parsed = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(parsed) || parsed < 0) return '0.0000';
    return parsed.toFixed(4);
  }

  /** Get the colored range style for the slider track. */
  get sliderTrackStyle(): string {
    const length = this.assetLength();
    if (!length) return '';
    const fg = this.formGroup();
    const fromVal = fg.get('fromOffsetSlider')?.value ?? 0;
    const toVal = fg.get('toOffsetSlider')?.value ?? length;
    const fromPct = (fromVal / length) * 100;
    const toPct = (toVal / length) * 100;
    return `linear-gradient(to right, var(--system-surfaces-surfaces-background) ${fromPct}%, var(--component-scrollbar-general-use-bar-fill) ${fromPct}%, var(--component-scrollbar-general-use-bar-fill) ${toPct}%, var(--system-surfaces-surfaces-background) ${toPct}%)`;
  }
}
