import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './shop.service';

export interface CartItem extends Product {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  constructor() { }

  private updateCart(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
  }

  getCartCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.cartItems$.subscribe((items: CartItem[]) => { 
        const count = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
        observer.next(count);
      });
    });
  }
  
  addToCart(product: Product): void {
    const currentItems = this.cartItemsSubject.getValue();
    const existingItem = currentItems.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      // Use the full updated Product structure
      currentItems.push({ ...product, quantity: 1 });
    }
    this.updateCart([...currentItems]);
  }
  
  removeFromCart(productId: number): void {
    let currentItems = this.cartItemsSubject.getValue();
    currentItems = currentItems.filter(item => item.id !== productId);
    this.updateCart(currentItems);
  }
  
  updateQuantity(productId: number, change: number): void {
    const currentItems = this.cartItemsSubject.getValue();
    const item = currentItems.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            this.removeFromCart(productId);
        } else {
            this.updateCart([...currentItems]);
        }
    }
  }

  getCartTotal(): Observable<number> {
    return new Observable<number>(observer => {
      this.cartItems$.subscribe((items: CartItem[]) => { 
        const total = items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
        observer.next(total);
      });
    });
  }

  clearCart(): void {
    this.updateCart([]);
  }
}