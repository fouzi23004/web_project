import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PastryService } from '../../services/pastry.service';
import { OrderService } from '../../services/order.service';
import { Pastry } from '../../models/pastry.model';
import { User } from '../../models/user.model';
import { Order, OrderStatus } from '../../models/order.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  activeTab: 'products' | 'users' | 'orders' = 'products';

  // Products
  pastries: Pastry[] = [];
  editingPastry: Pastry | null = null;
  newPastry: Partial<Pastry> = {
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    topSales: false
  };
  previewImage: string = '';

  // Users
  users: User[] = [];

  // Orders
  orders: Order[] = [];

  // Messages
  successMessage: string = '';
  errorMessage: string = '';

  categories: string[] = [];

  constructor(
    private authService: AuthService,
    private pastryService: PastryService,
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Check if user is admin
    if (!this.authService.isAdmin()) {
      alert('Accès non autorisé');
      this.router.navigate(['/']);
      return;
    }

    this.loadData();

    // Subscribe to order updates
    this.orderService.orders$.subscribe(() => {
      this.loadOrders();
    });
  }

  loadData(): void {
    this.pastries = this.pastryService.getPastries();
    this.users = this.authService.getAllUsers();
    this.categories = this.pastryService.getCategories();
    this.loadOrders();
  }

  setActiveTab(tab: 'products' | 'users' | 'orders'): void {
    this.activeTab = tab;
    this.clearMessages();
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  // ===== PRODUCTS MANAGEMENT =====

  addPastry(): void {
    this.clearMessages();

    if (!this.newPastry.name || !this.newPastry.category || !this.newPastry.price) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    const pastryToAdd = {
      name: this.newPastry.name!,
      description: this.newPastry.description || '',
      price: this.newPastry.price!,
      image: this.newPastry.image || 'assets/images/default.jpg',
      category: this.newPastry.category!,
      topSales: this.newPastry.topSales || false
    };

    this.pastryService.addPastry(pastryToAdd);
    this.successMessage = 'Produit ajouté avec succès';
    this.resetNewPastry();
    this.loadData();
  }

  editPastry(pastry: Pastry): void {
    this.editingPastry = { ...pastry };
  }

  updatePastry(): void {
    this.clearMessages();

    if (!this.editingPastry) return;

    const success = this.pastryService.updatePastry(this.editingPastry.id, this.editingPastry);

    if (success) {
      this.successMessage = 'Produit mis à jour avec succès';
      this.editingPastry = null;
      this.loadData();
    } else {
      this.errorMessage = 'Erreur lors de la mise à jour';
    }
  }

  cancelEdit(): void {
    this.editingPastry = null;
    this.clearMessages();
  }

  deletePastry(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce produit?')) {
      const success = this.pastryService.deletePastry(id);

      if (success) {
        this.successMessage = 'Produit supprimé avec succès';
        this.loadData();
      } else {
        this.errorMessage = 'Erreur lors de la suppression';
      }
    }
  }

  resetNewPastry(): void {
    this.newPastry = {
      name: '',
      description: '',
      price: 0,
      image: '',
      category: '',
      topSales: false
    };
    this.previewImage = '';
  }

  // Handle image upload for new pastry
  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Veuillez sélectionner une image valide';
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.errorMessage = 'L\'image ne doit pas dépasser 2MB';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target?.result as string;
        this.newPastry.image = base64Image;
        this.previewImage = base64Image;
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle image upload for editing pastry
  onEditImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0] && this.editingPastry) {
      const file = input.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Veuillez sélectionner une image valide';
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.errorMessage = 'L\'image ne doit pas dépasser 2MB';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target?.result as string;
        if (this.editingPastry) {
          this.editingPastry.image = base64Image;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // Remove image
  removeImage(): void {
    this.newPastry.image = '';
    this.previewImage = '';
  }

  // Remove edit image
  removeEditImage(): void {
    if (this.editingPastry) {
      this.editingPastry.image = '';
    }
  }

  // ===== USERS MANAGEMENT =====

  deleteUser(userId: string): void {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur?')) {
      const result = this.authService.deleteUser(userId);

      if (result.success) {
        this.successMessage = result.message;
        this.loadData();
      } else {
        this.errorMessage = result.message;
      }
    }
  }

  toggleAdminStatus(user: User): void {
    const result = this.authService.updateUser(user.id, { isAdmin: !user.isAdmin });

    if (result.success) {
      this.successMessage = `Statut admin ${!user.isAdmin ? 'accordé' : 'retiré'}`;
      this.loadData();
    } else {
      this.errorMessage = result.message;
    }
  }

  // ===== ORDERS MANAGEMENT =====

  loadOrders(): void {
    this.orders = this.orderService.getAllOrders()
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  updateOrderStatus(orderId: string, status: OrderStatus): void {
    this.clearMessages();
    this.orderService.updateOrderStatus(orderId, status);
    this.successMessage = `Commande mise à jour: ${this.getStatusLabel(status)}`;
    this.loadOrders();
  }

  deleteOrder(orderId: string): void {
    if (confirm('Voulez-vous vraiment supprimer cette commande?')) {
      this.orderService.deleteOrder(orderId);
      this.successMessage = 'Commande supprimée avec succès';
      this.loadOrders();
    }
  }

  getStatusLabel(status: OrderStatus): string {
    return this.orderService.getOrderStatusLabel(status);
  }

  getStatusClass(status: OrderStatus): string {
    return this.orderService.getOrderStatusClass(status);
  }
}
