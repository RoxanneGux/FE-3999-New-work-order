import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AwIconComponent } from '@assetworks-llc/aw-component-lib';

@Component({
  selector: 'app-mock-map',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AwIconComponent],
  templateUrl: './mock-map.component.html',
  styleUrl: './mock-map.component.scss'
})
export class MockMapComponent {
  layersPanelOpen = true;

  toggleLayersPanel(): void {
    this.layersPanelOpen = !this.layersPanelOpen;
  }
}
