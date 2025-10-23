import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { CartService, CartItem } from '../../services/cart.service';
import { CheckoutFormComponent } from '../checkout-form/checkout-form.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, CheckoutFormComponent],
  template: `
    <div class="cart-container" [class.checkout-mode]="isCheckout">
      <div class="header">
        <h2>{{ isCheckout ? 'Checkout' : 'Your Cart' }}</h2>
        <button class="close-btn" (click)="closeCart.emit()">✕</button>
      </div>

      <div class="cart-body">
        <div *ngIf="(cartItems$ | async)?.length === 0 && !isCheckout" class="empty-state">
          <span class="empty-icon">🛒</span>
          <p>Your cart is empty! Start shopping for your pet.</p>
        </div>
        
        <ng-container *ngIf="!isCheckout">
          <div class="item-list" *ngIf="cartItems$ | async as items">
            <div class="cart-item" *ngFor="let item of items">
              <img [src]="item.imageUrl" [alt]="item.name" class="item-img">
              <div class="item-info">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-price">₹{{ item.price | number:'1.2-2' }}</span>
              </div>
              <div class="item-actions">
                <button (click)="updateQuantity(item.id, -1)">-</button>
                <input type="text" [value]="item.quantity" readonly>
                <button (click)="updateQuantity(item.id, 1)">+</button>
                <button class="remove-btn" (click)="removeFromCart(item.id)">🗑</button>
              </div>
            </div>
          </div>
        </ng-container>

        <ng-container *ngIf="isCheckout">
          <app-checkout-form 
            [total]="(total$ | async) || 0"
            (orderPlaced)="processPayment()">
          </app-checkout-form>
        </ng-container>
      </div>
      
      <div class="footer">
        <div class="total-display" *ngIf="!isCheckout">
          Total: <strong>₹{{ total$ | async | number:'1.2-2' }}</strong>
        </div>
        
        <button 
          *ngIf="!isCheckout"
          class="checkout-btn" 
          [disabled]="(cartItems$ | async)?.length === 0" 
          (click)="startCheckout.emit()">
          Proceed to Checkout
        </button>
        
        <p *ngIf="isCheckout" class="checkout-footer-note">Review details above before placing order.</p>
      </div>
    </div>
  `,
  styles: [`
    /* Inherit styles from cart.component.scss */
    .checkout-footer-note {
        text-align: center;
        color: #8D6E63;
        font-size: 0.9rem;
    }
  `],
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  @Input() isCheckout = false;
  @Output() closeCart = new EventEmitter<void>();
  @Output() startCheckout = new EventEmitter<void>();
  @Output() completeCheckout = new EventEmitter<{items: CartItem[], total: number}>();
  
  cartItems$: Observable<CartItem[]>;
  total$: Observable<number>;

  constructor(private cartService: CartService) {
    this.cartItems$ = this.cartService.cartItems$;
    this.total$ = this.cartService.getCartTotal();
  }

  ngOnInit(): void {}
  
  updateQuantity(id: number, change: number): void {
      this.cartService.updateQuantity(id, change);
  }
  
  removeFromCart(id: number): void {
      this.cartService.removeFromCart(id);
  }

  processPayment(): void {
      let currentItems: CartItem[] = [];
      let currentTotal: number = 0;
      
      this.cartItems$.subscribe(items => currentItems = items).unsubscribe();
      this.total$.subscribe(total => currentTotal = total).unsubscribe();

      if (currentItems.length > 0) {
          this.completeCheckout.emit({
              items: currentItems,
              total: currentTotal
          });
      }
  }
}