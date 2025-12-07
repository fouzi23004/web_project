import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PastryService } from '../../services/pastry.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Pastry } from '../../models/pastry.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  topSalesPastries: Pastry[] = [];

  constructor(
    private pastryService: PastryService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.topSalesPastries = this.pastryService.getTopSalesPastries();
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
