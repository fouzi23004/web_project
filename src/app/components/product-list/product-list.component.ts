import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Pastry } from '../../models/pastry.model';
import { PastryService } from '../../services/pastry.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  pastries: Pastry[] = [];

  constructor(
    private pastryService: PastryService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to category changes (will trigger immediately with initial value)
    this.pastryService.selectedCategory$.subscribe(() => {
      this.pastries = this.pastryService.getFilteredPastries();
    });
  }

  addToCart(pastry: Pastry): void {
    if (!this.authService.isLoggedIn()) {
      alert('Veuillez vous connecter pour ajouter des articles au panier');
      this.router.navigate(['/login']);
      return;
    }

    const quantity = prompt(`Combien de "${pastry.name}" voulez-vous ajouter?`, '1');
    if (quantity) {
      const qty = parseInt(quantity);
      if (qty > 0) {
        this.cartService.addToCart(pastry, qty);
        alert(`${qty} x ${pastry.name} ajouté(s) au panier!`);
      } else {
        alert('Quantité invalide');
      }
    }
  }
}
