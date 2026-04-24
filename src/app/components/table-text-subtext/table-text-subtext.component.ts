import { Component, input } from '@angular/core';

@Component({
  selector: 'app-table-text-subtext',
  standalone: true,
  template: `
    <span class="title" [class.link-text]="linkStyle()">{{ text() }}</span>
    <span class="sub-title">{{ subText() }}</span>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
    }
    .link-text {
      color: var(--system-links-link-active);
      cursor: pointer;
      text-decoration: underline;
    }
    .link-text:hover {
      color: var(--system-links-link-hover-longpress);
    }
  `]
})
export class TableTextSubtextComponent {
  text = input<string>('');
  subText = input<string>('');
  linkStyle = input<boolean>(false);
}
