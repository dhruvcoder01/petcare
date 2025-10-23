import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vet } from '../../services/shop.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-container">
      <div id="map-placeholder">
        <p class="map-text">
            🗺️ Google Map Placeholder 🗺️
        </p>
        <p class="map-text-small">
            Center: ({{ center.lat | number:'1.4-4' }}, {{ center.lng | number:'1.4-4' }}) | Results: {{ vets.length }}
        </p>
        <p class="map-text-small" *ngIf="selectedVet">
            Selected: <strong>{{ selectedVet.name }}</strong>
        </p>
        <button class="recenter-btn" (click)="recenter.emit()">Recenter Map</button>
      </div>
    </div>
  `,
  styles: [`
    .map-container {
        width: 100%;
        height: 100%;
        min-height: 400px;
        
        #map-placeholder {
            width: 100%;
            height: 100%;
            background-color: #E6E6E6; 
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            border: 2px solid #6D4C41;
            
            .map-text {
                color: #8D6E63;
                font-style: italic;
                font-size: 1.2rem;
            }
            .map-text-small {
                font-size: 0.9rem;
                color: #6D4C41;
                margin-bottom: 0.5rem;
            }
            .recenter-btn {
                margin-top: 1rem;
                padding: 0.6rem 1.2rem;
                background-color: #3E2723;
                color: white;
                border: none;
                border-radius: 50px;
                cursor: pointer;
            }
        }
    }
  `]
})
export class MapComponent implements AfterViewInit {
    @Input() center!: { lat: number, lng: number };
    @Input() vets: Vet[] = [];
    @Input() selectedVet: Vet | null = null;
    @Output() markerClicked = new EventEmitter<Vet>();
    @Output() recenter = new EventEmitter<void>();

    ngAfterViewInit(): void {
        // NOTE: In a real app, Google Maps initialization code would go here.
    }
}