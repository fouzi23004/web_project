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
    this.pastries = this.pastryService.getPastries();
  }

  addToCart(pastry: Pastry): void {
    alert(`${pastry.name} ajouté au panier!`);
  }
}
