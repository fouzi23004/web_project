import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Pastry } from '../../models/pastry.model';
import { PastryService } from '../../services/pastry.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';

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
    private router: Router,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    // Subscribe to category changes (will trigger immediately with initial value)
    this.pastryService.selectedCategory$.subscribe(() => {
      this.pastries = this.pastryService.getFilteredPastries();
    });
  }

  async addToCart(pastry: Pastry): Promise<void> {
    if (!this.authService.isLoggedIn()) {
      await this.modalService.alert(
        'Connexion requise',
        'Veuillez vous connecter pour ajouter des articles au panier.'
      );
      this.router.navigate(['/login']);
      return;
    }

    const quantity = await this.modalService.prompt(
      'Quantité',
      `Combien de "${pastry.name}" voulez-vous ajouter ?`,
      'Quantité',
      '1'
    );

    if (quantity) {
      const qty = parseInt(quantity);
      if (qty > 0) {
        this.cartService.addToCart(pastry, qty);
        await this.modalService.alert(
          'Ajouté au panier',
          `${qty} x ${pastry.name} ajouté(s) au panier !`
        );
      } else {
        await this.modalService.alert(
          'Quantité invalide',
          'Veuillez entrer un nombre positif.'
        );
      }
    }
  }
}
