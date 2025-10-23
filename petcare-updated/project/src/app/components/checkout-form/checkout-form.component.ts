import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="checkout-form-container">
      <form #checkoutForm="ngForm" (ngSubmit)="submitOrder(!!checkoutForm.valid)">
        
        <div class="checkout-section">
          <h3>1. Delivery Details</h3>
          <div class="form-group">
            <label for="name">Full Name <span class="required">*</span></label>
            <input type="text" id="name" name="name" [(ngModel)]="delivery.name" required>
          </div>
          <div class="form-group">
            <label for="phone">Phone Number <span class="required">*</span></label>
            <input type="tel" id="phone" name="phone" [(ngModel)]="delivery.phone" required pattern="[0-9]{10}">
          </div>
          <div class="form-group">
            <label for="address">Address <span class="required">*</span></label>
            <textarea id="address" name="address" rows="3" [(ngModel)]="delivery.address" required></textarea>
          </div>
        </div>

        <div class="checkout-section">
          <h3>2. Payment Method</h3>
          
          <div class="payment-options">
            <label class="payment-option">
              <input type="radio" name="payment" value="Cash" [(ngModel)]="payment.method" required>
              Cash on Delivery
            </label>
            <label class="payment-option">
              <input type="radio" name="payment" value="UPI" [(ngModel)]="payment.method" required>
              UPI / Net Banking
            </label>
            <label class="payment-option">
              <input type="radio" name="payment" value="Card" [(ngModel)]="payment.method" required>
              Credit/Debit Card
            </label>
          </div>

          <div *ngIf="payment.method === 'Card'" class="card-details">
            <div class="form-group">
              <label for="cardNumber">Card Number</label>
              <input type="text" id="cardNumber" name="cardNumber" [(ngModel)]="payment.cardNumber" required>
            </div>
            <div class="form-group form-group-inline">
              <div class="expiry-group">
                <label for="expiry">Expiry (MM/YY)</label>
                <input type="text" id="expiry" name="expiry" [(ngModel)]="payment.expiry" required>
              </div>
              <div class="cvv-group">
                <label for="cvv">CVV</label>
                <input type="text" id="cvv" name="cvv" [(ngModel)]="payment.cvv" required>
              </div>
            </div>
          </div>
        </div>
        
        <div class="total-row final">
            <strong>Grand Total:</strong>
            <strong>₹{{ total | number:'1.2-2' }}</strong>
        </div>

        <button type="submit" class="place-order-btn" [disabled]="!checkoutForm.valid">
          Place Order
        </button>
      </form>
    </div>
  `,
  styles: [`
    .checkout-form-container {
        padding: 1rem 0;
    }
    .checkout-section {
        margin-bottom: 2rem;
        padding: 1.5rem;
        border: 1px solid #E0D5C7;
        border-radius: 8px;
        background-color: #FAF6F1;
        
        h3 {
            color: #3E2723;
            margin-bottom: 1rem;
            font-size: 1.2rem;
            font-weight: 700;
        }
    }
    .form-group {
        display: flex;
        flex-direction: column;
        margin-bottom: 1rem;
        
        &.form-group-inline {
            flex-direction: row;
            gap: 1rem;
            .expiry-group, .cvv-group { flex: 1; }
        }

        label {
            font-size: 0.9rem;
            font-weight: 500;
            color: #6D4C41;
            margin-bottom: 0.3rem;
        }
        
        input[type="text"], input[type="tel"], textarea {
            padding: 0.75rem;
            border: 1px solid #D7CCC8;
            border-radius: 6px;
            font-size: 1rem;
        }
        .required { color: #D32F2F; }
    }
    
    .payment-options {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
    
    .payment-option {
        font-weight: 500;
        color: #3E2723;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
    }
    
    .card-details {
        margin-top: 1rem;
        padding: 1rem;
        border: 1px dashed #D7CCC8;
        border-radius: 6px;
    }
    
    .total-row.final {
        display: flex;
        justify-content: space-between;
        margin-top: 1.5rem;
        padding-top: 10px;
        font-size: 1.4rem;
        color: #3E2723;
        border-top: 1px solid #E0D5C7;
        margin-bottom: 2rem;
        
        strong { font-weight: 800; }
    }
    
    .place-order-btn {
        width: 100%;
        padding: 1rem;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 50px;
        font-size: 1.2rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover:not(:disabled) {
            background-color: #388E3C;
            transform: translateY(-2px);
        }
        
        &:disabled {
            background-color: #A8B79C;
            cursor: not-allowed;
        }
    }
  `]
})
export class CheckoutFormComponent implements OnInit {
  @Input() total!: number;
  @Output() orderPlaced = new EventEmitter<void>();

  delivery = {
    name: '',
    phone: '',
    address: ''
  };
  
  payment = {
    method: 'Cash',
    cardNumber: '',
    expiry: '',
    cvv: ''
  };

  ngOnInit(): void {
    // Mock initial data for faster testing
    this.delivery = {
        name: 'Alex Johnson',
        phone: '9876543210',
        address: '123 Pet Lane, Sector 6, Petville'
    };
  }

  submitOrder(isValid: boolean): void {
    if (isValid) {
      console.log('Finalizing Order...', { delivery: this.delivery, payment: this.payment });
      this.orderPlaced.emit();
    }
  }
}