import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_STORAGE_KEY = 'patisserie_users';
  private readonly CURRENT_USER_KEY = 'patisserie_current_user';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor() {
    this.initializeAdminUser();
    const currentUser = this.getCurrentUserFromStorage();
    this.currentUserSubject = new BehaviorSubject<User | null>(currentUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  // Initialize admin user if it doesn't exist
  private initializeAdminUser(): void {
    const users = this.getUsers();
    const adminExists = users.some(u => u.email === 'admin@patisserie.com');

    if (!adminExists) {
      const adminUser: User = {
        id: 'admin-001',
        email: 'admin@patisserie.com',
        password: 'admin123',
        name: 'Administrateur',
        isAdmin: true,
        createdAt: new Date()
      };
      users.push(adminUser);
      this.saveUsers(users);
    }
  }

  // Get all users from local storage
  private getUsers(): User[] {
    const usersJson = localStorage.getItem(this.USERS_STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  // Save users to local storage
  private saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_STORAGE_KEY, JSON.stringify(users));
  }

  // Get current user from storage
  private getCurrentUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  // Register a new user
  register(email: string, password: string, name: string): { success: boolean; message: string } {
    const users = this.getUsers();

    // Check if user already exists
    if (users.some(u => u.email === email)) {
      return { success: false, message: 'Un utilisateur avec cet email existe déjà' };
    }

    // Create new user
    const newUser: User = {
      id: this.generateId(),
      email,
      password, // In production, this should be hashed
      name,
      isAdmin: false,
      createdAt: new Date()
    };

    users.push(newUser);
    this.saveUsers(users);

    return { success: true, message: 'Compte créé avec succès!' };
  }

  // Login user
  login(email: string, password: string): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      // Save current user (without password for security)
      const userToStore = { ...user };
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userToStore));
      this.currentUserSubject.next(userToStore);
      return { success: true, message: 'Connexion réussie!', user: userToStore };
    }

    return { success: false, message: 'Email ou mot de passe incorrect' };
  }

  // Logout user
  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.currentUserSubject.next(null);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  // Get current user value
  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if current user is admin
  isAdmin(): boolean {
    return this.currentUserSubject.value?.isAdmin === true;
  }

  // Get all users (admin only)
  getAllUsers(): User[] {
    if (!this.isAdmin()) {
      return [];
    }
    return this.getUsers();
  }

  // Update user (admin only)
  updateUser(userId: string, updates: Partial<User>): { success: boolean; message: string } {
    if (!this.isAdmin()) {
      return { success: false, message: 'Accès non autorisé' };
    }

    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return { success: false, message: 'Utilisateur non trouvé' };
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    this.saveUsers(users);
    return { success: true, message: 'Utilisateur mis à jour' };
  }

  // Delete user (admin only)
  deleteUser(userId: string): { success: boolean; message: string } {
    if (!this.isAdmin()) {
      return { success: false, message: 'Accès non autorisé' };
    }

    // Prevent deleting admin user
    if (userId === 'admin-001') {
      return { success: false, message: 'Impossible de supprimer l\'administrateur principal' };
    }

    const users = this.getUsers();
    const filteredUsers = users.filter(u => u.id !== userId);

    if (users.length === filteredUsers.length) {
      return { success: false, message: 'Utilisateur non trouvé' };
    }

    this.saveUsers(filteredUsers);
    return { success: true, message: 'Utilisateur supprimé' };
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
