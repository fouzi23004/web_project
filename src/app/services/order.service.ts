import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order, OrderStatus } from '../models/order.model';
import { CartItem } from '../models/cart-item.model';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private ordersSubject = new BehaviorSubject<Order[]>(this.loadOrders());
    public orders$ = this.ordersSubject.asObservable();

    constructor() { }

    private loadOrders(): Order[] {
        const ordersJson = localStorage.getItem('orders');
        if (ordersJson) {
            const orders = JSON.parse(ordersJson);
            // Convert date strings back to Date objects
            return orders.map((order: any) => ({
                ...order,
                createdAt: new Date(order.createdAt),
                updatedAt: new Date(order.updatedAt)
            }));
        }
        return [];
    }

    private saveOrders(orders: Order[]): void {
        localStorage.setItem('orders', JSON.stringify(orders));
        // Reload orders to ensure dates are properly converted
        const reloadedOrders = this.loadOrders();
        this.ordersSubject.next(reloadedOrders);
    }

    createOrder(userId: string, userName: string, userEmail: string, items: CartItem[], totalPrice: number): Order {
        const orders = this.ordersSubject.value;
        const newOrder: Order = {
            id: this.generateOrderId(),
            userId,
            userName,
            userEmail,
            items,
            totalPrice,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        orders.push(newOrder);
        this.saveOrders(orders);
        return newOrder;
    }

    private generateOrderId(): string {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `ORD-${timestamp}-${random}`;
    }

    getAllOrders(): Order[] {
        return this.ordersSubject.value;
    }

    getUserOrders(userId: string): Order[] {
        return this.ordersSubject.value.filter(order => order.userId === userId);
    }

    getOrderById(orderId: string): Order | undefined {
        return this.ordersSubject.value.find(order => order.id === orderId);
    }

    updateOrderStatus(orderId: string, status: OrderStatus): void {
        const orders = this.ordersSubject.value;
        const orderIndex = orders.findIndex(order => order.id === orderId);

        if (orderIndex !== -1) {
            orders[orderIndex].status = status;
            orders[orderIndex].updatedAt = new Date();
            this.saveOrders(orders);
        }
    }

    deleteOrder(orderId: string): void {
        const orders = this.ordersSubject.value.filter(order => order.id !== orderId);
        this.saveOrders(orders);
    }

    getOrderStatusLabel(status: OrderStatus): string {
        const labels: Record<OrderStatus, string> = {
            'pending': 'En attente',
            'confirmed': 'Confirmée',
            'in-preparation': 'En préparation',
            'ready': 'Prête',
            'delivered': 'Livrée',
            'denied': 'Refusée'
        };
        return labels[status];
    }

    getOrderStatusClass(status: OrderStatus): string {
        const classes: Record<OrderStatus, string> = {
            'pending': 'status-pending',
            'confirmed': 'status-confirmed',
            'in-preparation': 'status-preparation',
            'ready': 'status-ready',
            'delivered': 'status-delivered',
            'denied': 'status-denied'
        };
        return classes[status];
    }
}
