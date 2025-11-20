import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PastryService } from '../../services/pastry.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  categories: string[] = [];

  constructor(private pastryService: PastryService) {}

  ngOnInit(): void {
    this.categories = this.pastryService.getCategories();
  }
}
