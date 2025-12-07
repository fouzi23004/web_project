import { Pastry } from './pastry.model';

export interface CartItem {
  pastry: Pastry;
  quantity: number;
}

export interface UserCart {
  userId: string;
  items: CartItem[];
  updatedAt: Date;
}
