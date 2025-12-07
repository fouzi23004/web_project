import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Pastry } from '../models/pastry.model';

@Injectable({
  providedIn: 'root'
})
export class PastryService {
  private readonly PASTRIES_STORAGE_KEY = 'patisserie_products';
  private selectedCategorySubject = new BehaviorSubject<string | null>(null);
  public selectedCategory$: Observable<string | null> = this.selectedCategorySubject.asObservable();
  private pastries: Pastry[] = [];

  // Default pastries to initialize local storage
  private defaultPastries: Pastry[] = [
    {
      id: 1,
      name: 'Croissant au Beurre',
      description: 'Croissant français traditionnel, croustillant et feuilleté, préparé avec du beurre pur.',
      price: 2.50,
      image: 'assets/images/croissant.jpg',
      category: 'Viennoiseries',
      topSales: true
    },
    {
      id: 2,
      name: 'Éclair au Chocolat',
      description: 'Pâte à choux fourrée de crème pâtissière au chocolat et recouverte de glaçage chocolat.',
      price: 4.00,
      image: 'assets/images/eclair.jpg',
      category: 'Pâtisseries',
      topSales: true
    },
    {
      id: 3,
      name: 'Tarte aux Fraises',
      description: 'Tarte garnie de crème pâtissière et de fraises fraîches de saison.',
      price: 5.50,
      image: 'assets/images/tarte-fraises.jpg',
      category: 'Tartes'
    },
    {
      id: 4,
      name: 'Macaron Assortis',
      description: 'Assortiment de 6 macarons aux saveurs variées: vanille, chocolat, framboise, pistache.',
      price: 12.00,
      image: 'assets/images/macarons.jpg',
      category: 'Pâtisseries',
      topSales: true
    },
    {
      id: 5,
      name: 'Pain au Chocolat',
      description: 'Viennoiserie feuilletée garnie de barres de chocolat fondant.',
      price: 2.80,
      image: 'assets/images/pain-chocolat.jpg',
      category: 'Viennoiseries'
    },
    {
      id: 6,
      name: 'Millefeuille',
      description: 'Pâte feuilletée croustillante alternée avec de la crème pâtissière vanille.',
      price: 4.50,
      image: 'assets/images/millefeuille.jpg',
      category: 'Pâtisseries',
      topSales: true
    },
    {
      id: 7,
      name: 'Tarte Citron Meringuée',
      description: 'Tarte au citron acidulée surmontée de meringue légère et dorée.',
      price: 5.00,
      image: 'assets/images/tarte-citron.jpg',
      category: 'Tartes'
    },
    {
      id: 8,
      name: 'Chausson aux Pommes',
      description: 'Chausson feuilleté fourré de compote de pommes maison.',
      price: 3.20,
      image: 'assets/images/chausson-pommes.jpg',
      category: 'Viennoiseries'
    }
  ];

  private categories: string[] = [
    'Viennoiseries',
    'Pâtisseries',
    'Tartes',
    'Gâteaux',
    'Chocolats',
    'Macarons',
    'Biscuits'
  ];

  constructor() {
    this.loadPastriesFromStorage();
  }

  // Load pastries from local storage
  private loadPastriesFromStorage(): void {
    const pastriesJson = localStorage.getItem(this.PASTRIES_STORAGE_KEY);
    if (pastriesJson) {
      this.pastries = JSON.parse(pastriesJson);
    } else {
      // Initialize with default pastries
      this.pastries = [...this.defaultPastries];
      this.savePastriesToStorage();
    }
  }

  // Save pastries to local storage
  private savePastriesToStorage(): void {
    localStorage.setItem(this.PASTRIES_STORAGE_KEY, JSON.stringify(this.pastries));
  }

  getPastries(): Pastry[] {
    return this.pastries;
  }

  getPastriesByCategory(category: string): Pastry[] {
    return this.pastries.filter(p => p.category === category);
  }

  getCategories(): string[] {
    return this.categories;
  }

  getPastryById(id: number): Pastry | undefined {
    return this.pastries.find(p => p.id === id);
  }

  getTopSalesPastries(): Pastry[] {
    return this.pastries.filter(p => p.topSales === true);
  }

  setSelectedCategory(category: string | null): void {
    this.selectedCategorySubject.next(category);
  }

  getFilteredPastries(): Pastry[] {
    const selectedCategory = this.selectedCategorySubject.value;
    if (selectedCategory) {
      return this.pastries.filter(p => p.category === selectedCategory);
    }
    return this.pastries;
  }

  // Add a new pastry
  addPastry(pastry: Omit<Pastry, 'id'>): Pastry {
    const newId = this.pastries.length > 0
      ? Math.max(...this.pastries.map(p => p.id)) + 1
      : 1;
    const newPastry: Pastry = { ...pastry, id: newId };
    this.pastries.push(newPastry);
    this.savePastriesToStorage();
    return newPastry;
  }

  // Update a pastry
  updatePastry(id: number, updatedPastry: Partial<Pastry>): boolean {
    const index = this.pastries.findIndex(p => p.id === id);
    if (index !== -1) {
      this.pastries[index] = { ...this.pastries[index], ...updatedPastry };
      this.savePastriesToStorage();
      return true;
    }
    return false;
  }

  // Delete a pastry
  deletePastry(id: number): boolean {
    const index = this.pastries.findIndex(p => p.id === id);
    if (index !== -1) {
      this.pastries.splice(index, 1);
      this.savePastriesToStorage();
      return true;
    }
    return false;
  }

  // Reset to default pastries
  resetToDefaults(): void {
    this.pastries = [...this.defaultPastries];
    this.savePastriesToStorage();
  }
}
