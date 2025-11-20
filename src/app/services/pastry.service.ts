import { Injectable } from '@angular/core';
import { Pastry } from '../models/pastry.model';

@Injectable({
  providedIn: 'root'
})
export class PastryService {
  private pastries: Pastry[] = [
    {
      id: 1,
      name: 'Croissant au Beurre',
      description: 'Croissant français traditionnel, croustillant et feuilleté, préparé avec du beurre pur.',
      price: 2.50,
      image: 'assets/images/croissant.jpg',
      category: 'Viennoiseries'
    },
    {
      id: 2,
      name: 'Éclair au Chocolat',
      description: 'Pâte à choux fourrée de crème pâtissière au chocolat et recouverte de glaçage chocolat.',
      price: 4.00,
      image: 'assets/images/eclair.jpg',
      category: 'Pâtisseries'
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
      category: 'Pâtisseries'
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
      category: 'Pâtisseries'
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

  constructor() { }

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
}
