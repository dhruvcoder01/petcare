import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order, ShopService } from '../../services/shop.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tracking-container">
      <div class="sidebar-header">
        <h1 class="page-title">My Profile & Orders</h1>
        <div class="divider"></div>
      </div>

      <div class="tracking-content">
        
        <h2>Order History (Tracking)</h2>

        <div *ngFor="let order of orders" class="order-card">
          <div class="order-header">
            <h3>Order ID: {{ order.id }}</h3>
            <span class="status-badge" [class.delivered]="order.status === 'Delivered'" [class.shipping]="order.status === 'Shipped' || order.status === 'Out for Delivery'" [class.cancelled]="order.status === 'Cancelled'">
              {{ order.status }}
            </span>
          </div>

          <div class="delivery-info">
            <p><strong>Tracking ID:</strong> {{ order.trackingId }}</p>
            <p><strong>Expected:</strong> {{ order.expectedDelivery | date:'mediumDate' }}</p>
          </div>

          <div class="timeline-container">
            <div class="timeline">
              <ng-container *ngFor="let step of statusSteps; let i = index">
                <div class="timeline-step" [class.completed]="isStepCompleted(order.status, step.name)">
                  <div class="step-icon">
                    <span *ngIf="isStepCompleted(order.status, step.name)">✓</span>
                  </div>
                  <div class="step-label">{{ step.name }}</div>
                </div>
              </ng-container>
            </div>
          </div>
          
          <div class="product-summary">
            <h4>Products ({{ order.products.length }} item<span *ngIf="order.products.length !== 1">s</span>)</h4>
            <div class="product-list">
              <div *ngFor="let p of order.products" class="product-item">
                <img [src]="p.imageUrl" class="product-thumb">
                <span>{{ p.name }} (x{{ p.quantity }})</span>
              </div>
            </div>
          </div>
          
          <button class="action-button" *ngIf="order.status !== 'Delivered' && order.status !== 'Cancelled'">
            Cancel Order
          </button>
          <button class="action-button reorder-button" *ngIf="order.status === 'Delivered'">
            Re-order
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tracking-container {
      min-height: calc(100vh - 80px);
      background: linear-gradient(135deg, #F5F5DC 0%, #E8DCC8 100%);
      padding: 2rem 3rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .sidebar-header {
      border-bottom: 2px solid #E0D5C7;
      margin-bottom: 2rem;
    }
    .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #3E2723;
    }
    .divider { height: 1px; }

    h2 {
      font-size: 1.75rem;
      color: #3E2723;
      margin-bottom: 1.5rem;
    }

    .order-card {
      background-color: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      border-bottom: 1px dashed #E0D5C7;
      padding-bottom: 1rem;
      
      h3 {
        font-size: 1.25rem;
        color: #3E2723;
      }
    }
    
    .status-badge {
        padding: 0.4rem 1rem;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.9rem;
        
        &.delivered { background-color: #E8F5E9; color: #388E3C; }
        &.shipping { background-color: #FFF3E0; color: #F57C00; }
        &.cancelled { background-color: #FFCDD2; color: #D32F2F; }
    }

    .delivery-info {
      font-size: 1rem;
      color: #6D4C41;
      margin-bottom: 2rem;
    }

    /* --- Timeline Styles --- */
    .timeline-container {
      margin: 2rem 0;
      padding: 0 1rem;
    }

    .timeline {
      display: flex;
      justify-content: space-between;
      position: relative;
      padding: 0 0 1rem;
      
      &::before {
        content: '';
        position: absolute;
        top: 15px;
        left: 0;
        right: 0;
        height: 4px;
        background-color: #E0D5C7;
        z-index: 0;
      }
    }

    .timeline-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      text-align: center;
      position: relative;
      
      &:not(:last-child)::after { /* Progress Line */
        content: '';
        position: absolute;
        top: 15px;
        left: 50%;
        right: -50%;
        height: 4px;
        background-color: #388E3C; 
        z-index: 1;
        opacity: 0;
        transition: opacity 0.5s;
      }
    }

    .timeline-step.completed {
        .step-icon {
            background-color: #388E3C;
        }
        
        &:not(:last-child)::after {
            opacity: 1;
        }
    }

    .step-icon {
      width: 30px;
      height: 30px;
      background-color: #E0D5C7;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      color: white;
      z-index: 2;
      margin-bottom: 0.5rem;
      transition: background-color 0.3s;
    }
    
    .step-label {
      font-size: 0.9rem;
      color: #8D6E63;
      font-weight: 500;
    }

    /* --- Product Summary --- */
    .product-summary {
        margin-top: 1rem;
        border-top: 1px dashed #E0D5C7;
        padding-top: 1rem;
        
        h4 {
            color: #3E2723;
            margin-bottom: 0.75rem;
            font-size: 1rem;
        }
    }
    
    .product-list {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }
    
    .product-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        color: #6D4C41;
    }

    .product-thumb {
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: 4px;
    }

    .action-button {
      margin-top: 1.5rem;
      background-color: #D32F2F;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s;
      
      &.reorder-button {
        background-color: #3E2723;
      }
      
      &:hover {
        opacity: 0.9;
      }
    }
  `]
})
export class OrderTrackingComponent implements OnInit {
  orders: Order[] = [];
  
  // Static status steps for the timeline visualization
  statusSteps = [
    { name: 'Ordered', date: null },
    { name: 'Packed', date: null },
    { name: 'Shipped', date: null },
    { name: 'Out for Delivery', date: null },
    { name: 'Delivered', date: null }
  ];

  constructor(private shopService: ShopService, private router: Router) {}

  ngOnInit(): void {
    // Get mock order data from ShopService
    this.orders = this.shopService.getOrders();
  }

  isStepCompleted(currentStatus: Order['status'], stepName: string): boolean {
    const statusOrder = ['Ordered', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
    
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepName);
    
    if (currentStatus === 'Cancelled') {
      return stepName === 'Ordered';
    }
    
    return stepIndex <= currentIndex;
  }
}