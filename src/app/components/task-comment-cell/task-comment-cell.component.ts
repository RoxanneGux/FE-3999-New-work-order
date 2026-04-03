import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AwButtonIconOnlyDirective, AwIconComponent } from '@assetworks-llc/aw-component-lib';

@Component({
  selector: 'app-task-comment-cell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AwButtonIconOnlyDirective, AwIconComponent],
  template: `
    @if (hasComment) {
      <button AwButtonIconOnly [buttonType]="'primary'" [popUpValue]="1"
        [ariaLabel]="'View comment for ' + taskId" (click)="onClick()">
        <aw-icon [iconName]="'comment'" [iconColor]="''"></aw-icon>
      </button>
    }
  `
})
export class TaskCommentCellComponent {
  @Input() hasComment = false;
  @Input() taskId = '';
  @Input() taskDescription = '';
  @Input() comment = '';
  @Input() onOpenDrawer: ((taskId: string, taskDescription: string, comment: string) => void) | null = null;

  onClick(): void {
    this.onOpenDrawer?.(this.taskId, this.taskDescription, this.comment);
  }
}
