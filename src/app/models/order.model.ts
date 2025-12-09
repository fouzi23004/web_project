import { CartItem } from './cart-item.model';

export type OrderStatus = 'pending' | 'confirmed' | 'in-preparation' | 'ready' | 'delivered' | 'denied';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: CartItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
