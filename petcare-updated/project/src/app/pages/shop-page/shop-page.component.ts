import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ShopService } from '../../services/shop.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { FilterSortComponent } from '../../components/filter-sort/filter-sort.component';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { ChatbotComponent } from '../../components/chatbot/chatbot.component';
import { Observable } from 'rxjs';
import { CartComponent } from '../../components/cart/cart.component';

@Component({
  selector: 'app-shop-page',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ProductCardComponent, 
    FilterSortComponent, 
    RouterModule, 
    ChatbotComponent, 
    CartComponent
  ],
  template: `
    <div class="dashboard-container" [class.no-scroll]="isCartOpen || showSuccessModal"> 
      <aside class="sidebar" [class.collapsed]="sidebarCollapsed">
        <div class="logo">
          <span class="logo-icon">🐾</span>
          <span class="logo-text" *ngIf="!sidebarCollapsed">PetCare</span>
        </div>

        <nav class="menu">
          <div 
            class="menu-item" 
            (click)="navigateTo('dashboard')"
            data-tooltip="Dashboard">
            <span class="menu-icon">🏠</span>
            <span class="menu-text" *ngIf="!sidebarCollapsed">Dashboard</span>
          </div>
          <div 
            class="menu-item active" 
            (click)="navigateTo('shop')"
            data-tooltip="Shop">
            <span class="menu-icon">🛒</span>
            <span class="menu-text" *ngIf="!sidebarCollapsed">Shop</span>
          </div>
          <div 
            class="menu-item" 
            (click)="navigateTo('vaccines')"
            data-tooltip="Vaccines">
            <span class="menu-icon">💉</span>
            <span class="menu-text" *ngIf="!sidebarCollapsed">Vaccines</span>
          </div>
          <div 
            class="menu-item" 
            (click)="navigateTo('vets')"
            data-tooltip="Vets">
            <span class="menu-icon">🧑‍⚕️</span>
            <span class="menu-text" *ngIf="!sidebarCollapsed">Vets</span>
          </div>
          <div 
            class="menu-item" 
            (click)="navigateTo('profile')"
            data-tooltip="Order Tracking"> <span class="menu-icon">👤</span>
            <span class="menu-text" *ngIf="!sidebarCollapsed">Track Order</span> </div>
          <div class="menu-item logout" (click)="navigateTo('logout')" data-tooltip="Logout">
            <span class="menu-icon">🚪</span>
            <span class="menu-text" *ngIf="!sidebarCollapsed">Logout</span>
          </div>
        </nav>

        <button class="toggle-btn" (click)="toggleSidebar()">
          {{ sidebarCollapsed ? '→' : '←' }}
        </button>
      </aside>

      <main class="main-content">
        <div *ngIf="!selectedProduct && !isCartOpen"> 
          
          <div class="top-controls">
            <h1 class="page-title">PetCare Shop</h1>
            
            <button class="cart-button" (click)="viewCart()">
              <span class="cart-icon">🛍️</span>
              View Cart 
              <span class="cart-count" *ngIf="cartItemCount$ | async as count">
                {{ count }}
              </span>
            </button>
          </div>
          
          <p class="subtitle">Find the perfect products for your beloved pets. Get started by filtering or searching below!</p>
          
          <div class="controls-wrapper">
            <div class="search-bar">
              <input type="text" placeholder="Search products, brands, or keywords..." [(ngModel)]="searchQuery" (ngModelChange)="applySearch()">
            </div>
            <app-filter-sort (filterChanged)="onFilterChanged($event)"></app-filter-sort>
          </div>
          
          <div class="product-grid" *ngIf="filteredProducts.length > 0">
            <app-product-card *ngFor="let product of filteredProducts" [product]="product"></app-product-card>
          </div>
          
          <div class="empty-state" *ngIf="filteredProducts.length === 0">
              <span class="empty-icon">🦴</span>
              <p>No products match your current filters or search query.</p>
          </div>
        </div>
        
        <div *ngIf="selectedProduct && !isCartOpen" class="product-detail-view">
            <button class="back-btn" (click)="goBack()">← Back to Shop</button>
            <div class="detail-content">
              <h1 class="product-name">{{ selectedProduct.name }}</h1>
              <div class="detail-body">
                <div class="image-gallery">
                  <img [src]="selectedProduct.imageUrl" [alt]="selectedProduct.name" class="main-image">
                </div>
                
                <div class="product-info">
                  <p class="category-tag">{{ selectedProduct.category }} for {{ selectedProduct.petType }}</p>
                  <span class="product-price">₹{{ selectedProduct.price }}</span>
                  <p class="full-description">{{ selectedProduct.description }}</p>

                  <div class="details-section why-need">
                      <h3>Why Your Pet Needs This</h3>
                      <p>{{ selectedProduct.whyNeed }}</p>
                  </div>

                  <div class="actions">
                    <input type="number" value="1" min="1" max="99" class="quantity-input">
                    <button class="buy-now-btn" (click)="addToCart(selectedProduct)">Buy Now</button>
                  </div>
                </div>
              </div>
              
              <div class="reviews-section">
                  <h2>Reviews ({{ selectedProduct.reviews }})</h2>
                  <p class="empty-state-text">Review component placeholder.</p>
              </div>
            </div>
        </div>
        
        <div *ngIf="isCartOpen">
            <app-cart 
                [isCheckout]="isCheckout"
                (closeCart)="isCartOpen = false"
                (startCheckout)="startCheckout()"
                (completeCheckout)="completeCheckout($event)">
            </app-cart>
        </div>


        <footer class="dashboard-footer">
          <p>© 2025 PetCare. Love. Heal. Protect.</p>
        </footer>
        
        <app-chatbot></app-chatbot>
      </main>
      
      <div class="success-modal-overlay" *ngIf="showSuccessModal" (click)="closeSuccessModal()">
          <div class="success-modal-content" (click)="$event.stopPropagation()">
              <span class="close-btn" (click)="closeSuccessModal()">✕</span>
              <img src="https://images.pexels.com/photos/4056461/pexels-photo-4056461.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Pet Confirmation Image" class="success-image">
              <h2>Order Placed Successfully!</h2>
              <p>Your order (ID: {{ lastOrderId }}) is being processed.</p>
              <button class="track-btn" (click)="navigateToTracking()">Track Your Order</button>
          </div>
      </div>
    </div>
  `,
  styleUrls: ['./shop-page.component.scss']
})
export class ShopPageComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery = '';
  currentFilters: any = { category: 'All', petType: 'All', sortBy: 'popularity' };
  selectedProduct: Product | undefined;
  
  // Sidebar State
  sidebarCollapsed = false;
  
  // Cart/Checkout State
  isCartOpen = false; 
  isCheckout = false;
  
  // Success Modal State
  showSuccessModal = false;
  lastOrderId = '';
  
  cartItemCount$: Observable<number>;

  constructor(
    private shopService: ShopService,
    private cartService: CartService, 
    private route: ActivatedRoute,
    private router: Router
  ) {
      this.cartItemCount$ = this.cartService.getCartCount();
  }

  ngOnInit(): void {
    this.products = this.shopService.getProducts();
    
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.selectedProduct = this.products.find(p => p.id === id);
      } else {
        this.selectedProduct = undefined;
        this.filterAndSort(); 
      }
    });
  }
  
  // --- Layout Methods ---
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
  
  navigateTo(route: string): void {
    if (route === 'logout') {
      this.router.navigate(['/home']);
      return;
    }
    // Close cart view if navigating away from shop, unless tracking
    this.isCartOpen = false;
    this.router.navigate([`/${route}`]); 
  }
  
  viewCart(): void {
      this.isCartOpen = true;
      this.isCheckout = false;
  }
  
  // --- Checkout Flow Methods ---
  startCheckout(): void {
      this.isCheckout = true;
  }
  
  completeCheckout(orderData: {items: CartItem[], total: number}): void {
      // 1. Process Order (Mock: just generate an ID)
      this.lastOrderId = 'ORD-' + Math.floor(Math.random() * 9000 + 1000);
      this.cartService.clearCart();
      
      // 2. Hide Cart/Checkout and Show Success Modal
      this.isCartOpen = false;
      this.isCheckout = false;
      this.showSuccessModal = true; // This ensures the modal is displayed
  }
  
  closeSuccessModal(): void {
      this.showSuccessModal = false;
  }
  
  navigateToTracking(): void {
      this.closeSuccessModal();
      // Redirects to OrderTrackingComponent (mapped to /profile)
      this.router.navigate(['/profile']); 
  }


  // --- Shop Logic Methods ---
  applySearch(): void {
    this.filterAndSort();
  }

  onFilterChanged(filters: any): void {
    this.currentFilters = filters;
    this.filterAndSort();
  }
  
  goBack(): void {
      this.router.navigate(['/shop']);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    console.log(`Added ${product.name} to cart.`);
  }

  public filterAndSort(): void {
    let tempProducts = this.products;

    // 1. Apply Search
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      tempProducts = tempProducts.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.tag.toLowerCase().includes(query)
      );
    }

    // 2. Apply Filters
    if (this.currentFilters.category !== 'All') {
      tempProducts = tempProducts.filter(p => p.category === this.currentFilters.category);
    }
    if (this.currentFilters.petType !== 'All') {
      tempProducts = tempProducts.filter(p => p.petType === this.currentFilters.petType);
    }

    // 3. Apply Sorting
    switch (this.currentFilters.sortBy) {
      case 'priceLow':
        tempProducts.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        tempProducts.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        tempProducts.sort((a, b) => b.reviews - a.reviews); 
        break;
      case 'newest':
        tempProducts.sort((a, b) => b.id - a.id);
        break;
    }

    this.filteredProducts = tempProducts;
  }
}