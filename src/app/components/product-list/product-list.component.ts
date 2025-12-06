import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pastry } from '../../models/pastry.model';
import { PastryService } from '../../services/pastry.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  pastries: Pastry[] = [];

  constructor(private pastryService: PastryService) {}

  ngOnInit(): void {
    // Subscribe to category changes (will trigger immediately with initial value)
    this.pastryService.selectedCategory$.subscribe(() => {
      this.pastries = this.pastryService.getFilteredPastries();
    });
  }

  addToCart(pastry: Pastry): void {
    alert(`${pastry.name} ajouté au panier!`);
  }
}
