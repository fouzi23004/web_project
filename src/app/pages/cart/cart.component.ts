import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { ModalService } from '../../services/modal.service';
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
    private orderService: OrderService,
    private router: Router,
    private modalService: ModalService
  ) { }

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

  async removeItem(pastryId: number): Promise<void> {
    const confirmed = await this.modalService.confirm(
      'Retirer l\'article',
      'Voulez-vous vraiment retirer cet article du panier ?',
      'Retirer',
      'Annuler'
    );

    if (confirmed) {
      this.cartService.removeFromCart(pastryId);
    }
  }

  async clearCart(): Promise<void> {
    const confirmed = await this.modalService.confirm(
      'Vider le panier',
      'Voulez-vous vraiment vider tout le panier ?',
      'Vider',
      'Annuler'
    );

    if (confirmed) {
      this.cartService.clearCart();
    }
  }

  continueShopping(): void {
    this.router.navigate(['/produits']);
  }

  async checkout(): Promise<void> {
    if (this.cartItems.length === 0) {
      await this.modalService.alert('Panier vide', 'Votre panier est vide ! Ajoutez des produits avant de commander.');
      return;
    }

    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      await this.modalService.alert('Non connecté', 'Vous devez être connecté pour passer une commande.');
      this.router.navigate(['/login']);
      return;
    }

    // Create the order
    const order = this.orderService.createOrder(
      currentUser.id,
      currentUser.name,
      currentUser.email,
      this.cartItems,
      this.totalPrice
    );

    // Clear the cart
    this.cartService.clearCart();

    // Show success message and redirect
    await this.modalService.alert(
      'Commande confirmée',
      `Commande #${order.id} créée avec succès !\n\nVous pouvez suivre son statut dans la section "Mes Commandes".`
    );
    this.router.navigate(['/commandes']);
  }
}
