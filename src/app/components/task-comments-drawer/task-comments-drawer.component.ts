import { AfterViewInit, ChangeDetectionStrategy, Component, computed, EventEmitter, Input, Output, signal, viewChild } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import {
  AwExpansionPanelComponent,
  AwFormFieldComponent,
  AwInputDirective,
  AwSideDrawerComponent,
  SideDrawerInformation
} from '@assetworks-llc/aw-component-lib';

@Component({
  selector: 'app-task-comments-drawer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AwSideDrawerComponent,
    AwExpansionPanelComponent,
    AwFormFieldComponent,
    AwInputDirective,
    ReactiveFormsModule
  ],
  template: `
    <aw-side-drawer
      #taskCommentsDrawer
      [openFromRight]="true"
      [drawerInformation]="drawerInfo()"
      (sideDrawerClosed)="closeDrawer()">
      <div class="p-3">
        <aw-expansion-panel
          [title]="'Comments'"
          [expanded]="true"
          [showExpander]="true"
          [sideDrawerVariant]="true">
          <div class="p-3">
            <aw-form-field>
              <textarea
                AwInput
                [formControl]="commentControl"
                [readOnly]="true"
                aria-label="Task comment"
                rows="6"
              ></textarea>
            </aw-form-field>
          </div>
        </aw-expansion-panel>
      </div>
    </aw-side-drawer>
  `
})
export class TaskCommentsDrawerComponent implements AfterViewInit {
  @Input() taskId = '';
  @Input() taskDescription = '';
  @Input() comment = '';
  @Output() close = new EventEmitter<void>();

  public taskCommentsDrawer = viewChild<AwSideDrawerComponent>('taskCommentsDrawer');
  public commentControl = new FormControl('');

  public readonly drawerInfo = computed<SideDrawerInformation>(() => ({
    title: 'Task Comments',
    subTitle: `(${this.taskId}) ${this.taskDescription}`
  }));

  ngAfterViewInit(): void {
    this.commentControl.setValue(this.comment || '');
    this.taskCommentsDrawer()?.openSideDrawer();
  }

  public closeDrawer(): void {
    setTimeout(() => this.close.emit(), 300);
  }
}
