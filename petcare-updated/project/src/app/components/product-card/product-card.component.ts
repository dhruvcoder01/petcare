import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../services/shop.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-card">
      <div class="product-header" (click)="navigateToDetails(product.id)">
        <img [src]="product.imageUrl" [alt]="product.name" class="product-image">
        <span class="product-tag">{{ product.tag }}</span>
      </div>
      
      <div class="product-body">
        <h3 class="product-name" (click)="navigateToDetails(product.id)">{{ product.name }}</h3>
        <p class="product-description">{{ product.description }}</p>
        
        <div class="meta-info">
          <span class="rating">
            {{ product.rating }} ★ ({{ product.reviews }} reviews)
          </span>
          <span class="pet-type">{{ getPetIcon(product.petType) }} {{ product.petType }}</span>
        </div>
        
        <div class="why-need-section">
          <button class="why-need-btn" (click)="toggleWhyNeed($event)">
            {{ showWhyNeed ? 'Hide Benefits' : 'Why Your Pet Needs This' }}
          </button>
          <p *ngIf="showWhyNeed" class="why-need-text">{{ product.whyNeed }}</p>
        </div>
      </div>
      
      <div class="product-footer">
        <span class="product-price">₹{{ product.price }}</span>
        <button 
          class="add-to-cart-btn" 
          [class.added-success]="showSuccess" 
          (click)="addToCart(product, $event)">
          <span class="cart-icon" *ngIf="!showSuccess">🛒</span> 
          <span *ngIf="!showSuccess">Add to Cart</span>
          <span *ngIf="showSuccess">✓ Added!</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
    .product-header {
      position: relative;
      overflow: hidden;
      height: 200px;
      cursor: pointer;
    }
    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    .product-header:hover .product-image {
      transform: scale(1.05);
    }
    .product-tag {
      position: absolute;
      top: 10px;
      left: 10px;
      background-color: #FFD700;
      color: #3E2723;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 600;
    }
    .product-body {
      padding: 1rem;
      flex-grow: 1;
    }
    .product-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: #3E2723;
      margin-bottom: 0.5rem;
      cursor: pointer;
    }
    .product-description {
      font-size: 0.9rem;
      color: #6D4C41;
      margin-bottom: 0.8rem;
    }
    .meta-info {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      color: #8D6E63;
      margin-bottom: 1rem;
    }
    .rating {
      color: #F57C00;
      font-weight: 600;
    }
    .why-need-btn {
      background: none;
      border: 1px solid #8D6E63;
      color: #3E2723;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-bottom: 0.5rem;
    }
    .why-need-btn:hover {
      background-color: #8D6E63;
      color: white;
    }
    .why-need-text {
      background-color: #FAF6F1;
      padding: 0.8rem;
      border-left: 3px solid #6D4C41;
      font-size: 0.85rem;
      color: #5D4037;
      margin-top: 0.5rem;
      animation: fadeIn 0.3s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .product-footer {
      border-top: 1px solid #E8DCC8;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
    }
    .product-price {
      font-size: 1.5rem;
      font-weight: 800;
      color: #3E2723;
    }
    .add-to-cart-btn {
      background-color: #3E2723;
      color: #F5F5DC;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      min-width: 150px; /* Ensure button doesn't jump when text changes */
    }
    .add-to-cart-btn:hover {
      background-color: #6D4C41;
      transform: translateY(-2px);
    }
    
    /* New Success State */
    .add-to-cart-btn.added-success {
      background-color: #4CAF50; /* Green */
      color: white;
      transform: scale(1.05);
    }
  `]
})
export class ProductCardComponent {
  @Input() product!: Product;

  showWhyNeed = false;
  showSuccess = false; // New state for success icon/text

  constructor(
    private cartService: CartService, 
    private router: Router
  ) {}

  getPetIcon(petType: Product['petType']): string {
    switch (petType) {
      case 'Dog': return '🐶';
      case 'Cat': return '🐱';
      default: return '🐾';
    }
  }

  toggleWhyNeed(event: Event): void {
    event.stopPropagation(); 
    this.showWhyNeed = !this.showWhyNeed;
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation();
    this.cartService.addToCart(product);
    
    // Show success feedback
    this.showSuccess = true;
    setTimeout(() => {
      this.showSuccess = false;
    }, 1500); // Hide after 1.5 seconds

    console.log(`Added ${product.name} to cart.`);
  }

  navigateToDetails(id: number): void {
    this.router.navigate(['/shop', id]);
  }
}