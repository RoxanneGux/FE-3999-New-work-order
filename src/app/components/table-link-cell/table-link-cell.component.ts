import { Component, input } from '@angular/core';

@Component({
  selector: 'app-table-link-cell',
  standalone: true,
  template: `
    <a class="link-text" (click)="onClick()" (keydown.enter)="onClick()" tabindex="0" role="button">{{ label() }}</a>
  `,
  styles: [`
    .link-text {
      color: var(--system-links-link-active);
      cursor: pointer;
      text-decoration: underline;
      font-size: 14px;
      white-space: nowrap;
    }
    .link-text:hover {
      color: var(--system-links-link-hover-longpress);
    }
  `]
})
export class TableLinkCellComponent {
  label = input<string>('View');
  callback = input<(() => void) | undefined>(undefined);

  onClick(): void {
    const cb = this.callback();
    if (cb) cb();
  }
}
