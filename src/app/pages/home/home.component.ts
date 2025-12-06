import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PastryService } from '../../services/pastry.service';
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

  constructor(private pastryService: PastryService) {}

  ngOnInit(): void {
    this.topSalesPastries = this.pastryService.getTopSalesPastries();
  }

  addToCart(pastry: Pastry): void {
    alert(`${pastry.name} ajouté au panier!`);
  }
}
