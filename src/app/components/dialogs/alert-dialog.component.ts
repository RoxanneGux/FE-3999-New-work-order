import { Component } from '@angular/core';
import { AwDialogComponent, DialogOptions } from '@assetworks-llc/aw-component-lib';
import { BaseDialogComponent } from './base-dialog.component';

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [AwDialogComponent],
  template: `
    <aw-dialog
      [ariaLabel]="'Lookup Information'"
      [visible]="true"
      [dialogOptions]="dialogOptions"
      (primaryAction)="close.emit()"
      (secondaryAction)="close.emit()">
    </aw-dialog>
  `,
})
export class AlertDialogComponent extends BaseDialogComponent {
  public fieldName = '';

  public dialogOptions: DialogOptions = {
    variant: 'alert',
    title: 'Lookup',
    description: '',
    primaryButtonLabel: 'OK',
  };

  ngOnInit(): void {
    const label = this.fieldName || 'This field';
    this.dialogOptions = {
      ...this.dialogOptions,
      description: `${label} lookup dialog is not yet implemented in this harness.`,
    };
  }
}
