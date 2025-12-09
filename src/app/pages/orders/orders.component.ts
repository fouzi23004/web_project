import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../models/order.model';

@Component({
    selector: 'app-orders',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './orders.component.html',
    styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
    orders: Order[] = [];
    currentUserId: string = '';

    constructor(
        private orderService: OrderService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        const currentUser = this.authService.currentUserValue;
        if (!currentUser) {
            this.router.navigate(['/login']);
            return;
        }

        this.currentUserId = currentUser.id;
        this.loadOrders();

        // Subscribe to order updates
        this.orderService.orders$.subscribe(() => {
            this.loadOrders();
        });
    }

    loadOrders(): void {
        this.orders = this.orderService.getUserOrders(this.currentUserId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    getStatusLabel(status: string): string {
        return this.orderService.getOrderStatusLabel(status as any);
    }

    getStatusClass(status: string): string {
        return this.orderService.getOrderStatusClass(status as any);
    }

    getOrderTotal(order: Order): number {
        return order.totalPrice;
    }

    goToProducts(): void {
        this.router.navigate(['/produits']);
    }
}
