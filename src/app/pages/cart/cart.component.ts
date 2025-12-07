import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  isLoggedIn: boolean = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  calculateTotal(): void {
    this.totalPrice = this.cartService.getTotalPrice();
  }

  increaseQuantity(pastryId: number): void {
    const item = this.cartItems.find(i => i.pastry.id === pastryId);
    if (item) {
      this.cartService.updateQuantity(pastryId, item.quantity + 1);
    }
  }

  decreaseQuantity(pastryId: number): void {
    const item = this.cartItems.find(i => i.pastry.id === pastryId);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(pastryId, item.quantity - 1);
    }
  }

  removeItem(pastryId: number): void {
    if (confirm('Voulez-vous vraiment retirer cet article du panier?')) {
      this.cartService.removeFromCart(pastryId);
    }
  }

  clearCart(): void {
    if (confirm('Voulez-vous vraiment vider le panier?')) {
      this.cartService.clearCart();
    }
  }

  continueShopping(): void {
    this.router.navigate(['/produits']);
  }

  checkout(): void {
    alert('Fonctionnalité de paiement à venir!');
  }
}
