import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, UserCart } from '../models/cart-item.model';
import { Pastry } from '../models/pastry.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CARTS_STORAGE_KEY = 'patisserie_carts';
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  constructor(private authService: AuthService) {
    // Load cart when service is initialized
    this.loadCart();

    // Subscribe to user changes to reload cart
    this.authService.currentUser$.subscribe(() => {
      this.loadCart();
    });
  }

  // Load cart from local storage for current user
  private loadCart(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      const carts = this.getAllCarts();
      const userCart = carts.find(c => c.userId === currentUser.id);
      if (userCart) {
        this.cartItemsSubject.next(userCart.items);
      } else {
        this.cartItemsSubject.next([]);
      }
    } else {
      this.cartItemsSubject.next([]);
    }
  }

  // Get all carts from local storage
  private getAllCarts(): UserCart[] {
    const cartsJson = localStorage.getItem(this.CARTS_STORAGE_KEY);
    return cartsJson ? JSON.parse(cartsJson) : [];
  }

  // Save cart to local storage for current user
  private saveCart(): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    const carts = this.getAllCarts();
    const cartIndex = carts.findIndex(c => c.userId === currentUser.id);

    const userCart: UserCart = {
      userId: currentUser.id,
      items: this.cartItemsSubject.value,
      updatedAt: new Date()
    };

    if (cartIndex !== -1) {
      carts[cartIndex] = userCart;
    } else {
      carts.push(userCart);
    }

    localStorage.setItem(this.CARTS_STORAGE_KEY, JSON.stringify(carts));
  }

  // Add item to cart
  addToCart(pastry: Pastry, quantity: number): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItemIndex = currentItems.findIndex(item => item.pastry.id === pastry.id);

    if (existingItemIndex !== -1) {
      // Update quantity if item already exists
      currentItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      currentItems.push({ pastry, quantity });
    }

    this.cartItemsSubject.next([...currentItems]);
    this.saveCart();
  }

  // Remove item from cart
  removeFromCart(pastryId: number): void {
    const currentItems = this.cartItemsSubject.value.filter(
      item => item.pastry.id !== pastryId
    );
    this.cartItemsSubject.next(currentItems);
    this.saveCart();
  }

  // Update item quantity
  updateQuantity(pastryId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(pastryId);
      return;
    }

    const currentItems = this.cartItemsSubject.value;
    const itemIndex = currentItems.findIndex(item => item.pastry.id === pastryId);

    if (itemIndex !== -1) {
      currentItems[itemIndex].quantity = quantity;
      this.cartItemsSubject.next([...currentItems]);
      this.saveCart();
    }
  }

  // Clear cart
  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.saveCart();
  }

  // Get cart items
  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  // Get total items count
  getTotalItems(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.quantity, 0);
  }

  // Get total price
  getTotalPrice(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + (item.pastry.price * item.quantity),
      0
    );
  }
}
