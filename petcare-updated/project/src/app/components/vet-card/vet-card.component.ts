import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vet } from '../../services/shop.service';

@Component({
  selector: 'app-vet-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="vet-card" [class.selected]="isSelected">
      <div class="card-header">
        <h3>{{ vet.name }}</h3>
        <span class="rating">⭐ {{ vet.rating | number:'1.1-1' }}</span>
      </div>
      <p class="address">{{ vet.address }}</p>
      <div class="card-footer">
        <span class="distance">📍 {{ vet.distance | number:'1.1-1' }} km</span>
        <span class="status" [class.open]="vet.openNow">
          {{ vet.openNow ? 'Open Now' : 'Closed' }}
        </span>
      </div>

      <div class="card-actions">
        <button class="action-btn primary-btn" (click)="callVet(vet.phone)">
          Call {{ vet.phone }}
        </button>
        <button class="action-btn secondary-btn" (click)="viewDirections(vet.placeId)">
          Directions 🗺️
        </button>
        <button class="action-btn tertiary-btn" (click)="viewDetails.emit(vet)">
            View Details
        </button>
      </div>
    </div>
  `,
  styles: [`
    .vet-card {
        background-color: white;
        padding: 1.2rem;
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        cursor: pointer;
        transition: all 0.2s;
        border: 2px solid transparent;
        margin-bottom: 1.2rem;

        &:hover {
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        
        &.selected {
            border-color: #6D4C41;
            background-color: #FAF6F1;
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
            
            h3 {
                font-size: 1.1rem;
                color: #3E2723;
            }
            .rating {
                font-weight: 600;
                color: #F57C00;
            }
        }
        .address {
            font-size: 0.9rem;
            color: #8D6E63;
            margin-bottom: 0.8rem;
        }
        
        .card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            
            .distance {
                font-weight: 600;
                color: #6D4C41;
            }
            .status {
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.8rem;
                
                &.open {
                    background-color: #E8F5E9;
                    color: #388E3C;
                }
                &:not(.open) {
                    background-color: #FFCDD2;
                    color: #D32F2F;
                }
            }
        }
        
        .card-actions {
            display: flex;
            gap: 0.5rem;
            
            .action-btn {
                flex: 1;
                padding: 0.6rem;
                border-radius: 6px;
                font-size: 0.85rem;
                cursor: pointer;
                border: 1px solid transparent;
                transition: background-color 0.2s;
                
                &.primary-btn {
                    background-color: #6D4C41;
                    color: white;
                    
                    &:hover {
                        background-color: #3E2723;
                    }
                }
                &.secondary-btn {
                    background-color: #FAF6F1;
                    color: #6D4C41;
                    border-color: #8D6E63;
                    
                    &:hover {
                        background-color: #E0D5C7;
                    }
                }
                &.tertiary-btn {
                    background: none;
                    color: #3E2723;
                    border: 1px solid #3E2723;
                }
            }
        }
    }
  `]
})
export class VetCardComponent {
    @Input() vet!: Vet;
    @Input() isSelected: boolean = false;
    @Output() viewDetails = new EventEmitter<Vet>();

    callVet(phone: string): void {
        window.open(`tel:${phone}`);
    }

    viewDirections(placeId: string): void {
        // Mock function to open Google Maps directions
        window.open(`https://www.google.com/maps/search/?api=1&query=veterinary+clinic&query_place_id=${placeId}`, '_blank');
    }
}