import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AwDialogComponent,
  AwButtonDirective,
  AwIconComponent,
  DialogOptions,
} from '@assetworks-llc/aw-component-lib';
import { BaseDialogComponent } from '../base-dialog.component';

@Component({
  selector: 'app-service-request-dialog',
  standalone: true,
  imports: [CommonModule, AwDialogComponent, AwButtonDirective, AwIconComponent],
  template: `
    <aw-dialog
      [ariaLabel]="'Service Request'"
      [visible]="true"
      [dialogOptions]="dialogOptions"
      (primaryAction)="onSelect()"
      (secondaryAction)="onClose()">
      <div dialog-top class="sr-detail-content">
        <div class="sr-detail-row">
          <span class="sr-label">Asset ID</span>
          <span class="sr-value">{{ assetId }}</span>
        </div>
        <div class="sr-detail-row">
          <span class="sr-label">Station Location</span>
          <span class="sr-value">{{ stationLocation }}</span>
        </div>
        <div class="sr-detail-row">
          <span class="sr-label">Repair Location</span>
          <span class="sr-value">{{ repairLocation }}</span>
        </div>
        <div class="sr-detail-row">
          <span class="sr-label">Service Request ID</span>
          <span class="sr-value sr-link">{{ serviceRequestId }}</span>
        </div>
        <div class="sr-detail-row">
          <span class="sr-label">Task</span>
          <span class="sr-value">{{ taskId }} — {{ taskDescription }}</span>
        </div>
        <div class="sr-detail-row">
          <span class="sr-label">Symptom</span>
          <span class="sr-value">{{ symptomId }} — {{ symptomDescription }}</span>
        </div>
        <div class="sr-detail-row">
          <span class="sr-label">Entered</span>
          <span class="sr-value">{{ enteredDate }} {{ enteredTime }} by {{ enteredByName }}</span>
        </div>
        <div class="sr-detail-row">
          <span class="sr-label">Priority</span>
          <span class="sr-value">{{ priorityId }} — {{ priorityDescription }}</span>
        </div>
      </div>
    </aw-dialog>

    @if (showNavigateAwayAlert()) {
      <aw-dialog
        [ariaLabel]="'Navigate Away Warning'"
        [visible]="true"
        [dialogOptions]="navigateAwayOptions"
        (primaryAction)="onConfirmNavigateAway()"
        (secondaryAction)="onCancelNavigateAway()">
      </aw-dialog>
    }
  `,
  styles: [`
    .sr-detail-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px 0;
    }
    .sr-detail-row {
      display: flex;
      gap: 16px;
    }
    .sr-label {
      min-width: 140px;
      color: var(--system-text-text-secondary);
      font-size: 14px;
    }
    .sr-value {
      color: var(--system-text-text-primary);
      font-size: 14px;
      font-weight: 500;
    }
    .sr-link {
      color: var(--system-links-link-active);
    }
  `]
})
export class ServiceRequestDialogComponent extends BaseDialogComponent {
  // Properties set by DialogService via Object.assign
  taskId = '';
  taskDescription = '';
  symptomId = '';
  symptomDescription = '';
  enteredDate = '';
  enteredTime = '';
  enteredByName = '';
  priorityId = '';
  priorityDescription = '';

  // Mock data for fields not in the table row
  assetId = '(R-12345) MOTOR POOL SEDAN';
  stationLocation = 'MAIN - Main Shop';
  repairLocation = 'MAIN - Main Shop';
  serviceRequestId = '';

  showNavigateAwayAlert = signal(false);
  private _pendingNavAction = '';

  dialogOptions: DialogOptions = {
    variant: 'standard',
    title: 'Service Request',
    primaryButtonLabel: 'Select',
    secondaryButtonLabel: 'Cancel',
    additionalActions: [
      {
        label: 'Manage Service Request',
        ariaLabel: 'Navigate to Manage Service Request page',
        action: () => this.onManageServiceRequest(),
      },
      {
        label: 'Create New Service Request',
        ariaLabel: 'Navigate to Create New Service Request page',
        action: () => this.onCreateNewServiceRequest(),
      },
    ],
  };

  navigateAwayOptions: DialogOptions = {
    variant: 'alert',
    title: 'Unsaved Changes',
    description: 'You will lose unsaved changes. Proceed?',
    primaryButtonLabel: 'Yes',
    secondaryButtonLabel: 'No',
  };

  ngOnInit(): void {
    this.serviceRequestId = this.taskId ? `SR-${this.taskId}` : 'SR-UNKNOWN';
  }

  onSelect(): void {
    this.close.emit({ action: 'select', taskId: this.taskId });
  }

  onClose(): void {
    this.close.emit(null);
  }

  onManageServiceRequest(): void {
    this._pendingNavAction = 'manage';
    this.showNavigateAwayAlert.set(true);
  }

  onCreateNewServiceRequest(): void {
    this._pendingNavAction = 'create';
    this.showNavigateAwayAlert.set(true);
  }

  onConfirmNavigateAway(): void {
    this.showNavigateAwayAlert.set(false);
    if (this._pendingNavAction === 'manage') {
      alert('This would navigate to the Manage Service Request page.');
    } else if (this._pendingNavAction === 'create') {
      alert('This would navigate to the Create New Service Request page.');
    }
    this.close.emit(null);
  }

  onCancelNavigateAway(): void {
    this.showNavigateAwayAlert.set(false);
    this._pendingNavAction = '';
  }
}
